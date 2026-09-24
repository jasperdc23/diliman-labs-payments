"use client";

import { HoverCard } from "@/components/ui/hover-card";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export default function HoverCardDocs() {
  return (
    <DocPage
      title="Hover card"
      description="Like Tooltip, but for richer content, shown only on hover (focus is supported too, for keyboard reachability) — a small preview card rather than a one-line label."
    >
      <DocSection
        title="Basic usage"
        description="Hovering a merchant name to preview their recent activity is the canonical use here."
      >
        <Example
          code={`<HoverCard trigger={<span>Bayani Mart</span>}>
  <p>Bayani Mart</p>
  <p>₱12,450.50 settled today · InstaPay</p>
</HoverCard>`}
        >
          <HoverCard
            trigger={
              <span style={{ textDecoration: "underline", textUnderlineOffset: "2px", cursor: "default" }}>
                Bayani Mart
              </span>
            }
          >
            <p style={{ fontWeight: 600, fontSize: "var(--text-sm)" }}>Bayani Mart</p>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
              ₱12,450.50 settled today · InstaPay
            </p>
          </HoverCard>
        </Example>
        <Note>
          Tooltip is one line of text. HoverCard is a small content card. If the content needs its
          own layout — a name, a stat, a status — that&apos;s the signal to use HoverCard instead of
          stretching a Tooltip.
        </Note>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "trigger", type: "ReactElement", description: "Cloned with hover/focus wiring." },
            { name: "children", type: "ReactNode", description: "Card content." },
            { name: "align", type: `"start" | "end"`, defaultValue: `"start"`, description: "Horizontal alignment against the trigger." },
            { name: "openDelay", type: "number", defaultValue: "300", description: "Milliseconds of hover before opening." },
            { name: "closeDelay", type: "number", defaultValue: "150", description: "Milliseconds of grace before closing on mouse-out." },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
