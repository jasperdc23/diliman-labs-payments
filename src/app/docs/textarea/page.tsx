import { Textarea } from "@/components/ui/textarea";
import { DocPage, DocSection, Example, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Textarea — Diliman Labs" };

export default function TextareaDocs() {
  return (
    <DocPage
      title="Textarea"
      description="A multi-line counterpart to Input. Same label/helperText/invalid/disabled shape, so a form can swap one for the other without touching anything around it."
    >
      <DocSection
        title="Basic usage"
        description="rows sets the starting height; the person can still drag it taller by default."
      >
        <Example
          layout="stacked"
          code={`<Textarea
  label="Dispute notes"
  placeholder="Describe what happened with this transaction…"
/>`}
        >
          <Textarea label="Dispute notes" placeholder="Describe what happened with this transaction…" />
        </Example>
      </DocSection>

      <DocSection
        title="Resize, helper text and invalid"
        description={`resize="none" removes the drag handle for spots where a taller box would break the layout. Vertical-only is the default everywhere else — horizontal resize isn't offered, since a widening textarea breaks the columns around it.`}
      >
        <Example
          layout="stacked"
          code={`<Textarea label="Notes" resize="none" rows={3} helperText="Fixed height." />
<Textarea label="Notes" invalid helperText="Notes are required to file a dispute." />
<Textarea label="Notes" disabled defaultValue="This dispute has already been submitted." />`}
        >
          <Textarea label="Fixed height" resize="none" rows={3} helperText="Can't be resized." />
          <Textarea label="Invalid" invalid helperText="Notes are required to file a dispute." />
          <Textarea
            label="Disabled"
            disabled
            defaultValue="This dispute has already been submitted for review."
          />
        </Example>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "label",
              type: "string",
              description: "Label rendered above the field.",
            },
            {
              name: "helperText",
              type: "string",
              description: "Supporting copy below the field; turns danger-colored when invalid.",
            },
            {
              name: "invalid",
              type: "boolean",
              defaultValue: "false",
              description: "Danger border and helper text color.",
            },
            {
              name: "rows",
              type: "number",
              defaultValue: "4",
              description: "Starting visible height, in text rows.",
            },
            {
              name: "resize",
              type: `"vertical" | "none"`,
              defaultValue: `"vertical"`,
              description: "Whether the person can drag the box taller. Horizontal resize is never offered.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
