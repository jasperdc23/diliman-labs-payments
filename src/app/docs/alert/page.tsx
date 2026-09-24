"use client";

import { Alert } from "@/components/ui/alert";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export default function AlertDocs() {
  return (
    <DocPage
      title="Alert"
      description="An inline banner for messages that are a direct consequence of what's on screen — a failed form submission, a filtered-out empty result, a maintenance notice."
    >
      <Note>
        Alert is inline, not floating: it sits in page flow and stays until dismissed or the
        situation changes. For a transient notification about something that happened
        elsewhere — a save completing in the background, an event on another tab — use{" "}
        <code>Toast</code> instead. If it needs to keep occupying space next to the thing it
        explains, it&apos;s an Alert; if it should announce itself and then get out of the way,
        it&apos;s a Toast.
      </Note>

      <DocSection
        title="Variants"
        description="Same success/warning/danger/info vocabulary as Badge — status color carries meaning consistently across the kit."
      >
        <Example
          layout="stacked"
          code={`<Alert variant="info" title="Maintenance window" description="InstaPay will be briefly unavailable 27 Aug 2026, 12:00–12:30 AM." />
<Alert variant="success" title="Payout sent" description="₱48,900.50 was sent over PESONet." />
<Alert variant="warning" title="Verification pending" description="KYC review can take up to one banking day." />
<Alert variant="danger" title="Payout failed" description="BDO Unibank declined the transfer. Try a different account." />`}
        >
          <div className="flex w-full flex-col gap-3">
            <Alert
              variant="info"
              title="Maintenance window"
              description="InstaPay will be briefly unavailable 27 Aug 2026, 12:00–12:30 AM."
            />
            <Alert
              variant="success"
              title="Payout sent"
              description="₱48,900.50 was sent over PESONet."
            />
            <Alert
              variant="warning"
              title="Verification pending"
              description="KYC review can take up to one banking day."
            />
            <Alert
              variant="danger"
              title="Payout failed"
              description="BDO Unibank declined the transfer. Try a different account."
            />
          </div>
        </Example>
      </DocSection>

      <DocSection title="Dismissible" description="Pass onDismiss to render a close button.">
        <Example
          layout="stacked"
          code={`<Alert variant="danger" title="Payout failed" description="BDO Unibank declined the transfer." onDismiss={() => {}} />`}
        >
          <Alert
            variant="danger"
            title="Payout failed"
            description="BDO Unibank declined the transfer."
            onDismiss={() => {}}
          />
        </Example>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "variant",
              type: `"neutral" | "info" | "success" | "warning" | "danger"`,
              defaultValue: `"info"`,
              description: "Status color and default icon.",
            },
            { name: "title", type: "string", description: "States what happened, plainly." },
            { name: "description", type: "ReactNode", description: "Optional supporting detail." },
            {
              name: "icon",
              type: "ReactNode | null",
              description: "Overrides the variant's default icon. Pass null to render none.",
            },
            {
              name: "onDismiss",
              type: "() => void",
              description: "Renders a close button when provided.",
            },
            { name: "dismissLabel", type: "string", defaultValue: `"Dismiss"`, description: "Accessible label for the close button." },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
