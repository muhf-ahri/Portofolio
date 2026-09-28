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
    title: "Lomba & Project Development",
    description:
      "Participated in competitions and project development activities at Universitas Komputer Indonesia.",
    meta: "Universitas Komputer Indonesia",
    icon: Award,
  },
  {
    title: "Marketplace Frontend Project",
    description:
      "Developed a marketplace website as a frontend project, covering listing, discovery, and responsive UI.",
    meta: "Frontend Project",
    icon: ShoppingBag,
  },
  {
    title: "PKL — IT Support & Web Development",
    description:
      "Completed a field internship combining IT support work with internal web application development.",
    meta: "PKL Experience",
    icon: Wrench,
  },
];
