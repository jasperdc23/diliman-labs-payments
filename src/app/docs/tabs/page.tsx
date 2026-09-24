"use client";

import { useState } from "react";
import { ArrowsLeftRight, ChartLine, Receipt, Users } from "@phosphor-icons/react/ssr";
import { Tabs } from "@/components/ui/tabs";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

const items = [
  {
    value: "overview",
    label: "Overview",
    content: "Settlement totals, payout velocity, and rail mix for the current cycle.",
  },
  {
    value: "transactions",
    label: "Transactions",
    content: "Every InstaPay, PESONet, and QR Ph movement in the selected window.",
  },
  {
    value: "disputes",
    label: "Disputes",
    content: "Chargebacks and reversals awaiting merchant response.",
  },
  {
    value: "archive",
    label: "Archive",
    disabled: true,
    content: "Cycles older than 24 months.",
  },
];

const itemsSnippet = `const items = [
  { value: "overview", label: "Overview", content: "Settlement totals, payout velocity, and rail mix for the current cycle." },
  { value: "transactions", label: "Transactions", content: "Every InstaPay, PESONet, and QR Ph movement in the selected window." },
  { value: "disputes", label: "Disputes", content: "Chargebacks and reversals awaiting merchant response." },
  { value: "archive", label: "Archive", disabled: true, content: "Cycles older than 24 months." },
];`;

function ControlledTabs() {
  const [value, setValue] = useState("transactions");

  return (
    <div className="flex w-full flex-col" style={{ gap: "var(--space-4)" }}>
      <Tabs
        items={items}
        value={value}
        onValueChange={setValue}
        variant="pill"
        label="Settlement views"
      />
      <p className="text-text-tertiary" style={{ fontSize: "var(--text-sm)" }}>
        Selected value: <span className="font-mono text-text-primary">{value}</span>
      </p>
    </div>
  );
}

