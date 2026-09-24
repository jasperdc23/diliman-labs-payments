import { DocPage, DocSection, Note } from "@/components/docs/doc-parts";
import { CodeBlock } from "@/components/docs/code-block";

export const metadata = { title: "Theming — Diliman Labs" };

export default function ThemingDocs() {
  return (
    <DocPage
      title="Theming"
      description="The kit is monochrome on purpose. Adding a brand color is four values — this page explains which four, and why it's only four."
    >
      <DocSection
        title="Three layers"
        description="Tokens are layered so that meaning sits between raw values and the components that use them."
      >
        <div className="flex flex-col gap-3">
          {[
            [
              "Primitives",
              "--gray-0 … --gray-1000, --accent-300 … --accent-600",
              "Raw values with no meaning attached. A brand swap only touches this layer.",
            ],
            [
              "Semantic",
              "--surface, --text-primary, --accent, --border-default",
              "Meaning attached, and theme-aware — these are what flip between light and dark.",
            ],
            [
              "Tailwind aliases",
              "bg-surface, text-text-primary, bg-accent",
              "The semantic layer exposed as utility classes via @theme inline.",
            ],
          ].map(([name, tokens, what]) => (
            <div key={name} className="glass grain rounded-lg border p-5">
              <h3 className="text-sm font-semibold text-text-primary">{name}</h3>
              <p className="mt-1 font-mono text-xs text-text-tertiary">{tokens}</p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{what}</p>
            </div>
          ))}
        </div>
        <Note>
          Components only ever reference the semantic layer or the Tailwind
          aliases. That indirection is what makes a brand swap a four-line change
          instead of a find-and-replace across sixty files.
        </Note>
      </DocSection>

      <DocSection
        title="Adding a brand color"
        description="Change these four primitives and stop. Everything downstream — buttons, focus rings, selected states, links, chart series — reads from them."
      >
        <CodeBlock
          label="src/styles/tokens.css"
          code={`:root {
  --accent-500: #6955ed;  /* light mode base */
  --accent-600: #5843d1;  /* light mode hover — one step darker */
  --accent-400: #8c7cf7;  /* dark mode base */
  --accent-300: #a79bfa;  /* dark mode hover — one step lighter */
}`}
        />
        <Note>
          Two constraints on those values. The light pair (500/600) sits under
          white text, so it needs to be dark enough to clear 4.5:1. The dark pair
          (300/400) sits under dark text on a near-black surface, so it needs to
          be light enough to clear the same bar — the same hex rarely works for
          both, which is why there are two pairs rather than one color. If you
          change which side carries which, update{" "}
          <code className="font-mono text-xs">--text-on-accent</code> to match.
        </Note>
      </DocSection>

      <DocSection
        title="Dark mode"
        description="Not a filter over light mode — a second set of values for the same semantic names."
      >
        <CodeBlock
          code={`:root {
  --surface: var(--gray-0);
  --text-primary: var(--gray-900);
  --accent: var(--accent-500);
}

[data-theme="dark"] {
  --surface: var(--gray-950);
  --text-primary: var(--gray-50);
  --accent: var(--accent-400);
}`}
        />
        <p className="text-sm leading-relaxed text-text-secondary">
          Because components reference{" "}
          <code className="font-mono text-xs">--surface</code> rather than a
          specific gray, a new component is correct in both themes without being
          written twice — and without a single{" "}
          <code className="font-mono text-xs">dark:</code> variant in the markup.
        </p>
      </DocSection>

      <DocSection
        title="What a brand color unlocks"
        description="One part of the system is genuinely held back by monochrome."
      >
        <Note>
          Charts. A categorical palette distinguishes series by hue, and grayscale
          has none — so the chart series are currently lightness steps paired with
          dash patterns as a secondary channel, which caps comfortable use at four
          series. With a brand hue in place, the palette can expand to eight
          validated slots and hue does the work that dashes are doing now. Until
          then, past four series, group into &quot;Other&quot; or split into small
          multiples.
        </Note>
      </DocSection>

      <DocSection
        title="Beyond color"
        description="The other brand inputs and where they go."
      >
        <table className="w-full border-collapse text-sm">
          <tbody>
            {[
              ["Typeface", "brand/fonts/ — load via next/font/local, then point --font-sans at it"],
              ["Logo", "brand/logos/ — SVG lockups, referenced from the nav and favicon"],
              ["Voice and copy", "brand/BRAND_VOICE.md — tone, terminology, error message patterns"],
              ["Page background tint", "--mesh-1 / --mesh-2 / --mesh-3, currently neutral"],
            ].map(([k, v]) => (
              <tr key={k} className="border-b border-border-subtle">
                <td className="py-3 pr-6 align-top font-medium whitespace-nowrap text-text-primary">
                  {k}
                </td>
                <td className="py-3 font-mono text-xs text-text-secondary">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DocSection>
    </DocPage>
  );
}
