import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SearchBar } from "./search-bar";

const meta: Meta<typeof SearchBar> = {
  title: "Components/SearchBar",
  component: SearchBar,
  tags: ["autodocs"],
  args: {
    placeholder: "Search transactions",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "360px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: "payout" },
};

export const Loading: Story = {
  args: { defaultValue: "payout", loading: true },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "payout" },
};

export const Controlled: Story = {
  render: function Controlled(args) {
    const [query, setQuery] = useState("");
    const [submitted, setSubmitted] = useState("");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <SearchBar {...args} value={query} onValueChange={setQuery} onSearch={setSubmitted} />
        <p style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
          Typed: {query || "—"} · Submitted: {submitted || "—"}
        </p>
      </div>
    );
  },
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <SearchBar {...args} />
      <SearchBar {...args} defaultValue="payout" />
      <SearchBar {...args} defaultValue="payout" loading />
      <SearchBar {...args} defaultValue="payout" disabled />
    </div>
  ),
};
