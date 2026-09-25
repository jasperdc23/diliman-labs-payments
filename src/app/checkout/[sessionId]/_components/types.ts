/** Shared types for the checkout flow's client-side state machine. */

/** `"processing"` is a micro-step between confirm and status, not a step a
 * customer picks through — the progress indicator maps it back onto step 3. */
export type CheckoutStep = "method" | "details" | "confirm" | "processing" | "status";

/** Outcomes the prototype test control can simulate on step 3. */
export type CheckoutOutcome = "success" | "failed" | "pending" | "cancelled" | "expired";

export type ContactDetails = {
  name: string;
  email: string;
  phone: string;
};

/** Only collected when the merged "Card" method is selected — see
 * step-method.tsx's CARD_METHOD_ID. Never sent anywhere for real (there is
 * no gateway behind this prototype); kept in memory for the duration of the
 * flow only, the same as every other field here. */
export type CardDetails = {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
};

export const EMPTY_CARD: CardDetails = { number: "", expiry: "", cvv: "", name: "" };

/** Everything captured about one "Pay" attempt, generated the moment the
 * customer clicks Pay — a real user action, not authored dataset. */
export type PaymentAttempt = {
  reference: string;
  outcome: CheckoutOutcome;
  channelId: string;
  /** ISO timestamp captured at the moment of the attempt. */
  timestamp: string;
};
