"use client";

import { useCallback, useEffect, useId, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import { Menu, type MenuItem } from "./dropdown-menu";

export type { MenuItem } from "./dropdown-menu";

export type ContextMenuProps = {
  /** The area that opens the menu on right-click. */
  children: ReactNode;
  items: MenuItem[];
  className?: string;
};

/**
 * The same menu primitive as DropdownMenu — it renders the identical `Menu`
 * component from dropdown-menu.tsx — but triggered by a right-click and
 * positioned at the cursor instead of below a trigger element.
 */
export function ContextMenu({ children, items, className = "" }: ContextMenuProps) {
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const close = useCallback((refocus: boolean) => {
    setPoint(null);
    if (refocus) areaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!point) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setPoint(null);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [point]);

  const handleContextMenu = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setPoint({ x: event.clientX, y: event.clientY });
  };

  return (
    <div ref={rootRef} className={className}>
      <div ref={areaRef} tabIndex={-1} className="outline-none" onContextMenu={handleContextMenu}>
        {children}
      </div>
      {point && (
        <Menu
          id={menuId}
          items={items}
          onClose={close}
          style={{ position: "fixed", top: point.y, left: point.x, zIndex: 60 }}
        />
      )}
    </div>
  );
}
