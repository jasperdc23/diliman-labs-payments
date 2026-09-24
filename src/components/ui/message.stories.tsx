import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Message } from "./message";

const meta: Meta<typeof Message> = {
  title: "Components/Message",
  component: Message,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Message>;

export const Thread: Story = {
  render: () => (
    <div className="flex flex-col" style={{ gap: "var(--space-4)", width: "26rem" }}>
      <Message sender="Bea Santos" timestamp="09:14">
        Hi, my InstaPay transfer of ₱5,000.00 to Landbank hasn&apos;t landed yet — sent it about an
        hour ago.
      </Message>
      <Message sender="You" timestamp="09:16" variant="sent">
        Checking that now — could you share the reference number from the confirmation screen?
      </Message>
      <Message sender="Bea Santos" timestamp="09:17">
        Sure, it&apos;s EPL-004821.
      </Message>
    </div>
  ),
};
