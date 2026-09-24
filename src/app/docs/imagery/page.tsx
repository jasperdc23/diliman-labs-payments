import Link from "next/link";
import { MediaCard } from "@/components/ui/media-card";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Imagery — Diliman Labs" };

const RATIOS = [
  { ratio: "1 / 1", label: "1:1", use: "Avatars, thumbnails, logo marks." },
  { ratio: "4 / 3", label: "4:3", use: "Card media, MediaCard's overlay variant." },
  { ratio: "16 / 9", label: "16:9", use: "Hero banners, wide feature media." },
];

function RatioBox({ ratio, label, use }: { ratio: string; label: string; use: string }) {
  return (
    <div className="flex flex-col" style={{ gap: "var(--space-2)", width: "200px" }}>
      <div
        className="rounded-md border border-border-subtle"
        style={{
          aspectRatio: ratio,
          background:
            "repeating-linear-gradient(135deg, var(--gray-200) 0 10px, var(--surface-sunken) 10px 20px)",
        }}
      />
      <code className="font-mono text-text-primary" style={{ fontSize: "var(--text-sm)" }}>
        {label}
      </code>
      <span className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
        {use}
      </span>
    </div>
  );
}

export default function ImageryDocs() {
  return (
    <DocPage
      title="Imagery"
      description="Photography runs dark, high-contrast and grainy, with the brand yellow used as graphic blocking rather than as a tint. No real photos have been shot yet — this page documents the direction, the grade every photo inherits automatically, and the placeholder that stands in until then."
    >
      <DocSection
        title="Photo direction"
        description="The spec any shot or sourced image needs to meet."
      >
        <Note>
          Dark tone, pushed contrast, visible grain. Subjects sit against near-black under a single
          hard light source rather than an evenly lit scene. The yellow never washes over the whole
          frame — it enters as a block, a wedge, a rule, or type sitting on top of the image, which
          is what keeps it reading as the brand instead of as a color filter. Anything passed to a
          photo slot is graded automatically (desaturated, contrast pushed, darkened) and gets the
          vignette and grain pass on top, so a shot that arrives slightly off-spec still lands in
          the same family as everything around it.
        </Note>
      </DocSection>

      <DocSection
        title="Why there's no real photography yet"
        description="Same reasoning as the color system: a stand-in photo makes an unsettled decision look settled."
      >
        <Note>
          A stock photo dropped in to fill space quietly becomes the brand&apos;s photography style by
          accident — nobody chose that lighting, that crop, or that cast of people, but it ships
          anyway because it&apos;s already there. So instead of a stand-in image, components that
          take a photo render a placeholder built from the brand&apos;s own ink and accent. It never
          looks like a broken image, and it never gets mistaken for a real shot.
        </Note>
      </DocSection>

      <DocSection
        title="The placeholder pattern"
        description="MediaCard renders this automatically whenever no image prop is passed — nothing extra to opt into."
      >
        <Example
          layout="stacked"
          code={`<MediaCard
  eyebrow="Coming soon"
  title="Merchant insights"
  description="A token-driven placeholder renders whenever no image is supplied."
/>`}
        >
          <MediaCard
            className="max-w-sm"
            eyebrow="Coming soon"
            title="Merchant insights"
            description="A token-driven placeholder renders whenever no image is supplied, so the card never looks broken."
          />
        </Example>
        <Note>
          It&apos;s two diagonal gradient bands mixed from <code>--accent</code> at low opacity,
          a repeating diagonal hatch drawn from <code>--border-subtle</code>, and{" "}
          <code>--surface-sunken</code> underneath as the base layer — no bitmap, no network
          request, so it renders identically offline and themes itself automatically since every
          layer is a token. The same pattern is what <code>Avatar</code> and{" "}
          <code>ProfileCard</code> fall back to when their image slot is empty, just recolored to
          each component&apos;s own scale.
        </Note>
      </DocSection>

      <DocSection
        title="Aspect ratios"
        description="Three ratios cover the kit's media needs. Standardizing on these now means a future photo set drops into a grid that already reads as consistent, rather than one where every card is a slightly different shape."
      >
        <Example
          code={`<MediaCard aspectRatio="1 / 1" …  />   {/* avatars, thumbnails */}
<MediaCard aspectRatio="4 / 3" … />   {/* card media, default overlay */}
<MediaCard aspectRatio="16 / 9" … />  {/* hero banners */}`}
        >
          {RATIOS.map((r) => (
            <RatioBox key={r.label} ratio={r.ratio} label={r.label} use={r.use} />
          ))}
        </Example>
        <Note>
          Mixing arbitrary ratios in the same grid is what makes a real photography set look
          inconsistent — not the photos themselves. Pick one of these three per component type and
          keep it fixed; <code>MediaCard</code>&apos;s <code>aspectRatio</code> prop already takes
          any valid CSS <code>aspect-ratio</code> value, so this is a convention to hold to rather
          than a constraint the component enforces.
        </Note>
      </DocSection>

      <DocSection
        title="Where real images will land"
        description="Static brand assets live under brand/ today — logos are already there."
      >
        <Example
          layout="stacked"
          code={`brand/
  logos/          # existing
  photography/    # suggested location once real photos are approved`}
        >
          <div className="flex flex-col" style={{ gap: "var(--space-1)" }}>
            <code className="font-mono text-text-primary" style={{ fontSize: "var(--text-sm)" }}>
              brand/logos/
            </code>
            <span className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
              Already in use.
            </span>
            <code
              className="font-mono text-text-primary"
              style={{ fontSize: "var(--text-sm)", marginTop: "var(--space-2)" }}
            >
              brand/photography/
            </code>
            <span className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
              Not created yet — a reasonable home once a photo set is approved, not a required
              path.
            </span>
          </div>
        </Example>
        <Note>
          Three places in the kit currently take an <code>image</code> prop or fall back to the
          placeholder pattern: <Link href="/docs/media-card">MediaCard</Link>&apos;s{" "}
          <code>image</code> prop, <code>Avatar</code>&apos;s <code>src</code> prop, and{" "}
          <code>ProfileCard</code>&apos;s <code>avatar</code> prop. Any real photography plugs into
          those three slots — nothing else in the kit renders a photo today.
        </Note>
      </DocSection>

      <DocSection
        title="Treatment rules for when real photography arrives"
        description="Rules to lock in now, so the first real photo set doesn't set them by accident."
      >
        <Note>
          <strong>Crop and aspect.</strong> Every instance of a given component type uses the same
          ratio from the table above — no per-image exceptions.
          <br />
          <br />
          <strong>Overlay text on photo.</strong> Any photo with text over it needs a scrim, not a
          contrast check on the photo alone — <code>MediaCard</code>&apos;s <code>overlay</code>{" "}
          variant already does this with a gradient from <code>--surface-overlay</code> to
          transparent behind the text block. Reuse that scrim rather than inventing a new one per
          image.
          <br />
          <br />
          <strong>Grain and duotone.</strong> Undecided until there&apos;s a real photo to test it
          against — the existing <Link href="/docs/texture">texture</Link> system&apos;s grain
          overlay is a candidate for tying photography into the rest of the kit, but a photo is a
          much busier surface than a flat card, so it needs to be judged on one before it&apos;s
          adopted or ruled out.
          <br />
          <br />
          <strong>Object-fit.</strong> <code>cover</code> by default, matching how{" "}
          <code>MediaCard</code> already paints its background image — a source photo shot at the
          wrong ratio gets cropped, never stretched. <code>contain</code> is reserved for imagery
          that can&apos;t be cropped without losing meaning, such as a diagram or a screenshot.
        </Note>
      </DocSection>

      <DocSection
        title="Accessibility"
        description="Alt text is a content requirement, not an optional prop."
      >
        <Note>
          Every meaningful photo needs alt text that describes what it shows, written when the
          image is chosen, not left blank and patched later. A purely decorative image — one that
          adds nothing a screen reader user needs — gets <code>alt=&quot;&quot;</code> and{" "}
          <code>aria-hidden</code> so assistive tech skips it outright.{" "}
          <code>MediaCard</code>&apos;s own placeholder already does this: it renders with{" "}
          <code>role=&quot;presentation&quot;</code> and no label when there&apos;s no image, and
          only takes on <code>role=&quot;img&quot;</code> with the supplied <code>imageAlt</code>{" "}
          once a real image is passed in.
        </Note>
      </DocSection>

      <DocSection title="Reference">
        <PropsTable
          rows={[
            {
              name: "image",
              type: "string | undefined",
              description: "MediaCard's photo slot. Renders the token placeholder when absent.",
            },
            {
              name: "imageAlt",
              type: "string",
              defaultValue: `""`,
              description: "MediaCard's alt text, applied only when image is set.",
            },
            {
              name: "aspectRatio",
              type: "string",
              defaultValue: `"16 / 10"`,
              description: "Any valid CSS aspect-ratio value; standardize per component type.",
            },
            {
              name: "src",
              type: "string | undefined",
              description: "Avatar's photo slot. Falls back to initials or an icon when absent.",
            },
            {
              name: "avatar",
              type: "string | undefined",
              description: "ProfileCard's photo slot, same fallback behavior as Avatar.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
