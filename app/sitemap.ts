import type { MetadataRoute } from "next";
import { navLinks, siteOrigin } from "@/lib/site";
import { getAllSlugs } from "@/lib/posts";
import projects from "@/components/projectData";

export const dynamic = "force-static";

const ORIGIN = siteOrigin;
const BASE = "";

const pages = [...navLinks.map((l) => l.href), "/join"];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = pages.map((href) => ({
    url: `${ORIGIN}${BASE}${href === "/" ? "" : href}`,
    changeFrequency: "monthly",
    priority: href === "/" ? 1 : 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${ORIGIN}${BASE}/blog/${slug}`,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const projectPages: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${ORIGIN}${BASE}/projects/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...projectPages, ...blogPages];
}