import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { basePath } from "@/lib/site";

/**
 * Scans public/press/<slug>/ for scanned clippings and returns their public
 * URLs — pulls from the physical-paper drop folders. Server-only (node:fs),
 * so call it from the page (or any Server Component), never a client file.
 */
export function findPressImages(slug: string): string[] {
  const dir = join(process.cwd(), "public", "press", slug);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((f) => `${basePath}/press/${slug}/${f}`);
}
