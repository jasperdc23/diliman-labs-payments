import { ScrollArea } from "@/components/ui/scroll-area";
import { DocPage, DocSection, Example, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Scroll Area — EP Design Kit" };

const merchants = [
  "Bayani Mart",
  "Sari Express",
  "Kalye Coffee",
  "Luzon Logistics",
  "Isla Pharmacy",
  "Kalinga Bakeshop",
  "Visayas Freight Co.",
  "Mindanao Traders",
  "Palawan Dive Co.",
  "Cordillera Weaves",
];

export default function ScrollAreaDocs() {
  return (
    <DocPage
      title="Scroll Area"
      description="A scrollable container with a thin, token-colored scrollbar that appears on hover or focus instead of the native browser chrome. A plain overflow: auto box under the hood — no custom scroll physics."
    >
      <DocSection title="Usage" description="Hover the list below to see the scrollbar appear.">
        <Example
          code={`<ScrollArea maxHeight="200px">
  <div>{/* long list */}</div>
</ScrollArea>`}
        >
          <ScrollArea
            maxHeight="200px"
            style={{ width: "260px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)", padding: "var(--space-3)" }}>
              {merchants.map((name) => (
                <div key={name} style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)", padding: "var(--space-2)" }}>
                  {name}
                </div>
              ))}
            </div>
          </ScrollArea>
        </Example>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "children", type: "ReactNode", description: "Scrollable content." },
            {
              name: "maxHeight",
              type: "string",
              description: "Caps the container height so overflow triggers scrolling.",
            },
            { name: "className", type: "string", description: "Additional class names." },
            { name: "style", type: "CSSProperties", description: "Additional inline styles." },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
