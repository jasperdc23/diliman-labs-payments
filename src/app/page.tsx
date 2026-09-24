import Link from "next/link";
import { ArrowRight, GithubLogo } from "@phosphor-icons/react/ssr";
import { Nav } from "@/components/ui/nav";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/docs/code-block";

const pillars = [
  {
    title: "Token-driven",
    body: "Every color, space, radius and duration is a CSS custom property. Nothing hardcodes a value, so a brand swap is a token edit — not a refactor.",
  },
  {
    title: "Monochrome, brand-ready",
    body: "The kit ships black and white on purpose. Four token values turn it into your brand, and every component, chart and focus ring follows automatically.",
  },
  {
    title: "Light and dark from one source",
    body: "Themes are the same tokens redefined under one attribute. Components never branch on theme, so a new component is correct in both by default.",
  },
  {
    title: "Accessible by construction",
    body: "Real semantics, keyboard support, and a global focus ring. Charts carry legends and table views so no value is reachable only by hovering.",
  },
];

export default function Home() {
  return (
    <>
      <Nav />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-24 px-6 pt-24 pb-24 sm:px-10">
        <section className="flex flex-col gap-6">
          <p className="font-mono text-xs tracking-widest text-text-tertiary uppercase">
            EP Design Kit
          </p>
          <h1 className="max-w-3xl text-4xl leading-tight font-semibold tracking-tight text-balance text-text-primary sm:text-5xl">
            A UI foundation that&apos;s ready for a brand, not waiting on one.
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-text-secondary">
            Components, tokens and standards for building your product interfaces —
            monochrome today, one token edit away from branded. Built to be
            cloned, copied from, or installed as-is.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/docs">
              <Button size="lg" iconRight={<ArrowRight size={18} />}>
                Browse the docs
              </Button>
            </Link>
            <Link href="/docs/installation">
              <Button size="lg" variant="secondary">
                Installation
              </Button>
            </Link>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-medium text-text-tertiary">Get started</h2>
          <CodeBlock
            code={`git clone https://github.com/jasperdc23/ep-design-repo-kit.git
cd ep-design-repo-kit
npm install
npm run dev`}
          />
        </section>

        <section className="flex flex-col gap-8">
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
            How it&apos;s built
          </h2>
          <div className="grid gap-px overflow-hidden rounded-lg border border-border-subtle bg-border-subtle sm:grid-cols-2">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="glass grain flex flex-col gap-2 p-6">
                <h3 className="text-base font-semibold text-text-primary">{pillar.title}</h3>
                <p className="text-sm leading-relaxed text-text-secondary">{pillar.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
            Make it yours
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
            The whole kit is monochrome because a placeholder brand color is
            worse than none — it makes decisions look settled when they
            aren&apos;t. These four values are the entire swap.
          </p>
          <CodeBlock
            label="src/styles/tokens.css"
            code={`:root {
  --accent-500: #16181b;  /* light mode — needs to clear white text */
  --accent-600: #0a0b0c;  /* light mode hover, one step darker */
  --accent-400: #f1f3f5;  /* dark mode — needs to clear dark text */
  --accent-300: #ffffff;  /* dark mode hover, one step lighter */
}`}
          />
          <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
            Buttons, focus rings, links, selected states and chart series all
            reference those. Nothing else needs to change.{" "}
            <Link href="/docs/theming" className="text-text-primary underline underline-offset-4">
              Full theming guide
            </Link>
            .
          </p>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-8">
          <p className="text-sm text-text-tertiary">
            Internal design kit — not for external distribution.
          </p>
          <a
            href="https://github.com/jasperdc23/ep-design-repo-kit"
            className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors duration-[var(--duration-fast)] hover:text-text-primary"
          >
            <GithubLogo size={16} />
            Repository
          </a>
        </footer>
      </main>
    </>
  );
}
