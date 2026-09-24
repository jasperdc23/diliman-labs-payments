"use client";

import { ArrowsClockwise, Lightning, ShieldCheck } from "@phosphor-icons/react/ssr";
import { Badge } from "@/components/ui/badge";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export default function BadgeDocs() {
  return (
    <DocPage
      title="Badge"
      description="A small, non-interactive label for the state of a thing — settled, pending, reversed — or for a short attribute like the rail a transaction moved on. Badges annotate; they never act. If it needs to be clicked to do something, it is a button."
    >
      <DocSection
        title="Variants"
        description="Neutral is for plain attributes with no judgment attached. Accent marks something noteworthy. Success, warning, and danger map to outcomes: settled, waiting on something, and failed or reversed. Do not stretch the semantic three to carry categories — a rail is not a warning."
      >
        <Example
          code={`<Badge variant="neutral">Draft</Badge>
<Badge variant="accent">InstaPay</Badge>
<Badge variant="success">Settled</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Reversed</Badge>`}
        >
          <Badge variant="neutral">Draft</Badge>
          <Badge variant="accent">InstaPay</Badge>
          <Badge variant="success">Settled</Badge>
          <Badge variant="warning">Pending</Badge>
          <Badge variant="danger">Reversed</Badge>
        </Example>
      </DocSection>

      <DocSection
        title="Sizes"
        description="Small is the default and is what belongs inside a dense table cell. Medium suits a page header or a filter row where the badge stands on its own."
      >
        <Example
          code={`<Badge size="sm" variant="accent">PESONet</Badge>
<Badge size="md" variant="accent">PESONet</Badge>`}
        >
          <Badge size="sm" variant="accent">
            PESONet
          </Badge>
          <Badge size="md" variant="accent">
            PESONet
          </Badge>
        </Example>
      </DocSection>

      <DocSection
        title="Status dot"
        description="The dot inherits the badge's text color, so it reinforces the variant with a shape as well as a tone. Use it for lifecycle states a person scans down a column, where the dot gives the eye a second thing to lock onto besides the word."
      >
        <Example
          code={`<Badge variant="success" dot>Payout sent</Badge>
<Badge variant="warning" dot>Awaiting clearing</Badge>
<Badge variant="danger" dot>Failed</Badge>`}
        >
          <Badge variant="success" dot>
            Payout sent
          </Badge>
          <Badge variant="warning" dot>
            Awaiting clearing
          </Badge>
          <Badge variant="danger" dot>
            Failed
          </Badge>
        </Example>
      </DocSection>

      <DocSection
        title="With an icon"
        description="Use an icon where it says something the label can't repeat cheaply. Size it to 12px at either badge size — the badge does not scale it for you. The icon is aria-hidden, so the label has to stand alone."
      >
        <Example
          code={`<Badge variant="accent" size="md" icon={<Lightning size={12} weight="fill" />}>Instant transfer</Badge>
<Badge variant="success" size="md" icon={<ShieldCheck size={12} weight="fill" />}>KYC verified</Badge>
<Badge variant="neutral" size="md" icon={<ArrowsClockwise size={12} />}>Recurring</Badge>`}
        >
          <Badge variant="accent" size="md" icon={<Lightning size={12} weight="fill" />}>
            Instant transfer
          </Badge>
          <Badge variant="success" size="md" icon={<ShieldCheck size={12} weight="fill" />}>
            KYC verified
          </Badge>
          <Badge variant="neutral" size="md" icon={<ArrowsClockwise size={12} />}>
            Recurring
          </Badge>
        </Example>
      </DocSection>

      <DocSection
        title="Removable"
        description="Supplying onRemove adds a dismiss button — this is how FilterBar renders an applied filter. Once a badge is removable it is interactive, so it needs a label that says what removing it will do."
      >
        <Example
          code={`<Badge variant="neutral" size="md" onRemove={() => {}} removeLabel="Remove filter Rail: QR Ph">
  QR Ph
</Badge>
<Badge variant="accent" size="md" onRemove={() => {}} removeLabel="Remove filter Merchant: Bayani Mart">
  Merchant: Bayani Mart
</Badge>`}
        >
          <Badge
            variant="neutral"
            size="md"
            onRemove={() => {}}
            removeLabel="Remove filter Rail: QR Ph"
          >
            QR Ph
          </Badge>
          <Badge
            variant="accent"
            size="md"
            onRemove={() => {}}
            removeLabel="Remove filter Merchant: Bayani Mart"
          >
            Merchant: Bayani Mart
          </Badge>
        </Example>
        <Note>
          Without <code>removeLabel</code> the button falls back to &quot;Remove &quot; plus the
          children — which only works when the children are a plain string, and degrades to
          &quot;Remove filter&quot; otherwise. Any badge with rich children should pass{" "}
          <code>removeLabel</code> explicitly.
        </Note>
      </DocSection>

      <DocSection title="Accessibility and color">
        <Note>
          The kit is monochrome today, so <code>--accent</code>, <code>--success</code>,{" "}
          <code>--warning</code>, and <code>--danger</code> all resolve to grays. That is the exact
          reason the label always carries the meaning and the variant only reinforces it: a badge
          that reads &quot;Reversed&quot; works whether or not the tone survives. Keep it that way
          when a brand hue lands — never ship a badge whose only difference from its neighbor is its
          color. The badge itself is a plain <code>span</code> with no ARIA role; if a state change
          needs announcing, put the live region on the container that owns it.
        </Note>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "children",
              type: "ReactNode",
              description: "The label. Keep it to one or two words.",
            },
            {
              name: "variant",
              type: `"neutral" | "accent" | "success" | "warning" | "danger"`,
              defaultValue: `"neutral"`,
              description: "Tone of the background, border, and text.",
            },
            {
              name: "size",
              type: `"sm" | "md"`,
              defaultValue: `"sm"`,
              description: "Padding and font size.",
            },
            {
              name: "dot",
              type: "boolean",
              defaultValue: "false",
              description: "Leading dot in the current text color.",
            },
            {
              name: "icon",
              type: "ReactNode",
              description: "Leading icon, rendered aria-hidden. Size it to 12px yourself.",
            },
            {
              name: "onRemove",
              type: "() => void",
              description: "Adds a trailing dismiss button and is called when it is pressed.",
            },
            {
              name: "removeLabel",
              type: "string",
              description:
                "aria-label for the dismiss button. Defaults to \"Remove\" plus the children when those are a string.",
            },
            { name: "className", type: "string", description: "Appended to the badge." },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
