"use client";

import { ContextMenu } from "@/components/ui/context-menu";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export default function ContextMenuDocs() {
  return (
    <DocPage
      title="Context menu"
      description="The same menu primitive as Dropdown menu, triggered by right-click and positioned at the cursor instead of below a trigger element."
    >
      <DocSection title="Basic usage">
        <Example
          layout="center"
          code={`<ContextMenu
  items={[
    { label: "Copy reference", onSelect: () => {} },
    { label: "Flag for review", onSelect: () => {} },
  ]}
>
  <div>Right-click this row</div>
</ContextMenu>`}
        >
          <ContextMenu
            items={[
              { label: "Copy reference", onSelect: () => {} },
              { label: "Flag for review", onSelect: () => {} },
              { type: "separator" },
              { label: "Reverse transaction", destructive: true, onSelect: () => {} },
            ]}
          >
            <div
              style={{
                padding: "var(--space-8) var(--space-12)",
                border: "1px dashed var(--border-default)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--text-sm)",
                color: "var(--text-secondary)",
              }}
            >
              Right-click this area
            </div>
          </ContextMenu>
        </Example>
        <Note>
          It renders the identical <code>Menu</code> component Dropdown menu uses internally —
          no second menu implementation, just a different trigger and position.
        </Note>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "children", type: "ReactNode", description: "The area that opens the menu on right-click." },
            { name: "items", type: "MenuItem[]", description: "Same shape as Dropdown menu's items." },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
