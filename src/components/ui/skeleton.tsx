import styles from "./skeleton.module.css";

type SkeletonShape = "text" | "avatar" | "card" | "block";

type SkeletonProps = {
  shape?: SkeletonShape;
  /** Overrides the shape preset's width. */
  width?: string | number;
  /** Overrides the shape preset's height. */
  height?: string | number;
  className?: string;
};

/**
 * A loading placeholder that pulses (opacity oscillation) in place of
 * content that hasn't arrived yet. Looping opacity motion with no direct
 * user action behind it is, on its face, exactly what "nothing animates
 * without a reason" warns against — but it's functionally identical to the
 * Spinner's justified exception: the pulse communicates "this is still
 * loading," not decoration, so it gets the same pass. A moving gradient
 * sweep was deliberately skipped in favor of the plainer pulse — it reads
 * as heavier and more "look at me" than this monochrome kit wants.
 */
export function Skeleton({ shape = "text", width, height, className = "" }: SkeletonProps) {
  return (
    <span
      aria-hidden
      className={`${styles.skeleton} ${styles[shape]} ${className}`}
      style={{ width, height }}
    />
  );
}
