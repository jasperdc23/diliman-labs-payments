"use client";

import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { Check, Minus } from "@phosphor-icons/react/ssr";
import styles from "./checkbox.module.css";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: ReactNode;
  description?: ReactNode;
  indeterminate?: boolean;
  invalid?: boolean;
};

export function Checkbox({
  label,
  description,
  indeterminate = false,
  invalid = false,
  disabled = false,
  id,
  className = "",
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = `${inputId}-description`;

  return (
    <div
      className={`${styles.root} ${className}`}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
    >
      <span className={styles.control}>
        <input
          type="checkbox"
          id={inputId}
          className={styles.input}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={description ? descriptionId : undefined}
          ref={(node) => {
            if (node) node.indeterminate = indeterminate;
          }}
          {...props}
        />
        <span className={styles.box} aria-hidden>
          <span className={styles.icon}>
            {indeterminate ? <Minus weight="bold" /> : <Check weight="bold" />}
          </span>
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

type CheckboxGroupProps = {
  legend: ReactNode;
  helperText?: ReactNode;
  invalid?: boolean;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
};

export function CheckboxGroup({
  legend,
  helperText,
  invalid = false,
  disabled = false,
  children,
  className = "",
}: CheckboxGroupProps) {
  const groupId = useId();
  const helperId = `${groupId}-helper`;

  return (
    <fieldset
      className={`${styles.group} ${className}`}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      aria-describedby={helperText ? helperId : undefined}
    >
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.groupItems}>{children}</div>
      {helperText && (
        <p id={helperId} className={styles.groupHelper} data-invalid={invalid || undefined}>
          {helperText}
        </p>
      )}
    </fieldset>
  );
}
