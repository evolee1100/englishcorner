-- English Corner：在 Supabase → SQL Editor 執行一次即可。
-- 表名加 ec_ 前綴，和同一個 Supabase 專案裡其他 App 的表分開。
create table if not exists public.ec_progress (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.ec_progress enable row level security;

-- 每個人只能讀寫自己的進度
drop policy if exists "ec_progress_select_own" on public.ec_progress;
create policy "ec_progress_select_own" on public.ec_progress
  for select using (auth.uid() = user_id);

drop policy if exists "ec_progress_insert_own" on public.ec_progress;
create policy "ec_progress_insert_own" on public.ec_progress
  for insert with check (auth.uid() = user_id);

drop policy if exists "ec_progress_update_own" on public.ec_progress;
create policy "ec_progress_update_own" on public.ec_progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
