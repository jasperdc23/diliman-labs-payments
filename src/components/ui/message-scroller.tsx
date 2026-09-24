"use client";

import { Children, useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Distance from the bottom, in pixels, within which the scroller still
 * considers itself "at the bottom." Matches --space-24 (6rem / 96px) — big
 * enough to absorb a line-wrap in the last message without losing the
 * auto-scroll, small enough that scrolling up to read one message back
 * already disables it.
 */
const BOTTOM_THRESHOLD_PX = 96;

type MessageScrollerProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/**
 * Scrolls to the newest message automatically, but only while the viewer
 * is already at (or near) the bottom. The moment they scroll up to read
 * history, new messages stop yanking the view back down — auto-scroll
 * that fights a person trying to read older messages is a well-known
 * chat-UI failure, not a nice-to-have.
 *
 * "At the bottom" is tracked in a ref rather than React state and read
 * imperatively in an effect keyed on the message count: the scroller
 * mutates `scrollTop` directly (a DOM property, not a state update), so
 * there's nothing here for the set-state-in-effect rule to flag, and no
 * extra render on every scroll frame either.
 */
export function MessageScroller({ children, className = "", style }: MessageScrollerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const messageCount = Children.count(children);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isAtBottomRef.current = distanceFromBottom < BOTTOM_THRESHOLD_PX;
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isAtBottomRef.current) return;
    el.scrollTop = el.scrollHeight;
  }, [messageCount]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`flex flex-col overflow-y-auto ${className}`}
      style={{ gap: "var(--space-4)", ...style }}
    >
      {children}
    </div>
  );
}
