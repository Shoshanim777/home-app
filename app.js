import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './config.js';

const sb = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});
const FN_URL = SUPABASE_URL + '/functions/v1/notify';

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
  heart: '<svg width="22" height="22" viewBox="0 0 24 24" fill="#FF5C8A" stroke="#FF5C8A" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
  chat: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12z"/></svg>',
  more: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>',
  bell: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/></svg>',
  stats: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/></svg>',
  send: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11.5 21 4l-7.5 18-2.5-7.5z"/></svg>'
};

/* ---------------- categories ---------------- */
const SNACKS = 'ממתקים וחטיפים';
const CATS = [
  ['מקרר', ['חלב','גבינ','קוטג','יוגורט','שמנת','ביצים','ביצה','חמאה','לבן','מעדן','טופו','גיל','אשל','פודינג','לבנה','שוקו','פטה','קשקבל']],
  ['ירקות ופירות', ['עגבני','מלפפ','בצל','שום','תפוח','בננ','לימון','גזר','חסה','פלפל','אבוקדו','תפוא','תפו"א','תפוחי אדמה','קישוא','חציל','פטרוזיליה','כוסברה','שמיר','נענע','ענב','תות','אבטיח','מלון','אגס','תפוז','קלמנטינ','ברוקולי','כרוב','פטריות','בטטה','סלק','פירות','ירקות','רימון','מנגו','אפרסק','שזיפ','דלעת','תירס','חריף']],
  ['מאפים', ['לחם','פיתה','פיתות','לחמני','חלה','בגט','טורטי','עוגה','קרואסון','בורקס','לאפה']],
  ['בשר ודגים', ['עוף','חזה','בשר','טחון','שניצל','דג','סלמון','נקניק','פרגית','הודו','כרעיים','קרעיים','פולקה','כנפיים','קבב','המבורגר','סטייק','אנטריקוט','פילה']],
  ['מזווה', ['אורז','פסטה','ספגטי','קמח','סוכר','שמן','מלח','פלפל שחור','טחינה','קפה','תה','קורנפלקס','דגני','שימור','רוטב','קטשופ','מיונז','חרדל','דבש','ריבה','חומוס','עדשים','טונה','אגוז','שקדים','קוסקוס','פתיתים','בורגול','קינואה','שיבולת','גרנולה','תבלין','פפריקה','כמון','חומץ','זיתים','מלפפון חמוץ','נוטלה','קקאו','אבקת אפייה','שמרים','וניל','קרקר','פריכיות','ממרח']],
  [SNACKS, ['שוקולד','חטיף','ביסלי','במבה','עוגיות','קינדר','ופל','סוכריות','צ׳יפס','ציפס','דובונים','מסטיק','בייגלה','פופקורן','תפוצ']],
  ['משקאות', ['מים','סודה','קולה','מיץ','בירה','יין','שתייה','פריגת','תפוזינה','נביעות','משקה','ספרייט','רד בול','זירו','אנרגיה']],
  ['קפואים', ['קפוא','גלידה','אפונה','שעועית ירוקה','בצק','פיצה','מלאווח','ג׳חנון','ג\'חנון']],
  ['ניקיון ובית', ['נייר','טואלט','מגבונ','סבון','אקונומיקה','כביסה','כביסכל','מרכך','שקיות','שקית','ספוג','נוזל כלים','טישו','אלומיניום','ניילון','מטליות','סנו','מנקה','פח','נרות','סוללות','נורה','קפסולות','כפפות']],
  ['טיפוח ופארם', ['שמפו','משחת שיניים','מברשת','דאודורנט','תחבושות','חיתול','קרם','סבון ידיים','מרכך שיער','גילוח','צמר גפן','פלסטר','אקמול','ויטמין']]
];
const CAT_ORDER = ['ירקות ופירות','מקרר','מאפים','בשר ודגים','מזווה',SNACKS,'קפואים','משקאות','ניקיון ובית','טיפוח ופארם','אחר'];
const CAT_ICON = { 'ירקות ופירות': '🥕', 'מקרר': '🥛', 'מאפים': '🍞', 'בשר ודגים': '🍗', 'מזווה': '🥫', [SNACKS]: '🍿', 'קפואים': '🧊', 'משקאות': '🥤', 'ניקיון ובית': '🧽', 'טיפוח ופארם': '🧴', 'אחר': '🛒' };

/* built-in product catalog for "בחירה מרשימה" */
const CATALOG = [
  { name: 'ירקות ופירות', items: [['🍅','עגבניות'],['🥒','מלפפונים'],['🧅','בצל'],['🧄','שום'],['🥕','גזר'],['🫑','פלפל'],['🌶️','פלפל ירוק חריף'],['🥬','חסה'],['🥔','תפוחי אדמה'],['🍠','בטטה'],['🥑','אבוקדו'],['🍆','חציל'],['🥦','ברוקולי'],['🍄','פטריות'],['🌿','פטרוזיליה'],['🌿','כוסברה'],['🌿','שמיר'],['🍋','לימון'],['🍌','בננות'],['🍎','תפוחים'],['🍊','תפוזים'],['🍐','אגסים'],['🍇','ענבים'],['🍓','תותים'],['🍒','דובדבנים'],['🍉','אבטיח'],['🥭','מנגו']] },
  { name: 'מקרר', items: [['🥛','חלב'],['🥚','ביצים'],['🧀','גבינה צהובה'],['🧀','גבינה לבנה'],['🧀','גבינת פטה'],['🧀','גבינת קשקבל'],['🥣','קוטג׳'],['🍶','יוגורט'],['🧈','חמאה'],['🥛','שמנת מתוקה'],['🍶','שמנת חמוצה'],['🍮','מעדנים'],['🧀','לבנה'],['🧀','בולגרית'],['🥛','שוקו']] },
  { name: 'מאפים', items: [['🍞','לחם'],['🍞','לחם מחמצת'],['🫓','פיתות'],['🥖','באגט'],['🍞','לחמניות'],['🥯','בייגל'],['🥐','קרואסונים'],['🫓','טורטיות'],['🍞','חלה'],['🍰','עוגה']] },
  { name: 'בשר ודגים', items: [['🍗','חזה עוף'],['🍗','חזה עוף לשניצל'],['🍗','שניצל'],['🍗','כרעיים (פולקה)'],['🍗','פרגיות'],['🥩','בשר טחון'],['🥩','סטייק'],['🍔','המבורגרים'],['🌭','נקניקיות'],['🐟','סלמון'],['🐟','פילה דג'],['🥓','פסטרמה']] },
  { name: 'מזווה', items: [['🍚','אורז'],['🍝','פסטה'],['🍝','ספגטי'],['🌾','קמח'],['🌾','קמח שקדים'],['🍬','סוכר'],['🧂','מלח'],['🧂','פלפל שחור'],['🫒','שמן זית'],['🌻','שמן קנולה'],['☕','קפה'],['🍵','תה'],['🥣','קורנפלקס'],['🥣','גרנולה'],['🥫','טונה'],['🥫','רסק עגבניות'],['🫘','חומוס'],['🫘','עדשים'],['🫙','טחינה'],['🍯','דבש'],['🍓','ריבה'],['🍫','ממרח שוקולד'],['🥜','אגוזים'],['🫒','זיתים'],['🥒','מלפפון חמוץ'],['🍅','קטשופ'],['🥚','מיונז']] },
  { name: SNACKS, items: [['🍫','שוקולד'],['🥚','ביצת קינדר'],['🥜','במבה'],['🥨','ביסלי'],['🍪','עוגיות']] },
  { name: 'קפואים', items: [['🍦','גלידה'],['🍕','פיצה קפואה'],['🥟','בורקס'],['🥞','מלאווח'],['🥦','ירקות קפואים'],['🍟','צ׳יפס קפוא'],['🧊','קרח']] },
  { name: 'משקאות', items: [['💧','מים'],['🫧','סודה'],['🥤','קולה'],['🥤','ספרייט זירו'],['⚡','רד בול ללא סוכר'],['🧃','מיץ'],['🍺','בירה'],['🍷','יין אדום'],['🥂','יין לבן'],['🥛','חלב סויה'],['🥛','חלב שקדים']] },
  { name: 'ניקיון ובית', items: [['🧻','נייר טואלט'],['🧻','מגבות נייר'],['🧻','טישו'],['🧽','ספוגים'],['🧤','כפפות גומי'],['🧴','נוזל כלים'],['🫧','טבליות למדיח'],['🧴','נוזל כביסה (כביסכל)'],['🧺','אבקת כביסה'],['🧴','מרכך כביסה'],['🗑️','שקיות זבל'],['🧼','סבון ידיים'],['🧪','אקונומיקה'],['🧹','מנקה רצפות'],['🧻','מגבונים'],['🔋','סוללות'],['💡','נורות'],['🥡','נייר אפייה'],['🥡','נייר כסף (אלומיניום)']] },
  { name: 'טיפוח ופארם', items: [['🧴','שמפו'],['🧴','מרכך שיער'],['🪥','משחת שיניים'],['🪥','מברשות שיניים'],['🧴','דאודורנט'],['🪒','סכיני גילוח'],['🧴','קרם גוף'],['☀️','קרם הגנה'],['🩹','פלסטרים'],['💊','משככי כאבים'],['🧻','צמר גפן']] }
];
const CATALOG_MAP = new Map();
for (const c of CATALOG) for (const [emo, n] of c.items) CATALOG_MAP.set(n, { emo, cat: c.name });
const CUSTOM_TAB = 'שלנו';

