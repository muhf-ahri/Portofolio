"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { cx } from "@/lib/cx";

type Falloff = "linear" | "smooth" | "sharp";

type LineSidebarProps = {
  items: string[];
  accentColor?: string;
  textColor?: string;
  markerColor?: string;
  showIndex?: boolean;
  showMarker?: boolean;
  proximityRadius?: number;
  maxShift?: number;
  falloff?: Falloff;
  markerLength?: number;
  markerGap?: number;
  tickScale?: number;
  scaleTick?: boolean;
  itemGap?: number;
  fontSize?: number;
  smoothing?: number;
  /** Controlled selection, driven by the parent. Omit for internal state. */
  position?: number;
  onItemClick?: (index: number, label: string) => void;
  className?: string;
};

const FALLOFF_CURVES: Record<Falloff, (p: number) => number> = {
  linear: (p) => p,
  smooth: (p) => p * p * (3 - 2 * p),
  sharp: (p) => p * p * p,
};

/**
 * Vertical line-marker list adapted from React Bits. Each row carries a rule
 * that lengthens and shifts toward the accent colour as the cursor nears it.
 *
 * Two adaptations over the source: the rAF callback is held in a ref because
 * it re-requests itself and the compiler rule rejects a self-referential
 * `useCallback`, and `activeRef` is written in an effect instead of during
 * render. `position` makes the selection controlled, which is how Skills
 * drives it from scroll position.
 */
export default function LineSidebar({
  items,
  accentColor,
  textColor,
  markerColor,
  showIndex = true,
  showMarker = true,
  proximityRadius = 100,
  maxShift = 30,
  falloff = "smooth",
  markerLength = 60,
  markerGap = 0,
  tickScale = 0.5,
  scaleTick = true,
  itemGap = 20,
  fontSize = 1.1,
  smoothing = 100,
  position,
  onItemClick,
  className = "",
}: LineSidebarProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const targetsRef = useRef<number[]>([]);
  const currentRef = useRef<number[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef(0);
  const activeRef = useRef<number | null>(null);
  const smoothingRef = useRef(smoothing);
  const falloffRef = useRef(falloff);
  const radiusRef = useRef(proximityRadius);
  const onItemClickRef = useRef(onItemClick);
  const [internalActive, setInternalActive] = useState<number | null>(null);

  const controlled = position !== undefined;
  const activeIndex = controlled ? position : internalActive;

  // One rAF loop eases every item's --effect toward its target with
  // frame-rate independent exponential smoothing, so colour, shift and marker
  // length all move together.
  const runFrameRef = useRef<(now: number) => void>(() => {});

  useEffect(() => {
    runFrameRef.current = (now: number) => {
      const dt = Math.min((now - lastRef.current) / 1000, 0.05);
      lastRef.current = now;
      const tau = Math.max(smoothingRef.current, 1) / 1000;
      const k = 1 - Math.exp(-dt / tau);

      let moving = false;
      const els = itemRefs.current;
      for (let i = 0; i < els.length; i++) {
        const el = els[i];
        if (!el) continue;
        const target = Math.max(targetsRef.current[i] || 0, activeRef.current === i ? 1 : 0);
        const cur = currentRef.current[i] || 0;
        const next = cur + (target - cur) * k;
        const settled = Math.abs(target - next) < 0.0015;
        const value = settled ? target : next;
        currentRef.current[i] = value;
        el.style.setProperty("--effect", value.toFixed(4));
        if (!settled) moving = true;
      }

      rafRef.current = moving ? requestAnimationFrame(runFrameRef.current) : null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startLoop = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(runFrameRef.current);
  }, []);

  // Publish the latest values the loop and handlers read, without touching a
  // ref during render.
  useEffect(() => {
    activeRef.current = activeIndex;
    smoothingRef.current = smoothing;
    falloffRef.current = falloff;
    radiusRef.current = proximityRadius;
    onItemClickRef.current = onItemClick;
    startLoop();
  }, [activeIndex, smoothing, falloff, proximityRadius, onItemClick, startLoop]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLUListElement>) => {
    const list = listRef.current;
    if (!list) return;
    const rect = list.getBoundingClientRect();
    const pointerY = e.clientY - rect.top;
    const ease = FALLOFF_CURVES[falloffRef.current] ?? FALLOFF_CURVES.linear;
    const radius = radiusRef.current;
    const els = itemRefs.current;
    for (let i = 0; i < els.length; i++) {
      const el = els[i];
      if (!el) continue;
      const center = el.offsetTop + el.offsetHeight / 2;
      const distance = Math.abs(pointerY - center);
      targetsRef.current[i] = ease(Math.max(0, 1 - distance / radius));
    }
    startLoop();
  }, [startLoop]);

  const handlePointerLeave = useCallback(() => {
    targetsRef.current = targetsRef.current.map(() => 0);
    startLoop();
  }, [startLoop]);

  const handleClick = useCallback(
    (index: number, label: string) => {
      // Controlled: the parent decides what "selected" means, so we only
      // report the click.
      if (!controlled) setInternalActive(index);
      onItemClickRef.current?.(index, label);
    },
    [controlled],
  );

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    },
    [],
  );

  return (
    <nav
      className={cx("line-sidebar", className)}
      style={
        {
          ...(accentColor ? { "--ls-accent": accentColor } : {}),
          ...(textColor ? { "--ls-text": textColor } : {}),
          ...(markerColor ? { "--ls-marker": markerColor } : {}),
          "--ls-marker-length": `${markerLength}px`,
          "--ls-marker-gap": `${markerGap}px`,
          "--ls-tick-scale": scaleTick ? tickScale : 0,
          "--ls-max-shift": `${maxShift}px`,
          "--ls-item-gap": `${itemGap}px`,
          "--ls-font-size": `${fontSize}rem`,
        } as CSSProperties
      }
    >
      <ul
        ref={listRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="line-sidebar__list"
      >
        {items.map((label, index) => (
          <li
            key={`${label}-${index}`}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            aria-current={activeIndex === index ? "true" : undefined}
            onClick={() => handleClick(index, label)}
            className="line-sidebar__item"
          >
            {showMarker && <span aria-hidden="true" className="line-sidebar__marker" />}
            <span className="line-sidebar__label">
              {showIndex && (
                <span className="line-sidebar__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
              )}
              <span>{label}</span>
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
}