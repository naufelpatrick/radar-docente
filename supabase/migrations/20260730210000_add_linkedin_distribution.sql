alter table public.content_distribution
  add column if not exists linkedin_caption text not null default '',
  add column if not exists instagram_enabled boolean not null default true,
  add column if not exists facebook_enabled boolean not null default true,
  add column if not exists linkedin_enabled boolean not null default true,
  add column if not exists linkedin_status text not null default 'pending'
    check (linkedin_status in ('pending', 'published', 'error')),
  add column if not exists linkedin_error text,
  add column if not exists linkedin_post_id text;

comment on column public.content_distribution.linkedin_caption is
  'Legenda profissional e editável enviada à rota do LinkedIn no Make.';
comment on column public.content_distribution.linkedin_enabled is
  'Define se o LinkedIn está selecionado para a próxima publicação.';
comment on column public.content_distribution.linkedin_status is
  'Estado independente da publicação no LinkedIn.';
