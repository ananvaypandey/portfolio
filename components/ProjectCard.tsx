"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, type Variants } from "motion/react";

export interface Project {
  slug: string;
  title: string;
  description: string;
  what: string;
  why: string;
  tags: string[];
  gradient: string;
  monogram: string;
  demo?: string;
  demoLabel?: string;
  source?: string;
}

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
  initial: { opacity: 0, scale: 0.88, rotate: -5, y: 40 },
  animate: {
    opacity: [0, 1, 1],
    scale: [0.88, 1.03, 1],
    rotate: [-5, 1.5, 0],
    y: [40, 0, 0],
    transition: { times: [0, 0.5, 1], duration: 0.7, ease: "easeOut", delay: 0.1 },
  },
  exit: { opacity: 0, scale: 0.94, rotate: 2, transition: { duration: 0.28 } },
};

export default function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${
      -y * 6
    }deg) translateY(-4px)`;
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform =
      "perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0)";
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-borderish bg-surface transition-transform duration-300 ease-out will-change-transform"
        style={{
          transformStyle: "preserve-3d",
          transition:
            "transform 0.3s cubic-bezier(0.22,1,0.36,1), border-color 0.3s ease, box-shadow 0.3s ease",
        }}
        onPointerEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(49,81,194,0.55)";
          e.currentTarget.style.boxShadow =
            "0 22px 45px -18px rgba(60,50,30,0.4)";
        }}
        onPointerLeave={(e) => {
          e.currentTarget.style.borderColor = "";
          e.currentTarget.style.boxShadow = "";
        }}
      >
        <div className="tape" />

        <div
          className={`relative flex h-36 items-center justify-center overflow-hidden border-b-2 border-dashed border-borderish bg-gradient-to-br ${project.gradient}`}
        >
          <div className="bg-grid absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_78%)]" />
          <span
            className={`relative -rotate-3 font-hand font-semibold text-foreground/85 transition-transform duration-500 group-hover:rotate-0 group-hover:text-accent ${
              project.monogram.length > 5 ? "text-4xl sm:text-5xl" : "text-7xl"
            }`}
          >
            {project.monogram}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-hand text-3xl font-semibold tracking-tight">
            {project.title}
          </h3>
          <p className="mt-2 flex-1 text-lg leading-relaxed text-muted">
            {project.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-dashed border-borderish bg-background px-2.5 py-0.5 font-mono text-sm text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-5 text-lg">
            {project.demo && (
              <Link
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-hand text-accent transition-colors hover:text-accent-2 hover:underline hover:decoration-wavy hover:underline-offset-4"
              >
                {project.demoLabel ?? "Live demo"}
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
              </Link>
            )}
            {project.source && (
              <Link
                href={project.source}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-muted transition-colors hover:text-foreground"
              >
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
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                Source
              </Link>
            )}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-foreground bg-foreground px-5 py-2.5 font-hand text-lg text-background shadow-[0_8px_20px_-10px_rgba(60,50,30,0.5)] transition-all hover:-translate-y-0.5 hover:border-accent hover:bg-accent"
            >
              View the build
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
                <path d="M12 3v9" />
                <path d="m16 14-4 4-4-4" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-dashed border-accent/50 bg-accent/10 px-5 py-2.5 font-hand text-lg text-accent transition-all hover:-translate-y-0.5 hover:bg-accent/15"
            >
              Open the dossier
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
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} — full details`}
          >
            <motion.div
              className="absolute inset-0 bg-foreground/45 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              variants={paperReveal}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border-2 border-dashed border-borderish bg-surface p-6 shadow-[0_40px_90px_-25px_rgba(60,50,30,0.6)] sm:p-10"
            >
              <motion.span
                variants={tapeReveal}
                aria-hidden
                className="absolute -top-4 left-8 h-7 w-28 rounded-sm border border-dashed border-[rgba(60,50,30,0.35)] bg-[rgba(255,241,190,0.85)] shadow-[0_2px_6px_rgba(60,50,30,0.15)]"
              />

              <button
                onClick={() => setOpen(false)}
                aria-label="Close project details"
                className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-ink-red/60 font-mono text-xl text-ink-red transition-colors hover:bg-ink-red hover:text-background"
              >
                ×
              </button>

              <div className="pr-4 sm:pr-8">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-14 w-14 shrink-0 -rotate-3 items-center justify-center rounded-xl border-2 border-borderish bg-gradient-to-br ${project.gradient} font-hand font-semibold text-foreground/80`}
                  >
                    {project.monogram}
                  </span>
                  <div>
                    <p className="font-mono text-sm uppercase tracking-wider text-faint">
                      project dossier
                    </p>
                    <h3 className="font-hand text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                      {project.title}
                    </h3>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-dashed border-borderish bg-background px-2.5 py-0.5 font-mono text-sm text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-8 space-y-6">
                  <div>
                    <h4 className="flex items-center gap-3 font-hand text-2xl font-semibold text-ink-red sm:text-3xl">
                      <span className="text-base text-foreground/40">—</span>
                      What it is
                    </h4>
                    <p className="mt-2 text-lg leading-relaxed text-foreground/85">
                      {project.what}
                    </p>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-3 font-hand text-2xl font-semibold text-ink-red sm:text-3xl">
                      <span className="text-base text-foreground/40">—</span>
                      Why it exists
                    </h4>
                    <p className="mt-2 text-lg leading-relaxed text-foreground/85">
                      {project.why}
                    </p>
                  </div>
                </div>

                {(project.demo || project.source) && (
                  <div className="mt-8 flex flex-wrap items-center gap-5 border-t-2 border-dashed border-borderish pt-5 text-lg">
                    {project.demo && (
                      <Link
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 font-hand text-accent transition-colors hover:text-accent-2 hover:underline hover:decoration-wavy hover:underline-offset-4"
                      >
                        {project.demoLabel ?? "Live demo"}
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
                      </Link>
                    )}
                    {project.source && (
                      <Link
                        href={project.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-muted transition-colors hover:text-foreground"
                      >
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
                          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                          <path d="M9 18c-4.51 2-5-2-7-2" />
                        </svg>
                        Source
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}