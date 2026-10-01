"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";

import LineSidebar from "@/components/ui/LineSidebar";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { skillGroups } from "@/data/skills";
import { EASE } from "@/lib/motion";
import { useScrollSteps } from "@/hooks/useScrollSteps";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Scroll-linked category list. The section is a tall track with a sticky
 * stage, so scrolling through it advances the list one category at a time and
 * feels deliberately slow. The page never stops moving and nothing is
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

      <div className="mt-10 grid items-stretch gap-8 sm:mt-12 lg:grid-cols-2 lg:gap-6">
        <Reveal className="flex h-[36rem] items-center">
          {/* No card here on purpose: a boxed list next to a boxed detail
              panel read as two competing blocks. The rules and the type carry
              the structure instead. */}
          <LineSidebar
            items={skillGroups.map((g) => g.title)}
            position={index}
            accentColor="var(--color-rust)"
            textColor="var(--color-ink)"
            markerColor="var(--color-ink-soft)"
            fontSize={1.2}
            maxShift={14}
            proximityRadius={110}
            markerLength={64}
            tickScale={0.45}
            itemGap={26}
            smoothing={140}
          />
        </Reveal>

        <Reveal delay={0.1} className="h-[36rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: EASE }}
              aria-live="polite"
              className="h-[36rem]"
            >
              {/* Fixed height, not min-height: item counts differ per category
                  (7 down to 2), so a floor would still let the card grow and
                  shrink as the selection moves. Sized to fit the largest
                  group (Pengembangan Web, 7 items) with room for the caption
                  to wrap in the two-column layout. */}
              <Card className="flex h-[36rem] flex-col gap-5 overflow-hidden p-6 sm:p-8">
                <div className="flex flex-col gap-1">
                  <p className="font-mono text-[0.7rem] tracking-[0.24em] text-rust uppercase">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-display text-2xl font-bold tracking-tight text-ink">
                    {group.title}
                  </h3>
                  <p className="mt-1 text-sm text-ink-soft">{group.caption}</p>
                </div>

                <ul className="grid min-h-0 flex-1 content-start gap-2 overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thin] [scrollbar-color:var(--color-ink-soft)_transparent]">
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