export default function TabsDocs() {
  return (
    <DocPage
      title="Tabs"
      description="Switches between sibling views of the same subject — the settlement cycle seen as totals, as transactions, as disputes. Reach for tabs when the views are peers and only one is useful at a time; if a person needs to compare two of them, put them side by side instead."
    >
      <DocSection
        title="Basic usage"
        description="Pass the whole tab set as data. Give each item a content node and Tabs renders the panel too, wired to the right ARIA relationships; leave content off and you get just the tab strip, which is useful when the panel lives elsewhere on the page."
      >
        <Example
          layout="stacked"
          code={`${itemsSnippet}

<Tabs items={items} label="Settlement views" />`}
        >
          <Tabs items={items} label="Settlement views" />
        </Example>
      </DocSection>

      <DocSection
        title="Variants"
        description="Underline is the default and belongs at the top of a page or panel, where the tabs read as a section header. Pill sits better inside a card or toolbar, where an underline would compete with the container's own edges."
      >
        <Example layout="stacked" code={`<Tabs items={items} variant="pill" label="Settlement views" />`}>
          <Tabs items={items} variant="pill" label="Settlement views" />
        </Example>
        <Note>
          The active indicator is a single element that measures the selected tab and slides. It is
          positioned without a transition on first paint, so the strip does not animate in from the
          left on load, and a ResizeObserver keeps it aligned when the container reflows.
        </Note>
      </DocSection>

      <DocSection
        title="With icons"
        description="An icon earns its place when it speeds up recognition of a view people visit constantly. Icons are marked aria-hidden, so the label still carries the whole meaning — never ship an icon-only tab."
      >
        <Example
          layout="stacked"
          code={`<Tabs
  label="Merchant workspace"
  items={[
    { value: "overview", label: "Overview", icon: <ChartLine size={16} />, content: "Cycle totals." },
    { value: "transactions", label: "Transactions", icon: <ArrowsLeftRight size={16} />, content: "Rail-level movements." },
    { value: "payouts", label: "Payouts", icon: <Receipt size={16} />, content: "Merchant payouts." },
    { value: "team", label: "Team", icon: <Users size={16} />, content: "Operators with access." },
  ]}
/>`}
        >
          <Tabs
            label="Merchant workspace"
            items={[
              {
                value: "overview",
                label: "Overview",
                icon: <ChartLine size={16} />,
                content: "Cycle totals.",
              },
              {
                value: "transactions",
                label: "Transactions",
                icon: <ArrowsLeftRight size={16} />,
                content: "Rail-level movements.",
              },
              {
                value: "payouts",
                label: "Payouts",
                icon: <Receipt size={16} />,
                content: "Merchant payouts.",
              },
              {
                value: "team",
                label: "Team",
                icon: <Users size={16} />,
                content: "Operators with access.",
              },
            ]}
          />
        </Example>
      </DocSection>

      <DocSection
        title="Controlled"
        description="Pass value and onValueChange to drive selection from outside — from a URL search param, for instance, so a view can be linked to and survives a refresh. With value set, the component stops tracking its own state; without it, defaultValue seeds the first selection and Tabs manages the rest."
      >
        <Example
          layout="stacked"
          code={`const [value, setValue] = useState("transactions");

<Tabs
  items={items}
  value={value}
  onValueChange={setValue}
  variant="pill"
  label="Settlement views"
/>`}
        >
          <ControlledTabs />
        </Example>
      </DocSection>

      <DocSection
        title="Disabled tabs"
        description="A disabled tab stays visible so the view's existence is still discoverable, but it can't be selected and arrow-key navigation skips over it. If a view is gone for good rather than temporarily out of reach, remove the tab instead of disabling it."
      >
        <Example
          layout="stacked"
          code={`const items = [
  { value: "overview", label: "Overview", content: "Cycle totals." },
  { value: "archive", label: "Archive", disabled: true, content: "Cycles older than 24 months." },
];

<Tabs items={items} label="Settlement views" />`}
        >
          <Tabs
            label="Settlement views with an archive"
            items={[
              { value: "overview", label: "Overview", content: "Cycle totals." },
              {
                value: "archive",
                label: "Archive",
                disabled: true,
                content: "Cycles older than 24 months.",
              },
            ]}
          />
        </Example>
      </DocSection>

      <DocSection title="Accessibility">
        <Note>
          The strip is a proper <code>tablist</code> with roving focus: only the selected tab is in
          the tab order, and Arrow Left, Arrow Right, Home, and End move between tabs. Selection
          follows focus, which is the right pattern when panels are cheap to render — if a panel
          triggers an expensive fetch, drive it from a controlled value and debounce the load. Always
          pass <code>label</code>: it names the tablist, and the default of &quot;Tabs&quot; tells a
          screen reader user nothing about which set of tabs they landed in.
        </Note>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "items",
              type: "TabItem[]",
              description:
                "The tabs, in order. Each has value, label, and optionally icon, disabled, and content.",
            },
            {
              name: "value",
              type: "string",
              description: "Controlled selection. Supply it with onValueChange.",
            },
            {
              name: "defaultValue",
              type: "string",
              description:
                "Initial selection when uncontrolled. Falls back to the first tab that is not disabled.",
            },
            {
              name: "onValueChange",
              type: "(value: string) => void",
              description: "Fires on click and on keyboard navigation, controlled or not.",
            },
            {
              name: "variant",
              type: `"underline" | "pill"`,
              defaultValue: `"underline"`,
              description: "Underline for page-level navigation, pill for inside a card or toolbar.",
            },
            {
              name: "label",
              type: "string",
              defaultValue: `"Tabs"`,
              description: "aria-label for the tablist. Override it with something meaningful.",
            },
            {
              name: "className",
              type: "string",
              description: "Appended to the root wrapper.",
            },
          ]}
        />
      </DocSection>

      <DocSection title="TabItem">
        <PropsTable
          rows={[
            { name: "value", type: "string", description: "Unique identifier for the tab." },
            { name: "label", type: "ReactNode", description: "Visible tab label." },
            {
              name: "icon",
              type: "ReactNode",
              description: "Optional leading icon, rendered aria-hidden.",
            },
            {
              name: "disabled",
              type: "boolean",
              defaultValue: "false",
              description: "Unselectable and skipped by arrow-key navigation.",
            },
            {
              name: "content",
              type: "ReactNode",
              description:
                "Panel body. Omit on every item to render the tab strip alone and place the panel yourself.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
