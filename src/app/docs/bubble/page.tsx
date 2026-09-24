import { Bubble } from "@/components/ui/bubble";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Bubble — EP Design Kit" };

export default function BubbleDocs() {
  return (
    <DocPage
      title="Bubble"
      description="A single chat-message bubble — the visual shell only. See Message for the fuller composed row with an avatar, sender name and timestamp."
    >
      <DocSection
        title="Sent vs. received"
        description="sent is right-aligned with an --accent fill (same treatment as Button's primary); received uses .glass-flat, opaque rather than blurred since a thread renders many bubbles at once."
      >
        <Example
          layout="stacked"
          code={`<Bubble variant="received">Hi, my InstaPay transfer hasn't landed yet.</Bubble>
<Bubble variant="sent">Checking that now — what's the reference number?</Bubble>`}
        >
          <div className="flex flex-col" style={{ gap: "var(--space-2)", width: "20rem" }}>
            <div className="flex justify-start">
              <Bubble variant="received">Hi, my InstaPay transfer hasn&apos;t landed yet.</Bubble>
            </div>
            <div className="flex justify-end">
              <Bubble variant="sent">Checking that now — what&apos;s the reference number?</Bubble>
            </div>
          </div>
        </Example>
        <Note>
          The tail is a single sharpened corner (<code>border-bottom-right-radius</code> or{" "}
          <code>border-bottom-left-radius</code> set to <code>--radius-sm</code>) rather than a
          drawn triangle — it themes itself with the same radius tokens as everything else in the
          kit, with no extra markup.
        </Note>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "variant",
              type: `"sent" | "received"`,
              defaultValue: `"received"`,
              description: "Alignment, fill and tail corner.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
