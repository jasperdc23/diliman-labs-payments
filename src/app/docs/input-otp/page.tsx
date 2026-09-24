"use client";

import { useState } from "react";
import { InputOTP } from "@/components/ui/input-otp";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

function ControlledOTP() {
  const [value, setValue] = useState("");
  const [complete, setComplete] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <InputOTP
        label="Verification code"
        helperText="Sent by SMS to +63 917 •••  ••34."
        value={value}
        onValueChange={(next) => {
          setValue(next);
          setComplete(false);
        }}
        onComplete={() => setComplete(true)}
      />
      <p style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
        Value: {value || "(empty)"} {complete && "— verifying…"}
      </p>
    </div>
  );
}

export default function InputOTPDocs() {
  return (
    <DocPage
      title="Input OTP"
      description="A one-time-code field for SMS 2FA — six real, single-digit <input> boxes that behave as one logical field. Built on native inputs rather than styled divs so mobile keyboards and screen readers work the way people expect."
    >
      <DocSection title="Basic usage" description="Defaults to 6 digits, the length of a typical SMS OTP.">
        <Example
          layout="stacked"
          code={`<InputOTP label="Verification code" helperText="Sent by SMS to +63 917 •••  ••34." />`}
        >
          <InputOTP label="Verification code" helperText="Sent by SMS to +63 917 •••  ••34." />
        </Example>
      </DocSection>

      <DocSection
        title="Keyboard and paste behavior"
        description="This is the whole point of the component, so it's spelled out exactly:"
      >
        <ul style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)", paddingLeft: "var(--space-4)", margin: 0 }}>
          <li>Typing a digit fills the current box and auto-advances focus to the next one.</li>
          <li>
            Backspace on a box that already has a digit just clears that digit. Backspace on an
            already-empty box moves focus back one box and clears it too, so holding backspace
            erases the code right to left.
          </li>
          <li>Left/Right arrow keys move focus between boxes without changing any value.</li>
          <li>
            Pasting anywhere in the row (e.g. an SMS autofill or a copied code) strips non-digit
            characters and fills every box from the first one, then moves focus to the last box
            that got a digit — it does not insert at the current cursor position.
          </li>
          <li>Each box renders as a real <code>&lt;input inputMode=&quot;numeric&quot; maxLength=1&gt;</code>, so mobile shows the numeric keypad and screen readers announce it as a normal text field.</li>
        </ul>
      </DocSection>

      <DocSection title="Length, invalid and disabled">
        <Example
          layout="stacked"
          code={`<InputOTP length={4} helperText="Enter the 4-digit code from your banking app." />
<InputOTP invalid helperText="That code is incorrect or has expired." />
<InputOTP disabled defaultValue="123" />`}
        >
          <InputOTP length={4} helperText="Enter the 4-digit code from your banking app." />
          <InputOTP invalid helperText="That code is incorrect or has expired." />
          <InputOTP disabled defaultValue="123" />
        </Example>
      </DocSection>

      <DocSection
        title="Controlled, with onComplete"
        description="onComplete fires once when every box has a digit — the natural place to trigger a verify call."
      >
        <Example layout="stacked" code={`<InputOTP value={value} onValueChange={setValue} onComplete={verify} />`}>
          <ControlledOTP />
        </Example>
        <Note>
          A hidden <code>name</code> input is rendered alongside the boxes when a <code>name</code>{" "}
          prop is passed, so the joined code still submits with a plain HTML form.
        </Note>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "length",
              type: "number",
              defaultValue: "6",
              description: "Number of single-character boxes.",
            },
            {
              name: "value / defaultValue",
              type: "string",
              description: "Controlled or uncontrolled full code, digits only.",
            },
            {
              name: "onValueChange",
              type: "(value: string) => void",
              description: "Called on every digit entered, cleared, or pasted.",
            },
            {
              name: "onComplete",
              type: "(value: string) => void",
              description: "Called once when the code reaches full length.",
            },
            {
              name: "invalid",
              type: "boolean",
              defaultValue: "false",
              description: "Danger border on every box and helper text color.",
            },
            {
              name: "disabled",
              type: "boolean",
              defaultValue: "false",
              description: "Disables every box.",
            },
            {
              name: "name",
              type: "string",
              description: "Renders a hidden input with the joined code, for plain form submission.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
