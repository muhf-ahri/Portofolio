"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

import DecryptedText from "@/components/ui/DecryptedText";
import CountUp from "@/components/ui/CountUp";
import Shuffle from "@/components/ui/Shuffle";
import { RetroComputer } from "@/components/sections/RetroComputer";
import { profile } from "@/data/profile";
import { stats } from "@/data/stats";
import { EASE, staggerParent } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function Hero() {
  const reduce = usePrefersReducedMotion();

  // Framer Motion animates in JS, so the global CSS reduced-motion reset does
  // not cover it — drop the travel and the stagger here as well.
  const rise = reduce
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.25 } },
      }
    : {
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
      };

  return (
    <section
      id="home"
      aria-labelledby="home-heading"
      className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl items-center px-5 pt-16 pb-20 sm:px-8 lg:px-10"
    >
      <div className="grid w-full gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-16">
        <motion.div variants={staggerParent(reduce ? 0 : 0.08)} initial="hidden" animate="show">
          <motion.div
            variants={rise}
            className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-ochre/40 px-3 py-1.5"
          >
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-rust"
            />
            <Shuffle
              text={profile.availability}
              tag="span"
              textAlign="left"
              shuffleDirection="right"
              duration={0.45}
              stagger={0.02}
              loop
              loopDelay={3.5}
              scrambleCharset="#@$%*+="
              ease="power3.out"
              className="font-mono text-[0.65rem] tracking-[0.18em] text-ink uppercase"
            />
          </motion.div>

          <motion.h1
            id="home-heading"
            variants={rise}
            className="mt-7 text-[2.4rem] leading-[1.02] font-bold tracking-tight text-balance text-ink sm:text-5xl lg:text-[3.6rem]"
          >
            <span className="block">
              <DecryptedText
                text="Hi, Saya Fahri Muhammadani"
                animateOn="view"
                sequential
                revealDirection="center"
                speed={60}
                useOriginalCharsOnly
                delay={350}
                encryptedClassName="text-ink/30"
              />
            </span>
            <span className="mt-2 block">
              <DecryptedText
                text="Full-Stack Web Developer"
                animateOn="view"
                sequential
                revealDirection="center"
                speed={75}
                useOriginalCharsOnly
                delay={900}
                className="text-rust"
                encryptedClassName="text-rust/30"
              />
            </span>
          </motion.h1>

          <motion.div
            variants={rise}
            aria-hidden="true"
            className="mt-6 flex items-center gap-3"
          >
            <span className="h-1 w-14 bg-ink" />
            <span className="h-1 w-5 bg-rust" />
            <span className="h-1 w-8 bg-ochre" />
          </motion.div>

          <motion.p
            variants={rise}
            className="mt-7 flex items-center gap-1.5 text-sm text-ink-soft"
          >
            <MapPin size={14} />
            {profile.location}
          </motion.p>

          <motion.dl
            variants={rise}
            className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="card flex flex-col px-4 py-3.5 shadow-hard-sm"
              >
                <dt className="order-2 mt-1.5 text-[0.7rem] leading-tight text-ink-soft">
                  {label}
                </dt>
                <dd className="order-1 leading-none">
                  <CountUp
                    to={value}
                    duration={1.4}
                    minIntegerDigits={2}
                    className="font-display text-2xl font-bold tracking-tight text-rust sm:text-3xl"
                  />
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* Retro computer. Its keyboard is the hero navigation — no separate
            button stack underneath. */}
        <div className="flex flex-col items-center">
          <RetroComputer />
        </div>
      </div>
    </section>
  );
}
