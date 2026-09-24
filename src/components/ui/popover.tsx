"use client";

import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import styles from "./popover.module.css";

type TriggerElement = ReactElement<{
  onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
  "aria-haspopup"?: string;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
}>;

export type PopoverProps = {
  /** The element that opens the popover. Cloned (not ref-forwarded) so it
   *  works with any element that spreads props onto its root, including
   *  this kit's Button. */
  trigger: TriggerElement;
  children: ReactNode;
  align?: "start" | "end";
  className?: string;
};

/**
 * The raw, reusable floating-panel primitive — a trigger plus arbitrary
 * content in a panel positioned below it. Select and DatePicker are
 * specific applications of this same idea; Popover itself carries no
 * opinion about what's inside.
 *
 * API choice: a single `trigger` prop cloned with the open/close wiring,
 * rather than a compound `Popover.Trigger`/`Popover.Content` pair. With
 * only one trigger and one panel there's no coordination problem a context
 * provider would solve, and this keeps every aria-expanded/aria-controls
 * wire in one place instead of split across two components.
 */
export function Popover({ trigger, children, align = "start", className = "" }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const close = useCallback((refocus: boolean) => {
    setOpen(false);
    if (refocus) {
      rootRef.current?.querySelector<HTMLElement>("button, [href], [tabindex]")?.focus();
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const handlePanelKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close(true);
    }
  };

  if (!isValidElement(trigger)) return null;

  const clonedTrigger = cloneElement(trigger, {
    onClick: (event: ReactMouseEvent<HTMLElement>) => {
      trigger.props.onClick?.(event);
      setOpen((value) => !value);
    },
    "aria-haspopup": "dialog",
    "aria-expanded": open,
    "aria-controls": open ? panelId : undefined,
  });

  return (
    <div ref={rootRef} className={`${styles.root} ${className}`}>
      {clonedTrigger}
      {open && (
        <div
          ref={panelRef}
          id={panelId}
          tabIndex={-1}
          data-align={align}
          className={`glass ${styles.panel}`}
          onKeyDown={handlePanelKeyDown}
        >
          {children}
        </div>
      )}
    </div>
  );
}
