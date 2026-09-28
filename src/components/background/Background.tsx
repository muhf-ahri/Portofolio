"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { BLEED, MAX_TRAVEL, drift, onScrollFrame } from "@/lib/scroll";

/**
 * Flat print textures, one continuous field with no visible edge.
 *
 * Two independent motions, split across nested elements so they never fight
 * over the same transform property:
 *   [data-drift]    inner -> ambient loop, driven by GSAP
 *   [data-parallax] outer -> scroll-linked drift, written in a rAF loop
 *
 * The scroll layer deliberately avoids GSAP ScrollTrigger: a passive listener
 * is enough here, it works under the body's `overflow-x: clip`, and there is
 * no plugin to register, refresh, or keep in sync with resize.
 *
 * Every edge lives inside the bleed layer (see BLEED in lib/scroll.ts), and
 * drift() caps travel below that margin, so the field can never tear open.
 */
export function Background() {
  const reduce = usePrefersReducedMotion();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce || !root.current) return;
    const el = root.current;

    /* --- Ambient loop on the inner elements (GSAP) ------------------ */
    const tws = Array.from(el.querySelectorAll<HTMLElement>("[data-drift]")).map(
      (node, i) =>
        gsap.to(node, {
          x: gsap.utils.random(-20, 20),
          y: gsap.utils.random(-16, 16),
          rotate: gsap.utils.random(-2.5, 2.5),
          duration: gsap.utils.random(16, 24) + i * 4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        }),
    );

    /* --- Scroll-linked drift on the outer elements ------------------- */
    const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-parallax]"));
    const bands = Array.from(el.querySelectorAll<HTMLElement>("[data-scroll-x]"));

    const paint = (y: number) => {
      const max = MAX_TRAVEL * window.innerHeight;

      for (const layer of layers) {
        const rate = Number(layer.dataset.parallax ?? 0);
        layer.style.transform = `translate3d(0, ${drift(y, rate, max).toFixed(2)}px, 0)`;
      }

      for (const band of bands) {
        const rate = Number(band.dataset.scrollX ?? 0);
        // Percent of the band's own width, so the halftone tiles stay seamless.
        band.style.transform = `translate3d(${(y * rate).toFixed(3)}%, 0, 0)`;
      }
    };

    // Paint once on mount, so the field is correct before the first scroll.
    paint(window.scrollY);

    // Re-cap on resize: max travel is a fraction of the viewport.
    const onResize = () => paint(window.scrollY);
    const stop = onScrollFrame(paint);
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      for (const tween of tws) tween.kill();
    };
  }, [reduce]);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-paper"
    >
      {/* Oversized bleed layer: every edge here sits outside the screen. */}
      <div
        className="absolute"
        style={{ inset: `${-BLEED.y * 100}% ${-BLEED.x * 100}%` }}
      >
        <div data-parallax="0.16" className="absolute top-[2%] -left-[6%]">
          <div
            data-drift
            className="h-[46rem] w-[46rem] rounded-full bg-ochre/25"
          />
        </div>

        <div data-parallax="-0.11" className="absolute top-[34%] -right-[8%]">
          <div
            data-drift
            className="h-[40rem] w-[40rem] rounded-full bg-rust-bright/12"
          />
        </div>

        <div data-parallax="0.07" className="absolute bottom-[-4%] left-[22%]">
          <div
            data-drift
            className="h-[34rem] w-[34rem] rotate-12 bg-olive/10"
          />
        </div>

        <div data-parallax="-0.05" className="absolute top-[62%] left-[-4%]">
          <div
            data-drift
            className="h-[26rem] w-[26rem] rounded-full bg-teal/10"
          />
        </div>

        {/* Halftone slides sideways. Bands are wider than the bleed layer on
            the x axis so a shift never reveals an edge; the mask only fades
            top and bottom. */}
        <div
          data-scroll-x="0.02"
          className="bg-halftone bg-halftone-soft absolute inset-x-[-15%] top-[44%] h-[34rem] opacity-[0.08]"
        />
        <div
          data-scroll-x="-0.015"
          className="bg-halftone bg-halftone-soft absolute inset-x-[-15%] top-[72%] h-[30rem] opacity-[0.05]"
        />

        {/* Fibre spans the whole bleed layer, so it never ends mid-screen. */}
        <div className="bg-fibre absolute inset-0 opacity-[0.06] mix-blend-multiply" />
      </div>
    </div>
  );
}
