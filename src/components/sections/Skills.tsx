"use client";

import { motion } from "framer-motion";

import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { skillGroups } from "@/data/skills";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function Skills() {
  const reduce = usePrefersReducedMotion();

  return (
    <SectionShell id="skills">
      <SectionHeading
        id="skills-heading"
        eyebrow="Teknologi"
        title="Perangkat yang Saya Gunakan"
        description="Satu set yang terpakai, dikelompokkan berdasarkan fungsinya — bukan sekadar daftar logo."
      />

      <div className="mt-12 grid gap-4 sm:mt-16 lg:grid-cols-2">
        {skillGroups.map((group, groupIndex) => (
          <Reveal
            key={group.title}
            delay={(groupIndex % 2) * 0.08}
            className="h-full"
          >
            <Card className="flex h-full flex-col p-5 sm:p-7">
              <div className="flex items-baseline justify-between gap-3 border-b-2 border-ink pb-3">
                <h3 className="text-base font-semibold text-ink">
                  {group.title}
                </h3>
                <span
                  aria-hidden="true"
                  className="font-mono text-[0.65rem] text-ink-soft"
                >
                  {String(group.items.length).padStart(2, "0")}
                </span>
              </div>

              <motion.ul
                variants={staggerParent(reduce ? 0 : 0.04)}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                className="mt-4 grid gap-1"
              >
                {group.items.map(({ name, icon: Icon }) => (
                  <motion.li key={name} variants={fadeUp}>
                    <div className="group/skill flex items-center gap-3.5 rounded-[4px] border-2 border-transparent px-2.5 py-2 transition-colors duration-150 hover:border-ink hover:bg-ochre/25">
                      <span className="grid size-8 shrink-0 place-items-center rounded-[3px] border-2 border-ink bg-card text-rust transition-transform duration-150 group-hover/skill:-rotate-3">
                        <Icon size={15} />
                      </span>
                      <span className="text-sm leading-snug text-ink">{name}</span>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            </Card>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
