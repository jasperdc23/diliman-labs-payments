"use client";

import type { KeyboardEvent } from "react";
import {
  ArrowClockwise,
  ArrowsClockwise,
  CheckCircle,
  DownloadSimple,
  Flag,
  FunnelSimple,
  MagnifyingGlass,
  Tray,
} from "@phosphor-icons/react/ssr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/empty-state";
import { Alert } from "@/components/ui/alert";
import { NativeSelect } from "@/components/ui/native-select";
import { SearchBar } from "@/components/ui/search-bar";
import { Spinner } from "@/components/ui/spinner";
import { Toggle } from "@/components/ui/toggle";
import {
  STATUS_BADGE_VARIANT,
  STATUS_LABEL,
  formatPeso,
  formatTime,
  type Rail,
  type Transaction,
} from "../_data/payments";
import {
  DETAIL_PANE_ID,
  RAIL_FILTER_OPTIONS,
  SEARCH_INPUT_ID,
  SORT_OPTIONS,
  hasActiveFilters,
  isFlagged,
  isTouched,
  plural,
  rowButtonId,
  type OverrideMap,
  type QueueDef,
  type QueueId,
  type SortId,
  type ViewState,
} from "./queues";
import styles from "./workbench.module.css";

export type RefreshState = "idle" | "loading" | "error";

type QueuePaneProps = {
  queue: QueueDef;
  /** Rows after queue bucketing, filters and sort. */
  rows: Transaction[];
  /** Rows in this queue before any filter — tells an empty list which
   *  empty state it is: an emptied queue, or a filter that matched none. */
  queueSize: number;
  view: ViewState;
  overrides: OverrideMap;
  selectedId: string | null;
  checkedIds: string[];
  busyIds: string[];
  refreshState: RefreshState;
  refreshedAt: string;
  /** A queue that currently has rows, offered as the way out of an empty one. */
  suggestedQueue: QueueDef | null;
  onSelect: (id: string) => void;
  onOpenDetail: (id: string) => void;
  onToggleCheck: (id: string) => void;
  onToggleAllVisible: () => void;
  onClearSelection: () => void;
  onBulkApprove: () => void;
  onBulkRetry: () => void;
  onBulkExport: () => void;
  onQueryChange: (value: string) => void;
  onRailChange: (value: Rail | "all") => void;
  onSortChange: (value: SortId) => void;
  onFlaggedOnlyChange: (value: boolean) => void;
  onClearFilters: () => void;
  onGoToQueue: (id: QueueId) => void;
  onRefresh: () => void;
};

