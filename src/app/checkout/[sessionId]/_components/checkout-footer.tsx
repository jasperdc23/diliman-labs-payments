import { LockSimple } from "@phosphor-icons/react/ssr";
import { BrandMark } from "@/components/brand-mark";
import styles from "./checkout.module.css";

/**
 * The one place Diliman Labs identity appears on this white-labeled page —
 * small, at the bottom, the way "Powered by Stripe" sits under a Stripe
 * Checkout page. Never the dominant identity; the merchant name at the top
 * of the page owns that.
 */
export function CheckoutFooter() {
  return (
    <p className={styles.footer}>
      <LockSimple size={12} weight="fill" aria-hidden="true" />
      Secured by
      <BrandMark height={12} />
    </p>
  );
}
