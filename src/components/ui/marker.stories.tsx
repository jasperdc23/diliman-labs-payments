import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Marker } from "./marker";

const meta: Meta<typeof Marker> = {
  title: "Components/Marker",
  component: Marker,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { label: "Settled" },
};

export default meta;
type Story = StoryObj<typeof Marker>;

export const Tones: Story = {
  render: () => (
    <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
      <Marker tone="success" label="Settled" />
      <Marker tone="warning" label="Pending" />
      <Marker tone="danger" label="Failed" />
      <Marker tone="neutral" label="Offline" />
      <Marker tone="accent" label="In progress" />
    </div>
  ),
};

export const DotOnly: Story = {
  render: () => (
    <div className="flex items-center" style={{ gap: "var(--space-3)" }}>
      <Marker tone="success" />
      <Marker tone="warning" />
      <Marker tone="danger" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
      <Marker size="sm" tone="success" label="Small" />
      <Marker size="md" tone="success" label="Medium" />
    </div>
  ),
};
