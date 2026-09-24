import { ArrowLeft, ArrowsLeftRight, Gear, House, Receipt, Storefront } from "@phosphor-icons/react/ssr";
import { Sidebar } from "@/components/ui/sidebar";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Sidebar — Diliman Labs" };

const items = [
  { key: "overview", label: "Overview", icon: <House size={18} /> },
  { key: "transactions", label: "Transactions", icon: <ArrowsLeftRight size={18} /> },
  { key: "settlements", label: "Settlements", icon: <Receipt size={18} /> },
  { key: "merchants", label: "Merchants", icon: <Storefront size={18} /> },
  { key: "settings", label: "Settings", icon: <Gear size={18} /> },
];

const header = (
  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", paddingInline: "var(--space-2)" }}>
    <span
      style={{
        width: "var(--space-8)",
        height: "var(--space-8)",
        borderRadius: "var(--radius-md)",
        background: "var(--accent)",
        color: "var(--text-on-accent)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "var(--text-sm)",
        fontWeight: 600,
      }}
    >
      P
    </span>
    <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)" }}>EP</span>
  </div>
);

const footer = (
  <a
    href="#"
    style={{
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)",
      padding: "var(--space-2) var(--space-3)",
      fontSize: "var(--text-sm)",
      fontWeight: 500,
      color: "var(--text-tertiary)",
      textDecoration: "none",
    }}
  >
    <ArrowLeft size={16} />
    Back to examples
  </a>
);

export default function SidebarDocs() {
  return (
    <DocPage
      title="Sidebar"
      description="A reusable app-shell sidebar: nav items as data, active-item highlighting, a header slot, and a footer slot — the pattern the dashboard example built inline before this component existed."
    >
      <DocSection
        title="Usage"
        description="Nav items are generic data, the same way Table takes a columns prop — this component never hardcodes payments-specific navigation."
      >
        <Example
          layout="stacked"
          code={`<Sidebar
  header={<Brand />}
  footer={<Link href="/examples">Back to examples</Link>}
  items={[
    { key: "overview", label: "Overview", icon: <House size={18} />, href: "/overview" },
    { key: "transactions", label: "Transactions", icon: <ArrowsLeftRight size={18} />, href: "/transactions" },
  ]}
  defaultActiveKey="overview"
/>`}
        >
          <div style={{ height: "360px", width: "100%", display: "flex", border: "1px solid var(--border-subtle)" }}>
            <Sidebar items={items} header={header} footer={footer} defaultActiveKey="overview" />
            <div style={{ flex: 1, background: "var(--surface)" }} />
          </div>
        </Example>
        <Note>
          Each item can be a link (<code>href</code>) or an action (<code>onClick</code>) — links
          render as <code>next/link</code>, everything else as a button, so route-based and
          action-based navigation both work without a second component.
        </Note>
      </DocSection>

      <DocSection
        title="Collapsed"
        description="A narrower icon-only rail for denser layouts. Labels move to the title attribute so they're still available on hover."
      >
        <Example layout="stacked" code={`<Sidebar collapsed items={…} />`}>
          <div style={{ height: "360px", width: "100%", display: "flex", border: "1px solid var(--border-subtle)" }}>
            <Sidebar items={items} header={header} footer={footer} defaultActiveKey="transactions" collapsed />
            <div style={{ flex: 1, background: "var(--surface)" }} />
          </div>
        </Example>
        <Note>
          The sidebar hides below the <code>md</code> breakpoint by default, matching the
          dashboard example&apos;s responsive behavior — consumers still own their own mobile nav
          affordance (a top bar, a sheet) the same way that example does.
        </Note>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "items",
              type: "{ key, label, icon?, href?, onClick? }[]",
              description: "Navigation items, in order.",
            },
            { name: "activeKey", type: "string", description: "Controlled active item key." },
            { name: "defaultActiveKey", type: "string", description: "Initial active key when uncontrolled." },
            { name: "onActiveKeyChange", type: "(key: string) => void", description: "Called after an item is selected." },
            { name: "header", type: "ReactNode", description: "Slot above the nav, typically a brand mark." },
            { name: "footer", type: "ReactNode", description: "Slot pinned to the bottom, typically a back link." },
            { name: "collapsed", type: "boolean", defaultValue: "false", description: "Renders an icon-only rail." },
            { name: "width", type: "string", defaultValue: `"16rem"`, description: "Sidebar width when not collapsed." },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
