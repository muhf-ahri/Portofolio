import { ArrowUpRight, Globe } from "lucide-react";
import Image from "next/image";

import { GithubIcon } from "@/components/ui/BrandIcons";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { TechChips } from "@/components/ui/TechChips";
import { projects, type Project } from "@/data/projects";
import type { IconType } from "@/lib/types";

function Cover({ project, index }: { project: Project; index: number }) {
  const Icon = project.icon;

  if (project.image) {
    return (
      <Image
        src={project.image}
        alt={`${project.title} preview`}
        fill
        sizes="(min-width: 1024px) 33rem, 100vw"
        className="object-cover transition-transform duration-300 ease-out-expo group-hover:scale-[1.05] motion-reduce:transform-none"
      />
    );
  }

  // No screenshot yet: a flat printed block beats a broken image.
  return (
    <div className="absolute inset-0 bg-paper-2">
      {/* Flat colour fields, echoing the page background. */}
      <div aria-hidden="true" className="absolute inset-0 bg-ochre/30" />
      <div
        aria-hidden="true"
        className="absolute -right-10 -bottom-10 size-44 rotate-12 bg-rust-bright/20"
      />
      <div aria-hidden="true" className="bg-halftone absolute inset-0 opacity-[0.12]" />
      <Icon
        aria-hidden="true"
        className="absolute -right-5 -bottom-6 size-40 text-ink/10 transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transform-none"
      />
      <span
        aria-hidden="true"
        className="absolute top-4 left-5 font-display text-5xl leading-none font-bold tracking-tighter text-ink/25 sm:text-6xl"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
}

function ProjectAction({
  href,
  icon: Icon,
  children,
}: {
  href: string | null;
  icon: IconType;
  children: string;
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-[3px] border-2 px-3.5 py-2 text-xs font-semibold";

  if (!href) {
    return (
      <span
        aria-disabled="true"
        title="Tautan belum diterbitkan — tambahkan URL di src/data/projects.ts"
        className={`${base} cursor-not-allowed border-line-soft bg-paper-2/40 text-ink-soft/60`}
      >
        <Icon size={14} aria-hidden="true" />
        {children} · segera
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={`press ${base} border-ink bg-card text-ink`}
    >
      <Icon size={14} aria-hidden="true" />
      {children}
    </a>
  );
}

export function Projects() {
  return (
    <SectionShell id="projects">
      <SectionHeading
        id="projects-heading"
        eyebrow="Studi Kasus"
        title="Proyek Unggulan"
        description="Karya akademik, magang, dan proyek pribadi — kebanyakan Laravel dan React, dengan desain database yang menyatukannya."
      />

      <div className="mt-12 grid gap-5 sm:mt-16 lg:grid-cols-2">
        {projects.map((project, index) => (
          <Reveal key={project.slug} delay={(index % 2) * 0.08} className="h-full">
            <Card
              interactive
              className="group flex h-full flex-col overflow-hidden p-0"
            >
              <div className="relative aspect-16/10 overflow-hidden border-b-2 border-ink">
                <Cover project={project} index={index} />
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[0.7rem] text-rust">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden="true" className="h-px flex-1 bg-ink/25" />
                </div>

                <h3 className="mt-4 text-lg font-semibold tracking-tight text-balance text-ink">
                  {project.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-pretty text-ink-soft">
                  {project.description}
                </p>

                <TechChips items={project.tech} className="mt-5" />

                <div className="mt-6 flex flex-wrap items-center gap-2 pt-1">
                  <ProjectAction href={project.liveUrl} icon={Globe}>
                    Demo Langsung
                  </ProjectAction>
                  <ProjectAction href={project.repoUrl} icon={GithubIcon}>
                    GitHub
                  </ProjectAction>
                  <ArrowUpRight
                    aria-hidden="true"
                    size={16}
                    className="ml-auto text-ink-soft transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none"
                  />
                </div>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
