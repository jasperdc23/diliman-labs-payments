import type { LabelHTMLAttributes, ReactNode } from "react";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  children: ReactNode;
  /**
   * Marks the associated control as required. Rendered as a trailing
   * asterisk rather than an "(optional)" suffix — most fields in a form
   * are required, so flagging the exception (an asterisk on the few that
   * are required) reads faster than flagging the common case.
   */
  required?: boolean;
};

export function Label({ children, required = false, style, ...props }: LabelProps) {
  return (
    <label
      style={{
        display: "block",
        fontSize: "var(--text-sm)",
        fontWeight: 500,
        color: "var(--text-primary)",
        ...style,
      }}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden style={{ color: "var(--danger)", marginLeft: "var(--space-1)" }}>
          *
        </span>
      )}
    </label>
  );
}
