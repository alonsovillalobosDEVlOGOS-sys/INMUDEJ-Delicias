begin;

alter table public.services add column if not exists image_url text not null default '';

create table if not exists public.announcements (
  id text primary key,
  title text not null,
  summary text not null default '',
  image_url text not null default '',
  link_url text not null default '',
  published_at date,
  priority integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tournaments (
  id text primary key,
  title text not null,
  sport text not null default 'Deporte',
  start_date date,
  end_date date,
  location text not null default '',
  summary text not null default '',
  image_url text not null default '',
  link_url text not null default '',
  form_id text references public.forms(id) on delete set null,
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.page_sections (
  section_key text primary key,
  eyebrow text not null default '',
  title text not null default '',
  description text not null default '',
  active boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

insert into public.page_sections(section_key,eyebrow,title,description,active,sort_order) values
('conocenos','Conócenos','Impulsamos el deporte, la cultura física y el desarrollo de la juventud','INMUDEJ es el organismo municipal que articula acciones para acercar el deporte y oportunidades de desarrollo a la población de Delicias.',true,10),
('announcements','Avisos destacados','Información importante para nuestra comunidad','Consulta anuncios, cambios, recordatorios y comunicados relevantes del Instituto.',true,20),
('services','Servicios','Atención y programas para una comunidad activa','Consulta servicios, cursos, instalaciones, horarios, requisitos y cuotas vigentes.',true,30),
('tournaments','Torneos y competencias','Compite, participa y representa a Delicias','Encuentra torneos, competencias y encuentros deportivos con fechas, sedes e información de inscripción.',true,40),
('calls','Convocatorias e inscripciones','Participa en las próximas actividades de INMUDEJ','Consulta convocatorias vigentes, requisitos y formularios de inscripción para competencias, cursos, torneos y programas.',true,50),
('calendar','Calendario de actividades','Encuentra eventos, torneos, cursos y convocatorias','Consulta la agenda actualizada de actividades del Instituto.',true,60),
('transparency','Transparencia','Información pública y normatividad','Consulta avisos de privacidad, reglamentos, manuales y demás documentos institucionales del INMUDEJ.',true,70),
('social','INMUDEJ en Facebook','Publicaciones, convocatorias y resultados','Consulta las publicaciones de la página oficial de INMUDEJ Delicias.',true,80)
on conflict(section_key) do nothing;

-- Ensure the shared updated-at trigger is safe and reusable.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_announcements_touch on public.announcements;
create trigger trg_announcements_touch before update on public.announcements for each row execute function public.touch_updated_at();
drop trigger if exists trg_tournaments_touch on public.tournaments;
create trigger trg_tournaments_touch before update on public.tournaments for each row execute function public.touch_updated_at();
drop trigger if exists trg_page_sections_touch on public.page_sections;
create trigger trg_page_sections_touch before update on public.page_sections for each row execute function public.touch_updated_at();

alter table public.announcements enable row level security;
alter table public.tournaments enable row level security;
alter table public.page_sections enable row level security;

drop policy if exists announcements_public_read on public.announcements;
create policy announcements_public_read on public.announcements for select to anon,authenticated using(active=true or public.is_staff());
drop policy if exists announcements_manage on public.announcements;
create policy announcements_manage on public.announcements for all to authenticated using(public.has_permission('content')) with check(public.has_permission('content'));

drop policy if exists tournaments_public_read on public.tournaments;
create policy tournaments_public_read on public.tournaments for select to anon,authenticated using(active=true or public.is_staff());
drop policy if exists tournaments_manage on public.tournaments;
create policy tournaments_manage on public.tournaments for all to authenticated using(public.has_permission('content')) with check(public.has_permission('content'));

drop policy if exists sections_public_read on public.page_sections;
create policy sections_public_read on public.page_sections for select to anon,authenticated using(true);
drop policy if exists sections_manage on public.page_sections;
create policy sections_manage on public.page_sections for all to authenticated using(public.has_permission('institutional')) with check(public.has_permission('institutional'));

grant select on public.announcements, public.tournaments, public.page_sections to anon,authenticated;
grant insert,update,delete on public.announcements, public.tournaments to authenticated;
grant insert,update,delete on public.page_sections to authenticated;

-- Lock down helper functions that are not intended as public endpoints.
revoke all on function public.touch_updated_at() from public,anon,authenticated;
revoke all on function public.handle_new_user() from public,anon,authenticated;
revoke all on function public.claim_first_admin() from public,anon;
revoke all on function public.current_permissions() from public,anon;
revoke all on function public.has_permission(text) from public,anon;
revoke all on function public.can_upload_public_assets() from public,anon;
grant execute on function public.claim_first_admin() to authenticated;
grant execute on function public.current_permissions() to authenticated;
grant execute on function public.has_permission(text) to authenticated;
grant execute on function public.can_upload_public_assets() to authenticated;

commit;
