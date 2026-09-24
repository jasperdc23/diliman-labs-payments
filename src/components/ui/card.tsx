import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
  /** Drop the backdrop blur — use in dense grids and long lists. */
  flat?: boolean;
  padded?: boolean;
};

/**
 * Padding follows the Foundations/Spacing guide: --space-6 for card
 * padding, --space-4 gap between internal blocks.
 */
export function Card({
  interactive = false,
  flat = false,
  padded = true,
  className = "",
  style,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`${flat ? "glass-flat" : "glass"} grain flex flex-col rounded-lg border shadow-sm ${
        interactive
          ? "cursor-pointer transition-[transform,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
          : ""
      } ${className}`}
      style={{
        padding: padded ? "var(--space-6)" : undefined,
        gap: padded ? "var(--space-4)" : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`text-base font-semibold text-text-primary ${className}`} {...props} />;
}

export function CardBody({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`text-sm text-text-secondary ${className}`} {...props} />;
}

export function CardFooter({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex items-center gap-3 border-t border-border-subtle ${className}`}
      style={{ paddingTop: "var(--space-4)" }}
      {...props}
    />
  );
}
