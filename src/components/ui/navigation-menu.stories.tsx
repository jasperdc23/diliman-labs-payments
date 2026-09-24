import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowsLeftRight, ChartBar, CreditCard, Wallet } from "@phosphor-icons/react/ssr";
import { NavigationMenu } from "./navigation-menu";

const meta: Meta<typeof NavigationMenu> = {
  title: "Components/Navigation Menu",
  component: NavigationMenu,
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
type Story = StoryObj<typeof NavigationMenu>;

export const Default: Story = {
  render: () => (
    <NavigationMenu
      items={[
        {
          label: "Products",
          links: [
            {
              label: "Payments",
              href: "#",
              description: "Accept InstaPay, PESONet, and QR Ph",
              icon: <CreditCard size={16} />,
            },
            {
              label: "Payouts",
              href: "#",
              description: "Send funds to banks and e-wallets",
              icon: <ArrowsLeftRight size={16} />,
            },
            {
              label: "Reporting",
              href: "#",
              description: "Reconcile settlements and fees",
              icon: <ChartBar size={16} />,
            },
            {
              label: "Wallet",
              href: "#",
              description: "Hold and move balances",
              icon: <Wallet size={16} />,
            },
          ],
        },
        { label: "Pricing", href: "#" },
        { label: "Docs", href: "#" },
      ]}
    />
  ),
};
