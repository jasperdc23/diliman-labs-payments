import Link from "next/link";
import { ArrowsLeftRight, Receipt, Wallet } from "@phosphor-icons/react/ssr";
import { StatCard } from "@/components/ui/stat-card";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Stat card — EP Design Kit" };

export default function StatCardDocs() {
  return (
    <DocPage
      title="Stat card"
      description="One number, said once, as large as it deserves. Reach for it at the top of a dashboard where a handful of figures set the context for everything below; for more than four or five numbers, a table reads faster than a wall of tiles."
    >
      <DocSection
        title="Basic usage"
        description="label and value are the only required props. The value renders at text-3xl in tabular-nums so a row of cards keeps its digits aligned, and the label is uppercased for you — write it in sentence case."
      >
        <Example
          code={`<StatCard
  className="max-w-xs"
  label="Available balance"
  value="₱1,284,930.75"
  delta="+12.4%"
  direction="up"
  caption="vs. last week"
  icon={<Wallet size={18} weight="regular" />}
/>`}
        >
          <StatCard
            className="max-w-xs"
            label="Available balance"
            value="₱1,284,930.75"
            delta="+12.4%"
            direction="up"
            caption="vs. last week"
            icon={<Wallet size={18} weight="regular" />}
          />
        </Example>
        <Note>
          <code>value</code> is a string, not a number — formatting is yours to decide. Format pesos
          as <code>₱1,234.56</code> and dates as <code>27 Aug 2026</code>, and round before you pass
          it in rather than letting a raw float through.
        </Note>
      </DocSection>

      <DocSection
        title="Direction"
        description="direction colors the delta and picks its icon: up is green with a rising arrow, down is red with a falling one, flat is gray with no icon at all. It describes the direction of the number, not whether the news is good — a falling refund rate is a win but it is still down."
      >
        <Example
          code={`<StatCard label="Volume today" value="₱312,450.00" delta="+4.1%" direction="up" caption="vs. yesterday" />
<StatCard label="Refund rate" value="2.8%" delta="-0.6pp" direction="down" caption="7-day rolling" />
<StatCard label="Settlement lag" value="1 day" delta="No change" direction="flat" caption="as of 27 Aug 2026" />`}
        >
          <StatCard
            className="max-w-xs"
            label="Volume today"
            value="₱312,450.00"
            delta="+4.1%"
            direction="up"
            caption="vs. yesterday"
          />
          <StatCard
            className="max-w-xs"
            label="Refund rate"
            value="2.8%"
            delta="-0.6pp"
            direction="down"
            caption="7-day rolling"
            icon={<Receipt size={18} weight="regular" />}
          />
          <StatCard
            className="max-w-xs"
            label="Settlement lag"
            value="1 day"
            delta="No change"
            direction="flat"
            caption="as of 27 Aug 2026"
          />
        </Example>
        <Note>
          <code>direction</code> is optional — when it&apos;s left out, StatCard reads the sign off{" "}
          <code>delta</code> itself (a leading <code>-</code> is down, a leading <code>+</code> is
          up, anything else is flat), so a <code>-0.6pp</code> delta is never accidentally painted
          green. Set <code>direction</code> explicitly only when the delta string doesn&apos;t carry
          a sign character, or when the direction of the number and the direction of the good news
          disagree in a way you want to override. Color is never the only signal either way: the
          arrow carries the same meaning, and a visually hidden &quot;increase&quot; /
          &quot;decrease&quot; / &quot;no change&quot; is announced to screen readers.
        </Note>
      </DocSection>

      <DocSection
        title="Delta and caption"
        description="Both are optional and both can stand alone. A delta with no caption leaves the change unqualified — since when? — so pair them unless the period is obvious from elsewhere on the page."
      >
        <Example
          code={`<StatCard label="Transactions" value="1,284" delta="+96" caption="vs. yesterday" />
<StatCard label="Active merchants" value="148" caption="Metro Manila" />
<StatCard label="Disputes open" value="7" />`}
        >
          <StatCard
            className="max-w-xs"
            label="Transactions"
            value="1,284"
            delta="+96"
            caption="vs. yesterday"
          />
          <StatCard className="max-w-xs" label="Active merchants" value="148" caption="Metro Manila" />
          <StatCard className="max-w-xs" label="Disputes open" value="7" />
        </Example>
      </DocSection>

      <DocSection
        title="Icon"
        description="A single Phosphor glyph in a subtle rounded tile, top right. It is decorative — the icon is marked aria-hidden and the label already says what the number is — so use it for scanning, not for meaning, and either give every card in a row an icon or none of them."
      >
        <Example
          code={`<StatCard
  className="max-w-xs"
  label="Transfers settled"
  value="₱482,190.40"
  delta="+8.2%"
  caption="this week"
  icon={<ArrowsLeftRight size={18} weight="regular" />}
/>`}
        >
          <StatCard
            className="max-w-xs"
            label="Transfers settled"
            value="₱482,190.40"
            delta="+8.2%"
            caption="this week"
            icon={<ArrowsLeftRight size={18} weight="regular" />}
          />
        </Example>
      </DocSection>

      <DocSection
        title="In a row"
        description="The standard dashboard header. Give every card flat so the grid does not pay for a backdrop blur per tile, and let the grid own the widths."
      >
        <Example
          layout="stacked"
          code={`<div className="grid gap-4 sm:grid-cols-3">
  <StatCard flat label="Volume today" value="₱312,450.00" delta="+4.1%" caption="vs. yesterday" icon={<ArrowsLeftRight size={18} weight="regular" />} />
  <StatCard flat label="Transactions" value="1,284" delta="+96" caption="vs. yesterday" />
  <StatCard flat label="Failed transfers" value="14" delta="+3" direction="down" caption="InstaPay timeouts" />
</div>`}
        >
          <div className="grid w-full gap-4 sm:grid-cols-3">
            <StatCard
              flat
              label="Volume today"
              value="₱312,450.00"
              delta="+4.1%"
              caption="vs. yesterday"
              icon={<ArrowsLeftRight size={18} weight="regular" />}
            />
            <StatCard flat label="Transactions" value="1,284" delta="+96" caption="vs. yesterday" />
            <StatCard
              flat
              label="Failed transfers"
              value="14"
              delta="+3"
              direction="down"
              caption="InstaPay timeouts"
            />
          </div>
        </Example>
        <Note>
          The value uses <code>tabular-nums</code>, which is right here: the cards sit in a row and
          their figures line up as a column. On a single large standalone figure, tabular figures
          just look loose — see <Link href="/docs/typography">Typography</Link>.
        </Note>
      </DocSection>

      <DocSection
        title="Interactive"
        description="Set interactive when the tile drills into a detail view. As with Card, this is styling only — wrap it in a link or button so it is reachable by keyboard."
      >
        <Example
          code={`<StatCard
  interactive
  className="max-w-xs"
  label="Failed transfers"
  value="14"
  delta="+3"
  direction="down"
  caption="InstaPay timeouts"
/>`}
        >
          <StatCard
            interactive
            className="max-w-xs"
            label="Failed transfers"
            value="14"
            delta="+3"
            direction="down"
            caption="InstaPay timeouts"
          />
        </Example>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "label",
              type: "string",
              description:
                "Required. What the number is. Rendered small, uppercase and letter-spaced — write it in sentence case.",
            },
            {
              name: "value",
              type: "string",
              description:
                "Required. The figure itself, pre-formatted. Rendered at text-3xl in tabular-nums.",
            },
            {
              name: "delta",
              type: "string",
              description: "Change indicator, e.g. “+12.4%”. Include the sign yourself.",
            },
            {
              name: "direction",
              type: `"up" | "down" | "flat"`,
              defaultValue: "inferred from delta's sign",
              description:
                "Color and icon for the delta. Describes the number's direction, not whether it is good news. Override only when delta has no sign character, or to contradict the inferred direction.",
            },
            {
              name: "caption",
              type: "ReactNode",
              description: "Qualifier next to the delta — the comparison period or a data note.",
            },
            {
              name: "icon",
              type: "ReactNode",
              description:
                "Decorative Phosphor glyph in a subtle tile, top right. Rendered aria-hidden.",
            },
            {
              name: "interactive",
              type: "boolean",
              defaultValue: "false",
              description: "Hover lift, for tiles that drill into a detail view. Styling only.",
            },
            {
              name: "flat",
              type: "boolean",
              defaultValue: "false",
              description: "Passed through to Card: drops the backdrop blur. Use in rows and grids.",
            },
            {
              name: "className",
              type: "string",
              defaultValue: `""`,
              description: "Applied to the underlying Card — usually a width constraint.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
