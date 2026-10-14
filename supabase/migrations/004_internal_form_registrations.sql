begin;

alter table public.forms
  add column if not exists fields jsonb not null default '[]'::jsonb;

create table if not exists public.form_registrations (
  id text primary key default (gen_random_uuid()::text),
  form_id text not null references public.forms(id) on delete cascade,
  content_type text not null check (content_type in ('announcement','call','tournament','event')),
  content_id text not null,
  data jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now()
);

create index if not exists form_registrations_form_id_idx
  on public.form_registrations(form_id);
create index if not exists form_registrations_content_idx
  on public.form_registrations(content_type, content_id);

alter table public.form_registrations enable row level security;

grant insert on public.form_registrations to anon, authenticated;
grant select on public.form_registrations to authenticated;

drop policy if exists registrations_public_insert on public.form_registrations;
create policy registrations_public_insert
on public.form_registrations for insert to anon, authenticated
with check (
  exists (
    select 1
    from public.forms f
    where f.id = form_id
      and f.active = true
      and lower(f.type) = lower('Registro interno')
  )
);

drop policy if exists registrations_staff_read on public.form_registrations;
create policy registrations_staff_read
on public.form_registrations for select to authenticated
using (public.has_permission('content') or public.has_permission('events'));

commit;
