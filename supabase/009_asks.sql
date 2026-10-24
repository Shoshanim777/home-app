-- home-app v1.6: "מי יכול להביא לי?" — requests waiting for whoever passes by
create table if not exists public.asks (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null default auth.uid(),
  body text not null check (char_length(body) between 1 and 120),
  place_kind text not null default 'any' check (place_kind in ('any', 'pharm', 'home', 'post', 'fuel', 'store')),
  due text not null default 'week' check (due in ('today', 'tomorrow', 'week', 'none')),
  to_user uuid,
  status text not null default 'open' check (status in ('open', 'taken', 'done', 'cancelled')),
  taker_id uuid,
  updated_by uuid default auth.uid(),
  reminded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists asks_idx on public.asks(household_id, created_at desc);

alter table public.asks enable row level security;
drop policy if exists ak_sel on public.asks;
drop policy if exists ak_ins on public.asks;
drop policy if exists ak_upd on public.asks;
drop policy if exists ak_del on public.asks;
create policy ak_sel on public.asks for select using (public.is_member(household_id));
create policy ak_ins on public.asks for insert with check (public.is_member(household_id) and user_id = auth.uid());
create policy ak_upd on public.asks for update using (public.is_member(household_id));
create policy ak_del on public.asks for delete using (public.is_member(household_id) and user_id = auth.uid());

do $$ begin alter publication supabase_realtime add table public.asks; exception when duplicate_object then null; end $$;

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
  elsif tg_table_name = 'asks' then
    if tg_op = 'INSERT' then typ := 'ask_new';
    elsif new.status is distinct from old.status then
      payload := jsonb_build_object('action', 'event', 'type', 'ask_status', 'id', new.id, 'from', old.status);
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

drop trigger if exists asks_notify on public.asks;
create trigger asks_notify after insert or update of status on public.asks for each row execute function public.notify_event();

select (select count(*) from pg_tables where schemaname = 'public' and tablename = 'asks') asks_table,
       (select count(*) from pg_trigger where tgname = 'asks_notify') ask_trigger;
