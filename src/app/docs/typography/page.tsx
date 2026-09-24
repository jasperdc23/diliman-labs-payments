import Link from "next/link";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Typography — Diliman Labs" };

const SCALE = [
  { token: "--text-5xl", value: "3rem", px: "48px", use: "Marketing headline. Once per page, if at all." },
  { token: "--text-4xl", value: "2.25rem", px: "36px", use: "Page title — what DocPage uses." },
  { token: "--text-3xl", value: "1.875rem", px: "30px", use: "The figure in a stat card." },
  { token: "--text-2xl", value: "1.5rem", px: "24px", use: "Major section heading." },
  { token: "--text-xl", value: "1.25rem", px: "20px", use: "Section heading inside a page." },
  { token: "--text-lg", value: "1.125rem", px: "18px", use: "Lead paragraph, modal title." },
  { token: "--text-base", value: "1rem", px: "16px", use: "Body copy and card titles. The default." },
  { token: "--text-sm", value: "0.875rem", px: "14px", use: "Dense UI: table cells, list rows, helper text." },
  { token: "--text-xs", value: "0.75rem", px: "12px", use: "Labels, eyebrows, captions. Never a paragraph." },
];

const LEADING = [
  {
    token: "--leading-tight",
    value: "1.2",
    use: "Headings and large figures, where default leading opens a visible gap between lines.",
  },
  {
    token: "--leading-normal",
    value: "1.5",
    use: "UI text — labels, buttons, table cells, anything a line or two long.",
  },
  {
    token: "--leading-relaxed",
    value: "1.7",
    use: "Running prose. Longer measures need more room between lines to track.",
  },
];

const SAMPLE = "Settled ₱482,190.40 across 1,284 transfers on 27 Aug 2026";

