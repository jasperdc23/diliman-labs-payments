import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowsLeftRight,
  BookOpen,
  ChartLineUp,
  Gauge,
  Wrench,
} from "@phosphor-icons/react/ssr";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  formatCount,
  formatPeso,
  getPeriodData,
  merchants,
  needsReview,
  transactions,
} from "./_data/payments";

export const metadata: Metadata = {
  title: "Choose a dashboard · Diliman Labs",
  description:
    "Three dashboard compositions over the same payments data — pick the one that matches how you work.",
};

type Option = {
  index: string;
  name: string;
  href: string;
  /** Flip to `true` the moment the route ships — nothing else changes. */
  available: boolean;
  icon: typeof Gauge;
  character: string;
  audience: string;
  distinctive: string[];
};

const options: Option[] = [
  {
    index: "01",
    name: "Ops Console",
    href: "/dashboard/ops",
    available: true,
    icon: Gauge,
    character: "Dense, monitoring-first. Built to be left open on a second screen all day.",
    audience: "Payments operations — the people watching rails clear in real time.",
    distinctive: [
      "Live rail health beside the numbers, so a dip has an explanation next to it",
      "Failed and disputed queues surfaced as work, not as a statistic",
      "Sort, filter and paginate the full ledger without leaving the page",
    ],
  },
  {
    index: "02",
    name: "Executive Brief",
    href: "/dashboard/executive",
    available: true,
    icon: ChartLineUp,
    character: "Spare and editorial. A handful of figures at full size, each one a claim.",
    audience: "Leadership and board reporting — a weekly read, not a live feed.",
    distinctive: [
      "One period switcher drives every figure: today, 7 days, 30 days, quarter",
      "Every number carries its change against the previous period",
      "Volume by rail as the shape of the business, not as an operational alert",
    ],
  },
  {
    index: "03",
    name: "Payment Workbench",
    href: "/dashboard/workbench",
    available: true,
    icon: Wrench,
    character: "Investigation-first. A ledger on the left, one payment opened on the right.",
    audience: "Disputes, reconciliation and support — anyone answering “what happened here?”",
    distinctive: [
      "Every transaction opens a full status timeline, from initiated to settled",
      "Merchant, rail and customer context travel with the record",
      "Keyboard-driven search across references, merchants and payers",
    ],
  },
];

