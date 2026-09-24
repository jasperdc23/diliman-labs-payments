"use client";

import { useEffect, useId, useRef } from "react";
import type { MouseEvent, ReactNode } from "react";
import { X } from "@phosphor-icons/react/ssr";
import styles from "./modal.module.css";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  closeOnBackdropClick?: boolean;
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnBackdropClick = true,
}: ModalProps) {
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
      className={`glass grain ${styles.dialog} ${styles[size]}`}
      onClick={handleBackdropClick}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={() => {
        if (open) onClose();
      }}
    >
      <div className="flex max-h-[inherit] flex-col">
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
            aria-label="Close dialog"
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
            className={`min-h-0 text-text-secondary ${styles.body}`}
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
