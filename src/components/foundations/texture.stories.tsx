import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meshTokens = [
  { name: "mesh-1", var: "--mesh-1", role: "Violet — the accent's own hue" },
  { name: "mesh-2", var: "--mesh-2", role: "Sky — cool counterweight" },
  { name: "mesh-3", var: "--mesh-3", role: "Rose — warm counterweight" },
];

function TextureGuide() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "760px" }}>
      <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
        Two background layers give surfaces depth without adding weight: a
        three-color mesh gradient and a tiled grain texture. Both are CSS
        background layers on the element itself — no extra DOM, no JS, nothing
        animating — so they cost a single paint and nothing thereafter.
      </p>

      <section>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem" }}>
          Mesh stops
        </h2>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          {meshTokens.map((t) => (
            <div key={t.name} style={{ flex: 1 }}>
              <div
                style={{
                  height: "64px",
                  borderRadius: "0.5rem",
                  border: "1px solid var(--border-subtle)",
                  background: `var(${t.var})`,
                }}
              />
              <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>{t.name}</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>{t.role}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          Each stop is a radial gradient that fades to <code>transparent</code>, so the
          surface color underneath still shows through — the mesh tints a surface, it
          never replaces it. In dark mode the same three hues become near-black tints;
          bright pastels over a dark surface read as smudges rather than depth.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem" }}>Usage</h2>
        <div
          style={{
            border: "1px solid var(--border-subtle)",
            borderRadius: "0.75rem",
            padding: "1.25rem",
            fontSize: "0.875rem",
            color: "var(--text-secondary)",
            lineHeight: 1.8,
          }}
          className="glass grain"
        >
          <p>
            <code>.mesh</code> — page backgrounds only (sits on <code>--surface</code>)
          </p>
          <p>
            <code>.glass</code> — cards and containers: frosted white, blurring the page
            mesh behind it
          </p>
          <p>
            <code>.glass-flat</code> — same surface without the blur, for dense grids and
            long lists
          </p>
          <p>
            <code>.grain</code> — pair with any of them; adds the tiled noise overlay
          </p>
          <p style={{ marginTop: "0.75rem", color: "var(--text-tertiary)" }}>
            (This box uses <code>.glass .grain</code>.)
          </p>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem" }}>
          Keep it subtle
        </h2>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          Grain opacity is 3.5% in light mode and 5% in dark — grain reads much stronger on
          light surfaces than the number suggests, and dark surfaces need slightly more to
          register at all. If either effect is noticeable as an effect rather than as
          texture, it&apos;s turned up too far. The mesh stays on the page background and
          nowhere else — cards sit on it as frosted glass rather than carrying a wash of
          their own, because two gradients stacked make the card read as a gradient panel
          instead of a surface.
        </p>
      </section>
    </div>
  );
}

const meta: Meta<typeof TextureGuide> = {
  title: "Foundations/Texture",
  component: TextureGuide,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof TextureGuide>;

export const Guide: Story = {};
