"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ApplyFloat() {
  const pathname = usePathname();
  if (pathname === "/join") return null;

  return (
    <Link
      href="/join"
      aria-label="Apply to join VOIKES Technologies"
      className="group fixed bottom-[calc(4.25rem+env(safe-area-inset-bottom))] right-3 z-40 sm:bottom-6 sm:right-6"
    >
      <span className="relative block -rotate-3 rounded-xl border-2 border-dashed border-ink-red/50 bg-surface px-4 py-2.5 shadow-[0_14px_30px_-14px_rgba(60,50,30,0.55)] transition-all duration-300 group-hover:-translate-y-1 group-hover:rotate-1 group-hover:border-ink-red/80 group-hover:shadow-[0_20px_40px_-16px_rgba(60,50,30,0.6)] sm:px-5 sm:py-3.5">
        <span
          aria-hidden
          className="absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 rotate-[-2deg] rounded-sm bg-[rgba(255,241,190,0.85)] shadow-[0_2px_5px_rgba(60,50,30,0.14)]"
        />
        <span className="flex items-center gap-2 font-hand text-lg font-semibold text-ink-red sm:text-xl">
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:-rotate-3 group-hover:scale-110"
          >
            <path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3Z" />
          </svg>
          Apply to join
        </span>
        <span className="block text-center font-mono text-xs text-faint">
          VOIKES Technologies
        </span>
      </span>
    </Link>
  );
}