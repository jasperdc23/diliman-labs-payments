import { Input } from "@/components/ui/input";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Input — EP Design Kit" };

export default function InputDocs() {
  return (
    <DocPage
      title="Input"
      description="A single-line text field with an optional label and helper text. It forwards every native input attribute, so type, name, required, inputMode and autoComplete all work exactly as you would expect."
    >
      <DocSection
        title="Basic usage"
        description="Pass a label and the field wires up its own htmlFor/id pair. Leave the label off and the field renders bare — give it an aria-label in that case."
      >
        <Example
          layout="stacked"
          code={`<Input label="Email address" placeholder="juan.delacruz@weav.ph" />`}
        >
          <Input label="Email address" placeholder="juan.delacruz@weav.ph" />
        </Example>
      </DocSection>

      <DocSection
        title="Helper text"
        description="Helper text sits under the field and carries the explanation the label is too short for — formats, limits, and where the value ends up."
      >
        <Example
          layout="stacked"
          code={`<Input
  label="Mobile number"
  type="tel"
  placeholder="+63 917 123 4567"
  helperText="We send the one-time code to this number."
/>`}
        >
          <Input
            label="Mobile number"
            type="tel"
            placeholder="+63 917 123 4567"
            helperText="We send the one-time code to this number."
          />
        </Example>
      </DocSection>

      <DocSection
        title="Invalid"
        description="invalid restyles the border and the helper text, and sets aria-invalid on the field. Pair it with helper text that says how to fix the value — an error border on its own tells the user nothing."
      >
        <Example
          layout="stacked"
          code={`<Input
  label="Payout amount"
  invalid
  defaultValue="₱0.00"
  helperText="Enter an amount of at least ₱100.00."
/>`}
        >
          <Input
            label="Payout amount"
            invalid
            defaultValue="₱0.00"
            helperText="Enter an amount of at least ₱100.00."
          />
        </Example>
      </DocSection>

      <DocSection
        title="Disabled and read-only"
        description="Disabled fields are skipped by the tab order and are not submitted with the form. When the value still matters to the submission, prefer readOnly."
      >
        <Example
          layout="stacked"
          code={`<Input label="Merchant ID" disabled defaultValue="EPY-004821" />
<Input
  label="Settlement account"
  readOnly
  defaultValue="BDO •••• 4417"
  helperText="Change this from Settings to keep the audit trail intact."
/>`}
        >
          <Input label="Merchant ID" disabled defaultValue="EPY-004821" />
          <Input
            label="Settlement account"
            readOnly
            defaultValue="BDO •••• 4417"
            helperText="Change this from Settings to keep the audit trail intact."
          />
        </Example>
      </DocSection>

      <DocSection
        title="Native attributes"
        description="Everything on the underlying element is available. Use type and inputMode together so mobile keyboards match the value being asked for."
      >
        <Example
          layout="stacked"
          code={`<Input
  label="Reference number"
  inputMode="numeric"
  maxLength={12}
  placeholder="270820261234"
  helperText="12 digits, printed on the InstaPay receipt."
/>`}
        >
          <Input
            label="Reference number"
            inputMode="numeric"
            maxLength={12}
            placeholder="270820261234"
            helperText="12 digits, printed on the InstaPay receipt."
          />
        </Example>
      </DocSection>

      <Note>
        Hover, focus and placeholder styling are plain CSS states, so there are no props for them.
        The field stretches to fill its container — control the width from the layout around it
        rather than from the component.
      </Note>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "label",
              type: "string",
              description:
                "Text label rendered above the field and linked to it. Omit it only when an aria-label is supplied.",
            },
            {
              name: "helperText",
              type: "string",
              description:
                "Supporting copy under the field. Turns into error copy when invalid is set.",
            },
            {
              name: "invalid",
              type: "boolean",
              defaultValue: "false",
              description:
                "Applies the error styling and sets aria-invalid on the field and the helper text.",
            },
            {
              name: "id",
              type: "string",
              description:
                "Overrides the generated id. Supply it when an external label or description points at the field.",
            },
            {
              name: "className",
              type: "string",
              description: "Appended to the input element, not the wrapper.",
            },
            {
              name: "...props",
              type: "InputHTMLAttributes<HTMLInputElement>",
              description:
                "Every native input attribute — type, value, defaultValue, onChange, disabled, readOnly, required, placeholder, maxLength, inputMode, autoComplete.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
