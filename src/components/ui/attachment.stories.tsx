import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Attachment } from "./attachment";

const meta: Meta<typeof Attachment> = {
  title: "Components/Attachment",
  component: Attachment,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Attachment>;

export const Default: Story = {
  args: { filename: "instapay-receipt-27aug2026.pdf", size: 253952 },
};

export const FileTypes: Story = {
  render: () => (
    <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
      <Attachment filename="proof-of-payment.pdf" size={253952} />
      <Attachment filename="receipt-photo.jpg" size={1887436} />
      <Attachment filename="transaction-log.csv" size={40960} />
      <Attachment filename="dispute-summary.docx" size={81920} />
    </div>
  ),
};

export const Removable: Story = {
  args: { filename: "instapay-receipt-27aug2026.pdf", size: 253952, onRemove: () => {} },
};
