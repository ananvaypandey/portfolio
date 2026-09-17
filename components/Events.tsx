import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const events = [
  {
    name: "Smart India Hackathon",
    desc: "Started on the waitlist, made it into the Grand Finale. The biggest build season yet — the project stays under wraps until the big day.",
  },
  {
    name: "Smart India Hackathon",
    desc: "Participating in SIH 2026 — long hours, hard problems, good people.",
  },
  {
    name: "TechExpo",
    desc: "Winner — 2024 and 2025.",
  },
  {
    name: "ProTech",
    desc: "Winner — 2025.",
  },
  {
    name: "DevFest",
    desc: "Explored Google's developer ecosystem — AI, cloud, and modern software technologies.",
  },
];

export default function Events() {
  return (
    <section id="events" className="relative py-14 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          tag="hackathons & events"
          title="Out in the wild"
          subtitle="Where I go to build fast, break things, and meet people who like building too."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {events.map((e, i) => (
            <Reveal key={`${e.name}-${i}`} delay={(i % 2) * 0.08}>
              <div className="card-hover flex h-full gap-4 rounded-2xl border-2 border-dashed border-borderish bg-surface p-6">
                <span className="mt-1 font-hand text-3xl font-semibold text-ink-red">
                  —
                </span>
                <div>
                  <h3 className="font-hand text-2xl font-semibold">{e.name}</h3>
                  <p className="mt-1 text-lg leading-relaxed text-muted">
                    {e.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}