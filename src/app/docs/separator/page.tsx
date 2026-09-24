import { Separator } from "@/components/ui/separator";
import { DocPage, DocSection, Example, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Separator — Diliman Labs" };

export default function SeparatorDocs() {
  return (
    <DocPage
      title="Separator"
      description="A single divider line, horizontal or vertical, built from --border-subtle. Decorative by default; mark it as a real boundary when it separates two independent groups of content."
    >
      <DocSection
        title="Orientation"
        description="Horizontal separates stacked content; vertical separates items in a row."
      >
        <Example
          layout="stacked"
          code={`<span>InstaPay</span>
<Separator />
<span>PESONet</span>`}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", width: "280px" }}>
            <span style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)" }}>InstaPay</span>
            <Separator />
            <span style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)" }}>PESONet</span>
          </div>
        </Example>
        <Example
          code={`<span>Overview</span>
<Separator orientation="vertical" />
<span>Settings</span>`}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", height: "32px" }}>
            <span style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)" }}>Overview</span>
            <Separator orientation="vertical" />
            <span style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)" }}>Settings</span>
          </div>
        </Example>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "orientation",
              type: `"horizontal" | "vertical"`,
              defaultValue: `"horizontal"`,
              description: "Direction of the line.",
            },
            {
              name: "decorative",
              type: "boolean",
              defaultValue: "true",
              description:
                "When true, the separator is aria-hidden. Set to false when it marks a real semantic boundary — it then gets role=\"separator\".",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
