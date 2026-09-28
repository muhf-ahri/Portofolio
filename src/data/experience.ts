export type Experience = {
  role: string;
  company: string;
  period: string;
  mode: string;
  summary: string;
  highlights: string[];
};

export const experiences: Experience[] = [
  {
    role: "IT Support / Web Developer Intern",
    company: "PT Pindad Enjiniring Indonesia",
    period: "PKL Internship",
    mode: "On-site",
    summary:
      "Supported day-to-day IT needs while developing and maintaining internal applications used by company staff.",
    highlights: [
      "Supported internal IT needs throughout the PKL program.",
      "Developed and modified internal applications.",
      "Built the Internal Control System (Sistem Pengawasan Internal / SPI).",
      "Troubleshot hardware and software issues.",
      "Configured network infrastructure and printers.",
      "Supported meeting preparation using Zoom.",
      "Deployed and hosted internal applications so employees could access them.",
    ],
  },
];
