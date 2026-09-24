import { CircleNotch } from "@phosphor-icons/react/ssr";
import styles from "./spinner.module.css";

type SpinnerProps = {
  /** Pixel size of the icon. */
  size?: number;
  /** Accessible label — spinners carry no text of their own, so this is what a screen reader announces. */
  label?: string;
  className?: string;
};

/**
 * A standalone busy-indicator, extracted from the same treatment Button
 * uses for its `loading` state (`button.module.css`'s `.spinner` +
 * `@keyframes spin`, 600ms linear infinite). Continuous motion is
 * deliberately the one exception to "nothing animates without a reason" in
 * this kit — an ongoing, indeterminate task is exactly the case continuous
 * motion is the correct signal for, not decoration.
 */
export function Spinner({ size = 20, label = "Loading", className = "" }: SpinnerProps) {
  return (
    <CircleNotch
      size={size}
      weight="bold"
      className={`${styles.spinner} ${className}`}
      role="status"
      aria-label={label}
    />
  );
}
