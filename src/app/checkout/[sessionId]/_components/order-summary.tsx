import type { CheckoutSession } from "../../_data/sessions";
import { formatPeso, getBreakdown } from "../../_data/sessions";
import styles from "./checkout.module.css";

/**
 * The persistent "what am I paying for" card, used below the two-pane
 * breakpoint where there's no left summary pane. Carries the same
 * subtotal/fee/total breakdown the desktop aside does — what the customer
 * is being charged and why shouldn't depend on their screen size.
 */
export function OrderSummary({ session }: { session: CheckoutSession }) {
  const { subtotal, fee, total } = getBreakdown(session);

  return (
    <div className={styles.summaryCard}>
      <div className={styles.summaryTop}>
        <span className={styles.summaryDescription}>{session.description}</span>
        <span className={styles.summaryAmount}>{formatPeso(total)}</span>
      </div>
      <dl className={styles.breakdown}>
        <div className={styles.breakdownRow}>
          <dt>Subtotal</dt>
          <dd>{formatPeso(subtotal)}</dd>
        </div>
        <div className={styles.breakdownRow}>
          <dt>Processing fee</dt>
          <dd>{formatPeso(fee)}</dd>
        </div>
      </dl>
    </div>
  );
}
