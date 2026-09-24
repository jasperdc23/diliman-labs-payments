"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowsClockwise,
  Bank,
  CalendarBlank,
  DownloadSimple,
  Receipt,
  Warning,
} from "@phosphor-icons/react/ssr";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { BarChart } from "@/components/ui/bar-chart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Marker } from "@/components/ui/marker";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/ui/stat-card";
import { Table, type TableColumn } from "@/components/ui/table";
import { Tabs } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  RAILS,
  RAIL_META,
  SETTLEMENT_STATUS_BADGE_VARIANT,
  SETTLEMENT_STATUS_LABEL,
  TODAY_ISO,
  formatCount,
  formatDate,
  formatPeso,
  formatPesoCompact,
  formatTime,
  nextCutOff,
  settlementBatches,
  settlementSeries,
  settlementTotals,
  type Rail,
  type SettlementBatch,
  type SettlementStatus,
} from "@/app/dashboard/_data/payments";
import { SectionFrame } from "../_components/section-frame";
import { useOps } from "../_components/ops-context";
import styles from "../ops.module.css";

const STATUS_FILTERS: { value: SettlementStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "settled", label: "Settled" },
  { value: "in_window", label: "In window" },
  { value: "delayed", label: "Delayed" },
  { value: "returned", label: "Returned" },
];

/** Elapsed share of the stretch between the cut-off and expected arrival. */
function windowProgress(batch: SettlementBatch): number {
  const start = new Date(batch.cutOff).getTime();
  const end = new Date(batch.expectedArrival).getTime();
  const now = new Date(TODAY_ISO).getTime();
  if (end <= start) return 100;
  return Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
}

