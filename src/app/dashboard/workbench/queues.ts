/**
 * Payment Workbench — queue definitions and the mutation model.
 *
 * Everything here is pure except `actionTimestamp` (a monotonic counter)
 * and `downloadCsv` (touches `document`). Both are only ever reached from
 * a click handler, so nothing in this module runs during render or on the
 * server, and the prototype stays hydration-safe.
 *
 * The prototype mutates payments in React state rather than a store: the
 * dataset is fixed and local, and an override map keyed by transaction id
 * is the smallest thing that makes every action visibly change the screen.
 */

import {
  STATUS_LABEL,
  type Rail,
  type TimelineEvent,
  type Transaction,
  type TransactionStatus,
  TODAY_ISO,
  filterTransactions,
} from "../_data/payments";

// ---------------------------------------------------------------------------
// Saved queues
// ---------------------------------------------------------------------------

export type QueueId = "review" | "failed" | "awaiting" | "disputed" | "all";

export type QueueDef = {
  id: QueueId;
  label: string;
  /** One line explaining what lands here, shown under the queue title. */
  hint: string;
  matches: (status: TransactionStatus) => boolean;
};

/**
 * Five saved views over the same 60 rows. Every one is non-empty on a
 * fresh load, and they genuinely differ — "Failed" and "Disputed" are
 * subsets of "Needs review" the way saved views in a real triage tool
 * overlap, while "Awaiting settlement" shares no rows with any of them.
 */
export const QUEUES: QueueDef[] = [
  {
    id: "review",
    label: "Needs review",
    hint: "Everything an analyst has to touch by hand: failed, reversed and disputed payments.",
    matches: (s) => s === "failed" || s === "reversed" || s === "disputed",
  },
  {
    id: "failed",
    label: "Failed",
    hint: "Rejected by the receiving institution. Retry or approve a manual credit.",
    matches: (s) => s === "failed",
  },
  {
    id: "awaiting",
    label: "Awaiting settlement",
    hint: "Cleared or still clearing, not yet credited to the merchant.",
    matches: (s) => s === "awaiting_settlement" || s === "pending",
  },
  {
    id: "disputed",
    label: "Disputed",
    hint: "A payer has filed a dispute. Evidence is due before the rail's response window closes.",
    matches: (s) => s === "disputed",
  },
  {
    id: "all",
    label: "All payments",
    hint: "Every payment in the window, whatever its state.",
    matches: () => true,
  },
];

export function getQueue(id: QueueId): QueueDef {
  return QUEUES.find((q) => q.id === id) ?? QUEUES[0];
}

// ---------------------------------------------------------------------------
// Overrides — the prototype's mutation layer
// ---------------------------------------------------------------------------

export type Override = {
  status?: TransactionStatus;
  flagged?: boolean;
  /** Appended to the payment's authored timeline, never replacing it. */
  events?: TimelineEvent[];
};

export type OverrideMap = Record<string, Override>;

/** The payment as it stands after everything the analyst has done to it. */
export function applyOverride(tx: Transaction, override: Override | undefined): Transaction {
  if (!override) return tx;
  return {
    ...tx,
    status: override.status ?? tx.status,
    timeline:
      override.events && override.events.length > 0
        ? [...tx.timeline, ...override.events]
        : tx.timeline,
  };
}

export function isFlagged(overrides: OverrideMap, id: string): boolean {
  return overrides[id]?.flagged === true;
}

/** True once the analyst has done anything at all to this payment. */
export function isTouched(overrides: OverrideMap, id: string): boolean {
  const o = overrides[id];
  return Boolean(o && (o.status || o.flagged || (o.events && o.events.length > 0)));
}

// ---------------------------------------------------------------------------
// Which actions apply to which state
// ---------------------------------------------------------------------------

/** Approving forces a credit through: only meaningful while money is stuck. */
export function canApprove(status: TransactionStatus): boolean {
  return (
    status === "failed" ||
    status === "pending" ||
    status === "disputed" ||
    status === "awaiting_settlement"
  );
}

/** Only a rail rejection can be resubmitted. */
export function canRetry(status: TransactionStatus): boolean {
  return status === "failed";
}

/** You can only return money that actually reached the merchant. */
export function canRefund(status: TransactionStatus): boolean {
  return status === "settled" || status === "disputed" || status === "awaiting_settlement";
}

/**
 * Deterministic retry outcome, so the failure path is reachable on demand
 * rather than by luck — and so the same payment behaves the same way every
 * time the prototype is demoed. Even reference numbers are rejected twice.
 */
export function retrySucceeds(tx: Transaction): boolean {
  const digits = Number(tx.reference.replace(/\D/g, ""));
  return digits % 2 === 1;
}

// ---------------------------------------------------------------------------
// Timestamps for analyst actions
// ---------------------------------------------------------------------------

const MANILA = "Asia/Manila";

