-- home-app v1.8: owner's user management — list users, suspend / restore (reversible, nothing deleted)
create table if not exists public.suspensions (
  user_id uuid primary key,
  reason text not null default '',
  suspended_at timestamptz not null default now()
);
alter table public.suspensions enable row level security;   -- no policies: only the server (notify function) reads/writes it
revoke all on public.suspensions from anon, authenticated;

-- a suspended user is no longer a member of anything: every RLS policy built on is_member closes at once
create or replace function public.is_member(h uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.members where household_id = h and user_id = auth.uid())
     and not exists (select 1 from public.suspensions where user_id = auth.uid());
$$;

-- what the app asks on start: am I suspended? am I the owner?
create or replace function public.my_status() returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'suspended', exists (select 1 from public.suspensions where user_id = auth.uid()),
    'admin', auth.uid()::text = (select value from public.app_secrets where name = 'admin_user'));
$$;
revoke all on function public.my_status() from anon;
grant execute on function public.my_status() to authenticated;

-- a suspended user can't open or join a home either
create or replace function public.block_suspended_member() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.suspensions where user_id = new.user_id) then raise exception 'החשבון הושהה'; end if;
  return new;
end $$;
drop trigger if exists members_block_suspended on public.members;
create trigger members_block_suspended before insert on public.members for each row execute function public.block_suspended_member();

select (select count(*) from pg_tables where tablename = 'suspensions') suspensions_table,
       public.is_member('00000000-0000-0000-0000-000000000000') sanity_false;
