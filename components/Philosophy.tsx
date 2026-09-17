import Reveal from "./Reveal";

const points = [
  "Sometimes that means writing code.",
  "Sometimes it means connecting sensors.",
  "Sometimes it means designing a circuit.",
  "Sometimes it means building a physical prototype.",
];

export default function Philosophy() {
  return (
    <section id="philosophy" className="relative py-24 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <svg
          className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 animate-scribble text-borderish"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <circle cx="50" cy="50" r="47" strokeDasharray="6 7" />
          <path d="M14 50h72M50 14v72" strokeDasharray="3 7" />
        </svg>
      </div>
      <Reveal className="relative mx-auto max-w-3xl px-6">
        <div className="relative rounded-2xl border-2 border-dashed border-borderish bg-surface p-10 text-center sm:p-14">
          <div className="tape" />
          <p className="font-hand text-2xl text-muted">my engineering philosophy</p>
          <h2 className="relative mt-3 inline-block font-hand text-5xl font-semibold leading-tight sm:text-6xl">
            I don&apos;t just learn.
            <br />
            <span className="text-accent">I build.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-xl leading-relaxed text-muted">
            I learn best by taking an idea apart, understanding how it works,
            and then building my own version of it.
          </p>
          <ul className="mx-auto mt-6 max-w-md space-y-1">
            {points.map((p) => (
              <li key={p} className="text-lg text-foreground/85">
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-6 font-hand text-2xl font-semibold text-accent">
            The goal is always the same: turn an idea into something real.
          </p>
        </div>
      </Reveal>
    </section>
  );
}