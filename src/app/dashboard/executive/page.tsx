"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  CaretLeft,
  Copy,
  Gauge,
  BookOpen,
  PaperPlaneTilt,
  SquaresFour,
} from "@phosphor-icons/react/ssr";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Toaster, useToast } from "@/components/ui/toast";
import {
  PERIOD_OPTIONS,
  TODAY_ISO,
  formatCount,
  formatDateTime,
  formatPercent,
  formatPeso,
  type Period,
  type Rail,
} from "../_data/payments";
import { AnalyticsBand } from "./analytics";
import { Concentration } from "./concentration";
import { PREVIOUS_LABEL, buildBrief, type Brief } from "./data";
import { DrilldownModal, type Drilldown } from "./drilldown";
import { Hero } from "./hero";
import { Eyebrow, Figure } from "./parts";
import styles from "./brief.module.css";

/** Plain-text version of the brief, for the clipboard. */
function briefAsText(brief: Brief): string {
  const { totals } = brief.data;
  return [
    "Diliman Labs — Executive Brief",
    `Period: ${brief.label} · as of ${formatDateTime(TODAY_ISO)} PHT`,
    "",
    `Gross volume: ${formatPeso(totals.volume)} (${brief.data.deltas.volume.label} vs ${PREVIOUS_LABEL[brief.period]})`,
    `Net to merchants: ${formatPeso(totals.net)} (${brief.data.deltas.net.label})`,
    `Transactions: ${formatCount(totals.count)} (${brief.data.deltas.count.label})`,
    `Success rate: ${formatPercent(totals.successRate)} (${brief.data.deltas.successRate.label})`,
    `Failed: ${formatCount(totals.failed)} (${brief.data.deltas.failed.label})`,
    `Average ticket: ${formatPeso(totals.averageTicket)}`,
    "",
    `Rail mix: ${brief.railMix.map((s) => `${s.rail} ${formatPercent(s.share)}`).join(" · ")}`,
    `Settlement: ${formatPercent(brief.settlement.arrivedShare)} of batch value arrived; ${formatPeso(brief.settlement.returned)} returned across ${formatCount(brief.settlement.batches)} batches.`,
    "",
    "Demo data. Cut-off times, batch windows and rail behavior are illustrative and are not the published BSP, InstaPay, PESONet or QR Ph schedule.",
  ].join("\n");
}

export default function ExecutiveBriefPage() {
  return (
    <Toaster>
      <ExecutiveBrief />
    </Toaster>
  );
}

