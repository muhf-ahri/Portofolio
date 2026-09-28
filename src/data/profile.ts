/**
 * EDIT THIS FILE FIRST.
 * Every contact link and identity string on the site resolves from here.
 */
export const profile = {
  name: "Fahri Muhammadani",
  role: "Software Engineering Student & Web Developer",
  tagline:
    "Building practical, user-focused web applications with modern technologies.",
  about:
    "I am a Software Engineering student with a strong interest in web application development, software engineering, and modern technology. I am used to building applications with Laravel, React, Next.js, TypeScript, and databases such as MySQL and PostgreSQL.",
  focusAreas: [
    "Web application development",
    "Modern UI engineering",
    "Backend & API development",
    "Database design",
    "IT support & troubleshooting",
  ],
  location: "Indonesia",
  availability: "Open to internships, freelance work, and collaboration",

  // REPLACE: placeholder handles.
  email: "fahri@example.com",
  github: "https://github.com/fahri",
  linkedin: "https://www.linkedin.com/in/fahri",
  instagram: "https://instagram.com/fahri",
  website: "https://example.com",
} as const;

export const navLinks = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;
