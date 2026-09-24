"use client";

import { Menubar } from "@/components/ui/menubar";
import { DocPage, DocSection, Example, PropsTable } from "@/components/docs/doc-parts";

export default function MenubarDocs() {
  return (
    <DocPage
      title="Menubar"
      description="A horizontal row of menu triggers, like a desktop app's File/Edit/View bar. Each opens the same menu Dropdown menu uses; only one panel is open at a time, and arrow-left/right moves between top-level items."
    >
      <DocSection title="Basic usage">
        <Example
          code={`<Menubar
  menus={[
    { label: "File", items: [{ label: "New payout", onSelect: () => {} }] },
    { label: "View", items: [{ label: "Show pending only", onSelect: () => {} }] },
  ]}
/>`}
        >
          <Menubar
            menus={[
              {
                label: "File",
                items: [
                  { label: "New payout", onSelect: () => {} },
                  { label: "Export ledger", onSelect: () => {} },
                ],
              },
              {
                label: "View",
                items: [
                  { label: "Show pending only", onSelect: () => {} },
                  { label: "Show reversed only", onSelect: () => {} },
                ],
              },
            ]}
          />
        </Example>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "menus", type: "{ label: string; items: MenuItem[] }[]", description: "One entry per top-level menu trigger." },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
