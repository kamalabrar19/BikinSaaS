import type { Locale } from "@/lib/locale";

/**
 * The seed for the team section. These are placeholders: the names say what
 * the role is rather than pretending to be a person, and nothing here is shown
 * as a real photo. Replace them in the admin panel (Tim) — once a member is
 * saved there, the panel owns the section and this file is no longer read for it.
 */

export interface TeamSeed {
  id: string;
  copy: Record<Locale, { name: string; role: string; bio: string; skills: string[] }>;
}

export const TEAM_SEED: TeamSeed[] = [
  {
    id: "founder",
    copy: {
      id: {
        name: "Nama Founder",
        role: "Founder & Lead Developer",
        bio: "Memegang arah produk dan memastikan setiap proyek selesai sesuai janji, dari kesepakatan harga sampai website online.",
        skills: ["Next.js", "Arsitektur sistem", "Strategi produk"],
      },
      en: {
        name: "Founder name",
        role: "Founder & Lead Developer",
        bio: "Owns the product direction and makes sure every project ships as promised, from the agreed price to the day the site goes live.",
        skills: ["Next.js", "System architecture", "Product strategy"],
      },
    },
  },
  {
    id: "designer",
    copy: {
      id: {
        name: "Nama Designer",
        role: "UI/UX Designer",
        bio: "Mengubah bahasa bisnis Anda jadi tampilan yang rapi, mudah dipahami pelanggan, dan enak dibuka di HP.",
        skills: ["Desain antarmuka", "Branding", "Prototipe"],
      },
      en: {
        name: "Designer name",
        role: "UI/UX Designer",
        bio: "Turns the way your business talks into a layout that is tidy, easy for customers to read and pleasant on a phone.",
        skills: ["Interface design", "Branding", "Prototyping"],
      },
    },
  },
  {
    id: "developer",
    copy: {
      id: {
        name: "Nama Developer",
        role: "Full-stack Developer",
        bio: "Membangun website dan aplikasi yang cepat, aman, dan gampang dirawat setelah online.",
        skills: ["React", "Node.js", "Database"],
      },
      en: {
        name: "Developer name",
        role: "Full-stack Developer",
        bio: "Builds websites and apps that are fast, safe and easy to maintain once they are live.",
        skills: ["React", "Node.js", "Databases"],
      },
    },
  },
  {
    id: "success",
    copy: {
      id: {
        name: "Nama Project Manager",
        role: "Client Success",
        bio: "Titik kontak Anda sehari-hari: menjelaskan tanpa istilah teknis, menjaga jadwal, dan membalas dalam 24 jam.",
        skills: ["Komunikasi klien", "Manajemen proyek", "Dukungan"],
      },
      en: {
        name: "Project manager name",
        role: "Client Success",
        bio: "Your day-to-day contact: explains things without jargon, keeps the schedule and replies within 24 hours.",
        skills: ["Client communication", "Project management", "Support"],
      },
    },
  },
];
