import Link from "next/link";
import { Message } from "@/components/ui/message";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Message — EP Design Kit" };

export default function MessageDocs() {
  return (
    <DocPage
      title="Message"
      description="A full chat message row: avatar, sender name, timestamp and a Bubble, in the same sent/received orientation Bubble uses on its own."
    >
      <DocSection
        title="A support thread"
        description="A realistic use for a payments product — a support conversation about a delayed InstaPay transfer."
      >
        <Example
          layout="stacked"
          code={`<Message sender="Bea Santos" timestamp="09:14">
  Hi, my InstaPay transfer hasn't landed yet.
</Message>
<Message sender="You" timestamp="09:16" variant="sent">
  Checking that now — what's the reference number?
</Message>`}
        >
          <div className="flex flex-col" style={{ gap: "var(--space-4)", width: "26rem" }}>
            <Message sender="Bea Santos" timestamp="09:14">
              Hi, my InstaPay transfer of ₱5,000.00 to Landbank hasn&apos;t landed yet — sent it
              about an hour ago.
            </Message>
            <Message sender="You" timestamp="09:16" variant="sent">
              Checking that now — could you share the reference number from the confirmation
              screen?
            </Message>
            <Message sender="Bea Santos" timestamp="09:17">
              Sure, it&apos;s EPL-004821.
            </Message>
          </div>
        </Example>
        <Note>
          The sent row mirrors direction rather than reversing text: avatar and name/timestamp both
          move to the right, but the name and timestamp inside that block still read left-to-right.
          For a scrolling list of these, see{" "}
          <Link href="/docs/message-scroller">Message scroller</Link>.
        </Note>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "sender", type: "string", description: "Name shown above the bubble, and used for the avatar's initials." },
            { name: "timestamp", type: "string", description: "Rendered as-is, e.g. \"09:14\" or \"27 Aug 2026\"." },
            {
              name: "variant",
              type: `"sent" | "received"`,
              defaultValue: `"received"`,
              description: "Orientation, passed straight through to Bubble.",
            },
            { name: "avatarSrc", type: "string", description: "Optional photo; falls back to initials, same as Avatar." },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
