import type { ReactNode } from "react";
import { Nav } from "@/components/ui/nav";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import styles from "@/components/docs/docs.module.css";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav />
      <div className={styles.shell}>
        <DocsSidebar />
        {children}
      </div>
    </>
  );
}
