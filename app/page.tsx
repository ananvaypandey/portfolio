import Link from "next/link";
import Hero from "@/components/Hero";
import Disciplines from "@/components/Disciplines";
import NewsPreview from "@/components/NewsPreview";
import YouTubeBlock from "@/components/YouTubeBlock";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import BlogCard from "@/components/BlogCard";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

const index = [
  {
    num: "01",
    title: "About",
    note: "who I am & what I'm building",
    href: "/about",
  },
  {
    num: "02",
    title: "Skills",
    note: "AI, code & hardware I work with",
    href: "/skills",
  },
  {
    num: "03",
    title: "Projects",
    note: "AI × hardware things I've built",
    href: "/projects",
  },
  {
    num: "04",
    title: "Blog",
    note: "notes & experiments",
    href: "/blog",
  },
  {
    num: "05",
    title: "News",
    note: "articles & interviews",
    href: "/news",
  },
  {
    num: "06",
    title: "Contact",
    note: "have an idea? let's talk",
    href: "/contact",
  },
];

export default function Home() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      <Hero />
      <Disciplines />

      <section id="index" className="py-24 sm:py-28">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeading
            tag="contents"
            title="In this notebook"
            subtitle="Every chapter has its own page. Flip to whichever one you need."
          />
          <div className="space-y-4">
            {index.map((item, i) => (
              <Reveal key={item.href} delay={i * 0.06}>
                <Link
                  href={item.href}
                  className="card-hover group flex items-center gap-6 rounded-2xl border-2 border-dashed border-borderish bg-surface px-6 py-5"
                >
                  <span className="font-hand text-3xl font-semibold text-faint">
                    {item.num}
                  </span>
                  <div className="flex-1">
                    <span className="font-hand text-3xl font-semibold transition-colors group-hover:text-accent">
                      {item.title}
                    </span>
                    <span className="block text-lg text-muted">{item.note}</span>
                  </div>
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-faint transition-all group-hover:translate-x-1 group-hover:text-accent"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="blog-preview" className="py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            tag="writing"
            title="Latest from the blog"
            subtitle="A few of my latest notes — pencil-dropped for your reading pleasure."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.slug} delay={(i % 3) * 0.08}>
                <BlogCard post={post} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-borderish bg-surface/60 px-6 py-2.5 font-hand text-xl text-foreground transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
            >
              View all posts
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

      <NewsPreview />
      <YouTubeBlock />

      <section className="relative py-24 sm:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <svg
            className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 animate-scribble text-borderish"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          >
            <circle cx="50" cy="50" r="47" strokeDasharray="6 7" />
            <circle cx="50" cy="50" r="36" strokeDasharray="6 7" />
            <path d="M14 50h72M50 14v72" strokeDasharray="3 7" />
          </svg>
        </div>
        <Reveal className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-hand text-5xl font-semibold tracking-tight sm:text-6xl">
            Have an idea worth building?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-xl text-muted">
            An AI product, a hardware prototype, an ambitious experiment, or
            simply a crazy idea — let&apos;s talk.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={`mailto:${site.email}`}
              className="rounded-full border-2 border-foreground bg-foreground px-7 py-3 font-hand text-xl text-background shadow-[0_10px_30px_-12px_rgba(60,50,30,0.5)] transition-all hover:-translate-y-0.5 hover:rotate-1 hover:border-accent hover:bg-accent"
            >
              Email me
            </a>
            <Link
              href="/contact"
              className="rounded-full border-2 border-borderish bg-surface/60 px-7 py-3 font-hand text-xl text-foreground transition-all hover:-translate-y-0.5 hover:-rotate-1 hover:border-accent hover:text-accent"
            >
              Contact form
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}