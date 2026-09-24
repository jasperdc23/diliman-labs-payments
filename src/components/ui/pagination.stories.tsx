import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Pagination } from "./pagination";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

function ControlledDemo({ totalPages }: { totalPages: number }) {
  const [page, setPage] = useState(6);
  return <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />;
}

export const ManyPages: Story = {
  render: () => <ControlledDemo totalPages={42} />,
};

export const FewPages: Story = {
  render: () => <ControlledDemo totalPages={4} />,
};
