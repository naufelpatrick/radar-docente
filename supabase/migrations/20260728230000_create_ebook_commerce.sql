create table if not exists public.ebook_orders (
  id uuid primary key,
  buyer_name text not null,
  buyer_email text not null,
  amount numeric(10, 2) not null check (amount = 19.90),
  status text not null default 'pending' check (status in ('pending', 'paid', 'canceled', 'expired', 'failed')),
  checkout_id text unique,
  access_token_hash text not null,
  privacy_notice_acknowledged boolean not null default true,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ebook_webhook_events (
  id text primary key,
  event_type text not null,
  checkout_id text not null,
  received_at timestamptz not null default now()
);

alter table public.ebook_orders enable row level security;
alter table public.ebook_webhook_events enable row level security;

comment on table public.ebook_orders is 'Pedidos do e-book PráxIA. Acesso exclusivo pelo backend com service role.';
comment on column public.ebook_orders.privacy_notice_acknowledged is
  'Registro técnico de apresentação do aviso contextual de privacidade; não representa aceite contratual da política.';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('paid-assets', 'paid-assets', false, 10485760, array['application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
