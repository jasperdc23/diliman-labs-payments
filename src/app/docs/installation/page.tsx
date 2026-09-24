import { DocPage, DocSection, Note } from "@/components/docs/doc-parts";
import { CodeBlock } from "@/components/docs/code-block";

export const metadata = { title: "Installation — Diliman Labs" };

export default function InstallationDocs() {
  return (
    <DocPage
      title="Installation"
      description="Clone the kit as a starting point, or lift the tokens into an app you already have."
    >
      <DocSection title="Clone and run">
        <CodeBlock
          code={`git clone https://github.com/jasperdc23/diliman-labs-payments.git
cd diliman-labs-payments
npm install
npm run dev`}
        />
        <p className="text-sm leading-relaxed text-text-secondary">
          The app runs at <code className="font-mono text-xs">localhost:3000</code> and
          serves this documentation. <code className="font-mono text-xs">npm run storybook</code>{" "}
          starts the component workbench at{" "}
          <code className="font-mono text-xs">localhost:6006</code> if you prefer
          building components in isolation.
        </p>
      </DocSection>

      <DocSection
        title="Into an existing app"
        description="The tokens are the part worth taking. They're plain CSS custom properties with no build step and no dependency."
      >
        <CodeBlock
          label="Step 1 — copy the token file"
          code={`cp src/styles/tokens.css <your-app>/src/styles/tokens.css`}
        />
        <CodeBlock
          label="Step 2 — import it, then map the tokens Tailwind should know about"
          code={`@import "tailwindcss";
@import "./styles/tokens.css";

@theme inline {
  --color-surface: var(--surface);
  --color-surface-raised: var(--surface-raised);
  --color-text-primary: var(--text-primary);
  --color-accent: var(--accent);
  /* ...only the roles you actually use */
}`}
        />
        <p className="text-sm leading-relaxed text-text-secondary">
          Copy whole components out of{" "}
          <code className="font-mono text-xs">src/components/ui/</code> as you need
          them. Each one is self-contained apart from its CSS module and the
          tokens, so there&apos;s no package to install and nothing to keep in sync.
        </p>
      </DocSection>

      <DocSection
        title="Dark mode"
        description="Themes are driven by a data-theme attribute on <html>."
      >
        <CodeBlock
          code={`import { ThemeProvider } from "@/components/theme-provider";

<ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>`}
        />
        <Note>
          Put <code className="font-mono text-xs">suppressHydrationWarning</code> on
          the <code className="font-mono text-xs">&lt;html&gt;</code> element. The
          theme is read from storage before React hydrates, so the server and
          client markup deliberately disagree for one frame — without the flag,
          React logs a hydration warning for something that is working correctly.
        </Note>
      </DocSection>

      <DocSection title="Requirements">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {[
              ["Node", "20 or newer"],
              ["React", "19"],
              ["Next.js", "16 (App Router)"],
              ["Tailwind CSS", "4 — the tokens rely on @theme inline"],
            ].map(([k, v]) => (
              <tr key={k} className="border-b border-border-subtle">
                <td className="py-3 pr-6 align-top font-mono text-xs whitespace-nowrap text-text-primary">
                  {k}
                </td>
                <td className="py-3 text-text-secondary">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Note>
          Only two runtime dependencies beyond the framework:{" "}
          <code className="font-mono text-xs">next-themes</code> for theme
          persistence and <code className="font-mono text-xs">@phosphor-icons/react</code>{" "}
          for icons. The charts are hand-rolled SVG rather than a charting
          library, so there&apos;s nothing else to pull in.
        </Note>
      </DocSection>
    </DocPage>
  );
}
