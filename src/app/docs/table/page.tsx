"use client";

import { Table, type TableColumn } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

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

const dataSnippet = `type Transaction = {
  id: string;
  reference: string;
  merchant: string;
  rail: string;
  amount: number;
  status: "settled" | "pending" | "reversed";
  date: string;
};

const transactions: Transaction[] = [
  { id: "1", reference: "TXN-8814", merchant: "Bayani Mart", rail: "InstaPay", amount: 12450.5, status: "settled", date: "27 Aug 2026" },
  { id: "2", reference: "TXN-8815", merchant: "Sari Express", rail: "PESONet", amount: 3200, status: "pending", date: "27 Aug 2026" },
  { id: "3", reference: "TXN-8816", merchant: "Kalye Coffee", rail: "QR Ph", amount: 780.25, status: "settled", date: "26 Aug 2026" },
];

const peso = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", minimumFractionDigits: 2 });

const columns: TableColumn<Transaction>[] = [
  { key: "reference", header: "Reference", sortable: true },
  { key: "merchant", header: "Merchant", sortable: true },
  { key: "rail", header: "Rail" },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => <Badge variant="success" dot>{row.status}</Badge>,
  },
  { key: "date", header: "Date", sortable: true },
  { key: "amount", header: "Amount", align: "right", sortable: true, render: (row) => peso.format(row.amount) },
];`;

