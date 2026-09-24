import { Marker } from "@/components/ui/marker";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Marker — EP Design Kit" };

export default function MarkerDocs() {
  return (
    <DocPage
      title="Marker"
      description="A small, generic status/position indicator: a colored dot with an optional label."
    >
      <Note>
        <strong>Assumption flagged for review.</strong> &quot;Marker&quot; was requested with no
        definition attached, so this page builds one reasonable reading: a standalone status dot —
        a legend swatch, a timeline-step marker, or a live/online indicator not bolted to
        <code> Avatar</code> — rather than an established, settled pattern. Confirm the intended use
        before treating this as final.
      </Note>

      <DocSection
        title="With a label"
        description="Tones reuse the same semantic colors as Badge and Avatar's status dot: success/warning/danger, plus neutral (tertiary text) and accent."
      >
        <Example
          code={`<Marker tone="success" label="Settled" />
<Marker tone="warning" label="Pending" />
<Marker tone="danger" label="Failed" />`}
        >
          <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
            <Marker tone="success" label="Settled" />
            <Marker tone="warning" label="Pending" />
            <Marker tone="danger" label="Failed" />
            <Marker tone="neutral" label="Offline" />
          </div>
        </Example>
      </DocSection>

      <DocSection
        title="Dot only"
        description="Drop the label for a compact legend swatch or a status dot inline with other content."
      >
        <Example code={`<Marker tone="success" />`}>
          <div className="flex items-center" style={{ gap: "var(--space-3)" }}>
            <Marker tone="success" />
            <Marker tone="warning" />
            <Marker tone="danger" />
          </div>
        </Example>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "tone",
              type: `"success" | "warning" | "danger" | "neutral" | "accent"`,
              defaultValue: `"neutral"`,
              description: "Sets the dot color.",
            },
            {
              name: "size",
              type: `"sm" | "md"`,
              defaultValue: `"md"`,
              description: "Dot and label size.",
            },
            {
              name: "label",
              type: "ReactNode",
              description: "Optional text next to the dot.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
