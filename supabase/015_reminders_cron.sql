-- home-app v1.11.0: the minute check called the server only for supermarket-trip reminders,
-- so "מי יכול להביא לי?" and package reminders never ran by themselves. Now it calls whenever any of them is due.
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
                  and ((not remind_plan and plan_remind_at <= now()) or plan_until <= now()));
$cron$);

select (select count(*) from cron.job where jobname = 'home-app-reminders') reminders_job;
