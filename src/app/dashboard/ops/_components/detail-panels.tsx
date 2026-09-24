"use client";

import { ArrowSquareOut, Warning } from "@phosphor-icons/react/ssr";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { List, ListRow } from "@/components/ui/list-row";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  MERCHANT_STATUS_BADGE_VARIANT,
  MERCHANT_STATUS_LABEL,
  SETTLEMENT_STATUS_BADGE_VARIANT,
  SETTLEMENT_STATUS_LABEL,
  STATUS_BADGE_VARIANT,
  STATUS_LABEL,
  formatCount,
  formatDate,
  formatDateTime,
  formatPercent,
  formatPeso,
  formatTime,
  getTotals,
  type Merchant,
  type SettlementBatch,
  type Transaction,
} from "@/app/dashboard/_data/payments";
import { PaymentTimeline } from "./payment-timeline";
import styles from "../ops.module.css";

function Term({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col" style={{ gap: "var(--space-1)" }}>
      <dt className={styles.detailTerm}>{label}</dt>
      <dd className={styles.detailValue}>{children}</dd>
    </div>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-text-primary"
      style={{
        fontSize: "var(--text-sm)",
        fontWeight: "var(--weight-bold)",
        letterSpacing: "var(--tracking-caps)",
        textTransform: "uppercase",
      }}
    >
      {children}
    </h3>
  );
}

/* ------------------------------------------------------------------ */
/* Transaction                                                         */
/* ------------------------------------------------------------------ */

