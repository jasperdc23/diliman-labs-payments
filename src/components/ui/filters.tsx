"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Badge } from "./badge";

export type ActiveFilter = {
  id: string;
  label: string;
  value?: string;
};

type FilterBarProps = {
  filters: ActiveFilter[];
  onRemove: (id: string) => void;
  onClearAll?: () => void;
  resultCount?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function FilterBar({
  filters,
  onRemove,
  onClearAll,
  resultCount,
  children,
  className = "",
}: FilterBarProps) {
  const hasFilters = filters.length > 0;

  return (
    <div
      className={`flex flex-wrap items-center ${className}`}
      style={{ gap: "var(--space-2)" }}
      role="group"
      aria-label="Active filters"
    >
      {children}
      {filters.map((filter) => (
        <Badge
          key={filter.id}
          size="md"
          variant="neutral"
          onRemove={() => onRemove(filter.id)}
          removeLabel={`Remove filter ${filter.label}${filter.value ? `: ${filter.value}` : ""}`}
        >
          <span className="text-text-tertiary">{filter.label}</span>
          {filter.value && <span className="text-text-primary">{filter.value}</span>}
        </Badge>
      ))}

      {hasFilters && onClearAll && (
        <button
          type="button"
          onClick={onClearAll}
          className="rounded-md font-medium text-accent-text transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:opacity-70"
          style={{ fontSize: "var(--text-sm)", padding: "var(--space-1) var(--space-2)" }}
        >
          Clear all
        </button>
      )}

      {resultCount !== undefined && (
        <span
          className="ml-auto text-text-tertiary"
          style={{ fontSize: "var(--text-sm)" }}
          aria-live="polite"
        >
          {resultCount}
        </span>
      )}
    </div>
  );
}

export type SegmentedOption = {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
};

type SegmentedControlProps = {
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label: string;
  size?: "sm" | "md";
  className?: string;
};

export function SegmentedControl({
  options,
  value,
  defaultValue,
  onValueChange,
  label,
  size = "sm",
  className = "",
}: SegmentedControlProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const [internalValue, setInternalValue] = useState(defaultValue ?? options[0]?.value ?? "");
  const selected = value ?? internalValue;

  function select(next: string) {
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  }

  function move(delta: number) {
    const index = options.findIndex((option) => option.value === selected);
    const next = (index + delta + options.length) % options.length;
    select(options[next].value);
    groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      move(1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      move(-1);
    }
  }

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={`inline-flex items-center border ${className}`}
      style={{
        gap: "var(--space-1)",
        padding: "var(--space-1)",
        borderRadius: "var(--radius-lg)",
        borderColor: "var(--border-subtle)",
        background: "var(--surface-sunken)",
      }}
    >
      {options.map((option) => {
        const isSelected = option.value === selected;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => select(option.value)}
            className="inline-flex items-center font-medium transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]"
            style={{
              gap: "var(--space-2)",
              borderRadius: "var(--radius-md)",
              padding:
                size === "sm"
                  ? "var(--space-1) var(--space-3)"
                  : "var(--space-2) var(--space-4)",
              fontSize: size === "sm" ? "var(--text-xs)" : "var(--text-sm)",
              background: isSelected ? "var(--surface-raised)" : "transparent",
              color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
              boxShadow: isSelected ? "var(--shadow-sm)" : undefined,
            }}
          >
            {option.icon && (
              <span aria-hidden className="inline-flex items-center">
                {option.icon}
              </span>
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
