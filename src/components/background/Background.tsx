"use client";

import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { useEffect, useRef } from "react";

/**
 * Flat print textures: oversized hard-edged colour fields, a halftone band,
 * and paper fibre. No glow, no blur — a gradient mesh would undo the theme.
 * Animation is skipped entirely under reduced-motion.
 */
export function Background() {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce || !root.current) return;
    const el = root.current;

    const ctx = gsap.context(() => {
      // Slow, small drift. Anything bigger fights the flat shapes.
      gsap.utils.toArray<HTMLElement>("[data-shape]").forEach((shape, i) => {
        gsap.to(shape, {
          x: gsap.utils.random(-18, 18),
          y: gsap.utils.random(-14, 14),
          rotate: gsap.utils.random(-2, 2),
          duration: gsap.utils.random(18, 26) + i * 4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      const drift = gsap.quickTo(el, "yPercent", {
        duration: 0.9,
        ease: "power2.out",
      });
      const onScroll = () => drift(Math.min(window.scrollY * 0.04, 40));

      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }, el);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-paper"
    >
      {/* Large flat colour fields, like uninked stock. */}
      <div
        data-shape
        className="absolute -top-40 -left-32 h-[34rem] w-[34rem] rounded-full bg-ochre/25"
      />
      <div
        data-shape
        className="absolute top-[38%] -right-40 h-[30rem] w-[30rem] rounded-full bg-rust-bright/12"
      />
      <div
        data-shape
        className="absolute bottom-[-14rem] left-[26%] h-[26rem] w-[26rem] rotate-12 bg-olive/10"
      />

      {/* Halftone band — cheap print tone separation. */}
      <div
        className="bg-halftone absolute inset-x-0 top-[52%] h-64 opacity-[0.07]"
      />

      <div className="bg-fibre absolute inset-0 opacity-[0.06] mix-blend-multiply" />
    </div>
  );
}
