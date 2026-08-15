update public.workshop_waitlist
set etapa_ensino = 'superior_graduacao'
where etapa_ensino = 'superior';

alter table public.workshop_waitlist
  drop constraint if exists workshop_waitlist_etapa_ensino_check;

alter table public.workshop_waitlist
  add constraint workshop_waitlist_etapa_ensino_check
  check (etapa_ensino in ('fundamental', 'medio', 'superior_graduacao', 'superior_pos_graduacao', 'tecnico', 'outro'));
