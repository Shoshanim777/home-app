-- home-app v1.4: barcodes per product (for matching future receipts / chain price files) + receipt 22.10.2026
create table if not exists public.product_barcodes (
  household_id uuid not null references public.households(id) on delete cascade,
  barcode text not null,
  name text not null,
  created_at timestamptz not null default now(),
  primary key (household_id, barcode)
);
alter table public.product_barcodes enable row level security;
drop policy if exists pb_all on public.product_barcodes;
create policy pb_all on public.product_barcodes for all using (public.is_member(household_id)) with check (public.is_member(household_id));

with h as (select household_id hid, user_id uid from public.members where display_name = 'דותן' limit 1)
insert into public.custom_products(household_id, name, emoji, category, created_by)
select hid, v.n, v.e, v.c, uid from h, (values
  ('חמאה לורפק','🧈','מקרר'),
  ('יין פורטה 6 אדום','🍷','משקאות'),
  ('אורז יסמין','🍚','מזווה'),
  ('אורז פרסי','🍚','מזווה'),
  ('גבינת שמנת ניו יורק','🧀','מקרר'),
  ('פלפל שיפקונית','🌶️','מזווה'),
  ('ספרייט זירו מארז פחיות','🥤','משקאות')
) v(n, e, c)
on conflict (household_id, name) do nothing;

with h as (select household_id hid, user_id uid from public.members where display_name = 'דותן' limit 1)
insert into public.price_history(household_id, name, price, recorded_by, recorded_at)
select hid, v.n, v.p, uid, v.d::timestamptz from h, (values
  ('חמאה לורפק', 35.90, '2026-10-12 20:46+03'),
  ('ספרייט זירו מארז פחיות', 26.10, '2026-10-22 15:12+03'),
  ('יין פורטה 6 אדום', 58.60, '2026-10-22 15:12+03'),
  ('גבינה צהובה', 39.40, '2026-10-22 15:12+03'),
  ('אורז יסמין', 15.90, '2026-10-22 15:12+03'),
  ('אורז פרסי', 13.90, '2026-10-22 15:12+03'),
  ('גבינת שמנת ניו יורק', 18.90, '2026-10-22 15:12+03'),
  ('חמאה', 11.40, '2026-10-22 15:12+03'),
  ('שמנת חמוצה', 5.70, '2026-10-22 15:12+03'),
  ('סלמון', 65.90, '2026-10-22 15:12+03'),
  ('פלפל שיפקונית', 17.90, '2026-10-22 15:12+03')
) v(n, p, d)
order by v.d;

with h as (select household_id hid from public.members where display_name = 'דותן' limit 1)
insert into public.product_barcodes(household_id, barcode, name)
select hid, v.b, v.n from h, (values
  ('7290010051076','לבבות חסה'),('7290013585967','ספרייט זירו מארז פחיות'),('5601996208811','יין פורטה 6 אדום'),
  ('7290010051335','בצל ירוק'),('7290102394463','גבינה צהובה'),('7290100700396','אורז יסמין'),('7290000211442','אורז פרסי'),
  ('7290011499624','גבינת שמנת ניו יורק'),('7290116932033','חמאה'),('72963753','שמנת חמוצה'),('7290019693963','תפוחי אדמה למיקרו'),
  ('7290013579607','סלמון'),('7290001053201','סלמון'),('7290113193000','פלפל שיפקונית'),('7290016150117','סלק ואקום'),
  ('7290000134987','פלפל שחור'),('7290014217164','פטרוזיליה מיכל גדול'),('7290003450602','חרדל אמיתי צהוב'),
  ('7290019997887','פלפל שיפקה חריף כבוש'),('7290116537764','מיונז'),('3598915','פילה אמנון קפוא'),('4048525','פילה אמנון קפוא'),
  ('3523230065535','גבינת פירמידה עיזים'),('8695543009126','גבינת קשקבל'),('7290014083769','גבינת אמנטל פרוסות'),
  ('7290117265772','טאפאס גבינות'),('999953','לימון'),('999903','מלפפונים'),('8413376024839','גבינת עיזים רכה'),
  ('5740900403253','חמאה לורפק'),('86945172','מנטוס'),('7290008175210','פרמזן מגורדת'),('80310891','ביצת קינדר'),
  ('999908','פלפל ירוק חריף'),('8809168840471','חטיף אצות'),('4810168060190','פילה הרינג'),('7290000104836','שעועית ירוקה קפואה'),
  ('7290015951890','יין אדום'),('7290020174925','פטריות'),('7290010051052','פטרוזיליה'),('7290015855228','אספרגוס'),
  ('999901','עגבניות'),('8720892385987','אוכמניות')
) v(b, n)
on conflict (household_id, barcode) do update set name = excluded.name;

select (select count(*) from public.custom_products) our_products, (select count(*) from public.product_prices) prices,
       (select count(*) from public.product_barcodes) barcodes;
