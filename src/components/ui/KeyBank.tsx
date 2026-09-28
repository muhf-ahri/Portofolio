import type { ReactNode } from "react";

import { cx } from "@/lib/cx";

/**
 * A bank of icon keys that share one casing: no gaps, equal columns, divided
 * by keylines. Three separate bordered buttons never look like a key bank —
 * the outer border and the inner dividers are what sell it.
 */
export function KeyBank({ children }: { children: ReactNode }) {
  return (
    <div
      className="keycap-bank grid grid-cols-3 overflow-hidden rounded-[4px] border-2 border-ink bg-card"
      style={{ boxShadow: "0 4px 0 0 var(--color-ink)" }}
    >
      {children}
    </div>
  );
}

type KeyBankItemProps = {
  href: string;
  children: ReactNode;
  external?: boolean;
  /** Required — the glyph is decorative and hidden from assistive tech. */
  ariaLabel: string;
  /** Visible tooltip text for sighted mouse users. */
  label: string;
  /** Any item except the first gets a left keyline. */
  className?: string;
};

export function KeyBankItem({
  href,
  children,
  external = false,
  ariaLabel,
  label,
  className,
}: KeyBankItemProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      aria-label={ariaLabel}
      title={label}
      className={cx(
        "keycap-item group relative grid h-14 place-items-center border-l-2 border-ink",
        "border-l-0 first:border-l-0",
        className,
      )}
    >
      {children}
    </a>
  );
}
