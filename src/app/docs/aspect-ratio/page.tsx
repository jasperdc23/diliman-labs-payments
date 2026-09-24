import { AspectRatio } from "@/components/ui/aspect-ratio";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Aspect Ratio — Diliman Labs" };

function Filled() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-subtle)",
        background:
          "repeating-linear-gradient(135deg, var(--gray-200) 0 10px, var(--surface-sunken) 10px 20px)",
      }}
    />
  );
}

export default function AspectRatioDocs() {
  return (
    <DocPage
      title="Aspect Ratio"
      description="Wraps a child so it fills a fixed width/height ratio, using the CSS aspect-ratio property. Reads the same 1:1 / 4:3 / 16:9 set already established on the Imagery page and by MediaCard, plus an arbitrary custom ratio."
    >
      <DocSection
        title="Named ratios"
        description="Pick one of the kit's three standard ratios so grids of mixed content stay consistent."
      >
        <Example
          code={`<AspectRatio ratio="square">…</AspectRatio>
<AspectRatio ratio="4:3">…</AspectRatio>
<AspectRatio ratio="16:9">…</AspectRatio>`}
        >
          <div style={{ width: "140px" }}>
            <AspectRatio ratio="square">
              <Filled />
            </AspectRatio>
          </div>
          <div style={{ width: "180px" }}>
            <AspectRatio ratio="4:3">
              <Filled />
            </AspectRatio>
          </div>
          <div style={{ width: "240px" }}>
            <AspectRatio ratio="16:9">
              <Filled />
            </AspectRatio>
          </div>
        </Example>
      </DocSection>

      <DocSection title="Custom ratio" description="Any valid CSS aspect-ratio value works.">
        <Example code={`<AspectRatio ratio="21 / 9">…</AspectRatio>`}>
          <div style={{ width: "300px" }}>
            <AspectRatio ratio="21 / 9">
              <Filled />
            </AspectRatio>
          </div>
        </Example>
        <Note>
          Prefer <code>MediaCard</code> when the content is a photo with a title, description, or
          footer — this component is for the rarer case of constraining an arbitrary child
          (an embed, a chart, a custom media block).
        </Note>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "ratio",
              type: `"square" | "4:3" | "16:9" | number | "W / H"`,
              defaultValue: `"16:9"`,
              description: "Width/height ratio applied via CSS aspect-ratio.",
            },
            {
              name: "children",
              type: "ReactNode",
              description: "The content constrained to the ratio, absolutely positioned to fill it.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
