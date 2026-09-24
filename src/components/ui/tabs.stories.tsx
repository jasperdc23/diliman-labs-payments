import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowsLeftRight, ChartLine, Receipt, Users } from "@phosphor-icons/react/ssr";
import { Tabs } from "./tabs";

const items = [
  {
    value: "overview",
    label: "Overview",
    content: "Settlement totals, payout velocity, and rail mix for the current cycle.",
  },
  {
    value: "transactions",
    label: "Transactions",
    content: "Every InstaPay, PESONet, and QR Ph movement in the selected window.",
  },
  {
    value: "disputes",
    label: "Disputes",
    content: "Chargebacks and reversals awaiting merchant response.",
  },
  {
    value: "archive",
    label: "Archive",
    disabled: true,
    content: "Cycles older than 24 months.",
  },
];

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { items, label: "Settlement views" },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Underline: Story = {
  args: { variant: "underline" },
};

export const Pill: Story = {
  args: { variant: "pill" },
};

export const WithIcons: Story = {
  args: {
    variant: "underline",
    items: [
      { value: "overview", label: "Overview", icon: <ChartLine size={16} />, content: "Cycle totals." },
      {
        value: "transactions",
        label: "Transactions",
        icon: <ArrowsLeftRight size={16} />,
        content: "Rail-level movements.",
      },
      { value: "payouts", label: "Payouts", icon: <Receipt size={16} />, content: "Merchant payouts." },
      { value: "team", label: "Team", icon: <Users size={16} />, content: "Operators with access." },
    ],
  },
};

export const Controlled: Story = {
  render: function ControlledTabs() {
    const [value, setValue] = useState("transactions");
    return (
      <div className="flex flex-col gap-4">
        <Tabs
          items={items}
          value={value}
          onValueChange={setValue}
          variant="pill"
          label="Settlement views"
        />
        <p className="text-sm text-text-tertiary">
          Selected value: <span className="font-mono text-text-primary">{value}</span>
        </p>
      </div>
    );
  },
};

export const Overview: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Tabs items={items} variant="underline" label="Underline tabs" />
      <Tabs items={items} variant="pill" label="Pill tabs" />
    </div>
  ),
};
