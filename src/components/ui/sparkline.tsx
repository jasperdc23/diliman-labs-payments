type SparklineProps = {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
  /** Marks the latest point — the one the reader is actually asking about. */
  showEnd?: boolean;
};

export function Sparkline({
  values,
  width = 96,
  height = 28,
  color = "var(--series-1)",
  showEnd = true,
}: SparklineProps) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const pad = 3;

  const x = (i: number) => (i / (values.length - 1)) * (width - pad * 2) + pad;
  const y = (v: number) => height - pad - ((v - min) / span) * (height - pad * 2);

  return (
    <svg width={width} height={height} aria-hidden style={{ display: "block" }}>
      <path
        d={values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {showEnd && (
        <circle
          cx={x(values.length - 1)}
          cy={y(values[values.length - 1])}
          r={3}
          fill={color}
          stroke="var(--surface-raised)"
          strokeWidth={2}
        />
      )}
    </svg>
  );
}
