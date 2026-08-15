create extension if not exists pgcrypto;

create table if not exists public.cms_profiles (
  id uuid primary key default gen_random_uuid(),
  username text not null unique check (username = lower(username) and username ~ '^[a-z0-9._-]+$'),
  display_name text not null,
  role text not null check (role in ('admin', 'editor')),
  bio text,
  avatar_url text,
  professional_links jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_login_at timestamptz
);

create table if not exists public.cms_credentials (
  user_id uuid primary key references public.cms_profiles(id) on delete cascade,
  password_hash text not null,
  password_salt text not null,
  password_version integer not null default 1,
  updated_at timestamptz not null default now()
);

create table if not exists public.cms_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.cms_profiles(id) on delete cascade,
  token_hash text not null unique,
  csrf_token_hash text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  user_agent text,
  ip_hash text
);

create table if not exists public.cms_login_attempts (
  id bigint generated always as identity primary key,
  username text not null,
  ip_hash text not null,
  succeeded boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.cms_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text not null default '',
  is_active boolean not null default true,
  created_by uuid references public.cms_profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cms_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  slug text not null,
  excerpt text not null default '',
  content_json jsonb not null default '{"type":"doc","content":[]}'::jsonb,
  content_html text not null default '',
  image_instruction text not null default '',
  cover_image_url text,
  cover_image_webp_url text,
  cover_image_alt text not null default '',
  cover_image_prompt text,
  cover_image_generated_at timestamptz,
  cover_image_generated_by uuid references public.cms_profiles(id),
  cover_image_status text not null default 'missing' check (cover_image_status in ('missing', 'generated', 'approved', 'uploaded')),
  category_id uuid references public.cms_categories(id),
  author_id uuid not null references public.cms_profiles(id),
  status text not null default 'draft' check (status in ('draft', 'in_review', 'approved', 'published', 'archived')),
  meta_title text not null default '',
  meta_description text not null default '',
  canonical_url text not null default '',
  keywords text[] not null default '{}',
  show_table_of_contents boolean not null default true,
  show_editorial_notice boolean not null default false,
  editorial_notice_text text,
  cta_heading_id text,
  cta_json jsonb,
  protocol_json jsonb,
  checklist_json jsonb,
  faq_json jsonb not null default '[]'::jsonb,
  related_article_ids uuid[] not null default '{}',
  legacy_related_paths text[] not null default '{}',
  reading_time_minutes integer not null default 1,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid not null references public.cms_profiles(id),
  updated_by uuid not null references public.cms_profiles(id),
  published_by uuid references public.cms_profiles(id),
  deleted_at timestamptz,
  unique (category_id, slug)
);

create table if not exists public.cms_article_redirects (
  id uuid primary key default gen_random_uuid(),
  old_path text not null unique,
  article_id uuid not null references public.cms_articles(id) on delete cascade,
  created_by uuid not null references public.cms_profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.cms_editorial_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  version integer not null default 1,
  updated_by uuid references public.cms_profiles(id),
  updated_at timestamptz not null default now()
);

create table if not exists public.cms_audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.cms_profiles(id),
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists cms_articles_public_idx on public.cms_articles(status, published_at desc) where deleted_at is null;
create index if not exists cms_articles_updated_idx on public.cms_articles(updated_at desc) where deleted_at is null;
create index if not exists cms_sessions_token_idx on public.cms_sessions(token_hash, expires_at);
create index if not exists cms_login_attempts_window_idx on public.cms_login_attempts(username, ip_hash, created_at desc);
create index if not exists cms_audit_logs_created_idx on public.cms_audit_logs(created_at desc);

alter table public.cms_profiles enable row level security;
alter table public.cms_credentials enable row level security;
alter table public.cms_sessions enable row level security;
alter table public.cms_login_attempts enable row level security;
alter table public.cms_categories enable row level security;
alter table public.cms_articles enable row level security;
alter table public.cms_article_redirects enable row level security;
alter table public.cms_editorial_settings enable row level security;
alter table public.cms_audit_logs enable row level security;

