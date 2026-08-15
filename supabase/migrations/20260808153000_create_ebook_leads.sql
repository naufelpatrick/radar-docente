create table if not exists public.ebook_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 160),
  teaching_profile text not null check (teaching_profile in ('fundamental', 'medio', 'superior', 'tecnico', 'outro', 'nao_professor')),
  email text not null,
  phone text not null,
  messaging_consent boolean not null check (messaging_consent = true),
  messaging_consent_text text not null,
  consented_at timestamptz not null,
  source_page text not null default '/ebook',
  created_at timestamptz not null default now()
);

alter table public.ebook_leads enable row level security;
revoke all on table public.ebook_leads from anon, authenticated;

comment on table public.ebook_leads is
  'Leads que solicitaram o e-book gratuito e consentiram em receber mensagens. Sem acesso público.';

create index if not exists ebook_leads_email_idx on public.ebook_leads (lower(email));
create index if not exists ebook_leads_created_at_idx on public.ebook_leads (created_at desc);
