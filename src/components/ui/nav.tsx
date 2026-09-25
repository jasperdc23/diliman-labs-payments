"use client";

import { useState } from "react";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react/ssr";
import { ThemeToggle } from "../theme-toggle";
import { BrandMark } from "../brand-mark";

const links = [
  { label: "Docs", href: "/docs" },
  { label: "Foundations", href: "/docs/color" },
  { label: "Components", href: "/docs/button" },
  { label: "Examples", href: "/examples" },
];

function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="group relative py-2 text-sm font-medium text-text-secondary transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:text-text-primary"
    >
      {label}
      <span
        className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent transition-transform duration-[var(--duration-fast)] ease-[var(--ease-standard)] group-hover:scale-x-100"
        aria-hidden
      />
    </Link>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 w-full">
      <div className="glass flex items-center justify-between border-b px-4 py-3 sm:px-6 lg:px-8 xl:px-16">
        <Link href="/" aria-label="Diliman Labs home" className="flex items-center">
          <BrandMark height={28} />
        </Link>

        <nav className="hidden items-center gap-6 sm:flex" aria-label="Primary">
          {links.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-md text-text-primary transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:bg-surface-sunken sm:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} weight="regular" /> : <List size={18} weight="regular" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="glass flex flex-col gap-1 border-b p-3 sm:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-text-secondary transition-colors duration-[var(--duration-fast)] hover:bg-surface-sunken hover:text-text-primary"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
