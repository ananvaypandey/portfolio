import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const disciplines = [
  {
    icon: "AI",
    title: "Artificial Intelligence",
    desc: "AI assistants, LLM applications, multimodal systems, computer vision, speech AI, and edge intelligence.",
  },
  {
    icon: "AT",
    title: "Assistive Technology",
    desc: "Technology designed to improve accessibility, communication, safety, and everyday human interaction.",
  },
  {
    icon: "RB",
    title: "Robotics",
    desc: "Physical systems combining electronics, embedded programming, sensors, actuators, and intelligent software.",
  },
  {
    icon: "FS",
    title: "Full-Stack Products",
    desc: "End-to-end applications combining modern interfaces, APIs, databases, authentication, and AI.",
  },
  {
    icon: "EX",
    title: "Experimental Technology",
    desc: "Rapid prototypes and unconventional ideas exploring what happens when emerging technologies combine.",
  },
];

export default function Disciplines() {
  return (
    <section id="what-i-build" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          tag="what I build"
          title="Where I experiment"
          subtitle="Five spaces I keep returning to — from pure AI to things you can hold."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {disciplines.map((d, i) => (
            <Reveal key={d.title} delay={(i % 3) * 0.08}>
              <div className="card-hover relative h-full rounded-2xl border-2 border-dashed border-borderish bg-surface p-7">
                <div className="absolute -top-3 left-6 h-4 w-10 -rotate-3 rounded-sm bg-[#ffedd2] opacity-80 shadow-sm" />
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-dashed border-borderish bg-background font-mono text-base font-semibold text-accent">
                    {d.icon}
                  </span>
                  <h3 className="font-hand text-3xl font-semibold">{d.title}</h3>
                </div>
                <p className="text-lg leading-relaxed text-muted">{d.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}