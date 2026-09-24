"use client";

import { Calendar } from "@/components/ui/calendar";
import { DocPage, DocSection, Example, PropsTable } from "@/components/docs/doc-parts";

export default function CalendarDocs() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <DocPage
      title="Calendar"
      description="The same month-grid date math DatePicker uses internally, extracted as a standalone primitive that renders inline on a page instead of behind a text-input trigger."
    >
      <DocSection
        title="Basic usage"
        description="Uncontrolled by default — pass value/onValueChange to control it. Useful anywhere a date needs to stay visible on the page rather than hidden behind a field, e.g. a 'select a settlement date' section of a form."
      >
        <Example code={`<Calendar defaultValue={new Date(2026, 7, 27)} />`}>
          <Calendar defaultValue={new Date(2026, 7, 27)} />
        </Example>
      </DocSection>

      <DocSection
        title="Disabling dates"
        description="disabled takes a predicate rather than a fixed range, so it composes with any rule — no past dates, weekends only, a blocked-out settlement calendar."
      >
        <Example code={`<Calendar disabled={(date) => date < today} />`}>
          <Calendar disabled={(date) => date < today} />
        </Example>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "value", type: "Date | null", description: "Controlled selected date." },
            {
              name: "defaultValue",
              type: "Date | null",
              defaultValue: "null",
              description: "Initial selection when uncontrolled.",
            },
            {
              name: "onValueChange",
              type: "(date: Date) => void",
              description: "Fires when a day is clicked.",
            },
            {
              name: "disabled",
              type: "(date: Date) => boolean",
              description: "Returning true disables that day.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
