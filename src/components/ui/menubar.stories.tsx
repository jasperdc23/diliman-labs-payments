import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Menubar } from "./menubar";

const meta: Meta<typeof Menubar> = {
  title: "Components/Menubar",
  component: Menubar,
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
type Story = StoryObj<typeof Menubar>;

export const Default: Story = {
  render: () => (
    <Menubar
      menus={[
        {
          label: "File",
          items: [
            { label: "New payout batch" },
            { label: "Import CSV" },
            { type: "separator" },
            { label: "Export ledger" },
          ],
        },
        {
          label: "Edit",
          items: [{ label: "Undo" }, { label: "Redo", disabled: true }],
        },
        {
          label: "View",
          items: [{ label: "Compact rows" }, { label: "Show settled only" }],
        },
      ]}
    />
  ),
};
