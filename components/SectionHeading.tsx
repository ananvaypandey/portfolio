import Reveal from "./Reveal";
import PencilLine from "./PencilLine";

export default function SectionHeading({
  tag,
  title,
  subtitle,
}: {
  tag: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <Reveal className="mb-12">
      <span className="mb-4 inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-borderish bg-surface/60 px-3 py-1 font-hand text-lg text-ink-red">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
        {tag}
      </span>
      <h2 className="relative inline-block font-hand text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
        {title}
        <PencilLine className="absolute -bottom-2 left-0 h-2.5 w-3/4 text-borderish" />
      </h2>
      {subtitle && (
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}