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

type Payload = { title: string; body: string; tag?: string; url?: string; requireInteraction?: boolean; kind?: string };

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
      tag: 'remind-' + t.id, url: APP_URL + '?confirm=1', requireInteraction: true, kind: 'remind'
    });
  }
  return { reminded: due.length };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  try {
    const url = new URL(req.url);
    const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {};
    const action = body.action || url.searchParams.get('action');

    if (action === 'vapid') return json({ publicKey: (await vapid()).publicKey });

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
          title: `🛒 נוסף לרשימה (${name})`, body: shown, tag: 'items', url: APP_URL, kind: 'items'
        }));
      }
      case 'trip_start': {
        const [t] = await sql`select id from public.trips where household_id = ${hid} and status = 'active' and shopper_id = ${user.id}`;
        if (!t) return json({ sent: 0 });
        return json(await pushTo(await othersInHousehold(hid, user.id), {
          title: `🟠 ${name} בדרך לסופר`, body: 'עכשיו הזמן להוסיף מה שחסר', tag: 'trip-' + t.id, url: APP_URL, kind: 'trip'
        }));
      }
      case 'trip_done': {
        const [t] = await sql`select id, bought_count, left_count from public.trips where id = ${body.trip ?? null} and household_id = ${hid} and shopper_id = ${user.id} and status = 'done'`;
        if (!t) return json({ sent: 0 });
        return json(await pushTo(await othersInHousehold(hid, user.id), {
          title: `🎉 תודה ל${name}, אין עלייך!!!`,
          body: `נקנו ${t.bought_count ?? 0} פריטים` + (t.left_count ? ` · ${t.left_count} נשארו לפעם הבאה` : ''),
          tag: 'trip-' + t.id, url: APP_URL + '?thanks=' + t.id, kind: 'thanks'
        }));
      }
      case 'trip_cancel': {
        const [t] = await sql`select id from public.trips where id = ${body.trip ?? null} and household_id = ${hid} and status = 'cancelled'`;
        if (!t) return json({ sent: 0 });
        return json(await pushTo(await othersInHousehold(hid, user.id), {
          title: `היציאה לסופר של ${name} בוטלה`, body: 'הרשימה נשארה כמו שהיא', tag: 'trip-' + t.id, url: APP_URL, kind: 'trip'
        }));
      }
      case 'message': {
        const [m] = await sql`select kind, body, item_name from public.messages where id = ${body.id ?? null} and household_id = ${hid} and sender_id = ${user.id}`;
        if (!m) return json({ sent: 0 });
        const text = m.kind === 'oos' ? `אין ${m.item_name} במלאי` + (m.body ? ` · ${m.body}` : '')
          : m.kind === 'sub' ? `במקום ${m.item_name} לקחתי ${m.body}`
          : m.kind === 'ask' ? `לגבי ${m.item_name}: ${m.body}` : m.body;
        return json(await pushTo(await othersInHousehold(hid, user.id), {
          title: `💬 ${name}`, body: text, tag: 'msg', url: APP_URL + '?chat=1', kind: 'message'
        }));
      }
      case 'test':
        return json(await pushTo([user.id], { title: '🔔 התראת בדיקה', body: 'מעולה, ההתראות עובדות במכשיר הזה', tag: 'test', url: APP_URL, kind: 'test' }));
      default:
        return json({ error: 'unknown action' }, 400);
    }
  } catch (e) {
    console.error(e);
    return json({ error: (e as Error).message }, 500);
  }
});
