import Reveal from "./Reveal";

const whatItDoes = [
  "AI health assistant",
  "Wearable health-band hardware system",
  "Real-time health monitoring",
  "Edge AI & light AI models",
  "Robotic smart assistance",
  "Caregiver & doctor connectivity",
  "Daily wellness, medication, and emergency support",
];

const tech = [
  "Raspberry Pi",
  "Arduino Uno",
  "16 Servo Motors",
  "PCA9685",
  "5.5\" Display",
  "3D-Printed Body",
  "Wearable Health Band",
  "Sensors",
  "Embedded Systems",
  "Edge AI",
];

export default function FeaturedProject() {
  return (
    <Reveal>
      <article className="relative overflow-hidden rounded-3xl border-2 border-borderish bg-surface shadow-[0_25px_60px_-25px_rgba(60,50,30,0.45)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/[0.07] via-transparent to-transparent"
        />
        <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-foreground px-3 py-1 font-mono text-sm text-background">
                featured
              </span>
            </div>

            <h3 className="mt-6 font-hand text-5xl font-semibold tracking-tight text-accent sm:text-6xl">
              VIONEX · Personal Health Companion
            </h3>
            <p className="font-hand text-2xl text-foreground sm:text-3xl">
              AI × Healthcare × Robotics × Edge Computing
            </p>

            <p className="mt-5 text-xl leading-relaxed text-foreground/85">
              An AI-powered personal health companion that combines a wearable
              health band, edge-based AI monitoring, and a robotic assistant
              into one connected care system. It monitors vitals, supports
              daily wellness, and keeps caregivers and doctors in the loop.
            </p>

            <blockquote className="mt-6 border-l-4 border-ink-red bg-background/60 px-5 py-4 font-hand text-2xl italic leading-snug text-foreground/80">
              “Healthcare support shouldn&apos;t begin only when an emergency
              happens.”
            </blockquote>

            <div className="mt-8 flex flex-wrap gap-2">
              {tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-dashed border-borderish bg-background px-3 py-1 font-mono text-sm text-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="relative rounded-2xl border-2 border-dashed border-borderish bg-gradient-to-br from-[#e8eaff] to-[#d5d9f5] p-8">
              <div className="tape" />
              <p className="font-hand text-3xl font-semibold text-accent">
                What VIONEX does
              </p>
              <ul className="mt-4 space-y-2.5">
                {whatItDoes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-lg text-foreground/85"
                  >
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}