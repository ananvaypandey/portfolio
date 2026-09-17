"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, type Variants } from "motion/react";

const emptySubscribe = () => () => {};
const useIsHydrated = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

const paperVariants: Variants = {
  idle: {
    y: 0,
    rotate: -3,
    opacity: 1,
  },
  falling: {
    y: [0, -14, 320],
    rotate: [-3, -2, 22],
    opacity: [1, 1, 0],
    transition: {
      y: { times: [0, 0.25, 1], duration: 0.7, ease: "easeIn" },
      rotate: { times: [0, 0.25, 1], duration: 0.7, ease: "easeIn" },
      opacity: { times: [0, 0.75, 1], duration: 0.7, ease: "easeIn" },
    },
  },
};

export default function ApplyFloat() {
  const router = useRouter();
  const pathname = usePathname();
  const mounted = useIsHydrated();
  const [dropping, setDropping] = useState(false);

  if (!mounted) return null;
  if (pathname === "/join" || pathname === "/join/") return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (dropping) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    setDropping(true);
    window.setTimeout(() => router.push("/join"), 520);
  };

  return (
    <Link
      href="/join"
      onClick={handleClick}
      aria-label="Apply to join VOIKES Technologies"
      className="group fixed bottom-[calc(4.25rem+env(safe-area-inset-bottom))] right-3 z-40 sm:bottom-6 sm:right-6"
    >
      <motion.span
        variants={paperVariants}
        initial="idle"
        animate={dropping ? "falling" : "idle"}
        whileHover={dropping ? undefined : { y: -4, rotate: 1 }}
        transition={{ duration: 0.3 }}
        className="relative block origin-top rounded-xl border-2 border-dashed border-ink-red/50 bg-surface px-4 py-2.5 shadow-[0_14px_30px_-14px_rgba(60,50,30,0.55)] sm:px-5 sm:py-3.5"
      >
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
      </motion.span>
    </Link>
  );
}