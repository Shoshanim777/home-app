-- home-app: alerts to the app owner (Dotan) — new home, someone joined, weekly summary. No list/message content.
insert into public.app_secrets(name, value)
select 'admin_user', user_id::text from public.members where display_name = 'דותן' order by joined_at limit 1
on conflict (name) do update set value = excluded.value;

create or replace function public.notify_event() returns trigger
language plpgsql security definer set search_path = public as $$
declare typ text; payload jsonb;
begin
  if tg_table_name = 'trips' then
    if tg_op = 'INSERT' and new.status = 'active' then typ := 'trip_start';
    elsif tg_op = 'UPDATE' and old.status = 'active' and new.status in ('done', 'cancelled') then
      typ := case new.status when 'done' then 'trip_done' else 'trip_cancel' end;
    else return new; end if;
    payload := jsonb_build_object('action', 'event', 'type', typ, 'id', new.id);
  elsif tg_table_name = 'messages' then
    payload := jsonb_build_object('action', 'event', 'type', 'message', 'id', new.id);
  elsif tg_table_name = 'members' then
    payload := jsonb_build_object('action', 'event', 'type', 'member_join', 'hid', new.household_id, 'uid', new.user_id);
  else return new; end if;
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

drop trigger if exists members_notify on public.members;
create trigger members_notify after insert on public.members
  for each row execute function public.notify_event();

-- weekly summary to the owner: Sundays 06:00 UTC (morning in Israel)
do $$ begin perform cron.unschedule('home-app-weekly'); exception when others then null; end $$;
select cron.schedule('home-app-weekly', '0 6 * * 0', $cron$
  select net.http_post(
    url := 'https://hzkhareegpqblowiddxm.supabase.co/functions/v1/notify',
    headers := jsonb_build_object('Content-Type', 'application/json',
                                  'x-cron-secret', (select value from public.app_secrets where name = 'cron')),
    body := '{"action":"weekly"}'::jsonb);
$cron$);

select (select count(*) from public.app_secrets where name = 'admin_user') admin_set,
       (select count(*) from pg_trigger where tgname = 'members_notify') trigger_set,
       (select count(*) from cron.job where jobname = 'home-app-weekly') weekly_set;
