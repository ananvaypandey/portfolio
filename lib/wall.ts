import { basePath } from "./site";

export interface WallImage {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

export interface WallAlbum {
  id: string;
  name: string;
  tag: string;
  date: string;
  images: WallImage[];
}

export const wallAlbums: WallAlbum[] = [
  {
    id: "techexpo-2024",
    name: "TechExpo — 2024",
    tag: "wins",
    date: "2024",
    images: [
      {
        src: `${basePath}/wall/techexpo-2024/1.png`,
        alt: "Photo 1 — Techexpo 2024",
        caption: "Photo 1 — TechExpo 2024",
        width: 771,
        height: 447,
      },
      {
        src: `${basePath}/wall/techexpo-2024/2.png`,
        alt: "Photo 2 — Techexpo 2024",
        caption: "Photo 2 — TechExpo 2024",
        width: 796,
        height: 562,
      },
      {
        src: `${basePath}/wall/techexpo-2024/3.png`,
        alt: "Photo 3 — Techexpo 2024",
        caption: "Photo 3 — TechExpo 2024",
        width: 625,
        height: 392,
      },
      {
        src: `${basePath}/wall/techexpo-2024/4.png`,
        alt: "Photo 4 — Techexpo 2024",
        caption: "Photo 4 — TechExpo 2024",
        width: 760,
        height: 517,
      },
      {
        src: `${basePath}/wall/techexpo-2024/5.png`,
        alt: "Photo 5 — Techexpo 2024",
        caption: "Photo 5 — TechExpo 2024",
        width: 637,
        height: 340,
      },
    ],
  },
  {
    id: "sih-2025",
    name: "SIH — 2025",
    tag: "hackathons",
    date: "2025",
    images: [],
  },
  {
    id: "protech-2025",
    name: "ProTech — 2025",
    tag: "wins",
    date: "2025",
    images: [],
  },
  {
    id: "tcs-visit-2025",
    name: "TCS visit — 2025",
    tag: "collabs",
    date: "2025",
    images: [],
  },
  {
    id: "company-birthday-2026",
    name: "Company birthday — 2026",
    tag: "milestones",
    date: "2026",
    images: [],
  },
  {
    id: "iic-delhi-2026",
    name: "IIC — Delhi, 2026",
    tag: "collabs",
    date: "2026",
    images: [],
  },
  {
    id: "thrive-2024",
    name: "Thrive — 2024",
    tag: "wins",
    date: "2024",
    images: [],
  },
];