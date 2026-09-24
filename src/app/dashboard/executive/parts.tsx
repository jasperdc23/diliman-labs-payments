"use client";

import type { ReactNode } from "react";
import { ArrowRight, TrendDown, TrendUp } from "@phosphor-icons/react/ssr";
import type { Delta } from "../_data/payments";
import styles from "./brief.module.css";

/** The all-caps micro-label the whole brief is ruled by. */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`${styles.eyebrow} ${className}`}>{children}</p>;
}

/**
 * A period-over-period change.
 *
 * `goodDirection` decouples the arrow from the color: a falling failure
 * count is good news and must not paint red just because the number went
 * down. Colors come from the surface's own --success / --danger, so the
 * tag is legible on white, on ink and on the yellow panel without props.
 */
export function DeltaTag({
  delta,
  goodDirection = "up",
  caption,
}: {
  delta: Delta;
  goodDirection?: "up" | "down";
  caption?: ReactNode;
}) {
  const tone =
    delta.direction === "flat" ? "flat" : delta.direction === goodDirection ? "good" : "bad";
  const color =
    tone === "good" ? "var(--success)" : tone === "bad" ? "var(--danger)" : "var(--text-tertiary)";
  const Icon = delta.direction === "down" ? TrendDown : TrendUp;

  return (
    <span
      className="flex flex-wrap items-baseline"
      style={{ gap: "var(--space-2)", fontSize: "var(--text-sm)" }}
    >
      <span
        className="inline-flex items-center tabular-nums"
        style={{ gap: "var(--space-1)", color, fontWeight: "var(--weight-bold)" }}
      >
        {delta.direction === "flat" ? null : (
          <Icon size={16} weight="bold" aria-hidden="true" />
        )}
        {delta.label}
        <span className="sr-only">
          {delta.direction === "up"
            ? " increase"
            : delta.direction === "down"
              ? " decrease"
              : " no change"}
        </span>
      </span>
      {caption ? <span className="text-text-tertiary">{caption}</span> : null}
    </span>
  );
}

/**
 * An oversized headline figure that opens its own breakdown.
 *
 * A real <button>, so it keeps the global focus ring and is reachable by
 * keyboard; the yellow rule above it is a fill and carries --accent-edge.
 */
export function Figure({
  label,
  value,
  delta,
  goodDirection,
  caption,
  hint,
  onOpen,
}: {
  label: string;
  value: string;
  delta?: Delta;
  goodDirection?: "up" | "down";
  caption?: ReactNode;
  hint: string;
  onOpen: () => void;
}) {
  return (
    <button type="button" className={styles.figureButton} onClick={onOpen}>
      <span
        aria-hidden="true"
        className={`${styles.block} ${styles.blockWide}`}
        style={{ display: "block" }}
      />
      <span className={styles.eyebrow}>{label}</span>
      <span className={styles.figureValue}>{value}</span>
      {delta ? <DeltaTag delta={delta} goodDirection={goodDirection} caption={caption} /> : null}
      <span className={styles.figureHint}>
        {hint}
        <ArrowRight size={12} weight="bold" aria-hidden="true" />
      </span>
    </button>
  );
}

/** A label/value pair for the dense strips under a headline figure. */
export function MicroStat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col" style={{ gap: "var(--space-1)" }}>
      <span className={styles.eyebrow}>{label}</span>
      <span className={styles.subValue}>{value}</span>
      {sub ? (
        <span className="text-text-tertiary" style={{ fontSize: "var(--text-sm)" }}>
          {sub}
        </span>
      ) : null}
    </div>
  );
}
