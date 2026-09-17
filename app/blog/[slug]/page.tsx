import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getPost } from "@/lib/posts";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: `${post.title} — Ananvay Pandey`, description: post.excerpt };
}

export default async function BlogPostPage(
  props: PageProps<"/blog/[slug]">
) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-24 sm:pt-32">
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        Back to blog
      </Link>

      <div className="mb-10">
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-faint">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span className="h-1 w-1 rounded-full bg-faint" />
          <span>{post.readTime}</span>
        </div>
        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
          {post.title}
        </h1>
        <div className="mt-5 flex flex-wrap gap-2">
          {(post.tags ?? []).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-accent/30 bg-accent/10 px-3 py-0.5 font-mono text-xs text-accent"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div
        className="prose-paper"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      <div className="mt-16 rounded-2xl border-2 border-dashed border-borderish bg-surface p-6">
        <p className="font-hand text-2xl font-semibold">Enjoyed this post?</p>
        <p className="mt-1 text-lg text-muted">
          Want to chat about it, or think I got something wrong?{" "}
          <a
            href={`mailto:${site.email}`}
            className="font-medium text-accent hover:text-accent-2 hover:underline hover:decoration-wavy hover:underline-offset-4"
          >
            Get in touch
          </a>{" "}
          — I&apos;d love to hear from you.
        </p>
      </div>
    </article>
  );
}