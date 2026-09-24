import { ArrowLeft, ArrowRight, Trash } from "@phosphor-icons/react/ssr";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Button Group — EP Design Kit" };

export default function ButtonGroupDocs() {
  return (
    <DocPage
      title="Button Group"
      description="Clusters real Button children into one visual unit — a shared 1px divider between them instead of doubled-up borders, with only the group's outer corners rounded. No new interaction logic, just composition."
    >
      <DocSection title="Basic usage" description="Every child is a plain Button; the group only reshapes borders and radius.">
        <Example
          code={`<ButtonGroup aria-label="Statement period">
  <Button variant="secondary">Day</Button>
  <Button variant="secondary">Week</Button>
  <Button variant="secondary">Month</Button>
  <Button variant="secondary">Year</Button>
</ButtonGroup>`}
        >
          <ButtonGroup aria-label="Statement period">
            <Button variant="secondary">Day</Button>
            <Button variant="secondary">Week</Button>
            <Button variant="secondary">Month</Button>
            <Button variant="secondary">Year</Button>
          </ButtonGroup>
        </Example>
      </DocSection>

      <DocSection title="Icon-only and mixed variants" description="Variants and sizes aren't hard-blocked from mixing, though a single shared variant is the common case.">
        <Example
          code={`<ButtonGroup aria-label="Pagination">
  <Button variant="secondary" iconOnly aria-label="Previous page" iconLeft={<ArrowLeft size={16} />} />
  <Button variant="secondary" iconOnly aria-label="Next page" iconLeft={<ArrowRight size={16} />} />
</ButtonGroup>

<ButtonGroup aria-label="Payout actions">
  <Button>Approve payout</Button>
  <Button variant="danger" iconOnly aria-label="Delete payout method" iconLeft={<Trash size={16} />} />
</ButtonGroup>`}
        >
          <ButtonGroup aria-label="Pagination">
            <Button
              variant="secondary"
              iconOnly
              aria-label="Previous page"
              iconLeft={<ArrowLeft size={16} />}
            />
            <Button
              variant="secondary"
              iconOnly
              aria-label="Next page"
              iconLeft={<ArrowRight size={16} />}
            />
          </ButtonGroup>
          <ButtonGroup aria-label="Payout actions">
            <Button>Approve payout</Button>
            <Button
              variant="danger"
              iconOnly
              aria-label="Delete payout method"
              iconLeft={<Trash size={16} />}
            />
          </ButtonGroup>
        </Example>
      </DocSection>

      <DocSection title="Vertical">
        <Example
          layout="stacked"
          code={`<ButtonGroup orientation="vertical" aria-label="Statement period">
  <Button variant="secondary">Day</Button>
  <Button variant="secondary">Week</Button>
  <Button variant="secondary">Month</Button>
</ButtonGroup>`}
        >
          <ButtonGroup orientation="vertical" aria-label="Statement period">
            <Button variant="secondary">Day</Button>
            <Button variant="secondary">Week</Button>
            <Button variant="secondary">Month</Button>
          </ButtonGroup>
        </Example>
        <Note>
          Give the group an <code>aria-label</code> describing what the clustered actions do (e.g.
          &quot;Statement period&quot;) — the individual buttons already have their own accessible names,
          but the group itself has none without it.
        </Note>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "children",
              type: "ReactNode",
              description: "Real Button elements — the group doesn't reimplement button styling.",
            },
            {
              name: "orientation",
              type: `"horizontal" | "vertical"`,
              defaultValue: `"horizontal"`,
              description: "Row or column layout, with the divider and corner rounding adjusted to match.",
            },
            {
              name: "aria-label",
              type: "string",
              description: "Describes the group's purpose to assistive tech.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
