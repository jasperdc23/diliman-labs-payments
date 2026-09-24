"use client";

import { useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/ssr";
import styles from "./calendar.module.css";

/* Same date math as DatePicker's internal grid (src/components/ui/date-picker.tsx) —
   extracted here as a standalone, always-visible primitive rather than one that
   lives behind a popover trigger. No date library; the native Date object is
   enough for month generation, weekday offsets and same-day comparisons. */

const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = [
  { key: "sunday", short: "Su" },
  { key: "monday", short: "Mo" },
  { key: "tuesday", short: "Tu" },
  { key: "wednesday", short: "We" },
  { key: "thursday", short: "Th" },
  { key: "friday", short: "Fr" },
  { key: "saturday", short: "Sa" },
];

const WEEKS_SHOWN = 6;

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildGrid(year: number, month: number) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const start = new Date(year, month, 1 - firstWeekday);
  return Array.from({ length: WEEKS_SHOWN * WEEKDAYS.length }, (_, offset) => {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + offset);
    return { date, outside: date.getMonth() !== month };
  });
}

export type CalendarProps = {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date) => void;
  /** Returning true removes the day from selection, e.g. `(d) => d < new Date()`. */
  disabled?: (date: Date) => boolean;
  className?: string;
};

export function Calendar({
  value,
  defaultValue = null,
  onValueChange,
  disabled,
  className = "",
}: CalendarProps) {
  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue);
  const selected = value !== undefined ? value : internalValue;

  const [viewDate, setViewDate] = useState(() => startOfDay(selected ?? new Date()));
  const today = startOfDay(new Date());

  const isDisabledDay = (date: Date) => disabled?.(date) ?? false;

  const selectDay = (date: Date) => {
    if (isDisabledDay(date)) return;
    if (value === undefined) setInternalValue(date);
    onValueChange?.(date);
  };

  const shiftMonth = (delta: number) => {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  };

  const days = buildGrid(viewDate.getFullYear(), viewDate.getMonth());
  const monthName = MONTHS_LONG[viewDate.getMonth()];

  return (
    <div className={`${styles.root} ${className}`}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.navButton}
          aria-label="Previous month"
          onClick={() => shiftMonth(-1)}
        >
          <CaretLeft />
        </button>
        <span className={styles.monthLabel} aria-live="polite">
          {monthName} {viewDate.getFullYear()}
        </span>
        <button
          type="button"
          className={styles.navButton}
          aria-label="Next month"
          onClick={() => shiftMonth(1)}
        >
          <CaretRight />
        </button>
      </div>

      <div className={styles.grid} role="grid" aria-label={`${monthName} ${viewDate.getFullYear()}`}>
        {WEEKDAYS.map((weekday) => (
          <span key={weekday.key} className={styles.weekday} aria-hidden>
            {weekday.short}
          </span>
        ))}

        {days.map(({ date, outside }) => {
          const dayDisabled = isDisabledDay(date);
          const isSelected = Boolean(selected && isSameDay(date, selected));
          return (
            <button
              key={date.toISOString()}
              type="button"
              className={styles.day}
              disabled={dayDisabled}
              data-outside={outside || undefined}
              data-today={isSameDay(date, today) || undefined}
              data-selected={isSelected || undefined}
              aria-pressed={isSelected}
              aria-label={date.toDateString()}
              onClick={() => selectDay(date)}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
