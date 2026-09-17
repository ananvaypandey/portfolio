"use client";

import { useRef } from "react";
import Link from "next/link";

export interface Project {
  title: string;
  description: string;
  tags: string[];
  gradient: string;
  monogram: string;
  demo?: string;
  demoLabel?: string;
  source?: string;
}

export default function ProjectCard({ project }: { project: Project }) {
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

  return (
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
      </div>
    </div>
  );
}