"use client";

import { useState } from "react";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

const banks: ComboboxOption[] = [
  { value: "bdo", label: "BDO Unibank" },
  { value: "bpi", label: "Bank of the Philippine Islands" },
  { value: "metrobank", label: "Metrobank" },
  { value: "landbank", label: "Land Bank of the Philippines" },
  { value: "unionbank", label: "UnionBank" },
  { value: "rcbc", label: "RCBC", disabled: true },
  { value: "gcash", label: "GCash (e-wallet)" },
];

function ControlledCombobox() {
  const [value, setValue] = useState<string | undefined>("unionbank");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <Combobox label="Receiving bank" options={banks} value={value} onValueChange={setValue} />
      <p style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
        Selected: {value ?? "none"}
      </p>
    </div>
  );
}

export default function ComboboxDocs() {
  return (
    <DocPage
      title="Combobox"
      description="Select's popover and keyboard mechanics, with a filterable text trigger instead of a button. Typing narrows the list; the value still has to be one of the listed options."
    >
      <DocSection
        title="Combobox vs. Select"
        description="Select's trigger is a button — you can't type into it, and it suits a short, fixed list you can scan at a glance. Combobox's trigger is a text input: typing filters the options (typeahead), which is worth the extra interaction once a list is long enough that scanning it isn't the fastest way to find something, like a list of banks."
      >
        <Example
          layout="stacked"
          code={`const banks = [
  { value: "bdo", label: "BDO Unibank" },
  { value: "bpi", label: "Bank of the Philippine Islands" },
  { value: "metrobank", label: "Metrobank" },
  { value: "landbank", label: "Land Bank of the Philippines" },
  { value: "unionbank", label: "UnionBank" },
  { value: "rcbc", label: "RCBC", disabled: true },
  { value: "gcash", label: "GCash (e-wallet)" },
];

<Combobox label="Receiving bank" options={banks} placeholder="Search for a bank…" />`}
        >
          <Combobox label="Receiving bank" options={banks} placeholder="Search for a bank…" />
        </Example>
        <Note>
          This Combobox requires an exact match: typed text that doesn&apos;t match a listed option&apos;s
          label is discarded when the field loses focus, reverting to the last valid selection (or
          clearing, if the box is left empty). It does not accept free text — for anything that should,
          use a plain Input instead.
        </Note>
      </DocSection>

      <DocSection title="Helper text, invalid and disabled">
        <Example
          layout="stacked"
          code={`<Combobox label="Receiving bank" options={banks} helperText="We'll match this against InstaPay's bank list." />
<Combobox label="Receiving bank" options={banks} invalid helperText="Select a receiving bank from the list." />
<Combobox label="Receiving bank" options={banks} disabled defaultValue="bdo" />`}
        >
          <Combobox
            label="Receiving bank"
            options={banks}
            helperText="We'll match this against InstaPay's participating bank list."
          />
          <Combobox
            label="Receiving bank"
            options={banks}
            invalid
            helperText="Select a receiving bank from the list."
          />
          <Combobox label="Receiving bank" options={banks} disabled defaultValue="bdo" />
        </Example>
      </DocSection>

      <DocSection title="Controlled" description="value and onValueChange work exactly like Select's.">
        <Example layout="stacked" code={`<Combobox {...props} value={value} onValueChange={setValue} />`}>
          <ControlledCombobox />
        </Example>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "options",
              type: "{ value, label, disabled? }[]",
              description: "The full candidate list; filtering happens client-side against label text.",
            },
            {
              name: "value / defaultValue",
              type: "string | undefined",
              description: "Controlled or uncontrolled selected option value.",
            },
            {
              name: "onValueChange",
              type: "(value: string | undefined) => void",
              description: "Called on commit — a match on blur/Enter, or undefined when cleared.",
            },
            {
              name: "placeholder",
              type: "string",
              defaultValue: `"Search…"`,
              description: "Shown in the input when nothing is typed or selected.",
            },
            {
              name: "emptyMessage",
              type: "string",
              defaultValue: `"No matches"`,
              description: "Shown in the popover when filtering leaves no options.",
            },
            {
              name: "invalid",
              type: "boolean",
              defaultValue: "false",
              description: "Danger border and helper text color.",
            },
            {
              name: "disabled",
              type: "boolean",
              defaultValue: "false",
              description: "Disables the input entirely.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
