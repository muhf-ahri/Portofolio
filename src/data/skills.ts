import {
  Atom,
  Bot,
  BrainCircuit,
  CalendarCheck,
  Cable,
  Code2,
  Database,
  FileCode2,
  GitBranch,
  Hammer,
  MessagesSquare,
  Palette,
  Server,
  Terminal,
  Users,
  Wrench,
} from "lucide-react";

import { FigmaIcon, GithubIcon } from "@/components/ui/BrandIcons";
import type { IconType } from "@/lib/types";

export type Skill = { name: string; icon: IconType };
export type SkillGroup = { title: string; caption: string; items: Skill[] };

export const skillGroups: SkillGroup[] = [
  {
    title: "Pengembangan Web",
    caption: "Antarmuka dan sistem di baliknya",
    items: [
      { name: "Laravel", icon: Code2 },
      { name: "React.js", icon: Atom },
      { name: "Next.js", icon: Terminal },
      { name: "Tailwind CSS", icon: Palette },
      { name: "PHP", icon: FileCode2 },
      { name: "JavaScript", icon: FileCode2 },
      { name: "TypeScript", icon: FileCode2 },
    ],
  },
  {
    title: "Database",
    caption: "Pemodelan relasional dan desain query",
    items: [
      { name: "PostgreSQL", icon: Database },
      { name: "MySQL", icon: Database },
    ],
  },
  {
    title: "Dukungan IT",
    caption: "Menjaga operasional kantor tetap berjalan",
    items: [
      { name: "Troubleshooting Hardware & Software", icon: Wrench },
      { name: "Konfigurasi Jaringan", icon: Cable },
      { name: "Perawatan Komputer", icon: Hammer },
    ],
  },
  {
    title: "Perangkat Kerja",
    caption: "Alur kerja harian",
    items: [
      { name: "Git", icon: GitBranch },
      { name: "GitHub", icon: GithubIcon },
      { name: "VS Code", icon: Code2 },
      { name: "Postman", icon: Server },
      { name: "Figma", icon: FigmaIcon },
    ],
  },
  {
    title: "Cara Bekerja",
    caption: "Bagaimana saya beroperasi dalam tim",
    items: [
      { name: "Pengembangan Berbantuan AI", icon: Bot },
      { name: "Pemecahan Masalah", icon: BrainCircuit },
      { name: "Komunikasi", icon: MessagesSquare },
      { name: "Kerja Sama Tim", icon: Users },
      { name: "Manajemen Waktu", icon: CalendarCheck },
    ],
  },
];
