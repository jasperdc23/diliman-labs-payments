"use client";

import type { ReactNode } from "react";
import { CloudWarning } from "@phosphor-icons/react/ssr";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import styles from "../ops.module.css";

/**
 * The loading / failed / loaded wrapper every section renders through, so
 * all three states exist in one place and none of them can be a dead end:
 * the failed state offers a retry and a way back, and the skeleton
 * reserves the same shape the content will take.
 */
export function SectionFrame({
  eyebrow,
  title,
  description,
  actions,
  loading,
  failed,
  onRetry,
  onBack,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  loading: boolean;
  failed: boolean;
  onRetry: () => void;
  onBack: () => void;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col" style={{ gap: "var(--space-8)" }}>
      <header
        className="flex flex-wrap items-end justify-between"
        style={{ gap: "var(--space-4)" }}
      >
        <div className="flex flex-col" style={{ gap: "var(--space-2)", maxWidth: "62ch" }}>
          <div className="flex items-center" style={{ gap: "var(--space-3)" }}>
            <span className={styles.brandRule} aria-hidden="true" />
            <span className={styles.eyebrow}>{eyebrow}</span>
          </div>
          <h2 className={styles.sectionTitle}>{title}</h2>
          <p
            className="text-text-secondary"
            style={{ fontSize: "var(--text-sm)", lineHeight: "var(--leading-normal)" }}
          >
            {description}
          </p>
        </div>
        {actions ? (
          <div className={styles.chipRow}>{actions}</div>
        ) : null}
      </header>

      {failed ? (
        <Card padded={false}>
          <EmptyState
            icon={<CloudWarning size={32} weight="regular" />}
            title="The payments feed is unreachable"
            description="This console is simulating a feed outage — the switch sits under Settings, in prototype controls. Nothing is wrong with the data itself."
            action={{ label: "Restore the feed", onClick: onRetry }}
            secondaryAction={{ label: "Open Settings", onClick: onBack }}
          />
        </Card>
      ) : loading ? (
        <SectionSkeleton />
      ) : (
        children
      )}
    </section>
  );
}

function SectionSkeleton() {
  return (
    <div
      className="flex flex-col"
      style={{ gap: "var(--space-6)" }}
      role="status"
      aria-label="Loading section"
    >
      <span className="sr-only">Loading</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4" style={{ gap: "var(--space-6)" }}>
        {[0, 1, 2, 3].map((index) => (
          <Card key={index} flat>
            <Skeleton shape="text" width="45%" />
            <Skeleton shape="text" height="var(--space-8)" width="70%" />
            <Skeleton shape="text" width="35%" />
          </Card>
        ))}
      </div>
      <Card flat>
        <Skeleton shape="text" width="30%" />
        <Skeleton shape="block" height="14rem" />
      </Card>
      <Card flat>
        <Skeleton shape="text" width="22%" />
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <Skeleton key={index} shape="text" />
        ))}
      </Card>
    </div>
  );
}