/* ---------------- state ---------------- */
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
const S = {
  booting: true, session: null, user: null,
  household: null, members: {}, items: [], trip: null, messages: [], custom: [], prices: {}, stats: null,
  outbox: LS.get('ha_outbox', []), online: navigator.onLine,
  tab: 'list', authMode: 'login', authErr: '', busy: false,
  addText: '', history: LS.get('ha_history', {}),
  shownThanks: new Set(LS.get('ha_shown_thanks', [])), confirmFor: null,
  removing: new Map(), onboard: null, picker: null, sheetKind: null, orderDraft: null,
  lastRead: 0, pushPerm: 'default', pushDismissed: LS.get('ha_push_dismissed', false)
};
const REMOVE_MS = 3000;
let channel = null;

/* product lookups: our own products first, then the built-in catalog */
let customMap = new Map(), MATCH_KEYS = [];
function rebuildProducts() {
  customMap = new Map(S.custom.map(c => [c.name, { emo: c.emoji, cat: c.category }]));
  MATCH_KEYS = [...new Set([...customMap.keys(), ...CATALOG_MAP.keys()])].sort((a, b) => b.length - a.length);
}
rebuildProducts();
const productInfo = n => customMap.get(n) || CATALOG_MAP.get(n) || null;
// longest name first, so "שוקולד מריר" matches "שוקולד" and never "שוקו"
function catalogMatch(name) {
  const n = name.replace(/\s+/g, ' ').trim();
  const exact = productInfo(n); if (exact) return exact;
  const k = MATCH_KEYS.find(k => n.startsWith(k + ' ') || k.startsWith(n + ' '));
  return k ? productInfo(k) : null;
}
function guessCategory(name) {
  const m = catalogMatch(name); if (m) return m.cat;
  const n = name.replace(/\s+/g, ' ').trim();
  let best = null, len = 0;
  for (const [cat, words] of CATS) for (const w of words) if (w.length > len && n.includes(w)) { best = cat; len = w.length; }
  return best || 'אחר';
}
const iconFor = (name, category) => catalogMatch(name)?.emo || CAT_ICON[category] || '🛒';
function catOrder() {
  const saved = (S.household?.category_order || []).filter(c => CAT_ORDER.includes(c));
  return [...saved, ...CAT_ORDER.filter(c => !saved.includes(c))];
}

function saveCache() {
  if (!S.user) return;
  LS.set('ha_cache_' + S.user.id, { household: S.household, members: S.members, items: S.items, trip: S.trip, messages: S.messages.slice(-60), custom: S.custom, prices: S.prices });
}
function loadCache() {
  const c = LS.get('ha_cache_' + S.user.id, null);
  if (c) Object.assign(S, { household: c.household, members: c.members || {}, items: c.items || [], trip: c.trip, messages: c.messages || [], custom: c.custom || [], prices: c.prices || {} });
  S.lastRead = LS.get('ha_lastread_' + S.user.id, 0);
  rebuildProducts();
}

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const me = () => S.members[S.user?.id];
const nameOf = id => S.members[id]?.display_name || 'מישהו';
const colorOf = id => S.members[id]?.color || '#9A98B0';
const initial = id => (nameOf(id) || '?').trim().charAt(0);
const superItems = () => S.items.filter(i => i.list === 'super');
const minsSince = t => Math.max(0, Math.round((Date.now() - new Date(t).getTime()) / 60000));
const iShop = () => !!(S.trip && S.user && S.trip.shopper_id === S.user.id);
const others = () => Object.values(S.members).filter(m => m.user_id !== S.user?.id);
const othersName = () => { const o = others().map(m => m.display_name); return o.length ? o.join(' ו') : 'בני הבית'; };
const unread = () => S.messages.filter(m => m.sender_id !== S.user?.id && new Date(m.created_at).getTime() > S.lastRead).length;
const ILS = n => '₪' + Number(n).toLocaleString('he-IL', { minimumFractionDigits: Number(n) % 1 ? 2 : 0, maximumFractionDigits: 2 });
const qtyNum = q => /^\d+$/.test(q || '1') ? parseInt(q || '1', 10) : 1;
const priceOf = name => S.prices[name]?.price ?? null;
function basket(items) {
  let sum = 0, known = 0;
  for (const i of items) { const p = priceOf(i.name); if (p != null) { sum += p * qtyNum(i.qty); known++; } }
  return { sum: Math.round(sum * 100) / 100, known, total: items.length };
}
function parsePrice(v) { const n = parseFloat(String(v || '').replace(/[^\d.,]/g, '').replace(',', '.')); return Number.isFinite(n) && n > 0 && n < 100000 ? Math.round(n * 100) / 100 : null; }
async function setPrice(name, price) {
  if (price == null || priceOf(name) === price) return;
  S.prices[name] = { price, updated_at: new Date().toISOString() };
  saveCache(); render();
  const { error } = await sb.from('price_history').insert({ household_id: S.household.id, name, price, recorded_by: S.user.id });
  if (error) { console.warn(error); toast('המחיר לא נשמר'); }
}
const hhmm = t => new Date(t).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });

function toast(msg, ms = 3200) {
  const el = document.createElement('div');
  el.className = 'toast'; el.textContent = msg;
  document.getElementById('toast-root').appendChild(el);
  setTimeout(() => el.remove(), ms);
}
function vibrate(p) { try { navigator.vibrate && navigator.vibrate(p); } catch {} }

/* ---------------- push notifications ---------------- */
const pushSupported = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
async function notifyOnce(action, extra) {
  const { data } = await sb.auth.getSession();
  const tok = data.session?.access_token; if (!tok) throw new Error('no session');
  const r = await fetch(FN_URL, { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json', apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: 'Bearer ' + tok }, body: JSON.stringify({ action, ...extra }) });
  if (!r.ok && r.status >= 500) throw new Error('notify ' + r.status);
  return await r.json().catch(() => ({}));
}
async function notify(action, extra = {}) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try { return await notifyOnce(action, extra); }
    catch (e) { console.warn('notify failed', action, e); await new Promise(r => setTimeout(r, 2000 * (attempt + 1))); }
  }
  // still failing (no reception): keep it and send when the connection comes back
  if (action !== 'test') { const q = LS.get('ha_pending_notify', []); q.push({ action, extra, at: Date.now() }); LS.set('ha_pending_notify', q.slice(-20)); }
  return null;
}
async function flushPendingNotify() {
  const q = LS.get('ha_pending_notify', []); if (!q.length) return;
  LS.set('ha_pending_notify', []);
  for (const n of q) if (Date.now() - n.at < 3 * 3600e3) { try { await notifyOnce(n.action, n.extra); } catch { } }
}
// items added within a few seconds go out as one notification
let notifyIds = new Set(), notifyTimer = null;
function notifyItemLater(id) {
  notifyIds.add(id); clearTimeout(notifyTimer);
  notifyTimer = setTimeout(() => { const ids = [...notifyIds]; notifyIds = new Set(); notify('items', { ids }); }, 4000);
}
function b64u(s) { const p = '='.repeat((4 - s.length % 4) % 4); const b = atob((s + p).replace(/-/g, '+').replace(/_/g, '/')); return Uint8Array.from(b, c => c.charCodeAt(0)); }
async function subscribePush() {
  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    const { publicKey } = await fetch(FN_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: SUPABASE_PUBLISHABLE_KEY }, body: JSON.stringify({ action: 'vapid' }) }).then(r => r.json());
    sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64u(publicKey) });
  }
  const j = sub.toJSON();
  const { error } = await sb.from('push_subscriptions').upsert({ endpoint: j.endpoint, user_id: S.user.id, p256dh: j.keys.p256dh, auth: j.keys.auth }, { onConflict: 'endpoint' });
  if (error) throw error;
}
async function enablePush() {
  if (!pushSupported()) { toast('הדפדפן הזה לא תומך בהתראות'); return; }
  const p = await Notification.requestPermission();
  S.pushPerm = p;
  if (p !== 'granted') { toast('ההתראות לא אושרו'); refreshOpenSheet(); render(); return; }
  try { await subscribePush(); toast('ההתראות הופעלו 🔔'); }
  catch (e) { console.warn(e); toast('לא הצלחתי להפעיל התראות, נסו שוב'); }
  refreshOpenSheet(); render();
}
async function ensurePush() {
  S.pushPerm = pushSupported() ? Notification.permission : 'unsupported';
  if (S.pushPerm === 'granted') { try { await subscribePush(); } catch (e) { console.warn('push resubscribe', e); } }
  render();
}
async function clearNotifications() {
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    (await reg?.getNotifications())?.forEach(n => n.close());
    if (navigator.clearAppBadge) await navigator.clearAppBadge();
  } catch {}
}

