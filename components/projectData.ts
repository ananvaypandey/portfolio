export interface Project {
  slug: string;
  title: string;
  description: string;
  what: string;
  why: string;
  tags: string[];
  gradient: string;
  monogram: string;
  demo?: string;
  demoLabel?: string;
  source?: string;
}

const projectsData: Project[] = [
  {
    slug: "voka",
    title: "VOKA — AI Companion for Mental Well-Being",
    description:
      "An AI companion for mental well-being, physical safety, and natural human-AI interaction — combining an interactive avatar with hardware sensing.",
    what: "VOKA is an AI companion built for mental well-being and everyday safety. It pairs a lifelike interactive avatar with hardware sensing — so it can feel when you're present and respond the way a person would, not the way a chatbot does.",
    why: "Digital assistants are cold. VOKA exists because AI should understand context — your mood, your presence, your routine — and become something you actually open up to when you need it most.",
    tags: ["Raspberry Pi 5", "Unreal Engine", "MetaHuman", "FastAPI", "Firebase", "ESP8266", "MPU6050"],
    gradient: "from-[#f0ebe0] to-[#e2d6c0]",
    monogram: "VOKA",
    source: "https://github.com/ananvaypandey/VOKA",
  },
  {
    slug: "voxlens",
    title: "VOXLENS — Smart Glasses with Real-Time Captions",
    description:
      "Smart-glasses concept that converts spoken communication into real-time visual text through a small OLED heads-up interface.",
    what: "VOXLENS is a pair of smart glasses that turn spoken words into live text right in front of your eyes, through a tiny heads-up display.",
    why: "It exists for the noisy, unfair world — captions when you can't hear, subtitles when you can't listen, and a hands-free way to never miss a word. Accessibility and convenience in one frame.",
    tags: ["Speech-to-Text", "Wearables", "Embedded Systems", "HCI"],
    gradient: "from-[#eef0db] to-[#dce2bd]",
    monogram: "VOXLENS",
    source: "https://github.com/ananvaypandey/VOXLENS",
  },
  {
    slug: "vosign",
    title: "VOSIGN — Smart Glove for Speech",
    description:
      "A smart glove that reads hand gestures with flex sensors and translates movement into speech.",
    what: "VOSIGN is a smart glove that reads hand gestures with flex sensors and speaks what you sign, out loud.",
    why: "It exists to give people who communicate through sign language a bridge into spoken conversation — a way to be heard without needing a translator in the room.",
    tags: ["Flex Sensors", "Embedded Systems", "Gesture Recognition"],
    gradient: "from-[#e4ece9] to-[#cbe0d8]",
    monogram: "VOSIGN",
  },
  {
    slug: "vozo",
    title: "VOZO — Offline Peer-to-Peer Messenger",
    description:
      "Offline peer-to-peer messaging between nearby Android devices using Google's Nearby Connections API.",
    what: "VOZO is an offline messenger that lets two phones talk directly — no internet, no server, just nearby devices finding each other.",
    why: "It exists for the moments the network drops: events, travel, emergencies — anywhere a message still needs to get through.",
    tags: ["Android", "Nearby Connections", "P2P Networking"],
    gradient: "from-[#f6eadc] to-[#ecd6bd]",
    monogram: "VOZO",
    source: "https://github.com/ananvaypandey/VOZO",
  },
];

export default projectsData;