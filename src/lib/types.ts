import type { ComponentType, SVGProps } from "react";

/**
 * Icon slot type. Accepts Lucide components and the local brand glyphs below
 * interchangeably — all of them take `size` plus normal SVG props.
 */
export type IconType = ComponentType<
  SVGProps<SVGSVGElement> & { size?: number | string }
>;
