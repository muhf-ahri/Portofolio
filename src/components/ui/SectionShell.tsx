import type { ComponentPropsWithRef, ReactNode } from "react";

import { cx } from "@/lib/cx";

type SectionShellProps = ComponentPropsWithRef<"section"> & {
  id: string;
  children: ReactNode;
  /**
   * Height of the section, for scroll-linked sections whose content pins to
   * the viewport while the reader scrolls through it. Omit for a normal
   * section that ends where its content ends.
   */
  trackHeight?: string;
  /** Pin the content to the viewport for the length of the track. */
  sticky?: boolean;
};

/** Owns the vertical rhythm so every section lines up. */
export function SectionShell({
  id,
  children,
  className,
  trackHeight,
  sticky = false,
  ...rest
}: SectionShellProps) {
  const track = trackHeight ? { height: trackHeight } : undefined;
  const shell = sticky
    ? "sticky top-0 flex h-svh flex-col justify-center"
    : "py-20 sm:py-28 lg:py-32";

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cx("relative mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-10", className)}
      {...rest}
    >
      <div style={track}>
        <div className={cx(shell)}>{children}</div>
      </div>
    </section>
  );
}
