import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/ssr";
import { BrandMark } from "@/components/brand-mark";

export const metadata: Metadata = {
  title: "Privacy Notice — Diliman Labs Checkout",
  description: "Privacy Notice for the Diliman Labs hosted checkout prototype.",
};

/**
 * Real, static content — not a dead "#" link. References the Data Privacy
 * Act of 2012 (RA 10173) in plain terms, and does not claim any
 * certification Diliman Labs hasn't obtained yet.
 */
export default function CheckoutPrivacyPage() {
  return (
    <main className="mesh mx-auto flex min-h-screen w-full max-w-2xl flex-col px-6 py-16 sm:px-8">
      <Link
        href="/checkout"
        className="mb-8 inline-flex w-fit items-center text-text-secondary hover:text-text-primary"
        style={{ gap: "var(--space-2)", fontSize: "var(--text-sm)" }}
      >
        <ArrowLeft size={14} weight="bold" aria-hidden="true" />
        Back to checkout
      </Link>

      <BrandMark height={22} className="mb-8" />

      <h1
        className="text-text-primary"
        style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--weight-black)", marginBottom: "var(--space-2)" }}
      >
        Privacy Notice
      </h1>
      <p className="text-text-tertiary opacity-50" style={{ fontSize: "var(--text-xs)", marginBottom: "var(--space-8)" }}>
        Prototype document. Last reviewed 25 Sep 2026.
      </p>

      <div className="flex flex-col text-text-secondary" style={{ gap: "var(--space-6)", fontSize: "var(--text-sm)" }}>
        <p>
          Eplayment Corporation, operating as Diliman Labs, is a BSP-
          supervised Operator of Payment System. This notice explains how
          we handle personal data collected through this checkout page, in
          line with the Philippine Data Privacy Act of 2012 (Republic Act
          No. 10173) and its implementing rules.
        </p>

        <Section title="What we collect">
          On this page, that&apos;s your name, email address, and phone number,
          plus the payment method you choose. We don&apos;t ask for or store
          full card numbers, bank account numbers, one-time passwords, or
          government ID details on this page — those, where applicable, are
          handled by the relevant channel (your bank, e-wallet, or card
          network) directly.
        </Section>

        <Section title="Why we collect it">
          To process the payment shown in the order summary, confirm it
          with you, send a receipt, and resolve the payment with the
          merchant. We don&apos;t use these details to build a marketing profile
          of you.
        </Section>

        <Section title="Encryption and security">
          Your data is encrypted in transit between your browser and our
          servers. Diliman Labs is working toward PCI DSS, SOC 2, and ISO
          certification as part of an ongoing compliance program — these
          are in progress, not certifications already held.
        </Section>

        <Section title="Sharing">
          We share what&apos;s needed to complete the payment: with the
          merchant named on this page (so they can fulfill your order), and
          with the payment channel you chose (your bank, e-wallet, or card
          network) to clear the transaction. We don&apos;t sell personal data.
        </Section>

        <Section title="Your rights">
          Under the Data Privacy Act, you can ask to access, correct, or
          request deletion of your personal data, subject to our
          recordkeeping obligations as a regulated payment operator (some
          transaction records must be retained for BSP/AMLC compliance even
          after a deletion request). To exercise these rights, contact{" "}
          <a
            href="mailto:privacy@dilimanlabs.ph"
            className="font-medium text-accent-text hover:underline"
          >
            privacy@dilimanlabs.ph
          </a>
          .
        </Section>

        <Section title="Prototype notice">
          This is a demonstration build. No real payment is processed, and
          any details entered on this specific build are not retained
          beyond the session.
        </Section>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
      <h2
        className="text-text-primary"
        style={{ fontSize: "var(--text-base)", fontWeight: "var(--weight-semibold)" }}
      >
        {title}
      </h2>
      <p>{children}</p>
    </div>
  );
}
