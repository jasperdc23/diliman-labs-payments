import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowLeft, ArrowsLeftRight, Gear, House, Receipt, Storefront } from "@phosphor-icons/react/ssr";
import { Sidebar } from "./sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "Components/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

const items = [
  { key: "overview", label: "Overview", icon: <House size={18} /> },
  { key: "transactions", label: "Transactions", icon: <ArrowsLeftRight size={18} /> },
  { key: "settlements", label: "Settlements", icon: <Receipt size={18} /> },
  { key: "merchants", label: "Merchants", icon: <Storefront size={18} /> },
  { key: "settings", label: "Settings", icon: <Gear size={18} /> },
];

const Header = (
  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", paddingInline: "var(--space-2)" }}>
    <span
      style={{
        width: "var(--space-8)",
        height: "var(--space-8)",
        borderRadius: "var(--radius-md)",
        background: "var(--accent)",
        color: "var(--text-on-accent)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "var(--text-sm)",
        fontWeight: 600,
      }}
    >
      P
    </span>
    <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)" }}>EP</span>
  </div>
);

const Footer = (
  <a
    href="#"
    style={{
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)",
      padding: "var(--space-2) var(--space-3)",
      fontSize: "var(--text-sm)",
      fontWeight: 500,
      color: "var(--text-tertiary)",
      textDecoration: "none",
    }}
  >
    <ArrowLeft size={16} />
    Back to examples
  </a>
);

export const Default: Story = {
  args: { items, header: Header, footer: Footer, defaultActiveKey: "overview" },
  render: (args) => (
    <div style={{ height: "480px", display: "flex", border: "1px solid var(--border-subtle)" }}>
      <Sidebar {...args} />
      <div style={{ flex: 1, background: "var(--surface)" }} />
    </div>
  ),
};

export const Collapsed: Story = {
  args: { items, header: Header, footer: Footer, defaultActiveKey: "transactions", collapsed: true },
  render: (args) => (
    <div style={{ height: "480px", display: "flex", border: "1px solid var(--border-subtle)" }}>
      <Sidebar {...args} />
      <div style={{ flex: 1, background: "var(--surface)" }} />
    </div>
  ),
};
