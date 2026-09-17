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
    images: [
      {
        src: `${basePath}/wall/protech-2025/1.png`,
        alt: "Photo 1 — ProTech 2025",
        caption: "Photo 1 — ProTech 2025",
        width: 763,
        height: 487,
      },
      {
        src: `${basePath}/wall/protech-2025/2.png`,
        alt: "Photo 2 — ProTech 2025",
        caption: "Photo 2 — ProTech 2025",
        width: 776,
        height: 570,
      },
      {
        src: `${basePath}/wall/protech-2025/3.png`,
        alt: "Photo 3 — ProTech 2025",
        caption: "Photo 3 — ProTech 2025",
        width: 787,
        height: 617,
      },
    ],
  },
  {
    id: "tcs-visit-2025",
    name: "TCS visit — 2025",
    tag: "collabs",
    date: "2025",
    images: [
      {
        src: `${basePath}/wall/tcs-visit-2025/1.png`,
        alt: "Photo 1 — TCS visit 2025",
        caption: "Photo 1 — TCS visit 2025",
        width: 771,
        height: 482,
      },
      {
        src: `${basePath}/wall/tcs-visit-2025/2.png`,
        alt: "Photo 2 — TCS visit 2025",
        caption: "Photo 2 — TCS visit 2025",
        width: 772,
        height: 507,
      },
      {
        src: `${basePath}/wall/tcs-visit-2025/3.png`,
        alt: "Photo 3 — TCS visit 2025",
        caption: "Photo 3 — TCS visit 2025",
        width: 775,
        height: 512,
      },
    ],
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
    images: [
      {
        src: `${basePath}/wall/iic-delhi-2026/1.png`,
        alt: "Photo 1 — IIC Delhi 2026",
        caption: "Photo 1 — IIC Delhi",
        width: 687,
        height: 478,
      },
      {
        src: `${basePath}/wall/iic-delhi-2026/2.png`,
        alt: "Photo 2 — IIC Delhi 2026",
        caption: "Photo 2 — IIC Delhi",
        width: 577,
        height: 535,
      },
      {
        src: `${basePath}/wall/iic-delhi-2026/3.png`,
        alt: "Photo 3 — IIC Delhi 2026",
        caption: "Photo 3 — IIC Delhi",
        width: 745,
        height: 476,
      },
      {
        src: `${basePath}/wall/iic-delhi-2026/4.png`,
        alt: "Photo 4 — IIC Delhi 2026",
        caption: "Photo 4 — IIC Delhi",
        width: 710,
        height: 457,
      },
      {
        src: `${basePath}/wall/iic-delhi-2026/5.png`,
        alt: "Photo 5 — IIC Delhi 2026",
        caption: "Photo 5 — IIC Delhi",
        width: 762,
        height: 482,
      },
    ],
  },
  {
    id: "thrive-2024",
    name: "Thrive — 2024",
    tag: "wins",
    date: "2024",
    images: [
      {
        src: `${basePath}/wall/thrive-2024/1.png`,
        alt: "Photo 1 — Thrive 2024",
        caption: "Photo 1 — Thrive 2024",
        width: 762,
        height: 552,
      },
      {
        src: `${basePath}/wall/thrive-2024/2.png`,
        alt: "Photo 2 — Thrive 2024",
        caption: "Photo 2 — Thrive 2024",
        width: 575,
        height: 550,
      },
      {
        src: `${basePath}/wall/thrive-2024/3.png`,
        alt: "Photo 3 — Thrive 2024",
        caption: "Photo 3 — Thrive 2024",
        width: 760,
        height: 563,
      },
      {
        src: `${basePath}/wall/thrive-2024/4.png`,
        alt: "Photo 4 — Thrive 2024",
        caption: "Photo 4 — Thrive 2024",
        width: 580,
        height: 663,
      },
    ],
  },
  {
    id: "innerve-x-hackathon-pune-2026",
    name: "INNERVE X — Pune, 2026",
    tag: "hackathons",
    date: "2026",
    images: [
      {
        src: `${basePath}/wall/innerve-x-hackathon-pune-2026/1.png`,
        alt: "Photo 1 — INNERVE X hackathon",
        caption: "Photo 1 — INNERVE X",
        width: 792,
        height: 497,
      },
      {
        src: `${basePath}/wall/innerve-x-hackathon-pune-2026/2.png`,
        alt: "Photo 2 — INNERVE X hackathon",
        caption: "Photo 2 — INNERVE X",
        width: 782,
        height: 573,
      },
      {
        src: `${basePath}/wall/innerve-x-hackathon-pune-2026/3.png`,
        alt: "Photo 3 — INNERVE X hackathon",
        caption: "Photo 3 — INNERVE X",
        width: 755,
        height: 485,
      },
      {
        src: `${basePath}/wall/innerve-x-hackathon-pune-2026/4.png`,
        alt: "Photo 4 — INNERVE X hackathon",
        caption: "Photo 4 — INNERVE X",
        width: 735,
        height: 460,
      },
    ],
  },
  {
    id: "techexpo-2025",
    name: "TechExpo — 2025",
    tag: "wins",
    date: "2025",
    images: [
      {
        src: `${basePath}/wall/techexpo-2025/1.png`,
        alt: "Photo 1 — TechExpo 2025",
        caption: "Photo 1 — TechExpo 2025",
        width: 513,
        height: 516,
      },
      {
        src: `${basePath}/wall/techexpo-2025/2.png`,
        alt: "Photo 2 — TechExpo 2025",
        caption: "Photo 2 — TechExpo 2025",
        width: 686,
        height: 552,
      },
      {
        src: `${basePath}/wall/techexpo-2025/3.png`,
        alt: "Photo 3 — TechExpo 2025",
        caption: "Photo 3 — TechExpo 2025",
        width: 713,
        height: 453,
      },
      {
        src: `${basePath}/wall/techexpo-2025/4.png`,
        alt: "Photo 4 — TechExpo 2025",
        caption: "Photo 4 — TechExpo 2025",
        width: 752,
        height: 432,
      },
      {
        src: `${basePath}/wall/techexpo-2025/5.png`,
        alt: "Photo 5 — TechExpo 2025",
        caption: "Photo 5 — TechExpo 2025",
        width: 731,
        height: 506,
      },
    ],
  },
];