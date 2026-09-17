"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { navLinks, site } from "@/lib/site";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled || open
          ? "glass border-borderish"
          : "border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-borderish bg-surface font-hand text-sm font-bold text-accent transition-transform group-hover:-rotate-6">
            AP
          </span>
          <span className="font-hand text-lg font-semibold tracking-tight text-foreground">
            {site.name}
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3.5 py-1.5 text-base transition-all hover:-translate-y-0.5 ${
                isActive(link.href)
                  ? "bg-surface text-accent underline decoration-wavy decoration-accent/60 underline-offset-4"
                  : "text-muted hover:text-foreground hover:underline hover:decoration-wavy hover:decoration-accent/50 hover:underline-offset-4"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={site.resumeUrl}
            download
            className="ml-3 rounded-full border-2 border-foreground bg-foreground px-4 py-1.5 font-hand text-base font-medium text-background transition-all hover:-translate-y-0.5 hover:rotate-1 hover:bg-accent hover:shadow-[0_10px_24px_-10px_rgba(49,81,194,0.5)]"
          >
            Resume
          </a>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg border-2 border-borderish text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <div className="flex flex-col items-center justify-center gap-1.5">
            <motion.span
              animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-5 rounded bg-current"
            />
            <motion.span
              animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-5 rounded bg-current"
            />
          </div>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 pb-6 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-base transition-colors ${
                    isActive(link.href)
                      ? "bg-surface-2 text-accent"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={site.resumeUrl}
                download
                className="mt-2 rounded-full bg-foreground px-4 py-2.5 text-center font-hand text-base font-medium text-background"
              >
                Download Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}