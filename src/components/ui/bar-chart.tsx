"use client";

import { useState } from "react";
import styles from "./chart-tooltip.module.css";
import {
  seriesColor,
  useChartWidth,
  niceTicks,
  formatCompact,
  barPath,
} from "./chart-shared";

export type BarSeries = {
  name: string;
  values: number[];
};

type BarChartProps = {
  labels: string[];
  series: BarSeries[];
  height?: number;
  stacked?: boolean;
  formatValue?: (value: number) => string;
};

const PAD = { top: 16, right: 16, bottom: 28, left: 44 };
const MAX_BAR = 24;
const GAP = 2;

export function BarChart({
  labels,
  series,
  height = 260,
  stacked = false,
  formatValue = formatCompact,
}: BarChartProps) {
  const { ref, width } = useChartWidth();
  const [hover, setHover] = useState<number | null>(null);

  const plotW = Math.max(width - PAD.left - PAD.right, 10);
  const plotH = height - PAD.top - PAD.bottom;

  const max = stacked
    ? Math.max(...labels.map((_, i) => series.reduce((sum, s) => sum + s.values[i], 0)), 0)
    : Math.max(...series.flatMap((s) => s.values), 0);
  const ticks = niceTicks(max);
  const scaleMax = ticks[ticks.length - 1] || 1;

  const band = plotW / labels.length;
  const groupCount = stacked ? 1 : series.length;
  const barW = Math.min(MAX_BAR, (band * 0.62 - GAP * (groupCount - 1)) / groupCount);
  const groupW = barW * groupCount + GAP * (groupCount - 1);

  const yFor = (v: number) => (v / scaleMax) * plotH;

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <svg
        width={width}
        height={height}
        role="img"
        aria-label={`Bar chart: ${series.map((s) => s.name).join(", ")}`}
        style={{ display: "block" }}
      >
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={PAD.left}
              x2={PAD.left + plotW}
              y1={PAD.top + plotH - yFor(tick)}
              y2={PAD.top + plotH - yFor(tick)}
              stroke="var(--chart-grid)"
              strokeWidth={1}
            />
            <text
              x={PAD.left - 8}
              y={PAD.top + plotH - yFor(tick)}
              textAnchor="end"
              dominantBaseline="middle"
              fill="var(--text-tertiary)"
              style={{ fontSize: 11, fontVariantNumeric: "tabular-nums" }}
            >
              {formatCompact(tick)}
            </text>
          </g>
        ))}

        {labels.map((label, i) => {
          const bandStart = PAD.left + i * band;
          const groupStart = bandStart + (band - groupW) / 2;

          return (
            <g
              key={label}
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
              style={{ cursor: "default" }}
            >
              <rect
                x={bandStart}
                y={PAD.top}
                width={band}
                height={plotH}
                fill="transparent"
              />

              {stacked
                ? series.reduce<{ nodes: React.ReactNode[]; offset: number }>(
                    (acc, s, si) => {
                      const h = yFor(s.values[i]);
                      const yTop = PAD.top + plotH - acc.offset - h;
                      acc.nodes.push(
                        <path
                          key={s.name}
                          d={barPath(
                            groupStart,
                            yTop,
                            barW,
                            Math.max(h - (si === series.length - 1 ? 0 : GAP), 0),
                            si === series.length - 1 ? 4 : 0,
                          )}
                          fill={seriesColor(si)}
                          opacity={hover === null || hover === i ? 1 : 0.55}
                        />,
                      );
                      acc.offset += h;
                      return acc;
                    },
                    { nodes: [], offset: 0 },
                  ).nodes
                : series.map((s, si) => {
                    const h = yFor(s.values[i]);
                    return (
                      <path
                        key={s.name}
                        d={barPath(
                          groupStart + si * (barW + GAP),
                          PAD.top + plotH - h,
                          barW,
                          h,
                        )}
                        fill={seriesColor(si)}
                        opacity={hover === null || hover === i ? 1 : 0.55}
                      />
                    );
                  })}

              <text
                x={bandStart + band / 2}
                y={height - 8}
                textAnchor="middle"
                fill="var(--text-tertiary)"
                style={{ fontSize: 11 }}
              >
                {label}
              </text>
            </g>
          );
        })}

        <line
          x1={PAD.left}
          x2={PAD.left + plotW}
          y1={PAD.top + plotH}
          y2={PAD.top + plotH}
          stroke="var(--chart-axis)"
          strokeWidth={1}
        />
      </svg>

      {hover !== null && (
        <div
          className={styles.tooltip}
          style={{ left: PAD.left + hover * band + band / 2, top: PAD.top }}
        >
          <p className={styles.heading}>{labels[hover]}</p>
          {series.map((s, si) => (
            <div key={s.name} className={styles.row}>
              <span className={styles.key} style={{ background: seriesColor(si) }} />
              <span className={styles.name}>{s.name}</span>
              <span className={styles.value}>{formatValue(s.values[hover])}</span>
            </div>
          ))}
        </div>
      )}

      {series.length > 1 && (
        <div className={styles.legend}>
          {series.map((s, si) => (
            <span key={s.name} className={styles.legendItem}>
              <span className={styles.legendRect} style={{ background: seriesColor(si) }} />
              {s.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
