"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open sheet
      </Button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Transaction detail"
        description="TXN-8814 · Bayani Mart"
        footer={
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Close
          </Button>
        }
      >
        <p style={{ fontSize: "var(--text-sm)" }}>₱12,450.50 settled via InstaPay, 27 Aug 2026.</p>
      </Sheet>
    </>
  );
}

export default function SheetDocs() {
  return (
    <DocPage
      title="Sheet"
      description="The same native-dialog mechanics as Modal, but anchored to a screen edge with a slide-in transform instead of centered. This also covers what a &quot;Drawer&quot; would be elsewhere — a drawer is just a Sheet anchored to the side, so there&apos;s no separate Drawer component in this kit."
    >
      <DocSection title="Basic usage">
        <Example
          code={`<Sheet open={open} onClose={() => setOpen(false)} title="Transaction detail" side="right">
  <p>Detail content.</p>
</Sheet>`}
        >
          <Demo />
        </Example>
        <Note>
          Reach for Sheet over Modal when the content is a detail/review panel that benefits from
          a sense of &quot;sliding in beside&quot; the page rather than interrupting it dead-center.
        </Note>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "open", type: "boolean", description: "Controls visibility." },
            { name: "onClose", type: "() => void", description: "Called on close (X, Escape, or backdrop click)." },
            { name: "title", type: "string", description: "Required." },
            { name: "description", type: "ReactNode", description: "Optional subtitle." },
            { name: "footer", type: "ReactNode", description: "Footer actions." },
            { name: "side", type: `"top" | "right" | "bottom" | "left"`, defaultValue: `"right"`, description: "Which edge the sheet slides in from." },
            { name: "closeOnBackdropClick", type: "boolean", defaultValue: "true", description: "Set false for a sheet the user must explicitly dismiss." },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
