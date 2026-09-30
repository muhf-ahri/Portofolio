import { experiences } from "@/data/experience";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { skillGroups } from "@/data/skills";

const techCount = skillGroups.reduce((total, group) => total + group.items.length, 0);

/**
 * Counts are derived from the data so they cannot drift out of sync with
 * what the site actually shows. Edit the data files, not these. The display
 * keeps the zero-padded `05` look via CountUp's `minIntegerDigits`.
 */
export const stats = [
  { value: projects.length, label: "Proyek Dibuat" },
  { value: techCount, label: "Teknologi" },
  { value: profile.focusAreas.length, label: "Bidang Fokus" },
  { value: experiences.length, label: "Magang" },
] as const;
