import type { CSSProperties } from "react";
import styles from "./checkout.module.css";

type ChannelBadgeKind = "wordmark" | "monogram" | "mastercard";

type ChannelBadgeConfig = {
  kind: ChannelBadgeKind;
  label: string;
  background: string;
  foreground: string;
  italic?: boolean;
};

/**
 * Per-channel colored chip — replaces the old "one Phosphor icon per
 * channel TYPE" mapping in step-method.tsx, which rendered the identical
 * Wallet/QrCode/CreditCard/Plugs icon for every e-wallet, QR, card or bank
 * channel (GCash, Maya and GrabPay were visually indistinguishable).
 *
 * Every treatment below is original CSS + type: a brand-evocative color
 * paired with either a short wordmark set in this kit's own type system
 * (Roboto, not a traced brand font) or a bank-initials monogram — never
 * downloaded, traced, or reproduced third-party logo artwork. Mastercard is
 * the one deliberate exception: the two overlapping circles are a generic,
 * widely-recognized abstract motif, not the literal Mastercard wordmark or
 * exact geometry/typeface, which keeps it on the "evocative" side of the
 * trademark-reproduction line this prototype is avoiding.
 *
 * Colors are the channels' well-known public brand colors — not part of
 * this kit's semantic token scale (tokens.css), and deliberately not routed
 * through it: a token exists to make one visual decision reusable across
 * many components, and "GCash is blue" is a fact about GCash, not a design
 * decision this kit gets to make or reuse elsewhere.
 */
const CHANNEL_BADGES: Record<string, ChannelBadgeConfig> = {
  GCash: { kind: "wordmark", label: "GCash", background: "#0072CE", foreground: "#ffffff" },
  Maya: { kind: "wordmark", label: "Maya", background: "#0B2E1F", foreground: "#ffffff" },
  GrabPay: { kind: "wordmark", label: "Grab", background: "#00B14F", foreground: "#052b14" },
  "QR Ph": { kind: "wordmark", label: "QR Ph", background: "#00838F", foreground: "#ffffff" },
  Visa: { kind: "wordmark", label: "VISA", background: "#1A1F71", foreground: "#ffffff", italic: true },
  Mastercard: { kind: "mastercard", label: "Mastercard", background: "", foreground: "" },
  BDO: { kind: "monogram", label: "BDO", background: "#00338E", foreground: "#ffffff" },
  BPI: { kind: "monogram", label: "BPI", background: "#C8102E", foreground: "#ffffff" },
  UnionBank: { kind: "monogram", label: "UB", background: "#F7941D", foreground: "#231F20" },
  Metrobank: { kind: "monogram", label: "MB", background: "#00205B", foreground: "#ffffff" },
  RCBC: { kind: "monogram", label: "RCBC", background: "#001B57", foreground: "#FFD100" },
  PNB: { kind: "monogram", label: "PNB", background: "#7A0022", foreground: "#ffffff" },
};

type ChannelBadgeProps = {
  /** Matched against the channel's display name (`Channel.name`). */
  name: string;
  /** Edge length in px for monogram/mastercard chips; wordmark chips use
   * this as a height and size their own width to the label. */
  size?: number;
};

export function ChannelBadge({ name, size = 32 }: ChannelBadgeProps) {
  const config = CHANNEL_BADGES[name];
  const fontSize = Math.max(9, Math.round(size * 0.34));

  if (!config) {
    // Unknown/future channel — neutral fallback so this never throws.
    return (
      <span
        className={styles.channelBadge}
        style={{ height: size, minWidth: size, fontSize, background: "var(--surface-sunken)", color: "var(--text-secondary)" }}
        aria-hidden="true"
      >
        {name.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  if (config.kind === "mastercard") {
    return (
      <span className={styles.mastercardBadge} style={{ height: size, width: size }} aria-hidden="true">
        <span className={styles.mcCircle} style={{ background: "#EB001B" }} />
        <span className={styles.mcCircle} style={{ background: "#F79E1B", opacity: 0.85 }} />
      </span>
    );
  }

  const style: CSSProperties = {
    height: size,
    minWidth: size,
    fontSize,
    background: config.background,
    color: config.foreground,
    fontStyle: config.italic ? "italic" : undefined,
  };

  return (
    <span className={styles.channelBadge} style={style} aria-hidden="true">
      {config.label}
    </span>
  );
}
