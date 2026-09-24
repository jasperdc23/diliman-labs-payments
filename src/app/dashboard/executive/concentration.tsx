"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Storefront } from "@phosphor-icons/react/ssr";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Progress } from "@/components/ui/progress";
import { SearchBar } from "@/components/ui/search-bar";
import { Table, type TableColumn } from "@/components/ui/table";
import {
  MERCHANT_STATUS_BADGE_VARIANT,
  MERCHANT_STATUS_LABEL,
  formatPeso,
  formatPercent,
  merchants,
  type Merchant,
} from "../_data/payments";
import { Eyebrow } from "./parts";
import styles from "./brief.module.css";

const LEDGER_TOTAL = merchants.reduce((sum, m) => sum + m.volume, 0);

const TOP_THREE_SHARE =
  ([...merchants]
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 3)
    .reduce((sum, m) => sum + m.volume, 0) /
    LEDGER_TOTAL) *
  100;

/**
 * Where volume concentrates.
 *
 * Deliberately NOT driven by the period switcher: `merchants[].volume` is a
 * trailing-30-day figure authored on the merchant ledger, and re-scaling it
 * to "today" or "this quarter" would invent data. The panel says which
 * window it is showing instead of implying it follows the one above.
 *
 * The table header takes the ink band — the only other ink on the page
 * besides the chrome and the analytics band, which is the spec's budget.
 */
export function Concentration({
  onOpenMerchant,
}: {
  onOpenMerchant: (merchantId: string) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return merchants;
    return merchants.filter((m) =>
      `${m.name} ${m.category} ${MERCHANT_STATUS_LABEL[m.status]}`.toLowerCase().includes(needle),
    );
  }, [query]);

  const columns: TableColumn<Merchant>[] = [
    {
      key: "name",
      header: "Merchant",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col" style={{ gap: "var(--space-1)" }}>
          <span style={{ fontWeight: "var(--weight-bold)" }}>{row.name}</span>
          <span className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
            {row.category}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (row) => MERCHANT_STATUS_LABEL[row.status],
      render: (row) => (
        <Badge variant={MERCHANT_STATUS_BADGE_VARIANT[row.status]}>
          {MERCHANT_STATUS_LABEL[row.status]}
        </Badge>
      ),
    },
    {
      key: "volume",
      header: "30-day volume",
      align: "right",
      sortable: true,
      sortValue: (row) => row.volume,
      render: (row) => formatPeso(row.volume),
    },
    {
      key: "share",
      header: "Share",
      sortable: true,
      sortValue: (row) => row.volume / LEDGER_TOTAL,
      render: (row) => (
        <div className="flex flex-col" style={{ gap: "var(--space-1)", minWidth: "7rem" }}>
          <span className="tabular-nums" style={{ fontSize: "var(--text-xs)" }}>
            {formatPercent((row.volume / LEDGER_TOTAL) * 100)}
          </span>
          <Progress
            value={(row.volume / LEDGER_TOTAL) * 100}
            label={`${row.name} share of ledger volume`}
          />
        </div>
      ),
    },
    {
      key: "successRate",
      header: "Success rate",
      align: "right",
      sortable: true,
      sortValue: (row) => row.successRate,
      render: (row) => formatPercent(row.successRate),
    },
    {
      key: "open",
      header: <span className="sr-only">Breakdown</span>,
      align: "right",
      render: (row) => (
        <button
          type="button"
          className={styles.figureHint}
          style={{ color: "var(--accent-text)", cursor: "pointer" }}
          onClick={() => onOpenMerchant(row.id)}
        >
          Open
          <span className="sr-only"> {row.name}</span>
          <ArrowRight size={12} weight="bold" aria-hidden="true" />
        </button>
      ),
    },
  ];

  return (
    <section className={`${styles.band}`} aria-labelledby="brief-concentration-heading">
      <div className={styles.shell}>
        <div
          className="flex flex-wrap items-end justify-between"
          style={{ gap: "var(--space-4)", marginBottom: "var(--space-6)" }}
        >
          <div className="flex min-w-0 flex-col" style={{ gap: "var(--space-3)" }}>
            <span aria-hidden="true" className={`${styles.block} ${styles.blockWide}`} />
            <Eyebrow>Where the volume sits · trailing 30 days</Eyebrow>
            <h2
              id="brief-concentration-heading"
              className="text-text-primary"
              style={{
                fontSize: "var(--text-3xl)",
                fontWeight: "var(--weight-black)",
                letterSpacing: "var(--tracking-tight)",
                lineHeight: "var(--leading-tight)",
              }}
            >
              Three merchants are {formatPercent(TOP_THREE_SHARE)} of the book.
            </h2>
          </div>

          <div style={{ width: "min(20rem, 100%)" }}>
            <SearchBar
              value={query}
              onValueChange={setQuery}
              placeholder="Find a merchant"
              aria-label="Find a merchant"
            />
          </div>
        </div>

        <Table
          columns={columns}
          rows={rows}
          getRowKey={(row) => row.id}
          caption="Merchants by trailing 30-day volume"
          headerTone="ink"
          zebra
          defaultSort={{ key: "volume", direction: "desc" }}
          emptyState={
            <EmptyState
              icon={<Storefront size={32} weight="regular" />}
              title={`No merchant matches “${query.trim()}”`}
              description="The ledger holds ten merchants. Clear the search to see all of them, or take the question to the full transaction ledger."
              action={{ label: "Clear the search", onClick: () => setQuery("") }}
              secondaryAction={{
                label: "Open the Ops Console",
                onClick: () => router.push("/dashboard/ops"),
              }}
            />
          }
        />

        <p
          className="text-text-tertiary"
          style={{ marginTop: "var(--space-4)", fontSize: "var(--text-xs)", maxWidth: "80ch" }}
        >
          Trailing 30-day figures from the merchant ledger. This window is fixed and does not
          follow the period switcher above — rescaling a 30-day book to a single day would be an
          invented number, not a smaller one. Showing {rows.length} of {merchants.length}{" "}
          merchants.
        </p>
      </div>
    </section>
  );
}
