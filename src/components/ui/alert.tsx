"use client";

import type { ReactNode } from "react";
import { CheckCircle, Info, Warning, WarningOctagon, X } from "@phosphor-icons/react/ssr";
import styles from "./alert.module.css";

export type AlertVariant = "neutral" | "info" | "success" | "warning" | "danger";

type AlertProps = {
  variant?: AlertVariant;
  title: string;
  description?: ReactNode;
  /** Overrides the variant's default icon. Pass `null` to render no icon. */
  icon?: ReactNode | null;
  onDismiss?: () => void;
  dismissLabel?: string;
  className?: string;
};

const variantStyles: Record<AlertVariant, { background: string; color: string; border: string }> = {
  neutral: {
    background: "var(--surface-sunken)",
    color: "var(--text-secondary)",
    border: "var(--border-subtle)",
  },
  info: {
    background: "var(--accent-subtle)",
    color: "var(--accent)",
    border: "color-mix(in srgb, var(--accent) 24%, transparent)",
  },
  success: {
    background: "var(--success-subtle)",
    color: "var(--success)",
    border: "color-mix(in srgb, var(--success) 24%, transparent)",
  },
  warning: {
    background: "color-mix(in srgb, var(--warning) 12%, var(--surface))",
    color: "var(--warning)",
    border: "color-mix(in srgb, var(--warning) 24%, transparent)",
  },
  danger: {
    background: "var(--danger-subtle)",
    color: "var(--danger)",
    border: "color-mix(in srgb, var(--danger) 24%, transparent)",
  },
};

const defaultIcons: Record<AlertVariant, ReactNode> = {
  neutral: <Info size={20} weight="fill" />,
  info: <Info size={20} weight="fill" />,
  success: <CheckCircle size={20} weight="fill" />,
  warning: <Warning size={20} weight="fill" />,
  danger: <WarningOctagon size={20} weight="fill" />,
};

/**
 * An inline banner that sits in page flow — at the top of a form after a
 * failed submission, above a table filtered to zero rows, and so on. It is
 * NOT a floating overlay and does not auto-dismiss; that's what `Toast`
 * (`src/components/ui/toast.tsx`) is for. Reach for Alert when the message
 * is a direct consequence of what's on screen and the person should keep
 * seeing it until they act; reach for Toast when it's a transient
 * notification about something that just happened elsewhere.
 */
export function Alert({
  variant = "info",
  title,
  description,
  icon,
  onDismiss,
  dismissLabel = "Dismiss",
  className = "",
}: AlertProps) {
  const tone = variantStyles[variant];
  const resolvedIcon = icon === undefined ? defaultIcons[variant] : icon;

  return (
    <div
      role={variant === "danger" || variant === "warning" ? "alert" : "status"}
      className={`${styles.alert} ${className}`}
      style={{
        background: tone.background,
        borderColor: tone.border,
      }}
    >
      {resolvedIcon && (
        <span aria-hidden className={styles.icon} style={{ color: tone.color }}>
          {resolvedIcon}
        </span>
      )}
      <div className={styles.body}>
        <p className={styles.title}>{title}</p>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {onDismiss && (
        <button type="button" onClick={onDismiss} aria-label={dismissLabel} className={styles.dismiss}>
          <X size={16} weight="bold" />
        </button>
      )}
    </div>
  );
}
