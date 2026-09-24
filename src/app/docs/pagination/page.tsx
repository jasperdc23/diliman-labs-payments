"use client";

import { useState } from "react";
import { Pagination } from "@/components/ui/pagination";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

function PaginationDemo({ totalPages }: { totalPages: number }) {
  const [page, setPage] = useState(6);
  return <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />;
}

export default function PaginationDocs() {
  return (
    <DocPage
      title="Pagination"
      description="Page-number navigation for a paged data set, with an ellipsis for skipped ranges once there are too many pages to list."
    >
      <DocSection
        title="Many pages"
        description="Pairs naturally with Table — render it directly below one, driven by whatever state holds the current page."
      >
        <Example code={`<Pagination currentPage={page} totalPages={42} onPageChange={setPage} />`}>
          <PaginationDemo totalPages={42} />
        </Example>
      </DocSection>

      <DocSection title="Few pages" description="With few enough pages, every page number shows and no ellipsis is needed.">
        <Example code={`<Pagination currentPage={page} totalPages={4} onPageChange={setPage} />`}>
          <PaginationDemo totalPages={4} />
        </Example>
      </DocSection>

      <Note>
        Pagination is standalone and stateless — it owns no page state of its own, so it never
        forces a client boundary on whatever renders it. The demos above wrap it in a small
        client component only because a Storybook/docs page needs somewhere to hold{" "}
        <code>currentPage</code>.
      </Note>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "currentPage", type: "number", description: "The active page, 1-indexed." },
            { name: "totalPages", type: "number", description: "Total number of pages." },
            { name: "onPageChange", type: "(page: number) => void", description: "Called with the next page number." },
            {
              name: "siblingCount",
              type: "number",
              defaultValue: "1",
              description: "Page buttons kept adjacent to the current page on each side.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
