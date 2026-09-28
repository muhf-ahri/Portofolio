/**
 * Scroll helpers for the background field. No GSAP plugin, no dependencies —
 * a plain passive listener is enough and is far easier to reason about.
 */

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * Maps `value` into 0..1 across the [from, to] range, clamped.
 */
export function progress(value: number, from: number, to: number) {
  if (from === to) return 0;
  return clamp((value - from) / (to - from), 0, 1);
}

/**
 * Scroll-linked travel for one background layer, bounded by the bleed margin.
 *
 * `rate` is pixels moved per scrolled pixel. Without a cap, a tall page drives
 * a shape far outside the bleed layer and the field tears open again — the
 * exact bug this function exists to prevent. `maxTravel` is a fraction of the
 * viewport, and must stay below the layer's bleed margin.
 */
export function drift(
  scrollY: number,
  rate: number,
  maxTravel: number,
): number {
  return clamp(scrollY * rate, -maxTravel, maxTravel);
}

/**
 * The background bleed layer, as a fraction of the viewport, per axis.
 * Vertical needs far more room than horizontal because the scroll drift is
 * vertical. Both the component and tests/scroll.test.ts read these, so the
 * invariant "MAX_TRAVEL < BLEED" cannot silently drift apart.
 */
export const BLEED = { x: 0.12, y: 0.35 } as const;

/** Hard ceiling on scroll drift, as a fraction of viewport height. */
export const MAX_TRAVEL = 0.3;

/** Per-layer speed in px per scrolled px. Signs alternate so the field
 *  never travels as one rigid block. */
export const PARALLAX_RATES = [0.16, -0.11, 0.07, -0.05] as const;

/**
 * Calls `fn(scrollY)` at most once per frame. Multiple scroll events inside a
 * single frame collapse into one read, so we never write layout twice.
 * Returns the cleanup function.
 */
export function onScrollFrame(fn: (y: number) => void): () => void {
  let ticking = false;

  const handle = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      fn(window.scrollY);
    });
  };

  window.addEventListener("scroll", handle, { passive: true });
  return () => window.removeEventListener("scroll", handle);
}
