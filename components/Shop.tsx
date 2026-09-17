import Link from "next/link";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { products, services } from "@/lib/shop";

export default function Shop() {
  return (
    <section id="shop" className="relative pb-24 sm:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(207,74,51,0.08), transparent 70%)",
        }}
      />
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          tag="shop"
          title="Products & services"
          subtitle="Everything listed here is still a sketch — real products and services drop soon."
        />

        <Reveal>
          <div className="mb-10 rounded-2xl border-2 border-dashed border-ink-red/40 bg-surface px-6 py-4 text-center sm:px-8">
            <p className="font-hand text-2xl font-semibold text-ink-red">
              work in progress
            </p>
            <p className="mt-1 text-lg text-muted">
              Nothing is for sale yet. Tell me what you&apos;d want in the
              comments — or just{" "}
              <Link href="/contact" className="text-accent underline decoration-wavy underline-offset-4">
                talk to me
              </Link>
              .
            </p>
          </div>
        </Reveal>

        <Reveal className="mb-8">
          <h3 className="font-hand text-3xl font-semibold text-foreground">
            products
          </h3>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <div className="card-hover relative h-full rounded-2xl border-2 border-dashed border-borderish bg-surface p-6">
                <div className="tape" />
                <span className="absolute -top-3 right-6 -rotate-2 rounded-full border-2 border-dashed border-accent/50 bg-background px-3 py-0.5 font-mono text-sm text-accent">
                  {p.status}
                </span>
                <h4 className="mt-2 font-hand text-3xl font-semibold leading-snug text-foreground">
                  {p.name}
                </h4>
                <p className="mt-2 text-lg leading-relaxed text-muted">
                  {p.note}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="font-mono text-lg text-foreground">
                    {p.price}
                  </span>
                  <span className="flex gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-dashed border-borderish px-2.5 py-0.5 font-mono text-sm text-faint"
                      >
                        {t}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mb-8 mt-16">
          <h3 className="font-hand text-3xl font-semibold text-foreground">
            services
          </h3>
        </Reveal>
        <div className="overflow-hidden rounded-2xl border-2 border-dashed border-borderish bg-surface">
          {services.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.05}>
              <div
                className={`flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${
                  i > 0 ? "border-t border-dashed border-borderish" : ""
                }`}
              >
                <div>
                  <p className="font-hand text-2xl font-semibold text-foreground">
                    {s.name}
                  </p>
                  <p className="text-lg text-muted">{s.note}</p>
                </div>
                <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
                  <span className="font-mono text-lg text-foreground">
                    {s.price}
                  </span>
                  <span className="font-mono text-sm text-faint">
                    {s.status}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <p className="max-w-xl text-lg text-muted">
            Bigger than a side project? Need something built?{" "}
            <Link
              href="/contact"
              className="font-hand text-2xl font-semibold text-accent underline decoration-wavy underline-offset-4 transition-colors hover:text-accent-2"
            >
              Let&apos;s make it real
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}