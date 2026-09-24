"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

function PayoutModalDemo({
  size = "md",
  closeOnBackdropClick = true,
  trigger = "Confirm payout",
}: {
  size?: "sm" | "md" | "lg";
  closeOnBackdropClick?: boolean;
  trigger?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {trigger}
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size={size}
        closeOnBackdropClick={closeOnBackdropClick}
        title="Confirm payout"
        description="This transfer goes out over PESONet and settles the next banking day."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Send ₱48,900.50</Button>
          </>
        }
      >
        <div className="flex flex-col" style={{ gap: "var(--space-3)" }}>
          <p>
            Sending <strong className="text-text-primary">₱48,900.50</strong> to Landbank ••7730 on
            27 Aug 2026. Once submitted, the transfer can&apos;t be recalled from here.
          </p>
          <p>
            {closeOnBackdropClick
              ? "Escape, the close button, and a click on the backdrop all dismiss this dialog."
              : "Escape and the close button dismiss this dialog. A backdrop click does nothing."}
          </p>
        </div>
      </Modal>
    </>
  );
}

function BareModalDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Session expiring
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size="sm"
        title="Your session is about to expire"
        description="You'll be signed out in two minutes unless you keep working."
        footer={<Button onClick={() => setOpen(false)}>Stay signed in</Button>}
      />
    </>
  );
}

const demoSource = `function PayoutDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Confirm payout</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm payout"
        description="This transfer goes out over PESONet and settles the next banking day."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)}>Send ₱48,900.50</Button>
          </>
        }
      >
        <p>
          Sending <strong>₱48,900.50</strong> to Landbank ••7730 on 27 Aug 2026. Once
          submitted, the transfer can&apos;t be recalled from here.
        </p>
      </Modal>
    </>
  );
}`;

export default function ModalDocs() {
  return (
    <DocPage
      title="Modal"
      description="A dialog for a decision that has to be made before anything else continues — confirming a payout, reversing a transaction. It is built on the native dialog element, so focus trapping, the inert background, and the top layer come from the platform rather than from JavaScript."
    >
      <DocSection
        title="Basic usage"
        description="Modal is fully controlled: you own the open state and onClose is called for every dismissal path. It never closes itself, which means an action that needs to finish first — a payout request in flight — can keep the dialog up until it resolves."
      >
        <Example layout="center" code={demoSource}>
          <PayoutModalDemo />
        </Example>
      </DocSection>

      <DocSection
        title="Sizes"
        description="Small for a single confirmation, medium for a short form or a summary, large for a review step with a table or a receipt in it. All three cap their height and scroll the body, so the header and footer stay put."
      >
        <Example
          code={`<Modal size="sm" {...props} />
<Modal size="md" {...props} />
<Modal size="lg" {...props} />`}
        >
          <PayoutModalDemo size="sm" trigger="Small" />
          <PayoutModalDemo size="md" trigger="Medium" />
          <PayoutModalDemo size="lg" trigger="Large" />
        </Example>
      </DocSection>

      <DocSection
        title="Header only"
        description="Both children and footer are optional. With no children the body is dropped entirely rather than left as empty padding, which is what you want for a short interruption whose whole message fits in the description."
      >
        <Example
          layout="center"
          code={`<Modal
  open={open}
  onClose={() => setOpen(false)}
  size="sm"
  title="Your session is about to expire"
  description="You'll be signed out in two minutes unless you keep working."
  footer={<Button onClick={() => setOpen(false)}>Stay signed in</Button>}
/>`}
        >
          <BareModalDemo />
        </Example>
      </DocSection>

      <DocSection
        title="Guarding against accidental dismissal"
        description="Set closeOnBackdropClick to false when losing the dialog would lose work — a half-filled payout form, a dispute response being written. Escape and the close button still work, and that is deliberate: a dialog with no keyboard exit is a trap."
      >
        <Example
          layout="center"
          code={`<Modal open={open} onClose={() => setOpen(false)} closeOnBackdropClick={false} {...rest} />`}
        >
          <PayoutModalDemo closeOnBackdropClick={false} trigger="No backdrop dismiss" />
        </Example>
      </DocSection>

      <DocSection title="Behavior and accessibility">
        <Note>
          Opening calls <code>showModal()</code>, so the browser traps focus inside the dialog, makes
          the rest of the page inert, and paints it in the top layer above every stacking context —
          no z-index tuning required. Escape fires the native cancel event, which the component
          intercepts and routes through <code>onClose</code> so your state stays the source of truth.
          The title is wired up as the accessible name through <code>aria-labelledby</code>, which is
          why <code>title</code> is required.
        </Note>
        <Note>
          Two things the component leaves to you. Focus is not moved to a specific control on open,
          so the dialog starts focused as a whole — if one action is the obvious next step, focus it
          yourself. And a destructive confirmation should use the danger Button variant in the
          footer, with the cancel action as secondary and listed first.
        </Note>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "open",
              type: "boolean",
              description: "Whether the dialog is showing. Fully controlled.",
            },
            {
              name: "onClose",
              type: "() => void",
              description:
                "Called for every dismissal — close button, Escape, and backdrop click. Set your state to closed here.",
            },
            {
              name: "title",
              type: "string",
              description: "Required. Rendered as the heading and used as the accessible name.",
            },
            {
              name: "description",
              type: "ReactNode",
              description: "Supporting line under the title, inside the header.",
            },
            {
              name: "children",
              type: "ReactNode",
              description: "Body content. Scrolls when it outgrows the dialog; omit to drop the body.",
            },
            {
              name: "footer",
              type: "ReactNode",
              description: "Right-aligned action row. Put the confirming action last.",
            },
            {
              name: "size",
              type: `"sm" | "md" | "lg"`,
              defaultValue: `"md"`,
              description: "Maximum width of the dialog.",
            },
            {
              name: "closeOnBackdropClick",
              type: "boolean",
              defaultValue: "true",
              description: "Set to false when a stray click would discard work.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
