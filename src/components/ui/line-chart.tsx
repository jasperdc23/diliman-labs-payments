"use client";

import { useState } from "react";
import styles from "./chart-tooltip.module.css";
import {
  seriesColor,
  seriesDash,
  useChartWidth,
  niceTicks,
  formatCompact,
} from "./chart-shared";

export type LineSeries = {
  name: string;
  values: number[];
};

type LineChartProps = {
  labels: string[];
  series: LineSeries[];
  height?: number;
  area?: boolean;
  formatValue?: (value: number) => string;
  /** Labels the endpoint of each series directly, alongside the legend. */
  labelEnds?: boolean;
};

const PAD = { top: 16, right: 16, bottom: 28, left: 44 };

/**
 * Thins x labels to roughly seven, but always keeps the last one — the most
 * recent period is the one people actually look for. A regular modulo drops
 * it whenever the count isn't a clean multiple.
 */
function showTick(index: number, count: number) {
  const step = Math.max(1, Math.ceil(count / 7));
  const last = count - 1;
  if (index === last) return true;
  return index % step === 0 && last - index >= step / 2;
}

export function LineChart({
  labels,
  series,
  height = 260,
  area = false,
  formatValue = formatCompact,
  labelEnds = false,
}: LineChartProps) {
  const { ref, width } = useChartWidth();
  const [hover, setHover] = useState<number | null>(null);

  const plotW = Math.max(width - PAD.left - PAD.right, 10);
  const plotH = height - PAD.top - PAD.bottom;

  const max = Math.max(...series.flatMap((s) => s.values), 0);
  const ticks = niceTicks(max);
  const scaleMax = ticks[ticks.length - 1] || 1;

  const x = (i: number) =>
    PAD.left + (labels.length === 1 ? plotW / 2 : (i / (labels.length - 1)) * plotW);
  const y = (v: number) => PAD.top + plotH - (v / scaleMax) * plotH;

  const handleMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const ratio = (px - PAD.left) / plotW;
    const index = Math.round(ratio * (labels.length - 1));
    setHover(Math.min(Math.max(index, 0), labels.length - 1));
  };

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <svg
        width={width}
        height={height}
        role="img"
        aria-label={`Line chart: ${series.map((s) => s.name).join(", ")}`}
        onPointerMove={handleMove}
        onPointerLeave={() => setHover(null)}
        style={{ display: "block", touchAction: "none" }}
      >
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={PAD.left}
              x2={PAD.left + plotW}
              y1={y(tick)}
              y2={y(tick)}
              stroke="var(--chart-grid)"
              strokeWidth={1}
            />
            <text
              x={PAD.left - 8}
              y={y(tick)}
              textAnchor="end"
              dominantBaseline="middle"
              fill="var(--text-tertiary)"
              style={{ fontSize: 11, fontVariantNumeric: "tabular-nums" }}
            >
              {formatCompact(tick)}
            </text>
          </g>
        ))}

        {labels.map((label, i) =>
          showTick(i, labels.length) ? (
            <text
              key={label + i}
              x={x(i)}
              y={height - 8}
              textAnchor="middle"
              fill="var(--text-tertiary)"
              style={{ fontSize: 11 }}
            >
              {label}
            </text>
          ) : null,
        )}

        {area &&
          series.map((s, si) => (
            <path
              key={`area-${s.name}`}
              d={`M${x(0)},${y(s.values[0])} ${s.values
                .map((v, i) => `L${x(i)},${y(v)}`)
                .join(" ")} L${x(s.values.length - 1)},${PAD.top + plotH} L${x(0)},${
                PAD.top + plotH
              } Z`}
              fill={seriesColor(si)}
              opacity={0.1}
            />
          ))}

        {hover !== null && (
          <line
            x1={x(hover)}
            x2={x(hover)}
            y1={PAD.top}
            y2={PAD.top + plotH}
            stroke="var(--chart-axis)"
            strokeWidth={1}
          />
        )}

        {series.map((s, si) => (
          <path
            key={s.name}
            d={s.values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ")}
            fill="none"
            stroke={seriesColor(si)}
            strokeWidth={2}
            strokeDasharray={series.length > 1 ? seriesDash(si) : undefined}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}

        {series.map((s, si) => (
          <circle
            key={`end-${s.name}`}
            cx={x(s.values.length - 1)}
            cy={y(s.values[s.values.length - 1])}
            r={4}
            fill={seriesColor(si)}
            stroke="var(--surface-raised)"
            strokeWidth={2}
          />
        ))}

        {hover !== null &&
          series.map((s, si) => (
            <circle
              key={`hover-${s.name}`}
              cx={x(hover)}
              cy={y(s.values[hover])}
              r={4}
              fill={seriesColor(si)}
              stroke="var(--surface-raised)"
              strokeWidth={2}
            />
          ))}

        {labelEnds &&
          series.map((s) => (
            <text
              key={`label-${s.name}`}
              x={x(s.values.length - 1) - 6}
              y={y(s.values[s.values.length - 1]) - 10}
              textAnchor="end"
              fill="var(--text-secondary)"
              style={{ fontSize: 11, fontWeight: 600 }}
            >
              {formatValue(s.values[s.values.length - 1])}
            </text>
          ))}
      </svg>

      {hover !== null && (
        <div className={styles.tooltip} style={{ left: x(hover), top: PAD.top }}>
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
              <svg width={16} height={2} aria-hidden style={{ overflow: "visible" }}>
                <line
                  x1={0}
                  x2={16}
                  y1={1}
                  y2={1}
                  stroke={seriesColor(si)}
                  strokeWidth={2}
                  strokeDasharray={seriesDash(si)}
                  strokeLinecap="round"
                />
              </svg>
              {s.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
