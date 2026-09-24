"use client";

import type { ReactNode } from "react";
import {
  CaretDown,
  CaretUp,
  CaretUpDown,
  Flag,
  SpinnerGap,
} from "@phosphor-icons/react/ssr";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  STATUS_BADGE_VARIANT,
  STATUS_LABEL,
  formatDate,
  formatPeso,
  formatTime,
  type Transaction,
} from "@/app/dashboard/_data/payments";
import styles from "../ops.module.css";

export type LedgerSortKey =
  | "reference"
  | "merchant"
  | "customer"
  | "rail"
  | "status"
  | "date"
  | "amount"
  | "net";

export type LedgerSort = { key: LedgerSortKey; direction: "asc" | "desc" };

type Column = {
  key: LedgerSortKey;
  header: string;
  numeric?: boolean;
  /** Dropped below 768px, where the ledger would otherwise need a scroll. */
  secondary?: boolean;
};

const COLUMNS: Column[] = [
  { key: "reference", header: "Reference" },
  { key: "merchant", header: "Merchant" },
  { key: "customer", header: "Payer", secondary: true },
  { key: "rail", header: "Rail" },
  { key: "status", header: "Status" },
  { key: "date", header: "Timestamp", secondary: true },
  { key: "amount", header: "Amount", numeric: true },
  { key: "net", header: "Net", numeric: true, secondary: true },
];

function cellValue(row: Transaction, key: LedgerSortKey): string | number {
  switch (key) {
    case "amount":
      return row.amount;
    case "net":
      return row.net;
    case "status":
      return STATUS_LABEL[row.status];
    default:
      return row[key];
  }
}

/**
 * Sorting lives outside the table so the parent can sort the whole
 * filtered set and only then slice a page out of it. Sorting a single
 * page would silently reorder ten rows and call it a sorted ledger.
 */
export function sortTransactions(rows: Transaction[], sort: LedgerSort): Transaction[] {
  const factor = sort.direction === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const left = cellValue(a, sort.key);
    const right = cellValue(b, sort.key);
    if (typeof left === "number" && typeof right === "number") {
      return (left - right) * factor;
    }
    return String(left).localeCompare(String(right), "en", { numeric: true }) * factor;
  });
}

type LedgerTableProps = {
  rows: Transaction[];
  caption: string;
  density: "compact" | "comfortable";
  zebra: boolean;
  sort: LedgerSort;
  onSortChange: (sort: LedgerSort) => void;
  onOpen: (id: string) => void;
  isFlagged: (id: string) => boolean;
  pendingIds: string[];
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
  onToggleAll?: () => void;
  emptyState: ReactNode;
};

export function LedgerTable({
  rows,
  caption,
  density,
  zebra,
  sort,
  onSortChange,
  onOpen,
  isFlagged,
  pendingIds,
  selectedIds,
  onToggleSelect,
  onToggleAll,
  emptyState,
}: LedgerTableProps) {
  const selectable = Boolean(selectedIds && onToggleSelect && onToggleAll);
  const selected = new Set(selectedIds ?? []);
  const allSelected = rows.length > 0 && rows.every((row) => selected.has(row.id));
  const someSelected = rows.some((row) => selected.has(row.id));
  const columnCount = COLUMNS.length + (selectable ? 1 : 0);

  function toggleSort(key: LedgerSortKey) {
    if (sort.key === key) {
      onSortChange({ key, direction: sort.direction === "asc" ? "desc" : "asc" });
    } else {
      onSortChange({ key, direction: key === "amount" || key === "net" ? "desc" : "asc" });
    }
  }

  return (
    <div className={styles.ledgerWrapper}>
      <table
        className={`${styles.ledger} ${zebra ? styles.zebra : ""}`}
        data-density={density}
      >
        <caption className="sr-only">{caption}</caption>
        {/* The ink header band. data-surface re-declares the semantic layer
            for the <thead> only, so the sort caret turns pure yellow here
            with no extra styling. */}
        <thead data-surface="ink">
          <tr>
            {selectable && (
              <th scope="col" className={styles.checkCell}>
                <Checkbox
                  checked={allSelected}
                  indeterminate={!allSelected && someSelected}
                  onChange={onToggleAll}
                  aria-label={allSelected ? "Clear selection" : "Select every row on this page"}
                />
              </th>
            )}
            {COLUMNS.map((column) => {
              const active = sort.key === column.key;
              return (
                <th
                  key={column.key}
                  scope="col"
                  className={[
                    column.numeric ? styles.numeric : "",
                    column.secondary ? styles.hideSm : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-sort={
                    active ? (sort.direction === "asc" ? "ascending" : "descending") : undefined
                  }
                >
                  <button
                    type="button"
                    className={styles.sortButton}
                    data-active={active || undefined}
                    onClick={() => toggleSort(column.key)}
                  >
                    {column.header}
                    <span className={styles.sortIcon} aria-hidden>
                      {active ? (
                        sort.direction === "asc" ? (
                          <CaretUp size={12} weight="fill" />
                        ) : (
                          <CaretDown size={12} weight="fill" />
                        )
                      ) : (
                        <CaretUpDown size={12} weight="regular" />
                      )}
                    </span>
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>

        {rows.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan={columnCount} style={{ padding: 0 }}>
                {emptyState}
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {rows.map((row) => {
              const flagged = isFlagged(row.id);
              const pending = pendingIds.includes(row.id);
              return (
                <tr
                  key={row.id}
                  className={styles.row}
                  data-flagged={flagged || undefined}
                  data-selected={selected.has(row.id) || undefined}
                  data-pending={pending || undefined}
                  onClick={() => onOpen(row.id)}
                >
                  {selectable && (
                    <td
                      className={styles.checkCell}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Checkbox
                        checked={selected.has(row.id)}
                        onChange={() => onToggleSelect?.(row.id)}
                        aria-label={`Select ${row.reference}`}
                      />
                    </td>
                  )}

                  <td>
                    <span
                      className="inline-flex items-center"
                      style={{ gap: "var(--space-2)" }}
                    >
                      {/* The row is clickable for the mouse; this button is
                          the control the keyboard and a screen reader get. */}
                      <button
                        type="button"
                        className={styles.openButton}
                        onClick={(event) => {
                          event.stopPropagation();
                          onOpen(row.id);
                        }}
                      >
                        {row.reference}
                      </button>
                      {flagged && (
                        <Flag
                          size={13}
                          weight="fill"
                          className="text-accent-text"
                          aria-label="Flagged for review"
                        />
                      )}
                      {pending && (
                        <SpinnerGap size={13} weight="bold" aria-label="Retry in flight" />
                      )}
                    </span>
                  </td>

                  <td>{row.merchant}</td>
                  <td className={styles.hideSm}>{row.customer}</td>
                  <td>
                    <span className="text-text-secondary">{row.rail}</span>
                  </td>
                  <td>
                    <Badge variant={STATUS_BADGE_VARIANT[row.status]} dot>
                      {STATUS_LABEL[row.status]}
                    </Badge>
                  </td>
                  <td className={`${styles.hideSm} ${styles.mono}`}>
                    {formatDate(row.date)} · {formatTime(row.date)}
                  </td>
                  <td className={styles.numeric}>{formatPeso(row.amount)}</td>
                  <td className={`${styles.numeric} ${styles.hideSm} text-text-secondary`}>
                    {formatPeso(row.net)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
    </div>
  );
}
