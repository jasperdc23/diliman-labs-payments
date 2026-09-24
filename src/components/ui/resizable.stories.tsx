import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Resizable } from "./resizable";

const meta: Meta<typeof Resizable> = {
  title: "Components/Resizable",
  component: Resizable,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
};

export default meta;
type Story = StoryObj<typeof Resizable>;

function Pane({ label }: { label: string }) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "var(--text-sm)",
        color: "var(--text-secondary)",
        background: "var(--surface-sunken)",
      }}
    >
      {label}
    </div>
  );
}

export const Horizontal: Story = {
  args: { orientation: "horizontal", defaultSize: 40, minSize: 20, maxSize: 80, firstPaneLabel: "Transaction list" },
  render: (args) => (
    <div style={{ height: "220px", width: "480px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
      <Resizable {...args}>
        <Pane label="Transaction list" />
        <Pane label="Details" />
      </Resizable>
    </div>
  ),
};

export const Vertical: Story = {
  args: { orientation: "vertical", defaultSize: 60, minSize: 20, maxSize: 80, firstPaneLabel: "Chart" },
  render: (args) => (
    <div style={{ height: "300px", width: "380px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
      <Resizable {...args}>
        <Pane label="Chart" />
        <Pane label="Legend" />
      </Resizable>
    </div>
  ),
};
