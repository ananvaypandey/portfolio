import Link from "next/link";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Events from "@/components/Events";
import Philosophy from "@/components/Philosophy";

export const metadata = {
  title: "About — Ananvay Pandey",
  description:
    "B.Tech CSE student and technology builder working at the intersection of AI, software, hardware, and robotics.",
};

export default function AboutPage() {
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
      <About />
      <Experience />
      <Events />
      <Philosophy />
    </>
  );
}