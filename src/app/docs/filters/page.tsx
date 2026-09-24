"use client";

import { useState } from "react";
import { ListBullets, SquaresFour } from "@phosphor-icons/react/ssr";
import { FilterBar, SegmentedControl, type ActiveFilter } from "@/components/ui/filters";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

const initialFilters: ActiveFilter[] = [
  { id: "rail", label: "Rail", value: "InstaPay" },
  { id: "status", label: "Status", value: "Pending" },
  { id: "range", label: "Range", value: "01–27 Aug 2026" },
  { id: "merchant", label: "Merchant", value: "Bayani Mart" },
];

const filtersSnippet = `const initialFilters: ActiveFilter[] = [
  { id: "rail", label: "Rail", value: "InstaPay" },
  { id: "status", label: "Status", value: "Pending" },
  { id: "range", label: "Range", value: "01–27 Aug 2026" },
  { id: "merchant", label: "Merchant", value: "Bayani Mart" },
];`;

function BasicFilterBar() {
  const [filters, setFilters] = useState(initialFilters);

  return (
    <FilterBar
      filters={filters}
      onRemove={(id) => setFilters((current) => current.filter((f) => f.id !== id))}
      onClearAll={() => setFilters(initialFilters)}
      resultCount={`${filters.length === 0 ? "1,284" : "312"} transactions`}
    />
  );
}

function CombinedFilterBar() {
  const [filters, setFilters] = useState(initialFilters.slice(0, 2));
  const [view, setView] = useState("list");

  return (
    <div className="flex w-full flex-col" style={{ gap: "var(--space-3)" }}>
      <FilterBar
        filters={filters}
        onRemove={(id) => setFilters((current) => current.filter((f) => f.id !== id))}
        onClearAll={() => setFilters([])}
        resultCount={`${filters.length === 0 ? "1,284" : "312"} transactions`}
      >
        <SegmentedControl
          label="Result layout"
          value={view}
          onValueChange={setView}
          options={[
            { value: "list", label: "List", icon: <ListBullets size={14} /> },
            { value: "grid", label: "Grid", icon: <SquaresFour size={14} /> },
          ]}
        />
      </FilterBar>
      <p className="text-text-tertiary" style={{ fontSize: "var(--text-sm)" }}>
        Layout: <span className="font-mono text-text-primary">{view}</span>
      </p>
    </div>
  );
}

