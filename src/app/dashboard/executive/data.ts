/**
 * Executive Brief — derivations.
 *
 * Everything on the page is computed here from the shared dataset in
 * `../_data/payments`, so the period switcher has exactly one place to
 * recompute from and no section can drift into its own arithmetic.
 *
 * Pure and deterministic, like the module it reads: no `Date.now`, no
 * `Math.random`, no bare `new Date()`. Safe to call during render.
 *
 * THE RECONCILIATION RULE this file enforces:
 * `getPeriodData(p).series` (per-rail buckets) and `getPeriodData(p).totals`
 * (headline figures) are authored separately and DO NOT sum to each other
 * for every period — the data module says so. So the series is used for
 * SHAPE only (mix, trend, peak) and every peso figure a reader might add up
 * is allocated from `totals.volume` by that mix. Nothing on the page shows
 * two figures side by side that can't reconcile.
 */

import {
  RAILS,
  TODAY,
  formatDate,
  getPeriodData,
  getPeriodTotalSeries,
  needsReview,
  settlementBatches,
  transactionDays,
  transactions,
  type ChartSeries,
  type Period,
  type PeriodData,
  type Rail,
  type SettlementBatch,
  type Transaction,
} from "../_data/payments";

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * What the period is being compared against, in words. Every delta on the
 * brief is versus the immediately preceding window of the same length, and
 * "+7.7%" means nothing without saying so.
 */
export const PREVIOUS_LABEL: Record<Period, string> = {
  today: "yesterday",
  "7d": "the previous 7 days",
  "30d": "the previous 30 days",
  quarter: "the previous quarter",
};

/** One rail's share of the period, with its peso figure allocated from the headline gross. */
export type RailSlice = {
  rail: Rail;
  /** Percentage, 0-100, of gross volume. Taken from the series shape. */
  share: number;
  /** `totals.volume × share`, so the three rails sum back to the headline. */
  volume: number;
  /** First and last bucket for this rail, for the direction-of-travel note. */
  first: number;
  last: number;
};

export type SettlementSummary = {
  settled: number;
  inWindow: number;
  delayed: number;
  returned: number;
  /** Batch count in the period. */
  batches: number;
  /** Payment count across those batches. */
  items: number;
  /** Percentage of batch value that arrived (settled + delayed), 0-100. */
  arrivedShare: number;
};

export type Brief = {
  period: Period;
  /** "Last 7 days". */
  label: string;
  data: PeriodData;
  /** All rails summed per bucket. */
  totalSeries: ChartSeries;
  railMix: RailSlice[];
  /** The rail carrying the most volume this period. */
  leadRail: RailSlice;
  peak: { label: string; value: number };
  trough: { label: string; value: number };
  /** Fees ÷ gross, as a percentage. */
  takeRate: number;
  /** The transaction sample inside this period's window. */
  rows: Transaction[];
  /** "27 Aug 2026" / "21 Aug 2026 – 27 Aug 2026". */
  rowsWindowLabel: string;
  /** Failed + reversed + disputed inside the window. */
  exceptions: Transaction[];
  batches: SettlementBatch[];
  settlement: SettlementSummary;
  /** Stacked bars: one bar per rail, one series per settlement state. */
  settlementChart: { labels: string[]; series: ChartSeries[] };
};

/**
 * The sample window for a period.
 *
 * `transactions` is a readable 60-row sample spanning 21–27 Aug 2026, so it
 * can only narrow to "today"; 7d, 30d and quarter all resolve to the whole
 * sample. Every surface that reads `rows` says which window it is showing
 * rather than implying the sample stretches to a quarter.
 */
function rowsForPeriod(period: Period): Transaction[] {
  if (period === "today") return transactions.filter((t) => t.date.startsWith(TODAY));
  return transactions;
}

function batchesForPeriod(period: Period): SettlementBatch[] {
  if (period === "today") return settlementBatches.filter((b) => b.cutOff.startsWith(TODAY));
  return settlementBatches;
}

const SAMPLE_RANGE_LABEL = `${formatDate(
  transactionDays[transactionDays.length - 1],
)} – ${formatDate(transactionDays[0])}`;