export default function TypographyDocs() {
  return (
    <DocPage
      title="Typography"
      description="Nine sizes, three line heights and two faces. The scale is deliberately short — a type system people can hold in their head gets used consistently, and every extra step is one more chance for two things that should match to end up a pixel apart."
    >
      <DocSection
        title="Type scale"
        description="A modular-ish ramp in rem, so it respects the reader's browser font size. Sizes are set with the token rather than a raw value: change one token and every use of that step follows."
      >
        <Example
          layout="stacked"
          code={`<h1 style={{ fontSize: "var(--text-4xl)", lineHeight: "var(--leading-tight)" }}>
  Page title
</h1>

/* or, through Tailwind's matching utilities */
<p className="text-sm">Helper text</p>`}
        >
          <div className="flex w-full flex-col" style={{ gap: "var(--space-6)" }}>
            {SCALE.map((step) => (
              <div key={step.token} className="flex flex-col" style={{ gap: "var(--space-1)" }}>
                <div
                  className="flex flex-wrap items-baseline text-text-tertiary"
                  style={{ gap: "var(--space-3)", fontSize: "var(--text-xs)" }}
                >
                  <code className="font-mono text-text-secondary">{step.token}</code>
                  <span className="tabular-nums">
                    {step.value} · {step.px}
                  </span>
                </div>
                <p
                  className="truncate text-text-primary"
                  style={{ fontSize: `var(${step.token})`, lineHeight: "var(--leading-tight)" }}
                >
                  {SAMPLE}
                </p>
                <p className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
                  {step.use}
                </p>
              </div>
            ))}
          </div>
        </Example>
        <Note>
          Pick the step by the job, not by the look. If a heading needs to be smaller to fit, the
          layout is too tight — shorten the text or widen the column rather than reaching for a size
          between two steps. Nothing in this kit sets a font size that is not one of these nine.
        </Note>
      </DocSection>

      <DocSection
        title="Line height"
        description="Three values, and they move in the opposite direction to size: the bigger the text, the tighter the leading it wants. Large type already has generous space between lines because the letters themselves are tall."
      >
        <Example
          layout="stacked"
          code={`<h2 style={{ fontSize: "var(--text-2xl)", lineHeight: "var(--leading-tight)" }}>…</h2>
<p style={{ fontSize: "var(--text-sm)", lineHeight: "var(--leading-normal)" }}>…</p>
<p style={{ fontSize: "var(--text-base)", lineHeight: "var(--leading-relaxed)" }}>…</p>`}
        >
          <div className="flex w-full flex-col" style={{ gap: "var(--space-6)" }}>
            {LEADING.map((step) => (
              <div key={step.token} className="flex flex-col" style={{ gap: "var(--space-2)" }}>
                <div
                  className="flex flex-wrap items-baseline text-text-tertiary"
                  style={{ gap: "var(--space-3)", fontSize: "var(--text-xs)" }}
                >
                  <code className="font-mono text-text-secondary">{step.token}</code>
                  <span className="tabular-nums">{step.value}</span>
                </div>
                <p
                  className="max-w-prose text-text-secondary"
                  style={{ fontSize: "var(--text-sm)", lineHeight: step.value }}
                >
                  InstaPay clears in seconds and caps at ₱50,000.00 per transfer. PESONet batches
                  through the day and settles on the same banking day when the transfer lands before
                  the 15:00 cutoff, which is why a payout initiated at 16:00 on 27 Aug 2026 shows up
                  the following morning.
                </p>
                <p className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
                  {step.use}
                </p>
              </div>
            ))}
          </div>
        </Example>
      </DocSection>

      <DocSection
        title="Faces"
        description="Geist Sans for everything people read, Geist Mono for anything they might copy, compare character by character or mistake for something else. Both are loaded by the root layout and exposed as tokens, so no component reaches for a font family by name."
      >
        <Example
          layout="stacked"
          code={`<p style={{ fontFamily: "var(--font-sans)" }}>Reference EPL-004821 · Landbank ••7730</p>
<p style={{ fontFamily: "var(--font-mono)" }}>Reference EPL-004821 · Landbank ••7730</p>`}
        >
          <div className="flex w-full flex-col" style={{ gap: "var(--space-6)" }}>
            <div className="flex flex-col" style={{ gap: "var(--space-1)" }}>
              <code className="font-mono text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
                --font-sans
              </code>
              <p
                className="text-text-primary"
                style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-lg)" }}
              >
                Reference EPL-004821 · Landbank ••7730
              </p>
              <p className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
                Everything by default: headings, body, labels, buttons.
              </p>
            </div>
            <div className="flex flex-col" style={{ gap: "var(--space-1)" }}>
              <code className="font-mono text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
                --font-mono
              </code>
              <p
                className="text-text-primary"
                style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-lg)" }}
              >
                Reference EPL-004821 · Landbank ••7730
              </p>
              <p className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
                Code, reference numbers, token names, API keys in docs. Not for prose, and not for
                money.
              </p>
            </div>
          </div>
        </Example>
        <Note>
          Reference numbers, transaction IDs and account fragments go in mono because a reader
          comparing <code>EPL-004821</code> against a bank statement needs every character to be
          unambiguous. Peso amounts do not — they belong in the sans face with{" "}
          <code>tabular-nums</code>, which is the next section.
        </Note>
      </DocSection>

      <DocSection
        title="Tabular numbers"
        description="tabular-nums switches the sans face to fixed-width figures so digits line up in a column. It is a table feature, not a number feature."
      >
        <Example
          layout="stacked"
          code={`{/* Yes — a column of amounts */}
<td className="tabular-nums">₱1,284,930.75</td>

{/* No — one large standalone figure */}
<span style={{ fontSize: "var(--text-5xl)" }}>₱1,284,930.75</span>`}
        >
          <div className="flex w-full flex-wrap" style={{ gap: "var(--space-8)" }}>
            <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
              <span className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
                tabular-nums — a column of amounts
              </span>
              <div
                className="flex flex-col tabular-nums text-text-primary"
                style={{ gap: "var(--space-1)", fontSize: "var(--text-sm)" }}
              >
                <span>₱1,284,930.75</span>
                <span>₱48,900.50</span>
                <span>₱1,234.56</span>
                <span>₱312,450.00</span>
              </div>
            </div>
            <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
              <span className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
                proportional — the same column, unaligned
              </span>
              <div
                className="flex flex-col text-text-primary"
                style={{ gap: "var(--space-1)", fontSize: "var(--text-sm)" }}
              >
                <span>₱1,284,930.75</span>
                <span>₱48,900.50</span>
                <span>₱1,234.56</span>
                <span>₱312,450.00</span>
              </div>
            </div>
          </div>
        </Example>
        <Note>
          Use it for table columns, list-row amounts and rows of stat cards whose figures sit above
          one another. Do not use it for a single large standalone figure: tabular digits are padded
          to a common width, and at <code>--text-4xl</code> and up that padding shows as loose,
          gappy spacing with nothing to line up against. The one exception already made for you is{" "}
          <Link href="/docs/stat-card">Stat card</Link>, whose value is tabular because these cards
          almost always appear in a row.
        </Note>
      </DocSection>

      <DocSection
        title="Measure and weight"
        description="Two conventions the tokens cannot enforce."
      >
        <Note>
          Keep running prose between roughly 45 and 75 characters per line — the docs shell caps its
          own paragraphs at <code>62ch</code> and <code>68ch</code> for that reason. For weight, this
          kit uses three: 400 for body, 500 for labels and emphasis inside UI, 600 for headings and
          figures. There is no 700 anywhere; on this face it reads as shouting rather than as
          hierarchy, and a size step does the same job more calmly.
        </Note>
      </DocSection>

      <DocSection title="Tokens">
        <PropsTable
          rows={[
            ...SCALE.map((step) => ({
              name: step.token,
              type: "length",
              defaultValue: step.value,
              description: step.use,
            })),
            ...LEADING.map((step) => ({
              name: step.token,
              type: "number",
              defaultValue: step.value,
              description: step.use,
            })),
            {
              name: "--font-sans",
              type: "font stack",
              defaultValue: "Geist Sans",
              description:
                "Everything readers read. Falls back to ui-sans-serif and the system UI face.",
            },
            {
              name: "--font-mono",
              type: "font stack",
              defaultValue: "Geist Mono",
              description:
                "Code, reference numbers and token names. Falls back to ui-monospace.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
