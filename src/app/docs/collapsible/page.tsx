import { Collapsible } from "@/components/ui/collapsible";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Collapsible — Diliman Labs" };

export default function CollapsibleDocs() {
  return (
    <DocPage
      title="Collapsible"
      description="A single expand/collapse region: a trigger button plus content that shows and hides with a cheap, compositor-safe reveal."
    >
      <DocSection
        title="Usage"
        description="Uncontrolled by default. Pass open/onOpenChange to control it yourself."
      >
        <Example
          layout="stacked"
          code={`<Collapsible trigger="Settlement details">
  <p>Settlement TXN-8817 was reversed on 26 Aug 2026…</p>
</Collapsible>`}
        >
          <div style={{ width: "320px" }}>
            <Collapsible trigger="Settlement details">
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--text-secondary)",
                  paddingTop: "var(--space-3)",
                }}
              >
                Settlement TXN-8817 was reversed on 26 Aug 2026 due to an insufficient balance at
                the receiving institution. Funds were returned to the sender the same day.
              </p>
            </Collapsible>
          </div>
        </Example>
        <Note>
          The reveal animates <code>grid-template-rows</code> from <code>0fr</code> to{" "}
          <code>1fr</code> on a single-row grid wrapper instead of animating <code>height</code>{" "}
          directly — a fraction unit interpolates cheaply on the compositor without the browser
          ever needing to know the content&apos;s real pixel height, so there&apos;s no{" "}
          <code>ResizeObserver</code> or manual height measurement in JS. The inner content stays{" "}
          <code>overflow: hidden</code> and reflows naturally at any size. This is the kit&apos;s
          precedent for animating a reveal; <code>Accordion</code> reuses the same wrapper per
          item.
        </Note>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "trigger", type: "ReactNode", description: "Label rendered in the trigger button." },
            { name: "children", type: "ReactNode", description: "Content shown when open." },
            {
              name: "open",
              type: "boolean",
              description: "Controlled open state. Omit to let the component manage its own.",
            },
            { name: "defaultOpen", type: "boolean", defaultValue: "false", description: "Initial open state when uncontrolled." },
            {
              name: "onOpenChange",
              type: "(open: boolean) => void",
              description: "Called after the trigger toggles the region.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
