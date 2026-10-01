import type { ReactNode } from "react";

import { cx } from "@/lib/cx";

type Variant = "solid" | "outline";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
  ariaLabel?: string;
};

const styles: Record<Variant, string> = {
  // Solid ink block with a paper-coloured label.
  solid: "bg-ink text-paper border-ink",
  // Paper block, keyline only.
  outline: "bg-card text-ink border-ink",
};

/**
 * Thin keyline, small hard offset shadow that appears on hover and collapses
 * into the surface on press — the authentic print interaction, no JavaScript.
 */
export function Button({
  href,
  children,
  variant = "solid",
  className,
  external = false,
  ariaLabel,
}: ButtonProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      aria-label={ariaLabel}
      className={cx(
        "press-lift inline-flex items-center justify-center gap-2 rounded-[0.375rem] border px-6 py-3 text-sm font-semibold",
        "transition-colors duration-150 hover:border-rust motion-reduce:transition-none",
        styles[variant],
        className,
      )}
    >
      {children}
    </a>
  );
}
