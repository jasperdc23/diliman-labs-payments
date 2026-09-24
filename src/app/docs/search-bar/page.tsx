"use client";

import { useState } from "react";
import { SearchBar } from "@/components/ui/search-bar";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

function ControlledSearch() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <SearchBar
        placeholder="Search transactions"
        value={query}
        onValueChange={setQuery}
        onSearch={setSubmitted}
      />
      <p style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
        Typed: {query || "—"} · Submitted: {submitted || "—"}
      </p>
    </div>
  );
}

export default function SearchBarDocs() {
  return (
    <DocPage
      title="Search bar"
      description="A search field with a leading icon, a clear button that appears once there is something to clear, and an optional loading spinner. Reach for it when a list or table is long enough that filtering beats scrolling."
    >
      <DocSection
        title="Basic usage"
        description="Uncontrolled by default — the component keeps its own value, so a placeholder is often the only prop you need."
      >
        <Example layout="stacked" code={`<SearchBar placeholder="Search transactions" />`}>
          <SearchBar placeholder="Search transactions" />
        </Example>
      </DocSection>

      <DocSection
        title="With a value"
        description="Once the field has text, a clear button appears at the trailing edge. Clearing it returns focus to the input so typing can continue straight away."
      >
        <Example
          layout="stacked"
          code={`<SearchBar placeholder="Search transactions" defaultValue="PESONet payout" />`}
        >
          <SearchBar placeholder="Search transactions" defaultValue="PESONet payout" />
        </Example>
      </DocSection>

      <DocSection
        title="Loading"
        description="While a query is in flight, loading swaps the clear button for a spinner. The field stays editable — only the trailing affordance changes."
      >
        <Example
          layout="stacked"
          code={`<SearchBar placeholder="Search transactions" defaultValue="PESONet payout" loading />`}
        >
          <SearchBar placeholder="Search transactions" defaultValue="PESONet payout" loading />
        </Example>
      </DocSection>

      <DocSection
        title="Disabled"
        description="A disabled search bar dims the whole field and hides the clear button, since there is nothing the user can act on."
      >
        <Example
          layout="stacked"
          code={`<SearchBar placeholder="Search transactions" defaultValue="PESONet payout" disabled />`}
        >
          <SearchBar placeholder="Search transactions" defaultValue="PESONet payout" disabled />
        </Example>
      </DocSection>

      <DocSection
        title="Controlled"
        description="Pass value with onValueChange to own the state. onSearch fires separately, on Enter, which is the hook for a request you do not want to send on every keystroke."
      >
        <Example
          layout="stacked"
          code={`const [query, setQuery] = useState("");
const [submitted, setSubmitted] = useState("");

<SearchBar
  placeholder="Search transactions"
  value={query}
  onValueChange={setQuery}
  onSearch={setSubmitted}
/>`}
        >
          <ControlledSearch />
        </Example>
      </DocSection>

      <Note>
        Keyboard behavior: Enter calls <code>onSearch</code> with the current value, and Escape
        clears a non-empty field. Both preventDefault, so Escape will not also close a surrounding
        dialog while there is still text to clear. The input is <code>type=&quot;search&quot;</code>{" "}
        and takes its accessible name from <code>aria-label</code>, falling back to the placeholder.
      </Note>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "value",
              type: "string",
              description:
                "Controlled value. Supply it together with onValueChange; leave it out to let the component manage its own state.",
            },
            {
              name: "defaultValue",
              type: "string",
              defaultValue: `""`,
              description: "Starting value when the component is uncontrolled.",
            },
            {
              name: "onValueChange",
              type: "(value: string) => void",
              description:
                "Called on every keystroke, and on clear, with the new value. Replaces onChange, which is not forwarded.",
            },
            {
              name: "onSearch",
              type: "(value: string) => void",
              description: "Called with the current value when the user presses Enter.",
            },
            {
              name: "loading",
              type: "boolean",
              defaultValue: "false",
              description: "Shows a spinner in place of the clear button.",
            },
            {
              name: "disabled",
              type: "boolean",
              defaultValue: "false",
              description: "Dims the field, blocks input, and hides the clear button.",
            },
            {
              name: "placeholder",
              type: "string",
              defaultValue: `"Search"`,
              description:
                "Placeholder text, and the fallback accessible name when no aria-label is given.",
            },
            {
              name: "clearLabel",
              type: "string",
              defaultValue: `"Clear search"`,
              description: "aria-label for the clear button.",
            },
            {
              name: "className",
              type: "string",
              description: "Appended to the wrapper, which is what carries the width and border.",
            },
            {
              name: "...props",
              type: "InputHTMLAttributes<HTMLInputElement>",
              description:
                "Forwarded to the input, minus type, value, defaultValue and onChange, which the component owns.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