export default function FiltersDocs() {
  return (
    <DocPage
      title="Filters"
      description="Two pieces of the row that sits above a result set. FilterBar shows which filters are currently narrowing the results and lets each one be dropped; SegmentedControl switches between mutually exclusive views of those same results."
    >
      <DocSection
        title="FilterBar"
        description="The bar is a display of state, not a picker — it never opens a menu. You own the filter list and the removal logic; FilterBar renders what is active, a Clear all escape hatch, and the result count. Keep the labels the same words the person chose in the picker that set them."
      >
        <Example
          layout="stacked"
          code={`${filtersSnippet}

const [filters, setFilters] = useState(initialFilters);

<FilterBar
  filters={filters}
  onRemove={(id) => setFilters((current) => current.filter((f) => f.id !== id))}
  onClearAll={() => setFilters([])}
  resultCount={\`\${filters.length === 0 ? "1,284" : "312"} transactions\`}
/>`}
        >
          <BasicFilterBar />
        </Example>
        <Note>
          Each chip is a <code>Badge</code> whose remove button gets a label built from the filter —
          &quot;Remove filter Rail: InstaPay&quot; — so a screen reader user is never left with a row
          of identical &quot;Remove&quot; buttons. The result count carries{" "}
          <code>aria-live=&quot;polite&quot;</code>, which is what announces that dropping a filter
          changed the result set. Clear all appears only while at least one filter is active and{" "}
          <code>onClearAll</code> is supplied. In this example it restores the sample filters so you
          can try it more than once; in a real app it empties them.
        </Note>
      </DocSection>

      <DocSection
        title="No active filters"
        description="With an empty list the bar collapses to just the result count. Keep it mounted rather than hiding it, so the count does not jump into and out of the layout as filters come and go."
      >
        <Example
          layout="stacked"
          code={`<FilterBar filters={[]} onRemove={() => {}} resultCount="1,284 transactions" />`}
        >
          <FilterBar filters={[]} onRemove={() => {}} resultCount="1,284 transactions" />
        </Example>
      </DocSection>

      <DocSection
        title="Filters without a value"
        description="Leave value off for a filter that is on or off rather than set to something, like a saved view or a flag."
      >
        <Example
          layout="stacked"
          code={`<FilterBar
  filters={[
    { id: "flagged", label: "Flagged for review" },
    { id: "rail", label: "Rail", value: "QR Ph" },
  ]}
  onRemove={() => {}}
  onClearAll={() => {}}
/>`}
        >
          <FilterBar
            filters={[
              { id: "flagged", label: "Flagged for review" },
              { id: "rail", label: "Rail", value: "QR Ph" },
            ]}
            onRemove={() => {}}
            onClearAll={() => {}}
          />
        </Example>
      </DocSection>

      <DocSection
        title="SegmentedControl"
        description="For two to four exclusive options that are cheap to switch between — a time window, a layout, a rail. Past four options the labels get cramped; use a Select instead. It is uncontrolled by default and takes value plus onValueChange when you need to drive it."
      >
        <Example
          code={`<SegmentedControl
  label="Settlement window"
  options={[
    { value: "day", label: "Today" },
    { value: "week", label: "This week" },
    { value: "month", label: "This month" },
  ]}
/>`}
        >
          <SegmentedControl
            label="Settlement window"
            options={[
              { value: "day", label: "Today" },
              { value: "week", label: "This week" },
              { value: "month", label: "This month" },
            ]}
          />
        </Example>
      </DocSection>

      <DocSection
        title="Sizes and icons"
        description="Small is the default and is what belongs inside a filter row. Medium suits a standalone control with more space around it. Icons are decorative — keep the label."
      >
        <Example
          code={`<SegmentedControl
  label="Result layout"
  options={[
    { value: "list", label: "List", icon: <ListBullets size={14} /> },
    { value: "grid", label: "Grid", icon: <SquaresFour size={14} /> },
  ]}
/>
<SegmentedControl
  label="Result layout, medium"
  size="md"
  options={[
    { value: "list", label: "List", icon: <ListBullets size={14} /> },
    { value: "grid", label: "Grid", icon: <SquaresFour size={14} /> },
  ]}
/>`}
        >
          <SegmentedControl
            label="Result layout"
            options={[
              { value: "list", label: "List", icon: <ListBullets size={14} /> },
              { value: "grid", label: "Grid", icon: <SquaresFour size={14} /> },
            ]}
          />
          <SegmentedControl
            label="Result layout, medium"
            size="md"
            options={[
              { value: "list", label: "List", icon: <ListBullets size={14} /> },
              { value: "grid", label: "Grid", icon: <SquaresFour size={14} /> },
            ]}
          />
        </Example>
      </DocSection>

      <DocSection
        title="The two together"
        description="Anything passed as children renders at the start of the bar, before the chips — which is where a view switcher or a filter trigger belongs. The result count is pushed to the far end."
      >
        <Example
          layout="stacked"
          code={`<FilterBar
  filters={filters}
  onRemove={(id) => setFilters((current) => current.filter((f) => f.id !== id))}
  onClearAll={() => setFilters([])}
  resultCount={\`\${filters.length} filters applied\`}
>
  <SegmentedControl
    label="Result layout"
    value={view}
    onValueChange={setView}
    options={[
      { value: "list", label: "List", icon: <ListBullets size={14} /> },
      { value: "grid", label: "Grid", icon: <SquaresFour size={14} /> },
    ]}
  />
</FilterBar>`}
        >
          <CombinedFilterBar />
        </Example>
        <Note>
          SegmentedControl is a <code>radiogroup</code>, so arrow keys in any direction move between
          options and change the selection, and only the selected option is in the tab order.{" "}
          <code>label</code> is required because a group of unlabeled radios is meaningless to
          assistive tech.
        </Note>
      </DocSection>

      <DocSection title="FilterBar props">
        <PropsTable
          rows={[
            {
              name: "filters",
              type: "ActiveFilter[]",
              description: "The currently applied filters. Each is { id, label, value? }.",
            },
            {
              name: "onRemove",
              type: "(id: string) => void",
              description: "Called with the filter's id when its chip is dismissed.",
            },
            {
              name: "onClearAll",
              type: "() => void",
              description:
                "Renders a Clear all action while at least one filter is active. Omit it to hide the action.",
            },
            {
              name: "resultCount",
              type: "ReactNode",
              description:
                "Right-aligned summary of the result set, announced politely when it changes.",
            },
            {
              name: "children",
              type: "ReactNode",
              description: "Rendered before the chips — a view switcher or a filter trigger.",
            },
            { name: "className", type: "string", description: "Appended to the bar." },
          ]}
        />
      </DocSection>

      <DocSection title="SegmentedControl props">
        <PropsTable
          rows={[
            {
              name: "options",
              type: "SegmentedOption[]",
              description: "The choices. Each is { value, label, icon? }. Two to four works best.",
            },
            {
              name: "label",
              type: "string",
              description: "Required. Names the radiogroup for assistive tech.",
            },
            {
              name: "value",
              type: "string",
              description: "Controlled selection. Supply it with onValueChange.",
            },
            {
              name: "defaultValue",
              type: "string",
              description: "Initial selection when uncontrolled. Falls back to the first option.",
            },
            {
              name: "onValueChange",
              type: "(value: string) => void",
              description: "Fires on click and on arrow-key navigation.",
            },
            {
              name: "size",
              type: `"sm" | "md"`,
              defaultValue: `"sm"`,
              description: "Padding and font size.",
            },
            { name: "className", type: "string", description: "Appended to the group." },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
