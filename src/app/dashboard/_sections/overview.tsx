"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarBlank,
  ChartLineUp,
  CheckCircle,
  Coins,
  Receipt,
  Warning,
} from "@phosphor-icons/react/ssr";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { EmptyState } from "@/components/ui/empty-state";
import { SegmentedControl } from "@/components/ui/filters";
import { LineChart } from "@/components/ui/line-chart";
import { List, ListRow } from "@/components/ui/list-row";
import { Popover } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Sparkline } from "@/components/ui/sparkline";
import { StatCard } from "@/components/ui/stat-card";
import { Tabs } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  PERIOD_OPTIONS,
  RAILS,
  STATUS_BADGE_VARIANT,
  STATUS_LABEL,
  TODAY,
  TODAY_ISO,
  formatCount,
  formatDate,
  formatDateTime,
  formatPercent,
  formatPeso,
  formatPesoCompact,
  formatTime,
  getCustomRangeData,
  maskReference,
  getPeriodData,
  getPeriodTotalSeries,
  transactionDays,
  type Period,
  type Rail,
} from "@/app/dashboard/_data/payments";
import { LedgerTable, sortTransactions, type LedgerSort } from "../_components/ledger-table";
import { SectionFrame } from "../_components/section-frame";
import { useOps } from "../_components/ops-context";
import styles from "../ops.module.css";

type ChartMode = "rails" | "total";

/** `YYYY-MM-DD` -> a local `Date` at midnight, for the DatePicker's own calendar math. */
function dayToDate(day: string): Date {
  const [year, month, date] = day.split("-").map(Number);
  return new Date(year, month - 1, date);
}

