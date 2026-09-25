"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowClockwise,
  ArrowRight,
  Buildings,
  CheckCircle,
  Plus,
  Storefront,
  UsersThree,
  Warning,
  X,
} from "@phosphor-icons/react/ssr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/empty-state";
import { NativeSelect } from "@/components/ui/native-select";
import { Progress } from "@/components/ui/progress";
import { SearchBar } from "@/components/ui/search-bar";
import { StatCard } from "@/components/ui/stat-card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  MERCHANT_STATUS_BADGE_VARIANT,
  MERCHANT_STATUS_LABEL,
  formatCount,
  formatDate,
  formatPercent,
  formatPeso,
  type Merchant,
  type MerchantStatus,
} from "@/app/dashboard/_data/payments";
import { SectionFrame } from "../_components/section-frame";
import { useOps } from "../_components/ops-context";
import styles from "../ops.module.css";

type SortKey = "volume" | "successRate" | "name" | "joinedDate";

const STATUS_OPTIONS: { value: MerchantStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "onboarding", label: "Onboarding" },
  { value: "review", label: "In review" },
  { value: "suspended", label: "Suspended" },
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "volume", label: "Sort: highest volume" },
  { value: "successRate", label: "Sort: lowest success rate" },
  { value: "name", label: "Sort: name A–Z" },
  { value: "joinedDate", label: "Sort: newest onboarded" },
];

