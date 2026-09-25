import { LockSimple, ShieldCheck } from "@phosphor-icons/react/ssr";
import { formatPeso, getBreakdown, type CheckoutSession } from "../../_data/sessions";
import { StepProgress } from "./step-progress";
import type { CheckoutStep } from "./types";
import styles from "./checkout.module.css";

/**
 * Left pane of the two-pane desktop checkout shell (≥1024px, see .layout /
 * .aside in checkout.module.css) — the merchant identity, order summary,
 * total amount and trust copy, persistent across every step including the
 * status screen, so the customer never loses track of who they're paying or
 * how much while they move through the flow. This is the natural home for
 * the content that's squeezed into the thin horizontal OrderSummary card on
 * narrower viewports.
 *
 * A restrained, neutral surface (--surface-sunken) — this is white-label,
 * so nothing here reaches for the ink/grain brand treatment the Ops
 * Console's login panel uses. The merchant's own name is the only thing
 * rendered large.
 *
 * Hidden below 1024px via .aside's own media query; checkout-flow.tsx's
 * mobile header block (merchant name + OrderSummary + horizontal progress)
 * carries this same information there instead.
 */
export function CheckoutAside({ session, step }: { session: CheckoutSession; step: CheckoutStep }) {
  const { subtotal, fee, total } = getBreakdown(session);

  return (
    <aside className={styles.aside} aria-label="Order summary">
      <div className={styles.asideInner}>
        <div className={styles.merchantHeader}>
          <span className={styles.merchantEyebrow}>You&apos;re paying</span>
          <span className={styles.merchantName}>{session.merchantName}</span>
        </div>

        <div className={styles.asideAmountBlock}>
          <span className={styles.asideAmountLabel}>Total amount</span>
          <span className={styles.asideAmount}>{formatPeso(session.amount)}</span>
          <span className={styles.asideDescription}>{session.description}</span>
        </div>

        {/* Subtotal + fee breakdown — what "Total amount" above is actually
            made of, so the number isn't just asserted. */}
        <dl className={styles.breakdown}>
          <div className={styles.breakdownRow}>
            <dt>Subtotal</dt>
            <dd>{formatPeso(subtotal)}</dd>
          </div>
          <div className={styles.breakdownRow}>
            <dt>Processing fee</dt>
            <dd>{formatPeso(fee)}</dd>
          </div>
          <div className={`${styles.breakdownRow} ${styles.breakdownTotal}`}>
            <dt>Total</dt>
            <dd>{formatPeso(total)}</dd>
          </div>
        </dl>

        <div className={styles.asideDivider} aria-hidden="true" />

        {step !== "status" && (
          <div className={styles.asideProgress}>
            <StepProgress step={step} orientation="vertical" />
          </div>
        )}

        <div className={styles.asideSecurity}>
          <p className={styles.asideSecurityRow}>
            <LockSimple size={14} weight="fill" aria-hidden="true" />
            Your payment details are encrypted in transit.
          </p>
          <p className={styles.asideSecurityRow}>
            <ShieldCheck size={14} weight="fill" aria-hidden="true" />
            Every session is monitored for fraud before it settles.
          </p>
        </div>
      </div>
    </aside>
  );
}
