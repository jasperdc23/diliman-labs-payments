import { DocPage, DocSection, Note } from "@/components/docs/doc-parts";
import { CodeBlock } from "@/components/docs/code-block";

export const metadata = { title: "Motion — EP Design Kit" };

const durations = [
  ["--duration-instant", "80ms", "Press and active feedback"],
  ["--duration-fast", "120ms", "Hover states, focus rings, underline reveals"],
  ["--duration-normal", "200ms", "Theme switch, panel enter and exit, card lift"],
];

const rules = [
  {
    title: "Only animate transform, opacity, and color",
    body: "Those are the properties the browser can run on the compositor — no layout recalculation, no repaint of the rest of the page. Never transition width, height, top or left. Use transform: scale() or translate() instead, which gets you the same visual result for a fraction of the work.",
  },
  {
    title: "One micro-interaction per element",
    body: "A button gets a press scale. A card gets a hover lift. A nav link gets an underline reveal. Stacking several animated properties on one element is what makes an interface feel busy rather than polished — the individual animations are rarely the problem, the pile-up is.",
  },
  {
    title: "Nothing animates on mount",
    body: "No fade-ins, no staggered lists on load. That's a cost paid on every single page view for a flourish that stops being noticeable after the first visit, and it delays the moment the page is actually usable.",
  },
  {
    title: "prefers-reduced-motion is handled globally",
    body: "Every transition and animation collapses to near-zero when the OS setting is on. It's one rule in globals.css, so component code never needs to check for it — and can't forget to.",
  },
];

export default function MotionDocs() {
  return (
    <DocPage
      title="Motion"
      description="Motion here is feedback, not choreography. Every duration is at or under 200ms, and every animated property is one the compositor can handle — so the interface feels responsive without costing frames."
    >
      <DocSection title="Durations">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {durations.map(([token, value, use]) => (
              <tr key={token} className="border-b border-border-subtle">
                <td className="py-3 pr-6 align-top font-mono text-xs whitespace-nowrap text-text-primary">
                  {token}
                </td>
                <td className="py-3 pr-6 align-top font-mono text-xs text-text-tertiary">
                  {value}
                </td>
                <td className="py-3 text-text-secondary">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DocSection>

      <DocSection title="Easing">
        <CodeBlock
          code={`--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);  /* most transitions */
--ease-out:      cubic-bezier(0, 0, 0.2, 1);    /* things entering */`}
        />
      </DocSection>

      <DocSection title="Rules">
        <div className="flex flex-col gap-3">
          {rules.map((rule) => (
            <div key={rule.title} className="glass grain rounded-lg border p-5">
              <h3 className="text-sm font-semibold text-text-primary">{rule.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{rule.body}</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="In practice">
        <CodeBlock
          code={`className="transition-[background-color,transform]
           duration-[var(--duration-fast)]
           ease-[var(--ease-standard)]
           active:scale-[0.97]"`}
        />
        <Note>
          The one honest exception is a loading spinner, which animates
          continuously by nature — it communicates that work is ongoing, so it
          isn&apos;t decoration. Under reduced motion it stops, and the disabled
          state plus <code className="font-mono text-xs">aria-busy</code> still
          carry the meaning.
        </Note>
      </DocSection>
    </DocPage>
  );
}
