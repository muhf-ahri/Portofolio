import type { Transition, Variants } from "framer-motion";

export const EASE = [0.16, 1, 0.3, 1] as const;

/** Shared so the whole page moves with one timing language. */
export const transition: Transition = { duration: 0.7, ease: EASE };
export const fastTransition: Transition = { duration: 0.4, ease: EASE };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition },
};

/** Opacity only — for elements that should not travel (buttons, keycaps). */
export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: fastTransition },
};

export const staggerParent = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

/** Reserved space for sticky UI when deciding what counts as "in view". */
export const viewportReveal = { once: false, margin: "0px 0px -10% 0px" } as const;
