import Link from "next/link";
import { basePath } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 py-24">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_72%)]" />

      <div className="relative mx-auto w-full max-w-xl">
        <div className="relative -rotate-2 rounded-3xl border-2 border-dashed border-borderish bg-surface p-8 shadow-[0_30px_70px_-25px_rgba(60,50,30,0.45)] sm:p-12">
          <div className="tape" />
          <span className="absolute right-5 top-4 -rotate-3 select-none font-mono text-sm text-faint">
            page 404
          </span>

          <p className="font-hand text-2xl font-semibold text-ink-red">
            Oops — this page got torn out.
          </p>

          <div className="mt-4 flex gap-5">
            <span className="font-hand text-[6.5rem] font-semibold leading-none tracking-tight text-foreground sm:text-[8rem]">
              404
            </span>
            <svg
              aria-hidden
              className="mt-4 h-24 w-24 shrink-0 animate-scribble text-ink-red sm:h-28 sm:w-28"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <circle cx="50" cy="50" r="46" strokeDasharray="5 7" />
              <circle cx="50" cy="50" r="34" strokeDasharray="5 7" />
              <path
                d="M50 12c6 16-8 24 2 40s14 26-8 40"
                strokeDasharray="4 6"
              />
            </svg>
          </div>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
            Whatever scribble you were hunting for isn&apos;t in this notebook
            anymore. You could flip back to the front cover, or try somewhere
            that definitely still exists.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/"
              className="rounded-full border-2 border-foreground bg-foreground px-6 py-2.5 font-hand text-xl text-background shadow-[0_8px_20px_-10px_rgba(60,50,30,0.5)] transition-all hover:-translate-y-0.5 hover:rotate-1 hover:border-accent hover:bg-accent"
            >
              Back to the front page
            </Link>
            <Link
              href="/blog"
              className="rounded-full border-2 border-dashed border-borderish bg-background px-6 py-2.5 font-hand text-xl text-foreground transition-all hover:-translate-y-0.5 hover:-rotate-1 hover:border-accent hover:text-accent"
            >
              Read the blog
            </Link>
          </div>

          <p className="mt-8 border-t-2 border-dashed border-borderish pt-4 font-mono text-xs text-faint">
            {basePath}
          </p>
        </div>
      </div>
    </div>
  );
}