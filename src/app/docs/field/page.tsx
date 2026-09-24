import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Field — EP Design Kit" };

export default function FieldDocs() {
  return (
    <DocPage
      title="Field"
      description="Generalizes the label + control + helper/error text wiring that CheckboxGroup already does for a set of checkboxes, but for a single arbitrary control — a Select, a Slider, a custom widget, anything."
    >
      <DocSection
        title="Basic usage"
        description="Field lays out the label above the control and the description below it, and links them with aria-describedby."
      >
        <Example
          layout="stacked"
          code={`<Field label="Merchant name" description="As it appears on the settlement report.">
  <Input placeholder="Juan's Sari-Sari Store" />
</Field>`}
        >
          <Field label="Merchant name" description="As it appears on the settlement report.">
            <Input placeholder="Juan's Sari-Sari Store" />
          </Field>
        </Example>
      </DocSection>

      <DocSection
        title="Required and invalid"
        description="required adds an asterisk to the label. error replaces the description with error copy, sets aria-invalid on the control, and gives the message role=&quot;alert&quot;."
      >
        <Example
          layout="stacked"
          code={`<Field label="Settlement account" required>
  <Input placeholder="0123456789" />
</Field>
<Field label="Amount" error="Enter an amount greater than ₱0.00.">
  <Input defaultValue="0" />
</Field>`}
        >
          <Field label="Settlement account" required>
            <Input placeholder="0123456789" />
          </Field>
          <Field label="Amount" error="Enter an amount greater than ₱0.00.">
            <Input defaultValue="0" />
          </Field>
        </Example>
      </DocSection>

      <Note>
        Field takes exactly one child element and clones it with <code>React.cloneElement</code>,
        injecting <code>id</code>, <code>aria-describedby</code>, <code>aria-invalid</code> and{" "}
        <code>aria-required</code> directly onto it — nothing is passed through context or inferred
        from the DOM. That means the child only needs to be a normal element that reads those
        props (any native form element, or any of this kit&apos;s form controls); it does not need
        a Field-specific API. If a custom control ignores those props internally (for example, it
        derives its own id instead of reading the one it&apos;s given), wire its label and
        description manually instead of relying on Field to do it invisibly.
      </Note>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "label",
              type: "ReactNode",
              description: "The field's label text.",
            },
            {
              name: "children",
              type: "ReactElement",
              description:
                "A single control. Field clones it and injects id, aria-describedby, aria-invalid and aria-required.",
            },
            {
              name: "description",
              type: "ReactNode",
              description: "Helper copy under the control. Hidden when error is set.",
            },
            {
              name: "error",
              type: "ReactNode",
              description: "Error copy under the control. Sets aria-invalid on the control.",
            },
            {
              name: "required",
              type: "boolean",
              defaultValue: "false",
              description: "Adds an asterisk to the label and aria-required to the control.",
            },
            {
              name: "id",
              type: "string",
              description: "Overrides the generated id shared by the label and the control.",
            },
            {
              name: "className",
              type: "string",
              description: "Appended to the field wrapper.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
