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
  width = 400,
  height = 300
): WallImage => ({ src: `${basePath}/wall/${file}`, alt, caption, width, height });

export const wallAlbums: WallAlbum[] = [
  {
    id: "techexpo-2024",
    name: "TechExpo — 2024",
    tag: "wins",
    date: "2024",
    images: [
      img("award-stage.svg", "Winner on stage illustration", "walked up, arms up — winner"),
      img("tech-expo-2025.svg", "Trophy illustration for TechExpo", "the trophy moment"),
      img("expo-booth.svg", "Expo booth illustration", "our booth, day one"),
      img("devfest.svg", "Stage and crowd illustration at the expo", "crowd around the stages"),
      img("team-group.svg", "Group of people illustration", "the crew, day two"),
    ],
  },
  {
    id: "sih-2025",
    name: "SIH — 2025",
    tag: "hackathons",
    date: "2025",
    images: [
      img("sih-grand-finale.svg", "Hackathon banner illustration for SIH", "waitlisted, then in it — Grand Finale", 360, 460),
      img("hackathon-night.svg", "Late night coding illustration", "2 AM problem sets"),
      img("hackathon-submit.svg", "Laptop with submit check illustration", "the submit moment"),
      img("whiteboard.svg", "Whiteboard with sketches illustration", "sketching the architecture"),
      img("team-bench.svg", "Messy desk illustration", "the bench, mid-sprint"),
    ],
  },
  {
    id: "protech-2025",
    name: "ProTech — 2025",
    tag: "wins",
    date: "2025",
    images: [
      img("protech-2025.svg", "Podium and medal illustration for ProTech", "winner, ProTech"),
      img("award-stage.svg", "Winner on stage illustration", "the podium walk"),
      img("team-group.svg", "Group of people illustration", "the crew after the podium"),
      img("devfest.svg", "Stage and crowd illustration", "lights up in the hall"),
      img("studio-day.svg", "Camera on a tripod illustration", "media corner after the win", 360, 460),
    ],
  },
  {
    id: "tcs-visit-2025",
    name: "TCS visit — 2025",
    tag: "collabs",
    date: "2025",
    images: [
      img("tcs-visit.svg", "Office building illustration for a TCS visit", "campus tour — TCS"),
      img("tcs-campus.svg", "Campus walk illustration", "sneak peek at the campus"),
      img("tcs-meeting.svg", "Meeting room illustration", "inside the meeting room"),
      img("team-group.svg", "Group of people illustration", "checking in for the tour"),
      img("studio-day.svg", "Camera on a tripod illustration", "capturing the tour", 360, 460),
    ],
  },
  {
    id: "company-birthday-2026",
    name: "Company birthday — 2026",
    tag: "milestones",
    date: "2026",
    images: [
      img("company-birthday.svg", "Birthday cake and balloons illustration", "the cake that keeps the bench alive"),
      img("party.svg", "Confetti and balloons illustration", "confetti and chaos"),
      img("team-group.svg", "Group of people illustration", "everyone who made it real"),
      img("team-bench.svg", "Messy desk illustration", "back where it started"),
      img("studio-day.svg", "Camera on a tripod illustration", "a celebration shoot", 360, 460),
    ],
  },
];