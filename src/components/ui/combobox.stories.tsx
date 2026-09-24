import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Combobox, type ComboboxOption } from "./combobox";

const banks: ComboboxOption[] = [
  { value: "bdo", label: "BDO Unibank" },
  { value: "bpi", label: "Bank of the Philippine Islands" },
  { value: "metrobank", label: "Metrobank" },
  { value: "landbank", label: "Land Bank of the Philippines" },
  { value: "unionbank", label: "UnionBank" },
  { value: "rcbc", label: "RCBC", disabled: true },
  { value: "gcash", label: "GCash (e-wallet)" },
];

const meta: Meta<typeof Combobox> = {
  title: "Components/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  args: {
    label: "Receiving bank",
    options: banks,
    placeholder: "Search for a bank…",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "320px", paddingBottom: "var(--space-24)" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Combobox>;

export const Default: Story = {};

export const WithDefaultValue: Story = {
  args: { defaultValue: "bpi" },
};

export const WithHelperText: Story = {
  args: {
    helperText: "We'll match this against InstaPay's participating bank list.",
  },
};

export const Invalid: Story = {
  args: { invalid: true, helperText: "Select a receiving bank from the list." },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "bdo" },
};

export const Controlled: Story = {
  render: function Controlled(args) {
    const [value, setValue] = useState<string | undefined>("unionbank");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <Combobox {...args} value={value} onValueChange={setValue} />
        <p style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
          Selected: {value ?? "none"}
        </p>
      </div>
    );
  },
};
