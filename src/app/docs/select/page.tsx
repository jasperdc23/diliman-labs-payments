"use client";

import { useState } from "react";
import { Select, type SelectOption } from "@/components/ui/select";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

const rails: SelectOption[] = [
  { value: "instapay", label: "InstaPay" },
  { value: "pesonet", label: "PESONet" },
  { value: "qrph", label: "QR Ph" },
  { value: "swift", label: "SWIFT", disabled: true },
  { value: "cash", label: "Over the counter" },
];

function ControlledSelect() {
  const [value, setValue] = useState("qrph");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <Select label="Settlement rail" options={rails} value={value} onValueChange={setValue} />
      <p style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
        Selected: {value}
      </p>
    </div>
  );
}

export default function SelectDocs() {
  return (
    <DocPage
      title="Select"
      description="A single-choice dropdown built on the ARIA combobox pattern rather than a native <select>, so the option list can be styled and can carry a check mark on the current choice. Use it for a short, fixed set of options; for anything long enough to need typeahead, use a search field instead."
    >
      <DocSection
        title="Basic usage"
        description="Options are data, not children: pass an array of { value, label } and the component renders the list."
      >
        <Example
          layout="stacked"
          code={`const rails = [
  { value: "instapay", label: "InstaPay" },
  { value: "pesonet", label: "PESONet" },
  { value: "qrph", label: "QR Ph" },
  { value: "swift", label: "SWIFT", disabled: true },
  { value: "cash", label: "Over the counter" },
];

<Select label="Settlement rail" options={rails} />`}
        >
          <Select label="Settlement rail" options={rails} />
        </Example>
      </DocSection>

      <DocSection
        title="Placeholder and default value"
        description="With nothing selected the trigger shows the placeholder in the muted text color. defaultValue preselects an option without making the component controlled."
      >
        <Example
          layout="stacked"
          code={`<Select label="Settlement rail" options={rails} placeholder="Choose a rail" />
<Select label="Settlement rail" options={rails} defaultValue="pesonet" />`}
        >
          <Select label="Settlement rail" options={rails} placeholder="Choose a rail" />
          <Select label="Settlement rail" options={rails} defaultValue="pesonet" />
        </Example>
      </DocSection>

      <DocSection
        title="Helper text"
        description="Helper text is wired to the trigger through aria-describedby, so screen readers announce it along with the current selection."
      >
        <Example
          layout="stacked"
          code={`<Select
  label="Settlement rail"
  options={rails}
  defaultValue="instapay"
  helperText="Real-time rails settle within seconds."
/>`}
        >
          <Select
            label="Settlement rail"
            options={rails}
            defaultValue="instapay"
            helperText="Real-time rails settle within seconds."
          />
        </Example>
      </DocSection>

      <DocSection
        title="Invalid and disabled"
        description="invalid marks the trigger with aria-invalid and turns the helper text into error copy. A disabled select cannot be opened by pointer or keyboard."
      >
        <Example
          layout="stacked"
          code={`<Select
  label="Settlement rail"
  options={rails}
  invalid
  helperText="Pick a settlement rail."
/>
<Select label="Settlement rail" options={rails} disabled defaultValue="instapay" />`}
        >
          <Select
            label="Settlement rail"
            options={rails}
            invalid
            helperText="Pick a settlement rail."
          />
          <Select label="Settlement rail" options={rails} disabled defaultValue="instapay" />
        </Example>
      </DocSection>

      <DocSection
        title="Disabled options"
        description="Mark an individual option with disabled to keep it visible but unselectable — useful when a rail exists in the product but is not enabled for this merchant. Keyboard navigation skips over it."
      >
        <Example layout="stacked" code={`{ value: "swift", label: "SWIFT", disabled: true }`}>
          <Select label="Settlement rail" options={rails} defaultValue="cash" />
        </Example>
      </DocSection>

      <DocSection
        title="Controlled"
        description="Pass value with onValueChange to drive the selection from outside — for a form library, or when one field depends on another."
      >
        <Example
          layout="stacked"
          code={`const [value, setValue] = useState("qrph");

<Select label="Settlement rail" options={rails} value={value} onValueChange={setValue} />`}
        >
          <ControlledSelect />
        </Example>
      </DocSection>

      <Note>
        The trigger is a button with <code>role=&quot;combobox&quot;</code>,{" "}
        <code>aria-haspopup=&quot;listbox&quot;</code> and <code>aria-expanded</code>; the popover is
        a listbox that takes focus on open and tracks the active option with{" "}
        <code>aria-activedescendant</code>. Enter, Space and ArrowDown open the list at the current
        selection, ArrowUp opens it at the last option, and Home opens it at the first. Inside the
        list, arrows move, Home and End jump to the ends, Enter or Space commits, Escape closes and
        returns focus to the trigger, and Tab closes without stealing focus back. Clicking outside
        closes the list and leaves the selection alone.
      </Note>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "options",
              type: "SelectOption[]",
              description:
                "The list to render, where SelectOption is { value: string; label: string; disabled?: boolean }.",
            },
            {
              name: "label",
              type: "ReactNode",
              description:
                "Label above the trigger. It is linked to the trigger through aria-labelledby, so it is read before the current value.",
            },
            {
              name: "value",
              type: "string",
              description: "Controlled selection. Supply it together with onValueChange.",
            },
            {
              name: "defaultValue",
              type: "string",
              description: "Initial selection when the component is uncontrolled.",
            },
            {
              name: "onValueChange",
              type: "(value: string) => void",
              description: "Called with the value of the option the user committed to.",
            },
            {
              name: "placeholder",
              type: "string",
              defaultValue: `"Select an option"`,
              description: "Shown on the trigger while nothing is selected.",
            },
            {
              name: "helperText",
              type: "ReactNode",
              description:
                "Supporting copy under the field, linked through aria-describedby. Becomes error copy when invalid is set.",
            },
            {
              name: "invalid",
              type: "boolean",
              defaultValue: "false",
              description: "Applies error styling and sets aria-invalid on the trigger.",
            },
            {
              name: "disabled",
              type: "boolean",
              defaultValue: "false",
              description: "Disables the trigger so the list cannot be opened.",
            },
            {
              name: "id",
              type: "string",
              description:
                "Overrides the generated id, which also seeds the listbox, label and helper text ids.",
            },
            {
              name: "className",
              type: "string",
              description: "Appended to the outer wrapper.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
