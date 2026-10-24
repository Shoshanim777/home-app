// בדרך לסופר — push notifications (Supabase Edge Function "notify")
// Auth: user calls carry the user's JWT (checked here); the reminder cron carries x-cron-secret.
// Secrets (VAPID keys, cron secret) live in public.app_secrets, readable only by the database owner.
import webpush from 'npm:web-push@3.6.7';
import postgres from 'npm:postgres@3.4.5';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const PUBLIC_KEY = 'sb_publishable_FrrNqQ4IdiaZyPpxWPDViw_ZlP7p8IJ'; // public key, safe to ship
const APP_URL = 'https://shoshanim777.github.io/home-app/';
const sql = postgres(Deno.env.get('SUPABASE_DB_URL')!, { prepare: false, max: 3 });

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cron-secret',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
};
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

let vapidCache: { publicKey: string; privateKey: string } | null = null;
async function vapid() {
  if (vapidCache) return vapidCache;
  let [row] = await sql`select value from public.app_secrets where name = 'vapid'`;
  if (!row) {
    const k = webpush.generateVAPIDKeys();
    await sql`insert into public.app_secrets(name, value) values ('vapid', ${JSON.stringify(k)}) on conflict (name) do nothing`;
    [row] = await sql`select value from public.app_secrets where name = 'vapid'`;
  }
  vapidCache = JSON.parse(row.value);
  webpush.setVapidDetails(APP_URL, vapidCache!.publicKey, vapidCache!.privateKey);
  return vapidCache!;
}

async function userFromRequest(req: Request) {
  const token = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: { apikey: PUBLIC_KEY, Authorization: `Bearer ${token}` } });
  if (!r.ok) return null;
  return await r.json();
}

type Payload = { title: string; body: string; tag?: string; url?: string; requireInteraction?: boolean; kind?: string; icon?: string; badge?: string };
const ILS = (n: number) => '₪' + (Math.round(n * 100) / 100).toLocaleString('he-IL', { maximumFractionDigits: 2 });

async function pushTo(userIds: string[], payload: Payload) {
  if (!userIds.length) { console.log(JSON.stringify({ kind: payload.kind, users: 0 })); return { sent: 0 }; }
  await vapid();
  const subs = await sql`select endpoint, p256dh, auth from public.push_subscriptions where user_id in ${sql(userIds)}`;
  let sent = 0;
  await Promise.all(subs.map(async (s) => {
    try {
      await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        JSON.stringify(payload), { TTL: 6 * 3600, urgency: 'high' });
      sent++;
    } catch (e) {
      const code = (e as { statusCode?: number }).statusCode;
      if (code === 404 || code === 410) await sql`delete from public.push_subscriptions where endpoint = ${s.endpoint}`;
      else console.error('push failed', code, (e as Error).message);
    }
  }));
  console.log(JSON.stringify({ kind: payload.kind, tag: payload.tag, users: userIds.length, devices: subs.length, sent }));
  return { sent, devices: subs.length };
}

async function othersInHousehold(hid: string, exceptUser: string) {
  const rows = await sql`select user_id from public.members where household_id = ${hid} and user_id <> ${exceptUser}`;
  return rows.map((r) => r.user_id as string);
}

async function reminders() {
  const due = await sql`
    update public.trips set reminded = true
     where status = 'active' and not reminded and remind_at <= now()
     returning id, shopper_id, started_at`;
  for (const t of due) {
    const mins = Math.max(1, Math.round((Date.now() - new Date(t.started_at).getTime()) / 60000));
    await pushTo([t.shopper_id], {
      title: '⏰ סיימת לקנות?', body: `עברו ${mins} דקות מאז שיצאת לסופר. לחיצה לאישור הקנייה`,
      tag: 'remind-' + t.id, url: APP_URL + '?confirm=1', requireInteraction: true, kind: 'remind', badge: 'badge-clock.png', icon: 'notif-trip.png'
    });
  }
  return { reminded: due.length, asks: await askReminders() };
}

