"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { MagnifyingGlass } from "@phosphor-icons/react/ssr";
import styles from "./command.module.css";

export type CommandItem = {
  id: string;
  label: string;
  /** Items sharing a group render under one heading, in the order groups
   *  first appear in `items`. */
  group?: string;
  icon?: ReactNode;
  shortcut?: string;
  /** Extra terms matched against the query besides the label. */
  keywords?: string[];
  onSelect: () => void;
};

export type CommandProps = {
  items: CommandItem[];
  placeholder?: string;
  emptyMessage?: string;
  triggerLabel?: string;
  /** Single-letter keyboard shortcut that opens the palette while Cmd
   *  (macOS) or Ctrl (elsewhere) is held. Pass `null` to disable the
   *  global shortcut and rely on the trigger button alone. */
  hotkey?: string | null;
};

function matches(item: CommandItem, query: string) {
  if (!query) return true;
  const haystack = [item.label, ...(item.keywords ?? [])].join(" ").toLowerCase();
  return haystack.includes(query);
}

/**
 * A searchable command palette — a text input plus a filtered,
 * keyboard-navigable list — opened from a trigger button or a keyboard
 * shortcut (Cmd/Ctrl+K by default). This generalizes the shape already
 * built for the docs site's own search
 * (src/components/docs/docs-search.tsx) into a reusable primitive: items
 * and groups are plain data, with no dependency on this repo's nav.
 */
export function Command({
  items,
  placeholder = "Type a command or search…",
  emptyMessage = "No matches.",
  triggerLabel = "Command palette",
  hotkey = "k",
}: CommandProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = items.filter((item) => matches(item, q));
    return filtered.map((item, index) => ({
      ...item,
      showGroup: index === 0 || item.group !== filtered[index - 1].group,
    }));
  }, [items, query]);

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
    if (!hotkey) return;
    const key = hotkey.toLowerCase();
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === key) {
        event.preventDefault();
        setOpen((value) => {
          if (!value) {
            setQuery("");
            setActiveIndex(0);
          }
          return !value;
        });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [hotkey]);

  const runItem = (item: CommandItem) => {
    setOpen(false);
    item.onSelect();
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
      if (target) runItem(target);
    }
  };

  return (
    <>
      <button type="button" className={styles.trigger} onClick={openPalette}>
        <MagnifyingGlass size={16} aria-hidden />
        <span className={styles.triggerLabel}>{triggerLabel}</span>
        {hotkey && <kbd className={styles.kbd}>&#8984;{hotkey.toUpperCase()}</kbd>}
      </button>

      <dialog
        ref={dialogRef}
        className={`glass ${styles.dialog}`}
        aria-label={triggerLabel}
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
            placeholder={placeholder}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-expanded={open}
            aria-controls="command-results"
            aria-activedescendant={results[activeIndex] ? `command-result-${activeIndex}` : undefined}
          />
          <kbd className={styles.kbd}>Esc</kbd>
        </div>

        <div id="command-results" className={styles.results} role="listbox">
          {results.length === 0 && (
            <p className={styles.empty}>{query ? `${emptyMessage} for "${query}"` : emptyMessage}</p>
          )}
          {results.map((item, index) => (
            <div key={item.id}>
              {item.showGroup && item.group && <p className={styles.groupLabel}>{item.group}</p>}
              <button
                id={`command-result-${index}`}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                data-active={index === activeIndex || undefined}
                className={styles.result}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => runItem(item)}
              >
                {item.icon && (
                  <span className={styles.resultIcon} aria-hidden>
                    {item.icon}
                  </span>
                )}
                <span className={styles.resultLabel}>{item.label}</span>
                {item.shortcut && <span className={styles.resultShortcut}>{item.shortcut}</span>}
              </button>
            </div>
          ))}
        </div>
      </dialog>
    </>
  );
}
