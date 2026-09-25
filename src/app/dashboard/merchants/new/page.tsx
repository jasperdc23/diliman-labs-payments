"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Storefront } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { MERCHANT_STATUS_LABEL, type MerchantStatus } from "@/app/dashboard/_data/payments";
import { useOps } from "../../_components/ops-context";
import styles from "../../ops.module.css";

const CATEGORIES = [
  "Retail",
  "Food & beverage",
  "Logistics",
  "Healthcare",
  "Automotive",
  "Home & living",
  "Telecommunications",
];

const STATUS_OPTIONS: { value: MerchantStatus; label: string }[] = [
  { value: "onboarding", label: MERCHANT_STATUS_LABEL.onboarding },
  { value: "active", label: MERCHANT_STATUS_LABEL.active },
  { value: "review", label: MERCHANT_STATUS_LABEL.review },
  { value: "suspended", label: MERCHANT_STATUS_LABEL.suspended },
];

export default function AddMerchantPage() {
  const ops = useOps();
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [status, setStatus] = useState<MerchantStatus>("onboarding");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Merchant name is required.");
      return;
    }
    const id = ops.addMerchant({ name: trimmedName, category, status });
    ops.notify({
      title: `${trimmedName} added`,
      description: "Session-only — the account has no transactions yet in the sample ledger.",
      variant: "success",
    });
    router.push(`/dashboard/merchants/${id}`);
  }

  return (
    <section className="flex flex-col" style={{ gap: "var(--space-8)", maxWidth: "40rem" }}>
      <div className="flex flex-col" style={{ gap: "var(--space-4)" }}>
        <Link href="/dashboard/merchants" className={styles.linkButton}>
          <ArrowLeft size={14} weight="bold" aria-hidden="true" />
          Back to merchants
        </Link>
        <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
          <div className="flex items-center" style={{ gap: "var(--space-3)" }}>
            <span className={styles.brandRule} aria-hidden="true" />
            <span className={styles.eyebrow}>Accounts</span>
          </div>
          <h1 className={styles.sectionTitle}>Add merchant</h1>
          <p
            className="text-text-secondary"
            style={{ fontSize: "var(--text-sm)", lineHeight: "var(--leading-normal)" }}
          >
            Session-only, like every other mutation in this prototype — the new account joins
            the merchant list immediately but starts with no transactions in the fixed 60-row
            sample.
          </p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: "var(--space-4)" }}>
          <Input
            label="Merchant name"
            placeholder="e.g. Bulacan Hardware"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (error) setError(null);
            }}
            invalid={Boolean(error)}
            helperText={error ?? undefined}
            required
          />
          <NativeSelect
            label="Category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            options={CATEGORIES.map((entry) => ({ value: entry, label: entry }))}
          />
          <NativeSelect
            label="Initial status"
            value={status}
            onChange={(event) => setStatus(event.target.value as MerchantStatus)}
            options={STATUS_OPTIONS}
            helperText="Most new accounts start in Onboarding until the first settlement window clears."
          />

          <div className={styles.chipRow} style={{ marginTop: "var(--space-2)" }}>
            <Button type="submit" variant="primary" size="sm" iconLeft={<Storefront size={14} weight="regular" />}>
              Add merchant
            </Button>
            <Link href="/dashboard/merchants">
              <Button type="button" variant="ghost" size="sm">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </section>
  );
}
