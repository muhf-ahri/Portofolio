"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail, MapPin, Send } from "lucide-react";

import { GithubIcon, InstagramIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { KeyBank, KeyBankItem } from "@/components/ui/KeyBank";
import { KeyButton } from "@/components/ui/KeyButton";
import { RetroComputer } from "@/components/sections/RetroComputer";
import { profile } from "@/data/profile";
import { stats } from "@/data/stats";
import { EASE, fade, staggerParent } from "@/lib/motion";
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
            <span className="font-mono text-[0.65rem] tracking-[0.18em] text-ink uppercase">
              {profile.availability}
            </span>
          </motion.div>

          <motion.h1
            id="home-heading"
            variants={rise}
            className="mt-7 text-[2.75rem] leading-[0.98] font-bold tracking-tight text-balance text-ink sm:text-6xl lg:text-[4.5rem]"
          >
            <span className="block">Software</span>
            <span className="block">
              <span className="text-rust">Engineering</span> Student
            </span>
            <span className="block">&amp; Web Developer</span>
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
            className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-ink-soft"
          >
            {profile.tagline}
          </motion.p>

          <motion.p
            variants={rise}
            className="mt-3 max-w-xl text-base leading-relaxed text-pretty text-ink-soft/85"
          >
            I focus on web application development, modern UI, backend and
            database work, and day-to-day IT support.
          </motion.p>

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
                <dd className="order-1 font-display text-2xl leading-none font-bold tracking-tight text-rust sm:text-3xl">
                  {value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* Retro computer + 3D keycap row, right column. */}
        <div className="flex flex-col items-center">
          <RetroComputer />

          <motion.div
            variants={staggerParent(reduce ? 0 : 0.06)}
            initial="hidden"
            animate="show"
            className="mt-4 flex w-full max-w-[22rem] flex-col items-center gap-3"
          >
            <motion.div variants={fade} className="w-full">
              <KeyButton href="#projects" tone="accent" className="w-full">
                View Projects
                <ArrowRight size={16} />
              </KeyButton>
            </motion.div>

            <motion.div variants={fade} className="grid w-full grid-cols-2 gap-2.5">
              <KeyButton href={profile.github} external ariaLabel="GitHub">
                <GithubIcon size={16} />
                GitHub
              </KeyButton>
              {/* The second GitHub key is now Instagram. */}
              <KeyButton href={profile.instagram} external ariaLabel="Instagram">
                <InstagramIcon size={16} />
                Instagram
              </KeyButton>
            </motion.div>

            {/* Icon keys share one casing: no gaps, identical 1/3 columns,
                divided by keyline. Reads as a single key bank, not 3 chips. */}
            <motion.div variants={fade}>
              <KeyBank>
                <KeyBankItem
                  href={profile.linkedin}
                  external
                  ariaLabel="LinkedIn"
                  label="LinkedIn"
                >
                  <LinkedinIcon size={18} />
                </KeyBankItem>
                <KeyBankItem
                  href={`mailto:${profile.email}`}
                  ariaLabel="Email"
                  label="Email"
                >
                  <Mail size={18} />
                </KeyBankItem>
                <KeyBankItem href="#contact" ariaLabel="Contact" label="Contact">
                  <Send size={18} />
                </KeyBankItem>
              </KeyBank>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
