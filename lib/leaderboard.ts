export type LeaderboardEntry = {
  name: string;
  score: number;
  coins: number;
};

const URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "");
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const TABLE = process.env.NEXT_PUBLIC_SUPABASE_TABLE || "paper_runner_scores";

export const leaderboardEnabled = Boolean(URL && KEY);

const LOCAL_KEY = "paper-runner-scores-local";
const MAX_LOCAL = 8;

export function sanitizeName(raw: string): string {
  return raw
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .slice(0, 18) || "anonymous";
}

function readLocal(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as LeaderboardEntry[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeLocal(list: LeaderboardEntry[]) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list.slice(0, MAX_LOCAL)));
  } catch {
    /* storage full or blocked */
  }
}

export async function fetchLeaderboard(
  limit = 8
): Promise<LeaderboardEntry[]> {
  if (!leaderboardEnabled) {
    return readLocal()
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
  const res = await fetch(
    `${URL}/rest/v1/${TABLE}?select=name,score,coins&order=score.desc&limit=${limit}`,
    {
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        Accept: "application/json",
      },
    }
  );
  if (!res.ok) throw new Error(`leaderboard read failed (${res.status})`);
  const rows = (await res.json()) as LeaderboardEntry[];
  return rows.map((r) => ({
    name: String(r.name ?? "anonymous"),
    score: Number(r.score) || 0,
    coins: Number(r.coins) || 0,
  }));
}

export async function submitScore(
  name: string,
  score: number,
  coins: number
): Promise<void> {
  const cleanName = sanitizeName(name);
  if (!leaderboardEnabled) {
    const list = readLocal();
    list.push({ name: cleanName, score, coins });
    writeLocal(
      list.sort((a, b) => b.score - a.score).slice(0, MAX_LOCAL)
    );
    return;
  }
  const res = await fetch(`${URL}/rest/v1/${TABLE}`, {
    method: "POST",
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ name: cleanName, score, coins }),
  });
  if (!res.ok && res.status !== 201) {
    throw new Error(`leaderboard write failed (${res.status})`);
  }
}

export function getSavedName(): string {
  try {
    return localStorage.getItem("paper-runner-name") || "";
  } catch {
    return "";
  }
}

export function storeName(name: string) {
  try {
    localStorage.setItem("paper-runner-name", sanitizeName(name));
  } catch {
    /* ignore */
  }
}