import { TextB, TextItalic, TextUnderline } from "@phosphor-icons/react/ssr";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Toggle group — EP Design Kit" };

export default function ToggleGroupDocs() {
  return (
    <DocPage
      title="Toggle group"
      description="Several Toggles clustered into one border-collapsed control. type=&quot;single&quot; behaves like a radio group; type=&quot;multiple&quot; behaves like a set of independent checkboxes."
    >
      <DocSection
        title="Single select"
        description="Only one item can be pressed at a time. The group renders role=&quot;radiogroup&quot; with each item as role=&quot;radio&quot;, and uses roving tabindex — Tab reaches only the selected item, and the arrow keys move both focus and selection between items."
      >
        <Example
          code={`<ToggleGroup type="single" defaultValue={["instapay"]} aria-label="Settlement rail">
  <ToggleGroupItem value="instapay">InstaPay</ToggleGroupItem>
  <ToggleGroupItem value="pesonet">PESONet</ToggleGroupItem>
  <ToggleGroupItem value="qrph">QR Ph</ToggleGroupItem>
</ToggleGroup>`}
        >
          <ToggleGroup type="single" defaultValue={["instapay"]} aria-label="Settlement rail">
            <ToggleGroupItem value="instapay">InstaPay</ToggleGroupItem>
            <ToggleGroupItem value="pesonet">PESONet</ToggleGroupItem>
            <ToggleGroupItem value="qrph">QR Ph</ToggleGroupItem>
          </ToggleGroup>
        </Example>
      </DocSection>

      <DocSection
        title="Multiple select"
        description="Any number of items can be pressed. The group renders role=&quot;group&quot; and each item keeps its own tab stop and its own aria-pressed."
      >
        <Example
          code={`<ToggleGroup type="multiple" defaultValue={["bold"]} aria-label="Text formatting">
  <ToggleGroupItem value="bold" aria-label="Bold"><TextB size={16} /></ToggleGroupItem>
  <ToggleGroupItem value="italic" aria-label="Italic"><TextItalic size={16} /></ToggleGroupItem>
  <ToggleGroupItem value="underline" aria-label="Underline"><TextUnderline size={16} /></ToggleGroupItem>
</ToggleGroup>`}
        >
          <ToggleGroup type="multiple" defaultValue={["bold"]} aria-label="Text formatting">
            <ToggleGroupItem value="bold" aria-label="Bold">
              <TextB size={16} />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic">
              <TextItalic size={16} />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline">
              <TextUnderline size={16} />
            </ToggleGroupItem>
          </ToggleGroup>
        </Example>
      </DocSection>

      <Note>
        The selected value is always an array, even for <code>type=&quot;single&quot;</code> (0 or
        1 entries) — one shape for both modes instead of a string for one and a string array for
        the other.
      </Note>

      <DocSection title="ToggleGroup props">
        <PropsTable
          rows={[
            {
              name: "type",
              type: `"single" | "multiple"`,
              defaultValue: `"single"`,
              description: "Whether at most one or any number of items can be pressed.",
            },
            {
              name: "value",
              type: "string[]",
              description: "Controlled selected values.",
            },
            {
              name: "defaultValue",
              type: "string[]",
              defaultValue: "[]",
              description: "Initial selected values when uncontrolled.",
            },
            {
              name: "onValueChange",
              type: "(value: string[]) => void",
              description: "Called with the next selected values whenever they change.",
            },
            {
              name: "disabled",
              type: "boolean",
              defaultValue: "false",
              description: "Disables every item, unless an item sets its own disabled.",
            },
            {
              name: "aria-label",
              type: "string",
              description: "Names the group for assistive technology — there is no visible legend.",
            },
          ]}
        />
      </DocSection>

      <DocSection title="ToggleGroupItem props">
        <PropsTable
          rows={[
            {
              name: "value",
              type: "string",
              description: "This item's value within the group.",
            },
            {
              name: "disabled",
              type: "boolean",
              description: "Disables this item only.",
            },
            {
              name: "...props",
              type: "ButtonHTMLAttributes<HTMLButtonElement>",
              description: "Forwarded to the underlying <button>.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