export function SettlementsSection() {
  const ops = useOps();
  const [statusFilter, setStatusFilter] = useState<SettlementStatus | "all">("all");
  const [railFilter, setRailFilter] = useState<Rail | "all">("all");

  const leadBatch = settlementBatches.find((batch) => batch.status === "in_window");
  const progress = leadBatch ? windowProgress(leadBatch) : 100;

  const batches = useMemo(
    () =>
      settlementBatches.filter(
        (batch) =>
          (statusFilter === "all" || batch.status === statusFilter) &&
          (railFilter === "all" || batch.rail === railFilter),
      ),
    [statusFilter, railFilter],
  );

  const returned = settlementBatches.filter((batch) => batch.status === "returned");
  const filtersActive = statusFilter !== "all" || railFilter !== "all";

  const columns: TableColumn<SettlementBatch>[] = [
    {
      key: "reference",
      header: "Batch",
      sortable: true,
      render: (row) => (
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: "var(--weight-semibold)" }}>
          {row.reference}
        </span>
      ),
    },
    { key: "rail", header: "Rail", sortable: true },
    { key: "window", header: "Window" },
    {
      key: "cutOff",
      header: "Cut-off",
      sortable: true,
      render: (row) => `${formatDate(row.cutOff)} · ${formatTime(row.cutOff)}`,
    },
    {
      key: "arrival",
      header: "Arrival",
      sortValue: (row) => row.actualArrival ?? "9999",
      sortable: true,
      render: (row) =>
        row.actualArrival ? (
          formatTime(row.actualArrival)
        ) : (
          <span className="text-text-tertiary">Pending</span>
        ),
    },
    {
      key: "itemCount",
      header: "Items",
      align: "right",
      sortable: true,
      render: (row) => formatCount(row.itemCount),
    },
    {
      key: "amount",
      header: "Net credited",
      align: "right",
      sortable: true,
      render: (row) => formatPeso(row.amount),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => (
        <Badge variant={SETTLEMENT_STATUS_BADGE_VARIANT[row.status]} dot>
          {SETTLEMENT_STATUS_LABEL[row.status]}
        </Badge>
      ),
    },
    {
      key: "open",
      header: "",
      align: "right",
      render: (row) => (
        <button type="button" className={styles.linkButton} onClick={() => ops.openBatch(row.id)}>
          Open
          <ArrowRight size={14} weight="bold" aria-hidden="true" />
        </button>
      ),
    },
  ];

  return (
    <SectionFrame
      eyebrow="Rails and windows"
      title="Settlements"
      description="Batch movement across InstaPay, PESONet and QR Ph over the last four days. Cut-off times and windows here are demo data, not the published rail schedule."
      loading={ops.loading}
      failed={ops.failed}
      onRetry={ops.refresh}
      onBack={() => ops.goTo("settings")}
      actions={
        <>
          <Button
            variant="secondary"
            size="sm"
            iconLeft={<DownloadSimple size={14} weight="regular" />}
            onClick={() => ops.exportRows(batches.length, "the batch list")}
            disabled={batches.length === 0}
          >
            Export {formatCount(batches.length)}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconLeft={<ArrowsClockwise size={14} weight="regular" />}
            onClick={ops.refresh}
          >
            Refresh
          </Button>
        </>
      }
    >
      {/* The screen's one yellow block: the batch that has not landed yet. */}
      <div className={styles.accentFrame}>
      <div data-surface="accent" className={`${styles.accentPanel} grain`}>
        <div className="flex flex-wrap items-start justify-between" style={{ gap: "var(--space-4)" }}>
          <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
            <span className={styles.eyebrow}>Next credit expected</span>
            <span
              className="text-text-primary"
              style={{
                fontSize: "var(--text-4xl)",
                lineHeight: "var(--leading-tight)",
                fontWeight: "var(--weight-black)",
                letterSpacing: "var(--tracking-tight)",
              }}
            >
              {nextCutOff.rail} · {nextCutOff.time}
            </span>
            <span className="text-text-secondary" style={{ fontSize: "var(--text-sm)" }}>
              {nextCutOff.date}, {nextCutOff.batchLabel}. Cut-off closed; funds land at{" "}
              {leadBatch ? formatTime(leadBatch.expectedArrival) : "the next sweep"}.
            </span>
          </div>

          <div className="flex flex-col items-start" style={{ gap: "var(--space-2)" }}>
            <span className={styles.eyebrow}>Value in window</span>
            <span className={styles.bandValue}>{formatPeso(settlementTotals.inWindow)}</span>
            {leadBatch && (
              <button
                type="button"
                className={styles.linkButton}
                onClick={() => ops.openBatch(leadBatch.id)}
              >
                Open {leadBatch.reference}
                <ArrowRight size={14} weight="bold" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
          <Progress value={progress} variant="success" label="Time elapsed toward expected arrival" />
          <span className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
            {Math.round(progress)}% of the way from cut-off to expected arrival, measured at{" "}
            {formatTime(TODAY_ISO)}.
          </span>
        </div>
      </div>
      </div>

      {returned.length > 0 && (
        <Alert
          variant="warning"
          title={`${formatCount(returned.length)} batches returned in this window`}
          description={
            <span className="flex flex-wrap items-center" style={{ gap: "var(--space-4)" }}>
              <span>
                {formatPeso(returned.reduce((sum, batch) => sum + batch.amount, 0))} bounced back
                and needs re-submission.
              </span>
              <button
                type="button"
                className={styles.linkButton}
                onClick={() => {
                  setStatusFilter("returned");
                  setRailFilter("all");
                }}
              >
                Show only returned batches
                <ArrowRight size={14} weight="bold" aria-hidden="true" />
              </button>
            </span>
          }
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4" style={{ gap: "var(--space-4)" }}>
        <StatCard
          label="Settled today"
          value={formatPeso(settlementTotals.settledToday)}
          caption={`${formatCount(settlementTotals.batchesToday)} batches`}
          icon={<Bank size={18} weight="fill" />}
        />
        <StatCard
          label="In window"
          value={formatPeso(settlementTotals.inWindow)}
          caption="Not yet credited"
          icon={<CalendarBlank size={18} weight="fill" />}
        />
        <StatCard
          label="Returned"
          value={formatPeso(settlementTotals.returned)}
          caption="Needs re-submission"
          icon={<Warning size={18} weight="fill" />}
        />
        <StatCard
          label="Batches today"
          value={formatCount(settlementTotals.batchesToday)}
          caption="Across all three rails"
          icon={<Receipt size={18} weight="fill" />}
        />
      </div>

      {/* One card, one focus: the trend and the per-rail state answer
          different questions, so only one is on screen at a time. Rail
          health still filters the batch table below it. */}
      <Card padded={false} className="overflow-hidden">
        <div style={{ padding: "var(--space-6) var(--space-6) 0" }}>
          <Tabs
            variant="underline"
            label="Settlement trend and rail health"
            items={[
              {
                value: "trend",
                label: "Trend",
                content: (
                  <div
                    className="flex flex-col"
                    style={{ gap: "var(--space-4)", paddingBlock: "var(--space-5)" }}
                  >
                    <div className="flex flex-col" style={{ gap: "var(--space-1)" }}>
                      <h3
                        className="text-text-primary"
                        style={{ fontSize: "var(--text-base)", fontWeight: "var(--weight-bold)" }}
                      >
                        Net settled vs. returned
                      </h3>
                      <p className="text-text-tertiary" style={{ fontSize: "var(--text-sm)" }}>
                        21&ndash;27 Aug 2026, in PHP. Hover a day for the exact figures.
                      </p>
                    </div>
                    <BarChart
                      labels={settlementSeries.labels}
                      series={settlementSeries.series}
                      formatValue={formatPesoCompact}
                      height={260}
                    />
                  </div>
                ),
              },
              {
                value: "rails",
                label: "Rail health",
                content: (
                  <div
                    className="grid grid-cols-1 lg:grid-cols-3"
                    style={{ gap: "var(--space-4)", paddingBlock: "var(--space-5)" }}
                  >
                    {RAILS.map((rail) => {
                      const meta = RAIL_META[rail];
                      const active = railFilter === rail;
                      return (
                        <Card
                          key={rail}
                          flat
                          style={
                            active
                              ? { boxShadow: "inset 0 0 0 var(--rule-medium) var(--accent-text)" }
                              : undefined
                          }
                        >
                          <div className="flex items-start justify-between" style={{ gap: "var(--space-3)" }}>
                            <div className="flex flex-col" style={{ gap: "var(--space-1)" }}>
                              <span
                                className="text-text-primary"
                                style={{ fontSize: "var(--text-base)", fontWeight: "var(--weight-bold)" }}
                              >
                                {rail}
                              </span>
                              <span className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
                                {meta.cadence}
                              </span>
                            </div>
                            <Marker tone={meta.state} label={meta.stateLabel} size="sm" />
                          </div>

                          <p
                            className="text-text-secondary"
                            style={{ fontSize: "var(--text-sm)", lineHeight: "var(--leading-normal)" }}
                          >
                            {meta.description}
                          </p>

                          <div
                            className="flex flex-wrap items-center justify-between"
                            style={{ gap: "var(--space-3)" }}
                          >
                            <span className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
                              Next window {meta.nextWindow}
                            </span>
                            <button
                              type="button"
                              className={styles.linkButton}
                              aria-pressed={active}
                              onClick={() => setRailFilter(active ? "all" : rail)}
                            >
                              {active ? "Clear rail filter" : `Show ${rail} batches`}
                              <ArrowRight size={14} weight="bold" aria-hidden="true" />
                            </button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </Card>

      <Card padded={false} className="overflow-hidden">
        <div
          className="flex flex-wrap items-center justify-between border-b border-border-subtle"
          style={{ padding: "var(--space-4) var(--space-6)", gap: "var(--space-3)" }}
        >
          <div className="flex flex-col" style={{ gap: "var(--space-1)" }}>
            <h3
              className="text-text-primary"
              style={{ fontSize: "var(--text-base)", fontWeight: "var(--weight-bold)" }}
            >
              Settlement batches
            </h3>
            <p className="text-text-tertiary" style={{ fontSize: "var(--text-sm)" }}>
              {formatCount(batches.length)} of {formatCount(settlementBatches.length)} batches
              {railFilter !== "all" ? ` · ${railFilter}` : ""}
              {statusFilter !== "all" ? ` · ${SETTLEMENT_STATUS_LABEL[statusFilter]}` : ""}
            </p>
          </div>

          <div className={styles.chipRow}>
            <ToggleGroup
              type="single"
              value={[statusFilter]}
              onValueChange={(next) =>
                setStatusFilter((next[0] as SettlementStatus | "all") ?? "all")
              }
              aria-label="Filter batches by status"
            >
              {STATUS_FILTERS.map((option) => (
                <ToggleGroupItem key={option.value} value={option.value}>
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            {filtersActive && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStatusFilter("all");
                  setRailFilter("all");
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        <div style={{ padding: "var(--space-4)" }}>
          <Table
            columns={columns}
            rows={batches}
            getRowKey={(row) => row.id}
            headerTone="ink"
            zebra={ops.settings.zebra}
            density={ops.settings.density}
            defaultSort={{ key: "cutOff", direction: "desc" }}
            caption="Settlement batches across all rails"
            emptyState={
              <EmptyState
                title="No batches match this filter"
                description={`Nothing in the 14-batch sample is ${
                  statusFilter === "all" ? "on this rail" : SETTLEMENT_STATUS_LABEL[statusFilter].toLowerCase()
                }${railFilter === "all" ? "" : ` on ${railFilter}`}.`}
                action={{
                  label: "Clear batch filters",
                  onClick: () => {
                    setStatusFilter("all");
                    setRailFilter("all");
                  },
                }}
                secondaryAction={{ label: "Back to Overview", onClick: () => ops.goTo("overview") }}
              />
            }
          />
        </div>
      </Card>

      <p className="text-text-tertiary" style={{ fontSize: "var(--text-xs)", lineHeight: "var(--leading-normal)" }}>
        Compliance note: every cut-off time, window and batch figure on this page is illustrative
        demo data. It is not the published BSP, InstaPay or PESONet settlement schedule and must be
        verified before it appears on anything customer-facing.
      </p>
    </SectionFrame>
  );
}
