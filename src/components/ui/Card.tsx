import type { ComponentPropsWithRef } from "react";

import { cx } from "@/lib/cx";

type CardProps = ComponentPropsWithRef<"div"> & {
  /** Lift on hover: accent rule wipes in and the keyline goes rust. */
  interactive?: boolean;
};

/**
 * Server component. The whole treatment is CSS, so cards ship no JavaScript.
 * Thin keyline, solid fill, and a small hard offset shadow that only appears
 * on hover — the 70s print look without the page turning blocky.
 */
export function Card({
  interactive = false,
  className,
  ...rest
}: CardProps) {
  return (
    <div
      className={cx(
        "card",
        interactive && "card-interactive relative overflow-hidden",
        className,
      )}
      {...rest}
    />
  );
}
