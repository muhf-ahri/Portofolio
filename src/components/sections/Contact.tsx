import { Mail, Send } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { profile } from "@/data/profile";
import type { IconType } from "@/lib/types";

const channels: {
  label: string;
  value: string;
  href: string;
  icon: IconType;
}[] = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}`, icon: Mail },
  {
    label: "GitHub",
    value: profile.github.replace("https://", ""),
    href: profile.github,
    icon: GithubIcon,
  },
  {
    label: "LinkedIn",
    value: profile.linkedin.replace("https://", ""),
    href: profile.linkedin,
    icon: LinkedinIcon,
  },
];

export function Contact() {
  return (
    <SectionShell id="contact">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-16">
        <div>
          <SectionHeading
            id="contact-heading"
            eyebrow="Kontak"
            title="Mari Membangun Sesuatu Bersama"
            description="Tertarik bekerja sama atau mendiskusikan sebuah proyek? Jangan ragu untuk menghubungi saya."
          />

          <Reveal delay={0.1} className="mt-8">
            <Button
              href={`mailto:${profile.email}?subject=Halo%20Fahri`}
              ariaLabel={`Kirim email ke ${profile.name} di ${profile.email}`}
            >
              <Send size={16} />
              Hubungi Saya
            </Button>
            <p className="mt-4 text-sm text-ink-soft">{profile.availability}</p>
          </Reveal>
        </div>

        <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {channels.map(({ label, value, href, icon: Icon }, index) => (
            <Reveal as="li" key={label} delay={index * 0.08}>
              <Card interactive className="h-full">
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
                  className="flex h-full flex-col gap-4 p-5 focus-visible:outline-offset-4 sm:p-6"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-[4px] border border-ink bg-ochre/40 text-ink transition-transform duration-150 group-hover:-rotate-3">
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-[0.65rem] tracking-[0.24em] text-rust uppercase">
                      {label}
                    </span>
                    <span className="mt-1.5 block truncate text-sm text-ink">
                      {value}
                    </span>
                  </span>
                </a>
              </Card>
            </Reveal>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}
