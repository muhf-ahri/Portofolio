"use client";

import { useSyncExternalStore } from "react";

/**
 * Hydration-safe `prefers-reduced-motion`.
 *
 * Why not framer-motion's `useReducedMotion`:
 *   motion-dom keeps a module-level singleton that reads `null` on the server
 *   and never updates there, then reads the real media-query value on the
 *   client's first render. Anything derived from it during render is a
 *   server/client mismatch waiting to happen.
 *
 * Why not useState + useEffect:
 *   setting state synchronously inside an effect triggers a cascading second
 *   render, which React's compiler rules rightly reject.
 *
 * `useSyncExternalStore` is built for exactly this — subscribing to an
 * external store — and its third argument pins the hydration render to the
 * server value, so the first paint is always identical on both sides.
 */

const QUERY = "(prefers-reduced-motion)";

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};

  const list = window.matchMedia(QUERY);
  list.addEventListener("change", onStoreChange);
  return () => list.removeEventListener("change", onStoreChange);
}

function getSnapshot() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

/** Server and hydration render. `false` means "animate", matching the
 *  no-JS baseline, so the markup never differs. */
function getServerSnapshot() {
  return false;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
