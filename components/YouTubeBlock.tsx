import Link from "next/link";
import Image from "next/image";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { site } from "@/lib/site";

const channel = {
  name: "ANANVAY IO",
  handle: "@ananvayio",
  tagline: "welcome to the digital damage center.",
  description:
    "Engineering student by pressure, creator by obsession. Founder & CEO of VOIKES Technologies — build breakdowns, experiments, and the messy side of making AI × hardware real.",
  avatar:
    "https://yt3.googleusercontent.com/6HUKctVfSNn37o_GmrPYGqlzpaE1IsZOs8hgM_SXd3S0UgFjx7aqu42i9wThXR9Hpvnrz7LJMw=s400-c-k-c0x00ffffff-no-rj",
};

export default function YouTubeBlock() {
  return (
    <section id="youtube" className="relative py-24 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/4 h-72 w-72 text-borderish"
        style={{
          background:
            "repeating-linear-gradient(135deg, currentColor 0 2px, transparent 2px 14px)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 35%, transparent 72%)",
          maskImage:
            "radial-gradient(circle at center, black 35%, transparent 72%)",
        }}
      />
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          tag="youtube"
          title="Live on the channel"
          subtitle="Builds, breakdowns, and the raw side of making AI × hardware real."
        />

        <Reveal>
          <div className="card-hover relative flex flex-col items-center gap-8 rounded-3xl border-2 border-dashed border-borderish bg-surface p-8 sm:p-10 lg:flex-row lg:gap-14">
            <div className="relative shrink-0 -rotate-3 rounded-2xl border-2 border-borderish bg-background p-3 shadow-[0_18px_40px_-18px_rgba(60,50,30,0.4)] transition-transform hover:rotate-0">
              <div className="tape" />
              <Image
                src={channel.avatar}
                alt={`${channel.name} channel profile picture`}
                width={192}
                height={192}
                className="h-40 w-40 rounded-xl object-cover sm:h-48 sm:w-48"
              />
              <p className="mt-3 text-center font-hand text-2xl font-semibold text-muted">
                @ananvayio
              </p>
            </div>

            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col items-center gap-3 lg:flex-row lg:items-center">
                <h3 className="font-hand text-5xl font-semibold tracking-tight text-ink-red">
                  {channel.name}
                </h3>
                <span className="rounded-full border border-dashed border-borderish bg-background px-3 py-1 font-mono text-sm text-faint">
                  {channel.handle}
                </span>
              </div>

              <p className="mt-3 font-hand text-2xl italic text-muted">
                {channel.tagline}
              </p>
              <p className="mt-4 max-w-xl text-xl leading-relaxed text-foreground/85 lg:mx-0 lg:text-left">
                {channel.description}
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <a
                  href={site.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-ink-red px-7 py-3 font-hand text-xl text-background shadow-[0_10px_30px_-12px_rgba(207,74,51,0.6)] transition-all hover:-translate-y-0.5 hover:rotate-1"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z" />
                  </svg>
                  Subscribe
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-borderish bg-background px-7 py-3 font-hand text-xl text-foreground transition-all hover:-translate-y-0.5 hover:-rotate-1 hover:border-accent hover:text-accent"
                >
                  Talk to me
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}