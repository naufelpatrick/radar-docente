do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'institutional_leads' and column_name = 'privacy_consent') then
    alter table public.institutional_leads rename column privacy_consent to privacy_notice_acknowledged;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'lead_contato' and column_name = 'privacy_consent') then
    alter table public.lead_contato rename column privacy_consent to privacy_notice_acknowledged;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'lead_mentoria' and column_name = 'privacy_consent') then
    alter table public.lead_mentoria rename column privacy_consent to privacy_notice_acknowledged;
  end if;
end $$;

drop policy if exists "public can submit institutional leads" on public.institutional_leads;
create policy "public can submit institutional leads"
on public.institutional_leads for insert to anon, authenticated
with check (
  privacy_notice_acknowledged = true
  and source_page = '/para-instituicoes'
  and status = 'new'
);

drop policy if exists "public can submit contact leads" on public.lead_contato;
create policy "public can submit contact leads"
on public.lead_contato for insert to anon, authenticated
with check (
  privacy_notice_acknowledged = true
  and source_page = '/contato'
  and status = 'new'
);

drop policy if exists "public can submit mentoring leads" on public.lead_mentoria;
create policy "public can submit mentoring leads"
on public.lead_mentoria for insert to anon, authenticated
with check (
  privacy_notice_acknowledged = true
  and source_page = '/mentoria'
  and status = 'new'
);

comment on column public.institutional_leads.privacy_notice_acknowledged is
  'Registro técnico de que o aviso contextual de privacidade foi apresentado; não representa aceite contratual da política.';
comment on column public.lead_contato.privacy_notice_acknowledged is
  'Registro técnico de que o aviso contextual de privacidade foi apresentado; não representa aceite contratual da política.';
comment on column public.lead_mentoria.privacy_notice_acknowledged is
  'Registro técnico de que o aviso contextual de privacidade foi apresentado; não representa aceite contratual da política.';
