"use client";

import { useId, useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import styles from "./input-otp.module.css";

type InputOTPProps = {
  /** Number of single-character boxes. */
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Fires once when every box has a digit. */
  onComplete?: (value: string) => void;
  label?: string;
  helperText?: string;
  invalid?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
};

function onlyDigits(text: string) {
  return text.replace(/\D/g, "");
}

export function InputOTP({
  length = 6,
  value,
  defaultValue = "",
  onValueChange,
  onComplete,
  label,
  helperText,
  invalid = false,
  disabled = false,
  name,
  id,
  className = "",
}: InputOTPProps) {
  const [internalValue, setInternalValue] = useState(() => onlyDigits(defaultValue).slice(0, length));
  const committedValue = value !== undefined ? onlyDigits(value).slice(0, length) : internalValue;
  const slots = Array.from({ length }, (_, index) => committedValue[index] ?? "");

  const generatedId = useId();
  const otpId = id ?? generatedId;
  const helperId = `${otpId}-helper`;
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const commit = (next: string) => {
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
    if (next.length === length) onComplete?.(next);
  };

  const setSlot = (index: number, digit: string) => {
    const chars = slots.slice();
    chars[index] = digit;
    commit(chars.join(""));
  };

  const focusSlot = (index: number) => {
    inputRefs.current[Math.max(0, Math.min(length - 1, index))]?.focus();
  };

  const handleChange = (index: number, raw: string) => {
    const digits = onlyDigits(raw);
    if (!digits) {
      // Backspace/delete inside a filled box clears it via the native
      // change event — nothing to advance.
      setSlot(index, "");
      return;
    }
    // Keep only the last digit typed — covers the case where the browser
    // reports the box's full new content (old digit + new one) instead of
    // just the new character.
    const digit = digits[digits.length - 1];
    setSlot(index, digit);
    if (index < length - 1) focusSlot(index + 1);
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      if (slots[index]) {
        // Let the native change event clear this box; no navigation.
        return;
      }
      // Box is already empty — move back a box and clear it too, so
      // repeated backspace erases the code right-to-left.
      if (index > 0) {
        event.preventDefault();
        setSlot(index - 1, "");
        focusSlot(index - 1);
      }
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusSlot(index - 1);
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusSlot(index + 1);
      return;
    }
    if (event.key === "Delete") {
      event.preventDefault();
      setSlot(index, "");
    }
  };

  const handlePaste = (index: number, event: ClipboardEvent<HTMLInputElement>) => {
    const pasted = onlyDigits(event.clipboardData.getData("text"));
    if (!pasted) return;
    event.preventDefault();
    // A pasted code fills the whole sequence from the first box, regardless
    // of which box currently has focus — that's what "paste the SMS code"
    // means to a person, not "insert at cursor."
    const next = pasted.slice(0, length);
    commit(next);
    focusSlot(Math.min(next.length, length - 1));
  };

  return (
    <div>
      {label && (
        <span id={`${otpId}-label`} className={styles.label}>
          {label}
        </span>
      )}
      <div
        role="group"
        aria-labelledby={label ? `${otpId}-label` : undefined}
        className={`${styles.group} ${className}`}
      >
        {slots.map((digit, index) => (
          <input
            key={index}
            ref={(node) => {
              inputRefs.current[index] = node;
            }}
            id={index === 0 ? otpId : undefined}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            pattern="[0-9]*"
            maxLength={1}
            className={styles.slot}
            value={digit}
            disabled={disabled}
            data-invalid={invalid || undefined}
            aria-invalid={invalid || undefined}
            aria-label={`Digit ${index + 1} of ${length}`}
            aria-describedby={helperText ? helperId : undefined}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={(event) => handlePaste(index, event)}
            onFocus={(event) => event.target.select()}
          />
        ))}
      </div>
      {name && <input type="hidden" name={name} value={committedValue} readOnly />}
      {helperText && (
        <p id={helperId} className={styles.helper} data-invalid={invalid || undefined}>
          {helperText}
        </p>
      )}
    </div>
  );
}
