"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import styles from "./sidebar.module.css";

export type SidebarItem = {
  key: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
};

type SidebarProps = {
  items: SidebarItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onActiveKeyChange?: (key: string) => void;
  header?: ReactNode;
  footer?: ReactNode;
  collapsed?: boolean;
  width?: string;
  className?: string;
};

/** Reusable app-shell sidebar, extracted from the pattern the dashboard
 * example built inline before this component existed: nav items as data
 * rather than markup, active-item highlighting, a header slot for a
 * brand mark, and a footer slot for something like a "back" link. Hidden
 * below the md breakpoint by default, matching the dashboard example's
 * responsive behavior — consumers own the mobile nav affordance
 * separately, the same way the dashboard example does with its topbar. */
export function Sidebar({
  items,
  activeKey,
  defaultActiveKey,
  onActiveKeyChange,
  header,
  footer,
  collapsed = false,
  width = "16rem",
  className = "",
}: SidebarProps) {
  const [internalActive, setInternalActive] = useState(defaultActiveKey);
  const active = activeKey ?? internalActive;

  function handleSelect(item: SidebarItem) {
    if (activeKey === undefined) setInternalActive(item.key);
    onActiveKeyChange?.(item.key);
    item.onClick?.();
  }

  return (
    <aside
      className={`glass-flat ${styles.root} ${className}`}
      data-collapsed={collapsed}
      style={{ width: collapsed ? undefined : width }}
    >
      {header && <div>{header}</div>}

      <nav className={styles.nav} aria-label="Primary">
        {items.map((item) => {
          const isActive = item.key === active;
          const content = (
            <>
              {item.icon && (
                <span aria-hidden className="inline-flex items-center">
                  {item.icon}
                </span>
              )}
              <span className={styles.label}>{item.label}</span>
            </>
          );

          if (item.href) {
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                title={collapsed ? item.label : undefined}
                className={styles.item}
                onClick={() => handleSelect(item)}
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={item.key}
              type="button"
              aria-current={isActive ? "page" : undefined}
              title={collapsed ? item.label : undefined}
              className={styles.item}
              onClick={() => handleSelect(item)}
            >
              {content}
            </button>
          );
        })}
      </nav>

      {footer && <div className={styles.footer}>{footer}</div>}
    </aside>
  );
}
