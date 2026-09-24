import { ArrowRight, Plus, Trash } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/button";
import { DocPage, DocSection, Example, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Button — EP Design Kit" };

export default function ButtonDocs() {
  return (
    <DocPage
      title="Button"
      description="Four variants, three sizes, and every interaction state. Hover, active and focus are CSS states rather than props, so they work without any wiring."
    >
      <DocSection
        title="Variants"
        description="Primary carries the single most important action on a view. Secondary and ghost step down from it; danger is reserved for destructive actions that can't be undone."
      >
        <Example
          code={`<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>`}
        >
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </Example>
      </DocSection>

      <DocSection title="Sizes">
        <Example
          code={`<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`}
        >
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Example>
      </DocSection>

      <DocSection
        title="With icons"
        description="Icons sit on either side of the label. Icon-only buttons drop the label entirely, which makes aria-label required — without it the button is silent to screen readers."
      >
        <Example
          code={`<Button iconLeft={<Plus size={16} />}>New payout</Button>
<Button variant="secondary" iconRight={<ArrowRight size={16} />}>Continue</Button>
<Button iconOnly aria-label="Delete" variant="ghost" iconLeft={<Trash size={16} />} />`}
        >
          <Button iconLeft={<Plus size={16} />}>New payout</Button>
          <Button variant="secondary" iconRight={<ArrowRight size={16} />}>
            Continue
          </Button>
          <Button iconOnly aria-label="Delete" variant="ghost" iconLeft={<Trash size={16} />} />
        </Example>
      </DocSection>

      <DocSection
        title="Loading and disabled"
        description="A loading button disables itself and sets aria-busy, so a second submit can't slip through while the first is in flight."
      >
        <Example
          code={`<Button loading>Saving</Button>
<Button disabled>Disabled</Button>
<Button variant="secondary" disabled>Disabled</Button>`}
        >
          <Button loading>Saving</Button>
          <Button disabled>Disabled</Button>
          <Button variant="secondary" disabled>
            Disabled
          </Button>
        </Example>
      </DocSection>

      <DocSection title="Full width" description="For mobile layouts and form footers.">
        <Example layout="stacked" code={`<Button fullWidth>Create account</Button>`}>
          <Button fullWidth>Create account</Button>
        </Example>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "variant",
              type: `"primary" | "secondary" | "ghost" | "danger"`,
              defaultValue: `"primary"`,
              description: "Visual weight of the action.",
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
              name: "iconOnly",
              type: "boolean",
              defaultValue: "false",
              description: "Square button with no label. Requires aria-label.",
            },
            {
              name: "loading",
              type: "boolean",
              defaultValue: "false",
              description: "Swaps the leading icon for a spinner and disables the button.",
            },
            {
              name: "fullWidth",
              type: "boolean",
              defaultValue: "false",
              description: "Stretches to fill its container.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
