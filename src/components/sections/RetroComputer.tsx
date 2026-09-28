"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { useRef } from "react";

/**
 * Beige all-in-one retro computer (monitor + wedge keyboard base),
 * built from CSS 3D transforms. No WebGL.
 *
 * Coordinates: origin = top-left of the monitor's front plane, +Z towards the
 * viewer, everything else extends towards -Z.
 *
 *   monitor   W x H x D        boxy housing: recessed screen + side control panel
 *   base      W x HB           rear block under the monitor, plus a wedge that
 *                              juts forward with the keyboard on its slope
 *
 * Only the right side is drawn: the resting view is turned left, so the left
 * side is never visible. Add a left face if you ever rotate past 0deg.
 */

const W = 352; // width of monitor and base (same as the w-[22rem] wrapper)
const H = 250; // monitor height
const D = 130; // monitor / base depth behind the front plane

const DF = 80; // how far the base juts forward of the monitor
const DROP = 52; // vertical drop of the keyboard slope over DF
const LIP = 26; // vertical front lip under the keyboard
const HB = DROP + LIP; // base height
const SLOPE_L = Math.hypot(DF, DROP); // length of the slanted keyboard deck
const SLOPE_DEG = (Math.atan2(DF, DROP) * 180) / Math.PI;

const TOTAL_H = H + HB;
const PIVOT_Z = -(D - DF) / 2; // middle of the whole depth (+DF ... -D)

const STACK = [
  ["frameworks", "Laravel · React · Next.js"],
  ["languages", "TypeScript · JavaScript · PHP"],
  ["database", "PostgreSQL · MySQL"],
  ["tooling", "Git · Postman · Figma"],
] as const;

// Negative X = camera above the object (top face visible).
// Negative Y = front turned left (right side face visible).
const REST_X = -9;
const REST_Y = -18;
const TILT = { x: 8, y: 12 };

const SHELL = "var(--color-crt-shell)";
const SHELL_DARK = "var(--color-crt-shell-dark)";
const INK = "var(--color-ink)";

const shade = (a: number) => `linear-gradient(rgba(0,0,0,${a}), rgba(0,0,0,${a}))`;

const edge: CSSProperties = {
  position: "absolute",
  border: `2px solid ${INK}`,
  boxSizing: "border-box",
};

/** Slits on the monitor's right side, like a real cooling grille. */
const SIDE_VENTS: CSSProperties = {
  backgroundImage: `repeating-linear-gradient(180deg, rgba(0,0,0,0.3) 0 2px, transparent 2px 6px), ${shade(0.14)}`,
  backgroundSize: "62% 48px, 100% 100%",
  backgroundPosition: "50% 26px, 0 0",
  backgroundRepeat: "no-repeat",
};

type BoxProps = {
  w: number;
  h: number;
  d: number;
  y?: number;
  top?: boolean;
  rightStyle?: CSSProperties;
  children?: ReactNode;
};

/** Box with right + top faces swept backwards from the front plane. */
function Box({ w, h, d, y = 0, top = true, rightStyle, children }: BoxProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: y,
        width: w,
        height: h,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          ...edge,
          top: 0,
          right: 0,
          width: d,
          height: h,
          backgroundColor: SHELL_DARK,
          backgroundImage: shade(0.14),
          transformOrigin: "right center",
          transform: "rotateY(-90deg)",
          ...rightStyle,
        }}
      />
      {top && (
        <div
          aria-hidden="true"
          style={{
            ...edge,
            top: 0,
            left: 0,
            width: w,
            height: d,
            backgroundColor: SHELL,
            backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.28), transparent 60%)",
            transformOrigin: "center top",
            transform: "rotateX(-90deg)",
          }}
        />
      )}
      {children}
    </div>
  );
}

const KEY_ROWS = [12, 12, 11, 10] as const;
const key =
  "h-[13px] flex-1 rounded-[2px] border border-ink/55 bg-crt-shell shadow-[0_2px_0_var(--color-crt-shell-dark)]";

function Keyboard() {
  return (
    <div className="absolute inset-x-4 top-2.5 flex flex-col gap-[4px]">
      {KEY_ROWS.map((count, row) => (
        <div key={row} className="flex gap-[3px]" style={{ paddingLeft: row * 5, paddingRight: row * 3 }}>
          {Array.from({ length: count }, (_, i) => (
            <span key={i} className={key} />
          ))}
        </div>
      ))}
      <div className="flex gap-[3px] px-6">
        <span className={`${key} flex-[1.5]`} />
        <span className={`${key} flex-[7]`} />
        <span className={`${key} flex-[1.5]`} />
      </div>
    </div>
  );
}

function ControlPanel() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col items-center gap-2.5 rounded-[5px] border-2 border-ink bg-crt-shell px-1.5 py-3 shadow-[inset_0_0_0_2px_rgba(255,255,255,0.35),inset_0_-3px_5px_rgba(0,0,0,0.12)]"
    >
      <span className="size-7 rounded-full border-2 border-ink bg-crt-shell-dark bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.55),transparent_55%)]" />
      <span className="h-2.5 w-9 rounded-[2px] border-2 border-ink bg-crt-shell-dark" />
      <span className="h-2.5 w-9 rounded-[2px] border-2 border-ink bg-crt-shell-dark" />
      <span className="my-1 h-px w-full bg-ink/30" />
      <span className="h-11 w-8 rounded-[3px] border-2 border-ink bg-crt-shell-dark bg-[repeating-linear-gradient(90deg,rgba(0,0,0,0.35)_0_1.5px,transparent_1.5px_4px)]" />
      <span className="mt-auto h-3 w-9 rounded-[2px] border-2 border-ink bg-crt-shell-dark shadow-[inset_0_2px_3px_rgba(0,0,0,0.4)]" />
    </div>
  );
}

