import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MediaCard } from "./media-card";
import { Button } from "./button";

const swatch = (from: string, to: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/></linearGradient></defs><rect width="320" height="200" fill="url(#g)"/><circle cx="248" cy="52" r="46" fill="rgba(255,255,255,0.18)"/><circle cx="64" cy="168" r="70" fill="rgba(0,0,0,0.12)"/></svg>`,
  )}`;

const terminalPhoto = swatch("#6955ed", "#2f9e44");
const qrPhoto = swatch("#1d3f8a", "#e03131");

const meta: Meta<typeof MediaCard> = {
  title: "Components/MediaCard",
  component: MediaCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof MediaCard>;

export const Default: Story = {
  render: () => (
    <MediaCard
      className="max-w-sm"
      image={terminalPhoto}
      imageAlt="Countertop payment terminal"
      eyebrow="Hardware"
      title="Terminal S2"
      description="Accepts QR Ph, InstaPay transfers and tap-to-pay cards. Settles to the merchant wallet the next banking day."
      footer={
        <span className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
          Updated 27 Aug 2026
        </span>
      }
    />
  ),
};

export const WithoutImage: Story = {
  name: "Placeholder (no image)",
  render: () => (
    <MediaCard
      className="max-w-sm"
      eyebrow="Coming soon"
      title="Merchant insights"
      description="A token-driven placeholder renders whenever no image is supplied, so the card never looks broken."
    />
  ),
};

export const Interactive: Story = {
  render: () => (
    <MediaCard
      interactive
      className="max-w-sm"
      image={qrPhoto}
      imageAlt="QR Ph acceptance signage"
      eyebrow="Guide"
      title="Rolling out QR Ph in-store"
      description="Hover to see the card lift and the media scale — one micro-interaction per element."
      footer={<Button size="sm">Read guide</Button>}
    />
  ),
};

export const Overlay: Story = {
  render: () => (
    <MediaCard
      overlay
      interactive
      className="max-w-sm"
      image={terminalPhoto}
      imageAlt="Merchant reviewing a payout summary"
      aspectRatio="4 / 3"
      eyebrow="Payouts"
      title="₱482,190.40 settled this week"
      description="Across 1,284 InstaPay and PESONet transfers."
    />
  ),
};
