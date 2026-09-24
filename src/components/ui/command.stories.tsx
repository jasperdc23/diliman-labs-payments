import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowsClockwise, MagnifyingGlass, Moon, Plus } from "@phosphor-icons/react/ssr";
import { Command } from "./command";

const meta: Meta<typeof Command> = {
  title: "Components/Command",
  component: Command,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof Command>;

export const Default: Story = {
  render: () => (
    <Command
      triggerLabel="Search actions"
      items={[
        {
          id: "new-payout",
          label: "New payout",
          group: "Actions",
          icon: <Plus size={16} />,
          shortcut: "⌘N",
          onSelect: () => alert("New payout"),
        },
        {
          id: "search-transactions",
          label: "Search transactions",
          group: "Actions",
          icon: <MagnifyingGlass size={16} />,
          onSelect: () => alert("Search transactions"),
        },
        {
          id: "retry-failed",
          label: "Retry failed payouts",
          group: "Actions",
          icon: <ArrowsClockwise size={16} />,
          keywords: ["retry", "failed"],
          onSelect: () => alert("Retry failed payouts"),
        },
        {
          id: "toggle-theme",
          label: "Toggle theme",
          group: "Preferences",
          icon: <Moon size={16} />,
          keywords: ["dark", "light", "appearance"],
          onSelect: () => alert("Toggle theme"),
        },
      ]}
    />
  ),
};
