import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Flask } from "@phosphor-icons/react/ssr";
import { checkoutSessions, formatPeso } from "./_data/sessions";
import styles from "./[sessionId]/_components/checkout.module.css";

export const metadata: Metadata = {
  title: "Checkout demo sessions — Diliman Labs",
  description: "Prototype picker for the Diliman Labs hosted checkout.",
};

/**
 * NOT a real entry point — a real customer always lands on
 * `/checkout/[sessionId]` from a link or embed the merchant generates. This
 * bare `/checkout` route only exists so a reviewer can jump into any of the
 * four demo sessions without hand-editing a URL. The framing below (eyebrow,
 * copy, icon) is deliberately labeled as a prototype tool, not staged to
 * look like something a paying customer would ever see.
 */
export default function CheckoutDemoPickerPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-6 py-16 sm:px-8">
      <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
        <span
          className="inline-flex w-fit items-center border"
          style={{
            gap: "var(--space-2)",
            padding: "var(--space-1) var(--space-3)",
            borderRadius: "var(--radius-full)",
            borderColor: "color-mix(in srgb, var(--accent-text) 32%, transparent)",
            background: "var(--accent-subtle)",
            color: "var(--accent-text)",
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-bold)",
            letterSpacing: "var(--tracking-caps)",
            textTransform: "uppercase",
          }}
        >
          <Flask size={14} weight="fill" aria-hidden="true" />
          Prototype demo picker
        </span>
        <h1
          className="text-text-primary"
          style={{ fontSize: "var(--text-3xl)", fontWeight: "var(--weight-black)" }}
        >
          Checkout demo sessions
        </h1>
        <p className="text-text-secondary" style={{ fontSize: "var(--text-sm)", maxWidth: "38rem" }}>
          A real customer never sees this page — they land directly on a
          session link a merchant generates. This list exists so you can open
          any of the four sample sessions below and walk the checkout as a
          customer would, across different merchant shapes.
        </p>
      </div>

      <ul className="flex flex-col" style={{ gap: "var(--space-3)", marginTop: "var(--space-12)" }}>
        {checkoutSessions.map((session) => (
          <li key={session.id}>
            <Link href={`/checkout/${session.id}`} className={styles.demoCard}>
              <span className={styles.demoAvatar} aria-hidden="true">
                {session.merchantName.charAt(0)}
              </span>
              <span className={styles.demoBody}>
                <span className={styles.demoName}>{session.merchantName}</span>
                <span className={styles.demoMeta}>
                  {session.merchantKind} · {session.description}
                </span>
              </span>
              <span className={styles.demoTrailing}>
                <span className={styles.demoAmount}>{formatPeso(session.amount)}</span>
                <ArrowRight size={16} weight="bold" aria-hidden="true" className="text-text-tertiary" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
