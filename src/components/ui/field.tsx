import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from "react";
import { Label } from "./label";
import styles from "./field.module.css";

/**
 * The subset of props Field writes onto its child control. A control only
 * needs to accept these — it does not need any Field-specific API.
 */
type FieldControlProps = {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  "aria-required"?: boolean;
};

type FieldProps = {
  label: ReactNode;
  /**
   * The control this field wraps — a Select, a Slider, a custom widget,
   * anything that accepts `id`, `aria-describedby`, `aria-invalid` and
   * `aria-required`. Field clones this single element and injects those
   * props directly (via `cloneElement`), rather than trying to thread
   * context through an arbitrary tree. If the control doesn't render its
   * own `id`/`aria-*` attributes from props, pass them through manually
   * instead of relying on Field to inject them invisibly.
   */
  children: ReactElement<FieldControlProps>;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  id?: string;
  className?: string;
};

export function Field({
  label,
  children,
  description,
  error,
  required = false,
  id,
  className = "",
}: FieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;
  const invalid = Boolean(error);

  const describedBy =
    [description ? descriptionId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  const control = isValidElement(children)
    ? cloneElement<FieldControlProps>(children, {
        id: children.props.id ?? fieldId,
        "aria-describedby":
          [describedBy, children.props["aria-describedby"]].filter(Boolean).join(" ") ||
          undefined,
        "aria-invalid": invalid || children.props["aria-invalid"],
        "aria-required": required || children.props["aria-required"],
      })
    : children;

  return (
    <div className={`${styles.root} ${className}`}>
      <Label htmlFor={fieldId} required={required}>
        {label}
      </Label>
      {control}
      {description && !error && (
        <p id={descriptionId} className={styles.helper}>
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} className={styles.helper} data-invalid="true" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
