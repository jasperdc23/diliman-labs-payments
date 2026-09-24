"use client";

import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import styles from "./dropdown-menu.module.css";

/**
 * A menu item is either a real action or a visual separator. This shape is
 * shared by DropdownMenu, ContextMenu and Menubar so all three menus behave
 * and read identically — only how the menu is triggered and positioned
 * differs between them.
 */
export type MenuItem =
  | { type: "separator" }
  | {
      type?: "item";
      label: string;
      icon?: ReactNode;
      shortcut?: string;
      disabled?: boolean;
      /** Reuses the --danger token for actions that can't be undone. */
      destructive?: boolean;
      onSelect?: () => void;
    };

function isSeparator(item: MenuItem): item is Extract<MenuItem, { type: "separator" }> {
  return item.type === "separator";
}

function nextEnabledIndex(items: MenuItem[], from: number, step: number) {
  for (let i = from; i >= 0 && i < items.length; i += step) {
    const item = items[i];
    if (!isSeparator(item) && !item.disabled) return i;
  }
  return -1;
}

type MenuProps = {
  id: string;
  items: MenuItem[];
  labelledBy?: string;
  align?: "start" | "end";
  /** Called on Escape, Tab, or a committed selection. `refocus` tells the
   *  caller whether focus should return to whatever opened the menu. */
  onClose: (refocus: boolean) => void;
  className?: string;
  style?: CSSProperties;
};

/**
 * The menu surface itself — the `role="menu"` list with roving
 * `aria-activedescendant` navigation, shared by DropdownMenu, ContextMenu
 * and Menubar rather than each reimplementing arrow-key handling. Exported
 * so ContextMenu and Menubar can compose it directly instead of forking a
 * second menu implementation.
 */
export function Menu({ id, items, labelledBy, align = "start", onClose, className = "", style }: MenuProps) {
  const [activeIndex, setActiveIndex] = useState(() => nextEnabledIndex(items, 0, 1));
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    listRef.current?.focus();
  }, []);

  useEffect(() => {
    if (activeIndex < 0) return;
    itemRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const commit = (index: number) => {
    const item = items[index];
    if (!item || isSeparator(item) || item.disabled) return;
    item.onSelect?.();
    onClose(true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        const next = nextEnabledIndex(items, activeIndex + 1, 1);
        if (next >= 0) setActiveIndex(next);
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        const prev = nextEnabledIndex(items, activeIndex - 1, -1);
        if (prev >= 0) setActiveIndex(prev);
        break;
      }
      case "Home": {
        event.preventDefault();
        const first = nextEnabledIndex(items, 0, 1);
        if (first >= 0) setActiveIndex(first);
        break;
      }
      case "End": {
        event.preventDefault();
        const last = nextEnabledIndex(items, items.length - 1, -1);
        if (last >= 0) setActiveIndex(last);
        break;
      }
      case "Enter":
      case " ": {
        event.preventDefault();
        commit(activeIndex);
        break;
      }
      case "Escape": {
        event.preventDefault();
        onClose(true);
        break;
      }
      case "Tab": {
        onClose(false);
        break;
      }
    }
  };

  return (
    <ul
      id={id}
      ref={listRef}
      role="menu"
      tabIndex={-1}
      aria-labelledby={labelledBy}
      aria-activedescendant={activeIndex >= 0 ? `${id}-item-${activeIndex}` : undefined}
      data-align={align}
      className={`glass ${styles.menu} ${className}`}
      style={style}
      onKeyDown={handleKeyDown}
    >
      {items.map((item, index) =>
        isSeparator(item) ? (
          <li key={`separator-${index}`} role="separator" className={styles.separator} />
        ) : (
          <li
            key={item.label}
            id={`${id}-item-${index}`}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            role="menuitem"
            aria-disabled={item.disabled || undefined}
            data-active={index === activeIndex || undefined}
            data-destructive={item.destructive || undefined}
            className={styles.item}
            onMouseEnter={() => !item.disabled && setActiveIndex(index)}
            onClick={() => commit(index)}
          >
            {item.icon && (
              <span className={styles.itemIcon} aria-hidden>
                {item.icon}
              </span>
            )}
            <span className={styles.itemLabel}>{item.label}</span>
            {item.shortcut && <span className={styles.shortcut}>{item.shortcut}</span>}
          </li>
        ),
      )}
    </ul>
  );
}

type TriggerElement = ReactElement<{
  onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  "aria-haspopup"?: string;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
}>;

export type DropdownMenuProps = {
  /** The element that opens the menu — any element accepting onClick,
   *  onKeyDown and aria-* props (a Button, or a plain button). Cloned
   *  rather than ref-forwarded, since components in this kit (e.g. Button)
   *  don't forward refs but do spread arbitrary props onto their root
   *  element. */
  trigger: TriggerElement;
  items: MenuItem[];
  align?: "start" | "end";
  className?: string;
};

/**
 * An action menu — not a value picker like Select. Opens on click or on
 * ArrowDown/Enter/Space when the trigger has focus, supports full arrow-key
 * navigation, and closes on Escape, an outside click, or a committed item.
 */
export function DropdownMenu({ trigger, items, align = "start", className = "" }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const close = useCallback((refocus: boolean) => {
    setOpen(false);
    if (refocus) {
      rootRef.current?.querySelector<HTMLElement>("button, [href], [tabindex]")?.focus();
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  if (!isValidElement(trigger)) return null;

  const clonedTrigger = cloneElement(trigger, {
    onClick: (event: ReactMouseEvent<HTMLElement>) => {
      trigger.props.onClick?.(event);
      setOpen((value) => !value);
    },
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      trigger.props.onKeyDown?.(event);
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setOpen(true);
      }
    },
    "aria-haspopup": "menu",
    "aria-expanded": open,
    "aria-controls": open ? menuId : undefined,
  });

  return (
    <div ref={rootRef} className={`${styles.root} ${className}`}>
      {clonedTrigger}
      {open && <Menu id={menuId} items={items} align={align} onClose={close} />}
    </div>
  );
}