export default function DashboardChooser() {
  const snapshot = getPeriodData("7d");

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Chrome is ink. Everything below the hero stays on the light canvas —
          the brand reads as an ink frame around white, with exactly one
          full-bleed yellow block. */}
      <header
        data-surface="ink"
        className="bg-surface grain flex items-center justify-between border-b"
        style={{ padding: "var(--space-4) var(--space-6)", gap: "var(--space-4)" }}
      >
        <div className="flex items-center" style={{ gap: "var(--space-4)" }}>
          <BrandMark height={22} />
          <span
            aria-hidden
            className="hidden sm:block"
            style={{ height: "var(--space-1)", width: "var(--space-8)", background: "var(--accent)" }}
          />
          <span
            className="hidden text-text-secondary sm:block"
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: "var(--weight-bold)",
              letterSpacing: "var(--tracking-caps)",
              textTransform: "uppercase",
            }}
          >
            Payments
          </span>
        </div>

        <div className="flex items-center" style={{ gap: "var(--space-3)" }}>
          <Link
            href="/docs"
            className="hidden items-center rounded-full border border-border-default text-text-secondary transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:bg-surface-raised hover:text-text-primary sm:inline-flex"
            style={{
              gap: "var(--space-2)",
              padding: "var(--space-2) var(--space-3)",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--weight-medium)",
            }}
          >
            <BookOpen size={16} weight="regular" aria-hidden="true" />
            Component library
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* THE one full-bleed yellow block on this screen. A second would
          flatten the hierarchy rather than double the brand. */}
      <section
        data-surface="accent"
        className="grain border-b"
        style={{ background: "var(--surface)", padding: "var(--space-12) var(--space-6)" }}
      >
        <div className="mx-auto w-full" style={{ maxWidth: "72rem" }}>
          <p
            className="text-text-secondary"
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: "var(--weight-bold)",
              letterSpacing: "var(--tracking-caps)",
              textTransform: "uppercase",
            }}
          >
            Prototype · three compositions, one dataset
          </p>
          <h1
            className="text-text-primary"
            style={{
              marginTop: "var(--space-3)",
              fontSize: "var(--text-5xl)",
              lineHeight: "var(--leading-tight)",
              fontWeight: "var(--weight-black)",
              letterSpacing: "var(--tracking-tight)",
              maxWidth: "20ch",
            }}
          >
            Pick a dashboard.
          </h1>
          <p
            className="text-text-secondary"
            style={{
              marginTop: "var(--space-4)",
              fontSize: "var(--text-lg)",
              lineHeight: "var(--leading-normal)",
              maxWidth: "58ch",
            }}
          >
            Same transactions, same settlement batches, same merchants. Three different
            answers to what a payments team needs on screen. Try one, then come back and
            try another — nothing here is a commitment.
          </p>

          <dl
            className="flex flex-wrap"
            style={{ marginTop: "var(--space-8)", gap: "var(--space-8)" }}
          >
            {[
              { label: "Transactions", value: formatCount(transactions.length) },
              { label: "Merchants", value: formatCount(merchants.length) },
              { label: "Needs review", value: formatCount(needsReview.length) },
              { label: "7-day volume", value: formatPeso(snapshot.totals.volume) },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col" style={{ gap: "var(--space-1)" }}>
                <dt
                  className="text-text-tertiary"
                  style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: "var(--weight-bold)",
                    letterSpacing: "var(--tracking-caps)",
                    textTransform: "uppercase",
                  }}
                >
                  {stat.label}
                </dt>
                <dd
                  className="text-text-primary tabular-nums"
                  style={{
                    fontSize: "var(--text-2xl)",
                    lineHeight: "var(--leading-tight)",
                    fontWeight: "var(--weight-black)",
                    letterSpacing: "var(--tracking-tight)",
                  }}
                >
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <main
        className="flex-1"
        style={{ padding: "var(--space-12) var(--space-6)" }}
      >
        <div
          className="mx-auto flex w-full flex-col"
          style={{ maxWidth: "72rem", gap: "var(--space-8)" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: "var(--space-6)" }}>
            {options.map((option) => {
              const Icon = option.icon;
              return (
                <Card key={option.name} className="justify-between">
                  <div className="flex flex-col" style={{ gap: "var(--space-4)" }}>
                    <div className="flex items-center justify-between" style={{ gap: "var(--space-3)" }}>
                      {/* Ink numeral — the black half of black-and-yellow, at
                          a size where it marks the card without shouting. */}
                      <span
                        data-surface="ink"
                        aria-hidden="true"
                        className="bg-surface text-text-primary flex shrink-0 items-center justify-center tabular-nums"
                        style={{
                          width: "var(--space-8)",
                          height: "var(--space-8)",
                          borderRadius: "var(--radius-md)",
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--weight-black)",
                        }}
                      >
                        {option.index}
                      </span>
                      {option.available ? (
                        <Badge variant="success">Ready</Badge>
                      ) : (
                        <Badge variant="neutral">Ships next</Badge>
                      )}
                    </div>

                    <div className="flex items-center" style={{ gap: "var(--space-3)" }}>
                      <Icon
                        size={22}
                        weight="regular"
                        aria-hidden="true"
                        className="text-accent-text shrink-0"
                      />
                      <h2
                        className="text-text-primary"
                        style={{
                          fontSize: "var(--text-2xl)",
                          lineHeight: "var(--leading-tight)",
                          fontWeight: "var(--weight-black)",
                          letterSpacing: "var(--tracking-tight)",
                        }}
                      >
                        {option.name}
                      </h2>
                    </div>

                    <p
                      className="text-text-secondary"
                      style={{ fontSize: "var(--text-sm)", lineHeight: "var(--leading-normal)" }}
                    >
                      {option.character}
                    </p>

                    <div
                      className="flex flex-col border-t border-border-subtle"
                      style={{ gap: "var(--space-1)", paddingTop: "var(--space-4)" }}
                    >
                      <span
                        className="text-text-tertiary"
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: "var(--weight-bold)",
                          letterSpacing: "var(--tracking-caps)",
                          textTransform: "uppercase",
                        }}
                      >
                        Who it&rsquo;s for
                      </span>
                      <p
                        className="text-text-secondary"
                        style={{ fontSize: "var(--text-sm)", lineHeight: "var(--leading-normal)" }}
                      >
                        {option.audience}
                      </p>
                    </div>

                    <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
                      <span
                        className="text-text-tertiary"
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: "var(--weight-bold)",
                          letterSpacing: "var(--tracking-caps)",
                          textTransform: "uppercase",
                        }}
                      >
                        What&rsquo;s distinctive
                      </span>
                      <ul className="flex flex-col" style={{ gap: "var(--space-2)" }}>
                        {option.distinctive.map((point) => (
                          <li
                            key={point}
                            className="flex text-text-secondary"
                            style={{
                              gap: "var(--space-3)",
                              fontSize: "var(--text-sm)",
                              lineHeight: "var(--leading-normal)",
                            }}
                          >
                            {/* A yellow fill on a light card, so it carries
                                its ink edge — raw yellow's own boundary
                                against white is 1.24:1. */}
                            <span
                              aria-hidden="true"
                              className="shrink-0"
                              style={{
                                marginTop: "0.45em",
                                width: "var(--space-2)",
                                height: "var(--space-2)",
                                borderRadius: "var(--radius-full)",
                                background: "var(--accent)",
                                boxShadow: "inset 0 0 0 1px var(--accent-edge)",
                              }}
                            />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div style={{ paddingTop: "var(--space-6)" }}>
                    {option.available ? (
                      <Link
                        href={option.href}
                        className="inline-flex items-center uppercase transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:opacity-80"
                        style={{
                          gap: "var(--space-2)",
                          background: "var(--accent)",
                          color: "var(--text-on-accent)",
                          border: "var(--rule-hairline) solid var(--accent-edge)",
                          borderRadius: "var(--radius-full)",
                          fontSize: "var(--text-xs)",
                          fontWeight: "var(--weight-bold)",
                          letterSpacing: "var(--tracking-caps)",
                          padding: "var(--space-2) var(--space-4)",
                        }}
                      >
                        Open {option.name}
                        <ArrowRight size={14} weight="bold" aria-hidden="true" />
                      </Link>
                    ) : (
                      // Not a link yet: the route doesn't exist, and sending
                      // someone to a 404 is the dead end this codebase bans.
                      // The card still offers a way forward.
                      <div className="flex flex-col" style={{ gap: "var(--space-3)" }}>
                        <p
                          className="text-text-tertiary"
                          style={{ fontSize: "var(--text-sm)", lineHeight: "var(--leading-normal)" }}
                        >
                          Being built now. It will live at{" "}
                          <code style={{ fontFamily: "var(--font-mono)" }}>{option.href}</code>.
                        </p>
                        <Link
                          href="/dashboard/ops"
                          className="inline-flex items-center text-accent-text transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:opacity-80"
                          style={{
                            gap: "var(--space-2)",
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--weight-bold)",
                          }}
                        >
                          Try the Ops Console meanwhile
                          <ArrowRight size={14} weight="bold" aria-hidden="true" />
                        </Link>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Never a dead end: whichever card someone stalls on, this row
              still offers somewhere to go. */}
          {/* flexDirection goes in `style`, not a class: Card already sets
              `flex-col`, and two flex-direction utilities on one element are
              resolved by stylesheet order, not by the order written here. */}
          <Card
            flat
            className="flex-wrap items-center justify-between"
            style={{ flexDirection: "row", gap: "var(--space-4)" }}
          >
            <div className="flex flex-col" style={{ gap: "var(--space-1)" }}>
              <p
                className="text-text-primary"
                style={{ fontSize: "var(--text-base)", fontWeight: "var(--weight-bold)" }}
              >
                Not sure which one?
              </p>
              <p className="text-text-secondary" style={{ fontSize: "var(--text-sm)" }}>
                Start with the Ops Console — it is the widest of the three, and every
                figure on it comes from the same dataset as the other two.
              </p>
            </div>
            <div className="flex flex-wrap items-center" style={{ gap: "var(--space-4)" }}>
              <Link
                href="/dashboard/ops"
                className="inline-flex items-center text-accent-text transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:opacity-80"
                style={{
                  gap: "var(--space-2)",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--weight-bold)",
                }}
              >
                <ArrowsLeftRight size={16} weight="regular" aria-hidden="true" />
                Open Ops Console
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
            </div>
          </Card>

          <p className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
            Every figure on these dashboards is demo data. Cut-off times, batch windows
            and rail behavior are illustrative and are not the published BSP, InstaPay or
            PESONet schedule.
          </p>
        </div>
      </main>
    </div>
  );
}
