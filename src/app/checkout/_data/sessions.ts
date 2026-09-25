/**
 * Mock "payment session" dataset for the hosted checkout prototype.
 *
 * Same rule as `src/app/dashboard/_data/payments.ts`: DETERMINISTIC BY
 * CONSTRUCTION. No `Math.random`, no `Date.now`, no `new Date()` without an
 * explicit argument — every session below is a hand-authored literal, so a
 * static build and every screenshot stay reproducible. This is separate
 * prototype data for the *customer-facing* checkout surface, not the ops
 * console's ledger — it intentionally doesn't reuse `transactions`/
 * `merchants` from the dashboard dataset, since a checkout session is a
 * different kind of record (an unpaid intent, not a settled transfer).
 *
 * Four sessions, chosen to demonstrate the white-label range this checkout
 * has to support: a small retailer, a subscription/SaaS merchant, a
 * marketplace, and an events/ticketing merchant.
 */

export type CheckoutSession = {
  id: string;
  /** The merchant's own name — this is the prominent identity on the page. */
  merchantName: string;
  /** Short line describing what the merchant sells, for the demo picker only. */
  merchantKind: string;
  /** The line item / order description shown in the order summary. */
  description: string;
  /** Amount due, in PHP — the TOTAL the customer is charged (fee included). */
  amount: number;
  /** The processing fee folded into `amount`, hand-authored per session so
   * the breakdown (subtotal + fee = total) is always internally consistent
   * without any runtime math generating the dataset itself. */
  feeAmount: number;
  currency: "PHP";
  /** Where "Back to {merchant}" sends the customer once the flow ends. */
  returnUrl: string;
};

export const checkoutSessions: CheckoutSession[] = [
  {
    id: "bayani-mart-4821",
    merchantName: "Bayani Mart",
    merchantKind: "Small retailer",
    description: "Order #BM-4821 — 2 items",
    amount: 1845.0,
    feeAmount: 27.68,
    currency: "PHP",
    returnUrl: "https://bayanimart.ph/orders/BM-4821",
  },
  {
    id: "kalye-analytics-pro",
    merchantName: "Kalye Analytics",
    merchantKind: "Subscription / SaaS",
    description: "Pro plan — monthly subscription",
    amount: 2499.0,
    feeAmount: 37.49,
    currency: "PHP",
    returnUrl: "https://kalyeanalytics.com/billing",
  },
  {
    id: "palengke-marketplace-7721",
    merchantName: "Palengke Marketplace",
    merchantKind: "Marketplace",
    description: "Order #PM-7721 — 3 items from 2 sellers",
    amount: 3260.75,
    feeAmount: 48.91,
    currency: "PHP",
    returnUrl: "https://palengkemarketplace.ph/checkout/PM-7721",
  },
  {
    id: "tambayan-tickets-2201",
    merchantName: "Tambayan Tickets",
    merchantKind: "Events / ticketing",
    description: "General admission — Manila Indie Fest 2026, 2 tickets",
    amount: 1600.0,
    feeAmount: 24.0,
    currency: "PHP",
    returnUrl: "https://tambayantickets.ph/orders/2201/confirmation",
  },
];

/** Subtotal + processing fee = the session's `amount` (the total charged).
 * A plain derivation off already-authored literals, not dataset generation
 * — same category as `railShares`/`getTotals` elsewhere in this kit. */
export function getBreakdown(session: CheckoutSession): {
  subtotal: number;
  fee: number;
  total: number;
} {
  return {
    subtotal: session.amount - session.feeAmount,
    fee: session.feeAmount,
    total: session.amount,
  };
}

const sessionsById = new Map(checkoutSessions.map((s) => [s.id, s]));

/** `undefined` when the id is unknown — the page renders a not-found state. */
export function getCheckoutSession(id: string): CheckoutSession | undefined {
  return sessionsById.get(id);
}

const pesoFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** `₱1,234.56` — same house format as the dashboard's `formatPeso`, kept
 * local so this customer-facing surface has no dependency on the ops
 * console's dataset module. */
export function formatPeso(value: number): string {
  return pesoFormatter.format(value);
}
