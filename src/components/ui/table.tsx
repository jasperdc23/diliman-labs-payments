"use client";

import { useMemo, useState, type ReactNode } from "react";
import { CaretDown, CaretUp, CaretUpDown } from "@phosphor-icons/react/ssr";
import styles from "./table.module.css";

type SortDirection = "asc" | "desc";

export type TableColumn<T> = {
  key: string;
  header: ReactNode;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  render?: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  width?: string;
};

type TableProps<T> = {
  columns: TableColumn<T>[];
  rows: T[];
  getRowKey: (row: T, index: number) => string;
  caption?: string;
  density?: "compact" | "comfortable";
  zebra?: boolean;
  stickyHeader?: boolean;
  emptyState?: ReactNode;
  defaultSort?: { key: string; direction: SortDirection };
  /**
   * `"ink"` scopes the header band to the ink surface. `.head th` already
   * reads --surface-sunken and --text-secondary, and the active sort caret
   * already reads --accent-text, so the black band and a pure-yellow caret
   * both fall out of the scope with no extra styling. Defaults to
   * `"default"` — /docs uses Table too.
   */
  headerTone?: "default" | "ink";
  className?: string;
};

function readCell<T>(row: T, column: TableColumn<T>): string | number {
  if (column.sortValue) return column.sortValue(row);
  const value = (row as Record<string, unknown>)[column.key];
  if (typeof value === "number" || typeof value === "string") return value;
  return "";
}

export function Table<T>({
  columns,
  rows,
  getRowKey,
  caption,
  density = "comfortable",
  zebra = false,
  stickyHeader = false,
  emptyState = "No records to show.",
  defaultSort,
  headerTone = "default",
  className = "",
}: TableProps<T>) {
  const [sort, setSort] = useState<{ key: string; direction: SortDirection } | null>(
    defaultSort ?? null,
  );

  const sortedRows = useMemo(() => {
    if (!sort) return rows;
    const column = columns.find((c) => c.key === sort.key);
    if (!column) return rows;
    const factor = sort.direction === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const left = readCell(a, column);
      const right = readCell(b, column);
      if (typeof left === "number" && typeof right === "number") {
        return (left - right) * factor;
      }
      return String(left).localeCompare(String(right), undefined, { numeric: true }) * factor;
    });
  }, [rows, sort, columns]);

  function toggleSort(key: string) {
    setSort((current) => {
      if (!current || current.key !== key) return { key, direction: "asc" };
      if (current.direction === "asc") return { key, direction: "desc" };
      return null;
    });
  }

  const wrapperClass = [styles.wrapper, stickyHeader ? styles.sticky : "", zebra ? styles.zebra : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClass} style={stickyHeader ? { maxHeight: "24rem" } : undefined}>
      <table className={styles.table} data-density={density}>
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className={styles.head} data-surface={headerTone === "ink" ? "ink" : undefined}>
          <tr>
            {columns.map((column) => {
              const activeSort = sort && sort.key === column.key ? sort : null;
              const alignClass =
                column.align === "right"
                  ? styles.right
                  : column.align === "center"
                    ? styles.center
                    : "";
              return (
                <th
                  key={column.key}
                  scope="col"
                  className={alignClass}
                  style={column.width ? { width: column.width } : undefined}
                  aria-sort={
                    activeSort
                      ? activeSort.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      className={styles.sortButton}
                      data-active={activeSort ? true : undefined}
                      onClick={() => toggleSort(column.key)}
                    >
                      {column.header}
                      <span className={styles.sortIcon} aria-hidden>
                        {activeSort ? (
                          activeSort.direction === "asc" ? (
                            <CaretUp size={12} weight="fill" />
                          ) : (
                            <CaretDown size={12} weight="fill" />
                          )
                        ) : (
                          <CaretUpDown size={12} weight="regular" />
                        )}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        {sortedRows.length === 0 ? (
          <tbody className={styles.empty}>
            <tr>
              <td colSpan={columns.length}>{emptyState}</td>
            </tr>
          </tbody>
        ) : (
          <tbody className={styles.body}>
            {sortedRows.map((row, index) => (
              <tr key={getRowKey(row, index)}>
                {columns.map((column) => {
                  const classes = [
                    column.align === "right" ? `${styles.right} ${styles.numeric}` : "",
                    column.align === "center" ? styles.center : "",
                  ]
                    .filter(Boolean)
                    .join(" ");
                  return (
                    <td key={column.key} className={classes}>
                      {column.render
                        ? column.render(row)
                        : String((row as Record<string, unknown>)[column.key] ?? "")}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}
