import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Nav } from "./nav";

const meta: Meta<typeof Nav> = {
  title: "Components/Nav",
  component: Nav,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: "220px",
          paddingTop: "1.5rem",
          background:
            "linear-gradient(135deg, var(--accent-subtle), var(--surface-sunken))",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Nav>;

export const Default: Story = {};
