"use client";

import { createContext, useContext } from "react";
import type { ToastOptions } from "@/components/ui/toast";
import type {
  Merchant,
  MerchantStatus,
  Period,
  Rail,
  TimelineEvent,
  Transaction,
  TransactionStatus,
} from "@/app/dashboard/_data/payments";

export type Section =
  | "overview"
  | "transactions"
  | "settlements"
  | "merchants"
  | "settings";

export const SECTION_TITLE: Record<Section, string> = {
  overview: "Overview",
  transactions: "Transactions",
  settlements: "Settlements",
  merchants: "Merchants",
  settings: "Settings",
};

/**
 * Operator preferences. Every one of these is read by at least one other
 * section — a setting that changes nothing on screen is the "decorative
 * stub" this console exists to eliminate.
 */
export type OpsSettings = {
  /** Failed transfers on the current day that trip the Overview alert. */
  failThreshold: number;
  /** Rows per page in the ledger. */
  pageSize: number;
  /** Table density, shared by the ledger and the batch table. */
  density: "compact" | "comfortable";
  /** Zebra striping on every table in the console. */
  zebra: boolean;
  /** Which rails are plotted in the Overview analytics band. */
  visibleRails: Rail[];
  /** When off, actions still mutate state but stay silent. */
  toastsEnabled: boolean;
  /** Period the Overview opens on, and what "Reset view" returns to. */
  defaultPeriod: Period;
  /** Prototype control: makes the failed-load state reachable. */
  simulateOutage: boolean;
};

export const DEFAULT_SETTINGS: OpsSettings = {
  failThreshold: 4,
  pageSize: 10,
  density: "comfortable",
  zebra: true,
  visibleRails: ["InstaPay", "PESONet", "QR Ph"],
  toastsEnabled: true,
  defaultPeriod: "7d",
  simulateOutage: false,
};

/** A prototype mutation layered over a fixed dataset row. */
export type TxnOverride = {
  status?: TransactionStatus;
  flagged?: boolean;
  /** Appended to the row's authored timeline, never replacing it. */
  events?: TimelineEvent[];
};

export type MerchantOverride = {
  status?: MerchantStatus;
};

export type LedgerFilters = {
  query: string;
  rail: Rail | "all";
  status: TransactionStatus | "all";
  day: string | "all";
  /** Rows the operator has flagged in this session. */
  flaggedOnly: boolean;
  /** failed + reversed + disputed, the three that need a human. */
  needsReviewOnly: boolean;
};

export const EMPTY_FILTERS: LedgerFilters = {
  query: "",
  rail: "all",
  status: "all",
  day: "all",
  flaggedOnly: false,
  needsReviewOnly: false,
};

export type OpsApi = {
  /** The dataset with every prototype mutation applied. */
  rows: Transaction[];
  merchantList: Merchant[];
  isFlagged: (id: string) => boolean;
  flaggedCount: number;
  mutatedCount: number;

  settings: OpsSettings;
  updateSettings: (patch: Partial<OpsSettings>) => void;
  resetSettings: () => void;

  section: Section;
  goTo: (section: Section, filters?: Partial<LedgerFilters>) => void;

  filters: LedgerFilters;
  setFilters: (next: LedgerFilters) => void;
  patchFilters: (patch: Partial<LedgerFilters>) => void;
  clearFilters: () => void;

  period: Period;
  setPeriod: (period: Period) => void;

  openTransaction: (id: string) => void;
  openMerchant: (id: string) => void;
  openBatch: (id: string) => void;

  notify: (options: ToastOptions) => void;
  retry: (ids: string[]) => void;
  setFlag: (ids: string[], flagged: boolean) => void;
  exportRows: (count: number, label: string) => void;
  requestReset: () => void;
  requestMerchantStatus: (id: string, next: MerchantStatus) => void;

  /** Section-level fetch state. */
  loading: boolean;
  failed: boolean;
  refresh: () => void;
  pendingIds: string[];
};

const OpsContext = createContext<OpsApi | null>(null);

export const OpsProvider = OpsContext.Provider;

export function useOps(): OpsApi {
  const value = useContext(OpsContext);
  if (!value) throw new Error("useOps must be used inside the Ops Console");
  return value;
}
