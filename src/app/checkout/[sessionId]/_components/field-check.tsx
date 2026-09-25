"use client";

import { CheckCircle } from "@phosphor-icons/react/ssr";
import styles from "./checkout.module.css";

/**
 * The "this field is good" tick that appears the moment a field validates.
 *
 * Rendered only when `valid` is true, so it animates in on the transition
 * rather than sitting there greyed out — an always-present indicator that
 * merely changes color reads as decoration, while one that appears reads
 * as feedback. The entrance is a keyframe animation, which globals.css's
 * `prefers-reduced-motion` block collapses to near-zero on its own.
 */
export function FieldCheck({ valid, label }: { valid: boolean; label?: string }) {
  if (!valid) return null;

  return (
    <span className={styles.fieldCheck}>
      <CheckCircle size={16} weight="fill" aria-hidden="true" />
      {label && <span className={styles.fieldCheckLabel}>{label}</span>}
      <span className="sr-only">Valid</span>
    </span>
  );
}

/** The whole-form confirmation — one line that says the card is ready,
 * rather than making the customer infer it from four separate ticks. */
export function FormVerified({ show, children }: { show: boolean; children: React.ReactNode }) {
  if (!show) return null;

  return (
    <p className={styles.formVerified}>
      <CheckCircle size={16} weight="fill" aria-hidden="true" />
      {children}
    </p>
  );
}
