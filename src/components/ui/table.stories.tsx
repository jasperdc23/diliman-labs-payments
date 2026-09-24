import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Table, type TableColumn } from "./table";
import { Badge } from "./badge";

type Transaction = {
  id: string;
  reference: string;
  merchant: string;
  rail: string;
  amount: number;
  status: "settled" | "pending" | "reversed";
  date: string;
};

const transactions: Transaction[] = [
  {
    id: "1",
    reference: "TXN-8814",
    merchant: "Bayani Mart",
    rail: "InstaPay",
    amount: 12450.5,
    status: "settled",
    date: "27 Aug 2026",
  },
  {
    id: "2",
    reference: "TXN-8815",
    merchant: "Sari Express",
    rail: "PESONet",
    amount: 3200,
    status: "pending",
    date: "27 Aug 2026",
  },
  {
    id: "3",
    reference: "TXN-8816",
    merchant: "Kalye Coffee",
    rail: "QR Ph",
    amount: 780.25,
    status: "settled",
    date: "26 Aug 2026",
  },
  {
    id: "4",
    reference: "TXN-8817",
    merchant: "Luzon Logistics",
    rail: "PESONet",
    amount: 98750,
    status: "reversed",
    date: "26 Aug 2026",
  },
  {
    id: "5",
    reference: "TXN-8818",
    merchant: "Isla Pharmacy",
    rail: "InstaPay",
    amount: 5420.75,
    status: "settled",
    date: "25 Aug 2026",
  },
  {
    id: "6",
    reference: "TXN-8819",
    merchant: "Metro Tech Supply",
    rail: "QR Ph",
    amount: 24100,
    status: "pending",
    date: "25 Aug 2026",
  },
];

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
});

const statusVariant = {
  settled: "success",
  pending: "warning",
  reversed: "danger",
} as const;

const columns: TableColumn<Transaction>[] = [
  { key: "reference", header: "Reference", sortable: true },
  { key: "merchant", header: "Merchant", sortable: true },
  { key: "rail", header: "Rail" },
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

const meta: Meta<typeof Table<Transaction>> = {
  title: "Components/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Table<Transaction>>;

export const Default: Story = {
  render: () => (
    <Table
      columns={columns}
      rows={transactions}
      getRowKey={(row) => row.id}
      caption="Recent transactions"
    />
  ),
};

export const Zebra: Story = {
  render: () => (
    <Table
      columns={columns}
      rows={transactions}
      getRowKey={(row) => row.id}
      zebra
      caption="Recent transactions"
    />
  ),
};

export const Compact: Story = {
  render: () => (
    <Table
      columns={columns}
      rows={transactions}
      getRowKey={(row) => row.id}
      density="compact"
      zebra
      caption="Recent transactions"
    />
  ),
};

export const StickyHeader: Story = {
  render: () => (
    <Table
      columns={columns}
      rows={[...transactions, ...transactions.map((row) => ({ ...row, id: `${row.id}-b` }))]}
      getRowKey={(row) => row.id}
      stickyHeader
      density="compact"
      caption="Recent transactions"
    />
  ),
};

export const PreSorted: Story = {
  render: () => (
    <Table
      columns={columns}
      rows={transactions}
      getRowKey={(row) => row.id}
      defaultSort={{ key: "amount", direction: "desc" }}
      caption="Recent transactions by amount"
    />
  ),
};

export const Empty: Story = {
  render: () => (
    <Table
      columns={columns}
      rows={[]}
      getRowKey={(row) => row.id}
      emptyState="No transactions for this period yet."
      caption="Recent transactions"
    />
  ),
};
