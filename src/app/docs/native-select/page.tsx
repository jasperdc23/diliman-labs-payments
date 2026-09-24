import { NativeSelect, type NativeSelectOption } from "@/components/ui/native-select";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Native Select — EP Design Kit" };

const rails: NativeSelectOption[] = [
  { value: "instapay", label: "InstaPay" },
  { value: "pesonet", label: "PESONet" },
  { value: "qrph", label: "QR Ph" },
  { value: "swift", label: "SWIFT", disabled: true },
  { value: "cash", label: "Over the counter" },
];

export default function NativeSelectDocs() {
  return (
    <DocPage
      title="Native Select"
      description="A styled wrapper around a real <select> element. Only the chrome is custom — the dropdown itself is whatever the browser or OS renders, which is the point."
    >
      <DocSection
        title="When to reach for this over Select"
        description="Use Native Select for a short, form-native choice where you want the platform picker (a full-screen wheel on iOS, a native menu on Android and desktop) and zero JS. Use the custom Select (/docs/select) when you need richer styling, a check mark on the current value, or features Native Select can't offer, like search or a future multi-select."
      >
        <Example
          layout="stacked"
          code={`const rails = [
  { value: "instapay", label: "InstaPay" },
  { value: "pesonet", label: "PESONet" },
  { value: "qrph", label: "QR Ph" },
  { value: "swift", label: "SWIFT", disabled: true },
  { value: "cash", label: "Over the counter" },
];

<NativeSelect label="Settlement rail" options={rails} />`}
        >
          <NativeSelect label="Settlement rail" options={rails} />
        </Example>
      </DocSection>

      <DocSection title="Placeholder, helper text and invalid">
        <Example
          layout="stacked"
          code={`<NativeSelect label="Settlement rail" options={rails} placeholder="Choose a rail" />
<NativeSelect label="Settlement rail" options={rails} invalid helperText="Pick a settlement rail." />`}
        >
          <NativeSelect label="Settlement rail" options={rails} placeholder="Choose a rail" />
          <NativeSelect
            label="Settlement rail"
            options={rails}
            invalid
            helperText="Pick a settlement rail."
          />
        </Example>
        <Note>
          Disabled options (like SWIFT above) use the native `disabled` attribute on `&lt;option&gt;` —
          they render dimmed and can&apos;t be selected, exactly as the browser handles it elsewhere.
        </Note>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "options",
              type: "{ value, label, disabled? }[]",
              description: "Rendered as native <option> elements, in order.",
            },
            {
              name: "label",
              type: "ReactNode",
              description: "Label rendered above the field.",
            },
            {
              name: "placeholder",
              type: "string",
              description: "Shown as a disabled, hidden first option when nothing is selected.",
            },
            {
              name: "helperText",
              type: "ReactNode",
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
              type: "SelectHTMLAttributes<HTMLSelectElement>",
              description: "value, defaultValue, onChange, disabled, name, etc. pass straight through.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
