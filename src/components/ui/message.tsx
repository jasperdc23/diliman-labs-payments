import type { ReactNode } from "react";
import { Avatar } from "./avatar";
import { Bubble, type BubbleVariant } from "./bubble";

type MessageProps = {
  sender: string;
  timestamp: string;
  variant?: BubbleVariant;
  avatarSrc?: string;
  children: ReactNode;
  className?: string;
};

/**
 * A full chat message row: avatar, sender name, timestamp and the bubble
 * itself, in the same sent/received orientation as `Bubble`. "Sent"
 * mirrors the row (avatar and text align right) so a thread reads the way
 * a phone messaging app does — the mirroring is the only cue needed to
 * tell "me" from "them" at a glance, so name/timestamp still read
 * left-to-right rather than being reversed character-by-character.
 */
export function Message({
  sender,
  timestamp,
  variant = "received",
  avatarSrc,
  children,
  className = "",
}: MessageProps) {
  const isSent = variant === "sent";

  return (
    <div
      className={`flex items-start ${isSent ? "flex-row-reverse" : "flex-row"} ${className}`}
      style={{ gap: "var(--space-3)" }}
    >
      <Avatar name={sender} src={avatarSrc} size="sm" />
      <div className={`flex min-w-0 flex-col ${isSent ? "items-end" : "items-start"}`} style={{ gap: "var(--space-1)" }}>
        <div
          className={`flex items-baseline text-text-tertiary ${isSent ? "flex-row-reverse" : "flex-row"}`}
          style={{ gap: "var(--space-2)", fontSize: "var(--text-xs)" }}
        >
          <span className="font-medium text-text-secondary">{sender}</span>
          <span>{timestamp}</span>
        </div>
        <Bubble variant={variant}>{children}</Bubble>
      </div>
    </div>
  );
}
