import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HoverCard } from "./hover-card";
import { Avatar } from "./avatar";

const meta: Meta<typeof HoverCard> = {
  title: "Components/Hover Card",
  component: HoverCard,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ padding: "var(--space-12)" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
  render: () => (
    <HoverCard
      trigger={
        <a href="#" style={{ color: "var(--text-primary)", fontWeight: 500, textDecoration: "underline" }}>
          Tindahan ni Aling Rosa
        </a>
      }
    >
      <div className="flex flex-col" style={{ gap: "var(--space-3)", width: "260px" }}>
        <div className="flex items-center" style={{ gap: "var(--space-3)" }}>
          <Avatar name="Tindahan ni Aling Rosa" size="sm" />
          <div>
            <p className="text-text-primary" style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>
              Tindahan ni Aling Rosa
            </p>
            <p className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
              Merchant since Mar 2024
            </p>
          </div>
        </div>
        <div className="flex justify-between border-t border-border-subtle" style={{ paddingTop: "var(--space-2)", fontSize: "var(--text-sm)" }}>
          <span className="text-text-secondary">Last 30 days</span>
          <span className="text-text-primary" style={{ fontWeight: 600 }}>
            ₱184,200.00
          </span>
        </div>
      </div>
    </HoverCard>
  ),
};
