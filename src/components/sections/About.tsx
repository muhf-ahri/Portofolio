import { BrainCircuit, Code2, MonitorSmartphone, Wrench } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { profile } from "@/data/profile";

const highlights = [
  {
    title: "Software Engineering",
    description:
      "Membaca kebutuhan, memecahnya, dan mengirimkan kode yang mudah dipelihara.",
    icon: Code2,
  },
  {
    title: "Pengembangan Web",
    description:
      "Aplikasi web full-stack yang dibangun dengan Laravel, React, dan Next.js.",
    icon: MonitorSmartphone,
  },
  {
    title: "Dukungan IT",
    description:
      "Memperbaiki hardware, software, jaringan, dan perkakas kantor sehari-hari.",
    icon: Wrench,
  },
  {
    title: "Pemecahan Masalah",
    description:
      "Mengubah masalah yang ambigu menjadi solusi yang jelas, teruji, dan terdokumentasi.",
    icon: BrainCircuit,
  },
];

export function About() {
  return (
    <SectionShell id="about">
      <SectionHeading
        id="about-heading"
        eyebrow="Tentang"
        title="Tentang Saya"
        description={profile.about}
      />

      <div className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map(({ title, description, icon: Icon }, index) => (
          <Reveal key={title} delay={index * 0.07}>
            <Card interactive className="group flex h-full flex-col gap-4 p-6">
              <span className="grid size-11 place-items-center rounded-[4px] border border-ink bg-ochre/45 text-ink transition-transform duration-150 group-hover:-rotate-3">
                <Icon size={19} />
              </span>
              <h3 className="text-base font-semibold text-ink">{title}</h3>
              <p className="text-sm leading-relaxed text-ink-soft">
                {description}
              </p>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1} className="mt-4">
        <Card className="flex flex-col gap-6 p-6 sm:p-8">
          <h3 className="font-mono text-[0.7rem] tracking-[0.24em] text-rust uppercase">
            Bidang Fokus
          </h3>
          <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
            {profile.focusAreas.map((area) => (
              <li
                key={area}
                className="flex items-start gap-3 text-sm text-ink-soft"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.55rem] size-2 shrink-0 bg-rust"
                />
                {area}
              </li>
            ))}
          </ul>
        </Card>
      </Reveal>
    </SectionShell>
  );
}
