import { ArrowLeft, ArrowRight, Trash } from "@phosphor-icons/react/ssr";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ButtonGroup } from "./button-group";
import { Button } from "./button";

const meta: Meta<typeof ButtonGroup> = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {
  render: () => (
    <ButtonGroup aria-label="Statement period">
      <Button variant="secondary">Day</Button>
      <Button variant="secondary">Week</Button>
      <Button variant="secondary">Month</Button>
      <Button variant="secondary">Year</Button>
    </ButtonGroup>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <ButtonGroup aria-label="Pagination">
      <Button variant="secondary" iconOnly aria-label="Previous page" iconLeft={<ArrowLeft size={16} />} />
      <Button variant="secondary" iconOnly aria-label="Next page" iconLeft={<ArrowRight size={16} />} />
    </ButtonGroup>
  ),
};

export const PrimaryWithDanger: Story = {
  render: () => (
    <ButtonGroup aria-label="Payout actions">
      <Button>Approve payout</Button>
      <Button variant="danger" iconOnly aria-label="Delete payout method" iconLeft={<Trash size={16} />} />
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical" aria-label="Statement period">
      <Button variant="secondary">Day</Button>
      <Button variant="secondary">Week</Button>
      <Button variant="secondary">Month</Button>
    </ButtonGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <ButtonGroup aria-label="Statement period">
      <Button variant="secondary">Day</Button>
      <Button variant="secondary" disabled>
        Week
      </Button>
      <Button variant="secondary">Month</Button>
    </ButtonGroup>
  ),
};
