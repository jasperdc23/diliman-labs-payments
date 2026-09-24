"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  ChartLineUp,
  Gear,
  House,
  MagnifyingGlass,
  Receipt,
  Storefront,
  ArrowsLeftRight,
} from "@phosphor-icons/react/ssr";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { LineChart } from "@/components/ui/line-chart";
import { BarChart } from "@/components/ui/bar-chart";
import { Table, type TableColumn } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tabs } from "@/components/ui/tabs";
import { SearchBar } from "@/components/ui/search-bar";
import { ThemeToggle } from "@/components/theme-toggle";

type Transaction = {
  id: string;
  reference: string;
  merchant: string;
  rail: "InstaPay" | "PESONet" | "QR Ph";
  status: "settled" | "pending" | "reversed";
  date: string;
  amount: number;
};

const transactions: Transaction[] = [
  { id: "1", reference: "TXN-8814", merchant: "Bayani Mart", rail: "InstaPay", status: "settled", date: "27 Aug 2026", amount: 12450.5 },
  { id: "2", reference: "TXN-8815", merchant: "Sari Express", rail: "PESONet", status: "pending", date: "27 Aug 2026", amount: 3200 },
  { id: "3", reference: "TXN-8816", merchant: "Kalye Coffee", rail: "QR Ph", status: "settled", date: "26 Aug 2026", amount: 780.25 },
  { id: "4", reference: "TXN-8817", merchant: "Luzon Logistics", rail: "PESONet", status: "reversed", date: "26 Aug 2026", amount: 98750 },
  { id: "5", reference: "TXN-8818", merchant: "Isla Pharmacy", rail: "InstaPay", status: "settled", date: "25 Aug 2026", amount: 5420.75 },
  { id: "6", reference: "TXN-8819", merchant: "Kalinga Bakeshop", rail: "QR Ph", status: "settled", date: "25 Aug 2026", amount: 1180.0 },
  { id: "7", reference: "TXN-8820", merchant: "Bayani Mart", rail: "InstaPay", status: "pending", date: "24 Aug 2026", amount: 6740.3 },
  { id: "8", reference: "TXN-8821", merchant: "Visayas Freight Co.", rail: "PESONet", status: "settled", date: "24 Aug 2026", amount: 45200 },
];

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
});

const pesoCompact = (value: number) => `₱${value.toLocaleString()}`;

const statusVariant = {
  settled: "success",
  pending: "warning",
  reversed: "danger",
} as const;

const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];

const volumeByRail = [
  { name: "InstaPay", values: [3200, 3900, 4300, 4100, 5200, 5800, 6400] },
  { name: "PESONet", values: [2100, 2300, 2200, 2600, 2900, 3100, 3400] },
  { name: "QR Ph", values: [900, 1200, 1700, 2100, 2600, 3300, 4100] },
];

