"use client";

import { Marker, type MarkerTone } from "@/components/ui/marker";
import { formatDateTime, type TimelineEvent, type TimelineState } from "../_data/payments";
import styles from "./workbench.module.css";

/**
 * `current` maps to the accent tone rather than to a neutral: the step a
 * payment is sitting on is the one an analyst is looking for, and Marker's
 * accent dot already draws its own ink ring so a yellow dot on the light
 * canvas keeps a visible boundary.
 */
const TONE: Record<TimelineState, MarkerTone> = {
  done: "success",
  current: "accent",
  warning: "warning",
  failed: "danger",
};

const STATE_LABEL: Record<TimelineState, string> = {
  done: "Completed",
  current: "In progress",
  warning: "Needs attention",
  failed: "Failed",
};

type StatusTimelineProps = {
  events: TimelineEvent[];
  /**
   * How many trailing events were appended by the analyst in this session.
   * They get an "Added now" marker so it is obvious which part of the
   * history is the prototype's own work rather than the authored record.
   */
  addedCount?: number;
};

export function StatusTimeline({ events, addedCount = 0 }: StatusTimelineProps) {
  const firstAddedIndex = events.length - addedCount;

  return (
    <ol className={styles.timeline}>
      {events.map((event, index) => {
        const added = addedCount > 0 && index >= firstAddedIndex;
        return (
          <li key={`${event.label}-${event.timestamp}`} className={styles.timelineItem}>
            <span className={styles.timelineDot}>
              <Marker tone={TONE[event.state]} size="sm" />
            </span>
            <div style={{ minWidth: 0 }}>
              <span className={styles.timelineLabel}>
                {event.label}
                <span className={styles.srOnly}> — {STATE_LABEL[event.state]}</span>
                {added ? <span className={styles.timelineAdded}>Added now</span> : null}
              </span>
              <time className={styles.timelineTime} dateTime={event.timestamp}>
                {formatDateTime(event.timestamp)}
              </time>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
