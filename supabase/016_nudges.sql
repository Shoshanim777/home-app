-- home-app v1.12.0: "אל תשכחו" — family reminders: to someone, a few, or the whole house; now or later; repeat; got it / done.
create table if not exists public.nudges (
  id           uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,      -- who sent it
  to_all       boolean not null default false,
  to_users     uuid[] not null default '{}',
  body         text not null check (char_length(body) between 1 and 120),
  icon         text not null default '' check (char_length(icon) <= 12),
  remind_at    timestamptz not null default now(),                             -- next time it goes out
  repeat       text not null default 'none' check (repeat in ('none', 'daily', 'weekly')),
  urgent       boolean not null default false,
  status       text not null default 'active' check (status in ('active', 'cancelled')),
  fired_at     timestamptz,                                                   -- last time it went out
  acks         jsonb not null default '{}'::jsonb,                            -- {user_id: "got" | "done"} for the current round
  done_at      timestamptz,
  done_by      uuid,
  nag1         boolean not null default false,
  nag2         boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists nudges_idx on public.nudges(household_id, created_at desc);
create index if not exists nudges_due_idx on public.nudges(remind_at) where status = 'active';

alter table public.nudges enable row level security;
drop policy if exists nd_sel on public.nudges;
drop policy if exists nd_ins on public.nudges;
drop policy if exists nd_upd on public.nudges;
drop policy if exists nd_del on public.nudges;
create policy nd_sel on public.nudges for select using (public.is_member(household_id));
create policy nd_ins on public.nudges for insert with check (public.is_member(household_id) and user_id = auth.uid());
create policy nd_upd on public.nudges for update using (public.is_member(household_id) and user_id = auth.uid());   -- edit / cancel: the sender
create policy nd_del on public.nudges for delete using (public.is_member(household_id) and user_id = auth.uid());

do $$ begin alter publication supabase_realtime add table public.nudges; exception when duplicate_object then null; end $$;

-- a recipient answers "got it" / "done" / "snooze" (snooze only when they are the only one it is for)
create or replace function public.nudge_ack(n uuid, state text, until timestamptz default null) returns void
language plpgsql security definer set search_path = public as $$
declare r public.nudges; me uuid := auth.uid(); everyone_done boolean;
begin
  select * into r from public.nudges where id = n for update;
  if r is null or me is null or not public.is_member(r.household_id) or r.status <> 'active' then return; end if;
  if not (r.to_all or me = any(r.to_users)) then return; end if;
  if state = 'snooze' then
    if r.to_all or array_length(r.to_users, 1) <> 1 or until is null or until < now() or until > now() + interval '2 days' then return; end if;
    update public.nudges set remind_at = until, fired_at = null, acks = '{}'::jsonb, nag1 = false, nag2 = false, updated_at = now() where id = n;
    return;
  end if;
  if state not in ('got', 'done') then return; end if;
  update public.nudges set acks = acks || jsonb_build_object(me::text, state), updated_at = now() where id = n returning * into r;
  if state = 'done' and r.done_at is null then
    everyone_done := r.to_all or not exists (select 1 from unnest(r.to_users) u where coalesce(r.acks ->> u::text, '') <> 'done');
    if everyone_done then update public.nudges set done_at = now(), done_by = me where id = n; end if;
  end if;
end $$;
revoke all on function public.nudge_ack(uuid, text, timestamptz) from public, anon;
grant execute on function public.nudge_ack(uuid, text, timestamptz) to authenticated;

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
    elsif new.plan_by is not null and new.plan_by is distinct from old.plan_by then typ := 'pkg_plan';
    else return new; end if;
  elsif tg_table_name = 'nudges' then
    if tg_op = 'INSERT' then
      if new.remind_at > now() + interval '1 minute' then return new; end if;   -- later ones go out with the minute check
      typ := 'nudge_new';
    elsif new.done_at is not null and old.done_at is null then typ := 'nudge_done';
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

drop trigger if exists nudges_notify on public.nudges;
create trigger nudges_notify after insert or update of done_at on public.nudges for each row execute function public.notify_event();

-- the minute check also covers reminders that are due or need a gentle second nudge
do $$ begin perform cron.unschedule('home-app-reminders'); exception when others then null; end $$;
select cron.schedule('home-app-reminders', '* * * * *', $cron$
  select net.http_post(
    url := 'https://hzkhareegpqblowiddxm.supabase.co/functions/v1/notify',
    headers := jsonb_build_object('Content-Type', 'application/json',
                                  'x-cron-secret', (select value from public.app_secrets where name = 'cron')),
    body := '{"action":"reminders"}'::jsonb)
  where exists (select 1 from public.trips where status = 'active' and not reminded and remind_at <= now())
     or exists (select 1 from public.asks where status = 'open' and not reminded and created_at < now() - interval '2 days')
     or exists (select 1 from public.packages where status = 'open' and not remind_due and due is not null
                  and due <= (now() at time zone 'Asia/Jerusalem')::date + 1
                  and extract(hour from now() at time zone 'Asia/Jerusalem') >= 10)
     or exists (select 1 from public.packages where status in ('taken', 'arrived') and not remind_taker and taker_id is not null
                  and updated_at < now() - interval '1 hour'
                  and extract(hour from now() at time zone 'Asia/Jerusalem') >= 21)
     or exists (select 1 from public.packages where status = 'open' and plan_by is not null
                  and ((not remind_plan and plan_remind_at <= now()) or plan_until <= now()))
     or exists (select 1 from public.nudges where status = 'active' and remind_at <= now()
                  and (repeat <> 'none' or fired_at is null)
                  and (urgent or extract(hour from now() at time zone 'Asia/Jerusalem') between 7 and 21))
     or exists (select 1 from public.nudges where status = 'active' and fired_at is not null and done_at is null
                  and ((not nag1 and fired_at < now() - interval '1 hour') or (not nag2 and fired_at < now() - interval '3 hours'))
                  and fired_at > now() - interval '1 day'
                  and extract(hour from now() at time zone 'Asia/Jerusalem') between 7 and 21);
$cron$);

select (select count(*) from pg_tables where schemaname = 'public' and tablename = 'nudges') nudges_table,
       (select count(*) from pg_proc where proname = 'nudge_ack') ack_fn,
       (select count(*) from pg_trigger where tgname = 'nudges_notify') nudge_trigger,
       (select count(*) from cron.job where jobname = 'home-app-reminders') reminders_job;
