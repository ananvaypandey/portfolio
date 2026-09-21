import Link from "next/link";
import News from "@/components/News";
import PressClippings from "@/components/PressClippings";
import { pressClips } from "@/lib/press";
import { findPressImages } from "@/lib/pressImages";

export const metadata = {
  title: "News — Ananvay Pandey",
  description:
    "News articles, interviews, and writing by Ananvay Pandey and VOIKES Technologies.",
};

export default function NewsPage() {
  const rows = pressClips.map((clip) => ({
    slug: clip.slug,
    images: findPressImages(clip.slug),
    title: clip.publication ?? `clipping · ${clip.slug}`,
  }));

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
      <News />
      <PressClippings rows={rows} />
    </>
  );
}
