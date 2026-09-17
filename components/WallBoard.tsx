"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, type Variants } from "motion/react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { wallEntries } from "@/lib/wall";
import { site } from "@/lib/site";

const tapeReveal: Variants = {
  initial: { opacity: 0, x: -36, y: -8, rotate: -14, scale: 1 },
  animate: {
    opacity: [0, 1, 1, 0],
    x: [-36, 0, 0, 110],
    y: [-8, 0, 0, -32],
    rotate: [-14, 8, 8, 30],
    scale: [1, 1, 1, 0.6],
    transition: { times: [0, 0.15, 0.5, 1], duration: 0.9, ease: "easeOut" },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const paperReveal: Variants = {
  initial: { opacity: 0, scale: 0.9, rotate: -4, y: 30 },
  animate: {
    opacity: [0, 1, 1],
    scale: [0.9, 1.02, 1],
    rotate: [-4, 1, 0],
    y: [30, 0, 0],
    transition: { times: [0, 0.5, 1], duration: 0.7, ease: "easeOut", delay: 0.1 },
  },
  exit: { opacity: 0, scale: 0.94, rotate: 2, transition: { duration: 0.28 } },
};

export default function WallBoard() {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight")
        setActive((a) => (a === null ? a : (a + 1) % wallEntries.length));
      if (e.key === "ArrowLeft")
        setActive((a) =>
          a === null ? a : (a - 1 + wallEntries.length) % wallEntries.length
        );
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <section id="wall" className="relative py-14 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          tag="the pinboard"
          title="The Pinboard"
          subtitle="Events, collabs, wins and the places the notebook went — pinned up as they happen."
        />

        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {wallEntries.map((entry, i) => (
            <Reveal
              key={entry.id}
              delay={(i % 3) * 0.06}
              className="mb-5 break-inside-avoid"
            >
              <button
                onClick={() => setActive(i)}
                aria-label={`View ${entry.caption}`}
                className={`group relative block w-full text-left transition-transform duration-300 ease-out hover:-translate-y-1 ${
                  i % 2 === 0 ? "-rotate-1 hover:rotate-0" : "rotate-1 hover:rotate-0"
                }`}
              >
                <div className="relative rounded-2xl border-2 border-borderish bg-surface p-2.5 shadow-[0_14px_34px_-16px_rgba(60,50,30,0.45)] transition-colors group-hover:border-accent/50">
                  <span className="absolute -top-3 left-1/2 h-5 w-16 -translate-x-1/2 rotate-[-2deg] rounded-sm bg-[rgba(255,241,190,0.85)] shadow-[0_2px_5px_rgba(60,50,30,0.14)]" />
                  <span
                    className="absolute right-3 top-3 h-3.5 w-3.5 rounded-full border-2 border-borderish bg-ink-red shadow-[0_1px_3px_rgba(60,50,30,0.3)]"
                    aria-hidden
                  />
                  <Image
                    src={entry.src}
                    alt={entry.alt}
                    width={entry.width}
                    height={entry.height}
                    className="h-auto w-full rounded-lg border border-dashed border-borderish bg-background"
                  />
                </div>

                <div className="mt-2.5 px-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-foreground px-2.5 py-0.5 font-mono text-xs text-background">
                      {entry.tag}
                    </span>
                    <span className="font-mono text-xs text-faint">
                      {entry.date}
                    </span>
                  </div>
                  <p className="mt-1.5 font-hand text-xl font-semibold leading-snug text-foreground">
                    {entry.caption}
                  </p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 text-center">
          <p className="mx-auto max-w-xl text-lg text-muted">
            Spotted the notebook or VOIKES out in the wild? Tag us — best
            frames end up on this wall.
          </p>
          <a
            href={site.socials.company?.instagram ?? site.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-dashed border-borderish bg-surface/60 px-6 py-2.5 font-hand text-xl text-foreground transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
          >
            @voikes.technologies
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
          </a>
        </Reveal>
      </div>

      <AnimatePresence>
        {active !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={`${wallEntries[active].caption} — enlarged`}
          >
            <motion.div
              className="absolute inset-0 bg-foreground/45 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setActive(null)}
            />

            <motion.div
              variants={paperReveal}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-3xl border-2 border-dashed border-borderish bg-surface p-4 shadow-[0_40px_90px_-25px_rgba(60,50,30,0.6)] sm:p-8"
            >
              <motion.span
                variants={tapeReveal}
                aria-hidden
                className="absolute -top-4 left-10 z-10 h-7 w-28 rounded-sm border border-dashed border-[rgba(60,50,30,0.35)] bg-[rgba(255,241,190,0.85)] shadow-[0_2px_6px_rgba(60,50,30,0.15)]"
              />

              <button
                onClick={() => setActive(null)}
                aria-label="Close photo"
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-ink-red/60 bg-surface font-mono text-xl text-ink-red transition-colors hover:bg-ink-red hover:text-background"
              >
                ×
              </button>

              <button
                onClick={() =>
                  setActive(
                    () =>
                      (active - 1 + wallEntries.length) % wallEntries.length
                  )
                }
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-dashed border-borderish bg-surface text-foreground transition-all hover:border-accent hover:text-accent sm:left-5"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={() => setActive(() => (active + 1) % wallEntries.length)}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-dashed border-borderish bg-surface text-foreground transition-all hover:border-accent hover:text-accent sm:right-5"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>

              <Image
                src={wallEntries[active].src}
                alt={wallEntries[active].alt}
                width={wallEntries[active].width}
                height={wallEntries[active].height}
                className="h-auto w-full rounded-2xl border-2 border-dashed border-borderish bg-background"
              />
              <div className="mt-4 flex flex-wrap items-center gap-2.5 px-1">
                <span className="rounded-full bg-foreground px-3 py-0.5 font-mono text-sm text-background">
                  {wallEntries[active].tag}
                </span>
                <span className="font-mono text-sm text-faint">
                  {wallEntries[active].date}
                </span>
                <p className="w-full font-hand text-2xl font-semibold leading-snug text-foreground sm:w-auto">
                  {wallEntries[active].caption}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}