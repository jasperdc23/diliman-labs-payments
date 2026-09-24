"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Receipt, Storefront } from "@phosphor-icons/react/ssr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Marker } from "@/components/ui/marker";
import { Modal } from "@/components/ui/modal";
import { Table, type TableColumn } from "@/components/ui/table";
import {
  RAIL_META,
  SETTLEMENT_STATUS_BADGE_VARIANT,
  SETTLEMENT_STATUS_LABEL,
  STATUS_BADGE_VARIANT,
  STATUS_LABEL,
  formatCount,
  formatDate,
  formatDateTime,
  formatPeso,
  formatPercent,
  formatTime,
  getMerchantById,
  getTotals,
  type Rail,
  type SettlementBatch,
  type Transaction,
} from "../_data/payments";
import { PREVIOUS_LABEL, type Brief } from "./data";
import styles from "./brief.module.css";

/** Which breakdown is open. `null` closes the modal. */
export type Drilldown =
  | { kind: "volume" }
  | { kind: "net" }
  | { kind: "count" }
  | { kind: "quality" }
  | { kind: "rail"; rail: Rail }
  | { kind: "settlement" }
  | { kind: "merchant"; merchantId: string };

function Rows({ children }: { children: ReactNode }) {
  return <dl className={styles.ruledList}>{children}</dl>;
}

function Row({
  label,
  value,
  note,
}: {
  label: string;
  value: ReactNode;
  note?: ReactNode;
}) {
  return (
    <div
      className="flex flex-wrap items-baseline justify-between"
      style={{ gap: "var(--space-3)" }}
    >
      <dt className="text-text-secondary" style={{ fontSize: "var(--text-sm)" }}>
        {label}
        {note ? (
          <span
            className="text-text-tertiary"
            style={{ display: "block", fontSize: "var(--text-xs)" }}
          >
            {note}
          </span>
        ) : null}
      </dt>
      <dd
        className="text-text-primary tabular-nums"
        style={{ fontSize: "var(--text-base)", fontWeight: "var(--weight-bold)" }}
      >
        {value}
      </dd>
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p
      className={styles.eyebrow}
      style={{ marginTop: "var(--space-6)", marginBottom: "var(--space-3)" }}
    >
      {children}
    </p>
  );
}

