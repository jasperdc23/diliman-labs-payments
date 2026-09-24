import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Glass panel — EP Design Kit" };

function PageBackdrop({ children }: { children: ReactNode }) {
  return (
    <div
      className="mesh grain flex w-full items-center justify-center rounded-lg border border-border-subtle"
      style={{ padding: "var(--space-8)", minHeight: "220px" }}
    >
      {children}
    </div>
  );
}

export default function GlassPanelDocs() {
  return (
    <DocPage
      title="Glass panel"
      description="The frosted surface on its own, with no padding, no slots and no opinions about its contents. Reach for it when something has to float above the page — a nav bar, a toast, a command palette, a sticky footer — and a Card would bring layout it does not need."
    >
      <DocSection
        title="Basic usage"
        description="GlassPanel is a div with the .glass surface, a border, a medium shadow and a radius. It has no padding of its own, so give it some. It is only interesting over something: the demos below sit on a mesh backdrop standing in for a page."
      >
        <Example
          layout="stacked"
          code={`<GlassPanel style={{ padding: "var(--space-6)", maxWidth: "320px" }}>
  <p className="font-semibold">Payout in progress</p>
  <p className="text-sm text-text-secondary">
    ₱48,900.50 to Landbank ••7730 · PESONet · 27 Aug 2026
  </p>
</GlassPanel>`}
        >
          <PageBackdrop>
            <GlassPanel style={{ padding: "var(--space-6)", maxWidth: "320px" }}>
              <p className="font-semibold text-text-primary">Payout in progress</p>
              <p className="text-sm text-text-secondary" style={{ marginTop: "var(--space-2)" }}>
                ₱48,900.50 to Landbank ••7730 · PESONet · 27 Aug 2026
              </p>
            </GlassPanel>
          </PageBackdrop>
        </Example>
      </DocSection>

      <DocSection
        title="Radius"
        description="Two sizes, both from the radius scale: xl by default for large floating surfaces, lg for smaller ones that should feel closer to the rest of the UI. There is deliberately no sm — a panel this soft looks wrong with a tight corner."
      >
        <Example
          layout="stacked"
          code={`<GlassPanel radius="xl" style={{ padding: "var(--space-6)" }}>radius=&quot;xl&quot; (default)</GlassPanel>
<GlassPanel radius="lg" style={{ padding: "var(--space-6)" }}>radius=&quot;lg&quot;</GlassPanel>`}
        >
          <PageBackdrop>
            <div className="flex flex-wrap items-center justify-center" style={{ gap: "var(--space-4)" }}>
              <GlassPanel
                radius="xl"
                className="text-sm text-text-secondary"
                style={{ padding: "var(--space-6)" }}
              >
                radius=&quot;xl&quot; (default)
              </GlassPanel>
              <GlassPanel
                radius="lg"
                className="text-sm text-text-secondary"
                style={{ padding: "var(--space-6)" }}
              >
                radius=&quot;lg&quot;
              </GlassPanel>
            </div>
          </PageBackdrop>
        </Example>
      </DocSection>

      <DocSection
        title="As a floating bar"
        description="The most common use. Pin it with position and let the page scroll underneath — the blur is what sells the depth, so a panel over empty white gains nothing from it."
      >
        <Example
          layout="stacked"
          code={`<GlassPanel
  radius="lg"
  className="flex items-center justify-between"
  style={{ padding: "var(--space-3) var(--space-4)", width: "100%" }}
>
  <span className="text-sm">3 transfers selected · ₱62,534.56</span>
  <Button size="sm">Approve</Button>
</GlassPanel>`}
        >
          <PageBackdrop>
            <GlassPanel
              radius="lg"
              className="flex w-full max-w-md flex-wrap items-center justify-between"
              style={{ padding: "var(--space-3) var(--space-4)", gap: "var(--space-3)" }}
            >
              <span className="text-sm text-text-secondary">
                3 transfers selected · <span className="tabular-nums">₱62,534.56</span>
              </span>
              <Button size="sm">Approve</Button>
            </GlassPanel>
          </PageBackdrop>
        </Example>
      </DocSection>

      <DocSection
        title="Glass panel or card?"
        description="They share a surface but not a job."
      >
        <Note>
          Use <Link href="/docs/card">Card</Link> for content that sits in the page flow: it brings
          padding, a gap between children, the grain overlay and the title/body/footer slots. Use{" "}
          <code>GlassPanel</code> for a chrome element floating above that flow — it gives you the
          surface and a stronger shadow and nothing else. Do not nest one inside the other; two
          frosted layers stacked read as smoke, not depth.
        </Note>
      </DocSection>

      <DocSection
        title="Performance and fallbacks"
        description="The blur is the only part of this kit's texture system that costs something per frame."
      >
        <Note>
          A <code>backdrop-filter</code> is repainted as the content behind it moves, so keep glass
          panels to the handful of floating elements on a screen and never put one on every item in a
          list or grid — that is what <code>Card</code>&apos;s <code>flat</code> prop and the{" "}
          <code>.glass-flat</code> class are for. Where <code>backdrop-filter</code> is unsupported
          the panel degrades to its translucent background color, which stays legible but loses the
          separation, so avoid low-contrast text on it. Panels add no grain of their own — add{" "}
          <code>className=&quot;grain&quot;</code> if you want it. More on all three layers in{" "}
          <Link href="/docs/texture">Texture</Link>.
        </Note>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "radius",
              type: `"lg" | "xl"`,
              defaultValue: `"xl"`,
              description: "Corner rounding, from the radius scale.",
            },
            {
              name: "className",
              type: "string",
              defaultValue: `""`,
              description:
                "Appended after the built-in classes. Where layout, width and padding utilities go.",
            },
            {
              name: "...props",
              type: "HTMLAttributes<HTMLDivElement>",
              description:
                "Everything else spreads onto the div — style, id, role, aria-* and event handlers.",
            },
          ]}
        />
        <p className="text-sm text-text-secondary">
          The panel has no padding, width or elevation props. Those are layout decisions, so they
          belong to whatever places the panel.
        </p>
      </DocSection>
    </DocPage>
  );
}
