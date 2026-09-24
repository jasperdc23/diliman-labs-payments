"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Buildings,
  CheckCircle,
  Storefront,
  UsersThree,
  Warning,
} from "@phosphor-icons/react/ssr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { NativeSelect } from "@/components/ui/native-select";
import { Progress } from "@/components/ui/progress";
import { SearchBar } from "@/components/ui/search-bar";
import { StatCard } from "@/components/ui/stat-card";
import { Table, type TableColumn } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  MERCHANT_STATUS_BADGE_VARIANT,
  MERCHANT_STATUS_LABEL,
  formatCount,
  formatDate,
  formatPercent,
  formatPeso,
  getTransactionsByMerchant,
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

export function MerchantsSection() {
  const ops = useOps();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<MerchantStatus | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("volume");

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

  const columns: TableColumn<Merchant>[] = [
    {
      key: "name",
      header: "Merchant",
      sortable: true,
      render: (row) => (
        <span className="flex flex-col" style={{ gap: "var(--space-1)" }}>
          <span style={{ fontWeight: "var(--weight-semibold)" }}>{row.name}</span>
          <span className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
            {row.category}
          </span>
        </span>
      ),
    },
    {
      key: "volume",
      header: "30-day volume",
      align: "right",
      sortable: true,
      render: (row) => formatPeso(row.volume),
    },
    {
      key: "successRate",
      header: "Success rate",
      sortable: true,
      width: "12rem",
      render: (row) => (
        <span className="flex flex-col" style={{ gap: "var(--space-1)" }}>
          <span className="tabular-nums" style={{ fontSize: "var(--text-xs)" }}>
            {formatPercent(row.successRate)}
          </span>
          <Progress
            value={row.successRate}
            variant={
              row.successRate >= 98 ? "success" : row.successRate >= 96 ? "warning" : "danger"
            }
            label={`${row.name} success rate`}
          />
        </span>
      ),
    },
    {
      key: "txns",
      header: "In ledger",
      align: "right",
      sortValue: (row) => getTransactionsByMerchant(row.id).length,
      sortable: true,
      render: (row) => formatCount(getTransactionsByMerchant(row.id).length),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => (
        <Badge variant={MERCHANT_STATUS_BADGE_VARIANT[row.status]} dot>
          {MERCHANT_STATUS_LABEL[row.status]}
        </Badge>
      ),
    },
    {
      key: "joinedDate",
      header: "Onboarded",
      sortable: true,
      render: (row) => formatDate(row.joinedDate),
    },
    {
      key: "open",
      header: "",
      align: "right",
      render: (row) => (
        <button type="button" className={styles.linkButton} onClick={() => ops.openMerchant(row.id)}>
          Open
          <ArrowRight size={14} weight="bold" aria-hidden="true" />
        </button>
      ),
    },
  ];

  return (
    <SectionFrame
      eyebrow="Accounts"
      title="Merchants"
      description="Ten merchant accounts with trailing 30-day volume and success rate. Open one for its record, its share of the sample ledger and the actions available on it."
      loading={ops.loading}
      failed={ops.failed}
      onRetry={ops.refresh}
      onBack={() => ops.goTo("settings")}
      actions={
        <Button
          variant="secondary"
          size="sm"
          iconLeft={<Warning size={14} weight="regular" />}
          onClick={() => setStatus("review")}
          disabled={status === "review"}
        >
          Show accounts in review
        </Button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4" style={{ gap: "var(--space-4)" }}>
        <StatCard
          tone="accent"
          label="30-day volume"
          value={formatPeso(counts.volume)}
          caption="Across all ten accounts"
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
          value={formatCount(
            new Set(ops.rows.map((row) => row.customer)).size,
          )}
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

      <Card padded={false} className="overflow-hidden">
        <div style={{ padding: "var(--space-4)" }}>
          <Table
            columns={columns}
            rows={filtered}
            getRowKey={(row) => row.id}
            headerTone="ink"
            zebra={ops.settings.zebra}
            density={ops.settings.density}
            caption="Merchant accounts"
            emptyState={
              <EmptyState
                icon={<Storefront size={32} weight="regular" />}
                title="No merchants match"
                description={
                  status === "all"
                    ? `Nothing in the ten-account sample matches “${query.trim()}”.`
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
            }
          />
        </div>
      </Card>

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
        <button
          type="button"
          className={styles.linkButton}
          onClick={() => ops.goTo("transactions")}
        >
          Open the ledger
          <ArrowRight size={14} weight="bold" aria-hidden="true" />
        </button>
      </Card>
    </SectionFrame>
  );
}
