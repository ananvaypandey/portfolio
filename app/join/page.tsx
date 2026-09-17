import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import JoinForm from "@/components/JoinForm";
import { site } from "@/lib/site";

export const metadata = {
  title: "Join — VOIKES Technologies",
  description:
    "Apply to join VOIKES Technologies — engineering students and creators building intelligent AI × hardware products.",
};

const values = [
  { title: "Build, not talk", note: "We prototype first, argue later." },
  { title: "Students welcome", note: "No gatekeeping — hunger over credentials." },
  { title: "AI × hardware", note: "Software and circuits in the same room." },
  { title: "Ship it", note: "Small, fast, real. Every week." },
];

export default function JoinPage() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-6 pt-20 sm:pt-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-hand text-xl text-muted transition-colors hover:text-accent"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          back to home
        </Link>
      </div>

      <section className="relative py-14 sm:py-16">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeading
            tag="careers"
            title="Come build with us"
            subtitle="VOIKES Technologies is where AI, healthcare and hardware stop being separate fields — and start being products. We're scouting builders, not resumes."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={(i % 2) * 0.08}>
                <div className="card-hover flex h-full gap-4 rounded-2xl border-2 border-dashed border-borderish bg-surface p-6">
                  <span className="mt-0.5 font-hand text-3xl font-semibold text-ink-red">
                    —
                  </span>
                  <div>
                    <h3 className="font-hand text-2xl font-semibold">{v.title}</h3>
                    <p className="mt-1 text-lg leading-relaxed text-muted">
                      {v.note}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-14">
            <Reveal className="mb-8">
              <h2 className="inline-block font-hand text-3xl font-semibold tracking-tight sm:text-4xl">
                Apply
              </h2>
            </Reveal>
            <Reveal>
              <div className="card-hover rounded-3xl border-2 border-dashed border-borderish bg-surface p-6 sm:p-10">
                <JoinForm />
                <p className="mt-6 border-t border-dashed border-borderish pt-5 font-mono text-sm text-faint">
                  applications land in {site.email} · we reply to people who
                  reply to questions quickly
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-12 text-center">
            <p className="max-w-xl text-lg text-muted">
              Not applying, but want to work together another way?{" "}{" "}
              <Link
                href="/contact"
className="font-hand text-2xl font-semibold text-accent underline decoration-wavy underline-offset-4 transition-colors hover:text-accent-2"
            >
              Let&apos;s talk
            </Link>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}