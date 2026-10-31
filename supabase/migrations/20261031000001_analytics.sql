create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  event_name text not null check (event_name in ('page_view', 'click')),
  session_id text not null check (char_length(session_id) between 16 and 128),
  path text not null check (char_length(path) between 1 and 512),
  label text,
  metadata jsonb not null default '{}'::jsonb,
  user_id uuid references auth.users(id) on delete set null,
  occurred_at timestamptz not null default now()
);

create index if not exists analytics_events_occurred_at_idx
  on public.analytics_events (occurred_at desc);

create index if not exists analytics_events_event_name_idx
  on public.analytics_events (event_name, occurred_at desc);

alter table public.analytics_events enable row level security;

create policy "Visitors can record analytics events"
  on public.analytics_events for insert
  to anon, authenticated
  with check (
    event_name in ('page_view', 'click')
    and char_length(session_id) between 16 and 128
    and char_length(path) between 1 and 512
  );

create policy "Signed-in team members can read analytics"
  on public.analytics_events for select
  to authenticated
  using (true);

create table if not exists public.leads (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  phone text,
  interest text,
  message text,
  locale text not null default 'en' check (locale in ('en', 'fil')),
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

create policy "Visitors can submit leads"
  on public.leads for insert
  to anon, authenticated
  with check (
    char_length(name) between 1 and 160
    and char_length(email) between 3 and 254
  );

create policy "Signed-in team members can read leads"
  on public.leads for select
  to authenticated
  using (true);
