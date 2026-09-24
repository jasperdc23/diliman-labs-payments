import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Breadcrumb } from "./breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Transactions", href: "/transactions" },
      { label: "InstaPay #TX-88291" },
    ],
  },
};

export const TwoLevels: Story = {
  args: {
    items: [
      { label: "Dashboard", href: "/" },
      { label: "Settlements" },
    ],
  },
};
