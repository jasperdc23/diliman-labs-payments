"use client";

import { DirectionProvider, useDirection } from "@/components/ui/direction";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

function DirectionReport() {
  const dir = useDirection();
  return (
    <p style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)" }}>
      useDirection() reports: <strong>{dir}</strong>
    </p>
  );
}

export default function DirectionDocs() {
  return (
    <DocPage
      title="Direction"
      description="A context provider and hook for LTR/RTL awareness. The kit has no Arabic or Hebrew content planned, so this is kept deliberately minimal — it does not retrofit RTL support into any existing component."
    >
      <DocSection
        title="Usage"
        description="Wrap a subtree, then read the current direction anywhere below it with useDirection()."
      >
        <Example
          code={`<DirectionProvider dir="rtl">
  <MyComponent />
</DirectionProvider>

function MyComponent() {
  const dir = useDirection();
  // "ltr" | "rtl"
}`}
        >
          <DirectionProvider dir="ltr">
            <DirectionReport />
          </DirectionProvider>
        </Example>
        <Note>
          <code>DirectionProvider</code> sets the <code>dir</code> attribute on a wrapping{" "}
          <code>div</code>, so browser defaults (text alignment, bidi) apply for free. No component
          in the kit reads <code>useDirection()</code> today — it exists so one can, once RTL
          content is actually planned, without inventing this plumbing from scratch.
        </Note>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "dir",
              type: `"ltr" | "rtl"`,
              defaultValue: `"ltr"`,
              description: "Text direction applied to the wrapper and exposed via useDirection().",
            },
            {
              name: "children",
              type: "ReactNode",
              description: "Subtree that can read the direction context.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
