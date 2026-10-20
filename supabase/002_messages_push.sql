-- home-app v1.2: personal messages, out-of-stock/substitute status, our products, store order, push reminders

-- item status set by the shopper: 'oos' = not in stock, 'sub' = bought an alternative (status_note = what)
alter table public.items add column if not exists status text check (status in ('oos','sub'));
alter table public.items add column if not exists status_note text not null default '';

-- household's own department order (the walking order of their supermarket)
alter table public.households add column if not exists category_order text[];

-- personal messages between household members
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  item_id uuid references public.items(id) on delete set null,
  item_name text not null default '',
  kind text not null default 'text' check (kind in ('text','oos','sub','ask')),
  body text not null default '' check (length(body) <= 300),
  created_at timestamptz not null default now()
);
create index if not exists messages_hh_idx on public.messages(household_id, created_at desc);
alter table public.messages enable row level security;
drop policy if exists msg_select on public.messages;
create policy msg_select on public.messages for select using (public.is_member(household_id));
drop policy if exists msg_insert on public.messages;
create policy msg_insert on public.messages for insert with check (public.is_member(household_id) and sender_id = auth.uid());

-- "המוצרים שלנו": household's own products for the picker
create table if not exists public.custom_products (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null check (length(trim(name)) between 1 and 60),
  emoji text not null default '🛒',
  category text not null default 'אחר',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (household_id, name)
);
alter table public.custom_products enable row level security;
drop policy if exists cp_all on public.custom_products;
create policy cp_all on public.custom_products for all using (public.is_member(household_id)) with check (public.is_member(household_id));

-- server-only secrets (VAPID keys, cron secret). RLS on with no policies = invisible to app users.
create table if not exists public.app_secrets (name text primary key, value text not null);
alter table public.app_secrets enable row level security;
revoke all on public.app_secrets from anon, authenticated;
insert into public.app_secrets(name, value) values ('cron', encode(gen_random_bytes(24), 'hex')) on conflict (name) do nothing;

-- trips: a cancelled trip also undoes substitutions; a new trip clears leftover cart marks
create or replace function public.start_trip(p_household uuid, p_minutes int default 15)
returns public.trips language plpgsql security definer set search_path = public as $$
declare t public.trips;
begin
  if not public.is_member(p_household) then raise exception 'not a member'; end if;
  select * into t from public.trips where household_id = p_household and status = 'active';
  if t.id is not null then return t; end if;
  update public.items set in_cart = false,
    status = case when status = 'sub' then null else status end,
    status_note = case when status = 'sub' then '' else status_note end
   where household_id = p_household and list = 'super' and (in_cart or status = 'sub');
  insert into public.trips(household_id, shopper_id, remind_at)
    values (p_household, auth.uid(), now() + make_interval(mins => greatest(1, least(p_minutes, 120))))
    returning * into t;
  return t;
end $$;

create or replace function public.cancel_trip(p_trip uuid)
returns public.trips language plpgsql security definer set search_path = public as $$
declare t public.trips;
begin
  update public.trips set status = 'cancelled', finished_at = now()
   where id = p_trip and status = 'active' and public.is_member(household_id) returning * into t;
  if t.id is null then raise exception 'trip not found'; end if;
  update public.items set in_cart = false,
    status = case when status = 'sub' then null else status end,
    status_note = case when status = 'sub' then '' else status_note end
   where household_id = t.household_id and list = 'super' and (in_cart or status = 'sub');
  return t;
end $$;

-- realtime
alter table public.messages replica identity full;
alter table public.custom_products replica identity full;
do $$ begin
  begin alter publication supabase_realtime add table public.messages; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.custom_products; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.households; exception when duplicate_object then null; end;
end $$;

-- every minute: if a shopper's reminder time has passed, ask the notify function to push "סיימת לקנות?"
create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron;
do $$ begin perform cron.unschedule('home-app-reminders'); exception when others then null; end $$;
select cron.schedule('home-app-reminders', '* * * * *', $cron$
  select net.http_post(
    url := 'https://hzkhareegpqblowiddxm.supabase.co/functions/v1/notify',
    headers := jsonb_build_object('Content-Type', 'application/json',
                                  'x-cron-secret', (select value from public.app_secrets where name = 'cron')),
    body := '{"action":"reminders"}'::jsonb)
  where exists (select 1 from public.trips where status = 'active' and not reminded and remind_at <= now());
$cron$);
