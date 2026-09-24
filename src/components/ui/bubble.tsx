import type { ReactNode } from "react";
import styles from "./bubble.module.css";

export type BubbleVariant = "sent" | "received";

type BubbleProps = {
  children: ReactNode;
  variant?: BubbleVariant;
  className?: string;
};

/**
 * A single chat-message bubble — the visual shell only. `Message` composes
 * this with an avatar, sender name and timestamp for a full message row.
 *
 * "Received" uses `.glass-flat` rather than `.glass`: a message thread
 * renders many bubbles at once, and per-item backdrop-filter is the one
 * texture effect in this kit that actually costs something per frame (see
 * globals.css) — the same reasoning Card's `flat` prop exists for dense
 * lists. "Sent" is a plain `--accent` fill, matching Button's primary
 * treatment, so the two variants read as "mine" vs. "theirs" the same way
 * primary/secondary reads as "the one action" vs. "everything else."
 */
export function Bubble({ children, variant = "received", className = "" }: BubbleProps) {
  return (
    <div className={`${styles.bubble} ${className}`} data-variant={variant}>
      {children}
    </div>
  );
}
