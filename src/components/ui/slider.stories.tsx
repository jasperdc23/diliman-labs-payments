import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Slider } from "./slider";

const meta: Meta<typeof Slider> = {
  title: "Components/Slider",
  component: Slider,
  tags: ["autodocs"],
  args: {
    label: "Monthly transfer limit",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "320px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: { defaultValue: 50 },
};

export const WithValueReadout: Story = {
  args: {
    showValue: true,
    min: 0,
    max: 200000,
    step: 5000,
    defaultValue: 50000,
    formatValue: (v) => `₱${v.toLocaleString("en-PH")}`,
  },
};

export const WithHelperText: Story = {
  args: {
    showValue: true,
    defaultValue: 70,
    helperText: "Applies to outgoing InstaPay transfers only.",
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 30, showValue: true },
};

export const SteppedRange: Story = {
  args: { min: 1, max: 10, step: 1, defaultValue: 3, showValue: true },
};