/* ---------------- data ---------------- */
async function loadAll() {
  const { data: mem, error: e1 } = await sb.from('members').select('household_id, user_id, display_name, color').eq('user_id', S.user.id).limit(1);
  if (e1) throw e1;
  if (!mem || !mem.length) { Object.assign(S, { household: null, members: {}, items: [], trip: null, messages: [], custom: [] }); saveCache(); return; }
  const hid = mem[0].household_id;
  const since = new Date(Date.now() - 48 * 3600e3).toISOString();
  const [h, m, it, tr, ms, cp, pp] = await Promise.all([
    sb.from('households').select('*').eq('id', hid).single(),
    sb.from('members').select('user_id, display_name, color').eq('household_id', hid),
    sb.from('items').select('*').eq('household_id', hid).order('created_at'),
    sb.from('trips').select('*').eq('household_id', hid).eq('status', 'active').maybeSingle(),
    sb.from('messages').select('*').eq('household_id', hid).gte('created_at', since).order('created_at').limit(200),
    sb.from('custom_products').select('*').eq('household_id', hid).order('name'),
    sb.from('product_prices').select('name, price, updated_at').eq('household_id', hid)
  ]);
  for (const r of [h, m, it, tr, ms, cp]) if (r.error) throw r.error;
  if (!pp.error) S.prices = Object.fromEntries(pp.data.map(x => [x.name, { price: Number(x.price), updated_at: x.updated_at }]));
  S.household = h.data;
  S.members = Object.fromEntries(m.data.map(x => [x.user_id, x]));
  S.items = mergePending(it.data);
  S.trip = tr.data || null;
  const pendingMsgs = S.messages.filter(x => x._pending);
  S.messages = [...ms.data, ...pendingMsgs.filter(p => !ms.data.some(x => x.id === p.id))];
  S.custom = cp.data; rebuildProducts();
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

let rtHealthy = false, rtRetry = null;
function subscribe(force = false) {
  if (!S.household) return;
  if (channel && rtHealthy && !force && channel.__hid === S.household.id) return;
  if (channel) { sb.removeChannel(channel); channel = null; }
  rtHealthy = false;
  const hid = S.household.id;
  const f = 'household_id=eq.' + hid;
  channel = sb.channel('hh-' + hid, { config: { broadcast: { self: false } } })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'items', filter: f }, onItem)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'trips', filter: f }, onTrip)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: f }, onMessage)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'custom_products', filter: f }, onCustom)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'product_prices', filter: f }, ({ new: n }) => {
      if (n?.name) { S.prices[n.name] = { price: Number(n.price), updated_at: n.updated_at }; saveCache(); render(); }
    })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'households', filter: 'id=eq.' + hid }, ({ new: n }) => { S.household = { ...S.household, ...n }; saveCache(); render(); })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'members', filter: f }, async () => {
      const { data } = await sb.from('members').select('user_id, display_name, color').eq('household_id', hid);
      if (data) { S.members = Object.fromEntries(data.map(x => [x.user_id, x])); render(); }
    })
    .on('broadcast', { event: 'heart' }, ({ payload }) => {
      if (payload?.to === S.user.id) { vibrate([60, 40, 60]); toast(nameOf(payload.from) + ' שלח/ה לך לב ❤'); }
    })
    .subscribe(status => {
      if (status === 'SUBSCRIBED') { const was = rtHealthy; rtHealthy = true; if (was === false && S.household) refreshLive(); }
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
        rtHealthy = false; clearTimeout(rtRetry);
        rtRetry = setTimeout(() => { if (S.user && S.household && navigator.onLine) subscribe(true); }, 3000);
      }
    });
  channel.__hid = hid;
}

function onItem({ eventType, new: n, old: o }) {
  if (eventType === 'DELETE') {
    S.items = S.items.filter(i => i.id !== o.id);
  } else {
    const idx = S.items.findIndex(i => i.id === n.id);
    const isNew = idx === -1;
    if (isNew) S.items.push(n); else S.items[idx] = { ...n };
    if (isNew && eventType === 'INSERT' && n.added_by !== S.user.id && iShop()) {
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
    if (!was && n.shopper_id !== S.user.id) { vibrate([80, 60, 80]); showTripBanner(n); }
  } else {
    if (S.trip && S.trip.id === n.id) S.trip = null;
    if (n.status === 'done') showThanks(n);
    if (n.status === 'cancelled' && n.shopper_id !== S.user.id) toast('היציאה לסופר של ' + nameOf(n.shopper_id) + ' בוטלה');
  }
  saveCache(); render();
}

function onMessage({ new: n }) {
  if (S.messages.some(m => m.id === n.id)) { const m = S.messages.find(x => x.id === n.id); delete m._pending; refreshChat(); return; }
  S.messages.push(n);
  if (n.sender_id !== S.user.id) {
    vibrate([60, 40, 60]);
    if (S.sheetKind === 'chat') markRead(); else showBanner(n);
  }
  saveCache(); refreshChat(); render();
}

async function onCustom() {
  const { data } = await sb.from('custom_products').select('*').eq('household_id', S.household.id).order('name');
  if (data) { S.custom = data; rebuildProducts(); saveCache(); if (S.sheetKind === 'picker') refreshPicker(); render(); }
}

/* ---------------- outbox (offline-safe item writes) ---------------- */
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
      } else if (op.op === 'insert' && op.row.added_by === S.user.id) notifyItemLater(op.row.id);
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

/* ---------------- messages ---------------- */
function msgText(m) {
  if (m.kind === 'oos') return 'לא היה במלאי' + (m.body ? ' · ' + m.body : '');
  if (m.kind === 'sub') return 'לקחתי במקום: ' + m.body;
  return m.body;
}
async function sendMessage({ kind = 'text', body = '', item = null }) {
  const row = { id: crypto.randomUUID(), household_id: S.household.id, sender_id: S.user.id, kind, body: body.trim().slice(0, 300), item_id: item?.id || null, item_name: item?.name || '' };
  S.messages.push({ ...row, created_at: new Date().toISOString(), _pending: true });
  refreshChat(); render();
  const { error } = await sb.from('messages').insert(row);
  if (error) {
    S.messages = S.messages.filter(m => m.id !== row.id);
    toast(isNetErr(error) ? 'אין חיבור, ההודעה לא נשלחה' : 'ההודעה לא נשלחה');
    refreshChat(); render(); return false;
  }
  const m = S.messages.find(x => x.id === row.id); if (m) delete m._pending;
  saveCache(); refreshChat();
  return true;
}
function markRead() {
  S.lastRead = Date.now(); LS.set('ha_lastread_' + S.user.id, S.lastRead);
  document.getElementById('banner')?.remove();
  render();
}
function showBanner(m) {
  document.getElementById('banner')?.remove();
  const el = document.createElement('button');
  el.id = 'banner'; el.className = 'banner-top'; el.dataset.act = 'chat';
  el.innerHTML = `<span class="av" style="background:${colorOf(m.sender_id)}">${esc(initial(m.sender_id))}</span>
    <span class="bt"><b>${esc(nameOf(m.sender_id))}${m.item_name ? ' · ' + iconFor(m.item_name) + ' ' + esc(m.item_name) : ''}</b><span>${esc(msgText(m))}</span></span>
    <span class="reply">תשובה</span>`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 8000);
}

function showInfoBanner({ title, body, avatarOf, persistent = false, act = '' }) {
  document.getElementById('banner')?.remove();
  const el = document.createElement('div');
  el.id = 'banner'; el.className = 'banner-top info';
  el.innerHTML = `${avatarOf ? `<span class="av" style="background:${colorOf(avatarOf)}">${esc(initial(avatarOf))}</span>` : ''}
    <button class="bt" ${act ? `data-act="${act}"` : 'data-act="banner-close"'}><b>${esc(title)}</b>${body ? `<span>${esc(body)}</span>` : ''}</button>
    <button class="b-x" data-act="banner-close" aria-label="סגירה">${I.x}</button>`;
  document.body.appendChild(el);
  if (!persistent) setTimeout(() => el.remove(), 8000);
}
function showTripBanner(t) {
  showInfoBanner({ title: `🟠 ${nameOf(t.shopper_id)} בדרך לסופר`, body: 'עכשיו הזמן להוסיף מה שחסר', avatarOf: t.shopper_id, persistent: true });
}

/* the shopper's "done shopping?" prompt opens by itself only once per reminder time, even across reloads */
function maybePromptConfirm() {
  if (!iShop()) return;
  const key = S.trip.id + '|' + S.trip.remind_at;
  if (Date.now() < new Date(S.trip.remind_at).getTime()) return;
  if (LS.get('ha_prompted', '') === key) return;
  LS.set('ha_prompted', key);
  if (!sheetRoot.innerHTML) { vibrate([100, 60, 100]); openConfirm(true); }
}
const reminderDue = () => iShop() && Date.now() >= new Date(S.trip.remind_at).getTime();

/* a push arrived while the app is on screen: the live connection may have dropped, so reload and show it */
async function onForegroundPush(p) {
  await refreshLive(true);
  if (p.kind === 'remind') { maybePromptConfirm(); return; }
  if (p.kind === 'trip' && S.trip && S.trip.shopper_id !== S.user.id) { showTripBanner(S.trip); return; }
  if (p.kind === 'thanks' || p.kind === 'test') { if (p.kind === 'test') toast(p.title + ' · ' + p.body); return; }
  if (p.title) { vibrate(80); showInfoBanner({ title: p.title, body: p.body, act: p.kind === 'message' ? 'chat' : '' }); }
}

