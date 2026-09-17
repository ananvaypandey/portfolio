import Link from "next/link";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { newsArticles } from "@/lib/news";
import { site } from "@/lib/site";

export default function News() {
  return (
    <section id="news" className="relative py-24 sm:py-28">
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
          tag="news & press"
          title="In the news"
          subtitle="Writing, interviews, and coverage — collected in one place."
        />

        <div className="grid gap-6">
          {newsArticles.map((a, i) => (
            <Reveal key={`${a.source}-${i}`} delay={i * 0.08}>
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card-hover relative block rounded-2xl border-2 border-dashed border-borderish bg-surface p-8 transition-transform hover:-rotate-0.5"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-foreground px-3 py-1 font-mono text-sm text-background">
                    {a.source}
                  </span>
                  <span className="rounded-full border border-dashed border-borderish bg-background px-3 py-1 font-mono text-sm text-faint">
                    {a.kind}
                  </span>
                  <span className="ml-auto font-mono text-sm text-faint">
                    {a.date}
                  </span>
                </div>
                <h3 className="mt-4 font-hand text-3xl font-semibold leading-snug text-foreground transition-colors group-hover:text-accent sm:text-4xl">
                  {a.title}
                </h3>
                <p className="mt-3 text-xl leading-relaxed text-muted">
                  {a.excerpt}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 font-hand text-xl text-accent">
                  Read article
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17 17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12">
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border-2 border-dashed border-borderish bg-surface px-8 py-6 text-center sm:flex-row sm:text-left">
            <div>
              <p className="font-hand text-2xl font-semibold text-accent">
                Follow the story on Medium
              </p>
              <p className="text-lg text-muted">
                Essays on building VOIKES, AI × hardware experiments, and life
                as a student-founder.
              </p>
            </div>
            <Link
              href={site.socials.medium}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-full border-2 border-foreground bg-foreground px-6 py-2.5 font-hand text-xl text-background transition-all hover:-translate-y-0.5 hover:border-accent hover:bg-accent"
            >
              medium.com/@ananvaypandey29
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}