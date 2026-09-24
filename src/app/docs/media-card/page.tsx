import { Button } from "@/components/ui/button";
import { MediaCard } from "@/components/ui/media-card";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Media card — Diliman Labs" };

const swatch = (from: string, to: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/></linearGradient></defs><rect width="320" height="200" fill="url(#g)"/><circle cx="252" cy="48" r="44" fill="rgba(255,255,255,0.18)"/><circle cx="60" cy="172" r="72" fill="rgba(0,0,0,0.12)"/></svg>`,
  )}`;

const terminalPhoto = swatch("#3a3a2e", "#0d0e10");
const signagePhoto = swatch("#4a4636", "#141618");

export default function MediaCardDocs() {
  return (
    <DocPage
      title="Media card"
      description="A Card with an image on top and a fixed slot order — eyebrow, title, description, footer. Reach for it in browsing grids where an image is what people scan by; for comparing numbers, a stat card or a list row will read faster."
    >
      <DocSection
        title="Basic usage"
        description="Everything but title is optional. The card is built on Card with padded={false}, so the image runs edge to edge and the text block below supplies its own padding."
      >
        <Example
          code={`<MediaCard
  className="max-w-sm"
  image={terminalPhoto}
  imageAlt="Countertop payment terminal"
  eyebrow="Hardware"
  title="Terminal S2"
  description="Accepts QR Ph, InstaPay transfers and tap-to-pay cards. Settles to the merchant wallet the next banking day."
  footer={<span className="text-text-tertiary">Updated 27 Aug 2026</span>}
/>`}
        >
          <MediaCard
            className="max-w-sm"
            image={terminalPhoto}
            imageAlt="Countertop payment terminal"
            eyebrow="Hardware"
            title="Terminal S2"
            description="Accepts QR Ph, InstaPay transfers and tap-to-pay cards. Settles to the merchant wallet the next banking day."
            footer={
              <span className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
                Updated 27 Aug 2026
              </span>
            }
          />
        </Example>
      </DocSection>

      <DocSection
        title="Without an image"
        description="Leave image off and a token-built placeholder renders in its place — a faint diagonal hatch over the sunken surface. A card with no artwork yet still holds its shape in a grid instead of collapsing or looking broken."
      >
        <Example
          code={`<MediaCard
  className="max-w-sm"
  eyebrow="Coming soon"
  title="Merchant insights"
  description="Daily volume, refund rate and settlement lag per store."
/>`}
        >
          <MediaCard
            className="max-w-sm"
            eyebrow="Coming soon"
            title="Merchant insights"
            description="Daily volume, refund rate and settlement lag per store."
          />
        </Example>
      </DocSection>

      <DocSection
        title="Interactive"
        description="interactive lifts the card on hover and scales the media a touch inside its clipped frame. Two moves, one gesture — use it only when the whole tile navigates somewhere."
      >
        <Example
          code={`<MediaCard
  interactive
  className="max-w-sm"
  image={signagePhoto}
  imageAlt="QR Ph acceptance signage"
  eyebrow="Guide"
  title="Rolling out QR Ph in-store"
  description="What to print, where to place it, and how staff should handle disputes."
  footer={<Button size="sm">Read guide</Button>}
/>`}
        >
          <MediaCard
            interactive
            className="max-w-sm"
            image={signagePhoto}
            imageAlt="QR Ph acceptance signage"
            eyebrow="Guide"
            title="Rolling out QR Ph in-store"
            description="What to print, where to place it, and how staff should handle disputes."
            footer={<Button size="sm">Read guide</Button>}
          />
        </Example>
      </DocSection>

      <DocSection
        title="Overlay"
        description="overlay drops the text onto the image behind a bottom-up scrim instead of stacking it underneath. It suits a single hero tile with a short title; body copy longer than a line or two gets hard to read over photography, however dark the scrim."
      >
        <Example
          code={`<MediaCard
  overlay
  interactive
  className="max-w-sm"
  image={terminalPhoto}
  imageAlt="Merchant reviewing a payout summary"
  aspectRatio="4 / 3"
  eyebrow="Payouts"
  title="₱482,190.40 settled this week"
  description="Across 1,284 InstaPay and PESONet transfers."
/>`}
        >
          <MediaCard
            overlay
            interactive
            className="max-w-sm"
            image={terminalPhoto}
            imageAlt="Merchant reviewing a payout summary"
            aspectRatio="4 / 3"
            eyebrow="Payouts"
            title="₱482,190.40 settled this week"
            description="Across 1,284 InstaPay and PESONet transfers."
          />
        </Example>
        <Note>
          Overlay text is pinned to white at fixed opacities rather than following the theme tokens,
          because it sits on the image and not on a surface. That means it stays legible when the
          theme flips, but it also means a pale image will wash it out — pick artwork with a dark
          lower third.
        </Note>
      </DocSection>

      <DocSection
        title="Aspect ratio"
        description="aspectRatio is any CSS aspect-ratio value and defaults to 16 / 10. Pick one ratio per grid and keep it — mixed ratios in the same grid make the row of titles below them jump around."
      >
        <Example
          code={`<MediaCard className="max-w-xs" aspectRatio="1 / 1" eyebrow="Square" title="1 / 1" />
<MediaCard className="max-w-xs" aspectRatio="21 / 9" eyebrow="Wide" title="21 / 9" />`}
        >
          <MediaCard className="max-w-xs" aspectRatio="1 / 1" eyebrow="Square" title="1 / 1" />
          <MediaCard className="max-w-xs" aspectRatio="21 / 9" eyebrow="Wide" title="21 / 9" />
        </Example>
      </DocSection>

      <DocSection
        title="In a grid"
        description="The usual home for these. Set flat on every tile — a backdrop blur per card is the one texture effect here that costs frame time, and a grid is exactly where it multiplies."
      >
        <Example
          layout="stacked"
          code={`<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  <MediaCard flat interactive image={terminalPhoto} imageAlt="Countertop payment terminal" eyebrow="Hardware" title="Terminal S2" description="Tap-to-pay, QR Ph and InstaPay in one countertop unit." />
  <MediaCard flat interactive image={signagePhoto} imageAlt="QR Ph acceptance signage" eyebrow="Guide" title="Rolling out QR Ph" description="What to print and where to place it." />
  <MediaCard flat interactive eyebrow="Product" title="Merchant wallet" description="Hold, split and sweep balances from the dashboard." />
</div>`}
        >
          <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MediaCard
              flat
              interactive
              image={terminalPhoto}
              imageAlt="Countertop payment terminal"
              eyebrow="Hardware"
              title="Terminal S2"
              description="Tap-to-pay, QR Ph and InstaPay in one countertop unit."
            />
            <MediaCard
              flat
              interactive
              image={signagePhoto}
              imageAlt="QR Ph acceptance signage"
              eyebrow="Guide"
              title="Rolling out QR Ph"
              description="What to print and where to place it."
            />
            <MediaCard
              flat
              interactive
              eyebrow="Product"
              title="Merchant wallet"
              description="Hold, split and sweep balances from the dashboard."
            />
          </div>
        </Example>
        <Note>
          The footer is pushed to the bottom of the text block, so cards in the same grid row line
          their footers up even when their descriptions run to different lengths.
        </Note>
      </DocSection>

      <DocSection
        title="Accessibility"
        description="The media is a background image on a div, not an <img>."
      >
        <Note>
          When <code>image</code> is set the media gets <code>role=&quot;img&quot;</code> and your{" "}
          <code>imageAlt</code> as its label; <code>imageAlt</code> defaults to an empty string, so a
          decorative image is correctly skipped but a meaningful one is silent until you write the
          alt text. The placeholder is marked <code>role=&quot;presentation&quot;</code> and needs
          nothing. Because it is a background image, it will not print by default and does not carry
          its own intrinsic size.
        </Note>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "title",
              type: "string",
              description: "Required. Rendered as a CardTitle (an h3).",
            },
            {
              name: "description",
              type: "ReactNode",
              description: "Body copy under the title. Omitted entirely when not supplied.",
            },
            {
              name: "eyebrow",
              type: "string",
              description: "Small uppercase label above the title — category, status or section.",
            },
            {
              name: "footer",
              type: "ReactNode",
              description:
                "Bottom slot. In the default layout it sits in a CardFooter pushed to the bottom; in overlay mode it sits inside the scrim.",
            },
            {
              name: "image",
              type: "string",
              description:
                "Any CSS-loadable URL, applied as a cover background. Omit for the token-built placeholder.",
            },
            {
              name: "imageAlt",
              type: "string",
              defaultValue: `""`,
              description:
                "Accessible name for the media. Only used when image is set; empty means decorative.",
            },
            {
              name: "aspectRatio",
              type: "string",
              defaultValue: `"16 / 10"`,
              description: "Any CSS aspect-ratio value applied to the media frame.",
            },
            {
              name: "overlay",
              type: "boolean",
              defaultValue: "false",
              description: "Puts the text over the image behind a scrim instead of below it.",
            },
            {
              name: "interactive",
              type: "boolean",
              defaultValue: "false",
              description:
                "Hover lift on the card plus a slight scale on the media. Styling only — wrap it in a link or button for real behavior.",
            },
            {
              name: "flat",
              type: "boolean",
              defaultValue: "false",
              description: "Passed through to Card: drops the backdrop blur. Use in grids.",
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
