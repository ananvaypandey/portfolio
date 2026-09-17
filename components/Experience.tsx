import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const jobs = [
  {
    role: "Founder / Technology Builder",
    company: "VOIKES Technologies Pvt. Ltd.",
    period: "Present",
    desc: "Building AI-powered products across MedTech, assistive technology, robotics, software, and embedded systems — working across the full journey from idea and research to prototyping, hardware integration, and product development.",
  },
];

export default function Experience() {
  return (
    <section id="experience" className="relative py-14 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          tag="experience"
          title="Where I've been"
          subtitle="Building things, on my own and with teams."
        />

        <div className="relative space-y-12 border-l-2 border-dashed border-borderish pl-8">
          {jobs.map((job, i) => (
            <Reveal key={job.company} delay={i * 0.1}>
              <div className="relative">
                <span className="absolute -left-[2.6rem] top-1.5 grid h-5 w-5 place-items-center rounded-full border-2 border-accent bg-background">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                </span>
                <div className="card-hover relative rounded-2xl border-2 border-dashed border-borderish bg-surface p-7">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="font-hand text-3xl font-semibold text-accent">
                      {job.role}
                    </h3>
                    <span className="rounded-full border border-borderish bg-background px-3 py-0.5 font-mono text-sm text-faint">
                      {job.period}
                    </span>
                  </div>
                  <div className="mt-1 font-hand text-2xl text-foreground">
                    {job.company}
                  </div>
                  <p className="mt-3 text-lg leading-relaxed text-muted">
                    {job.desc}
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