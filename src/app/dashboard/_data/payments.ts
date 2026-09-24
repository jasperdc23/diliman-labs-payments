/**
 * Shared prototype dataset for every dashboard variant.
 *
 * Three dashboards drive every number, table, chart, filter and drilldown
 * from this one module, so it is the only place demo figures are authored.
 *
 * DETERMINISTIC BY CONSTRUCTION. No `Math.random`, no `Date.now`, no
 * `new Date()` without an explicit argument. Every value is either a
 * literal or derived from one by a pure function, so server and client
 * render byte-identical output and a static build stays reproducible.
 * `TODAY` below is the fixed "now" the whole prototype is anchored to.
 *
 * DEMO DATA. The cut-off times, batch windows and rail figures here are
 * illustrative. They are not the published BSP / InstaPay / PESONet
 * schedule and must be verified before appearing on anything
 * customer-facing.
 */

// ---------------------------------------------------------------------------
// Anchor
// ---------------------------------------------------------------------------

/** The fixed "now" for the whole prototype: 27 Aug 2026, 4:20 PM PHT. */
export const TODAY_ISO = "2026-08-27T16:20:00+08:00";

/** Calendar day the prototype treats as today, as `YYYY-MM-DD`. */
export const TODAY = "2026-08-27";

const MANILA = "Asia/Manila";

// ---------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------

const pesoFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// en-GB + an explicit Manila zone gives "27 Aug 2026" / "3 Aug 2026" on every
// machine, regardless of the host's locale or TZ. Pinning both is what keeps
// server and client output identical.
const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: MANILA,
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: MANILA,
});

/** `₱1,234.56` — the house currency format, always two decimals. */
export function formatPeso(value: number): string {
  return pesoFormatter.format(value);
}

/**
 * `₱1.28M` — for axis ticks and tight stat captions only. Never use it
 * where a reader might reconcile the figure against a statement; that
 * always gets `formatPeso`.
 */
