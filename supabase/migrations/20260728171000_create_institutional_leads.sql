create table if not exists public.institutional_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  institution text not null check (char_length(trim(institution)) between 2 and 160),
  role text not null check (char_length(trim(role)) between 2 and 120),
  email text not null check (
    char_length(email) <= 254
    and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  phone text not null check (char_length(regexp_replace(phone, '[^0-9]', '', 'g')) between 10 and 13),
  city text not null check (char_length(trim(city)) between 2 and 120),
  state text not null check (char_length(trim(state)) between 2 and 80),
  modality text not null check (modality in ('presential', 'online', 'undecided')),
  interest text not null check (interest in ('talk', 'workshop', 'both')),
  participants_range text not null check (char_length(trim(participants_range)) between 1 and 80),
  preferred_period text not null check (char_length(trim(preferred_period)) between 2 and 160),
  message text not null check (char_length(trim(message)) between 10 and 3000),
  source_page text not null default '/para-instituicoes'
    check (source_page = '/para-instituicoes'),
  privacy_consent boolean not null check (privacy_consent = true),
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed'))
);

alter table public.institutional_leads enable row level security;

revoke all on table public.institutional_leads from anon, authenticated;
grant insert on table public.institutional_leads to anon, authenticated;

drop policy if exists "public can submit institutional leads" on public.institutional_leads;
create policy "public can submit institutional leads"
on public.institutional_leads
for insert
to anon, authenticated
with check (
  privacy_consent = true
  and source_page = '/para-instituicoes'
  and status = 'new'
);

comment on table public.institutional_leads is
  'Solicitações comerciais enviadas pelo formulário institucional da PraxIA. Sem leitura pública.';

create index if not exists institutional_leads_created_at_idx
  on public.institutional_leads (created_at desc);

create index if not exists institutional_leads_status_idx
  on public.institutional_leads (status);
