-- ============================================================================
-- BEST 3PL PORTAL — database setup (Phase 1: team logins + data)
--
-- How to use: Supabase dashboard -> SQL Editor -> New query -> paste this whole
-- file -> Run. It is safe to run more than once.
--
-- What it creates
--   profiles  one row per login, with a role: admin, staff, client, or none
--   clients   customer companies
--   jobs      work done for a client
-- and the access rules that decide who can see and change what. The rules are
-- enforced by the database itself, not by the website.
-- ============================================================================

-- ---------------------------------------------------------------- tables ----

create table if not exists public.profiles (
  id                    uuid primary key references auth.users (id) on delete cascade,
  email                 text not null default '',
  full_name             text not null default '',
  role                  text not null default 'none'
                        check (role in ('admin', 'staff', 'client', 'none')),
  client_id             uuid,
  must_change_password  boolean not null default false,
  created_at            timestamptz not null default now()
);

create table if not exists public.clients (
  id             uuid primary key default gen_random_uuid(),
  legacy_id      text unique,
  business_name  text not null default '',
  contact_name   text not null default '',
  phone          text not null default '',
  email          text not null default '',
  address        text not null default '',
  created_at     timestamptz not null default now(),
  created_by     uuid references public.profiles (id) on delete set null,
  updated_at     timestamptz not null default now()
);

create table if not exists public.jobs (
  id            uuid primary key default gen_random_uuid(),
  legacy_id     text unique,
  client_id     uuid not null references public.clients (id) on delete cascade,
  job_date      date,
  reference     text not null default '',
  status        text not null default 'in_progress'
                check (status in ('in_progress', 'completed')),
  completed_at  date,
  details       jsonb not null default '{}'::jsonb,
  notes         text not null default '',
  created_at    timestamptz not null default now(),
  created_by    uuid references public.profiles (id) on delete set null,
  updated_at    timestamptz not null default now(),
  updated_by    uuid references public.profiles (id) on delete set null,
  completed_by  uuid references public.profiles (id) on delete set null
);

create index if not exists jobs_client_id_idx on public.jobs (client_id);
create index if not exists jobs_status_idx on public.jobs (status);

-- A client login belongs to one client company (used from Phase 2 on).
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_client_id_fkey') then
    alter table public.profiles
      add constraint profiles_client_id_fkey
      foreign key (client_id) references public.clients (id) on delete set null;
  end if;
end $$;

-- ------------------------------------------------------- role helpers -------
-- These read the caller's own role. They run with elevated rights so the
-- access rules below can use them without looping back on themselves.

create or replace function public.my_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select p.role from public.profiles p where p.id = (select auth.uid())
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.my_role() in ('admin', 'staff'), false)
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.my_role() = 'admin', false)
$$;

-- ------------------------------------------- new login -> profile row -------
-- Every new login gets a profile with NO access, except the very first one,
-- which becomes the admin so someone can manage the rest.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  no_admin_yet boolean;
begin
  select not exists (select 1 from public.profiles where role = 'admin') into no_admin_yet;

  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    case when no_admin_yet then 'admin' else 'none' end
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Logins created before this script ran: give them profiles too.
insert into public.profiles (id, email, role)
select u.id, coalesce(u.email, ''), 'none'
from auth.users u
on conflict (id) do nothing;

-- If nobody is admin yet, the oldest login becomes admin.
update public.profiles
set role = 'admin'
where id = (select u.id from auth.users u order by u.created_at asc limit 1)
  and not exists (select 1 from public.profiles where role = 'admin');

-- ------------------------------------- guard rails on profile changes -------
-- People can edit their own name and clear their own "must change password"
-- flag. Only an admin can change anyone's role. There is always one admin.

create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Changes made from the Supabase dashboard or by the server are trusted.
  if (select auth.uid()) is null then
    return new;
  end if;

  if new.id is distinct from old.id then
    raise exception 'A profile cannot be moved to another login.';
  end if;

  if not public.is_admin() then
    if new.role is distinct from old.role
       or new.client_id is distinct from old.client_id
       or new.email is distinct from old.email then
      raise exception 'Only an admin can change roles.';
    end if;
  end if;

  if old.role = 'admin' and new.role <> 'admin'
     and (select count(*) from public.profiles where role = 'admin') <= 1 then
    raise exception 'There has to be at least one admin.';
  end if;

  return new;
