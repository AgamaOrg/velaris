create table if not exists public.content_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  locale text not null check (locale in ('en', 'fil')),
  title text not null,
  body jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug, locale)
);

alter table public.content_pages enable row level security;

create policy "Published content is public"
  on public.content_pages for select
  using (status = 'published');

create policy "Authenticated users manage content"
  on public.content_pages for all to authenticated
  using (true)
  with check (true);
