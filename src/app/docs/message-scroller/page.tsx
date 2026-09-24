"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Message } from "@/components/ui/message";
import { MessageScroller } from "@/components/ui/message-scroller";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

const SEED = [
  { sender: "Bea Santos", timestamp: "09:14", text: "Hi, my InstaPay transfer hasn't landed yet.", sent: false },
  { sender: "You", timestamp: "09:16", text: "Checking now — what's the reference number?", sent: true },
  { sender: "Bea Santos", timestamp: "09:17", text: "EPL-004821.", sent: false },
  { sender: "You", timestamp: "09:19", text: "Found it — it's still clearing on the receiving bank's side.", sent: true },
  { sender: "Bea Santos", timestamp: "09:20", text: "Okay, how long does that usually take?", sent: false },
  { sender: "You", timestamp: "09:21", text: "Under 15 minutes for InstaPay. I'll follow up if it's longer.", sent: true },
];

function ScrollerDemo() {
  const [messages, setMessages] = useState(SEED);

  const addMessage = () => {
    setMessages((current) => [
      ...current,
      { sender: "Bea Santos", timestamp: "09:24", text: "Got it, thank you for checking!", sent: false },
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

export default function MessageScrollerDocs() {
  return (
    <DocPage
      title="Message scroller"
      description="A scrolling container for a list of Messages that auto-scrolls to the newest one — unless the viewer has scrolled up to read history, in which case it gets out of the way."
    >
      <DocSection
        title="Auto-scroll that respects manual scrolling"
        description="Scroll up in the box below, then send a message — it stays put. Scroll back to the bottom and send another — it follows again."
      >
        <Example
          layout="stacked"
          code={`<MessageScroller style={{ height: "16rem" }}>
  {messages.map((m) => <Message key={m.id} {...m} />)}
</MessageScroller>`}
        >
          <ScrollerDemo />
        </Example>
        <Note>
          &quot;At the bottom&quot; is <code>scrollHeight - scrollTop - clientHeight &lt; 96</code> (96px,
          matching <code>--space-24</code>) — measured on every native <code>scroll</code> event
          and stored in a ref rather than state, so nothing here sets state inside an effect. An
          effect keyed on the message count then imperatively sets <code>scrollTop</code> when that
          ref says the viewer was already at the bottom, which is also what runs the initial
          scroll-to-bottom on mount.
        </Note>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            { name: "children", type: "ReactNode", description: "Message elements, in order." },
            { name: "className", type: "string", description: "Applied to the scroll container." },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
