"use client";

import { useEffect, useRef, useState } from "react";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { channels } from "@/app/dashboard/_data/payments";
import type { CheckoutSession } from "../../_data/sessions";
import { CheckoutAside } from "./checkout-aside";
import { CheckoutFooter } from "./checkout-footer";
import { OrderSummary } from "./order-summary";
import { StepProgress } from "./step-progress";
import { CARD_METHOD_ID, StepMethod, detectCardBrand } from "./step-method";
import { StepDetails } from "./step-details";
import { StepConfirm, StepProcessing } from "./step-confirm";
import { StepStatus } from "./step-status";
import { EMPTY_CARD, type CardDetails, type CheckoutOutcome, type CheckoutStep, type ContactDetails, type PaymentAttempt } from "./types";
import styles from "./checkout.module.css";

/** Fixed UI-transition delay for the simulated "processing" state — not
 * authored dataset, just a one-off animation timing, so a literal is fine
 * here (see the module-level rule in `_data/sessions.ts` and the dashboard
 * dataset it mirrors, which is about reproducible data, not UI timing). */
const PROCESSING_DELAY_MS = 1100;

const EMPTY_CONTACT: ContactDetails = { name: "", email: "", phone: "" };

export function CheckoutFlow({ session }: { session: CheckoutSession }) {
  const [step, setStep] = useState<CheckoutStep>("method");
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [card, setCard] = useState<CardDetails>(EMPTY_CARD);
  const [contact, setContact] = useState<ContactDetails>(EMPTY_CONTACT);
  const [consent, setConsent] = useState(false);
  const [simulatedOutcome, setSimulatedOutcome] = useState<CheckoutOutcome>("success");
  const [attempt, setAttempt] = useState<PaymentAttempt | null>(null);
  const [cancelPending, setCancelPending] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // The merged Card row isn't a real channel — resolve it to whichever
  // network the typed number matches (falling back to the first enabled
  // card channel if the number's too short to tell yet), the same way a
  // real gateway works out the network from the PAN, not from which of two
  // pre-sorted buttons the customer clicked.
  const resolvedChannel =
    selectedChannelId === CARD_METHOD_ID
      ? (channels.find(
          (c) => c.enabled && c.type === "card" && c.name === detectCardBrand(card.number),
        ) ?? channels.find((c) => c.enabled && c.type === "card") ?? null)
      : (channels.find((c) => c.id === selectedChannelId) ?? null);
  const selectedChannel = resolvedChannel;

  function pay() {
    setStep("processing");
    const reference = `PAY-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const outcome = simulatedOutcome;
    const channelId = resolvedChannel?.id ?? "";
    timeoutRef.current = setTimeout(() => {
      setAttempt({
        reference,
        outcome,
        channelId,
        // A real user action (clicking Pay) is exactly the case this kit's
        // "no Date.now" rule doesn't cover — see the rule's own scope note
        // in `_data/sessions.ts` and `payments.ts`, which is about the
        // authored dataset staying reproducible, not about timestamping a
        // live interaction.
        timestamp: new Date().toISOString(),
      });
      setStep("status");
    }, PROCESSING_DELAY_MS);
  }

  function cancelPayment() {
    setAttempt({
      reference: `PAY-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      outcome: "cancelled",
      channelId: selectedChannelId ?? "",
      timestamp: new Date().toISOString(),
    });
    setStep("status");
    setCancelPending(false);
  }

  function tryAgain() {
    // Failed payment: back to step 1 to pick a different method, per the
    // flow spec — but keep the details already entered rather than
    // restarting the whole form.
    setAttempt(null);
    setStep("method");
  }

  const showCancelAffordance = step === "method" || step === "details" || step === "confirm";

  return (
    <div className={`${styles.page} mesh`}>
      <div className={styles.layout}>
        {/* Desktop-only left pane (≥1024px) — merchant identity, order
            summary and trust copy, persistent across every step. Hidden
            below the breakpoint via .aside itself; the mobile header block
            below carries the same information there. */}
        <CheckoutAside session={session} step={step} />

        <div className={styles.mainColumn}>
          <div className={styles.mainContent}>
            <div className={styles.mobileHeader}>
              <div className={styles.merchantHeader}>
                <span className={styles.merchantEyebrow}>You&apos;re paying</span>
                <span className={styles.merchantName}>{session.merchantName}</span>
              </div>

              <OrderSummary session={session} />

              {step !== "status" && <StepProgress step={step} />}
            </div>

            {step === "method" && (
              <StepMethod
                channels={channels}
                selectedId={selectedChannelId}
                onSelect={setSelectedChannelId}
                card={card}
                onCardChange={setCard}
                onContinue={() => setStep("details")}
              />
            )}

            {step === "details" && (
              <StepDetails
                contact={contact}
                onChange={setContact}
                consent={consent}
                onConsentChange={setConsent}
                onBack={() => setStep("method")}
                onContinue={() => setStep("confirm")}
              />
            )}

            {step === "confirm" && selectedChannel && (
              <StepConfirm
                session={session}
                channel={selectedChannel}
                contact={contact}
                outcome={simulatedOutcome}
                onOutcomeChange={setSimulatedOutcome}
                onBack={() => setStep("details")}
                onPay={pay}
              />
            )}

            {step === "processing" && <StepProcessing />}

            {step === "status" && attempt && (
              <StepStatus
                session={session}
                channel={selectedChannel}
                attempt={attempt}
                contact={contact}
                onTryAgain={tryAgain}
              />
            )}

            {showCancelAffordance && (
              <button
                type="button"
                onClick={() => setCancelPending(true)}
                className="self-center text-text-tertiary hover:underline"
                style={{ fontSize: "var(--text-xs)" }}
              >
                Cancel payment
              </button>
            )}

            <CheckoutFooter />
          </div>
        </div>
      </div>

      {/* Bottom-right theme switch. Fixed once there's an empty gutter for
          it to float in (the desktop form pane is anchored to the centre,
          leaving the right side clear); below that breakpoint the page is
          full-bleed, so a floating control would sit on top of payment
          rows — there it's the last thing on the page instead. */}
      <div className={styles.themeCorner}>
        <ThemeToggle />
      </div>

      <AlertDialog
        open={cancelPending}
        onOpenChange={setCancelPending}
        title="Cancel this payment?"
        description={`You'll be taken back to ${session.merchantName} and nothing will be charged. Anything you entered will be lost.`}
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={() => setCancelPending(false)}>
              Keep going
            </Button>
            <Button variant="danger" size="sm" onClick={cancelPayment}>
              Cancel payment
            </Button>
          </>
        }
      />
    </div>
  );
}
