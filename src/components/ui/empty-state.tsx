import type { ReactNode } from "react";
import { Button } from "./button";

type EmptyStateAction = {
  label: string;
  onClick?: () => void;
};

type EmptyStateBaseProps = {
  /** Optional leading icon or illustration, e.g. a Phosphor icon at 32-40px. */
  icon?: ReactNode;
  /** States what's missing, plainly — e.g. "No transactions yet". */
  title: string;
  /** One sentence of context. */
  description?: string;
  className?: string;
};

/**
 * An empty state is never a dead end — it always offers a way back or a
 * next action. `action` (the primary "do something to fill this" path) and
 * `secondaryAction` (a lower-commitment way back, such as clearing a filter
 * or returning to a parent view) are each optional on their own, but the
 * type requires at least one of the two to be supplied. There is no prop
 * combination that renders icon + title + description with nothing to do
 * next.
 */
type EmptyStateProps = EmptyStateBaseProps &
  (
    | { action: EmptyStateAction; secondaryAction?: EmptyStateAction }
    | { action?: EmptyStateAction; secondaryAction: EmptyStateAction }
  );

function ActionButton({ action, variant }: { action: EmptyStateAction; variant: "primary" | "secondary" }) {
  return (
    <Button variant={variant} onClick={action.onClick}>
      {action.label}
    </Button>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center text-center ${className}`}
      style={{ gap: "var(--space-4)", padding: "var(--space-8)" }}
    >
      {icon ? (
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: "var(--space-16)",
            height: "var(--space-16)",
            background: "var(--surface-sunken)",
            color: "var(--text-tertiary)",
          }}
          aria-hidden="true"
        >
          {icon}
        </div>
      ) : null}
      <div className="flex flex-col" style={{ gap: "var(--space-1)" }}>
        <p className="font-semibold text-text-primary" style={{ fontSize: "var(--text-base)" }}>
          {title}
        </p>
        {description ? (
          <p
            className="text-text-tertiary"
            style={{ fontSize: "var(--text-sm)", maxWidth: "36ch" }}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action || secondaryAction ? (
        <div className="flex flex-wrap items-center justify-center" style={{ gap: "var(--space-3)" }}>
          {action ? <ActionButton action={action} variant="primary" /> : null}
          {secondaryAction ? <ActionButton action={secondaryAction} variant="secondary" /> : null}
        </div>
      ) : null}
    </div>
  );
}
