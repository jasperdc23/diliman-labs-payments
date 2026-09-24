import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardBody, CardFooter } from "@/components/ui/card";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Card — Diliman Labs" };

export default function CardDocs() {
  return (
    <DocPage
      title="Card"
      description="The base surface everything else is built on. A frosted-glass box with a border, a soft shadow and a grain overlay — reach for it whenever a block of content needs to read as sitting above the page rather than flush with it."
    >
      <DocSection
        title="Basic usage"
        description="Card is a flex column. CardTitle, CardBody and CardFooter are plain slots, not required children — use the ones you need and skip the rest."
      >
        <Example
          code={`<Card className="max-w-sm">
  <CardTitle>Settlement account</CardTitle>
  <CardBody>
    Payouts land in Landbank ••7730 on the next banking day. PESONet
    batches cut off at 15:00.
  </CardBody>
  <CardFooter>
    <Button size="sm">Change account</Button>
    <Button size="sm" variant="secondary">Dismiss</Button>
  </CardFooter>
</Card>`}
        >
          <Card className="max-w-sm">
            <CardTitle>Settlement account</CardTitle>
            <CardBody>
              Payouts land in Landbank ••7730 on the next banking day. PESONet batches cut off at
              15:00.
            </CardBody>
            <CardFooter>
              <Button size="sm">Change account</Button>
              <Button size="sm" variant="secondary">
                Dismiss
              </Button>
            </CardFooter>
          </Card>
        </Example>
      </DocSection>

      <DocSection
        title="Interactive"
        description="Set interactive when the whole card is a target. It adds a pointer cursor and a small lift on hover that settles back on press, so the card confirms the click before the navigation does."
      >
        <Example
          code={`<Card interactive className="max-w-sm">
  <CardTitle>August payout summary</CardTitle>
  <CardBody>1,284 transfers · ₱482,190.40 settled.</CardBody>
</Card>`}
        >
          <Card interactive className="max-w-sm">
            <CardTitle>August payout summary</CardTitle>
            <CardBody>1,284 transfers · ₱482,190.40 settled.</CardBody>
          </Card>
        </Example>
        <Note>
          <code>interactive</code> is styling only. It does not make the card focusable or
          keyboard-operable, so put a real <code>&lt;button&gt;</code> or link inside the card — or
          wrap the card in one — rather than hanging an <code>onClick</code> on the div and calling
          it done.
        </Note>
      </DocSection>

      <DocSection
        title="Flat"
        description="flat swaps the .glass surface for .glass-flat: identical color and border, no backdrop blur. A backdrop-filter is the one texture effect in this kit that costs frame time per element, so anything that appears dozens of times on a screen — grid tiles, list containers, table shells — should be flat. A handful of standalone cards on a page can afford the blur."
      >
        <Example
          code={`<div className="grid gap-4 sm:grid-cols-2">
  <Card flat>
    <CardTitle>InstaPay</CardTitle>
    <CardBody>Real-time, up to ₱50,000.00 per transfer.</CardBody>
  </Card>
  <Card flat>
    <CardTitle>PESONet</CardTitle>
    <CardBody>Batched, settles same banking day after the 15:00 cutoff.</CardBody>
  </Card>
</div>`}
        >
          <div className="grid w-full gap-4 sm:grid-cols-2">
            <Card flat>
              <CardTitle>InstaPay</CardTitle>
              <CardBody>Real-time, up to ₱50,000.00 per transfer.</CardBody>
            </Card>
            <Card flat>
              <CardTitle>PESONet</CardTitle>
              <CardBody>Batched, settles same banking day after the 15:00 cutoff.</CardBody>
            </Card>
          </div>
        </Example>
        <Note>
          The difference is only visible over a textured page background, since the blur has to have
          something behind it to soften. Judge <code>flat</code> against the real page, not against a
          white one.
        </Note>
      </DocSection>

      <DocSection
        title="Unpadded"
        description="padded is on by default and applies space-6 of padding plus a space-4 gap between children. Turn it off when the content is responsible for its own edges — a media card whose image must run to the corners, or a list whose rows draw their own padding and dividers."
      >
        <Example
          layout="stacked"
          code={`<Card flat padded={false} className="max-w-md overflow-hidden">
  {/* rows supply their own padding and dividers */}
</Card>`}
        >
          <Card flat padded={false} className="max-w-md overflow-hidden">
            <div
              className="border-b border-border-subtle text-sm text-text-secondary"
              style={{ padding: "var(--space-3) var(--space-4)" }}
            >
              QR Ph collection · Store 12
            </div>
            <div
              className="text-sm text-text-secondary"
              style={{ padding: "var(--space-3) var(--space-4)" }}
            >
              QR Ph collection · Store 07
            </div>
          </Card>
        </Example>
        <Note>
          Pair <code>padded={"{false}"}</code> with <code>overflow-hidden</code> whenever children
          touch the edge, otherwise square corners poke through the card&apos;s rounded ones. See{" "}
          <Link href="/docs/list">List</Link> for the full pattern.
        </Note>
      </DocSection>

      <DocSection
        title="Sizing"
        description="Card has no width of its own — it fills its container. Constrain it from the outside with a utility class or a grid, which keeps the component free of layout opinions."
      >
        <Example
          code={`<Card className="max-w-xs">
  <CardTitle>Daily limit</CardTitle>
  <CardBody>₱500,000.00 across InstaPay and PESONet combined.</CardBody>
</Card>`}
        >
          <Card className="max-w-xs">
            <CardTitle>Daily limit</CardTitle>
            <CardBody>₱500,000.00 across InstaPay and PESONet combined.</CardBody>
          </Card>
        </Example>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "interactive",
              type: "boolean",
              defaultValue: "false",
              description:
                "Pointer cursor plus a hover lift and press settle. Styling only — supply your own focusable element.",
            },
            {
              name: "flat",
              type: "boolean",
              defaultValue: "false",
              description:
                "Drops the backdrop blur (.glass-flat instead of .glass). Use in dense grids and long lists.",
            },
            {
              name: "padded",
              type: "boolean",
              defaultValue: "true",
              description:
                "Applies space-6 padding and a space-4 gap between children. Set false when children handle their own edges.",
            },
            {
              name: "className",
              type: "string",
              defaultValue: `""`,
              description: "Appended after the built-in classes, so it wins on conflicts.",
            },
            {
              name: "...props",
              type: "HTMLAttributes<HTMLDivElement>",
              description:
                "Everything else spreads onto the root div, including style, id and event handlers.",
            },
          ]}
        />
        <p className="text-sm text-text-secondary">
          <code>CardTitle</code> (an <code>h3</code>), <code>CardBody</code> and{" "}
          <code>CardFooter</code> (both <code>div</code>s) take no props of their own beyond the
          standard HTML attributes for their element.
        </p>
      </DocSection>
    </DocPage>
  );
}
