import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ContextMenu } from "./context-menu";

const meta: Meta<typeof ContextMenu> = {
  title: "Components/Context Menu",
  component: ContextMenu,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof ContextMenu>;

export const Default: Story = {
  render: () => (
    <ContextMenu
      items={[
        { label: "Copy reference no." },
        { label: "Resend receipt" },
        { type: "separator" },
        { label: "Flag transaction", destructive: true },
      ]}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "280px",
          height: "140px",
          border: "1px dashed var(--border-strong)",
          borderRadius: "var(--radius-lg)",
          color: "var(--text-tertiary)",
          fontSize: "var(--text-sm)",
        }}
      >
        Right-click this transaction row
      </div>
    </ContextMenu>
  ),
};
