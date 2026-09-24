import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MagnifyingGlass, Eye, EyeSlash } from "@phosphor-icons/react/ssr";
import { InputGroup } from "./input-group";
import { Button } from "./button";

const meta: Meta<typeof InputGroup> = {
  title: "Components/InputGroup",
  component: InputGroup,
  tags: ["autodocs"],
  args: {
    label: "Amount",
    placeholder: "0.00",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "320px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof InputGroup>;

export const CurrencyPrefix: Story = {
  args: { leading: "₱" },
};

export const UnitSuffix: Story = {
  args: { label: "Transfer amount", leading: "₱", trailing: "PHP" },
};

export const WithIcon: Story = {
  args: {
    label: "Search transactions",
    leading: <MagnifyingGlass size={16} />,
    placeholder: "Reference number or merchant",
  },
};

export const AttachedButton: Story = {
  args: {
    label: "Referral code",
    trailing: (
      <Button size="sm" variant="ghost">
        Paste
      </Button>
    ),
  },
};

export const PasswordToggle: Story = {
  render: function PasswordToggle(args) {
    const [visible, setVisible] = useState(false);
    return (
      <InputGroup
        {...args}
        label="PIN"
        type={visible ? "text" : "password"}
        trailing={
          <Button
            size="sm"
            variant="ghost"
            iconOnly
            aria-label={visible ? "Hide PIN" : "Show PIN"}
            iconLeft={visible ? <EyeSlash size={16} /> : <Eye size={16} />}
            onClick={() => setVisible((v) => !v)}
          />
        }
      />
    );
  },
};

export const Invalid: Story = {
  args: {
    leading: "₱",
    invalid: true,
    helperText: "Enter an amount greater than ₱0.",
  },
};

export const Disabled: Story = {
  args: { leading: "₱", disabled: true, defaultValue: "500.00" },
};
