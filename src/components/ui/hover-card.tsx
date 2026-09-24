"use client";

import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import styles from "./hover-card.module.css";

type TriggerElement = ReactElement<{
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
  "aria-describedby"?: string;
}>;

export type HoverCardProps = {
  trigger: TriggerElement;
  /** Richer than Tooltip's plain text — a small preview card. Use Tooltip
   *  instead when the content is a single line of text. */
  children: ReactNode;
  align?: "start" | "end";
  openDelay?: number;
  closeDelay?: number;
  className?: string;
};

/**
 * Like Tooltip but for richer content, and only on hover (focus is
 * supported too, since a keyboard user needs some way to reach it, but
 * hover is the primary path) — e.g. hovering a merchant name to preview
 * their transaction summary. Distinguish from Tooltip: Tooltip is one line
 * of text, HoverCard is a small content card.
 */
export function HoverCard({
  trigger,
  children,
  align = "start",
  openDelay = 300,
  closeDelay = 150,
  className = "",
}: HoverCardProps) {
  const [open, setOpen] = useState(false);
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  const panelId = useId();

  const scheduleOpen = () => {
    window.clearTimeout(closeTimer.current);
    openTimer.current = window.setTimeout(() => setOpen(true), openDelay);
  };

  const scheduleClose = () => {
    window.clearTimeout(openTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), closeDelay);
  };

  useEffect(
    () => () => {
      window.clearTimeout(openTimer.current);
      window.clearTimeout(closeTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!isValidElement(trigger)) return null;

  // The lint rule flags cloneElement conservatively in case `trigger`
  // carries a ref that ends up read during render — it doesn't here; we
  // only ever read `.current` on our own timer refs, inside effects and
  // event handlers, never on the trigger's ref.
  // eslint-disable-next-line react-hooks/refs
  const cloned = cloneElement(trigger, {
    onFocus: (event: FocusEvent<HTMLElement>) => {
      trigger.props.onFocus?.(event);
      scheduleOpen();
    },
    onBlur: (event: FocusEvent<HTMLElement>) => {
      trigger.props.onBlur?.(event);
      scheduleClose();
    },
    "aria-describedby": open ? panelId : undefined,
  });

  return (
    <div
      className={`${styles.root} ${className}`}
      onMouseEnter={scheduleOpen}
      onMouseLeave={scheduleClose}
    >
      {cloned}
      {open && (
        <div
          id={panelId}
          role="group"
          data-align={align}
          className={`glass ${styles.panel}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
