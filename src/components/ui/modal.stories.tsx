import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Modal } from "./modal";
import { Button } from "./button";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof Modal>;

function Demo({ size }: { size: "sm" | "md" | "lg" }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Confirm payout</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size={size}
        title="Confirm payout"
        description="This transfer goes out over PESONet and settles the next banking day."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Send ₱48,900.50</Button>
          </>
        }
      >
        <div className="flex flex-col" style={{ gap: "var(--space-3)" }}>
          <p>
            Sending <strong className="text-text-primary">₱48,900.50</strong> to Landbank ••7730 on
            27 Aug 2026. Once submitted the transfer can&apos;t be recalled from here.
          </p>
          <p>Escape, the close button, and a click on the backdrop all dismiss this dialog.</p>
        </div>
      </Modal>
    </>
  );
}

export const Medium: Story = { render: () => <Demo size="md" /> };
export const Small: Story = { render: () => <Demo size="sm" /> };
export const Large: Story = { render: () => <Demo size="lg" /> };
