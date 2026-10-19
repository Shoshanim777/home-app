import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './config.js';

const sb = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

/* ---------------- icons ---------------- */
const I = {
  bulb: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V18h6v-1.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z"/></svg>',
  cart: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M3 4h2l2.4 11h11.2L21 8H6.2"/></svg>',
  check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5 10 17 19 7"/></svg>',
  bigcheck: '<svg width="68" height="68" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5 10 17 19 7"/></svg>',
  x: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12"/><path d="M18 6 6 18"/></svg>',
  plus: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',
  list: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></svg>',
  home: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9v12h14V9"/></svg>',
  gear: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>',
  grid: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>',
  heart: '<svg width="22" height="22" viewBox="0 0 24 24" fill="#FF5C8A" stroke="#FF5C8A" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>'
};

/* ---------------- categories ---------------- */
const CATS = [
  ['מקרר', ['חלב','גבינ','קוטג','יוגורט','שמנת','ביצ','חמאה','לבן','מעדן','טופו','גיל','אשל','פודינג','לבנה','שוקו']],
  ['ירקות ופירות', ['עגבני','מלפפ','בצל','שום','תפוח','בננ','לימון','גזר','חסה','פלפל','אבוקדו','תפוא','תפו"א','תפוחי אדמה','קישוא','חציל','פטרוזיליה','כוסברה','שמיר','נענע','ענב','תות','אבטיח','מלון','אגס','תפוז','קלמנטינ','ברוקולי','כרוב','פטריות','בטטה','סלק','פירות','ירקות','רימון','מנגו','אפרסק','שזיפ','דלעת','תירס']],
  ['מאפים', ['לחם','פיתה','פיתות','לחמני','חלה','בגט','טורטי','עוגה','עוגיות','קרואסון','בורקס','לאפה']],
  ['בשר ודגים', ['עוף','חזה','בשר','טחון','שניצל','דג','סלמון','טונה','נקניק','פרגית','הודו','כרעיים','כנפיים','קבב','המבורגר','סטייק','אנטריקוט','פילה']],
  ['מזווה', ['אורז','פסטה','ספגטי','קמח','סוכר','שמן','מלח','פלפל שחור','טחינה','קפה','תה','קורנפלקס','דגני','שימור','רוטב','קטשופ','מיונז','חרדל','דבש','ריבה','חומוס','עדשים','שוקולד','חטיף','ביסלי','במבה','אגוז','שקדים','קוסקוס','פתיתים','בורגול','קינואה','שיבולת','גרנולה','תבלין','פפריקה','כמון','חומץ','זיתים','מלפפון חמוץ','נוטלה','קקאו','אבקת אפייה','שמרים','וניל','קרקר','פריכיות','ממרח']],
  ['משקאות', ['מים','סודה','קולה','מיץ','בירה','יין','שתייה','פריגת','תפוזינה','נביעות','משקה']],
  ['קפואים', ['קפוא','גלידה','אפונה','שעועית ירוקה','בצק','פיצה','מלאווח','ג׳חנון','ג\'חנון']],
  ['ניקיון ובית', ['נייר','טואלט','מגבונ','סבון','אקונומיקה','כביסה','מרכך','שקיות','שקית','ספוג','נוזל כלים','טישו','אלומיניום','ניילון','מטליות','סנו','אקונומיקה','מנקה','פח','נרות','סוללות','נורה','קפסולות']],
  ['טיפוח ופארם', ['שמפו','משחת שיניים','מברשת','דאודורנט','תחבושות','חיתול','קרם','סבון ידיים','מרכך שיער','גילוח','צמר גפן','פלסטר','אקמול','ויטמין']]
];
const CAT_ORDER = ['ירקות ופירות','מקרר','מאפים','בשר ודגים','מזווה','קפואים','משקאות','ניקיון ובית','טיפוח ופארם','אחר'];
const CAT_ICON = { 'ירקות ופירות': '🥕', 'מקרר': '🥛', 'מאפים': '🍞', 'בשר ודגים': '🍗', 'מזווה': '🥫', 'קפואים': '🧊', 'משקאות': '🥤', 'ניקיון ובית': '🧽', 'טיפוח ופארם': '🧴', 'אחר': '🛒' };

