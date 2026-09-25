"use client";

import { Flask, LockSimple } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { formatPeso, type CheckoutSession } from "../../_data/sessions";
import type { Channel } from "@/app/dashboard/_data/payments";
import { ChannelBadge } from "./channel-badge";
import type { CheckoutOutcome, ContactDetails } from "./types";
import styles from "./checkout.module.css";

const OUTCOME_OPTIONS: { value: CheckoutOutcome; label: string }[] = [
  { value: "success", label: "Success" },
  { value: "failed", label: "Failed" },
  { value: "pending", label: "Pending" },
  { value: "cancelled", label: "Cancelled" },
  { value: "expired", label: "Expired" },
];

type StepConfirmProps = {
  session: CheckoutSession;
  channel: Channel;
  contact: ContactDetails;
  outcome: CheckoutOutcome;
  onOutcomeChange: (outcome: CheckoutOutcome) => void;
  onBack: () => void;
  onPay: () => void;
};

export function StepConfirm({
  session,
  channel,
  contact,
  outcome,
  onOutcomeChange,
  onBack,
  onPay,
}: StepConfirmProps) {
  return (
    <div className={styles.stepCard}>
      <h1 className={styles.stepHeading}>Confirm payment</h1>

      <dl className={styles.statusDetails} style={{ marginTop: 0, borderTop: "none", paddingTop: 0 }}>
        <div className={styles.statusDetailRow}>
          <dt className={styles.statusDetailLabel}>Merchant</dt>
          <dd className={styles.statusDetailValue}>{session.merchantName}</dd>
        </div>
        <div className={styles.statusDetailRow}>
          <dt className={styles.statusDetailLabel}>For</dt>
          <dd className={styles.statusDetailValue}>{session.description}</dd>
        </div>
        <div className={styles.statusDetailRow}>
          <dt className={styles.statusDetailLabel}>Pay with</dt>
          <dd className={`${styles.statusDetailValue} ${styles.statusDetailChannel}`}>
            <ChannelBadge name={channel.name} size={20} />
            {channel.name}
          </dd>
        </div>
        <div className={styles.statusDetailRow}>
          <dt className={styles.statusDetailLabel}>Name</dt>
          <dd className={styles.statusDetailValue}>{contact.name}</dd>
        </div>
        <div className={styles.statusDetailRow}>
          <dt className={styles.statusDetailLabel}>Email</dt>
          <dd className={styles.statusDetailValue}>{contact.email}</dd>
        </div>
        <div className={styles.statusDetailRow}>
          <dt className={styles.statusDetailLabel}>Phone</dt>
          <dd className={styles.statusDetailValue}>{contact.phone}</dd>
        </div>
        <div className={styles.statusDetailRow}>
          <dt className={styles.statusDetailLabel}>Amount</dt>
          <dd className={styles.statusDetailValue} style={{ fontSize: "var(--text-base)" }}>
            {formatPeso(session.amount)}
          </dd>
        </div>
      </dl>

      <div className={styles.prototypeAside}>
        <span className={styles.prototypeLabel}>
          <Flask size={14} weight="fill" aria-hidden="true" />
          Prototype: simulate an outcome
        </span>
        <p className="text-text-tertiary opacity-50" style={{ fontSize: "var(--text-xs)" }}>
          There is no real payment gateway behind this demo. Pick what
          clicking &quot;Pay&quot; should resolve to.
        </p>
        <div className={styles.outcomeGrid} role="radiogroup" aria-label="Simulated outcome">
          {OUTCOME_OPTIONS.map((option) => {
            const selected = option.value === outcome;
            return (
              <label key={option.value} className={styles.outcomeOption} data-selected={selected}>
                <input
                  type="radio"
                  name="simulated-outcome"
                  value={option.value}
                  checked={selected}
                  onChange={() => onOutcomeChange(option.value)}
                />
                {option.label}
              </label>
            );
          })}
        </div>
      </div>

      <p className={styles.securityCue}>
        <LockSimple size={14} weight="fill" aria-hidden="true" />
        Your payment details are encrypted in transit.
      </p>

      <div className="flex" style={{ gap: "var(--space-3)" }}>
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button fullWidth onClick={onPay}>
          Pay {formatPeso(session.amount)}
        </Button>
      </div>
    </div>
  );
}

export function StepProcessing() {
  return (
    <div className={styles.stepCard}>
      <div className={styles.processing}>
        <Spinner size={28} label="Processing your payment" />
        <span className={styles.processingTitle}>Processing your payment securely</span>
        <p className={styles.securityCue}>
          <LockSimple size={14} weight="fill" aria-hidden="true" />
          Your payment details are encrypted in transit.
        </p>
      </div>
    </div>
  );
}
