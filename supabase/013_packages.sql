-- home-app v1.10.0: "החבילה עוברת" — a package waiting for pickup, someone in the house takes it.
create table if not exists public.packages (
  id           uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,     -- who posted it
  owner_name   text not null default '' check (char_length(owner_name) <= 30), -- whose name it is under
  kind         text not null default 'post' check (kind in ('post', 'locker', 'store')),
  place        text not null default '' check (char_length(place) <= 80),
  tracking     text check (char_length(tracking) <= 40),
  code         text check (char_length(code) <= 20),
  due          date,
  note         text check (char_length(note) <= 140),
  status       text not null default 'open' check (status in ('open', 'taken', 'arrived', 'done', 'cancelled')),
  taker_id     uuid references auth.users(id) on delete set null,
  updated_by   uuid,
  remind_due   boolean not null default false,
  remind_taker boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists packages_idx on public.packages(household_id, created_at desc);

alter table public.packages enable row level security;
drop policy if exists pk_sel on public.packages;
drop policy if exists pk_ins on public.packages;
drop policy if exists pk_upd on public.packages;
drop policy if exists pk_del on public.packages;
create policy pk_sel on public.packages for select using (public.is_member(household_id));
create policy pk_ins on public.packages for insert with check (public.is_member(household_id) and user_id = auth.uid());
create policy pk_upd on public.packages for update using (public.is_member(household_id));
create policy pk_del on public.packages for delete using (public.is_member(household_id) and user_id = auth.uid());

do $$ begin alter publication supabase_realtime add table public.packages; exception when duplicate_object then null; end $$;

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
  elsif tg_table_name = 'packages' then
    if tg_op = 'INSERT' then typ := 'pkg_new';
    elsif new.status is distinct from old.status then
      payload := jsonb_build_object('action', 'event', 'type', 'pkg_status', 'id', new.id, 'from', old.status);
    else return new; end if;
  elsif tg_table_name = 'asks' then
    if tg_op = 'INSERT' then typ := 'ask_new';
    elsif new.status is distinct from old.status then
      payload := jsonb_build_object('action', 'event', 'type', 'ask_status', 'id', new.id, 'from', old.status);
    else return new; end if;
  else return new; end if;
  -- members has no id column: only touch new.id when the branch above did not build the payload
  if payload is null then payload := jsonb_build_object('action', 'event', 'type', typ, 'id', new.id); end if;
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

drop trigger if exists packages_notify on public.packages;
create trigger packages_notify after insert or update of status on public.packages for each row execute function public.notify_event();

-- privacy: pickup code and tracking number are wiped 7 days after the package is collected or cancelled
do $$ begin perform cron.unschedule('home-app-packages-clean'); exception when others then null; end $$;
select cron.schedule('home-app-packages-clean', '17 3 * * *', $cron$
  update public.packages set code = null, tracking = null
   where status in ('done', 'cancelled') and updated_at < now() - interval '7 days' and (code is not null or tracking is not null);
$cron$);

select (select count(*) from pg_tables where schemaname = 'public' and tablename = 'packages') packages_table,
       (select count(*) from pg_trigger where tgname = 'packages_notify') pkg_trigger,
       (select count(*) from cron.job where jobname = 'home-app-packages-clean') clean_job;
