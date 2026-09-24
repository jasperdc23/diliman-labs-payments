import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProfileCard } from "./profile-card";
import { Button } from "./button";

const portrait = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="#6955ed"/><circle cx="48" cy="38" r="17" fill="rgba(255,255,255,0.85)"/><circle cx="48" cy="92" r="30" fill="rgba(255,255,255,0.85)"/></svg>`,
)}`;

const meta: Meta<typeof ProfileCard> = {
  title: "Components/ProfileCard",
  component: ProfileCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ProfileCard>;

export const Default: Story = {
  render: () => (
    <ProfileCard
      className="max-w-sm"
      avatar={portrait}
      name="Maricel Bautista"
      role="Merchant success"
      handle="@maricel"
      bio="Onboards sari-sari and quick-service merchants onto QR Ph across Metro Manila."
      stats={[
        { label: "Merchants", value: "148" },
        { label: "Volume (Aug)", value: "₱6.2M" },
        { label: "Since", value: "27 Aug 2024" },
      ]}
      actions={
        <>
          <Button size="sm">Message</Button>
          <Button size="sm" variant="secondary">
            View profile
          </Button>
        </>
      }
    />
  ),
};

export const InitialsFallback: Story = {
  render: () => (
    <ProfileCard
      className="max-w-sm"
      name="Jonas Rivera"
      role="Risk analyst"
      handle="@jrivera"
      bio="Reviews AMLC-flagged transfers and keeps the false-positive queue honest."
      stats={[
        { label: "Cases closed", value: "312" },
        { label: "Avg. review", value: "4m 12s" },
      ]}
      actions={
        <Button size="sm" variant="secondary">
          Assign case
        </Button>
      }
    />
  ),
};

export const Compact: Story = {
  render: () => (
    <ProfileCard
      flat
      interactive
      className="max-w-xs"
      name="Ana Dela Cruz"
      role="Settlements"
      stats={[{ label: "Payouts", value: "1,024" }]}
    />
  ),
};
