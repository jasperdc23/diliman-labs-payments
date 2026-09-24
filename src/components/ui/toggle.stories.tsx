import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Star } from "@phosphor-icons/react/ssr";
import { Toggle } from "./toggle";

const meta: Meta<typeof Toggle> = {
  title: "Components/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  args: {
    children: "Bold",
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {};

export const Pressed: Story = {
  args: { defaultPressed: true },
};

export const IconOnly: Story = {
  args: {
    children: undefined,
    "aria-label": "Favorite",
    iconLeft: <Star size={16} />,
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
      <Toggle size="sm">Small</Toggle>
      <Toggle size="md">Medium</Toggle>
      <Toggle size="lg">Large</Toggle>
    </div>
  ),
};
