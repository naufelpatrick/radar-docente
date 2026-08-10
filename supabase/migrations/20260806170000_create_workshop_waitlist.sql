create table if not exists public.workshop_waitlist (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(trim(nome)) between 2 and 120),
  email text not null check (char_length(email) <= 254 and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  etapa_ensino text not null check (etapa_ensino in ('fundamental', 'medio', 'superior', 'tecnico', 'outro')),
  duvida_principal text check (duvida_principal is null or char_length(duvida_principal) <= 2000),
  topa_pagar text not null check (topa_pagar in ('sim', 'nao', 'depende')),
  created_at timestamptz not null default now(),
  utm_source text check (utm_source is null or char_length(utm_source) <= 200),
  utm_campaign text check (utm_campaign is null or char_length(utm_campaign) <= 200),
  constraint workshop_waitlist_email_unique unique (email)
);

alter table public.workshop_waitlist enable row level security;
revoke all on table public.workshop_waitlist from anon, authenticated;
grant insert on table public.workshop_waitlist to anon, authenticated;
drop policy if exists "Permitir insert publico" on public.workshop_waitlist;
create policy "Permitir insert publico" on public.workshop_waitlist for insert to anon, authenticated with check (true);

comment on table public.workshop_waitlist is 'Lista de espera do workshop IA na prática docente. Sem leitura pública.';
create index if not exists workshop_waitlist_created_at_idx on public.workshop_waitlist (created_at desc);
