"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft } from "@phosphor-icons/react/ssr";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Toaster, useToast } from "@/components/ui/toast";
import {
  TODAY,
  TODAY_ISO,
  formatPeso,
  getMerchantById,
  getTransactionsByMerchant,
  transactions,
  type Rail,
  type TimelineEvent,
  type Transaction,
} from "../_data/payments";
import { DetailPane } from "./detail-pane";
import { QueuePane, type RefreshState } from "./queue-pane";
import { QueueRail } from "./queue-rail";
import {
  QUEUES,
  SEARCH_INPUT_ID,
  actionTimestamp,
  applyOverride,
  canApprove,
  canRetry,
  computeVisible,
  downloadCsv,
  getQueue,
  isFlagged,
  plural,
  retrySucceeds,
  toCsv,
  type OverrideMap,
  type QueueId,
  type SortId,
  type ViewState,
} from "./queues";
import styles from "./workbench.module.css";

/** The signed-in analyst. A demo persona, not a real operator record. */
const OPERATOR = { name: "R. Villamor", role: "Payments ops" };

const INITIAL_VIEW: ViewState = {
  queueId: "review",
  rail: "all",
  query: "",
  flaggedOnly: false,
  sort: "newest",
};

/**
 * Computed once, at module scope, from the untouched dataset — so the
 * server and the first client render agree on which row is open.
 */
const INITIAL_SELECTED_ID = computeVisible(transactions, INITIAL_VIEW, {})[0]?.id ?? null;

type Confirmation = {
  title: string;
  description: string;
  confirmLabel: string;
  tone: "primary" | "danger";
  run: () => void;
};

export function Workbench() {
  // `.root` (display:contents) just gives the shell and the toast viewport
  // a shared DOM root — it adds no box.
  return (
    <div className={styles.root}>
      <Toaster>
        <WorkbenchApp />
      </Toaster>
    </div>
  );
}

