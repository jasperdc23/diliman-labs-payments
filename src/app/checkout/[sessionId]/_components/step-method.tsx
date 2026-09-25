"use client";

import { useState } from "react";
import { Bank, CaretDown, CreditCard, LockSimple, QrCode, Wallet } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/button";
import { InputGroup } from "@/components/ui/input-group";
import type { Channel, ChannelType } from "@/app/dashboard/_data/payments";
import { ChannelBadge } from "./channel-badge";
import { FieldCheck, FormVerified } from "./field-check";
import type { CardDetails } from "./types";
import styles from "./checkout.module.css";

/** Synthetic id for the merged Visa/Mastercard row — not a real channel.
 * Resolved to an actual `Channel` at pay-time by detecting the card brand
 * from the number typed in (see `resolveCardChannel` in checkout-flow.tsx).
 * A real card checkout shows one "Card" option and works out the network
 * from the number, not two pre-sorted buttons. */
export const CARD_METHOD_ID = "card-method";

const GROUPS: { type: ChannelType; label: string; icon: typeof Wallet }[] = [
  { type: "e-wallet", label: "E-wallets", icon: Wallet },
  { type: "qr", label: "QR", icon: QrCode },
  { type: "card", label: "Cards", icon: CreditCard },
  { type: "bank", label: "Bank transfer", icon: Bank },
];

/** How many preview badges fit on a category card before it switches to
 * a "+N" counter — banks would otherwise run six chips wide on mobile. */
const PREVIEW_LIMIT = 4;

