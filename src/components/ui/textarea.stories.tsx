import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Textarea } from "./textarea";

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  args: {
    label: "Dispute notes",
    placeholder: "Describe what happened with this transaction…",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "360px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {};

export const WithHelperText: Story = {
  args: {
    helperText: "Include dates, amounts, and the merchant name if known.",
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    helperText: "Notes are required to file a dispute.",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "This dispute has already been submitted for review.",
  },
};

export const NoResize: Story = {
  args: { resize: "none", rows: 3 },
};

export const TallRows: Story = {
  args: { rows: 8 },
};