export function QueuePane({
  queue,
  rows,
  queueSize,
  view,
  overrides,
  selectedId,
  checkedIds,
  busyIds,
  refreshState,
  refreshedAt,
  suggestedQueue,
  onSelect,
  onOpenDetail,
  onToggleCheck,
  onToggleAllVisible,
  onClearSelection,
  onBulkApprove,
  onBulkRetry,
  onBulkExport,
  onQueryChange,
  onRailChange,
  onSortChange,
  onFlaggedOnlyChange,
  onClearFilters,
  onGoToQueue,
  onRefresh,
}: QueuePaneProps) {
  const allVisibleChecked = rows.length > 0 && rows.every((r) => checkedIds.includes(r.id));
  const someVisibleChecked = rows.some((r) => checkedIds.includes(r.id));
  const filtersActive = hasActiveFilters(view);

  /**
   * Arrow keys move the selection *and* the focus together, so the pane
   * the analyst is reading and the row the browser thinks is focused never
   * drift apart. `x` toggles the checkbox instead of Space, because Space
   * already activates a focused button and stealing it would break the
   * row's own primary action.
   */
  function handleListKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (rows.length === 0) return;
    const currentIndex = rows.findIndex((r) => r.id === selectedId);

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      const base = currentIndex === -1 ? (step === 1 ? -1 : rows.length) : currentIndex;
      const nextIndex = Math.min(rows.length - 1, Math.max(0, base + step));
      const next = rows[nextIndex];
      if (!next) return;
      onSelect(next.id);
      document.getElementById(rowButtonId(next.id))?.focus();
      return;
    }

    // Enter is "act on this one": it opens the payment and hands focus to
    // the detail pane, so the next Tab lands on Approve rather than back
    // at the top of the list.
    if (event.key === "Enter" && currentIndex >= 0) {
      event.preventDefault();
      onOpenDetail(rows[currentIndex].id);
      document.getElementById(DETAIL_PANE_ID)?.focus();
      return;
    }

    if ((event.key === "x" || event.key === "X") && currentIndex >= 0) {
      event.preventDefault();
      onToggleCheck(rows[currentIndex].id);
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const target = event.key === "Home" ? rows[0] : rows[rows.length - 1];
      onSelect(target.id);
      document.getElementById(rowButtonId(target.id))?.focus();
    }
  }

  return (
    <section className={styles.queuePane} aria-label={`${queue.label} queue`}>
      {/* Header stays on the light canvas — the ink chrome is the topbar and
          the rail, and a third black band here would flatten the frame. The
          count is the yellow fill instead, which needs its ink edge. */}
      <header className={styles.paneHeader}>
        <div
          className="flex flex-wrap items-center justify-between"
          style={{ gap: "var(--space-3)" }}
        >
          <div className="flex items-center" style={{ gap: "var(--space-3)" }}>
            <h1
              className="text-text-primary"
              style={{
                fontSize: "var(--text-xl)",
                fontWeight: "var(--weight-black)",
                letterSpacing: "var(--tracking-tight)",
              }}
            >
              {queue.label}
            </h1>
            <span
              className="tabular-nums"
              style={{
                padding: "0 var(--space-2)",
                borderRadius: "var(--radius-full)",
                background: "var(--accent)",
                color: "var(--text-on-accent)",
                border: "var(--rule-hairline) solid var(--accent-edge)",
                fontSize: "var(--text-xs)",
                fontWeight: "var(--weight-black)",
              }}
            >
              {rows.length}
              {rows.length !== queueSize ? ` of ${queueSize}` : ""}
              <span className={styles.srOnly}>
                {` ${plural(rows.length)} shown`}
              </span>
            </span>
          </div>

          <div className="flex items-center" style={{ gap: "var(--space-2)" }}>
            <span className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
              Updated {formatTime(refreshedAt)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              aria-label="Refresh queue"
              loading={refreshState === "loading"}
              onClick={onRefresh}
              iconLeft={<ArrowsClockwise size={16} weight="regular" aria-hidden="true" />}
            />
          </div>
        </div>
        <p
          className="text-text-secondary"
          style={{
            marginTop: "var(--space-2)",
            fontSize: "var(--text-sm)",
            lineHeight: "var(--leading-normal)",
          }}
        >
          {queue.hint}
        </p>
      </header>

      {/* Toolbar — every control here changes the list below it. */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarSearch}>
          <SearchBar
            id={SEARCH_INPUT_ID}
            value={view.query}
            onValueChange={onQueryChange}
            placeholder="Reference, merchant, payer"
            aria-label="Search this queue"
          />
        </div>
        <div className={styles.toolbarSelect}>
          <NativeSelect
            aria-label="Filter by rail"
            value={view.rail}
            onChange={(event) => onRailChange(event.target.value as Rail | "all")}
            options={RAIL_FILTER_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          />
        </div>
        <div className={styles.toolbarSelect}>
          <NativeSelect
            aria-label="Sort payments"
            value={view.sort}
            onChange={(event) => onSortChange(event.target.value as SortId)}
            options={SORT_OPTIONS}
          />
        </div>
        <Toggle
          size="sm"
          pressed={view.flaggedOnly}
          onPressedChange={onFlaggedOnlyChange}
          aria-label="Show flagged payments only"
          iconLeft={
            <Flag size={14} weight={view.flaggedOnly ? "fill" : "regular"} aria-hidden="true" />
          }
        >
          Flagged
        </Toggle>
        {filtersActive ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            iconLeft={<FunnelSimple size={14} weight="regular" aria-hidden="true" />}
          >
            Clear
          </Button>
        ) : null}
      </div>

      {/* One bar, two states. Empty selection: a quiet select-all row on the
          light canvas. Something selected: the same bar flips to the ink
          surface and grows the actions, so the mode change is impossible to
          miss and the yellow primary lands where yellow is loudest. */}
      {rows.length > 0 ? (
        <div
          data-surface={checkedIds.length > 0 ? "ink" : undefined}
          className={
            checkedIds.length > 0
              ? `bg-surface grain ${styles.selectionBar}`
              : styles.selectionBar
          }
          role="group"
          aria-label="Selection and bulk actions"
        >
          <Checkbox
            checked={allVisibleChecked}
            indeterminate={!allVisibleChecked && someVisibleChecked}
            onChange={onToggleAllVisible}
            aria-label={
              allVisibleChecked ? "Clear selection" : `Select all ${plural(rows.length)} shown`
            }
          />
          <span
            className={checkedIds.length > 0 ? "text-text-primary" : "text-text-secondary"}
            style={{
              fontSize: "var(--text-xs)",
              fontWeight:
                checkedIds.length > 0 ? "var(--weight-bold)" : "var(--weight-regular)",
            }}
          >
            {checkedIds.length > 0
              ? `${plural(checkedIds.length)} selected`
              : "Select payments to act on several at once"}
          </span>

          {checkedIds.length > 0 ? (
            <div
              className="flex flex-wrap items-center"
              style={{ gap: "var(--space-2)", marginLeft: "auto" }}
            >
              <Button
                size="sm"
                onClick={onBulkApprove}
                iconLeft={<CheckCircle size={14} weight="fill" aria-hidden="true" />}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={onBulkRetry}
                iconLeft={<ArrowClockwise size={14} weight="regular" aria-hidden="true" />}
              >
                Retry
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={onBulkExport}
                iconLeft={<DownloadSimple size={14} weight="regular" aria-hidden="true" />}
              >
                Export
              </Button>
              <Button size="sm" variant="ghost" onClick={onClearSelection}>
                Clear
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className={styles.scroll}>
        {refreshState === "error" ? (
          <div
            className="flex flex-col"
            style={{ gap: "var(--space-3)", padding: "var(--space-4)" }}
          >
            <Alert
              variant="danger"
              title="Couldn't refresh the queue"
              description="The payments service didn't answer. The rows below are the last set that loaded successfully, so nothing is lost."
            />
            <div>
              <Button
                size="sm"
                variant="secondary"
                onClick={onRefresh}
                iconLeft={<ArrowsClockwise size={14} weight="regular" aria-hidden="true" />}
              >
                Try again
              </Button>
            </div>
          </div>
        ) : null}

        {rows.length === 0 ? (
          queueSize === 0 ? (
            // The queue itself is empty — usually because the analyst just
            // cleared it, which is a good outcome and still needs a way on.
            <EmptyState
              icon={<Tray size={32} weight="regular" />}
              title={`${queue.label} is clear`}
              description={
                suggestedQueue
                  ? `Nothing is waiting here. ${suggestedQueue.label} still has work in it.`
                  : "Nothing is waiting here."
              }
              action={
                suggestedQueue
                  ? {
                      label: `Go to ${suggestedQueue.label}`,
                      onClick: () => onGoToQueue(suggestedQueue.id),
                    }
                  : { label: "Show all payments", onClick: () => onGoToQueue("all") }
              }
              secondaryAction={
                suggestedQueue
                  ? { label: "Show all payments", onClick: () => onGoToQueue("all") }
                  : undefined
              }
            />
          ) : (
            // Filtered to zero — the queue has rows, the filters hid them.
            <EmptyState
              icon={<MagnifyingGlass size={32} weight="regular" />}
              title="No payments match these filters"
              description={`${queue.label} holds ${plural(queueSize)}, but none of them match what you've narrowed to.`}
              action={{ label: "Clear filters", onClick: onClearFilters }}
              secondaryAction={{
                label: "Show all payments",
                onClick: () => onGoToQueue("all"),
              }}
            />
          )
        ) : (
          <ul
            className={styles.rowList}
            aria-label={`Payments in ${queue.label}`}
            onKeyDown={handleListKeyDown}
          >
            {rows.map((tx) => {
              const isSelected = tx.id === selectedId;
              const isChecked = checkedIds.includes(tx.id);
              const busy = busyIds.includes(tx.id);
              const flagged = isFlagged(overrides, tx.id);
              const touched = isTouched(overrides, tx.id);
              return (
                <li key={tx.id} className={styles.row} data-selected={isSelected}>
                  <span className={styles.rowRule} aria-hidden="true" />
                  <Checkbox
                    checked={isChecked}
                    onChange={() => onToggleCheck(tx.id)}
                    aria-label={`Select ${tx.reference}`}
                  />
                  <button
                    type="button"
                    id={rowButtonId(tx.id)}
                    className={styles.rowButton}
                    aria-current={isSelected ? "true" : undefined}
                    onClick={() => onOpenDetail(tx.id)}
                  >
                    <span className={styles.rowTop}>
                      <span className={styles.rowRef}>{tx.reference}</span>
                      <span className={styles.rowAmount}>{formatPeso(tx.amount)}</span>
                    </span>
                    <span className={styles.rowMeta}>
                      <span className={styles.rowMerchant}>{tx.merchant}</span>
                      <span aria-hidden="true">·</span>
                      <span>{tx.rail}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{formatTime(tx.date)}</span>
                    </span>
                    <span className={styles.rowBottom}>
                      <Badge variant={STATUS_BADGE_VARIANT[tx.status]} size="sm">
                        {STATUS_LABEL[tx.status]}
                      </Badge>
                      {flagged ? (
                        <span className={styles.flagChip}>
                          <Flag size={10} weight="fill" aria-hidden="true" />
                          Flagged
                        </span>
                      ) : null}
                      {busy ? (
                        <span className={styles.rowBusy}>
                          <Spinner size={12} label={`Retrying ${tx.reference}`} />
                          Retrying…
                        </span>
                      ) : null}
                      {!busy && touched ? (
                        <span
                          className="text-text-tertiary"
                          style={{ fontSize: "var(--text-xs)" }}
                        >
                          Edited
                        </span>
                      ) : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