export default function TableDocs() {
  return (
    <DocPage
      title="Table"
      description="A generic data table for transaction ledgers, payout runs, and settlement reports. Columns are described as data, so sorting, alignment, and custom cells all come from one array rather than hand-written markup."
    >
      <DocSection
        title="Basic usage"
        description="Table is generic over the row type: type the columns array and every render and sortValue callback is typed for you. getRowKey is required because the component reorders rows when sorting, and index keys would scramble React's reconciliation."
      >
        <Example
          layout="stacked"
          code={`${dataSnippet}

<Table
  columns={columns}
  rows={transactions}
  getRowKey={(row) => row.id}
  caption="Recent transactions"
/>`}
        >
          <Table
            columns={columns}
            rows={transactions}
            getRowKey={(row) => row.id}
            caption="Recent transactions"
          />
        </Example>
      </DocSection>

      <DocSection
        title="Sorting"
        description="Mark a column sortable and its header becomes a button that cycles ascending, descending, then back to the original row order. Sorting is client-side and lives inside the component, so there is nothing to wire up for a page of already-loaded rows. Numbers compare numerically; everything else uses a numeric-aware locale compare."
      >
        <Example
          layout="stacked"
          code={`<Table
  columns={columns}
  rows={transactions}
  getRowKey={(row) => row.id}
  defaultSort={{ key: "amount", direction: "desc" }}
  caption="Recent transactions by amount"
/>`}
        >
          <Table
            columns={columns}
            rows={transactions}
            getRowKey={(row) => row.id}
            defaultSort={{ key: "amount", direction: "desc" }}
            caption="Recent transactions by amount"
          />
        </Example>
        <Note>
          A column with a <code>render</code> function sorts on the raw row value under its{" "}
          <code>key</code>, not on the rendered output. When those differ — a formatted date, a
          status pill, a computed total — give the column a <code>sortValue</code> so the order
          matches what people see. For server-paginated tables, sort upstream and leave{" "}
          <code>sortable</code> off; the built-in sort only knows about the rows you handed it.
        </Note>
      </DocSection>

      <DocSection
        title="Density and zebra striping"
        description="Comfortable is the default. Compact tightens row padding for dense reconciliation screens where scanning fifty rows matters more than breathing room. Zebra striping helps the eye track across a wide row; skip it on narrow tables where it just adds noise."
      >
        <Example
          layout="stacked"
          code={`<Table
  columns={columns}
  rows={transactions}
  getRowKey={(row) => row.id}
  density="compact"
  zebra
  caption="Recent transactions"
/>`}
        >
          <Table
            columns={columns}
            rows={transactions}
            getRowKey={(row) => row.id}
            density="compact"
            zebra
            caption="Recent transactions"
          />
        </Example>
      </DocSection>

      <DocSection
        title="Sticky header"
        description="Caps the table at a fixed height and pins the header row while the body scrolls, so column meaning survives a long ledger."
      >
        <Example
          layout="stacked"
          code={`<Table
  columns={columns}
  rows={transactions}
  getRowKey={(row) => row.id}
  stickyHeader
  density="compact"
  caption="Recent transactions"
/>`}
        >
          <Table
            columns={columns}
            rows={[
              ...transactions,
              ...transactions.map((row) => ({ ...row, id: `${row.id}-b` })),
              ...transactions.map((row) => ({ ...row, id: `${row.id}-c` })),
            ]}
            getRowKey={(row) => row.id}
            stickyHeader
            density="compact"
            caption="Recent transactions"
          />
        </Example>
      </DocSection>

      <DocSection
        title="Alignment and numbers"
        description="Right-aligned columns also switch to tabular figures, which is what makes a column of peso amounts line up on the decimal. Use align=&quot;right&quot; for every money and count column."
      >
        <Example
          layout="stacked"
          code={`const columns: TableColumn<Transaction>[] = [
  { key: "merchant", header: "Merchant" },
  { key: "amount", header: "Amount", align: "right", render: (row) => peso.format(row.amount) },
];`}
        >
          <Table
            columns={[
              { key: "merchant", header: "Merchant" },
              {
                key: "amount",
                header: "Amount",
                align: "right",
                render: (row: Transaction) => peso.format(row.amount),
              },
            ]}
            rows={transactions}
            getRowKey={(row) => row.id}
            caption="Amounts by merchant"
          />
        </Example>
      </DocSection>

      <DocSection
        title="Empty state"
        description="Say what is missing and why, in the language of the screen. The default copy is deliberately bland because a real one should be specific."
      >
        <Example
          layout="stacked"
          code={`<Table
  columns={columns}
  rows={[]}
  getRowKey={(row) => row.id}
  emptyState="No transactions settled in this cycle yet."
  caption="Recent transactions"
/>`}
        >
          <Table
            columns={columns}
            rows={[]}
            getRowKey={(row) => row.id}
            emptyState="No transactions settled in this cycle yet."
            caption="Recent transactions"
          />
        </Example>
      </DocSection>

      <DocSection title="Accessibility">
        <Note>
          The sorted column carries <code>aria-sort</code>, so screen readers announce the direction
          rather than leaving it to the caret icon. Always pass a <code>caption</code>: it renders
          visually hidden and gives the table a name in the accessibility tree. Headers are real{" "}
          <code>th</code> elements with <code>scope=&quot;col&quot;</code>, and the sort control is a
          real button, so it is reachable by keyboard without any extra wiring.
        </Note>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "columns",
              type: "TableColumn<T>[]",
              description:
                "Column definitions. Each has key, header, and optionally align, sortable, width, render, and sortValue.",
            },
            {
              name: "rows",
              type: "T[]",
              description: "The data. Rows render in this order unless a sort is active.",
            },
            {
              name: "getRowKey",
              type: "(row: T, index: number) => string",
              description: "Stable React key per row. Required, because sorting reorders rows.",
            },
            {
              name: "caption",
              type: "string",
              description: "Visually hidden caption that names the table for assistive tech.",
            },
            {
              name: "density",
              type: `"compact" | "comfortable"`,
              defaultValue: `"comfortable"`,
              description: "Row padding and font size.",
            },
            {
              name: "zebra",
              type: "boolean",
              defaultValue: "false",
              description: "Alternating row backgrounds.",
            },
            {
              name: "stickyHeader",
              type: "boolean",
              defaultValue: "false",
              description: "Pins the header and caps the wrapper at 24rem of scrollable height.",
            },
            {
              name: "emptyState",
              type: "ReactNode",
              defaultValue: `"No records to show."`,
              description: "Rendered across the full width when rows is empty.",
            },
            {
              name: "defaultSort",
              type: `{ key: string; direction: "asc" | "desc" }`,
              description:
                "Initial sort. Uncontrolled after mount — the user can clear it by cycling past descending.",
            },
            {
              name: "className",
              type: "string",
              description: "Appended to the scroll wrapper, not the table element.",
            },
          ]}
        />
      </DocSection>

      <DocSection title="TableColumn<T>">
        <PropsTable
          rows={[
            {
              name: "key",
              type: "string",
              description:
                "Identifies the column and, with no render, reads the matching field off the row.",
            },
            { name: "header", type: "ReactNode", description: "Header cell content." },
            {
              name: "align",
              type: `"left" | "center" | "right"`,
              defaultValue: `"left"`,
              description: "Right also switches the cells to tabular figures.",
            },
            {
              name: "sortable",
              type: "boolean",
              defaultValue: "false",
              description: "Turns the header into a three-state sort button.",
            },
            {
              name: "render",
              type: "(row: T) => ReactNode",
              description: "Custom cell content — badges, links, formatted currency.",
            },
            {
              name: "sortValue",
              type: "(row: T) => string | number",
              description:
                "Value to sort on when the raw field would sort wrong, such as a formatted date.",
            },
            {
              name: "width",
              type: "string",
              description: "CSS width applied to the header cell, e.g. \"12rem\".",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
