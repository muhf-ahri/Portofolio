"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cx } from "@/lib/cx";

type DecryptedTextProps = {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: "view" | "hover" | "inViewHover" | "click";
  clickMode?: "once" | "toggle";
  delay?: number;
};

/**
 * Cipher-decrypt text reveal. Adapted from React Bits for this theme: skips
 * straight to the plain text under reduced motion, and the scramble alphabet is
 * trimmed to terminal-safe glyphs rather than the whole Unicode kitchen sink.
 */
export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#@$%&*+=",
  className = "",
  parentClassName = "",
  encryptedClassName = "",
  animateOn = "hover",
  clickMode = "once",
  delay = 0,
  ...props
}: DecryptedTextProps) {
  const reduce = useReducedMotion();
  const [isDecrypted, setIsDecrypted] = useState(() => {
    // Hover/inViewHover start decrypted; view/click start encrypted. Reduced
    // motion skips the scramble entirely and keeps the plain text.
    if (reduce) return true;
    if (animateOn === "hover" || animateOn === "inViewHover") return true;
    return false;
  });
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set<number>());
  const [direction, setDirection] = useState("forward");

  const containerRef = useRef<HTMLSpanElement>(null);
  const orderRef = useRef<number[]>([]);
  const pointerRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const availableChars = useMemo(() => {
    if (reduce) return [];
    return useOriginalCharsOnly
      ? Array.from(new Set(text.split(""))).filter((char) => char !== " ")
      : characters.split("");
  }, [useOriginalCharsOnly, text, characters, reduce]);

  const shuffleText = useCallback(
    (originalText: string, currentRevealed: Set<number>) => {
      return originalText
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (currentRevealed.has(i)) return originalText[i];
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join("");
    },
    [availableChars],
  );

  const computeOrder = useCallback(
    (len: number) => {
      const order: number[] = [];
      if (len <= 0) return order;
      if (revealDirection === "start") {
        for (let i = 0; i < len; i++) order.push(i);
        return order;
      }
      if (revealDirection === "end") {
        for (let i = len - 1; i >= 0; i--) order.push(i);
        return order;
      }
      const middle = Math.floor(len / 2);
      let offset = 0;
      while (order.length < len) {
        if (offset % 2 === 0) {
          const idx = middle + offset / 2;
          if (idx >= 0 && idx < len) order.push(idx);
        } else {
          const idx = middle - Math.ceil(offset / 2);
          if (idx >= 0 && idx < len) order.push(idx);
        }
        offset++;
      }
      return order.slice(0, len);
    },
    [revealDirection],
  );

  const fillAllIndices = useCallback(() => {
    const s = new Set<number>();
    for (let i = 0; i < text.length; i++) s.add(i);
    return s;
  }, [text]);

  const removeRandomIndices = useCallback((set: Set<number>, count: number) => {
    const arr = Array.from(set);
    for (let i = 0; i < count && arr.length > 0; i++) {
      arr.splice(Math.floor(Math.random() * arr.length), 1);
    }
    return new Set(arr);
  }, []);

  const triggerDecrypt = useCallback(() => {
    if (reduce) {
      setDisplayText(text);
      setRevealedIndices(fillAllIndices());
      setIsDecrypted(true);
      return;
    }
    if (sequential) {
      orderRef.current = computeOrder(text.length);
      pointerRef.current = 0;
      setRevealedIndices(new Set());
    } else {
      setRevealedIndices(new Set());
      setDisplayText(shuffleText(text, new Set()));
      setIsDecrypted(false);
    }
    setDirection("forward");
    setIsAnimating(true);
  }, [reduce, sequential, computeOrder, shuffleText, text, fillAllIndices]);

  const triggerReverse = useCallback(() => {
    if (sequential) {
      orderRef.current = computeOrder(text.length).slice().reverse();
      pointerRef.current = 0;
      setRevealedIndices(fillAllIndices());
    } else {
      setRevealedIndices(fillAllIndices());
    }
    setDirection("reverse");
    setIsAnimating(true);
  }, [sequential, computeOrder, fillAllIndices, text]);

  useEffect(() => {
    if (!isAnimating) return;

    let currentIteration = 0;

    intervalRef.current = setInterval(() => {
      setRevealedIndices((prevRevealed) => {
        if (sequential) {
          if (direction === "forward") {
            if (prevRevealed.size < text.length) {
              // orderRef.current was filled by triggerDecrypt via computeOrder,
              // so "start" / "end" / "center" all resolve correctly here.
              const nextIndex = orderRef.current[prevRevealed.size];
              const newRevealed = new Set(prevRevealed);
              newRevealed.add(nextIndex);
              setDisplayText(shuffleText(text, newRevealed));
              return newRevealed;
            }
            clearInterval(intervalRef.current!);
            setIsAnimating(false);
            setDisplayText(text);
            setIsDecrypted(true);
            return prevRevealed;
          }
          if (pointerRef.current < orderRef.current.length) {
            const idxToRemove = orderRef.current[pointerRef.current++];
            const newRevealed = new Set(prevRevealed);
            newRevealed.delete(idxToRemove);
            setDisplayText(shuffleText(text, newRevealed));
            if (newRevealed.size === 0) {
              clearInterval(intervalRef.current!);
              setIsAnimating(false);
              setIsDecrypted(false);
            }
            return newRevealed;
          }
          clearInterval(intervalRef.current!);
          setIsAnimating(false);
          setIsDecrypted(false);
          return prevRevealed;
        }

        if (direction === "forward") {
          setDisplayText(shuffleText(text, prevRevealed));
          currentIteration++;
          if (currentIteration >= maxIterations) {
            clearInterval(intervalRef.current!);
            setIsAnimating(false);
            setDisplayText(text);
            setIsDecrypted(true);
          }
          return prevRevealed;
        }

        let currentSet = prevRevealed;
        if (currentSet.size === 0) currentSet = fillAllIndices();
        const removeCount = Math.max(1, Math.ceil(text.length / Math.max(1, maxIterations)));
        const nextSet = removeRandomIndices(currentSet, removeCount);
        setDisplayText(shuffleText(text, nextSet));
        currentIteration++;
        if (nextSet.size === 0 || currentIteration >= maxIterations) {
          clearInterval(intervalRef.current!);
          setIsAnimating(false);
          setIsDecrypted(false);
          setDisplayText(shuffleText(text, new Set()));
          return new Set();
        }
        return nextSet;
      });
    }, speed);

    return () => clearInterval(intervalRef.current!);
  }, [isAnimating, text, speed, maxIterations, sequential, revealDirection, shuffleText, direction, fillAllIndices, removeRandomIndices]);

  const handleClick = () => {
    if (animateOn !== "click") return;
    if (clickMode === "once") {
      if (isDecrypted) return;
      setDirection("forward");
      triggerDecrypt();
    } else if (clickMode === "toggle") {
      if (isDecrypted) {
        triggerReverse();
      } else {
        setDirection("forward");
        triggerDecrypt();
      }
    }
  };

  const triggerHoverDecrypt = useCallback(() => {
    if (isAnimating || reduce) return;
    setRevealedIndices(new Set());
    setIsDecrypted(false);
    setDisplayText(shuffleText(text, new Set()));
    setDirection("forward");
    setIsAnimating(true);
  }, [isAnimating, reduce, shuffleText, text]);

  const resetToPlainText = useCallback(() => {
    clearInterval(intervalRef.current!);
    setIsAnimating(false);
    setRevealedIndices(new Set());
    setDisplayText(text);
    setIsDecrypted(true);
    setDirection("forward");
  }, [text]);

  // "view" / "inViewHover": scramble immediately (next tick), then decrypt after
  // `delay`, so staggered lines look encrypted while they wait instead of
  // showing their plain text early. Runs on mount — the hero is already visible.
  // Reduced motion returns early and keeps the plain text (the initial state).
  useEffect(() => {
    if (reduce) return;
    if (animateOn !== "view" && animateOn !== "inViewHover") return;

    let cancelled = false;
    const scrambleTimer = setTimeout(() => {
      if (cancelled) return;
      setDisplayText(shuffleText(text, new Set()));
      setIsDecrypted(false);
    }, 0);
    const timer = setTimeout(() => {
      if (cancelled) return;
      triggerDecrypt();
    }, delay);
    return () => {
      cancelled = true;
      clearTimeout(scrambleTimer);
      clearTimeout(timer);
    };
  }, [reduce, animateOn, delay, triggerDecrypt, shuffleText, text]);

  const animateProps =
    animateOn === "hover" || animateOn === "inViewHover"
      ? { onMouseEnter: triggerHoverDecrypt, onMouseLeave: resetToPlainText }
      : animateOn === "click"
        ? { onClick: handleClick }
        : {};

  return (
    <motion.span
      ref={containerRef}
      className={parentClassName}
      style={{ display: "inline-block", whiteSpace: "pre-wrap" }}
      {...animateProps}
      {...props}
    >
      <span className="sr-only">{displayText}</span>
      <span aria-hidden="true">
        {displayText.split("").map((char, index) => {
          const isRevealedOrDone = revealedIndices.has(index) || (!isAnimating && isDecrypted);
          return (
            <span key={index} className={cx(isRevealedOrDone ? className : encryptedClassName)}>
              {char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
}