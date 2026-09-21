"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const rotations = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "rotate-0"];

export default function ProjectGallery({
  images,
  projectTitle,
}: {
  images: string[];
  projectTitle: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  const step = useCallback(
    (dir: number) => {
      setOpen((cur) =>
        cur === null ? null : (cur + dir + images.length) % images.length
      );
    },
    [images.length]
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
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-2xl border-2 border-dashed border-borderish bg-surface-2/60 p-6 sm:p-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-hand text-3xl font-semibold tracking-tight sm:text-4xl">
                The build, in pictures
              </h2>
              <p className="mt-1 text-lg text-muted">
                {images.length} {images.length === 1 ? "photo" : "photos"}{" "}
                pinned to the page — click any to flip through them.
              </p>
            </div>
            <span className="font-mono text-sm uppercase tracking-wider text-faint">
              {projectTitle}
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((src, i) => (
              <motion.button
                key={src}
                type="button"
                onClick={() => setOpen(i)}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: (i % 3) * 0.08, duration: 0.5 }}
                className={`group relative ${rotations[i % rotations.length]} rounded-sm bg-surface p-3 pb-4 text-left shadow-[0_16px_38px_-16px_rgba(60,50,30,0.4)] transition-all duration-300 hover:z-10 hover:rotate-0 hover:scale-[1.03] hover:shadow-[0_24px_50px_-18px_rgba(60,50,30,0.5)]`}
                aria-label={`Open photo ${i + 1} of ${images.length}`}
              >
                <span className="tape" style={{ width: 64, height: 20 }} />
                <span className="block overflow-hidden rounded-sm bg-foreground/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${projectTitle} build photo ${i + 1}`}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </span>
                <span className="mt-3 block text-center font-mono text-xs text-faint">
                  photo {String(i + 1).padStart(2, "0")}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={`Photo ${open + 1} of ${images.length} — ${projectTitle}`}
          >
            <motion.div
              className="absolute inset-0 bg-foreground/55 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(null)}
            />

            <button
              onClick={() => step(-1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-dashed border-background/70 bg-surface/90 font-mono text-xl text-foreground shadow-lg backdrop-blur-sm transition-colors hover:bg-foreground hover:text-background sm:left-8 sm:h-14 sm:w-14"
            >
              ‹
            </button>
            <button
              onClick={() => step(1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-dashed border-background/70 bg-surface/90 font-mono text-xl text-foreground shadow-lg backdrop-blur-sm transition-colors hover:bg-foreground hover:text-background sm:right-8 sm:h-14 sm:w-14"
            >
              ›
            </button>

            <motion.div
              key={open}
              initial={{ opacity: 0, scale: 0.92, rotate: -2, y: 12 }}
              animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 8 }}
              transition={{ duration: 0.3 }}
              className="relative max-h-[82vh] w-full max-w-4xl"
            >
              <div className="mx-auto -rotate-1 rounded-sm bg-surface p-3 pb-5 shadow-[0_40px_90px_-25px_rgba(30,25,15,0.7)] sm:p-4 sm:pb-6">
                <span className="tape" style={{ width: 80, height: 22 }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[open]}
                  alt={`${projectTitle} build photo ${open + 1}`}
                  className="max-h-[64vh] w-full rounded-sm bg-foreground/5 object-contain"
                />
                <div className="mt-3 flex items-center justify-between px-1 font-mono text-sm text-faint">
                  <span>
                    {projectTitle} — photo {String(open + 1).padStart(2, "0")}
                  </span>
                  <span>
                    {open + 1} / {images.length}
                  </span>
                </div>
              </div>
            </motion.div>

            <button
              onClick={() => setOpen(null)}
              aria-label="Close photo viewer"
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed border-ink-red/60 bg-surface/90 font-mono text-xl text-ink-red backdrop-blur-sm transition-colors hover:bg-ink-red hover:text-background sm:right-8 sm:top-8"
            >
              ×
            </button>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}