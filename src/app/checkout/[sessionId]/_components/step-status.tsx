"use client";

import type { ReactNode } from "react";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  DownloadSimple,
  HourglassMedium,
  MinusCircle,
  XCircle,
} from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/button";
import buttonStyles from "@/components/ui/button.module.css";
import { formatPeso, type CheckoutSession } from "../../_data/sessions";
import type { Channel } from "@/app/dashboard/_data/payments";
import { ChannelBadge } from "./channel-badge";
import { buildReceiptHtml, downloadReceipt } from "./receipt";
import type { ContactDetails, PaymentAttempt } from "./types";
import styles from "./checkout.module.css";

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

type StepStatusProps = {
  session: CheckoutSession;
  channel: Channel | null;
  attempt: PaymentAttempt;
  contact: ContactDetails;
  onTryAgain: () => void;
};

export function StepStatus({ session, channel, attempt, contact, onTryAgain }: StepStatusProps) {
  const when = timeFormatter.format(new Date(attempt.timestamp));

  function saveReceipt() {
    downloadReceipt(
      buildReceiptHtml({
        session,
        attempt,
        methodName: channel?.name ?? "—",
        contact,
      }),
      attempt.reference,
    );
  }

  return (
    <div className={styles.statusCard} role="status">
      {attempt.outcome === "success" && (
        <>
          <span className={styles.statusIcon} data-variant="success" aria-hidden="true">
            <CheckCircle size={32} weight="fill" />
          </span>
          <span className={styles.statusTitle}>Payment successful</span>
          <p className={styles.statusMessage}>
            {formatPeso(session.amount)} was paid to {session.merchantName}.
          </p>
          <dl className={styles.statusDetails}>
            <Row label="Reference">
              <span style={{ fontFamily: "var(--font-mono)" }}>{attempt.reference}</span>
            </Row>
            <Row label="Amount paid">{formatPeso(session.amount)}</Row>
            <Row label="Method">
              <MethodValue channel={channel} />
            </Row>
            <Row label="Date & time">{when}</Row>
          </dl>
          <p className={styles.statusMessage}>A receipt has been sent to your email address.</p>
          <Button
            variant="secondary"
            fullWidth
            iconLeft={<DownloadSimple size={16} weight="regular" />}
            onClick={saveReceipt}
          >
            Download receipt
          </Button>
        </>
      )}

      {attempt.outcome === "failed" && (
        <>
          <span className={styles.statusIcon} data-variant="danger" aria-hidden="true">
            <XCircle size={32} weight="fill" />
          </span>
          <span className={styles.statusTitle}>Payment failed</span>
          <p className={styles.statusMessage}>
            The payment was declined by the issuer, or the channel was
            temporarily unavailable. You have not been charged.
          </p>
          <dl className={styles.statusDetails}>
            <Row label="Reference">
              <span style={{ fontFamily: "var(--font-mono)" }}>{attempt.reference}</span>
            </Row>
            <Row label="Method">
              <MethodValue channel={channel} />
            </Row>
            <Row label="Date & time">{when}</Row>
          </dl>
          <Button onClick={onTryAgain} iconRight={<ArrowRight size={16} weight="bold" />}>
            Try again
          </Button>
        </>
      )}

      {attempt.outcome === "pending" && (
        <>
          <span className={styles.statusIcon} data-variant="warning" aria-hidden="true">
            <Clock size={32} weight="fill" />
          </span>
          <span className={styles.statusTitle}>Payment pending</span>
          <p className={styles.statusMessage}>
            {channel?.type === "bank" || channel?.type === "qr"
              ? "Your bank or QR Ph confirmation is still in progress. This can take a few minutes — you'll see the final status once it clears."
              : "Your payment is still being confirmed. This can take a few minutes."}
          </p>
          <dl className={styles.statusDetails}>
            <Row label="Reference">
              <span style={{ fontFamily: "var(--font-mono)" }}>{attempt.reference}</span>
            </Row>
            <Row label="Amount">{formatPeso(session.amount)}</Row>
            <Row label="Method">
              <MethodValue channel={channel} />
            </Row>
            <Row label="Date & time">{when}</Row>
          </dl>
        </>
      )}

      {attempt.outcome === "cancelled" && (
        <>
          <span className={styles.statusIcon} data-variant="neutral" aria-hidden="true">
            <MinusCircle size={32} weight="fill" />
          </span>
          <span className={styles.statusTitle}>Payment cancelled</span>
          <p className={styles.statusMessage}>
            You cancelled this payment. No amount was charged.
          </p>
          <dl className={styles.statusDetails}>
            <Row label="Reference">
              <span style={{ fontFamily: "var(--font-mono)" }}>{attempt.reference}</span>
            </Row>
            <Row label="Date & time">{when}</Row>
          </dl>
        </>
      )}

      {attempt.outcome === "expired" && (
        <>
          <span className={styles.statusIcon} data-variant="neutral" aria-hidden="true">
            <HourglassMedium size={32} weight="fill" />
          </span>
          <span className={styles.statusTitle}>Session expired</span>
          <p className={styles.statusMessage}>
            This checkout session timed out before the payment was completed.
            Ask {session.merchantName} for a new payment link to try again.
          </p>
          <dl className={styles.statusDetails}>
            <Row label="Reference">
              <span style={{ fontFamily: "var(--font-mono)" }}>{attempt.reference}</span>
            </Row>
            <Row label="Date & time">{when}</Row>
          </dl>
        </>
      )}

      {/* A real anchor, not a Button-wrapped-in-anchor (invalid HTML — a
          <button> can't nest inside an <a>), styled with the same secondary
          button classes so it reads identically to every other control on
          this screen. This is the explicit last element on every status
          screen, per the flow spec. */}
      <a
        href={session.returnUrl}
        className={`${buttonStyles.button} ${buttonStyles.secondary} ${buttonStyles.md} ${buttonStyles.full}`}
        style={{ marginTop: "var(--space-2)" }}
      >
        Back to {session.merchantName}
      </a>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.statusDetailRow}>
      <dt className={styles.statusDetailLabel}>{label}</dt>
      <dd className={styles.statusDetailValue}>{children}</dd>
    </div>
  );
}

function MethodValue({ channel }: { channel: Channel | null }) {
  if (!channel) return <>—</>;
  return (
    <span className={styles.statusDetailChannel}>
      <ChannelBadge name={channel.name} size={20} />
      {channel.name}
    </span>
  );
}
