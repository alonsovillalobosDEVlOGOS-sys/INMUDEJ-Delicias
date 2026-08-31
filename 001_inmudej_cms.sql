-- INMUDEJ CMS / Supabase migration
-- Safe to run more than once where noted. Review before production.

create extension if not exists pgcrypto;
create extension if not exists citext;

-- ---------- Roles and users ----------
create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text default '',
  permissions jsonb not null default '{}'::jsonb,
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.roles (code,name,description,permissions,is_system)
values
('admin','Administrador general','Control total del CMS, usuarios, roles y contenidos.',
 '{"content":true,"events":true,"services":true,"docs":true,"institutional":true,"users":true,"roles":true}'::jsonb,true),
('editor','Editor de contenido','Administra contenidos públicos sin gestionar usuarios o roles.',
 '{"content":true,"events":true,"services":true,"docs":true,"institutional":true,"users":false,"roles":false}'::jsonb,true),
('agenda','Agenda y convocatorias','Administra calendario, convocatorias y formularios.',
 '{"content":true,"events":true,"services":false,"docs":false,"institutional":false,"users":false,"roles":false}'::jsonb,true),
('viewer','Solo consulta','Puede ingresar al panel en modo consulta.',
 '{"content":false,"events":false,"services":false,"docs":false,"institutional":false,"users":false,"roles":false}'::jsonb,true)
on conflict (code) do update set
  name=excluded.name,
  description=excluded.description,
  permissions=excluded.permissions,
  is_system=excluded.is_system,
  updated_at=now();

create table if not exists public.app_config (
  id text primary key default 'main',
  bootstrap_open boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint app_config_singleton check (id='main')
);
insert into public.app_config(id,bootstrap_open) values('main',true)
on conflict(id) do nothing;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username citext not null unique,
  full_name text not null default '',
  email citext not null,
  role_id uuid references public.roles(id),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_invites (
  id uuid primary key default gen_random_uuid(),
  email citext not null,
  username citext not null,
  role_id uuid not null references public.roles(id),
  token uuid not null default gen_random_uuid() unique,
  expires_at timestamptz not null default (now()+interval '7 days'),
  accepted_at timestamptz,
  invited_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- ---------- Public content ----------
create table if not exists public.site_settings (
  id text primary key default 'main',
  hero_title_prefix text not null default 'Deporte y juventud que',
  hero_title_accent text not null default 'mueven a Delicias.',
  hero_lead text not null default '',
  facebook text not null default 'https://www.facebook.com/INMUDEJDelicias',
  address text not null default 'Delicias, Chihuahua',
  mission_title text not null default '',
  mission_text text not null default '',
  vision_title text not null default '',
  vision_text text not null default '',
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id='main')
);

