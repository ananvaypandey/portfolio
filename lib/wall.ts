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
    images: [],
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
];