"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cx } from "@/lib/cx";

type Side = "left" | "right";

type OptionWheelProps = {
  items: string[];
  defaultSelected?: number;
  onChange?: (index: number, item: string) => void;
  /** Controlled mode: 0-based option index. Omit for self-driven input. */
  position?: number;
  textColor?: string;
  activeColor?: string;
  side?: Side;
  fontSize?: number;
  spacing?: number;
  curve?: number;
  tilt?: number;
  blur?: number;
  fade?: number;
  minOpacity?: number;
  smoothing?: number;
  inset?: number;
  loop?: boolean;
  draggable?: boolean;
  className?: string;
};

type WheelConfig = {
  count: number;
  items: string[];
  rowH: number;
  curve: number;
  tilt: number;
  blur: number;
  fade: number;
  minOpacity: number;
  side: Side;
  loop: boolean;
  smoothing: number;
  draggable: boolean;
};

/**
 * Curved selection wheel adapted from React Bits. Options arc around the
 * anchored edge; the one nearest the middle turns active.
 *
 * Two input modes, never both at once:
 *   - controlled: the parent passes `position` and drives the wheel from a
 *     scroll track. This is what Skills.tsx does — the page's own scroll
 *     position maps onto the options, so the section slows the scroll down
 *     and the wheel advances with it. No `preventDefault`, no trap.
 *   - uncontrolled: wheel / drag / arrow keys move it directly.
 *
 * Refs the rAF reads are kept behind a `cfg` ref updated in an effect, so
 * nothing touches a ref during render (the repo's React-compiler lint is
 * strict about that).
 */
