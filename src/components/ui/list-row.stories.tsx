import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ReactNode } from "react";
import { ArrowDownLeft, ArrowUpRight, CaretRight, QrCode } from "@phosphor-icons/react/ssr";
import { List, ListRow } from "./list-row";
import { Card } from "./card";

const meta: Meta<typeof ListRow> = {
  title: "Components/ListRow",
  component: ListRow,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ListRow>;

function IconBadge({ tone, children }: { tone: "in" | "out"; children: ReactNode }) {
  return (
    <span
      className={`flex items-center justify-center ${
        tone === "in" ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"
      }`}
      style={{ width: "var(--space-8)", height: "var(--space-8)", borderRadius: "var(--radius-md)" }}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

const amount = (value: string) => (
  <span className="font-medium tabular-nums text-text-primary">{value}</span>
);

export const Transactions: Story = {
  render: () => (
    <Card flat padded={false} className="max-w-md overflow-hidden">
      <List>
        <ListRow
          leading={
            <IconBadge tone="in">
              <ArrowDownLeft size={16} weight="regular" />
            </IconBadge>
          }
          title="InstaPay from BPI ••4821"
          subtitle="27 Aug 2026 · 09:14"
          trailing={amount("+₱12,400.00")}
          onClick={() => {}}
        />
        <ListRow
          leading={
            <IconBadge tone="out">
              <ArrowUpRight size={16} weight="regular" />
            </IconBadge>
          }
          title="PESONet payout to Landbank ••7730"
          subtitle="26 Aug 2026 · 17:02"
          trailing={amount("-₱48,900.50")}
          onClick={() => {}}
        />
        <ListRow
          leading={
            <IconBadge tone="in">
              <QrCode size={16} weight="regular" />
            </IconBadge>
          }
          title="QR Ph collection · Store 12"
          subtitle="26 Aug 2026 · 11:48"
          trailing={amount("+₱1,234.56")}
          onClick={() => {}}
        />
      </List>
    </Card>
  ),
};

export const Navigation: Story = {
  render: () => (
    <Card flat padded={false} className="max-w-md overflow-hidden">
      <List>
        <ListRow
          href="#settlement"
          title="Settlement account"
          subtitle="Landbank ••7730"
          trailing={<CaretRight size={16} weight="regular" aria-hidden="true" />}
        />
        <ListRow
          href="#limits"
          title="Transfer limits"
          subtitle="₱500,000.00 daily"
          trailing={<CaretRight size={16} weight="regular" aria-hidden="true" />}
        />
        <ListRow
          title="Merchant category"
          subtitle="Food and beverage"
          trailing={
            <span className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
              Locked
            </span>
          }
          disabled
        />
      </List>
    </Card>
  ),
};
