import Link from "next/link";
import type { ReactNode } from "react";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Texture — Diliman Labs" };

const MESH_STOPS = [
  { token: "--mesh-1", role: "Top-left wash. The accent's own hue once a brand color lands." },
  { token: "--mesh-2", role: "Top-right wash. The cool counterweight." },
  { token: "--mesh-3", role: "Bottom-center wash. The warm counterweight." },
];

function Backdrop({ children }: { children: ReactNode }) {
  return (
    <div
      className="mesh grain flex w-full flex-wrap items-center justify-center rounded-lg border border-border-subtle"
      style={{ padding: "var(--space-8)", gap: "var(--space-4)", minHeight: "200px" }}
    >
      {children}
    </div>
  );
}

function Tile({ className, label, note }: { className: string; label: string; note: string }) {
  return (
    <div
      className={`${className} flex flex-col rounded-lg border`}
      style={{ padding: "var(--space-6)", gap: "var(--space-1)", width: "220px" }}
    >
      <code className="font-mono text-text-primary" style={{ fontSize: "var(--text-sm)" }}>
        {label}
      </code>
      <span className="text-text-secondary" style={{ fontSize: "var(--text-xs)" }}>
        {note}
      </span>
    </div>
  );
}

export default function TextureDocs() {
  return (
    <DocPage
      title="Texture"
      description="Two background layers give surfaces depth without adding weight: a three-stop mesh gradient and a tiled grain overlay. Both are CSS background layers on the element itself — no extra DOM, no JavaScript, nothing animating — so they cost a single paint and nothing thereafter."
    >
      <DocSection
        title="The four classes"
        description="Everything in this system is one of four utility classes, and each has exactly one job. Getting the pairing right is most of what this page is about."
      >
        <Example
          layout="stacked"
          code={`<body className="mesh">        {/* page background only */}
  <div className="glass grain">      {/* a card or container */}
  <div className="glass-flat grain"> {/* the same, in a dense grid or long list */}
</body>`}
        >
          <Backdrop>
            <Tile className="glass grain" label=".glass .grain" note="Frosted card on the page mesh" />
            <Tile
              className="glass-flat grain"
              label=".glass-flat .grain"
              note="Same surface, no blur"
            />
          </Backdrop>
        </Example>
        <Note>
          The two tiles above sit on a <code>.mesh</code> backdrop standing in for a page. The
          difference between them is only visible over texture — judge <code>.glass</code> against
          <code>.glass-flat</code> on a real page, never on a flat white one.
        </Note>
      </DocSection>

      <DocSection
        title=".mesh — page backgrounds only"
        description="Three radial gradients, each fading to transparent over the surface color, anchored top-left, top-right and bottom-center. Because they fade rather than fill, the surface underneath still shows through: the mesh tints a surface, it never replaces it."
      >
        <Example
          layout="stacked"
          code={`.mesh {
  background-color: var(--surface);
  background-image:
    radial-gradient(at 12% 15%, var(--mesh-1) 0%, transparent 55%),
    radial-gradient(at 88% 10%, var(--mesh-2) 0%, transparent 55%),
    radial-gradient(at 50% 100%, var(--mesh-3) 0%, transparent 55%);
}`}
        >
          <div className="flex w-full flex-wrap" style={{ gap: "var(--space-4)" }}>
            {MESH_STOPS.map((stop) => (
              <div key={stop.token} className="flex flex-1 flex-col" style={{ gap: "var(--space-2)", minWidth: "160px" }}>
                <div
                  className="rounded-md border border-border-subtle"
                  style={{ height: "64px", background: `var(${stop.token})` }}
                />
                <code className="font-mono text-text-primary" style={{ fontSize: "var(--text-sm)" }}>
                  {stop.token}
                </code>
                <span className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
                  {stop.role}
                </span>
              </div>
            ))}
          </div>
        </Example>
        <Note>
          The mesh goes on the page and nowhere else. Cards sit on it as frosted glass rather than
          carrying a wash of their own, because two gradients stacked make a card read as a gradient
          panel instead of a surface. In dark mode the same three stops become near-black tints
          rather than flipped washes — bright tints over a dark surface read as smudges, not depth.
        </Note>
      </DocSection>

      <DocSection
        title=".glass and .glass-flat — containers"
        description="Both paint the same translucent surface and the same border. .glass adds a backdrop-filter that blurs the page mesh behind it; .glass-flat leaves it off. A backdrop-filter is repainted whenever what is behind it moves, which makes it the one texture effect here that actually costs frame time."
      >
        <Example
          layout="stacked"
          code={`{/* a handful of standalone containers — blur is affordable */}
<Card>…</Card>

{/* a grid or a long list — one blur per item is not */}
<Card flat>…</Card>`}
        >
          <Backdrop>
            <Tile className="glass" label=".glass" note="Blurs what is behind it" />
            <Tile className="glass-flat" label=".glass-flat" note="Translucent, no blur" />
          </Backdrop>
        </Example>
        <Note>
          The rule of thumb: if the element appears more than about a dozen times on one screen, or
          scrolls, it should be flat. <Link href="/docs/card">Card</Link> and everything built on it
          take a <code>flat</code> prop that makes exactly this swap, and{" "}
          <Link href="/docs/glass-panel">Glass panel</Link> is always blurred because it is meant for
          the handful of elements floating above the page. Where <code>backdrop-filter</code> is
          unsupported, <code>.glass</code> degrades to its translucent background — legible, but
          without the separation, so keep contrast honest.
        </Note>
      </DocSection>

      <DocSection
        title=".grain — pairs with any of them"
        description="A tiled SVG noise texture drawn in an ::after pseudo-element at inset 0, with border-radius: inherit so it stays inside rounded corners and pointer-events: none so it never eats a click. It overlays only the element's own box, so no overflow clipping is needed."
      >
        <Example
          layout="stacked"
          code={`<div className="glass grain rounded-lg border">…</div>`}
        >
          <Backdrop>
            <Tile className="glass-flat" label="no grain" note="Flat translucent surface" />
            <Tile className="glass-flat grain" label=".grain" note="Same surface, tiled noise on top" />
          </Backdrop>
        </Example>
        <Note>
          Grain opacity is 3.5% in light mode and 5% in dark. Grain reads much stronger on light
          surfaces than the number suggests, and dark surfaces need slightly more to register at all.
          The blend mode is <code>overlay</code>, so it modulates whatever is underneath rather than
          laying gray on top. If either effect is noticeable as an effect rather than as texture, it
          is turned up too far.
        </Note>
      </DocSection>

      <DocSection
        title="Putting it together"
        description="A page, a card on it, and a dense list inside that card — the whole system in one arrangement."
      >
        <Example
          layout="stacked"
          code={`<main className="mesh">
  <Card>            {/* .glass .grain — a standalone card */}
    <CardTitle>Payout summary</CardTitle>
  </Card>

  <Card flat padded={false}>  {/* .glass-flat .grain — holds a long list */}
    <List>…</List>
  </Card>
</main>`}
        >
          <Backdrop>
            <div className="glass grain flex flex-col rounded-lg border" style={{ padding: "var(--space-6)", gap: "var(--space-2)", width: "220px" }}>
              <span className="font-semibold text-text-primary" style={{ fontSize: "var(--text-base)" }}>
                Payout summary
              </span>
              <span className="text-text-secondary" style={{ fontSize: "var(--text-sm)" }}>
                ₱482,190.40 settled on 27 Aug 2026.
              </span>
            </div>
            <div className="glass-flat grain flex flex-col overflow-hidden rounded-lg border" style={{ width: "260px" }}>
              {["InstaPay · BPI ••4821", "PESONet · Landbank ••7730", "QR Ph · Store 12"].map(
                (row, index) => (
                  <span
                    key={row}
                    className={`text-text-secondary ${index > 0 ? "border-t border-border-subtle" : ""}`}
                    style={{ padding: "var(--space-3) var(--space-4)", fontSize: "var(--text-sm)" }}
                  >
                    {row}
                  </span>
                ),
              )}
            </div>
          </Backdrop>
        </Example>
      </DocSection>

      <DocSection title="Tokens">
        <PropsTable
          rows={[
            {
              name: "--mesh-1",
              type: "color",
              defaultValue: "#eef0f2 / #202225",
              description:
                "Top-left radial stop. Light value first, dark second — same for all three.",
            },
            {
              name: "--mesh-2",
              type: "color",
              defaultValue: "#f4f5f7 / #191b1e",
              description: "Top-right radial stop, the cool counterweight.",
            },
            {
              name: "--mesh-3",
              type: "color",
              defaultValue: "#e9ebee / #232629",
              description: "Bottom-center radial stop, the warm counterweight.",
            },
            {
              name: "--grain-opacity",
              type: "number",
              defaultValue: "0.035 / 0.05",
              description:
                "Opacity of the noise overlay. Dark surfaces get more because there is less luminance range for it to work against.",
            },
            {
              name: "--grain-texture",
              type: "url()",
              defaultValue: "inline SVG",
              description:
                "A 200×200 fractal-noise SVG data URI, tiled at 180px. No network request.",
            },
            {
              name: "--glass-bg",
              type: "color",
              defaultValue: "rgba(255,255,255,.65) / rgba(22,24,27,.55)",
              description: "Surface color for both .glass and .glass-flat.",
            },
            {
              name: "--glass-border",
              type: "color",
              defaultValue: "rgba(255,255,255,.5) / rgba(255,255,255,.08)",
              description: "Border color for both, brighter than the surface to catch the edge.",
            },
            {
              name: "--glass-blur",
              type: "length",
              defaultValue: "16px",
              description: "Backdrop blur radius. Applied by .glass only.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
