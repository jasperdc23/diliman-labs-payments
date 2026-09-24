"use client";

import { useState } from "react";
import { DatePicker, formatDate } from "@/components/ui/date-picker";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

function ControlledDatePicker() {
  const [date, setDate] = useState<Date | null>(new Date(2026, 7, 27));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <DatePicker label="Settlement date" value={date} onValueChange={setDate} />
      <p style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
        Selected: {date ? formatDate(date) : "—"}
      </p>
    </div>
  );
}

export default function DatePickerDocs() {
  return (
    <DocPage
      title="Date picker"
      description="A read-only text field paired with a month calendar. Values are plain Date objects and render as 27 Aug 2026, the format used throughout this kit. Reach for it whenever a single calendar day has to be chosen — a settlement date, a cut-off, a statement period start."
    >
      <DocSection
        title="Basic usage"
        description="With no value the field shows its placeholder. Clicking it, or the calendar button, opens the popover at the current month."
      >
        <Example layout="stacked" code={`<DatePicker label="Settlement date" />`}>
          <DatePicker label="Settlement date" />
        </Example>
      </DocSection>

      <DocSection
        title="With a value"
        description="Pass a Date to defaultValue to preselect a day. The calendar opens on the month of the selection rather than on today."
      >
        <Example
          layout="stacked"
          code={`<DatePicker label="Settlement date" defaultValue={new Date(2026, 7, 27)} />`}
        >
          <DatePicker label="Settlement date" defaultValue={new Date(2026, 7, 27)} />
        </Example>
      </DocSection>

      <DocSection
        title="Helper text"
        description="Helper text is linked to the field through aria-describedby. Use it for the rule behind the date rather than restating the format."
      >
        <Example
          layout="stacked"
          code={`<DatePicker
  label="Settlement date"
  defaultValue={new Date(2026, 7, 27)}
  helperText="Cut-off is 5:00 PM on the selected day."
/>`}
        >
          <DatePicker
            label="Settlement date"
            defaultValue={new Date(2026, 7, 27)}
            helperText="Cut-off is 5:00 PM on the selected day."
          />
        </Example>
      </DocSection>

      <DocSection
        title="Bounded range"
        description="minDate and maxDate disable the days outside the window. Both are compared at day granularity, so the time on the Date you pass is ignored."
      >
        <Example
          layout="stacked"
          code={`<DatePicker
  label="Settlement date"
  defaultValue={new Date(2026, 7, 27)}
  minDate={new Date(2026, 7, 10)}
  maxDate={new Date(2026, 8, 10)}
  helperText="Days outside 10 Aug 2026 – 10 Sep 2026 are unavailable."
/>`}
        >
          <DatePicker
            label="Settlement date"
            defaultValue={new Date(2026, 7, 27)}
            minDate={new Date(2026, 7, 10)}
            maxDate={new Date(2026, 8, 10)}
            helperText="Days outside 10 Aug 2026 – 10 Sep 2026 are unavailable."
          />
        </Example>
      </DocSection>

      <DocSection
        title="Invalid and disabled"
        description="invalid styles the field and sets aria-invalid. A disabled picker cannot be opened from either the input or the calendar button."
      >
        <Example
          layout="stacked"
          code={`<DatePicker label="Settlement date" invalid helperText="Select a settlement date." />
<DatePicker label="Settlement date" disabled defaultValue={new Date(2026, 7, 27)} />`}
        >
          <DatePicker label="Settlement date" invalid helperText="Select a settlement date." />
          <DatePicker label="Settlement date" disabled defaultValue={new Date(2026, 7, 27)} />
        </Example>
      </DocSection>

      <DocSection
        title="Controlled"
        description="Pass value with onValueChange to own the date. value accepts null for an empty field, which is how you clear it — the component itself has no clear button."
      >
        <Example
          layout="stacked"
          code={`const [date, setDate] = useState<Date | null>(new Date(2026, 7, 27));

<DatePicker label="Settlement date" value={date} onValueChange={setDate} />`}
        >
          <ControlledDatePicker />
        </Example>
      </DocSection>

      <Note>
        The text input is <code>readOnly</code> on purpose — dates are chosen from the calendar, not
        typed, so there is no parsing to get wrong. Clicking it, or pressing Enter, Space or
        ArrowDown, toggles the calendar; Escape closes it and returns focus to the input. The
        popover is a <code>role=&quot;dialog&quot;</code> with{" "}
        <code>aria-modal=&quot;false&quot;</code>, so focus is not trapped and Tab walks through the
        month controls and days. Each day button is labeled with its full date, and the month
        heading is an <code>aria-live</code> region so month changes are announced.
      </Note>

      <Note>
        <code>formatDate</code> is exported alongside the component. Use it anywhere a date has to
        match the picker&apos;s display, such as a summary line or a confirmation screen.
      </Note>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "label",
              type: "ReactNode",
              description: "Label above the field, linked to the input.",
            },
            {
              name: "value",
              type: "Date | null",
              description:
                "Controlled selection; null renders an empty field. Supply it together with onValueChange.",
            },
            {
              name: "defaultValue",
              type: "Date | null",
              defaultValue: "null",
              description: "Initial selection when the component is uncontrolled.",
            },
            {
              name: "onValueChange",
              type: "(date: Date) => void",
              description:
                "Called with the chosen day, normalized to midnight local time. Not called on close or clear.",
            },
            {
              name: "placeholder",
              type: "string",
              defaultValue: `"Pick a date"`,
              description: "Shown in the field while nothing is selected.",
            },
            {
              name: "helperText",
              type: "ReactNode",
              description:
                "Supporting copy under the field, linked through aria-describedby. Becomes error copy when invalid is set.",
            },
            {
              name: "minDate",
              type: "Date",
              description: "Earliest selectable day. Days before it are disabled in the grid.",
            },
            {
              name: "maxDate",
              type: "Date",
              description: "Latest selectable day. Days after it are disabled in the grid.",
            },
            {
              name: "invalid",
              type: "boolean",
              defaultValue: "false",
              description: "Applies error styling and sets aria-invalid on the input.",
            },
            {
              name: "disabled",
              type: "boolean",
              defaultValue: "false",
              description: "Disables the input and the calendar button.",
            },
            {
              name: "id",
              type: "string",
              description:
                "Overrides the generated id, which also seeds the calendar dialog and helper text ids.",
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
