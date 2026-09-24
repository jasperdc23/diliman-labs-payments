import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TextB, TextItalic, TextUnderline } from "@phosphor-icons/react/ssr";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

const meta: Meta<typeof ToggleGroup> = {
  title: "Components/Toggle Group",
  component: ToggleGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ToggleGroup>;

export const Single: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue={["instapay"]} aria-label="Settlement rail">
      <ToggleGroupItem value="instapay">InstaPay</ToggleGroupItem>
      <ToggleGroupItem value="pesonet">PESONet</ToggleGroupItem>
      <ToggleGroupItem value="qrph">QR Ph</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Multiple: Story = {
  render: () => (
    <ToggleGroup type="multiple" defaultValue={["bold"]} aria-label="Text formatting">
      <ToggleGroupItem value="bold" aria-label="Bold">
        <TextB size={16} />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <TextItalic size={16} />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <TextUnderline size={16} />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const WithDisabledItem: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue={["instapay"]} aria-label="Settlement rail">
      <ToggleGroupItem value="instapay">InstaPay</ToggleGroupItem>
      <ToggleGroupItem value="pesonet">PESONet</ToggleGroupItem>
      <ToggleGroupItem value="qrph" disabled>
        QR Ph
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};
