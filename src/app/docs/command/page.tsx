"use client";

import { Command } from "@/components/ui/command";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export default function CommandDocs() {
  return (
    <DocPage
      title="Command"
      description="A searchable command palette — a text input plus a filtered, keyboard-navigable list — opened from a trigger button or Cmd/Ctrl+K. This generalizes the shape already built for the docs site&apos;s own search into a reusable, data-driven primitive."
    >
      <DocSection title="Basic usage">
        <Example
          code={`<Command
  items={[
    { id: "new-payout", label: "New payout", group: "Actions", onSelect: () => {} },
    { id: "search-txn", label: "Search transactions", group: "Actions", onSelect: () => {} },
    { id: "theme", label: "Toggle theme", group: "Settings", onSelect: () => {} },
  ]}
/>`}
        >
          <Command
            items={[
              { id: "new-payout", label: "New payout", group: "Actions", onSelect: () => {} },
              { id: "search-txn", label: "Search transactions", group: "Actions", onSelect: () => {} },
              { id: "theme", label: "Toggle theme", group: "Settings", onSelect: () => {} },
            ]}
          />
        </Example>
        <Note>
          The docs site&apos;s own <code>⌘K</code> search (<code>src/components/docs/docs-search.tsx</code>)
          is a bespoke instance of exactly this pattern, predating this reusable version — it
          wasn&apos;t migrated to Command since that&apos;s a separate change outside this component&apos;s
          own scope.
        </Note>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "items", type: "CommandItem[]", description: "{ id, label, group?, icon?, shortcut?, keywords?, onSelect }." },
            { name: "placeholder", type: "string", defaultValue: `"Type a command or search…"`, description: "Input placeholder." },
            { name: "emptyMessage", type: "string", defaultValue: `"No matches."`, description: "Shown when nothing matches the query." },
            { name: "hotkey", type: "string | null", defaultValue: `"k"`, description: "Global Cmd/Ctrl+<key> shortcut. Pass null to disable." },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
