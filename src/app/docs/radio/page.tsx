"use client";

import { useState } from "react";
import { Radio, RadioGroup } from "@/components/ui/radio";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

function ControlledRadioGroup() {
  const [rail, setRail] = useState("pesonet");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <RadioGroup legend="Settlement rail" value={rail} onValueChange={setRail}>
        <Radio value="instapay" label="InstaPay" />
        <Radio value="pesonet" label="PESONet" />
        <Radio value="qrph" label="QR Ph" />
      </RadioGroup>
      <p style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>Selected: {rail}</p>
    </div>
  );
}

export default function RadioDocs() {
  return (
    <DocPage
      title="Radio"
      description="One choice out of a small, visible set. Radio is almost always used inside RadioGroup, which supplies the shared name, the selected value, and the fieldset and legend that make the set a single control. For more than about six options, reach for Select instead."
    >
      <DocSection
        title="Basic usage"
        description="Give the group a legend and a defaultValue, and each Radio a value. The group generates the shared input name, so two groups on the same page never collide."
      >
        <Example
          layout="stacked"
          code={`<RadioGroup legend="Settlement rail" defaultValue="instapay">
  <Radio value="instapay" label="InstaPay" />
  <Radio value="pesonet" label="PESONet" />
  <Radio value="qrph" label="QR Ph" />
</RadioGroup>`}
        >
          <RadioGroup legend="Settlement rail" defaultValue="instapay">
            <Radio value="instapay" label="InstaPay" />
            <Radio value="pesonet" label="PESONet" />
            <Radio value="qrph" label="QR Ph" />
          </RadioGroup>
        </Example>
      </DocSection>

      <DocSection
        title="With descriptions"
        description="A description turns each option into a decision the user can actually make. This is where radio earns its space over a dropdown — the trade-offs are all on screen at once."
      >
        <Example
          layout="stacked"
          code={`<RadioGroup legend="Settlement rail" defaultValue="instapay">
  <Radio value="instapay" label="InstaPay" description="Real time, up to ₱50,000 per transfer." />
  <Radio value="pesonet" label="PESONet" description="Batched, credited same banking day." />
  <Radio value="qrph" label="QR Ph" description="Scan to pay at the point of sale." />
</RadioGroup>`}
        >
          <RadioGroup legend="Settlement rail" defaultValue="instapay">
            <Radio
              value="instapay"
              label="InstaPay"
              description="Real time, up to ₱50,000 per transfer."
            />
            <Radio
              value="pesonet"
              label="PESONet"
              description="Batched, credited same banking day."
            />
            <Radio value="qrph" label="QR Ph" description="Scan to pay at the point of sale." />
          </RadioGroup>
        </Example>
      </DocSection>

      <DocSection
        title="Horizontal"
        description="orientation=&quot;horizontal&quot; lays the options out in a row. Keep it for short labels with no descriptions — anything longer wraps badly on narrow screens."
      >
        <Example
          layout="stacked"
          code={`<RadioGroup legend="Statement period" defaultValue="monthly" orientation="horizontal">
  <Radio value="daily" label="Daily" />
  <Radio value="weekly" label="Weekly" />
  <Radio value="monthly" label="Monthly" />
</RadioGroup>`}
        >
          <RadioGroup legend="Statement period" defaultValue="monthly" orientation="horizontal">
            <Radio value="daily" label="Daily" />
            <Radio value="weekly" label="Weekly" />
            <Radio value="monthly" label="Monthly" />
          </RadioGroup>
        </Example>
      </DocSection>

      <DocSection
        title="Invalid"
        description="invalid on the group cascades to every Radio inside it and turns the helper text into error copy. This is the usual shape of the error: the group is what failed validation, not one option."
      >
        <Example
          layout="stacked"
          code={`<RadioGroup legend="Settlement rail" invalid helperText="Choose a rail before continuing.">
  <Radio value="instapay" label="InstaPay" />
  <Radio value="pesonet" label="PESONet" />
</RadioGroup>`}
        >
          <RadioGroup
            legend="Settlement rail"
            invalid
            helperText="Choose a rail before continuing."
          >
            <Radio value="instapay" label="InstaPay" />
            <Radio value="pesonet" label="PESONet" />
          </RadioGroup>
        </Example>
      </DocSection>

      <DocSection
        title="Disabled"
        description="disabled on the group disables the fieldset and every option in it. Disable a single Radio instead when only one choice is unavailable."
      >
        <Example
          layout="stacked"
          code={`<RadioGroup legend="Settlement rail" defaultValue="instapay" disabled>
  <Radio value="instapay" label="InstaPay" />
  <Radio value="pesonet" label="PESONet" />
</RadioGroup>

<RadioGroup legend="Payout speed" defaultValue="standard">
  <Radio value="standard" label="Standard" description="Credited within one banking day." />
  <Radio value="instant" label="Instant" disabled description="Not enabled for this merchant." />
</RadioGroup>`}
        >
          <RadioGroup legend="Settlement rail" defaultValue="instapay" disabled>
            <Radio value="instapay" label="InstaPay" />
            <Radio value="pesonet" label="PESONet" />
          </RadioGroup>

          <RadioGroup legend="Payout speed" defaultValue="standard">
            <Radio
              value="standard"
              label="Standard"
              description="Credited within one banking day."
            />
            <Radio
              value="instant"
              label="Instant"
              disabled
              description="Not enabled for this merchant."
            />
          </RadioGroup>
        </Example>
      </DocSection>

      <DocSection
        title="Controlled"
        description="Pass value and onValueChange to the group rather than to each Radio. The group hands both down through context, so the options need no extra wiring."
      >
        <Example
          layout="stacked"
          code={`const [rail, setRail] = useState("pesonet");

<RadioGroup legend="Settlement rail" value={rail} onValueChange={setRail}>
  <Radio value="instapay" label="InstaPay" />
  <Radio value="pesonet" label="PESONet" />
  <Radio value="qrph" label="QR Ph" />
</RadioGroup>`}
        >
          <ControlledRadioGroup />
        </Example>
      </DocSection>

      <Note>
        These are native radio inputs in a fieldset, so keyboard behavior comes for free: Tab moves
        to the group, then the arrow keys move between options and select as they go. That is why
        preselecting a sensible default matters — an empty group costs a keyboard user an extra
        decision.
      </Note>

      <Note>
        A Radio prefers its own props over the group&apos;s, so <code>disabled</code>,{" "}
        <code>invalid</code> and <code>checked</code> set on one option override whatever the group
        says. Rendering a Radio outside a RadioGroup works, but then you own <code>name</code>,{" "}
        <code>checked</code> and <code>onChange</code> yourself.
      </Note>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "value",
              type: "string",
              description: "Required. The value this option contributes when selected.",
            },
            {
              name: "label",
              type: "ReactNode",
              description: "Clickable label beside the circle.",
            },
            {
              name: "description",
              type: "ReactNode",
              description:
                "Second line under the label, linked to the input through aria-describedby.",
            },
            {
              name: "invalid",
              type: "boolean",
              description: "Overrides the group's invalid state for this option.",
            },
            {
              name: "disabled",
              type: "boolean",
              description: "Overrides the group's disabled state for this option.",
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
                "Forwarded to the input, minus type. name, checked, defaultChecked and onChange fall back to the group when not supplied.",
            },
          ]}
        />
      </DocSection>

      <DocSection title="RadioGroup props">
        <PropsTable
          rows={[
            {
              name: "legend",
              type: "ReactNode",
              description: "Required. The fieldset legend naming the choice.",
            },
            {
              name: "name",
              type: "string",
              defaultValue: "generated",
              description:
                "Shared input name. Set it when the form is submitted natively and the field name matters.",
            },
            {
              name: "value",
              type: "string",
              description: "Controlled selection. Supply it together with onValueChange.",
            },
            {
              name: "defaultValue",
              type: "string",
              description: "Initial selection when the group is uncontrolled.",
            },
            {
              name: "onValueChange",
              type: "(value: string) => void",
              description: "Called with the value of the newly selected option.",
            },
            {
              name: "disabled",
              type: "boolean",
              defaultValue: "false",
              description: "Disables the fieldset and every option in it.",
            },
            {
              name: "invalid",
              type: "boolean",
              defaultValue: "false",
              description:
                "Applies error styling to the group and every option, and sets aria-invalid on the fieldset.",
            },
            {
              name: "helperText",
              type: "ReactNode",
              description:
                "Supporting copy under the options, linked through aria-describedby. Becomes error copy when invalid is set.",
            },
            {
              name: "orientation",
              type: `"vertical" | "horizontal"`,
              defaultValue: `"vertical"`,
              description: "Stacks the options or lays them out in a row.",
            },
            {
              name: "children",
              type: "ReactNode",
              description: "The Radio elements in the group.",
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
