import { Star } from "@phosphor-icons/react/ssr";
import { Toggle } from "@/components/ui/toggle";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Toggle — Diliman Labs" };

export default function ToggleDocs() {
  return (
    <DocPage
      title="Toggle"
      description="A single pressable on/off button — a real button with aria-pressed, for a UI action with two states rather than a form value."
    >
      <DocSection
        title="Basic usage"
        description="Uncontrolled by default — Toggle tracks its own pressed state and reports changes through onPressedChange."
      >
        <Example code={`<Toggle>Bold</Toggle>\n<Toggle defaultPressed>Bold</Toggle>`}>
          <Toggle>Bold</Toggle>
          <Toggle defaultPressed>Bold</Toggle>
        </Example>
      </DocSection>

      <DocSection
        title="Icon only"
        description="Drop the label and add aria-label, the same rule as Button's icon-only mode."
      >
        <Example code={`<Toggle aria-label="Favorite" iconLeft={<Star size={16} />} />`}>
          <Toggle aria-label="Favorite" iconLeft={<Star size={16} />} />
        </Example>
      </DocSection>

      <DocSection title="Sizes">
        <Example
          code={`<Toggle size="sm">Small</Toggle>\n<Toggle size="md">Medium</Toggle>\n<Toggle size="lg">Large</Toggle>`}
        >
          <Toggle size="sm">Small</Toggle>
          <Toggle size="md">Medium</Toggle>
          <Toggle size="lg">Large</Toggle>
        </Example>
      </DocSection>

      <Note>
        Toggle vs. <code>Switch</code>: Toggle is a pressable action button — clicking it toggles
        the button&apos;s own visual state, the way &quot;bold&quot; behaves in a text toolbar.
        Switch is a settings-style boolean form control meant to sit in a form and submit a value.
        If the thing you&apos;re building belongs in a form and has a label describing what it
        controls, use Switch; if it&apos;s an action a person takes on the spot, use Toggle.
      </Note>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "pressed",
              type: "boolean",
              description: "Controlled pressed state. Omit to let Toggle manage it internally.",
            },
            {
              name: "defaultPressed",
              type: "boolean",
              defaultValue: "false",
              description: "Initial pressed state when uncontrolled.",
            },
            {
              name: "onPressedChange",
              type: "(pressed: boolean) => void",
              description: "Called with the next pressed state whenever it changes.",
            },
            {
              name: "size",
              type: `"sm" | "md" | "lg"`,
              defaultValue: `"md"`,
              description: "Padding and font size.",
            },
            {
              name: "iconLeft",
              type: "ReactNode",
              description: "Rendered before the label.",
            },
            {
              name: "iconRight",
              type: "ReactNode",
              description: "Rendered after the label.",
            },
            {
              name: "...props",
              type: "ButtonHTMLAttributes<HTMLButtonElement>",
              description: "Forwarded to the underlying <button>. aria-label is required without children.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
