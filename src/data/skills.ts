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
    title: "Web Development",
    caption: "Interfaces and the systems behind them",
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
    caption: "Relational modelling and query design",
    items: [
      { name: "PostgreSQL", icon: Database },
      { name: "MySQL", icon: Database },
    ],
  },
  {
    title: "IT Support",
    caption: "Keeping the office running",
    items: [
      { name: "Hardware & Software Troubleshooting", icon: Wrench },
      { name: "Network Configuration", icon: Cable },
      { name: "Computer Maintenance", icon: Hammer },
    ],
  },
  {
    title: "Tools",
    caption: "Daily driver workflow",
    items: [
      { name: "Git", icon: GitBranch },
      { name: "GitHub", icon: GithubIcon },
      { name: "VS Code", icon: Code2 },
      { name: "Postman", icon: Server },
      { name: "Figma", icon: FigmaIcon },
    ],
  },
  {
    title: "Ways of working",
    caption: "How I operate on a team",
    items: [
      { name: "AI-Assisted Development", icon: Bot },
      { name: "Problem Solving", icon: BrainCircuit },
      { name: "Communication", icon: MessagesSquare },
      { name: "Teamwork", icon: Users },
      { name: "Time Management", icon: CalendarCheck },
    ],
  },
];
