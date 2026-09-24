"use client";

import { useId, useState, type ReactNode } from "react";
import { CaretRight } from "@phosphor-icons/react/ssr";
import styles from "./collapsible.module.css";

type CollapsibleProps = {
  trigger: ReactNode;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

/** A single expand/collapse region: a trigger button plus content that
 * shows and hides. See collapsible.module.css for why the reveal animates
 * `grid-template-rows` rather than `height`. */
export function Collapsible({
  trigger,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  className = "",
}: CollapsibleProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = open ?? internalOpen;
  const contentId = useId();

  function toggle() {
    const next = !isOpen;
    if (open === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  }

  return (
    <div className={className}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={toggle}
      >
        {trigger}
        <span className={styles.caret} aria-hidden>
          <CaretRight />
        </span>
      </button>
      <div className={styles.root} data-state={isOpen ? "open" : "closed"}>
        {/* `inert` keeps focusable content inside from being tabbed to or
            found by assistive tech while the region is collapsed, without
            unmounting it mid-animation the way `hidden` would. */}
        <div id={contentId} className={styles.inner} role="region" inert={!isOpen}>
          {children}
        </div>
      </div>
    </div>
  );
}
