import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GlassPanel } from "./glass-panel";

const meta: Meta<typeof GlassPanel> = {
  title: "Components/GlassPanel",
  component: GlassPanel,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: "280px",
          borderRadius: "1rem",
          padding: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, var(--accent-subtle), var(--accent) 140%)",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GlassPanel>;

export const Default: Story = {
  render: (args) => (
    <GlassPanel {...args} style={{ padding: "var(--space-6)", width: "320px" }}>
      <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Frosted panel</p>
      <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
        Backdrop-blurred surface for nav bars, toasts, and anything that
        should float above page content.
      </p>
    </GlassPanel>
  ),
};
