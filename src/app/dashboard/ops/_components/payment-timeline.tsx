import { formatDateTime, type TimelineEvent } from "@/app/dashboard/_data/payments";
import styles from "../ops.module.css";

const STATE_LABEL: Record<TimelineEvent["state"], string> = {
  done: "Completed",
  current: "In progress",
  warning: "Needs attention",
  failed: "Failed",
};

/**
 * The payment's status timeline, newest last — the order the money
 * actually moved in, so an operator reads it top to bottom without
 * translating.
 */
export function PaymentTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className={styles.timeline}>
      {events.map((event, index) => (
        <li key={`${event.label}-${index}`} className={styles.timelineItem}>
          <span className={styles.timelineDot} data-state={event.state} aria-hidden />
          <span className="flex min-w-0 flex-col" style={{ gap: "var(--space-1)" }}>
            <span
              className="text-text-primary"
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: "var(--weight-semibold)",
                lineHeight: "var(--leading-tight)",
              }}
            >
              {event.label}
              <span className="sr-only"> — {STATE_LABEL[event.state]}</span>
            </span>
            <span
              className="text-text-tertiary"
              style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)" }}
            >
              {formatDateTime(event.timestamp)}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}