end;
$$;

drop trigger if exists protect_profile_fields on public.profiles;
create trigger protect_profile_fields
  before update on public.profiles
  for each row execute function public.protect_profile_fields();

-- ------------------------------------------ who-did-what, set by the db -----
-- The database stamps who created, changed, and completed each record, so it
-- cannot be faked from the browser.

create or replace function public.stamp_client()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := (select auth.uid());
begin
  if tg_op = 'INSERT' then
    if me is not null then new.created_by := me; end if;
  else
    new.created_at := old.created_at;
    new.created_by := old.created_by;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists stamp_client on public.clients;
create trigger stamp_client
  before insert or update on public.clients
  for each row execute function public.stamp_client();

create or replace function public.stamp_job()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := (select auth.uid());
begin
  if tg_op = 'INSERT' then
    if me is not null then
      new.created_by := me;
      new.updated_by := me;
      new.completed_by := case when new.status = 'completed' then me else null end;
    end if;
  else
    new.created_at := old.created_at;
    new.created_by := old.created_by;
    if me is not null then
      new.updated_by := me;
      if new.status = 'completed' and old.status is distinct from 'completed' then
        new.completed_by := me;
      elsif new.status <> 'completed' then
        new.completed_by := null;
      else
        new.completed_by := old.completed_by;
      end if;
    end if;
  end if;
  if new.status <> 'completed' then
    new.completed_at := null;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists stamp_job on public.jobs;
create trigger stamp_job
  before insert or update on public.jobs
  for each row execute function public.stamp_job();

-- -------------------------------------------------------- access rules ------

alter table public.profiles enable row level security;
alter table public.clients  enable row level security;
alter table public.jobs     enable row level security;

-- profiles: you see your own; staff and admins see everyone's.
drop policy if exists "profiles: read own or staff reads all" on public.profiles;
create policy "profiles: read own or staff reads all"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or public.is_staff());

drop policy if exists "profiles: update own or admin updates any" on public.profiles;
create policy "profiles: update own or admin updates any"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()) or public.is_admin())
  with check (id = (select auth.uid()) or public.is_admin());

-- clients: staff and admins read, add, and edit. Only an admin can delete,
-- because deleting a client also deletes its whole job history.
drop policy if exists "clients: staff read" on public.clients;
create policy "clients: staff read"
  on public.clients for select to authenticated
  using (public.is_staff());

drop policy if exists "clients: staff add" on public.clients;
create policy "clients: staff add"
  on public.clients for insert to authenticated
  with check (public.is_staff());

drop policy if exists "clients: staff edit" on public.clients;
create policy "clients: staff edit"
  on public.clients for update to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "clients: admin delete" on public.clients;
create policy "clients: admin delete"
  on public.clients for delete to authenticated
  using (public.is_admin());

-- jobs: staff and admins do everything.
drop policy if exists "jobs: staff read" on public.jobs;
create policy "jobs: staff read"
  on public.jobs for select to authenticated
  using (public.is_staff());

drop policy if exists "jobs: staff add" on public.jobs;
create policy "jobs: staff add"
  on public.jobs for insert to authenticated
  with check (public.is_staff());

drop policy if exists "jobs: staff edit" on public.jobs;
create policy "jobs: staff edit"
  on public.jobs for update to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "jobs: staff delete" on public.jobs;
create policy "jobs: staff delete"
  on public.jobs for delete to authenticated
  using (public.is_staff());

-- ------------------------------------------------------- permissions --------
-- Signed-in people may reach these tables (the rules above then decide which
-- rows). Visitors who are not signed in get nothing.

revoke all on public.profiles, public.clients, public.jobs from anon;

grant usage on schema public to authenticated;
grant select, update                 on public.profiles to authenticated;
grant select, insert, update, delete on public.clients  to authenticated;
grant select, insert, update, delete on public.jobs     to authenticated;

revoke execute on function public.my_role(), public.is_staff(), public.is_admin() from public, anon;
grant  execute on function public.my_role(), public.is_staff(), public.is_admin() to authenticated;

revoke execute on function public.handle_new_user(), public.protect_profile_fields(),
                           public.stamp_client(), public.stamp_job() from public, anon, authenticated;
