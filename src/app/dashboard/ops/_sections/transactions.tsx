"use client";

import { useMemo, useState } from "react";
import {
  ArrowClockwise,
  DownloadSimple,
  Flag,
  FunnelSimple,
  MagnifyingGlass,
  Rows,
  X,
} from "@phosphor-icons/react/ssr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar, type ActiveFilter } from "@/components/ui/filters";
import { NativeSelect } from "@/components/ui/native-select";
import { Pagination } from "@/components/ui/pagination";
import { SearchBar } from "@/components/ui/search-bar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  RAILS,
  STATUS_LABEL,
  TODAY,
  TRANSACTION_STATUSES,
  filterTransactions,
  formatCount,
  formatDate,
  formatPercent,
  formatPeso,
  getTotals,
  transactionDays,
  type Rail,
  type TransactionStatus,
} from "@/app/dashboard/_data/payments";
import { LedgerTable, sortTransactions, type LedgerSort } from "../_components/ledger-table";
import { SectionFrame } from "../_components/section-frame";
import { EMPTY_FILTERS, useOps } from "../_components/ops-context";
import styles from "../ops.module.css";

const REVIEW_STATUSES: TransactionStatus[] = ["failed", "reversed", "disputed"];

export function TransactionsSection() {
  const ops = useOps();
  const { filters } = ops;

  const [sort, setSort] = useState<LedgerSort>({ key: "date", direction: "desc" });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let rows = filterTransactions(ops.rows, {
      rail: filters.rail,
      status: filters.status,
      query: filters.query,
      day: filters.day,
    });
    if (filters.flaggedOnly) rows = rows.filter((row) => ops.isFlagged(row.id));
    if (filters.needsReviewOnly) rows = rows.filter((row) => REVIEW_STATUSES.includes(row.status));
    return rows;
  }, [ops, filters]);

  const sorted = useMemo(() => sortTransactions(filtered, sort), [filtered, sort]);

  const pageSize = ops.settings.pageSize;
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  // Any change to the result set puts the reader back on page 1 — paging
  // to page 4 of a 40-row set and then filtering to 6 rows otherwise
  // leaves an empty table that looks like a bug. Adjusted during render
  // (rather than in an effect) by comparing against the previous render's
  // inputs, per https://react.dev/learn/you-might-not-need-an-effect.
  const [pageResetKey, setPageResetKey] = useState({ filters, pageSize, sort });
  if (pageResetKey.filters !== filters || pageResetKey.pageSize !== pageSize || pageResetKey.sort !== sort) {
    setPageResetKey({ filters, pageSize, sort });
    setPage(1);
  }

  // Selection is scoped to what is actually on screen. Keeping a hidden
  // selection alive across a filter change means "Retry 12 selected"
  // silently touches rows the operator can't see.
  const [selectionResetFilters, setSelectionResetFilters] = useState(filters);
  if (selectionResetFilters !== filters) {
    setSelectionResetFilters(filters);
    setSelected([]);
  }

  const totals = useMemo(() => getTotals(filtered), [filtered]);
  const selectedRows = useMemo(
    () => filtered.filter((row) => selected.includes(row.id)),
    [filtered, selected],
  );
  const selectedRetryable = selectedRows.filter((row) => row.status === "failed");
  const allSelectedFlagged =
    selectedRows.length > 0 && selectedRows.every((row) => ops.isFlagged(row.id));

  const chips: ActiveFilter[] = [];
  if (filters.query) chips.push({ id: "query", label: "Search", value: filters.query });
  if (filters.rail !== "all") chips.push({ id: "rail", label: "Rail", value: filters.rail });
  if (filters.status !== "all")
    chips.push({ id: "status", label: "Status", value: STATUS_LABEL[filters.status] });
  if (filters.day !== "all") chips.push({ id: "day", label: "Day", value: formatDate(filters.day) });
  if (filters.flaggedOnly) chips.push({ id: "flaggedOnly", label: "Flagged only" });
  if (filters.needsReviewOnly) chips.push({ id: "needsReviewOnly", label: "Needs review only" });

  function removeChip(id: string) {
    switch (id) {
      case "query":
        return ops.patchFilters({ query: "" });
      case "rail":
        return ops.patchFilters({ rail: "all" });
      case "status":
        return ops.patchFilters({ status: "all" });
      case "day":
        return ops.patchFilters({ day: "all" });
      case "flaggedOnly":
        return ops.patchFilters({ flaggedOnly: false });
      case "needsReviewOnly":
        return ops.patchFilters({ needsReviewOnly: false });
      default:
        return undefined;
    }
  }

  function toggleSelect(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    );
  }

  function toggleAllOnPage() {
    const ids = pageRows.map((row) => row.id);
    const everySelected = ids.length > 0 && ids.every((id) => selected.includes(id));
    setSelected((current) =>
      everySelected
        ? current.filter((id) => !ids.includes(id))
        : Array.from(new Set([...current, ...ids])),
    );
  }

  const filtersActive = chips.length > 0;

  return (
    <SectionFrame
      eyebrow="Ledger"
      title="Transactions"
      description="All 60 payments in the sample, 21–27 Aug 2026. Sort, filter, page and open any row for its full status timeline."
      loading={ops.loading}
      failed={ops.failed}
      onRetry={ops.refresh}
      onBack={() => ops.goTo("settings")}
      actions={
        <>
          <Button
            variant="secondary"
            size="sm"
            iconLeft={<DownloadSimple size={14} weight="regular" />}
            onClick={() => ops.exportRows(filtered.length, "the filtered ledger")}
            disabled={filtered.length === 0}
          >
            Export {formatCount(filtered.length)}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconLeft={<ArrowClockwise size={14} weight="regular" />}
            onClick={ops.refresh}
          >
            Refresh
          </Button>
        </>
      }
    >
      {/* Filter controls */}
      <Card>
        <div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4"
          style={{ gap: "var(--space-3)" }}
        >
          <SearchBar
            placeholder="Reference, merchant, payer or rail"
            aria-label="Search the ledger"
            value={filters.query}
            onValueChange={(value) => ops.patchFilters({ query: value })}
          />
          <NativeSelect
            aria-label="Filter by status"
            value={filters.status}
            onChange={(event) =>
              ops.patchFilters({ status: event.target.value as TransactionStatus | "all" })
            }
            options={[
              { value: "all", label: "Every status" },
              ...TRANSACTION_STATUSES.map((status) => ({
                value: status,
                label: STATUS_LABEL[status],
              })),
            ]}
          />
          <NativeSelect
            aria-label="Filter by rail"
            value={filters.rail}
            onChange={(event) => ops.patchFilters({ rail: event.target.value as Rail | "all" })}
            options={[
              { value: "all", label: "Every rail" },
              ...RAILS.map((rail) => ({ value: rail, label: rail })),
            ]}
          />
          <NativeSelect
            aria-label="Filter by day"
            value={filters.day}
            onChange={(event) => ops.patchFilters({ day: event.target.value })}
            options={[
              { value: "all", label: "Every day" },
              ...transactionDays.map((day) => ({
                value: day,
                label: day === TODAY ? `${formatDate(day)} (today)` : formatDate(day),
              })),
            ]}
          />
        </div>

        <div className={styles.chipRow}>
          <span className={styles.eyebrow} style={{ marginRight: "var(--space-1)" }}>
            <FunnelSimple size={13} weight="bold" aria-hidden="true" /> Quick
          </span>
          <QuickChip
            label="Today"
            active={filters.day === TODAY}
            onClick={() => ops.patchFilters({ day: filters.day === TODAY ? "all" : TODAY })}
          />
          <QuickChip
            label="Failed"
            active={filters.status === "failed"}
            onClick={() =>
              ops.patchFilters({ status: filters.status === "failed" ? "all" : "failed" })
            }
          />
          <QuickChip
            label="Needs review"
            active={filters.needsReviewOnly}
            onClick={() => ops.patchFilters({ needsReviewOnly: !filters.needsReviewOnly })}
          />
          <QuickChip
            label={`Flagged (${formatCount(ops.flaggedCount)})`}
            active={filters.flaggedOnly}
            onClick={() => ops.patchFilters({ flaggedOnly: !filters.flaggedOnly })}
          />

          <span className="ml-auto inline-flex items-center" style={{ gap: "var(--space-2)" }}>
            <Rows size={14} weight="regular" aria-hidden="true" className="text-text-tertiary" />
            <ToggleGroup
              type="single"
              value={[ops.settings.density]}
              onValueChange={(next) =>
                ops.updateSettings({
                  density: (next[0] as "compact" | "comfortable") ?? "comfortable",
                })
              }
              aria-label="Row density"
            >
              <ToggleGroupItem value="comfortable">Comfortable</ToggleGroupItem>
              <ToggleGroupItem value="compact">Compact</ToggleGroupItem>
            </ToggleGroup>
          </span>
        </div>

        <FilterBar
          filters={chips}
          onRemove={removeChip}
          onClearAll={filtersActive ? ops.clearFilters : undefined}
          resultCount={`${formatCount(filtered.length)} of ${formatCount(ops.rows.length)} payments`}
        />
      </Card>

      {/* The screen's one full-bleed yellow block. It carries the figures
          that actually move when a filter changes, so the brightest thing
          on the page is also the most live. */}
      <div className={styles.accentFrame}>
      <div data-surface="accent" className={`${styles.accentBand} grain`}>
        <div className={styles.bandFigure}>
          <span className={styles.eyebrow}>Gross volume</span>
          <span className={styles.bandValue}>{formatPeso(totals.volume)}</span>
        </div>
        <div className={styles.bandFigure}>
          <span className={styles.eyebrow}>Net to merchants</span>
          <span className={styles.bandValue}>{formatPeso(totals.net)}</span>
        </div>
        <div className={styles.bandFigure}>
          <span className={styles.eyebrow}>Fees retained</span>
          <span className={styles.bandValue}>{formatPeso(totals.fees)}</span>
        </div>
        <div className={styles.bandFigure}>
          <span className={styles.eyebrow}>Success rate</span>
          <span className={styles.bandValue}>{formatPercent(totals.successRate)}</span>
        </div>
        <div className={styles.bandFigure}>
          <span className={styles.eyebrow}>Failed</span>
          <span className={styles.bandValue}>{formatCount(totals.failed)}</span>
        </div>
      </div>
      </div>

      {/* Bulk actions. Present only when there is a selection to act on. */}
      {selectedRows.length > 0 && (
        <Card
          flat
          className="flex-wrap items-center justify-between"
          style={{ flexDirection: "row", gap: "var(--space-3)", padding: "var(--space-4)" }}
        >
          <span className="inline-flex items-center" style={{ gap: "var(--space-3)" }}>
            <Badge variant="accent" size="md">
              {formatCount(selectedRows.length)} selected
            </Badge>
            <span className="text-text-secondary" style={{ fontSize: "var(--text-sm)" }}>
              {formatPeso(getTotals(selectedRows).volume)} gross
            </span>
          </span>

          <span className={styles.chipRow}>
            <Button
              variant="secondary"
              size="sm"
              iconLeft={<ArrowClockwise size={14} weight="regular" />}
              disabled={selectedRetryable.length === 0}
              onClick={() => ops.retry(selectedRetryable.map((row) => row.id))}
            >
              {selectedRetryable.length === 0
                ? "Nothing retryable"
                : `Retry ${formatCount(selectedRetryable.length)} failed`}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              iconLeft={<Flag size={14} weight={allSelectedFlagged ? "fill" : "regular"} />}
              onClick={() =>
                ops.setFlag(
                  selectedRows.map((row) => row.id),
                  !allSelectedFlagged,
                )
              }
            >
              {allSelectedFlagged ? "Clear flags" : "Flag for review"}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              iconLeft={<DownloadSimple size={14} weight="regular" />}
              onClick={() => ops.exportRows(selectedRows.length, "the selected rows")}
            >
              Export
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

      <LedgerTable
        caption="All payments in the sample ledger"
        rows={pageRows}
        density={ops.settings.density}
        zebra={ops.settings.zebra}
        sort={sort}
        onSortChange={setSort}
        onOpen={ops.openTransaction}
        isFlagged={ops.isFlagged}
        pendingIds={ops.pendingIds}
        selectedIds={selected}
        onToggleSelect={toggleSelect}
        onToggleAll={toggleAllOnPage}
        emptyState={
          // Filtered to zero is the state most likely to trap someone, so
          // it gets the most explicit way out.
          <EmptyState
            icon={<MagnifyingGlass size={32} weight="regular" />}
            title={
              filtersActive
                ? "No payments match these filters"
                : "The ledger is empty"
            }
            description={
              filtersActive
                ? `Nothing in the 60-row sample matches ${chips.map((chip) => chip.value ?? chip.label).join(" + ")}.`
                : "No payments are loaded. Refresh the feed to pull the sample ledger again."
            }
            action={
              filtersActive
                ? { label: "Clear all filters", onClick: ops.clearFilters }
                : { label: "Refresh the feed", onClick: ops.refresh }
            }
            secondaryAction={
              filtersActive
                ? {
                    label: "Show failed only",
                    onClick: () => ops.setFilters({ ...EMPTY_FILTERS, status: "failed" }),
                  }
                : { label: "Back to Overview", onClick: () => ops.goTo("overview") }
            }
          />
        }
      />

      <div
        className="flex flex-wrap items-center justify-between"
        style={{ gap: "var(--space-3)" }}
      >
        <p className="text-text-tertiary" style={{ fontSize: "var(--text-sm)" }}>
          {sorted.length === 0
            ? "No rows to page through"
            : `Showing ${formatCount((safePage - 1) * pageSize + 1)}–${formatCount(
                Math.min(safePage * pageSize, sorted.length),
              )} of ${formatCount(sorted.length)} · ${formatCount(pageSize)} per page`}
        </p>
        <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </SectionFrame>
  );
}

function QuickChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="inline-flex items-center"
      style={{
        gap: "var(--space-2)",
        borderRadius: "var(--radius-full)",
        padding: "var(--space-1) var(--space-3)",
        fontSize: "var(--text-xs)",
        fontWeight: "var(--weight-bold)",
        letterSpacing: "var(--tracking-caps)",
        textTransform: "uppercase",
        cursor: "pointer",
        // A filled yellow chip is the one control that earns a solid
        // accent here, and it writes its ink edge because it sits on a
        // light card.
        background: active ? "var(--accent)" : "var(--surface-sunken)",
        color: active ? "var(--text-on-accent)" : "var(--text-secondary)",
        border: `var(--rule-hairline) solid ${active ? "var(--accent-edge)" : "var(--border-subtle)"}`,
        transition: "background-color var(--duration-fast) var(--ease-standard)",
      }}
    >
      {label}
    </button>
  );
}