export function RetroComputer() {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);

  const rotateX = useSpring(useMotionValue(REST_X), { stiffness: 130, damping: 18, mass: 0.5 });
  const rotateY = useSpring(useMotionValue(REST_Y), { stiffness: 130, damping: 18, mass: 0.5 });

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduce || event.pointerType !== "mouse" || !wrap.current) return;
    const rect = wrap.current.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(REST_X - ny * TILT.x);
    rotateY.set(REST_Y + nx * TILT.y);
  }

  function onPointerLeave() {
    rotateX.set(REST_X);
    rotateY.set(REST_Y);
  }

  return (
    <motion.div
      ref={wrap}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      className="w-[22rem] max-w-full [perspective:1600px]"
    >
      <motion.div
        style={{
          width: W,
          height: TOTAL_H,
          transformStyle: "preserve-3d",
          transformOrigin: `50% 50% ${PIVOT_Z}px`,
          ...(reduce ? { rotateX: REST_X, rotateY: REST_Y } : { rotateX, rotateY }),
        }}
        className="relative mx-auto"
      >
        {/* ============ Base: rear block under the monitor ============ */}
        <Box w={W} h={HB} d={D} y={H} top={false} />

        {/* ============ Base: forward wedge (right side, sloped profile) ============ */}
        <div
          aria-hidden="true"
          style={{
            ...edge,
            left: W,
            top: H,
            width: DF,
            height: HB,
            backgroundColor: SHELL_DARK,
            backgroundImage: shade(0.14),
            transformOrigin: "left center",
            transform: "rotateY(-90deg)",
            clipPath: `polygon(0 0, 100% ${(DROP / HB) * 100}%, 100% 100%, 0 100%)`,
          }}
        />

        {/* Keyboard deck: slanted plane from the monitor's bottom edge down to the lip. */}
        <div
          style={{
            ...edge,
            left: 0,
            top: H,
            width: W,
            height: SLOPE_L,
            backgroundColor: SHELL,
            backgroundImage:
              "linear-gradient(180deg, rgba(0,0,0,0.10), rgba(255,255,255,0.12))",
            transformOrigin: "top center",
            transform: `rotateX(${SLOPE_DEG}deg)`,
          }}
        >
          <Keyboard />
        </div>

        {/* Front lip: brand plate + power LED. */}
        <div
          className="flex items-center justify-between rounded-b-[4px] px-4"
          style={{
            ...edge,
            left: 0,
            top: H + DROP,
            width: W,
            height: LIP,
            backgroundColor: SHELL,
            backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.22), rgba(0,0,0,0.06))",
            transform: `translateZ(${DF}px)`,
          }}
        >
          <span className="font-mono text-[0.55rem] tracking-[0.18em] text-ink/70 uppercase">
            Fahri&nbsp;S/E
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[0.5rem] text-ink/70">
            <span className="size-1.5 rounded-full bg-olive" />
            PWR
          </span>
        </div>

        {/* ============ Monitor housing ============ */}
        <Box w={W} h={H} d={D} rightStyle={SIDE_VENTS}>
          <div
            className="absolute inset-0 grid grid-cols-[1fr_62px] gap-2 rounded-t-[5px] border-2 border-ink bg-crt-shell p-3"
            style={{
              transform: "translateZ(0.5px)",
              backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.35), transparent 45%)",
            }}
          >
            {/* Recessed bezel + glass */}
            <div className="rounded-[10px] border-2 border-ink bg-crt-bezel p-3 shadow-[inset_0_3px_7px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.5)]">
              <div
                className="crt-screen relative h-full overflow-hidden rounded-[16px]"
                style={{ boxShadow: "inset 0 0 26px rgba(0,0,0,0.7)" }}
              >
                <div className="absolute inset-0 flex flex-col p-3.5 font-mono text-[0.58rem] leading-snug">
                  <p className="crt-glow text-crt-phosphor-dim">guest@fahri:~$ ./stack.sh</p>

                  <dl className="mt-2 space-y-1.5">
                    {STACK.map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-crt-phosphor-dim">{label}</dt>
                        <dd className="crt-glow pl-2 text-crt-phosphor">{value}</dd>
                      </div>
                    ))}
                  </dl>

                  <p className="crt-glow mt-auto flex items-center text-crt-phosphor">
                    ready
                    <span
                      aria-hidden="true"
                      className="ml-1 inline-block h-3 w-1.5 animate-pulse bg-crt-phosphor"
                    />
                  </p>
                </div>

                <div aria-hidden="true" className="crt-scan absolute inset-0" />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-br from-white/[0.12] to-transparent"
                />
              </div>
            </div>

            <ControlPanel />
          </div>
        </Box>
      </motion.div>

      {/* Contact shadow anchoring it to the page. */}
      <div
        aria-hidden="true"
        className="mx-auto mt-5 h-4 w-[92%] rounded-[50%] bg-ink/15 blur-[8px]"
      />
    </motion.div>
  );
}