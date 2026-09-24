import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";
import { Toaster, useToast } from "./toast";

const meta: Meta<typeof Toaster> = {
  title: "Components/Toast",
  component: Toaster,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Toaster>;

function TriggerDemo() {
  const { toast } = useToast();

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="secondary"
        onClick={() =>
          toast({ variant: "success", title: "Payout sent", description: "₱48,900.50 sent via InstaPay." })
        }
      >
        Trigger success
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({ variant: "danger", title: "Payout failed", description: "The receiving bank declined the transfer." })
        }
      >
        Trigger danger
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ variant: "info", title: "Settlement in progress", duration: 8000 })}
      >
        Trigger info (8s)
      </Button>
    </div>
  );
}

export const Playground: Story = {
  render: () => (
    <Toaster>
      <TriggerDemo />
    </Toaster>
  ),
};
