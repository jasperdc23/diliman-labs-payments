import type { ReactNode } from "react";
import { Card, CardTitle, CardBody, CardFooter } from "./card";
import styles from "./media-card.module.css";

type MediaCardProps = {
  title: string;
  description?: ReactNode;
  eyebrow?: string;
  footer?: ReactNode;
  image?: string;
  imageAlt?: string;
  aspectRatio?: string;
  overlay?: boolean;
  interactive?: boolean;
  flat?: boolean;
  className?: string;
};

const placeholderBackground = [
  "linear-gradient(135deg, color-mix(in srgb, var(--accent) 22%, transparent) 0%, transparent 60%)",
  "linear-gradient(315deg, color-mix(in srgb, var(--accent) 14%, transparent) 0%, transparent 55%)",
  "repeating-linear-gradient(45deg, color-mix(in srgb, var(--border-subtle) 60%, transparent) 0 var(--space-1), transparent var(--space-1) var(--space-3))",
  "var(--surface-sunken)",
].join(", ");

function Media({
  image,
  imageAlt,
  aspectRatio,
  interactive,
  children,
}: {
  image?: string;
  imageAlt?: string;
  aspectRatio: string;
  interactive: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden" style={{ aspectRatio }}>
      <div
        role={image ? "img" : "presentation"}
        aria-label={image ? imageAlt : undefined}
        className={
          interactive
            ? "absolute inset-0 transition-transform duration-[var(--duration-normal)] ease-[var(--ease-standard)] group-hover:scale-[1.04]"
            : "absolute inset-0"
        }
        style={
          image
            ? { backgroundImage: `url("${image}")`, backgroundSize: "cover", backgroundPosition: "center" }
            : { background: placeholderBackground }
        }
      />
      {children}
    </div>
  );
}

export function MediaCard({
  title,
  description,
  eyebrow,
  footer,
  image,
  imageAlt = "",
  aspectRatio = "16 / 10",
  overlay = false,
  interactive = false,
  flat = false,
  className = "",
}: MediaCardProps) {
  if (overlay) {
    return (
      <Card
        padded={false}
        interactive={interactive}
        flat={flat}
        className={`group overflow-hidden ${className}`}
      >
        <Media image={image} imageAlt={imageAlt} aspectRatio={aspectRatio} interactive={interactive}>
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, var(--surface-overlay) 0%, color-mix(in srgb, var(--surface-overlay) 40%, transparent) 45%, transparent 75%)",
            }}
          />
          <div
            className={`absolute inset-x-0 bottom-0 flex flex-col ${styles.overlayText}`}
            style={{ padding: "var(--space-6)", gap: "var(--space-2)" }}
          >
            {eyebrow ? (
              <span
                className="font-medium uppercase tracking-wide"
                style={{ fontSize: "var(--text-xs)", color: "var(--media-overlay-fg-muted)" }}
              >
                {eyebrow}
              </span>
            ) : null}
            <CardTitle style={{ color: "var(--media-overlay-fg)" }}>{title}</CardTitle>
            {description ? (
              <div style={{ fontSize: "var(--text-sm)", color: "var(--media-overlay-fg-muted)" }}>
                {description}
              </div>
            ) : null}
            {footer ? (
              <div
                className="flex items-center"
                style={{ gap: "var(--space-3)", marginTop: "var(--space-2)" }}
              >
                {footer}
              </div>
            ) : null}
          </div>
        </Media>
      </Card>
    );
  }

  return (
    <Card
      padded={false}
      interactive={interactive}
      flat={flat}
      className={`group overflow-hidden ${className}`}
    >
      <Media image={image} imageAlt={imageAlt} aspectRatio={aspectRatio} interactive={interactive} />
      <div
        className="flex flex-1 flex-col"
        style={{ padding: "var(--space-6)", gap: "var(--space-4)" }}
      >
        <div className="flex flex-col" style={{ gap: "var(--space-1)" }}>
          {eyebrow ? (
            <span
              className="font-medium uppercase tracking-wide text-text-tertiary"
              style={{ fontSize: "var(--text-xs)" }}
            >
              {eyebrow}
            </span>
          ) : null}
          <CardTitle>{title}</CardTitle>
        </div>
        {description ? <CardBody>{description}</CardBody> : null}
        {footer ? <CardFooter className="mt-auto">{footer}</CardFooter> : null}
      </div>
    </Card>
  );
}
