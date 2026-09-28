"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { cx } from "@/lib/cx";
import { EASE, viewportOnce } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type RevealProps = {
  children: ReactNode;
  /** Seconds. Use to hand-order elements inside a stagger group. */
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
};

/**
 * Scroll-triggered fade + rise. Server-renderable children pass through
 * untouched, so wrapping a server subtree does not force it client-side.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: RevealProps) {
  const reduce = usePrefersReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={cx(className)}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: reduce ? 0.25 : 0.7, ease: EASE, delay: reduce ? 0 : delay }}
    >
      {children}
    </Component>
  );
}
