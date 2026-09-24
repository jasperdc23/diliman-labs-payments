"use client";

import {
  createContext,
  useContext,
  useId,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import styles from "./radio.module.css";

type RadioGroupContextValue = {
  name: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: ReactNode;
  description?: ReactNode;
  invalid?: boolean;
  value: string;
};

export function Radio({
  label,
  description,
  invalid,
  disabled,
  value,
  id,
  name,
  checked,
  defaultChecked,
  onChange,
  className = "",
  ...props
}: RadioProps) {
  const group = useContext(RadioGroupContext);
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = `${inputId}-description`;

  const isDisabled = disabled ?? group?.disabled ?? false;
  const isInvalid = invalid ?? group?.invalid ?? false;

  const resolvedChecked =
    checked ?? (group && group.value !== undefined ? group.value === value : undefined);
  const resolvedDefaultChecked =
    defaultChecked ??
    (group && group.value === undefined && group.defaultValue !== undefined
      ? group.defaultValue === value
      : undefined);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    if (event.target.checked) group?.onValueChange?.(value);
  };

  return (
    <div
      className={`${styles.root} ${className}`}
      data-invalid={isInvalid || undefined}
      data-disabled={isDisabled || undefined}
    >
      <span className={styles.control}>
        <input
          type="radio"
          id={inputId}
          className={styles.input}
          name={name ?? group?.name}
          value={value}
          disabled={isDisabled}
          checked={resolvedChecked}
          defaultChecked={resolvedDefaultChecked}
          onChange={handleChange}
          aria-describedby={description ? descriptionId : undefined}
          {...props}
        />
        <span className={styles.circle} aria-hidden>
          <span className={styles.dot} />
        </span>
      </span>

      {(label || description) && (
        <span className={styles.text}>
          {label && (
            <label htmlFor={inputId} className={styles.label}>
              {label}
            </label>
          )}
          {description && (
            <span id={descriptionId} className={styles.description}>
              {description}
            </span>
          )}
        </span>
      )}
    </div>
  );
}

type RadioGroupProps = {
  legend: ReactNode;
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  helperText?: ReactNode;
  orientation?: "vertical" | "horizontal";
  children: ReactNode;
  className?: string;
};

export function RadioGroup({
  legend,
  name,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  invalid = false,
  helperText,
  orientation = "vertical",
  children,
  className = "",
}: RadioGroupProps) {
  const generatedName = useId();
  const helperId = `${generatedName}-helper`;

  return (
    <RadioGroupContext.Provider
      value={{
        name: name ?? generatedName,
        value,
        defaultValue,
        onValueChange,
        disabled,
        invalid,
      }}
    >
      <fieldset
        className={`${styles.group} ${className}`}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={helperText ? helperId : undefined}
      >
        <legend className={styles.legend}>{legend}</legend>
        <div className={styles.groupItems} data-orientation={orientation}>
          {children}
        </div>
        {helperText && (
          <p id={helperId} className={styles.groupHelper} data-invalid={invalid || undefined}>
            {helperText}
          </p>
        )}
      </fieldset>
    </RadioGroupContext.Provider>
  );
}
