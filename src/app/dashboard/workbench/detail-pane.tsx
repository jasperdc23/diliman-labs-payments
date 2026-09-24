"use client";

import {
  ArrowClockwise,
  ArrowLeft,
  ArrowUUpLeft,
  CheckCircle,
  DotsThree,
  Flag,
  Storefront,
} from "@phosphor-icons/react/ssr";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, type TableColumn } from "@/components/ui/table";
import {
  MERCHANT_STATUS_BADGE_VARIANT,
  MERCHANT_STATUS_LABEL,
  STATUS_BADGE_VARIANT,
  STATUS_LABEL,
  formatDate,
  formatDateTime,
  formatPercent,
  formatPeso,
  type Merchant,
  type Transaction,
} from "../_data/payments";
import { StatusTimeline } from "./status-timeline";
import {
  DETAIL_PANE_ID,
  canApprove,
  canRefund,
  canRetry,
  isFlagged,
  plural,
  type OverrideMap,
  type QueueDef,
} from "./queues";
import styles from "./workbench.module.css";

type DetailPaneProps = {
  transaction: Transaction | null;
  merchant: Merchant | undefined;
  /** The merchant's other payments, already override-applied, newest first. */
  siblings: Transaction[];
  overrides: OverrideMap;
  queue: QueueDef;
  /** False once an action has pushed this payment out of the open queue. */
  inCurrentView: boolean;
  busy: boolean;
  /** The last retry on this payment came back rejected. */
  retryRejected: boolean;
  /** A row to offer when nothing is open, or null when the queue is empty. */
  firstRowId: string | null;
  onBack: () => void;
  onOpenPayment: (id: string) => void;
  onApprove: () => void;
  onRetry: () => void;
  onRefund: () => void;
  onToggleFlag: () => void;
  onExport: () => void;
  onCopyReference: () => void;
  onShowMerchantPayments: () => void;
  onGoToNeedsReview: () => void;
};

