import { Award, ShoppingBag, Wrench } from "lucide-react";

import type { IconType } from "@/lib/types";

export type Achievement = {
  title: string;
  description: string;
  meta: string;
  icon: IconType;
};

export const achievements: Achievement[] = [
  {
    title: "Lomba & Pengembangan Proyek",
    description:
      "Berpartisipasi dalam kompetisi dan kegiatan pengembangan proyek di Universitas Komputer Indonesia.",
    meta: "Universitas Komputer Indonesia",
    icon: Award,
  },
  {
    title: "Proyek Frontend Marketplace",
    description:
      "Mengembangkan website marketplace sebagai proyek frontend, mencakup listing, pencarian, dan UI responsif.",
    meta: "Proyek Frontend",
    icon: ShoppingBag,
  },
  {
    title: "PKL — IT Support & Web Development",
    description:
      "Menyelesaikan magang lapangan yang menggabungkan pekerjaan dukungan IT dengan pengembangan aplikasi web internal.",
    meta: "Pengalaman PKL",
    icon: Wrench,
  },
];
