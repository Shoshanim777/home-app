-- home-app v1 schema: households, members, items (shopping lists), trips ("בדרך לסופר"), push subscriptions

create extension if not exists pgcrypto;

create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'הבית שלנו',
  invite_code text not null unique default upper(substr(encode(gen_random_bytes(4), 'hex'), 1, 6)),
  created_at timestamptz not null default now()
);

create table if not exists public.members (
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null,
  color text not null default '#5B3DF5',
  joined_at timestamptz not null default now(),
  primary key (household_id, user_id)
);
create index if not exists members_user_idx on public.members(user_id);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  list text not null default 'super',
  name text not null check (length(trim(name)) between 1 and 80),
  qty text not null default '1',
  note text not null default '',
  category text not null default 'אחר',
  in_cart boolean not null default false,
  added_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists items_household_idx on public.items(household_id, list);

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  shopper_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'active' check (status in ('active','done','cancelled')),
  started_at timestamptz not null default now(),
  remind_at timestamptz not null default now() + interval '15 minutes',
  reminded boolean not null default false,
  finished_at timestamptz,
  bought_count int,
  left_count int
);
create index if not exists trips_household_idx on public.trips(household_id, status);
create unique index if not exists trips_one_active on public.trips(household_id) where status = 'active';

create table if not exists public.push_subscriptions (
  endpoint text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

-- helpers ---------------------------------------------------------------
create or replace function public.is_member(h uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.members where household_id = h and user_id = auth.uid());
$$;

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists items_touch on public.items;
create trigger items_touch before update on public.items for each row execute function public.touch_updated_at();

-- RLS -------------------------------------------------------------------
alter table public.households enable row level security;
alter table public.members enable row level security;
alter table public.items enable row level security;
alter table public.trips enable row level security;
alter table public.push_subscriptions enable row level security;

drop policy if exists hh_select on public.households;
create policy hh_select on public.households for select using (public.is_member(id));
drop policy if exists hh_update on public.households;
create policy hh_update on public.households for update using (public.is_member(id));

drop policy if exists m_select on public.members;
create policy m_select on public.members for select using (public.is_member(household_id));
drop policy if exists m_update_self on public.members;
create policy m_update_self on public.members for update using (user_id = auth.uid());

drop policy if exists i_all on public.items;
create policy i_all on public.items for all using (public.is_member(household_id)) with check (public.is_member(household_id));

drop policy if exists t_select on public.trips;
create policy t_select on public.trips for select using (public.is_member(household_id));

drop policy if exists p_own on public.push_subscriptions;
create policy p_own on public.push_subscriptions for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- RPCs ------------------------------------------------------------------
create or replace function public.create_household(p_name text, p_display_name text, p_color text default '#5B3DF5')
returns public.households language plpgsql security definer set search_path = public as $$
declare h public.households;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  insert into public.households(name) values (coalesce(nullif(trim(p_name), ''), 'הבית שלנו')) returning * into h;
  insert into public.members(household_id, user_id, display_name, color) values (h.id, auth.uid(), trim(p_display_name), p_color);
  return h;
end $$;

create or replace function public.join_household(p_code text, p_display_name text, p_color text default '#FF5C8A')
returns public.households language plpgsql security definer set search_path = public as $$
declare h public.households;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  select * into h from public.households where invite_code = upper(trim(p_code));
  if h.id is null then raise exception 'קוד הזמנה לא נמצא'; end if;
  insert into public.members(household_id, user_id, display_name, color)
    values (h.id, auth.uid(), trim(p_display_name), p_color)
    on conflict (household_id, user_id) do update set display_name = excluded.display_name;
  return h;
end $$;

create or replace function public.start_trip(p_household uuid, p_minutes int default 15)
returns public.trips language plpgsql security definer set search_path = public as $$
declare t public.trips;
begin
  if not public.is_member(p_household) then raise exception 'not a member'; end if;
  select * into t from public.trips where household_id = p_household and status = 'active';
  if t.id is not null then return t; end if;
  update public.items set in_cart = false where household_id = p_household and list = 'super' and in_cart;
  insert into public.trips(household_id, shopper_id, remind_at)
    values (p_household, auth.uid(), now() + make_interval(mins => greatest(1, least(p_minutes, 120))))
    returning * into t;
  return t;
end $$;

create or replace function public.snooze_trip(p_trip uuid, p_minutes int default 10)
returns public.trips language plpgsql security definer set search_path = public as $$
declare t public.trips;
begin
  update public.trips set remind_at = now() + make_interval(mins => greatest(1, least(p_minutes, 120))), reminded = false
   where id = p_trip and shopper_id = auth.uid() and status = 'active' returning * into t;
  if t.id is null then raise exception 'trip not found'; end if;
  return t;
end $$;

create or replace function public.finish_trip(p_trip uuid)
returns public.trips language plpgsql security definer set search_path = public as $$
declare t public.trips; b int; l int;
begin
  select * into t from public.trips where id = p_trip and status = 'active' and public.is_member(household_id);
  if t.id is null then raise exception 'trip not found'; end if;
  delete from public.items where household_id = t.household_id and list = 'super' and in_cart;
  get diagnostics b = row_count;
  select count(*) into l from public.items where household_id = t.household_id and list = 'super';
  update public.trips set status = 'done', finished_at = now(), bought_count = b, left_count = l
   where id = p_trip returning * into t;
  return t;
end $$;

create or replace function public.cancel_trip(p_trip uuid)
returns public.trips language plpgsql security definer set search_path = public as $$
declare t public.trips;
begin
  update public.trips set status = 'cancelled', finished_at = now()
   where id = p_trip and status = 'active' and public.is_member(household_id) returning * into t;
  if t.id is null then raise exception 'trip not found'; end if;
  update public.items set in_cart = false where household_id = t.household_id and list = 'super' and in_cart;
  return t;
end $$;

revoke all on function public.create_household(text, text, text) from anon;
revoke all on function public.join_household(text, text, text) from anon;
revoke all on function public.start_trip(uuid, int) from anon;
revoke all on function public.snooze_trip(uuid, int) from anon;
revoke all on function public.finish_trip(uuid) from anon;
revoke all on function public.cancel_trip(uuid) from anon;

-- Realtime --------------------------------------------------------------
alter table public.items replica identity full;
alter table public.trips replica identity full;
do $$ begin
  begin alter publication supabase_realtime add table public.items; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.trips; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.members; exception when duplicate_object then null; end;
end $$;
