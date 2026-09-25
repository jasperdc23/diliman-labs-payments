import type { Metadata } from "next";
import { Lifebuoy } from "@phosphor-icons/react/ssr";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Log in — Diliman Labs",
  description: "Sign in to the Diliman Labs payments console.",
};

// This project's documented imagery direction (see /docs/imagery and
// media-card.tsx): dark, high-contrast, heavily grained, with the brand
// yellow as a hard-edged graphic block rather than a flat tint — never a
// literal payments photo, since none exists yet, and never a UI screenshot
// standing in for one.
const PANEL_BACKGROUND = [
  "linear-gradient(155deg, transparent 0 42%, var(--accent) 42% 64%, transparent 64%)",
  "radial-gradient(85% 65% at 85% 8%, color-mix(in srgb, var(--gray-0) 12%, transparent) 0%, transparent 60%)",
  "var(--gray-1000)",
].join(", ");

export default function LoginPage() {
  return (
    <main className="grid min-h-screen w-full lg:grid-cols-[minmax(0,34rem)_1fr]">
      {/* Form side — full-bleed, fields sit directly on the page. The
          column itself is capped (not just the content), so the form
          isn't a small block adrift in a wide half of the screen. Relative,
          so the toggle anchors to this (themed) side rather than the ink
          brand panel, which has its own surface scope. */}
      <div className="relative flex flex-col items-center justify-center px-8 py-16 sm:px-16">
        <div className="absolute top-6 right-6 sm:top-8 sm:right-8">
          <ThemeToggle />
        </div>

        <div className="flex w-full max-w-sm flex-col gap-8">
          <BrandMark height={40} />

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
              Log in to your account
            </h1>
            <p className="text-sm text-text-secondary">
              Enter your email and password to sign in to the console.
            </p>
          </div>

          <LoginForm />

          <div className="flex flex-col items-start gap-3">
            <p className="flex items-center gap-2 text-sm text-text-secondary">
              <Lifebuoy size={16} weight="regular" aria-hidden="true" />
              Don&apos;t have access?{" "}
              <a
                href="mailto:support@dilimanlabs.ph?subject=Payments%20console%20access"
                className="font-medium text-accent-text hover:underline"
              >
                Contact support
              </a>
            </p>
            <p className="text-xs text-text-tertiary">
              Prototype login. See README for the demo credentials.
            </p>
          </div>
        </div>
      </div>

      {/* Brand side — this kit's photo treatment (dark, grained, yellow as
          a hard-edged block) standing in for payments imagery, full height,
          hidden below lg. */}
      <div
        data-surface="ink"
        className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-end"
        style={{ background: PANEL_BACKGROUND }}
      >
        <div className="photo-treatment" aria-hidden="true" />
        <div className="grain" aria-hidden="true" style={{ position: "absolute", inset: 0 }} />

        <div className="relative flex flex-col gap-3 p-12">
          <p className="max-w-sm text-3xl leading-snug font-semibold text-balance text-white">
            The easiest way to watch every payment.
          </p>
          <p className="text-sm text-white/70">Live rail health, settlements and disputes in one place.</p>
        </div>
      </div>
    </main>
  );
}
