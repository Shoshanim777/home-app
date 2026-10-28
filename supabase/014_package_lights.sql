-- home-app v1.11.0: package lights (red / yellow / orange / green), "ראיתי, אקח בהמשך", seen by.
alter table public.packages add column if not exists plan_by uuid references auth.users(id) on delete set null;
alter table public.packages add column if not exists plan_when text check (plan_when in ('tonight', 'tomorrow', 'due'));
alter table public.packages add column if not exists plan_remind_at timestamptz;
alter table public.packages add column if not exists plan_until timestamptz;
alter table public.packages add column if not exists remind_plan boolean not null default false;
alter table public.packages add column if not exists seen_by uuid[] not null default '{}';

-- mark "I saw it" without touching anything else on the row
create or replace function public.pkg_seen(p uuid) returns void
language sql security definer set search_path = public as $$
  update public.packages set seen_by = seen_by || auth.uid()
   where id = p and auth.uid() is not null and public.is_member(household_id)
     and user_id <> auth.uid() and not (auth.uid() = any(seen_by));
$$;
revoke all on function public.pkg_seen(uuid) from public, anon;
grant execute on function public.pkg_seen(uuid) to authenticated;

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
create trigger packages_notify after insert or update of status, plan_by on public.packages for each row execute function public.notify_event();

select (select count(*) from information_schema.columns where table_name = 'packages' and column_name in ('plan_by', 'plan_when', 'plan_remind_at', 'plan_until', 'remind_plan', 'seen_by')) new_cols,
       (select count(*) from pg_proc where proname = 'pkg_seen') seen_fn,
       (select count(*) from pg_trigger where tgname = 'packages_notify') pkg_trigger;
