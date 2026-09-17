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

const img = (
  file: string,
  alt: string,
  caption: string,
  width: number,
  height: number
): WallImage => ({ src: `${basePath}/wall/${file}`, alt, caption, width, height });

export const wallAlbums: WallAlbum[] = [
  {
    id: "techexpo-2024",
    name: "TechExpo — 2024",
    tag: "wins",
    date: "2024",
    images: [
      img(
        "tech-expo-2025.svg",
        "Trophy illustration for TechExpo",
        "the trophy moment — winner",
        400,
        300
      ),
      img(
        "expo-booth.svg",
        "Expo booth illustration",
        "our booth, day one",
        400,
        300
      ),
      img(
        "devfest.svg",
        "Stage and crowd illustration at the expo",
        "crowd around the stages",
        400,
        300
      ),
    ],
  },
  {
    id: "sih-2025",
    name: "SIH — 2025",
    tag: "hackathons",
    date: "2025",
    images: [
      img(
        "sih-grand-finale.svg",
        "Hackathon banner illustration for SIH",
        "waitlisted, then in it — Grand Finale",
        360,
        460
      ),
      img(
        "hackathon-night.svg",
        "Late night coding illustration",
        "2 AM problem sets",
        400,
        300
      ),
      img(
        "team-bench.svg",
        "Messy desk illustration",
        "the bench, mid-sprint",
        400,
        300
      ),
      img(
        "robotics-lab.svg",
        "Robot arm illustration in the lab",
        "hardware held up",
        400,
        300
      ),
    ],
  },
  {
    id: "protech-2025",
    name: "ProTech — 2025",
    tag: "wins",
    date: "2025",
    images: [
      img(
        "protech-2025.svg",
        "Podium and medal illustration for ProTech",
        "winner, ProTech",
        400,
        300
      ),
      img(
        "team-group.svg",
        "Group of people illustration",
        "the crew after the podium",
        400,
        300
      ),
    ],
  },
  {
    id: "tcs-visit-2025",
    name: "TCS visit — 2025",
    tag: "collabs",
    date: "2025",
    images: [
      img(
        "tcs-visit.svg",
        "Office building illustration for a TCS visit",
        "campus tour — TCS",
        400,
        300
      ),
      img(
        "team-group.svg",
        "Group of people illustration",
        "checking into the tour",
        400,
        300
      ),
    ],
  },
  {
    id: "company-birthday-2026",
    name: "Company birthday — 2026",
    tag: "milestones",
    date: "2026",
    images: [
      img(
        "company-birthday.svg",
        "Birthday cake and balloons illustration",
        "the cake that keeps the bench alive",
        400,
        300
      ),
      img(
        "team-group.svg",
        "Group of people illustration",
        "everyone who made it real",
        400,
        300
      ),
      img(
        "team-bench.svg",
        "Messy desk illustration",
        "back where it started",
        400,
        300
      ),
      img(
        "studio-day.svg",
        "Camera on tripod illustration",
        "a celebration shoot",
        360,
        460
      ),
      img(
        "ngo-collab.svg",
        "Hands around a heart illustration",
        "still finding time to give back",
        360,
        460
      ),
    ],
  },
];