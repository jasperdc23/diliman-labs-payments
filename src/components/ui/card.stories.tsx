import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card, CardTitle, CardBody, CardFooter } from "./card";
import { Button } from "./button";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card style={{ maxWidth: "320px" }}>
      <CardTitle>Project name</CardTitle>
      <CardBody>
        Padding and internal spacing follow the Foundations/Spacing guide —
        space-6 outer padding, space-4 between blocks.
      </CardBody>
      <CardFooter>
        <Button size="sm">View</Button>
        <Button size="sm" variant="secondary">
          Dismiss
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Card interactive style={{ maxWidth: "320px" }}>
      <CardTitle>Clickable card</CardTitle>
      <CardBody>Hover or press to see the lift micro-interaction.</CardBody>
    </Card>
  ),
};
