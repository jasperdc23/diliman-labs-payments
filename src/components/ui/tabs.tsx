"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import styles from "./tabs.module.css";

export type TabItem = {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  content?: ReactNode;
};

type TabsProps = {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: "underline" | "pill";
  label?: string;
  className?: string;
};

export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  variant = "underline",
  label = "Tabs",
  className = "",
}: TabsProps) {
  const baseId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? items.find((item) => !item.disabled)?.value ?? items[0]?.value ?? "",
  );

  const selected = value ?? internalValue;
  const selectedIndex = items.findIndex((item) => item.value === selected);

  const placedRef = useRef(false);

  const positionIndicator = useCallback(() => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;
    const active = list.querySelector<HTMLButtonElement>('[role="tab"][aria-selected="true"]');
    if (!active) return;
    if (!placedRef.current) {
      indicator.style.transition = "none";
    }
    indicator.style.width = `${active.offsetWidth}px`;
    indicator.style.transform = `translateX(${active.offsetLeft}px)`;
    if (!placedRef.current) {
      void indicator.offsetWidth;
      indicator.style.transition = "";
      placedRef.current = true;
    }
  }, []);

  useEffect(() => {
    positionIndicator();
    const list = listRef.current;
    if (!list || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(positionIndicator);
    observer.observe(list);
    return () => observer.disconnect();
  }, [positionIndicator, selected, items]);

  function select(next: string) {
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  }

  function focusTab(index: number) {
    const list = listRef.current;
    if (!list) return;
    const tabs = Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const target = tabs[index];
    if (!target) return;
    target.focus();
    select(items[index].value);
  }

  function step(from: number, delta: number) {
    const total = items.length;
    let next = from;
    for (let i = 0; i < total; i += 1) {
      next = (next + delta + total) % total;
      if (!items[next].disabled) return next;
    }
    return from;
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const from = selectedIndex < 0 ? 0 : selectedIndex;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusTab(step(from, 1));
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusTab(step(from, -1));
    } else if (event.key === "Home") {
      event.preventDefault();
      focusTab(step(-1, 1));
    } else if (event.key === "End") {
      event.preventDefault();
      focusTab(step(items.length, -1));
    }
  }

  const activeItem = items[selectedIndex];

  return (
    <div className={`${styles.root} ${className}`}>
      <div
        ref={listRef}
        role="tablist"
        aria-label={label}
        data-variant={variant}
        className={styles.list}
        onKeyDown={onKeyDown}
      >
        <span ref={indicatorRef} className={styles.indicator} aria-hidden />
        {items.map((item) => {
          const isSelected = item.value === selected;
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.value}`}
              aria-selected={isSelected}
              aria-controls={`${baseId}-panel-${item.value}`}
              tabIndex={isSelected ? 0 : -1}
              disabled={item.disabled}
              className={styles.tab}
              onClick={() => !item.disabled && select(item.value)}
            >
              {item.icon && (
                <span aria-hidden className="inline-flex items-center">
                  {item.icon}
                </span>
              )}
              {item.label}
            </button>
          );
        })}
      </div>

      {activeItem?.content !== undefined && (
        <div
          role="tabpanel"
          id={`${baseId}-panel-${activeItem.value}`}
          aria-labelledby={`${baseId}-tab-${activeItem.value}`}
          tabIndex={0}
          className={styles.panel}
        >
          {activeItem.content}
        </div>
      )}
    </div>
  );
}
