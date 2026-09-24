"use client";

import { useCallback, useRef, useState } from "react";

export const SERIES_SLOTS = 4;

export function seriesColor(index: number) {
  return `var(--series-${(index % SERIES_SLOTS) + 1})`;
}

/**
 * Secondary encoding for line charts. Grayscale steps alone can't carry
 * series identity, so the dash pattern does it too — and keeps working in
 * print, at severe CVD, and under forced-colors.
 */
const DASHES = ["", "6 4", "1 4", "10 4 2 4"];

export function seriesDash(index: number) {
  return DASHES[index % DASHES.length] || undefined;
}

/**
 * Charts render in real pixel coordinates rather than a scaled viewBox so
 * that 2px strokes and 8px markers stay the size they claim to be at any
 * container width.
 */
export function useChartWidth(fallback = 640) {
  const [width, setWidth] = useState(fallback);
  const observer = useRef<ResizeObserver | null>(null);

  const ref = useCallback((node: HTMLDivElement | null) => {
    observer.current?.disconnect();
    if (!node) return;
    observer.current = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.current.observe(node);
  }, []);

  return { ref, width };
}

export function niceTicks(max: number, count = 4) {
  if (max <= 0) return [0];
  const raw = max / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? mag * 10;
  const ticks: number[] = [];
  for (let v = 0; v <= max + step / 2; v += step) ticks.push(v);
  return ticks;
}

export function formatCompact(value: number) {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

/** Top-rounded bar path — rounded at the data end, square at the baseline. */
export function barPath(x: number, y: number, w: number, h: number, r = 4) {
  const radius = Math.min(r, w / 2, h);
  if (h <= 0) return "";
  return [
    `M${x},${y + h}`,
    `L${x},${y + radius}`,
    `Q${x},${y} ${x + radius},${y}`,
    `L${x + w - radius},${y}`,
    `Q${x + w},${y} ${x + w},${y + radius}`,
    `L${x + w},${y + h}`,
    "Z",
  ].join(" ");
}
