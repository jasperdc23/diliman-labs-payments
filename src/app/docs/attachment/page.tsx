"use client";

import { Attachment } from "@/components/ui/attachment";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export default function AttachmentDocs() {
  return (
    <DocPage
      title="Attachment"
      description="A file chip: icon, filename, formatted size and an optional remove button. A natural fit for an uploaded receipt or proof-of-payment attached to a transaction dispute."
    >
      <DocSection
        title="File types"
        description="Icon is picked from the filename's extension — image, PDF, spreadsheet, document, archive, or a generic file for anything else."
      >
        <Example
          code={`<Attachment filename="instapay-receipt-27aug2026.pdf" size={253952} />
<Attachment filename="receipt-photo.jpg" size={1887436} />
<Attachment filename="transaction-log.csv" size={40960} />`}
        >
          <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
            <Attachment filename="instapay-receipt-27aug2026.pdf" size={253952} />
            <Attachment filename="receipt-photo.jpg" size={1887436} />
            <Attachment filename="transaction-log.csv" size={40960} />
          </div>
        </Example>
      </DocSection>

      <DocSection
        title="Removable"
        description="onRemove reuses Badge's exact removable pattern — the same X icon, size, opacity and hover treatment — rather than a second removable-chip mechanism."
      >
        <Example code={`<Attachment filename="dispute-summary.docx" size={81920} onRemove={() => {}} />`}>
          <Attachment filename="dispute-summary.docx" size={81920} onRemove={() => {}} />
        </Example>
        <Note>
          Size is passed in bytes and formatted internally (<code>253952</code> → &quot;248
          KB&quot;) so callers never hand-format a display string that can drift from the actual
          file size.
        </Note>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "filename", type: "string", description: "Shown truncated; also drives the icon by extension." },
            { name: "size", type: "number", description: "File size in bytes, formatted for display." },
            { name: "onRemove", type: "() => void", description: "Shows the remove button when set." },
            { name: "removeLabel", type: "string", description: "Overrides the default \"Remove {filename}\" aria-label." },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
