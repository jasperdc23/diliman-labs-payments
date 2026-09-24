"use client";

import { Resizable } from "@/components/ui/resizable";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

function Pane({ label }: { label: string }) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "var(--text-sm)",
        color: "var(--text-secondary)",
        background: "var(--surface-sunken)",
      }}
    >
      {label}
    </div>
  );
}

export default function ResizableDocs() {
  return (
    <DocPage
      title="Resizable"
      description="A two-pane split with a draggable divider, sized between a min and max percentage. Drag with a mouse or focus the divider and use the arrow keys."
    >
      <DocSection
        title="Horizontal split"
        description="Drag the divider, or tab to it and press the left/right arrow keys."
      >
        <Example
          layout="stacked"
          code={`<Resizable orientation="horizontal" defaultSize={40} minSize={20} maxSize={80}>
  <TransactionList />
  <TransactionDetails />
</Resizable>`}
        >
          <div style={{ height: "220px", width: "100%", maxWidth: "480px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
            <Resizable orientation="horizontal" defaultSize={40} minSize={20} maxSize={80} firstPaneLabel="Transaction list">
              <Pane label="Transaction list" />
              <Pane label="Details" />
            </Resizable>
          </div>
        </Example>
        <Note>
          The divider is a focusable <code>role=&quot;separator&quot;</code> with{" "}
          <code>aria-valuenow</code>/<code>aria-valuemin</code>/<code>aria-valuemax</code>, so a
          mouse isn&apos;t required to resize — arrow keys nudge the split, and{" "}
          <code>Home</code>/<code>End</code> jump to the min and max.
        </Note>
      </DocSection>

      <DocSection title="Vertical split">
        <Example
          layout="stacked"
          code={`<Resizable orientation="vertical" defaultSize={60}>
  <Chart />
  <Legend />
</Resizable>`}
        >
          <div style={{ height: "260px", width: "100%", maxWidth: "380px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
            <Resizable orientation="vertical" defaultSize={60} minSize={20} maxSize={80} firstPaneLabel="Chart">
              <Pane label="Chart" />
              <Pane label="Legend" />
            </Resizable>
          </div>
        </Example>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "children", type: "[ReactNode, ReactNode]", description: "Exactly two panes." },
            {
              name: "orientation",
              type: `"horizontal" | "vertical"`,
              defaultValue: `"horizontal"`,
              description: "Split direction.",
            },
            { name: "defaultSize", type: "number", defaultValue: "50", description: "Initial size of the first pane, as a percentage." },
            { name: "minSize", type: "number", defaultValue: "15", description: "Minimum percentage for the first pane." },
            { name: "maxSize", type: "number", defaultValue: "85", description: "Maximum percentage for the first pane." },
            { name: "onSizeChange", type: "(size: number) => void", description: "Called while dragging or nudging." },
            { name: "firstPaneLabel", type: "string", defaultValue: `"Panel"`, description: "Used in the divider's aria-label." },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
