import { getAllPosts } from "@/lib/posts";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import BlogCard from "@/components/BlogCard";

export const metadata = {
  title: "Blog — Ananvay Pandey",
  description:
    "Notes, experiments, and lessons learned while building AI × hardware.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-24 sm:pt-32">
      <SectionHeading
        tag="blog"
        title="All posts"
        subtitle="Notes on AI, hardware, robotics, and building things from idea to reality."
      />

      {posts.length === 0 ? (
        <p className="text-muted">No posts yet. Check back soon.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={(i % 3) * 0.08}>
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}