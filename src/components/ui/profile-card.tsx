import type { ReactNode } from "react";
import { Card, CardFooter } from "./card";

type ProfileStat = {
  label: string;
  value: string;
};

type ProfileCardProps = {
  name: string;
  role?: string;
  handle?: string;
  bio?: ReactNode;
  avatar?: string;
  stats?: ProfileStat[];
  actions?: ReactNode;
  interactive?: boolean;
  flat?: boolean;
  className?: string;
};

function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function ProfileCard({
  name,
  role,
  handle,
  bio,
  avatar,
  stats,
  actions,
  interactive = false,
  flat = false,
  className = "",
}: ProfileCardProps) {
  return (
    <Card interactive={interactive} flat={flat} className={className}>
      <div className="flex items-center" style={{ gap: "var(--space-4)" }}>
        {avatar ? (
          <span
            role="img"
            aria-label={name}
            className="shrink-0 border border-border-subtle"
            style={{
              width: "var(--space-12)",
              height: "var(--space-12)",
              borderRadius: "var(--radius-full)",
              backgroundImage: `url("${avatar}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ) : (
          <span
            aria-hidden="true"
            className="bg-accent-subtle text-accent flex shrink-0 items-center justify-center font-semibold"
            style={{
              width: "var(--space-12)",
              height: "var(--space-12)",
              borderRadius: "var(--radius-full)",
              fontSize: "var(--text-base)",
            }}
          >
            {initialsOf(name)}
          </span>
        )}
        <div className="flex min-w-0 flex-col" style={{ gap: "var(--space-1)" }}>
          <span
            className="truncate font-semibold text-text-primary"
            style={{ fontSize: "var(--text-base)", lineHeight: "var(--leading-tight)" }}
          >
            {name}
          </span>
          {role || handle ? (
            <span className="truncate text-text-tertiary" style={{ fontSize: "var(--text-sm)" }}>
              {role}
              {role && handle ? " · " : ""}
              {handle}
            </span>
          ) : null}
        </div>
      </div>

      {bio ? (
        <p
          className="text-text-secondary"
          style={{ fontSize: "var(--text-sm)", lineHeight: "var(--leading-relaxed)" }}
        >
          {bio}
        </p>
      ) : null}

      {stats?.length ? (
        <dl className="flex flex-wrap" style={{ gap: "var(--space-6)" }}>
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col" style={{ gap: "var(--space-1)" }}>
              <dt className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
                {stat.label}
              </dt>
              <dd
                className="font-semibold text-text-primary tabular-nums"
                style={{ fontSize: "var(--text-sm)" }}
              >
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      {actions ? <CardFooter>{actions}</CardFooter> : null}
    </Card>
  );
}
