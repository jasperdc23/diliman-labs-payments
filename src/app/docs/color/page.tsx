import Link from "next/link";
import { DocPage, DocSection, Note } from "@/components/docs/doc-parts";

export const metadata = { title: "Color — EP Design Kit" };

const semantic = [
  ["--surface", "The page plane."],
  ["--surface-raised", "Panels sitting above the page."],
  ["--surface-sunken", "Wells, code blocks, hovered rows."],
  ["--border-subtle", "Dividers and card edges."],
  ["--border-default", "Input and control borders."],
  ["--border-strong", "Hovered control borders."],
  ["--text-primary", "Headings and body copy."],
  ["--text-secondary", "Supporting copy."],
  ["--text-tertiary", "Labels, captions, axis ticks."],
  ["--text-disabled", "Disabled control text."],
  ["--accent", "The one emphasis color."],
  ["--accent-hover", "Its hover and pressed step."],
  ["--accent-subtle", "Tinted backgrounds for selected state."],
];

const status = [
  ["--success", "Settled, approved, complete."],
  ["--warning", "Pending, needs attention."],
  ["--danger", "Failed, reversed, destructive."],
];

function Swatch({ token }: { token: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-14 w-full rounded-md border border-border-subtle"
        style={{ background: `var(${token})` }}
      />
      <p className="font-mono text-xs text-text-tertiary">{token}</p>
    </div>
  );
}

export default function ColorDocs() {
  return (
    <DocPage
      title="Color"
      description="The kit is monochrome by decision, not by omission. A placeholder brand color makes unsettled decisions look settled, so there isn't one — the accent is near-black in light mode and near-white in dark."
    >
      <DocSection
        title="Semantic tokens"
        description="These are what components reference. They flip automatically between themes, so a component never needs to know which theme it's in."
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {semantic.map(([token]) => (
            <Swatch key={token} token={token} />
          ))}
        </div>
        <table className="w-full border-collapse text-sm">
          <tbody>
            {semantic.map(([token, what]) => (
              <tr key={token} className="border-b border-border-subtle">
                <td className="py-2 pr-6 align-top font-mono text-xs whitespace-nowrap text-text-primary">
                  {token}
                </td>
                <td className="py-2 text-text-secondary">{what}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DocSection>

      <DocSection
        title="Status colors keep their hue"
        description="These are the one exception to monochrome, and it's deliberate."
      >
        <div className="grid grid-cols-3 gap-4">
          {status.map(([token]) => (
            <Swatch key={token} token={token} />
          ))}
        </div>
        <Note>
          A gray error and a gray success are indistinguishable, and this is a
          payments product where the difference between{" "}
          <em>settled</em> and <em>reversed</em> matters. Status color is
          functional rather than decorative, so it survives the monochrome pass.
          It still never carries meaning alone — every status ships with an icon
          or a label beside it, which is what makes it work in grayscale print
          and at full color blindness.
        </Note>
      </DocSection>

      <DocSection
        title="The gray scale"
        description="The primitives everything else is built from. Components should not reference these directly — reach for a semantic token instead, or the theme swap won't reach your component."
      >
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
          {[
            "--gray-0",
            "--gray-50",
            "--gray-100",
            "--gray-200",
            "--gray-300",
            "--gray-400",
            "--gray-500",
            "--gray-600",
            "--gray-700",
            "--gray-800",
            "--gray-900",
            "--gray-950",
            "--gray-1000",
          ].map((token) => (
            <div key={token} className="flex flex-col gap-1">
              <div
                className="h-12 w-full rounded-md border border-border-subtle"
                style={{ background: `var(${token})` }}
              />
              <p className="font-mono text-[10px] text-text-tertiary">
                {token.replace("--gray-", "")}
              </p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Adding your brand">
        <p className="text-sm leading-relaxed text-text-secondary">
          Four primitive values, and every component follows.{" "}
          <Link href="/docs/theming" className="text-text-primary underline underline-offset-4">
            See theming
          </Link>
          .
        </p>
      </DocSection>
    </DocPage>
  );
}
