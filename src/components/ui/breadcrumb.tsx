import type { ReactNode } from "react";
import { CaretRight } from "@phosphor-icons/react/ssr";
import styles from "./breadcrumb.module.css";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  /** Renders each non-final item — defaults to a plain anchor. Pass your framework's Link to enable client-side navigation. */
  renderLink?: (item: BreadcrumbItem, index: number) => ReactNode;
  className?: string;
};

/**
 * A horizontal trail (Home / Section / Current page). The last item is
 * always plain text with `aria-current="page"`, never a link to itself.
 */
export function Breadcrumb({ items, renderLink, className = "" }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className={styles.item}>
              {isLast ? (
                <span aria-current="page" className={styles.current}>
                  {item.label}
                </span>
              ) : renderLink ? (
                renderLink(item, index)
              ) : (
                <a href={item.href} className={styles.link}>
                  {item.label}
                </a>
              )}
              {!isLast && (
                <span aria-hidden className={styles.separator}>
                  <CaretRight size={12} weight="bold" />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
