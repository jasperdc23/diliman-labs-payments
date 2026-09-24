import Link from "next/link";
import { DocPage, DocSection, Note } from "@/components/docs/doc-parts";

export const metadata = { title: "Overview — Diliman Labs" };

const structure = [
  ["src/styles/tokens.css", "Every design token. The single source of truth."],
  ["src/app/globals.css", "Tailwind aliases for the tokens, plus the glass/mesh/grain utilities."],
  ["src/components/ui/", "The component library."],
  ["src/components/docs/", "The shell these documentation pages are built from."],
  ["src/app/docs/", "This documentation site."],
  ["brand/", "Where logos, fonts and brand voice land when they're defined."],
];

export default function DocsOverview() {
  return (
    <DocPage
      title="Overview"
      description="This kit's UI foundation: design tokens, components, and the standards that hold them together. It's deliberately monochrome so that brand decisions stay visible as decisions rather than getting baked in as defaults."
    >
      <DocSection
        title="How to use this kit"
        description="Three ways, depending on how much you need."
      >
        <div className="flex flex-col gap-4">
          <div className="glass grain rounded-lg border p-5">
            <h3 className="mb-1 text-sm font-semibold text-text-primary">Copy a component</h3>
            <p className="text-sm leading-relaxed text-text-secondary">
              Every page here has copyable snippets. Take the markup, take the
              tokens it references, done. Best when you need one thing.
            </p>
          </div>
          <div className="glass grain rounded-lg border p-5">
            <h3 className="mb-1 text-sm font-semibold text-text-primary">Clone the repo</h3>
            <p className="text-sm leading-relaxed text-text-secondary">
              Fork it as the starting point for a new surface. You get the
              tokens, the components, and the theming wired up.{" "}
              <Link href="/docs/installation" className="text-text-primary underline underline-offset-4">
                Installation
              </Link>
              .
            </p>
          </div>
          <div className="glass grain rounded-lg border p-5">
            <h3 className="mb-1 text-sm font-semibold text-text-primary">
              Adopt the tokens only
            </h3>
            <p className="text-sm leading-relaxed text-text-secondary">
              Drop <code className="font-mono text-xs">tokens.css</code> into an
              existing app and build against the same scale. The components are
              optional; the tokens are the part that keeps surfaces consistent.
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection
        title="The one rule"
        description="Everything else in these docs follows from it."
      >
        <Note>
          Never hardcode a value. Reach for a token, and if none fits, add a step
          to the scale rather than writing a one-off. That&apos;s the whole
          mechanism behind theming, dark mode, and the brand swap — the moment a
          component hardcodes a color or a pixel value, all three break for that
          component only, which is the worst way to find out.
        </Note>
      </DocSection>

      <DocSection title="Where things live">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {structure.map(([path, what]) => (
              <tr key={path} className="border-b border-border-subtle">
                <td className="py-3 pr-6 align-top font-mono text-xs whitespace-nowrap text-text-primary">
                  {path}
                </td>
                <td className="py-3 text-text-secondary">{what}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DocSection>

      <DocSection
        title="Status"
        description="What's settled and what's still open."
      >
        <Note>
          Settled: the token architecture, spacing and radius scales, motion
          rules, and the component set. Still open: the brand color, typeface,
          logo and voice — all placeholders. The kit is structured so those land
          as token and asset swaps rather than as a rewrite, but nothing here
          should be read as final brand identity.
        </Note>
      </DocSection>
    </DocPage>
  );
}
