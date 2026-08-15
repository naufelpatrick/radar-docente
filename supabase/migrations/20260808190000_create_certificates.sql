create extension if not exists pgcrypto;

create table if not exists public.certificados (
  id uuid primary key default gen_random_uuid(),
  nome_participante text not null check (length(trim(nome_participante)) between 3 and 160),
  codigo_validacao text not null unique check (codigo_validacao ~ '^PRAXIA-[A-Z0-9_-]{24,}$'),
  workshop_slug text not null default 'ia-na-pratica-docente-2026',
  workshop_titulo text not null default 'IA na Prática Docente',
  carga_horaria integer not null default 4 check (carga_horaria > 0),
  data_realizacao date not null,
  data_emissao timestamptz not null default now(),
  status text not null default 'emitido' check (status in ('emitido', 'revogado')),
  created_at timestamptz not null default now()
);

create unique index if not exists certificados_codigo_validacao_idx
  on public.certificados (codigo_validacao);

alter table public.certificados enable row level security;
alter table public.certificados force row level security;

revoke all on table public.certificados from public, anon, authenticated;

create or replace function public.validar_certificado(p_codigo_validacao text)
returns table (
  nome_participante text,
  workshop_titulo text,
  carga_horaria integer,
  data_realizacao date,
  data_emissao timestamptz,
  codigo_validacao text,
  status text
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    c.nome_participante,
    c.workshop_titulo,
    c.carga_horaria,
    c.data_realizacao,
    c.data_emissao,
    c.codigo_validacao,
    c.status
  from public.certificados c
  where c.codigo_validacao = upper(trim(p_codigo_validacao))
  limit 1;
$$;

revoke all on function public.validar_certificado(text) from public;
grant execute on function public.validar_certificado(text) to anon, authenticated;

comment on table public.certificados is 'Certificados privados. A consulta pública ocorre exclusivamente por validar_certificado(text).';
comment on function public.validar_certificado(text) is 'Retorna somente os campos públicos de um certificado localizado por código exato de alta entropia.';
