"use client";

import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import styles from "./toggle.module.css";

type ToggleProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
  /** Controlled pressed state. Omit to let Toggle manage it internally. */
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  size?: "sm" | "md" | "lg";
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
};

/**
 * A single pressable on/off button — a UI action with two visual states
 * (e.g. "bold" in a text toolbar, a favorite/star toggle), not a form
 * value. It renders a real `<button aria-pressed>`, never a checkbox
 * styled as a button. For a settings-style boolean that belongs to a form
 * and gets submitted with it, use `Switch` instead.
 */
export function Toggle({
  pressed,
  defaultPressed = false,
  onPressedChange,
  size = "md",
  iconLeft,
  iconRight,
  disabled,
  className = "",
  children,
  onClick,
  ...props
}: ToggleProps) {
  const [internalPressed, setInternalPressed] = useState(defaultPressed);
  const isControlled = pressed !== undefined;
  const isPressed = isControlled ? pressed : internalPressed;

  return (
    <button
      type="button"
      className={`${styles.toggle} ${styles[size]} ${className}`}
      aria-pressed={isPressed}
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event);
        const next = !isPressed;
        if (!isControlled) setInternalPressed(next);
        onPressedChange?.(next);
      }}
      {...props}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
