import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Label } from "./label";

const meta: Meta<typeof Label> = {
  title: "Components/Label",
  component: Label,
  tags: ["autodocs"],
  args: {
    children: "Merchant name",
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {};

export const Required: Story = {
  args: { children: "Settlement account", required: true },
};

export const AssociatedWithControl: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <Label htmlFor="story-merchant-name" required>
        Merchant name
      </Label>
      <input
        id="story-merchant-name"
        style={{
          padding: "var(--space-2) var(--space-3)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-default)",
          font: "inherit",
        }}
      />
    </div>
  ),
};
