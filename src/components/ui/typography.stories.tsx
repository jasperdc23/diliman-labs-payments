import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Heading, Lead, Muted, Text } from "./typography";

const meta: Meta<typeof Heading> = {
  title: "Components/Typography",
  component: Heading,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const Overview: Story = {
  render: () => (
    <div className="flex flex-col" style={{ gap: "var(--space-4)", maxWidth: "40rem" }}>
      <Heading level={1}>Settlement report</Heading>
      <Lead>27 Aug 2026 · 1,284 transfers settled, ₱482,190.40 total.</Lead>
      <Heading level={3}>InstaPay</Heading>
      <Text>₱468,900.00 across 1,190 transfers, all cleared within seconds of initiation.</Text>
      <Muted>Generated 27 Aug 2026, 09:14</Muted>
    </div>
  ),
};

export const HeadingLevels: Story = {
  render: () => (
    <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
      <Heading level={1}>Heading level 1</Heading>
      <Heading level={2}>Heading level 2</Heading>
      <Heading level={3}>Heading level 3</Heading>
      <Heading level={4}>Heading level 4</Heading>
    </div>
  ),
};

export const TextTones: Story = {
  render: () => (
    <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
      <Text tone="primary">Primary tone body copy.</Text>
      <Text tone="secondary">Secondary tone body copy — the default.</Text>
      <Text tone="tertiary">Tertiary tone body copy.</Text>
      <Text size="sm" tone="tertiary">
        Small, tertiary body copy for dense UI.
      </Text>
    </div>
  ),
};
