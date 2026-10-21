-- home-app v1.3.2: trip start/finish/cancel and personal messages are pushed by the database itself,
-- so a phone that closes the app right after the tap can't lose the notification.
create or replace function public.notify_event() returns trigger
language plpgsql security definer set search_path = public as $$
declare typ text;
begin
  if tg_table_name = 'trips' then
    if tg_op = 'INSERT' and new.status = 'active' then typ := 'trip_start';
    elsif tg_op = 'UPDATE' and old.status = 'active' and new.status in ('done', 'cancelled') then
      typ := case new.status when 'done' then 'trip_done' else 'trip_cancel' end;
    else return new; end if;
  elsif tg_table_name = 'messages' then typ := 'message';
  else return new; end if;
  perform net.http_post(
    url := 'https://hzkhareegpqblowiddxm.supabase.co/functions/v1/notify',
    headers := jsonb_build_object('Content-Type', 'application/json',
                                  'x-cron-secret', (select value from public.app_secrets where name = 'cron')),
    body := jsonb_build_object('action', 'event', 'type', typ, 'id', new.id));
  return new;
exception when others then
  -- a notification problem must never block saving the trip or the message
  raise warning 'notify_event failed: %', sqlerrm;
  return new;
end $$;

drop trigger if exists trips_notify on public.trips;
create trigger trips_notify after insert or update of status on public.trips
  for each row execute function public.notify_event();
drop trigger if exists messages_notify on public.messages;
create trigger messages_notify after insert on public.messages
  for each row execute function public.notify_event();
