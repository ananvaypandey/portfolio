# Paper Runner global leaderboard — How to enable (Supabase)

The game ships with a per-device fallback board by default. To make it a
**worldwide** leaderboard (every visitor's score appears for everyone),
connect Supabase. The code is already wired — this doc is the activation.

## The two keys

| Variable | Where it comes from | Example |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → project → **Settings → API** | `https://<ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same page, the "anon / public" key (`eyJ...`) | `eyJhbGciOiJ...` |
| `NEXT_PUBLIC_SUPABASE_TABLE` | Table name created in SQL editor (default `paper_runner_scores`) | `paper_runner_scores` |

These are **public-by-design** (they ship in the browser bundle), so they're
safe to store as GitHub repo secrets. Row Level Security still protects the
table.

## 1. Create the table (Supabase SQL Editor)

Dashboard → **SQL Editor** (left sidebar) → paste this → **Run**:

```sql
create table if not exists paper_runner_scores (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  score       integer not null,
  coins       integer not null default 0
);

alter table paper_runner_scores enable row level security;

create policy "leaderboard public read"
  on paper_runner_scores
  for select
  using (true);

create policy "leaderboard public insert"
  on paper_runner_scores
  for insert
  with check (true);
```

This mirrors `supabase/schema.sql` in the repo.

## 2. Local development

Copy `.env.example` → `.env.local` and fill both values, e.g.:

```
NEXT_PUBLIC_SUPABASE_URL=https://ytyusjqkmcwokyvmnrmk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

`.env.local` is gitignored — never commit it.

## 3. Production (GitHub Pages)

The deploy workflow (`.github/workflows/pages.yml`) reads these from repo
secrets, so add them at:

**GitHub repo → Settings → Secrets and variables → Actions → New repository secret**

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Then push to `main` (or re-run the "Deploy to GitHub Pages" workflow). The
board label changes from "this device" to "every visitor", and scores
from all visitors appear live (the game polls every 5s).