import Image from "next/image";

// Intrinsic size of the supplied wordmark, used to derive width from height.
const RATIO = 775 / 226;

/**
 * Renders both wordmark assets and lets the cascade pick one.
 *
 * The mark is ink-on-transparent, so it vanishes on a dark ground and needs
 * the white variant there. That choice can't be made from the theme alone:
 * an ink sidebar in LIGHT mode has no theme signal, and a yellow panel
 * inside an ink frame wants the ink mark back. The rules live in
 * globals.css (`.brand-mark-ink` / `.brand-mark-light`) keyed off
 * `[data-theme]` and `[data-surface]`, which nest correctly where JS
 * reading `resolvedTheme` could not — and this drops the pre-hydration
 * blank box along with the client boundary.
 *
 * Cost is one extra small PNG fetch. `alt` stays on the ink copy only, so
 * the mark is announced once.
 */
export function BrandMark({ height = 24, className = "" }: { height?: number; className?: string }) {
  const width = Math.round(height * RATIO);

  return (
    <span className={`relative inline-flex ${className}`} style={{ height, width }}>
      <Image
        src="/brand/diliman-labs-wordmark.png"
        alt="Diliman Labs"
        height={height}
        width={width}
        priority
        className="brand-mark-ink"
      />
      <Image
        src="/brand/diliman-labs-wordmark-light.png"
        alt=""
        aria-hidden
        height={height}
        width={width}
        className="brand-mark-light absolute inset-0"
      />
    </span>
  );
}
