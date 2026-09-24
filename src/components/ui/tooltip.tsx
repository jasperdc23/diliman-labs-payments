"use client";

import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import styles from "./tooltip.module.css";

type TriggerElement = ReactElement<{
  onMouseEnter?: (event: ReactMouseEvent<HTMLElement>) => void;
  onMouseLeave?: (event: ReactMouseEvent<HTMLElement>) => void;
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
  "aria-describedby"?: string;
}>;

export type TooltipProps = {
  /** Short, plain-text content. For anything richer — a small preview
   *  card rather than a label — use HoverCard instead. */
  content: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  children: TriggerElement;
  className?: string;
};

/**
 * A short, non-interactive label shown on hover or keyboard focus (never
 * click), connected to its trigger via aria-describedby and dismissed on
 * Escape or when the trigger loses hover/focus.
 */
export function Tooltip({ content, side = "top", children, className = "" }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const id = useId();
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setVisible(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [visible]);

  if (!isValidElement(children)) return null;

  const cloned = cloneElement(children, {
    onMouseEnter: (event: ReactMouseEvent<HTMLElement>) => {
      children.props.onMouseEnter?.(event);
      setVisible(true);
    },
    onMouseLeave: (event: ReactMouseEvent<HTMLElement>) => {
      children.props.onMouseLeave?.(event);
      setVisible(false);
    },
    onFocus: (event: FocusEvent<HTMLElement>) => {
      children.props.onFocus?.(event);
      setVisible(true);
    },
    onBlur: (event: FocusEvent<HTMLElement>) => {
      children.props.onBlur?.(event);
      setVisible(false);
    },
    "aria-describedby": visible ? id : undefined,
  });

  return (
    <span
      ref={rootRef}
      className={`${styles.root} ${className}`}
      onKeyDown={(event: KeyboardEvent<HTMLSpanElement>) => {
        if (event.key === "Escape") setVisible(false);
      }}
    >
      {cloned}
      {visible && (
        <span role="tooltip" id={id} data-side={side} className={`glass ${styles.bubble}`}>
          {content}
        </span>
      )}
    </span>
  );
}
