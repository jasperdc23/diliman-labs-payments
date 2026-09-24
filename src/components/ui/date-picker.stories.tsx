import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DatePicker, formatDate } from "./date-picker";

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  args: {
    label: "Settlement date",
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
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: new Date(2026, 7, 27) },
};

export const WithHelperText: Story = {
  args: {
    defaultValue: new Date(2026, 7, 27),
    helperText: "Cut-off is 5:00 PM on the selected day.",
  },
};

export const WithRange: Story = {
  args: {
    defaultValue: new Date(2026, 7, 27),
    minDate: new Date(2026, 7, 10),
    maxDate: new Date(2026, 8, 10),
    helperText: "Days outside 10 Aug 2026 – 10 Sep 2026 are unavailable.",
  },
};

export const Invalid: Story = {
  args: { invalid: true, helperText: "Select a settlement date." },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: new Date(2026, 7, 27) },
};

export const Controlled: Story = {
  render: function Controlled(args) {
    const [date, setDate] = useState<Date | null>(new Date(2026, 7, 27));
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <DatePicker {...args} value={date} onValueChange={setDate} />
        <p style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
          Selected: {date ? formatDate(date) : "—"}
        </p>
      </div>
    );
  },
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <DatePicker {...args} label="Empty" />
      <DatePicker {...args} label="With value" defaultValue={new Date(2026, 7, 27)} />
      <DatePicker {...args} label="Invalid" invalid helperText="Select a settlement date." />
      <DatePicker {...args} label="Disabled" disabled defaultValue={new Date(2026, 7, 27)} />
    </div>
  ),
};
