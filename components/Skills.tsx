import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const skillGroups = [
  {
    title: "AI & Machine Learning",
    icon: "AI",
    skills: [
      "Artificial Intelligence",
      "Machine Learning",
      "Generative AI",
      "Large Language Models",
      "Google Gemini",
      "Computer Vision",
      "Multimodal AI",
      "Speech AI",
      "AI Assistants",
      "Edge AI",
    ],
  },
  {
    title: "Programming",
    icon: "Aa",
    skills: ["C++", "Python", "JavaScript", "TypeScript", "SQL"],
  },
  {
    title: "Development",
    icon: "</>",
    skills: [
      "React",
      "React Native",
      "Next.js",
      "Node.js",
      "Express",
      "FastAPI",
      "Tailwind CSS",
      "Expo",
      "Firebase",
      "Firestore",
    ],
  },
  {
    title: "Robotics & Embedded",
    icon: "{}",
    skills: [
      "Raspberry Pi",
      "Arduino",
      "ESP8266",
      "Sensors",
      "Servo Motors",
      "PCA9685",
      "OLED Displays",
      "IoT",
      "Embedded Systems",
    ],
  },
  {
    title: "3D & Interactive Tech",
    icon: "#_",
    skills: [
      "Unreal Engine",
      "MetaHuman",
      "Blender",
      "3D Modeling",
      "Interactive Experiences",
    ],
  },
];

const exploring = [
  "Edge AI",
  "Multimodal AI",
  "AI Agents",
  "Robotics",
  "Human-AI Interaction",
  "Wearable Technology",
  "Computer Vision",
  "Speech Intelligence",
  "Real-Time Systems",
  "AI + Hardware",
  "Privacy-Preserving Intelligence",
];

export default function Skills() {
  return (
    <section id="skills" className="relative py-14 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(49,81,194,0.10), transparent 70%)",
        }}
      />
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          tag="skills"
          title="What I work with"
          subtitle="AI, code, and hardware — the toolbox I reach into every day."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, gi) => (
            <Reveal key={group.title} delay={(gi % 3) * 0.08}>
              <div className="card-hover relative h-full rounded-2xl border-2 border-dashed border-borderish bg-surface p-7">
                <div className="absolute -top-3 right-6 h-4 w-10 rotate-3 rounded-sm bg-[#ffedd2] opacity-80 shadow-sm" />
                <div className="mb-6 flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-dashed border-borderish bg-background font-mono text-base font-semibold text-accent">
                    {group.icon}
                  </span>
                  <h3 className="font-hand text-3xl font-semibold">
                    {group.title}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-dashed border-borderish bg-background px-3 py-1 text-lg text-foreground/90"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14">
          <div className="relative rounded-2xl border-2 border-dashed border-borderish bg-surface p-8">
            <div className="tape" />
            <h3 className="font-hand text-3xl font-semibold text-accent">
              Currently exploring
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {exploring.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-foreground px-3.5 py-1 text-lg text-background"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}