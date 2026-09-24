import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Skeleton } from "./skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Shapes: Story = {
  render: () => (
    <div className="flex flex-col gap-3" style={{ maxWidth: "20rem" }}>
      <Skeleton shape="text" />
      <Skeleton shape="text" width="70%" />
      <Skeleton shape="avatar" />
      <Skeleton shape="card" />
    </div>
  ),
};

export const RowPlaceholder: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Skeleton shape="avatar" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton shape="text" width="40%" />
        <Skeleton shape="text" width="70%" />
      </div>
    </div>
  ),
};
