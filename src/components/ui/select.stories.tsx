import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Select, type SelectOption } from "./select";

const options: SelectOption[] = [
  { value: "instapay", label: "InstaPay" },
  { value: "pesonet", label: "PESONet" },
  { value: "qrph", label: "QR Ph" },
  { value: "swift", label: "SWIFT", disabled: true },
  { value: "cash", label: "Over the counter" },
];

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  args: {
    label: "Settlement rail",
    options,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "280px", paddingBottom: "var(--space-24)" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {};

export const WithPlaceholder: Story = {
  args: { placeholder: "Choose a rail" },
};

export const WithSelection: Story = {
  args: { defaultValue: "pesonet" },
};

export const WithHelperText: Story = {
  args: {
    defaultValue: "instapay",
    helperText: "Real-time rails settle within seconds.",
  },
};

export const Invalid: Story = {
  args: { invalid: true, helperText: "Pick a settlement rail." },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "instapay" },
};

export const Controlled: Story = {
  render: function Controlled(args) {
    const [value, setValue] = useState("qrph");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <Select {...args} value={value} onValueChange={setValue} />
        <p style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
          Selected: {value}
        </p>
      </div>
    );
  },
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <Select {...args} label="Placeholder" />
      <Select {...args} label="Selected" defaultValue="pesonet" />
      <Select {...args} label="Invalid" invalid helperText="Pick a settlement rail." />
      <Select {...args} label="Disabled" disabled defaultValue="instapay" />
    </div>
  ),
};