function WorkbenchApp() {
  const { toast } = useToast();

  const [view, setView] = useState<ViewState>(INITIAL_VIEW);
  const [overrides, setOverrides] = useState<OverrideMap>({});
  const [selectedId, setSelectedId] = useState<string | null>(INITIAL_SELECTED_ID);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [busyIds, setBusyIds] = useState<string[]>([]);
  const [retryRejectedId, setRetryRejectedId] = useState<string | null>(null);
  const [pane, setPane] = useState<"queue" | "detail">("queue");
  const [refreshState, setRefreshState] = useState<RefreshState>("idle");
  const [refreshedAt, setRefreshedAt] = useState<string>(TODAY_ISO);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const refreshAttempts = useRef(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  /** A setTimeout that can't outlive the component. */
  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  }, []);

  // -------------------------------------------------------------------
  // Derived state — one source, recomputed from the override map
  // -------------------------------------------------------------------

  const rows = useMemo(
    () => transactions.map((t) => applyOverride(t, overrides[t.id])),
    [overrides],
  );

  const counts = useMemo(() => {
    const out = {} as Record<QueueId, number>;
    for (const q of QUEUES) out[q.id] = rows.filter((t) => q.matches(t.status)).length;
    return out;
  }, [rows]);

  const queue = getQueue(view.queueId);
  const queueSize = counts[view.queueId];
  const visibleRows = useMemo(
    () => computeVisible(rows, view, overrides),
    [rows, view, overrides],
  );

  const selected = useMemo(
    () => rows.find((t) => t.id === selectedId) ?? null,
    [rows, selectedId],
  );

  const inCurrentView = selected ? visibleRows.some((t) => t.id === selected.id) : true;
  const merchant = selected ? getMerchantById(selected.merchantId) : undefined;

  const siblings = useMemo(() => {
    if (!selected) return [];
    return getTransactionsByMerchant(selected.merchantId)
      .filter((t) => t.id !== selected.id)
      .map((t) => applyOverride(t, overrides[t.id]))
      .slice(0, 6);
  }, [selected, overrides]);

  const suggestedQueue = useMemo(
    () => QUEUES.find((q) => q.id !== view.queueId && counts[q.id] > 0) ?? null,
    [counts, view.queueId],
  );

  /**
   * The bulk bar acts on what is ticked *and* on screen. Without this, an
   * action that pushes a row out of the open queue would leave a phantom
   * in the count, and "Approve 3" would hit a row the analyst can't see.
   */
  const activeCheckedIds = useMemo(
    () => checkedIds.filter((id) => visibleRows.some((r) => r.id === id)),
    [checkedIds, visibleRows],
  );

  const byId = useCallback(
    (ids: string[]): Transaction[] =>
      ids
        .map((id) => rows.find((t) => t.id === id))
        .filter((t): t is Transaction => t !== undefined),
    [rows],
  );

  // -------------------------------------------------------------------
  // View changes
  // -------------------------------------------------------------------

  /**
   * Every filter, sort and queue change funnels through here so the
   * selection is re-pointed with the same `computeVisible` the list
   * renders from — the two can never disagree about what is on screen.
   * A selection that falls out of the new set moves to the first row,
   * except when the new set is empty, where holding the open payment is
   * better than blanking the detail pane mid-keystroke.
   */
  const applyView = useCallback(
    (patch: Partial<ViewState>) => {
      const nextView = { ...view, ...patch };
      const nextRows = computeVisible(rows, nextView, overrides);
      setView(nextView);
      setCheckedIds((prev) => prev.filter((id) => nextRows.some((r) => r.id === id)));
      if (!selectedId || !nextRows.some((r) => r.id === selectedId)) {
        setSelectedId(nextRows[0]?.id ?? selectedId ?? null);
      }
    },
    [view, rows, overrides, selectedId],
  );

  const goToQueue = useCallback(
    (id: QueueId) => {
      applyView({ queueId: id });
      setPane("queue");
      setRetryRejectedId(null);
    },
    [applyView],
  );

  const clearFilters = useCallback(() => {
    applyView({ query: "", rail: "all", flaggedOnly: false });
  }, [applyView]);

  const openPayment = useCallback((id: string) => {
    setSelectedId(id);
    setRetryRejectedId((prev) => (prev === id ? prev : null));
    setPane("detail");
  }, []);

  const toggleCheck = useCallback((id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((entry) => entry !== id) : [...prev, id],
    );
  }, []);

  const toggleAllVisible = useCallback(() => {
    setCheckedIds((prev) => {
      const allChecked = visibleRows.length > 0 && visibleRows.every((r) => prev.includes(r.id));
      if (allChecked) return prev.filter((id) => !visibleRows.some((r) => r.id === id));
      const merged = new Set(prev);
      visibleRows.forEach((r) => merged.add(r.id));
      return Array.from(merged);
    });
  }, [visibleRows]);

  // -------------------------------------------------------------------
  // Mutations
  // -------------------------------------------------------------------

  /** Events are built before the updater runs: React can call an updater
   *  twice in development, and the action clock must only advance once. */
  const applyEvents = useCallback(
    (entries: { id: string; status?: Transaction["status"]; flagged?: boolean; event?: TimelineEvent }[]) => {
      setOverrides((prev) => {
        const next = { ...prev };
        for (const entry of entries) {
          const current = next[entry.id] ?? {};
          next[entry.id] = {
            ...current,
            status: entry.status ?? current.status,
            flagged: entry.flagged ?? current.flagged,
            events: entry.event ? [...(current.events ?? []), entry.event] : current.events,
          };
        }
        return next;
      });
    },
    [],
  );

  const approveIds = useCallback(
    (ids: string[]) => {
      const eligible = byId(ids).filter((t) => canApprove(t.status));
      if (eligible.length === 0) return;
      const released = eligible.reduce((sum, t) => sum + t.net, 0);
      applyEvents(
        eligible.map((t) => ({
          id: t.id,
          status: "settled" as const,
          event: {
            label: `Manual credit approved by ${OPERATOR.name}`,
            timestamp: actionTimestamp(),
            state: "done" as const,
          },
        })),
      );
      setCheckedIds((prev) => prev.filter((id) => !eligible.some((t) => t.id === id)));
      setRetryRejectedId(null);
      toast({
        title: `Approved ${plural(eligible.length)}`,
        description: `${formatPeso(released)} released to ${
          eligible.length === 1 ? eligible[0].merchant : `${new Set(eligible.map((t) => t.merchant)).size} merchants`
        }.`,
        variant: "success",
      });
    },
    [byId, applyEvents, toast],
  );

  const refundId = useCallback(
    (id: string) => {
      const tx = byId([id])[0];
      if (!tx) return;
      applyEvents([
        {
          id,
          status: "reversed",
          event: {
            label: `Refund issued to ${tx.customer}`,
            timestamp: actionTimestamp(),
            state: "done",
          },
        },
      ]);
      setCheckedIds((prev) => prev.filter((entry) => entry !== id));
      toast({
        title: `${tx.reference} refunded`,
        description: `${formatPeso(tx.amount)} returned to the payer. The merchant's net is reversed on the next settlement.`,
        variant: "success",
      });
    },
    [byId, applyEvents, toast],
  );

  const retryIds = useCallback(
    (ids: string[]) => {
      const targets = byId(ids).filter((t) => canRetry(t.status));
      if (targets.length === 0) {
        toast({
          title: "Nothing to retry",
          description: "Only a payment the rail rejected can be resubmitted.",
          variant: "warning",
        });
        return;
      }

      setBusyIds((prev) => Array.from(new Set([...prev, ...targets.map((t) => t.id)])));
      setRetryRejectedId(null);

      later(() => {
        const accepted = targets.filter(retrySucceeds);
        const rejected = targets.filter((t) => !retrySucceeds(t));

        applyEvents([
          ...accepted.map((t) => ({
            id: t.id,
            status: "pending" as const,
            event: {
              label: `Retry accepted — clearing with ${t.rail}`,
              timestamp: actionTimestamp(),
              state: "current" as const,
            },
          })),
          ...rejected.map((t) => ({
            id: t.id,
            status: "failed" as const,
            event: {
              label: "Retry rejected by receiving institution",
              timestamp: actionTimestamp(),
              state: "failed" as const,
            },
          })),
        ]);

        setBusyIds((prev) => prev.filter((id) => !targets.some((t) => t.id === id)));
        setCheckedIds((prev) => prev.filter((id) => !targets.some((t) => t.id === id)));
        if (rejected.length > 0) setRetryRejectedId(rejected[0].id);

        if (rejected.length === 0) {
          toast({
            title: `Resubmitted ${plural(accepted.length)}`,
            description: "Now clearing. They move to Awaiting settlement.",
            variant: "success",
          });
        } else if (accepted.length === 0) {
          toast({
            title: `${plural(rejected.length)} rejected again`,
            description: "The receiving institution returned the same rejection.",
            variant: "danger",
          });
        } else {
          toast({
            title: `${accepted.length} resubmitted, ${rejected.length} rejected`,
            description: "The rejected ones stay in Failed and need a manual credit.",
            variant: "warning",
          });
        }
      }, 900);
    },
    [byId, applyEvents, later, toast],
  );

  const toggleFlag = useCallback(
    (id: string) => {
      const tx = byId([id])[0];
      if (!tx) return;
      const wasFlagged = isFlagged(overrides, id);
      applyEvents([
        {
          id,
          flagged: !wasFlagged,
          event: {
            label: wasFlagged
              ? `Compliance flag removed by ${OPERATOR.name}`
              : `Flagged for compliance review by ${OPERATOR.name}`,
            timestamp: actionTimestamp(),
            state: wasFlagged ? "done" : "warning",
          },
        },
      ]);
      toast({
        title: wasFlagged ? `Flag removed from ${tx.reference}` : `${tx.reference} flagged`,
        description: wasFlagged
          ? "It no longer shows under the Flagged filter."
          : "It now shows under the Flagged filter in every queue.",
        variant: wasFlagged ? "info" : "warning",
      });
    },
    [byId, overrides, applyEvents, toast],
  );

  const exportRows = useCallback(
    (list: Transaction[], slug: string) => {
      if (list.length === 0) {
        toast({
          title: "Nothing to export",
          description: "Select at least one payment first.",
          variant: "warning",
        });
        return;
      }
      downloadCsv(`diliman-labs-${slug}-${TODAY}.csv`, toCsv(list));
      toast({
        title: `Exported ${plural(list.length)}`,
        description: "CSV saved to your downloads. Amounts are unformatted for reconciliation.",
        variant: "success",
      });
    },
    [toast],
  );

  const copyReference = useCallback(async () => {
    if (!selected) return;
    try {
      await navigator.clipboard.writeText(selected.reference);
      toast({ title: "Reference copied", description: selected.reference, variant: "success" });
    } catch {
      // Clipboard access can be refused outright — the toast still hands
      // over the value so the analyst isn't left with nothing.
      toast({
        title: "Couldn't reach the clipboard",
        description: `Copy it by hand: ${selected.reference}`,
        variant: "warning",
      });
    }
  }, [selected, toast]);

  const refresh = useCallback(() => {
    if (refreshState === "loading") return;
    refreshAttempts.current += 1;
    const attempt = refreshAttempts.current;
    setRefreshState("loading");
    later(() => {
      // Deterministic rather than random: every third refresh fails, so the
      // error state is reachable on demand in a demo instead of by luck.
      if (attempt % 3 === 0) {
        setRefreshState("error");
        toast({
          title: "Refresh failed",
          description: "The payments service didn't answer. The last good rows are still on screen.",
          variant: "danger",
        });
        return;
      }
      setRefreshState("idle");
      setRefreshedAt(actionTimestamp());
      toast({
        title: "Queue up to date",
        description: `${plural(queueSize)} in ${queue.label}.`,
        variant: "success",
      });
    }, 700);
  }, [refreshState, later, toast, queueSize, queue.label]);

  // -------------------------------------------------------------------
  // Confirmations — consequential actions state the consequence first
  // -------------------------------------------------------------------

  const requestApprove = useCallback(
    (ids: string[]) => {
      const eligible = byId(ids).filter((t) => canApprove(t.status));
      if (eligible.length === 0) {
        toast({
          title: "Nothing to approve",
          description: "Everything selected is already settled or closed.",
          variant: "warning",
        });
        return;
      }
      const released = eligible.reduce((sum, t) => sum + t.net, 0);
      const skipped = ids.length - eligible.length;
      setConfirmation({
        title:
          eligible.length === 1
            ? `Approve ${eligible[0].reference}?`
            : `Approve ${plural(eligible.length)}?`,
        description: `This releases ${formatPeso(released)} to the merchant${
          eligible.length === 1 ? "" : "s"
        } outside the normal rail outcome.${
          skipped > 0 ? ` ${skipped} already-closed ${skipped === 1 ? "payment" : "payments"} will be left alone.` : ""
        } It is recorded against ${OPERATOR.name} and can't be undone here.`,
        confirmLabel: eligible.length === 1 ? "Approve payment" : `Approve ${plural(eligible.length)}`,
        tone: "primary",
        run: () => approveIds(eligible.map((t) => t.id)),
      });
    },
    [byId, approveIds, toast],
  );

  const requestRefund = useCallback(
    (id: string) => {
      const tx = byId([id])[0];
      if (!tx) return;
      setConfirmation({
        title: `Refund ${tx.reference}?`,
        description: `${formatPeso(tx.amount)} goes back to ${tx.customer}, and ${formatPeso(
          tx.net,
        )} is clawed back from ${tx.merchant} on the next settlement. This can't be undone here.`,
        confirmLabel: "Refund payment",
        tone: "danger",
        run: () => refundId(id),
      });
    },
    [byId, refundId],
  );

  const requestBulkRetry = useCallback(() => {
    const targets = byId(activeCheckedIds).filter((t) => canRetry(t.status));
    if (targets.length === 0) {
      toast({
        title: "Nothing to retry",
        description: "Only a payment the rail rejected can be resubmitted.",
        variant: "warning",
      });
      return;
    }
    setConfirmation({
      title: `Resubmit ${plural(targets.length)}?`,
      description: `Each one is sent back to its rail as a fresh instruction. Any that the receiving institution rejects again will stay in Failed.`,
      confirmLabel: `Resubmit ${plural(targets.length)}`,
      tone: "primary",
      run: () => retryIds(targets.map((t) => t.id)),
    });
  }, [byId, activeCheckedIds, retryIds, toast]);

  // -------------------------------------------------------------------
  // Global shortcuts
  // -------------------------------------------------------------------

  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target !== null &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      // The dialog owns the keyboard while it is open.
      if (confirmation) return;

      if (event.key === "/" && !typing) {
        event.preventDefault();
        document.getElementById(SEARCH_INPUT_ID)?.focus();
        return;
      }

      if (event.key === "Escape" && !typing) {
        // Only meaningful in the collapsed layout, where it is the keyboard
        // equivalent of the back bar. Harmless at desktop width.
        setPane("queue");
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [confirmation]);

  // -------------------------------------------------------------------

  return (
    <div className={styles.shell}>
      <header data-surface="ink" className={`bg-surface grain ${styles.topbar}`}>
        <div className={styles.topbarLeft}>
          {/* Always present, at every width: whatever state the workbench
              gets into, there is a way out of it. aria-label carries the
              full destination, since the visible label drops below 640px. */}
          <Link
            href="/dashboard"
            aria-label="Back to all dashboards"
            className="inline-flex shrink-0 items-center rounded-full text-text-secondary transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:text-text-primary"
            style={{
              gap: "var(--space-2)",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--weight-medium)",
            }}
          >
            <ArrowLeft size={16} weight="bold" aria-hidden="true" />
            <span className="hidden sm:inline">Dashboards</span>
          </Link>
          <BrandMark height={20} />
          <span aria-hidden="true" className={styles.brandRule} />
          <span className={`text-text-primary ${styles.screenName}`}>Payment Workbench</span>
        </div>

        <div className={styles.topbarRight}>
          <span className="hidden items-center md:inline-flex" style={{ gap: "var(--space-2)" }}>
            <Avatar name={OPERATOR.name} size="sm" />
            <span className="flex flex-col">
              <span
                className="text-text-primary"
                style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-bold)" }}
              >
                {OPERATOR.name}
              </span>
              <span className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
                {OPERATOR.role}
              </span>
            </span>
          </span>
          <ThemeToggle />
        </div>
      </header>

      <div className={styles.body}>
        <QueueRail active={view.queueId} counts={counts} onSelect={goToQueue} />

        <div className={styles.panes} data-view={pane}>
          <QueuePane
            queue={queue}
            rows={visibleRows}
            queueSize={queueSize}
            view={view}
            overrides={overrides}
            selectedId={selectedId}
            checkedIds={activeCheckedIds}
            busyIds={busyIds}
            refreshState={refreshState}
            refreshedAt={refreshedAt}
            suggestedQueue={suggestedQueue}
            onSelect={setSelectedId}
            onOpenDetail={openPayment}
            onToggleCheck={toggleCheck}
            onToggleAllVisible={toggleAllVisible}
            onClearSelection={() => setCheckedIds([])}
            onBulkApprove={() => requestApprove(activeCheckedIds)}
            onBulkRetry={requestBulkRetry}
            onBulkExport={() => {
              exportRows(byId(activeCheckedIds), "selection");
              setCheckedIds([]);
            }}
            onQueryChange={(value) => applyView({ query: value })}
            onRailChange={(value: Rail | "all") => applyView({ rail: value })}
            onSortChange={(value: SortId) => applyView({ sort: value })}
            onFlaggedOnlyChange={(value) => applyView({ flaggedOnly: value })}
            onClearFilters={clearFilters}
            onGoToQueue={goToQueue}
            onRefresh={refresh}
          />

          <DetailPane
            transaction={selected}
            merchant={merchant}
            siblings={siblings}
            overrides={overrides}
            queue={queue}
            inCurrentView={inCurrentView}
            busy={selected ? busyIds.includes(selected.id) : false}
            retryRejected={selected !== null && retryRejectedId === selected.id}
            firstRowId={visibleRows[0]?.id ?? null}
            onBack={() => setPane("queue")}
            onOpenPayment={openPayment}
            onApprove={() => selected && requestApprove([selected.id])}
            onRetry={() => selected && retryIds([selected.id])}
            onRefund={() => selected && requestRefund(selected.id)}
            onToggleFlag={() => selected && toggleFlag(selected.id)}
            onExport={() => selected && exportRows([selected], selected.reference.toLowerCase())}
            onCopyReference={copyReference}
            onShowMerchantPayments={() =>
              selected && applyView({ queueId: "all", query: selected.merchant, rail: "all" })
            }
            onGoToNeedsReview={() => goToQueue("review")}
          />
        </div>
      </div>

      {/* Every shortcut listed here is wired. Desktop only — the strip costs
          a row the collapsed layout can't spare, and there is no keyboard
          to advertise on a phone. */}
      <div className={styles.hintBar}>
        <span className={styles.hint}>
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd> move
        </span>
        <span className={styles.hint}>
          <Kbd>Enter</Kbd> open
        </span>
        <span className={styles.hint}>
          <Kbd>X</Kbd> select
        </span>
        <span className={styles.hint}>
          <Kbd>/</Kbd> search
        </span>
        <span className={styles.hint}>
          <Kbd>Esc</Kbd> back to the queue
        </span>
        <span style={{ marginLeft: "auto" }}>
          {plural(counts.all)} loaded · demo data
        </span>
      </div>

      {/* Rendered from the shell root, outside every data-surface scope: a
          native <dialog> still inherits from the subtree it is declared in,
          top-layer promotion or not. */}
      <AlertDialog
        open={confirmation !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmation(null);
        }}
        title={confirmation?.title ?? ""}
        description={confirmation?.description}
        actions={
          <>
            <Button variant="secondary" onClick={() => setConfirmation(null)}>
              Cancel
            </Button>
            <Button
              variant={confirmation?.tone === "danger" ? "danger" : "primary"}
              onClick={() => {
                confirmation?.run();
                setConfirmation(null);
              }}
            >
              {confirmation?.confirmLabel ?? "Confirm"}
            </Button>
          </>
        }
      />
    </div>
  );
}
