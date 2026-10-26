-- home-app v1.9.4: fix "new member / new home" alerts to the owner.
-- Since 008 the shared payload line read new.id for every table; public.members has no id column,
-- so the members trigger failed (caught as a warning) and no alert was sent.
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

-- check: the members branch now builds without error
select (select count(*) from pg_trigger where tgname = 'members_notify') members_trigger;
