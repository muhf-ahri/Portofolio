"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail, MapPin } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { profile } from "@/data/profile";
import { stats } from "@/data/stats";
import { EASE, staggerParent } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const socials = [
  { label: "GitHub", href: profile.github, icon: GithubIcon },
  { label: "LinkedIn", href: profile.linkedin, icon: LinkedinIcon },
  { label: "Email", href: `mailto:${profile.email}`, icon: Mail },
];

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

          <motion.div
            variants={rise}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Button href="#projects">
              View Projects
              <ArrowRight size={16} />
            </Button>
            <Button href={profile.github} external variant="outline">
              <GithubIcon size={16} />
              GitHub
            </Button>
          </motion.div>

          <motion.ul variants={rise} className="mt-9 flex items-center gap-2.5">
            {socials.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
                  aria-label={label}
                  className="press grid size-10 place-items-center rounded-[4px] border-2 border-ink bg-card text-ink"
                >
                  <Icon size={16} />
                </a>
              </li>
            ))}
            <li className="ml-2 hidden items-center gap-1.5 text-sm text-ink-soft sm:flex">
              <MapPin size={14} />
              {profile.location}
            </li>
          </motion.ul>

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

        {/* Spec card — the one component that keeps the terminal motif. */}
        <motion.aside
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
          className="card p-5 shadow-hard sm:p-6"
        >
          <div className="flex items-center gap-2 border-b-2 border-ink pb-4">
            <span aria-hidden="true" className="size-3 bg-rust" />
            <span aria-hidden="true" className="size-3 bg-ochre" />
            <span aria-hidden="true" className="size-3 bg-olive" />
            <span className="ml-1 font-mono text-[0.68rem] text-ink-soft">
              stack.sh
            </span>
          </div>

          <dl className="mt-4 space-y-3 font-mono text-[0.8rem]">
            {[
              ["frameworks", "Laravel · React · Next.js"],
              ["languages", "TypeScript · JavaScript · PHP"],
              ["database", "PostgreSQL · MySQL"],
              ["tooling", "Git · Postman · Figma"],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-wrap gap-x-3">
                <dt className="w-24 shrink-0 text-rust">
                  <span className="text-ink-soft">$</span> {label}
                </dt>
                <dd className="text-ink">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 flex items-center gap-2 border-t-2 border-ink pt-4 font-mono text-[0.7rem] text-ink-soft">
            <span aria-hidden="true" className="size-2 bg-olive" />
            open to new projects
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
