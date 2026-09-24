import type { ReactNode } from "react";
import { TrendUp, TrendDown } from "@phosphor-icons/react/ssr";
import { Card } from "./card";

type Direction = "up" | "down" | "flat";

type StatCardProps = {
  label: string;
  value: string;
  caption?: ReactNode;
  delta?: string;
  direction?: Direction;
  icon?: ReactNode;
  interactive?: boolean;
  flat?: boolean;
  className?: string;
};

const deltaColor: Record<Direction, string> = {
  up: "var(--success)",
  down: "var(--danger)",
  flat: "var(--text-tertiary)",
};

/**
 * Falls back to neutral rather than "up" when the sign is unreadable —
 * guessing wrong paints a loss green with a rising arrow, which is worse
 * than showing no direction at all.
 */
function inferDirection(delta?: string): Direction {
  const trimmed = delta?.trim();
  if (!trimmed) return "flat";
  if (trimmed.startsWith("-") || trimmed.startsWith("−")) return "down";
  if (trimmed.startsWith("+")) return "up";
  return "flat";
}

export function StatCard({
  label,
  value,
  caption,
  delta,
  direction,
  icon,
  interactive = false,
  flat = false,
  className = "",
}: StatCardProps) {
  const resolvedDirection = direction ?? inferDirection(delta);
  const DeltaIcon = resolvedDirection === "down" ? TrendDown : TrendUp;

  return (
    <Card interactive={interactive} flat={flat} className={className}>
      <div className="flex items-start justify-between" style={{ gap: "var(--space-4)" }}>
        <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
          <span
            className="font-medium text-text-tertiary"
            style={{ fontSize: "var(--text-xs)", letterSpacing: "0.04em", textTransform: "uppercase" }}
          >
            {label}
          </span>
          <span
            className="font-semibold text-text-primary tabular-nums"
            style={{ fontSize: "var(--text-3xl)", lineHeight: "var(--leading-tight)" }}
          >
            {value}
          </span>
        </div>
        {icon ? (
          <span
            className="bg-accent-subtle text-accent-text flex shrink-0 items-center justify-center"
            style={{
              width: "var(--space-8)",
              height: "var(--space-8)",
              borderRadius: "var(--radius-md)",
            }}
            aria-hidden="true"
          >
            {icon}
          </span>
        ) : null}
      </div>

      {delta || caption ? (
        <div className="flex flex-wrap items-center" style={{ gap: "var(--space-2)" }}>
          {delta ? (
            <span
              className="inline-flex items-center font-medium tabular-nums"
              style={{
                gap: "var(--space-1)",
                fontSize: "var(--text-sm)",
                color: deltaColor[resolvedDirection],
              }}
            >
              {resolvedDirection === "flat" ? null : (
                <DeltaIcon size={16} weight="regular" aria-hidden="true" />
              )}
              {delta}
              <span className="sr-only">
                {resolvedDirection === "up"
                  ? "increase"
                  : resolvedDirection === "down"
                    ? "decrease"
                    : "no change"}
              </span>
            </span>
          ) : null}
          {caption ? (
            <span className="text-text-tertiary" style={{ fontSize: "var(--text-sm)" }}>
              {caption}
            </span>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
