"use client";

import { useState, type ReactNode } from "react";
import { ArrowRight, ChartBar, Receipt, TrendUp } from "@phosphor-icons/react/ssr";
import { BarChart } from "@/components/ui/bar-chart";
import { LineChart } from "@/components/ui/line-chart";
import { Tabs } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";
import { Marker } from "@/components/ui/marker";
import {
  formatCount,
  formatPeso,
  formatPesoCompact,
  formatPercent,
  type Rail,
} from "../_data/payments";
import { PREVIOUS_LABEL, type Brief } from "./data";
import { Eyebrow, MicroStat } from "./parts";
import styles from "./brief.module.css";

type TrendMode = "rail" | "total";

function Narrative({ children }: { children: ReactNode }) {
  return (
    <p
      className="text-text-secondary"
      style={{
        fontSize: "var(--text-base)",
        lineHeight: "var(--leading-normal)",
        maxWidth: "70ch",
      }}
    >
      {children}
    </p>
  );
}

/**
 * The one ink analytics band on the page — the spec's ink budget for a
 * dashboard screen is chrome, one analytics band and table header bands,
 * and this is the band.
 *
 * `data-surface="ink"` re-scopes the semantic tokens, so LineChart,
 * BarChart, Tabs, Progress, EmptyState and Marker all render correctly
 * inside it with no props: chart series pick up the ink ramp (series-1 is
 * pure yellow here), the tab indicator becomes pure yellow rather than the
 * light theme's dark gold, and the focus ring follows.
 */
