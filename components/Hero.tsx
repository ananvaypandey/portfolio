"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { site } from "@/lib/site";
import PencilLine from "./PencilLine";
import PencilWriter from "./PencilWriter";

const socialLinks = [
  { label: "GitHub", href: site.socials.github, external: true },
  { label: "LinkedIn", href: site.socials.linkedin, external: true },
  { label: "YouTube", href: site.socials.youtube, external: true },
  { label: "Instagram", href: site.socials.instagram, external: true },
  { label: "Email", href: `mailto:${site.email}`, external: false },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function Hero() {
  const [spot, setSpot] = useState({ x: 50, y: 50 });

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-16"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setSpot({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }}
    >
      <div
        className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        aria-hidden
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(520px circle at ${spot.x}% ${spot.y}%, rgba(49,81,194,0.07), transparent 62%)`,
        }}
      />

      <svg
        aria-hidden
        className="pointer-events-none absolute -top-10 right-[-6%] h-72 w-72 animate-wiggle text-borderish"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <circle cx="60" cy="60" r="46" />
        <circle cx="60" cy="60" r="34" />
        <circle cx="60" cy="60" r="22" />
        <path d="M60 60 84 30" strokeDasharray="4 5" />
        <path d="M14 46 26 56" strokeDasharray="4 5" />
      </svg>
      <svg
        aria-hidden
        className="pointer-events-none absolute bottom-24 left-[-4%] h-56 w-56 animate-float text-faint"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="50" cy="50" r="42" strokeDasharray="6 8" />
        <path d="M14 50 86 50" strokeDasharray="2 6" />
        <path d="M50 14 50 86" strokeDasharray="2 6" />
      </svg>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto w-full max-w-6xl px-6"
      >
        <motion.div
          variants={itemVariants}
          className="mb-6 inline-flex animate-wiggle items-center gap-2 rounded-xl border-2 border-dashed border-borderish bg-surface/70 px-4 py-1.5 text-base text-muted"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-accent" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19 7-7 3 3-7 7-3-3z" />
            <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="m2 2 7.586 7.586" />
            <circle cx="11" cy="11" r="2" />
          </svg>
          Always experimenting · building AI × hardware
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="max-w-4xl font-hand text-6xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-7xl md:text-8xl"
        >
          Hi, I&apos;m{" "}
          <span className="relative inline-block text-accent">
            <em className="not-italic">{site.firstName}</em>
            <PencilLine className="absolute -bottom-2 left-0 h-2.5 w-full text-accent/70 sm:-bottom-3" />
          </span>
          <br />
          <span className="text-3xl font-normal text-muted sm:text-4xl md:text-5xl">
            I&apos;m a <PencilWriter />
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-8 max-w-2xl text-2xl leading-relaxed text-foreground/80"
        >
          {site.tagline}
        </motion.p>
        <motion.p variants={itemVariants} className="mt-2 font-hand text-2xl text-muted">
          {site.descriptor}
        </motion.p>

        <motion.div variants={itemVariants} className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/projects"
            className="rounded-full border-2 border-foreground bg-foreground px-7 py-3 font-hand text-xl text-background shadow-[0_10px_30px_-12px_rgba(60,50,30,0.5)] transition-all hover:-translate-y-0.5 hover:rotate-1 hover:border-accent hover:bg-accent"
          >
            See my work
          </Link>
          <Link
            href="/contact"
            className="rounded-full border-2 border-borderish bg-surface/60 px-7 py-3 font-hand text-xl text-foreground transition-all hover:-translate-y-0.5 hover:-rotate-1 hover:border-accent hover:text-accent"
          >
            Let&apos;s talk
          </Link>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-muted"
        >
          <span className="text-base lowercase text-faint">find me on →</span>
          {socialLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.external ? "_blank" : undefined}
              rel={s.external ? "noopener noreferrer" : undefined}
              className="font-hand text-xl text-muted transition-colors hover:text-accent hover:underline hover:decoration-wavy hover:decoration-accent/60 hover:underline-offset-4"
            >
              {s.label}
            </a>
          ))}
        </motion.div>
      </motion.div>

      <Link
        href="/about"
        aria-label="Go to about section"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-faint transition-colors hover:text-accent"
      >
        <motion.div
          animate={{ y: [0, 8, 0], rotate: [0, 3, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3v12" />
            <path d="m6 11 6 6 6-6" />
            <path d="M5 3h14" />
          </svg>
        </motion.div>
      </Link>
    </section>
  );
}