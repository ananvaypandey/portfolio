import Link from "next/link";
import type { Post } from "@/lib/posts";

export default function BlogCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="card-hover group relative flex h-full flex-col rounded-2xl border-2 border-dashed border-borderish bg-surface p-6"
    >
      <div className="tape" />
      <div className="flex items-center gap-3 font-mono text-sm text-faint">
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>
        <span className="h-1 w-1 rounded-full bg-faint" />
        <span>{post.readTime}</span>
      </div>
      <h3 className="mt-3 font-hand text-3xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-accent">
        {post.title}
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-lg leading-relaxed text-muted">
        {post.excerpt}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {(post.tags ?? []).slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-dashed border-borderish px-2.5 py-0.5 font-mono text-sm text-muted"
          >
            {tag}
          </span>
        ))}
      </div>
      <span className="mt-5 flex items-center gap-1.5 font-hand text-xl text-accent">
        Read post
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform group-hover:translate-x-1"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}