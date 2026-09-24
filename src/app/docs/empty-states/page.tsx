import Link from "next/link";
import { Wallet, MagnifyingGlass, WarningCircle, Receipt } from "@phosphor-icons/react/ssr";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Empty states — Diliman Labs" };

export default function EmptyStatesDocs() {
  return (
    <DocPage
      title="Empty states"
      description="What renders when there's nothing to show yet — a new account, a cleared inbox, a filter with zero matches. The one thing every version of it has in common: it always gives the person a way forward."
    >
      <DocSection title="The rule">
        <Note>
          <strong>An empty state is never a dead end.</strong> It always offers a way back or a
          next action or suggestion — never just a title sitting alone in the middle of the
          screen with nothing to click. This isn&apos;t a nice-to-have: <code>EmptyState</code>
          &apos;s props are typed so that at least one action is required. There is no way to
          render this component with an icon, a title, and a description, and nothing to do next.
        </Note>
      </DocSection>

      <DocSection
        title="Basic usage"
        description="Icon, title, description, and one primary action — the action is the path that fills the empty state in."
      >
        <Example
          layout="center"
          code={`<Card className="max-w-sm">
  <EmptyState
    icon={<Receipt size={32} />}
    title="No transactions yet"
    description="Transactions will show up here once your first payment settles."
    action={{ label: "Create your first payout" }}
  />
</Card>`}
        >
          <Card className="max-w-sm">
            <EmptyState
              icon={<Receipt size={32} weight="regular" />}
              title="No transactions yet"
              description="Transactions will show up here once your first payment settles."
              action={{ label: "Create your first payout" }}
            />
          </Card>
        </Example>
      </DocSection>

      <DocSection
        title="First use"
        description="A brand-new account or feature with nothing set up yet. The primary action is the obvious first step; a secondary link gives a lower-commitment option for someone who isn't ready to commit to it yet."
      >
        <Example
          layout="center"
          code={`<Card className="max-w-sm">
  <EmptyState
    icon={<Wallet size={32} />}
    title="No payout methods added"
    description="Add a bank account or e-wallet to start receiving settlements."
    action={{ label: "Add payout method" }}
    secondaryAction={{ label: "Learn how payouts work" }}
  />
</Card>`}
        >
          <Card className="max-w-sm">
            <EmptyState
              icon={<Wallet size={32} weight="regular" />}
              title="No payout methods added"
              description="Add a bank account or e-wallet to start receiving settlements."
              action={{ label: "Add payout method" }}
              secondaryAction={{ label: "Learn how payouts work" }}
            />
          </Card>
        </Example>
      </DocSection>

      <DocSection
        title="No results"
        description="A search or filter that matched nothing — the single most common empty state in a real app, and the one most likely to get built as a dead end. There's no meaningful 'primary action' here — nothing was created wrong, a query just didn't match anything — so the way forward is a secondary action that undoes the filter, not a fabricated call to action."
      >
        <Example
          layout="center"
          code={`<Card className="max-w-sm">
  <EmptyState
    icon={<MagnifyingGlass size={32} />}
    title={'No results for "InstaPay"'}
    description="Try a different search term, or clear your filters to see all transactions."
    secondaryAction={{ label: "Clear filters" }}
  />
</Card>`}
        >
          <Card className="max-w-sm">
            <EmptyState
              icon={<MagnifyingGlass size={32} weight="regular" />}
              title={'No results for "InstaPay"'}
              description="Try a different search term, or clear your filters to see all transactions."
              secondaryAction={{ label: "Clear filters" }}
            />
          </Card>
        </Example>
        <Note>
          Notice this example passes <code>secondaryAction</code> without an <code>action</code> —
          that&apos;s allowed, because the type only requires at least one of the two, not both.
          What it doesn&apos;t allow is passing neither.
        </Note>
      </DocSection>

      <DocSection
        title="Failed to load"
        description="A request that errored out reads fine as this same component — icon, plain explanation, a retry action, and a way back for when retrying won't help."
      >
        <Example
          layout="center"
          code={`<Card className="max-w-sm">
  <EmptyState
    icon={<WarningCircle size={32} />}
    title="Couldn't load this data"
    description="Something went wrong on our end. Try again, or head back to the dashboard."
    action={{ label: "Retry" }}
    secondaryAction={{ label: "Back to dashboard" }}
  />
</Card>`}
        >
          <Card className="max-w-sm">
            <EmptyState
              icon={<WarningCircle size={32} weight="regular" />}
              title="Couldn't load this data"
              description="Something went wrong on our end. Try again, or head back to the dashboard."
              action={{ label: "Retry" }}
              secondaryAction={{ label: "Back to dashboard" }}
            />
          </Card>
        </Example>
        <Note>
          This covers a request-level failure cleanly. A full error boundary or a crash page is a
          different, more drastic pattern — outside this component&apos;s scope — but a single
          panel or card that failed to fetch its data fits <code>EmptyState</code> as-is.
        </Note>
      </DocSection>

      <DocSection
        title="Where this shows up in the kit already"
        description="A few components already render something when they have nothing to show. Worth checking each against the rule above rather than assuming they follow it."
      >
        <Note>
          <Link href="/docs/table">Table</Link> already renders an <code>emptyState</code> slot
          when <code>rows</code> is empty — it defaults to the plain string{" "}
          <code>&quot;No records to show.&quot;</code> with no action attached. As shipped, that
          default violates the rule this page opens with: it&apos;s a dead end, just a sentence
          with nothing to click. <code>Table</code>&apos;s <code>emptyState</code> prop already
          accepts a <code>ReactNode</code>, though, so any consumer can pass an{" "}
          <code>EmptyState</code> instance in its place today — for example a &quot;no
          results&quot; variant with a &quot;Clear filters&quot; action for a filtered table, or a
          &quot;first use&quot; variant with an &quot;Add record&quot; action for a table that has
          never had rows. This page flags the default as something to revisit rather than
          changing <code>Table</code> itself.
        </Note>
        <Note>
          A <code>List</code> with no items, or any filtered view without a dedicated empty
          state today, has the same implicit gap — nothing renders at all rather than a dead
          sentence, which is easy to miss in review since there&apos;s no visible mistake to
          point at. The fix in every case is the same: render <code>EmptyState</code> instead of
          nothing, with at least one action wired to something real.
        </Note>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "icon",
              type: "ReactNode",
              description:
                "Optional leading icon or illustration — a Phosphor icon around 32-40px reads best. Rendered in a tinted circle built from --surface-sunken, the same token-only placeholder logic MediaCard uses for imagery.",
            },
            {
              name: "title",
              type: "string",
              description: "States what's missing, plainly — e.g. \"No transactions yet\".",
            },
            {
              name: "description",
              type: "string",
              description: "One sentence of context.",
            },
            {
              name: "action",
              type: "{ label: string; onClick?: () => void }",
              description:
                "The primary next step — the path that fills the empty state in. Required unless secondaryAction is supplied.",
            },
            {
              name: "secondaryAction",
              type: "{ label: string; onClick?: () => void }",
              description:
                "A lower-commitment way back or next step — clearing a filter, going back, or reading more. Required unless action is supplied.",
            },
            {
              name: "className",
              type: "string",
              description:
                "Applied to the outer wrapper. EmptyState renders as a bare centered stack — wrap it in a Card, a page section, or a table's empty row as needed.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
