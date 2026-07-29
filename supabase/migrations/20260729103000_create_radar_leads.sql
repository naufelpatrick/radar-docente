create table if not exists public.lead_radar (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 160),
  email text not null check (
    char_length(email) <= 254
    and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  city text check (city is null or char_length(city) <= 120),
  institution text check (institution is null or char_length(institution) <= 180),
  teaching_profile text not null check (teaching_profile in (
    'fundamental_early',
    'fundamental_late',
    'high_school',
    'technical_professional',
    'higher_postgraduate'
  )),
  overall_score integer not null check (overall_score between 0 and 100),
  score_band text not null check (score_band in ('initiation', 'exploration', 'integration', 'transformation')),
  dimension_scores jsonb not null check (jsonb_typeof(dimension_scores) = 'object'),
  instrument_version text not null default 'beta-0.1',
  completion_time_seconds integer not null check (completion_time_seconds >= 0),
  marketing_consent boolean not null default false,
  privacy_notice_acknowledged boolean not null check (privacy_notice_acknowledged = true),
  source_page text not null check (source_page = '/radar/revisao'),
  status text not null default 'new' check (status in ('new', 'contacted', 'archived')),
  created_at timestamptz not null default now()
);

alter table public.lead_radar enable row level security;
revoke all on table public.lead_radar from anon, authenticated;
grant insert on table public.lead_radar to anon, authenticated;

drop policy if exists "public can submit radar leads" on public.lead_radar;
create policy "public can submit radar leads"
on public.lead_radar for insert to anon, authenticated
with check (
  privacy_notice_acknowledged = true
  and source_page = '/radar/revisao'
  and status = 'new'
);

create index if not exists lead_radar_created_at_idx on public.lead_radar (created_at desc);
create index if not exists lead_radar_email_idx on public.lead_radar (lower(email));
create index if not exists lead_radar_score_band_idx on public.lead_radar (score_band);
create index if not exists lead_radar_marketing_consent_idx on public.lead_radar (marketing_consent) where marketing_consent = true;

comment on table public.lead_radar is
  'Participantes que solicitaram o relatório gratuito do Radar; não armazena respostas individuais.';
comment on column public.lead_radar.privacy_notice_acknowledged is
  'Registro técnico de apresentação do aviso contextual de privacidade; não representa aceite contratual da política.';
