import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Accordion } from "./accordion";

const meta: Meta<typeof Accordion> = {
  title: "Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  argTypes: {
    type: { control: "select", options: ["single", "multiple"] },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const items = [
  {
    value: "instapay",
    trigger: "InstaPay",
    content: "Real-time transfers between participating banks and e-wallets, settled 24/7.",
  },
  {
    value: "pesonet",
    trigger: "PESONet",
    content: "Batch transfers that settle the next banking day, best for larger disbursements.",
  },
  {
    value: "qrph",
    trigger: "QR Ph",
    content: "A shared QR standard for in-person and online payments across participating banks.",
  },
];

function Content({ text }: { text: string }) {
  return (
    <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", paddingTop: "var(--space-2)" }}>
      {text}
    </p>
  );
}

export const Single: Story = {
  args: { type: "single", defaultValue: "instapay" },
  render: (args) => (
    <div style={{ width: "360px" }}>
      <Accordion
        {...args}
        items={items.map((item) => ({ ...item, content: <Content text={item.content} /> }))}
      />
    </div>
  ),
};

export const Multiple: Story = {
  args: { type: "multiple", defaultValue: ["instapay", "qrph"] },
  render: (args) => (
    <div style={{ width: "360px" }}>
      <Accordion
        {...args}
        items={items.map((item) => ({ ...item, content: <Content text={item.content} /> }))}
      />
    </div>
  ),
};
