"use client";

import { useId, useState, type CSSProperties, type InputHTMLAttributes } from "react";
import styles from "./slider.module.css";

type SliderProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange" | "value" | "defaultValue" | "min" | "max" | "step"
> & {
  label?: string;
  helperText?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Shows the current value next to the label. Off by default. */
  showValue?: boolean;
  formatValue?: (value: number) => string;
};

export function Slider({
  label,
  helperText,
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = min,
  onValueChange,
  showValue = false,
  formatValue = (v) => String(v),
  id,
  className = "",
  disabled,
  ...props
}: SliderProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value ?? internalValue;
  const generatedId = useId();
  const sliderId = id ?? generatedId;
  const helperId = `${sliderId}-helper`;
  const percent = max === min ? 0 : ((currentValue - min) / (max - min)) * 100;

  return (
    <div>
      {(label || showValue) && (
        <div className={styles.header}>
          {label && (
            <label htmlFor={sliderId} className={styles.label}>
              {label}
            </label>
          )}
          {showValue && <span className={styles.value}>{formatValue(currentValue)}</span>}
        </div>
      )}
      <input
        id={sliderId}
        type="range"
        className={`${styles.slider} ${className}`}
        min={min}
        max={max}
        step={step}
        value={currentValue}
        disabled={disabled}
        aria-describedby={helperText ? helperId : undefined}
        style={{ "--slider-fill": `${percent}%` } as CSSProperties}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (value === undefined) setInternalValue(next);
          onValueChange?.(next);
        }}
        {...props}
      />
      {helperText && (
        <p id={helperId} className={styles.helper}>
          {helperText}
        </p>
      )}
    </div>
  );
}
