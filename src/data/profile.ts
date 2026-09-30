/**
 * EDIT THIS FILE FIRST.
 * Every contact link and identity string on the site resolves from here.
 */
export const profile = {
  name: "Fahri Muhammadani",
  role: "Full-Stack Web Developer",
  tagline:
    "Membangun aplikasi web yang praktis dan berfokus pada pengguna dengan teknologi modern.",
  about:
    "Saya mahasiswa Software Engineering dengan minat kuat pada pengembangan aplikasi web, software engineering, dan teknologi modern. Saya terbiasa membangun aplikasi dengan Laravel, React, Next.js, TypeScript, dan database seperti MySQL dan PostgreSQL.",
  focusAreas: [
    "Pengembangan aplikasi web",
    "Rekayasa UI modern",
    "Pengembangan backend & API",
    "Desain database",
    "Dukungan & pemecahan masalah IT",
  ],
  location: "Jawa Barat, Indonesia",
  availability: "Terbuka untuk magang, freelance, dan kolaborasi",

  // REPLACE: placeholder handles.
  email: "fahri@example.com",
  github: "https://github.com/fahri",
  linkedin: "https://www.linkedin.com/in/fahri",
  instagram: "https://instagram.com/fahri",
  website: "https://example.com",
} as const;

export const navLinks = [
  { id: "home", label: "Beranda" },
  { id: "about", label: "Tentang" },
  { id: "skills", label: "Keahlian" },
  { id: "experience", label: "Pengalaman" },
  { id: "projects", label: "Proyek" },
  { id: "contact", label: "Kontak" },
] as const;