const columns: TableColumn<Transaction>[] = [
  { key: "reference", header: "Reference", sortable: true },
  { key: "merchant", header: "Merchant", sortable: true },
  {
    key: "rail",
    header: "Rail",
    sortable: true,
    render: (row) => (
      <span className="text-text-secondary" style={{ fontSize: "var(--text-sm)" }}>
        {row.rail}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => (
      <Badge variant={statusVariant[row.status]} dot>
        {row.status}
      </Badge>
    ),
  },
  { key: "date", header: "Date", sortable: true },
  {
    key: "amount",
    header: "Amount",
    align: "right",
    sortable: true,
    render: (row) => peso.format(row.amount),
  },
];

type NavItemKey = "overview" | "transactions" | "settlements" | "merchants" | "settings";

const navItems: { key: NavItemKey; label: string; icon: typeof House }[] = [
  { key: "overview", label: "Overview", icon: House },
  { key: "transactions", label: "Transactions", icon: ArrowsLeftRight },
  { key: "settlements", label: "Settlements", icon: Receipt },
  { key: "merchants", label: "Merchants", icon: Storefront },
  { key: "settings", label: "Settings", icon: Gear },
];

export default function DashboardExample() {
  const [activeNav, setActiveNav] = useState<NavItemKey>("overview");
  const [view, setView] = useState("overview");

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside
        className="glass-flat hidden shrink-0 flex-col border-r md:flex"
        style={{ width: "16rem", padding: "var(--space-6) var(--space-4)", gap: "var(--space-6)" }}
      >
        <div className="flex items-center" style={{ gap: "var(--space-2)", paddingInline: "var(--space-2)" }}>
          <span
            className="flex items-center justify-center font-semibold text-text-on-accent"
            style={{
              width: "var(--space-8)",
              height: "var(--space-8)",
              borderRadius: "var(--radius-md)",
              background: "var(--accent)",
              fontSize: "var(--text-sm)",
            }}
            aria-hidden="true"
          >
            E
          </span>
          <span className="text-sm font-semibold tracking-tight text-text-primary">EP</span>
        </div>

        <nav className="flex flex-col" style={{ gap: "var(--space-1)" }} aria-label="Primary">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveNav(item.key)}
                aria-current={isActive ? "page" : undefined}
                className="flex w-full items-center rounded-md text-left font-medium transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]"
                style={{
                  gap: "var(--space-3)",
                  padding: "var(--space-2) var(--space-3)",
                  fontSize: "var(--text-sm)",
                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  background: isActive ? "var(--surface-sunken)" : "transparent",
                }}
              >
                <Icon size={18} weight={isActive ? "fill" : "regular"} aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col" style={{ gap: "var(--space-2)" }}>
          <Link
            href="/examples"
            className="flex items-center rounded-md font-medium text-text-tertiary transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:text-text-primary"
            style={{ gap: "var(--space-2)", padding: "var(--space-2) var(--space-3)", fontSize: "var(--text-sm)" }}
          >
            <ArrowLeft size={16} weight="regular" aria-hidden="true" />
            Back to examples
          </Link>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-h-screen flex-1 flex-col">
        {/* Topbar */}
        <header
          className="glass sticky top-0 z-10 flex items-center justify-between border-b"
          style={{ padding: "var(--space-4) var(--space-6)", gap: "var(--space-4)" }}
        >
          <div className="flex flex-1 items-center" style={{ gap: "var(--space-4)" }}>
            <Link
              href="/examples"
              aria-label="Back to examples"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-text-secondary transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:bg-surface-sunken hover:text-text-primary md:hidden"
            >
              <ArrowLeft size={18} weight="regular" aria-hidden="true" />
            </Link>
            <h1 className="hidden font-semibold text-text-primary sm:block" style={{ fontSize: "var(--text-lg)" }}>
              Overview
            </h1>
            <div className="max-w-sm flex-1">
              <SearchBar placeholder="Search transactions, merchants..." aria-label="Search dashboard" />
            </div>
          </div>

          <div className="flex items-center" style={{ gap: "var(--space-3)" }}>
            <button
              type="button"
              aria-label="Notifications"
              className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:bg-surface-sunken hover:text-text-primary"
            >
              <Bell size={18} weight="regular" aria-hidden="true" />
            </button>
            <ThemeToggle />
            <Avatar name="Jasper Caparas" size="sm" status="online" />
          </div>
        </header>

        <main className="flex flex-1 flex-col" style={{ padding: "var(--space-6)", gap: "var(--space-6)" }}>
          {/* Stat row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4" style={{ gap: "var(--space-4)" }}>
            <StatCard
              label="Today's volume"
              value={peso.format(172850.55)}
              delta="+8.2%"
              caption="vs. yesterday"
            />
            <StatCard
              label="Transactions"
              value="1,284"
              delta="+3.1%"
              caption="vs. yesterday"
            />
            <StatCard
              label="Success rate"
              value="98.6%"
              delta="+0.4pp"
              caption="last 24 hours"
            />
            <StatCard
              label="Failed transfers"
              value="18"
              delta="-6"
              caption="last 24 hours"
            />
          </div>

          {/* Tabs */}
          <Tabs
            items={[
              { value: "overview", label: "Overview" },
              { value: "transactions", label: "Transactions" },
            ]}
            value={view}
            onValueChange={setView}
            label="Dashboard views"
          />

          {view === "overview" ? (
            <>
              {/* Charts */}
              <div className="grid grid-cols-1 xl:grid-cols-2" style={{ gap: "var(--space-6)" }}>
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold text-text-primary" style={{ fontSize: "var(--text-base)" }}>
                        Transaction volume trend
                      </h2>
                      <p className="text-text-tertiary" style={{ fontSize: "var(--text-sm)" }}>
                        March &ndash; September 2026
                      </p>
                    </div>
                    <span
                      className="flex shrink-0 items-center justify-center bg-accent-subtle text-accent"
                      style={{ width: "var(--space-8)", height: "var(--space-8)", borderRadius: "var(--radius-md)" }}
                      aria-hidden="true"
                    >
                      <ChartLineUp size={18} weight="regular" />
                    </span>
                  </div>
                  <LineChart labels={months} series={volumeByRail} formatValue={pesoCompact} />
                </Card>

                <Card>
                  <div>
                    <h2 className="font-semibold text-text-primary" style={{ fontSize: "var(--text-base)" }}>
                      Volume by rail
                    </h2>
                    <p className="text-text-tertiary" style={{ fontSize: "var(--text-sm)" }}>
                      Monthly comparison across InstaPay, PESONet, and QR Ph
                    </p>
                  </div>
                  <BarChart labels={months} series={volumeByRail} formatValue={pesoCompact} />
                </Card>
              </div>

              {/* Table */}
              <Card padded={false} className="overflow-hidden">
                <div
                  className="flex items-center justify-between border-b border-border-subtle"
                  style={{ padding: "var(--space-4) var(--space-6)" }}
                >
                  <h2 className="font-semibold text-text-primary" style={{ fontSize: "var(--text-base)" }}>
                    Recent transactions
                  </h2>
                  <Link
                    href="/examples/dashboard"
                    className="font-medium text-accent transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:opacity-70"
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    View all
                  </Link>
                </div>
                <div style={{ padding: "0 var(--space-2) var(--space-2)" }}>
                  <Table
                    columns={columns}
                    rows={transactions}
                    getRowKey={(row) => row.id}
                    zebra
                    defaultSort={{ key: "date", direction: "desc" }}
                    caption="Recent transactions across all rails"
                    emptyState="No transactions settled in this cycle yet."
                  />
                </div>
              </Card>
            </>
          ) : (
            <Card padded={false} className="overflow-hidden">
              <div
                className="flex items-center justify-between border-b border-border-subtle"
                style={{ padding: "var(--space-4) var(--space-6)" }}
              >
                <h2 className="font-semibold text-text-primary" style={{ fontSize: "var(--text-base)" }}>
                  All transactions
                </h2>
                <div className="flex items-center" style={{ gap: "var(--space-2)" }}>
                  <MagnifyingGlass size={14} className="text-text-tertiary" aria-hidden="true" />
                  <span className="text-text-tertiary" style={{ fontSize: "var(--text-sm)" }}>
                    {transactions.length} results
                  </span>
                </div>
              </div>
              <div style={{ padding: "0 var(--space-2) var(--space-2)" }}>
                <Table
                  columns={columns}
                  rows={transactions}
                  getRowKey={(row) => row.id}
                  zebra
                  density="compact"
                  defaultSort={{ key: "amount", direction: "desc" }}
                  caption="All transactions across all rails"
                  emptyState="No transactions settled in this cycle yet."
                />
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
