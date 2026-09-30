"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";

import OptionWheel from "@/components/ui/OptionWheel";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { skillGroups } from "@/data/skills";
import { EASE } from "@/lib/motion";
import { useScrollSteps } from "@/hooks/useScrollSteps";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Scroll-linked category wheel. The section is a tall track with a sticky
 * stage, so scrolling through it advances the wheel one category at a time
 * and feels deliberately slow. The page never stops moving and nothing is
 * hijacked, so there is no way to get stuck here.
 */
export function Skills() {
  const reduce = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  // Scroll position alone decides the category. 320svh of track for five
  // categories means roughly two extra screens of travel per step, so the
  // section reads as slow without ever stopping the scroll.
  const index = useScrollSteps(trackRef, skillGroups.length, !reduce);
  const group = skillGroups[index] ?? skillGroups[0];

  return (
    <SectionShell
      id="skills"
      ref={trackRef}
      className="scroll-mt-24"
      trackHeight={reduce ? undefined : "320svh"}
      sticky={!reduce}
    >
      <SectionHeading
        id="skills-heading"
        eyebrow="Teknologi"
        title="Keahlian Saya"
        description="Gulir untuk berpindah kategori — satu set teknologi yang terpakai, dikelompokkan berdasarkan fungsinya."
      />

      <div className="mt-10 grid items-center gap-8 sm:mt-12 lg:grid-cols-2 lg:gap-6">
        <Reveal>
          <Card className="relative h-[24rem] overflow-hidden p-0 sm:h-[30rem]">
            <OptionWheel
              items={skillGroups.map((g) => g.title)}
              position={index}
              activeColor="var(--color-rust)"
              textColor="var(--color-ink-soft)"
              fontSize={1.7}
              spacing={1.45}
              side="left"
              inset={64}
              tilt={12}
              curve={0.85}
              blur={1.6}
              fade={0.2}
              minOpacity={0.08}
              smoothing={320}
            />
          </Card>
        </Reveal>

        <Reveal delay={0.1}>
          <AnimatePresence mode="wait">
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: EASE }}
              aria-live="polite"
            >
              <Card className="flex flex-col gap-5 p-6 sm:p-8">
                <div className="flex flex-col gap-1">
                  <p className="font-mono text-[0.7rem] tracking-[0.24em] text-rust uppercase">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-display text-2xl font-bold tracking-tight text-ink">
                    {group.title}
                  </h3>
                  <p className="mt-1 text-sm text-ink-soft">{group.caption}</p>
                </div>

                <ul className="grid gap-2">
                  {group.items.map(({ name, icon: Icon }) => (
                    <li
                      key={name}
                      className="group/skill flex items-center gap-3.5 rounded-[4px] border-2 border-transparent px-2.5 py-2 transition-colors duration-150 hover:border-ink hover:bg-ochre/25"
                    >
                      <span className="grid size-8 shrink-0 place-items-center rounded-[3px] border-2 border-ink bg-card text-rust transition-transform duration-150 group-hover/skill:-rotate-3">
                        <Icon size={15} />
                      </span>
                      <span className="text-sm leading-snug text-ink">{name}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          </AnimatePresence>
        </Reveal>
      </div>
    </SectionShell>
  );
}