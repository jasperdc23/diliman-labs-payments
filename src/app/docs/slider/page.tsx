"use client";

import { Slider } from "@/components/ui/slider";
import { DocPage, DocSection, Example, PropsTable } from "@/components/docs/doc-parts";

export default function SliderDocs() {
  return (
    <DocPage
      title="Slider"
      description={`A single-value range control built on the real <input type="range">, so keyboard (arrow keys, Home/End) and touch dragging work without any custom pointer logic. Only the track and thumb are restyled.`}
    >
      <DocSection title="Basic usage">
        <Example layout="stacked" code={`<Slider label="Monthly transfer limit" defaultValue={50} />`}>
          <Slider label="Monthly transfer limit" defaultValue={50} />
        </Example>
      </DocSection>

      <DocSection
        title="Value readout"
        description="showValue renders the current value next to the label; formatValue controls how it's displayed."
      >
        <Example
          layout="stacked"
          code={`<Slider
  label="Monthly transfer limit"
  min={0}
  max={200000}
  step={5000}
  defaultValue={50000}
  showValue
  formatValue={(v) => \`₱\${v.toLocaleString("en-PH")}\`}
/>`}
        >
          <Slider
            label="Monthly transfer limit"
            min={0}
            max={200000}
            step={5000}
            defaultValue={50000}
            showValue
            formatValue={(v) => `₱${v.toLocaleString("en-PH")}`}
          />
        </Example>
      </DocSection>

      <DocSection title="Helper text and disabled">
        <Example
          layout="stacked"
          code={`<Slider label="Daily limit" showValue defaultValue={70} helperText="Applies to outgoing InstaPay transfers only." />
<Slider label="Daily limit" disabled defaultValue={30} showValue />`}
        >
          <Slider
            label="Daily limit"
            showValue
            defaultValue={70}
            helperText="Applies to outgoing InstaPay transfers only."
          />
          <Slider label="Daily limit" disabled defaultValue={30} showValue />
        </Example>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "label",
              type: "string",
              description: "Label rendered above the track.",
            },
            {
              name: "min / max / step",
              type: "number",
              defaultValue: "0 / 100 / 1",
              description: "Same semantics as the native range input.",
            },
            {
              name: "value / defaultValue",
              type: "number",
              description: "Controlled or uncontrolled value.",
            },
            {
              name: "onValueChange",
              type: "(value: number) => void",
              description: "Called with the numeric value on every change.",
            },
            {
              name: "showValue",
              type: "boolean",
              defaultValue: "false",
              description: "Renders the current value next to the label.",
            },
            {
              name: "formatValue",
              type: "(value: number) => string",
              defaultValue: "String(value)",
              description: "Formats the value shown by showValue.",
            },
            {
              name: "helperText",
              type: "string",
              description: "Supporting copy below the track.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
