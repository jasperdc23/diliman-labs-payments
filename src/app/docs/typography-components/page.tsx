import Link from "next/link";
import { Heading, Lead, Muted, Text } from "@/components/ui/typography";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Typography components — EP Design Kit" };

export default function TypographyComponentsDocs() {
  return (
    <DocPage
      title="Typography components"
      description={
        "A component API over the type scale — see /docs/typography for the underlying nine-step scale and why it stays that short. These components render the same sizes, just as importable React components instead of a style prop."
      }
    >
      <DocSection
        title="Heading"
        description="level maps to the scale: 1 → --text-4xl, 2 → --text-2xl, 3 → --text-xl, 4 → --text-lg. Defaults to the matching h1–h4 tag; pass as to decouple the visual size from the semantic tag when a page's heading order requires it."
      >
        <Example
          layout="stacked"
          code={`<Heading level={1}>Settlement report</Heading>
<Heading level={2}>InstaPay</Heading>
<Heading level={3} as="h2">PESONet</Heading>`}
        >
          <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
            <Heading level={1}>Settlement report</Heading>
            <Heading level={2}>InstaPay</Heading>
            <Heading level={3}>PESONet</Heading>
            <Heading level={4}>Reference details</Heading>
          </div>
        </Example>
      </DocSection>

      <DocSection
        title="Text, Lead and Muted"
        description="Text is body copy — size (sm/base/lg) and tone (primary/secondary/tertiary) cover the common combinations. Lead is a larger, lighter intro paragraph, one per page. Muted is small tertiary caption text — timestamps, helper text."
      >
        <Example
          layout="stacked"
          code={`<Lead>27 Aug 2026 · 1,284 transfers settled, ₱482,190.40 total.</Lead>
<Text>₱468,900.00 across 1,190 InstaPay transfers.</Text>
<Muted>Generated 27 Aug 2026, 09:14</Muted>`}
        >
          <div className="flex flex-col" style={{ gap: "var(--space-2)", maxWidth: "32rem" }}>
            <Lead>27 Aug 2026 · 1,284 transfers settled, ₱482,190.40 total.</Lead>
            <Text>₱468,900.00 across 1,190 InstaPay transfers, all cleared within seconds.</Text>
            <Muted>Generated 27 Aug 2026, 09:14</Muted>
          </div>
        </Example>
        <Note>
          Same nine-step scale as <Link href="/docs/typography">Typography</Link> — nothing here
          introduces a new size. Reach for that page when a size doesn&apos;t fit any of these
          four shapes; reach for these components when it does, so the intent (heading vs. lead vs.
          caption) is visible in the component name rather than buried in a style prop.
        </Note>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "level",
              type: "1 | 2 | 3 | 4",
              defaultValue: "2",
              description: "Heading — picks the size step and the default tag.",
            },
            {
              name: "as",
              type: "ElementType",
              description: "Heading, Text, Muted — override the rendered tag without changing size.",
            },
            {
              name: "size",
              type: `"sm" | "base" | "lg"`,
              defaultValue: `"base"`,
              description: "Text — the font-size step.",
            },
            {
              name: "tone",
              type: `"primary" | "secondary" | "tertiary"`,
              defaultValue: `"secondary"`,
              description: "Text — the semantic text color.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
