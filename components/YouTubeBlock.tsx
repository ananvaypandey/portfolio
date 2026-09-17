import Image from "next/image";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { channels } from "@/lib/channels";
import { resolveChannelAvatar } from "@/lib/pfp";

export default async function YouTubeBlock() {
  const avatars = new Map<string, string>();
  for (const channel of channels) {
    avatars.set(
      channel.handle,
      await resolveChannelAvatar(channel.handle, channel.avatarFallback)
    );
  }

  return (
    <section id="youtube" className="relative py-14 sm:py-28">
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
          title="Live on the channels"
          subtitle="Two sides, one notebook. Builds on ANANVAY IO, gaming on AM AFTERHOURS."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {channels.map((channel, i) => (
            <Reveal key={channel.handle} delay={i * 0.08}>
              <div className="card-hover relative flex h-full flex-col items-center gap-8 rounded-3xl border-2 border-dashed border-borderish bg-surface p-6 text-center sm:p-8">
                <div className="relative shrink-0 -rotate-3 rounded-2xl border-2 border-borderish bg-background p-3 shadow-[0_18px_40px_-18px_rgba(60,50,30,0.4)] transition-transform hover:rotate-0">
                  <div className="tape" />
                  <Image
                    src={avatars.get(channel.handle) ?? channel.avatarFallback}
                    alt={`${channel.name} channel profile picture`}
                    width={160}
                    height={160}
                    className="h-28 w-28 rounded-xl object-cover sm:h-32 sm:w-32"
                  />
                  <p className="mt-2 text-center font-hand text-xl font-semibold text-muted">
                    @{channel.handle}
                  </p>
                </div>

                <div className="w-full">
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <h3 className="font-hand text-3xl font-semibold tracking-tight text-ink-red sm:text-4xl">
                      {channel.name}
                    </h3>
                    <span className="rounded-full border border-dashed border-borderish bg-background px-3 py-1 font-mono text-sm text-faint">
                      {channel.kind}
                    </span>
                  </div>

                  <p className="mt-3 font-hand text-xl italic text-muted">
                    {channel.tagline}
                  </p>
                  <p className="mt-4 text-lg leading-relaxed text-foreground/85">
                    {channel.description}
                  </p>

                  <a
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink-red px-7 py-3 font-hand text-xl text-background shadow-[0_10px_30px_-12px_rgba(207,74,51,0.6)] transition-all hover:-translate-y-0.5 hover:rotate-1 sm:w-auto"
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
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}