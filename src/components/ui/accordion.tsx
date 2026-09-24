"use client";

import { useState, type ReactNode } from "react";
import { Collapsible } from "./collapsible";
import styles from "./accordion.module.css";

export type AccordionItemData = {
  value: string;
  trigger: ReactNode;
  content: ReactNode;
};

type AccordionProps = {
  items: AccordionItemData[];
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  className?: string;
};

/** Several Collapsible-like items where either only one (`type="single"`)
 * or several (`type="multiple"`) can be open at once. Composes Collapsible
 * per item for the actual expand/collapse mechanics rather than
 * re-implementing the grid-template-rows reveal here. */
export function Accordion({
  items,
  type = "single",
  defaultValue,
  value,
  onValueChange,
  className = "",
}: AccordionProps) {
  const toArray = (v: string | string[] | undefined): string[] =>
    v === undefined ? [] : Array.isArray(v) ? v : [v];

  const [internalOpen, setInternalOpen] = useState<string[]>(() => toArray(defaultValue));
  const openValues = value !== undefined ? toArray(value) : internalOpen;

  function commit(next: string[]) {
    if (value === undefined) setInternalOpen(next);
    onValueChange?.(type === "single" ? (next[0] ?? "") : next);
  }

  function handleOpenChange(itemValue: string, isOpen: boolean) {
    if (type === "single") {
      commit(isOpen ? [itemValue] : []);
      return;
    }
    const next = isOpen
      ? [...openValues, itemValue]
      : openValues.filter((v) => v !== itemValue);
    commit(next);
  }

  return (
    <div className={`${styles.root} ${className}`}>
      {items.map((item, index) => (
        <div key={item.value} className={styles.item}>
          <Collapsible
            trigger={item.trigger}
            open={openValues.includes(item.value)}
            onOpenChange={(isOpen) => handleOpenChange(item.value, isOpen)}
          >
            {item.content}
          </Collapsible>
          {index < items.length - 1 && <div className={styles.divider} aria-hidden />}
        </div>
      ))}
    </div>
  );
}
