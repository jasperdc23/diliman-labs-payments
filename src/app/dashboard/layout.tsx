"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowClockwise,
  ArrowsLeftRight,
  Bell,
  DownloadSimple,
  Flag,
  Gauge,
  Gear,
  List as ListIcon,
  LockSimple,
  Plugs,
  Receipt,
  SignOut,
  Storefront,
  X,
} from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { logout } from "@/app/actions/auth";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, type CommandItem } from "@/components/ui/command";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Modal } from "@/components/ui/modal";
import { Toaster, useToast, type ToastOptions } from "@/components/ui/toast";
import {
  RAILS,
  STATUS_LABEL,
  TODAY,
  TODAY_ISO,
  channels as baseChannels,
  formatCount,
  formatDateTime,
  formatPeso,
  getTransactionById,
  merchants as baseMerchants,
  settlementBatches,
  transactions as baseTransactions,
  type Merchant,
  type MerchantStatus,
  type Period,
  type TimelineEvent,
  type Transaction,
} from "@/app/dashboard/_data/payments";
import {
  DEFAULT_SETTINGS,
  EMPTY_FILTERS,
  OpsProvider,
  SECTION_TITLE,
  type LedgerFilters,
  type MerchantOverride,
  type OpsApi,
  type OpsSettings,
  type Section,
  type TxnOverride,
} from "./_components/ops-context";
import { BatchDetail, TransactionDetail } from "./_components/detail-panels";
import styles from "./ops.module.css";

/* ------------------------------------------------------------------ */
/* Timestamps                                                          */
/* ------------------------------------------------------------------ */

const MANILA = "Asia/Manila";
const stampFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: MANILA,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/**
 * An ISO stamp `minutes` after the prototype's fixed "now", re-emitted
 * with the +08:00 offset rather than the host's zone — the same rule the
 * shared data module follows, so appended timeline events read exactly
 * like the authored ones on every machine.
 */
function manilaStamp(minutes: number): string {
  const parts = stampFormatter.formatToParts(
    new Date(new Date(TODAY_ISO).getTime() + minutes * 60_000),
  );
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "00";
  const hour = get("hour") === "24" ? "00" : get("hour");
  return `${get("year")}-${get("month")}-${get("day")}T${hour}:${get("minute")}:${get("second")}+08:00`;
}

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

const NAV: { key: Section; icon: typeof Gauge }[] = [
  { key: "overview", icon: Gauge },
  { key: "transactions", icon: ArrowsLeftRight },
  { key: "merchants", icon: Storefront },
  { key: "channels", icon: Plugs },
  { key: "settlements", icon: Receipt },
  { key: "settings", icon: Gear },
];

type Detail = { kind: "transaction"; id: string } | { kind: "batch"; id: string };

type Confirmation =
  | { kind: "reset" }
  | { kind: "retry"; ids: string[] }
  | { kind: "merchant-status"; id: string; next: MerchantStatus }
  | { kind: "merchant-status-bulk"; ids: string[]; next: MerchantStatus }
  | { kind: "logout" };

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // Toaster owns the stack and must sit outside everything that could be
  // surface-scoped, so the toasts inherit the page's tokens rather than an
  // ink panel's.
  return (
    <Toaster>
      <OpsShell>{children}</OpsShell>
    </Toaster>
  );
}

