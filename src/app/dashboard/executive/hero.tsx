"use client";

import { ArrowRight } from "@phosphor-icons/react/ssr";
import { Sparkline } from "@/components/ui/sparkline";
import {
  formatCount,
  formatPeso,
  formatPesoCompact,
  formatPercent,
} from "../_data/payments";
import { PREVIOUS_LABEL, type Brief } from "./data";
import { DeltaTag, Eyebrow, MicroStat } from "./parts";
import styles from "./brief.module.css";

/**
 * The signature moment: one full-bleed yellow block carrying the single
 * figure the brief exists to deliver, in oversized ink type.
 *
 * `data-surface="accent"` re-declares the semantic token layer for the
 * whole subtree — ink body type, ink borders, an ink focus ring, darkened
 * success/danger that stay legible on yellow — so nothing inside needs a
 * prop or an inline color. The paint is applied here, separately, because
 * mixing a paint into the scope is what breaks it for Card and friends.
 *
 * This is the ONE full-bleed yellow block on the page. A second would
 * flatten the hierarchy rather than double the brand.
 */
export function Hero({ brief, onOpenBreakdown }: { brief: Brief; onOpenBreakdown: () => void }) {
  const { totals, previousTotals, deltas } = brief.data;
  const comparison = PREVIOUS_LABEL[brief.period];

  return (
    <section
      data-surface="accent"
      className={`grain border-y ${styles.band}`}
      style={{ background: "var(--surface)", borderColor: "var(--border-strong)" }}
      aria-labelledby="brief-hero-label"
    >
      <div className={styles.shell}>
        <div
          className="grid items-end lg:grid-cols-[minmax(0,1fr)_auto]"
          style={{ gap: "var(--space-8)" }}
        >
          <div className="flex min-w-0 flex-col" style={{ gap: "var(--space-3)" }}>
            <Eyebrow>
              <span id="brief-hero-label">Gross volume · {brief.label}</span>
            </Eyebrow>
            <p className={styles.display}>{formatPeso(totals.volume)}</p>
            <DeltaTag
              delta={deltas.volume}
              caption={`vs ${comparison} · ${formatPeso(previousTotals.volume)}`}
            />
          </div>

          <div
            className="flex flex-col items-start lg:items-end"
            style={{ gap: "var(--space-2)" }}
          >
            {/* Ink line on yellow. --text-primary resolves to the brand ink
                inside this scope, so the sparkline needs no theme check. */}
            <Sparkline
              values={brief.totalSeries.values}
              width={224}
              height={64}
              color="var(--text-primary)"
            />
            <p
              className="text-text-secondary tabular-nums"
              style={{ fontSize: "var(--text-sm)" }}
            >
              Peak {brief.peak.label} · {formatPesoCompact(brief.peak.value)} — low{" "}
              {brief.trough.label} · {formatPesoCompact(brief.trough.value)}
            </p>
          </div>
        </div>

        <div
          className="grid border-t sm:grid-cols-3"
          style={{
            marginTop: "var(--space-8)",
            paddingTop: "var(--space-6)",
            gap: "var(--space-6)",
            borderColor: "var(--border-default)",
          }}
        >
          <MicroStat
            label="Transactions"
            value={formatCount(totals.count)}
            sub={`${deltas.count.label} vs ${comparison}`}
          />
          <MicroStat
            label="Average ticket"
            value={formatPeso(totals.averageTicket)}
            sub={`${formatPeso(previousTotals.averageTicket)} last period`}
          />
          <MicroStat
            label="Net to merchants"
            value={formatPeso(totals.net)}
            sub={`${formatPercent(brief.takeRate, 2)} effective take rate`}
          />
        </div>

        <div
          className="flex flex-wrap items-center justify-between border-t"
          style={{
            marginTop: "var(--space-6)",
            paddingTop: "var(--space-6)",
            gap: "var(--space-4)",
            borderColor: "var(--border-default)",
          }}
        >
          <p
            className="text-text-secondary"
            style={{ fontSize: "var(--text-base)", maxWidth: "48ch" }}
          >
            {brief.leadRail.rail} carries {formatPercent(brief.leadRail.share)} of it —{" "}
            {formatPeso(brief.leadRail.volume)} of the {formatPeso(totals.volume)} above.
          </p>
          <button type="button" className={styles.heroAction} onClick={onOpenBreakdown}>
            See the rail breakdown
            <ArrowRight size={14} weight="bold" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
