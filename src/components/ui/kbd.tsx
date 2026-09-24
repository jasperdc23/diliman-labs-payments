import type { HTMLAttributes, ReactNode } from "react";
import styles from "./kbd.module.css";

type KbdProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

/** An inline key/shortcut hint, e.g. `<Kbd>⌘K</Kbd>` or `<Kbd>Esc</Kbd>`. */
export function Kbd({ children, className = "", ...props }: KbdProps) {
  return (
    <kbd className={`${styles.kbd} ${className}`} {...props}>
      {children}
    </kbd>
  );
}
