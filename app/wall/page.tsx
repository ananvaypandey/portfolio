import Link from "next/link";
import WallBoard from "@/components/WallBoard";

export const metadata = {
  title: "The Pinboard — Ananvay Pandey",
  description:
    "Photos from events, tech expos, hackathons, NGO collaborations and the places the notebook went.",
};

export default function WallPage() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-6 pt-20 sm:pt-24">
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
      <WallBoard />
    </>
  );
}