import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Switch } from "./switch";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  args: {
    label: "Two-factor authentication",
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Off: Story = {};

export const On: Story = {
  args: { defaultChecked: true },
};

export const WithDescription: Story = {
  args: {
    defaultChecked: true,
    description: "Ask for a one-time code on every new device.",
  },
};

export const Disabled: Story = {
  args: { disabled: true, description: "Locked by your administrator." },
};

export const DisabledOn: Story = {
  args: { disabled: true, defaultChecked: true },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "360px" }}>
      <Switch label="Off" />
      <Switch label="On" defaultChecked />
      <Switch label="With description" description="A second line of supporting copy." />
      <Switch label="Disabled — off" disabled />
      <Switch label="Disabled — on" disabled defaultChecked />
    </div>
  ),
};
