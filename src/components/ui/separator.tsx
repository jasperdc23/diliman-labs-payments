type SeparatorProps = {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
  className?: string;
};

/** A single divider line. Purely presentational by default (`aria-hidden`);
 * set `decorative={false}` when the line marks a real semantic boundary
 * (e.g. between two independent groups of content) so it gets
 * `role="separator"` instead. */
export function Separator({
  orientation = "horizontal",
  decorative = true,
  className = "",
}: SeparatorProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      role={decorative ? undefined : "separator"}
      aria-hidden={decorative || undefined}
      aria-orientation={decorative ? undefined : orientation}
      className={className}
      style={{
        flexShrink: 0,
        backgroundColor: "var(--border-subtle)",
        width: isHorizontal ? "100%" : "1px",
        height: isHorizontal ? "1px" : "100%",
      }}
    />
  );
}
