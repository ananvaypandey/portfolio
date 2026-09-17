import { basePath } from "./site";

export interface WallEntry {
  id: string;
  src: string;
  alt: string;
  caption: string;
  tag: string;
  date: string;
  width: number;
  height: number;
}

export const wallEntries: WallEntry[] = [
  {
    id: "tech-expo-2025",
    src: `${basePath}/wall/tech-expo-2025.svg`,
    alt: "Trophy illustration for Tech Expo 2025",
    caption: "Tech Expo — winner",
    tag: "wins",
    date: "2025",
    width: 400,
    height: 300,
  },
  {
    id: "sih-grand-finale",
    src: `${basePath}/wall/sih-grand-finale.svg`,
    alt: "Illustration of a hackathon banner for SIH Grand Finale",
    caption: "SIH Grand Finale — waitlisted, then in it",
    tag: "hackathons",
    date: "2026",
    width: 360,
    height: 460,
  },
  {
    id: "protech-2025",
    src: `${basePath}/wall/protech-2025.svg`,
    alt: "Podium and medal illustration for ProTech 2025",
    caption: "ProTech — winner",
    tag: "wins",
    date: "2025",
    width: 400,
    height: 300,
  },
  {
    id: "ngo-collab",
    src: `${basePath}/wall/ngo-collab.svg`,
    alt: "Hands around a heart illustration for an NGO collaboration",
    caption: "An afternoon with an NGO",
    tag: "collabs",
    date: "2026",
    width: 360,
    height: 460,
  },
  {
    id: "studio-day",
    src: `${basePath}/wall/studio-day.svg`,
    alt: "Camera on a tripod illustration for studio day",
    caption: "Studio day — shooting on ANANVAY IO",
    tag: "youtube",
    date: "2026",
    width: 360,
    height: 460,
  },
  {
    id: "devfest",
    src: `${basePath}/wall/devfest.svg`,
    alt: "Stage and laptop illustration for DevFest",
    caption: "DevFest — the developer ecosystem beat",
    tag: "events",
    date: "2025",
    width: 400,
    height: 300,
  },
  {
    id: "robotics-lab",
    src: `${basePath}/wall/robotics-lab.svg`,
    alt: "Robot arm with a chip illustration in the lab",
    caption: "Robotics lab — gearing up",
    tag: "builds",
    date: "2026",
    width: 400,
    height: 300,
  },
  {
    id: "team-bench",
    src: `${basePath}/wall/team-bench.svg`,
    alt: "Messy desk illustration",
    caption: "The bench — where it happens",
    tag: "behind the scenes",
    date: "2026",
    width: 400,
    height: 300,
  },
];