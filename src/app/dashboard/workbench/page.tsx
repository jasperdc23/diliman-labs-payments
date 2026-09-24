import type { Metadata } from "next";
import { Workbench } from "./workbench";

/**
 * Server component on purpose: it is the only file on this route allowed
 * to export `metadata`, and every handler below it lives behind the
 * "use client" boundary in workbench.tsx.
 */
export const metadata: Metadata = {
  title: "Payment Workbench · Diliman Labs",
  description:
    "Work the payment queue: triage, approve, retry, refund and export payments across InstaPay, PESONet and QR Ph.",
};

export default function WorkbenchPage() {
  return <Workbench />;
}
