import Image from "next/image";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { channels } from "@/lib/channels";
import { resolveChannelAvatar } from "@/lib/youtube";

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

        <div className="grid gap-4 md:grid-cols-2 md:gap-8">
          {channels.map((channel, i) => (
            <Reveal key={channel.handle} delay={i * 0.08}>
              <div className="card-hover relative flex h-full flex-col items-center gap-5 rounded-3xl border-2 border-dashed border-borderish bg-surface p-5 text-center sm:gap-8 sm:p-8">
                <div className="relative shrink-0 -rotate-3 rounded-2xl border-2 border-borderish bg-background p-2.5 shadow-[0_18px_40px_-18px_rgba(60,50,30,0.4)] transition-transform hover:rotate-0 sm:p-3">
                  <div className="tape" />
                  <Image
                    src={avatars.get(channel.handle) ?? channel.avatarFallback}
                    alt={`${channel.name} channel profile picture`}
                    width={112}
                    height={112}
                    className="h-20 w-20 rounded-xl object-cover sm:h-24 sm:w-24 md:h-28 md:w-28"
                  />
                  <p className="mt-1.5 text-center font-hand text-lg font-semibold text-muted sm:mt-2 sm:text-xl">
                    @{channel.handle}
                  </p>
                </div>

                <div className="w-full">
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                    <h3 className="font-hand text-2xl font-semibold tracking-tight text-ink-red sm:text-3xl md:text-4xl">
                      {channel.name}
                    </h3>
                  </div>
                  <span className="mt-2 inline-block rounded-full border border-dashed border-borderish bg-background px-3 py-1 font-mono text-xs text-faint sm:text-sm">
                    {channel.kind}
                  </span>

                  <p className="mt-2 font-hand text-lg italic text-muted sm:mt-3 sm:text-xl">
                    {channel.tagline}
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-foreground/85 sm:mt-4 sm:text-lg">
                    {channel.description}
                  </p>

                  <a
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink-red px-6 py-2.5 font-hand text-lg text-background shadow-[0_10px_30px_-12px_rgba(207,74,51,0.6)] transition-all hover:-translate-y-0.5 hover:rotate-1 sm:mt-7 sm:w-auto sm:px-7 sm:py-3 sm:text-xl"
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