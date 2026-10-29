-- receipt 29.10.2026 20:04, טיפ טוב בבלי, קבלה 62245, ₪113.36
-- price_history = מחיר מדף. מבצעים (לטבלת מבצעים בעדכון הבא): רד בול 4 ב־18.80 (+₪1.20 פיקדון = ₪20), דניאלה 4 ב־14.
-- purchases = מה ששולם בפועל ליחידה (אחרי מבצע, בלי פיקדון ושקית).

with h as (select household_id hid, user_id uid from public.members where display_name = 'דותן' order by joined_at limit 1)
insert into public.custom_products(household_id, name, emoji, category, created_by)
select hid, v.n, v.e, v.c, uid from h, (values
  ('יין הר חרמון אינדיגו', '🍷', 'משקאות'),
  ('דניאלה וניל', '🍮', 'מקרר')
) v(n, e, c)
on conflict (household_id, name) do nothing;

with h as (select household_id hid, user_id uid from public.members where display_name = 'דותן' order by joined_at limit 1)
insert into public.price_history(household_id, name, price, recorded_by, recorded_at)
select hid, v.n, v.p, uid, '2026-10-29 20:04+02'::timestamptz from h, (values
  ('רד בול ללא סוכר', 7.60),
  ('יין הר חרמון אינדיגו', 41.60),
  ('עגבניות', 12.90),             -- לק"ג (0.685 ק"ג = ₪8.84)
  ('לימון', 11.90),               -- לק"ג (0.695 ק"ג = ₪8.27)
  ('דניאלה וניל', 4.50),
  ('חלב', 7.35),                  -- 3% קרטון 1 ל׳
  ('פילה הרינג', 12.90)
) v(n, p)
where not exists (select 1 from public.price_history ph where ph.household_id = h.hid and ph.name = v.n and ph.recorded_at = '2026-10-29 20:04+02'::timestamptz);

-- the trip: Dotan's trip that finished around the receipt time (19:30–21:00). If none is found, nothing below changes.
with t as (
  select tr.id, tr.household_id, tr.finished_at
    from public.trips tr join public.members m on m.household_id = tr.household_id and m.user_id = tr.shopper_id and m.display_name = 'דותן'
   where tr.status = 'done' and tr.finished_at between '2026-10-29 19:30+02' and '2026-10-29 21:00+02'
   order by tr.finished_at desc limit 1)
insert into public.purchases(household_id, trip_id, name, qty, category, price, created_at)
select t.household_id, t.id, v.n, v.q, v.c, v.p, t.finished_at
  from t, (values
    ('רד בול ללא סוכר', '4', 'משקאות', 4.70),
    ('יין הר חרמון אינדיגו', '1', 'משקאות', 41.60),
    ('עגבניות', '0.685 ק"ג', 'ירקות ופירות', 8.84),
    ('לימון', '0.695 ק"ג', 'ירקות ופירות', 8.27),
    ('דניאלה וניל', '4', 'מקרר', 3.50),
    ('חלב', '1', 'מקרר', 7.35),
    ('פילה הרינג', '1', 'מקרר', 12.90)
  ) v(n, q, c, p)
 where not exists (select 1 from public.purchases p where p.trip_id = t.id and p.name = v.n);

update public.trips set actual_total = 113.36, bought_count = 7
 where id = (select tr.id from public.trips tr join public.members m on m.household_id = tr.household_id and m.user_id = tr.shopper_id and m.display_name = 'דותן'
              where tr.status = 'done' and tr.finished_at between '2026-10-29 19:30+02' and '2026-10-29 21:00+02'
              order by tr.finished_at desc limit 1);

select (select count(*) from public.product_prices pp join public.members m on m.household_id = pp.household_id and m.display_name = 'דותן'
         where pp.name in ('רד בול ללא סוכר','יין הר חרמון אינדיגו','עגבניות','לימון','דניאלה וניל','חלב','פילה הרינג')
           and pp.updated_at >= '2026-10-29 20:04+02') prices_set,
       (select tr.id from public.trips tr join public.members m on m.household_id = tr.household_id and m.user_id = tr.shopper_id and m.display_name = 'דותן'
         where tr.status = 'done' and tr.finished_at between '2026-10-29 19:30+02' and '2026-10-29 21:00+02'
         order by tr.finished_at desc limit 1) trip_found;
