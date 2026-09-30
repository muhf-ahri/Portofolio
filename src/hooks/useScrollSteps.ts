"use client";

import { useEffect, useRef, useState } from "react";

import { clamp } from "@/lib/scroll";

/**
 * Maps a section's scroll progress onto discrete steps.
 *
 * The section itself is a tall track with a sticky child, so the page keeps
 * scrolling while the content holds still — the "slow down and step through
 * it" behaviour, with no `preventDefault` and no scroll trap. `steps` is the
 * number of discrete positions across the track.
 *
 * Returns the current step index, clamped to `0 .. steps - 1`.
 */
export function useScrollSteps(
  trackRef: React.RefObject<HTMLElement | null>,
  steps: number,
  enabled = true,
): number {
  const [step, setStep] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || !enabled || steps <= 1) return;

    const measure = () => {
      ticking.current = false;
      const rect = el.getBoundingClientRect();
      // How far the track has travelled through the viewport. The sticky child
      // is pinned for exactly this span, so it is the length that matters.
      const travel = el.offsetHeight - window.innerHeight;
      if (travel <= 0) {
        setStep(0);
        return;
      }
      const progress = clamp(-rect.top / travel, 0, 1);
      setStep(Math.round(progress * (steps - 1)));
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(measure);
    };

    // Re-measure on resize: travel is derived from viewport height.
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    measure();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [trackRef, steps, enabled]);

  return step;
}