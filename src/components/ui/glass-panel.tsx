import type { HTMLAttributes } from "react";

type GlassPanelProps = HTMLAttributes<HTMLDivElement> & {
  radius?: "lg" | "xl";
};

const radiusClass: Record<NonNullable<GlassPanelProps["radius"]>, string> = {
  lg: "rounded-lg",
  xl: "rounded-xl",
};

export function GlassPanel({
  radius = "xl",
  className = "",
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={`glass border shadow-md ${radiusClass[radius]} ${className}`}
      {...props}
    />
  );
}
