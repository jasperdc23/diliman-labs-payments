import { Skeleton } from "@/components/ui/skeleton";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Skeleton — EP Design Kit" };

export default function SkeletonDocs() {
  return (
    <DocPage
      title="Skeleton"
      description="A placeholder block that stands in for text, an avatar, or a card while real content loads."
    >
      <DocSection title="Shapes" description="Three presets cover most layouts; width/height override a preset when needed.">
        <Example
          layout="stacked"
          code={`<Skeleton shape="text" />
<Skeleton shape="text" width="70%" />
<Skeleton shape="avatar" />
<Skeleton shape="card" />`}
        >
          <div className="flex w-full max-w-xs flex-col gap-3">
            <Skeleton shape="text" />
            <Skeleton shape="text" width="70%" />
            <Skeleton shape="avatar" />
            <Skeleton shape="card" />
          </div>
        </Example>
      </DocSection>

      <DocSection title="Composed row" description="Stack presets to mirror the shape of the content that's loading.">
        <Example
          code={`<div className="flex items-center gap-3">
  <Skeleton shape="avatar" />
  <div className="flex flex-1 flex-col gap-2">
    <Skeleton shape="text" width="40%" />
    <Skeleton shape="text" width="70%" />
  </div>
</div>`}
        >
          <div className="flex w-full max-w-xs items-center gap-3">
            <Skeleton shape="avatar" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton shape="text" width="40%" />
              <Skeleton shape="text" width="70%" />
            </div>
          </div>
        </Example>
      </DocSection>

      <Note>
        The pulse (opacity oscillation, not a moving gradient sweep) loops continuously with no
        user action behind it — on its face the kind of motion this kit&apos;s rules warn
        against. It gets the same pass as Spinner&apos;s continuous spin: a loading placeholder
        communicates &quot;still loading,&quot; not decoration, so the exception applies for the
        same reason.
      </Note>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "shape",
              type: `"text" | "avatar" | "card" | "block"`,
              defaultValue: `"text"`,
              description: "Preset size and radius.",
            },
            { name: "width", type: "string | number", description: "Overrides the preset width." },
            { name: "height", type: "string | number", description: "Overrides the preset height." },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
