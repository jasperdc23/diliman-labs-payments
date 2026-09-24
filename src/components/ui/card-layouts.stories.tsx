import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CaretRight,
  QrCode,
  Wallet,
  Receipt,
} from "@phosphor-icons/react/ssr";
import { Card, CardTitle, CardBody } from "./card";
import { MediaCard } from "./media-card";
import { StatCard } from "./stat-card";
import { ProfileCard } from "./profile-card";
import { List, ListRow } from "./list-row";

const swatch = (from: string, to: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/></linearGradient></defs><rect width="320" height="200" fill="url(#g)"/><circle cx="252" cy="48" r="44" fill="rgba(255,255,255,0.18)"/><circle cx="60" cy="172" r="72" fill="rgba(0,0,0,0.12)"/></svg>`,
  )}`;

const terminal = swatch("#6955ed", "#2f9e44");
const signage = swatch("#1d3f8a", "#e03131");
const wallet = swatch("#f08c00", "#6955ed");

const meta: Meta = {
  title: "Patterns/Card Layouts",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj;

export const Grid: Story = {
  name: "Grid layout",
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <MediaCard
        interactive
        image={terminal}
        imageAlt="Countertop payment terminal"
        eyebrow="Hardware"
        title="Terminal S2"
        description="Tap-to-pay, QR Ph and InstaPay in one countertop unit."
      />
      <MediaCard
        interactive
        image={signage}
        imageAlt="QR Ph acceptance signage"
        eyebrow="Guide"
        title="Rolling out QR Ph"
        description="What to print, where to place it, and how staff should handle disputes."
      />
      <MediaCard
        interactive
        image={wallet}
        imageAlt="Merchant wallet dashboard"
        eyebrow="Product"
        title="Merchant wallet"
        description="Hold, split and sweep balances without leaving the dashboard."
      />
    </div>
  ),
};

export const ListLayout: Story = {
  name: "List layout",
  render: () => (
    <Card flat padded={false} className="max-w-xl overflow-hidden">
      <List>
        <ListRow
          leading={<ArrowDownLeft size={18} weight="regular" className="text-success" />}
          title="InstaPay from BPI ••4821"
          subtitle="27 Aug 2026 · 09:14"
          trailing={<span className="tabular-nums">+₱12,400.00</span>}
          href="#txn-1"
        />
        <ListRow
          leading={<ArrowUpRight size={18} weight="regular" className="text-danger" />}
          title="PESONet payout to Landbank ••7730"
          subtitle="26 Aug 2026 · 17:02"
          trailing={<span className="tabular-nums">-₱48,900.50</span>}
          href="#txn-2"
        />
        <ListRow
          leading={<QrCode size={18} weight="regular" className="text-accent" />}
          title="QR Ph collection · Store 12"
          subtitle="26 Aug 2026 · 11:48"
          trailing={<span className="tabular-nums">+₱1,234.56</span>}
          href="#txn-3"
        />
        <ListRow
          title="See all transactions"
          trailing={<CaretRight size={16} weight="regular" aria-hidden="true" />}
          href="#all"
        />
      </List>
    </Card>
  ),
};

export const Mixed: Story = {
  name: "Mixed / masonry",
  render: () => (
    <div className="gap-4 sm:columns-2 lg:columns-3">
      <div className="mb-4 break-inside-avoid">
        <StatCard
          flat
          label="Available balance"
          value="₱1,284,930.75"
          delta="+12.4%"
          caption="vs. last week"
          icon={<Wallet size={18} weight="regular" />}
        />
      </div>
      <div className="mb-4 break-inside-avoid">
        <MediaCard
          flat
          interactive
          image={terminal}
          imageAlt="Countertop payment terminal"
          eyebrow="Hardware"
          title="Terminal S2"
          description="Ships with QR Ph signage and a 12-month warranty."
        />
      </div>
      <div className="mb-4 break-inside-avoid">
        <ProfileCard
          flat
          name="Maricel Bautista"
          role="Merchant success"
          handle="@maricel"
          bio="Onboards quick-service merchants across Metro Manila."
          stats={[
            { label: "Merchants", value: "148" },
            { label: "Volume", value: "₱6.2M" },
          ]}
        />
      </div>
      <div className="mb-4 break-inside-avoid">
        <StatCard
          flat
          label="Refund rate"
          value="2.8%"
          delta="-0.6pp"
          direction="down"
          caption="7-day rolling"
          icon={<Receipt size={18} weight="regular" />}
        />
      </div>
      <div className="mb-4 break-inside-avoid">
        <Card flat>
          <CardTitle>Grid or list?</CardTitle>
          <CardBody>
            Grids suit browsing — equal-weight items scanned by image. Lists suit comparing — dense
            rows scanned by a single column of values.
          </CardBody>
        </Card>
      </div>
      <div className="mb-4 break-inside-avoid">
        <MediaCard
          flat
          overlay
          interactive
          image={signage}
          imageAlt="QR Ph acceptance signage"
          aspectRatio="4 / 3"
          eyebrow="Payouts"
          title="₱482,190.40 settled"
          description="1,284 transfers this week."
        />
      </div>
    </div>
  ),
};
