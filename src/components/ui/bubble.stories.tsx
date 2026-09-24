import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bubble } from "./bubble";

const meta: Meta<typeof Bubble> = {
  title: "Components/Bubble",
  component: Bubble,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Bubble>;

export const SentAndReceived: Story = {
  render: () => (
    <div className="flex flex-col items-stretch" style={{ gap: "var(--space-2)", width: "20rem" }}>
      <div className="flex justify-start">
        <Bubble variant="received">Hi, I noticed my InstaPay transfer hasn&apos;t landed yet.</Bubble>
      </div>
      <div className="flex justify-end">
        <Bubble variant="sent">Checking that now — can you share the reference number?</Bubble>
      </div>
    </div>
  ),
};
