"use client";

import { Tooltip } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export default function TooltipDocs() {
  return (
    <DocPage
      title="Tooltip"
      description="A short, plain-text label shown on hover or keyboard focus — never click — for the single most common case: explaining what an icon-only control does."
    >
      <DocSection title="Basic usage">
        <Example
          code={`<Tooltip content="Delete payout method">
  <Button iconOnly variant="ghost" aria-label="Delete" iconLeft={<Trash size={16} />} />
</Tooltip>`}
        >
          <Tooltip content="Settle now">
            <Button variant="secondary">Hover or focus me</Button>
          </Tooltip>
        </Example>
        <Note>
          Content should be one line of plain text. For anything richer — a preview card with
          its own layout — reach for <code>HoverCard</code> instead; that&apos;s the line between the
          two.
        </Note>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "content", type: "ReactNode", description: "Short label text." },
            { name: "children", type: "ReactElement", description: "The trigger — cloned with hover/focus wiring and aria-describedby." },
            { name: "side", type: `"top" | "bottom" | "left" | "right"`, defaultValue: `"top"`, description: "Which side the bubble appears on." },
            { name: "className", type: "string", description: "Appended to the bubble." },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