export default function OptionWheel({
  items,
  defaultSelected = 3,
  onChange,
  position,
  textColor = "#a6a6a6",
  activeColor = "#ffffff",
  side = "left",
  fontSize = 3,
  spacing = 1.4,
  curve = 1,
  tilt = 6,
  blur = 2,
  fade = 0.25,
  minOpacity = 0.05,
  smoothing = 200,
  inset = 80,
  loop = false,
  draggable = true,
  className = "",
}: OptionWheelProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const posRef = useRef(defaultSelected);
  const targetRef = useRef(defaultSelected);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef(0);
  const cfgRef = useRef<WheelConfig | null>(null);
  const onChangeRef = useRef(onChange);
  const selectedRef = useRef(defaultSelected);
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelAccum = useRef(0);
  const dragRef = useRef<{ y: number; start: number; id: number } | null>(null);
  const dragMovedRef = useRef(false);
  const [selectedIndex, setSelectedIndex] = useState(defaultSelected);
  const [isDragging, setIsDragging] = useState(false);
  // Controlled mode: the parent owns the position, so self-driven wheel and
  // drag input must stand down.
  const controlled = position !== undefined;

  const config: WheelConfig = useMemo(() => {
    const remPx =
      typeof window !== "undefined"
        ? parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
        : 16;
    return {
      count: items.length,
      items,
      rowH: Math.max(fontSize * spacing * remPx, 1),
      curve,
      tilt,
      blur,
      fade,
      minOpacity,
      side,
      loop,
      smoothing,
      draggable,
    };
  }, [items, fontSize, spacing, curve, tilt, blur, fade, minOpacity, side, loop, smoothing, draggable]);

  // Keep the rAF loop on the latest values without mutating a ref in render.
  useEffect(() => {
    cfgRef.current = config;
    onChangeRef.current = onChange;
  }, [config, onChange]);

  // `runFrame` requests the next frame from inside itself, so it lives behind
  // a ref instead of a self-referential useCallback (the compiler rule balks
  // at that).
  const runFrameRef = useRef<(now: number) => void>(() => {});

  useEffect(() => {
    runFrameRef.current = (now: number) => {
      const dt = Math.min((now - lastRef.current) / 1000, 0.05);
      lastRef.current = now;
      const cfg = cfgRef.current;
      if (!cfg) return;
      const tau = Math.max(cfg.smoothing, 1) / 1000;
      const k = 1 - Math.exp(-dt / tau);

      const target = targetRef.current;
      const cur = posRef.current;
      let next = cur + (target - cur) * k;
      const settled = Math.abs(target - next) < 0.001;
      if (settled) next = target;
      posRef.current = next;

      const els = itemRefs.current;
      const n = cfg.count;
      const mirror = cfg.side === "right" ? -1 : 1;
      const tiltRad = (cfg.tilt * Math.PI) / 180;
      const R = tiltRad > 0.0005 ? cfg.rowH / tiltRad : 0;
      for (let i = 0; i < n; i++) {
        const el = els[i];
        if (!el) continue;
        let d = i - next;
        if (cfg.loop && n > 1) {
          d = ((d % n) + n) % n;
          if (d > n / 2) d -= n;
        }
        const dist = Math.abs(d);
        let x = 0;
        let y = d * cfg.rowH;
        let rot = 0;
        if (R > 0) {
          const ang = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, d * tiltRad));
          y = R * Math.sin(ang);
          x = -mirror * R * (1 - Math.cos(ang)) * cfg.curve;
          rot = (mirror * ang * 180) / Math.PI;
        }
        el.style.transform = `translate(${x.toFixed(2)}px, calc(${y.toFixed(2)}px - 50%)) rotate(${rot.toFixed(3)}deg)`;
        el.style.opacity = String(Math.max(cfg.minOpacity, 1 - dist * cfg.fade));
        el.style.filter = cfg.blur > 0 ? `blur(${(dist * cfg.blur).toFixed(2)}px)` : "none";
        el.style.setProperty("--ow-p", Math.max(0, 1 - Math.min(dist, 1)).toFixed(4));
      }

      rafRef.current = settled ? null : requestAnimationFrame(runFrameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startLoop = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(runFrameRef.current);
  }, []);

  const applyTarget = useCallback(
    (value: number, snap: boolean) => {
      const cfg = cfgRef.current;
      if (!cfg) return;
      let v = value;
      if (!cfg.loop) v = Math.min(Math.max(v, 0), Math.max(cfg.count - 1, 0));
      if (snap) v = Math.round(v);
      targetRef.current = v;
      const idx = ((Math.round(v) % cfg.count) + cfg.count) % cfg.count;
      if (idx !== selectedRef.current) {
        selectedRef.current = idx;
        setSelectedIndex(idx);
        onChangeRef.current?.(idx, cfg.items[idx]);
      }
      startLoop();
    },
    [startLoop],
  );

  // Controlled mode: the parent owns the position, so mirror it straight into
  // the animation target. The rAF still eases toward it, which is what makes
  // a scroll-linked wheel feel damped rather than stepped.
  useEffect(() => {
    if (!controlled || position === undefined) return;
    applyTarget(position, false);
  }, [controlled, position, applyTarget]);

  // Uncontrolled mode: wheel over the box nudges the selection, one option per
  // full row height of travel so a clicky wheel and a smooth trackpad agree.
  useEffect(() => {
    if (controlled) return;
    const el = rootRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const cfg = cfgRef.current;
      if (!cfg) return;
      const delta = e.deltaMode === 1 ? e.deltaY * 24 : e.deltaY;
      if (delta === 0) return;

      wheelAccum.current += delta;
      if (Math.abs(wheelAccum.current) < cfg.rowH) return;

      const dir = wheelAccum.current > 0 ? 1 : -1;
      wheelAccum.current = 0;
      applyTarget(Math.round(targetRef.current) + dir, false);

      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(() => applyTarget(targetRef.current, true), 200);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    };
  }, [controlled, applyTarget]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (controlled) return;
      if (!cfgRef.current?.draggable) return;
      dragRef.current = { y: e.clientY, start: targetRef.current, id: e.pointerId };
      dragMovedRef.current = false;
      setIsDragging(true);
    },
    [controlled],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dy = e.clientY - drag.y;
      if (!dragMovedRef.current && Math.abs(dy) > 4) {
        dragMovedRef.current = true;
        rootRef.current?.setPointerCapture(drag.id);
      }
      if (dragMovedRef.current) {
        const rowH = cfgRef.current?.rowH ?? 1;
        applyTarget(drag.start - dy / rowH, false);
      }
    },
    [applyTarget],
  );

  const handlePointerEnd = useCallback(() => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setIsDragging(false);
    if (dragMovedRef.current) applyTarget(targetRef.current, true);
  }, [applyTarget]);

  const handleItemClick = useCallback(
    (index: number) => {
      if (dragMovedRef.current) return;
      const cfg = cfgRef.current;
      if (!cfg) return;
      const cur = targetRef.current;
      let d = index - (((cur % cfg.count) + cfg.count) % cfg.count);
      if (cfg.loop && cfg.count > 1) {
        if (d > cfg.count / 2) d -= cfg.count;
        else if (d < -cfg.count / 2) d += cfg.count;
      }
      applyTarget(cur + d, true);
    },
    [applyTarget],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      let delta: number | null = null;
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") delta = -1;
      else if (e.key === "ArrowDown" || e.key === "ArrowRight") delta = 1;
      if (delta == null) return;
      e.preventDefault();
      applyTarget(Math.round(targetRef.current) + delta, true);
    },
    [applyTarget],
  );

  useEffect(() => {
    applyTarget(targetRef.current, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, fontSize, spacing, curve, tilt, blur, fade, minOpacity, side, loop, smoothing, applyTarget]);

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    },
    [],
  );

  return (
    <div
      ref={rootRef}
      role="listbox"
      tabIndex={0}
      aria-label="Roda opsi"
      className={cx(
        "option-wheel relative h-full w-full overflow-hidden outline-none select-none",
        side === "right" && "option-wheel--right",
        isDragging && "option-wheel--dragging",
        className,
      )}
      style={
        {
          "--ow-text-color": textColor,
          "--ow-active-color": activeColor,
          "--ow-font-size": `${fontSize}rem`,
          "--ow-inset": `${inset}px`,
          cursor: draggable ? "grab" : "default",
          // pan-y, not none: a vertical swipe on the wheel must still scroll
          // the page on touch. Horizontal is ours for the drag gesture.
          touchAction: "pan-y",
        } as React.CSSProperties
      }
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onKeyDown={handleKeyDown}
    >
      {items.map((label, index) => (
        <div
          key={`${label}-${index}`}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          role="option"
          aria-selected={selectedIndex === index}
          className={cx(
            "option-wheel__item absolute top-1/2 origin-left cursor-pointer whitespace-nowrap",
            selectedIndex === index && "option-wheel__item--selected",
          )}
          onClick={() => handleItemClick(index)}
        >
          {label}
        </div>
      ))}
    </div>
  );
}