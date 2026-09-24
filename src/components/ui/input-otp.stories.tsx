import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InputOTP } from "./input-otp";

const meta: Meta<typeof InputOTP> = {
  title: "Components/InputOTP",
  component: InputOTP,
  tags: ["autodocs"],
  args: {
    label: "Verification code",
    helperText: "Sent by SMS to +63 917 •••  ••34.",
  },
};

export default meta;
type Story = StoryObj<typeof InputOTP>;

export const Default: Story = {};

export const FourDigits: Story = {
  args: { length: 4, helperText: "Enter the 4-digit code from your banking app." },
};

export const Invalid: Story = {
  args: { invalid: true, helperText: "That code is incorrect or has expired." },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "123" },
};

export const Controlled: Story = {
  render: function Controlled(args) {
    const [value, setValue] = useState("");
    const [complete, setComplete] = useState(false);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <InputOTP
          {...args}
          value={value}
          onValueChange={setValue}
          onComplete={() => setComplete(true)}
        />
        <p style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
          Value: {value || "(empty)"} {complete && "— complete"}
        </p>
      </div>
    );
  },
};
