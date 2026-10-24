-- home-app v1.5: חדר משפחה — "נחיתה על הדרך" (landings + requests), "בדרך אלינו" (delivery orders), places & favorites
create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 40),
  address text not null default '' check (char_length(address) <= 60),
  kind text not null default 'store',
  favorite boolean not null default false,
  created_at timestamptz not null default now(),
  unique (household_id, name)
);

create table if not exists public.landings (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null default auth.uid(),
  place text not null check (char_length(place) between 1 and 40),
  address text not null default '',
  created_at timestamptz not null default now(),
  ends_at timestamptz not null default now() + interval '12 minutes',
  ended_at timestamptz
);
create index if not exists landings_idx on public.landings(household_id, created_at desc);

create table if not exists public.landing_requests (
  id uuid primary key default gen_random_uuid(),
  landing_id uuid not null references public.landings(id) on delete cascade,
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null default auth.uid(),
  body text not null check (char_length(body) between 1 and 120),
  item_id uuid,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.deliveries (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  opener_id uuid not null default auth.uid(),
  service text not null check (char_length(service) between 1 and 30),
  vendor text not null default '' check (char_length(vendor) <= 60),
  status text not null default 'open' check (status in ('open', 'ordered', 'onway', 'arrived', 'cancelled')),
  closes_at timestamptz not null default now() + interval '10 minutes',
  updated_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists deliveries_idx on public.deliveries(household_id, created_at desc);

create table if not exists public.delivery_lines (
  id uuid primary key default gen_random_uuid(),
  delivery_id uuid not null references public.deliveries(id) on delete cascade,
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null default auth.uid(),
  body text not null check (char_length(body) between 1 and 200),
  created_at timestamptz not null default now()
);

-- members of the home only; rows that name a person are written by that person
alter table public.places enable row level security;
alter table public.landings enable row level security;
alter table public.landing_requests enable row level security;
alter table public.deliveries enable row level security;
alter table public.delivery_lines enable row level security;
drop policy if exists pl_all on public.places;
create policy pl_all on public.places for all using (public.is_member(household_id)) with check (public.is_member(household_id));
drop policy if exists ld_sel on public.landings;
drop policy if exists ld_ins on public.landings;
drop policy if exists ld_upd on public.landings;
create policy ld_sel on public.landings for select using (public.is_member(household_id));
create policy ld_ins on public.landings for insert with check (public.is_member(household_id) and user_id = auth.uid());
create policy ld_upd on public.landings for update using (public.is_member(household_id) and user_id = auth.uid());
drop policy if exists lr_sel on public.landing_requests;
drop policy if exists lr_ins on public.landing_requests;
drop policy if exists lr_upd on public.landing_requests;
drop policy if exists lr_del on public.landing_requests;
create policy lr_sel on public.landing_requests for select using (public.is_member(household_id));
create policy lr_ins on public.landing_requests for insert with check (public.is_member(household_id) and user_id = auth.uid());
create policy lr_upd on public.landing_requests for update using (public.is_member(household_id));
create policy lr_del on public.landing_requests for delete using (public.is_member(household_id) and user_id = auth.uid());
drop policy if exists dv_sel on public.deliveries;
drop policy if exists dv_ins on public.deliveries;
drop policy if exists dv_upd on public.deliveries;
create policy dv_sel on public.deliveries for select using (public.is_member(household_id));
create policy dv_ins on public.deliveries for insert with check (public.is_member(household_id) and opener_id = auth.uid());
create policy dv_upd on public.deliveries for update using (public.is_member(household_id));
drop policy if exists dl_sel on public.delivery_lines;
drop policy if exists dl_ins on public.delivery_lines;
drop policy if exists dl_del on public.delivery_lines;
create policy dl_sel on public.delivery_lines for select using (public.is_member(household_id));
create policy dl_ins on public.delivery_lines for insert with check (public.is_member(household_id) and user_id = auth.uid());
create policy dl_del on public.delivery_lines for delete using (public.is_member(household_id) and user_id = auth.uid());

do $$ declare t text; begin
  foreach t in array array['places', 'landings', 'landing_requests', 'deliveries', 'delivery_lines'] loop
    begin execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object then null; end;
  end loop;
end $$;

-- push for the family room goes out from the server, like trips and messages
create or replace function public.notify_event() returns trigger
language plpgsql security definer set search_path = public as $$
declare typ text; payload jsonb;
begin
  if tg_table_name = 'trips' then
    if tg_op = 'INSERT' and new.status = 'active' then typ := 'trip_start';
    elsif tg_op = 'UPDATE' and old.status = 'active' and new.status in ('done', 'cancelled') then
      typ := case new.status when 'done' then 'trip_done' else 'trip_cancel' end;
    else return new; end if;
  elsif tg_table_name = 'messages' then typ := 'message';
  elsif tg_table_name = 'members' then
    payload := jsonb_build_object('action', 'event', 'type', 'member_join', 'hid', new.household_id, 'uid', new.user_id);
  elsif tg_table_name = 'landings' then typ := 'landing';
  elsif tg_table_name = 'landing_requests' then typ := 'landing_req';
  elsif tg_table_name = 'delivery_lines' then typ := 'delivery_line';
  elsif tg_table_name = 'deliveries' then
    if tg_op = 'INSERT' then typ := 'delivery_open';
    elsif new.status is distinct from old.status then typ := 'delivery_status';
    else return new; end if;
  else return new; end if;
  payload := coalesce(payload, jsonb_build_object('action', 'event', 'type', typ, 'id', new.id));
  perform net.http_post(
    url := 'https://hzkhareegpqblowiddxm.supabase.co/functions/v1/notify',
    headers := jsonb_build_object('Content-Type', 'application/json',
                                  'x-cron-secret', (select value from public.app_secrets where name = 'cron')),
    body := payload);
  return new;
exception when others then
  raise warning 'notify_event failed: %', sqlerrm;
  return new;
end $$;

drop trigger if exists landings_notify on public.landings;
create trigger landings_notify after insert on public.landings for each row execute function public.notify_event();
drop trigger if exists landing_requests_notify on public.landing_requests;
create trigger landing_requests_notify after insert on public.landing_requests for each row execute function public.notify_event();
drop trigger if exists deliveries_notify on public.deliveries;
create trigger deliveries_notify after insert or update of status on public.deliveries for each row execute function public.notify_event();
drop trigger if exists delivery_lines_notify on public.delivery_lines;
create trigger delivery_lines_notify after insert on public.delivery_lines for each row execute function public.notify_event();

-- Dotan & Noa's favourite stops
with h as (select household_id hid from public.members where display_name = 'דותן' order by joined_at limit 1)
insert into public.places(household_id, name, kind, favorite)
select hid, v.n, v.k, true from h, (values ('Yellow', 'fuel'), ('טיב טעם', 'super'), ('am:pm', 'super'), ('סופר יהודה', 'super'), ('סופר באבא', 'super')) v(n, k)
on conflict (household_id, name) do update set favorite = true;

select (select count(*) from pg_tables where schemaname = 'public' and tablename in ('places', 'landings', 'landing_requests', 'deliveries', 'delivery_lines')) tables,
       (select count(*) from pg_trigger where tgname in ('landings_notify', 'landing_requests_notify', 'deliveries_notify', 'delivery_lines_notify')) triggers,
       (select count(*) from public.places where favorite) favorites;
