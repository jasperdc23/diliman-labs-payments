import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Progress } from "./progress";

const meta: Meta<typeof Progress> = {
  title: "Components/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { value: 60 },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Progress value={65} variant="accent" label="Upload progress" />
      <Progress value={90} variant="success" label="KYC verification" />
      <Progress value={70} variant="warning" label="Storage used" />
      <Progress value={15} variant="danger" label="Disputed amount" />
    </div>
  ),
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: "Loading settlement report" },
};
