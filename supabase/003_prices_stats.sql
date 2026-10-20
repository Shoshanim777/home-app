-- home-app v1.3: prices learned while shopping, receipt totals, purchase history for statistics

-- every price someone entered (history), and the current price per product name
create table if not exists public.price_history (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null,
  price numeric(10,2) not null check (price > 0 and price < 100000),
  recorded_by uuid references auth.users(id) on delete set null,
  recorded_at timestamptz not null default now()
);
create index if not exists price_history_idx on public.price_history(household_id, name, recorded_at desc);

create table if not exists public.product_prices (
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null,
  price numeric(10,2) not null,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key (household_id, name)
);

create or replace function public.price_history_apply() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.product_prices(household_id, name, price, updated_by, updated_at)
    values (new.household_id, new.name, new.price, new.recorded_by, new.recorded_at)
  on conflict (household_id, name) do update
    set price = excluded.price, updated_by = excluded.updated_by, updated_at = excluded.updated_at;
  return new;
end $$;
drop trigger if exists price_history_apply on public.price_history;
create trigger price_history_apply after insert on public.price_history for each row execute function public.price_history_apply();

-- what was actually bought on each trip (written by finish_trip)
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  trip_id uuid not null references public.trips(id) on delete cascade,
  name text not null,
  qty text not null default '1',
  category text not null default 'אחר',
  price numeric(10,2),
  created_at timestamptz not null default now()
);
create index if not exists purchases_idx on public.purchases(household_id, created_at desc);

alter table public.trips add column if not exists actual_total numeric(10,2);
alter table public.trips add column if not exists estimated_total numeric(10,2);

alter table public.price_history enable row level security;
alter table public.product_prices enable row level security;
alter table public.purchases enable row level security;
drop policy if exists ph_select on public.price_history;
create policy ph_select on public.price_history for select using (public.is_member(household_id));
drop policy if exists ph_insert on public.price_history;
create policy ph_insert on public.price_history for insert with check (public.is_member(household_id) and recorded_by = auth.uid());
drop policy if exists pp_select on public.product_prices;
create policy pp_select on public.product_prices for select using (public.is_member(household_id));
drop policy if exists pu_select on public.purchases;
create policy pu_select on public.purchases for select using (public.is_member(household_id));

-- finish a trip: record purchases (with known prices), the estimate and the receipt total
drop function if exists public.finish_trip(uuid);
create or replace function public.finish_trip(p_trip uuid, p_total numeric default null)
returns public.trips language plpgsql security definer set search_path = public as $$
declare t public.trips; b int; l int; est numeric;
begin
  select * into t from public.trips where id = p_trip and status = 'active' and public.is_member(household_id);
  if t.id is null then raise exception 'trip not found'; end if;
  insert into public.purchases(household_id, trip_id, name, qty, category, price)
    select i.household_id, t.id, i.name, i.qty, i.category, pp.price
      from public.items i
      left join public.product_prices pp on pp.household_id = i.household_id and pp.name = i.name
     where i.household_id = t.household_id and i.list = 'super' and i.in_cart;
  select coalesce(sum(price * case when qty ~ '^[0-9]+$' then qty::numeric else 1 end), 0) into est
    from public.purchases where trip_id = t.id and price is not null;
  delete from public.items where household_id = t.household_id and list = 'super' and in_cart;
  get diagnostics b = row_count;
  select count(*) into l from public.items where household_id = t.household_id and list = 'super';
  update public.trips set status = 'done', finished_at = now(), bought_count = b, left_count = l,
         actual_total = case when p_total > 0 then round(p_total, 2) end,
         estimated_total = nullif(round(est, 2), 0)
   where id = p_trip returning * into t;
  return t;
end $$;
revoke all on function public.finish_trip(uuid, numeric) from anon;

-- fix or add the receipt total afterwards
create or replace function public.set_trip_total(p_trip uuid, p_total numeric)
returns public.trips language plpgsql security definer set search_path = public as $$
declare t public.trips;
begin
  update public.trips set actual_total = case when p_total > 0 then round(p_total, 2) end
   where id = p_trip and status = 'done' and public.is_member(household_id) returning * into t;
  if t.id is null then raise exception 'trip not found'; end if;
  return t;
end $$;
revoke all on function public.set_trip_total(uuid, numeric) from anon;

alter table public.product_prices replica identity full;
do $$ begin
  begin alter publication supabase_realtime add table public.product_prices; exception when duplicate_object then null; end;
end $$;
