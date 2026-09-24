"use client";

import { createContext, useContext, type ReactNode } from "react";

export type Direction = "ltr" | "rtl";

const DirectionContext = createContext<Direction>("ltr");

type DirectionProviderProps = {
  dir?: Direction;
  children: ReactNode;
};

/** Forward-compatibility primitive: the kit has no RTL content planned
 * today, so this stays intentionally minimal — a context, a wrapper that
 * sets `dir`, and a hook. It does not retrofit RTL awareness into any
 * existing component; consumers that need it read `useDirection()`
 * themselves. */
export function DirectionProvider({ dir = "ltr", children }: DirectionProviderProps) {
  return (
    <DirectionContext.Provider value={dir}>
      <div dir={dir}>{children}</div>
    </DirectionContext.Provider>
  );
}

export function useDirection(): Direction {
  return useContext(DirectionContext);
}