/** The inverse of `dayToDate`. */
function dateToDay(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function OverviewSection() {
  const ops = useOps();
  const [chartMode, setChartMode] = useState<ChartMode>("rails");
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [recentSort, setRecentSort] = useState<LedgerSort>({ key: "date", direction: "desc" });

  const period = ops.period;

  // The dataset's own span (`transactionDays`, newest first) bounds the
  // custom picker — this prototype has no "real" current date to reach for,
  // so the pickable range is whatever the sample actually covers.
  const datasetMaxDay = transactionDays[0];
  const datasetMinDay = transactionDays[transactionDays.length - 1];

  const [customRange, setCustomRange] = useState<{ from: string; to: string } | null>(null);
  const [draftFrom, setDraftFrom] = useState<Date | null>(null);
  const [draftTo, setDraftTo] = useState<Date | null>(null);
  // Bumped on every apply/clear so the Popover — which only closes itself on
  // outside click or Escape — remounts closed instead of staying open.
  const [rangeKey, setRangeKey] = useState(0);

  const data = useMemo(
    () => (customRange ? getCustomRangeData(ops.rows, customRange.from, customRange.to) : getPeriodData(period)),
    [customRange, ops.rows, period],
  );
  const totalSeries = useMemo(() => {
    if (!customRange) return getPeriodTotalSeries(period);
    return {
      name: "All rails",
      values: data.labels.map((_, index) =>
        data.series.reduce((sum, series) => sum + series.values[index], 0),
      ),
    };
  }, [customRange, data, period]);

  const applyCustomRange = () => {
    if (!draftFrom || !draftTo) return;
    const from = dateToDay(draftFrom) <= dateToDay(draftTo) ? draftFrom : draftTo;
    const to = dateToDay(draftFrom) <= dateToDay(draftTo) ? draftTo : draftFrom;
    setCustomRange({ from: dateToDay(from), to: dateToDay(to) });
    setRangeKey((key) => key + 1);
  };

  const clearCustomRange = () => {
    setCustomRange(null);
    setDraftFrom(null);
    setDraftTo(null);
    setRangeKey((key) => key + 1);
  };

  const todayRows = useMemo(
    () => ops.rows.filter((row) => row.date.startsWith(TODAY)),
    [ops.rows],
  );
  const failedToday = useMemo(
    () => todayRows.filter((row) => row.status === "failed"),
    [todayRows],
  );
  const queue = useMemo(
    () =>
      ops.rows.filter(
        (row) =>
          row.status === "failed" || row.status === "reversed" || row.status === "disputed",
      ),
    [ops.rows],
  );
  const recent = useMemo(
    () => sortTransactions(todayRows, recentSort).slice(0, 6),
    [todayRows, recentSort],
  );

  // Rail shares come from the same series the chart plots, not from the
  // 60-row sample — the two are consistent in shape, not in totals, and
  // showing them side by side as if they reconcile would be a lie.
  const railShares = useMemo(() => {
    const totals = data.series.map((series) => ({
      rail: series.name as Rail,
      volume: series.values.reduce((sum, value) => sum + value, 0),
    }));
    const grand = totals.reduce((sum, entry) => sum + entry.volume, 0);
    return totals.map((entry) => ({
      ...entry,
      share: grand === 0 ? 0 : (entry.volume / grand) * 100,
    }));
  }, [data]);

  const visibleSeries = useMemo(
    () => data.series.filter((series) => ops.settings.visibleRails.includes(series.name as Rail)),
    [data, ops.settings.visibleRails],
  );

  const spikeActive = failedToday.length >= ops.settings.failThreshold;

  return (
    <SectionFrame
      eyebrow="Live operations"
      title="Overview"
      description={`Throughput, payment health and the work queue as of ${formatDateTime(TODAY_ISO)}.`}
      loading={ops.loading}
      failed={ops.failed}
      onRetry={ops.refresh}
      onBack={() => ops.goTo("settings")}
      actions={
        <div className="flex flex-wrap items-center" style={{ gap: "var(--space-3)" }}>
          <SegmentedControl
            label="Reporting period"
            size="md"
            value={customRange ? "" : period}
            onValueChange={(value) => {
              setCustomRange(null);
              ops.setPeriod(value as Period);
            }}
            options={PERIOD_OPTIONS.map((option) => ({
              value: option.value,
              label: option.short,
            }))}
          />
          <Popover
            key={rangeKey}
            align="end"
            trigger={
              <Button
                variant={customRange ? "primary" : "secondary"}
                size="md"
                iconLeft={<CalendarBlank size={14} weight="regular" />}
              >
                {customRange ? `${formatDate(`${customRange.from}T00:00:00+08:00`)} – ${formatDate(`${customRange.to}T00:00:00+08:00`)}` : "Custom range"}
              </Button>
            }
          >
            <div className="flex flex-col" style={{ gap: "var(--space-4)", padding: "var(--space-4)", width: "18rem" }}>
              <p className="text-text-secondary" style={{ fontSize: "var(--text-sm)" }}>
                Pick any two dates within the sample, {formatDate(`${datasetMinDay}T00:00:00+08:00`)}–
                {formatDate(`${datasetMaxDay}T00:00:00+08:00`)}.
              </p>
              <DatePicker
                label="From"
                value={draftFrom}
                onValueChange={setDraftFrom}
                minDate={dayToDate(datasetMinDay)}
                maxDate={dayToDate(datasetMaxDay)}
              />
              <DatePicker
                label="To"
                value={draftTo}
                onValueChange={setDraftTo}
                minDate={dayToDate(datasetMinDay)}
                maxDate={dayToDate(datasetMaxDay)}
              />
              <div className="flex justify-end" style={{ gap: "var(--space-2)" }}>
                <Button variant="ghost" size="sm" onClick={clearCustomRange}>
                  Clear
                </Button>
                <Button variant="primary" size="sm" disabled={!draftFrom || !draftTo} onClick={applyCustomRange}>
                  Apply
                </Button>
              </div>
            </div>
          </Popover>
        </div>
      }
    >
      {/* Alert row. The threshold is the one set in Settings, so turning
          that slider up and down makes this banner appear and disappear. */}
      {spikeActive && !alertDismissed && (
        <Alert
          variant="danger"
          title={`${formatCount(failedToday.length)} failed transfers today — at or above your threshold of ${formatCount(ops.settings.failThreshold)}`}
          onDismiss={() => setAlertDismissed(true)}
          dismissLabel="Dismiss failed-transfer alert"
          description={
            <span className="flex flex-wrap items-center" style={{ gap: "var(--space-4)" }}>
              <span>
                Concentrated on {failedToday[0]?.rail ?? "InstaPay"}. Retrying from the queue
                re-submits the same instruction on the same payment method.
              </span>
              <button
                type="button"
                className={styles.linkButton}
                onClick={() => ops.goTo("transactions", { status: "failed", day: TODAY })}
              >
                Open the failed queue
                <ArrowRight size={14} weight="bold" aria-hidden="true" />
              </button>
            </span>
          }
        />
      )}
      {spikeActive && alertDismissed && (
        <button
          type="button"
          className={styles.linkButton}
          onClick={() => setAlertDismissed(false)}
        >
          <Warning size={16} weight="fill" aria-hidden="true" />
          Show the failed-transfer alert again
        </button>
      )}

      {/* Stat strip. One accent block, three neutral cards — a second
          yellow block would flatten the hierarchy rather than double the
          brand. */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
        style={{ gap: "var(--space-6)" }}
      >
        <StatCard
          tone="accent"
          label={`${data.label} volume`}
          value={formatPeso(data.totals.volume)}
          delta={data.deltas.volume.label}
          direction={data.deltas.volume.direction}
          icon={<Coins size={18} weight="fill" />}
          caption={
            <span className="inline-flex items-center" style={{ gap: "var(--space-2)" }}>
              <Sparkline values={totalSeries.values} width={64} height={18} color="var(--text-primary)" />
              vs. previous
            </span>
          }
        />
        <StatCard
          label="Transactions"
          value={formatCount(data.totals.count)}
          delta={data.deltas.count.label}
          direction={data.deltas.count.direction}
          icon={<Receipt size={18} weight="fill" />}
          caption={
            <span className="inline-flex items-center" style={{ gap: "var(--space-2)" }}>
              <Sparkline values={totalSeries.values} width={64} height={18} />
              vs. previous
            </span>
          }
        />
        <StatCard
          label="Success rate"
          value={formatPercent(data.totals.successRate)}
          delta={data.deltas.successRate.label}
          direction={data.deltas.successRate.direction}
          icon={<CheckCircle size={18} weight="fill" />}
          caption={`${formatCount(data.previousTotals.failed)} → ${formatCount(data.totals.failed)} failed`}
        />
        <StatCard
          label="Failed transfers"
          value={formatCount(data.totals.failed)}
          delta={data.deltas.failed.label}
          // Neutral on purpose. StatCard paints "up" green and "down" red,
          // which inverts for a failure count — a drop is good news. Rather
          // than paint a fall red or fake a rise, the delta stays uncolored
          // and the caption carries the reading.
          direction="flat"
          icon={<Warning size={18} weight="fill" />}
          caption={`vs. previous period · ${formatCount(failedToday.length)} in today's sample`}
        />
      </div>

      {/* THE ink analytics band. One per screen, per the ink budget —
          sidebar, mobile nav, this, and the table header bands. */}
      <div
        data-surface="ink"
        className="bg-surface grain flex flex-col rounded-lg shadow-sm"
        style={{ padding: "var(--space-6)", gap: "var(--space-6)" }}
      >
        <div className="flex flex-wrap items-start justify-between" style={{ gap: "var(--space-4)" }}>
          <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
            <div className="flex items-center" style={{ gap: "var(--space-3)" }}>
              <span className={styles.brandRule} aria-hidden="true" />
              <span className={styles.eyebrow}>Volume by payment method</span>
            </div>
            <h3
              className="text-text-primary"
              style={{
                fontSize: "var(--text-2xl)",
                lineHeight: "var(--leading-tight)",
                fontWeight: "var(--weight-black)",
                letterSpacing: "var(--tracking-tight)",
              }}
            >
              {data.label}
            </h3>
          </div>

          <div className={styles.chipRow}>
            <ToggleGroup
              type="single"
              value={[chartMode]}
              onValueChange={(next) => setChartMode((next[0] as ChartMode) ?? "rails")}
              aria-label="Chart breakdown"
            >
              <ToggleGroupItem value="rails">By method</ToggleGroupItem>
              <ToggleGroupItem value="total">All methods</ToggleGroupItem>
            </ToggleGroup>
            <span
              className="inline-flex items-center"
              style={{
                gap: "var(--space-2)",
                color: "var(--text-tertiary)",
                fontSize: "var(--text-xs)",
              }}
            >
              <ChartLineUp size={14} weight="regular" aria-hidden="true" />
              {formatPesoCompact(data.totals.volume)} total
            </span>
          </div>
        </div>

        {chartMode === "rails" && visibleSeries.length === 0 ? (
          // Reachable by turning every rail off in Settings. It must offer
          // a way back rather than an empty chart frame.
          <EmptyState
            title="Every payment method is hidden"
            description="The chart has nothing to plot because all three payment methods are switched off in Settings."
            action={{
              label: "Show all payment methods",
              onClick: () => ops.updateSettings({ visibleRails: [...RAILS] }),
            }}
            secondaryAction={{ label: "Open Settings", onClick: () => ops.goTo("settings") }}
          />
        ) : (
          <LineChart
            labels={data.labels}
            series={chartMode === "rails" ? visibleSeries : [totalSeries]}
            area={chartMode === "total"}
            height={280}
            formatValue={formatPesoCompact}
          />
        )}
      </div>

      {/* One card, one focus at a time: the rail breakdown and the review
          queue cover different questions, so a reader picks which one to
          look at rather than parsing both side by side. */}
      <Card padded={false} className="overflow-hidden">
        <div style={{ padding: "var(--space-6)" }}>
          <Tabs
            variant="underline"
            label="Payment method share and review queue"
            items={[
              {
                value: "rails",
                label: "By payment method",
                content: (
                  <div
                    className="flex flex-col"
                    style={{ gap: "var(--space-4)", paddingBlock: "var(--space-6)" }}
                  >
                    <p className="text-text-tertiary" style={{ fontSize: "var(--text-sm)" }}>
                      {data.label}. Select a payment method to open the ledger filtered to it.
                    </p>
                    <div className="flex flex-col" style={{ gap: "var(--space-3)" }}>
                      {railShares.map((entry) => (
                        <button
                          key={entry.rail}
                          type="button"
                          className={styles.railRow}
                          onClick={() => ops.goTo("transactions", { rail: entry.rail })}
                        >
                          <span
                            className="flex w-full items-baseline justify-between"
                            style={{ gap: "var(--space-3)" }}
                          >
                            <span
                              className="text-text-primary"
                              style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-bold)" }}
                            >
                              {entry.rail}
                            </span>
                            <span
                              className="text-text-secondary tabular-nums"
                              style={{ fontSize: "var(--text-sm)" }}
                            >
                              {formatPesoCompact(entry.volume)} · {formatPercent(entry.share, 0)}
                            </span>
                          </span>
                          <Progress
                            value={entry.share}
                            variant="accent"
                            label={`${entry.rail} share of volume`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                value: "queue",
                label: (
                  <span className="inline-flex items-center" style={{ gap: "var(--space-2)" }}>
                    Needs review
                    <Badge variant={queue.length > 0 ? "warning" : "success"}>
                      {formatCount(queue.length)}
                    </Badge>
                  </span>
                ),
                content: (
                  <div className="flex flex-col" style={{ paddingBlock: "var(--space-3)" }}>
                    <div className="flex justify-end" style={{ paddingBottom: "var(--space-2)" }}>
                      <button
                        type="button"
                        className={styles.linkButton}
                        onClick={() => ops.goTo("transactions", { status: "failed" })}
                      >
                        Work the queue
                        <ArrowRight size={14} weight="bold" aria-hidden="true" />
                      </button>
                    </div>
                    {queue.length === 0 ? (
                      <EmptyState
                        icon={<CheckCircle size={32} weight="regular" />}
                        title="Nothing is waiting on a human"
                        description="Every failed, reversed and disputed payment in the sample has been worked. Reset the prototype data to put the queue back."
                        action={{ label: "Open the full ledger", onClick: () => ops.goTo("transactions") }}
                        secondaryAction={{ label: "Reset prototype data", onClick: ops.requestReset }}
                      />
                    ) : (
                      <List>
                        {queue.slice(0, 7).map((row) => (
                          <ListRow
                            key={row.id}
                            title={
                              <span className="inline-flex items-center" style={{ gap: "var(--space-2)" }}>
                                {/* A queue row doesn't need the full reference to act on —
                                    opening it does. Masked here; the full number is on the
                                    record itself once opened. */}
                                <span style={{ fontFamily: "var(--font-mono)" }}>
                                  {maskReference(row.reference)}
                                </span>
                                {ops.isFlagged(row.id) && <Badge variant="accent">Flagged</Badge>}
                              </span>
                            }
                            subtitle={`${row.merchant} · ${row.rail} · ${formatTime(row.date)}`}
                            onClick={() => ops.openTransaction(row.id)}
                            trailing={
                              <>
                                <Badge variant={STATUS_BADGE_VARIANT[row.status]} dot>
                                  {STATUS_LABEL[row.status]}
                                </Badge>
                                <span className="tabular-nums">{formatPeso(row.amount)}</span>
                              </>
                            }
                          />
                        ))}
                      </List>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </Card>

      {/* Today's ledger, in the same table the Transactions section uses. */}
      <Card padded={false} className="overflow-hidden">
        <div
          className="flex flex-wrap items-center justify-between border-b border-border-subtle"
          style={{ padding: "var(--space-4) var(--space-6)", gap: "var(--space-3)" }}
        >
          <div className="flex flex-col" style={{ gap: "var(--space-1)" }}>
            <h3
              className="text-text-primary"
              style={{ fontSize: "var(--text-base)", fontWeight: "var(--weight-bold)" }}
            >
              Today&rsquo;s activity
            </h3>
            <p className="text-text-tertiary" style={{ fontSize: "var(--text-sm)" }}>
              {formatCount(todayRows.length)} payments on 27 Aug 2026. Select a row for the full timeline.
            </p>
          </div>
          <button
            type="button"
            className={styles.linkButton}
            onClick={() => ops.goTo("transactions", { day: TODAY })}
          >
            Open all {formatCount(todayRows.length)} in the ledger
            <ArrowRight size={14} weight="bold" aria-hidden="true" />
          </button>
        </div>

        <div style={{ padding: "var(--space-4)" }}>
          <LedgerTable
            caption="Payments recorded today"
            rows={recent}
            density={ops.settings.density}
            zebra={ops.settings.zebra}
            sort={recentSort}
            onSortChange={setRecentSort}
            onOpen={ops.openTransaction}
            isFlagged={ops.isFlagged}
            pendingIds={ops.pendingIds}
            emptyState={
              <EmptyState
                title="No payments recorded today"
                description="Nothing has cleared on 27 Aug 2026 in the sample ledger."
                action={{ label: "Open the full ledger", onClick: () => ops.goTo("transactions") }}
              />
            }
          />
        </div>
      </Card>
    </SectionFrame>
  );
}
