import { Building2, CalendarDays, MapPin } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { experiences } from "@/data/experience";

export function Experience() {
  return (
    <SectionShell id="experience">
      <SectionHeading
        id="experience-heading"
        eyebrow="Pengalaman"
        title="Di Mana Saya Bekerja"
        description="Pengalaman magang yang menggabungkan operasional dukungan IT dengan pengembangan aplikasi web internal."
      />

      <ol className="relative mt-12 space-y-5 sm:mt-16">
        {/* Vertical rail — decorative only, the list carries the semantics. */}
        <span
          aria-hidden="true"
          className="absolute top-3 bottom-3 left-[0.5rem] w-0.5 bg-ink/25 sm:left-[0.6875rem]"
        />

        {experiences.map((item, index) => (
          <Reveal as="li" key={item.role} delay={index * 0.1} className="relative">
            {/* Square node, not a glowing dot. */}
            <span
              aria-hidden="true"
              className="absolute top-6 left-0 size-4 rotate-45 border border-ink bg-rust sm:left-1.5"
            />

            <Card interactive className="ml-8 p-6 sm:ml-12 sm:p-8">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[0.7rem] text-ink-soft">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 size={13} />
                  {item.company}
                </span>
                <span aria-hidden="true">/</span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={13} />
                  {item.period}
                </span>
                <span aria-hidden="true">/</span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={13} />
                  {item.mode}
                </span>
              </div>

              <h3 className="mt-4 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                {item.role}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">
                {item.summary}
              </p>

              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {item.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-3 text-sm leading-relaxed text-ink"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.6rem] size-2 shrink-0 bg-olive"
                    />
                    <span className="text-ink-soft">{highlight}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        ))}
      </ol>
    </SectionShell>
  );
}
