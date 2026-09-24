import {
  House,
  Gear,
  User,
  Bell,
  MagnifyingGlass,
  CreditCard,
  ArrowsLeftRight,
  Receipt,
} from "@phosphor-icons/react/ssr";
import { DocPage, DocSection, Note } from "@/components/docs/doc-parts";
import { CodeBlock } from "@/components/docs/code-block";

export const metadata = { title: "Icons — Diliman Labs" };

const samples = [House, Gear, User, Bell, MagnifyingGlass, CreditCard, ArrowsLeftRight, Receipt];

export default function IconsDocs() {
  return (
    <DocPage
      title="Icons"
      description="Phosphor Icons — 9,000+ icons, MIT licensed, with rounded stroke terminals that match this kit's corner radii. Six weights per icon, of which the kit uses two."
    >
      <DocSection
        title="Line and solid"
        description="Regular is the default state. Fill is reserved for active or selected state, so the weight change itself carries meaning."
      >
        <div className="flex flex-col gap-6">
          <div>
            <p className="mb-3 font-mono text-xs text-text-tertiary">
              weight=&quot;regular&quot; — default
            </p>
            <div className="flex flex-wrap gap-6">
              {samples.map((Icon, i) => (
                <Icon key={i} size={26} weight="regular" color="var(--text-primary)" />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 font-mono text-xs text-text-tertiary">
              weight=&quot;fill&quot; — active or selected
            </p>
            <div className="flex flex-wrap gap-6">
              {samples.map((Icon, i) => (
                <Icon key={i} size={26} weight="fill" color="var(--text-primary)" />
              ))}
            </div>
          </div>
        </div>
      </DocSection>

      <DocSection title="Importing">
        <CodeBlock
          code={`import { CreditCard } from "@phosphor-icons/react/ssr";

<CreditCard size={16} />
<CreditCard size={16} weight="fill" />`}
        />
        <Note>
          Import from{" "}
          <code className="font-mono text-xs">@phosphor-icons/react/ssr</code>, not
          the bare package. The SSR entry renders plain SVG with no React context,
          so icons can be used inside server components. The bare package pulls
          every consumer across a client boundary, which is a real bundle cost for
          something that renders as a static path.
        </Note>
      </DocSection>

      <DocSection
        title="Sizing"
        description="Match the icon to the text it sits beside rather than picking a size per instance."
      >
        <table className="w-full border-collapse text-sm">
          <tbody>
            {[
              ["14px", "Small buttons, inline with --text-xs"],
              ["16px", "Default — buttons, inputs, list rows"],
              ["18px", "Large buttons, section headers"],
              ["24px+", "Empty states, feature callouts"],
            ].map(([size, use]) => (
              <tr key={size} className="border-b border-border-subtle">
                <td className="py-3 pr-6 align-top font-mono text-xs whitespace-nowrap text-text-primary">
                  {size}
                </td>
                <td className="py-3 text-text-secondary">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DocSection>

      <DocSection title="Accessibility">
        <Note>
          An icon that sits beside a label is decorative — give it{" "}
          <code className="font-mono text-xs">aria-hidden</code> so screen readers
          don&apos;t announce it twice. An icon that <em>is</em> the control, like
          an icon-only button, needs an{" "}
          <code className="font-mono text-xs">aria-label</code> on the button
          itself. An icon-only control with no label is silent, and there is no
          way for a screen reader user to guess it.
        </Note>
      </DocSection>
    </DocPage>
  );
}
