import Link from "next/link";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { newsArticles } from "@/lib/news";

export default function NewsPreview() {
  return (
    <section id="news-preview" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          tag="news"
          title="Latest from the news"
          subtitle="Coverage, features & essays — my story as it gets told."
        />

        <div className="grid gap-6 sm:grid-cols-2">
          {newsArticles.slice(0, 2).map((a, i) => (
            <Reveal key={`${a.source}-${i}`} delay={(i % 2) * 0.08}>
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card-hover relative flex h-full flex-col rounded-2xl border-2 border-dashed border-borderish bg-surface p-6"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-foreground px-3 py-0.5 font-mono text-sm text-background">
                    {a.source}
                  </span>
                  <span className="rounded-full border border-dashed border-borderish bg-background px-3 py-0.5 font-mono text-sm text-faint">
                    {a.kind}
                  </span>
                  <span className="ml-auto font-mono text-sm text-faint">
                    {a.date}
                  </span>
                </div>
                <h3 className="mt-4 font-hand text-2xl font-semibold leading-snug sm:text-3xl">
                  {a.title}
                </h3>
                <p className="mt-2 flex-1 text-lg leading-relaxed text-muted">
                  {a.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 font-hand text-xl text-accent">
                  Read article
                  <svg
                    width="15"
                    height="15"
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

        <Reveal className="mt-10 text-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-borderish bg-surface/60 px-6 py-2.5 font-hand text-xl text-foreground transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
          >
            View all news
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}