import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ReactNode } from "react";
import { LineChart } from "./line-chart";
import { BarChart } from "./bar-chart";
import { Sparkline } from "./sparkline";

const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];

const volume = [
  { name: "InstaPay", values: [3200, 3900, 4300, 4100, 5200, 5800, 6400] },
  { name: "PESONet", values: [2100, 2300, 2200, 2600, 2900, 3100, 3400] },
  { name: "QR Ph", values: [900, 1200, 1700, 2100, 2600, 3300, 4100] },
];

const peso = (v: number) => `₱${v.toLocaleString()}`;

function ChartFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ maxWidth: "720px", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-primary)" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

const meta: Meta = {
  title: "Components/Charts",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj;

export const Line: Story = {
  render: () => (
    <ChartFrame title="Transaction volume by rail">
      <LineChart labels={months} series={volume} formatValue={peso} />
    </ChartFrame>
  ),
};

export const Area: Story = {
  render: () => (
    <ChartFrame title="QR Ph volume">
      <LineChart
        labels={months}
        series={[volume[2]]}
        area
        labelEnds
        formatValue={peso}
      />
    </ChartFrame>
  ),
};

export const GroupedBars: Story = {
  render: () => (
    <ChartFrame title="Volume by rail">
      <BarChart labels={months} series={volume} formatValue={peso} />
    </ChartFrame>
  ),
};

export const StackedBars: Story = {
  render: () => (
    <ChartFrame title="Total volume, stacked by rail">
      <BarChart labels={months} series={volume} stacked formatValue={peso} />
    </ChartFrame>
  ),
};

export const Sparklines: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--space-8)", alignItems: "center" }}>
      {volume.map((s, i) => (
        <div key={s.name} style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <p style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>{s.name}</p>
          <p style={{ fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--text-primary)" }}>
            {peso(s.values[s.values.length - 1])}
          </p>
          <Sparkline values={s.values} color={`var(--series-${i + 1})`} />
        </div>
      ))}
    </div>
  ),
};

export const WithTableView: Story = {
  render: () => (
    <ChartFrame title="Transaction volume by rail">
      <LineChart labels={months} series={volume} formatValue={peso} />
      <details>
        <summary
          style={{
            cursor: "pointer",
            fontSize: "var(--text-sm)",
            color: "var(--text-secondary)",
          }}
        >
          View as table
        </summary>
        <table
          style={{
            marginTop: "var(--space-4)",
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "var(--text-sm)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "var(--space-2)", color: "var(--text-tertiary)", fontWeight: 500 }}>
                Rail
              </th>
              {months.map((m) => (
                <th
                  key={m}
                  style={{ textAlign: "right", padding: "var(--space-2)", color: "var(--text-tertiary)", fontWeight: 500 }}
                >
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {volume.map((s) => (
              <tr key={s.name} style={{ borderTop: "1px solid var(--border-subtle)" }}>
                <td style={{ padding: "var(--space-2)", color: "var(--text-primary)" }}>{s.name}</td>
                {s.values.map((v, i) => (
                  <td
                    key={i}
                    style={{ padding: "var(--space-2)", textAlign: "right", color: "var(--text-secondary)" }}
                  >
                    {peso(v)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </ChartFrame>
  ),
};
