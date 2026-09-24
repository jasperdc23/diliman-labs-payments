import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Kbd } from "./kbd";

const meta: Meta<typeof Kbd> = {
  title: "Components/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  args: {
    children: "⌘K",
  },
};

export default meta;
type Story = StoryObj<typeof Kbd>;

export const Default: Story = {};

export const SingleKey: Story = {
  args: { children: "Esc" },
};

export const Shortcut: Story = {
  render: () => (
    <p style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
      Press <Kbd>⌘</Kbd>
      <Kbd>K</Kbd> to search
    </p>
  ),
};
