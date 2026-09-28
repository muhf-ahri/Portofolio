import type { ComponentPropsWithRef, ReactNode } from "react";

import { cx } from "@/lib/cx";

type SectionShellProps = ComponentPropsWithRef<"section"> & {
  id: string;
  children: ReactNode;
};

/** Owns the vertical rhythm so every section lines up. */
export function SectionShell({
  id,
  children,
  className,
  ...rest
}: SectionShellProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cx(
        "relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-32",
        className,
      )}
      {...rest}
    >
      {children}
    </section>
  );
}
