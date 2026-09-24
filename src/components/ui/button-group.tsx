import type { ReactNode } from "react";
import styles from "./button-group.module.css";

type ButtonGroupProps = {
  children: ReactNode;
  orientation?: "horizontal" | "vertical";
  /** Label for assistive tech describing what the clustered actions do, e.g. "Text alignment". */
  "aria-label"?: string;
  className?: string;
};

export function ButtonGroup({
  children,
  orientation = "horizontal",
  className = "",
  ...props
}: ButtonGroupProps) {
  return (
    <div
      role="group"
      className={`${styles.group} ${className}`}
      data-orientation={orientation}
      {...props}
    >
      {children}
    </div>
  );
}
