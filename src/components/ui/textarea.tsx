import { useId, type TextareaHTMLAttributes } from "react";
import styles from "./textarea.module.css";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  helperText?: string;
  invalid?: boolean;
  /** "vertical" (default) lets the person resize height only; "none" removes the handle entirely. */
  resize?: "vertical" | "none";
};

export function Textarea({
  label,
  helperText,
  invalid = false,
  resize = "vertical",
  rows = 4,
  id,
  className = "",
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  return (
    <div>
      {label && (
        <label htmlFor={textareaId} className={styles.label}>
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={`${styles.textarea} ${className}`}
        data-resize={resize}
        data-invalid={invalid || undefined}
        aria-invalid={invalid || undefined}
        {...props}
      />
      {helperText && (
        <p className={styles.helper} data-invalid={invalid || undefined}>
          {helperText}
        </p>
      )}
    </div>
  );
}
