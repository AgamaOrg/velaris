create table if not exists public.kanban_boards (
  id bigint generated always as identity primary key,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.kanban_columns (
  id bigint generated always as identity primary key,
  board_id bigint not null references public.kanban_boards(id) on delete cascade,
  name text not null,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  unique (board_id, position)
);

create table if not exists public.kanban_cards (
  id bigint generated always as identity primary key,
  board_id bigint not null references public.kanban_boards(id) on delete cascade,
  column_id bigint not null references public.kanban_columns(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 160),
  description text,
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high')),
  position integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists kanban_columns_board_position_idx
  on public.kanban_columns (board_id, position);

create index if not exists kanban_cards_board_column_position_idx
  on public.kanban_cards (board_id, column_id, position);

alter table public.kanban_boards enable row level security;
alter table public.kanban_columns enable row level security;
alter table public.kanban_cards enable row level security;

create policy "Signed-in team members can manage boards"
  on public.kanban_boards for all
  to authenticated
  using (true)
  with check (true);

create policy "Signed-in team members can manage board columns"
  on public.kanban_columns for all
  to authenticated
  using (true)
  with check (true);

create policy "Signed-in team members can manage board cards"
  on public.kanban_cards for all
  to authenticated
  using (true)
  with check (true);

insert into public.kanban_boards (name)
select 'Velaris Operations'
where not exists (
  select 1 from public.kanban_boards where name = 'Velaris Operations'
);

insert into public.kanban_columns (board_id, name, position)
select board.id, stage.name, stage.position
from public.kanban_boards board
cross join (
  values
    ('Ideas', 0),
    ('Planned', 1),
    ('In progress', 2),
    ('Review', 3),
    ('Published', 4)
) as stage(name, position)
where board.name = 'Velaris Operations'
  and not exists (
    select 1
    from public.kanban_columns existing
    where existing.board_id = board.id
);
