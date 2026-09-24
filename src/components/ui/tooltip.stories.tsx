import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Info } from "@phosphor-icons/react/ssr";
import { Button } from "./button";
import { Tooltip } from "./tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ padding: "var(--space-16)" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <Tooltip content="Settles within seconds via InstaPay">
      <Button variant="secondary">Real-time rail</Button>
    </Tooltip>
  ),
};

export const IconTrigger: Story = {
  render: () => (
    <Tooltip content="QR Ph works across any participating bank or wallet app">
      <button
        type="button"
        aria-label="More information about QR Ph"
        style={{ display: "flex", color: "var(--text-tertiary)", border: 0, background: "none", cursor: "pointer" }}
      >
        <Info size={18} />
      </button>
    </Tooltip>
  ),
};

export const Sides: Story = {
  render: () => (
    <div className="flex items-center" style={{ gap: "var(--space-12)" }}>
      <Tooltip content="Top" side="top">
        <Button variant="secondary" size="sm">
          Top
        </Button>
      </Tooltip>
      <Tooltip content="Right" side="right">
        <Button variant="secondary" size="sm">
          Right
        </Button>
      </Tooltip>
      <Tooltip content="Bottom" side="bottom">
        <Button variant="secondary" size="sm">
          Bottom
        </Button>
      </Tooltip>
      <Tooltip content="Left" side="left">
        <Button variant="secondary" size="sm">
          Left
        </Button>
      </Tooltip>
    </div>
  ),
};
