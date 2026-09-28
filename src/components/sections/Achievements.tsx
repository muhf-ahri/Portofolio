import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { achievements } from "@/data/achievements";

export function Achievements() {
  return (
    <SectionShell id="achievements">
      <SectionHeading
        id="achievements-heading"
        eyebrow="Beyond the Code"
        title="Achievements & Activities"
      />

      <div className="mt-12 grid gap-4 sm:mt-14 md:grid-cols-3">
        {achievements.map(({ title, description, meta, icon: Icon }, index) => (
          <Reveal key={title} delay={index * 0.08} className="h-full">
            <Card interactive className="flex h-full items-start gap-4 p-5 sm:p-6">
              <span className="grid size-10 shrink-0 place-items-center rounded-[3px] border-2 border-ink bg-olive/25 text-ink">
                <Icon size={17} />
              </span>
              <div className="min-w-0">
                <p className="font-mono text-[0.65rem] tracking-[0.2em] text-rust uppercase">
                  {meta}
                </p>
                <h3 className="mt-2 text-[0.95rem] font-semibold leading-snug text-balance text-ink">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {description}
                </p>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
