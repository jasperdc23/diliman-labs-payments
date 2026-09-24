"use client";

import Link from "next/link";
import { LineChart } from "@/components/ui/line-chart";
import { BarChart } from "@/components/ui/bar-chart";
import { Sparkline } from "@/components/ui/sparkline";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];

const volume = [
  { name: "InstaPay", values: [3200, 3900, 4300, 4100, 5200, 5800, 6400] },
  { name: "PESONet", values: [2100, 2300, 2200, 2600, 2900, 3100, 3400] },
  { name: "QR Ph", values: [900, 1200, 1700, 2100, 2600, 3300, 4100] },
];

const peso = (value: number) => `₱${value.toLocaleString()}`;

const dataSnippet = `const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];

const volume = [
  { name: "InstaPay", values: [3200, 3900, 4300, 4100, 5200, 5800, 6400] },
  { name: "PESONet", values: [2100, 2300, 2200, 2600, 2900, 3100, 3400] },
  { name: "QR Ph", values: [900, 1200, 1700, 2100, 2600, 3300, 4100] },
];

const peso = (value: number) => \`₱\${value.toLocaleString()}\`;`;

const tableViewSnippet = `<LineChart labels={months} series={volume} formatValue={peso} />

<details>
  <summary>View as table</summary>
  <table>
    <thead>
      <tr>
        <th>Rail</th>
        {months.map((month) => <th key={month}>{month}</th>)}
      </tr>
    </thead>
    <tbody>
      {volume.map((series) => (
        <tr key={series.name}>
          <td>{series.name}</td>
          {series.values.map((value, i) => <td key={i}>{peso(value)}</td>)}
        </tr>
      ))}
    </tbody>
  </table>
</details>`;

