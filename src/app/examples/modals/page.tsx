"use client";

import { useState } from "react";
import { CircleNotch } from "@phosphor-icons/react/ssr";
import { Card, CardTitle, CardBody, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import buttonStyles from "@/components/ui/button.module.css";
import { BackLink } from "../_components/back-link";

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
});

function ConfirmationDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Card className="h-full">
      <CardTitle>Confirmation</CardTitle>
      <CardBody>
        A destructive action that needs a deliberate second step before it runs.
      </CardBody>
      <CardFooter>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Remove payout method
        </Button>
      </CardFooter>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size="sm"
        title="Remove this payout method?"
        description="BDO Unibank ••4471 will no longer be available for InstaPay transfers."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setOpen(false)}>
              Remove
            </Button>
          </>
        }
      >
        <p>
          Any scheduled payouts routed to this account will fail until you add a
          replacement. This can&apos;t be undone.
        </p>
      </Modal>
    </Card>
  );
}

function FormDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Card className="h-full">
      <CardTitle>Form in a modal</CardTitle>
      <CardBody>
        A short task that belongs inline with what triggered it, not on its own page.
      </CardBody>
      <CardFooter>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Add a bank account
        </Button>
      </CardFooter>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size="md"
        title="Add a bank account"
        description="Link a bank account to receive payouts via PESONet."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="add-bank-account-form">
              Save account
            </Button>
          </>
        }
      >
        <form
          id="add-bank-account-form"
          className="flex flex-col"
          style={{ gap: "var(--space-4)" }}
          onSubmit={(event) => {
            event.preventDefault();
            setOpen(false);
          }}
        >
          <Input
            label="Bank"
            name="bank"
            placeholder="Land Bank of the Philippines"
            autoComplete="off"
            required
          />
          <Input
            label="Account number"
            name="accountNumber"
            placeholder="0011 0022 3344"
            inputMode="numeric"
            required
          />
          <Input
            label="Account holder name"
            name="accountHolder"
            placeholder="Maria Santos"
            autoComplete="name"
            required
          />
        </form>
      </Modal>
    </Card>
  );
}

function LoadingDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Card className="h-full">
      <CardTitle>Loading / busy state</CardTitle>
      <CardBody>
        A dialog for work in progress, with nothing left for the person to decide.
      </CardBody>
      <CardFooter>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Send payout
        </Button>
      </CardFooter>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size="sm"
        title="Processing payout"
        description={`Sending ${peso.format(48900.5)} over PESONet.`}
        // No cancel or backdrop dismissal: closing mid-request would leave the
        // person unsure whether the payout actually went through.
        closeOnBackdropClick={false}
      >
        <div className="flex flex-col items-center" style={{ gap: "var(--space-3)", padding: "var(--space-4) 0" }}>
          <CircleNotch
            size={28}
            weight="bold"
            className={`${buttonStyles.spinner} text-text-tertiary`}
          />
          <p className="text-text-tertiary">This usually takes a few seconds.</p>
        </div>
      </Modal>
    </Card>
  );
}

function SizesDemo() {
  const [openSize, setOpenSize] = useState<"sm" | "md" | "lg" | null>(null);

  return (
    <Card className="h-full">
      <CardTitle>Sizes</CardTitle>
      <CardBody>
        Small for a single confirmation, medium for a short form, large for a review
        step. Same content, three widths, side by side.
      </CardBody>
      <CardFooter>
        <Button variant="secondary" onClick={() => setOpenSize("sm")}>
          Small
        </Button>
        <Button variant="secondary" onClick={() => setOpenSize("md")}>
          Medium
        </Button>
        <Button variant="secondary" onClick={() => setOpenSize("lg")}>
          Large
        </Button>
      </CardFooter>

      <Modal
        open={openSize !== null}
        onClose={() => setOpenSize(null)}
        size={openSize ?? "sm"}
        title="Settlement summary"
        description="27 Aug 2026 settlement batch across InstaPay, PESONet, and QR Ph."
        footer={<Button onClick={() => setOpenSize(null)}>Close</Button>}
      >
        <p>
          <strong className="text-text-primary">{peso.format(172850.55)}</strong> settled
          across 1,284 transactions, with a 98.6% success rate.
        </p>
      </Modal>
    </Card>
  );
}

export default function ModalsExamplePage() {
  return (
    <main className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-6 pt-24 pb-24 sm:px-10">
      <BackLink />

      <section className="flex flex-col gap-6">
        <p className="font-mono text-xs tracking-widest text-text-tertiary uppercase">
          Example application
        </p>
        <h1 className="max-w-3xl text-4xl leading-tight font-semibold tracking-tight text-balance text-text-primary sm:text-5xl">
          Every pattern Modal needs to cover.
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-text-secondary">
          A payments product leans on a handful of dialog shapes over and over:
          confirming something destructive, collecting a short form, showing that
          work is in progress, and picking a size that fits the content. Each card
          below opens a real Modal built the same way it would be in the product.
        </p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <ConfirmationDemo />
        <FormDemo />
        <LoadingDemo />
        <SizesDemo />
      </section>
    </main>
  );
}
