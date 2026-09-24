import { Progress } from "@/components/ui/progress";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Progress — EP Design Kit" };

export default function ProgressDocs() {
  return (
    <DocPage
      title="Progress"
      description="A determinate bar for a known 0–100% quantity — an upload, a verification step, a settlement running to completion."
    >
      <DocSection
        title="Variants"
        description="Accent by default; a status color when the number itself carries meaning, like storage nearing its limit."
      >
        <Example
          layout="stacked"
          code={`<Progress value={65} variant="accent" label="Upload progress" />
<Progress value={90} variant="success" label="KYC verification" />
<Progress value={70} variant="warning" label="Storage used" />
<Progress value={15} variant="danger" label="Disputed amount" />`}
        >
          <div className="flex w-full flex-col gap-4">
            <Progress value={65} variant="accent" label="Upload progress" />
            <Progress value={90} variant="success" label="KYC verification" />
            <Progress value={70} variant="warning" label="Storage used" />
            <Progress value={15} variant="danger" label="Disputed amount" />
          </div>
        </Example>
      </DocSection>

      <DocSection
        title="Indeterminate"
        description="For a duration that isn't known up front, like a page still loading. It loops continuously — the kit's motion rule is one exception at a time for exactly this reason: a busy state genuinely needs continuous motion to signal 'still working,' the same justification as Spinner and Button's loading icon."
      >
        <Example layout="stacked" code={`<Progress indeterminate label="Loading settlement report" />`}>
          <Progress indeterminate label="Loading settlement report" />
        </Example>
      </DocSection>

      <Note>
        The fill never animates <code>width</code> directly — it&apos;s a full-width inner
        element scaled with <code>transform: scaleX(value / max)</code> and{" "}
        <code>transform-origin: left</code>, keeping the kit&apos;s transform/opacity/color-only
        motion rule intact instead of triggering layout on every value change.
      </Note>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "value", type: "number", defaultValue: "0", description: "Current value." },
            { name: "min", type: "number", defaultValue: "0", description: "Minimum value." },
            { name: "max", type: "number", defaultValue: "100", description: "Maximum value." },
            {
              name: "variant",
              type: `"accent" | "success" | "warning" | "danger"`,
              defaultValue: `"accent"`,
              description: "Fill color.",
            },
            {
              name: "indeterminate",
              type: "boolean",
              defaultValue: "false",
              description: "Renders a looping fill instead of a fixed value.",
            },
            { name: "label", type: "string", description: "Accessible label for the progressbar role." },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
