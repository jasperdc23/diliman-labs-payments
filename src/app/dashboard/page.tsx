"use client";

import { useOps } from "./_components/ops-context";
import { OverviewSection } from "./_sections/overview";
import { TransactionsSection } from "./_sections/transactions";
import { ChannelsSection } from "./_sections/channels";
import { SettlementsSection } from "./_sections/settlements";
import { SettingsSection } from "./_sections/settings";

/**
 * The five sections that still switch in place under one URL. Merchants
 * moved out to `/dashboard/merchants*` — real routes under the shared
 * layout in `./layout.tsx`, which now owns the sidebar, topbar, command
 * palette, toasts and the shared transaction/batch Modal.
 */
export default function OpsConsolePage() {
  const { section } = useOps();

  return (
    <>
      {section === "overview" && <OverviewSection />}
      {section === "transactions" && <TransactionsSection />}
      {section === "channels" && <ChannelsSection />}
      {section === "settlements" && <SettlementsSection />}
      {section === "settings" && <SettingsSection />}
    </>
  );
}
