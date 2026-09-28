import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";

const techCount = skillGroups.reduce((total, group) => total + group.items.length, 0);

/**
 * Numbers are derived from the data so they cannot drift out of sync with
 * what the site actually shows. Edit the data files, not these.
 */
export const stats = [
  { value: String(projects.length).padStart(2, "0"), label: "Projects built" },
  { value: String(techCount).padStart(2, "0"), label: "Technologies" },
  { value: "05", label: "Focus areas" },
  { value: "01", label: "Internship" },
] as const;