function TableView() {
  return (
    <details style={{ width: "100%" }}>
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
        <caption className="sr-only">Transaction volume by rail, March to September 2026</caption>
        <thead>
          <tr>
            <th
              scope="col"
              style={{
                textAlign: "left",
                padding: "var(--space-2)",
                color: "var(--text-tertiary)",
                fontWeight: 500,
              }}
            >
              Rail
            </th>
            {months.map((month) => (
              <th
                key={month}
                scope="col"
                style={{
                  textAlign: "right",
                  padding: "var(--space-2)",
                  color: "var(--text-tertiary)",
                  fontWeight: 500,
                }}
              >
                {month}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {volume.map((series) => (
            <tr key={series.name} style={{ borderTop: "1px solid var(--border-subtle)" }}>
              <th
                scope="row"
                style={{
                  textAlign: "left",
                  padding: "var(--space-2)",
                  color: "var(--text-primary)",
                  fontWeight: 500,
                }}
              >
                {series.name}
              </th>
              {series.values.map((value, index) => (
                <td
                  key={months[index]}
                  style={{
                    padding: "var(--space-2)",
                    textAlign: "right",
                    color: "var(--text-secondary)",
                  }}
                >
                  {peso(value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}

export default function ChartsDocs() {
  return (
    <DocPage
      title="Charts"
      description="Three chart primitives sized for payments dashboards: LineChart for a trend over time, BarChart for comparing or composing periods, and Sparkline for the shape of a number inside a stat card. They render plain SVG with no charting dependency, and they read their colors, grid, and axis from the same tokens as the rest of the kit."
    >
      <DocSection
        title="LineChart"
        description="Use it when the question is which way something is heading. Give it labels for the x axis and one series per line; the y scale is derived from the data and rounded to friendly tick values, always anchored at zero."
      >
        <Example
          layout="stacked"
          code={`${dataSnippet}

<LineChart labels={months} series={volume} formatValue={peso} />`}
        >
          <LineChart labels={months} series={volume} formatValue={peso} />
        </Example>
      </DocSection>

      <DocSection
        title="Series encoding, and why four is the ceiling"
        description="This is the one constraint worth reading before you build a dashboard on these."
      >
        <Note>
          The kit is monochrome, so the four series slots are lightness steps rather than hues,
          ordered so adjacent slots sit as far apart in value as possible. Grayscale alone cannot
          carry series identity — a mid gray and a slightly lighter mid gray are not reliably
          distinguishable, and that gets worse in print and under forced-colors. So LineChart pairs
          every series with its own dash pattern as a second encoding — solid, dashed, dotted, then
          dash-dot — and the legend draws those same dashes rather than plain color swatches.
        </Note>
        <Note>
          That caps comfortable use at <strong>four series</strong>. Past four, the palette wraps and
          two lines become identical. Group the tail into an &quot;Other&quot; series, or facet into
          small multiples — one chart per rail, on a shared scale. Adding a brand hue is what would
          unlock a real eight-slot categorical palette; until then, four is the honest limit. The
          tokens live in <code>src/styles/tokens.css</code> as <code>--series-1</code> through{" "}
          <code>--series-4</code>, and the encoding logic is in{" "}
          <code>src/components/ui/chart-shared.ts</code>. See{" "}
          <Link href="/docs/theming">Theming</Link> for what changing them entails.
        </Note>
        <Example
          layout="stacked"
          code={`// Four series is the ceiling. A fifth would reuse slot 1 and collide with InstaPay.
<LineChart
  labels={months}
  series={[...volume, { name: "Other rails", values: [400, 500, 600, 700, 800, 900, 1100] }]}
  formatValue={peso}
/>`}
        >
          <LineChart
            labels={months}
            series={[
              ...volume,
              { name: "Other rails", values: [400, 500, 600, 700, 800, 900, 1100] },
            ]}
            formatValue={peso}
          />
        </Example>
      </DocSection>

      <DocSection
        title="Single series and area fill"
        description="With one series the dash pattern and the legend both drop away — there is nothing to tell apart. area fills under the line at low opacity, which suits a single cumulative measure but turns to mud with more than one series. labelEnds prints the latest value at the end of each line, so the number a reader actually wants is on the page rather than behind a hover."
      >
        <Example
          layout="stacked"
          code={`<LineChart labels={months} series={[volume[2]]} area labelEnds formatValue={peso} />`}
        >
          <LineChart labels={months} series={[volume[2]]} area labelEnds formatValue={peso} />
        </Example>
      </DocSection>

      <DocSection
        title="BarChart, grouped"
        description="Grouped bars answer comparison questions: which rail moved the most in July. Bars cap at 24px wide and center in their band, so a chart of seven months and a chart of thirty days both stay readable. Hovering a band dims the others to 55% so the group under the pointer stands out."
      >
        <Example layout="stacked" code={`<BarChart labels={months} series={volume} formatValue={peso} />`}>
          <BarChart labels={months} series={volume} formatValue={peso} />
        </Example>
      </DocSection>

      <DocSection
        title="BarChart, stacked"
        description="Stacked bars answer composition questions: what the total was and how it split. The scale switches to the sum per period, and a 2px gap separates the segments. Only the top segment is rounded, so the stack reads as one bar rather than a pile of pills."
      >
        <Example
          layout="stacked"
          code={`<BarChart labels={months} series={volume} stacked formatValue={peso} />`}
        >
          <BarChart labels={months} series={volume} stacked formatValue={peso} />
        </Example>
        <Note>
          Stacked bars have no dash-pattern fallback — a fill can&apos;t carry one the way a stroke
          can — so they lean entirely on the lightness steps plus the legend. Keep stacks to three or
          four segments, and order them consistently across every chart on a page so the reader
          learns the order once.
        </Note>
      </DocSection>

      <DocSection
        title="Sparkline"
        description="A trend shape with no axes, for inside a stat card or a table cell. It scales to its own minimum and maximum rather than to zero, so it shows shape, not magnitude — never present a sparkline as if it were a measurable chart. It is marked aria-hidden, which means the number it sits beside has to carry the information."
      >
        <Example
          code={`{volume.map((series, i) => (
  <div key={series.name}>
    <p>{series.name}</p>
    <p>{peso(series.values[series.values.length - 1])}</p>
    <Sparkline values={series.values} color={\`var(--series-\${i + 1})\`} />
  </div>
))}`}
        >
          {volume.map((series, index) => (
            <div
              key={series.name}
              className="flex flex-col"
              style={{ gap: "var(--space-2)" }}
            >
              <p className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
                {series.name}
              </p>
              <p
                className="font-semibold text-text-primary"
                style={{ fontSize: "var(--text-xl)" }}
              >
                {peso(series.values[series.values.length - 1])}
              </p>
              <Sparkline values={series.values} color={`var(--series-${index + 1})`} />
            </div>
          ))}
        </Example>
      </DocSection>

      <DocSection
        title="Always ship a table view"
        description="The tooltip is an enhancement, not the interface. It needs a pointer, it needs hover, and it vanishes; none of that is true of the underlying numbers, and for a BSP-supervised product the numbers are the point. Pair every chart with a way to read the values directly — a details element is the cheapest version that works."
      >
        <Example layout="stacked" code={tableViewSnippet}>
          <LineChart labels={months} series={volume} formatValue={peso} />
          <TableView />
        </Example>
        <Note>
          Both charts expose an <code>aria-label</code> naming their series, which tells a screen
          reader what the image is but not what it says. The table is what makes the values reachable
          — by keyboard, by screen reader, and by anyone who just wants to copy a figure. Where the
          data is already on the page in a{" "}
          <Link href="/docs/table">Table</Link>, that counts; do not repeat it.
        </Note>
      </DocSection>

      <DocSection
        title="Formatting values"
        description="formatValue controls the tooltip and the labelEnds text. Axis ticks always use the compact formatter — 1.2K, 3.4M — because a full peso string on every tick would overrun the 44px left gutter. Pass a formatter that includes the currency so the tooltip is unambiguous."
      >
        <Example
          layout="stacked"
          code={`const peso = (value: number) => \`₱\${value.toLocaleString()}\`;

<LineChart labels={months} series={[volume[0]]} formatValue={peso} labelEnds />`}
        >
          <LineChart labels={months} series={[volume[0]]} formatValue={peso} labelEnds />
        </Example>
        <Note>
          Both charts measure their container with a ResizeObserver and draw in real pixel
          coordinates rather than scaling a viewBox, so a 2px stroke is 2px at any width and text
          never stretches. They need a parent with a real width — inside a flex row, give the wrapper
          a basis or a min-width, or the chart will collapse to its 640px fallback and then jump.
        </Note>
      </DocSection>

      <DocSection title="LineChart props">
        <PropsTable
          rows={[
            {
              name: "labels",
              type: "string[]",
              description:
                "x-axis categories. Every series must have one value per label. Labels thin out automatically to about seven.",
            },
            {
              name: "series",
              type: "LineSeries[]",
              description: "One line each, as { name, values }. Four is the practical maximum.",
            },
            {
              name: "height",
              type: "number",
              defaultValue: "260",
              description: "Total SVG height in pixels, including axes. Width fills the container.",
            },
            {
              name: "area",
              type: "boolean",
              defaultValue: "false",
              description: "Fills under each line at 10% opacity. Best with a single series.",
            },
            {
              name: "formatValue",
              type: "(value: number) => string",
              defaultValue: "formatCompact",
              description: "Formats tooltip values and end labels, not axis ticks.",
            },
            {
              name: "labelEnds",
              type: "boolean",
              defaultValue: "false",
              description: "Prints the last value above the end of each line.",
            },
          ]}
        />
      </DocSection>

      <DocSection title="BarChart props">
        <PropsTable
          rows={[
            {
              name: "labels",
              type: "string[]",
              description: "One band per label, all of them rendered along the x axis.",
            },
            {
              name: "series",
              type: "BarSeries[]",
              description: "One bar per series per band, as { name, values }.",
            },
            {
              name: "height",
              type: "number",
              defaultValue: "260",
              description: "Total SVG height in pixels. Width fills the container.",
            },
            {
              name: "stacked",
              type: "boolean",
              defaultValue: "false",
              description:
                "Stacks the series into one bar per band and scales to the per-band total.",
            },
            {
              name: "formatValue",
              type: "(value: number) => string",
              defaultValue: "formatCompact",
              description: "Formats tooltip values, not axis ticks.",
            },
          ]}
        />
      </DocSection>

      <DocSection title="Sparkline props">
        <PropsTable
          rows={[
            {
              name: "values",
              type: "number[]",
              description: "The series. Scaled to its own min and max, not to zero.",
            },
            {
              name: "width",
              type: "number",
              defaultValue: "96",
              description: "Fixed pixel width — a sparkline does not measure its container.",
            },
            { name: "height", type: "number", defaultValue: "28", description: "Pixel height." },
            {
              name: "color",
              type: "string",
              defaultValue: `"var(--series-1)"`,
              description: "Stroke color. Use a series token so it tracks the theme.",
            },
            {
              name: "showEnd",
              type: "boolean",
              defaultValue: "true",
              description: "Marks the latest point, which is usually the one being asked about.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
