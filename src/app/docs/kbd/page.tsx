import { Kbd } from "@/components/ui/kbd";
import { DocPage, DocSection, Example, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Kbd — EP Design Kit" };

export default function KbdDocs() {
  return (
    <DocPage
      title="Kbd"
      description="An inline key or shortcut hint — a small, bordered, monospace chip for showing a keyboard shortcut inside documentation or a UI hint."
    >
      <DocSection title="Basic usage">
        <Example code={`<Kbd>Esc</Kbd>`}>
          <Kbd>Esc</Kbd>
        </Example>
      </DocSection>

      <DocSection
        title="Shortcut combinations"
        description="Render one Kbd per key and let normal inline spacing separate them."
      >
        <Example
          code={`<p>
  Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search
</p>`}
        >
          <p style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            Press <Kbd>⌘</Kbd>
            <Kbd>K</Kbd> to search
          </p>
        </Example>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "children",
              type: "ReactNode",
              description: "The key label, e.g. \"⌘K\" or \"Esc\".",
            },
            {
              name: "...props",
              type: "HTMLAttributes<HTMLElement>",
              description: "Forwarded to the underlying <kbd>.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
