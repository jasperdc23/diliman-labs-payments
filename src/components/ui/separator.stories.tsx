import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Separator } from "./separator";

const meta: Meta<typeof Separator> = {
  title: "Components/Separator",
  component: Separator,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", width: "280px" }}>
      <span style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)" }}>InstaPay</span>
      <Separator />
      <span style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)" }}>PESONet</span>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", height: "32px" }}>
      <span style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)" }}>Overview</span>
      <Separator orientation="vertical" />
      <span style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)" }}>Settings</span>
    </div>
  ),
};

export const SemanticBoundary: Story = {
  args: { decorative: false },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", width: "280px" }}>
      <span style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)" }}>Merchant details</span>
      <Separator {...args} />
      <span style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)" }}>Settlement history</span>
    </div>
  ),
};
