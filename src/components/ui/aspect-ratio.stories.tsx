import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AspectRatio } from "./aspect-ratio";

const meta: Meta<typeof AspectRatio> = {
  title: "Components/AspectRatio",
  component: AspectRatio,
  tags: ["autodocs"],
  argTypes: {
    ratio: { control: "select", options: ["square", "4:3", "16:9"] },
  },
  args: { ratio: "16:9" },
};

export default meta;
type Story = StoryObj<typeof AspectRatio>;

function Filled() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-subtle)",
        background:
          "repeating-linear-gradient(135deg, var(--gray-200) 0 10px, var(--surface-sunken) 10px 20px)",
      }}
    />
  );
}

export const Square: Story = {
  args: { ratio: "square" },
  render: (args) => (
    <div style={{ width: "220px" }}>
      <AspectRatio {...args}>
        <Filled />
      </AspectRatio>
    </div>
  ),
};

export const FourThree: Story = {
  args: { ratio: "4:3" },
  render: (args) => (
    <div style={{ width: "280px" }}>
      <AspectRatio {...args}>
        <Filled />
      </AspectRatio>
    </div>
  ),
};

export const Widescreen: Story = {
  args: { ratio: "16:9" },
  render: (args) => (
    <div style={{ width: "360px" }}>
      <AspectRatio {...args}>
        <Filled />
      </AspectRatio>
    </div>
  ),
};

export const CustomRatio: Story = {
  args: { ratio: "21 / 9" },
  render: (args) => (
    <div style={{ width: "360px" }}>
      <AspectRatio {...args}>
        <Filled />
      </AspectRatio>
    </div>
  ),
};
