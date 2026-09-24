"use client";

import { Button } from "@/components/ui/button";
import { Toaster, useToast } from "@/components/ui/toast";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

function TriggerDemo() {
  const { toast } = useToast();

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            variant: "success",
            title: "Payout sent",
            description: "₱48,900.50 sent via InstaPay.",
          })
        }
      >
        Trigger success
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            variant: "danger",
            title: "Payout failed",
            description: "The receiving bank declined the transfer.",
          })
        }
      >
        Trigger danger
      </Button>
    </div>
  );
}

export default function ToastDocs() {
  return (
    <DocPage
      title="Toast"
      description="A transient notification that stacks in a corner of the viewport and dismisses itself after a few seconds — triggered by an event, not rendered inline in the tree."
    >
      <Note>
        Toast is for something that just happened elsewhere in the app — a save succeeding, a
        background job failing. For a message tied to what&apos;s currently on screen, like a
        form that just failed validation, use <code>Alert</code> instead; it stays in flow
        rather than disappearing.
      </Note>

      <DocSection
        title="Setup"
        description="Mount <Toaster> once, near the app root. Anything inside it can call useToast() to push a notification onto a shared, bottom-right stack — bottom-right keeps toasts clear of primary content and page headers while staying thumb-reachable on mobile."
      >
        <Example
          code={`function App() {
  return (
    <Toaster>
      <YourApp />
    </Toaster>
  );
}

function SavePayoutButton() {
  const { toast } = useToast();
  return (
    <Button
      onClick={() =>
        toast({ variant: "success", title: "Payout sent", description: "₱48,900.50 sent via InstaPay." })
      }
    >
      Send payout
    </Button>
  );
}`}
        >
          <Toaster>
            <TriggerDemo />
          </Toaster>
        </Example>
      </DocSection>

      <DocSection
        title="Auto-dismiss and manual close"
        description="Every toast auto-dismisses after duration (5000ms by default) but also ships an X — an auto-dismissing notification with no way to read it again or close it early is a dead end, so both paths always exist together."
      >
        <Example code={`toast({ title: "Settlement in progress", duration: 8000 })`}>
          <p className="text-sm text-text-tertiary">
            See the trigger buttons above — each toast in the stack carries its own close button.
          </p>
        </Example>
      </DocSection>

      <DocSection title="toast() options">
        <PropsTable
          rows={[
            { name: "title", type: "string", description: "States what happened." },
            { name: "description", type: "string", description: "Optional supporting detail." },
            {
              name: "variant",
              type: `"info" | "success" | "warning" | "danger"`,
              defaultValue: `"info"`,
              description: "Same status-color vocabulary as Alert and Badge.",
            },
            {
              name: "duration",
              type: "number",
              defaultValue: "5000",
              description: "Milliseconds before auto-dismiss. 0 disables auto-dismiss.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
