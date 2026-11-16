-- WINTERQUEST: sichere Grundstruktur für einen frischen Supabase-Account
-- Diesen SQL-Code nur in einem NEUEN Supabase-Projekt ausführen.
-- Falls du ihn in einem bestehenden Projekt verwenden möchtest, vorher prüfen/sichern.

create table if not exists public.game_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  save_data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.game_saves enable row level security;

drop policy if exists "Users can read their own save" on public.game_saves;
create policy "Users can read their own save"
on public.game_saves for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own save" on public.game_saves;
create policy "Users can insert their own save"
on public.game_saves for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own save" on public.game_saves;
create policy "Users can update their own save"
on public.game_saves for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Hinweis: Das Spiel speichert ohne eingerichtete Anmeldung zunächst lokal im Browser.
-- Für Cloud-Spielstände muss später zusätzlich eine Anmeldung eingerichtet werden.
