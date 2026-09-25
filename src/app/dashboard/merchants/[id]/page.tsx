"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowSquareOut,
  CheckCircle,
  PencilSimple,
  Warning,
} from "@phosphor-icons/react/ssr";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { List, ListRow } from "@/components/ui/list-row";
import { NativeSelect } from "@/components/ui/native-select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  MERCHANT_STATUS_BADGE_VARIANT,
  MERCHANT_STATUS_LABEL,
  STATUS_BADGE_VARIANT,
  STATUS_LABEL,
  formatCount,
  formatDate,
  formatPercent,
  formatPeso,
  formatTime,
  getTotals,
  getTransactionsByMerchant,
} from "@/app/dashboard/_data/payments";
import { useOps } from "../../_components/ops-context";
import styles from "../../ops.module.css";

const CATEGORIES = [
  "Retail",
  "Food & beverage",
  "Logistics",
  "Healthcare",
  "Automotive",
  "Home & living",
  "Telecommunications",
];

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
    <h2
      className="text-text-primary"
      style={{
        fontSize: "var(--text-sm)",
        fontWeight: "var(--weight-bold)",
        letterSpacing: "var(--tracking-caps)",
        textTransform: "uppercase",
      }}
    >
      {children}
    </h2>
  );
}

export default function MerchantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const ops = useOps();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  const merchant = ops.merchantList.find((entry) => entry.id === id);

  if (!merchant) {
    return (
      <section className="flex flex-col" style={{ gap: "var(--space-6)", maxWidth: "48rem" }}>
        <p className="text-text-secondary" style={{ fontSize: "var(--text-sm)" }}>
          That merchant is no longer in the loaded dataset.
        </p>
        <Link href="/dashboard/merchants">
          <Button variant="secondary" size="sm" iconLeft={<ArrowLeft size={14} weight="bold" />}>
            Back to merchants
          </Button>
        </Link>
      </section>
    );
  }

  const rows = getTransactionsByMerchant(merchant.id);
  const totals = getTotals(rows);

  function startEditing() {
    setName(merchant!.name);
    setCategory(merchant!.category);
    setEditing(true);
  }

  function saveEdits(event: React.FormEvent) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    ops.updateMerchantDetails(merchant!.id, { name: trimmedName, category });
    setEditing(false);
  }

  return (
    <section className="flex flex-col" style={{ gap: "var(--space-8)", maxWidth: "64rem" }}>
      <div className="flex flex-col" style={{ gap: "var(--space-4)" }}>
        <Link href="/dashboard/merchants" className={styles.linkButton}>
          <ArrowLeft size={14} weight="bold" aria-hidden="true" />
          Back to merchants
        </Link>

        <div className="flex flex-wrap items-start justify-between" style={{ gap: "var(--space-4)" }}>
          <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
            <span
              className="text-text-primary"
              style={{
                fontSize: "var(--text-3xl)",
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

          <div className={styles.chipRow}>
            <Button
              variant="secondary"
              size="sm"
              iconLeft={<PencilSimple size={14} weight="regular" />}
              onClick={startEditing}
            >
              Edit details
            </Button>
            <Button
              variant={merchant.status === "suspended" ? "primary" : "danger"}
              size="sm"
              iconLeft={<Warning size={14} weight="regular" />}
              onClick={() =>
                ops.requestMerchantStatus(
                  merchant.id,
                  merchant.status === "suspended" ? "active" : "suspended",
                )
              }
            >
              {merchant.status === "suspended" ? "Reinstate payouts" : "Suspend payouts"}
            </Button>
          </div>
        </div>
      </div>

      {editing && (
        <Card>
          <form onSubmit={saveEdits} className="flex flex-col" style={{ gap: "var(--space-4)" }}>
            <Heading>Edit details</Heading>
            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "var(--space-3)" }}>
              <Input
                label="Merchant name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
              <NativeSelect
                label="Category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                options={CATEGORIES.map((entry) => ({ value: entry, label: entry }))}
              />
            </div>
            <p className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
              Session-only — there is no backend behind this prototype, so the edit resets on
              reset or reload.
            </p>
            <div className={styles.chipRow}>
              <Button type="submit" variant="primary" size="sm">
                Save changes
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

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
        <Term label="30-day success rate">
          {merchant.volume === 0 && rows.length === 0 ? "—" : formatPercent(merchant.successRate)}
        </Term>
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
          <button
            type="button"
            className={styles.linkButton}
            onClick={() => ops.goTo("transactions", { query: merchant.name })}
          >
            Filter the ledger to this merchant
            <ArrowSquareOut size={14} weight="bold" aria-hidden="true" />
          </button>
        </div>

        {rows.length === 0 ? (
          <p className="text-text-tertiary" style={{ fontSize: "var(--text-sm)" }}>
            {merchant.id.startsWith("mer-new-")
              ? "No transactions yet — this merchant was just added to the session and isn't in the fixed 60-row sample."
              : "No transactions for this merchant in the 60-row sample. The 30-day figures above come from the merchant record."}
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
                  onClick={() => ops.openTransaction(row.id)}
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

      <Card
        flat
        className="flex-wrap items-center justify-between"
        style={{ flexDirection: "row", gap: "var(--space-4)" }}
      >
        <span className="flex items-center" style={{ gap: "var(--space-3)" }}>
          <CheckCircle size={20} weight="fill" className="text-accent-text" aria-hidden="true" />
          <span
            className="text-text-primary"
            style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-bold)" }}
          >
            Done here?
          </span>
        </span>
        <Link href="/dashboard/merchants" className={styles.linkButton}>
          Back to merchants
          <ArrowSquareOut size={14} weight="bold" aria-hidden="true" />
        </Link>
      </Card>
    </section>
  );
}
