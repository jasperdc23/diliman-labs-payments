"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { CaretDown } from "@phosphor-icons/react/ssr";
import styles from "./navigation-menu.module.css";

export type NavigationMenuLink = {
  label: string;
  href: string;
  description?: string;
  icon?: ReactNode;
};

export type NavigationMenuItem =
  | { label: string; href: string; links?: undefined }
  | { label: string; href?: undefined; links: NavigationMenuLink[] };

export type NavigationMenuProps = {
  items: NavigationMenuItem[];
  className?: string;
};

/**
 * A horizontal top-level nav where an item can either link directly or
 * expand into a panel of links (mega-menu-lite) — e.g. "Products" opening
 * a small grid of related destinations. Only one panel is open at a time;
 * Escape and an outside click both close it.
 */
export function NavigationMenu({ items, className = "" }: NavigationMenuProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelId = useId();

  useEffect(() => {
    if (openIndex === null) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpenIndex(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenIndex((current) => {
          if (current !== null) triggerRefs.current[current]?.focus();
          return null;
        });
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openIndex]);

  return (
    <nav ref={rootRef} aria-label="Main" className={`${styles.nav} ${className}`}>
      <ul className={styles.list}>
        {items.map((item, index) => (
          <li key={item.label} className={styles.item}>
            {item.links ? (
              <>
                <button
                  type="button"
                  ref={(node) => {
                    triggerRefs.current[index] = node;
                  }}
                  className={styles.trigger}
                  aria-expanded={openIndex === index}
                  aria-controls={openIndex === index ? `${panelId}-${index}` : undefined}
                  data-open={openIndex === index || undefined}
                  onClick={() => setOpenIndex((current) => (current === index ? null : index))}
                >
                  {item.label}
                  <CaretDown size={14} weight="bold" aria-hidden className={styles.caret} />
                </button>
                {openIndex === index && (
                  <div id={`${panelId}-${index}`} className={`glass ${styles.panel}`}>
                    <ul className={styles.grid}>
                      {item.links.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            className={styles.gridLink}
                            onClick={() => setOpenIndex(null)}
                          >
                            {link.icon && (
                              <span className={styles.gridLinkIcon} aria-hidden>
                                {link.icon}
                              </span>
                            )}
                            <span>
                              <span className={styles.gridLinkLabel}>{link.label}</span>
                              {link.description && (
                                <span className={styles.gridLinkDescription}>{link.description}</span>
                              )}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <a href={item.href} className={styles.link}>
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