function isLuhnValid(digits: string): boolean {
  if (digits.length < 12) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

export function detectCardBrand(rawNumber: string): "Visa" | "Mastercard" | null {
  const digits = rawNumber.replace(/\D/g, "");
  if (digits.startsWith("4")) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "Mastercard";
  return null;
}

function formatCardNumber(raw: string): string {
  return raw
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

/* Per-field checks, split out so each input can show its own tick the
   moment it passes rather than waiting on the whole form. */
export const cardFieldValid = {
  number: (card: CardDetails) => isLuhnValid(card.number.replace(/\D/g, "")),
  expiry: (card: CardDetails) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry.trim()),
  cvv: (card: CardDetails) => /^\d{3,4}$/.test(card.cvv.trim()),
  name: (card: CardDetails) => card.name.trim().length > 1,
};

export function isCardValid(card: CardDetails): boolean {
  return (
    cardFieldValid.number(card) &&
    cardFieldValid.expiry(card) &&
    cardFieldValid.cvv(card) &&
    cardFieldValid.name(card)
  );
}

type StepMethodProps = {
  channels: Channel[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  card: CardDetails;
  onCardChange: (card: CardDetails) => void;
  onContinue: () => void;
};

export function StepMethod({
  channels,
  selectedId,
  onSelect,
  card,
  onCardChange,
  onContinue,
}: StepMethodProps) {
  const enabled = channels.filter((c) => c.enabled);
  const detectedBrand = detectCardBrand(card.number);

  const groups = GROUPS.map((group) => ({
    ...group,
    rows: enabled.filter((c) => c.type === group.type),
  })).filter((group) => group.rows.length > 0);

  // Which category is expanded. Derived-but-overridable: whichever category
  // owns the current selection opens itself, so coming Back from a later
  // step lands on the open card rather than a collapsed list.
  const selectedGroupType =
    selectedId === CARD_METHOD_ID
      ? "card"
      : (enabled.find((c) => c.id === selectedId)?.type ?? null);
  const [openType, setOpenType] = useState<ChannelType | null>(selectedGroupType);

  const canContinue =
    selectedId === CARD_METHOD_ID ? isCardValid(card) : Boolean(selectedId);

  return (
    <div className={styles.stepCard}>
      <h1 className={styles.stepHeading}>Choose how to pay</h1>

      <fieldset className={styles.categoryList}>
        <legend className="sr-only">Payment method</legend>

        {groups.map((group) => {
          const Icon = group.icon;
          const open = openType === group.type;
          const isCardGroup = group.type === "card";
          // Cards collapse to one row ("Credit or debit card"), so the
          // preview names the networks instead of listing the channels.
          const previewNames = isCardGroup
            ? ["Visa", "Mastercard"]
            : group.rows.map((c) => c.name);
          const shown = previewNames.slice(0, PREVIEW_LIMIT);
          const overflow = previewNames.length - shown.length;
          const selectedHere = isCardGroup
            ? selectedId === CARD_METHOD_ID
            : group.rows.some((c) => c.id === selectedId);

          return (
            <div key={group.type} className={styles.categoryCard} data-open={open} data-selected={selectedHere}>
              <button
                type="button"
                className={styles.categoryHeader}
                aria-expanded={open}
                onClick={() => setOpenType(open ? null : group.type)}
              >
                <span className={styles.categoryIcon} aria-hidden="true">
                  <Icon size={20} weight="regular" />
                </span>

                <span className={styles.categoryText}>
                  <span className={styles.categoryName}>{group.label}</span>
                  <span className={styles.categoryPreview}>
                    {shown.join(" · ")}
                    {overflow > 0 ? ` · +${overflow} more` : ""}
                  </span>
                </span>

                <span className={styles.categoryBadges} aria-hidden="true">
                  {shown.map((name) => (
                    <ChannelBadge key={name} name={name} size={20} />
                  ))}
                </span>

                <CaretDown size={16} weight="bold" className={styles.categoryCaret} aria-hidden="true" />
              </button>

              {open && (
                <div className={styles.categoryBody}>
                  {isCardGroup ? (
                    <>
                      <label className={styles.tile} data-selected={selectedId === CARD_METHOD_ID}>
                        <input
                          type="radio"
                          name="payment-method"
                          value={CARD_METHOD_ID}
                          checked={selectedId === CARD_METHOD_ID}
                          onChange={() => onSelect(CARD_METHOD_ID)}
                          className={styles.tileInput}
                        />
                        <span className={styles.channelBadgeFallback} aria-hidden="true">
                          <CreditCard size={18} weight="regular" />
                        </span>
                        <span className={styles.tileName}>Credit or debit card</span>
                        <span className={styles.tileRadio} aria-hidden="true">
                          {selectedId === CARD_METHOD_ID && <span className={styles.tileRadioDot} />}
                        </span>
                      </label>

                      {selectedId === CARD_METHOD_ID && (
                        <div className={styles.cardForm}>
                          <InputGroup
                            label="Card number"
                            inputMode="numeric"
                            autoComplete="cc-number"
                            placeholder="4242 4242 4242 4242"
                            value={formatCardNumber(card.number)}
                            onChange={(e) =>
                              onCardChange({ ...card, number: e.target.value.replace(/\D/g, "").slice(0, 19) })
                            }
                            trailing={
                              <span className={styles.fieldTrailing}>
                                {detectedBrand && <ChannelBadge name={detectedBrand} size={20} />}
                                <FieldCheck valid={cardFieldValid.number(card)} />
                              </span>
                            }
                          />
                          <div className={styles.cardFormRow}>
                            <InputGroup
                              label="Expiry"
                              inputMode="numeric"
                              autoComplete="cc-exp"
                              placeholder="MM/YY"
                              value={card.expiry}
                              onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                                const formatted =
                                  digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
                                onCardChange({ ...card, expiry: formatted });
                              }}
                              trailing={<FieldCheck valid={cardFieldValid.expiry(card)} />}
                            />
                            <InputGroup
                              label="CVV"
                              inputMode="numeric"
                              autoComplete="cc-csc"
                              placeholder="123"
                              value={card.cvv}
                              onChange={(e) =>
                                onCardChange({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })
                              }
                              trailing={<FieldCheck valid={cardFieldValid.cvv(card)} />}
                            />
                          </div>
                          <InputGroup
                            label="Name on card"
                            autoComplete="cc-name"
                            placeholder="Juan Dela Cruz"
                            value={card.name}
                            onChange={(e) => onCardChange({ ...card, name: e.target.value })}
                            trailing={<FieldCheck valid={cardFieldValid.name(card)} />}
                          />

                          <FormVerified show={isCardValid(card)}>
                            Card verified — you&apos;re good to go
                          </FormVerified>
                        </div>
                      )}
                    </>
                  ) : (
                    group.rows.map((channel) => {
                      const selected = channel.id === selectedId;
                      return (
                        <label key={channel.id} className={styles.tile} data-selected={selected}>
                          <input
                            type="radio"
                            name="payment-method"
                            value={channel.id}
                            checked={selected}
                            onChange={() => onSelect(channel.id)}
                            className={styles.tileInput}
                          />
                          <ChannelBadge name={channel.name} />
                          <span className={styles.tileName}>{channel.name}</span>
                          <span className={styles.tileRadio} aria-hidden="true">
                            {selected && <span className={styles.tileRadioDot} />}
                          </span>
                        </label>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </fieldset>

      <p className={styles.securityCue}>
        <LockSimple size={14} weight="fill" aria-hidden="true" />
        Your payment details are encrypted in transit.
      </p>

      <Button fullWidth disabled={!canContinue} onClick={onContinue}>
        Continue
      </Button>
    </div>
  );
}
