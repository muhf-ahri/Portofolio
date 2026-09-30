"use client";

import { gsap } from "gsap";
import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import { cx } from "@/lib/cx";

type TextTypeProps = {
  text: string[];
  typingSpeed?: number;
  initialDelay?: number;
  pauseDuration?: number;
  loop?: boolean;
  className?: string;
  showCursor?: boolean;
  cursorCharacter?: string | React.ReactNode;
  cursorClassName?: string;
  cursorBlinkDuration?: number;
};

/**
 * Sequential terminal typewriter adapted from React Bits. Types each line of
 * `text` character by character and keeps it, then types the lines below it —
 * the earlier lines pile up instead of being erased. `showCursor` renders a
 * gsap-blinking caret on the signature line. Reduced motion prints everything
 * at once.
 */
export default function TextType({
  text,
  typingSpeed = 1000,
  initialDelay = 0,
  pauseDuration = 2000,
  loop = true,
  className = "",
  showCursor = true,
  cursorCharacter = "█",
  cursorClassName = "",
  cursorBlinkDuration = 0.5,
}: TextTypeProps) {
  const reduce = useReducedMotion();
  const [lines, setLines] = useState<string[]>(() =>
    reduce ? text.slice() : text.map(() => ""),
  );
  const cursorRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showCursor || !cursorRef.current || reduce) return;
    gsap.set(cursorRef.current, { opacity: 1 });
    const blink = gsap.to(cursorRef.current, {
      opacity: 0,
      duration: cursorBlinkDuration,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });
    return () => {
      blink.kill();
    };
  }, [showCursor, cursorBlinkDuration, reduce]);

  useEffect(() => {
    if (reduce) return;

    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout>;
    // LineIndex/charIndex capture where typing is.
    let line = 0;
    let char = 0;

    const tick = () => {
      if (cancelled) return;
      const source = text;
      if (line >= source.length) {
        // Entire screen typed: hold pauseDuration, then clear and restart.
        if (!loop) return;
        timeout = setTimeout(() => {
          if (cancelled) return;
          line = 0;
          char = 0;
          setLines(source.map(() => ""));
          timeout = setTimeout(tick, initialDelay);
        }, pauseDuration);
        return;
      }

      const current = source[line];
      if (char < current.length) {
        char++;
        setLines((prev) =>
          prev.map((value, i) => (i === line ? current.slice(0, char) : value)),
        );
        timeout = setTimeout(tick, typingSpeed);
      } else {
        // Line complete: move to the next one immediately.
        line++;
        char = 0;
        timeout = setTimeout(tick, typingSpeed);
      }
    };

    timeout = setTimeout(tick, initialDelay);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [reduce, typingSpeed, initialDelay, pauseDuration, loop, text]);

  return (
    <div
      ref={containerRef}
      className={cx("text-type whitespace-pre-wrap", className)}
    >
      {lines.map((line, i) => (
        <span key={i} className="block">
          {line}
          {showCursor && i === lines.length - 1 && (
            <span
              ref={cursorRef}
              className={cx("text-type__cursor ml-0.5 inline-block", cursorClassName)}
            >
              {cursorCharacter}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}