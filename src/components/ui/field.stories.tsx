import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./input";
import { Field } from "./field";

const meta: Meta<typeof Field> = {
  title: "Components/Field",
  component: Field,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {
  render: () => (
    <Field label="Merchant name" description="As it appears on the settlement report.">
      <Input placeholder="Juan's Sari-Sari Store" />
    </Field>
  ),
};

export const Required: Story = {
  render: () => (
    <Field label="Settlement account" required>
      <Input placeholder="0123456789" />
    </Field>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Field label="Amount" error="Enter an amount greater than ₱0.00.">
      <Input defaultValue="0" />
    </Field>
  ),
};
