"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlass } from "@phosphor-icons/react/ssr";
import { NAV } from "@/docs/nav";
import styles from "./docs-search.module.css";

type Flat = { title: string; href: string; group: string };

const ALL_ITEMS: Flat[] = NAV.flatMap((group) =>
  group.items.map((item) => ({ ...item, group: group.title })),
);

export function DocsSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = q ? ALL_ITEMS.filter((item) => item.title.toLowerCase().includes(q)) : ALL_ITEMS;
    return matches.map((item, index) => ({
      ...item,
      showGroup: index === 0 || item.group !== matches[index - 1].group,
    }));
  }, [query]);

  const openPalette = () => {
    setQuery("");
    setActiveIndex(0);
    setOpen(true);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      window.setTimeout(() => inputRef.current?.focus(), 0);
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((v) => {
          if (!v) {
            setQuery("");
            setActiveIndex(0);
          }
          return !v;
        });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const target = results[activeIndex];
      if (target) go(target.href);
    }
  };

  return (
    <>
      <button type="button" className={styles.trigger} onClick={openPalette}>
        <MagnifyingGlass size={16} aria-hidden />
        <span className={styles.triggerLabel}>Search docs</span>
        <kbd className={styles.kbd}>&#8984;K</kbd>
      </button>

      <dialog
        ref={dialogRef}
        className={`glass ${styles.dialog}`}
        aria-label="Search documentation"
        onClose={() => setOpen(false)}
        onCancel={(event) => {
          event.preventDefault();
          setOpen(false);
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current) setOpen(false);
        }}
      >
        <div className={styles.inputRow}>
          <MagnifyingGlass size={18} aria-hidden />
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="Search components, tokens, guides…"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-expanded={open}
            aria-controls="docs-search-results"
            aria-activedescendant={
              results[activeIndex] ? `docs-search-result-${activeIndex}` : undefined
            }
          />
          <kbd className={styles.kbd}>Esc</kbd>
        </div>

        <div id="docs-search-results" className={styles.results} role="listbox">
          {results.length === 0 && <p className={styles.empty}>No matches for &quot;{query}&quot;</p>}
          {results.map((item, index) => {
            return (
              <div key={item.href}>
                {item.showGroup && <p className={styles.groupLabel}>{item.group}</p>}
                <button
                  id={`docs-search-result-${index}`}
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  data-active={index === activeIndex || undefined}
                  className={styles.result}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => go(item.href)}
                >
                  {item.title}
                </button>
              </div>
            );
          })}
        </div>
      </dialog>
    </>
  );
}
