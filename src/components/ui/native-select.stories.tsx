import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NativeSelect, type NativeSelectOption } from "./native-select";

const rails: NativeSelectOption[] = [
  { value: "instapay", label: "InstaPay" },
  { value: "pesonet", label: "PESONet" },
  { value: "qrph", label: "QR Ph" },
  { value: "swift", label: "SWIFT", disabled: true },
  { value: "cash", label: "Over the counter" },
];

const meta: Meta<typeof NativeSelect> = {
  title: "Components/NativeSelect",
  component: NativeSelect,
  tags: ["autodocs"],
  args: {
    label: "Settlement rail",
    options: rails,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "280px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NativeSelect>;

export const Default: Story = {};

export const WithPlaceholder: Story = {
  args: { placeholder: "Choose a rail" },
};

export const WithDefaultValue: Story = {
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