/* product catalog for "בחירה מרשימה" */
const CATALOG = [
  { name: 'ירקות ופירות', items: [['🍅','עגבניות'],['🥒','מלפפונים'],['🧅','בצל'],['🧄','שום'],['🥕','גזר'],['🫑','פלפל'],['🥬','חסה'],['🥔','תפוחי אדמה'],['🍠','בטטה'],['🥑','אבוקדו'],['🍆','חציל'],['🥦','ברוקולי'],['🍄','פטריות'],['🌿','פטרוזיליה'],['🌿','כוסברה'],['🌿','שמיר'],['🍋','לימון'],['🍌','בננות'],['🍎','תפוחים'],['🍊','תפוזים'],['🍐','אגסים'],['🍇','ענבים'],['🍓','תותים'],['🍉','אבטיח'],['🥭','מנגו']] },
  { name: 'מקרר', items: [['🥛','חלב'],['🥚','ביצים'],['🧀','גבינה צהובה'],['🧀','גבינה לבנה'],['🥣','קוטג׳'],['🍶','יוגורט'],['🧈','חמאה'],['🥛','שמנת מתוקה'],['🍶','שמנת חמוצה'],['🍮','מעדנים'],['🧀','לבנה'],['🧀','בולגרית'],['🥛','שוקו']] },
  { name: 'מאפים', items: [['🍞','לחם'],['🍞','לחם מחמצת'],['🫓','פיתות'],['🥖','באגט'],['🍞','לחמניות'],['🥯','בייגל'],['🥐','קרואסונים'],['🫓','טורטיות'],['🍞','חלה'],['🍰','עוגה']] },
  { name: 'בשר ודגים', items: [['🍗','חזה עוף'],['🍗','שניצל'],['🍗','כרעיים'],['🍗','פרגיות'],['🥩','בשר טחון'],['🥩','סטייק'],['🍔','המבורגרים'],['🌭','נקניקיות'],['🐟','סלמון'],['🐟','פילה דג'],['🥓','פסטרמה']] },
  { name: 'מזווה', items: [['🍚','אורז'],['🍝','פסטה'],['🍝','ספגטי'],['🌾','קמח'],['🍬','סוכר'],['🧂','מלח'],['🧂','פלפל שחור'],['🫒','שמן זית'],['🌻','שמן קנולה'],['☕','קפה'],['🍵','תה'],['🥣','קורנפלקס'],['🥣','גרנולה'],['🥫','טונה'],['🥫','רסק עגבניות'],['🫘','חומוס'],['🫘','עדשים'],['🫙','טחינה'],['🍯','דבש'],['🍓','ריבה'],['🍫','שוקולד'],['🍫','ממרח שוקולד'],['🥜','במבה'],['🥨','ביסלי'],['🍪','עוגיות'],['🥜','אגוזים'],['🫒','זיתים'],['🥒','מלפפון חמוץ'],['🍅','קטשופ'],['🥚','מיונז']] },
  { name: 'קפואים', items: [['🍦','גלידה'],['🍕','פיצה קפואה'],['🥟','בורקס'],['🥞','מלאווח'],['🥦','ירקות קפואים'],['🍟','צ׳יפס קפוא'],['🧊','קרח']] },
  { name: 'משקאות', items: [['💧','מים'],['🫧','סודה'],['🥤','קולה'],['🧃','מיץ'],['🍺','בירה'],['🍷','יין'],['🥛','חלב סויה'],['🥛','חלב שקדים']] },
  { name: 'ניקיון ובית', items: [['🧻','נייר טואלט'],['🧻','מגבות נייר'],['🧻','טישו'],['🧽','ספוגים'],['🧴','נוזל כלים'],['🫧','טבליות למדיח'],['🧺','אבקת כביסה'],['🧴','מרכך כביסה'],['🗑️','שקיות זבל'],['🧼','סבון ידיים'],['🧪','אקונומיקה'],['🧹','מנקה רצפות'],['🧻','מגבונים'],['🔋','סוללות'],['💡','נורות'],['🥡','נייר אפייה'],['🥡','נייר כסף']] },
  { name: 'טיפוח ופארם', items: [['🧴','שמפו'],['🧴','מרכך שיער'],['🪥','משחת שיניים'],['🪥','מברשות שיניים'],['🧴','דאודורנט'],['🪒','סכיני גילוח'],['🧴','קרם גוף'],['☀️','קרם הגנה'],['🩹','פלסטרים'],['💊','משככי כאבים'],['🧻','צמר גפן']] }
];
const CATALOG_MAP = new Map();
for (const c of CATALOG) for (const [emo, n] of c.items) CATALOG_MAP.set(n, { emo, cat: c.name });

// catalog names, longest first, so "שוקולד מריר" matches "שוקולד" and never "שוקו"
const CATALOG_KEYS = [...CATALOG_MAP.keys()].sort((a, b) => b.length - a.length);
function catalogMatch(name) {
  const n = name.replace(/\s+/g, ' ').trim();
  if (CATALOG_MAP.has(n)) return CATALOG_MAP.get(n);
  const k = CATALOG_KEYS.find(k => n.startsWith(k + ' ') || k.startsWith(n + ' '));
  return k ? CATALOG_MAP.get(k) : null;
}
function guessCategory(name) {
  const m = catalogMatch(name); if (m) return m.cat;
  const n = name.replace(/\s+/g, ' ').trim();
  let best = null, len = 0;
  for (const [cat, words] of CATS) for (const w of words) if (w.length > len && n.includes(w)) { best = cat; len = w.length; }
  return best || 'אחר';
}
function iconFor(name, category) {
  return catalogMatch(name)?.emo || CAT_ICON[category] || '🛒';
}

/* ---------------- state ---------------- */
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
const S = {
  booting: true, session: null, user: null,
  household: null, members: {}, items: [], trip: null,
  outbox: LS.get('ha_outbox', []), online: navigator.onLine,
  tab: 'list', authMode: 'login', authErr: '', busy: false,
  addText: '', history: LS.get('ha_history', {}),
  shownThanks: new Set(LS.get('ha_shown_thanks', [])), confirmFor: null,
  removing: new Map(), onboard: null, picker: null
};
const REMOVE_MS = 3000;
let channel = null;

function saveCache() {
  if (!S.user) return;
  LS.set('ha_cache_' + S.user.id, { household: S.household, members: S.members, items: S.items, trip: S.trip });
}
function loadCache() {
  const c = LS.get('ha_cache_' + S.user.id, null);
  if (c) Object.assign(S, { household: c.household, members: c.members || {}, items: c.items || [], trip: c.trip });
}

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const me = () => S.members[S.user?.id];
const nameOf = id => S.members[id]?.display_name || 'מישהו';
const colorOf = id => S.members[id]?.color || '#9A98B0';
const initial = id => (nameOf(id) || '?').trim().charAt(0);
const superItems = () => S.items.filter(i => i.list === 'super');
const minsSince = t => Math.max(0, Math.round((Date.now() - new Date(t).getTime()) / 60000));

function toast(msg, ms = 3200) {
  const el = document.createElement('div');
  el.className = 'toast'; el.textContent = msg;
  document.getElementById('toast-root').appendChild(el);
  setTimeout(() => el.remove(), ms);
}
function vibrate(p) { try { navigator.vibrate && navigator.vibrate(p); } catch {} }

/* ---------------- data ---------------- */
async function loadAll() {
  const { data: mem, error: e1 } = await sb.from('members').select('household_id, user_id, display_name, color').eq('user_id', S.user.id).limit(1);
  if (e1) throw e1;
  if (!mem || !mem.length) { S.household = null; S.members = {}; S.items = []; S.trip = null; saveCache(); return; }
  const hid = mem[0].household_id;
  const [h, m, it, tr] = await Promise.all([
    sb.from('households').select('*').eq('id', hid).single(),
    sb.from('members').select('user_id, display_name, color').eq('household_id', hid),
    sb.from('items').select('*').eq('household_id', hid).order('created_at'),
    sb.from('trips').select('*').eq('household_id', hid).eq('status', 'active').maybeSingle()
  ]);
  for (const r of [h, m, it, tr]) if (r.error) throw r.error;
  S.household = h.data;
  S.members = Object.fromEntries(m.data.map(x => [x.user_id, x]));
  S.items = mergePending(it.data);
  S.trip = tr.data || null;
  saveCache();
  subscribe();
}

