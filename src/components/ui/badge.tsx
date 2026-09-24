"use client";

import type { ReactNode } from "react";
import { X } from "@phosphor-icons/react/ssr";

type BadgeVariant = "neutral" | "accent" | "success" | "warning" | "danger";
type BadgeSize = "sm" | "md";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  icon?: ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
  className?: string;
};

const variantStyles: Record<BadgeVariant, { background: string; color: string; border: string }> = {
  neutral: {
    background: "var(--surface-sunken)",
    color: "var(--text-secondary)",
    border: "var(--border-subtle)",
  },
  accent: {
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

const sizeStyles: Record<BadgeSize, { padding: string; fontSize: string; gap: string; dot: string }> = {
  sm: {
    padding: "0 var(--space-2)",
    fontSize: "var(--text-xs)",
    gap: "var(--space-1)",
    dot: "0.375rem",
  },
  md: {
    padding: "var(--space-1) var(--space-3)",
    fontSize: "var(--text-sm)",
    gap: "var(--space-2)",
    dot: "0.5rem",
  },
};

export function Badge({
  children,
  variant = "neutral",
  size = "sm",
  dot = false,
  icon,
  onRemove,
  removeLabel,
  className = "",
}: BadgeProps) {
  const tone = variantStyles[variant];
  const scale = sizeStyles[size];

  return (
    <span
      className={`inline-flex items-center border font-medium whitespace-nowrap ${className}`}
      style={{
        background: tone.background,
        color: tone.color,
        borderColor: tone.border,
        borderRadius: "var(--radius-full)",
        padding: scale.padding,
        fontSize: scale.fontSize,
        gap: scale.gap,
        lineHeight: "var(--leading-normal)",
      }}
    >
      {dot && (
        <span
          aria-hidden
          className="shrink-0 rounded-full"
          style={{ width: scale.dot, height: scale.dot, background: "currentColor" }}
        />
      )}
      {icon && (
        <span aria-hidden className="inline-flex shrink-0 items-center">
          {icon}
        </span>
      )}
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel ?? `Remove ${typeof children === "string" ? children : "filter"}`}
          className="-mr-1 inline-flex shrink-0 items-center justify-center rounded-full opacity-70 transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:opacity-100"
          style={{ color: "currentColor" }}
        >
          <X size={size === "sm" ? 10 : 12} weight="bold" />
        </button>
      )}
    </span>
  );
}
