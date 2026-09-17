import Link from "next/link";
import Projects from "@/components/Projects";

export const metadata = {
  title: "Projects — Ananvay Pandey",
  description: "Projects built by Ananvay Pandey.",
};

export default function ProjectsPage() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-6 pt-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-hand text-xl text-muted transition-colors hover:text-accent"
        >
          <svg
            width="18"
            height="18"
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
          back to home
        </Link>
      </div>
      <Projects />
      <div className="mx-auto max-w-6xl px-6 pb-24 text-center">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 font-hand text-2xl text-accent transition-colors hover:text-accent-2 hover:underline hover:decoration-wavy hover:underline-offset-4"
        >
          Like something you see? Let&apos;s build together →
        </Link>
      </div>
    </>
  );
}