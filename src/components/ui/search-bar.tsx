"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from "react";
import { MagnifyingGlass, SpinnerGap, X } from "@phosphor-icons/react/ssr";
import styles from "./search-bar.module.css";

type SearchBarProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "defaultValue" | "onChange"
> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  loading?: boolean;
  clearLabel?: string;
};

export function SearchBar({
  value,
  defaultValue = "",
  onValueChange,
  onSearch,
  loading = false,
  disabled = false,
  placeholder = "Search",
  clearLabel = "Clear search",
  className = "",
  ...props
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentValue = value ?? internalValue;

  const setValue = (next: string) => {
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSearch?.(currentValue);
    } else if (event.key === "Escape" && currentValue) {
      event.preventDefault();
      setValue("");
    }
  };

  const handleClear = () => {
    setValue("");
    inputRef.current?.focus();
  };

  return (
    <div
      className={`${styles.root} ${className}`}
      data-disabled={disabled || undefined}
    >
      <span className={styles.leading} aria-hidden>
        <MagnifyingGlass />
      </span>

      <input
        ref={inputRef}
        type="search"
        className={styles.input}
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        aria-label={props["aria-label"] ?? placeholder}
        {...props}
      />

      {loading && (
        <span className={styles.spinner} role="status" aria-label="Searching">
          <SpinnerGap />
        </span>
      )}

      {!loading && currentValue.length > 0 && !disabled && (
        <button
          type="button"
          className={styles.clear}
          onClick={handleClear}
          aria-label={clearLabel}
        >
          <X weight="bold" />
        </button>
      )}
    </div>
  );
}
