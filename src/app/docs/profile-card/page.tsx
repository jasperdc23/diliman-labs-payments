import { Button } from "@/components/ui/button";
import { ProfileCard } from "@/components/ui/profile-card";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Profile card — EP Design Kit" };

const portrait = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="#343a40"/><circle cx="48" cy="38" r="17" fill="rgba(255,255,255,0.85)"/><circle cx="48" cy="92" r="30" fill="rgba(255,255,255,0.85)"/></svg>`,
)}`;

export default function ProfileCardDocs() {
  return (
    <DocPage
      title="Profile card"
      description="A person, in a card: avatar, name, role, an optional line of bio, a few figures and some actions. Reach for it in team directories, merchant-owner records and assignee pickers — anywhere a name alone is not enough to tell two people apart."
    >
      <DocSection
        title="Basic usage"
        description="name is the only required prop. Every other slot disappears cleanly when omitted, so the same component covers a full directory entry and a bare name-and-role chip."
      >
        <Example
          code={`<ProfileCard
  className="max-w-sm"
  avatar={portrait}
  name="Maricel Bautista"
  role="Merchant success"
  handle="@maricel"
  bio="Onboards sari-sari and quick-service merchants onto QR Ph across Metro Manila."
  stats={[
    { label: "Merchants", value: "148" },
    { label: "Volume (Aug)", value: "₱6.2M" },
    { label: "Since", value: "27 Aug 2024" },
  ]}
  actions={
    <>
      <Button size="sm">Message</Button>
      <Button size="sm" variant="secondary">View profile</Button>
    </>
  }
/>`}
        >
          <ProfileCard
            className="max-w-sm"
            avatar={portrait}
            name="Maricel Bautista"
            role="Merchant success"
            handle="@maricel"
            bio="Onboards sari-sari and quick-service merchants onto QR Ph across Metro Manila."
            stats={[
              { label: "Merchants", value: "148" },
              { label: "Volume (Aug)", value: "₱6.2M" },
              { label: "Since", value: "27 Aug 2024" },
            ]}
            actions={
              <>
                <Button size="sm">Message</Button>
                <Button size="sm" variant="secondary">
                  View profile
                </Button>
              </>
            }
          />
        </Example>
      </DocSection>

      <DocSection
        title="Initials fallback"
        description="With no avatar, the card derives up to two initials from name and renders them in a subtle circle. No network request, no broken-image state, and no gray silhouette that makes every unphotographed person look identical."
      >
        <Example
          code={`<ProfileCard
  className="max-w-sm"
  name="Jonas Rivera"
  role="Risk analyst"
  handle="@jrivera"
  bio="Reviews AMLC-flagged transfers and keeps the false-positive queue honest."
  stats={[
    { label: "Cases closed", value: "312" },
    { label: "Avg. review", value: "4m 12s" },
  ]}
  actions={<Button size="sm" variant="secondary">Assign case</Button>}
/>`}
        >
          <ProfileCard
            className="max-w-sm"
            name="Jonas Rivera"
            role="Risk analyst"
            handle="@jrivera"
            bio="Reviews AMLC-flagged transfers and keeps the false-positive queue honest."
            stats={[
              { label: "Cases closed", value: "312" },
              { label: "Avg. review", value: "4m 12s" },
            ]}
            actions={
              <Button size="sm" variant="secondary">
                Assign case
              </Button>
            }
          />
        </Example>
        <Note>
          Initials come from the first letter of the first two whitespace-separated parts of{" "}
          <code>name</code>, so &quot;Ana Dela Cruz&quot; yields AD, not ADC. Pass the name you want
          initialized — the component will not guess at particles or compound surnames.
        </Note>
      </DocSection>

      <DocSection
        title="Role and handle"
        description="Both feed the same secondary line, joined by a middle dot when you supply both. Either one alone renders on its own; with neither, the line is dropped and the name centers against the avatar."
      >
        <Example
          code={`<ProfileCard className="max-w-xs" name="Ana Dela Cruz" role="Settlements" />
<ProfileCard className="max-w-xs" name="Paolo Mendoza" handle="@pmendoza" />
<ProfileCard className="max-w-xs" name="Liza Ocampo" />`}
        >
          <ProfileCard className="max-w-xs" name="Ana Dela Cruz" role="Settlements" />
          <ProfileCard className="max-w-xs" name="Paolo Mendoza" handle="@pmendoza" />
          <ProfileCard className="max-w-xs" name="Liza Ocampo" />
        </Example>
      </DocSection>

      <DocSection
        title="Stats"
        description="A short array of label/value pairs, laid out as a definition list and wrapping when the card is narrow. Values are tabular so several cards side by side keep their figures aligned. Keep it to two or three — this is a person, not a dashboard."
      >
        <Example
          code={`<ProfileCard
  className="max-w-sm"
  name="Reymart Santos"
  role="Store operations"
  stats={[
    { label: "Stores", value: "12" },
    { label: "QR Ph volume", value: "₱1,482,300.00" },
    { label: "Disputes", value: "3" },
  ]}
/>`}
        >
          <ProfileCard
            className="max-w-sm"
            name="Reymart Santos"
            role="Store operations"
            stats={[
              { label: "Stores", value: "12" },
              { label: "QR Ph volume", value: "₱1,482,300.00" },
              { label: "Disputes", value: "3" },
            ]}
          />
        </Example>
        <Note>
          Each stat is keyed by its <code>label</code>, so two stats in the same card must not share
          one. Values are strings — format them before passing them in.
        </Note>
      </DocSection>

      <DocSection
        title="Compact and interactive"
        description="Drop the bio and stats, add flat and interactive, and the same component becomes a picker tile dense enough to grid. flat matters here: a directory is exactly the kind of screen where a backdrop blur per card starts costing frame time."
      >
        <Example
          layout="stacked"
          code={`<div className="grid gap-4 sm:grid-cols-3">
  <ProfileCard flat interactive name="Ana Dela Cruz" role="Settlements" stats={[{ label: "Payouts", value: "1,024" }]} />
  <ProfileCard flat interactive name="Jonas Rivera" role="Risk" stats={[{ label: "Cases", value: "312" }]} />
  <ProfileCard flat interactive name="Maricel Bautista" role="Merchant success" stats={[{ label: "Merchants", value: "148" }]} />
</div>`}
        >
          <div className="grid w-full gap-4 sm:grid-cols-3">
            <ProfileCard
              flat
              interactive
              name="Ana Dela Cruz"
              role="Settlements"
              stats={[{ label: "Payouts", value: "1,024" }]}
            />
            <ProfileCard
              flat
              interactive
              name="Jonas Rivera"
              role="Risk"
              stats={[{ label: "Cases", value: "312" }]}
            />
            <ProfileCard
              flat
              interactive
              name="Maricel Bautista"
              role="Merchant success"
              stats={[{ label: "Merchants", value: "148" }]}
            />
          </div>
        </Example>
      </DocSection>

      <DocSection
        title="Accessibility"
        description="Names and avatars are the easiest places to leak a duplicate announcement."
      >
        <Note>
          A supplied <code>avatar</code> renders as <code>role=&quot;img&quot;</code> labeled with{" "}
          <code>name</code>, which means a screen reader hears the name twice — once from the avatar,
          once from the heading line. That is deliberate redundancy rather than a bug, but if you
          nest the card inside a link, give the link its own accessible name so the whole thing is
          not read three times. The initials fallback is <code>aria-hidden</code> and adds nothing.
          Long names and roles truncate with an ellipsis, so a card narrow enough to clip should
          carry a <code>title</code> or a tooltip.
        </Note>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "name",
              type: "string",
              description:
                "Required. Also the source of the initials fallback and the avatar's accessible name.",
            },
            { name: "role", type: "string", description: "Job or function, on the secondary line." },
            {
              name: "handle",
              type: "string",
              description: "Username or mention, joined to role by a middle dot when both are set.",
            },
            {
              name: "bio",
              type: "ReactNode",
              description: "One or two lines of context, at relaxed leading.",
            },
            {
              name: "avatar",
              type: "string",
              description:
                "Image URL, applied as a cover background on a circle. Omit for initials.",
            },
            {
              name: "stats",
              type: "{ label: string; value: string }[]",
              description:
                "Figures rendered as a definition list. Labels must be unique — they key the list.",
            },
            {
              name: "actions",
              type: "ReactNode",
              description: "Buttons or links in a CardFooter, above a hairline divider.",
            },
            {
              name: "interactive",
              type: "boolean",
              defaultValue: "false",
              description: "Hover lift for pickers and directory tiles. Styling only.",
            },
            {
              name: "flat",
              type: "boolean",
              defaultValue: "false",
              description: "Passed through to Card: drops the backdrop blur. Use in directories.",
            },
            {
              name: "className",
              type: "string",
              defaultValue: `""`,
              description: "Applied to the underlying Card — usually a width constraint.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
