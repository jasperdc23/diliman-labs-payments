"use client";

import { useState } from "react";
import { Eye, EyeSlash, MagnifyingGlass } from "@phosphor-icons/react/ssr";
import { InputGroup } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { DocPage, DocSection, Example, PropsTable } from "@/components/docs/doc-parts";

function PinToggle() {
  const [visible, setVisible] = useState(false);
  return (
    <InputGroup
      label="PIN"
      type={visible ? "text" : "password"}
      placeholder="••••"
      trailing={
        <Button
          size="sm"
          variant="ghost"
          iconOnly
          aria-label={visible ? "Hide PIN" : "Show PIN"}
          iconLeft={visible ? <EyeSlash size={16} /> : <Eye size={16} />}
          onClick={() => setVisible((v) => !v)}
        />
      }
    />
  );
}

export default function InputGroupDocs() {
  return (
    <DocPage
      title="Input Group"
      description="An input with a leading or trailing adornment — an icon, a unit, or an attached button — inside the same bordered box. The focus ring and border live on the whole group, so the adornment reads as part of the field, not a decoration next to it."
    >
      <DocSection
        title="Units and icons"
        description="Leading and trailing accept any node: a currency symbol, a unit label, or an icon."
      >
        <Example
          layout="stacked"
          code={`<InputGroup label="Amount" leading="₱" placeholder="0.00" />
<InputGroup label="Transfer amount" leading="₱" trailing="PHP" placeholder="0.00" />
<InputGroup label="Search transactions" leading={<MagnifyingGlass size={16} />} placeholder="Reference number or merchant" />`}
        >
          <InputGroup label="Amount" leading="₱" placeholder="0.00" />
          <InputGroup label="Transfer amount" leading="₱" trailing="PHP" placeholder="0.00" />
          <InputGroup
            label="Search transactions"
            leading={<MagnifyingGlass size={16} />}
            placeholder="Reference number or merchant"
          />
        </Example>
      </DocSection>

      <DocSection
        title="Attached button"
        description="A real Button rendered in the trailing slot for an action tied to the field's contents, like pasting a code or revealing a hidden PIN."
      >
        <Example
          layout="stacked"
          code={`<InputGroup
  label="Referral code"
  trailing={<Button size="sm" variant="ghost">Paste</Button>}
/>

<InputGroup
  label="PIN"
  type={visible ? "text" : "password"}
  trailing={
    <Button
      size="sm"
      variant="ghost"
      iconOnly
      aria-label={visible ? "Hide PIN" : "Show PIN"}
      iconLeft={visible ? <EyeSlash size={16} /> : <Eye size={16} />}
      onClick={() => setVisible((v) => !v)}
    />
  }
/>`}
        >
          <InputGroup
            label="Referral code"
            trailing={
              <Button size="sm" variant="ghost">
                Paste
              </Button>
            }
          />
          <PinToggle />
        </Example>
      </DocSection>

      <DocSection title="Invalid and disabled">
        <Example
          layout="stacked"
          code={`<InputGroup label="Amount" leading="₱" invalid helperText="Enter an amount greater than ₱0." />
<InputGroup label="Amount" leading="₱" disabled defaultValue="500.00" />`}
        >
          <InputGroup
            label="Amount"
            leading="₱"
            invalid
            helperText="Enter an amount greater than ₱0."
          />
          <InputGroup label="Amount" leading="₱" disabled defaultValue="500.00" />
        </Example>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "label",
              type: "string",
              description: "Label rendered above the field.",
            },
            {
              name: "leading",
              type: "ReactNode",
              description: "Rendered inside the box before the input.",
            },
            {
              name: "trailing",
              type: "ReactNode",
              description: "Rendered inside the box after the input — a unit or an attached button.",
            },
            {
              name: "helperText",
              type: "string",
              description: "Supporting copy below the field.",
            },
            {
              name: "invalid",
              type: "boolean",
              defaultValue: "false",
              description: "Danger border and helper text color.",
            },
            {
              name: "...props",
              type: "InputHTMLAttributes<HTMLInputElement>",
              description: "type, value, onChange, disabled, name, etc. pass to the underlying <input>.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
