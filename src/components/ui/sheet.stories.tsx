import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Sheet, type SheetSide } from "./sheet";
import { Button } from "./button";

const meta: Meta<typeof Sheet> = {
  title: "Components/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof Sheet>;

function Demo({ side }: { side: SheetSide }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open transaction details</Button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        side={side}
        title="Transaction details"
        description="InstaPay transfer · 27 Aug 2026"
        footer={
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="flex flex-col" style={{ gap: "var(--space-3)" }}>
          <p>
            <strong className="text-text-primary">₱12,500.00</strong> sent to Juan Dela Cruz via
            InstaPay. Reference no. INSP-2608-0417.
          </p>
          <p>This also covers what a &quot;Drawer&quot; would be — a Sheet anchored to a side.</p>
        </div>
      </Sheet>
    </>
  );
}

export const Right: Story = { render: () => <Demo side="right" /> };
export const Left: Story = { render: () => <Demo side="left" /> };
export const Top: Story = { render: () => <Demo side="top" /> };
export const Bottom: Story = { render: () => <Demo side="bottom" /> };
