"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CaretRight,
  Check,
  QrCode,
} from "@phosphor-icons/react/ssr";
import { Card } from "@/components/ui/card";
import { List, ListRow } from "@/components/ui/list-row";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

function IconBadge({ tone, children }: { tone: "in" | "out"; children: ReactNode }) {
  return (
    <span
      className={`flex items-center justify-center ${
        tone === "in" ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"
      }`}
      style={{ width: "var(--space-8)", height: "var(--space-8)", borderRadius: "var(--radius-md)" }}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

const amount = (value: string) => (
  <span className="font-medium tabular-nums text-text-primary">{value}</span>
);

const ACCOUNTS = [
  { id: "bpi", title: "BPI ••4821", subtitle: "Savings · Maricel Bautista" },
  { id: "landbank", title: "Landbank ••7730", subtitle: "Current · Eplayment Corp." },
  { id: "unionbank", title: "UnionBank ••1145", subtitle: "Current · Eplayment Corp." },
];

function SelectableList() {
  const [selected, setSelected] = useState("landbank");

  return (
    <Card flat padded={false} className="w-full max-w-md overflow-hidden">
      <List>
        {ACCOUNTS.map((account) => (
          <ListRow
            key={account.id}
            title={account.title}
            subtitle={account.subtitle}
            onClick={() => setSelected(account.id)}
            trailing={
              selected === account.id ? (
                <Check size={16} weight="bold" aria-label="Selected" />
              ) : null
            }
          />
        ))}
      </List>
    </Card>
  );
}

export default function ListDocs() {
  return (
    <DocPage
      title="List"
      description="A divided stack of rows, each with an optional leading element, a title, a subtitle and a trailing element. Reach for it when people are comparing items down a single column — transactions, accounts, settings — which is the case a grid of cards handles badly."
    >
      <DocSection
        title="Basic usage"
        description="List renders the ul and the hairline dividers; ListRow renders each li and owns its own padding. Drop the pair into a Card with padded={false} and overflow-hidden so the rows run to the card's edges and the dividers stay inside its rounded corners."
      >
        <Example
          layout="stacked"
          code={`<Card flat padded={false} className="max-w-md overflow-hidden">
  <List>
    <ListRow
      leading={<IconBadge tone="in"><ArrowDownLeft size={16} /></IconBadge>}
      title="InstaPay from BPI ••4821"
      subtitle="27 Aug 2026 · 09:14"
      trailing={<span className="tabular-nums">+₱12,400.00</span>}
    />
    <ListRow
      leading={<IconBadge tone="out"><ArrowUpRight size={16} /></IconBadge>}
      title="PESONet payout to Landbank ••7730"
      subtitle="26 Aug 2026 · 17:02"
      trailing={<span className="tabular-nums">-₱48,900.50</span>}
    />
    <ListRow
      leading={<IconBadge tone="in"><QrCode size={16} /></IconBadge>}
      title="QR Ph collection · Store 12"
      subtitle="26 Aug 2026 · 11:48"
      trailing={<span className="tabular-nums">+₱1,234.56</span>}
    />
  </List>
</Card>`}
        >
          <Card flat padded={false} className="w-full max-w-md overflow-hidden">
            <List>
              <ListRow
                leading={
                  <IconBadge tone="in">
                    <ArrowDownLeft size={16} weight="regular" />
                  </IconBadge>
                }
                title="InstaPay from BPI ••4821"
                subtitle="27 Aug 2026 · 09:14"
                trailing={amount("+₱12,400.00")}
              />
              <ListRow
                leading={
                  <IconBadge tone="out">
                    <ArrowUpRight size={16} weight="regular" />
                  </IconBadge>
                }
                title="PESONet payout to Landbank ••7730"
                subtitle="26 Aug 2026 · 17:02"
                trailing={amount("-₱48,900.50")}
              />
              <ListRow
                leading={
                  <IconBadge tone="in">
                    <QrCode size={16} weight="regular" />
                  </IconBadge>
                }
                title="QR Ph collection · Store 12"
                subtitle="26 Aug 2026 · 11:48"
                trailing={amount("+₱1,234.56")}
              />
            </List>
          </Card>
        </Example>
        <Note>
          Use <code>flat</code> on the containing card. A long list sits on one surface, and a
          backdrop blur behind a tall scrolling container is the one texture effect in this kit that
          actually costs frame time.
        </Note>
      </DocSection>

      <DocSection
        title="Rows that navigate"
        description="Give a row an href and it renders an anchor filling the row, with a hover tint and the standard focus ring. The trailing caret is the convention for “this goes somewhere” — it is decorative, so mark it aria-hidden and let the title carry the meaning."
      >
        <Example
          layout="stacked"
          code={`<List>
  <ListRow
    href="#settlement"
    title="Settlement account"
    subtitle="Landbank ••7730"
    trailing={<CaretRight size={16} aria-hidden="true" />}
  />
  <ListRow
    href="#limits"
    title="Transfer limits"
    subtitle="₱500,000.00 daily"
    trailing={<CaretRight size={16} aria-hidden="true" />}
  />
</List>`}
        >
          <Card flat padded={false} className="w-full max-w-md overflow-hidden">
            <List>
              <ListRow
                href="#settlement"
                title="Settlement account"
                subtitle="Landbank ••7730"
                trailing={<CaretRight size={16} weight="regular" aria-hidden="true" />}
              />
              <ListRow
                href="#limits"
                title="Transfer limits"
                subtitle="₱500,000.00 daily"
                trailing={<CaretRight size={16} weight="regular" aria-hidden="true" />}
              />
            </List>
          </Card>
        </Example>
        <Note>
          <code>href</code> renders a plain <code>&lt;a&gt;</code>, which is right for anchors and
          external URLs but skips client-side routing for internal ones. For an in-app route, leave{" "}
          <code>href</code> off and wrap the row content in a <code>next/link</code>, or use{" "}
          <code>onClick</code> with the router.
        </Note>
      </DocSection>

      <DocSection
        title="Rows that act"
        description="An onClick row renders a real button, so it is tabbable, fires on Enter and Space, and is announced as a button. Use it for selection and in-place actions rather than navigation."
      >
        <Example layout="stacked" code={`<ListRow
  title="Landbank ••7730"
  subtitle="Current · Eplayment Corp."
  onClick={() => setSelected("landbank")}
  trailing={selected === "landbank" ? <Check size={16} aria-label="Selected" /> : null}
/>`}>
          <SelectableList />
        </Example>
      </DocSection>

      <DocSection
        title="Static rows"
        description="With neither href nor onClick, the row is just an li — no cursor, no hover, no focus stop. That is the right default for read-only detail lists; do not add a handler purely to get the hover tint."
      >
        <Example
          layout="stacked"
          code={`<ListRow title="Merchant category" subtitle="Food and beverage" trailing="Locked" />`}
        >
          <Card flat padded={false} className="w-full max-w-md overflow-hidden">
            <List>
              <ListRow
                title="Merchant ID"
                subtitle="Assigned at onboarding"
                trailing={<span className="tabular-nums">EPL-004821</span>}
              />
              <ListRow
                title="Merchant category"
                subtitle="Food and beverage"
                trailing={
                  <span className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
                    Locked
                  </span>
                }
              />
            </List>
          </Card>
        </Example>
      </DocSection>

      <DocSection
        title="Disabled"
        description="disabled dims the row to 60% and blocks the pointer. It applies to onClick rows, which become disabled buttons; on an href row it drops the link entirely and renders the static variant instead."
      >
        <Example
          layout="stacked"
          code={`<ListRow
  title="Payout schedule"
  subtitle="Weekly · every Friday"
  onClick={() => {}}
  disabled
  trailing="Contact support"
/>`}
        >
          <Card flat padded={false} className="w-full max-w-md overflow-hidden">
            <List>
              <ListRow
                title="Payout schedule"
                subtitle="Weekly · every Friday"
                onClick={() => {}}
                disabled
                trailing={
                  <span className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
                    Contact support
                  </span>
                }
              />
            </List>
          </Card>
        </Example>
        <Note>
          A disabled button is skipped by keyboard navigation, so nothing explains why the row is
          unavailable. Say it in the <code>subtitle</code> or the <code>trailing</code> slot, as
          above, rather than leaving the dimming to speak for itself.
        </Note>
      </DocSection>

      <DocSection
        title="Behavior and accessibility"
        description="A few things the component decides for you."
      >
        <Note>
          <code>List</code> sets <code>role=&quot;list&quot;</code> explicitly, because removing the
          bullets with <code>list-style: none</code> is enough to make some screen readers stop
          treating a <code>ul</code> as a list. Title and subtitle both truncate to a single line —
          long merchant names will clip, so put the distinguishing part first. <code>href</code> wins
          over <code>onClick</code> when both are passed, and a row is only ever one element: anchor,
          button or list item. Avoid putting a button inside a row that is itself a button — put the
          secondary action in <code>trailing</code> on a static row instead.
        </Note>
      </DocSection>

      <DocSection title="Props">
        <p className="text-sm text-text-secondary">
          <code>List</code> takes the standard <code>ul</code> attributes plus{" "}
          <code>className</code>, appended after its own classes.
        </p>
        <PropsTable
          rows={[
            {
              name: "title",
              type: "ReactNode",
              description: "Required. The primary line. Truncates to one line.",
            },
            {
              name: "subtitle",
              type: "ReactNode",
              description: "Secondary line below the title, smaller and tertiary. Also truncates.",
            },
            {
              name: "leading",
              type: "ReactNode",
              description: "Icon, badge or avatar at the start of the row. Does not shrink.",
            },
            {
              name: "trailing",
              type: "ReactNode",
              description: "Amount, status or caret at the end of the row. Does not shrink.",
            },
            {
              name: "href",
              type: "string",
              description:
                "Renders the row as an anchor. Ignored when disabled. Takes precedence over onClick.",
            },
            {
              name: "onClick",
              type: "MouseEventHandler<HTMLElement>",
              description: "Renders the row as a button. Used only when href is not set.",
            },
            {
              name: "disabled",
              type: "boolean",
              defaultValue: "false",
              description:
                "Dims the row and blocks interaction. Suppresses the href variant entirely.",
            },
            {
              name: "className",
              type: "string",
              defaultValue: `""`,
              description: "Applied to the row's inner flex container, not the li.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
