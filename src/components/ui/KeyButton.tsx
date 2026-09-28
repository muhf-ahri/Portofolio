import type { ReactNode } from "react";

import { cx } from "@/lib/cx";

type KeyButtonProps = {
  href: string;
  children: ReactNode;
  /** Keycap colour. `accent` is the rust block, `plain` the cream one. */
  tone?: "plain" | "accent";
  /** Icon-only key: square, centred. */
  iconOnly?: boolean;
  className?: string;
  external?: boolean;
  ariaLabel?: string;
};

const tones = {
  plain: "bg-card text-ink",
  accent: "bg-ochre text-ink",
} as const;

/**
 * A 3D keycap. The extrusion is a hard bottom shadow that collapses on
 * press — see `.keycap` in globals.css. No JavaScript, no blur.
 *
 * `aria-label` is required for `iconOnly`, since the glyph is decorative.
 */
export function KeyButton({
  href,
  children,
  tone = "plain",
  iconOnly = false,
  className,
  external = false,
  ariaLabel,
}: KeyButtonProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      aria-label={iconOnly ? ariaLabel : undefined}
      className={cx(
        "keycap inline-flex items-center justify-center rounded-[4px] border-2 border-ink",
        iconOnly ? "size-11 shrink-0" : "gap-2 px-5 py-3 text-sm font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </a>
  );
}
