export interface PressClip {
  /** Matches the drop folder in public/press/<slug>/ — scans land there. */
  slug: string;
  /** Real publication name — fill me in when you add the actual scan. */
  publication?: string;
  /** Date of the physical issue. */
  date?: string;
  /** The headline as it ran in print. */
  headline?: string;
}

/**
 * Folders on the news-board for taped physical clippings.
 * Slugs are generic placeholders — rename to match your real clippings.
 * Captions here are OPTIONAL: a clip with no captions renders as a plain
 * taped scan. When you add your real scans + details, fill the fields below.
 */

export const pressClips: PressClip[] = [
  { slug: "clipping-1" },
  { slug: "clipping-2" },
  { slug: "clipping-3" },
  { slug: "clipping-4" },
];
