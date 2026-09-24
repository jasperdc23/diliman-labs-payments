import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Calendar } from "./calendar";

const meta: Meta<typeof Calendar> = {
  title: "Components/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  render: () => <Calendar />,
};

export const NoPastDates: Story = {
  render: () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return <Calendar disabled={(date) => date < today} />;
  },
};

export const WithSelection: Story = {
  render: () => <Calendar defaultValue={new Date(2026, 7, 27)} />,
};
