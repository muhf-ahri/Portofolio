import type { ReactNode } from "react";

import { cx } from "@/lib/cx";

type KeyButtonProps = {
  href: string;
  children: ReactNode;
  /** Keycap colour. `accent` is the ochre block, `plain` the cream one. */
  tone?: "plain" | "accent";
  /**
   * No visible text, so `ariaLabel` is required. Height stays fixed while
   * width follows the parent — a `size-*` here would refuse to fill a grid
   * column, which is what keeps icon keys aligned with each other.
   */
  iconOnly?: boolean;
  className?: string;
  external?: boolean;
  ariaLabel?: string;
  /** Tooltip for sighted mouse users. Worth setting on `iconOnly` keys. */
  title?: string;
};

const tones = {
  plain: "bg-card text-ink",
  accent: "bg-ochre text-ink",
} as const;

/**
 * A 3D keycap. The extrusion is a hard bottom shadow that collapses on
 * press — see `.keycap` in globals.css. No JavaScript, no blur.
 */
export function KeyButton({
  href,
  children,
  tone = "plain",
  iconOnly = false,
  className,
  external = false,
  ariaLabel,
  title,
}: KeyButtonProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      aria-label={iconOnly ? ariaLabel : undefined}
      title={title}
      className={cx(
        "keycap inline-flex items-center justify-center rounded-[4px] border-2 border-ink",
        iconOnly ? "h-14 w-full" : "gap-2 px-5 py-3 text-sm font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </a>
  );
}
