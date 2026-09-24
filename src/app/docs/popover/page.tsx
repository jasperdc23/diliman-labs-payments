"use client";

import { Popover } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export default function PopoverDocs() {
  return (
    <DocPage
      title="Popover"
      description="The raw floating-panel primitive: a trigger plus arbitrary content in a panel positioned below it. Select and Date picker are specific applications of this same idea — Popover itself carries no opinion about what goes inside."
    >
      <DocSection
        title="Basic usage"
        description="Pass any single element as the trigger — it's cloned with the open/close wiring rather than requiring a forwarded ref, so it works with this kit's Button as-is."
      >
        <Example
          code={`<Popover trigger={<Button variant="secondary">Filters</Button>}>
  <p>Popover content goes here.</p>
</Popover>`}
        >
          <Popover trigger={<Button variant="secondary">Filters</Button>}>
            <p style={{ maxWidth: "220px", fontSize: "var(--text-sm)" }}>
              Any content can go here — a form, a list, plain text.
            </p>
          </Popover>
        </Example>
        <Note>
          Closes on Escape (returning focus to the trigger) or an outside click. The panel sits
          on <code>.popover-surface</code> — fully opaque — since it floats over arbitrary page
          content that must never bleed through.
        </Note>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "trigger", type: "ReactElement", description: "Cloned with open/close wiring and aria-* attributes." },
            { name: "children", type: "ReactNode", description: "Panel content." },
            { name: "align", type: `"start" | "end"`, defaultValue: `"start"`, description: "Horizontal alignment against the trigger." },
            { name: "className", type: "string", description: "Appended to the panel." },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
