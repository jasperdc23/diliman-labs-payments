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
import { CalendarBlank, CaretLeft, CaretRight } from "@phosphor-icons/react/ssr";
import styles from "./date-picker.module.css";

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

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

export function formatDate(date: Date) {
  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
}

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

type DatePickerProps = {
  label?: ReactNode;
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date) => void;
  placeholder?: string;
  helperText?: ReactNode;
  minDate?: Date;
  maxDate?: Date;
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
};

export function DatePicker({
  label,
  value,
  defaultValue = null,
  onValueChange,
  placeholder = "Pick a date",
  helperText,
  minDate,
  maxDate,
  invalid = false,
  disabled = false,
  id,
  className = "",
}: DatePickerProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const dialogId = `${inputId}-calendar`;
  const helperId = `${inputId}-helper`;

  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue);
  const selected = value !== undefined ? value : internalValue;

  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => startOfDay(selected ?? new Date()));

  const fieldRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const today = startOfDay(new Date());

  const close = useCallback((refocus: boolean) => {
    setOpen(false);
    if (refocus) inputRef.current?.focus();
  }, []);

  const openCalendar = () => {
    if (disabled) return;
    setViewDate(startOfDay(selected ?? new Date()));
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!fieldRef.current?.contains(event.target as Node)) close(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open, close]);

  const isDisabledDay = (date: Date) =>
    (minDate ? date < startOfDay(minDate) : false) ||
    (maxDate ? date > startOfDay(maxDate) : false);

  const selectDay = (date: Date) => {
    if (value === undefined) setInternalValue(date);
    onValueChange?.(date);
    close(true);
  };

  const shiftMonth = (delta: number) => {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      close(true);
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) close(true);
      else openCalendar();
    }
  };

  const days = buildGrid(viewDate.getFullYear(), viewDate.getMonth());
  const monthName = MONTHS_LONG[viewDate.getMonth()];

  return (
    <div className={`${styles.root} ${className}`} onKeyDown={handleKeyDown}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}

      <div className={styles.field} ref={fieldRef}>
        <div
          className={styles.inputWrap}
          data-disabled={disabled || undefined}
          data-invalid={invalid || undefined}
        >
          <input
            id={inputId}
            ref={inputRef}
            type="text"
            role="combobox"
            readOnly
            className={styles.input}
            value={selected ? formatDate(selected) : ""}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={invalid || undefined}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={open ? dialogId : undefined}
            aria-describedby={helperText ? helperId : undefined}
            onClick={() => (open ? close(false) : openCalendar())}
            onKeyDown={handleInputKeyDown}
          />
          <button
            type="button"
            className={styles.trigger}
            disabled={disabled}
            aria-label={open ? "Close calendar" : "Open calendar"}
            onClick={() => (open ? close(true) : openCalendar())}
          >
            <CalendarBlank />
          </button>
        </div>

        {open && (
          <div
            id={dialogId}
            role="dialog"
            aria-modal="false"
            aria-label={`Choose a date, ${monthName} ${viewDate.getFullYear()}`}
            className={`glass ${styles.popover}`}
          >
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

            <div className={styles.grid}>
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
                    aria-label={formatDate(date)}
                    onClick={() => selectDay(date)}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
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
