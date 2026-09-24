"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { CaretDown, Check } from "@phosphor-icons/react/ssr";
import styles from "./combobox.module.css";

export type ComboboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type ComboboxProps = {
  options: ComboboxOption[];
  label?: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  placeholder?: string;
  helperText?: ReactNode;
  emptyMessage?: string;
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
};

// Popover positioning, keyboard nav and the .glass treatment
// below mirror select.tsx closely — a Combobox is really "Select's popover
// mechanics plus a filterable text trigger," not a separate widget.
function nextEnabledIndex(options: ComboboxOption[], from: number, step: number) {
  for (let i = from; i >= 0 && i < options.length; i += step) {
    if (!options[i].disabled) return i;
  }
  return -1;
}

export function Combobox({
  options,
  label,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Search…",
  helperText,
  emptyMessage = "No matches",
  invalid = false,
  disabled = false,
  id,
  className = "",
}: ComboboxProps) {
  const generatedId = useId();
  const comboId = id ?? generatedId;
  const listboxId = `${comboId}-listbox`;
  const labelId = `${comboId}-label`;
  const helperId = `${comboId}-helper`;

  const [internalValue, setInternalValue] = useState(defaultValue);
  const committedValue = value ?? internalValue;
  const selectedOption = options.find((option) => option.value === committedValue);

  // null = "not editing," so the input shows the committed option's label.
  // A string = the person is actively typing and this overrides that display.
  const [editingText, setEditingText] = useState<string | null>(null);
  const displayValue = editingText ?? selectedOption?.label ?? "";

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const fieldRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  const filteredOptions = useMemo(() => {
    if (editingText === null || editingText.trim() === "") return options;
    const query = editingText.toLowerCase();
    return options.filter((option) => option.label.toLowerCase().includes(query));
  }, [options, editingText]);

  const close = useCallback((refocus: boolean) => {
    setOpen(false);
    setActiveIndex(-1);
    if (refocus) inputRef.current?.focus();
  }, []);

  const commit = (option: ComboboxOption | undefined) => {
    const nextValue = option?.value;
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
    setEditingText(null);
    close(true);
  };

  // Free text that doesn't exactly match an option's label (case-insensitive)
  // is discarded on blur/escape — this Combobox requires picking a listed
  // option, it does not accept arbitrary values. An empty box clears the
  // selection instead of reverting.
  const resolveEditingText = () => {
    if (editingText === null) return;
    const trimmed = editingText.trim();
    if (trimmed === "") {
      commit(undefined);
      return;
    }
    const match = options.find((option) => option.label.toLowerCase() === trimmed.toLowerCase());
    if (match && !match.disabled) {
      commit(match);
    } else {
      setEditingText(null);
    }
  };

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (fieldRef.current?.contains(event.target as Node)) return;
      resolveEditingText();
      close(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, close]);

  const openList = () => {
    if (disabled) return;
    setOpen(true);
    setActiveIndex(nextEnabledIndex(filteredOptions, 0, 1));
  };

  const handleFocus = () => {
    setEditingText(selectedOption?.label ?? "");
    openList();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setEditingText(next);
    setOpen(true);
    const nextFiltered =
      next.trim() === ""
        ? options
        : options.filter((option) => option.label.toLowerCase().includes(next.toLowerCase()));
    setActiveIndex(nextEnabledIndex(nextFiltered, 0, 1));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        if (!open) {
          openList();
          return;
        }
        const next = nextEnabledIndex(filteredOptions, activeIndex + 1, 1);
        if (next >= 0) setActiveIndex(next);
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        if (!open) {
          openList();
          return;
        }
        const prev = nextEnabledIndex(filteredOptions, activeIndex - 1, -1);
        if (prev >= 0) setActiveIndex(prev);
        break;
      }
      case "Enter": {
        event.preventDefault();
        if (open && activeIndex >= 0) {
          commit(filteredOptions[activeIndex]);
        } else {
          resolveEditingText();
          close(false);
        }
        break;
      }
      case "Escape": {
        event.preventDefault();
        setEditingText(null);
        close(true);
        break;
      }
      case "Tab": {
        resolveEditingText();
        close(false);
        break;
      }
    }
  };

  return (
    <div className={`${styles.root} ${className}`}>
      {label && (
        <span className={styles.label} id={labelId}>
          {label}
        </span>
      )}

      <div className={styles.field} ref={fieldRef}>
        <input
          id={comboId}
          ref={inputRef}
          type="text"
          role="combobox"
          className={styles.trigger}
          disabled={disabled}
          autoComplete="off"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-labelledby={label ? `${labelId} ${comboId}` : undefined}
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-activedescendant={
            open && activeIndex >= 0 ? `${comboId}-option-${activeIndex}` : undefined
          }
          aria-invalid={invalid || undefined}
          aria-describedby={helperText ? helperId : undefined}
          data-invalid={invalid || undefined}
          placeholder={placeholder}
          value={displayValue}
          onFocus={handleFocus}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onClick={() => !open && openList()}
        />
        <span className={styles.caret} aria-hidden>
          <CaretDown />
        </span>

        {open && (
          <ul
            id={listboxId}
            ref={listboxRef}
            role="listbox"
            aria-labelledby={label ? labelId : undefined}
            className={`glass ${styles.popover}`}
          >
            {filteredOptions.length === 0 && <li className={styles.empty}>{emptyMessage}</li>}
            {filteredOptions.map((option, index) => {
              const isSelected = option.value === committedValue;
              return (
                <li
                  key={option.value}
                  id={`${comboId}-option-${index}`}
                  ref={(node) => {
                    optionRefs.current[index] = node;
                  }}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={Boolean(option.disabled)}
                  data-active={index === activeIndex || undefined}
                  className={styles.option}
                  onMouseEnter={() => !option.disabled && setActiveIndex(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => !option.disabled && commit(option)}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <span className={styles.optionCheck} aria-hidden>
                      <Check weight="bold" />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {helperText && (
        <p id={helperId} className={styles.helper} data-invalid={invalid || undefined}>
          {helperText}
        </p>
      )}
    </div>
  );
}
