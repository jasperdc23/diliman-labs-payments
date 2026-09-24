import type { CSSProperties, ReactNode } from "react";
import styles from "./scroll-area.module.css";

type ScrollAreaProps = {
  children: ReactNode;
  maxHeight?: string;
  className?: string;
  style?: CSSProperties;
};

/** A scrollable container with a thin, token-colored scrollbar that only
 * shows up on hover or focus rather than the native browser chrome. A
 * plain overflow: auto box under the hood — see scroll-area.module.css
 * for the scrollbar styling, no custom scroll physics involved. */
export function ScrollArea({ children, maxHeight, className = "", style }: ScrollAreaProps) {
  return (
    <div className={`${styles.root} ${className}`} style={{ maxHeight, ...style }}>
      {children}
    </div>
  );
}
