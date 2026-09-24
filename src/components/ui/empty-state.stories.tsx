import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Wallet, MagnifyingGlass, WarningCircle, Receipt } from "@phosphor-icons/react/ssr";
import { EmptyState } from "./empty-state";
import { Card } from "./card";

const meta: Meta<typeof EmptyState> = {
  title: "Components/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Basic: Story = {
  render: () => (
    <Card className="max-w-sm">
      <EmptyState
        icon={<Receipt size={32} weight="regular" />}
        title="No transactions yet"
        description="Transactions will show up here once your first payment settles."
        action={{ label: "Create your first payout" }}
      />
    </Card>
  ),
};

export const FirstUse: Story = {
  name: "First use — no payout methods",
  render: () => (
    <Card className="max-w-sm">
      <EmptyState
        icon={<Wallet size={32} weight="regular" />}
        title="No payout methods added"
        description="Add a bank account or e-wallet to start receiving settlements."
        action={{ label: "Add payout method" }}
        secondaryAction={{ label: "Learn how payouts work" }}
      />
    </Card>
  ),
};

export const NoResults: Story = {
  name: "No results — filtered search",
  render: () => (
    <Card className="max-w-sm">
      <EmptyState
        icon={<MagnifyingGlass size={32} weight="regular" />}
        title={'No results for "InstaPay"'}
        description="Try a different search term, or clear your filters to see all transactions."
        secondaryAction={{ label: "Clear filters" }}
      />
    </Card>
  ),
};

export const FailedToLoad: Story = {
  name: "Error — failed to load",
  render: () => (
    <Card className="max-w-sm">
      <EmptyState
        icon={<WarningCircle size={32} weight="regular" />}
        title="Couldn't load this data"
        description="Something went wrong on our end. Try again, or head back to the dashboard."
        action={{ label: "Retry" }}
        secondaryAction={{ label: "Back to dashboard" }}
      />
    </Card>
  ),
};

export const BareBlock: Story = {
  name: "Bare block (no Card wrapper)",
  render: () => (
    <EmptyState
      icon={<Receipt size={32} weight="regular" />}
      title="No activity yet"
      description="A generic empty state used outside of a card, e.g. inside a page section."
      action={{ label: "Get started" }}
    />
  ),
};
