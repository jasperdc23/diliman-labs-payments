import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Carousel } from "./carousel";

const meta: Meta<typeof Carousel> = {
  title: "Components/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Carousel>;

function PlaceholderSlide({ label }: { label: string }) {
  return (
    <div
      className="flex h-48 w-full items-center justify-center rounded-lg text-text-secondary"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--accent) 16%, transparent) 0%, var(--surface-sunken) 70%)",
        fontSize: "var(--text-sm)",
      }}
    >
      {label}
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <div style={{ width: "24rem" }}>
      <Carousel
        aria-label="Feature highlights"
        slides={[
          <PlaceholderSlide key="1" label="1. Send money with QR Ph" />,
          <PlaceholderSlide key="2" label="2. Track InstaPay transfers" />,
          <PlaceholderSlide key="3" label="3. Export settlement reports" />,
        ]}
      />
    </div>
  ),
};
