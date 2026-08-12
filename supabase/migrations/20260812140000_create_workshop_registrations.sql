create extension if not exists pgcrypto;

create table if not exists public.workshop_editions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  titulo text not null check (length(trim(titulo)) between 3 and 180),
  descricao text not null,
  inicio_em timestamptz not null,
  fim_em timestamptz not null check (fim_em > inicio_em),
  timezone text not null default 'America/Sao_Paulo',
  valor numeric(10,2) not null check (valor >= 0),
  meeting_url text not null,
  telefone_alternativo text,
  meeting_pin text,
  carga_horaria integer not null check (carga_horaria > 0),
  status text not null default 'rascunho' check (status in ('rascunho', 'inscricoes_abertas', 'inscricoes_encerradas', 'realizado', 'cancelado')),
  limite_vagas integer check (limite_vagas is null or limite_vagas > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workshop_registrations (
  id uuid primary key,
  workshop_id uuid not null references public.workshop_editions(id) on delete restrict,
  nome text not null check (length(trim(nome)) between 3 and 160),
  email text not null check (length(email) <= 254),
  cpf text not null check (cpf ~ '^\d{11}$'),
  telefone text not null check (telefone ~ '^\d{10,13}$'),
  valor numeric(10,2) not null check (valor >= 0),
  status_pagamento text not null default 'aguardando_pagamento' check (status_pagamento in ('aguardando_pagamento', 'pago', 'cancelado', 'expirado', 'falhou')),
  asaas_customer_id text,
  asaas_payment_id text unique,
  data_pagamento timestamptz,
  confirmation_email_sent_at timestamptz,
  confirmation_email_claimed_at timestamptz,
  confirmation_email_error text,
  presenca boolean not null default false,
  certificado_id uuid references public.certificados(id) on delete set null,
  access_token_hash text not null,
  access_token_secret text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workshop_id, email),
  unique (workshop_id, cpf)
);

create table if not exists public.workshop_webhook_events (
  id text primary key,
  event_type text not null,
  asaas_payment_id text not null,
  received_at timestamptz not null default now()
);

create index if not exists workshop_editions_status_idx on public.workshop_editions(status, inicio_em);
create index if not exists workshop_registrations_workshop_idx on public.workshop_registrations(workshop_id, status_pagamento);
create index if not exists workshop_registrations_email_idx on public.workshop_registrations(lower(email));
create index if not exists workshop_registrations_created_idx on public.workshop_registrations(created_at desc);

alter table public.workshop_editions enable row level security;
alter table public.workshop_editions force row level security;
alter table public.workshop_registrations enable row level security;
alter table public.workshop_registrations force row level security;
alter table public.workshop_webhook_events enable row level security;
alter table public.workshop_webhook_events force row level security;
revoke all on public.workshop_editions, public.workshop_registrations, public.workshop_webhook_events from public, anon, authenticated;

insert into public.workshop_editions (
  slug, titulo, descricao, inicio_em, fim_em, timezone, valor, meeting_url,
  telefone_alternativo, meeting_pin, carga_horaria, status
) values (
  'ia-pratica-docente-2026-08-29',
  'WORKSHOP | IA para Prática Docente',
  'Uma conversa prática para transformar tecnologia em decisões pedagógicas melhores.',
  '2026-08-29 08:30:00-03',
  '2026-08-29 12:30:00-03',
  'America/Sao_Paulo',
  50.00,
  'https://meet.google.com/coh-eusf-exg',
  '+55 11 4560-8092',
  '852 055 146#',
  4,
  'inscricoes_abertas'
) on conflict (slug) do update set
  titulo = excluded.titulo,
  descricao = excluded.descricao,
  inicio_em = excluded.inicio_em,
  fim_em = excluded.fim_em,
  timezone = excluded.timezone,
  valor = excluded.valor,
  meeting_url = excluded.meeting_url,
  telefone_alternativo = excluded.telefone_alternativo,
  meeting_pin = excluded.meeting_pin,
  carga_horaria = excluded.carga_horaria,
  status = excluded.status,
  updated_at = now();

comment on table public.workshop_editions is 'Turmas de workshops. Dados privados de acesso são servidos somente pelo backend após pagamento.';
comment on table public.workshop_registrations is 'Inscrições pagas, dados pessoais e credenciais de consulta. Acesso exclusivo pelo backend.';
comment on table public.workshop_webhook_events is 'Eventos ASAAS processados de forma idempotente.';

