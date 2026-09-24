import styles from "./progress.module.css";

type ProgressVariant = "accent" | "success" | "warning" | "danger";

type ProgressProps = {
  /** Current value. Ignored when `indeterminate` is set. */
  value?: number;
  min?: number;
  max?: number;
  variant?: ProgressVariant;
  indeterminate?: boolean;
  label?: string;
  className?: string;
};

/**
 * A determinate progress bar. The fill is a full-width inner element
 * transformed with `scaleX(value / max)` rather than an animated `width` —
 * this kit's motion rule is transform/opacity/color only, and scaling a
 * `transform-origin: left` element is the prescribed substitution for
 * animating width.
 */
export function Progress({
  value = 0,
  min = 0,
  max = 100,
  variant = "accent",
  indeterminate = false,
  label,
  className = "",
}: ProgressProps) {
  const clamped = Math.min(max, Math.max(min, value));
  const ratio = max > min ? (clamped - min) / (max - min) : 0;

  return (
    <div
      className={`${styles.track} ${className}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={indeterminate ? undefined : min}
      aria-valuemax={indeterminate ? undefined : max}
      aria-valuenow={indeterminate ? undefined : clamped}
    >
      <div
        className={`${styles.fill} ${indeterminate ? styles.indeterminate : ""}`}
        data-variant={variant}
        style={indeterminate ? undefined : { transform: `scaleX(${ratio})` }}
      />
    </div>
  );
}