export function TransactionDetail({
  transaction,
  flagged,
  retrying,
  onOpenMerchant,
}: {
  transaction: Transaction;
  flagged: boolean;
  retrying: boolean;
  onOpenMerchant: (merchantId: string) => void;
}) {
  return (
    <div className="flex flex-col" style={{ gap: "var(--space-6)" }}>
      <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
        <span
          className="text-text-primary tabular-nums"
          style={{
            fontSize: "var(--text-4xl)",
            lineHeight: "var(--leading-tight)",
            fontWeight: "var(--weight-black)",
            letterSpacing: "var(--tracking-tight)",
          }}
        >
          {formatPeso(transaction.amount)}
        </span>
        <div className={styles.chipRow}>
          <Badge variant={STATUS_BADGE_VARIANT[transaction.status]} dot size="md">
            {STATUS_LABEL[transaction.status]}
          </Badge>
          {flagged && (
            <span
              className="inline-flex items-center"
              style={{
                gap: "var(--space-2)",
                background: "var(--accent)",
                color: "var(--text-on-accent)",
                border: "var(--rule-hairline) solid var(--accent-edge)",
                borderRadius: "var(--radius-full)",
                padding: "var(--space-1) var(--space-3)",
                fontSize: "var(--text-xs)",
                fontWeight: "var(--weight-bold)",
                letterSpacing: "var(--tracking-caps)",
                textTransform: "uppercase",
              }}
            >
              Flagged
            </span>
          )}
          {retrying && <Badge variant="warning">Retry in flight</Badge>}
        </div>
      </div>

      {transaction.status === "failed" && (
        <Alert
          variant="danger"
          title="Rejected by the receiving institution"
          description="Nothing was debited from the payer. A retry re-submits the same instruction on the same rail."
        />
      )}

      <dl className={styles.detailGrid}>
        <Term label="Reference">
          <span style={{ fontFamily: "var(--font-mono)" }}>{transaction.reference}</span>
        </Term>
        <Term label="Rail">{transaction.rail}</Term>
        <Term label="Merchant">
          <button type="button" className={styles.linkButton} onClick={() => onOpenMerchant(transaction.merchantId)}>
            {transaction.merchant}
            <ArrowSquareOut size={14} weight="bold" aria-hidden="true" />
          </button>
        </Term>
        <Term label="Payer">{transaction.customer}</Term>
        <Term label="Fee retained">{formatPeso(transaction.fee)}</Term>
        <Term label="Net to merchant">{formatPeso(transaction.net)}</Term>
        <Term label="Initiated">{formatDateTime(transaction.date)}</Term>
        <Term label="Internal id">
          <span style={{ fontFamily: "var(--font-mono)" }}>{transaction.id}</span>
        </Term>
      </dl>

      <Separator />

      <div className="flex flex-col" style={{ gap: "var(--space-4)" }}>
        <Heading>Payment timeline</Heading>
        <PaymentTimeline events={transaction.timeline} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Merchant                                                            */
/* ------------------------------------------------------------------ */

export function MerchantDetail({
  merchant,
  rows,
  onOpenTransaction,
  onShowLedger,
}: {
  merchant: Merchant;
  rows: Transaction[];
  onOpenTransaction: (id: string) => void;
  onShowLedger: () => void;
}) {
  const totals = getTotals(rows);

  return (
    <div className="flex flex-col" style={{ gap: "var(--space-6)" }}>
      <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
        <span
          className="text-text-primary"
          style={{
            fontSize: "var(--text-2xl)",
            lineHeight: "var(--leading-tight)",
            fontWeight: "var(--weight-black)",
            letterSpacing: "var(--tracking-tight)",
          }}
        >
          {merchant.name}
        </span>
        <div className={styles.chipRow}>
          <Badge variant={MERCHANT_STATUS_BADGE_VARIANT[merchant.status]} dot size="md">
            {MERCHANT_STATUS_LABEL[merchant.status]}
          </Badge>
          <span className="text-text-tertiary" style={{ fontSize: "var(--text-sm)" }}>
            {merchant.category}
          </span>
        </div>
      </div>

      {merchant.status === "suspended" && (
        <Alert
          variant="danger"
          title="Settlement is held"
          description="New transactions still clear on the rail, but nothing is paid out while the account is suspended."
        />
      )}
      {merchant.status === "review" && (
        <Alert
          variant="warning"
          title="Under enhanced due diligence"
          description="Volume above the monitoring threshold. Payouts continue; the review has to close before limits are raised."
        />
      )}

      <dl className={styles.detailGrid}>
        <Term label="30-day volume">{formatPeso(merchant.volume)}</Term>
        <Term label="30-day success rate">{formatPercent(merchant.successRate)}</Term>
        <Term label="Onboarded">{formatDate(merchant.joinedDate)}</Term>
        <Term label="Merchant id">
          <span style={{ fontFamily: "var(--font-mono)" }}>{merchant.id}</span>
        </Term>
      </dl>

      <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
        <div className="flex items-center justify-between">
          <span className={styles.detailTerm}>Success rate</span>
          <span className={styles.detailValue}>{formatPercent(merchant.successRate)}</span>
        </div>
        <Progress
          value={merchant.successRate}
          variant={merchant.successRate >= 98 ? "success" : merchant.successRate >= 96 ? "warning" : "danger"}
          label={`${merchant.name} success rate`}
        />
      </div>

      <Separator />

      <div className="flex flex-col" style={{ gap: "var(--space-3)" }}>
        <div className="flex flex-wrap items-center justify-between" style={{ gap: "var(--space-3)" }}>
          <Heading>In this sample ledger</Heading>
          <button type="button" className={styles.linkButton} onClick={onShowLedger}>
            Filter the ledger to this merchant
            <ArrowSquareOut size={14} weight="bold" aria-hidden="true" />
          </button>
        </div>

        {rows.length === 0 ? (
          <p className="text-text-tertiary" style={{ fontSize: "var(--text-sm)" }}>
            No transactions for this merchant in the 60-row sample. The 30-day figures above
            come from the merchant record.
          </p>
        ) : (
          <>
            <dl className={styles.detailGrid}>
              <Term label="Sample volume">{formatPeso(totals.volume)}</Term>
              <Term label="Sample count">{formatCount(totals.count)}</Term>
              <Term label="Sample success">{formatPercent(totals.successRate)}</Term>
              <Term label="Failed">{formatCount(totals.failed)}</Term>
            </dl>

            <List>
              {rows.slice(0, 8).map((row) => (
                <ListRow
                  key={row.id}
                  title={row.reference}
                  subtitle={`${row.rail} · ${formatDate(row.date)} · ${formatTime(row.date)}`}
                  onClick={() => onOpenTransaction(row.id)}
                  trailing={
                    <>
                      <Badge variant={STATUS_BADGE_VARIANT[row.status]}>
                        {STATUS_LABEL[row.status]}
                      </Badge>
                      <span className="tabular-nums">{formatPeso(row.amount)}</span>
                    </>
                  }
                />
              ))}
            </List>
            {rows.length > 8 && (
              <p className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
                Showing the 8 most recent of {formatCount(rows.length)}.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Settlement batch                                                    */
/* ------------------------------------------------------------------ */

function varianceMinutes(batch: SettlementBatch): number | null {
  if (!batch.actualArrival) return null;
  return Math.round(
    (new Date(batch.actualArrival).getTime() - new Date(batch.expectedArrival).getTime()) / 60_000,
  );
}

export function BatchDetail({
  batch,
  onShowRail,
}: {
  batch: SettlementBatch;
  onShowRail: () => void;
}) {
  const variance = varianceMinutes(batch);

  return (
    <div className="flex flex-col" style={{ gap: "var(--space-6)" }}>
      <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
        <span
          className="text-text-primary tabular-nums"
          style={{
            fontSize: "var(--text-4xl)",
            lineHeight: "var(--leading-tight)",
            fontWeight: "var(--weight-black)",
            letterSpacing: "var(--tracking-tight)",
          }}
        >
          {formatPeso(batch.amount)}
        </span>
        <div className={styles.chipRow}>
          <Badge variant={SETTLEMENT_STATUS_BADGE_VARIANT[batch.status]} dot size="md">
            {SETTLEMENT_STATUS_LABEL[batch.status]}
          </Badge>
          <span className="text-text-tertiary" style={{ fontSize: "var(--text-sm)" }}>
            {batch.rail} · {formatCount(batch.itemCount)} items
          </span>
        </div>
      </div>

      {batch.status === "returned" && (
        <Alert
          variant="danger"
          title="Batch returned by the receiving bank"
          description="Every item in the batch bounced back. The credit was reversed on the merchant ledger and the items need re-submission in a later window."
        />
      )}
      {batch.status === "delayed" && (
        <Alert
          variant="warning"
          title="Arrived after the expected time"
          description="Funds landed, late. Worth flagging to the rail if the same window slips again."
        />
      )}
      {batch.status === "in_window" && (
        <Alert
          variant="info"
          icon={<Warning size={20} weight="fill" />}
          title="Still inside its window"
          description="Nothing has arrived yet, and nothing is wrong. Items keep accumulating until the cut-off closes."
        />
      )}

      <dl className={styles.detailGrid}>
        <Term label="Batch reference">
          <span style={{ fontFamily: "var(--font-mono)" }}>{batch.reference}</span>
        </Term>
        <Term label="Rail">{batch.rail}</Term>
        <Term label="Window">{batch.window}</Term>
        <Term label="Cut-off">{formatDateTime(batch.cutOff)}</Term>
        <Term label="Expected arrival">{formatDateTime(batch.expectedArrival)}</Term>
        <Term label="Actual arrival">
          {batch.actualArrival ? formatDateTime(batch.actualArrival) : "Not yet credited"}
        </Term>
        <Term label="Items">{formatCount(batch.itemCount)}</Term>
        <Term label="Variance">
          {variance === null
            ? "—"
            : variance === 0
              ? "On time"
              : variance > 0
                ? `${variance} min late`
                : `${Math.abs(variance)} min early`}
        </Term>
      </dl>

      <Separator />

      <div className="flex flex-col" style={{ gap: "var(--space-3)" }}>
        <Heading>Where to go next</Heading>
        <button type="button" className={styles.linkButton} onClick={onShowRail}>
          Open the ledger filtered to {batch.rail}
          <ArrowSquareOut size={14} weight="bold" aria-hidden="true" />
        </button>
        <p className="text-text-tertiary" style={{ fontSize: "var(--text-xs)", lineHeight: "var(--leading-normal)" }}>
          Batch windows and cut-off times here are demo data. They are not the published BSP,
          InstaPay or PESONet schedule.
        </p>
      </div>
    </div>
  );
}
