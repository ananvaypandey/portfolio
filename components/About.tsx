"use client";

import { motion } from "motion/react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { site } from "@/lib/site";

const bioParagraphs = site.bio.split("\n\n");

const highlights = [
  "B.Tech CSE student building across AI, software, and hardware",
  "Founder of VOIKES Technologies — turning experiments into products",
  "From screens to sensors: AI companions, wearables, robots & edge intelligence",
];

const terminalLines = [
  { prompt: "$", cmd: "whoami", out: "Ananvay — builder at the AI x hardware edge" },
  { prompt: "$", cmd: "cat interests.txt" },
  { prompt: ">", out: "AI / robotics / assistive tech / MedTech / HCI" },
  { prompt: "$", cmd: "ls ./stack" },
  { prompt: ">", out: "python  node  react  arduino  raspberry-pi  unreal" },
  { prompt: "$", cmd: "source philosophy.md" },
  { prompt: ">", out: "I don't just learn. I build." },
];

export default function About() {
  return (
    <section id="about" className="relative py-24 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-8%] top-1/3 h-72 w-72 animate-float text-borderish"
        style={{
          background:
            "repeating-linear-gradient(135deg, currentColor 0 2px, transparent 2px 14px)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 40%, transparent 70%)",
          maskImage:
            "radial-gradient(circle at center, black 40%, transparent 70%)",
        }}
      />
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          tag="about"
          title="About me"
          subtitle="I turn ambitious ideas into working products — from pure AI to things you can hold."
        />

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            {bioParagraphs.map((p, i) => (
              <p
                key={i}
                className={`text-xl leading-relaxed text-foreground/85 ${
                  i === 0 ? "" : "mt-4"
                }`}
              >
                {p}
              </p>
            ))}
            <ul className="mt-6 space-y-3">
              {highlights.map((h) => (
                <motion.li
                  key={h}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="flex items-start gap-3 text-foreground"
                >
                  <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-accent/40 font-hand text-base font-bold text-accent">
                    ✓
                  </span>
                  <span className="text-lg">{h}</span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { n: "6+", label: "products built" },
                { n: "2", label: "hackathon seasons" },
                { n: "1", label: "startup founded" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="relative rounded-2xl border-2 border-dashed border-borderish bg-surface px-4 py-5 text-center transition-transform hover:-rotate-1"
                >
                  <div className="font-hand text-4xl font-semibold text-gradient">
                    {s.n}
                  </div>
                  <div className="mt-1 text-base text-faint">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="overflow-hidden rounded-2xl border-2 border-borderish bg-[#1e1d18] shadow-[0_20px_50px_-20px_rgba(60,50,30,0.55)]">
              <div className="flex items-center gap-2 border-b border-white/10 bg-[#14130f] px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                <span className="ml-3 font-mono text-xs text-white/40">
                  ananvay@pandey: ~/about
                </span>
              </div>
              <div className="space-y-1 p-5 font-mono text-sm">
                {terminalLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.15 }}
                    className="flex flex-wrap gap-2"
                  >
                    {line.prompt === "$" ? (
                      <>
                        <span className="text-emerald-400">{line.prompt}</span>
                        <span className="text-white/90">{line.cmd}</span>
                      </>
                    ) : (
                      <span className="text-cyan-400">&gt;</span>
                    )}
                    {line.out && <span className="text-white/55">{line.out}</span>}
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.5 }}
                  className="flex gap-2 pt-1"
                >
                  <span className="text-emerald-400">$</span>
                  <span className="inline-block h-4 w-2 animate-blink bg-white/70" />
                </motion.div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}