import type { ElementType, HTMLAttributes, ReactNode } from "react";

/**
 * Component API over the type scale documented at /docs/typography. These
 * don't introduce any new sizes — each one renders a size already in the
 * nine-step --text-* scale, just as an importable component instead of a
 * raw style prop, for the common cases (page/section headings, body copy,
 * an intro paragraph, a caption) that show up on nearly every page.
 */

type HeadingLevel = 1 | 2 | 3 | 4;

const HEADING_STYLE: Record<HeadingLevel, { tag: `h${HeadingLevel}`; size: string }> = {
  1: { tag: "h1", size: "var(--text-4xl)" },
  2: { tag: "h2", size: "var(--text-2xl)" },
  3: { tag: "h3", size: "var(--text-xl)" },
  4: { tag: "h4", size: "var(--text-lg)" },
};

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: HeadingLevel;
  as?: ElementType;
  children: ReactNode;
};

export function Heading({ level = 2, as, className = "", style, children, ...props }: HeadingProps) {
  const { tag, size } = HEADING_STYLE[level];
  const Tag = as ?? tag;
  return (
    <Tag
      className={`font-semibold text-text-primary ${className}`}
      style={{ fontSize: size, lineHeight: "var(--leading-tight)", ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
}

type TextTone = "primary" | "secondary" | "tertiary";
type TextSize = "sm" | "base" | "lg";

const TEXT_SIZE: Record<TextSize, string> = {
  sm: "var(--text-sm)",
  base: "var(--text-base)",
  lg: "var(--text-lg)",
};

const TEXT_TONE: Record<TextTone, string> = {
  primary: "var(--text-primary)",
  secondary: "var(--text-secondary)",
  tertiary: "var(--text-tertiary)",
};

type TextProps = HTMLAttributes<HTMLParagraphElement> & {
  size?: TextSize;
  tone?: TextTone;
  as?: ElementType;
  children: ReactNode;
};

/** Body copy. `size` picks the step, `tone` picks the semantic color. */
export function Text({
  size = "base",
  tone = "secondary",
  as: Tag = "p",
  className = "",
  style,
  children,
  ...props
}: TextProps) {
  return (
    <Tag
      className={className}
      style={{
        fontSize: TEXT_SIZE[size],
        lineHeight: "var(--leading-normal)",
        color: TEXT_TONE[tone],
        ...style,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}

type LeadProps = HTMLAttributes<HTMLParagraphElement> & { children: ReactNode };

/** An intro paragraph — larger and lighter than body copy, one per page. */
export function Lead({ className = "", style, children, ...props }: LeadProps) {
  return (
    <p
      className={className}
      style={{
        fontSize: "var(--text-lg)",
        lineHeight: "var(--leading-relaxed)",
        color: "var(--text-secondary)",
        fontWeight: 400,
        ...style,
      }}
      {...props}
    >
      {children}
    </p>
  );
}

type MutedProps = HTMLAttributes<HTMLSpanElement> & { as?: ElementType; children: ReactNode };

/** Small, tertiary-colored caption text — timestamps, helper text, labels. */
export function Muted({ as: Tag = "span", className = "", style, children, ...props }: MutedProps) {
  return (
    <Tag
      className={className}
      style={{
        fontSize: "var(--text-xs)",
        lineHeight: "var(--leading-normal)",
        color: "var(--text-tertiary)",
        ...style,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}
