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
      "Aplikasi web untuk mendukung alur kerja audit internal: perencanaan, pemeriksaan, dokumentasi temuan, tindak lanjut, verifikasi, dan pelaporan audit internal.",
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
      "Aplikasi web untuk mengelola data inventaris secara terstruktur dan mudah dicari — catatan barang, pelacakan stok, dan pelaporan.",
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
      "Antarmuka marketplace modern yang dibangun dengan fokus kuat pada pengalaman pengguna dan layout responsif di berbagai ukuran layar.",
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
      "Platform pelaporan berbasis web yang membantu siswa mengirim laporan secara lebih terstruktur, dengan klien React yang didukung API Laravel.",
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
      "Aplikasi manajemen tugas yang dikembangkan dalam versi web dan Android dari konsep produk yang sama.",
    tech: ["React", "TypeScript", "Laravel", "Java", "XML", "MySQL"],
    icon: ClipboardCheck,
    image: null,
    liveUrl: null,
    repoUrl: null,
  },
];
