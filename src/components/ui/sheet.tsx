"use client";

import { useEffect, useId, useRef } from "react";
import type { MouseEvent, ReactNode } from "react";
import { X } from "@phosphor-icons/react/ssr";
import styles from "./sheet.module.css";

export type SheetSide = "top" | "right" | "bottom" | "left";

export type SheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  /** Which screen edge the sheet slides in from. This also covers what a
   *  "Drawer" would be elsewhere — a drawer is just a Sheet anchored to
   *  the side, so there's no separate Drawer component in this kit. */
  side?: SheetSide;
  closeOnBackdropClick?: boolean;
};

/**
 * The same native-`<dialog>` mechanics as Modal (see modal.tsx) — showModal
 * / close synced from the `open` prop, `::backdrop` for the scrim — but
 * anchored to a screen edge with a slide-in transform instead of centered.
 */
export function Sheet({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  side = "right",
  closeOnBackdropClick = true,
}: SheetProps) {
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

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (closeOnBackdropClick && event.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className={`glass grain ${styles.dialog} ${styles[side]}`}
      onClick={handleBackdropClick}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={() => {
        if (open) onClose();
      }}
    >
      <div className="flex h-full max-h-[inherit] flex-col">
        <header
          className="flex items-start justify-between border-b border-border-subtle"
          style={{ gap: "var(--space-4)", padding: "var(--space-6)" }}
        >
          <div className="flex flex-col" style={{ gap: "var(--space-1)" }}>
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
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sheet"
            className="text-text-tertiary flex shrink-0 items-center justify-center transition-[background-color,color] duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:bg-surface-sunken hover:text-text-primary"
            style={{
              width: "var(--space-8)",
              height: "var(--space-8)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <X size={18} weight="regular" aria-hidden="true" />
          </button>
        </header>

        {children ? (
          <div
            className={`min-h-0 flex-1 text-text-secondary ${styles.body}`}
            style={{ padding: "var(--space-6)", fontSize: "var(--text-sm)" }}
          >
            {children}
          </div>
        ) : null}

        {footer ? (
          <footer
            className="flex items-center justify-end border-t border-border-subtle"
            style={{ gap: "var(--space-3)", padding: "var(--space-6)" }}
          >
            {footer}
          </footer>
        ) : null}
      </div>
    </dialog>
  );
}