function OpsShell({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const onMerchantsRoute = pathname.startsWith("/dashboard/merchants");
  // The route drives the section when we're on a merchants URL; the state
  // below drives it everywhere else, so the other five sections keep
  // switching in place without a navigation on every click.
  const [section, setSection] = useState<Section>("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [settings, setSettings] = useState<OpsSettings>(DEFAULT_SETTINGS);
  const [filters, setFilters] = useState<LedgerFilters>(EMPTY_FILTERS);
  const [period, setPeriod] = useState<Period>(DEFAULT_SETTINGS.defaultPeriod);
  const [txnOverrides, setTxnOverrides] = useState<Record<string, TxnOverride>>({});
  const [merchantOverrides, setMerchantOverrides] = useState<Record<string, MerchantOverride>>({});
  const [addedMerchants, setAddedMerchants] = useState<Merchant[]>([]);
  const [disabledChannelIds, setDisabledChannelIds] = useState<string[]>(
    () => baseChannels.filter((channel) => !channel.enabled).map((channel) => channel.id),
  );
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const addedMerchantCounter = useRef(0);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((timer) => clearTimeout(timer));
  }, []);

  const notify = useCallback(
    (options: ToastOptions) => {
      if (!settings.toastsEnabled) return;
      toast(options);
    },
    [settings.toastsEnabled, toast],
  );

  /* ---------------- derived data ---------------- */

  const rows = useMemo<Transaction[]>(
    () =>
      baseTransactions.map((row) => {
        const override = txnOverrides[row.id];
        if (!override) return row;
        return {
          ...row,
          status: override.status ?? row.status,
          timeline: override.events ? [...row.timeline, ...override.events] : row.timeline,
        };
      }),
    [txnOverrides],
  );

  const merchantList = useMemo<Merchant[]>(
    () =>
      [...baseMerchants, ...addedMerchants].map((merchant) => {
        const override = merchantOverrides[merchant.id];
        if (!override) return merchant;
        return {
          ...merchant,
          status: override.status ?? merchant.status,
          name: override.name ?? merchant.name,
          category: override.category ?? merchant.category,
        };
      }),
    [merchantOverrides, addedMerchants],
  );

  const isFlagged = useCallback(
    (id: string) => Boolean(txnOverrides[id]?.flagged),
    [txnOverrides],
  );
  const flaggedCount = useMemo(
    () => Object.values(txnOverrides).filter((entry) => entry.flagged).length,
    [txnOverrides],
  );
  const mutatedCount =
    Object.keys(txnOverrides).length + Object.keys(merchantOverrides).length;

  const queueCount = useMemo(
    () =>
      rows.filter(
        (row) =>
          row.status === "failed" || row.status === "reversed" || row.status === "disputed",
      ).length,
    [rows],
  );
  const inWindowCount = settlementBatches.filter((batch) => batch.status === "in_window").length;

  const navCounts: Record<Section, string | null> = {
    overview: queueCount > 0 ? formatCount(queueCount) : null,
    transactions: formatCount(rows.length),
    merchants: formatCount(merchantList.length),
    channels: null,
    settlements: inWindowCount > 0 ? formatCount(inWindowCount) : null,
    settings: null,
  };

  /* ---------------- actions ---------------- */

  const updateSettings = useCallback((patch: Partial<OpsSettings>) => {
    setSettings((current) => ({ ...current, ...patch }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    setPeriod(DEFAULT_SETTINGS.defaultPeriod);
    notify({
      title: "Preferences reset",
      description: "Threshold, page size, density, rails and notifications are back to defaults.",
      variant: "info",
    });
  }, [notify]);

  const goTo = useCallback(
    (next: Section, patch?: Partial<LedgerFilters>) => {
      setSection(next);
      if (patch) setFilters({ ...EMPTY_FILTERS, ...patch });
      setMobileNavOpen(false);
      setDetail(null);
      if (typeof window !== "undefined") window.scrollTo(0, 0);
    },
    [],
  );

  /**
   * The other five sections switch in place under `/dashboard`. Clicking
   * one while on a `/dashboard/merchants*` route has to leave that route
   * as well as flip the section, since a plain state change never touches
   * the URL a merchant page is sitting on.
   */
  const handleNavClick = useCallback(
    (key: Section) => {
      if (onMerchantsRoute) router.push("/dashboard");
      goTo(key);
    },
    [goTo, onMerchantsRoute, router],
  );

  const refresh = useCallback(() => {
    const wasOut = settings.simulateOutage;
    if (wasOut) updateSettings({ simulateOutage: false });
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      notify({
        title: wasOut ? "Feed restored" : "Data refreshed",
        description: wasOut
          ? "The outage simulation is off. Every section is reading the sample dataset again."
          : `Sample ledger re-read at ${formatDateTime(TODAY_ISO)}.`,
        variant: "success",
      });
    }, 700);
    timers.current.push(timer);
  }, [notify, settings.simulateOutage, updateSettings]);

  const applyRetry = useCallback(
    (ids: string[]) => {
      if (ids.length === 0) return;
      setPendingIds((current) => Array.from(new Set([...current, ...ids])));
      notify({
        title: `Retry queued for ${formatCount(ids.length)} ${ids.length === 1 ? "payment" : "payments"}`,
        description: "Re-submitted on the same rail. The row updates when the rail answers.",
        variant: "info",
      });

      const timer = setTimeout(() => {
        setPendingIds((current) => current.filter((id) => !ids.includes(id)));

        const settled: string[] = [];
        const refused: string[] = [];
        ids.forEach((id) => {
          // Deterministic, not random: every third row in seed order comes
          // back refused, so the failure path is always reachable and always
          // reproducible.
          const index = baseTransactions.findIndex((row) => row.id === id);
          (index % 3 === 0 ? refused : settled).push(id);
        });

        setTxnOverrides((current) => {
          const next = { ...current };
          settled.forEach((id) => {
            const previous = next[id] ?? {};
            next[id] = {
              ...previous,
              status: "settled",
              events: [
                ...(previous.events ?? []),
                { label: "Retry submitted", timestamp: manilaStamp(0), state: "done" },
                { label: "Settled to merchant", timestamp: manilaStamp(3), state: "done" },
              ] satisfies TimelineEvent[],
            };
          });
          refused.forEach((id) => {
            const previous = next[id] ?? {};
            next[id] = {
              ...previous,
              status: "failed",
              flagged: true,
              events: [
                ...(previous.events ?? []),
                { label: "Retry submitted", timestamp: manilaStamp(0), state: "done" },
                {
                  label: "Refused again by the receiving institution",
                  timestamp: manilaStamp(2),
                  state: "failed",
                },
              ] satisfies TimelineEvent[],
            };
          });
          return next;
        });

        if (settled.length > 0) {
          notify({
            title: `${formatCount(settled.length)} settled after retry`,
            description: "The rail accepted the re-submission. The rows now read Settled.",
            variant: "success",
          });
        }
        if (refused.length > 0) {
          notify({
            title: `${formatCount(refused.length)} refused again`,
            description: "Flagged for review so they stay visible under the Flagged filter.",
            variant: "danger",
          });
        }
      }, 1400);
      timers.current.push(timer);
    },
    [notify],
  );

  const setFlag = useCallback(
    (ids: string[], flagged: boolean) => {
      if (ids.length === 0) return;
      setTxnOverrides((current) => {
        const next = { ...current };
        ids.forEach((id) => {
          next[id] = { ...(next[id] ?? {}), flagged };
        });
        return next;
      });
      notify({
        title: flagged
          ? `${formatCount(ids.length)} flagged for review`
          : `${formatCount(ids.length)} unflagged`,
        description: flagged
          ? "Find them again with the Flagged filter on the ledger."
          : "The rows no longer carry the review marker.",
        variant: flagged ? "warning" : "info",
      });
    },
    [notify],
  );

  /**
   * Builds a real CSV from the given transaction rows and triggers a
   * browser download — a Blob + a temporary `<a download>`, nothing sent
   * to a server. `label` is only used in the confirmation toast.
   */
  const exportRows = useCallback(
    (rowsToExport: Transaction[], label: string) => {
      if (rowsToExport.length === 0) return;

      const header = [
        "Reference",
        "Date",
        "Merchant",
        "Payment method",
        "Status",
        "Customer",
        "Amount (PHP)",
        "Fee (PHP)",
        "Net (PHP)",
      ];
      const escapeCell = (value: string) => {
        const needsQuoting = /[",\n]/.test(value);
        const escaped = value.replace(/"/g, '""');
        return needsQuoting ? `"${escaped}"` : escaped;
      };
      const lines = [
        header.join(","),
        ...rowsToExport.map((row) =>
          [
            row.reference,
            row.date,
            row.merchant,
            row.rail,
            STATUS_LABEL[row.status],
            row.customer,
            row.amount.toFixed(2),
            row.fee.toFixed(2),
            row.net.toFixed(2),
          ]
            .map((cell) => escapeCell(String(cell)))
            .join(","),
        ),
      ];
      const csv = lines.join("\r\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `payments-${label}-${TODAY}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      notify({
        title: `Exported ${formatCount(rowsToExport.length)} ${rowsToExport.length === 1 ? "row" : "rows"}`,
        description: `payments-${label}-${TODAY}.csv downloaded.`,
        variant: "success",
      });
    },
    [notify],
  );

  const toggleChannel = useCallback(
    (id: string, enabled: boolean) => {
      setDisabledChannelIds((current) =>
        enabled ? current.filter((entry) => entry !== id) : Array.from(new Set([...current, id])),
      );
      const channel = baseChannels.find((entry) => entry.id === id);
      notify({
        title: enabled
          ? `${channel?.name ?? "Channel"} enabled`
          : `${channel?.name ?? "Channel"} disabled`,
        description: enabled
          ? "New payments can settle through this channel again."
          : "New payments will no longer route through this channel.",
        variant: enabled ? "success" : "warning",
      });
    },
    [notify],
  );

  const applyReset = useCallback(() => {
    setTxnOverrides({});
    setMerchantOverrides({});
    setPendingIds([]);
    notify({
      title: "Prototype data reset",
      description: "Every retry, flag and merchant status is back to what the dataset authored.",
      variant: "info",
    });
  }, [notify]);

  const applyMerchantStatus = useCallback(
    (id: string, next: MerchantStatus) => {
      setMerchantOverrides((current) => ({
        ...current,
        [id]: { ...(current[id] ?? {}), status: next },
      }));
      const merchant = merchantList.find((entry) => entry.id === id);
      notify({
        title:
          next === "suspended"
            ? `${merchant?.name ?? "Merchant"} suspended`
            : `${merchant?.name ?? "Merchant"} reinstated`,
        description:
          next === "suspended"
            ? "Payouts are held. Transactions keep clearing on the rail."
            : "Payouts resume from the next settlement window.",
        variant: next === "suspended" ? "warning" : "success",
      });
    },
    [notify, merchantList],
  );

  const applyMerchantStatusBulk = useCallback(
    (ids: string[], next: MerchantStatus) => {
      if (ids.length === 0) return;
      setMerchantOverrides((current) => {
        const nextOverrides = { ...current };
        ids.forEach((id) => {
          nextOverrides[id] = { ...(nextOverrides[id] ?? {}), status: next };
        });
        return nextOverrides;
      });
      notify({
        title:
          next === "suspended"
            ? `${formatCount(ids.length)} merchants suspended`
            : `${formatCount(ids.length)} merchants reinstated`,
        description:
          next === "suspended"
            ? "Payouts are held for every selected account. Transactions keep clearing on the rail."
            : "Payouts resume for every selected account from the next settlement window.",
        variant: next === "suspended" ? "warning" : "success",
      });
    },
    [notify],
  );

  const updateMerchantDetails = useCallback(
    (id: string, patch: { name?: string; category?: string }) => {
      setMerchantOverrides((current) => ({
        ...current,
        [id]: { ...(current[id] ?? {}), ...patch },
      }));
      notify({
        title: "Merchant details updated",
        description: "The change is kept for this session only — nothing is sent to a backend.",
        variant: "success",
      });
    },
    [notify],
  );

  const addMerchant = useCallback((input: { name: string; category: string; status: MerchantStatus }) => {
    addedMerchantCounter.current += 1;
    const slug =
      input.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || "merchant";
    const id = `mer-new-${addedMerchantCounter.current}-${slug}`;
    const newMerchant: Merchant = {
      id,
      name: input.name,
      category: input.category,
      volume: 0,
      successRate: 0,
      status: input.status,
      joinedDate: TODAY,
    };
    setAddedMerchants((current) => [...current, newMerchant]);
    return id;
  }, []);

  /* ---------------- detail navigation ---------------- */

  const openTransaction = useCallback((id: string) => {
    setDetail({ kind: "transaction", id });
  }, []);

  const openMerchant = useCallback(
    (id: string) => {
      router.push(`/dashboard/merchants/${id}`);
    },
    [router],
  );

  const openBatch = useCallback((id: string) => {
    setDetail({ kind: "batch", id });
  }, []);

  const closeDetail = useCallback(() => {
    setDetail(null);
  }, []);

  /* ---------------- api ---------------- */

  const api: OpsApi = {
    rows,
    merchantList,
    isFlagged,
    flaggedCount,
    mutatedCount,
    disabledChannelIds,
    toggleChannel,
    settings,
    updateSettings,
    resetSettings,
    section,
    goTo,
    filters,
    setFilters,
    patchFilters: (patch) => setFilters((current) => ({ ...current, ...patch })),
    clearFilters: () => setFilters(EMPTY_FILTERS),
    period,
    setPeriod,
    openTransaction,
    openMerchant,
    openBatch,
    notify,
    // Retrying re-submits a real money movement, so it asks first and
    // reports afterwards rather than firing straight off a click.
    retry: (ids) => setConfirmation({ kind: "retry", ids }),
    setFlag,
    exportRows,
    requestReset: () => setConfirmation({ kind: "reset" }),
    requestMerchantStatus: (id, next) => setConfirmation({ kind: "merchant-status", id, next }),
    requestMerchantStatusBulk: (ids, next) =>
      setConfirmation({ kind: "merchant-status-bulk", ids, next }),
    updateMerchantDetails,
    addMerchant,
    loading,
    failed: settings.simulateOutage,
    refresh,
    pendingIds,
  };

  /* ---------------- command palette ---------------- */

  const commandItems: CommandItem[] = [
    ...NAV.map((item) => ({
      id: `go-${item.key}`,
      label: `Go to ${SECTION_TITLE[item.key]}`,
      group: "Sections",
      keywords: [item.key],
      onSelect: () =>
        item.key === "merchants" ? router.push("/dashboard/merchants") : handleNavClick(item.key),
    })),
    {
      id: "queue-failed",
      label: "Show failed payments",
      group: "Queues",
      keywords: ["failure", "retry", "rejected"],
      onSelect: () => {
        if (onMerchantsRoute) router.push("/dashboard");
        goTo("transactions", { status: "failed" });
      },
    },
    {
      id: "queue-review",
      label: "Show everything that needs review",
      group: "Queues",
      keywords: ["disputed", "reversed", "failed"],
      onSelect: () => {
        if (onMerchantsRoute) router.push("/dashboard");
        goTo("transactions", { needsReviewOnly: true });
      },
    },
    {
      id: "queue-flagged",
      label: `Show flagged payments (${formatCount(flaggedCount)})`,
      group: "Queues",
      keywords: ["flag", "marked"],
      onSelect: () => {
        if (onMerchantsRoute) router.push("/dashboard");
        goTo("transactions", { flaggedOnly: true });
      },
    },
    {
      id: "queue-today",
      label: "Show today only",
      group: "Queues",
      keywords: ["27 aug", "today"],
      onSelect: () => {
        if (onMerchantsRoute) router.push("/dashboard");
        goTo("transactions", { day: TODAY });
      },
    },
    ...RAILS.map((rail) => ({
      id: `rail-${rail}`,
      label: `Filter the ledger to ${rail}`,
      group: "Rails",
      keywords: ["rail", rail],
      onSelect: () => {
        if (onMerchantsRoute) router.push("/dashboard");
        goTo("transactions", { rail });
      },
    })),
    {
      id: "action-refresh",
      label: "Refresh the payments feed",
      group: "Actions",
      keywords: ["reload", "fetch"],
      onSelect: refresh,
    },
    {
      id: "action-clear",
      label: "Clear every ledger filter",
      group: "Actions",
      keywords: ["reset filters"],
      onSelect: () => {
        if (onMerchantsRoute) router.push("/dashboard");
        goTo("transactions", {});
      },
    },
    {
      id: "action-reset",
      label: "Reset prototype data",
      group: "Actions",
      keywords: ["undo", "restore"],
      onSelect: () => setConfirmation({ kind: "reset" }),
    },
    ...rows.slice(0, 8).map((row) => ({
      id: `txn-${row.id}`,
      label: `${row.reference} — ${row.merchant} · ${formatPeso(row.amount)}`,
      group: "Recent payments",
      keywords: [row.customer, row.rail, STATUS_LABEL[row.status]],
      onSelect: () => openTransaction(row.id),
    })),
  ];

  /* ---------------- detail contents ---------------- */

  const openTxn = detail?.kind === "transaction" ? getTransactionById(detail.id) : undefined;
  const liveTxn = openTxn ? rows.find((row) => row.id === openTxn.id) : undefined;
  const openBatchRecord =
    detail?.kind === "batch" ? settlementBatches.find((entry) => entry.id === detail.id) : undefined;

  const sheetTitle =
    detail?.kind === "transaction"
      ? (liveTxn?.reference ?? "Payment")
      : detail?.kind === "batch"
        ? (openBatchRecord?.reference ?? "Batch")
        : "";

  return (
    <OpsProvider value={api}>
      <div className={styles.shell}>
        {/* A light surface in light theme, the dark theme's own dark surface
            in dark theme — never a forced data-surface="ink" scope, so it
            reads as branded chrome without going near-black in both
            themes. It's still the widest fixed block on the screen, which
            is what keeps the canvas reading as a console rather than a
            bare content area. */}
        <aside className={`${styles.sidebar} grain`}>
          <div className="flex flex-col" style={{ gap: "var(--space-3)", paddingInline: "var(--space-2)" }}>
            <BrandMark height={38} />
          </div>

          <nav className="flex flex-col" style={{ gap: "var(--space-2)" }} aria-label="Console sections">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = item.key === "merchants" ? onMerchantsRoute : !onMerchantsRoute && section === item.key;
              const count = navCounts[item.key];

              if (item.key === "merchants") {
                return (
                  <Link
                    key={item.key}
                    href="/dashboard/merchants"
                    className={styles.navItem}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMobileNavOpen(false)}
                  >
                    <Icon size={18} weight={active ? "fill" : "regular"} aria-hidden="true" />
                    {SECTION_TITLE[item.key]}
                    {count && <span className={styles.navCount}>{count}</span>}
                  </Link>
                );
              }

              return (
                <button
                  key={item.key}
                  type="button"
                  className={styles.navItem}
                  aria-current={active ? "page" : undefined}
                  onClick={() => handleNavClick(item.key)}
                >
                  <Icon size={18} weight={active ? "fill" : "regular"} aria-hidden="true" />
                  {SECTION_TITLE[item.key]}
                  {count && <span className={styles.navCount}>{count}</span>}
                </button>
              );
            })}
          </nav>

          <div
            className="flex flex-col rounded-lg border border-border-subtle"
            style={{ gap: "var(--space-3)", padding: "var(--space-4)" }}
          >
            <div className="flex items-center justify-between" style={{ gap: "var(--space-2)" }}>
              <span className={styles.eyebrow}>Needs review</span>
              <Badge variant={queueCount > 0 ? "warning" : "success"}>
                {formatCount(queueCount)}
              </Badge>
            </div>
            <p className="text-text-secondary" style={{ fontSize: "var(--text-xs)", lineHeight: "var(--leading-normal)" }}>
              {queueCount === 0
                ? "Nothing is waiting on a human right now."
                : `${formatCount(queueCount)} failed, reversed or disputed payments are open.`}
            </p>
            <button
              type="button"
              className={styles.linkButton}
              onClick={() => {
                if (onMerchantsRoute) router.push("/dashboard");
                goTo("transactions", { needsReviewOnly: true });
              }}
            >
              {queueCount === 0 ? "Open the ledger" : "Work the queue"}
            </button>
          </div>

          <div className="mt-auto flex flex-col" style={{ gap: "var(--space-3)" }}>
            <p className="text-text-tertiary" style={{ fontSize: "var(--text-xs)", lineHeight: "var(--leading-normal)" }}>
              Sample data — timings shown here are illustrative, not the published BSP schedule.
            </p>
          </div>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className={styles.topbar}>
            <button
              type="button"
              className={`${styles.iconButton} lg:hidden`}
              aria-label={mobileNavOpen ? "Close console navigation" : "Open console navigation"}
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((value) => !value)}
            >
              {mobileNavOpen ? <X size={16} weight="bold" /> : <ListIcon size={16} weight="regular" />}
            </button>

            <span className="lg:hidden">
              <BrandMark height={32} />
            </span>

            <div className="hidden min-w-0 flex-col lg:flex">
              <span className={styles.eyebrow}>Diliman Labs · Payments</span>
              <h1
                className="truncate text-text-primary"
                style={{
                  fontSize: "var(--text-lg)",
                  fontWeight: "var(--weight-bold)",
                  letterSpacing: "var(--tracking-tight)",
                }}
              >
                {onMerchantsRoute ? SECTION_TITLE.merchants : SECTION_TITLE[section]}
              </h1>
            </div>

            {/* The palette renders its own dialog beside this trigger. It
                lives on the light canvas rather than inside the ink chrome
                on purpose: a <dialog> inherits the tokens of the subtree it
                is declared in, top-layer promotion or not. */}
            <div className="ml-auto hidden md:block" style={{ minWidth: "16rem" }}>
              <Command
                items={commandItems}
                triggerLabel="Jump to a section or payment"
                placeholder="Sections, queues, rails, references…"
                emptyMessage="Nothing matches"
                hotkey="k"
              />
            </div>

            <span className="ml-auto flex items-center md:ml-0" style={{ gap: "var(--space-2)" }}>
              {/* Honest, generic and verifiable-by-the-UI-itself: this says
                  the session is encrypted (true of every page on this
                  origin over HTTPS), not a compliance claim we can't yet
                  back — no "bank-grade," no naming a certification this
                  BSP-supervised product is still working toward. */}
              <span
                className="hidden items-center text-text-tertiary lg:inline-flex"
                style={{ gap: "var(--space-1)", fontSize: "var(--text-xs)" }}
              >
                <LockSimple size={14} weight="fill" aria-hidden="true" />
                Encrypted session
              </span>
              <button
                type="button"
                className={styles.iconButton}
                aria-label="Refresh the payments feed"
                onClick={refresh}
              >
                <ArrowClockwise size={16} weight="regular" />
              </button>
              <button
                type="button"
                className={styles.iconButton}
                aria-label={`Notifications — ${formatCount(queueCount)} items need review`}
                onClick={() => {
                  if (onMerchantsRoute) router.push("/dashboard");
                  goTo("transactions", { needsReviewOnly: true });
                }}
              >
                <Bell size={16} weight={queueCount > 0 ? "fill" : "regular"} />
              </button>
              <ThemeToggle />
              <DropdownMenu
                align="end"
                trigger={
                  <button
                    type="button"
                    className={styles.iconButton}
                    aria-label="Account menu"
                  >
                    <Avatar name="Jasper Caparas" size="sm" status="online" />
                  </button>
                }
                items={[
                  // Session visibility, not an action — disabled so it reads
                  // as a status line rather than a dead button.
                  { label: `Last login · ${formatDateTime(manilaStamp(-965))}`, disabled: true },
                  { type: "separator" },
                  {
                    label: "Settings",
                    icon: <Gear size={16} />,
                    onSelect: () => handleNavClick("settings"),
                  },
                  { type: "separator" },
                  {
                    label: "Log out",
                    icon: <SignOut size={16} />,
                    destructive: true,
                    // A real sign-out; it asks first rather than firing on
                    // one misclick from a menu that also holds Settings.
                    onSelect: () => setConfirmation({ kind: "logout" }),
                  },
                ]}
              />
            </span>
          </header>

          {mobileNavOpen && (
            <nav className={`${styles.mobileNav} grain`} aria-label="Console sections">
              {NAV.map((item) => {
                const Icon = item.icon;
                const active = item.key === "merchants" ? onMerchantsRoute : !onMerchantsRoute && section === item.key;
                const count = navCounts[item.key];

                if (item.key === "merchants") {
                  return (
                    <Link
                      key={item.key}
                      href="/dashboard/merchants"
                      className={styles.navItem}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setMobileNavOpen(false)}
                    >
                      <Icon size={18} weight={active ? "fill" : "regular"} aria-hidden="true" />
                      {SECTION_TITLE[item.key]}
                      {count && <span className={styles.navCount}>{count}</span>}
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.key}
                    type="button"
                    className={styles.navItem}
                    aria-current={active ? "page" : undefined}
                    onClick={() => handleNavClick(item.key)}
                  >
                    <Icon size={18} weight={active ? "fill" : "regular"} aria-hidden="true" />
                    {SECTION_TITLE[item.key]}
                    {count && <span className={styles.navCount}>{count}</span>}
                  </button>
                );
              })}
            </nav>
          )}

          <main className={styles.main}>{children}</main>
        </div>
      </div>

      {/* Overlays live at the page root, outside every surface scope. A
          native <dialog> promoted to the top layer still inherits from the
          subtree it was declared in. Merchant detail is a real page now —
          this Modal only ever shows a transaction or a settlement batch. */}
      <Modal
        open={detail !== null}
        onClose={closeDetail}
        title={sheetTitle}
        size="lg"
        description={
          detail?.kind === "transaction"
            ? `${liveTxn?.merchant ?? ""} · ${liveTxn ? formatDateTime(liveTxn.date) : ""}`
            : detail?.kind === "batch"
              ? "Settlement batch detail"
              : undefined
        }
        footer={
          detail?.kind === "transaction" && liveTxn ? (
            <>
              {liveTxn.status === "failed" && (
                <Button
                  variant="primary"
                  size="sm"
                  iconLeft={<ArrowClockwise size={14} weight="regular" />}
                  disabled={pendingIds.includes(liveTxn.id)}
                  onClick={() => setConfirmation({ kind: "retry", ids: [liveTxn.id] })}
                >
                  {pendingIds.includes(liveTxn.id) ? "Retry in flight" : "Retry payment"}
                </Button>
              )}
              <Button
                variant="secondary"
                size="sm"
                iconLeft={<Flag size={14} weight={isFlagged(liveTxn.id) ? "fill" : "regular"} />}
                onClick={() => setFlag([liveTxn.id], !isFlagged(liveTxn.id))}
              >
                {isFlagged(liveTxn.id) ? "Clear flag" : "Flag for review"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconLeft={<DownloadSimple size={14} weight="regular" />}
                onClick={() => exportRows([liveTxn], liveTxn.reference)}
              >
                Export
              </Button>
            </>
          ) : detail?.kind === "batch" ? (
            <Button variant="secondary" size="sm" onClick={closeDetail}>
              Close
            </Button>
          ) : undefined
        }
      >
        {detail?.kind === "transaction" && liveTxn && (
          <TransactionDetail
            transaction={liveTxn}
            flagged={isFlagged(liveTxn.id)}
            retrying={pendingIds.includes(liveTxn.id)}
            onOpenMerchant={openMerchant}
          />
        )}
        {detail?.kind === "batch" && openBatchRecord && (
          <BatchDetail
            batch={openBatchRecord}
            onShowRail={() => {
              if (onMerchantsRoute) router.push("/dashboard");
              goTo("transactions", { rail: openBatchRecord.rail });
            }}
          />
        )}
        {/* A detail that can't be resolved is still a screen someone is
            looking at, so it says why and offers a way out. */}
        {detail !== null && !liveTxn && !openBatchRecord && (
          <div className="flex flex-col" style={{ gap: "var(--space-4)" }}>
            <p className="text-text-secondary" style={{ fontSize: "var(--text-sm)" }}>
              That record is no longer in the loaded dataset.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                if (onMerchantsRoute) router.push("/dashboard");
                goTo("transactions");
              }}
            >
              Back to the ledger
            </Button>
          </div>
        )}
      </Modal>

      <AlertDialog
        open={confirmation !== null}
        onOpenChange={(open) => !open && setConfirmation(null)}
        title={
          confirmation?.kind === "retry"
            ? `Retry ${formatCount(confirmation.ids.length)} ${confirmation.ids.length === 1 ? "payment" : "payments"}?`
            : confirmation?.kind === "reset"
              ? "Reset every prototype change?"
              : confirmation?.kind === "merchant-status"
                ? confirmation.next === "suspended"
                  ? "Suspend this merchant's payouts?"
                  : "Reinstate this merchant's payouts?"
                : confirmation?.kind === "merchant-status-bulk"
                  ? confirmation.next === "suspended"
                    ? `Suspend ${formatCount(confirmation.ids.length)} merchants' payouts?`
                    : `Reinstate ${formatCount(confirmation.ids.length)} merchants' payouts?`
                  : confirmation?.kind === "logout"
                    ? "Log out of the console?"
                    : ""
        }
        description={
          confirmation?.kind === "retry"
            ? "This re-submits the same instruction on the same rail. A refused retry comes back flagged."
            : confirmation?.kind === "reset"
              ? `${formatCount(mutatedCount)} retried, flagged or suspended records return to the state the dataset authored. There is no undo.`
              : confirmation?.kind === "merchant-status"
                ? confirmation.next === "suspended"
                  ? "Transactions keep clearing on the rail. Nothing is paid out until the account is reinstated."
                  : "Payouts resume from the next settlement window."
                : confirmation?.kind === "merchant-status-bulk"
                  ? confirmation.next === "suspended"
                    ? "Transactions keep clearing on the rail for each account. Nothing is paid out until they're reinstated."
                    : "Payouts resume for every selected account from the next settlement window."
                  : confirmation?.kind === "logout"
                    ? "You'll need to sign back in to reach the console again."
                    : undefined
        }
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={() => setConfirmation(null)}>
              Cancel
            </Button>
            <Button
              variant={
                confirmation?.kind === "reset" ||
                confirmation?.kind === "logout" ||
                (confirmation?.kind === "merchant-status" && confirmation.next === "suspended") ||
                (confirmation?.kind === "merchant-status-bulk" && confirmation.next === "suspended")
                  ? "danger"
                  : "primary"
              }
              size="sm"
              onClick={() => {
                if (!confirmation) return;
                if (confirmation.kind === "retry") applyRetry(confirmation.ids);
                if (confirmation.kind === "reset") applyReset();
                if (confirmation.kind === "merchant-status") {
                  applyMerchantStatus(confirmation.id, confirmation.next);
                }
                if (confirmation.kind === "merchant-status-bulk") {
                  applyMerchantStatusBulk(confirmation.ids, confirmation.next);
                }
                if (confirmation.kind === "logout") {
                  void logout();
                  return;
                }
                setConfirmation(null);
              }}
            >
              {confirmation?.kind === "retry"
                ? "Retry now"
                : confirmation?.kind === "reset"
                  ? "Reset everything"
                  : confirmation?.kind === "logout"
                    ? "Log out"
                    : confirmation?.kind === "merchant-status" && confirmation.next === "suspended"
                      ? "Suspend payouts"
                      : confirmation?.kind === "merchant-status-bulk" && confirmation.next === "suspended"
                        ? "Suspend payouts"
                        : "Reinstate payouts"}
            </Button>
          </>
        }
      />
    </OpsProvider>
  );
}
