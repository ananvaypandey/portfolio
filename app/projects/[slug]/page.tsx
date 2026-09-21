import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import ProjectGallery from "@/components/ProjectGallery";
import projects from "@/components/projectData";
import { basePath } from "@/lib/site";

export const dynamicParams = false;

function findImages(slug: string): string[] {
  const dir = join(process.cwd(), "public", "projects", slug);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((f) => `${basePath}/projects/${slug}/${f}`);
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} — Ananvay Pandey`,
    description: project.description,
    openGraph: { title: project.title, description: project.description },
  };
}

export default async function ProjectPage(
  props: PageProps<"/projects/[slug]">
) {
  const { slug } = await props.params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const images = findImages(slug);

  return (
    <>
      <div className="mx-auto max-w-6xl px-6 pt-16 sm:pt-20">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
        >
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
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          back to projects
        </Link>

        <div className="mt-6 flex items-center gap-4">
          <span
            className={`flex h-16 w-16 shrink-0 -rotate-3 items-center justify-center rounded-2xl border-2 border-borderish bg-gradient-to-br ${project.gradient} font-hand font-semibold text-foreground/85`}
          >
            {project.monogram}
          </span>
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-faint">
              the build
            </p>
            <h1 className="font-hand text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              {project.title}
            </h1>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-xl leading-relaxed text-muted">
          {project.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-dashed border-borderish bg-surface px-3 py-1 font-mono text-sm text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {images.length > 0 ? (
        <ProjectGallery images={images} projectTitle={project.title} />
      ) : (
        <ImagesComingSoon slug={slug} />
      )}

      <div className="mx-auto max-w-3xl px-6 pb-24">
        <div className="space-y-6">
          <div className="rounded-2xl border-2 border-dashed border-borderish bg-surface p-6 sm:p-8">
            <h2 className="flex items-center gap-3 font-hand text-2xl font-semibold text-ink-red sm:text-3xl">
              <span className="text-base text-foreground/40">—</span>
              What it is
            </h2>
            <div className="prose-paper mt-1">
              <p>{project.what}</p>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-dashed border-borderish bg-surface p-6 sm:p-8">
            <h3 className="flex items-center gap-3 font-hand text-2xl font-semibold text-ink-red sm:text-3xl">
              <span className="text-base text-foreground/40">—</span>
              Why it exists
            </h3>
            <div className="prose-paper mt-1">
              <p>{project.why}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {project.source && (
              <a
                href={project.source}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border-2 border-foreground bg-foreground px-6 py-2.5 font-hand text-lg text-background shadow-[0_8px_20px_-10px_rgba(60,50,30,0.5)] transition-all hover:-translate-y-0.5 hover:border-accent hover:bg-accent"
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
                Source code
              </a>
            )}
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-borderish bg-surface px-6 py-2.5 font-hand text-lg text-foreground transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
            >
              Want a build like this? Let&apos;s talk
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function ImagesComingSoon({ slug }: { slug: string }) {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="relative mt-10 flex h-[50vh] items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-borderish bg-surface">
        <div className="bg-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_72%)]" />
        <div className="relative max-w-md px-6 text-center">
          <svg
            aria-hidden
            className="mx-auto h-16 w-16 animate-scribble text-faint"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" strokeDasharray="4 4" />
            <circle cx="9" cy="10" r="1.6" />
            <path d="m5 17 5-4 4 3 3-3 2 2" strokeDasharray="3 4" />
          </svg>
          <p className="mt-4 font-hand text-3xl font-semibold text-ink-red">
            Photos coming soon
          </p>
          <p className="mt-2 text-lg leading-relaxed text-muted">
            Drop some build photos into <code className="font-mono text-accent">public/projects/{slug}/</code> and
            they&apos;ll show up right here, pinned notebook-style.
          </p>
        </div>
      </div>
    </div>
  );
}