export default function MerchantsListPage() {
  const ops = useOps();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<MerchantStatus | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("volume");
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const rows = ops.merchantList.filter((merchant) => {
      if (status !== "all" && merchant.status !== status) return false;
      if (!needle) return true;
      return `${merchant.name} ${merchant.category} ${merchant.id}`.toLowerCase().includes(needle);
    });

    return [...rows].sort((a, b) => {
      switch (sortKey) {
        case "volume":
          return b.volume - a.volume;
        case "successRate":
          return a.successRate - b.successRate;
        case "joinedDate":
          return b.joinedDate.localeCompare(a.joinedDate);
        default:
          return a.name.localeCompare(b.name, "en");
      }
    });
  }, [ops.merchantList, query, status, sortKey]);

  const counts = useMemo(() => {
    const active = ops.merchantList.filter((m) => m.status === "active").length;
    const attention = ops.merchantList.filter(
      (m) => m.status === "review" || m.status === "suspended",
    ).length;
    const volume = ops.merchantList.reduce((sum, m) => sum + m.volume, 0);
    return { active, attention, volume };
  }, [ops.merchantList]);

  const filtersActive = query.trim().length > 0 || status !== "all";

  function resetFilters() {
    setQuery("");
    setStatus("all");
  }

  // Selection tracks ids only, scoped to what's currently filtered in —
  // same rule the ledger's bulk-select follows so a hidden selection can
  // never get acted on silently.
  const selectedMerchants = useMemo(
    () => filtered.filter((merchant) => selected.includes(merchant.id)),
    [filtered, selected],
  );
  const suspendable = selectedMerchants.filter((m) => m.status !== "suspended");
  const reinstatable = selectedMerchants.filter((m) => m.status === "suspended");

  function toggleSelect(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    );
  }

  return (
    <SectionFrame
      eyebrow="Accounts"
      title="Merchants"
      description="Every merchant account with trailing 30-day volume and success rate. Manage one for its record, its share of the sample ledger and the actions available on it."
      loading={ops.loading}
      failed={ops.failed}
      onRetry={ops.refresh}
      onBack={() => ops.goTo("settings")}
      actions={
        <>
          <Button
            variant="secondary"
            size="sm"
            iconLeft={<Warning size={14} weight="regular" />}
            onClick={() => setStatus("review")}
            disabled={status === "review"}
          >
            Show accounts in review
          </Button>
          <Link href="/dashboard/merchants/new">
            <Button variant="primary" size="sm" iconLeft={<Plus size={14} weight="bold" />}>
              Add merchant
            </Button>
          </Link>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4" style={{ gap: "var(--space-6)" }}>
        <StatCard
          tone="accent"
          label="30-day volume"
          value={formatPeso(counts.volume)}
          caption={`Across all ${formatCount(ops.merchantList.length)} accounts`}
          icon={<Buildings size={18} weight="fill" />}
        />
        <StatCard
          label="Merchants"
          value={formatCount(ops.merchantList.length)}
          caption={`${formatCount(counts.active)} active`}
          icon={<Storefront size={18} weight="fill" />}
        />
        <StatCard
          label="Needs attention"
          value={formatCount(counts.attention)}
          caption="In review or suspended"
          icon={<Warning size={18} weight="fill" />}
        />
        <StatCard
          label="Unique payers"
          value={formatCount(new Set(ops.rows.map((row) => row.customer)).size)}
          caption="In the 60-row sample"
          icon={<UsersThree size={18} weight="fill" />}
        />
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "var(--space-3)" }}>
          <SearchBar
            placeholder="Merchant name, category or id"
            aria-label="Search merchants"
            value={query}
            onValueChange={setQuery}
          />
          <NativeSelect
            aria-label="Sort merchants"
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value as SortKey)}
            options={SORT_OPTIONS}
          />
        </div>

        <div className={styles.chipRow}>
          <ToggleGroup
            type="single"
            value={[status]}
            onValueChange={(next) => setStatus((next[0] as MerchantStatus | "all") ?? "all")}
            aria-label="Filter merchants by status"
          >
            {STATUS_OPTIONS.map((option) => (
              <ToggleGroupItem key={option.value} value={option.value}>
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <span
            className="ml-auto text-text-tertiary"
            style={{ fontSize: "var(--text-sm)" }}
            aria-live="polite"
          >
            {formatCount(filtered.length)} of {formatCount(ops.merchantList.length)} merchants
          </span>

          {filtersActive && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Clear
            </Button>
          )}
        </div>
      </Card>

      {/* Bulk actions. Present only when there is a selection to act on —
          same pattern as the ledger's bulk-select bar in transactions.tsx. */}
      {selectedMerchants.length > 0 && (
        <Card
          flat
          className="flex-wrap items-center justify-between"
          style={{ flexDirection: "row", gap: "var(--space-3)", padding: "var(--space-4)" }}
        >
          <span className="inline-flex items-center" style={{ gap: "var(--space-3)" }}>
            <Badge variant="accent" size="md">
              {formatCount(selectedMerchants.length)} selected
            </Badge>
            <span className="text-text-secondary" style={{ fontSize: "var(--text-sm)" }}>
              {formatPeso(selectedMerchants.reduce((sum, m) => sum + m.volume, 0))} 30-day volume
            </span>
          </span>

          <span className={styles.chipRow}>
            <Button
              variant="secondary"
              size="sm"
              iconLeft={<Warning size={14} weight="regular" />}
              disabled={suspendable.length === 0}
              onClick={() => ops.requestMerchantStatusBulk(suspendable.map((m) => m.id), "suspended")}
            >
              {suspendable.length === 0
                ? "All already suspended"
                : `Suspend ${formatCount(suspendable.length)}`}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              iconLeft={<ArrowClockwise size={14} weight="regular" />}
              disabled={reinstatable.length === 0}
              onClick={() => ops.requestMerchantStatusBulk(reinstatable.map((m) => m.id), "active")}
            >
              {reinstatable.length === 0
                ? "None suspended"
                : `Reinstate ${formatCount(reinstatable.length)}`}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconLeft={<X size={14} weight="bold" />}
              onClick={() => setSelected([])}
            >
              Clear
            </Button>
          </span>
        </Card>
      )}

      {filtered.length === 0 ? (
        <Card padded={false}>
          <EmptyState
            icon={<Storefront size={32} weight="regular" />}
            title="No merchants match"
            description={
              status === "all"
                ? `Nothing in the merchant list matches “${query.trim()}”.`
                : `No ${MERCHANT_STATUS_LABEL[status as MerchantStatus].toLowerCase()} accounts${
                    query.trim() ? ` match “${query.trim()}”` : ""
                  }.`
            }
            action={{ label: "Clear merchant filters", onClick: resetFilters }}
            secondaryAction={{
              label: "Back to Overview",
              onClick: () => ops.goTo("overview"),
            }}
          />
        </Card>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
          style={{ gap: "var(--space-4)" }}
          aria-label="Merchant accounts"
        >
          {filtered.map((merchant) => (
            <MerchantCard
              key={merchant.id}
              merchant={merchant}
              selected={selected.includes(merchant.id)}
              onToggleSelect={() => toggleSelect(merchant.id)}
            />
          ))}
        </div>
      )}

      <Card
        flat
        className="flex-wrap items-center justify-between"
        style={{ flexDirection: "row", gap: "var(--space-4)" }}
      >
        <span className="flex items-center" style={{ gap: "var(--space-3)" }}>
          <CheckCircle size={20} weight="fill" className="text-accent-text" aria-hidden="true" />
          <span className="flex flex-col" style={{ gap: "var(--space-1)" }}>
            <span
              className="text-text-primary"
              style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-bold)" }}
            >
              Looking for a specific payment instead?
            </span>
            <span className="text-text-secondary" style={{ fontSize: "var(--text-sm)" }}>
              The ledger searches references, merchants, payers and rails in one field.
            </span>
          </span>
        </span>
        <button type="button" className={styles.linkButton} onClick={() => ops.goTo("transactions")}>
          Open the ledger
          <ArrowRight size={14} weight="bold" aria-hidden="true" />
        </button>
      </Card>
    </SectionFrame>
  );
}

