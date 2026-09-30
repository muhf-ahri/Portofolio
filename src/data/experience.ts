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
    role: "Intern IT Support / Web Developer",
    company: "PT Pindad Enjiniring Indonesia",
    period: "PKL (Magang)",
    mode: "Di Kantor",
    summary:
      "Mendukung kebutuhan IT sehari-hari sambil mengembangkan dan memelihara aplikasi internal yang dipakai oleh staf perusahaan.",
    highlights: [
      "Mendukung kebutuhan IT internal selama program PKL.",
      "Mengembangkan dan memodifikasi aplikasi internal.",
      "Membangun Sistem Pengawasan Internal (SPI).",
      "Memperbaiki masalah hardware dan software.",
      "Mengonfigurasi infrastruktur jaringan dan printer.",
      "Mendukung persiapan rapat menggunakan Zoom.",
      "Men-deploy dan menghosting aplikasi internal agar dapat diakses karyawan.",
    ],
  },
];