// a request nobody took for two days gets one gentle nudge
async function askReminders() {
  const stale = await sql`
    update public.asks set reminded = true
     where status = 'open' and not reminded and created_at < now() - interval '2 days'
     returning id, household_id, user_id, body, to_user`;
  for (const a of stale) {
    const who = await nameIn(a.household_id, a.user_id);
    const to = a.to_user ? [a.to_user] : await othersInHousehold(a.household_id, a.user_id);
    await pushTo(to, { title: `⏰ הבקשה של ${who} עדיין פתוחה`, body: `${a.body} · מישהו יכול?`, tag: 'ask-' + a.id, url: APP_URL + '?family=ask', kind: 'ask', icon: 'notif-ask.png', badge: 'badge-bag.png' });
  }
  return stale.length;
}

// trips and messages: called by the database trigger (public.notify_event), not by the phones
async function serverEvent(type: string, id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { sent: 0 };
  if (type.startsWith('trip_')) {
    const [t] = await sql`select t.*, m.display_name from public.trips t
      join public.members m on m.user_id = t.shopper_id and m.household_id = t.household_id where t.id = ${id}`;
    if (!t) return { sent: 0 };
    const to = await othersInHousehold(t.household_id, t.shopper_id);
    const name = t.display_name as string;
    if (type === 'trip_start') return pushTo(to, {
      title: `🟠 ${name} בדרך לסופר`, body: 'עכשיו הזמן להוסיף מה שחסר · ההתראה תתחלף כשהקנייה תסתיים',
      tag: 'trip-' + id, url: APP_URL, kind: 'trip', requireInteraction: true, icon: 'notif-trip.png', badge: 'badge-cart.png' });
    if (type === 'trip_done') {
      const total = t.actual_total ?? t.estimated_total;
      return pushTo(to, {
        title: `🎉 תודה ל${name}, אין עלייך!!!`,
        body: `נקנו ${t.bought_count ?? 0} פריטים` + (total ? ` · ${t.actual_total ? '' : 'כ־'}${ILS(Number(total))}` : '') + (t.left_count ? ` · ${t.left_count} נשארו לפעם הבאה` : ''),
        tag: 'trip-' + id, url: APP_URL + '?thanks=' + id, kind: 'thanks', badge: 'badge-check.png' });
    }
    if (type === 'trip_cancel') return pushTo(to, {
      title: `היציאה לסופר של ${name} בוטלה`, body: 'הרשימה נשארה כמו שהיא', tag: 'trip-' + id, url: APP_URL, kind: 'trip', badge: 'badge-cart.png' });
  }
  if (type === 'message') {
    const [m] = await sql`select msg.*, mem.display_name from public.messages msg
      join public.members mem on mem.user_id = msg.sender_id and mem.household_id = msg.household_id where msg.id = ${id}`;
    if (!m) return { sent: 0 };
    const text = m.kind === 'oos' ? `אין ${m.item_name} במלאי` + (m.body ? ` · ${m.body}` : '')
      : m.kind === 'sub' ? `במקום ${m.item_name} לקחתי ${m.body}`
      : m.kind === 'ask' ? `לגבי ${m.item_name}: ${m.body}` : m.body;
    return pushTo(await othersInHousehold(m.household_id, m.sender_id), {
      title: `💬 ${m.display_name}`, body: text, tag: 'msg', url: APP_URL + '?chat=1', kind: 'message', badge: 'badge-chat.png' });
  }
  return familyEvent(type, id);
}

// ---- family room: "נחיתה על הדרך" and "בדרך אלינו" ----
const IL_TIME = (t: string | Date) => new Date(t).toLocaleTimeString('he-IL', { timeZone: 'Asia/Jerusalem', hour: '2-digit', minute: '2-digit' });
const nameIn = async (hid: string, uid: string) =>
  ((await sql`select display_name from public.members where household_id = ${hid} and user_id = ${uid}`)[0]?.display_name as string) || 'מישהו';
const at = (place: string) => /^[A-Za-z0-9]/.test(place) ? `ב־${place}` : `ב${place}`;

