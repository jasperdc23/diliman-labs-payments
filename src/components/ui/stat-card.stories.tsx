import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Wallet, ArrowsLeftRight, Receipt } from "@phosphor-icons/react/ssr";
import { StatCard } from "./stat-card";

const meta: Meta<typeof StatCard> = {
  title: "Components/StatCard",
  component: StatCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof StatCard>;

export const Balance: Story = {
  render: () => (
    <StatCard
      className="max-w-xs"
      label="Available balance"
      value="₱1,284,930.75"
      delta="+12.4%"
      direction="up"
      caption="vs. last week"
      icon={<Wallet size={18} weight="regular" />}
    />
  ),
};

export const Declining: Story = {
  render: () => (
    <StatCard
      className="max-w-xs"
      label="Refund rate"
      value="2.8%"
      delta="-0.6pp"
      direction="down"
      caption="7-day rolling"
      icon={<Receipt size={18} weight="regular" />}
    />
  ),
};

export const Flat: Story = {
  render: () => (
    <StatCard
      className="max-w-xs"
      label="Settlement lag"
      value="1 day"
      delta="No change"
      direction="flat"
      caption="as of 27 Aug 2026"
    />
  ),
};

export const Row: Story = {
  render: () => (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard
        flat
        label="Volume today"
        value="₱312,450.00"
        delta="+4.1%"
        caption="vs. yesterday"
        icon={<ArrowsLeftRight size={18} weight="regular" />}
      />
      <StatCard flat label="Transactions" value="1,284" delta="+96" caption="vs. yesterday" />
      <StatCard
        flat
        label="Failed transfers"
        value="14"
        delta="+3"
        direction="down"
        caption="InstaPay timeouts"
      />
    </div>
  ),
};
