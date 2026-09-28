import {
  ClipboardCheck,
  ClipboardList,
  MessageSquareWarning,
  ShieldCheck,
  Store,
} from "lucide-react";

import type { IconType } from "@/lib/types";

export type Project = {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  icon: IconType;
  /**
   * Optional cover image. Drop a file in /public and reference it
   * (e.g. "/projects/needbuy.webp") to get a Next.js <Image> cover.
   * Leave null to render the generated flat cover instead.
   */
  image: string | null;
  liveUrl: string | null;
  repoUrl: string | null;
};

/* REPLACE: null URLs render as disabled "Soon" buttons — fill them in and the
   card lights up automatically. No component changes required. */
export const projects: Project[] = [
  {
    slug: "sistem-audit-internas-spi",
    title: "Sistem Audit Internal (SPI)",
    description:
      "Web application to support internal audit workflows: planning, inspection, finding documentation, follow-up, verification, and internal audit reporting.",
    tech: ["Laravel", "PHP", "MySQL", "Bootstrap", "Blade"],
    icon: ShieldCheck,
    image: null,
    liveUrl: null,
    repoUrl: null,
  },
  {
    slug: "inventory-barang",
    title: "Inventory Barang",
    description:
      "Web application for managing inventory data in a structured, searchable way — item records, stock tracking, and reporting.",
    tech: ["Laravel", "PHP", "MySQL", "Blade", "Bootstrap"],
    icon: ClipboardList,
    image: null,
    liveUrl: null,
    repoUrl: null,
  },
  {
    slug: "needbuy",
    title: "NeedBuy",
    description:
      "A modern marketplace interface built with a strong focus on user experience and responsive layout across breakpoints.",
    tech: ["React", "TypeScript", "Tailwind CSS"],
    icon: Store,
    image: null,
    liveUrl: null,
    repoUrl: null,
  },
  {
    slug: "anonymous-school-report",
    title: "Anonymous School Report",
    description:
      "Web-based reporting platform that helps students submit reports in a more structured way, with a React client backed by a Laravel API.",
    tech: ["React", "TypeScript", "Laravel API", "PostgreSQL"],
    icon: MessageSquareWarning,
    image: null,
    liveUrl: null,
    repoUrl: null,
  },
  {
    slug: "todolist",
    title: "ToDoList",
    description:
      "Task management application developed in both web and Android versions from the same product concept.",
    tech: ["React", "TypeScript", "Laravel", "Java", "XML", "MySQL"],
    icon: ClipboardCheck,
    image: null,
    liveUrl: null,
    repoUrl: null,
  },
];