function mergePending(serverItems) {
  // re-apply local, not-yet-synced changes on top of server data
  const map = new Map(serverItems.map(i => [i.id, i]));
  for (const op of S.outbox) {
    if (op.op === 'insert') map.set(op.row.id, { ...op.row, _pending: true });
    if (op.op === 'update' && map.has(op.id)) map.set(op.id, { ...map.get(op.id), ...op.patch, _pending: true });
    if (op.op === 'delete') map.delete(op.id);
  }
  return [...map.values()];
}

function subscribe() {
  if (!S.household) return;
  if (channel) { sb.removeChannel(channel); channel = null; }
  const hid = S.household.id;
  channel = sb.channel('hh-' + hid, { config: { broadcast: { self: false } } })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'items', filter: 'household_id=eq.' + hid }, onItem)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'trips', filter: 'household_id=eq.' + hid }, onTrip)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'members', filter: 'household_id=eq.' + hid }, async () => {
      const { data } = await sb.from('members').select('user_id, display_name, color').eq('household_id', hid);
      if (data) { S.members = Object.fromEntries(data.map(x => [x.user_id, x])); render(); }
    })
    .on('broadcast', { event: 'heart' }, ({ payload }) => {
      if (payload?.to === S.user.id) { vibrate([60, 40, 60]); toast(nameOf(payload.from) + ' שלח/ה לך לב ❤'); }
    })
    .subscribe();
}

function onItem({ eventType, new: n, old: o }) {
  if (eventType === 'DELETE') {
    S.items = S.items.filter(i => i.id !== o.id);
  } else {
    const idx = S.items.findIndex(i => i.id === n.id);
    const isNew = idx === -1;
    if (isNew) S.items.push(n); else S.items[idx] = { ...n };
    if (isNew && eventType === 'INSERT' && n.added_by !== S.user.id && S.trip && S.trip.shopper_id === S.user.id) {
      vibrate(120); toast(nameOf(n.added_by) + ' הוסיפ/ה: ' + n.name + (n.qty && n.qty !== '1' ? ' · ' + n.qty : ''));
    }
  }
  saveCache(); render();
}

function onTrip({ eventType, new: n }) {
  if (eventType === 'DELETE') return;
  if (n.status === 'active') {
    const was = S.trip;
    S.trip = n;
    if (!was && n.shopper_id !== S.user.id) { vibrate(80); toast(nameOf(n.shopper_id) + ' בדרך לסופר!'); }
  } else {
    if (S.trip && S.trip.id === n.id) S.trip = null;
    if (n.status === 'done') showThanks(n);
    if (n.status === 'cancelled' && n.shopper_id !== S.user.id) toast(nameOf(n.shopper_id) + ' ביטל/ה את היציאה לסופר');
  }
  saveCache(); render();
}

/* ---------------- outbox (offline-safe writes) ---------------- */
function queue(op) {
  S.outbox.push(op); LS.set('ha_outbox', S.outbox);
  flush();
}
let flushing = false;
async function flush() {
  if (flushing || !S.online || !S.user) return;
  flushing = true;
  try {
    while (S.outbox.length) {
      const op = S.outbox[0];
      let res;
      if (op.op === 'insert') res = await sb.from('items').upsert(op.row, { onConflict: 'id' });
      else if (op.op === 'update') res = await sb.from('items').update(op.patch).eq('id', op.id);
      else if (op.op === 'delete') res = await sb.from('items').delete().eq('id', op.id);
      if (res.error) {
        if (isNetErr(res.error)) break;
        console.warn('dropping op', op, res.error); toast('שינוי אחד לא נשמר');
      }
      S.outbox.shift(); LS.set('ha_outbox', S.outbox);
      const it = S.items.find(i => i.id === (op.row?.id || op.id));
      if (it && !S.outbox.some(o => (o.row?.id || o.id) === it.id)) delete it._pending;
    }
  } finally { flushing = false; saveCache(); render(); }
}
const isNetErr = e => !navigator.onLine || /fetch|network|Failed/i.test(e?.message || '');

