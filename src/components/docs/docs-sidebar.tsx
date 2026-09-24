"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/docs/nav";
import { DocsSearch } from "./docs-search";
import styles from "./docs.module.css";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav className={styles.sidebar} aria-label="Documentation">
      <DocsSearch />
      {NAV.map((group) => (
        <div key={group.title} className={styles.navGroup}>
          <p className={styles.navGroupTitle}>{group.title}</p>
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${
                pathname === item.href ? styles.navLinkActive : ""
              }`}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.title}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}