create table if not exists public.carousel_items (
  id text primary key default (gen_random_uuid()::text),
  title text not null,
  subtitle text default '',
  image_url text not null,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id text primary key default (gen_random_uuid()::text),
  title text not null,
  description text not null default '',
  icon text not null default 'bi-stars',
  tone text not null default 'blue',
  price text default '',
  details text default '',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.forms (
  id text primary key default (gen_random_uuid()::text),
  title text not null,
  description text default '',
  type text not null default 'pdf',
  url text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.calls (
  id text primary key default (gen_random_uuid()::text),
  title text not null,
  category text not null default 'Convocatoria',
  event_date date,
  summary text not null default '',
  image_url text default '',
  link_url text default '',
  form_id text references public.forms(id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id text primary key default (gen_random_uuid()::text),
  title text not null,
  event_date date not null,
  event_time time,
  location text default '',
  category text not null default 'Deporte',
  description text default '',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id text primary key default (gen_random_uuid()::text),
  title text not null,
  type text not null default 'Documento',
  description text default '',
  url text not null,
  icon text not null default 'bi-file-earmark-text',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Seed current landing ----------
insert into public.site_settings(id,hero_title_prefix,hero_title_accent,hero_lead,facebook,address,mission_title,mission_text,vision_title,vision_text)
values(
 'main',
 'Deporte y juventud que',
 'mueven a Delicias.',
 'Un espacio para acercar actividades, servicios, programas y oportunidades que fortalecen la activación física, la convivencia y el desarrollo integral de niñas, niños, jóvenes y familias del municipio.',
 'https://www.facebook.com/INMUDEJDelicias',
 'Delicias, Chihuahua',
 'Promover una vida activa y un desarrollo integral',
 'Planear, promover, desarrollar, vigilar, fomentar y estimular la práctica y enseñanza del deporte, la cultura física y el desarrollo integral de la población del Municipio de Delicias, acercando programas y acciones con sentido comunitario.',
 'Un Delicias con más oportunidades para activarse y crecer',
 'Consolidar un instituto cercano, incluyente y dinámico, reconocido por fortalecer el deporte municipal y generar espacios, programas y experiencias que impulsen el talento, la participación juvenil, la convivencia y hábitos saludables.'
)
on conflict(id) do nothing;

insert into public.carousel_items(id,title,subtitle,image_url,sort_order,active) values
('car-1','Más actividad. Más comunidad.','Deporte, juventud e inclusión para Delicias.','assets/img/natacion-inmudej.jpg',1,true),
('car-2','INMUDEJ Delicias','Programas y oportunidades para nuestra comunidad.','assets/img/identidad-institucional.jpg',2,true)
on conflict(id) do nothing;

insert into public.services(id,title,description,icon,tone,price,details,active) values
('srv-1','Ligas, torneos y competencias','Organización y acompañamiento de actividades deportivas municipales, escolares y comunitarias.','bi-trophy','blue','','',true),
('srv-2','Activación física y escuelas deportivas','Programas para fomentar hábitos saludables, iniciación deportiva y práctica constante en distintas disciplinas.','bi-person-running','green','','',true),
('srv-3','Impulso a deportistas y entrenadores','Orientación y vinculación para fortalecer procesos de formación, participación y representación deportiva.','bi-award','orange','','',true),
('srv-4','Programas para juventudes','Actividades de participación, integración, reconocimiento y desarrollo para jóvenes de Delicias.','bi-people-fill','purple','','',true),
('srv-5','Espacios e instalaciones deportivas','Información sobre actividades y servicios que se desarrollan en instalaciones deportivas municipales.','bi-building','cyan','','',true),
('srv-6','Integración e inclusión','Acciones que utilizan el deporte como herramienta para convivencia, inclusión, bienestar y fortalecimiento comunitario.','bi-hearts','amber','','',true)
on conflict(id) do nothing;

insert into public.documents(id,type,title,description,url,icon,active) values
('doc-1','Privacidad','Aviso Simplificado de Privacidad','Documento de información básica sobre el tratamiento de datos personales.','assets/pdfs/privacidad/aviso-privacidad-simplificado.pdf','bi-shield-check',true),
('doc-2','Privacidad','Aviso de Privacidad Integral','Información completa sobre finalidades, derechos y tratamiento de datos.','assets/pdfs/privacidad/aviso-privacidad-integral.pdf','bi-file-lock2',true),
('doc-3','Obligaciones','Fracciones ICHITAIP','Consulta las obligaciones de transparencia aplicables al Instituto.','fracciones-ichitaip.html','bi-list-check',true),
('doc-4','Normatividad','Reglamento Interior del INMUDEJ','Bases de regulación, funcionamiento, atribuciones y facultades del Instituto.','visor-pdf.html?file=assets/pdfs/normatividad/reglamento-interior-inmudej.pdf&title=Reglamento%20Interior%20del%20INMUDEJ','bi-journal-bookmark-fill',true),
('doc-5','Normatividad','Acuerdo de Creación del INMUDEJ','Instrumento de creación y fundamento del organismo público descentralizado.','visor-pdf.html?file=assets/pdfs/normatividad/acuerdo-creacion-inmudej.pdf&title=Acuerdo%20de%20Creación%20del%20INMUDEJ','bi-bank',true),
('doc-6','Organización','Manual de Organización','Estructura, funciones, responsabilidades y organización administrativa del Instituto.','visor-pdf.html?file=assets/pdfs/normatividad/manual-organizacion-inmudej.pdf&title=Manual%20de%20Organización%20del%20INMUDEJ','bi-diagram-3',true)
on conflict(id) do nothing;

-- ---------- Helpers ----------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at=now();
  return new;
end; $$;

do $$
declare t text;
begin
  foreach t in array array['roles','app_config','profiles','site_settings','carousel_items','services','forms','calls','events','documents']
  loop
    execute format('drop trigger if exists trg_%I_touch on public.%I',t,t);
    execute format('create trigger trg_%I_touch before update on public.%I for each row execute function public.touch_updated_at()',t,t);
  end loop;
end $$;

create or replace function public.current_permissions()
returns jsonb
language sql
stable
security definer
set search_path=public
as $$
  select coalesce(r.permissions,'{}'::jsonb)
  from public.profiles p
  left join public.roles r on r.id=p.role_id
  where p.id=auth.uid() and p.active=true
  limit 1;
$$;

create or replace function public.has_permission(permission_key text)
returns boolean
language sql
stable
security definer
set search_path=public
as $$
  select coalesce((public.current_permissions()->>permission_key)::boolean,false);
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path=public
as $$
  select exists(select 1 from public.profiles where id=auth.uid() and active=true);
$$;

create or replace function public.bootstrap_status()
returns boolean
language sql
stable
security definer
set search_path=public
as $$
  select coalesce((select bootstrap_open from public.app_config where id='main'),false);
$$;

create or replace function public.lookup_login_email(p_identifier text)
returns text
language sql
stable
security definer
set search_path=public
as $$
  select email::text
  from public.profiles
  where active=true and lower(username::text)=lower(trim(p_identifier))
  limit 1;
$$;

create or replace function public.claim_first_admin()
returns boolean
language plpgsql
security definer
set search_path=public
as $$
declare
  admin_role uuid;
  current_username text;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  select username::text into current_username from public.profiles where id=auth.uid();
  if lower(coalesce(current_username,'')) <> 'admin' then
    raise exception 'The bootstrap account must use username admin';
  end if;
  if not coalesce((select bootstrap_open from public.app_config where id='main'),false) then
    return false;
  end if;
  if exists(
    select 1 from public.profiles p join public.roles r on r.id=p.role_id
    where r.code='admin' and p.active=true
  ) then
    update public.app_config set bootstrap_open=false where id='main';
    return false;
  end if;
  select id into admin_role from public.roles where code='admin';
  update public.profiles set role_id=admin_role,active=true where id=auth.uid();
  update public.app_config set bootstrap_open=false where id='main';
  return true;
end; $$;

create or replace function public.get_invite(p_token uuid)
returns table(email text,username text,role_name text,expires_at timestamptz,valid boolean)
language sql
stable
security definer
set search_path=public
as $$
  select i.email::text,i.username::text,r.name,i.expires_at,
         (i.accepted_at is null and i.expires_at>now()) as valid
  from public.user_invites i join public.roles r on r.id=i.role_id
  where i.token=p_token
  limit 1;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
declare
  default_role uuid;
  chosen_role uuid;
  chosen_username text;
  invite public.user_invites%rowtype;
  invite_token uuid;
begin
  select id into default_role from public.roles where code='viewer';
  chosen_role:=default_role;
  chosen_username:=coalesce(nullif(trim(new.raw_user_meta_data->>'username'),''),split_part(new.email,'@',1));

  begin
    invite_token:=nullif(new.raw_user_meta_data->>'invite_token','')::uuid;
  exception when others then
    invite_token:=null;
  end;

  if invite_token is not null then
    select * into invite from public.user_invites
      where token=invite_token and accepted_at is null and expires_at>now()
      for update;
    if found and lower(invite.email::text)=lower(new.email) then
      chosen_role:=invite.role_id;
      chosen_username:=invite.username::text;
      update public.user_invites set accepted_at=now() where id=invite.id;
    end if;
  end if;

  insert into public.profiles(id,username,full_name,email,role_id,active)
  values(new.id,chosen_username,coalesce(new.raw_user_meta_data->>'full_name',''),new.email,chosen_role,true)
  on conflict(id) do update set
    username=excluded.username,
    full_name=excluded.full_name,
    email=excluded.email,
    updated_at=now();
  return new;
end; $$;

drop trigger if exists on_auth_user_created_inmudej on auth.users;
create trigger on_auth_user_created_inmudej
after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------- RLS ----------
alter table public.roles enable row level security;
alter table public.app_config enable row level security;
alter table public.profiles enable row level security;
alter table public.user_invites enable row level security;
alter table public.site_settings enable row level security;
alter table public.carousel_items enable row level security;
alter table public.services enable row level security;
alter table public.forms enable row level security;
alter table public.calls enable row level security;
alter table public.events enable row level security;
alter table public.documents enable row level security;

-- Roles
 drop policy if exists roles_staff_read on public.roles;
create policy roles_staff_read on public.roles for select to authenticated using(public.is_staff());
 drop policy if exists roles_admin_insert on public.roles;
create policy roles_admin_insert on public.roles for insert to authenticated with check(public.has_permission('roles'));
 drop policy if exists roles_admin_update on public.roles;
create policy roles_admin_update on public.roles for update to authenticated using(public.has_permission('roles')) with check(public.has_permission('roles'));
 drop policy if exists roles_admin_delete on public.roles;
create policy roles_admin_delete on public.roles for delete to authenticated using(public.has_permission('roles') and is_system=false);

-- Profiles
 drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles for select to authenticated using(id=auth.uid() or public.has_permission('users'));
 drop policy if exists profiles_update_admin on public.profiles;
create policy profiles_update_admin on public.profiles for update to authenticated
using(public.has_permission('users'))
with check(public.has_permission('users'));

-- Invites
 drop policy if exists invites_admin_all on public.user_invites;
create policy invites_admin_all on public.user_invites for all to authenticated
using(public.has_permission('users')) with check(public.has_permission('users'));

-- Public content read + staff full read
 drop policy if exists site_public_read on public.site_settings;
create policy site_public_read on public.site_settings for select to anon,authenticated using(true);
 drop policy if exists site_staff_update on public.site_settings;
create policy site_staff_update on public.site_settings for update to authenticated using(public.has_permission('institutional')) with check(public.has_permission('institutional'));

 drop policy if exists carousel_public_read on public.carousel_items;
create policy carousel_public_read on public.carousel_items for select to anon,authenticated using(active=true or public.is_staff());
 drop policy if exists carousel_manage on public.carousel_items;
create policy carousel_manage on public.carousel_items for all to authenticated using(public.has_permission('content')) with check(public.has_permission('content'));

 drop policy if exists services_public_read on public.services;
create policy services_public_read on public.services for select to anon,authenticated using(active=true or public.is_staff());
 drop policy if exists services_manage on public.services;
create policy services_manage on public.services for all to authenticated using(public.has_permission('services')) with check(public.has_permission('services'));

 drop policy if exists forms_public_read on public.forms;
create policy forms_public_read on public.forms for select to anon,authenticated using(active=true or public.is_staff());
 drop policy if exists forms_manage on public.forms;
create policy forms_manage on public.forms for all to authenticated using(public.has_permission('content')) with check(public.has_permission('content'));

 drop policy if exists calls_public_read on public.calls;
create policy calls_public_read on public.calls for select to anon,authenticated using(active=true or public.is_staff());
 drop policy if exists calls_manage on public.calls;
create policy calls_manage on public.calls for all to authenticated using(public.has_permission('content')) with check(public.has_permission('content'));

 drop policy if exists events_public_read on public.events;
create policy events_public_read on public.events for select to anon,authenticated using(active=true or public.is_staff());
 drop policy if exists events_manage on public.events;
create policy events_manage on public.events for all to authenticated using(public.has_permission('events')) with check(public.has_permission('events'));

 drop policy if exists documents_public_read on public.documents;
create policy documents_public_read on public.documents for select to anon,authenticated using(active=true or public.is_staff());
 drop policy if exists documents_manage on public.documents;
create policy documents_manage on public.documents for all to authenticated using(public.has_permission('docs')) with check(public.has_permission('docs'));

-- App config: no direct client writes; bootstrap_status/claim_first_admin handle it.
 drop policy if exists app_config_admin_read on public.app_config;
create policy app_config_admin_read on public.app_config for select to authenticated using(public.has_permission('roles'));

-- ---------- Storage ----------
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values(
 'inmudej-public','inmudej-public',true,10485760,
 array['image/jpeg','image/png','image/webp','application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
on conflict(id) do update set public=true,file_size_limit=10485760,allowed_mime_types=excluded.allowed_mime_types;

create or replace function public.can_upload_public_assets()
returns boolean
language sql stable security definer set search_path=public as $$
  select public.has_permission('content') or public.has_permission('services') or public.has_permission('docs') or public.has_permission('institutional');
$$;

 drop policy if exists inmudej_storage_public_read on storage.objects;
create policy inmudej_storage_public_read on storage.objects for select to public using(bucket_id='inmudej-public');
 drop policy if exists inmudej_storage_staff_insert on storage.objects;
create policy inmudej_storage_staff_insert on storage.objects for insert to authenticated with check(bucket_id='inmudej-public' and public.can_upload_public_assets());
 drop policy if exists inmudej_storage_staff_update on storage.objects;
create policy inmudej_storage_staff_update on storage.objects for update to authenticated using(bucket_id='inmudej-public' and public.can_upload_public_assets()) with check(bucket_id='inmudej-public' and public.can_upload_public_assets());
 drop policy if exists inmudej_storage_staff_delete on storage.objects;
create policy inmudej_storage_staff_delete on storage.objects for delete to authenticated using(bucket_id='inmudej-public' and public.can_upload_public_assets());

-- ---------- API privileges ----------
grant usage on schema public to anon,authenticated;
grant select on public.site_settings,public.carousel_items,public.services,public.forms,public.calls,public.events,public.documents to anon,authenticated;
grant select on public.roles,public.profiles,public.user_invites,public.app_config to authenticated;
grant insert,update,delete on public.carousel_items,public.services,public.forms,public.calls,public.events,public.documents,public.user_invites,public.roles to authenticated;
grant update on public.site_settings,public.profiles to authenticated;
grant execute on function public.current_permissions() to authenticated;
grant execute on function public.has_permission(text) to authenticated;
grant execute on function public.is_staff() to authenticated;
grant execute on function public.bootstrap_status() to anon,authenticated;
grant execute on function public.lookup_login_email(text) to anon,authenticated;
grant execute on function public.claim_first_admin() to authenticated;
grant execute on function public.get_invite(uuid) to anon,authenticated;
grant execute on function public.can_upload_public_assets() to authenticated;

-- End migration
