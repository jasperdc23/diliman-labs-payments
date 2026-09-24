"use client";

import {
  createContext,
  useContext,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import styles from "./toggle-group.module.css";

type ToggleGroupType = "single" | "multiple";

type ToggleGroupContextValue = {
  type: ToggleGroupType;
  value: string[];
  toggleValue: (value: string) => void;
  activeValue: string | null;
  setActiveValue: (value: string) => void;
  disabled: boolean;
};

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

type ToggleGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> & {
  /**
   * "single" is radio-like — at most one item pressed, arrow keys move
   * focus between items with only one stop in the tab order (roving
   * tabindex), and the group renders `role="radiogroup"` with each item as
   * `role="radio"`. "multiple" is checkbox-like — any number of items
   * pressed independently, the group renders `role="group"`, and every
   * item keeps its own `aria-pressed` and its own tab stop.
   */
  type?: ToggleGroupType;
  /** Selected values. Always an array, even for type="single" (0 or 1 entries). */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  disabled?: boolean;
  children: ReactNode;
};

export function ToggleGroup({
  type = "single",
  value,
  defaultValue = [],
  onValueChange,
  disabled = false,
  className = "",
  children,
  ...props
}: ToggleGroupProps) {
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const [activeValue, setActiveValue] = useState<string | null>(currentValue[0] ?? null);

  const toggleValue = (itemValue: string) => {
    const next =
      type === "single"
        ? [itemValue]
        : currentValue.includes(itemValue)
          ? currentValue.filter((entry) => entry !== itemValue)
          : [...currentValue, itemValue];

    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <ToggleGroupContext.Provider
      value={{ type, value: currentValue, toggleValue, activeValue, setActiveValue, disabled }}
    >
      <div
        className={`${styles.group} ${className}`}
        role={type === "single" ? "radiogroup" : "group"}
        data-toggle-group=""
        {...props}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
}

type ToggleGroupItemProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> & {
  value: string;
};

export function ToggleGroupItem({
  value,
  disabled,
  className = "",
  children,
  onClick,
  onKeyDown,
  ...props
}: ToggleGroupItemProps) {
  const group = useContext(ToggleGroupContext);
  if (!group) {
    throw new Error("ToggleGroupItem must be rendered inside a ToggleGroup");
  }

  const isSingle = group.type === "single";
  const pressed = group.value.includes(value);
  const isDisabled = disabled ?? group.disabled;
  const isTabStop = isSingle ? (group.activeValue ?? group.value[0] ?? value) === value : true;

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);
    if (!isSingle) return;
    if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(event.key)) return;

    event.preventDefault();
    const root = event.currentTarget.closest("[data-toggle-group]");
    if (!root) return;

    const items = Array.from(root.querySelectorAll<HTMLButtonElement>('[role="radio"]')).filter(
      (item) => !item.disabled,
    );
    const currentIndex = items.indexOf(event.currentTarget);
    if (currentIndex === -1) return;

    const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    const nextItem = items[(currentIndex + direction + items.length) % items.length];
    const nextValue = nextItem.dataset.value;

    nextItem.focus();
    if (nextValue) {
      group.setActiveValue(nextValue);
      group.toggleValue(nextValue);
    }
  };

  return (
    <button
      type="button"
      role={isSingle ? "radio" : undefined}
      aria-checked={isSingle ? pressed : undefined}
      aria-pressed={!isSingle ? pressed : undefined}
      data-value={value}
      tabIndex={isSingle ? (isTabStop ? 0 : -1) : undefined}
      disabled={isDisabled}
      className={`${styles.item} ${className}`}
      onClick={(event) => {
        onClick?.(event);
        if (isDisabled) return;
        group.toggleValue(value);
        if (isSingle) group.setActiveValue(value);
      }}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </button>
  );
}
