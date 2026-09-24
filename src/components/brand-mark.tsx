"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

// Intrinsic size of the supplied wordmark, used to derive width from height.
const RATIO = 775 / 226;

export function BrandMark({ height = 24, className = "" }: { height?: number; className?: string }) {
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const width = Math.round(height * RATIO);

  // The wordmark is ink-on-transparent, so it would vanish against a dark
  // surface — the dark-theme asset is the same mark recolored to white with
  // the yellow dot left intact. Reserve the space before hydration so the
  // header doesn't shift when the right variant resolves.
  if (!mounted) {
    return <div style={{ height, width }} className={className} aria-hidden />;
  }

  return (
    <Image
      src={
        resolvedTheme === "dark"
          ? "/brand/diliman-labs-wordmark-light.png"
          : "/brand/diliman-labs-wordmark.png"
      }
      alt="Diliman Labs"
      height={height}
      width={width}
      priority
      className={className}
    />
  );
}