export function formatPesoCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `₱${(value / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `₱${(value / 1_000).toFixed(1)}K`;
  return `₱${value.toFixed(0)}`;
}

/** `27 Aug 2026`. Accepts an ISO string or a `YYYY-MM-DD` date. */
export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

/** `3:00 PM`, Manila time. */
export function formatTime(iso: string): string {
  return timeFormatter.format(new Date(iso));
}

/** `27 Aug 2026 · 3:00 PM`. */
export function formatDateTime(iso: string): string {
  return `${formatDate(iso)} · ${formatTime(iso)}`;
}

/** `98.6%` — one decimal, which is the resolution ops actually reads. */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/** `1,284` — grouped integers for counts. */
export function formatCount(value: number): string {
  return new Intl.NumberFormat("en-PH").format(value);
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Rail = "InstaPay" | "PESONet" | "QR Ph";

export type TransactionStatus =
  | "settled"
  | "pending"
  | "failed"
  | "reversed"
  | "disputed"
  | "awaiting_settlement";

export type TimelineState = "done" | "current" | "warning" | "failed";

export type TimelineEvent = {
  label: string;
  /** ISO 8601 with the Manila offset. */
  timestamp: string;
  state: TimelineState;
};

export type Transaction = {
  id: string;
  reference: string;
  merchantId: string;
  merchant: string;
  rail: Rail;
  status: TransactionStatus;
  /** Gross amount charged to the customer, in PHP. */
  amount: number;
  /** Processing fee retained, in PHP. */
  fee: number;
  /** Amount due to the merchant, in PHP. `amount - fee`. */
  net: number;
  /** ISO 8601 with the Manila offset. */
  date: string;
  customer: string;
  timeline: TimelineEvent[];
};

export type MerchantStatus = "active" | "onboarding" | "review" | "suspended";

export type Merchant = {
  id: string;
  name: string;
  category: string;
  /** Trailing 30-day gross volume, in PHP. */
  volume: number;
  /** Trailing 30-day success rate, as a percentage (0-100). */
  successRate: number;
  status: MerchantStatus;
  /** `YYYY-MM-DD`. */
  joinedDate: string;
};

export type SettlementStatus = "settled" | "in_window" | "delayed" | "returned";

export type SettlementBatch = {
  id: string;
  reference: string;
  rail: Rail;
  /** Human window label, e.g. `"11:00 AM – 3:00 PM"`. */
  window: string;
  /** ISO 8601. The rail cut-off this batch closed against. */
  cutOff: string;
  /** ISO 8601. */
  expectedArrival: string;
  /** ISO 8601, or `null` while the batch is still in its window. */
  actualArrival: string | null;
  itemCount: number;
  /** Net amount credited to merchants, in PHP. */
  amount: number;
  status: SettlementStatus;
};

export type Period = "today" | "7d" | "30d" | "quarter";

export type ChartSeries = {
  name: string;
  values: number[];
};

export type PeriodTotals = {
  /** Gross volume, in PHP. */
  volume: number;
  /** Transaction count. */
  count: number;
  /** Fees retained, in PHP. */
  fees: number;
  /** Net settled to merchants, in PHP. */
  net: number;
  /** Percentage, 0-100. */
  successRate: number;
  failed: number;
  /** Average ticket size, in PHP. */
  averageTicket: number;
};

export type Delta = {
  /** Absolute change, in the source unit. */
  value: number;
  /** Percentage change vs. the previous period. `0` when there is no base. */
  percent: number;
  direction: "up" | "down" | "flat";
  /** Pre-signed for display, e.g. `"+8.2%"`. */
  label: string;
};

export type PeriodData = {
  period: Period;
  /** Display name, e.g. `"Last 7 days"`. */
  label: string;
  /** Axis labels, one per bucket. */
  labels: string[];
  /** One series per rail, aligned to `labels`. */
  series: ChartSeries[];
  totals: PeriodTotals;
  previousTotals: PeriodTotals;
  deltas: {
    volume: Delta;
    count: Delta;
    net: Delta;
    successRate: Delta;
    failed: Delta;
  };
};

export type RailBreakdown = {
  rail: Rail;
  volume: number;
  count: number;
  /** Share of total volume, as a percentage (0-100). */
  share: number;
};

// ---------------------------------------------------------------------------
// Vocabulary
// ---------------------------------------------------------------------------

export const RAILS: readonly Rail[] = ["InstaPay", "PESONet", "QR Ph"] as const;

export const TRANSACTION_STATUSES: readonly TransactionStatus[] = [
  "settled",
  "awaiting_settlement",
  "pending",
  "failed",
  "reversed",
  "disputed",
] as const;

/** Sentence-case display label for a status. Never render the raw key. */
export const STATUS_LABEL: Record<TransactionStatus, string> = {
  settled: "Settled",
  pending: "Pending",
  failed: "Failed",
  reversed: "Reversed",
  disputed: "Disputed",
  awaiting_settlement: "Awaiting settlement",
};

/** Maps a status onto the `Badge` component's `variant` prop. */
export const STATUS_BADGE_VARIANT: Record<
  TransactionStatus,
  "neutral" | "accent" | "success" | "warning" | "danger"
> = {
  settled: "success",
  pending: "warning",
  failed: "danger",
  reversed: "danger",
  disputed: "warning",
  awaiting_settlement: "neutral",
};

export const MERCHANT_STATUS_LABEL: Record<MerchantStatus, string> = {
  active: "Active",
  onboarding: "Onboarding",
  review: "In review",
  suspended: "Suspended",
};

export const MERCHANT_STATUS_BADGE_VARIANT: Record<
  MerchantStatus,
  "neutral" | "accent" | "success" | "warning" | "danger"
> = {
  active: "success",
  onboarding: "accent",
  review: "warning",
  suspended: "danger",
};

export const SETTLEMENT_STATUS_LABEL: Record<SettlementStatus, string> = {
  settled: "Settled",
  in_window: "In window",
  delayed: "Delayed",
  returned: "Returned",
};

export const SETTLEMENT_STATUS_BADGE_VARIANT: Record<
  SettlementStatus,
  "neutral" | "accent" | "success" | "warning" | "danger"
> = {
  settled: "success",
  in_window: "neutral",
  delayed: "warning",
  returned: "danger",
};

/**
 * Rail characteristics, for the settlement view's status row.
 * `nextWindow` is demo data, not the published schedule.
 */
export const RAIL_META: Record<
  Rail,
  {
    rail: Rail;
    cadence: string;
    description: string;
    nextWindow: string;
    state: "success" | "warning" | "danger" | "neutral" | "accent";
    stateLabel: string;
  }
> = {
  InstaPay: {
    rail: "InstaPay",
    cadence: "24/7, near real-time",
    description: "Credited within seconds; settled to the merchant in hourly sweeps.",
    nextWindow: "5:00 PM",
    state: "success",
    stateLabel: "Operational",
  },
  PESONet: {
    rail: "PESONet",
    cadence: "Batch windows",
    description: "Three cut-offs a business day. Anything past the last one lands next banking day.",
    nextWindow: "3:00 PM",
    state: "warning",
    stateLabel: "Cut-off approaching",
  },
  "QR Ph": {
    rail: "QR Ph",
    cadence: "24/7, person-to-merchant",
    description: "Rides InstaPay clearing; settles on the same hourly sweep.",
    nextWindow: "5:00 PM",
    state: "success",
    stateLabel: "Operational",
  },
};

// ---------------------------------------------------------------------------
// Merchants
// ---------------------------------------------------------------------------

export const merchants: Merchant[] = [
  { id: "mer-01", name: "Bayani Mart", category: "Retail", volume: 2847320.4, successRate: 99.1, status: "active", joinedDate: "2024-03-14" },
  { id: "mer-02", name: "Sari Express", category: "Retail", volume: 1163905.75, successRate: 98.4, status: "active", joinedDate: "2024-07-02" },
  { id: "mer-03", name: "Kalye Coffee", category: "Food & beverage", volume: 486210.25, successRate: 99.6, status: "active", joinedDate: "2025-01-21" },
  { id: "mer-04", name: "Luzon Logistics", category: "Logistics", volume: 4021488.0, successRate: 96.2, status: "review", joinedDate: "2023-11-08" },
  { id: "mer-05", name: "Isla Pharmacy", category: "Healthcare", volume: 912744.6, successRate: 99.3, status: "active", joinedDate: "2024-09-30" },
  { id: "mer-06", name: "Kalinga Bakeshop", category: "Food & beverage", volume: 238190.5, successRate: 99.8, status: "active", joinedDate: "2025-04-17" },
  { id: "mer-07", name: "Visayas Freight Co.", category: "Logistics", volume: 3388015.2, successRate: 97.5, status: "active", joinedDate: "2023-06-26" },
  { id: "mer-08", name: "Maharlika Motors", category: "Automotive", volume: 5740600.0, successRate: 98.9, status: "active", joinedDate: "2023-02-13" },
  { id: "mer-09", name: "Tahanan Furnishings", category: "Home & living", volume: 1470332.85, successRate: 94.8, status: "suspended", joinedDate: "2024-12-05" },
  { id: "mer-10", name: "Panay Telecom", category: "Telecommunications", volume: 2210480.3, successRate: 99.0, status: "onboarding", joinedDate: "2026-08-03" },
];

const merchantsById = new Map(merchants.map((m) => [m.id, m]));

/** `undefined` when the id is unknown — callers render a not-found state. */
export function getMerchantById(id: string): Merchant | undefined {
  return merchantsById.get(id);
}

// ---------------------------------------------------------------------------
// Transactions
// ---------------------------------------------------------------------------

/**
 * Fee schedule, applied deterministically so `fee` and `net` are never
 * authored by hand and can never disagree with `amount`.
 * Illustrative rates, not a published tariff.
 */
const FEE_SCHEDULE: Record<Rail, { rate: number; flat: number }> = {
  InstaPay: { rate: 0.003, flat: 8 },
  PESONet: { rate: 0.0025, flat: 12 },
  "QR Ph": { rate: 0.005, flat: 0 },
};

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function shiftMinutes(iso: string, minutes: number): string {
  const base = new Date(iso).getTime() + minutes * 60_000;
  const d = new Date(base);
  // Re-emit with the fixed +08:00 offset rather than the host's zone, so
  // the string is identical on every machine that renders it.
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: MANILA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  const hour = get("hour") === "24" ? "00" : get("hour");
  return `${get("year")}-${get("month")}-${get("day")}T${hour}:${get("minute")}:${get("second")}+08:00`;
}

function buildTimeline(status: TransactionStatus, startedAt: string, rail: Rail): TimelineEvent[] {
  const initiated: TimelineEvent = { label: "Initiated", timestamp: startedAt, state: "done" };
  const authorized: TimelineEvent = {
    label: "Authorized",
    timestamp: shiftMinutes(startedAt, 1),
    state: "done",
  };
  const cleared: TimelineEvent = {
    label: `Cleared via ${rail}`,
    timestamp: shiftMinutes(startedAt, 4),
    state: "done",
  };

  switch (status) {
    case "settled":
      return [
        initiated,
        authorized,
        cleared,
        { label: "Settled to merchant", timestamp: shiftMinutes(startedAt, 126), state: "done" },
      ];
    case "awaiting_settlement":
      return [
        initiated,
        authorized,
        cleared,
        { label: "Awaiting settlement window", timestamp: shiftMinutes(startedAt, 6), state: "current" },
      ];
    case "pending":
      return [
        initiated,
        authorized,
        { label: `Clearing with ${rail}`, timestamp: shiftMinutes(startedAt, 3), state: "current" },
      ];
    case "failed":
      return [
        initiated,
        authorized,
        { label: "Rejected by receiving institution", timestamp: shiftMinutes(startedAt, 5), state: "failed" },
      ];
    case "reversed":
      return [
        initiated,
        authorized,
        cleared,
        { label: "Settled to merchant", timestamp: shiftMinutes(startedAt, 126), state: "done" },
        { label: "Reversal requested", timestamp: shiftMinutes(startedAt, 1_480), state: "warning" },
        { label: "Funds returned to payer", timestamp: shiftMinutes(startedAt, 1_612), state: "done" },
      ];
    case "disputed":
      return [
        initiated,
        authorized,
        cleared,
        { label: "Settled to merchant", timestamp: shiftMinutes(startedAt, 126), state: "done" },
        { label: "Dispute filed by payer", timestamp: shiftMinutes(startedAt, 2_890), state: "warning" },
        { label: "Under review", timestamp: shiftMinutes(startedAt, 2_950), state: "current" },
      ];
  }
}

/** [reference, merchantId, rail, status, amount, customer, ISO timestamp] */
type Seed = [string, string, Rail, TransactionStatus, number, string, string];

const TRANSACTION_SEED: Seed[] = [
  ["TXN-8880", "mer-08", "PESONet", "awaiting_settlement", 248900.0, "Rodrigo Villanueva", "2026-08-27T15:52:00+08:00"],
  ["TXN-8879", "mer-01", "InstaPay", "settled", 12450.5, "Maricel Dizon", "2026-08-27T15:41:00+08:00"],
  ["TXN-8878", "mer-03", "QR Ph", "settled", 480.25, "Jomar Bautista", "2026-08-27T15:22:00+08:00"],
  ["TXN-8877", "mer-04", "PESONet", "pending", 98750.0, "Ferdinand Lacson", "2026-08-27T15:04:00+08:00"],
  ["TXN-8876", "mer-05", "InstaPay", "settled", 5420.75, "Analyn Sarmiento", "2026-08-27T14:47:00+08:00"],
  ["TXN-8875", "mer-09", "InstaPay", "failed", 33120.0, "Benedict Ocampo", "2026-08-27T14:31:00+08:00"],
  ["TXN-8874", "mer-06", "QR Ph", "settled", 1180.0, "Cristina Malabanan", "2026-08-27T14:12:00+08:00"],
  ["TXN-8873", "mer-02", "InstaPay", "settled", 6740.3, "Arnel Pascual", "2026-08-27T13:58:00+08:00"],
  ["TXN-8872", "mer-07", "PESONet", "awaiting_settlement", 145200.0, "Grace Tolentino", "2026-08-27T13:35:00+08:00"],
  ["TXN-8871", "mer-10", "InstaPay", "settled", 2299.0, "Michael Ang", "2026-08-27T13:11:00+08:00"],
  ["TXN-8870", "mer-01", "QR Ph", "settled", 845.5, "Rowena Ilagan", "2026-08-27T12:49:00+08:00"],
  ["TXN-8869", "mer-04", "PESONet", "disputed", 187430.0, "Ferdinand Lacson", "2026-08-27T12:20:00+08:00"],
  ["TXN-8868", "mer-03", "QR Ph", "settled", 620.0, "Patricia Uy", "2026-08-27T11:58:00+08:00"],
  ["TXN-8867", "mer-08", "InstaPay", "settled", 74500.0, "Dennis Ramirez", "2026-08-27T11:32:00+08:00"],
  ["TXN-8866", "mer-05", "InstaPay", "pending", 3310.4, "Liza Gutierrez", "2026-08-27T11:05:00+08:00"],
  ["TXN-8865", "mer-02", "PESONet", "settled", 28900.0, "Arnel Pascual", "2026-08-27T10:41:00+08:00"],
  ["TXN-8864", "mer-09", "InstaPay", "failed", 51200.0, "Benedict Ocampo", "2026-08-27T10:18:00+08:00"],
  ["TXN-8863", "mer-06", "QR Ph", "settled", 395.75, "Cristina Malabanan", "2026-08-27T09:54:00+08:00"],
  ["TXN-8862", "mer-07", "PESONet", "settled", 212600.0, "Grace Tolentino", "2026-08-27T09:27:00+08:00"],
  ["TXN-8861", "mer-01", "InstaPay", "settled", 9240.6, "Maricel Dizon", "2026-08-27T08:52:00+08:00"],
  ["TXN-8860", "mer-10", "QR Ph", "settled", 1499.0, "Michael Ang", "2026-08-27T08:16:00+08:00"],
  ["TXN-8859", "mer-08", "PESONet", "settled", 396400.0, "Rodrigo Villanueva", "2026-08-26T17:44:00+08:00"],
  ["TXN-8858", "mer-04", "PESONet", "reversed", 122850.0, "Ferdinand Lacson", "2026-08-26T16:58:00+08:00"],
  ["TXN-8857", "mer-03", "QR Ph", "settled", 780.25, "Jomar Bautista", "2026-08-26T16:20:00+08:00"],
  ["TXN-8856", "mer-02", "InstaPay", "settled", 4120.0, "Rowena Ilagan", "2026-08-26T15:47:00+08:00"],
  ["TXN-8855", "mer-05", "InstaPay", "settled", 8860.9, "Analyn Sarmiento", "2026-08-26T14:39:00+08:00"],
  ["TXN-8854", "mer-09", "PESONet", "failed", 64300.0, "Teresita Navarro", "2026-08-26T13:52:00+08:00"],
  ["TXN-8853", "mer-07", "PESONet", "settled", 178900.0, "Grace Tolentino", "2026-08-26T12:31:00+08:00"],
  ["TXN-8852", "mer-01", "QR Ph", "settled", 1250.0, "Maricel Dizon", "2026-08-26T11:48:00+08:00"],
  ["TXN-8851", "mer-06", "QR Ph", "settled", 540.5, "Cristina Malabanan", "2026-08-26T10:55:00+08:00"],
  ["TXN-8850", "mer-08", "InstaPay", "settled", 91200.0, "Dennis Ramirez", "2026-08-26T10:12:00+08:00"],
  ["TXN-8849", "mer-10", "InstaPay", "pending", 3780.0, "Michael Ang", "2026-08-26T09:38:00+08:00"],
  ["TXN-8848", "mer-04", "PESONet", "settled", 245100.0, "Ferdinand Lacson", "2026-08-25T17:20:00+08:00"],
  ["TXN-8847", "mer-02", "InstaPay", "settled", 7455.25, "Arnel Pascual", "2026-08-25T16:44:00+08:00"],
  ["TXN-8846", "mer-09", "InstaPay", "disputed", 42800.0, "Teresita Navarro", "2026-08-25T15:31:00+08:00"],
  ["TXN-8845", "mer-03", "QR Ph", "settled", 930.0, "Patricia Uy", "2026-08-25T14:18:00+08:00"],
  ["TXN-8844", "mer-05", "InstaPay", "settled", 6180.4, "Liza Gutierrez", "2026-08-25T13:26:00+08:00"],
  ["TXN-8843", "mer-07", "PESONet", "settled", 302400.0, "Jefferson Tan", "2026-08-25T12:02:00+08:00"],
  ["TXN-8842", "mer-01", "InstaPay", "settled", 11380.0, "Rowena Ilagan", "2026-08-25T11:15:00+08:00"],
  ["TXN-8841", "mer-06", "QR Ph", "settled", 285.0, "Cristina Malabanan", "2026-08-25T10:40:00+08:00"],
  ["TXN-8840", "mer-08", "PESONet", "settled", 512300.0, "Rodrigo Villanueva", "2026-08-25T09:55:00+08:00"],
  ["TXN-8839", "mer-10", "QR Ph", "failed", 2199.0, "Katrina Flores", "2026-08-25T09:12:00+08:00"],
  ["TXN-8838", "mer-04", "InstaPay", "settled", 18640.0, "Ferdinand Lacson", "2026-08-24T17:05:00+08:00"],
  ["TXN-8837", "mer-02", "PESONet", "settled", 33750.0, "Arnel Pascual", "2026-08-24T16:22:00+08:00"],
  ["TXN-8836", "mer-03", "QR Ph", "settled", 1075.5, "Jomar Bautista", "2026-08-24T15:38:00+08:00"],
  ["TXN-8835", "mer-09", "PESONet", "reversed", 88400.0, "Benedict Ocampo", "2026-08-24T14:47:00+08:00"],
  ["TXN-8834", "mer-05", "InstaPay", "settled", 4980.75, "Analyn Sarmiento", "2026-08-24T13:29:00+08:00"],
  ["TXN-8833", "mer-07", "PESONet", "settled", 156800.0, "Jefferson Tan", "2026-08-24T12:14:00+08:00"],
  ["TXN-8832", "mer-01", "InstaPay", "settled", 8720.0, "Maricel Dizon", "2026-08-24T11:33:00+08:00"],
  ["TXN-8831", "mer-08", "InstaPay", "settled", 128500.0, "Dennis Ramirez", "2026-08-24T10:47:00+08:00"],
  ["TXN-8830", "mer-06", "QR Ph", "settled", 640.25, "Cristina Malabanan", "2026-08-24T09:58:00+08:00"],
  ["TXN-8829", "mer-10", "InstaPay", "settled", 2899.0, "Katrina Flores", "2026-08-24T09:20:00+08:00"],
  ["TXN-8828", "mer-04", "PESONet", "failed", 214300.0, "Ferdinand Lacson", "2026-08-23T16:40:00+08:00"],
  ["TXN-8827", "mer-02", "InstaPay", "settled", 5630.0, "Rowena Ilagan", "2026-08-23T15:12:00+08:00"],
  ["TXN-8826", "mer-03", "QR Ph", "settled", 715.0, "Patricia Uy", "2026-08-23T13:55:00+08:00"],
  ["TXN-8825", "mer-07", "PESONet", "settled", 268900.0, "Grace Tolentino", "2026-08-23T11:30:00+08:00"],
  ["TXN-8824", "mer-09", "InstaPay", "disputed", 37500.0, "Teresita Navarro", "2026-08-22T16:18:00+08:00"],
  ["TXN-8823", "mer-01", "QR Ph", "settled", 1340.5, "Maricel Dizon", "2026-08-22T14:02:00+08:00"],
  ["TXN-8822", "mer-08", "PESONet", "settled", 448200.0, "Rodrigo Villanueva", "2026-08-22T10:44:00+08:00"],
  ["TXN-8821", "mer-05", "InstaPay", "failed", 9120.6, "Liza Gutierrez", "2026-08-21T15:26:00+08:00"],
];

function buildTransaction(seed: Seed, index: number): Transaction {
  const [reference, merchantId, rail, status, amount, customer, date] = seed;
  const schedule = FEE_SCHEDULE[rail];
  const fee = round2(amount * schedule.rate + schedule.flat);
  return {
    id: `txn-${String(index + 1).padStart(3, "0")}`,
    reference,
    merchantId,
    merchant: merchantsById.get(merchantId)?.name ?? "Unknown merchant",
    rail,
    status,
    amount: round2(amount),
    fee,
    net: round2(amount - fee),
    date,
    customer,
    timeline: buildTimeline(status, date, rail),
  };
}

/** 60 rows, newest first. The canonical transaction list. */
export const transactions: Transaction[] = TRANSACTION_SEED.map(buildTransaction);

const transactionsById = new Map(transactions.map((t) => [t.id, t]));

/** `undefined` when the id is unknown — callers render a not-found state. */
export function getTransactionById(id: string): Transaction | undefined {
  return transactionsById.get(id);
}

export function getTransactionsByMerchant(merchantId: string): Transaction[] {
  return transactions.filter((t) => t.merchantId === merchantId);
}

/** Everything an operator has to look at by hand: failed, reversed, disputed. */
export const needsReview: Transaction[] = transactions.filter(
  (t) => t.status === "failed" || t.status === "reversed" || t.status === "disputed",
);

/** The failed queue on its own. */
export const failedTransactions: Transaction[] = transactions.filter((t) => t.status === "failed");

// ---------------------------------------------------------------------------
// Settlement batches
// ---------------------------------------------------------------------------

export const settlementBatches: SettlementBatch[] = [
  { id: "set-01", reference: "BAT-2026-0827-P2", rail: "PESONet", window: "11:00 AM – 3:00 PM", cutOff: "2026-08-27T15:00:00+08:00", expectedArrival: "2026-08-27T17:30:00+08:00", actualArrival: null, itemCount: 148, amount: 312440.0, status: "in_window" },
  { id: "set-02", reference: "BAT-2026-0827-I4", rail: "InstaPay", window: "3:00 PM – 4:00 PM", cutOff: "2026-08-27T16:00:00+08:00", expectedArrival: "2026-08-27T16:20:00+08:00", actualArrival: "2026-08-27T16:17:00+08:00", itemCount: 96, amount: 184220.35, status: "settled" },
  { id: "set-03", reference: "BAT-2026-0827-Q3", rail: "QR Ph", window: "12:00 PM – 3:00 PM", cutOff: "2026-08-27T15:00:00+08:00", expectedArrival: "2026-08-27T15:40:00+08:00", actualArrival: "2026-08-27T15:36:00+08:00", itemCount: 412, amount: 88190.6, status: "settled" },
  { id: "set-04", reference: "BAT-2026-0827-P1", rail: "PESONet", window: "8:00 AM – 11:00 AM", cutOff: "2026-08-27T11:00:00+08:00", expectedArrival: "2026-08-27T13:30:00+08:00", actualArrival: "2026-08-27T13:22:00+08:00", itemCount: 131, amount: 642180.9, status: "settled" },
  { id: "set-05", reference: "BAT-2026-0827-I2", rail: "InstaPay", window: "9:00 AM – 12:00 PM", cutOff: "2026-08-27T12:00:00+08:00", expectedArrival: "2026-08-27T12:25:00+08:00", actualArrival: "2026-08-27T12:41:00+08:00", itemCount: 204, amount: 370338.95, status: "delayed" },
  { id: "set-06", reference: "BAT-2026-0826-R7", rail: "PESONet", window: "3:00 PM – 6:00 PM", cutOff: "2026-08-26T18:00:00+08:00", expectedArrival: "2026-08-27T09:30:00+08:00", actualArrival: "2026-08-27T09:24:00+08:00", itemCount: 12, amount: 18220.75, status: "returned" },
  { id: "set-07", reference: "BAT-2026-0826-P3", rail: "PESONet", window: "3:00 PM – 6:00 PM", cutOff: "2026-08-26T18:00:00+08:00", expectedArrival: "2026-08-27T09:30:00+08:00", actualArrival: "2026-08-27T09:18:00+08:00", itemCount: 167, amount: 884150.4, status: "settled" },
  { id: "set-08", reference: "BAT-2026-0826-I3", rail: "InstaPay", window: "12:00 PM – 3:00 PM", cutOff: "2026-08-26T15:00:00+08:00", expectedArrival: "2026-08-26T15:25:00+08:00", actualArrival: "2026-08-26T15:21:00+08:00", itemCount: 188, amount: 296410.2, status: "settled" },
  { id: "set-09", reference: "BAT-2026-0826-Q2", rail: "QR Ph", window: "9:00 AM – 12:00 PM", cutOff: "2026-08-26T12:00:00+08:00", expectedArrival: "2026-08-26T12:40:00+08:00", actualArrival: "2026-08-26T12:33:00+08:00", itemCount: 377, amount: 74805.15, status: "settled" },
  { id: "set-10", reference: "BAT-2026-0825-P3", rail: "PESONet", window: "3:00 PM – 6:00 PM", cutOff: "2026-08-25T18:00:00+08:00", expectedArrival: "2026-08-26T09:30:00+08:00", actualArrival: "2026-08-26T09:47:00+08:00", itemCount: 154, amount: 1042880.6, status: "delayed" },
  { id: "set-11", reference: "BAT-2026-0825-I1", rail: "InstaPay", window: "6:00 AM – 9:00 AM", cutOff: "2026-08-25T09:00:00+08:00", expectedArrival: "2026-08-25T09:25:00+08:00", actualArrival: "2026-08-25T09:19:00+08:00", itemCount: 142, amount: 221640.5, status: "settled" },
  { id: "set-12", reference: "BAT-2026-0825-Q1", rail: "QR Ph", window: "6:00 AM – 9:00 AM", cutOff: "2026-08-25T09:00:00+08:00", expectedArrival: "2026-08-25T09:40:00+08:00", actualArrival: "2026-08-25T09:31:00+08:00", itemCount: 298, amount: 61220.85, status: "settled" },
  { id: "set-13", reference: "BAT-2026-0824-P2", rail: "PESONet", window: "11:00 AM – 3:00 PM", cutOff: "2026-08-24T15:00:00+08:00", expectedArrival: "2026-08-24T17:30:00+08:00", actualArrival: "2026-08-24T17:12:00+08:00", itemCount: 139, amount: 758300.0, status: "settled" },
  { id: "set-14", reference: "BAT-2026-0824-R4", rail: "InstaPay", window: "3:00 PM – 6:00 PM", cutOff: "2026-08-24T18:00:00+08:00", expectedArrival: "2026-08-24T18:25:00+08:00", actualArrival: "2026-08-24T18:20:00+08:00", itemCount: 8, amount: 12480.4, status: "returned" },
];

/**
 * The next cut-off the settlement view leads with. Demo data — verify
 * against the rail's published schedule before showing it to a merchant.
 */
export const nextCutOff = {
  rail: "PESONet" as Rail,
  time: "3:00 PM",
  date: formatDate(TODAY_ISO),
  batchLabel: "batch 2 of 3",
  cutOffIso: "2026-08-27T15:00:00+08:00",
};

// ---------------------------------------------------------------------------
// Derived helpers
// ---------------------------------------------------------------------------

const SUCCESS_STATUSES: readonly TransactionStatus[] = ["settled", "awaiting_settlement", "pending"];

/** Gross volume of the given rows, in PHP. */
export function getVolume(rows: Transaction[]): number {
  return round2(rows.reduce((sum, t) => sum + t.amount, 0));
}

/** Fees retained across the given rows, in PHP. */
export function getFees(rows: Transaction[]): number {
  return round2(rows.reduce((sum, t) => sum + t.fee, 0));
}

/** Net due to merchants across the given rows, in PHP. */
export function getNet(rows: Transaction[]): number {
  return round2(rows.reduce((sum, t) => sum + t.net, 0));
}

/**
 * Percentage (0-100) of rows that did not fail, reverse or go into
 * dispute. Returns `100` for an empty set, so a filtered-to-zero view
 * never shows a phantom 0% failure rate.
 */
export function getSuccessRate(rows: Transaction[]): number {
  if (rows.length === 0) return 100;
  const ok = rows.filter((t) => SUCCESS_STATUSES.includes(t.status)).length;
  return round2((ok / rows.length) * 100);
}

export function getFailureCount(rows: Transaction[]): number {
  return rows.filter((t) => t.status === "failed").length;
}

/** Volume, count and share per rail, ordered by the `RAILS` constant. */
export function getVolumeByRail(rows: Transaction[]): RailBreakdown[] {
  const total = getVolume(rows);
  return RAILS.map((rail) => {
    const subset = rows.filter((t) => t.rail === rail);
    const volume = getVolume(subset);
    return {
      rail,
      volume,
      count: subset.length,
      share: total === 0 ? 0 : round2((volume / total) * 100),
    };
  });
}

/** Every headline figure for a set of rows, in one pass. */
export function getTotals(rows: Transaction[]): PeriodTotals {
  const volume = getVolume(rows);
  return {
    volume,
    count: rows.length,
    fees: getFees(rows),
    net: getNet(rows),
    successRate: getSuccessRate(rows),
    failed: getFailureCount(rows),
    averageTicket: rows.length === 0 ? 0 : round2(volume / rows.length),
  };
}

/**
 * Change from `previous` to `current`.
 *
 * `unit: "percentage-point"` formats the label as `+0.4pp` rather than a
 * percent-of-a-percent, which is the wrong reading for a rate.
 */
export function getDelta(
  current: number,
  previous: number,
  unit: "percent" | "percentage-point" | "count" = "percent",
): Delta {
  const value = round2(current - previous);
  const percent = previous === 0 ? 0 : round2(((current - previous) / previous) * 100);
  const direction: Delta["direction"] = value > 0 ? "up" : value < 0 ? "down" : "flat";
  const sign = value > 0 ? "+" : "";

  let label: string;
  if (unit === "percentage-point") label = `${sign}${value.toFixed(1)}pp`;
  else if (unit === "count") label = `${sign}${formatCount(value)}`;
  else label = `${previous === 0 ? "—" : `${sign}${percent.toFixed(1)}%`}`;

  return { value, percent, direction, label };
}

// ---------------------------------------------------------------------------
// Time series
// ---------------------------------------------------------------------------

export const PERIOD_OPTIONS: { value: Period; label: string; short: string }[] = [
  { value: "today", label: "Today", short: "1D" },
  { value: "7d", label: "Last 7 days", short: "7D" },
  { value: "30d", label: "Last 30 days", short: "30D" },
  { value: "quarter", label: "This quarter", short: "QTR" },
];

/**
 * Series are authored per rail per period rather than aggregated from
 * `transactions`, because the transaction list is a readable sample
 * (60 rows) while the charts show production-scale volume. Both are demo
 * data; they are internally consistent in shape, not in absolute totals.
 * Values are gross volume in PHP.
 */
const SERIES_BY_PERIOD: Record<Period, { labels: string[]; byRail: Record<Rail, number[]> }> = {
  today: {
    labels: ["12 AM", "2 AM", "4 AM", "6 AM", "8 AM", "10 AM", "12 PM", "2 PM", "4 PM"],
    byRail: {
      InstaPay: [4200, 2100, 1400, 6800, 18400, 26100, 31200, 28600, 19800],
      PESONet: [0, 0, 0, 3200, 22600, 41800, 38400, 44900, 12200],
      "QR Ph": [1800, 900, 600, 2400, 7600, 12800, 19400, 16200, 9100],
    },
  },
  "7d": {
    labels: ["21 Aug", "22 Aug", "23 Aug", "24 Aug", "25 Aug", "26 Aug", "27 Aug"],
    byRail: {
      InstaPay: [142800, 118400, 96200, 168900, 181300, 174600, 138600],
      PESONet: [286400, 231900, 198600, 342100, 368700, 351200, 163100],
      "QR Ph": [68200, 54100, 47800, 79400, 86300, 82900, 70800],
    },
  },
  "30d": {
    labels: [
      "29 Jul", "30 Jul", "31 Jul", "1 Aug", "2 Aug", "3 Aug", "4 Aug", "5 Aug", "6 Aug", "7 Aug",
      "8 Aug", "9 Aug", "10 Aug", "11 Aug", "12 Aug", "13 Aug", "14 Aug", "15 Aug", "16 Aug", "17 Aug",
      "18 Aug", "19 Aug", "20 Aug", "21 Aug", "22 Aug", "23 Aug", "24 Aug", "25 Aug", "26 Aug", "27 Aug",
    ],
    byRail: {
      InstaPay: [
        121400, 128900, 134200, 112600, 89300, 76400, 141800, 149200, 152600, 147900,
        138400, 94100, 81600, 156300, 161800, 158200, 149600, 143100, 98700, 86200,
        164900, 171300, 166800, 142800, 118400, 96200, 168900, 181300, 174600, 138600,
      ],
      PESONet: [
        248600, 256100, 271400, 224800, 141200, 118600, 288300, 302700, 311900, 298400,
        276100, 152800, 129400, 318600, 331200, 324700, 306900, 291400, 164300, 138900,
        338400, 352100, 344600, 286400, 231900, 198600, 342100, 368700, 351200, 163100,
      ],
      "QR Ph": [
        58200, 61400, 64800, 56100, 44600, 39800, 68300, 71900, 74600, 72100,
        67400, 48200, 42900, 76800, 80100, 78400, 74200, 70600, 51300, 45800,
        82600, 86900, 84100, 68200, 54100, 47800, 79400, 86300, 82900, 70800,
      ],
    },
  },
  quarter: {
    labels: [
      "W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12", "W13",
    ],
    byRail: {
      InstaPay: [612400, 648900, 671200, 704800, 689300, 742600, 768100, 796400, 812600, 847900, 871400, 908200, 921600],
      PESONet: [1248600, 1291400, 1334800, 1382100, 1341200, 1428600, 1476300, 1512700, 1548900, 1602400, 1651800, 1712600, 1744100],
      "QR Ph": [268200, 291400, 314800, 336100, 328600, 362800, 384300, 401900, 424600, 452100, 478400, 506800, 531200],
    },
  },
};

/**
 * Totals per period, authored alongside the series so the stat row and the
 * chart tell the same story, plus the matching previous-period figures the
 * deltas are computed from.
 */
const TOTALS_BY_PERIOD: Record<Period, { current: PeriodTotals; previous: PeriodTotals }> = {
  today: {
    current: { volume: 372480.55, count: 1284, fees: 2186.4, net: 370294.15, successRate: 98.6, failed: 18, averageTicket: 290.09 },
    previous: { volume: 344250.1, count: 1246, fees: 2048.9, net: 342201.2, successRate: 98.2, failed: 24, averageTicket: 276.29 },
  },
  "7d": {
    current: { volume: 2464200.0, count: 8942, fees: 14806.2, net: 2449393.8, successRate: 98.4, failed: 143, averageTicket: 275.58 },
    previous: { volume: 2288640.0, count: 8614, fees: 13921.4, net: 2274718.6, successRate: 97.9, failed: 181, averageTicket: 265.69 },
  },
  "30d": {
    current: { volume: 10486320.0, count: 37684, fees: 62918.5, net: 10423401.5, successRate: 98.1, failed: 716, averageTicket: 278.27 },
    previous: { volume: 9612480.0, count: 35412, fees: 58204.3, net: 9554275.7, successRate: 97.6, failed: 850, averageTicket: 271.45 },
  },
  quarter: {
    current: { volume: 29841600.0, count: 104238, fees: 179049.6, net: 29662550.4, successRate: 98.3, failed: 1772, averageTicket: 286.28 },
    previous: { volume: 26104800.0, count: 93816, fees: 156628.8, net: 25948171.2, successRate: 97.4, failed: 2439, averageTicket: 278.25 },
  },
};

/**
 * Everything a period switcher needs for one period: axis labels, one
 * series per rail, current and previous totals, and the deltas between
 * them. Pure and deterministic — safe to call during render.
 */
export function getPeriodData(period: Period): PeriodData {
  const source = SERIES_BY_PERIOD[period];
  const { current, previous } = TOTALS_BY_PERIOD[period];

  return {
    period,
    label: PERIOD_OPTIONS.find((p) => p.value === period)?.label ?? "Last 7 days",
    labels: source.labels,
    series: RAILS.map((rail) => ({ name: rail, values: source.byRail[rail] })),
    totals: current,
    previousTotals: previous,
    deltas: {
      volume: getDelta(current.volume, previous.volume),
      count: getDelta(current.count, previous.count),
      net: getDelta(current.net, previous.net),
      successRate: getDelta(current.successRate, previous.successRate, "percentage-point"),
      failed: getDelta(current.failed, previous.failed, "count"),
    },
  };
}

/** Total volume per bucket across all rails, for a single-series chart. */
export function getPeriodTotalSeries(period: Period): ChartSeries {
  const source = SERIES_BY_PERIOD[period];
  return {
    name: "All rails",
    values: source.labels.map((_, i) =>
      RAILS.reduce((sum, rail) => sum + source.byRail[rail][i], 0),
    ),
  };
}

/**
 * Net settled per day across the last seven days, for the settlements
 * view's bar chart.
 */
export const settlementSeries: { labels: string[]; series: ChartSeries[] } = {
  labels: ["21 Aug", "22 Aug", "23 Aug", "24 Aug", "25 Aug", "26 Aug", "27 Aug"],
  series: [
    { name: "Net settled", values: [472600, 389400, 321200, 574800, 618300, 592100, 1284930.2] },
    { name: "Returned", values: [8400, 12480, 6200, 12480, 9100, 18220.75, 18220.75] },
  ],
};

/** The settlement view's hero figures. */
export const settlementTotals = {
  settledToday: 1284930.2,
  inWindow: 312440.0,
  returned: 18220.75,
  batchesToday: 5,
};

// ---------------------------------------------------------------------------
// Filtering
// ---------------------------------------------------------------------------

export type TransactionFilters = {
  /** `"all"` or a specific rail. */
  rail?: Rail | "all";
  /** `"all"` or a specific status. */
  status?: TransactionStatus | "all";
  /** Free text, matched against reference, merchant and customer. */
  query?: string;
  /** `"all"` or a calendar day as `YYYY-MM-DD`. */
  day?: string | "all";
};

/**
 * The single filter implementation every variant shares, so three
 * dashboards can't drift into three different definitions of "matches".
 * Matching is case-insensitive and ignores surrounding whitespace.
 */
export function filterTransactions(
  rows: Transaction[],
  { rail = "all", status = "all", query = "", day = "all" }: TransactionFilters,
): Transaction[] {
  const needle = query.trim().toLowerCase();
  return rows.filter((t) => {
    if (rail !== "all" && t.rail !== rail) return false;
    if (status !== "all" && t.status !== status) return false;
    if (day !== "all" && !t.date.startsWith(day)) return false;
    if (needle) {
      const haystack = `${t.reference} ${t.merchant} ${t.customer} ${t.rail}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });
}

/** Distinct calendar days present in the data, newest first. */
export const transactionDays: string[] = Array.from(
  new Set(transactions.map((t) => t.date.slice(0, 10))),
).sort((a, b) => b.localeCompare(a));
