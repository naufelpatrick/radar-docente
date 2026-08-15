create table if not exists public.content_distribution (
  id uuid primary key default gen_random_uuid(),
  article_guid text not null unique,
  article_title text not null,
  article_url text not null,
  article_summary text not null default '',
  article_category text not null default '',
  article_image_url text,
  published_at timestamptz,
  instagram_caption text not null,
  facebook_caption text not null,
  status text not null default 'draft'
    check (status in ('draft', 'approved', 'scheduled', 'publishing', 'published', 'error')),
  scheduled_for timestamptz,
  instagram_media_id text,
  facebook_post_id text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.content_distribution enable row level security;

comment on table public.content_distribution is
  'Fila privada de distribuição dos artigos da PraxIA. Acesso somente pelas funções serverless com service role.';

create index if not exists content_distribution_status_schedule_idx
  on public.content_distribution (status, scheduled_for);
