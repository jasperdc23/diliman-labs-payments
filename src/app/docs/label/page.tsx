import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Label — EP Design Kit" };

export default function LabelDocs() {
  return (
    <DocPage
      title="Label"
      description="A standalone, styled <label>. Most controls in this kit (Input, Checkbox, Radio, Switch, Select, DatePicker) already render their own label from a label prop — reach for Label only when composing a custom or third-party control that doesn't."
    >
      <DocSection
        title="Basic usage"
        description="Pass htmlFor pointing at the control's id, exactly like a native label."
      >
        <Example
          layout="stacked"
          code={`<Label htmlFor="merchant-name">Merchant name</Label>
<input id="merchant-name" />`}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <Label htmlFor="merchant-name-demo">Merchant name</Label>
            <Input id="merchant-name-demo" placeholder="Juan's Sari-Sari Store" />
          </div>
        </Example>
      </DocSection>

      <DocSection
        title="Required"
        description="required appends a trailing asterisk. Most fields in a form are required, so flagging the exception — the few that are required — reads faster than marking every optional one."
      >
        <Example
          layout="stacked"
          code={`<Label htmlFor="settlement-account" required>Settlement account</Label>
<input id="settlement-account" />`}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <Label htmlFor="settlement-account-demo" required>
              Settlement account
            </Label>
            <Input id="settlement-account-demo" placeholder="0123456789" />
          </div>
        </Example>
      </DocSection>

      <Note>
        Existing form controls already take a <code>label</code> prop and wire it up internally —
        don&apos;t wrap an <code>Input</code> or <code>Checkbox</code> in a separate{" "}
        <code>Label</code> as well, that produces two labels. Use <code>Label</code> directly only
        for a bare native element or a custom widget, or reach for <code>Field</code> when you also
        need helper or error text tied in.
      </Note>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "children",
              type: "ReactNode",
              description: "The label text.",
            },
            {
              name: "htmlFor",
              type: "string",
              description: "The id of the control this label describes.",
            },
            {
              name: "required",
              type: "boolean",
              defaultValue: "false",
              description: "Appends a trailing asterisk indicating the control is required.",
            },
            {
              name: "...props",
              type: "LabelHTMLAttributes<HTMLLabelElement>",
              description: "Forwarded to the underlying <label>.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
