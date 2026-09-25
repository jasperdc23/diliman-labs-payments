import type { CheckoutStep } from "./types";
import styles from "./checkout.module.css";

const STEPS: { step: 1 | 2 | 3; label: string; hint: string }[] = [
  { step: 1, label: "Method", hint: "Pick how you want to pay" },
  { step: 2, label: "Details", hint: "Tell us who's paying" },
  { step: 3, label: "Confirm", hint: "Review and complete payment" },
];

/** Maps every flow step onto the 1-2-3 the customer actually picks through.
 * `"processing"` still reads as step 3 — it's the tail end of confirming,
 * not a step of its own — and `"status"` (the outcome) shows the flow as
 * fully complete rather than pinned to step 3. */
function currentStepNumber(step: CheckoutStep): 1 | 2 | 3 | 4 {
  switch (step) {
    case "method":
      return 1;
    case "details":
      return 2;
    case "confirm":
    case "processing":
      return 3;
    case "status":
      return 4;
  }
}

type StepProgressProps = {
  step: CheckoutStep;
  /** "horizontal" is the original compact-card layout (mobile, and every
   * viewport below the two-pane breakpoint). "vertical" is used in the
   * desktop left pane, where a dot-and-connector column beside the step
   * labels reads cleaner than a horizontal row squeezed into a narrow
   * sidebar. Same STEPS/state logic either way. */
  orientation?: "horizontal" | "vertical";
};

export function StepProgress({ step, orientation = "horizontal" }: StepProgressProps) {
  const current = currentStepNumber(step);

  if (orientation === "vertical") {
    return (
      <ol className={styles.progressVertical} aria-label="Checkout progress">
        {STEPS.map(({ step: n, label, hint }, index) => {
          const state = current > n || current === 4 ? "done" : current === n ? "current" : "upcoming";
          return (
            <li key={n} className={styles.progressStepVertical} data-state={state}>
              <span className={styles.progressDotColumn}>
                <span className={styles.progressDot} aria-hidden="true">
                  {n}
                </span>
                {index < STEPS.length - 1 && (
                  <span className={styles.progressLineVertical} data-done={state === "done"} aria-hidden="true" />
                )}
              </span>
              <span className="flex flex-col">
                <span className={styles.progressLabelVertical}>{label}</span>
                {/* Only the step someone's actually on needs the "what does
                    this mean" caption — done/upcoming steps just need to
                    read as a list, not repeat instructions for a step
                    that's over or hasn't started. */}
                {state === "current" && <span className={styles.progressHint}>{hint}</span>}
              </span>
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <ol className={styles.progress} aria-label="Checkout progress">
      {STEPS.map(({ step: n, label }, index) => {
        const state = current > n || current === 4 ? "done" : current === n ? "current" : "upcoming";
        return (
          <li key={n} className={styles.progressStep} data-state={state} style={{ flex: index === STEPS.length - 1 ? "0 0 auto" : 1 }}>
            <span className={styles.progressDot} aria-hidden="true">
              {n}
            </span>
            <span className={styles.progressLabel}>{label}</span>
            {index < STEPS.length - 1 && (
              <span className={styles.progressLine} data-done={state === "done"} aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
