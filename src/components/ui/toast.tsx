"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle, Info, Warning, WarningOctagon, X } from "@phosphor-icons/react/ssr";
import styles from "./toast.module.css";

export type ToastVariant = "info" | "success" | "warning" | "danger";

export type ToastOptions = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  /** Milliseconds before auto-dismiss. */
  duration?: number;
};

type ToastRecord = ToastOptions & { id: string };

type ToastContextValue = (options: ToastOptions) => void;

const ToastContext = createContext<ToastContextValue | null>(null);

const icons: Record<ToastVariant, ReactNode> = {
  info: <Info size={20} weight="fill" />,
  success: <CheckCircle size={20} weight="fill" />,
  warning: <Warning size={20} weight="fill" />,
  danger: <WarningOctagon size={20} weight="fill" />,
};

let idCounter = 0;

/**
 * Renders the toast stack and provides the `toast()` function every
 * descendant reaches via `useToast()`. Mount once, near the app root —
 * toasts are triggered by events (a save succeeding, a transfer failing),
 * not declared inline at the point of the triggering action, so a single
 * shared stack owned by a provider is the right shape rather than a
 * component instance per notification.
 *
 * Stacks bottom-right: it's clear of primary content and thumb-reachable
 * on mobile without covering the header or an in-flow Alert at the top of
 * the page.
 */
export function Toaster({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback<ToastContextValue>((options) => {
    const id = `toast-${(idCounter += 1)}`;
    const record: ToastRecord = { variant: "info", duration: 5000, ...options, id };
    setToasts((current) => [...current, record]);

    if (record.duration && record.duration > 0) {
      const timer = setTimeout(() => dismiss(id), record.duration);
      timers.current.set(id, timer);
    }
  }, [dismiss]);

  const value = useMemo(() => toast, [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.viewport} role="region" aria-label="Notifications">
        {toasts.map((item) => (
          <div
            key={item.id}
            role={item.variant === "danger" || item.variant === "warning" ? "alert" : "status"}
            className={styles.toast}
            data-variant={item.variant}
          >
            <span aria-hidden className={styles.icon}>
              {icons[item.variant ?? "info"]}
            </span>
            <div className={styles.body}>
              <p className={styles.title}>{item.title}</p>
              {item.description && <p className={styles.description}>{item.description}</p>}
            </div>
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              aria-label="Dismiss notification"
              className={styles.close}
            >
              <X size={14} weight="bold" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * `const { toast } = useToast(); toast({ title: "Payout sent", variant: "success" })`
 * — call from anywhere inside `<Toaster>` to push a notification onto the
 * stack. Throws outside a `Toaster` so a missing provider fails loudly
 * instead of silently dropping notifications.
 */
export function useToast() {
  const toast = useContext(ToastContext);
  if (!toast) {
    throw new Error("useToast must be used within a <Toaster>");
  }
  return { toast };
}
