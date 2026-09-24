"use client";

import {
  useCallback,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import styles from "./resizable.module.css";

type ResizableProps = {
  children: [ReactNode, ReactNode];
  orientation?: "horizontal" | "vertical";
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  onSizeChange?: (size: number) => void;
  className?: string;
  firstPaneLabel?: string;
};

const STEP = 2;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** A two-pane split with a draggable divider between them. The first pane
 * is sized as a percentage of the container; the divider drags it between
 * minSize and maxSize using pointer events directly (no drag-and-drop
 * library) and is also focusable and arrow-key adjustable, since a
 * mouse-only resize handle leaves keyboard users with no way to resize
 * at all. */
export function Resizable({
  children,
  orientation = "horizontal",
  defaultSize = 50,
  minSize = 15,
  maxSize = 85,
  onSizeChange,
  className = "",
  firstPaneLabel = "Panel",
}: ResizableProps) {
  const [size, setSize] = useState(() => clamp(defaultSize, minSize, maxSize));
  const containerRef = useRef<HTMLDivElement>(null);
  const dividerId = useId();
  const isHorizontal = orientation === "horizontal";

  const updateSize = useCallback(
    (next: number) => {
      const clamped = clamp(next, minSize, maxSize);
      setSize(clamped);
      onSizeChange?.(clamped);
    },
    [minSize, maxSize, onSizeChange],
  );

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    event.preventDefault();
    const target = event.currentTarget;
    target.setPointerCapture(event.pointerId);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const percent = isHorizontal
        ? ((moveEvent.clientX - rect.left) / rect.width) * 100
        : ((moveEvent.clientY - rect.top) / rect.height) * 100;
      updateSize(percent);
    };

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const decreaseKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
    const increaseKey = isHorizontal ? "ArrowRight" : "ArrowDown";
    if (event.key === decreaseKey) {
      event.preventDefault();
      updateSize(size - STEP);
    } else if (event.key === increaseKey) {
      event.preventDefault();
      updateSize(size + STEP);
    } else if (event.key === "Home") {
      event.preventDefault();
      updateSize(minSize);
    } else if (event.key === "End") {
      event.preventDefault();
      updateSize(maxSize);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.root} ${className}`}
      data-orientation={orientation}
    >
      <div id={`${dividerId}-first`} className={styles.pane} style={{ flexBasis: `${size}%` }}>
        {children[0]}
      </div>
      <div
        role="separator"
        aria-orientation={orientation}
        aria-label={`Resize ${firstPaneLabel}`}
        aria-valuenow={Math.round(size)}
        aria-valuemin={minSize}
        aria-valuemax={maxSize}
        aria-controls={`${dividerId}-first`}
        tabIndex={0}
        className={styles.divider}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
      >
        <span className={styles.grip} aria-hidden />
      </div>
      <div className={styles.pane} style={{ flexBasis: `${100 - size}%` }}>
        {children[1]}
      </div>
    </div>
  );
}
