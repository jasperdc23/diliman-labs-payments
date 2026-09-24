import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Avatar — Diliman Labs" };

const portrait =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%23495057'/%3E%3Ccircle cx='48' cy='38' r='16' fill='%23ffffff' opacity='0.9'/%3E%3Cellipse cx='48' cy='82' rx='26' ry='20' fill='%23ffffff' opacity='0.9'/%3E%3C/svg%3E";

export default function AvatarDocs() {
  return (
    <DocPage
      title="Avatar"
      description="Identifies a person — the operator who approved a payout, the merchant contact on a dispute. It degrades in steps: photo, then initials, then a generic user glyph, so a missing image never leaves a hole in the layout."
    >
      <DocSection
        title="Basic usage"
        description="Pass name and you get initials plus a hidden text label. Add src and the photo takes over, with the initials still standing by if it fails to load."
      >
        <Example
          code={`<Avatar name="Marisol Ramos" />
<Avatar name="Marisol Ramos" src="/team/marisol.jpg" />`}
        >
          <Avatar name="Marisol Ramos" />
          <Avatar name="Marisol Ramos" src={portrait} />
        </Example>
      </DocSection>

      <DocSection
        title="Sizes"
        description="Extra small sits inline in a table row, small in a list or a stacked group, medium is the default for a row of people, large for a card, and extra large for a profile header."
      >
        <Example
          code={`<Avatar name="Marisol Ramos" size="xs" />
<Avatar name="Marisol Ramos" size="sm" />
<Avatar name="Marisol Ramos" size="md" />
<Avatar name="Marisol Ramos" size="lg" />
<Avatar name="Marisol Ramos" size="xl" />`}
        >
          <Avatar name="Marisol Ramos" size="xs" />
          <Avatar name="Marisol Ramos" size="sm" />
          <Avatar name="Marisol Ramos" size="md" />
          <Avatar name="Marisol Ramos" size="lg" />
          <Avatar name="Marisol Ramos" size="xl" />
        </Example>
      </DocSection>

      <DocSection
        title="Fallbacks"
        description="Photo, initials, glyph. Initials are the first and last word of the name — Jomar Dela Cruz becomes JC, not JD — and a single-word name uses its first two letters. With no name at all you get the generic glyph, which is the right choice for an unclaimed seat or an unidentified actor in an audit log."
      >
        <Example
          code={`<Avatar name="Jomar Dela Cruz" src="/team/jomar.jpg" size="lg" />
<Avatar name="Jomar Dela Cruz" size="lg" />
<Avatar size="lg" />`}
        >
          <Avatar name="Jomar Dela Cruz" src={portrait} size="lg" />
          <Avatar name="Jomar Dela Cruz" size="lg" />
          <Avatar size="lg" />
        </Example>
      </DocSection>

      <DocSection
        title="Status"
        description="A dot in the lower corner, ringed in the surface color so it reads as sitting on top of the avatar. Only use it where presence is real information — an approvals queue where you need to know who can act now."
      >
        <Example
          code={`<Avatar name="Aira Santos" status="online" size="lg" />
<Avatar name="Benjie Uy" status="away" size="lg" />
<Avatar name="Carla Lim" status="busy" size="lg" />
<Avatar name="Dino Reyes" status="offline" size="lg" />`}
        >
          <Avatar name="Aira Santos" status="online" size="lg" />
          <Avatar name="Benjie Uy" status="away" size="lg" />
          <Avatar name="Carla Lim" status="busy" size="lg" />
          <Avatar name="Dino Reyes" status="offline" size="lg" />
        </Example>
        <Note>
          The status dot is an <code>img</code> role labeled &quot;Status: online&quot; and so on, so
          it is announced rather than left as decoration. In the monochrome palette the four statuses
          are gray steps, which means the dot alone cannot be trusted to distinguish them — pair it
          with text wherever the distinction actually matters.
        </Note>
      </DocSection>

      <DocSection
        title="AvatarGroup"
        description="Overlaps a set of avatars and collapses the overflow into a count. Set size on the group to match the size you gave the children — the group uses its own size prop to lay out the overflow chip, and a mismatch leaves the chip the wrong size."
      >
        <Example
          layout="stacked"
          code={`<AvatarGroup size="md">
  <Avatar name="Aira Santos" size="md" />
  <Avatar name="Benjie Uy" size="md" />
  <Avatar name="Carla Lim" size="md" />
</AvatarGroup>

<AvatarGroup size="md" max={3}>
  <Avatar name="Aira Santos" size="md" />
  <Avatar name="Benjie Uy" size="md" />
  <Avatar name="Carla Lim" size="md" />
  <Avatar name="Dino Reyes" size="md" />
  <Avatar name="Elena Cruz" size="md" />
  <Avatar name="Fermin Yap" size="md" />
</AvatarGroup>`}
        >
          <AvatarGroup size="md">
            <Avatar name="Aira Santos" size="md" />
            <Avatar name="Benjie Uy" size="md" />
            <Avatar name="Carla Lim" size="md" />
          </AvatarGroup>
          <AvatarGroup size="md" max={3}>
            <Avatar name="Aira Santos" size="md" />
            <Avatar name="Benjie Uy" size="md" />
            <Avatar name="Carla Lim" size="md" />
            <Avatar name="Dino Reyes" size="md" />
            <Avatar name="Elena Cruz" size="md" />
            <Avatar name="Fermin Yap" size="md" />
          </AvatarGroup>
        </Example>
        <Note>
          The overflow chip shows a count and nothing else, so the hidden people are unreachable from
          the group itself. Put the full list somewhere a person can actually get to it — a popover,
          a details panel, or the row the group summarizes.
        </Note>
      </DocSection>

      <DocSection
        title="In context"
        description="The usual pairing: an avatar next to the name and role it stands for. The avatar is then redundant to a screen reader, which is fine — it is doing visual work."
      >
        <Example
          layout="stacked"
          code={`<div className="flex items-center" style={{ gap: "var(--space-4)" }}>
  <Avatar name="Marisol Ramos" src="/team/marisol.jpg" size="xl" status="online" />
  <div className="flex flex-col">
    <span className="font-medium text-text-primary">Marisol Ramos</span>
    <span className="text-text-tertiary">Settlements lead</span>
  </div>
</div>`}
        >
          <div className="flex items-center" style={{ gap: "var(--space-4)" }}>
            <Avatar name="Marisol Ramos" src={portrait} size="xl" status="online" />
            <div className="flex flex-col">
              <span
                className="font-medium text-text-primary"
                style={{ fontSize: "var(--text-sm)" }}
              >
                Marisol Ramos
              </span>
              <span className="text-text-tertiary" style={{ fontSize: "var(--text-sm)" }}>
                Settlements lead
              </span>
            </div>
          </div>
        </Example>
      </DocSection>

      <DocSection title="Accessibility">
        <Note>
          When initials or the glyph are showing, the full name is rendered visually hidden so the
          avatar is not silent — the initials themselves are <code>aria-hidden</code>, because
          &quot;MR&quot; read aloud is noise. When a photo is showing, the <code>alt</code> text
          carries it, defaulting to the name. If the avatar sits right beside the same name as
          visible text, pass <code>alt=&quot;&quot;</code> to stop it being announced twice.
        </Note>
      </DocSection>

      <DocSection title="Avatar props">
        <PropsTable
          rows={[
            {
              name: "name",
              type: "string",
              description:
                "Person's full name. Drives the initials, the hidden label, and the default alt text.",
            },
            {
              name: "src",
              type: "string",
              description: "Photo URL. Falls back to initials if it fails to load.",
            },
            {
              name: "alt",
              type: "string",
              description: "Alt text for the photo. Defaults to name; pass \"\" when redundant.",
            },
            {
              name: "size",
              type: `"xs" | "sm" | "md" | "lg" | "xl"`,
              defaultValue: `"md"`,
              description: "1.5rem, 2rem, 2.5rem, 3rem, or 4rem square.",
            },
            {
              name: "status",
              type: `"online" | "offline" | "busy" | "away"`,
              description: "Presence dot in the lower corner, announced as an image with a label.",
            },
            { name: "className", type: "string", description: "Appended to the outer span." },
          ]}
        />
      </DocSection>

      <DocSection title="AvatarGroup props">
        <PropsTable
          rows={[
            {
              name: "children",
              type: "ReactNode",
              description: "Avatar elements, in the order they should stack.",
            },
            {
              name: "max",
              type: "number",
              defaultValue: "4",
              description: "How many to show before collapsing the rest into a +N chip.",
            },
            {
              name: "size",
              type: `"xs" | "sm" | "md" | "lg" | "xl"`,
              defaultValue: `"md"`,
              description:
                "Sizes the overflow chip only. Match it to the size you gave the children.",
            },
            { name: "className", type: "string", description: "Appended to the group." },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
