import type { ReactNode } from "react";
import { CodeBlock } from "./code-block";
import styles from "./docs.module.css";

export function DocPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <article className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{title}</h1>
        <p className={styles.pageDescription}>{description}</p>
      </header>
      {children}
    </article>
  );
}

export function DocSection({
  title,
  description,
  id,
  children,
}: {
  title: string;
  description?: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.section} id={id}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {description && <p className={styles.sectionDescription}>{description}</p>}
      {children}
    </section>
  );
}

export function Example({
  code,
  layout = "row",
  children,
}: {
  code: string;
  layout?: "row" | "stacked" | "center";
  children: ReactNode;
}) {
  const previewClass = [
    styles.preview,
    layout === "stacked" && styles.previewStacked,
    layout === "center" && styles.previewCenter,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.example}>
      <div className={previewClass}>{children}</div>
      <CodeBlock code={code} />
    </div>
  );
}

export type PropRow = {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
};

export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <table className={styles.propsTable}>
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.name}>
            <td className={styles.propName}>{row.name}</td>
            <td className={styles.propType}>{row.type}</td>
            <td className={styles.propType}>{row.defaultValue ?? "—"}</td>
            <td>{row.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return <p className={styles.note}>{children}</p>;
}
