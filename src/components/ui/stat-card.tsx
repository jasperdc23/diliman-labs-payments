import type { ReactNode } from "react";
import { TrendUp, TrendDown } from "@phosphor-icons/react/ssr";
import { Card } from "./card";
import styles from "./stat-card.module.css";

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
  /**
   * Scopes the whole card to a surface: `"ink"` for a near-black panel,
   * `"accent"` for a solid yellow block with ink type. Both re-declare the
   * semantic tokens only, so everything inside — value, delta color, icon
   * chip, focus ring — follows with no further props. A non-default tone
   * forces `flat`: a backdrop blur over an opaque fill costs a frame for
   * nothing.
   */
  tone?: "default" | "ink" | "accent";
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
  tone = "default",
  className = "",
}: StatCardProps) {
  const resolvedDirection = direction ?? inferDirection(delta);
  const DeltaIcon = resolvedDirection === "down" ? TrendDown : TrendUp;

  return (
    <Card
      interactive={interactive}
      flat={flat || tone !== "default"}
      className={`${tone === "default" ? styles.gradient : ""} ${className}`}
      data-surface={tone === "default" ? undefined : tone}
    >
      <div className="flex items-start justify-between" style={{ gap: "var(--space-4)" }}>
        <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
          <span
            className="text-text-secondary"
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: "var(--weight-bold)",
              letterSpacing: "var(--tracking-caps)",
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
          {/* Heavy ink type is half the brand. Roboto 900 is downloaded and
              this is the one place in the kit that reaches for it. */}
          <span
            className="text-text-primary tabular-nums"
            style={{
              fontSize: "var(--text-4xl)",
              lineHeight: "var(--leading-tight)",
              fontWeight: "var(--weight-black)",
              letterSpacing: "var(--tracking-tight)",
            }}
          >
            {value}
          </span>
        </div>
        {icon ? (
          <span
            className="bg-accent text-text-on-accent border border-accent-edge flex shrink-0 items-center justify-center"
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
