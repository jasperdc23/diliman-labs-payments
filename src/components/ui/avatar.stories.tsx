import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar, AvatarGroup } from "./avatar";

const localPortrait =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%236955ed'/%3E%3Ccircle cx='48' cy='38' r='16' fill='%23ffffff' opacity='0.9'/%3E%3Cellipse cx='48' cy='82' rx='26' ry='20' fill='%23ffffff' opacity='0.9'/%3E%3C/svg%3E";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { name: "Marisol Ramos" },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar name="Marisol Ramos" size="xs" />
      <Avatar name="Marisol Ramos" size="sm" />
      <Avatar name="Marisol Ramos" size="md" />
      <Avatar name="Marisol Ramos" size="lg" />
      <Avatar name="Marisol Ramos" size="xl" />
    </div>
  ),
};

export const Fallbacks: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar name="Jomar Dela Cruz" src={localPortrait} size="lg" />
      <Avatar name="Jomar Dela Cruz" size="lg" />
      <Avatar size="lg" />
    </div>
  ),
};

export const WithStatus: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar name="Aira Santos" status="online" size="lg" />
      <Avatar name="Benjie Uy" status="away" size="lg" />
      <Avatar name="Carla Lim" status="busy" size="lg" />
      <Avatar name="Dino Reyes" status="offline" size="lg" />
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <AvatarGroup size="md">
        <Avatar name="Aira Santos" size="md" />
        <Avatar name="Benjie Uy" size="md" />
        <Avatar name="Carla Lim" size="md" />
      </AvatarGroup>
      <AvatarGroup size="md" max={3}>
        <Avatar name="Aira Santos" size="md" />
        <Avatar name="Benjie Uy" size="md" />
        <Avatar name="Carla Lim" size="md" />
        <Avatar name="Dino Reyes" size="md" />
        <Avatar name="Elena Cruz" size="md" />
        <Avatar name="Fermin Yap" size="md" />
      </AvatarGroup>
    </div>
  ),
};

export const Overview: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Avatar name="Marisol Ramos" src={localPortrait} size="xl" status="online" />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-text-primary">Marisol Ramos</span>
          <span className="text-sm text-text-tertiary">Settlements lead</span>
        </div>
      </div>
      <AvatarGroup size="sm" max={4}>
        <Avatar name="Aira Santos" size="sm" />
        <Avatar name="Benjie Uy" size="sm" />
        <Avatar name="Carla Lim" size="sm" />
        <Avatar name="Dino Reyes" size="sm" />
        <Avatar name="Elena Cruz" size="sm" />
      </AvatarGroup>
    </div>
  ),
};
