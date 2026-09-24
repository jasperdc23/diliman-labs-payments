import { DocPage, DocSection, Note } from "@/components/docs/doc-parts";

export const metadata = { title: "Spacing — EP Design Kit" };

const scale = [
  ["--space-1", "0.25rem", "Icon-to-label gaps, tight inline spacing"],
  ["--space-2", "0.5rem", "Gap between closely related inline elements"],
  ["--space-3", "0.75rem", "Compact control padding, dense list rows"],
  ["--space-4", "1rem", "Default component padding, gap between related fields"],
  ["--space-6", "1.5rem", "Card padding, gap between grouped sections"],
  ["--space-8", "2rem", "Gap between distinct sections within a page"],
  ["--space-12", "3rem", "Page-level vertical rhythm between major blocks"],
  ["--space-16", "4rem", "Section padding on larger viewports"],
  ["--space-24", "6rem", "Hero and landing section breathing room"],
];

export default function SpacingDocs() {
  return (
    <DocPage
      title="Spacing"
      description="A 4px base scale. Pick the closest step; if nothing fits, add a step rather than writing a one-off value — that's what keeps unrelated screens feeling like the same product."
    >
      <DocSection title="Scale">
        <div className="flex flex-col gap-3">
          {scale.map(([token, value, use]) => (
            <div key={token} className="flex items-center gap-4">
              <div className="w-40 shrink-0">
                <p className="font-mono text-xs text-text-primary">{token}</p>
                <p className="font-mono text-xs text-text-tertiary">{value}</p>
              </div>
              <div
                className="h-4 shrink-0 rounded-sm bg-accent"
                style={{ width: `var(${token})`, minWidth: "2px" }}
              />
              <p className="text-sm text-text-secondary">{use}</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection
        title="Padding versus margin"
        description="The distinction that keeps components reusable."
      >
        <div className="flex flex-col gap-3">
          <div className="glass grain rounded-lg border p-5">
            <h3 className="text-sm font-semibold text-text-primary">
              Padding is space inside a component&apos;s own boundary
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              The space between a button&apos;s edge and its label, or a
              card&apos;s edge and its content. It belongs to the component and
              is set in the component&apos;s own styles — never by its parent.
            </p>
          </div>
          <div className="glass grain rounded-lg border p-5">
            <h3 className="text-sm font-semibold text-text-primary">
              Gap is space between siblings
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Prefer <code className="font-mono text-xs">gap</code> on a flex or
              grid parent over margins on children. It avoids margin collapse,
              and it keeps the spacing decision in one place instead of spread
              across every child.
            </p>
          </div>
          <div className="glass grain rounded-lg border p-5">
            <h3 className="text-sm font-semibold text-text-primary">
              A component never ships its own external margin
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Layout owns the space between components. A Button with a built-in{" "}
              <code className="font-mono text-xs">margin-bottom</code> is wrong
              everywhere except the one screen it was written for, and you find
              out by fighting it with overrides in the second place you use it.
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection title="Staying on the scale">
        <Note>
          If a spot seems to need something between two steps — 20px, say —
          that&apos;s usually the layout asking for a different structure, not the
          scale being too coarse. Reach for the nearest step first. Consistent
          spacing is most of what makes an interface feel deliberate, and
          one-off values are how that erodes without anyone noticing.
        </Note>
      </DocSection>
    </DocPage>
  );
}
