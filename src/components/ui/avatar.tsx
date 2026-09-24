"use client";

import { Children, createContext, useContext, useState, type ReactNode } from "react";
import { User } from "@phosphor-icons/react/ssr";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
type AvatarStatus = "online" | "offline" | "busy" | "away";

type AvatarProps = {
  name?: string;
  src?: string;
  alt?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  className?: string;
};

const sizeScale: Record<AvatarSize, { box: string; font: string; icon: number; dot: string }> = {
  xs: { box: "1.5rem", font: "var(--text-xs)", icon: 12, dot: "0.375rem" },
  sm: { box: "2rem", font: "var(--text-xs)", icon: 16, dot: "0.5rem" },
  md: { box: "2.5rem", font: "var(--text-sm)", icon: 20, dot: "0.625rem" },
  lg: { box: "3rem", font: "var(--text-base)", icon: 24, dot: "0.75rem" },
  xl: { box: "4rem", font: "var(--text-xl)", icon: 32, dot: "0.875rem" },
};

/* Lets AvatarGroup set the size for its children without cloning them. An
   explicit size on the Avatar itself still wins. */
const AvatarGroupSize = createContext<AvatarSize | null>(null);

const statusColor: Record<AvatarStatus, string> = {
  online: "var(--success)",
  offline: "var(--text-tertiary)",
  busy: "var(--danger)",
  away: "var(--warning)",
};

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({
  name,
  src,
  alt,
  size,
  status,
  className = "",
}: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const groupSize = useContext(AvatarGroupSize);
  const scale = sizeScale[size ?? groupSize ?? "md"];
  const initials = name ? getInitials(name) : "";
  const showImage = Boolean(src) && !failed;

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-visible ${className}`}
      style={{ width: scale.box, height: scale.box }}
    >
      <span
        className="flex h-full w-full items-center justify-center overflow-hidden border font-medium select-none"
        style={{
          borderRadius: "var(--radius-full)",
          borderColor: "var(--border-subtle)",
          background: "var(--surface-sunken)",
          color: "var(--text-secondary)",
          fontSize: scale.font,
        }}
      >
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt ?? name ?? ""}
            className="h-full w-full object-cover"
            onError={() => setFailed(true)}
          />
        ) : initials ? (
          <span aria-hidden>{initials}</span>
        ) : (
          <User size={scale.icon} weight="regular" aria-hidden />
        )}
      </span>
      {!showImage && name && <span className="sr-only">{name}</span>}
      {status && (
        <span
          className="absolute right-0 bottom-0 rounded-full border-2"
          style={{
            width: scale.dot,
            height: scale.dot,
            background: statusColor[status],
            borderColor: "var(--surface)",
          }}
          role="img"
          aria-label={`Status: ${status}`}
        />
      )}
    </span>
  );
}

type AvatarGroupProps = {
  children: ReactNode;
  max?: number;
  size?: AvatarSize;
  className?: string;
};

export function AvatarGroup({ children, max = 4, size = "md", className = "" }: AvatarGroupProps) {
  const items = Children.toArray(children);
  const visible = items.slice(0, max);
  const overflow = items.length - visible.length;
  const scale = sizeScale[size];

  return (
    <AvatarGroupSize.Provider value={size}>
    <div className={`flex items-center ${className}`}>
      {visible.map((child, index) => (
        <span
          key={index}
          className="rounded-full"
          style={{
            marginLeft: index === 0 ? 0 : `calc(-1 * var(--space-2))`,
            boxShadow: "0 0 0 2px var(--surface)",
            borderRadius: "var(--radius-full)",
          }}
        >
          {child}
        </span>
      ))}
      {overflow > 0 && (
        <span
          className="inline-flex items-center justify-center border font-medium"
          style={{
            width: scale.box,
            height: scale.box,
            marginLeft: `calc(-1 * var(--space-2))`,
            borderRadius: "var(--radius-full)",
            borderColor: "var(--border-subtle)",
            background: "var(--surface-sunken)",
            color: "var(--text-secondary)",
            fontSize: scale.font,
            boxShadow: "0 0 0 2px var(--surface)",
          }}
        >
          +{overflow}
        </span>
      )}
    </div>
    </AvatarGroupSize.Provider>
  );
}
