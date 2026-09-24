"use client";

import { NavigationMenu } from "@/components/ui/navigation-menu";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export default function NavigationMenuDocs() {
  return (
    <DocPage
      title="Navigation menu"
      description="A horizontal top-level nav where an item can either link directly or expand into a panel of links — a mega-menu-lite. Only one panel is open at a time."
    >
      <DocSection title="Basic usage">
        <Example
          code={`<NavigationMenu
  items={[
    { label: "Products", links: [
      { label: "Payments", href: "#" },
      { label: "Payouts", href: "#" },
      { label: "Reporting", href: "#" },
    ] },
    { label: "Pricing", href: "#" },
  ]}
/>`}
        >
          <NavigationMenu
            items={[
              {
                label: "Products",
                links: [
                  { label: "Payments", href: "#", description: "Accept InstaPay, PESONet, QR Ph" },
                  { label: "Payouts", href: "#", description: "Send funds to any local bank" },
                  { label: "Reporting", href: "#", description: "Reconcile and export ledgers" },
                ],
              },
              { label: "Pricing", href: "#" },
              { label: "Docs", href: "#" },
            ]}
          />
        </Example>
        <Note>
          Keep the expanded panel modest — this is a UI primitive, not a full site nav. A grid of
          three to six related links is the sweet spot.
        </Note>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "items",
              type: `{ label, href } | { label, links: NavigationMenuLink[] }`,
              description: "A direct link, or an expandable item carrying a panel of links.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