const PLACE_KIND: Record<string, string> = { pharm: 'מבית מרקחת', home: 'מחנות כלי בית', post: 'מהדואר', fuel: 'מתחנת דלק', store: 'ממכולת' };
const DUE: Record<string, string> = { today: 'עד היום', tomorrow: 'עד מחר', week: 'השבוע', none: 'לא דחוף' };

async function askEvent(type: string, id: string, from: string) {
  const ASK = { icon: 'notif-ask.png', badge: 'badge-bag.png', kind: 'ask' };
  const [a] = await sql`select * from public.asks where id = ${id}`;
  if (!a) return { sent: 0 };
  const who = await nameIn(a.household_id, a.user_id);
  if (type === 'ask_new') {
    const to = a.to_user ? [a.to_user] : await othersInHousehold(a.household_id, a.user_id);
    return pushTo(to, { title: `🙋 ${who} ${a.to_user ? 'מבקש/ת ממך' : 'מבקש/ת'}: ${a.body}`,
      body: [PLACE_KIND[a.place_kind], DUE[a.due], 'מי יכול?'].filter(Boolean).join(' · '), tag: 'ask-' + id, url: APP_URL + '?family=ask', ...ASK });
  }
  const by = a.updated_by as string;
  if (!by || by === a.user_id) return { sent: 0 };            // the requester changed their own request
  const actor = await nameIn(a.household_id, by);
  if (a.status === 'taken') return pushTo([a.user_id], { title: `🙋 ${actor} מביא/ה לך ${a.body}`, body: 'אפשר לנשום, זה מטופל', tag: 'ask-' + id, url: APP_URL + '?family=ask', ...ASK });
  if (a.status === 'done') return pushTo([a.user_id], { title: `✓ ${actor} הביא/ה לך ${a.body}`, body: 'לשלוח תודה?', tag: 'ask-' + id, url: APP_URL + '?family=ask', ...ASK, badge: 'badge-check.png' });
  if (a.status === 'open' && from === 'taken') return pushTo([a.user_id], { title: `${actor} לא יספיק/תספיק להביא ${a.body}`, body: 'הבקשה חזרה להיות פתוחה', tag: 'ask-' + id, url: APP_URL + '?family=ask', ...ASK });
  return { sent: 0 };
}

async function familyEvent(type: string, id: string) {
  const LAND = { icon: 'notif-land.png', badge: 'badge-moto.png', kind: 'land' };
  const DEL = { icon: 'notif-deliver.png', badge: 'badge-pizza.png', kind: 'delivery' };
  if (type === 'landing') {
    const [l] = await sql`select * from public.landings where id = ${id}`;
    if (!l) return { sent: 0 };
    const who = await nameIn(l.household_id, l.user_id);
    return pushTo(await othersInHousehold(l.household_id, l.user_id), {
      title: `🏍️ ${who} נחת/ה הרגע ${at(l.place)}`, body: (l.address ? l.address + ' · ' : '') + 'צריך משהו? אפשר לבקש עכשיו',
      tag: 'land-' + id, url: APP_URL + '?family=land', ...LAND });
  }
  if (type === 'landing_req') {
    const [r] = await sql`select r.*, l.user_id lander, l.place from public.landing_requests r join public.landings l on l.id = r.landing_id where r.id = ${id}`;
    if (!r || r.user_id === r.lander) return { sent: 0 };
    const who = await nameIn(r.household_id, r.user_id);
    return pushTo([r.lander], { title: `🛍️ ${who} ${r.done ? 'עונה' : 'מבקש/ת'}`, body: r.body, tag: 'landreq-' + r.landing_id, url: APP_URL + '?family=land', ...LAND });
  }
  if (type === 'delivery_open') {
    const [d] = await sql`select * from public.deliveries where id = ${id}`;
    if (!d) return { sent: 0 };
    const who = await nameIn(d.household_id, d.opener_id);
    return pushTo(await othersInHousehold(d.household_id, d.opener_id), {
      title: `🛵 ${who} פותח/ת הזמנה מ${d.service}`, body: (d.vendor ? d.vendor + ' · ' : '') + `מצטרפים עד ${IL_TIME(d.closes_at)}`,
      tag: 'del-' + id, url: APP_URL + '?family=delivery', ...DEL });
  }
  if (type === 'delivery_line') {
    const [x] = await sql`select x.*, d.opener_id from public.delivery_lines x join public.deliveries d on d.id = x.delivery_id where x.id = ${id}`;
    if (!x || x.user_id === x.opener_id) return { sent: 0 };
    const who = await nameIn(x.household_id, x.user_id);
    return pushTo([x.opener_id], { title: `🍕 ${who} הצטרף/ה להזמנה`, body: x.body, tag: 'delline-' + x.delivery_id, url: APP_URL + '?family=delivery', ...DEL });
  }
  if (type === 'delivery_status') {
    const [d] = await sql`select * from public.deliveries where id = ${id}`;
    if (!d) return { sent: 0 };
    const by = d.updated_by || d.opener_id;
    const who = await nameIn(d.household_id, by);
    const msg: Record<string, [string, string]> = {
      ordered: [`✅ ${who} הזמין/ה מ${d.service}`, (d.vendor ? d.vendor + ' · ' : '') + 'ההזמנה נסגרה, עכשיו מחכים'],
      onway: ['🛵 המשלוח בדרך אלינו', (d.vendor || d.service) + ' · עוד מעט כאן'],
      arrived: ['🍕 המשלוח הגיע!', 'בתאבון 😋'],
      cancelled: [`ההזמנה מ${d.service} בוטלה`, `${who} ביטל/ה את ההזמנה`]
    };
    const m = msg[d.status]; if (!m) return { sent: 0 };
    return pushTo(await othersInHousehold(d.household_id, by), { title: m[0], body: m[1], tag: 'del-' + id, url: APP_URL + '?family=delivery', ...DEL });
  }
  return { sent: 0 };
}

