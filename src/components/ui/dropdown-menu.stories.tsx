import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowsClockwise, PencilSimple, Trash } from "@phosphor-icons/react/ssr";
import { Button } from "./button";
import { DropdownMenu } from "./dropdown-menu";

const meta: Meta<typeof DropdownMenu> = {
  title: "Components/Dropdown Menu",
  component: DropdownMenu,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ paddingBottom: "var(--space-24)" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  render: () => (
    <DropdownMenu
      trigger={<Button variant="secondary">Payout actions</Button>}
      items={[
        { label: "Edit payout", icon: <PencilSimple size={16} /> },
        { label: "Retry payout", icon: <ArrowsClockwise size={16} /> },
        { type: "separator" },
        {
          label: "Cancel payout",
          icon: <Trash size={16} />,
          destructive: true,
        },
      ]}
    />
  ),
};

export const WithDisabledItem: Story = {
  render: () => (
    <DropdownMenu
      trigger={<Button variant="secondary">Merchant actions</Button>}
      items={[
        { label: "View profile" },
        { label: "Suspend account", disabled: true },
        { type: "separator" },
        { label: "Remove merchant", destructive: true },
      ]}
    />
  ),
};

export const AlignEnd: Story = {
  render: () => (
    <div className="flex justify-end">
      <DropdownMenu
        align="end"
        trigger={<Button variant="secondary">Options</Button>}
        items={[{ label: "Export CSV" }, { label: "Export PDF" }]}
      />
    </div>
  ),
};