export function DetailPane({
  transaction,
  merchant,
  siblings,
  overrides,
  queue,
  inCurrentView,
  busy,
  retryRejected,
  firstRowId,
  onBack,
  onOpenPayment,
  onApprove,
  onRetry,
  onRefund,
  onToggleFlag,
  onExport,
  onCopyReference,
  onShowMerchantPayments,
  onGoToNeedsReview,
}: DetailPaneProps) {
  const backBar = (
    <div className={styles.backBar}>
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        iconLeft={<ArrowLeft size={14} weight="bold" aria-hidden="true" />}
      >
        Back to {queue.label}
      </Button>
    </div>
  );

  if (!transaction) {
    return (
      <section
        id={DETAIL_PANE_ID}
        tabIndex={-1}
        className={styles.detailPane}
        aria-label="Payment detail"
      >
        {backBar}
        <div className={styles.scroll}>
          <EmptyState
            icon={<Storefront size={32} weight="regular" />}
            title="No payment open"
            description={
              firstRowId
                ? `Pick a row from ${queue.label}, or open the first one and work down the list with the arrow keys.`
                : `${queue.label} has nothing in it right now.`
            }
            action={
              firstRowId
                ? { label: "Open the first payment", onClick: () => onOpenPayment(firstRowId) }
                : { label: "Go to Needs review", onClick: onGoToNeedsReview }
            }
            secondaryAction={
              firstRowId
                ? { label: "Go to Needs review", onClick: onGoToNeedsReview }
                : undefined
            }
          />
        </div>
      </section>
    );
  }

  const flagged = isFlagged(overrides, transaction.id);
  const addedCount = overrides[transaction.id]?.events?.length ?? 0;
  const approvable = canApprove(transaction.status);
  const retryable = canRetry(transaction.status);
  const refundable = canRefund(transaction.status);
  const noActions = !approvable && !retryable && !refundable;

  const siblingColumns: TableColumn<Transaction>[] = [
    {
      key: "reference",
      header: "Reference",
      render: (row) => <span className={styles.mono}>{row.reference}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={STATUS_BADGE_VARIANT[row.status]} size="sm">
          {STATUS_LABEL[row.status]}
        </Badge>
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
      key: "open",
      header: <span className={styles.srOnly}>Open</span>,
      align: "right",
      render: (row) => (
        <Button variant="ghost" size="sm" onClick={() => onOpenPayment(row.id)}>
          Open
        </Button>
      ),
    },
  ];

  return (
    <section
      id={DETAIL_PANE_ID}
      tabIndex={-1}
      className={styles.detailPane}
      aria-label={`Payment ${transaction.reference}`}
    >
      {backBar}

      <div className={styles.scroll}>
        {/* THE one full-bleed yellow block on the light canvas. It carries
            the identity and the figure — the thing the analyst is deciding
            about — so the brand block and the hierarchy are one decision. */}
        <header data-surface="accent" className={`bg-surface grain ${styles.detailHero}`}>
          <div className="flex flex-col" style={{ gap: "var(--space-2)", minWidth: 0 }}>
            <div className="flex flex-wrap items-center" style={{ gap: "var(--space-2)" }}>
              <span className={styles.heroRef}>{transaction.reference}</span>
              <Badge variant={STATUS_BADGE_VARIANT[transaction.status]} size="sm">
                {STATUS_LABEL[transaction.status]}
              </Badge>
              {flagged ? (
                <span className={styles.heroFlagChip}>
                  <Flag size={10} weight="fill" aria-hidden="true" />
                  Flagged
                </span>
              ) : null}
            </div>
            <span className={styles.heroAmount}>{formatPeso(transaction.amount)}</span>
            <span className="text-text-secondary" style={{ fontSize: "var(--text-sm)" }}>
              {transaction.merchant} · {transaction.rail} · {formatDateTime(transaction.date)}
            </span>
          </div>

          <dl className={styles.heroFigures}>
            <div>
              <dt className={styles.metaLabel}>Fee</dt>
              <dd className={`${styles.metaValue} tabular-nums`}>
                {formatPeso(transaction.fee)}
              </dd>
            </div>
            <div>
              <dt className={styles.metaLabel}>Net to merchant</dt>
              <dd className={`${styles.metaValue} tabular-nums`}>
                {formatPeso(transaction.net)}
              </dd>
            </div>
          </dl>
        </header>

        <div className={styles.detailBody}>
          {/* An action can push the open payment out of the queue that led
              to it. Saying so beats the row silently vanishing. */}
          {!inCurrentView ? (
            <Alert
              variant="success"
              title={`This payment has left ${queue.label}`}
              description={`It is now ${STATUS_LABEL[transaction.status].toLowerCase()}, so it no longer matches this queue. It stays open here until you pick another row.`}
            />
          ) : null}

          {retryRejected ? (
            <div className="flex flex-col" style={{ gap: "var(--space-3)" }}>
              <Alert
                variant="danger"
                title="The retry was rejected again"
                description="The receiving institution returned the same rejection. Retrying a third time will not change the outcome — either force a manual credit or flag it for the merchant's bank to investigate."
              />
              <div className="flex flex-wrap" style={{ gap: "var(--space-2)" }}>
                <Button
                  size="sm"
                  onClick={onApprove}
                  iconLeft={<CheckCircle size={14} weight="fill" aria-hidden="true" />}
                >
                  Approve a manual credit
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={onToggleFlag}
                  iconLeft={<Flag size={14} weight="regular" aria-hidden="true" />}
                >
                  {flagged ? "Remove flag" : "Flag for investigation"}
                </Button>
              </div>
            </div>
          ) : null}

          <div className={styles.actionRow}>
            {approvable ? (
              <Button
                onClick={onApprove}
                disabled={busy}
                iconLeft={<CheckCircle size={16} weight="fill" aria-hidden="true" />}
              >
                Approve
              </Button>
            ) : null}
            {retryable ? (
              <Button
                variant="secondary"
                onClick={onRetry}
                loading={busy}
                iconLeft={<ArrowClockwise size={16} weight="regular" aria-hidden="true" />}
              >
                Retry
              </Button>
            ) : null}
            {refundable ? (
              <Button
                variant="danger"
                onClick={onRefund}
                disabled={busy}
                iconLeft={<ArrowUUpLeft size={16} weight="regular" aria-hidden="true" />}
              >
                Refund
              </Button>
            ) : null}
            <Button
              variant={flagged ? "secondary" : "ghost"}
              onClick={onToggleFlag}
              aria-pressed={flagged}
              iconLeft={<Flag size={16} weight={flagged ? "fill" : "regular"} aria-hidden="true" />}
            >
              {flagged ? "Flagged" : "Flag"}
            </Button>
            <DropdownMenu
              align="end"
              trigger={
                <Button
                  variant="ghost"
                  iconOnly
                  aria-label="More actions for this payment"
                  iconLeft={<DotsThree size={20} weight="bold" aria-hidden="true" />}
                />
              }
              items={[
                { label: "Copy reference", onSelect: onCopyReference },
                { label: "Export this payment (CSV)", onSelect: onExport },
                { type: "separator" },
                {
                  label: `Show all payments from ${transaction.merchant}`,
                  onSelect: onShowMerchantPayments,
                },
              ]}
            />
          </div>

          {/* Nothing applicable is still a state that has to lead somewhere. */}
          {noActions ? (
            <Alert
              variant="neutral"
              title="This payment is closed"
              description="A reversed payment has already returned to the payer, so there is nothing left to approve, retry or refund. It can still be flagged or exported for the file."
            />
          ) : null}

          <Card>
            <CardTitle>Payment record</CardTitle>
            <dl className={styles.metaGrid}>
              <div>
                <dt className={styles.metaLabel}>Payer</dt>
                <dd className={styles.metaValue}>{transaction.customer}</dd>
              </div>
              <div>
                <dt className={styles.metaLabel}>Merchant</dt>
                <dd className={styles.metaValue}>{transaction.merchant}</dd>
              </div>
              <div>
                <dt className={styles.metaLabel}>Rail</dt>
                <dd className={styles.metaValue}>{transaction.rail}</dd>
              </div>
              <div>
                <dt className={styles.metaLabel}>Initiated</dt>
                <dd className={styles.metaValue}>{formatDateTime(transaction.date)}</dd>
              </div>
              <div>
                <dt className={styles.metaLabel}>Gross</dt>
                <dd className={`${styles.metaValue} tabular-nums`}>
                  {formatPeso(transaction.amount)}
                </dd>
              </div>
              <div>
                <dt className={styles.metaLabel}>Payment ID</dt>
                <dd className={`${styles.metaValue} ${styles.mono}`}>{transaction.id}</dd>
              </div>
            </dl>
          </Card>

          <Card>
            <CardTitle>Status timeline</CardTitle>
            <StatusTimeline events={transaction.timeline} addedCount={addedCount} />
          </Card>

          <Card>
            <div
              className="flex flex-wrap items-start justify-between"
              style={{ gap: "var(--space-3)" }}
            >
              <div className="flex flex-col" style={{ gap: "var(--space-1)" }}>
                <CardTitle>{transaction.merchant}</CardTitle>
                {merchant ? (
                  <span className="text-text-tertiary" style={{ fontSize: "var(--text-sm)" }}>
                    {merchant.category} · joined {formatDate(merchant.joinedDate)}
                  </span>
                ) : null}
              </div>
              {merchant ? (
                <Badge variant={MERCHANT_STATUS_BADGE_VARIANT[merchant.status]}>
                  {MERCHANT_STATUS_LABEL[merchant.status]}
                </Badge>
              ) : null}
            </div>

            {merchant ? (
              <dl className={styles.metaGrid}>
                <div>
                  <dt className={styles.metaLabel}>30-day volume</dt>
                  <dd className={`${styles.metaValue} tabular-nums`}>
                    {formatPeso(merchant.volume)}
                  </dd>
                </div>
                <div>
                  <dt className={styles.metaLabel}>Success rate</dt>
                  <dd className={`${styles.metaValue} tabular-nums`}>
                    {formatPercent(merchant.successRate)}
                  </dd>
                </div>
                <div>
                  <dt className={styles.metaLabel}>Account status</dt>
                  <dd className={styles.metaValue}>{MERCHANT_STATUS_LABEL[merchant.status]}</dd>
                </div>
              </dl>
            ) : (
              // getMerchantById returns undefined for an unknown id, so this
              // renders a stated absence rather than crashing on a join.
              <Alert
                variant="warning"
                title="Merchant record not found"
                description="The payment still carries the merchant's name, but the account record it points at is missing. Raise it with onboarding before acting on this payment."
              />
            )}

            <div className="flex flex-col" style={{ gap: "var(--space-3)" }}>
              <div
                className="flex flex-wrap items-center justify-between"
                style={{ gap: "var(--space-3)" }}
              >
                <span
                  className="text-text-secondary"
                  style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-bold)" }}
                >
                  {siblings.length > 0
                    ? `${plural(siblings.length)} from this merchant in the window`
                    : "No other payments from this merchant in the window"}
                </span>
                <Button variant="secondary" size="sm" onClick={onShowMerchantPayments}>
                  Filter the queue to this merchant
                </Button>
              </div>

              {siblings.length > 0 ? (
                <Table
                  columns={siblingColumns}
                  rows={siblings}
                  getRowKey={(row) => row.id}
                  density="compact"
                  headerTone="ink"
                  caption={`Other payments from ${transaction.merchant}`}
                  emptyState={
                    <EmptyState
                      title="No other payments"
                      description="Nothing else from this merchant inside the loaded window."
                      secondaryAction={{
                        label: "Show all payments",
                        onClick: onShowMerchantPayments,
                      }}
                    />
                  }
                />
              ) : null}
            </div>
          </Card>

          <p className={styles.disclaimer}>
            Demo data. Amounts, cut-off times, batch windows and rail behavior here are
            illustrative and are not the published BSP, InstaPay, PESONet or QR Ph schedule.
            Nothing on this screen is a live settlement instruction.
          </p>
        </div>
      </div>
    </section>
  );
}
