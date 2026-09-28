import assert from "node:assert/strict";

import {
  BLEED,
  MAX_TRAVEL,
  PARALLAX_RATES,
  clamp,
  drift,
  progress,
} from "../src/lib/scroll";

/* The background field depends on these helpers. The constant that matters:
   a layer may never travel further than the bleed margin, or the field tears
   open and the background looks cut off again. */

assert.equal(clamp(150, 0, 60), 60, "overshoot must be capped");
assert.equal(clamp(-20, 0, 60), 0, "undershoot must be capped too");
assert.equal(clamp(30, 0, 60), 30, "in-range values pass through");

assert.equal(progress(0, 0, 1000), 0);
assert.equal(progress(1000, 0, 1000), 1);
assert.equal(progress(500, 0, 1000), 0.5);
assert.equal(progress(-100, 0, 1000), 0, "before range clamps to 0");
assert.equal(progress(9999, 0, 1000), 1, "after range clamps to 1");
assert.equal(progress(500, 800, 800), 0, "degenerate range returns 0, not NaN");

/* --- The invariant: travel < bleed margin, on both axes --------------- */
assert.ok(
  MAX_TRAVEL < BLEED.y,
  `MAX_TRAVEL ${MAX_TRAVEL} must stay below the vertical bleed ${BLEED.y}`,
  );
assert.ok(BLEED.x > 0 && BLEED.y > BLEED.x, "vertical needs more room than x");

const VIEWPORT = 800;
const MAX = MAX_TRAVEL * VIEWPORT;

/* 20_000px is far beyond any real page for this site. */
for (const rate of PARALLAX_RATES) {
  const travel = drift(20_000, rate, MAX);
  assert.equal(
    Math.abs(travel),
    MAX,
    `rate ${rate} must saturate at the cap, not exceed it`,
  );
  assert.ok(
    Math.abs(travel) / VIEWPORT < BLEED.y,
    `rate ${rate} travels outside the bleed margin`,
  );
}

/* --- And the motion must actually be visible early on ---------------- */
assert.equal(drift(0, 0.16, MAX), 0, "no drift at scroll 0");
assert.equal(drift(500, 0.16, MAX), 80, "rate 0.16 moves 80px at scroll 500");
assert.equal(drift(500, -0.11, MAX), -55, "negative rate moves upward");
assert.equal(drift(500, 0.07, MAX), 35, "rate 0.07 moves 35px at scroll 500");

/* Layers must stay distinguishable, or the field reads as one solid block. */
const offsets = PARALLAX_RATES.map((rate) => drift(1000, rate, MAX));
assert.equal(
  new Set(offsets).size,
  PARALLAX_RATES.length,
  "all layers must sit at different offsets",
);

/* Signs must alternate, so adjacent layers travel opposite ways. */
assert.ok(
  PARALLAX_RATES.some((r) => r > 0) && PARALLAX_RATES.some((r) => r < 0),
  "rates must include both directions",
);

console.log("scroll helpers: all assertions passed");
