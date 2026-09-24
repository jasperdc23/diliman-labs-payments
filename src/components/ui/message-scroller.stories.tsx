import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Button } from "./button";
import { Message } from "./message";
import { MessageScroller } from "./message-scroller";

const meta: Meta<typeof MessageScroller> = {
  title: "Components/Message Scroller",
  component: MessageScroller,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof MessageScroller>;

const SEED = [
  { sender: "Bea Santos", timestamp: "09:14", text: "Hi, my InstaPay transfer hasn't landed yet." },
  { sender: "You", timestamp: "09:16", text: "Checking now — what's the reference number?", sent: true },
  { sender: "Bea Santos", timestamp: "09:17", text: "EPL-004821." },
  { sender: "You", timestamp: "09:19", text: "Found it — it's still clearing on the receiving bank's side.", sent: true },
  { sender: "Bea Santos", timestamp: "09:20", text: "Okay, how long does that usually take?" },
  { sender: "You", timestamp: "09:21", text: "Under 15 minutes for InstaPay. I'll follow up if it's longer.", sent: true },
];

function ScrollerDemo() {
  const [messages, setMessages] = useState(SEED);

  const addMessage = () => {
    setMessages((current) => [
      ...current,
      {
        sender: "Bea Santos",
        timestamp: "09:24",
        text: "Got it, thank you for checking!",
      },
    ]);
  };

  return (
    <div className="flex flex-col" style={{ gap: "var(--space-3)", width: "26rem" }}>
      <MessageScroller
        className="rounded-lg border border-border-subtle"
        style={{ height: "16rem", padding: "var(--space-4)" }}
      >
        {messages.map((message, index) => (
          <Message
            key={index}
            sender={message.sender}
            timestamp={message.timestamp}
            variant={message.sent ? "sent" : "received"}
          >
            {message.text}
          </Message>
        ))}
      </MessageScroller>
      <Button size="sm" onClick={addMessage}>
        Simulate incoming message
      </Button>
    </div>
  );
}

export const AutoScroll: Story = {
  render: () => <ScrollerDemo />,
};
