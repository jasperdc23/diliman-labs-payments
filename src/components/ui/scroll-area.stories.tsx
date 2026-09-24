import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ScrollArea } from "./scroll-area";

const meta: Meta<typeof ScrollArea> = {
  title: "Components/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

const merchants = [
  "Bayani Mart",
  "Sari Express",
  "Kalye Coffee",
  "Luzon Logistics",
  "Isla Pharmacy",
  "Kalinga Bakeshop",
  "Visayas Freight Co.",
  "Mindanao Traders",
  "Palawan Dive Co.",
  "Cordillera Weaves",
];

export const Default: Story = {
  render: (args) => (
    <ScrollArea {...args} maxHeight="200px" style={{ width: "260px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)", padding: "var(--space-3)" }}>
        {merchants.map((name) => (
          <div
            key={name}
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--text-primary)",
              padding: "var(--space-2) var(--space-2)",
            }}
          >
            {name}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
