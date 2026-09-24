import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";
import { Popover } from "./popover";

const meta: Meta<typeof Popover> = {
  title: "Components/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ paddingBottom: "var(--space-24)" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover trigger={<Button variant="secondary">Filter by rail</Button>}>
      <div className="flex flex-col" style={{ gap: "var(--space-2)", width: "220px" }}>
        <p className="text-text-primary" style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>
          Settlement rail
        </p>
        <p className="text-text-secondary" style={{ fontSize: "var(--text-sm)" }}>
          Any content can go here — this is the raw primitive Select and DatePicker are built on.
        </p>
      </div>
    </Popover>
  ),
};

export const AlignEnd: Story = {
  render: () => (
    <div className="flex justify-end">
      <Popover align="end" trigger={<Button variant="secondary">Options</Button>}>
        <p style={{ fontSize: "var(--text-sm)", width: "180px" }}>
          Panel edge aligns with the trigger&apos;s right edge instead of its left.
        </p>
      </Popover>
    </div>
  ),
};
