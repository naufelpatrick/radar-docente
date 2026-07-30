alter table public.content_distribution
  add column if not exists instagram_image_url text,
  add column if not exists facebook_image_url text,
  add column if not exists instagram_status text not null default 'pending'
    check (instagram_status in ('pending', 'published', 'error')),
  add column if not exists facebook_status text not null default 'pending'
    check (facebook_status in ('pending', 'published', 'error')),
  add column if not exists instagram_error text,
  add column if not exists facebook_error text;

-- A arte horizontal antiga continua como Social Graph e pode abastecer apenas o Facebook.
-- Instagram permanece deliberadamente vazio para impedir recorte silencioso.
update public.content_distribution
set facebook_image_url = article_image_url
where facebook_image_url is null
  and article_image_url is not null;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('distribution-images', 'distribution-images', true, 5242880, array['image/jpeg'])
on conflict (id) do update
set public = true,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

comment on column public.content_distribution.article_image_url is
  'Imagem horizontal preservada exclusivamente para Social Graph e compatibilidade.';
comment on column public.content_distribution.instagram_image_url is
  'Arte vertical 1080x1350 exclusiva para publicação no Instagram.';
comment on column public.content_distribution.facebook_image_url is
  'Arte horizontal 1200x630 exclusiva para publicação no Facebook.';
