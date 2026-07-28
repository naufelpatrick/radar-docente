create table if not exists public.lead_contato (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  email text not null check (
    char_length(email) <= 254
    and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  subject text not null check (subject in ('radar', 'metodologia', 'formacao', 'parceria', 'privacidade', 'outro')),
  message text not null check (char_length(trim(message)) between 20 and 3000),
  source_page text not null default '/contato' check (source_page = '/contato'),
  privacy_consent boolean not null check (privacy_consent = true),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed'))
);

alter table public.lead_contato enable row level security;
revoke all on table public.lead_contato from anon, authenticated;
grant insert on table public.lead_contato to anon, authenticated;
drop policy if exists "public can submit contact leads" on public.lead_contato;
create policy "public can submit contact leads"
on public.lead_contato for insert to anon, authenticated
with check (privacy_consent = true and source_page = '/contato' and status = 'new');
comment on table public.lead_contato is
  'Mensagens enviadas pelo formulário geral de contato da PráxIA. Sem leitura pública.';
create index if not exists lead_contato_created_at_idx on public.lead_contato (created_at desc);
create index if not exists lead_contato_status_idx on public.lead_contato (status);

create table if not exists public.lead_mentoria (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  email text not null check (
    char_length(email) <= 254
    and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  phone text not null check (char_length(regexp_replace(phone, '[^0-9]', '', 'g')) between 10 and 13),
  teaching_context text not null check (char_length(trim(teaching_context)) between 3 and 300),
  main_challenge text not null check (char_length(trim(main_challenge)) between 20 and 3000),
  source_page text not null default '/mentoria' check (source_page = '/mentoria'),
  privacy_consent boolean not null check (privacy_consent = true),
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed'))
);

alter table public.lead_mentoria enable row level security;
revoke all on table public.lead_mentoria from anon, authenticated;
grant insert on table public.lead_mentoria to anon, authenticated;
drop policy if exists "public can submit mentoring leads" on public.lead_mentoria;
create policy "public can submit mentoring leads"
on public.lead_mentoria for insert to anon, authenticated
with check (privacy_consent = true and source_page = '/mentoria' and status = 'new');
comment on table public.lead_mentoria is
  'Manifestações de interesse na Mentoria PráxIA. Sem leitura pública.';
create index if not exists lead_mentoria_created_at_idx on public.lead_mentoria (created_at desc);
create index if not exists lead_mentoria_status_idx on public.lead_mentoria (status);
