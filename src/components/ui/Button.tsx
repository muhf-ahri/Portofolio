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
  solid: "bg-ink text-paper border-ink shadow-hard hover:shadow-hard-lg",
  // Paper block, keyline only.
  outline: "bg-card text-ink border-ink shadow-hard hover:bg-paper-2 hover:shadow-hard-lg",
};

/**
 * Flat with a hard offset shadow that collapses into the surface on press —
 * the authentic print interaction, and it needs no JavaScript.
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
        "press inline-flex items-center justify-center gap-2 rounded-[0.375rem] border-2 px-6 py-3 text-sm font-semibold",
        "transition-none motion-reduce:transition-none",
        styles[variant],
        className,
      )}
    >
      {children}
    </a>
  );
}
