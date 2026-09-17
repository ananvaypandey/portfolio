import { site } from "@/lib/site";

const socials = [
  { label: "GitHub", href: site.socials.github },
  { label: "LinkedIn", href: site.socials.linkedin },
  { label: "YouTube", href: site.socials.youtube },
  { label: "Instagram", href: site.socials.instagram },
  { label: "Medium", href: site.socials.medium },
  { label: "Email", href: `mailto:${site.email}` },
];

export default function Footer() {
  return (
    <footer className="border-t-2 border-dashed border-borderish">
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-8">
        <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
          <div className="text-center lg:text-left">
            <div className="font-hand text-2xl font-semibold text-foreground">
              {site.name} · {site.role}
            </div>
            <p className="mt-1 max-w-md text-lg text-muted">{site.tagline}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.label === "Email" ? undefined : "_blank"}
                rel={s.label === "Email" ? undefined : "noopener noreferrer"}
                className="font-hand text-lg text-muted transition-colors hover:text-accent hover:underline hover:decoration-wavy hover:decoration-accent/60 hover:underline-offset-4"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-dashed border-borderish pt-6 sm:flex-row">
          <p className="text-base text-faint">
            © {new Date().getFullYear()} {site.name}. Written in pencil, not
            code.
          </p>
          <p className="font-mono text-sm text-faint">
            BUILD STATUS: ALWAYS EXPERIMENTING
          </p>
        </div>
      </div>
    </footer>
  );
}