function MerchantCard({
  merchant,
  selected,
  onToggleSelect,
}: {
  merchant: Merchant;
  selected: boolean;
  onToggleSelect: () => void;
}) {
  return (
    <Card className={styles.channelCard}>
      <div className="flex items-start justify-between" style={{ gap: "var(--space-3)" }}>
        <span className="flex items-start" style={{ gap: "var(--space-3)" }}>
          <Checkbox
            checked={selected}
            onChange={onToggleSelect}
            aria-label={`Select ${merchant.name}`}
          />
          <span className="flex flex-col">
            <span
              className="text-text-primary"
              style={{ fontWeight: "var(--weight-semibold)", fontSize: "var(--text-base)" }}
            >
              {merchant.name}
            </span>
            <span className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
              {merchant.category}
            </span>
          </span>
        </span>
        <Badge variant={MERCHANT_STATUS_BADGE_VARIANT[merchant.status]} dot>
          {MERCHANT_STATUS_LABEL[merchant.status]}
        </Badge>
      </div>

      <dl className="grid grid-cols-2" style={{ gap: "var(--space-3)" }}>
        <div className="flex flex-col" style={{ gap: "var(--space-1)" }}>
          <dt className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
            30-day volume
          </dt>
          <dd className="text-text-primary tabular-nums" style={{ fontSize: "var(--text-sm)" }}>
            {formatPeso(merchant.volume)}
          </dd>
        </div>
        <div className="flex flex-col items-end" style={{ gap: "var(--space-1)" }}>
          <dt className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
            Onboarded
          </dt>
          <dd className="text-text-primary" style={{ fontSize: "var(--text-sm)" }}>
            {formatDate(merchant.joinedDate)}
          </dd>
        </div>
      </dl>

      <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
        <div className="flex items-center justify-between">
          <span className={styles.detailTerm}>Success rate</span>
          <span className={styles.detailValue}>{formatPercent(merchant.successRate)}</span>
        </div>
        <Progress
          value={merchant.successRate}
          variant={merchant.successRate >= 98 ? "success" : merchant.successRate >= 96 ? "warning" : "danger"}
          label={`${merchant.name} success rate`}
        />
      </div>

      <div
        className="flex items-center justify-between border-t border-border-subtle"
        style={{ paddingTop: "var(--space-4)" }}
      >
        <span className="text-text-tertiary" style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)" }}>
          {merchant.id}
        </span>
        <Link href={`/dashboard/merchants/${merchant.id}`}>
          <Button variant="primary" size="sm" iconRight={<ArrowRight size={14} weight="bold" />}>
            Manage
          </Button>
        </Link>
      </div>
    </Card>
  );
}
