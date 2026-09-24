import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ListBullets, SquaresFour } from "@phosphor-icons/react/ssr";
import { FilterBar, SegmentedControl, type ActiveFilter } from "./filters";

const initialFilters: ActiveFilter[] = [
  { id: "rail", label: "Rail", value: "InstaPay" },
  { id: "status", label: "Status", value: "Pending" },
  { id: "range", label: "Range", value: "01–27 Aug 2026" },
  { id: "merchant", label: "Merchant", value: "Bayani Mart" },
];

const meta: Meta<typeof FilterBar> = {
  title: "Components/Filters",
  component: FilterBar,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof FilterBar>;

export const Default: Story = {
  render: function DefaultFilters() {
    const [filters, setFilters] = useState(initialFilters);
    return (
      <FilterBar
        filters={filters}
        onRemove={(id) => setFilters((current) => current.filter((f) => f.id !== id))}
        onClearAll={() => setFilters([])}
        resultCount={`${filters.length === 0 ? 1284 : 312} transactions`}
      />
    );
  },
};

export const NoActiveFilters: Story = {
  render: () => (
    <FilterBar filters={[]} onRemove={() => {}} onClearAll={() => {}} resultCount="1,284 transactions" />
  ),
};

export const Segmented: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <SegmentedControl
        label="Settlement window"
        options={[
          { value: "day", label: "Today" },
          { value: "week", label: "This week" },
          { value: "month", label: "This month" },
        ]}
      />
      <SegmentedControl
        label="Result layout"
        size="md"
        options={[
          { value: "list", label: "List", icon: <ListBullets size={14} /> },
          { value: "grid", label: "Grid", icon: <SquaresFour size={14} /> },
        ]}
      />
    </div>
  ),
};

export const Overview: Story = {
  render: function OverviewFilters() {
    const [filters, setFilters] = useState(initialFilters.slice(0, 2));
    const [view, setView] = useState("list");
    return (
      <div className="flex flex-col gap-4">
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
      </div>
    );
  },
};