function summarizeSettlement(batches: SettlementBatch[]): SettlementSummary {
  const sumOf = (status: SettlementBatch["status"]) =>
    round2(batches.filter((b) => b.status === status).reduce((sum, b) => sum + b.amount, 0));

  const settled = sumOf("settled");
  const delayed = sumOf("delayed");
  const inWindow = sumOf("in_window");
  const returned = sumOf("returned");
  const total = settled + delayed + inWindow + returned;

  return {
    settled,
    delayed,
    inWindow,
    returned,
    batches: batches.length,
    items: batches.reduce((sum, b) => sum + b.itemCount, 0),
    arrivedShare: total === 0 ? 0 : round2(((settled + delayed) / total) * 100),
  };
}

const SETTLEMENT_SERIES: { name: string; status: SettlementBatch["status"] }[] = [
  { name: "Settled", status: "settled" },
  { name: "In window", status: "in_window" },
  { name: "Delayed", status: "delayed" },
  { name: "Returned", status: "returned" },
];

function settlementByRail(batches: SettlementBatch[]): { labels: string[]; series: ChartSeries[] } {
  return {
    // Always three bars in RAILS order, zero-filled, so the chart never
    // changes shape when the period narrows.
    labels: [...RAILS],
    series: SETTLEMENT_SERIES.map(({ name, status }) => ({
      name,
      values: RAILS.map((rail) =>
        round2(
          batches
            .filter((b) => b.rail === rail && b.status === status)
            .reduce((sum, b) => sum + b.amount, 0),
        ),
      ),
    })),
  };
}

/** Everything the Executive Brief renders for one period, in one object. */
export function buildBrief(period: Period): Brief {
  const data = getPeriodData(period);
  const totalSeries = getPeriodTotalSeries(period);

  const seriesTotal = totalSeries.values.reduce((sum, v) => sum + v, 0);

  /*
   * Allocation, not multiplication by the displayed share: rounding each
   * share to one decimal first and then scaling leaves the three rails off
   * the headline by tens of pesos, and the page states in copy that they
   * add back to it. So the ratio is applied unrounded, and the last rail
   * takes the residual — the standard largest-remainder trick, which makes
   * the sum exact rather than nearly exact.
   */
  const railMix: RailSlice[] = data.series.map((s, index) => {
    const railTotal = s.values.reduce((sum, v) => sum + v, 0);
    const ratio = seriesTotal === 0 ? 0 : railTotal / seriesTotal;
    return {
      rail: s.name as Rail,
      share: round2(ratio * 100),
      volume: index === data.series.length - 1 ? 0 : round2(data.totals.volume * ratio),
      first: s.values[0] ?? 0,
      last: s.values[s.values.length - 1] ?? 0,
    };
  });

  if (railMix.length > 0) {
    const allocated = railMix
      .slice(0, -1)
      .reduce((sum, slice) => sum + slice.volume, 0);
    railMix[railMix.length - 1].volume = round2(data.totals.volume - allocated);
  }

  const leadRail = railMix.reduce(
    (best, slice) => (slice.share > best.share ? slice : best),
    railMix[0],
  );

  let peakIndex = 0;
  let troughIndex = 0;
  totalSeries.values.forEach((value, i) => {
    if (value > totalSeries.values[peakIndex]) peakIndex = i;
    if (value < totalSeries.values[troughIndex]) troughIndex = i;
  });

  const rows = rowsForPeriod(period);
  const exceptionIds = new Set(needsReview.map((t) => t.id));
  const batches = batchesForPeriod(period);

  return {
    period,
    label: data.label,
    data,
    totalSeries,
    railMix,
    leadRail,
    peak: { label: data.labels[peakIndex], value: totalSeries.values[peakIndex] },
    trough: { label: data.labels[troughIndex], value: totalSeries.values[troughIndex] },
    takeRate:
      data.totals.volume === 0 ? 0 : round2((data.totals.fees / data.totals.volume) * 100),
    rows,
    rowsWindowLabel: period === "today" ? formatDate(TODAY) : SAMPLE_RANGE_LABEL,
    exceptions: rows.filter((t) => exceptionIds.has(t.id)),
    batches,
    settlement: summarizeSettlement(batches),
    settlementChart: settlementByRail(batches),
  };
}
