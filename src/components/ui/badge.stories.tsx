import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowsClockwise, Lightning, ShieldCheck } from "@phosphor-icons/react/ssr";
import { Badge } from "./badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { children: "Settled" },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="neutral">Draft</Badge>
      <Badge variant="accent">InstaPay</Badge>
      <Badge variant="success">Settled</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="danger">Reversed</Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge size="sm" variant="accent">
        PESONet
      </Badge>
      <Badge size="md" variant="accent">
        PESONet
      </Badge>
    </div>
  ),
};

export const WithStatusDot: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="success" dot>
        Payout sent
      </Badge>
      <Badge variant="warning" dot>
        Awaiting clearing
      </Badge>
      <Badge variant="danger" dot>
        Failed
      </Badge>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="accent" size="md" icon={<Lightning size={12} weight="fill" />}>
        Instant transfer
      </Badge>
      <Badge variant="success" size="md" icon={<ShieldCheck size={12} weight="fill" />}>
        KYC verified
      </Badge>
      <Badge variant="neutral" size="md" icon={<ArrowsClockwise size={12} weight="regular" />}>
        Recurring
      </Badge>
    </div>
  ),
};

export const Removable: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="neutral" size="md" onRemove={() => {}}>
        QR Ph
      </Badge>
      <Badge variant="accent" size="md" onRemove={() => {}}>
        Merchant: Bayani Mart
      </Badge>
    </div>
  ),
};

export const Overview: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="success" dot size="md">
          Settled
        </Badge>
        <Badge variant="warning" dot size="md">
          Pending
        </Badge>
        <Badge variant="danger" dot size="md">
          Reversed
        </Badge>
        <Badge variant="accent" size="md" icon={<Lightning size={12} weight="fill" />}>
          InstaPay
        </Badge>
        <Badge variant="neutral" size="md" onRemove={() => {}}>
          Last 30 days
        </Badge>
      </div>
    </div>
  ),
};
