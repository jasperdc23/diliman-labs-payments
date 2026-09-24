import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    label: "Email address",
    placeholder: "you@example.com",
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const WithHelperText: Story = {
  args: { helperText: "We'll never share your email." },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    defaultValue: "not-an-email",
    helperText: "Enter a valid email address.",
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "locked@example.com" },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "320px" }}>
      <div>
        <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginBottom: "0.5rem" }}>
          Default
        </p>
        <Input label="Email address" placeholder="you@example.com" />
      </div>
      <div>
        <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginBottom: "0.5rem" }}>
          Hover (simulated)
        </p>
        <Input
          label="Email address"
          placeholder="you@example.com"
          style={{ borderColor: "var(--border-strong)" }}
        />
      </div>
      <div>
        <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginBottom: "0.5rem" }}>
          Focused — tab to the real field above to see it live
        </p>
        <Input
          label="Email address"
          placeholder="you@example.com"
          style={{
            borderColor: "var(--accent)",
            boxShadow: "0 0 0 2px color-mix(in srgb, var(--focus-ring-color) 30%, transparent)",
          }}
        />
      </div>
      <div>
        <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginBottom: "0.5rem" }}>
          Invalid
        </p>
        <Input
          label="Email address"
          invalid
          defaultValue="not-an-email"
          helperText="Enter a valid email address."
        />
      </div>
      <div>
        <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginBottom: "0.5rem" }}>
          Disabled
        </p>
        <Input label="Email address" disabled defaultValue="locked@example.com" />
      </div>
    </div>
  ),
};
