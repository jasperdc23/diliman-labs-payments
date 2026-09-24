import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Checkbox, CheckboxGroup } from "./checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: {
    label: "Enable transaction alerts",
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const Indeterminate: Story = {
  args: { label: "Select all channels", indeterminate: true },
};

export const WithDescription: Story = {
  args: {
    description: "Send an email whenever a payout clears.",
  },
};

export const Invalid: Story = {
  args: {
    label: "I accept the terms",
    invalid: true,
    description: "You must accept the terms to continue.",
  },
};

export const Disabled: Story = {
  args: { disabled: true, description: "Locked by your administrator." },
};

export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true },
};

export const Group: Story = {
  render: () => (
    <CheckboxGroup legend="Notification channels" helperText="Pick at least one.">
      <Checkbox label="Email" defaultChecked description="Delivered to your work address." />
      <Checkbox label="SMS" />
      <Checkbox label="Push" disabled description="Requires the mobile app." />
    </CheckboxGroup>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "320px" }}>
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="With description" description="A second line of supporting copy." />
      <Checkbox label="Invalid" invalid description="Something needs your attention." />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled + checked" disabled defaultChecked />
    </div>
  ),
};
