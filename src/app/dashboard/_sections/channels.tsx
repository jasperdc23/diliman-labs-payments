"use client";

import { useMemo, useState } from "react";
import { CreditCard, Plugs, QrCode, Wallet } from "@phosphor-icons/react/ssr";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/ui/stat-card";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  CHANNEL_TYPE_LABEL,
  channels as baseChannels,
  channelsTotalVolume,
  formatCount,
  formatPercent,
  formatPeso,
  type Channel,
  type ChannelType,
} from "@/app/dashboard/_data/payments";
import { SectionFrame } from "../_components/section-frame";
import { useOps } from "../_components/ops-context";
import styles from "../ops.module.css";

const TYPE_FILTERS: { value: ChannelType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "e-wallet", label: "E-wallets" },
  { value: "qr", label: "QR" },
  { value: "card", label: "Cards" },
  { value: "bank", label: "Banks" },
];

const TYPE_ICON: Record<ChannelType, typeof Wallet> = {
  "e-wallet": Wallet,
  qr: QrCode,
  card: CreditCard,
  bank: Plugs,
};

type ChannelRow = Channel & { enabled: boolean };

export function ChannelsSection() {
  const ops = useOps();
  const [typeFilter, setTypeFilter] = useState<ChannelType | "all">("all");
  const [pendingToggle, setPendingToggle] = useState<{ id: string; name: string; next: boolean } | null>(
    null,
  );

  const channelList: ChannelRow[] = useMemo(
    () =>
      baseChannels.map((channel) => ({
        ...channel,
        enabled: !ops.disabledChannelIds.includes(channel.id),
      })),
    [ops.disabledChannelIds],
  );

  const filtered = useMemo(
    () => (typeFilter === "all" ? channelList : channelList.filter((c) => c.type === typeFilter)),
    [channelList, typeFilter],
  );

  const enabledCount = channelList.filter((c) => c.enabled).length;
  const activeVolume = channelList
    .filter((c) => c.enabled)
    .reduce((sum, c) => sum + c.volumeShare, 0);

  const requestToggle = (row: ChannelRow, next: boolean) => {
    setPendingToggle({ id: row.id, name: row.name, next });
  };

  const confirmToggle = () => {
    if (!pendingToggle) return;
    ops.toggleChannel(pendingToggle.id, pendingToggle.next);
    setPendingToggle(null);
  };

  return (
    <SectionFrame
      eyebrow="Payment providers"
      title="Channels"
      description="Every way customers can pay — e-wallets, QR Ph, cards and partner banks — with a switch to take any of them offline."
      loading={ops.loading}
      failed={ops.failed}
      onRetry={ops.refresh}
      onBack={() => ops.goTo("settings")}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: "var(--space-6)" }}>
        <StatCard
          tone="accent"
          label="Enabled channels"
          value={`${formatCount(enabledCount)} of ${formatCount(channelList.length)}`}
          caption="Accepting new payments"
          icon={<Plugs size={18} weight="fill" />}
        />
        <StatCard
          label="Volume through enabled channels"
          value={formatPeso(activeVolume)}
          caption="7-day sample, tracked channels"
        />
        <StatCard
          label="E-wallets"
          value={formatCount(channelList.filter((c) => c.type === "e-wallet").length)}
          caption="GCash, Maya, GrabPay"
        />
      </div>

      <Card>
        <div className={styles.chipRow}>
          <ToggleGroup
            type="single"
            value={[typeFilter]}
            onValueChange={(next) => setTypeFilter((next[0] as ChannelType | "all") ?? "all")}
            aria-label="Filter channels by type"
          >
            {TYPE_FILTERS.map((option) => (
              <ToggleGroupItem key={option.value} value={option.value}>
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <span
            className="ml-auto text-text-tertiary"
            style={{ fontSize: "var(--text-sm)" }}
            aria-live="polite"
          >
            {formatCount(filtered.length)} of {formatCount(channelList.length)} channels
          </span>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Plugs size={32} weight="regular" />}
            title="No channels of this type"
            description="Try a different channel type."
            action={{ label: "Show every channel", onClick: () => setTypeFilter("all") }}
          />
        </Card>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
          style={{ gap: "var(--space-4)" }}
          aria-label="Payment channels"
        >
          {filtered.map((row) => {
            const Icon = TYPE_ICON[row.type];
            return (
              <Card key={row.id} className={styles.channelCard}>
                <div className="flex items-start justify-between" style={{ gap: "var(--space-3)" }}>
                  <span className="flex items-center" style={{ gap: "var(--space-3)" }}>
                    <span className={styles.channelIcon} aria-hidden="true">
                      <Icon size={20} weight="regular" />
                    </span>
                    <span className="flex flex-col">
                      <span
                        className="text-text-primary"
                        style={{ fontWeight: "var(--weight-semibold)", fontSize: "var(--text-base)" }}
                      >
                        {row.name}
                      </span>
                      <Badge variant="neutral">{CHANNEL_TYPE_LABEL[row.type]}</Badge>
                    </span>
                  </span>
                  <Badge variant={row.enabled ? "success" : "neutral"} dot>
                    {row.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <dl className="grid grid-cols-2" style={{ gap: "var(--space-3)" }}>
                  <div className="flex flex-col" style={{ gap: "var(--space-1)" }}>
                    <dt className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
                      Settles via
                    </dt>
                    <dd className="text-text-primary" style={{ fontSize: "var(--text-sm)" }}>
                      {row.rail}
                    </dd>
                  </div>
                  <div className="flex flex-col items-end" style={{ gap: "var(--space-1)" }}>
                    <dt className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
                      Share of volume
                    </dt>
                    <dd
                      className="text-text-primary tabular-nums"
                      style={{ fontSize: "var(--text-sm)" }}
                    >
                      {formatPeso(row.volumeShare)}
                      <span
                        className="text-text-tertiary"
                        style={{ fontSize: "var(--text-xs)", marginLeft: "var(--space-1)" }}
                      >
                        ({formatPercent((row.volumeShare / channelsTotalVolume) * 100)})
                      </span>
                    </dd>
                  </div>
                </dl>

                <div
                  className="flex items-center justify-between border-t border-border-subtle"
                  style={{ paddingTop: "var(--space-4)" }}
                >
                  <span className="text-text-secondary" style={{ fontSize: "var(--text-sm)" }}>
                    Accept payments
                  </span>
                  <Switch
                    checked={row.enabled}
                    onChange={(event) => requestToggle(row, event.target.checked)}
                    label={row.enabled ? "Enabled" : "Disabled"}
                    aria-label={`${row.enabled ? "Disable" : "Enable"} ${row.name}`}
                  />
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <AlertDialog
        open={pendingToggle !== null}
        onOpenChange={(open) => !open && setPendingToggle(null)}
        title={
          pendingToggle
            ? pendingToggle.next
              ? `Enable ${pendingToggle.name}?`
              : `Disable ${pendingToggle.name}?`
            : ""
        }
        description={
          pendingToggle
            ? pendingToggle.next
              ? `${pendingToggle.name} will start accepting payments again in the live payment gateway. Customers will be able to pay through it immediately.`
              : `${pendingToggle.name} will be taken offline in the live payment gateway. Customers will not be able to pay through it until it's re-enabled.`
            : undefined
        }
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={() => setPendingToggle(null)}>
              Cancel
            </Button>
            <Button
              variant={pendingToggle?.next ? "primary" : "danger"}
              size="sm"
              onClick={confirmToggle}
            >
              {pendingToggle?.next ? "Enable channel" : "Disable channel"}
            </Button>
          </>
        }
      />
    </SectionFrame>
  );
}