function ExecutiveBrief() {
  const { toast } = useToast();

  const [period, setPeriod] = useState<Period>("7d");
  const [detail, setDetail] = useState<Drilldown | null>(null);
  const [confirmingPublish, setConfirmingPublish] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [copying, setCopying] = useState(false);
  const [published, setPublished] = useState<{ period: Period; at: string } | null>(null);

  const publishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (publishTimer.current) clearTimeout(publishTimer.current);
    },
    [],
  );

  // Pure and deterministic, so this is a recompute rather than a fetch —
  // every figure, chart, narrative and drilldown on the page reads from it.
  const brief = useMemo(() => buildBrief(period), [period]);

  const { totals, deltas } = brief.data;
  const comparison = PREVIOUS_LABEL[period];

  const publishedLabel =
    published === null
      ? null
      : (PERIOD_OPTIONS.find((p) => p.value === published.period)?.label ?? published.period);
  const publishedIsStale = published !== null && published.period !== period;

  async function handleCopy() {
    setCopying(true);
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }
      await navigator.clipboard.writeText(briefAsText(brief));
      toast({
        title: "Figures copied",
        description: `${brief.label} — ready to paste into the board pack.`,
        variant: "success",
      });
    } catch {
      toast({
        title: "Could not copy the figures",
        description:
          "The browser blocked clipboard access. Every figure is on screen — select the ones you need and copy them by hand.",
        variant: "danger",
        duration: 8000,
      });
    } finally {
      setCopying(false);
    }
  }

  function handlePublish() {
    setPublishing(true);
    publishTimer.current = setTimeout(() => {
      setPublishing(false);
      setConfirmingPublish(false);
      setPublished({ period, at: TODAY_ISO });
      toast({
        title: `${brief.label} brief published`,
        description:
          "Prototype only — nothing left this page. The brief is marked published until the period changes.",
        variant: "success",
      });
    }, 700);
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* --- Ink chrome. Part of the screen's ink budget, with the analytics
          band and the table header. --- */}
      <header
        data-surface="ink"
        className="bg-surface grain sticky top-0 z-30 border-b"
        style={{ padding: "var(--space-3) 0" }}
      >
        <div
          className={`${styles.shell} flex items-center justify-between`}
          style={{ gap: "var(--space-4)" }}
        >
          <div className="flex min-w-0 items-center" style={{ gap: "var(--space-4)" }}>
            <Link
              href="/dashboard"
              aria-label="All dashboards"
              className="inline-flex shrink-0 items-center rounded-full border border-border-default text-text-secondary transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:bg-surface-raised hover:text-text-primary"
              style={{
                gap: "var(--space-2)",
                padding: "var(--space-2) var(--space-3)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--weight-medium)",
              }}
            >
              <CaretLeft size={14} weight="bold" aria-hidden="true" />
              <span className="hidden sm:inline">All dashboards</span>
            </Link>

            <span className="hidden sm:inline-flex">
              <BrandMark height={20} />
            </span>

            {/* The yellow rule is wrapped rather than given a `hidden`
                utility directly: `.hidden` and the module's `.block` are
                the same specificity, so which one wins would depend on
                stylesheet order. */}
            <span aria-hidden="true" className="hidden shrink-0 lg:inline-flex">
              <span className={styles.block} style={{ width: "var(--space-8)" }} />
            </span>

            <p
              className={`${styles.eyebrow} truncate`}
              style={{ color: "var(--text-primary)" }}
            >
              Executive Brief
            </p>
          </div>

          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1">
        {/* --- Masthead --- */}
        <section className={styles.band} aria-labelledby="brief-title">
          <div className={styles.shell}>
            <span
              aria-hidden="true"
              className={`${styles.block} ${styles.blockWide}`}
              style={{ marginBottom: "var(--space-4)" }}
            />
            <Eyebrow>Executive brief · Diliman Labs Payments</Eyebrow>
            <h1 id="brief-title" className={styles.headline} style={{ marginTop: "var(--space-3)" }}>
              Where the money moved.
            </h1>
            <p
              className="text-text-secondary"
              style={{
                marginTop: "var(--space-4)",
                fontSize: "var(--text-lg)",
                lineHeight: "var(--leading-normal)",
                maxWidth: "60ch",
              }}
            >
              Reporting {brief.label.toLowerCase()}, as of {formatDateTime(TODAY_ISO)} PHT. Every
              figure below is measured against {comparison}.
            </p>

            <div
              className="flex flex-wrap items-center"
              style={{ marginTop: "var(--space-4)", gap: "var(--space-3)" }}
            >
              {published === null ? (
                <>
                  <Badge variant="neutral">Draft</Badge>
                  <span className="text-text-tertiary" style={{ fontSize: "var(--text-sm)" }}>
                    Not circulated yet.
                  </span>
                </>
              ) : publishedIsStale ? (
                <>
                  <Badge variant="warning" dot>
                    Published for {publishedLabel}
                  </Badge>
                  <span className="text-text-tertiary" style={{ fontSize: "var(--text-sm)" }}>
                    The figures on screen have changed since. Republish to circulate{" "}
                    {brief.label.toLowerCase()}.
                  </span>
                </>
              ) : (
                <>
                  <Badge variant="success" dot>
                    Published
                  </Badge>
                  <span className="text-text-tertiary" style={{ fontSize: "var(--text-sm)" }}>
                    {publishedLabel} · {formatDateTime(published.at)}
                  </span>
                </>
              )}
            </div>

            {/* --- The page's controls. Everything here recomputes the page. --- */}
            <div
              className="flex flex-wrap items-center justify-between"
              style={{ marginTop: "var(--space-8)", gap: "var(--space-4)" }}
            >
              <div className={styles.scroller}>
                <ToggleGroup
                  type="single"
                  className={styles.periodGroup}
                  value={[period]}
                  onValueChange={(next) => {
                    const chosen = next[0] as Period | undefined;
                    if (chosen) setPeriod(chosen);
                  }}
                  aria-label="Reporting period"
                >
                  {PERIOD_OPTIONS.map((option) => (
                    <ToggleGroupItem
                      key={option.value}
                      value={option.value}
                      className={styles.periodItem}
                      aria-label={option.label}
                    >
                      <span className="hidden sm:inline">{option.label}</span>
                      <span className="sm:hidden">{option.short}</span>
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              <div className="flex flex-wrap items-center" style={{ gap: "var(--space-3)" }}>
                <Button
                  variant="secondary"
                  loading={copying}
                  iconLeft={<Copy size={16} weight="regular" aria-hidden="true" />}
                  onClick={handleCopy}
                >
                  Copy the figures
                </Button>
                <Button
                  variant="primary"
                  iconLeft={<PaperPlaneTilt size={16} weight="regular" aria-hidden="true" />}
                  onClick={() => setConfirmingPublish(true)}
                >
                  {published === null ? "Publish brief" : "Republish"}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* --- The signature yellow block --- */}
        <Hero brief={brief} onOpenBreakdown={() => setDetail({ kind: "volume" })} />

        {/* --- Three oversized figures, each one a drilldown --- */}
        <section className={styles.band} aria-labelledby="brief-figures-heading">
          <div className={styles.shell}>
            <Eyebrow>
              <span id="brief-figures-heading">The three numbers under it</span>
            </Eyebrow>
            <div
              className="grid sm:grid-cols-2 lg:grid-cols-3"
              style={{ marginTop: "var(--space-6)", gap: "var(--space-8)" }}
            >
              <Figure
                label="Net to merchants"
                value={formatPeso(totals.net)}
                delta={deltas.net}
                caption={`vs ${comparison}`}
                hint="See the fee ladder"
                onOpen={() => setDetail({ kind: "net" })}
              />
              <Figure
                label="Transactions"
                value={formatCount(totals.count)}
                delta={deltas.count}
                caption={`${formatPeso(totals.averageTicket)} average ticket`}
                hint="See the busiest point"
                onOpen={() => setDetail({ kind: "count" })}
              />
              <Figure
                label="Success rate"
                value={formatPercent(totals.successRate)}
                delta={deltas.successRate}
                caption={`${formatCount(totals.failed)} failed · ${deltas.failed.label}`}
                hint="See what needs a decision"
                onOpen={() => setDetail({ kind: "quality" })}
              />
            </div>
          </div>
        </section>

        {/* --- The one ink analytics band --- */}
        <AnalyticsBand
          brief={brief}
          onOpenRail={(rail: Rail) => setDetail({ kind: "rail", rail })}
          onOpenSettlement={() => setDetail({ kind: "settlement" })}
          onWidenPeriod={() => setPeriod("7d")}
        />

        {/* --- Merchant concentration --- */}
        <Concentration
          onOpenMerchant={(merchantId) => setDetail({ kind: "merchant", merchantId })}
        />

        {/* --- Never a dead end: the last band on the page still goes
            somewhere, whichever figure someone stalled on. --- */}
        <section
          className="border-t"
          style={{ paddingBlock: "var(--space-8)" }}
          aria-label="Where to go next"
        >
          <div
            className={`${styles.shell} flex flex-wrap items-center justify-between`}
            style={{ gap: "var(--space-6)" }}
          >
            <p
              className="text-text-tertiary"
              style={{ fontSize: "var(--text-xs)", maxWidth: "62ch" }}
            >
              Every figure on this brief is demo data. Cut-off times, batch windows and rail
              behavior are illustrative and are not the published BSP, InstaPay, PESONet or QR Ph
              schedule. Nothing here is a regulatory filing.
            </p>
            <nav
              className="flex flex-wrap items-center"
              style={{ gap: "var(--space-6)" }}
              aria-label="Related views"
            >
              <Link
                href="/dashboard"
                className="inline-flex items-center text-accent-text transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:opacity-80"
                style={{
                  gap: "var(--space-2)",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--weight-bold)",
                }}
              >
                <SquaresFour size={16} weight="regular" aria-hidden="true" />
                All dashboards
              </Link>
              <Link
                href="/dashboard/ops"
                className="inline-flex items-center text-text-secondary transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:text-text-primary"
                style={{
                  gap: "var(--space-2)",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--weight-medium)",
                }}
              >
                <Gauge size={16} weight="regular" aria-hidden="true" />
                Ops Console
              </Link>
              <Link
                href="/docs/principles"
                className="inline-flex items-center text-text-secondary transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:text-text-primary"
                style={{
                  gap: "var(--space-2)",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--weight-medium)",
                }}
              >
                <BookOpen size={16} weight="regular" aria-hidden="true" />
                Design principles
              </Link>
            </nav>
          </div>
        </section>
      </main>

      {/* Overlays live at the page root, outside every data-surface scope:
          showModal() promotes to the top layer but does not change
          inheritance, so a dialog nested in the ink band would inherit the
          ink tokens and paint black over a white page. */}
      <DrilldownModal detail={detail} brief={brief} onClose={() => setDetail(null)} />

      <AlertDialog
        open={confirmingPublish}
        onOpenChange={(next) => {
          if (publishing) return;
          setConfirmingPublish(next);
        }}
        title={`Publish the ${brief.label.toLowerCase()} brief?`}
        description="Anyone with access to the board pack sees these figures. This prototype does not send anything."
        actions={
          <>
            <Button
              variant="secondary"
              disabled={publishing}
              onClick={() => setConfirmingPublish(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" loading={publishing} onClick={handlePublish}>
              Publish {brief.label.toLowerCase()}
            </Button>
          </>
        }
      >
        <ul className="flex flex-col" style={{ gap: "var(--space-2)" }}>
          <li>
            Gross volume <strong className="text-text-primary">{formatPeso(totals.volume)}</strong>{" "}
            ({deltas.volume.label} vs {comparison})
          </li>
          <li>
            Net to merchants{" "}
            <strong className="text-text-primary">{formatPeso(totals.net)}</strong>
          </li>
          <li>
            Success rate{" "}
            <strong className="text-text-primary">{formatPercent(totals.successRate)}</strong> ·{" "}
            {formatCount(totals.failed)} failed
          </li>
          <li>As of {formatDateTime(TODAY_ISO)} PHT · demo data</li>
        </ul>
      </AlertDialog>
    </div>
  );
}