export function AnalyticsBand({
  brief,
  onOpenRail,
  onOpenSettlement,
  onWidenPeriod,
}: {
  brief: Brief;
  onOpenRail: (rail: Rail) => void;
  onOpenSettlement: () => void;
  onWidenPeriod: () => void;
}) {
  const [trendMode, setTrendMode] = useState<TrendMode>("rail");

  const { labels, series, totals } = brief.data;
  const first = brief.totalSeries.values[0] ?? 0;
  const last = brief.totalSeries.values[brief.totalSeries.values.length - 1] ?? 0;
  const travel = first === 0 ? 0 : ((last - first) / first) * 100;
  const travelSentence =
    Math.abs(travel) <= 1
      ? "Gross volume held flat from the first bucket to the last"
      : `Gross volume ${travel > 0 ? "climbed" : "fell"} ${formatPercent(Math.abs(travel))} from the first bucket to the last`;

  const settlement = brief.settlement;
  const returnedBatches = brief.batches.filter((b) => b.status === "returned").length;
  const delayedBatches = brief.batches.filter((b) => b.status === "delayed").length;

  const trendPanel = (
    <div className="flex flex-col" style={{ gap: "var(--space-6)" }}>
      <div
        className="flex flex-wrap items-center justify-between"
        style={{ gap: "var(--space-4)" }}
      >
        <Narrative>
          {travelSentence}, with its high point at {formatPesoCompact(brief.peak.value)} (
          {brief.peak.label}) and its low at {formatPesoCompact(brief.trough.value)} (
          {brief.trough.label}).
        </Narrative>
        <div className={styles.scroller}>
          <ToggleGroup
            type="single"
            value={[trendMode]}
            onValueChange={(next) => setTrendMode((next[0] as TrendMode) ?? "rail")}
            aria-label="Trend breakdown"
          >
            <ToggleGroupItem value="rail">By rail</ToggleGroupItem>
            <ToggleGroupItem value="total">All rails</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <LineChart
        labels={labels}
        series={trendMode === "rail" ? series : [brief.totalSeries]}
        area={trendMode === "total"}
        height={300}
        formatValue={formatPesoCompact}
      />
    </div>
  );

  const mixPanel = (
    <div className="flex flex-col" style={{ gap: "var(--space-6)" }}>
      <Narrative>
        {brief.leadRail.rail} carries {formatPercent(brief.leadRail.share)} of gross volume this
        period. The peso figures below are {formatPeso(totals.volume)} allocated by that mix, so
        the three rails add back to the headline.
      </Narrative>

      <BarChart
        labels={brief.railMix.map((slice) => slice.rail)}
        series={[{ name: "Gross volume", values: brief.railMix.map((slice) => slice.volume) }]}
        height={260}
        formatValue={formatPesoCompact}
      />

      <div className="flex flex-col" style={{ gap: "var(--space-3)" }}>
        {brief.railMix.map((slice) => (
          <div key={slice.rail} className={styles.railCard}>
            <button
              type="button"
              className={styles.railHead}
              onClick={() => onOpenRail(slice.rail)}
            >
              <span
                className="flex flex-wrap items-baseline text-text-primary"
                style={{
                  gap: "var(--space-2)",
                  fontSize: "var(--text-base)",
                  fontWeight: "var(--weight-bold)",
                }}
              >
                {slice.rail}
                <span
                  className="text-text-tertiary tabular-nums"
                  style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-regular)" }}
                >
                  {formatPercent(slice.share)} · {formatPeso(slice.volume)}
                </span>
              </span>
              <span className={styles.figureHint} style={{ color: "var(--accent-text)" }}>
                Open {slice.rail}
                <ArrowRight size={12} weight="bold" aria-hidden="true" />
              </span>
            </button>
            <Progress value={slice.share} label={`${slice.rail} share of gross volume`} />
          </div>
        ))}
      </div>
    </div>
  );

  const settlementPanel =
    settlement.batches === 0 ? (
      <EmptyState
        icon={<Receipt size={32} weight="regular" />}
        title="No settlement batches closed in this period"
        description={`Nothing has reached a cut-off inside ${brief.label.toLowerCase()}. Widen the period to see the batches that have already landed.`}
        action={{ label: "Show the last 7 days", onClick: onWidenPeriod }}
        secondaryAction={{ label: "See all batches", onClick: onOpenSettlement }}
      />
    ) : (
      <div className="flex flex-col" style={{ gap: "var(--space-6)" }}>
        <Narrative>
          {formatPercent(settlement.arrivedShare)} of batch value has arrived across{" "}
          {formatCount(settlement.batches)} batches and {formatCount(settlement.items)} payments.{" "}
          {returnedBatches > 0
            ? `${formatPeso(settlement.returned)} came back on ${formatCount(returnedBatches)} returned ${returnedBatches === 1 ? "batch" : "batches"}.`
            : "Nothing was returned."}{" "}
          {delayedBatches > 0
            ? `${formatCount(delayedBatches)} landed after the expected arrival.`
            : "Every batch landed inside its expected window."}
        </Narrative>

        <BarChart
          labels={brief.settlementChart.labels}
          series={brief.settlementChart.series}
          stacked
          height={260}
          formatValue={formatPeso}
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4" style={{ gap: "var(--space-6)" }}>
          <MicroStat
            label="Settled"
            value={formatPeso(settlement.settled)}
            sub={<Marker tone="success" size="sm" label="Arrived on time" />}
          />
          <MicroStat
            label="In window"
            value={formatPeso(settlement.inWindow)}
            sub={<Marker tone="accent" size="sm" label="Still clearing" />}
          />
          <MicroStat
            label="Delayed"
            value={formatPeso(settlement.delayed)}
            sub={<Marker tone="warning" size="sm" label="Arrived late" />}
          />
          <MicroStat
            label="Returned"
            value={formatPeso(settlement.returned)}
            sub={<Marker tone="danger" size="sm" label="Came back" />}
          />
        </div>

        <div>
          <button type="button" className={styles.accentAction} onClick={onOpenSettlement}>
            Open the batch register
            <ArrowRight size={14} weight="bold" aria-hidden="true" />
          </button>
        </div>
      </div>
    );

  return (
    <section
      data-surface="ink"
      className={`bg-surface grain border-y ${styles.band}`}
      aria-labelledby="brief-shape-heading"
    >
      <div className={styles.shell}>
        <div className="flex flex-col" style={{ gap: "var(--space-3)" }}>
          <Eyebrow>The shape of the period</Eyebrow>
          <h2
            id="brief-shape-heading"
            className="text-text-primary"
            style={{
              fontSize: "var(--text-3xl)",
              fontWeight: "var(--weight-black)",
              letterSpacing: "var(--tracking-tight)",
              lineHeight: "var(--leading-tight)",
            }}
          >
            Three questions, {brief.label.toLowerCase()}.
          </h2>
        </div>

        <div style={{ marginTop: "var(--space-8)" }}>
          <Tabs
            label="Period analysis"
            variant="underline"
            items={[
              {
                value: "trend",
                label: "Volume trend",
                icon: <TrendUp size={16} weight="regular" />,
                content: trendPanel,
              },
              {
                value: "mix",
                label: "Rail mix",
                icon: <ChartBar size={16} weight="regular" />,
                content: mixPanel,
              },
              {
                value: "settlement",
                label: "Settlement health",
                icon: <Receipt size={16} weight="regular" />,
                content: settlementPanel,
              },
            ]}
          />
        </div>

        <p
          className="text-text-tertiary"
          style={{ marginTop: "var(--space-8)", fontSize: "var(--text-xs)", maxWidth: "80ch" }}
        >
          Settlement windows, cut-offs and rail behavior shown here are demo data. They are not
          the published BSP, InstaPay, PESONet or QR Ph schedule. Deltas compare against{" "}
          {PREVIOUS_LABEL[brief.period]}.
        </p>
      </div>
    </section>
  );
}
