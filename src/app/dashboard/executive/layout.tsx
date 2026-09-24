import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * The brief itself is a Client Component (period state, drilldowns,
 * confirmations), and a client file cannot export `metadata`. This server
 * layout carries the title instead, which is the whole reason it exists.
 */
export const metadata: Metadata = {
  title: "Executive Brief · Diliman Labs",
  description:
    "Business health at a glance: gross volume, rail mix and settlement health across today, 7 days, 30 days or the quarter.",
};

export default function ExecutiveBriefLayout({ children }: { children: ReactNode }) {
  return children;
}
