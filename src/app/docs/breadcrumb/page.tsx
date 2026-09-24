import { Breadcrumb } from "@/components/ui/breadcrumb";
import { DocPage, DocSection, Example, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Breadcrumb — Diliman Labs" };

export default function BreadcrumbDocs() {
  return (
    <DocPage
      title="Breadcrumb"
      description="A horizontal trail showing where the current page sits in the hierarchy, with a CaretRight separator between items."
    >
      <DocSection
        title="Basic trail"
        description="The last item renders as plain text with aria-current='page', not a link to itself."
      >
        <Example
          code={`<Breadcrumb
  items={[
    { label: "Home", href: "/" },
    { label: "Transactions", href: "/transactions" },
    { label: "InstaPay #TX-88291" },
  ]}
/>`}
        >
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Transactions", href: "/transactions" },
              { label: "InstaPay #TX-88291" },
            ]}
          />
        </Example>
      </DocSection>

      <DocSection title="Two levels">
        <Example code={`<Breadcrumb items={[{ label: "Dashboard", href: "/" }, { label: "Settlements" }]} />`}>
          <Breadcrumb items={[{ label: "Dashboard", href: "/" }, { label: "Settlements" }]} />
        </Example>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "items",
              type: "{ label: string; href?: string }[]",
              description: "Trail in order; the last item is always rendered as the current page.",
            },
            {
              name: "renderLink",
              type: "(item, index) => ReactNode",
              description: "Renders each non-final item — pass your framework's Link for client-side navigation.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
