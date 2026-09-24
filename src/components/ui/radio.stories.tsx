import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Radio, RadioGroup } from "./radio";

const meta: Meta<typeof RadioGroup> = {
  title: "Components/Radio",
  component: RadioGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => (
    <RadioGroup legend="Settlement rail" defaultValue="instapay">
      <Radio value="instapay" label="InstaPay" />
      <Radio value="pesonet" label="PESONet" />
      <Radio value="qrph" label="QR Ph" />
    </RadioGroup>
  ),
};

export const WithDescriptions: Story = {
  render: () => (
    <RadioGroup legend="Settlement rail" defaultValue="instapay">
      <Radio value="instapay" label="InstaPay" description="Real time, up to ₱50,000 per transfer." />
      <Radio value="pesonet" label="PESONet" description="Batched, credited same banking day." />
      <Radio value="qrph" label="QR Ph" description="Scan to pay at the point of sale." />
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup legend="Statement period" defaultValue="monthly" orientation="horizontal">
      <Radio value="daily" label="Daily" />
      <Radio value="weekly" label="Weekly" />
      <Radio value="monthly" label="Monthly" />
    </RadioGroup>
  ),
};

export const Controlled: Story = {
  render: function Controlled() {
    const [rail, setRail] = useState("pesonet");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <RadioGroup legend="Settlement rail" value={rail} onValueChange={setRail}>
          <Radio value="instapay" label="InstaPay" />
          <Radio value="pesonet" label="PESONet" />
          <Radio value="qrph" label="QR Ph" />
        </RadioGroup>
        <p style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
          Selected: {rail}
        </p>
      </div>
    );
  },
};

export const Invalid: Story = {
  render: () => (
    <RadioGroup legend="Settlement rail" invalid helperText="Choose a rail before continuing.">
      <Radio value="instapay" label="InstaPay" />
      <Radio value="pesonet" label="PESONet" />
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup legend="Settlement rail" defaultValue="instapay" disabled>
      <Radio value="instapay" label="InstaPay" />
      <Radio value="pesonet" label="PESONet" />
    </RadioGroup>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", maxWidth: "360px" }}>
      <RadioGroup legend="Default" defaultValue="a">
        <Radio value="a" label="Selected" />
        <Radio value="b" label="Unselected" />
        <Radio value="c" label="With description" description="Supporting copy on a second line." />
      </RadioGroup>
      <RadioGroup legend="Invalid" invalid helperText="Pick one to continue.">
        <Radio value="a" label="Unselected" />
        <Radio value="b" label="Selected" defaultChecked />
      </RadioGroup>
      <RadioGroup legend="Disabled" defaultValue="a" disabled>
        <Radio value="a" label="Selected" />
        <Radio value="b" label="Unselected" />
      </RadioGroup>
    </div>
  ),
};
