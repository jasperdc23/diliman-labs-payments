import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Collapsible } from "./collapsible";

const meta: Meta<typeof Collapsible> = {
  title: "Components/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
  args: {
    trigger: "Settlement details",
    defaultOpen: false,
  },
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: "320px" }}>
      <Collapsible {...args}>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--text-secondary)",
            paddingTop: "var(--space-3)",
          }}
        >
          Settlement TXN-8817 was reversed on 26 Aug 2026 due to an insufficient balance at the
          receiving institution. Funds were returned to the sender the same day.
        </p>
      </Collapsible>
    </div>
  ),
};

export const OpenByDefault: Story = {
  args: { defaultOpen: true, trigger: "Payout schedule" },
  render: (args) => (
    <div style={{ width: "320px" }}>
      <Collapsible {...args}>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--text-secondary)",
            paddingTop: "var(--space-3)",
          }}
        >
          Payouts run daily at 6:00 PM PHT, batched by rail. InstaPay payouts settle within
          minutes; PESONet payouts settle the next banking day.
        </p>
      </Collapsible>
    </div>
  ),
};
