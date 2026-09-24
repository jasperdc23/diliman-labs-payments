import type { ReactNode } from "react";

/**
 * A small, generic status/position indicator: a colored dot with an
 * optional label. See the assumption noted at the top of /docs/marker —
 * the source request named this component with no definition attached, so
 * this is one reasonable reading (a legend swatch, a timeline-step marker,
 * a standalone live/online dot), not an established pattern.
 */

export type MarkerTone = "success" | "warning" | "danger" | "neutral" | "accent";
export type MarkerSize = "sm" | "md";

const TONE_COLOR: Record<MarkerTone, string> = {
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--danger)",
  neutral: "var(--text-tertiary)",
  accent: "var(--accent)",
};

const SIZE_DOT: Record<MarkerSize, string> = {
  sm: "0.5rem",
  md: "0.625rem",
};

type MarkerProps = {
  tone?: MarkerTone;
  size?: MarkerSize;
  label?: ReactNode;
  className?: string;
};

export function Marker({ tone = "neutral", size = "md", label, className = "" }: MarkerProps) {
  return (
    <span className={`inline-flex items-center ${className}`} style={{ gap: "var(--space-2)" }}>
      <span
        aria-hidden={Boolean(label)}
        role={label ? undefined : "img"}
        aria-label={label ? undefined : `Status: ${tone}`}
        className="inline-block shrink-0 rounded-full"
        style={{
          width: SIZE_DOT[size],
          height: SIZE_DOT[size],
          background: TONE_COLOR[tone],
          // A bare yellow swatch is 1.24:1 on white, and the swatch is the
          // only thing carrying series identity. --accent-edge resolves to
          // transparent inside a surface scope, where the fill needs no help.
          boxShadow: tone === "accent" ? "inset 0 0 0 1px var(--accent-edge)" : undefined,
        }}
      />
      {label && (
        <span
          className="text-text-secondary"
          style={{ fontSize: size === "sm" ? "var(--text-xs)" : "var(--text-sm)" }}
        >
          {label}
        </span>
      )}
    </span>
  );
}
