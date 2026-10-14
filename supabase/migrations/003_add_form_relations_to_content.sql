begin;

alter table public.announcements
  add column if not exists form_id text references public.forms(id) on delete set null;

alter table public.events
  add column if not exists form_id text references public.forms(id) on delete set null;

create index if not exists announcements_form_id_idx on public.announcements(form_id);
create index if not exists events_form_id_idx on public.events(form_id);

commit;
