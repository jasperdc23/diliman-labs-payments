import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/ssr";

export function BackLink({
  href = "/examples",
  label = "Back to design kit",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      className="glass absolute top-6 left-6 z-10 inline-flex items-center rounded-full border text-sm font-medium text-text-secondary transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:text-text-primary"
      style={{ gap: "var(--space-2)", padding: "var(--space-2) var(--space-4)" }}
    >
      <ArrowLeft size={16} weight="regular" aria-hidden="true" />
      {label}
    </Link>
  );
}
