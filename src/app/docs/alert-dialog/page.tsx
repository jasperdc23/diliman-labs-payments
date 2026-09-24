"use client";

import { useState } from "react";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Remove payout method
      </Button>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        title="Remove this payout method?"
        description="BDO Unibank ••4471 will no longer be available for InstaPay transfers. This can't be undone."
        actions={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setOpen(false)}>
              Remove
            </Button>
          </>
        }
      />
    </>
  );
}

export default function AlertDialogDocs() {
  return (
    <DocPage
      title="Alert dialog"
      description="A stricter, smaller sibling of Modal for actions that need a deliberate, forced choice — no icon-X close button, no backdrop-click dismissal. The only way out is one of the actions you supply, or Escape (which behaves like Cancel)."
    >
      <DocSection title="Basic usage">
        <Example
          code={`<AlertDialog
  open={open}
  onOpenChange={setOpen}
  title="Remove this payout method?"
  description="This can't be undone."
  actions={
    <>
      <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="danger" onClick={() => setOpen(false)}>Remove</Button>
    </>
  }
/>`}
        >
          <Demo />
        </Example>
        <Note>
          Built on the same native <code>&lt;dialog&gt;</code> mechanics as Modal, reusing
          <code>modal.module.css</code> directly — nothing about an alert dialog&apos;s box model
          differs from Modal&apos;s, only its behavior. Use the plain <code>Modal</code> for
          anything dismissible; reach for this only when the choice must be explicit.
        </Note>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "open", type: "boolean", description: "Controls visibility." },
            { name: "onOpenChange", type: "(open: boolean) => void", description: "Called on Escape." },
            { name: "title", type: "string", description: "Required." },
            { name: "description", type: "ReactNode", description: "One sentence stating the consequence." },
            { name: "actions", type: "ReactNode", description: "Footer buttons — typically Cancel + a danger confirm." },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
