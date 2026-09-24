"use client";

import type { HTMLAttributes, MouseEventHandler, ReactNode } from "react";

type ListProps = HTMLAttributes<HTMLUListElement>;

export function List({ className = "", ...props }: ListProps) {
  return (
    <ul
      role="list"
      className={`flex list-none flex-col divide-y divide-border-subtle ${className}`}
      {...props}
    />
  );
}

type ListRowProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  disabled?: boolean;
  className?: string;
};

const interactiveClasses =
  "w-full cursor-pointer text-left transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:bg-surface-sunken";

export function ListRow({
  title,
  subtitle,
  leading,
  trailing,
  href,
  onClick,
  disabled = false,
  className = "",
}: ListRowProps) {
  const content = (
    <>
      {leading ? <span className="flex shrink-0 items-center">{leading}</span> : null}
      <span className="flex min-w-0 flex-1 flex-col" style={{ gap: "var(--space-1)" }}>
        <span
          className="truncate font-medium text-text-primary"
          style={{ fontSize: "var(--text-sm)", lineHeight: "var(--leading-tight)" }}
        >
          {title}
        </span>
        {subtitle ? (
          <span className="truncate text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
            {subtitle}
          </span>
        ) : null}
      </span>
      {trailing ? (
        <span
          className="flex shrink-0 items-center text-text-secondary"
          style={{ gap: "var(--space-2)", fontSize: "var(--text-sm)" }}
        >
          {trailing}
        </span>
      ) : null}
    </>
  );

  const innerClassName = `flex items-center ${className}`;
  const innerStyle = { gap: "var(--space-3)", padding: "var(--space-3) var(--space-4)" };

  if (href && !disabled) {
    return (
      <li>
        <a href={href} className={`${innerClassName} ${interactiveClasses}`} style={innerStyle}>
          {content}
        </a>
      </li>
    );
  }

  if (onClick) {
    return (
      <li>
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={`${innerClassName} ${
            disabled ? "cursor-not-allowed opacity-60" : interactiveClasses
          }`}
          style={innerStyle}
        >
          {content}
        </button>
      </li>
    );
  }

  return (
    <li className={innerClassName} style={innerStyle}>
      {content}
    </li>
  );
}
