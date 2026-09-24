import { Switch } from "@/components/ui/switch";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Switch — Diliman Labs" };

export default function SwitchDocs() {
  return (
    <DocPage
      title="Switch"
      description="An on/off toggle for a setting that takes effect immediately. Use it in settings panels and preference rows; when the choice is only saved once a form is submitted, a Checkbox is the honest control."
    >
      <DocSection
        title="Basic usage"
        description="The label is clickable, and the knob slides between the two states. Label the setting itself — &quot;Two-factor authentication&quot; — rather than the action, since the switch already shows which way it is pointing."
      >
        <Example
          layout="stacked"
          code={`<Switch label="Two-factor authentication" />
<Switch label="Two-factor authentication" defaultChecked />`}
        >
          <Switch label="Two-factor authentication" />
          <Switch label="Two-factor authentication" defaultChecked />
        </Example>
      </DocSection>

      <DocSection
        title="With a description"
        description="A description under the label carries what actually changes when the switch is flipped. Worth adding whenever the setting touches money, access, or anything a merchant would want to be sure about."
      >
        <Example
          layout="stacked"
          code={`<Switch
  label="Two-factor authentication"
  defaultChecked
  description="Ask for a one-time code on every new device."
/>
<Switch
  label="Auto-sweep to settlement account"
  description="Move the available balance to BDO •••• 4417 every banking day at 6:00 PM."
/>`}
        >
          <Switch
            label="Two-factor authentication"
            defaultChecked
            description="Ask for a one-time code on every new device."
          />
          <Switch
            label="Auto-sweep to settlement account"
            description="Move the available balance to BDO •••• 4417 every banking day at 6:00 PM."
          />
        </Example>
      </DocSection>

      <DocSection
        title="Disabled"
        description="Dims the whole row. A disabled switch that stays on is a common case — a policy the merchant cannot turn off — so say who set it in the description."
      >
        <Example
          layout="stacked"
          code={`<Switch label="Transaction alerts" disabled description="Locked by your administrator." />
<Switch label="AMLC screening" disabled defaultChecked description="Required on every payout." />`}
        >
          <Switch
            label="Transaction alerts"
            disabled
            description="Locked by your administrator."
          />
          <Switch
            label="AMLC screening"
            disabled
            defaultChecked
            description="Required on every payout."
          />
        </Example>
      </DocSection>

      <Note>
        Under the hood this is an <code>&lt;input type=&quot;checkbox&quot;&gt;</code> with{" "}
        <code>role=&quot;switch&quot;</code>, so screen readers announce it as on or off rather than
        checked, and Space toggles it natively. Both <code>type</code> and <code>role</code> are
        owned by the component and cannot be overridden.
      </Note>

      <Note>
        Because a switch applies right away, there is no built-in pending state. If saving can fail,
        keep the switch controlled, flip it back on error, and say what happened next to it — never
        leave it showing a value the server did not accept.
      </Note>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "label",
              type: "ReactNode",
              description: "Clickable label beside the track.",
            },
            {
              name: "description",
              type: "ReactNode",
              description:
                "Second line under the label, linked to the input through aria-describedby.",
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
                "Forwarded to the input, minus type and role — checked, defaultChecked, onChange, name, value, aria-label.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
