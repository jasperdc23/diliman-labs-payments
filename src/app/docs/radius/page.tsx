import { DocPage, DocSection, Note } from "@/components/docs/doc-parts";

export const metadata = { title: "Radius — EP Design Kit" };

const scale = [
  ["--radius-sm", "0.25rem", "Checkboxes, small tags, inline chips"],
  ["--radius-md", "0.5rem", "Inputs, buttons, list items"],
  ["--radius-lg", "0.75rem", "Cards, dropdown menus, modals"],
  ["--radius-xl", "1rem", "Large surfaces, glass panels, the nav bar"],
  ["--radius-full", "9999px", "Pills, avatars, toggles"],
];

export default function RadiusDocs() {
  return (
    <DocPage
      title="Radius"
      description="Five steps. The larger the surface, the larger a radius it can carry — a button with a card's radius reads as a pill by accident, and a card with a checkbox's radius reads as unfinished."
    >
      <DocSection title="Scale">
        <div className="flex flex-wrap gap-8">
          {scale.map(([token, value, use]) => (
            <div key={token} className="flex flex-col gap-3">
              <div
                className="h-24 w-24 border border-border-default bg-accent-subtle"
                style={{ borderRadius: `var(${token})` }}
              />
              <div className="max-w-[9rem]">
                <p className="font-mono text-xs text-text-primary">{token}</p>
                <p className="font-mono text-xs text-text-tertiary">{value}</p>
                <p className="mt-1 text-sm text-text-secondary">{use}</p>
              </div>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection
        title="Nesting"
        description="A nested element uses a radius one or two steps smaller than its container — never equal, never larger."
      >
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col gap-2">
            <div className="rounded-xl border border-border-default p-3">
              <div className="h-20 w-40 rounded-md bg-accent-subtle" />
            </div>
            <p className="text-xs text-text-secondary">Correct — xl outer, md inner</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="rounded-xl border border-border-default p-3">
              <div className="h-20 w-40 rounded-xl bg-accent-subtle" />
            </div>
            <p className="text-xs text-text-secondary">
              Wrong — matching radii make the corners look crowded
            </p>
          </div>
        </div>
        <Note>
          The reason is geometric: a rounded shape inside another rounded shape
          looks right when the corners stay concentric, and that requires the
          inner radius to be smaller by roughly the padding between them. Equal
          radii leave the corner gap visibly pinched, which reads as sloppy even
          to people who can&apos;t name what&apos;s wrong.
        </Note>
      </DocSection>
    </DocPage>
  );
}
