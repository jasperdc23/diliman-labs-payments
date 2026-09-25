"use client";

import { use } from "react";
import Link from "next/link";
import { getCheckoutSession } from "../_data/sessions";
import { CheckoutFlow } from "./_components/checkout-flow";

export default function CheckoutSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  const session = getCheckoutSession(sessionId);

  if (!session) {
    return (
      <main className="mesh flex min-h-screen w-full flex-col items-center justify-center px-6 text-center">
        <div className="flex max-w-sm flex-col" style={{ gap: "var(--space-4)" }}>
          <h1
            className="text-text-primary"
            style={{ fontSize: "var(--text-xl)", fontWeight: "var(--weight-bold)" }}
          >
            Checkout session not found
          </h1>
          <p className="text-text-secondary" style={{ fontSize: "var(--text-sm)" }}>
            This payment link may have expired, or the session id in the URL
            doesn&apos;t match a demo session.
          </p>
          <Link
            href="/checkout"
            className="font-medium text-accent-text hover:underline"
            style={{ fontSize: "var(--text-sm)" }}
          >
            View demo sessions
          </Link>
        </div>
      </main>
    );
  }

  return <CheckoutFlow session={session} />;
}
