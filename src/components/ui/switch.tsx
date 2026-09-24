"use client";

import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import styles from "./switch.module.css";

type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "role"> & {
  label?: ReactNode;
  description?: ReactNode;
};

export function Switch({
  label,
  description,
  disabled = false,
  id,
  className = "",
  ...props
}: SwitchProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = `${inputId}-description`;

  return (
    <div
      className={`${styles.root} ${className}`}
      data-disabled={disabled || undefined}
    >
      <span className={styles.control}>
        <input
          type="checkbox"
          role="switch"
          id={inputId}
          className={styles.input}
          disabled={disabled}
          aria-describedby={description ? descriptionId : undefined}
          {...props}
        />
        <span className={styles.track} aria-hidden>
          <span className={styles.knob} />
        </span>
      </span>

      {(label || description) && (
        <span className={styles.text}>
          {label && (
            <label htmlFor={inputId} className={styles.label}>
              {label}
            </label>
          )}
          {description && (
            <span id={descriptionId} className={styles.description}>
              {description}
            </span>
          )}
        </span>
      )}
    </div>
  );
}
