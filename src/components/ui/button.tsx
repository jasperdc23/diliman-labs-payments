import type { ButtonHTMLAttributes, ReactNode } from "react";
import { CircleNotch } from "@phosphor-icons/react/ssr";
import styles from "./button.module.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  /** Renders a square button with no label — `aria-label` becomes required. */
  iconOnly?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
};

const iconSize = { sm: 14, md: 16, lg: 18 } as const;

export function Button({
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  iconOnly = false,
  loading = false,
  fullWidth = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    iconOnly && styles.iconOnly,
    fullWidth && styles.full,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <CircleNotch size={iconSize[size]} weight="bold" className={styles.spinner} />
      ) : (
        iconLeft
      )}
      {!iconOnly && children}
      {!loading && iconRight}
    </button>
  );
}