// ---- owner alerts (no list / message content, only that someone uses the app) ----
async function adminUser() {
  const [row] = await sql`select value from public.app_secrets where name = 'admin_user'`;
  return row?.value as string | undefined;
}
async function memberJoin(hid: string, uid: string) {
  const UUID = /^[0-9a-f-]{36}$/i;
  if (!UUID.test(hid) || !UUID.test(uid)) return { sent: 0 };
  const admin = await adminUser(); if (!admin || admin === uid) return { sent: 0 };
  const [mine] = await sql`select household_id from public.members where user_id = ${admin} limit 1`;
  if (mine && mine.household_id === hid) return { sent: 0 };            // our own home: no need
  const [h] = await sql`select h.name, (select count(*) from public.members where household_id = h.id)::int n,
      (select display_name from public.members where household_id = h.id and user_id = ${uid}) who
    from public.households h where h.id = ${hid}`;
  if (!h) return { sent: 0 };
  if (h.n <= 1) return pushTo([admin], { title: '🏠 בית חדש נפתח באפליקציה', body: `${h.who} פתח/ה את "${h.name}"`, tag: 'admin-' + hid, kind: 'admin', badge: 'badge-plus.png', url: APP_URL });
  return pushTo([admin], { title: `👋 ${h.who} הצטרף/ה לבית "${h.name}"`, body: `עכשיו יש בבית ${h.n} משתמשים`, tag: 'admin-' + hid, kind: 'admin', badge: 'badge-plus.png', url: APP_URL });
}
async function weekly() {
  const admin = await adminUser(); if (!admin) return { sent: 0 };
  const [mine] = await sql`select household_id from public.members where user_id = ${admin} limit 1`;
  const ex = mine?.household_id ?? '00000000-0000-0000-0000-000000000000';
  const [s] = await sql`select
      (select count(*) from public.households where id <> ${ex})::int total,
      (select count(distinct household_id) from (
          select household_id from public.items where created_at > now() - interval '7 days'
          union all select household_id from public.trips where started_at > now() - interval '7 days'
          union all select household_id from public.purchases where created_at > now() - interval '7 days'
          union all select household_id from public.landings where created_at > now() - interval '7 days'
          union all select household_id from public.deliveries where created_at > now() - interval '7 days'
          union all select household_id from public.asks where created_at > now() - interval '7 days') x
        where household_id <> ${ex})::int active,
      (select count(*) from public.trips where status = 'done' and finished_at > now() - interval '7 days' and household_id <> ${ex})::int trips,
      (select count(*) from public.members where joined_at > now() - interval '7 days' and household_id <> ${ex})::int joined`;
  if (!s.total) { console.log(JSON.stringify({ kind: 'weekly', skipped: 'no other homes' })); return { sent: 0 }; }
  const body = `${s.active} בתים פעילים מתוך ${s.total} · ${s.trips} קניות` + (s.joined ? ` · ${s.joined} משתמשים חדשים` : '') + ' (לא כולל הבית שלכם)';
  return pushTo([admin], { title: '📊 השבוע ב"בדרך לסופר"', body, tag: 'weekly', kind: 'admin', badge: 'badge-check.png', url: APP_URL });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  try {
    const url = new URL(req.url);
    const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {};
    const action = body.action || url.searchParams.get('action');

    if (action === 'vapid') return json({ publicKey: (await vapid()).publicKey });

    if (action === 'event') {
      const [row] = await sql`select value from public.app_secrets where name = 'cron'`;
      if (!row || req.headers.get('x-cron-secret') !== row.value) return json({ error: 'forbidden' }, 403);
      if (body.type === 'member_join') return json(await memberJoin(String(body.hid || ''), String(body.uid || '')));
      if (String(body.type || '').startsWith('ask_')) {
        const id = String(body.id || ''); if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ sent: 0 });
        return json(await askEvent(String(body.type), id, String(body.from || '')));
      }
      return json(await serverEvent(String(body.type || ''), String(body.id || '')));
    }

    if (action === 'weekly') {
      const [row] = await sql`select value from public.app_secrets where name = 'cron'`;
      if (!row || req.headers.get('x-cron-secret') !== row.value) return json({ error: 'forbidden' }, 403);
      return json(await weekly());
    }

    if (action === 'reminders') {
      const [row] = await sql`select value from public.app_secrets where name = 'cron'`;
      if (!row || req.headers.get('x-cron-secret') !== row.value) return json({ error: 'forbidden' }, 403);
      return json(await reminders());
    }

    const user = await userFromRequest(req);
    if (!user?.id) return json({ error: 'not signed in' }, 401);
    const [me] = await sql`select household_id, display_name from public.members where user_id = ${user.id} limit 1`;
    if (!me) return json({ error: 'no household' }, 403);
    const hid = me.household_id as string, name = me.display_name as string;

    switch (action) {
      case 'items': {
        const UUID = /^[0-9a-f-]{36}$/i;
        const ids: string[] = (Array.isArray(body.ids) ? body.ids : []).filter((x: unknown) => typeof x === 'string' && UUID.test(x)).slice(0, 30);
        if (!ids.length) return json({ sent: 0 });
        const items = await sql`select name, qty from public.items where household_id = ${hid} and id in ${sql(ids)} order by created_at`;
        if (!items.length) return json({ sent: 0 });
        const list = items.map((i) => i.name + (i.qty && i.qty !== '1' ? ` ×${i.qty}` : ''));
        const shown = list.slice(0, 6).join(', ') + (list.length > 6 ? ` ועוד ${list.length - 6}` : '');
        return json(await pushTo(await othersInHousehold(hid, user.id), {
          title: `🛒 נוסף לרשימה (${name})`, body: shown, tag: 'items', url: APP_URL, kind: 'items', badge: 'badge-plus.png'
        }));
      }
      case 'trip_start': case 'trip_done': case 'trip_cancel': case 'message':
        return json({ sent: 0, via: 'server' });
      case 'test':
        return json(await pushTo([user.id], { title: '🔔 התראת בדיקה', body: 'מעולה, ההתראות עובדות במכשיר הזה', tag: 'test', url: APP_URL, kind: 'test', badge: 'badge-check.png' }));
      default:
        return json({ error: 'unknown action' }, 400);
    }
  } catch (e) {
    console.error(e);
    return json({ error: (e as Error).message }, 500);
  }
});
