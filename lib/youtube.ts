export type ChannelInfo = { avatar: string; subscribers?: string };

export async function resolveChannelInfo(
  handle: string,
  fallbackAvatar: string
): Promise<ChannelInfo> {
  const fallback: ChannelInfo = { avatar: fallbackAvatar };

  try {
    const res = await fetch(`https://www.youtube.com/@${handle}/about`, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return fallback;
    const html = await res.text();

    const og = html.match(/<meta property="og:image" content="([^"]+)"/);
    const avatar = og?.[1] ?? fallbackAvatar;

    const subLabel = html.match(
      /"subscriberCountText":\{"accessibility":\{"accessibilityData":\{"label":"([^"]+)"/
    );
    let subscribers: string | undefined;
    if (subLabel?.[1]) {
      const raw = subLabel[1]
        .replace(/\s*subscribers?$/i, "")
        .replace(/\s+thousand$/i, "K")
        .replace(/\s+million$/i, "M")
        .replace(/\s+billion$/i, "B");
      subscribers = raw;
    }

    return { avatar, subscribers };
  } catch {
    return fallback;
  }
}