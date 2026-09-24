"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Menu, type MenuItem } from "./dropdown-menu";
import styles from "./menubar.module.css";

export type { MenuItem } from "./dropdown-menu";

export type MenubarMenu = {
  label: string;
  items: MenuItem[];
};

export type MenubarProps = {
  menus: MenubarMenu[];
  className?: string;
};

/**
 * A horizontal row of menu triggers, like a desktop app's File/Edit/View
 * bar. Each trigger opens the same Menu used by DropdownMenu; only one
 * panel is open at a time, and arrow-left/right moves between top-level
 * items (opening the next panel if one is already open).
 */
export function Menubar({ menus, className = "" }: MenubarProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const menuId = useId();

  const close = useCallback((refocus: boolean, index: number) => {
    setOpenIndex(null);
    if (refocus) triggerRefs.current[index]?.focus();
  }, []);

  useEffect(() => {
    if (openIndex === null) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpenIndex(null);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [openIndex]);

  const moveTo = (index: number) => {
    const clamped = (index + menus.length) % menus.length;
    triggerRefs.current[clamped]?.focus();
    setOpenIndex((current) => (current === null ? current : clamped));
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveTo(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveTo(index - 1);
    } else if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpenIndex(index);
    }
  };

  return (
    <div ref={rootRef} role="menubar" aria-label="Menubar" className={`${styles.bar} ${className}`}>
      {menus.map((menu, index) => (
        <div key={menu.label} className={styles.item}>
          <button
            type="button"
            ref={(node) => {
              triggerRefs.current[index] = node;
            }}
            role="menuitem"
            aria-haspopup="menu"
            aria-expanded={openIndex === index}
            data-open={openIndex === index || undefined}
            className={styles.trigger}
            onClick={() => setOpenIndex((current) => (current === index ? null : index))}
            onMouseEnter={() => setOpenIndex((current) => (current === null ? current : index))}
            onKeyDown={(event) => handleTriggerKeyDown(event, index)}
          >
            {menu.label}
          </button>
          {openIndex === index && (
            <Menu
              id={`${menuId}-${index}`}
              items={menu.items}
              onClose={(refocus) => close(refocus, index)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
