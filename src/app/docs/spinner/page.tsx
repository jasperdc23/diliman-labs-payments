import { Spinner } from "@/components/ui/spinner";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Spinner — Diliman Labs" };

export default function SpinnerDocs() {
  return (
    <DocPage
      title="Spinner"
      description="A standalone busy-indicator for when there's no button to attach a loading state to — a full-panel load, a modal that's mid-request."
    >
      <DocSection title="Sizes">
        <Example layout="row" code={`<Spinner size={14} />\n<Spinner size={20} />\n<Spinner size={32} />`}>
          <Spinner size={14} />
          <Spinner size={20} />
          <Spinner size={32} />
        </Example>
      </DocSection>

      <Note>
        This is the exact treatment Button&apos;s <code>loading</code> state already uses
        (`CircleNotch`, 600ms linear infinite spin) — extracted so anywhere that needs a spinner
        without a surrounding button can use the same one instead of a second spinner design.
        Continuous motion is this kit&apos;s one deliberate, documented exception to &quot;nothing
        animates without a reason&quot;: an ongoing, indeterminate task is exactly the case
        continuous motion is the correct signal for.
      </Note>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "size", type: "number", defaultValue: "20", description: "Pixel size of the icon." },
            {
              name: "label",
              type: "string",
              defaultValue: `"Loading"`,
              description: "Accessible label — a spinner carries no text of its own.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
