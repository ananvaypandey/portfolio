-- Run this in the Supabase SQL editor (Dashboard -> SQL Editor).
-- It creates the table the Paper Runner leaderboard posts to and reads from.

create table if not exists paper_runner_scores (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  score       integer not null,
  coins       integer not null default 0
);

alter table paper_runner_scores enable row level security;

-- anyone may read the table (needed by the static site)
create policy "leaderboard public read"
  on paper_runner_scores
  for select
  using (true);

-- anyone may submit a new score
create policy "leaderboard public insert"
  on paper_runner_scores
  for insert
  with check (true);