drop policy if exists "public reads published cms articles" on public.cms_articles;
create policy "public reads published cms articles" on public.cms_articles for select to anon
  using (status = 'published' and deleted_at is null and published_at is not null);
drop policy if exists "public reads active cms categories" on public.cms_categories;
create policy "public reads active cms categories" on public.cms_categories for select to anon using (is_active = true);
drop policy if exists "public reads article author profiles" on public.cms_profiles;
create policy "public reads article author profiles" on public.cms_profiles for select to anon
  using (is_active = true and exists (
    select 1 from public.cms_articles article
    where article.author_id = cms_profiles.id and article.status = 'published' and article.deleted_at is null
  ));

insert into public.cms_categories (name, slug, description) values
  ('IA para Professores', 'ia-para-professores', 'Conceitos e critérios para compreender a IA antes de aplicá-la.'),
  ('Competências Docentes', 'competencias-docentes', 'Fluência digital e desenvolvimento profissional docente.'),
  ('Ferramentas', 'ferramentas', 'Recursos avaliados por propósito pedagógico, contexto e condições de uso.'),
  ('Planejamento', 'planejamento', 'Objetivos, evidências e desenho de experiências de aprendizagem.'),
  ('Avaliação', 'avaliacao', 'Evidências, feedback, autoria e acompanhamento da aprendizagem.'),
  ('Ética', 'etica', 'Privacidade, transparência, vieses, segurança e responsabilidade.'),
  ('Pesquisa', 'pesquisa', 'Sínteses de estudos e documentos relevantes para a prática docente.'),
  ('Estudos de Caso', 'estudos-de-caso', 'Decisões, experimentos, limites e ajustes em contexto.')
on conflict (slug) do nothing;

insert into public.cms_editorial_settings (key, value) values
  ('image_directive', to_jsonb('Produzir uma imagem horizontal editorial para um artigo da PráxIA. A imagem deve representar professores, educação, fluência digital, reflexão crítica, autonomia docente e integração responsável da tecnologia. Priorizar pessoas em situações naturais, professores em ação, interação humana, colaboração, aprendizagem, ambientes educacionais contemporâneos, diversidade, realismo fotográfico ou ilustração editorial sofisticada, iluminação profissional, composição horizontal e coerência com o tema. Evitar robôs, cérebros digitais, hologramas, circuitos genéricos, cadeados gigantes, excesso de telas, estética futurista clichê, aparência artificial de banco de imagens, pessoas deformadas, textos, logotipos e elementos desconectados do contexto educacional. A imagem não deve conter título, texto, marca ou logotipo.'::text)),
  ('editorial_notice', to_jsonb('Este conteúdo apresenta orientação educacional geral e não substitui avaliação jurídica, parecer especializado ou as políticas, normas e procedimentos da instituição.'::text)),
  ('default_cta', '{"title":"Descubra como essas decisões aparecem na sua prática","text":"O Radar Docente da PráxIA ajuda a reconhecer forças e oportunidades de desenvolvimento.","label":"Fazer meu Radar Docente","href":"/radar"}'::jsonb),
  ('publisher', '{"name":"PráxIA","url":"https://www.radarpraxia.com/","logo":"https://www.radarpraxia.com/favicon.png"}'::jsonb),
  ('related_articles_limit', '3'::jsonb)
on conflict (key) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('article-covers', 'article-covers', true, 8388608, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 8388608, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public reads approved article covers" on storage.objects;
create policy "public reads approved article covers" on storage.objects for select to anon using (bucket_id = 'article-covers');

comment on table public.cms_credentials is 'Credenciais privadas do CMS; somente funções serverless com service role acessam esta tabela.';
comment on table public.cms_sessions is 'Sessões privadas do CMS com tokens armazenados somente como hash.';
comment on table public.cms_articles is 'Artigos dinâmicos do CMS. Os artigos legados permanecem no código durante a camada de compatibilidade.';
