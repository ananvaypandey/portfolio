import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import FeaturedProject from "./FeaturedProject";
import ProjectCard, { type Project } from "./ProjectCard";

const projects: Project[] = [
  {
    title: "VOKA",
    description:
      "An AI companion for mental well-being, physical safety, and natural human-AI interaction — combining an interactive avatar with hardware sensing.",
    tags: ["Raspberry Pi 5", "Unreal Engine", "MetaHuman", "FastAPI", "Firebase", "ESP8266", "MPU6050"],
    gradient: "from-[#f0ebe0] to-[#e2d6c0]",
    monogram: "VOKA",
  },
  {
    title: "MYRA",
    description:
      "An AI personal fashion assistant that understands your profile, wardrobe, and the weather to give personalized outfit advice.",
    tags: ["React Native", "Expo", "Firebase", "Gemini Vision"],
    gradient: "from-[#f3ece0] to-[#e7dcc8]",
    monogram: "MYRA",
  },
  {
    title: "VOXLENS",
    description:
      "Smart-glasses concept that converts spoken communication into real-time visual text through a small OLED heads-up interface.",
    tags: ["Speech-to-Text", "Wearables", "Embedded Systems", "HCI"],
    gradient: "from-[#eef0db] to-[#dce2bd]",
    monogram: "VOX",
  },
  {
    title: "VOSIGN",
    description:
      "A smart glove that reads hand gestures with flex sensors and translates movement into speech.",
    tags: ["Flex Sensors", "Embedded Systems", "Gesture Recognition"],
    gradient: "from-[#e4ece9] to-[#cbe0d8]",
    monogram: "VOs",
  },
  {
    title: "VOZO",
    description:
      "Offline peer-to-peer messaging between nearby Android devices using Google's Nearby Connections API.",
    tags: ["Android", "Nearby Connections", "P2P Networking"],
    gradient: "from-[#f6eadc] to-[#ecd6bd]",
    monogram: "VOZO",
  },
  {
    title: "VOIKES",
    description:
      "Technology startup building intelligent products at the intersection of AI, assistive tech, healthcare, robotics, and human interaction.",
    tags: ["Startup", "MedTech", "AI", "Robotics"],
    gradient: "from-[#f6efe2] to-[#eddfc7]",
    monogram: "VOIK",
    demo: "https://www.instagram.com/voikes.technologies/",
    demoLabel: "Company",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          tag="projects"
          title="Things I've built"
          subtitle="AI × hardware experiments and products — from idea to prototype."
        />

        <FeaturedProject />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal key={project.title} delay={(i % 3) * 0.08}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}