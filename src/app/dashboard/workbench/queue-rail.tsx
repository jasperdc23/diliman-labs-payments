"use client";

import {
  ClockCountdown,
  Scales,
  Stack,
  WarningCircle,
  XCircle,
} from "@phosphor-icons/react/ssr";
import { QUEUES, type QueueId } from "./queues";
import styles from "./workbench.module.css";

// `typeof` rather than the package's IconProps: the /ssr entry point
// re-exports the components but not the shared prop type.
const ICON: Record<QueueId, typeof WarningCircle> = {
  review: WarningCircle,
  failed: XCircle,
  awaiting: ClockCountdown,
  disputed: Scales,
  all: Stack,
};

type QueueRailProps = {
  active: QueueId;
  counts: Record<QueueId, number>;
  onSelect: (id: QueueId) => void;
};

/**
 * One component for both layouts. Below 1024px the CSS module lays this
 * out as a horizontal scrolling strip under the topbar; above it, as a
 * left rail. The buttons, the counts and the `aria-current` contract are
 * identical either way, so there is no second implementation to keep in
 * sync and no navigation that only exists at one breakpoint.
 */
export function QueueRail({ active, counts, onSelect }: QueueRailProps) {
  return (
    <nav
      data-surface="ink"
      aria-label="Saved queues"
      className={`bg-surface grain ${styles.rail}`}
    >
      <p className={styles.railGroupLabel}>Queues</p>
      {QUEUES.map((queue) => {
        const Icon = ICON[queue.id];
        const isActive = queue.id === active;
        const count = counts[queue.id];
        return (
          <button
            key={queue.id}
            type="button"
            className={styles.railItem}
            // aria-current is the only thing announcing which saved view is
            // open — the yellow pill is not available to a screen reader.
            aria-current={isActive ? "true" : undefined}
            onClick={() => onSelect(queue.id)}
          >
            <Icon size={16} weight={isActive ? "fill" : "regular"} aria-hidden="true" />
            <span className={styles.railLabel}>{queue.label}</span>
            <span className={styles.railCount}>
              {count}
              <span className={styles.srOnly}>
                {count === 1 ? " payment" : " payments"}
              </span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
