"use client";

import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export default function DropdownMenuDocs() {
  return (
    <DocPage
      title="Dropdown menu"
      description="An action menu — not a value picker like Select. Opens on click, full arrow-key navigation, supports disabled and destructive items."
    >
      <DocSection title="Basic usage">
        <Example
          code={`<DropdownMenu
  trigger={<Button variant="secondary">Actions</Button>}
  items={[
    { label: "View details", onSelect: () => {} },
    { label: "Export CSV", onSelect: () => {} },
    { type: "separator" },
    { label: "Remove payout method", destructive: true, onSelect: () => {} },
  ]}
/>`}
        >
          <DropdownMenu
            trigger={<Button variant="secondary">Actions</Button>}
            items={[
              { label: "View details", onSelect: () => {} },
              { label: "Export CSV", onSelect: () => {} },
              { type: "separator" },
              { label: "Remove payout method", destructive: true, onSelect: () => {} },
            ]}
          />
        </Example>
        <Note>
          <code>MenuItem</code> is shared by DropdownMenu, ContextMenu and Menubar — the same item
          shape, so all three menus look and behave identically. Only how the menu is triggered
          and positioned differs.
        </Note>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "trigger", type: "ReactElement", description: "Any element accepting onClick — cloned, not ref-forwarded." },
            { name: "items", type: "MenuItem[]", description: "{ label, icon?, shortcut?, disabled?, destructive?, onSelect } or { type: \"separator\" }." },
            { name: "align", type: `"start" | "end"`, defaultValue: `"start"`, description: "Horizontal alignment against the trigger." },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
