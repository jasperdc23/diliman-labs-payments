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
import { CaretDown, Check } from "@phosphor-icons/react/ssr";
import styles from "./select.module.css";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectProps = {
  options: SelectOption[];
  label?: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  helperText?: ReactNode;
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
};

function nextEnabledIndex(options: SelectOption[], from: number, step: number) {
  for (let i = from; i >= 0 && i < options.length; i += step) {
    if (!options[i].disabled) return i;
  }
  return -1;
}

export function Select({
  options,
  label,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select an option",
  helperText,
  invalid = false,
  disabled = false,
  id,
  className = "",
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const listboxId = `${selectId}-listbox`;
  const labelId = `${selectId}-label`;
  const helperId = `${selectId}-helper`;

  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectedValue = value ?? internalValue;
  const selectedIndex = options.findIndex((option) => option.value === selectedValue);

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const fieldRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  const close = useCallback((refocus: boolean) => {
    setOpen(false);
    setActiveIndex(-1);
    if (refocus) triggerRef.current?.focus();
  }, []);

  const openList = (startAt: "selected" | "first" | "last") => {
    if (disabled) return;
    let index = -1;
    if (startAt === "selected" && selectedIndex >= 0 && !options[selectedIndex].disabled) {
      index = selectedIndex;
    } else if (startAt === "last") {
      index = nextEnabledIndex(options, options.length - 1, -1);
    } else {
      index = nextEnabledIndex(options, 0, 1);
    }
    setActiveIndex(index);
    setOpen(true);
  };

  const commit = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    if (value === undefined) setInternalValue(option.value);
    onValueChange?.(option.value);
    close(true);
  };

  useEffect(() => {
    if (!open) return;
    listboxRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!fieldRef.current?.contains(event.target as Node)) close(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open, close]);

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openList("selected");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openList("last");
    } else if (event.key === "Home") {
      event.preventDefault();
      openList("first");
    }
  };

  const handleListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        const next = nextEnabledIndex(options, activeIndex + 1, 1);
        if (next >= 0) setActiveIndex(next);
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        const prev = nextEnabledIndex(options, activeIndex - 1, -1);
        if (prev >= 0) setActiveIndex(prev);
        break;
      }
      case "Home": {
        event.preventDefault();
        const first = nextEnabledIndex(options, 0, 1);
        if (first >= 0) setActiveIndex(first);
        break;
      }
      case "End": {
        event.preventDefault();
        const last = nextEnabledIndex(options, options.length - 1, -1);
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
        close(true);
        break;
      }
      case "Tab": {
        close(false);
        break;
      }
    }
  };

  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  return (
    <div className={`${styles.root} ${className}`}>
      {label && (
        <span className={styles.label} id={labelId}>
          {label}
        </span>
      )}

      <div className={styles.field} ref={fieldRef}>
        <button
          type="button"
          id={selectId}
          ref={triggerRef}
          className={styles.trigger}
          disabled={disabled}
          role="combobox"
          aria-haspopup="listbox"
          aria-labelledby={label ? `${labelId} ${selectId}` : undefined}
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-invalid={invalid || undefined}
          aria-describedby={helperText ? helperId : undefined}
          data-invalid={invalid || undefined}
          onClick={() => (open ? close(true) : openList("selected"))}
          onKeyDown={handleTriggerKeyDown}
        >
          <span className={`${styles.value} ${selectedOption ? "" : styles.placeholder}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className={styles.caret} aria-hidden>
            <CaretDown />
          </span>
        </button>

        {open && (
          <ul
            id={listboxId}
            ref={listboxRef}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={label ? labelId : undefined}
            aria-activedescendant={activeIndex >= 0 ? `${selectId}-option-${activeIndex}` : undefined}
            className={`glass ${styles.popover}`}
            onKeyDown={handleListKeyDown}
          >
            {options.map((option, index) => {
              const isSelected = option.value === selectedValue;
              return (
                <li
                  key={option.value}
                  id={`${selectId}-option-${index}`}
                  ref={(node) => {
                    optionRefs.current[index] = node;
                  }}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={Boolean(option.disabled)}
                  data-active={index === activeIndex || undefined}
                  className={styles.option}
                  onMouseEnter={() => !option.disabled && setActiveIndex(index)}
                  onClick={() => commit(index)}
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