const TRANSACTION_COLUMNS: TableColumn<Transaction>[] = [
  {
    key: "reference",
    header: "Reference",
    sortable: true,
    render: (row) => (
      <span style={{ fontFamily: "var(--font-mono)" }}>{row.reference}</span>
    ),
  },
  { key: "merchant", header: "Merchant", sortable: true },
  { key: "rail", header: "Rail", sortable: true },
  {
    key: "status",
    header: "Status",
    sortable: true,
    sortValue: (row) => STATUS_LABEL[row.status],
    render: (row) => (
      <Badge variant={STATUS_BADGE_VARIANT[row.status]}>{STATUS_LABEL[row.status]}</Badge>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    align: "right",
    sortable: true,
    sortValue: (row) => row.amount,
    render: (row) => formatPeso(row.amount),
  },
  {
    key: "date",
    header: "When",
    sortable: true,
    sortValue: (row) => row.date,
    render: (row) => formatDateTime(row.date),
  },
];

const BATCH_COLUMNS: TableColumn<SettlementBatch>[] = [
  {
    key: "reference",
    header: "Batch",
    sortable: true,
    render: (row) => (
      <span style={{ fontFamily: "var(--font-mono)" }}>{row.reference}</span>
    ),
  },
  { key: "rail", header: "Rail", sortable: true },
  { key: "window", header: "Window" },
  {
    key: "expectedArrival",
    header: "Expected",
    sortable: true,
    sortValue: (row) => row.expectedArrival,
    render: (row) => formatTime(row.expectedArrival),
  },
  {
    key: "actualArrival",
    header: "Actual",
    sortable: true,
    sortValue: (row) => row.actualArrival ?? "",
    render: (row) =>
      row.actualArrival ? (
        formatTime(row.actualArrival)
      ) : (
        <span className="text-text-tertiary">Still in window</span>
      ),
  },
  {
    key: "itemCount",
    header: "Payments",
    align: "right",
    sortable: true,
    sortValue: (row) => row.itemCount,
    render: (row) => formatCount(row.itemCount),
  },
  {
    key: "amount",
    header: "Net credited",
    align: "right",
    sortable: true,
    sortValue: (row) => row.amount,
    render: (row) => formatPeso(row.amount),
  },
  {
    key: "status",
    header: "State",
    sortable: true,
    sortValue: (row) => SETTLEMENT_STATUS_LABEL[row.status],
    render: (row) => (
      <Badge variant={SETTLEMENT_STATUS_BADGE_VARIANT[row.status]}>
        {SETTLEMENT_STATUS_LABEL[row.status]}
      </Badge>
    ),
  },
];

/**
 * Every breakdown behind a figure, in one modal.
 *
 * Rendered from the page root, never inside a `data-surface` subtree:
 * `<dialog>` + `showModal()` promotes to the top layer but inheritance is
 * unchanged, so a dialog declared inside the ink band would inherit the
 * ink token scope and render as a black panel over a white page.
 */
export function DrilldownModal({
  detail,
  brief,
  onClose,
}: {
  detail: Drilldown | null;
  brief: Brief;
  onClose: () => void;
}) {
  const router = useRouter();
  const { totals, previousTotals, deltas } = brief.data;
  const comparison = PREVIOUS_LABEL[brief.period];

  const sampleNote = `From the ${formatCount(brief.rows.length)}-payment sample covering ${brief.rowsWindowLabel}. The headline figures above are at production scale, so counts here will not match them.`;

  let title = "";
  let description: ReactNode = null;
  let body: ReactNode = null;
  let primaryAction: ReactNode = null;
  let size: "sm" | "md" | "lg" = "md";

  if (detail?.kind === "volume") {
    title = `Gross volume · ${brief.label}`;
    description = `Where ${formatPeso(totals.volume)} came from, and how it compares with ${comparison}.`;
    body = (
      <>
        <Rows>
          <Row label="Gross volume" value={formatPeso(totals.volume)} />
          <Row
            label={`Gross volume, ${comparison}`}
            value={formatPeso(previousTotals.volume)}
            note={deltas.volume.label}
          />
          <Row label="Fees retained" value={formatPeso(totals.fees)} />
          <Row
            label="Net to merchants"
            value={formatPeso(totals.net)}
            note={`${formatPercent(brief.takeRate, 2)} effective take rate`}
          />
        </Rows>

        <SectionLabel>Allocated by rail mix</SectionLabel>
        <Rows>
          {brief.railMix.map((slice) => (
            <Row
              key={slice.rail}
              label={slice.rail}
              value={formatPeso(slice.volume)}
              note={`${formatPercent(slice.share)} of the period`}
            />
          ))}
        </Rows>
        <p
          className="text-text-tertiary"
          style={{ marginTop: "var(--space-4)", fontSize: "var(--text-xs)" }}
        >
          Rail figures are the period gross split by the mix in the trend series, so the three
          rails add back to {formatPeso(totals.volume)}.
        </p>
      </>
    );
  }

  if (detail?.kind === "net") {
    title = `Net to merchants · ${brief.label}`;
    description = "Gross less the fees Diliman Labs retains is what reaches merchant accounts.";
    body = (
      <>
        <Rows>
          <Row label="Gross volume" value={formatPeso(totals.volume)} />
          <Row label="Less fees retained" value={`− ${formatPeso(totals.fees)}`} />
          <Row
            label="Net to merchants"
            value={formatPeso(totals.net)}
            note={`${formatPercent(brief.takeRate, 2)} effective take rate`}
          />
          <Row
            label={`Net, ${comparison}`}
            value={formatPeso(previousTotals.net)}
            note={deltas.net.label}
          />
          <Row
            label="Average ticket"
            value={formatPeso(totals.averageTicket)}
            note={`${formatPeso(previousTotals.averageTicket)} ${comparison}`}
          />
        </Rows>
        <p
          className="text-text-tertiary"
          style={{ marginTop: "var(--space-4)", fontSize: "var(--text-xs)" }}
        >
          Fee rates are illustrative demo data, not a published tariff.
        </p>
      </>
    );
  }

  if (detail?.kind === "count") {
    title = `Transactions · ${brief.label}`;
    description = `${formatCount(totals.count)} payments cleared, ${deltas.count.label} against ${comparison}.`;
    body = (
      <>
        <Rows>
          <Row label="Transactions" value={formatCount(totals.count)} />
          <Row
            label={`Transactions, ${comparison}`}
            value={formatCount(previousTotals.count)}
            note={deltas.count.label}
          />
          <Row label="Average ticket" value={formatPeso(totals.averageTicket)} />
          <Row
            label="Busiest point"
            value={formatPeso(brief.peak.value)}
            note={brief.peak.label}
          />
          <Row
            label="Quietest point"
            value={formatPeso(brief.trough.value)}
            note={brief.trough.label}
          />
        </Rows>
      </>
    );
  }

  if (detail?.kind === "quality") {
    size = "lg";
    title = `Payment quality · ${brief.label}`;
    description = `${formatPercent(totals.successRate)} of payments cleared without failing, reversing or going into dispute.`;
    body = (
      <>
        <Rows>
          <Row label="Success rate" value={formatPercent(totals.successRate)} />
          <Row
            label={`Success rate, ${comparison}`}
            value={formatPercent(previousTotals.successRate)}
            note={deltas.successRate.label}
          />
          <Row
            label="Failed payments"
            value={formatCount(totals.failed)}
            note={`${formatCount(previousTotals.failed)} ${comparison} · ${deltas.failed.label}`}
          />
        </Rows>

        <SectionLabel>What needs a decision</SectionLabel>
        {brief.exceptions.length === 0 ? (
          <EmptyState
            icon={<Receipt size={32} weight="regular" />}
            title="Nothing failed, reversed or went into dispute"
            description={`No exception landed in ${brief.rowsWindowLabel}. There is nothing to review for this period.`}
            action={{ label: "Close", onClick: onClose }}
            secondaryAction={{
              label: "Open the Ops Console",
              onClick: () => router.push("/dashboard/ops"),
            }}
          />
        ) : (
          <>
            <Table
              columns={TRANSACTION_COLUMNS}
              rows={brief.exceptions}
              getRowKey={(row) => row.id}
              caption="Failed, reversed and disputed payments in the sample window"
              headerTone="ink"
              density="compact"
              defaultSort={{ key: "amount", direction: "desc" }}
              emptyState={
                <EmptyState
                  title="No exceptions in this window"
                  description="Nothing failed, reversed or went into dispute."
                  action={{ label: "Close", onClick: onClose }}
                />
              }
            />
            <p
              className="text-text-tertiary"
              style={{ marginTop: "var(--space-3)", fontSize: "var(--text-xs)" }}
            >
              {formatPeso(getTotals(brief.exceptions).volume)} at stake across{" "}
              {formatCount(brief.exceptions.length)} payments. {sampleNote}
            </p>
          </>
        )}
      </>
    );
    primaryAction = (
      <Button variant="primary" onClick={() => router.push("/dashboard/ops")}>
        Work the queue in Ops
      </Button>
    );
  }

  if (detail?.kind === "rail") {
    size = "lg";
    const slice = brief.railMix.find((s) => s.rail === detail.rail) ?? brief.railMix[0];
    const meta = RAIL_META[detail.rail];
    const railRows = brief.rows.filter((t) => t.rail === detail.rail);
    const railTotals = getTotals(railRows);
    const direction =
      slice.last > slice.first ? "rising" : slice.last < slice.first ? "falling" : "flat";

    title = `${detail.rail} · ${brief.label}`;
    description = meta.description;
    body = (
      <>
        <div
          className="flex flex-wrap items-center"
          style={{ gap: "var(--space-4)", marginBottom: "var(--space-6)" }}
        >
          <Marker tone={meta.state} label={meta.stateLabel} />
          <span className="text-text-tertiary" style={{ fontSize: "var(--text-sm)" }}>
            {meta.cadence} · next window {meta.nextWindow}
          </span>
        </div>

        <Rows>
          <Row
            label="Share of gross volume"
            value={formatPercent(slice.share)}
            note={`${direction} across the period`}
          />
          <Row label="Allocated volume" value={formatPeso(slice.volume)} />
          <Row
            label="First bucket"
            value={formatPeso(slice.first)}
            note={brief.data.labels[0]}
          />
          <Row
            label="Last bucket"
            value={formatPeso(slice.last)}
            note={brief.data.labels[brief.data.labels.length - 1]}
          />
        </Rows>

        <SectionLabel>{detail.rail} in the sample window</SectionLabel>
        {railRows.length === 0 ? (
          <EmptyState
            icon={<Receipt size={32} weight="regular" />}
            title={`No ${detail.rail} payments in ${brief.rowsWindowLabel}`}
            description="The rail carried volume at production scale, but nothing in this window made the readable sample."
            action={{ label: "Close", onClick: onClose }}
            secondaryAction={{
              label: "Open the Ops Console",
              onClick: () => router.push("/dashboard/ops"),
            }}
          />
        ) : (
          <>
            <Table
              columns={TRANSACTION_COLUMNS}
              rows={railRows}
              getRowKey={(row) => row.id}
              caption={`${detail.rail} payments in the sample window`}
              headerTone="ink"
              density="compact"
              stickyHeader
              defaultSort={{ key: "date", direction: "desc" }}
              emptyState={
                <EmptyState
                  title="No payments on this rail"
                  description="Nothing in this window."
                  action={{ label: "Close", onClick: onClose }}
                />
              }
            />
            <p
              className="text-text-tertiary"
              style={{ marginTop: "var(--space-3)", fontSize: "var(--text-xs)" }}
            >
              {formatCount(railRows.length)} payments · {formatPeso(railTotals.volume)} ·{" "}
              {formatPercent(railTotals.successRate)} success. {sampleNote}
            </p>
          </>
        )}
      </>
    );
  }

  if (detail?.kind === "settlement") {
    size = "lg";
    title = `Settlement batches · ${brief.label}`;
    description = `${formatCount(brief.settlement.batches)} batches covering ${formatCount(brief.settlement.items)} payments.`;
    body = (
      <>
        <Rows>
          <Row label="Settled" value={formatPeso(brief.settlement.settled)} />
          <Row label="Still in window" value={formatPeso(brief.settlement.inWindow)} />
          <Row label="Delayed" value={formatPeso(brief.settlement.delayed)} />
          <Row label="Returned" value={formatPeso(brief.settlement.returned)} />
        </Rows>

        <SectionLabel>Batch register</SectionLabel>
        <Table
          columns={BATCH_COLUMNS}
          rows={brief.batches}
          getRowKey={(row) => row.id}
          caption="Settlement batches in the period"
          headerTone="ink"
          density="compact"
          stickyHeader
          defaultSort={{ key: "amount", direction: "desc" }}
          emptyState={
            <EmptyState
              icon={<Receipt size={32} weight="regular" />}
              title="No batches closed in this period"
              description="Nothing reached a cut-off inside this window."
              action={{ label: "Close", onClick: onClose }}
              secondaryAction={{
                label: "Open the Ops Console",
                onClick: () => router.push("/dashboard/ops"),
              }}
            />
          }
        />
        <p
          className="text-text-tertiary"
          style={{ marginTop: "var(--space-3)", fontSize: "var(--text-xs)" }}
        >
          Windows, cut-offs and arrival times are demo data, not the published BSP, InstaPay,
          PESONet or QR Ph schedule.
        </p>
      </>
    );
  }

  if (detail?.kind === "merchant") {
    size = "lg";
    const merchant = getMerchantById(detail.merchantId);

    if (!merchant) {
      title = "Merchant not found";
      description = "That merchant is not in the ledger this brief was built from.";
      body = (
        <EmptyState
          icon={<Storefront size={32} weight="regular" />}
          title="No merchant with that id"
          description="The record may have been removed since this brief was opened."
          action={{ label: "Close", onClick: onClose }}
          secondaryAction={{
            label: "Open the Ops Console",
            onClick: () => router.push("/dashboard/ops"),
          }}
        />
      );
    } else {
      const merchantRows = brief.rows.filter((t) => t.merchantId === merchant.id);
      const merchantTotals = getTotals(merchantRows);

      title = merchant.name;
      description = `${merchant.category} · joined ${formatDate(merchant.joinedDate)}`;
      body = (
        <>
          <Rows>
            <Row label="Trailing 30-day volume" value={formatPeso(merchant.volume)} />
            <Row label="Trailing 30-day success rate" value={formatPercent(merchant.successRate)} />
            <Row
              label="In the sample window"
              value={formatPeso(merchantTotals.volume)}
              note={`${formatCount(merchantRows.length)} payments · ${brief.rowsWindowLabel}`}
            />
          </Rows>

          <SectionLabel>Payments in the sample window</SectionLabel>
          {merchantRows.length === 0 ? (
            <EmptyState
              icon={<Receipt size={32} weight="regular" />}
              title={`No ${merchant.name} payments in ${brief.rowsWindowLabel}`}
              description="Widen the period, or take the merchant to the full ledger in the Ops Console."
              action={{ label: "Close", onClick: onClose }}
              secondaryAction={{
                label: "Open the Ops Console",
                onClick: () => router.push("/dashboard/ops"),
              }}
            />
          ) : (
            <>
              <Table
                columns={TRANSACTION_COLUMNS}
                rows={merchantRows}
                getRowKey={(row) => row.id}
                caption={`${merchant.name} payments in the sample window`}
                headerTone="ink"
                density="compact"
                stickyHeader
                defaultSort={{ key: "date", direction: "desc" }}
                emptyState={
                  <EmptyState
                    title="No payments in this window"
                    description="Nothing for this merchant in the sample."
                    action={{ label: "Close", onClick: onClose }}
                  />
                }
              />
              <p
                className="text-text-tertiary"
                style={{ marginTop: "var(--space-3)", fontSize: "var(--text-xs)" }}
              >
                {sampleNote}
              </p>
            </>
          )}
        </>
      );
    }
  }

  return (
    <Modal
      open={detail !== null}
      onClose={onClose}
      title={title || "Breakdown"}
      description={description}
      size={size}
      footer={
        <>
          {primaryAction}
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </>
      }
    >
      {body}
    </Modal>
  );
}
