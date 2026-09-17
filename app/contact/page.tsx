import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import PencilLine from "@/components/PencilLine";
import { site } from "@/lib/site";

export const metadata = {
  title: "Contact — Ananvay Pandey",
  description: "Get in touch with Ananvay Pandey.",
};

const channels = [
  {
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
  },
  {
    label: "GitHub",
    value: "github.com/ananvaypandey",
    href: site.socials.github,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/ananvay-pandey",
    href: site.socials.linkedin,
  },
  {
    label: "YouTube",
    value: "youtube.com/@ananvayio",
    href: site.socials.youtube,
  },
  {
    label: "Medium",
    value: "medium.com/@ananvaypandey29",
    href: site.socials.medium,
  },
  {
    label: "Instagram (personal)",
    value: "instagram.com/ananvay.io",
    href: site.socials.instagram,
  },
  {
    label: "VOIKES Technologies",
    value: "instagram.com/voikes.technologies",
    href: site.socials.company.instagram,
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <div className="mb-14">
        <Reveal>
          <span className="mb-4 inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-borderish bg-surface/60 px-3 py-1 font-hand text-lg text-ink-red">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
            contact
          </span>
          <h1 className="relative inline-block font-hand text-6xl font-semibold tracking-tight sm:text-7xl">
            Let&apos;s <span className="text-accent">talk</span>
            <PencilLine className="absolute -bottom-3 left-0 h-3 w-2/3 text-borderish" />
          </h1>
          <p className="mt-6 max-w-lg text-xl text-muted">
            Have an idea worth building? An AI product, a hardware prototype,
            an ambitious experiment — or just want to say hi. Fill out the form
            and I&apos;ll get back to you.
          </p>
        </Reveal>
      </div>

      <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
        <Reveal className="lg:col-span-3">
          <ContactForm />
        </Reveal>

        <Reveal delay={0.15} className="lg:col-span-2">
          <div className="space-y-4">
            <h2 className="font-hand text-2xl font-semibold text-faint">
              Other ways to reach me
            </h2>
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.label === "Email" ? undefined : "_blank"}
                rel={c.label === "Email" ? undefined : "noopener noreferrer"}
                className="card-hover relative block rounded-2xl border-2 border-dashed border-borderish bg-surface p-5"
              >
                <div className="text-base text-faint">{c.label} →</div>
                <div className="mt-1 font-hand text-2xl font-semibold text-foreground">
                  {c.value}
                </div>
              </a>
            ))}
            <div className="rounded-2xl border border-borderish bg-surface/50 p-5 text-lg text-muted">
              Prefer async? I&apos;m generally fast to reply. Based in{" "}
              {site.location} — I&apos;ll find a slot that works for both of us.
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}