/* light refresh of the live parts (items, trip, messages) without resubscribing */
let refreshing = false;
async function refreshLive(quiet = false) {
  if (refreshing || !S.household || !S.user || !navigator.onLine) return;
  refreshing = true;
  try {
    const hid = S.household.id;
    const since = new Date(Date.now() - 48 * 3600e3).toISOString();
    const [it, tr, ms] = await Promise.all([
      sb.from('items').select('*').eq('household_id', hid).order('created_at'),
      sb.from('trips').select('*').eq('household_id', hid).eq('status', 'active').maybeSingle(),
      sb.from('messages').select('*').eq('household_id', hid).gte('created_at', since).order('created_at').limit(200)
    ]);
    if (it.error || tr.error || ms.error) return;
    const before = new Set(S.items.map(i => i.id));
    S.items = mergePending(it.data);
    const fresh = S.items.filter(i => !before.has(i.id) && i.added_by !== S.user.id);
    if (fresh.length && iShop() && !quiet) { vibrate(120); toast(nameOf(fresh[0].added_by) + ' הוסיפ/ה: ' + fresh.map(i => i.name).join(', ')); }
    const hadTrip = S.trip;
    S.trip = tr.data || null;
    if (!hadTrip && S.trip && S.trip.shopper_id !== S.user.id) showTripBanner(S.trip);
    const knownMsg = new Set(S.messages.map(m => m.id));
    const pending = S.messages.filter(m => m._pending);
    S.messages = [...ms.data, ...pending.filter(p => !ms.data.some(x => x.id === p.id))];
    const newMsg = ms.data.filter(m => !knownMsg.has(m.id) && m.sender_id !== S.user.id);
    if (newMsg.length && S.sheetKind !== 'chat' && !quiet) showBanner(newMsg[newMsg.length - 1]);
    saveCache(); refreshChat(); render();
  } finally { refreshing = false; }
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
function resetCartLocally() {
  S.items.forEach(i => {
    if (i.list !== 'super') return;
    i.in_cart = false;
    if (i.status === 'sub') { i.status = null; i.status_note = ''; }
  });
}
async function startTrip() {
  await flush();
  const t = await rpc('start_trip', { p_household: S.household.id, p_minutes: 15 });
  if (t) { S.trip = t; resetCartLocally(); vibrate(60); saveCache(); render(); }
}
async function finishTrip(total = null) {
  closeSheet();
  await flush();
  const t = await rpc('finish_trip', { p_trip: S.trip.id, p_total: total });
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
  if (t) { S.trip = null; resetCartLocally(); saveCache(); render(); }
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
  let sub;
  if (rem) sub = '<span class="note">נמחק · לחיצה על ✓ מבטלת</span>';
  else if (i.status === 'sub') sub = `<span class="note subn">🔄 במקום זה: ${esc(i.status_note)}</span>`;
  else if (i.note) sub = `<span class="note">${esc(i.note)}</span>`;
  else sub = '';
  const numeric = /^\d+$/.test(i.qty || '1');
  const qtyEl = tripMode
    ? (i.qty && i.qty !== '1' ? `<span class="qty">${esc(i.qty)}</span>` : '')
    : `<button class="qty ${i.qty === '1' ? 'one' : ''}" data-act="${numeric ? 'qty-inc' : 'edit'}" data-id="${i.id}" aria-label="כמות ${esc(i.qty)}${numeric ? ', לחיצה להוספת אחד' : ''}">${numeric && i.qty === '1' ? '+1' : esc(i.qty)}</button>`;
  const p = priceOf(i.name);
  let priceEl = '';
  if (tripMode && i.in_cart) priceEl = `<button class="price ${p == null ? 'unknown' : ''}" data-act="price" data-id="${i.id}" aria-label="מחיר ${esc(i.name)}">${p == null ? '+₪' : ILS(p)}</button>`;
  else if (p != null && !rem) priceEl = `<span class="price-t">${ILS(p * qtyNum(i.qty))}</span>`;
  return `<div class="row ${done ? 'done' : ''} ${rem ? 'removing' : ''} ${i._pending ? 'pending' : ''} ${i.status === 'oos' ? 'oos' : ''}"${remStyle}>
    <button class="check" data-act="toggle" data-id="${i.id}" aria-label="${label}: ${esc(i.name)}" aria-pressed="${done}" ${locked ? 'disabled' : ''}>${I.check}</button>
    <span class="emo" aria-hidden="true">${iconFor(i.name, i.category)}</span>
    <button class="main" data-act="edit" data-id="${i.id}">
      <span class="name">${esc(i.name)}</span>${sub}
    </button>
    ${i.status === 'oos' && !rem ? '<span class="tag oos">לא היה במלאי</span>' : ''}
    ${tripMode && newInTrip ? '<span class="new">חדש</span>' : ''}
    ${priceEl}
    ${qtyEl}
    ${tripMode ? `<button class="more" data-act="item-more" data-id="${i.id}" aria-label="אפשרויות עבור ${esc(i.name)}">${I.more}</button>`
               : `<span class="av sm" style="background:${colorOf(i.added_by)}" title="${esc(nameOf(i.added_by))}">${esc(initial(i.added_by))}</span>`}
  </div>`;
}

function chatButton() {
  const n = unread();
  return `<button class="chatbtn" data-act="chat" aria-label="הודעות${n ? ', ' + n + ' חדשות' : ''}">${I.chat}${n ? `<span class="badge">${n}</span>` : ''}</button>`;
}

function renderMain() {
  const items = superItems();
  const trip = S.trip;
  const shopping = iShop();
  const open = items.filter(i => !i.in_cart).length;
  const inCart = items.filter(i => i.in_cart).length;
  const memberList = Object.values(S.members);
  const order = catOrder();
  const cartB = basket(items.filter(i => i.in_cart));
  const listB = basket(items.filter(i => !i.in_cart));

  let body = '';
  if (S.tab === 'stats') {
    body = renderStats();
  } else if (S.tab === 'family') {
    body = `<div class="top"><div><div class="sub">${esc(S.household.name)}</div><h1>חדר משפחה</h1></div>${chatButton()}</div>
      <div class="empty">כאן יהיו בקשות ("מישהו יכול להביא...") ורשימות נוספות:<br>בית מרקחת, תיקונים בבית, מתנות.<br><b>מגיע בגרסה 2.</b></div>`;
  } else {
    const header = `<div class="top">
      <div><div class="sub">${esc(S.household.name)}</div><h1>רשימת הסופר</h1></div>
      <div class="top-acts">${chatButton()}
      <button class="avatars" data-act="settings" aria-label="הגדרות הבית">${memberList.map(m => `<span class="av" style="background:${m.color}">${esc(m.display_name.charAt(0))}</span>`).join('')}</button></div>
    </div>`;

    let status;
    if (shopping) {
      status = `<div class="hero">
        <div class="lamp on">${I.bulb}</div>
        <div class="t1">את/ה בדרך לסופר</div>
        <div class="t2">${minsSince(trip.started_at)} דק׳ · ${inCart} מתוך ${items.length} בעגלה${cartB.known ? ' · בעגלה כ־' + ILS(cartB.sum) : ''}</div>
        ${reminderDue() ? `<button class="due" data-act="confirm">⏰ עברו ${minsSince(trip.started_at)} דק׳ · לסיים את הקנייה?</button>` : `<div class="t3">חסר משהו? ⋯ ליד המוצר: "לא היה", "לקחתי משהו אחר" או שאלה</div>`}
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
        <div class="t2">${open ? open + ' פריטים מחכים לקנייה' : 'הרשימה ריקה. מה חסר?'}${listB.known ? ` · סל משוער ${ILS(listB.sum)}${listB.known < listB.total ? ` <span class="muted">(${listB.known}/${listB.total} עם מחיר)</span>` : ''}` : ''}</div></div>
      </div>`;
    }

    let pushCard = '';
    if (S.pushPerm === 'default' && !S.pushDismissed) {
      pushCard = `<div class="pushcard"><span class="pc-i" aria-hidden="true">${I.bell}</span>
        <span class="pc-t"><b>להפעיל התראות?</b><small>כדי לדעת כש${esc(othersName())} מוסיפ/ה משהו, יוצא/ת לסופר או שולח/ת הודעה</small></span>
        <button class="pc-go" data-act="push-enable">הפעלה</button>
        <button class="pc-x" data-act="push-dismiss" aria-label="לא עכשיו">${I.x}</button></div>`;
    }

    const histChips = Object.entries(S.history)
      .filter(([n]) => !items.some(i => i.name === n))
      .sort((a, b) => b[1] - a[1]).slice(0, 5)
      .map(([n]) => `<button class="chip" data-act="quick" data-name="${esc(n)}">+ ${esc(n)}</button>`).join('');

    const add = `<form class="add" data-form="add">
        ${I.plus}
        <input id="add-input" type="text" placeholder="${trip && !shopping ? 'להוסיף ברגע האחרון…' : 'מה חסר? למשל: חלב ×2, תנובה'}" aria-label="הוספת פריט" autocomplete="off" enterkeyhint="done" value="${esc(S.addText)}">
        <button class="go" type="submit">הוספה</button>
      </form>
      <div class="chips"><button class="chip pick" data-act="pick-open">${I.grid} בחירה מרשימה</button>${histChips}</div>`;

    let list;
    if (!items.length) {
      list = `<div class="empty">אין כלום ברשימה.<br>כשמשהו נגמר, כותבים אותו כאן<br>ו${esc(memberList.filter(m => m.user_id !== S.user.id).map(m => m.display_name)[0] || 'כולם')} רואה מיד.</div>`;
    } else if (shopping) {
      const rank = i => i.in_cart ? 2 : i.status === 'oos' ? 1 : 0;
      const sorted = [...items].sort((a, b) => (rank(a) - rank(b)) || order.indexOf(a.category) - order.indexOf(b.category));
      list = `<div class="list"><div class="card">${sorted.map(i => itemRow(i, true)).join('')}</div></div>`;
    } else {
      const groups = {};
      for (const i of items) (groups[i.category] ||= []).push(i);
      list = `<div class="list">${order.filter(c => groups[c]).map(c => `
        <div><div class="group-name">${esc(c)}</div>
        <div class="card">${groups[c].sort((a, b) => a.in_cart - b.in_cart).map(i => itemRow(i, false)).join('')}</div></div>`).join('')}</div>`;
    }

    let fab;
    if (shopping) {
      fab = `<div class="fab">
        <button class="btn green" data-act="confirm" ${S.busy ? 'disabled' : ''}>סיימתי לקנות</button>
        <button class="btn icon" data-act="cancel-ask" aria-label="ביטול היציאה לסופר">${I.x}</button>
      </div>`;
    } else if (!trip) {
      fab = `<div class="fab"><button class="btn orange" data-act="start" ${S.busy ? 'disabled' : ''}>${I.cart} אני בדרך לסופר</button></div>`;
    } else fab = '';

    const offline = !S.online ? `<div class="offline">אין חיבור כרגע · השינויים יישמרו וישתלחו כשהקליטה תחזור</div>` : '';
    const shopHeader = `<div class="top" style="padding-bottom:0"><h1 style="font-size:22px">רשימת הסופר</h1>${chatButton()}</div>`;
    body = (shopping ? shopHeader : header) + offline + status + pushCard + add + list + fab;
  }

  const nav = `<nav class="tabs">
    <button class="${S.tab === 'list' ? 'active' : ''}" data-act="tab" data-tab="list">${I.list} סופר</button>
    <button class="${S.tab === 'stats' ? 'active' : ''}" data-act="tab" data-tab="stats">${I.stats} סטטיסטיקה</button>
    <button class="${S.tab === 'family' ? 'active' : ''}" data-act="tab" data-tab="family">${I.home} <span>משפחה <span class="soon">בקרוב</span></span></button>
    <button data-act="settings">${I.gear} הגדרות</button>
  </nav>`;
  return `<div class="screen ${S.trip && S.tab === 'list' ? 'trip' : ''}">${body}</div>${nav}`;
}

/* ---------------- sheets ---------------- */
const sheetRoot = document.getElementById('sheet-root');
function openSheet(html, cls = '', kind = 'sheet') {
  S.sheetKind = kind;
  sheetRoot.innerHTML = `<div class="backdrop" data-act="backdrop"><div class="sheet ${cls}" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div></div>`;
}
function setSheet(html) { const s = sheetRoot.querySelector('.sheet'); if (s) s.innerHTML = '<div class="grab"></div>' + html; }
function closeSheet() { sheetRoot.innerHTML = ''; S.picker = null; S.sheetKind = null; S.orderDraft = null; }
function refreshOpenSheet() { if (S.sheetKind === 'settings') setSheet(settingsHtml()); }
const sheetHead = title => `<div class="pk-head"><h2>${title}</h2><button class="pk-x" data-act="backdrop-close" aria-label="סגירה">${I.x}</button></div>`;

/* ---- "בחירה מרשימה" picker ---- */
function pickerTabs() {
  return [{ name: CUSTOM_TAB, icon: '⭐', items: S.custom.map(c => [c.emoji, c.name, c.id]) },
    ...CATALOG.map(c => ({ name: c.name, icon: CAT_ICON[c.name], items: c.items }))];
}
function openPicker() {
  S.picker = { cat: S.custom.length ? CUSTOM_TAB : CATALOG[0].name, sel: {} };
  openSheet(pickerHtml(), 'tall', 'picker');
}
function pickerHtml() {
  const P = S.picker;
  const tabs = pickerTabs();
  const cat = tabs.find(c => c.name === P.cat) || tabs[1];
  const inList = new Set(superItems().filter(i => !S.removing.has(i.id)).map(i => i.name));
  const count = Object.keys(P.sel).length;
  const selIn = c => c.items.filter(([, n]) => P.sel[n]).length;
  const isOurs = cat.name === CUSTOM_TAB;
  const rows = cat.items.map(([emo, name, cid]) => {
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
      ${isOurs && !q ? `<button class="pk-del" data-act="custom-del" data-id="${cid}" aria-label="הסרת ${esc(name)} מהמוצרים שלנו">${I.x}</button>` : ''}
    </div>`;
  }).join('');
  const oursTop = isOurs ? `<form class="pk-new" data-form="custom-add">
      <input name="name" maxlength="60" required placeholder="מוצר שלא מופיע ברשימות…" aria-label="שם מוצר חדש" autocomplete="off">
      <button type="submit">⭐ שמירה</button></form>
      ${cat.items.length ? '' : '<div class="pk-empty">כאן נשמרים המוצרים שלכם, אלה שלא מופיעים בלשוניות האחרות.<br>כותבים שם ושומרים, והם יופיעו גם אצל ' + esc(othersName()) + '.</div>'}` : '';
  return `${sheetHead('בחירה מרשימה')}
    <div class="pk-tabs" id="pk-tabs">${tabs.map(c => `<button class="pk-tab ${c.name === cat.name ? 'on' : ''}" data-act="pick-cat" data-cat="${esc(c.name)}"><span aria-hidden="true">${c.icon}</span> ${esc(c.name === CUSTOM_TAB ? 'המוצרים שלנו' : c.name)}${selIn(c) ? `<b>${selIn(c)}</b>` : ''}</button>`).join('')}</div>
    <div class="pk-list" id="pk-list">${oursTop}${rows}</div>
    <button class="btn violet" data-act="pick-add" ${count ? '' : 'disabled'}>${count ? `הוספה לרשימה (${count})` : 'בוחרים מוצרים ומוסיפים'}</button>`;
}
function refreshPicker(resetScroll) {
  if (!S.picker) return;
  const top = resetScroll ? 0 : (document.getElementById('pk-list')?.scrollTop || 0);
  const left = document.getElementById('pk-tabs')?.scrollLeft || 0;
  setSheet(pickerHtml());
  document.getElementById('pk-list').scrollTop = top;
  document.getElementById('pk-tabs').scrollLeft = left;
}
function pickerAdd() {
  const P = S.picker; let n = 0;
  for (const [name, q] of Object.entries(P.sel)) {
    const r = addRow({ name, qty: String(q), category: productInfo(name)?.cat });
    if (r !== 'dup') n++;
  }
  closeSheet(); saveCache(); render();
  if (n) { vibrate(20); toast(`נוספו ${n} מוצרים לרשימה`); }
}
async function saveCustomProduct(rawName) {
  const name = rawName.replace(/\s+/g, ' ').trim().slice(0, 60); if (!name) return false;
  if (productInfo(name)) { toast(name + ' כבר נמצא ברשימות'); return false; }
  const category = guessCategory(name);
  const row = { household_id: S.household.id, name, emoji: iconFor(name, category), category, created_by: S.user.id };
  const { data, error } = await sb.from('custom_products').insert(row).select().single();
  if (error) { toast(/duplicate|unique/i.test(error.message) ? name + ' כבר במוצרים שלנו' : 'לא הצלחתי לשמור'); return false; }
  if (!S.custom.some(c => c.id === data.id)) S.custom.push(data);
  S.custom.sort((a, b) => a.name.localeCompare(b.name, 'he')); rebuildProducts(); saveCache();
  toast('⭐ ' + name + ' נשמר במוצרים שלנו');
  return true;
}

/* ---- personal messages ---- */
const QUICK = ['👍 קיבלתי', 'אפשר לקחת מה שיש', 'לא צריך, תודה', '❤️'];
function bubble(m) {
  const mine = m.sender_id === S.user.id;
  const icon = { oos: '❌', sub: '🔄', ask: '❓' }[m.kind] || '';
  return `<div class="bubble ${mine ? 'me' : ''} ${m._pending ? 'pending' : ''}">
    ${mine ? '' : `<div class="b-who" style="color:${colorOf(m.sender_id)}">${esc(nameOf(m.sender_id))}</div>`}
    ${m.item_name ? `<div class="b-item">${icon} ${iconFor(m.item_name)} ${esc(m.item_name)}</div>` : ''}
    <div class="b-text">${esc(msgText(m))}</div>
    <div class="b-time">${m._pending ? 'שולח…' : hhmm(m.created_at)}</div>
  </div>`;
}
function chatHtml() {
  return `${sheetHead('הודעות')}
    <div class="bubbles" id="chat-list">${S.messages.length ? S.messages.map(bubble).join('')
      : `<div class="pk-empty">עוד אין הודעות.<br>אפשר לכתוב ל${esc(othersName())} משהו קצר,<br>למשל "אין קוטג׳ 5%, לקחתי 3%".</div>`}</div>
    <div class="qr">${QUICK.map(q => `<button class="chip" data-act="msg-quick" data-text="${esc(q)}">${esc(q)}</button>`).join('')}</div>
    <form class="add chat-in" data-form="msg">
      <input name="body" id="msg-input" maxlength="300" required placeholder="הודעה ל${esc(othersName())}…" aria-label="הודעה" autocomplete="off" enterkeyhint="send">
      <button class="go" type="submit" aria-label="שליחה">${I.send}</button>
    </form>`;
}
function openChat() { openSheet(chatHtml(), 'tall', 'chat'); markRead(); scrollChat(); }
function refreshChat() {
  if (S.sheetKind !== 'chat') return;
  const list = document.getElementById('chat-list'); if (!list) return;
  list.innerHTML = S.messages.length ? S.messages.map(bubble).join('') : list.innerHTML;
  scrollChat();
}
function scrollChat() { const l = document.getElementById('chat-list'); if (l) l.scrollTop = l.scrollHeight; }

/* ---- shopper: item actions (not in stock / substitute / ask) ---- */
function openItemMore(id) {
  const i = S.items.find(x => x.id === id); if (!i) return;
  const who = othersName();
  openSheet(`${sheetHead(`${iconFor(i.name, i.category)} ${esc(i.name)}`)}
    <button class="opt" data-act="oos" data-id="${i.id}"><span class="oe" aria-hidden="true">❌</span>
      <span><b>לא היה במלאי</b><small>נשאר ברשימה לפעם הבאה, ו${esc(who)} מקבל/ת הודעה</small></span></button>
    <form class="opt-form" data-form="sub" data-id="${i.id}">
      <label for="subt"><span class="oe" aria-hidden="true">🔄</span><b>לקחתי משהו אחר במקום</b></label>
      <div class="row2"><input id="subt" name="text" required maxlength="80" placeholder="למשל: קוטג׳ 3%" autocomplete="off"><button class="btn violet send" type="submit">שליחה</button></div>
    </form>
    <form class="opt-form" data-form="ask" data-id="${i.id}">
      <label for="askt"><span class="oe" aria-hidden="true">❓</span><b>לשאול את ${esc(who)}</b></label>
      <div class="row2"><input id="askt" name="text" required maxlength="200" placeholder="למשל: יש רק של 2 ליטר, לקחת?" autocomplete="off"><button class="btn violet send" type="submit">שליחה</button></div>
    </form>`, '', 'item');
}

function openConfirm(fromTimer) {
  if (!S.trip) return;
  const items = superItems();
  const inCart = items.filter(i => i.in_cart);
  const left = items.filter(i => !i.in_cart);
  const pct = items.length ? Math.round(inCart.length / items.length * 100) : 0;
  const est = basket(inCart);
  const noPrice = inCart.filter(i => priceOf(i.name) == null);
  openSheet(`
    <div><h2>${fromTimer ? 'איך הלך בסופר?' : 'לסיים את הקנייה?'}</h2>
    <div class="lead">${fromTimer ? 'עברו ' + minsSince(S.trip.started_at) + ' דקות. ' : ''}סימנת ${inCart.length} מתוך ${items.length} פריטים בעגלה</div></div>
    <div class="bar"><div style="width:${pct}%"></div></div>
    ${left.length ? `<div class="left-box"><div class="h">יישארו ברשימה לפעם הבאה</div><div class="pills">${left.map(i => `<span>${i.status === 'oos' ? '❌ ' : ''}${esc(i.name)}</span>`).join('')}</div></div>` : ''}
    <form data-form="finish" class="finish-form">
      <div class="field"><label for="ftot">כמה יצא בקופה? <span class="muted">(לא חובה)</span></label>
        <div class="money"><span>₪</span><input id="ftot" name="total" inputmode="decimal" autocomplete="off" placeholder="${est.known ? 'משוער ' + est.sum : 'הסכום בקבלה'}"></div></div>
      ${noPrice.length ? `<details class="miss"><summary>מחירים חסרים (${noPrice.length}) · אפשר להעתיק מהקבלה</summary>
        ${noPrice.map(i => `<label class="mp"><span>${iconFor(i.name, i.category)} ${esc(i.name)}${qtyNum(i.qty) > 1 ? ` <span class="muted">×${qtyNum(i.qty)}, מחיר ליחידה</span>` : ''}</span>
          <span class="money sm"><span>₪</span><input name="p_${i.id}" inputmode="decimal" autocomplete="off" aria-label="מחיר ${esc(i.name)}"></span></label>`).join('')}</details>` : ''}
      <button class="btn green" type="submit">סיימתי, אפשר לסגור</button>
    </form>
    <div class="row2">
      <button class="btn soft" data-act="snooze">עדיין בסופר · עוד 10 דק׳</button>
      <button class="btn ghost" data-act="cancel">לא יצא, ביטלתי</button>
    </div>`, 'tall scroll', 'confirm');
}

function openEdit(id) {
  const i = S.items.find(x => x.id === id); if (!i) return;
  const canSave = !productInfo(i.name.trim());
  openSheet(`
    <h2>עריכת פריט</h2>
    <form data-form="edit" data-id="${i.id}" style="display:flex;flex-direction:column;gap:12px">
      <div class="field"><label for="en">שם</label><input id="en" name="name" value="${esc(i.name)}" required maxlength="80"></div>
      <div class="row2">
        <div class="field" style="flex:0 0 150px"><label for="eq">כמות</label>
          <div class="stepper"><button type="button" data-act="eq-inc" aria-label="עוד אחד">+</button><input id="eq" name="qty" value="${esc(i.qty)}" maxlength="20"><button type="button" data-act="eq-dec" aria-label="אחד פחות">−</button></div></div>
        <div class="field" style="flex:1"><label for="eo">הערה</label><input id="eo" name="note" value="${esc(i.note)}" maxlength="120" placeholder="מותג, גודל…"></div>
      </div>
      <div class="field"><label for="epr">מחיר ליחידה <span class="muted">${priceOf(i.name) != null ? '· עודכן ' + new Date(S.prices[i.name].updated_at).toLocaleDateString('he-IL') : '(לא חובה)'}</span></label>
        <div class="money"><span>₪</span><input id="epr" name="price" inputmode="decimal" autocomplete="off" value="${priceOf(i.name) ?? ''}"></div></div>
      <div style="font-size:13px;color:var(--muted)">נוסף ע״י ${esc(nameOf(i.added_by))} · ${esc(i.category)}</div>
      ${i.status === 'oos' ? `<button type="button" class="btn ghost" data-act="clear-status" data-id="${i.id}">❌ סומן "לא היה במלאי" · הסרת הסימון</button>` : ''}
      <button class="btn violet" type="submit">שמירה</button>
    </form>
    ${canSave ? `<button class="btn soft" data-act="custom-save" data-name="${esc(i.name)}">⭐ שמירה ב"המוצרים שלנו"</button>` : ''}
    <button class="danger" data-act="delete" data-id="${i.id}">מחיקה מהרשימה</button>`, '', 'edit');
}

function settingsHtml() {
  const m = me();
  let push;
  if (S.pushPerm === 'unsupported') push = '<div class="lead">הדפדפן הזה לא תומך בהתראות. באנדרואיד: פותחים את האפליקציה מ־Chrome.</div>';
  else if (S.pushPerm === 'denied') push = '<div class="lead">ההתראות חסומות במכשיר הזה. כדי לפתוח: לחיצה ארוכה על האייקון במסך הבית ← פרטי האפליקציה ← התראות ← הפעלה. אחר כך פותחים מחדש את האפליקציה.</div>';
  else if (S.pushPerm === 'granted') push = `<div class="lead">🔔 ההתראות פעילות במכשיר הזה.</div><button class="btn soft" data-act="push-test">שליחת התראת בדיקה</button>`;
  else push = `<div class="lead">ההתראות כבויות במכשיר הזה.</div><button class="btn violet" data-act="push-enable">${I.bell} הפעלת התראות</button>`;
  return `
    ${sheetHead(esc(S.household.name))}
    <div class="set-sec"><h3>התראות</h3>${push}</div>
    <div class="set-sec"><h3>צירוף בני הבית</h3>
      <div class="lead">מתקינים את האפליקציה, נכנסים, ובוחרים "קיבלתי קוד הזמנה":</div>
      <div class="code">${esc(S.household.invite_code)}</div>
      <button class="btn soft" data-act="share-code">שליחת הקוד בוואטסאפ</button></div>
    <div class="set-sec"><h3>הסופר שלנו</h3>
      <button class="btn ghost" data-act="order-open">↕ סדר המחלקות לפי המסלול בסופר</button></div>
    <form data-form="myname" class="row2" style="align-items:flex-end">
      <div class="field" style="flex:1"><label for="mn">השם שלי</label><input id="mn" name="display" value="${esc(m?.display_name || '')}" maxlength="20" required></div>
      <button class="btn violet" type="submit" style="flex:0 0 100px;height:52px;font-size:16px">עדכון</button>
    </form>
    <div style="font-size:13px;color:var(--muted)">מחובר/ת בתור ${esc(S.user.email)}</div>
    <button class="danger" data-act="signout">יציאה מהמשתמש</button>`;
}
function openSettings() { openSheet(settingsHtml(), 'tall scroll', 'settings'); }

function orderHtml() {
  const o = S.orderDraft;
  return `${sheetHead('סדר המחלקות')}
    <div class="lead">מסדרים לפי הסדר שבו עוברים בסופר. הרשימה של מי שבסופר תוצג בסדר הזה, אצל כולם.</div>
    <div class="ord-list">${o.map((c, k) => `<div class="ord-row"><span class="ord-n">${k + 1}</span><span aria-hidden="true" class="ord-i">${CAT_ICON[c]}</span><span class="ord-name">${esc(c)}</span>
      <button data-act="ord-up" data-i="${k}" ${k === 0 ? 'disabled' : ''} aria-label="להזיז את ${esc(c)} למעלה">▲</button>
      <button data-act="ord-down" data-i="${k}" ${k === o.length - 1 ? 'disabled' : ''} aria-label="להזיז את ${esc(c)} למטה">▼</button></div>`).join('')}</div>
    <div class="row2"><button class="btn ghost" data-act="ord-reset">ברירת מחדל</button><button class="btn violet" data-act="ord-save">שמירה</button></div>`;
}

/* ---- prices ---- */
function openPrice(id) {
  const i = S.items.find(x => x.id === id); if (!i) return;
  const p = priceOf(i.name); const q = qtyNum(i.qty);
  openSheet(`${sheetHead(`${iconFor(i.name, i.category)} ${esc(i.name)}`)}
    <form data-form="price" data-id="${i.id}" class="finish-form">
      <div class="field"><label for="pp">מחיר ליחידה${q > 1 ? ` <span class="muted">(בעגלה ${q} יח׳)</span>` : ''}</label>
        <div class="money big"><span>₪</span><input id="pp" name="price" inputmode="decimal" autocomplete="off" value="${p ?? ''}" placeholder="0.00" required></div></div>
      ${p != null ? `<div class="muted">המחיר הקודם: ${ILS(p)} · ${new Date(S.prices[i.name].updated_at).toLocaleDateString('he-IL')}</div>` : '<div class="muted">המחיר יישמר ויופיע ליד המוצר בפעם הבאה, אצל שניכם.</div>'}
      <button class="btn violet" type="submit">שמירה</button>
    </form>`, '', 'price');
  setTimeout(() => { const el = document.getElementById('pp'); el?.focus(); el?.select(); }, 80);
}
function openTripTotal(id) {
  const t = S.stats?.trips.find(x => x.id === id); if (!t) return;
  openSheet(`${sheetHead('כמה יצא בקופה?')}
    <div class="lead">קנייה של ${esc(nameOf(t.shopper_id))} · ${new Date(t.finished_at).toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'numeric' })}${t.estimated_total ? ' · משוער ' + ILS(t.estimated_total) : ''}</div>
    <form data-form="trip-total" data-id="${t.id}" class="finish-form">
      <div class="money big"><span>₪</span><input name="total" inputmode="decimal" autocomplete="off" value="${t.actual_total ?? ''}" placeholder="הסכום בקבלה" aria-label="סכום בקופה"></div>
      <button class="btn violet" type="submit">שמירה</button>
    </form>`, '', 'trip-total');
}

/* ---- statistics ---- */
async function loadStats() {
  if (!S.household) return;
  const since = new Date(Date.now() - 365 * 864e5).toISOString();
  const hid = S.household.id;
  const [tr, pu, ph] = await Promise.all([
    sb.from('trips').select('*').eq('household_id', hid).eq('status', 'done').gte('finished_at', since).order('finished_at', { ascending: false }).limit(500),
    sb.from('purchases').select('name, qty, category, price, created_at, trip_id').eq('household_id', hid).gte('created_at', since).order('created_at', { ascending: false }).limit(3000),
    sb.from('price_history').select('name, price, recorded_at').eq('household_id', hid).gte('recorded_at', since).order('recorded_at', { ascending: false }).limit(3000)
  ]);
  if (tr.error || pu.error || ph.error) { if (S.tab === 'stats') toast('לא הצלחתי לטעון סטטיסטיקה'); return; }
  S.stats = { trips: tr.data, purchases: pu.data, history: ph.data, at: Date.now() };
  if (S.tab === 'stats') render();
}
const tripSum = t => t.actual_total != null ? Number(t.actual_total) : t.estimated_total != null ? Number(t.estimated_total) : null;
const MONTHS = ['ינו׳','פבר׳','מרץ','אפר׳','מאי','יוני','יולי','אוג׳','ספט׳','אוק׳','נוב׳','דצמ׳'];
function renderStats() {
  const head = `<div class="top"><div><div class="sub">${esc(S.household.name)}</div><h1>סטטיסטיקה</h1></div>${chatButton()}</div>`;
  const st = S.stats;
  if (!st) return head + '<div class="empty">טוען…</div>';
  if (!st.trips.length) return head + `<div class="empty">עוד אין קניות סגורות.<br>אחרי שתסיימו קנייה ותכתבו כמה יצא בקופה,<br>יופיעו כאן ההוצאות, המגמות והמוצרים הקבועים שלכם.</div>`;

  const now = new Date();
  const ym = d => d.getFullYear() * 12 + d.getMonth();
  const curM = ym(now);
  const byMonth = {};
  for (const t of st.trips) { const k = ym(new Date(t.finished_at)); const v = tripSum(t); (byMonth[k] ||= { sum: 0, n: 0, est: false }); byMonth[k].n++; if (v != null) byMonth[k].sum += v; if (t.actual_total == null && v != null) byMonth[k].est = true; }
  const thisM = byMonth[curM] || { sum: 0, n: 0 }, lastM = byMonth[curM - 1] || { sum: 0, n: 0 };
  const withSum = st.trips.filter(t => tripSum(t) != null);
  const avg = withSum.length ? withSum.reduce((a, t) => a + tripSum(t), 0) / withSum.length : null;
  const diff = lastM.sum ? Math.round((thisM.sum - lastM.sum) / lastM.sum * 100) : null;

  const months = Array.from({ length: 6 }, (_, k) => curM - 5 + k);
  const maxM = Math.max(1, ...months.map(m => byMonth[m]?.sum || 0));
  const chart = `<div class="bars" role="img" aria-label="הוצאה חודשית בששת החודשים האחרונים">${months.map(m => {
    const v = byMonth[m]?.sum || 0;
    return `<div class="bar-c"><div class="bar-v">${v ? ILS(Math.round(v)) : ''}</div><div class="bar-b ${m === curM ? 'cur' : ''}" style="height:${Math.max(3, Math.round(v / maxM * 120))}px"></div><div class="bar-l">${MONTHS[m % 12]}</div></div>`;
  }).join('')}</div>`;

  const who = {};
  for (const t of st.trips) { (who[t.shopper_id] ||= { n: 0, sum: 0 }); who[t.shopper_id].n++; who[t.shopper_id].sum += tripSum(t) || 0; }
  const whoHtml = Object.entries(who).sort((a, b) => b[1].n - a[1].n).map(([id, w]) =>
    `<div class="who"><span class="av" style="background:${colorOf(id)}">${esc(initial(id))}</span><span class="who-n">${esc(nameOf(id))}</span><span class="muted">${w.n} קניות${w.sum ? ' · ' + ILS(Math.round(w.sum)) : ''}</span></div>`).join('');

  const counts = {};
  for (const p of st.purchases) { (counts[p.name] ||= { n: 0, cat: p.category }); counts[p.name].n++; }
  const top = Object.entries(counts).sort((a, b) => b[1].n - a[1].n).slice(0, 8);
  const topHtml = top.map(([n, c], k) => `<div class="top-i"><span class="ord-n">${k + 1}</span><span aria-hidden="true">${iconFor(n, c.cat)}</span><span class="who-n">${esc(n)}</span><span class="muted">${c.n} פעמים${priceOf(n) != null ? ' · ' + ILS(priceOf(n)) : ''}</span></div>`).join('');

  // price changes: latest vs. previous different price per product
  const hist = {};
  for (const h of st.history) (hist[h.name] ||= []).push(Number(h.price));
  const changes = Object.entries(hist).map(([n, ps]) => { const cur = ps[0]; const prev = ps.find(x => x !== cur); return prev ? { n, cur, prev, pct: Math.round((cur - prev) / prev * 100) } : null; })
    .filter(Boolean).sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct)).slice(0, 8);
  const chHtml = changes.map(c => `<div class="top-i"><span aria-hidden="true">${iconFor(c.n)}</span><span class="who-n">${esc(c.n)}</span>
    <span class="chg ${c.pct > 0 ? 'up' : 'down'}">${c.pct > 0 ? '▲' : '▼'} ${Math.abs(c.pct)}%</span><span class="muted">${ILS(c.prev)} ← ${ILS(c.cur)}</span></div>`).join('');

  const recent = st.trips.slice(0, 10).map(t => `<button class="trip-r" data-act="trip-total" data-id="${t.id}">
    <span class="av sm" style="background:${colorOf(t.shopper_id)}">${esc(initial(t.shopper_id))}</span>
    <span class="who-n">${new Date(t.finished_at).toLocaleDateString('he-IL', { weekday: 'short', day: 'numeric', month: 'numeric' })}<span class="muted"> · ${t.bought_count ?? 0} פריטים</span></span>
    <span class="tr-sum ${t.actual_total == null ? 'est' : ''}">${t.actual_total != null ? ILS(t.actual_total) : t.estimated_total != null ? '~' + ILS(t.estimated_total) : '+ סכום'}</span></button>`).join('');

  return head + `<div class="stats-wrap">
    <div class="kpis">
      <div class="kpi main"><span>החודש</span><b>${ILS(Math.round(thisM.sum))}</b><small>${thisM.n} קניות${diff != null ? ` · <span class="chg ${diff > 0 ? 'up' : 'down'}">${diff > 0 ? '▲' : '▼'} ${Math.abs(diff)}%</span> מחודש שעבר` : ''}</small></div>
      <div class="kpi"><span>ממוצע לקנייה</span><b>${avg != null ? ILS(Math.round(avg)) : '—'}</b></div>
      <div class="kpi"><span>חודש שעבר</span><b>${ILS(Math.round(lastM.sum))}</b></div>
    </div>
    <div class="card pad"><h3>הוצאה חודשית</h3>${chart}${Object.values(byMonth).some(m => m.est) ? '<div class="muted small">חלק מהסכומים משוערים לפי מחירי המוצרים, כי לא נרשם סכום מהקופה.</div>' : ''}</div>
    <div class="card pad"><h3>מי קנה</h3>${whoHtml}</div>
    ${top.length ? `<div class="card pad"><h3>הכי נקנה</h3>${topHtml}</div>` : ''}
    ${changes.length ? `<div class="card pad"><h3>שינויי מחירים</h3>${chHtml}</div>` : ''}
    <div class="card pad"><h3>קניות אחרונות</h3><div class="muted small">לחיצה על קנייה מוסיפה או מתקנת את הסכום מהקופה</div>${recent}</div>
  </div>`;
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
      ${t.actual_total || t.estimated_total ? `<div><b>${ILS(t.actual_total || t.estimated_total)}</b><span>${t.actual_total ? 'בקופה' : 'משוער'}</span></div>` : ''}
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
    case 'backdrop': case 'backdrop-close': closeSheet(); break;
    case 'auth-toggle': S.authMode = S.authMode === 'login' ? 'signup' : 'login'; S.authErr = ''; render(); break;
    case 'toggle': {
      const it = S.items.find(i => i.id === b.dataset.id); if (!it) break;
      if (iShop()) {
        vibrate(15);
        const patch = { in_cart: !it.in_cart };
        if (it.status) { patch.status = null; patch.status_note = ''; }  // bought after all, or un-did a substitute
        updateItem(it.id, patch);
      } else toggleRemove(it.id);
      break;
    }
    case 'qty-inc': {
      const it = S.items.find(i => i.id === b.dataset.id); if (!it) break;
      vibrate(10); updateItem(it.id, { qty: String((parseInt(it.qty, 10) || 1) + 1) });
      break;
    }
    case 'eq-inc': case 'eq-dec': {
      const inp = document.getElementById('eq'); const n = parseInt(inp.value, 10);
      if (Number.isFinite(n)) inp.value = String(Math.max(1, n + (act === 'eq-inc' ? 1 : -1))); else if (act === 'eq-inc') inp.value = '2';
      break;
    }
    case 'clear-status': updateItem(b.dataset.id, { status: null, status_note: '' }); closeSheet(); break;
    case 'ob': S.onboard = b.dataset.mode || null; S.authErr = ''; render(); break;
    case 'pick-open': openPicker(); break;
    case 'pick-cat': S.picker.cat = b.dataset.cat; refreshPicker(true); break;
    case 'pick-toggle': { const n = b.dataset.name; if (S.picker.sel[n]) delete S.picker.sel[n]; else { S.picker.sel[n] = 1; vibrate(10); } refreshPicker(); break; }
    case 'pick-inc': { const n = b.dataset.name; S.picker.sel[n] = Math.min(99, (S.picker.sel[n] || 0) + 1); refreshPicker(); break; }
    case 'pick-dec': { const n = b.dataset.name; const q = (S.picker.sel[n] || 1) - 1; if (q <= 0) delete S.picker.sel[n]; else S.picker.sel[n] = q; refreshPicker(); break; }
    case 'pick-add': pickerAdd(); break;
    case 'custom-del': {
      const c = S.custom.find(x => x.id === b.dataset.id); if (!c) break;
      const { error } = await sb.from('custom_products').delete().eq('id', c.id);
      if (error) { toast('לא הצלחתי להסיר'); break; }
      S.custom = S.custom.filter(x => x.id !== c.id); rebuildProducts(); saveCache(); refreshPicker(); toast(c.name + ' הוסר מהמוצרים שלנו');
      break;
    }
    case 'custom-save': if (await saveCustomProduct(b.dataset.name)) b.remove(); break;
    case 'edit': openEdit(b.dataset.id); break;
    case 'delete': closeSheet(); deleteItem(b.dataset.id); break;
    case 'quick': addItem(b.dataset.name); break;
    case 'start': startTrip(); break;
    case 'confirm': openConfirm(false); break;
    case 'snooze': snoozeTrip(10); break;
    case 'cancel': cancelTrip(); break;
    case 'cancel-ask': openSheet(`<h2>לבטל את היציאה?</h2><div class="lead">הסימונים בעגלה יתאפסו, והרשימה תישאר כמו שהיא.</div>
      <div class="row2"><button class="btn ghost" data-act="backdrop-close">לא, ממשיכים</button><button class="btn orange" data-act="cancel" style="height:54px;font-size:16px">כן, לבטל</button></div>`); break;
    case 'item-more': openItemMore(b.dataset.id); break;
    case 'price': openPrice(b.dataset.id); break;
    case 'trip-total': openTripTotal(b.dataset.id); break;
    case 'oos': {
      const it = S.items.find(i => i.id === b.dataset.id); if (!it) break;
      closeSheet(); updateItem(it.id, { status: 'oos', status_note: '', in_cart: false });
      sendMessage({ kind: 'oos', item: it }); toast('סומן "לא היה במלאי" ונשלחה הודעה');
      break;
    }
    case 'chat': document.getElementById('banner')?.remove(); openChat(); break;
    case 'banner-close': document.getElementById('banner')?.remove(); break;
    case 'msg-quick': sendMessage({ body: b.dataset.text }); break;
    case 'push-enable': enablePush(); break;
    case 'push-dismiss': S.pushDismissed = true; LS.set('ha_push_dismissed', true); render(); break;
    case 'push-test': {
      b.disabled = true; b.textContent = 'שולח…';
      const r = await notify('test');
      b.disabled = false; b.textContent = 'שליחת התראת בדיקה';
      if (r?.sent) toast('נשלחה התראה. אם לא הופיעה תוך כמה שניות, כדאי לבדוק שהתראות מותרות לאפליקציה');
      else { toast('המכשיר לא רשום, מנסה לרשום מחדש…'); try { await subscribePush(); const r2 = await notify('test'); toast(r2?.sent ? 'נשלחה התראה' : 'לא הצלחתי לשלוח התראה'); } catch { toast('לא הצלחתי לרשום את המכשיר'); } }
      break;
    }
    case 'order-open': S.orderDraft = catOrder(); openSheet(orderHtml(), 'tall scroll', 'order'); break;
    case 'ord-up': case 'ord-down': {
      const k = +b.dataset.i, j = act === 'ord-up' ? k - 1 : k + 1, o = S.orderDraft;
      [o[k], o[j]] = [o[j], o[k]]; setSheet(orderHtml());
      break;
    }
    case 'ord-reset': S.orderDraft = [...CAT_ORDER]; setSheet(orderHtml()); break;
    case 'ord-save': {
      const order = S.orderDraft;
      const { error } = await sb.from('households').update({ category_order: order }).eq('id', S.household.id);
      if (error) { toast('לא הצלחתי לשמור'); break; }
      S.household.category_order = order; saveCache(); closeSheet(); render(); toast('סדר המחלקות נשמר');
      break;
    }
    case 'tab': S.tab = b.dataset.tab; render(); if (S.tab === 'stats') loadStats(); window.scrollTo(0, 0); break;
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
      const pr = parsePrice(fd.price); if (pr != null) setPrice(name, pr);
      closeSheet();
      break;
    }
    case 'finish': {
      for (const [k, v] of Object.entries(fd)) if (k.startsWith('p_')) {
        const it = S.items.find(i => i.id === k.slice(2)); const pr = parsePrice(v);
        if (it && pr != null) await setPrice(it.name, pr);
      }
      finishTrip(parsePrice(fd.total));
      break;
    }
    case 'price': {
      const it = S.items.find(i => i.id === f.dataset.id); const pr = parsePrice(fd.price);
      closeSheet();
      if (it && pr != null) { setPrice(it.name, pr); vibrate(10); }
      break;
    }
    case 'trip-total': {
      const pr = parsePrice(fd.total);
      closeSheet();
      const { data, error } = await sb.rpc('set_trip_total', { p_trip: f.dataset.id, p_total: pr ?? 0 });
      if (error) toast('לא הצלחתי לשמור'); else { toast('הסכום נשמר'); loadStats(); }
      break;
    }
    case 'custom-add': {
      if (await saveCustomProduct(fd.name)) { S.picker.sel[fd.name.replace(/\s+/g, ' ').trim()] = 1; refreshPicker(); }
      break;
    }
    case 'msg': {
      const body = (fd.body || '').trim(); if (!body) return;
      f.reset(); await sendMessage({ body });
      document.getElementById('msg-input')?.focus();
      break;
    }
    case 'sub': case 'ask': {
      const it = S.items.find(i => i.id === f.dataset.id); const text = (fd.text || '').trim();
      if (!it || !text) return;
      closeSheet();
      if (f.dataset.form === 'sub') { updateItem(it.id, { status: 'sub', status_note: text.slice(0, 80), in_cart: true }); sendMessage({ kind: 'sub', body: text, item: it }); toast('נשלח ל' + othersName()); }
      else { sendMessage({ kind: 'ask', body: text, item: it }); toast('השאלה נשלחה ל' + othersName()); }
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

/* ---------------- deep links from notifications ---------------- */
let pendingOpen = new URLSearchParams(location.search);
if ([...pendingOpen.keys()].length) history.replaceState(null, '', location.pathname); else pendingOpen = null;
async function handleOpen(params) {
  if (!params || !S.household) return;
  if (params.get('confirm') && iShop()) { LS.set('ha_prompted', S.trip.id + '|' + S.trip.remind_at); openConfirm(true); }
  else if (params.get('chat')) openChat();
  else if (params.get('thanks')) {
    const { data } = await sb.from('trips').select('*').eq('id', params.get('thanks')).maybeSingle();
    if (data) showThanks(data);
  }
}
navigator.serviceWorker?.addEventListener('message', e => {
  const d = e.data || {};
  if (d.type === 'open' && d.url) handleOpen(new URL(d.url).searchParams);
  if (d.type === 'push') onForegroundPush(d.payload || {});
});

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
    safeLoad().then(() => { flush(); ensurePush(); flushPendingNotify(); if (pendingOpen) { handleOpen(pendingOpen); pendingOpen = null; } else maybePromptConfirm(); });
  }
});

window.addEventListener('online', () => { S.online = true; render(); flush(); safeLoad(); flushPendingNotify(); if (!rtHealthy) subscribe(true); });
window.addEventListener('offline', () => { S.online = false; render(); });
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && S.user) { clearNotifications(); safeLoad().then(() => { flush(); flushPendingNotify(); maybePromptConfirm(); }); }
});

// reminder: when the shopper's 15 minutes are up, ask to confirm the purchase
setInterval(() => {
  if (iShop()) maybePromptConfirm();
  if (S.trip && !sheetRoot.innerHTML && !S.removing.size && document.activeElement?.id !== 'add-input') render(); // keep the minutes counter fresh
}, 15000);

setInterval(() => {
  if (S.trip && document.visibilityState === 'visible') refreshLive();
  else if (document.visibilityState === 'visible' && !rtHealthy) refreshLive(true);
}, 20000);

setTimeout(() => { if (S.booting) { S.booting = false; render(); } }, 2500);

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
clearNotifications();
