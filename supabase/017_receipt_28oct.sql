-- receipt 28.10.2026 20:33, טיב טעם בבלי, ₪299.08 (Dotan's trip e90c11d1…): prices, barcodes, the trip's items and total
with h as (select household_id hid, user_id uid from public.members where display_name = 'דותן' order by joined_at limit 1)
insert into public.custom_products(household_id, name, emoji, category, created_by)
select hid, v.n, v.e, v.c, uid from h, (values
  ('לאבנה גלילית', '🥛', 'מקרר'),
  ('יין קברנה מרלו גמלא', '🍷', 'משקאות')
) v(n, e, c)
on conflict (household_id, name) do nothing;

with h as (select household_id hid, user_id uid from public.members where display_name = 'דותן' order by joined_at limit 1)
insert into public.price_history(household_id, name, price, recorded_by, recorded_at)
select hid, v.n, v.p, uid, '2026-10-28 20:33+02'::timestamptz from h, (values
  ('כרובית', 16.02),               -- 1.075 ק"ג × ₪14.90
  ('טונה', 30.90),                 -- סטארקיסט בשמן זית
  ('פתיתים', 9.90),
  ('רד בול ללא סוכר', 5.00),       -- מבצע 4 ב־20 (מחיר רגיל ₪7.60)
  ('לאבנה גלילית', 31.90),
  ('גבינת עיזים רכה', 17.90),
  ('טאפאס גבינות', 27.20),
  ('יין קברנה מרלו גמלא', 81.60),
  ('כוסות אספרסו', 9.90),
  ('בולגרית', 31.90),
  ('ביצים', 21.36)
) v(n, p)
where not exists (select 1 from public.price_history ph where ph.household_id = h.hid and ph.name = v.n and ph.recorded_at = '2026-10-28 20:33+02'::timestamptz);

with h as (select household_id hid from public.members where display_name = 'דותן' order by joined_at limit 1)
insert into public.product_barcodes(household_id, barcode, name)
select hid, v.b, v.n from h, (values
  ('999911', 'כרובית'), ('7290017617046', 'טונה'), ('7290000060408', 'פתיתים'), ('90162800', 'רד בול ללא סוכר'),
  ('7290014762947', 'לאבנה גלילית'), ('8413376022965', 'גבינת עיזים רכה'), ('7290117265772', 'טאפאס גבינות'),
  ('7290014466890', 'יין קברנה מרלו גמלא'), ('7290015008822', 'כוסות אספרסו'), ('7290011499112', 'בולגרית'),
  ('7296082000202', 'ביצים')
) v(b, n)
on conflict (household_id, barcode) do update set name = excluded.name;

-- the trip: the two items marked in the app get their real quantity and price, the rest of the receipt is added
update public.purchases set qty = '1', price = 9.90
 where trip_id = 'e90c11d1-c393-407e-829c-804455e22f38' and name = 'פתיתים';
update public.purchases set name = 'כוסות אספרסו', qty = '1', price = 9.90
 where trip_id = 'e90c11d1-c393-407e-829c-804455e22f38' and name = 'כוסות אספרסו - חד מפעי';

insert into public.purchases(household_id, trip_id, name, qty, category, price, created_at)
select t.household_id, t.id, v.n, v.q, v.c, v.p, t.finished_at
  from public.trips t, (values
    ('כרובית', '1.075 ק"ג', 'ירקות ופירות', 16.02),
    ('טונה', '1', 'מזווה', 30.90),
    ('רד בול ללא סוכר', '4', 'משקאות', 5.00),
    ('לאבנה גלילית', '1', 'מקרר', 31.90),
    ('גבינת עיזים רכה', '1', 'מקרר', 17.90),
    ('טאפאס גבינות', '1', 'מקרר', 27.20),
    ('יין קברנה מרלו גמלא', '1', 'משקאות', 81.60),
    ('בולגרית', '1', 'מקרר', 31.90),
    ('ביצים', '1', 'מקרר', 21.36)
  ) v(n, q, c, p)
 where t.id = 'e90c11d1-c393-407e-829c-804455e22f38'
   and not exists (select 1 from public.purchases p where p.trip_id = t.id and p.name = v.n);

update public.trips set actual_total = 299.08, bought_count = 11
 where id = 'e90c11d1-c393-407e-829c-804455e22f38';

select (select actual_total from public.trips where id = 'e90c11d1-c393-407e-829c-804455e22f38') total,
       (select count(*) from public.purchases where trip_id = 'e90c11d1-c393-407e-829c-804455e22f38') items,
       (select round(sum(price * case when qty ~ '^\d+$' then qty::int else 1 end), 2) from public.purchases where trip_id = 'e90c11d1-c393-407e-829c-804455e22f38') items_sum,
       (select count(*) from public.product_prices pp join public.members m on m.household_id = pp.household_id and m.display_name = 'דותן'
         where pp.name in ('כרובית','טונה','פתיתים','רד בול ללא סוכר','לאבנה גלילית','גבינת עיזים רכה','טאפאס גבינות','יין קברנה מרלו גמלא','כוסות אספרסו','בולגרית','ביצים')) prices_set;
