"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { SunDim, Moon } from "@phosphor-icons/react/ssr";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // Client-only flag without setState-in-effect: renders the placeholder on
  // the server/first paint, then the real state once hydrated.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return <div className="h-9 w-16 rounded-full border border-border-default" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle color theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative h-9 w-16 rounded-full border border-border-default bg-surface-sunken transition-colors"
    >
      <span
        className="absolute top-1 left-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs shadow-sm transition-transform"
        style={{
          transform: isDark ? "translateX(28px)" : "translateX(0)",
          color: "var(--text-on-accent)",
        }}
      >
        {isDark ? <Moon size={14} weight="fill" /> : <SunDim size={14} weight="fill" />}
      </span>
    </button>
  );
}
