import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/ssr";
import { BrandMark } from "@/components/brand-mark";

export const metadata: Metadata = {
  title: "Terms of Service — Diliman Labs Checkout",
  description: "Terms of Service for the Diliman Labs hosted checkout prototype.",
};

/**
 * Real, static content — not a dead "#" link. Kept short and honest: this
 * is a prototype, Diliman Labs is a BSP-supervised payment system operator,
 * and nothing here claims a certification (PCI DSS / SOC 2 / ISO) that
 * hasn't been obtained yet.
 */
export default function CheckoutTermsPage() {
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
        Terms of Service
      </h1>
      <p className="text-text-tertiary opacity-50" style={{ fontSize: "var(--text-xs)", marginBottom: "var(--space-8)" }}>
        Prototype document. Last reviewed 25 Sep 2026.
      </p>

      <div className="flex flex-col text-text-secondary" style={{ gap: "var(--space-6)", fontSize: "var(--text-sm)" }}>
        <p>
          This checkout page is operated by Eplayment Corporation, doing
          business under the Diliman Labs brand, a BSP-supervised Operator of
          Payment System in the Philippines. These terms cover payments made
          through this hosted checkout on behalf of the merchant shown at the
          top of the page.
        </p>

        <Section title="1. What this page does">
          This page collects a payment method and contact details on behalf
          of the merchant, and processes the payment through Diliman Labs&apos;
          payment rails. The merchant, not Diliman Labs, is the seller of the
          goods or services described in the order summary — disputes about
          the order itself (refunds, delivery, quality) are between you and
          the merchant.
        </Section>

        <Section title="2. Prototype notice">
          This is a demonstration build. No real payment gateway sits behind
          it — every outcome on this specific build is chosen by a
          reviewer for testing purposes and does not reflect a live
          transaction or move real money.
        </Section>

        <Section title="3. Your information">
          Name, email, and phone number are collected to confirm your
          payment and to send a receipt. See the{" "}
          <Link href="/checkout/privacy" className="font-medium text-accent-text hover:underline">
            Privacy Notice
          </Link>{" "}
          for how this information is handled under the Data Privacy Act of
          2012 (Republic Act No. 10173).
        </Section>

        <Section title="4. Security">
          Payment details are encrypted in transit. Diliman Labs is working
          toward PCI DSS, SOC 2, and ISO certification as part of its
          ongoing compliance program; these certifications are in progress
          and not yet held.
        </Section>

        <Section title="5. Contact">
          Questions about a specific payment should go to the merchant
          first. For questions about Diliman Labs as the payment system
          operator, contact{" "}
          <a
            href="mailto:support@dilimanlabs.ph"
            className="font-medium text-accent-text hover:underline"
          >
            support@dilimanlabs.ph
          </a>
          .
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
