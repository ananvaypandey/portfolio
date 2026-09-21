"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Reveal from "./Reveal";

export interface PressRow {
  slug: string;
  /** Absolute-URL scans of the physical newspaper clipping, in display order. */
  images: string[];
  /** Fallback title when a clip has no captions yet. */
  title: string;
  publication?: string;
  date?: string;
  headline?: string;
}

const rotations = [
  "-rotate-3",
  "rotate-2",
  "-rotate-1",
  "rotate-3",
  "-rotate-2",
  "rotate-1",
];

export default function PressClippings({ rows }: { rows: PressRow[] }) {
  const withImage = useMemo(
    () => rows.filter((row) => row.images.length > 0),
    [rows]
  );
  const [open, setOpen] = useState<number | null>(null);
  const step = useCallback(
    (dir: number) =>
      setOpen((cur) =>
        cur === null
          ? cur
          : (cur + dir + withImage.length) % withImage.length
      ),
    [withImage.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, step]);

  return (
    <section id="press" className="relative py-14 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center gap-4">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-borderish" />
          <h2 className="text-center font-hand text-4xl font-semibold tracking-tight text-foreground">
            clippings from the page
          </h2>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-borderish" />
        </div>
        <p className="mt-2 text-center font-mono text-sm text-faint">
          real paper scans land in <code className="text-accent">public/press/&lt;slug&gt;/</code>
        </p>

        <div className="mt-14">
          {withImage.length === 0 ? (
            <div className="mx-auto max-w-2xl">
              <div className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-2xl border-2 border-dashed border-borderish bg-surface p-10 text-center">
                <svg
                  aria-hidden
                  className="h-12 w-12 animate-scribble text-faint"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                >
                  <rect x="3" y="8" width="18" height="12" rx="1" strokeDasharray="3 3" />
                  <path d="M7 4h10l1 4" strokeDasharray="3 3" />
                </svg>
                <p className="mt-6 font-hand text-3xl font-semibold text-muted">
                  clippings coming soon
                </p>
                <p className="mt-2 text-lg text-muted">
                  Scan your physical press clippings and drop them into{" "}
                  <code className="font-mono text-accent">public/press/&lt;slug&gt;/</code>{" "}
                  — they&apos;ll be taped up here at the next build.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {withImage.map((row, i) => (
                <Reveal key={row.slug} delay={(i % 3) * 0.08}>
                  <motion.button
                    onClick={() => setOpen(i)}
                    initial={{ opacity: 0, y: 26 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: (i % 3) * 0.08, duration: 0.5 }}
                    className={`group relative block w-full rounded-sm bg-surface p-3 pb-4 text-left shadow-[0_16px_38px_-16px_rgba(60,50,30,0.4)] transition-all hover:z-10 hover:rotate-0 hover:scale-105 ${rotations[i % rotations.length]}`}
                    aria-label={`Open ${row.title} press clipping`}
                  >
                    <span
                      className="absolute -top-3 left-1/2 h-5 w-20 -translate-x-1/2 -rotate-2 rounded-sm bg-[rgba(255,241,190,0.85)] shadow-[0_2px_6px_rgba(60,50,30,0.18)]"
                      aria-hidden
                    />
                    <span className="block overflow-hidden rounded-sm bg-foreground/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={row.images[0]}
                        alt={`${row.title} scanned press clipping`}
                        loading="lazy"
                        className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </span>
                    <span className="mt-2 block text-center font-hand text-xl text-foreground">
                      {row.title}
                    </span>
                  </motion.button>
                </Reveal>
              ))}
            </div>
          )}

          <AnimatePresence>
            {open !== null && withImage[open] && (
              <motion.div
                key="press-lightbox"
                className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
                role="dialog"
                aria-modal="true"
                aria-label={`${withImage[open].title} press clipping — ${open + 1} of ${withImage.length}`}
              >
                <motion.div
                  className="absolute inset-0 bg-foreground/45 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => setOpen(null)}
                />

                <motion.div
                  key={open}
                  initial={{ opacity: 0, scale: 0.94, rotate: -2, y: 18 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="relative max-w-4xl"
                >
                  <div className="rounded-sm bg-surface p-3 pb-5 shadow-[0_40px_90px_-25px_rgba(60,50,30,0.6)] sm:p-4 sm:pb-6">
                    <span
                      className="absolute -top-3.5 left-1/2 h-5 w-16 -translate-x-1/2 -rotate-2 rounded-sm bg-[rgba(255,241,190,0.6)] sm:h-6 sm:w-20"
                      aria-hidden
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={withImage[open].images[0]}
                      alt={`${withImage[open].title} press clipping`}
                      className="max-h-[70vh] w-full rounded-sm bg-foreground/5 object-contain"
                    />
                    <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
                      <span className="font-hand text-2xl font-semibold text-foreground">
                        {withImage[open].title}
                      </span>
                      <span className="ml-auto font-mono text-sm text-faint">
                        {open + 1} / {withImage.length}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => step(-1)}
                    aria-label="Previous clipping"
                    className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-dashed border-borderish bg-surface/90 font-mono text-xl text-foreground shadow-lg backdrop-blur-sm transition-colors hover:bg-foreground hover:text-background sm:left-8"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => step(1)}
                    aria-label="Next clipping"
                    className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-dashed border-borderish bg-surface/90 font-mono text-xl text-foreground shadow-lg backdrop-blur-sm transition-colors hover:bg-foreground hover:text-background sm:right-8"
                  >
                    ›
                  </button>
                  <button
                    onClick={() => setOpen(null)}
                    aria-label="Close clipping viewer"
                    className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed border-borderish bg-surface/90 text-foreground shadow-lg backdrop-blur-sm transition-colors hover:bg-foreground hover:text-background sm:top-5"
                  >
                    ×
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
