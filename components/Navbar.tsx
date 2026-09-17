"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { navLinks, site } from "@/lib/site";

const dockItems = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Projects", href: "/projects", icon: "bolt" },
  { label: "Blog", href: "/blog", icon: "book" },
  { label: "News", href: "/news", icon: "news" },
  { label: "Contact", href: "/contact", icon: "mail" },
];

const drawerItems = navLinks.filter(
  (l) => !dockItems.some((d) => d.href === l.href)
);

const socials = [
  { label: "GitHub", href: site.socials.github },
  { label: "LinkedIn", href: site.socials.linkedin },
  { label: "YouTube", href: site.socials.youtube },
  { label: "Instagram", href: site.socials.instagram },
  { label: "Email", href: `mailto:${site.email}` },
];

function Icon({ name, className }: { name: string; className?: string }) {
  const paths: Record<string, ReactNode> = {
    home: (
      <>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
      </>
    ),
    bolt: <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />,
    book: (
      <>
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5Z" />
        <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20" />
      </>
    ),
    news: (
      <>
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0V9h4" />
        <path d="M16 6h2" />
        <path d="M16 10h2" />
        <path d="M16 14h2" />
        <path d="M8 14h4" />
        <path d="M8 18h4" />
      </>
    ),
    mail: (
      <>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-10 6L2 7" />
      </>
    ),
    user: (
      <>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    sparkles: (
      <path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3Z" />
    ),
  };
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {paths[name]}
    </svg>
  );
}

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
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          scrolled || open
            ? "glass border-borderish"
            : "border-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="group flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-borderish bg-surface font-hand text-sm font-bold text-accent transition-transform group-hover:-rotate-6 sm:h-8 sm:w-8">
              AP
            </span>
            <span className="hidden font-hand text-lg font-semibold tracking-tight text-foreground min-[420px]:inline">
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
            className="grid h-11 w-11 place-items-center rounded-lg border-2 border-borderish text-foreground md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Open full menu"
            aria-expanded={open}
          >
            {open ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </svg>
            )}
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
                <p className="mb-1 px-3 font-hand text-lg text-faint">
                  everything else
                </p>
                {drawerItems.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 text-base transition-colors ${
                      isActive(link.href)
                        ? "bg-surface-2 text-accent"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    <Icon
                      name={link.href === "/about" ? "user" : "sparkles"}
                      className="text-faint"
                    />
                    {link.label}
                  </Link>
                ))}
                <a
                  href={site.resumeUrl}
                  download
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-full bg-foreground px-4 py-3 text-center font-hand text-base font-medium text-background"
                >
                  Download Resume
                </a>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-dashed border-borderish pt-4">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target={s.label === "Email" ? undefined : "_blank"}
                      rel={
                        s.label === "Email" ? undefined : "noopener noreferrer"
                      }
                      className="font-hand text-lg text-muted transition-colors hover:text-accent"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <nav
        aria-label="Primary mobile navigation"
        className="glass fixed inset-x-0 bottom-0 z-50 border-t border-borderish md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {dockItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 pb-1.5 pt-2 transition-colors ${
                  active ? "text-accent" : "text-faint hover:text-foreground"
                }`}
              >
                <Icon name={item.icon} className={active ? "" : "text-muted"} />
                <span className="text-[11px] font-medium">{item.label}</span>
                <span
                  className={`h-1 w-1 rounded-full transition-colors ${
                    active ? "bg-accent" : "bg-transparent"
                  }`}
                />
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}