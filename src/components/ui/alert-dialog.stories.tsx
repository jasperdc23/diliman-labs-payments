import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { AlertDialog } from "./alert-dialog";
import { Button } from "./button";

const meta: Meta<typeof AlertDialog> = {
  title: "Components/Alert Dialog",
  component: AlertDialog,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof AlertDialog>;

function Demo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete payout method
      </Button>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete payout method?"
        description="This removes Landbank ••7730 from this merchant's account. Payouts already in progress are not affected."
        actions={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setOpen(false)}>
              Delete payout method
            </Button>
          </>
        }
      />
    </>
  );
}

export const Default: Story = { render: () => <Demo /> };
