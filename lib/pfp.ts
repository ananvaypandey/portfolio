export async function resolveChannelAvatar(
  handle: string,
  fallback: string
): Promise<string> {
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
    if (og?.[1]) return og[1];

    const avatar = html.match(/"avatar":\{"thumbnails":\[\{"url":"([^"]+)"/);
    if (avatar?.[1]) return avatar[1];

    return fallback;
  } catch {
    return fallback;
  }
}