import { Accordion } from "@/components/ui/accordion";
import { DocPage, DocSection, Example, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Accordion — Diliman Labs" };

function Content({ text }: { text: string }) {
  return (
    <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", paddingTop: "var(--space-2)" }}>
      {text}
    </p>
  );
}

const railItems = [
  {
    value: "instapay",
    trigger: "InstaPay",
    content: "Real-time transfers between participating banks and e-wallets, settled 24/7.",
  },
  {
    value: "pesonet",
    trigger: "PESONet",
    content: "Batch transfers that settle the next banking day, best for larger disbursements.",
  },
  {
    value: "qrph",
    trigger: "QR Ph",
    content: "A shared QR standard for in-person and online payments across participating banks.",
  },
];

export default function AccordionDocs() {
  return (
    <DocPage
      title="Accordion"
      description="Several Collapsible items where either only one (single) or several (multiple) can be open at once. Built by composing Collapsible per item, so the reveal mechanics only live in one place."
    >
      <DocSection
        title="Single"
        description="Opening one item closes any other that was open."
      >
        <Example
          layout="stacked"
          code={`<Accordion
  type="single"
  defaultValue="instapay"
  items={[
    { value: "instapay", trigger: "InstaPay", content: <>…</> },
    { value: "pesonet", trigger: "PESONet", content: <>…</> },
    { value: "qrph", trigger: "QR Ph", content: <>…</> },
  ]}
/>`}
        >
          <div style={{ width: "360px" }}>
            <Accordion
              type="single"
              defaultValue="instapay"
              items={railItems.map((item) => ({ ...item, content: <Content text={item.content} /> }))}
            />
          </div>
        </Example>
      </DocSection>

      <DocSection
        title="Multiple"
        description="Any number of items can stay open together."
      >
        <Example layout="stacked" code={`<Accordion type="multiple" defaultValue={["instapay", "qrph"]} items={…} />`}>
          <div style={{ width: "360px" }}>
            <Accordion
              type="multiple"
              defaultValue={["instapay", "qrph"]}
              items={railItems.map((item) => ({ ...item, content: <Content text={item.content} /> }))}
            />
          </div>
        </Example>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "items",
              type: "{ value: string; trigger: ReactNode; content: ReactNode }[]",
              description: "The accordion's items, in order.",
            },
            {
              name: "type",
              type: `"single" | "multiple"`,
              defaultValue: `"single"`,
              description: "Whether one or several items can be open at once.",
            },
            {
              name: "defaultValue",
              type: "string | string[]",
              description: "Initial open item(s) when uncontrolled.",
            },
            {
              name: "value",
              type: "string | string[]",
              description: "Controlled open item(s).",
            },
            {
              name: "onValueChange",
              type: "(value: string | string[]) => void",
              description: "Called with the new open item(s) after a toggle.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
