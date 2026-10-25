-- home-app v1.9.3: automatic weekly backups of the app's data (kept inside the database, last 10).
-- No one can read this table through the app API; only the notify function (database owner) and the
-- owner's admin screen (through the function, admin only) reach it. Secrets and push endpoints are not included.
create table if not exists public.backups (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  kind        text not null default 'auto' check (kind in ('auto', 'manual')),
  size_bytes  int not null,
  counts      jsonb not null default '{}'::jsonb,
  data        bytea not null           -- gzip of the JSON snapshot
);
alter table public.backups enable row level security;   -- no policies: closed to anon/authenticated
revoke all on public.backups from anon, authenticated;

-- weekly: Fridays 01:00 UTC (night in Israel)
do $$ begin perform cron.unschedule('home-app-backup'); exception when others then null; end $$;
select cron.schedule('home-app-backup', '0 1 * * 5', $cron$
  select net.http_post(
    url := 'https://hzkhareegpqblowiddxm.supabase.co/functions/v1/notify',
    headers := jsonb_build_object('Content-Type', 'application/json',
                                  'x-cron-secret', (select value from public.app_secrets where name = 'cron')),
    body := '{"action":"backup"}'::jsonb,
    timeout_milliseconds := 30000);
$cron$);

select (select count(*) from pg_tables where schemaname = 'public' and tablename = 'backups') table_set,
       (select count(*) from cron.job where jobname = 'home-app-backup') cron_set;
