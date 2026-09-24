import { Checkbox, CheckboxGroup } from "@/components/ui/checkbox";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Checkbox — EP Design Kit" };

export default function CheckboxDocs() {
  return (
    <DocPage
      title="Checkbox"
      description="A native checkbox with a drawn box, an optional description line, and an indeterminate state for parent rows. Use it for independent yes/no choices; when exactly one option out of several must be picked, use Radio instead."
    >
      <DocSection
        title="Basic usage"
        description="The label is clickable — it is a real <label> tied to the input, so the hit area covers the text as well as the box."
      >
        <Example
          layout="stacked"
          code={`<Checkbox label="Enable transaction alerts" />
<Checkbox label="Enable transaction alerts" defaultChecked />`}
        >
          <Checkbox label="Enable transaction alerts" />
          <Checkbox label="Enable transaction alerts" defaultChecked />
        </Example>
      </DocSection>

      <DocSection
        title="With a description"
        description="A description sits under the label in muted text and is wired to the input through aria-describedby. Use it for the consequence of ticking the box, not a restatement of the label."
      >
        <Example
          layout="stacked"
          code={`<Checkbox
  label="Email receipts"
  description="Send a receipt to the payer whenever a QR Ph payment clears."
/>`}
        >
          <Checkbox
            label="Email receipts"
            description="Send a receipt to the payer whenever a QR Ph payment clears."
          />
        </Example>
      </DocSection>

      <DocSection
        title="Indeterminate"
        description="For a parent checkbox whose children are partly selected — a select-all row above a table, for instance. It is a visual and DOM state rather than a third value, so the box still submits as checked or unchecked."
      >
        <Example layout="stacked" code={`<Checkbox label="Select all channels" indeterminate />`}>
          <Checkbox label="Select all channels" indeterminate />
        </Example>
      </DocSection>

      <DocSection
        title="Invalid"
        description="invalid restyles the box and sets aria-invalid. It is most often reached for on a single required consent checkbox, where a description doubles as the error message."
      >
        <Example
          layout="stacked"
          code={`<Checkbox
  label="I accept the terms"
  invalid
  description="You must accept the terms to continue."
/>`}
        >
          <Checkbox
            label="I accept the terms"
            invalid
            description="You must accept the terms to continue."
          />
        </Example>
      </DocSection>

      <DocSection
        title="Disabled"
        description="Dims the whole row, label included. Say why in the description — a greyed-out control with no explanation reads as a bug."
      >
        <Example
          layout="stacked"
          code={`<Checkbox label="Push notifications" disabled description="Locked by your administrator." />
<Checkbox label="Email receipts" disabled defaultChecked />`}
        >
          <Checkbox
            label="Push notifications"
            disabled
            description="Locked by your administrator."
          />
          <Checkbox label="Email receipts" disabled defaultChecked />
        </Example>
      </DocSection>

      <DocSection
        title="Grouped"
        description="CheckboxGroup wraps the set in a fieldset and legend, which is what tells assistive technology the boxes belong together. Its helperText covers the whole group."
      >
        <Example
          layout="stacked"
          code={`<CheckboxGroup legend="Notification channels" helperText="Pick at least one.">
  <Checkbox label="Email" defaultChecked description="Delivered to your work address." />
  <Checkbox label="SMS" />
  <Checkbox label="Push" disabled description="Requires the mobile app." />
</CheckboxGroup>`}
        >
          <CheckboxGroup legend="Notification channels" helperText="Pick at least one.">
            <Checkbox label="Email" defaultChecked description="Delivered to your work address." />
            <Checkbox label="SMS" />
            <Checkbox label="Push" disabled description="Requires the mobile app." />
          </CheckboxGroup>
        </Example>
      </DocSection>

      <DocSection
        title="Invalid group"
        description="Setting invalid on the group turns its helper text into error copy. It does not cascade to the boxes inside, so set invalid on an individual Checkbox as well if that one is the problem."
      >
        <Example
          layout="stacked"
          code={`<CheckboxGroup legend="Settlement rails" invalid helperText="Enable at least one rail.">
  <Checkbox label="InstaPay" />
  <Checkbox label="PESONet" />
  <Checkbox label="QR Ph" />
</CheckboxGroup>`}
        >
          <CheckboxGroup legend="Settlement rails" invalid helperText="Enable at least one rail.">
            <Checkbox label="InstaPay" />
            <Checkbox label="PESONet" />
            <Checkbox label="QR Ph" />
          </CheckboxGroup>
        </Example>
      </DocSection>

      <Note>
        The input is a real <code>&lt;input type=&quot;checkbox&quot;&gt;</code> underneath, so
        checked state, form submission, and Space to toggle are all native. Every native attribute
        is forwarded, which means <code>name</code>, <code>value</code>, <code>required</code>,{" "}
        <code>checked</code> and <code>onChange</code> behave exactly as they do on a bare checkbox.
      </Note>

      <Note>
        <code>disabled</code> on CheckboxGroup disables every checkbox inside it, because the
        group renders a real <code>&lt;fieldset disabled&gt;</code> and the browser cascades that
        natively. <code>invalid</code> is different: it marks the group as a whole via{" "}
        <code>aria-invalid</code> and ties <code>helperText</code> to it, but it does not mark each
        box — an invalid <em>set</em> of choices usually means no single box is the one at fault.
      </Note>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "label",
              type: "ReactNode",
              description: "Clickable label beside the box.",
            },
            {
              name: "description",
              type: "ReactNode",
              description:
                "Second line under the label, linked to the input through aria-describedby.",
            },
            {
              name: "indeterminate",
              type: "boolean",
              defaultValue: "false",
              description:
                "Sets the DOM indeterminate property and swaps the check mark for a dash. Does not change the checked value.",
            },
            {
              name: "invalid",
              type: "boolean",
              defaultValue: "false",
              description: "Applies error styling and sets aria-invalid.",
            },
            {
              name: "disabled",
              type: "boolean",
              defaultValue: "false",
              description: "Dims the row and blocks interaction.",
            },
            {
              name: "id",
              type: "string",
              description: "Overrides the generated id shared by the input, label and description.",
            },
            {
              name: "className",
              type: "string",
              description: "Appended to the row wrapper.",
            },
            {
              name: "...props",
              type: "InputHTMLAttributes<HTMLInputElement>",
              description:
                "Forwarded to the input, minus type — checked, defaultChecked, onChange, name, value, required.",
            },
          ]}
        />
      </DocSection>

      <DocSection title="CheckboxGroup props">
        <PropsTable
          rows={[
            {
              name: "legend",
              type: "ReactNode",
              description: "Required. The fieldset legend naming the group.",
            },
            {
              name: "helperText",
              type: "ReactNode",
              description:
                "Supporting copy under the group, tied to it via aria-describedby.",
            },
            {
              name: "invalid",
              type: "boolean",
              defaultValue: "false",
              description:
                "Marks the group invalid and turns the helper text into error copy. Does not mark individual checkboxes.",
            },
            {
              name: "disabled",
              type: "boolean",
              defaultValue: "false",
              description: "Disables every checkbox in the group via the fieldset.",
            },
            {
              name: "children",
              type: "ReactNode",
              description: "The Checkbox elements in the group.",
            },
            {
              name: "className",
              type: "string",
              description: "Appended to the fieldset.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
