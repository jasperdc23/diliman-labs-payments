"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import styles from "./modal.module.css";

export type AlertDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  /** Rendered in the footer — typically a cancel action and a confirm
   *  action. There is no icon-X close button and no backdrop-click
   *  dismissal: an alert dialog forces an explicit choice, so the only way
   *  out is one of these actions (or Escape, which behaves like Cancel). */
  actions: ReactNode;
};

/**
 * A stricter, smaller sibling of Modal built on the same native `<dialog>`
 * mechanics (see modal.tsx) — it reuses modal.module.css directly rather
 * than forking the centering fix or the size scale, since nothing about
 * an alert dialog's box model differs from Modal's. What differs is
 * behavior: no close button, no backdrop dismissal, `role="alertdialog"`.
 */
export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  actions,
}: AlertDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      role="alertdialog"
      aria-labelledby={titleId}
      className={`glass grain ${styles.dialog} ${styles.sm}`}
      onCancel={(event) => {
        event.preventDefault();
        onOpenChange(false);
      }}
      onClose={() => {
        if (open) onOpenChange(false);
      }}
    >
      <div className="flex max-h-[inherit] flex-col">
        <header
          className="flex flex-col border-b border-border-subtle"
          style={{ gap: "var(--space-1)", padding: "var(--space-6)" }}
        >
          <h2
            id={titleId}
            className="font-semibold text-text-primary"
            style={{ fontSize: "var(--text-lg)", lineHeight: "var(--leading-tight)" }}
          >
            {title}
          </h2>
          {description ? (
            <p className="text-text-secondary" style={{ fontSize: "var(--text-sm)" }}>
              {description}
            </p>
          ) : null}
        </header>

        {children ? (
          <div
            className={`min-h-0 text-text-secondary ${styles.body}`}
            style={{ padding: "var(--space-6)", fontSize: "var(--text-sm)" }}
          >
            {children}
          </div>
        ) : null}

        <footer
          className="flex items-center justify-end border-t border-border-subtle"
          style={{ gap: "var(--space-3)", padding: "var(--space-6)" }}
        >
          {actions}
        </footer>
      </div>
    </dialog>
  );
}
