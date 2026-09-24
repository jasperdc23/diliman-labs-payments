import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ReactNode } from "react";
import { ArrowRight, Plus, Trash, DownloadSimple } from "@phosphor-icons/react/ssr";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "ghost", "danger"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
  args: { children: "Button", variant: "primary", size: "md" },
};

export default meta;
type Story = StoryObj<typeof Button>;

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
    <p style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", fontWeight: 600 }}>
      {label}
    </p>
    <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", flexWrap: "wrap" }}>
      {children}
    </div>
  </div>
);

export const Primary: Story = {};

export const Secondary: Story = { args: { variant: "secondary" } };

export const Ghost: Story = { args: { variant: "ghost" } };

export const Danger: Story = { args: { variant: "danger", children: "Delete account" } };

export const Variants: Story = {
  render: () => (
    <Row label="Variants">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </Row>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Row label="Sizes">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </Row>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <Row label="Leading icon">
        <Button iconLeft={<Plus size={16} />}>New payout</Button>
        <Button variant="secondary" iconLeft={<DownloadSimple size={16} />}>
          Export
        </Button>
        <Button variant="danger" iconLeft={<Trash size={16} />}>
          Delete
        </Button>
      </Row>
      <Row label="Trailing icon">
        <Button iconRight={<ArrowRight size={16} />}>Continue</Button>
        <Button variant="secondary" iconRight={<ArrowRight size={16} />}>
          Next step
        </Button>
      </Row>
      <Row label="Icon only — aria-label is required">
        <Button iconOnly aria-label="Add" iconLeft={<Plus size={16} />} />
        <Button iconOnly variant="secondary" aria-label="Export" iconLeft={<DownloadSimple size={16} />} />
        <Button iconOnly variant="ghost" aria-label="Delete" iconLeft={<Trash size={16} />} />
      </Row>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", maxWidth: "48ch" }}>
        Hover, active, and focus are real interactions — hover a button, hold the mouse down
        on it, and tab to it to see each. The rows below cover the states that can be shown
        statically.
      </p>
      <Row label="Default">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </Row>
      <Row label="Loading">
        <Button loading>Saving</Button>
        <Button variant="secondary" loading>
          Saving
        </Button>
        <Button variant="ghost" loading>
          Saving
        </Button>
        <Button variant="danger" loading>
          Deleting
        </Button>
      </Row>
      <Row label="Disabled">
        <Button disabled>Primary</Button>
        <Button variant="secondary" disabled>
          Secondary
        </Button>
        <Button variant="ghost" disabled>
          Ghost
        </Button>
        <Button variant="danger" disabled>
          Danger
        </Button>
      </Row>
    </div>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <div style={{ maxWidth: "320px", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <Button fullWidth>Create account</Button>
      <Button fullWidth variant="secondary">
        Cancel
      </Button>
    </div>
  ),
};