function addItem(text) {
  const parsed = parseItem(text);
  if (!parsed) return;
  if (addRow(parsed) === 'dup') toast(parsed.name + ' כבר ברשימה');
  saveCache(); render();
}
function addRow({ name, qty = '1', note = '', category }) {
  const existing = superItems().find(i => i.name.trim() === name && !i.in_cart);
  if (existing) {
    // re-adding an item that is fading out simply keeps it
    if (S.removing.has(existing.id)) { clearTimeout(S.removing.get(existing.id).t); S.removing.delete(existing.id); return 'kept'; }
    return 'dup';
  }
  const row = {
    id: crypto.randomUUID(), household_id: S.household.id, list: 'super',
    name, qty, note, category: category || guessCategory(name),
    in_cart: false, added_by: S.user.id, created_at: new Date().toISOString()
  };
  S.items.push({ ...row, _pending: true });
  S.history[name] = (S.history[name] || 0) + 1; LS.set('ha_history', S.history);
  queue({ op: 'insert', row });
  return 'added';
}
function toggleRemove(id) {
  const r = S.removing.get(id);
  if (r) { clearTimeout(r.t); S.removing.delete(id); render(); return; }
  vibrate(15);
  const t = setTimeout(() => { S.removing.delete(id); deleteItem(id); }, REMOVE_MS);
  S.removing.set(id, { t, at: Date.now() });
  render();
}
function parseItem(text) {
  let t = text.replace(/\s+/g, ' ').trim();
  if (!t) return null;
  let note = '';
  const ci = t.search(/[,،]/);
  if (ci > 0) { note = t.slice(ci + 1).trim(); t = t.slice(0, ci).trim(); }
  let qty = '1', m;
  if ((m = t.match(/^(.+?)\s*[x×*]\s*(\d+)$/i))) { t = m[1]; qty = m[2]; }
  else if ((m = t.match(/^(\d+)\s+(.+)$/))) { qty = m[1]; t = m[2]; }
  else if ((m = t.match(/^(.+?)\s+(\d+(?:[.,]\d+)?\s*(?:ק"ג|ק״ג|קג|קילו|גרם|ליטר|יח׳|יחידות))$/))) { t = m[1]; qty = m[2]; }
  return { name: t.slice(0, 80), qty, note: note.slice(0, 120) };
}
function updateItem(id, patch) {
  const it = S.items.find(i => i.id === id); if (!it) return;
  Object.assign(it, patch, { _pending: true });
  queue({ op: 'update', id, patch });
  saveCache(); render();
}
function deleteItem(id) {
  const r = S.removing.get(id); if (r) { clearTimeout(r.t); S.removing.delete(id); }
  S.items = S.items.filter(i => i.id !== id);
  // an unsynced insert can simply be dropped
  const ins = S.outbox.findIndex(o => o.op === 'insert' && o.row.id === id);
  if (ins >= 0) { S.outbox = S.outbox.filter(o => (o.row?.id || o.id) !== id); LS.set('ha_outbox', S.outbox); }
  else queue({ op: 'delete', id });
  saveCache(); render();
}

/* ---------------- trips ---------------- */
async function rpc(fn, args) {
  S.busy = true; render();
  try {
    const { data, error } = await sb.rpc(fn, args);
    if (error) throw error;
    return data;
  } catch (e) {
    toast(isNetErr(e) ? 'אין חיבור, נסו שוב בעוד רגע' : (e.message || 'משהו השתבש'));
    return null;
  } finally { S.busy = false; render(); }
}
async function startTrip() {
  await flush();
  const t = await rpc('start_trip', { p_household: S.household.id, p_minutes: 15 });
  if (t) { S.trip = t; S.items.forEach(i => { if (i.list === 'super') i.in_cart = false; }); vibrate(60); saveCache(); render(); }
}
async function finishTrip() {
  closeSheet();
  await flush();
  const t = await rpc('finish_trip', { p_trip: S.trip.id });
  if (t) { S.items = S.items.filter(i => !(i.list === 'super' && i.in_cart)); S.trip = null; saveCache(); showThanks(t); render(); }
}
async function snoozeTrip(min) {
  closeSheet();
  const t = await rpc('snooze_trip', { p_trip: S.trip.id, p_minutes: min });
  if (t) { S.trip = t; toast('אזכיר שוב בעוד ' + min + ' דקות'); saveCache(); render(); }
}
async function cancelTrip() {
  closeSheet();
  const t = await rpc('cancel_trip', { p_trip: S.trip.id });
  if (t) { S.trip = null; S.items.forEach(i => { if (i.list === 'super') i.in_cart = false; }); saveCache(); render(); }
}

/* ---------------- render ---------------- */
const app = document.getElementById('app');
function render() {
  document.body.classList.toggle('trip-mode', !!(S.trip && S.household && S.tab === 'list'));
  if (S.booting) { app.innerHTML = ''; return; }
  if (!S.session) return renderAuth();
  if (!S.household) return renderOnboard();
  const focused = document.activeElement?.id === 'add-input';
  const sel = focused ? [document.activeElement.selectionStart, document.activeElement.selectionEnd] : null;
  app.innerHTML = renderMain();
  if (focused) { const el = document.getElementById('add-input'); if (el) { el.focus(); try { el.setSelectionRange(...sel); } catch {} } }
}

function renderAuth() {
  const signup = S.authMode === 'signup';
  app.innerHTML = `
  <form class="auth" data-form="auth">
    <img class="logo-img" src="icon-512.png" alt="">
    <h1>בדרך לסופר</h1>
    <p>הרשימה המשותפת של הבית. מה שאחד מוסיף, השני רואה מיד.</p>
    <div class="field"><label for="em">אימייל</label><input id="em" name="email" type="email" autocomplete="email" required dir="ltr"></div>
    <div class="field"><label for="pw">סיסמה</label><input id="pw" name="password" type="password" minlength="6" autocomplete="${signup ? 'new-password' : 'current-password'}" required dir="ltr"></div>
    <div class="err">${esc(S.authErr)}</div>
    <button class="btn violet" type="submit" ${S.busy ? 'disabled' : ''}>${signup ? 'יצירת משתמש' : 'כניסה'}</button>
    <button class="link" type="button" data-act="auth-toggle">${signup ? 'כבר יש לי משתמש · כניסה' : 'פעם ראשונה? יצירת משתמש'}</button>
  </form>`;
}

function renderOnboard() {
  const mode = S.onboard;
  let inner;
  if (mode === 'create') {
    inner = `<h1>פתיחת בית חדש</h1>
    <p>אחרי הפתיחה תקבל/י קוד לשלוח לשאר בני הבית.</p>
    <form data-form="create" style="display:flex;flex-direction:column;gap:12px">
      <div class="field"><label for="dn1">איך לקרוא לך?</label><input id="dn1" name="display" required maxlength="20" placeholder="למשל: דותן"></div>
      <div class="field"><label for="hn">שם הבית (לא חובה)</label><input id="hn" name="house" maxlength="40" placeholder="הבית של דותן ונועה"></div>
      <button class="btn violet" type="submit" ${S.busy ? 'disabled' : ''}>פתיחת הבית</button>
    </form>`;
  } else if (mode === 'join') {
    inner = `<h1>הצטרפות לבית</h1>
    <p>הקלידו את הקוד שקיבלתם בהודעה.</p>
    <form data-form="join" style="display:flex;flex-direction:column;gap:12px">
      <div class="field"><label for="dn2">איך לקרוא לך?</label><input id="dn2" name="display" required maxlength="20" placeholder="למשל: נועה"></div>
      <div class="field"><label for="cd">קוד הזמנה</label><input id="cd" name="code" required maxlength="6" dir="ltr" autocapitalize="characters" style="text-transform:uppercase;letter-spacing:6px;text-align:center;font-size:22px;font-weight:700"></div>
      <button class="btn violet" type="submit" ${S.busy ? 'disabled' : ''}>הצטרפות</button>
    </form>`;
  } else {
    inner = `<h1>ברוכים הבאים</h1>
    <p>רק אחד מכם פותח את הבית.<br>כל השאר מצטרפים עם הקוד שלו.</p>
    <button class="choice" data-act="ob" data-mode="create"><span class="ce" aria-hidden="true">🏠</span><span><b>אני הראשון/ה בבית</b><small>פותחים בית חדש ומקבלים קוד לשאר</small></span></button>
    <button class="choice" data-act="ob" data-mode="join"><span class="ce" aria-hidden="true">🔑</span><span><b>קיבלתי קוד הזמנה</b><small>מצטרפים לבית שכבר קיים</small></span></button>`;
  }
  app.innerHTML = `<div class="auth">
    <img class="logo-img" src="icon-512.png" alt="">
    ${inner}
    <div class="err">${esc(S.authErr)}</div>
    ${mode ? '<button class="link" data-act="ob" data-mode="">חזרה</button>' : '<button class="link" data-act="signout">יציאה מהמשתמש</button>'}
  </div>`;
}

function itemRow(i, tripMode) {
  const newInTrip = S.trip && new Date(i.created_at) > new Date(S.trip.started_at) && i.added_by !== S.trip.shopper_id;
  const rem = !tripMode && S.removing.get(i.id);
  const done = tripMode ? i.in_cart : (i.in_cart || !!rem);
  // someone else's cart progress during a trip is read-only for the people at home
  const locked = !tripMode && i.in_cart && !rem;
  const label = tripMode ? (i.in_cart ? 'הוצאה מהעגלה' : 'סימון בעגלה') : (rem ? 'ביטול מחיקה' : 'מחיקה מהרשימה');
  const remStyle = rem ? ` style="animation-delay:-${Date.now() - rem.at}ms"` : '';
  return `<div class="row ${done ? 'done' : ''} ${rem ? 'removing' : ''} ${i._pending ? 'pending' : ''}"${remStyle}>
    <button class="check" data-act="toggle" data-id="${i.id}" aria-label="${label}: ${esc(i.name)}" aria-pressed="${done}" ${locked ? 'disabled' : ''}>${I.check}</button>
    <span class="emo" aria-hidden="true">${iconFor(i.name, i.category)}</span>
    <button class="main" data-act="edit" data-id="${i.id}">
      <span class="name">${esc(i.name)}</span>
      ${rem ? '<span class="note">נמחק · לחיצה על ✓ מבטלת</span>' : (i.note ? `<span class="note">${esc(i.note)}</span>` : '')}
    </button>
    ${tripMode && newInTrip ? '<span class="new">חדש</span>' : ''}
    ${i.qty && i.qty !== '1' ? `<span class="qty">${esc(i.qty)}</span>` : ''}
    ${!tripMode ? `<span class="av sm" style="background:${colorOf(i.added_by)}" title="${esc(nameOf(i.added_by))}">${esc(initial(i.added_by))}</span>` : ''}
  </div>`;
}

function renderMain() {
  const items = superItems();
  const trip = S.trip;
  const iShop = trip && trip.shopper_id === S.user.id;
  const open = items.filter(i => !i.in_cart).length;
  const inCart = items.filter(i => i.in_cart).length;
  const memberList = Object.values(S.members);

  let body = '';
  if (S.tab === 'family') {
    body = `<div class="top"><div><div class="sub">${esc(S.household.name)}</div><h1>חדר משפחה</h1></div></div>
      <div class="empty">כאן יהיו בקשות ("מישהו יכול להביא...") ורשימות נוספות:<br>בית מרקחת, תיקונים בבית, מתנות.<br><b>מגיע בגרסה 2.</b></div>`;
  } else {
    const header = `<div class="top">
      <div><div class="sub">${esc(S.household.name)}</div><h1>רשימת הסופר</h1></div>
      <button class="avatars" data-act="settings" aria-label="הגדרות הבית">${memberList.map(m => `<span class="av" style="background:${m.color}">${esc(m.display_name.charAt(0))}</span>`).join('')}</button>
    </div>`;

    let status;
    if (iShop) {
      status = `<div class="hero">
        <div class="lamp on">${I.bulb}</div>
        <div class="t1">את/ה בדרך לסופר</div>
        <div class="t2">${minsSince(trip.started_at)} דק׳ · ${inCart} מתוך ${items.length} בעגלה</div>
      </div>`;
    } else if (trip) {
      status = `<div class="status">
        <div class="lamp on">${I.bulb}</div>
        <div><div class="t1">${esc(nameOf(trip.shopper_id))} בדרך לסופר</div>
        <div class="t2">יצא/ה לפני ${minsSince(trip.started_at)} דק׳ · ${inCart} מתוך ${items.length} בעגלה</div></div>
      </div>`;
    } else {
      status = `<div class="status">
        <div class="lamp">${I.bulb}</div>
        <div><div class="t1">אף אחד לא בדרך</div>
        <div class="t2">${open ? open + ' פריטים מחכים לקנייה' : 'הרשימה ריקה. מה חסר?'}</div></div>
      </div>`;
    }

    const histChips = Object.entries(S.history)
      .filter(([n]) => !items.some(i => i.name === n))
      .sort((a, b) => b[1] - a[1]).slice(0, 5)
      .map(([n]) => `<button class="chip" data-act="quick" data-name="${esc(n)}">+ ${esc(n)}</button>`).join('');

    const add = `<form class="add" data-form="add">
        ${I.plus}
        <input id="add-input" type="text" placeholder="${trip && !iShop ? 'להוסיף ברגע האחרון…' : 'מה חסר? למשל: חלב ×2, תנובה'}" aria-label="הוספת פריט" autocomplete="off" enterkeyhint="done" value="${esc(S.addText)}">
        <button class="go" type="submit">הוספה</button>
      </form>
      <div class="chips"><button class="chip pick" data-act="pick-open">${I.grid} בחירה מרשימה</button>${histChips}</div>`;

    let list;
    if (!items.length) {
      list = `<div class="empty">אין כלום ברשימה.<br>כשמשהו נגמר, כותבים אותו כאן<br>ו${esc(memberList.filter(m => m.user_id !== S.user.id).map(m => m.display_name)[0] || 'כולם')} רואה מיד.</div>`;
    } else if (iShop) {
      const sorted = [...items].sort((a, b) => (a.in_cart - b.in_cart) || CAT_ORDER.indexOf(a.category) - CAT_ORDER.indexOf(b.category));
      list = `<div class="list"><div class="card">${sorted.map(i => itemRow(i, true)).join('')}</div></div>`;
    } else {
      const groups = {};
      for (const i of items) (groups[i.category] ||= []).push(i);
      list = `<div class="list">${CAT_ORDER.filter(c => groups[c]).map(c => `
        <div><div class="group-name">${esc(c)}</div>
        <div class="card">${groups[c].sort((a, b) => a.in_cart - b.in_cart).map(i => itemRow(i, false)).join('')}</div></div>`).join('')}</div>`;
    }

    let fab;
    if (iShop) {
      fab = `<div class="fab">
        <button class="btn green" data-act="confirm" ${S.busy ? 'disabled' : ''}>סיימתי לקנות</button>
        <button class="btn icon" data-act="cancel-ask" aria-label="ביטול היציאה לסופר">${I.x}</button>
      </div>`;
    } else if (!trip) {
      fab = `<div class="fab"><button class="btn orange" data-act="start" ${S.busy ? 'disabled' : ''}>${I.cart} אני בדרך לסופר</button></div>`;
    } else fab = '';

    const offline = !S.online ? `<div class="offline">אין חיבור כרגע · השינויים יישמרו וישתלחו כשהקליטה תחזור</div>` : '';
    body = (iShop ? `<div class="top" style="padding-bottom:0"><h1 style="font-size:22px">רשימת הסופר</h1></div>` : header) + offline + status + add + list + fab;
  }

  const nav = `<nav class="tabs">
    <button class="${S.tab === 'list' ? 'active' : ''}" data-act="tab" data-tab="list">${I.list} סופר</button>
    <button class="${S.tab === 'family' ? 'active' : ''}" data-act="tab" data-tab="family">${I.home} <span>חדר משפחה <span class="soon">בקרוב</span></span></button>
    <button data-act="settings">${I.gear} הגדרות</button>
  </nav>`;
  return `<div class="screen ${S.trip && S.tab === 'list' ? 'trip' : ''}">${body}</div>${nav}`;
}

/* ---------------- sheets ---------------- */
const sheetRoot = document.getElementById('sheet-root');
function openSheet(html, cls = '') {
  sheetRoot.innerHTML = `<div class="backdrop" data-act="backdrop"><div class="sheet ${cls}" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div></div>`;
}
function closeSheet() { sheetRoot.innerHTML = ''; S.picker = null; }

/* ---- "בחירה מרשימה" picker ---- */
function openPicker() {
  S.picker = { cat: CATALOG[0].name, sel: {} };
  openSheet(pickerHtml(), 'tall');
}
function pickerHtml() {
  const P = S.picker;
  const cat = CATALOG.find(c => c.name === P.cat);
  const inList = new Set(superItems().filter(i => !S.removing.has(i.id)).map(i => i.name));
  const count = Object.keys(P.sel).length;
  const selIn = c => c.items.filter(([, n]) => P.sel[n]).length;
  return `<div class="pk-head"><h2>בחירה מרשימה</h2>
      <button class="pk-x" data-act="backdrop-close" aria-label="סגירה">${I.x}</button></div>
    <div class="pk-tabs" id="pk-tabs">${CATALOG.map(c => `<button class="pk-tab ${c.name === P.cat ? 'on' : ''}" data-act="pick-cat" data-cat="${esc(c.name)}"><span aria-hidden="true">${CAT_ICON[c.name]}</span> ${esc(c.name)}${selIn(c) ? `<b>${selIn(c)}</b>` : ''}</button>`).join('')}</div>
    <div class="pk-list" id="pk-list">${cat.items.map(([emo, name]) => {
      const q = P.sel[name]; const has = inList.has(name);
      return `<div class="pk-row ${q ? 'on' : ''} ${has ? 'has' : ''}">
        <button class="pk-main" data-act="pick-toggle" data-name="${esc(name)}" ${has ? 'disabled' : ''} aria-pressed="${!!q}">
          <span class="pk-box">${I.check}</span>
          <span class="pk-emo" aria-hidden="true">${emo}</span>
          <span class="pk-name">${esc(name)}</span>
          ${has ? '<span class="pk-has">כבר ברשימה</span>' : ''}
        </button>
        ${q ? `<div class="pk-step">
          <button data-act="pick-inc" data-name="${esc(name)}" aria-label="עוד ${esc(name)}">+</button>
          <span aria-live="polite">${q}</span>
          <button data-act="pick-dec" data-name="${esc(name)}" aria-label="פחות ${esc(name)}">−</button>
        </div>` : ''}
      </div>`;
    }).join('')}</div>
    <button class="btn violet" data-act="pick-add" ${count ? '' : 'disabled'}>${count ? `הוספה לרשימה (${count})` : 'בוחרים מוצרים ומוסיפים'}</button>`;
}
function refreshPicker(resetScroll) {
  const sheet = sheetRoot.querySelector('.sheet'); if (!sheet || !S.picker) return;
  const top = resetScroll ? 0 : (document.getElementById('pk-list')?.scrollTop || 0);
  const left = document.getElementById('pk-tabs')?.scrollLeft || 0;
  sheet.innerHTML = '<div class="grab"></div>' + pickerHtml();
  document.getElementById('pk-list').scrollTop = top;
  document.getElementById('pk-tabs').scrollLeft = left;
}
function pickerAdd() {
  const P = S.picker; let added = 0, kept = 0;
  for (const [name, q] of Object.entries(P.sel)) {
    const r = addRow({ name, qty: String(q), category: CATALOG_MAP.get(name)?.cat });
    if (r === 'added') added++; else if (r === 'kept') kept++;
  }
  closeSheet(); saveCache(); render();
  if (added + kept) { vibrate(20); toast(`נוספו ${added + kept} מוצרים לרשימה`); }
}

function openConfirm(fromTimer) {
  const items = superItems();
  const inCart = items.filter(i => i.in_cart);
  const left = items.filter(i => !i.in_cart);
  const pct = items.length ? Math.round(inCart.length / items.length * 100) : 0;
  openSheet(`
    <div><h2>${fromTimer ? 'איך הלך בסופר?' : 'לסיים את הקנייה?'}</h2>
    <div class="lead">${fromTimer ? 'עברו ' + minsSince(S.trip.started_at) + ' דקות. ' : ''}סימנת ${inCart.length} מתוך ${items.length} פריטים בעגלה</div></div>
    <div class="bar"><div style="width:${pct}%"></div></div>
    ${left.length ? `<div class="left-box"><div class="h">יישארו ברשימה לפעם הבאה</div><div class="pills">${left.map(i => `<span>${esc(i.name)}</span>`).join('')}</div></div>` : ''}
    <button class="btn green" data-act="finish">סיימתי, אפשר לסגור</button>
    <div class="row2">
      <button class="btn soft" data-act="snooze">עוד 10 דקות</button>
      <button class="btn ghost" data-act="cancel">לא יצא, ביטלתי</button>
    </div>`);
}

function openEdit(id) {
  const i = S.items.find(x => x.id === id); if (!i) return;
  openSheet(`
    <h2>עריכת פריט</h2>
    <form data-form="edit" data-id="${i.id}" style="display:flex;flex-direction:column;gap:12px">
      <div class="field"><label for="en">שם</label><input id="en" name="name" value="${esc(i.name)}" required maxlength="80"></div>
      <div class="row2">
        <div class="field" style="flex:0 0 110px"><label for="eq">כמות</label><input id="eq" name="qty" value="${esc(i.qty)}" maxlength="20"></div>
        <div class="field" style="flex:1"><label for="eo">הערה</label><input id="eo" name="note" value="${esc(i.note)}" maxlength="120" placeholder="מותג, גודל…"></div>
      </div>
      <div style="font-size:13px;color:var(--muted)">נוסף ע״י ${esc(nameOf(i.added_by))} · ${esc(i.category)}</div>
      <button class="btn violet" type="submit">שמירה</button>
    </form>
    <button class="danger" data-act="delete" data-id="${i.id}">מחיקה מהרשימה</button>`);
}

function openSettings() {
  const m = me();
  openSheet(`
    <h2>${esc(S.household.name)}</h2>
    <div class="lead">כדי לצרף את נועה (או כל אחד מהבית): מתקינים את האפליקציה, נכנסים, ובוחרים "הצטרפות לבית" עם הקוד:</div>
    <div class="code">${esc(S.household.invite_code)}</div>
    <button class="btn soft" data-act="share-code">שליחת הקוד בוואטסאפ</button>
    <form data-form="myname" class="row2" style="align-items:flex-end">
      <div class="field" style="flex:1"><label for="mn">השם שלי</label><input id="mn" name="display" value="${esc(m?.display_name || '')}" maxlength="20" required></div>
      <button class="btn violet" type="submit" style="flex:0 0 100px;height:52px;font-size:16px">עדכון</button>
    </form>
    <div style="font-size:13px;color:var(--muted)">מחובר/ת בתור ${esc(S.user.email)}</div>
    <button class="danger" data-act="signout">יציאה מהמשתמש</button>`);
}

/* ---------------- thanks ---------------- */
function showThanks(t) {
  if (S.shownThanks.has(t.id)) return;
  S.shownThanks.add(t.id); LS.set('ha_shown_thanks', [...S.shownThanks].slice(-30));
  const mine = t.shopper_id === S.user.id;
  const mins = t.finished_at ? Math.max(1, Math.round((new Date(t.finished_at) - new Date(t.started_at)) / 60000)) : '';
  const colors = ['#FFD23F', '#FF5C8A', '#12B76A', '#FF7A1A', '#FFFFFF', '#7FE3FF'];
  const conf = Array.from({ length: 40 }, (_, k) =>
    `<i class="conf" aria-hidden="true" style="left:${Math.random() * 100}%;background:${colors[k % 6]};animation-duration:${2.2 + Math.random() * 2.4}s;animation-delay:${Math.random() * .8}s;${k % 3 ? 'height:8px;width:12px' : ''}"></i>`).join('');
  const el = document.createElement('div');
  el.className = 'thanks'; el.setAttribute('role', 'dialog');
  el.innerHTML = `${conf}
    <div class="ok">${I.bigcheck}</div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:6px">
      <div class="k">${mine ? 'הקנייה נסגרה' : 'הקנייה הושלמה'}</div>
      <h1>${mine ? 'כל הכבוד!' : 'תודה ל' + esc(nameOf(t.shopper_id))}</h1>
      <div class="wow">${mine ? 'הבית מסודר' : 'אין עלייך!!!'}</div>
    </div>
    <div class="stats">
      <div><b>${t.bought_count ?? 0}</b><span>פריטים נקנו</span></div>
      <div><b>${t.left_count ?? 0}</b><span>נשארו לפעם הבאה</span></div>
      ${mins ? `<div><b>${mins}′</b><span>זמן בסופר</span></div>` : ''}
    </div>
    <div class="acts">
      ${mine ? '' : `<button class="btn heart" data-th="heart">${I.heart} לשלוח לב ל${esc(nameOf(t.shopper_id))}</button>`}
      <button class="btn back" data-th="close">חזרה לרשימה</button>
    </div>`;
  el.addEventListener('click', e => {
    const b = e.target.closest('[data-th]'); if (!b) return;
    if (b.dataset.th === 'heart') {
      channel?.send({ type: 'broadcast', event: 'heart', payload: { from: S.user.id, to: t.shopper_id } });
      b.textContent = 'נשלח!'; b.disabled = true; setTimeout(() => el.remove(), 900);
    } else el.remove();
  });
  document.body.appendChild(el);
  vibrate([80, 60, 160]);
}

/* ---------------- events ---------------- */
document.addEventListener('click', async e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const act = b.dataset.act;
  if (act === 'backdrop' && e.target !== b) return;
  switch (act) {
    case 'backdrop': closeSheet(); break;
    case 'auth-toggle': S.authMode = S.authMode === 'login' ? 'signup' : 'login'; S.authErr = ''; render(); break;
    case 'toggle': {
      const it = S.items.find(i => i.id === b.dataset.id); if (!it) break;
      const iShop = S.trip && S.trip.shopper_id === S.user.id;
      if (iShop) { vibrate(15); updateItem(it.id, { in_cart: !it.in_cart }); }
      else toggleRemove(it.id);
      break;
    }
    case 'ob': S.onboard = b.dataset.mode || null; S.authErr = ''; render(); break;
    case 'pick-open': openPicker(); break;
    case 'pick-cat': S.picker.cat = b.dataset.cat; refreshPicker(true); break;
    case 'pick-toggle': { const n = b.dataset.name; if (S.picker.sel[n]) delete S.picker.sel[n]; else { S.picker.sel[n] = 1; vibrate(10); } refreshPicker(); break; }
    case 'pick-inc': { const n = b.dataset.name; S.picker.sel[n] = Math.min(99, (S.picker.sel[n] || 0) + 1); refreshPicker(); break; }
    case 'pick-dec': { const n = b.dataset.name; const q = (S.picker.sel[n] || 1) - 1; if (q <= 0) delete S.picker.sel[n]; else S.picker.sel[n] = q; refreshPicker(); break; }
    case 'pick-add': pickerAdd(); break;
    case 'edit': openEdit(b.dataset.id); break;
    case 'delete': closeSheet(); deleteItem(b.dataset.id); break;
    case 'quick': addItem(b.dataset.name); break;
    case 'start': startTrip(); break;
    case 'confirm': openConfirm(false); break;
    case 'finish': finishTrip(); break;
    case 'snooze': snoozeTrip(10); break;
    case 'cancel': cancelTrip(); break;
    case 'cancel-ask': openSheet(`<h2>לבטל את היציאה?</h2><div class="lead">הסימונים בעגלה יתאפסו, והרשימה תישאר כמו שהיא.</div>
      <div class="row2"><button class="btn ghost" data-act="backdrop-close">לא, ממשיכים</button><button class="btn orange" data-act="cancel" style="height:54px;font-size:16px">כן, לבטל</button></div>`); break;
    case 'backdrop-close': closeSheet(); break;
    case 'tab': S.tab = b.dataset.tab; render(); break;
    case 'settings': openSettings(); break;
    case 'share-code': {
      const txt = `הצטרפי אליי לרשימת הקניות שלנו ב"בדרך לסופר" 🛒\nקוד הבית: ${S.household.invite_code}\n${location.origin + location.pathname}`;
      if (navigator.share) { try { await navigator.share({ text: txt }); } catch {} }
      else window.open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank');
      break;
    }
    case 'signout': closeSheet(); await sb.auth.signOut(); break;
  }
});

document.addEventListener('input', e => { if (e.target.id === 'add-input') S.addText = e.target.value; });

document.addEventListener('submit', async e => {
  const f = e.target.closest('form[data-form]'); if (!f) return;
  e.preventDefault();
  const fd = Object.fromEntries(new FormData(f));
  switch (f.dataset.form) {
    case 'add': {
      const v = S.addText.trim(); if (!v) return;
      S.addText = ''; addItem(v);
      document.getElementById('add-input')?.focus();
      break;
    }
    case 'auth': {
      S.busy = true; S.authErr = ''; render();
      const fn = S.authMode === 'signup' ? sb.auth.signUp : sb.auth.signInWithPassword;
      const { data, error } = await fn.call(sb.auth, { email: fd.email.trim(), password: fd.password });
      S.busy = false;
      if (error) S.authErr = hebAuthErr(error);
      else if (S.authMode === 'signup' && !data.session) S.authErr = 'שלחנו לך מייל לאישור. אחרי האישור חוזרים לכאן ונכנסים.';
      render();
      break;
    }
    case 'create': {
      const h = await rpc('create_household', { p_name: fd.house || '', p_display_name: fd.display, p_color: '#5B3DF5' });
      if (h) await safeLoad();
      break;
    }
    case 'join': {
      const h = await rpc('join_household', { p_code: fd.code, p_display_name: fd.display, p_color: '#FF5C8A' });
      if (h) await safeLoad();
      break;
    }
    case 'edit': {
      const name = fd.name.trim(); if (!name) return;
      updateItem(f.dataset.id, { name, qty: fd.qty.trim() || '1', note: fd.note.trim(), category: guessCategory(name) });
      closeSheet();
      break;
    }
    case 'myname': {
      const { error } = await sb.from('members').update({ display_name: fd.display.trim() }).eq('household_id', S.household.id).eq('user_id', S.user.id);
      if (error) toast('לא הצלחתי לעדכן'); else { S.members[S.user.id].display_name = fd.display.trim(); closeSheet(); render(); toast('עודכן'); }
      break;
    }
  }
});

function hebAuthErr(e) {
  const m = e.message || '';
  if (/Invalid login/i.test(m)) return 'אימייל או סיסמה לא נכונים';
  if (/already registered/i.test(m)) return 'המשתמש כבר קיים. נסו "כניסה".';
  if (/Password should/i.test(m)) return 'הסיסמה צריכה להיות לפחות 6 תווים';
  if (/Email not confirmed/i.test(m)) return 'צריך קודם לאשר את המייל שקיבלתם';
  if (/rate limit/i.test(m)) return 'יותר מדי ניסיונות, נסו שוב בעוד כמה דקות';
  return m;
}

/* ---------------- lifecycle ---------------- */
async function safeLoad() {
  try { await loadAll(); } catch (e) { if (!isNetErr(e)) toast('שגיאה בטעינה: ' + (e.message || '')); }
  render();
}

sb.auth.onAuthStateChange((evt, session) => {
  const prevUser = S.user?.id;
  S.session = session; S.user = session?.user || null;
  if (!S.user) { if (channel) { sb.removeChannel(channel); channel = null; } S.household = null; S.booting = false; render(); return; }
  if (prevUser !== S.user.id) {
    loadCache(); S.booting = false; render();
    safeLoad().then(flush);
  }
});

window.addEventListener('online', () => { S.online = true; render(); flush(); safeLoad(); });
window.addEventListener('offline', () => { S.online = false; render(); });
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && S.user) { safeLoad().then(flush); } });

// reminder: when the shopper's 15 minutes are up, ask to confirm the purchase
setInterval(() => {
  if (S.trip && S.user && S.trip.shopper_id === S.user.id) {
    const key = S.trip.id + S.trip.remind_at;
    if (Date.now() >= new Date(S.trip.remind_at).getTime() && S.confirmFor !== key) {
      S.confirmFor = key; vibrate([100, 60, 100]); openConfirm(true);
    }
  }
  if (S.trip && !sheetRoot.innerHTML && !S.removing.size) render(); // keep the minutes counter fresh
}, 15000);

setTimeout(() => { if (S.booting) { S.booting = false; render(); } }, 2500);

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
