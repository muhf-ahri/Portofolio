import type { ComponentPropsWithRef } from "react";

import { cx } from "@/lib/cx";

type CardProps = ComponentPropsWithRef<"div"> & {
  /** Lift + deepen the offset shadow on hover. Zero JS — CSS only. */
  interactive?: boolean;
  /** 2px keyline instead of the default 1px rule. */
  strong?: boolean;
};

/**
 * Server component. The whole treatment is CSS, so cards ship no JavaScript.
 * 70s print look: solid fill, hard keyline, hard offset shadow, no blur.
 */
export function Card({
  interactive = false,
  strong = true,
  className,
  ...rest
}: CardProps) {
  return (
    <div
      className={cx(
        "card",
        !strong && "border",
        interactive &&
          "press hover:border-ink focus-within:border-rust motion-reduce:transition-none",
        className,
      )}
      {...rest}
    />
  );
}