const manilaParts = new Intl.DateTimeFormat("en-CA", {
  timeZone: MANILA,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function shiftIso(iso: string, minutes: number): string {
  const parts = manilaParts.formatToParts(new Date(new Date(iso).getTime() + minutes * 60_000));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  const hour = get("hour") === "24" ? "00" : get("hour");
  return `${get("year")}-${get("month")}-${get("day")}T${hour}:${get("minute")}:${get("second")}+08:00`;
}

let tick = 0;

/**
 * Each analyst action is stamped one minute after the previous one,
 * starting from the prototype's fixed "now". `Date.now()` would produce a
 * different string on the server than in the browser and blow up
 * hydration; this only ever runs from a click handler and still reads as
 * a plausible sequence in the timeline.
 */
export function actionTimestamp(): string {
  tick += 1;
  return shiftIso(TODAY_ISO, tick);
}

/** Resets the action clock — used only by tests and the reset control. */
export function resetActionClock(): void {
  tick = 0;
}

// ---------------------------------------------------------------------------
// Sorting
// ---------------------------------------------------------------------------

export type SortId = "newest" | "oldest" | "amount-desc" | "amount-asc" | "merchant";

export const SORT_OPTIONS: { value: SortId; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "amount-desc", label: "Amount: high to low" },
  { value: "amount-asc", label: "Amount: low to high" },
  { value: "merchant", label: "Merchant A–Z" },
];

export function sortRows(rows: Transaction[], sort: SortId): Transaction[] {
  const copy = [...rows];
  switch (sort) {
    case "oldest":
      return copy.sort((a, b) => a.date.localeCompare(b.date));
    case "amount-desc":
      return copy.sort((a, b) => b.amount - a.amount);
    case "amount-asc":
      return copy.sort((a, b) => a.amount - b.amount);
    case "merchant":
      return copy.sort((a, b) => a.merchant.localeCompare(b.merchant) || b.date.localeCompare(a.date));
    case "newest":
    default:
      return copy.sort((a, b) => b.date.localeCompare(a.date));
  }
}

// ---------------------------------------------------------------------------
// The one place the visible row set is computed
// ---------------------------------------------------------------------------

export type ViewState = {
  queueId: QueueId;
  rail: Rail | "all";
  query: string;
  flaggedOnly: boolean;
  sort: SortId;
};

/**
 * Queue bucket → shared filter → flag filter → sort. Shared between the
 * render memo and the handlers that need to know what the list will look
 * like *after* a change (to re-point the selection), so the two can never
 * disagree about what is on screen.
 */
export function computeVisible(
  rows: Transaction[],
  view: ViewState,
  overrides: OverrideMap,
): Transaction[] {
  const queue = getQueue(view.queueId);
  const inQueue = rows.filter((t) => queue.matches(t.status));
  // filterTransactions is the shared definition of "matches" — reference,
  // merchant, customer and rail, case-insensitive and trimmed.
  const matched = filterTransactions(inQueue, { rail: view.rail, query: view.query });
  const flagged = view.flaggedOnly ? matched.filter((t) => isFlagged(overrides, t.id)) : matched;
  return sortRows(flagged, view.sort);
}

/** True when a filter — not the queue itself — is what emptied the list. */
export function hasActiveFilters(view: ViewState): boolean {
  return view.query.trim() !== "" || view.rail !== "all" || view.flaggedOnly;
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

function csvCell(value: string): string {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/**
 * Amounts go out as bare numbers, not `₱1,234.56`: a CSV is opened in a
 * spreadsheet to reconcile against a statement, and a currency symbol plus
 * thousands separators turns every figure into text.
 */
export function toCsv(rows: Transaction[]): string {
  const header = [
    "Reference",
    "Timestamp (Asia/Manila)",
    "Merchant",
    "Customer",
    "Rail",
    "Status",
    "Amount PHP",
    "Fee PHP",
    "Net PHP",
  ];
  const body = rows.map((t) => [
    t.reference,
    t.date,
    t.merchant,
    t.customer,
    t.rail,
    STATUS_LABEL[t.status],
    t.amount.toFixed(2),
    t.fee.toFixed(2),
    t.net.toFixed(2),
  ]);
  return [header, ...body].map((row) => row.map(csvCell).join(",")).join("\r\n");
}

/** Real download, not a stub — the file lands in the browser's downloads. */
export function downloadCsv(filename: string, csv: string): void {
  // The BOM is what makes Excel read ₱-denominated UTF-8 files correctly.
  const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// DOM ids
// ---------------------------------------------------------------------------

/**
 * The workbench moves focus between three panes, so a handful of elements
 * need stable ids. They live here rather than in a component so the pane
 * that moves focus doesn't have to import the pane it moves focus into.
 */
export const SEARCH_INPUT_ID = "workbench-queue-search";
export const DETAIL_PANE_ID = "workbench-detail-pane";

/** Row buttons are focused by id — one lookup, no ref array to keep
 *  aligned with a list that re-sorts under the analyst. */
export function rowButtonId(transactionId: string): string {
  return `workbench-row-${transactionId}`;
}

// ---------------------------------------------------------------------------
// Copy helpers
// ---------------------------------------------------------------------------

export const RAIL_FILTER_OPTIONS: { value: Rail | "all"; label: string }[] = [
  { value: "all", label: "All rails" },
  { value: "InstaPay", label: "InstaPay" },
  { value: "PESONet", label: "PESONet" },
  { value: "QR Ph", label: "QR Ph" },
];

/** "3 payments" / "1 payment" — used in every toast and confirm dialog. */
export function plural(count: number, noun = "payment"): string {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}
