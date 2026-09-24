import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Alert } from "./alert";

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    title: "Payout details incomplete",
    description: "Add a destination account before sending this payout.",
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Alert variant="info" title="Maintenance window" description="InstaPay will be briefly unavailable 27 Aug 2026, 12:00–12:30 AM." />
      <Alert variant="success" title="Payout sent" description="₱48,900.50 was sent over PESONet." />
      <Alert variant="warning" title="Verification pending" description="KYC review can take up to one banking day." />
      <Alert variant="danger" title="Payout failed" description="BDO Unibank declined the transfer. Try a different account." />
    </div>
  ),
};

export const Dismissible: Story = {
  args: {
    variant: "danger",
    title: "Payout failed",
    description: "BDO Unibank declined the transfer. Try a different account.",
    onDismiss: () => {},
  },
};

export const WithoutDescription: Story = {
  args: {
    variant: "neutral",
    title: "No pending settlements",
    description: undefined,
  },
};
