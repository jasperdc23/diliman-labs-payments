import { useId, type ReactNode, type SelectHTMLAttributes } from "react";
import { CaretDown } from "@phosphor-icons/react/ssr";
import styles from "./native-select.module.css";

export type NativeSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type NativeSelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  options: NativeSelectOption[];
  label?: ReactNode;
  helperText?: ReactNode;
  invalid?: boolean;
  placeholder?: string;
};

export function NativeSelect({
  options,
  label,
  helperText,
  invalid = false,
  placeholder,
  id,
  className = "",
  disabled,
  value,
  defaultValue,
  ...props
}: NativeSelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const resolvedDefaultValue = value === undefined && defaultValue === undefined ? "" : defaultValue;

  return (
    <div>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.wrapper}>
        <select
          id={selectId}
          className={`${styles.select} ${className}`}
          disabled={disabled}
          data-invalid={invalid || undefined}
          aria-invalid={invalid || undefined}
          value={value}
          defaultValue={resolvedDefaultValue}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <span className={styles.caret} aria-hidden>
          <CaretDown />
        </span>
      </div>
      {helperText && (
        <p className={styles.helper} data-invalid={invalid || undefined}>
          {helperText}
        </p>
      )}
    </div>
  );
}
