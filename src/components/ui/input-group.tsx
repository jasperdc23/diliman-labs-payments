import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import styles from "./input-group.module.css";

type InputGroupProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
  invalid?: boolean;
  /** Rendered inside the bordered box before the input — an icon or a unit like "₱". */
  leading?: ReactNode;
  /** Rendered inside the bordered box after the input — a unit like "PHP", or an attached action such as a "Paste" or show/hide-password button. */
  trailing?: ReactNode;
};

export function InputGroup({
  label,
  helperText,
  invalid = false,
  leading,
  trailing,
  id,
  className = "",
  disabled,
  ...props
}: InputGroupProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <div
        className={`${styles.group} ${className}`}
        data-invalid={invalid || undefined}
        data-disabled={disabled || undefined}
      >
        {leading && (
          <span className={styles.slot} data-position="leading">
            {leading}
          </span>
        )}
        <input
          id={inputId}
          className={styles.input}
          disabled={disabled}
          data-invalid={invalid || undefined}
          aria-invalid={invalid || undefined}
          {...props}
        />
        {trailing && (
          <span className={styles.slot} data-position="trailing">
            {trailing}
          </span>
        )}
      </div>
      {helperText && (
        <p className={styles.helper} data-invalid={invalid || undefined}>
          {helperText}
        </p>
      )}
    </div>
  );
}
