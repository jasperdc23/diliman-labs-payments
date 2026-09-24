import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DirectionProvider, useDirection } from "./direction";

const meta: Meta<typeof DirectionProvider> = {
  title: "Components/Direction",
  component: DirectionProvider,
  tags: ["autodocs"],
  argTypes: {
    dir: { control: "select", options: ["ltr", "rtl"] },
  },
  args: { dir: "ltr" },
};

export default meta;
type Story = StoryObj<typeof DirectionProvider>;

function DirectionReport() {
  const dir = useDirection();
  return (
    <p style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)" }}>
      useDirection() reports: <strong>{dir}</strong>
    </p>
  );
}

export const LeftToRight: Story = {
  args: { dir: "ltr" },
  render: (args) => (
    <DirectionProvider {...args}>
      <DirectionReport />
    </DirectionProvider>
  ),
};

export const RightToLeft: Story = {
  args: { dir: "rtl" },
  render: (args) => (
    <DirectionProvider {...args}>
      <DirectionReport />
    </DirectionProvider>
  ),
};
