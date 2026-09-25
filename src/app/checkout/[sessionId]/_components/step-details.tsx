"use client";

import { Envelope, Phone, User } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { InputGroup } from "@/components/ui/input-group";
import { FieldCheck, FormVerified } from "./field-check";
import type { ContactDetails } from "./types";
import styles from "./checkout.module.css";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Per-field, so each input can confirm itself as it's completed rather
   than the customer only finding out at the Continue button. */
const contactFieldValid = {
  name: (c: ContactDetails) => c.name.trim().length > 1,
  email: (c: ContactDetails) => EMAIL_PATTERN.test(c.email.trim()),
  phone: (c: ContactDetails) => c.phone.replace(/\D/g, "").length >= 7,
};

export function isContactValid(contact: ContactDetails): boolean {
  return (
    contactFieldValid.name(contact) &&
    contactFieldValid.email(contact) &&
    contactFieldValid.phone(contact)
  );
}

type StepDetailsProps = {
  contact: ContactDetails;
  onChange: (contact: ContactDetails) => void;
  consent: boolean;
  onConsentChange: (consent: boolean) => void;
  onBack: () => void;
  onContinue: () => void;
};

export function StepDetails({
  contact,
  onChange,
  consent,
  onConsentChange,
  onBack,
  onContinue,
}: StepDetailsProps) {
  const canContinue = isContactValid(contact) && consent;

  return (
    <div className={styles.stepCard}>
      <h1 className={styles.stepHeading}>Your details</h1>

      <div className="flex flex-col" style={{ gap: "var(--space-6)" }}>
        <InputGroup
          label="Full name"
          name="name"
          autoComplete="name"
          placeholder="Juan Dela Cruz"
          leading={<User size={18} weight="regular" />}
          value={contact.name}
          onChange={(event) => onChange({ ...contact, name: event.target.value })}
          trailing={<FieldCheck valid={contactFieldValid.name(contact)} />}
          required
        />
        <InputGroup
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="juan@example.com"
          leading={<Envelope size={18} weight="regular" />}
          value={contact.email}
          onChange={(event) => onChange({ ...contact, email: event.target.value })}
          trailing={<FieldCheck valid={contactFieldValid.email(contact)} />}
          required
        />
        <InputGroup
          label="Phone number"
          type="tel"
          name="phone"
          autoComplete="tel"
          placeholder="09171234567"
          leading={<Phone size={18} weight="regular" />}
          value={contact.phone}
          onChange={(event) => onChange({ ...contact, phone: event.target.value })}
          trailing={<FieldCheck valid={contactFieldValid.phone(contact)} />}
          required
        />

        <FormVerified show={isContactValid(contact)}>
          Details verified — you&apos;re good to go
        </FormVerified>
      </div>

      <Checkbox
        checked={consent}
        onChange={(event) => onConsentChange(event.target.checked)}
        label={
          <span>
            I agree to the{" "}
            <a
              href="/checkout/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent-text hover:underline"
            >
              Terms of Service
            </a>{" "}
            and acknowledge the{" "}
            <a
              href="/checkout/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent-text hover:underline"
            >
              Privacy Notice
            </a>{" "}
            (Data Privacy Act of 2012).
          </span>
        }
      />

      <div className="flex" style={{ gap: "var(--space-3)" }}>
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button fullWidth disabled={!canContinue} onClick={onContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
