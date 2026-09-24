import type { ReactNode } from "react";

/** Named ratios already established as a kit convention on the Imagery
 * docs page (`/docs/imagery`) and used by MediaCard's `aspectRatio` prop.
 * Kept in one place here so this component and MediaCard read the same
 * set instead of drifting into two conventions. */
export const ASPECT_RATIOS = {
  square: "1 / 1",
  "4:3": "4 / 3",
  "16:9": "16 / 9",
} as const;

export type AspectRatioName = keyof typeof ASPECT_RATIOS;

type AspectRatioProps = {
  ratio?: AspectRatioName | number | `${number} / ${number}`;
  children: ReactNode;
  className?: string;
};

/** Wraps a child so it fills a fixed width/height ratio via the CSS
 * `aspect-ratio` property. Pass one of the kit's named ratios (square,
 * 4:3, 16:9), a custom `width / height` string, or a plain number. */
export function AspectRatio({ ratio = "16:9", children, className = "" }: AspectRatioProps) {
  const cssRatio =
    typeof ratio === "number"
      ? ratio
      : (ASPECT_RATIOS as Record<string, string>)[ratio] ?? ratio;

  return (
    <div className={className} style={{ position: "relative", width: "100%", aspectRatio: cssRatio }}>
      <div style={{ position: "absolute", inset: 0 }}>{children}</div>
    </div>
  );
}
