import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './config.js';

const sb = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, experimental: { passkey: true } }
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
  { name: 'ירקות ופירות', items: [['svg:cauliflower','כרובית'],['🍅','עגבניות'],['🥒','מלפפונים'],['🧅','בצל'],['🧄','שום'],['🥕','גזר'],['🫑','פלפל'],['🌶️','פלפל ירוק חריף'],['🥬','חסה'],['🥔','תפוחי אדמה'],['🍠','בטטה'],['🥑','אבוקדו'],['🍆','חציל'],['🥦','ברוקולי'],['🍄','פטריות'],['🌿','פטרוזיליה'],['🌿','כוסברה'],['🌿','שמיר'],['🍋','לימון'],['🍌','בננות'],['🍎','תפוחים'],['🍊','תפוזים'],['🍐','אגסים'],['🍇','ענבים'],['🍓','תותים'],['🍒','דובדבנים'],['🍉','אבטיח'],['🥭','מנגו']] },
  { name: 'מקרר', items: [['svg:pudding','מילקי'],['🥛','חלב'],['🥚','ביצים'],['🧀','גבינה צהובה'],['🧀','גבינה לבנה'],['🧀','גבינת פטה'],['🧀','גבינת קשקבל'],['🥣','קוטג׳'],['🍶','יוגורט'],['🧈','חמאה'],['🥛','שמנת מתוקה'],['🍶','שמנת חמוצה'],['🍮','מעדנים'],['🧀','לבנה'],['🧀','בולגרית'],['🥛','שוקו']] },
  { name: 'מאפים', items: [['🍞','לחם'],['🍞','לחם מחמצת'],['🫓','פיתות'],['🥖','באגט'],['🍞','לחמניות'],['🥯','בייגל'],['🥐','קרואסונים'],['🫓','טורטיות'],['🍞','חלה'],['🍰','עוגה']] },
  { name: 'בשר ודגים', items: [['🍗','חזה עוף'],['🍗','חזה עוף לשניצל'],['🍗','שניצל'],['🍗','כרעיים (פולקה)'],['🍗','פרגיות'],['🥩','בשר טחון'],['🥩','סטייק'],['🍔','המבורגרים'],['🌭','נקניקיות'],['🐟','סלמון'],['🐟','פילה דג'],['🥓','פסטרמה']] },
  { name: 'מזווה', items: [['svg:ptitim','פתיתים'],['svg:mustard','חרדל'],['🍚','אורז'],['🍝','פסטה'],['🍝','ספגטי'],['🌾','קמח'],['🌾','קמח שקדים'],['🍬','סוכר'],['🧂','מלח'],['🧂','פלפל שחור'],['🫒','שמן זית'],['🌻','שמן קנולה'],['☕','קפה'],['🍵','תה'],['🥣','קורנפלקס'],['🥣','גרנולה'],['🥫','טונה'],['🥫','רסק עגבניות'],['🫘','חומוס'],['🫘','עדשים'],['🫙','טחינה'],['🍯','דבש'],['🍓','ריבה'],['🍫','ממרח שוקולד'],['🥜','אגוזים'],['🫒','זיתים'],['🥒','מלפפון חמוץ'],['🍅','קטשופ'],['🥚','מיונז']] },
  { name: SNACKS, items: [['🍫','שוקולד'],['🥚','ביצת קינדר'],['🥜','במבה'],['🥨','ביסלי'],['🍪','עוגיות']] },
  { name: 'קפואים', items: [['🍦','גלידה'],['🍕','פיצה קפואה'],['🥟','בורקס'],['🥞','מלאווח'],['🥦','ירקות קפואים'],['🍟','צ׳יפס קפוא'],['🧊','קרח']] },
  { name: 'משקאות', items: [['💧','מים'],['🫧','סודה'],['🥤','קולה'],['🥤','ספרייט זירו'],['⚡','רד בול ללא סוכר'],['🧃','מיץ'],['🍺','בירה'],['🍷','יין אדום'],['🥂','יין לבן'],['🥛','חלב סויה'],['🥛','חלב שקדים']] },
  { name: 'ניקיון ובית', items: [['svg:cup','כוסות אספרסו חד פעמי'],['🧻','נייר טואלט'],['🧻','מגבות נייר'],['🧻','טישו'],['🧽','ספוגים'],['🧤','כפפות גומי'],['🧴','נוזל כלים'],['🫧','טבליות למדיח'],['🧴','נוזל כביסה (כביסכל)'],['🧺','אבקת כביסה'],['🧴','מרכך כביסה'],['🗑️','שקיות זבל'],['🧼','סבון ידיים'],['🧪','אקונומיקה'],['🧹','מנקה רצפות'],['🧻','מגבונים'],['🔋','סוללות'],['💡','נורות'],['🥡','נייר אפייה'],['🥡','נייר כסף (אלומיניום)']] },
  { name: 'טיפוח ופארם', items: [['🧴','שמפו'],['🧴','מרכך שיער'],['🪥','משחת שיניים'],['🪥','מברשות שיניים'],['🧴','דאודורנט'],['🪒','סכיני גילוח'],['🧴','קרם גוף'],['☀️','קרם הגנה'],['🩹','פלסטרים'],['💊','משככי כאבים'],['🧻','צמר גפן']] }
];
const CATALOG_MAP = new Map();
for (const c of CATALOG) for (const [emo, n] of c.items) CATALOG_MAP.set(n, { emo, cat: c.name });
const CUSTOM_TAB = 'שלנו';

/* ---------------- state ---------------- */
const APP_VERSION = 'v1.10.0';
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
const S = {
  booting: true, session: null, user: null,
  household: null, members: {}, items: [], trip: null, messages: [], custom: [], prices: {}, stats: null, recent: { trips: [], purchases: [] },
  outbox: LS.get('ha_outbox', []), online: navigator.onLine,
  tab: 'list', authMode: 'login', authErr: '', busy: false,
  addText: '', history: LS.get('ha_history', {}),
  shownThanks: new Set(LS.get('ha_shown_thanks', [])), confirmFor: null,
  removing: new Map(), onboard: null, picker: null, sheetKind: null, orderDraft: null,
  lastRead: 0, fam: { places: [], landings: [], reqs: [], dels: [], lines: [], asks: [], pkgs: [], loaded: false }, verifyEmail: LS.get('ha_verify', null), pushPerm: 'default', pushDismissed: LS.get('ha_push_dismissed', false)
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
// products with no fitting emoji get a drawn icon (icons/*.svg); stored as "svg:<name>"
const SVG_ICONS = [['כוסות אספרסו', 'cup'], ['כוס חד פעמי', 'cup'], ['כוסות חד פעמי', 'cup'], ['כוסות קפה', 'cup'], ['פתיתים', 'ptitim'],
  ['מילקי', 'pudding'], ['מעדן', 'pudding'], ['כרובית', 'cauliflower'], ['חרדל', 'mustard']];
const ico = e => typeof e === 'string' && e.startsWith('svg:') ? `<img class="ico" src="icons/${e.slice(4).replace(/[^a-z]/g, '')}.svg" alt="">` : esc(e || '');
function iconRaw(name, category) {
  const n = String(name || '');
  const s = SVG_ICONS.find(([k]) => n.includes(k));
  if (s) return 'svg:' + s[1];
  return catalogMatch(n)?.emo || CAT_ICON[category] || '🛒';
}
const iconFor = (name, category) => ico(iconRaw(name, category));
function catOrder() {
  const saved = (S.household?.category_order || []).filter(c => CAT_ORDER.includes(c));
  return [...saved, ...CAT_ORDER.filter(c => !saved.includes(c))];
}

function saveCache() {
  if (!S.user) return;
  LS.set('ha_cache_' + S.user.id, { household: S.household, members: S.members, items: S.items, trip: S.trip, messages: S.messages.slice(-60), custom: S.custom, prices: S.prices, recent: S.recent });
}
function loadCache() {
  const c = LS.get('ha_cache_' + S.user.id, null);
  S.wasUser = !!(c && c.household);
  if (c) Object.assign(S, { household: c.household, members: c.members || {}, items: c.items || [], trip: c.trip, messages: c.messages || [], custom: c.custom || [], prices: c.prices || {}, recent: c.recent || { trips: [], purchases: [] } });
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
  loadRecent(hid);
  loadFamily(hid);
  saveCache();
  subscribe();
  maybeWhatsNew();
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
    .on('postgres_changes', { event: '*', schema: 'public', table: 'places', filter: f }, famReload)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'landings', filter: f }, famReload)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'landing_requests', filter: f }, famReload)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'deliveries', filter: f }, famReload)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'delivery_lines', filter: f }, famReload)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'asks', filter: f }, famReload)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'packages', filter: f }, famReload)
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
    if (n.status === 'done') { showThanks(n); setTimeout(() => loadRecent(), 1500); }
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

/* recent finished trips (for "הקנייה האחרונה" and "אולי נגמר?") */
async function loadRecent(hid = S.household?.id) {
  if (!hid) return;
  const tr = await sb.from('trips').select('id, shopper_id, finished_at, bought_count, actual_total, estimated_total').eq('household_id', hid).eq('status', 'done').order('finished_at', { ascending: false }).limit(6);
  if (tr.error || !tr.data.length) { if (!tr.error) { S.recent = { trips: [], purchases: [] }; render(); } return; }
  const pu = await sb.from('purchases').select('trip_id, name, qty, category, price').in('trip_id', tr.data.map(t => t.id));
  if (pu.error) return;
  S.recent = { trips: tr.data, purchases: pu.data };
  saveCache(); render();
}
// products bought in at least 2 of the last trips (and in most of them) that aren't on the list now
function maybeOut(items) {
  const trips = S.recent.trips; if (trips.length < 2) return [];
  const onList = new Set(items.map(i => i.name));
  const seen = {};
  for (const p of S.recent.purchases) { (seen[p.name] ||= { trips: new Set(), cat: p.category }).trips.add(p.trip_id); }
  return Object.entries(seen)
    .filter(([n, v]) => !onList.has(n) && v.trips.size >= 2 && v.trips.size / trips.length >= 0.4)
    .sort((a, b) => b[1].trips.size - a[1].trips.size).slice(0, 6).map(([n, v]) => ({ name: n, cat: v.cat }));
}
const relDay = t => {
  const d = new Date(t), now = new Date(); const days = Math.round((new Date(now.toDateString()) - new Date(d.toDateString())) / 864e5);
  return days === 0 ? 'היום' : days === 1 ? 'אתמול' : days < 7 ? `לפני ${days} ימים` : d.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' });
};
function tripItemsHtml(trip, purchases, idPrefix) {
  const onList = new Set(superItems().filter(i => !i.in_cart).map(i => i.name));
  const addable = purchases.filter(p => !onList.has(p.name));
  return `${addable.length > 1 ? `<button class="chip pick all" data-act="re-add-all" data-trip="${trip.id}">+ להעביר הכול לרשימה (${addable.length})</button>` : ''}
    <div class="ti-list">${purchases.map((p, k) => {
      const has = onList.has(p.name); const pr = p.price ?? priceOf(p.name);
      return `<div class="ti-row"><span class="emo" aria-hidden="true">${iconFor(p.name, p.category)}</span>
        <span class="ti-n">${esc(p.name)}${qtyNum(p.qty) > 1 ? ` <span class="muted">×${qtyNum(p.qty)}</span>` : ''}</span>
        ${pr != null ? `<span class="price-t">${ILS(pr)}</span>` : ''}
        ${has ? '<span class="ti-has">✓ ברשימה</span>' : `<button class="ti-add" data-act="re-add" data-trip="${trip.id}" data-k="${k}" aria-label="להעביר את ${esc(p.name)} לרשימת הקניות">+ לרשימה</button>`}</div>`;
    }).join('')}</div>`;
}
function lastTripCard(items) {
  const t = S.recent.trips[0]; if (!t) return '';
  const ps = S.recent.purchases.filter(p => p.trip_id === t.id); if (!ps.length) return '';
  const total = t.actual_total ?? t.estimated_total;
  return `<details class="card lastbuy" ${S.lastOpen ? 'open' : ''}>
    <summary data-act="last-toggle"><span aria-hidden="true">🧾</span><span class="lb-t"><b>הקנייה האחרונה</b>
      <small>${esc(nameOf(t.shopper_id))} · ${relDay(t.finished_at)} · ${ps.length} פריטים${total != null ? ' · ' + (t.actual_total == null ? '~' : '') + ILS(total) : ''}</small></span></summary>
    <div class="lb-body">${tripItemsHtml(t, ps)}</div>
  </details>`;
}
function reAdd(tripPurchases, list) {
  let n = 0;
  for (const p of list) { const r = addRow({ name: p.name, qty: String(qtyNum(p.qty)), category: p.category }); if (r !== 'dup') n++; }
  saveCache(); render(); if (S.sheetKind === 'trip') setSheet(tripSheetHtml(S.tripView)); 
  if (n) { vibrate(15); toast(n === 1 ? `${list[0].name} חזר לרשימה` : `${n} מוצרים חזרו לרשימה`); }
}
function tripSheetHtml(v) {
  const t = v.trip; const total = t.actual_total ?? t.estimated_total;
  return `${sheetHead(`🧾 ${new Date(t.finished_at).toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'numeric' })}`)}
    <div class="lead">${esc(nameOf(t.shopper_id))} · ${v.purchases.length} פריטים · ${total != null ? (t.actual_total == null ? 'משוער ' : '') + ILS(total) : 'בלי סכום'}
      <button class="link" data-act="trip-total" data-id="${t.id}">${t.actual_total == null ? '+ סכום מהקופה' : 'עריכת סכום'}</button></div>
    ${v.purchases.length ? tripItemsHtml(t, v.purchases) : '<div class="pk-empty">אין פירוט מוצרים לקנייה הזו<br>(קניות לפני שהתחלנו לשמור פירוט).</div>'}`;
}
async function openTripView(id) {
  const t = (S.stats?.trips || []).find(x => x.id === id) || S.recent.trips.find(x => x.id === id); if (!t) return;
  let purchases = S.recent.purchases.filter(p => p.trip_id === id);
  if (!S.recent.trips.some(x => x.id === id)) {
    const { data } = await sb.from('purchases').select('trip_id, name, qty, category, price').eq('trip_id', id);
    purchases = data || [];
  }
  S.tripView = { trip: t, purchases };
  openSheet(tripSheetHtml(S.tripView), 'tall scroll', 'trip');
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
  if (p.kind === 'land' || p.kind === 'delivery' || p.kind === 'ask' || p.kind === 'pkg') { await loadFamily(); vibrate(80); if (S.tab !== 'family') showInfoBanner({ title: p.title, body: p.body, act: 'go-family' }); return; }
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
  if (t) { S.items = S.items.filter(i => !(i.list === 'super' && i.in_cart)); S.trip = null; saveCache(); showThanks(t); render(); loadRecent(); }
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
  if (S.suspended) return renderSuspended();
  if (S.recovery && S.session) return renderRecovery();
  if ((S.locked || S.cover) && S.session) return renderLocked();
  if (!S.session) return S.forgot ? renderForgot() : renderAuth();
  if (!S.household) return renderOnboard();
  const focused = document.activeElement?.id === 'add-input';
  const sel = focused ? [document.activeElement.selectionStart, document.activeElement.selectionEnd] : null;
  app.innerHTML = renderMain();
  if (focused) { const el = document.getElementById('add-input'); if (el) { el.focus(); try { el.setSelectionRange(...sel); } catch {} } }
}

const APP_HOME = location.origin + location.pathname.replace(/[^/]*$/, '');
function renderVerify() {
  app.innerHTML = `
  <div class="auth verify">
    <img class="logo-img" src="icon-512.png" alt="">
    <h1>בדקו את המייל 📬</h1>
    <p>שלחנו קישור אישור אל<br><b dir="ltr">${esc(S.verifyEmail)}</b></p>
    <ol class="v-steps"><li>פותחים את המייל מ"בדרך לסופר"</li><li>לוחצים <b>אישור הכתובת</b></li><li>חוזרים לכאן ונכנסים</li></ol>
    <div class="err ok">${esc(S.authErr)}</div>
    <button class="btn violet" data-act="verify-login">אישרתי · כניסה</button>
    <button class="btn ghost" data-act="verify-resend" ${S.busy ? 'disabled' : ''}>לא הגיע? שליחה חוזרת</button>
    <p class="small muted">לא מוצאים? כדאי להציץ גם בתיקיית הספאם / קידומי מכירות.</p>
    <button class="link" data-act="verify-back">כתובת שגויה? חזרה</button>
  </div>`;
}
function renderAuth() {
  if (S.verifyEmail) return renderVerify();
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
    ${!signup && passkeySupported() ? '<button class="btn ghost" type="button" data-act="passkey-signin" ' + (S.busy ? 'disabled' : '') + '>🔐 כניסה עם טביעת אצבע</button>' : ''}
    ${signup ? '' : '<button class="link" type="button" data-act="forgot-open">שכחתי סיסמה</button>'}
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
  if (S.tab === 'admin') {
    body = renderAdmin();
  } else if (S.tab === 'stats') {
    body = renderStats();
  } else if (S.tab === 'family') {
    body = renderFamily();
  } else {
    const header = `<div class="top">
      <div><div class="sub">${esc(S.household.name)}</div><h1>רשימת הסופר</h1></div>
      <div class="top-acts">${chatButton()}
      <button class="avatars" data-act="settings" aria-label="הגדרות הבית">${memberList.map(m => `<span class="av" style="background:${m.color}">${esc(m.display_name.charAt(0))}</span>`).join('')}</button></div>
    </div>`;

    let status;
    if (shopping) {
      status = `${reminderDue() ? `<button class="due wide" data-act="confirm">⏰ עברו ${minsSince(trip.started_at)} דק׳ · לסיים את הקנייה?</button>` : `<div class="shop-tip">חסר משהו? ⋯ ליד המוצר: "לא היה", "לקחתי משהו אחר" או שאלה</div>`}`;
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

    const maybeOutList = maybeOut(items);
    const histChips = Object.entries(S.history)
      .filter(([n]) => !items.some(i => i.name === n) && !maybeOutList.some(m => m.name === n))
      .sort((a, b) => b[1] - a[1]).slice(0, 5)
      .map(([n]) => `<button class="chip" data-act="quick" data-name="${esc(n)}">+ ${esc(n)}</button>`).join('');

    const add = `<form class="add" data-form="add">
        ${I.plus}
        <input id="add-input" type="text" placeholder="${trip && !shopping ? 'להוסיף ברגע האחרון…' : 'מה חסר? למשל: חלב ×2, תנובה'}" aria-label="הוספת פריט" autocomplete="off" enterkeyhint="done" value="${esc(S.addText)}">
        <button class="go" type="submit">הוספה</button>
      </form>
      <div class="chips"><button class="chip pick" data-act="pick-open">${I.grid} בחירה מרשימה</button>${histChips}</div>
      ${!shopping && maybeOutList.length ? `<div class="chips maybe"><span class="mo-l">אולי נגמר?</span>${maybeOutList.map(m => `<button class="chip mo" data-act="maybe-add" data-name="${esc(m.name)}" data-cat="${esc(m.cat)}">${iconFor(m.name, m.cat)} ${esc(m.name)}</button>`).join('')}</div>` : ''}`;

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
      fab = '';
    } else if (!trip) {
      fab = `<div class="fab"><button class="btn orange" data-act="start" ${S.busy ? 'disabled' : ''}>${I.cart} אני בדרך לסופר</button></div>`;
    } else fab = '';

    const offline = !S.online ? `<div class="offline">אין חיבור כרגע · השינויים יישמרו וישתלחו כשהקליטה תחזור</div>` : '';
    const shopHeader = !shopping ? '' : `<div class="shopbar">
      <span class="sb-lamp" aria-hidden="true"></span>
      <span class="sb-t"><b>בדרך לסופר</b><small>${minsSince(trip.started_at)} דק׳ · ${inCart}/${items.length} בעגלה${cartB.known ? ' · ' + ILS(cartB.sum) : ''}</small></span>
      ${chatButton()}
      <button class="sb-more" data-act="shop-menu" aria-label="עוד אפשרויות">${I.more}</button>
      <button class="sb-done" data-act="confirm" ${S.busy ? 'disabled' : ''}>סיימתי ✓</button>
    </div>`;
    body = (shopping ? shopHeader : header) + offline + status + pushCard + add + list + (shopping ? '' : lastTripCard(items)) + fab;
  }

  const nav = `<nav class="tabs">
    <button class="${S.tab === 'list' ? 'active' : ''}" data-act="tab" data-tab="list">${I.list} סופר</button>
    <button class="${S.tab === 'stats' ? 'active' : ''}" data-act="tab" data-tab="stats">${I.stats} סטטיסטיקה</button>
    <button class="${S.tab === 'family' ? 'active' : ''}" data-act="tab" data-tab="family">${I.home} <span>משפחה${famAttention() ? '<span class="dot" aria-label="יש חדש"></span>' : ''}</span></button>
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
        <span class="pk-emo" aria-hidden="true">${iconFor(name, cat.name === CUSTOM_TAB ? undefined : cat.name)}</span>
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
  const row = { household_id: S.household.id, name, emoji: iconRaw(name, category), category, created_by: S.user.id };
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
    ${securityHtml()}
    ${S.isAdmin ? '<button class="btn ghost" data-act="admin-open">🛡️ ניהול משתמשים</button>' : ''}
    <a class="btn ghost" href="guide.html" style="text-decoration:none;display:flex;align-items:center;justify-content:center">📖 מדריך שימוש</a>
    <div style="font-size:13px;color:var(--muted)">מחובר/ת בתור ${esc(S.user.email)}</div>
    <button class="danger" data-act="signout">יציאה מהמשתמש</button>
    <footer class="set-foot"><span>בדרך לסופר · גרסה <bdi dir="ltr">${APP_VERSION}</bdi></span><span>© ${new Date().getFullYear()} כל הזכויות שמורות</span></footer>`;
}
function openSettings() { openSheet(settingsHtml(), 'tall scroll', 'settings'); loadPasskeys(); }

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
  const t = S.stats?.trips.find(x => x.id === id) || S.recent.trips.find(x => x.id === id); if (!t) return;
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

  const recent = st.trips.slice(0, 10).map(t => `<button class="trip-r" data-act="trip-view" data-id="${t.id}">
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
    <div class="card pad"><h3>קניות אחרונות</h3><div class="muted small">לחיצה על קנייה: המוצרים שנקנו (אפשר להחזיר לרשימה) והסכום מהקופה</div>${recent}</div>
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

/* ---------------- family room: "נחיתה על הדרך" + "בדרך אלינו" ---------------- */
const DEFAULT_PLACES = [['Yellow', 'fuel'], ['טיב טעם', 'super'], ['am:pm', 'super'], ['סופר יהודה', 'super'], ['סופר באבא', 'super'],
  ['דלק · מנטה', 'fuel'], ['שופרסל אקספרס', 'super'], ['קרפור סיטי', 'super'], ['סופר־פארם', 'pharm'], ['פיצוציה', 'kiosk'], ['מאפייה', 'bakery'], ['מזנון', 'food']];
const PLACE_ICON = {
  fuel: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="#FF7A1A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h12M6 8h6M14 10h2a2 2 0 0 1 2 2v4a1.5 1.5 0 0 0 3 0V8l-3-3"/></svg>',
  pharm: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="#12B76A" stroke-width="2.2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="5"/><path d="M12 8v8M8 12h8"/></svg>',
  bakery: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="#C26A1E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 11a4 4 0 0 1 3-6.5h8A4 4 0 0 1 19 11v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z"/><path d="M9 9v3M12 8v3M15 9v3"/></svg>',
  store: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="#5B3DF5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l1.5-5h15L21 9M3 9h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0zM5 13v8h14v-8M10 21v-5h4v5"/></svg>'
};
const placeIcon = k => PLACE_ICON[k] || PLACE_ICON.store;
const STAR = on => `<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" fill="${on ? '#FFB020' : 'none'}" stroke="${on ? '#E08A00' : '#8B89A3'}" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
const atPlace = p => /^[A-Za-z0-9]/.test(p) ? 'ב־' + p : 'ב' + p;
const CONV_CATS = ['מקרר', 'מאפים', 'משקאות', SNACKS, 'מזווה', 'קפואים'];
const DEL_SERVICES = ['Wolt', 'תן ביס', 'משלוחה', 'אחר'];
const STEPS = [['open', 'פתוחה'], ['ordered', 'הוזמן'], ['onway', 'בדרך 🛵'], ['arrived', 'הגיע 🍕']];

async function loadFamily(hid = S.household?.id) {
  if (!hid) return;
  const since = new Date(Date.now() - 7 * 864e5).toISOString();
  const [pl, ld, dv, ak, pk] = await Promise.all([
    sb.from('places').select('*').eq('household_id', hid),
    sb.from('landings').select('*').eq('household_id', hid).gte('created_at', since).order('created_at', { ascending: false }).limit(15),
    sb.from('deliveries').select('*').eq('household_id', hid).gte('created_at', since).order('created_at', { ascending: false }).limit(15),
    sb.from('asks').select('*').eq('household_id', hid).gte('created_at', new Date(Date.now() - 30 * 864e5).toISOString()).order('created_at', { ascending: false }).limit(60),
    sb.from('packages').select('*').eq('household_id', hid).gte('created_at', new Date(Date.now() - 30 * 864e5).toISOString()).order('created_at', { ascending: false }).limit(40)
  ]);
  if (pl.error || ld.error || dv.error) return;
  const lids = ld.data.map(x => x.id), dids = dv.data.map(x => x.id);
  const [rq, ln] = await Promise.all([
    lids.length ? sb.from('landing_requests').select('*').in('landing_id', lids).order('created_at') : { data: [] },
    dids.length ? sb.from('delivery_lines').select('*').in('delivery_id', dids).order('created_at') : { data: [] }
  ]);
  S.fam = { places: pl.data, landings: ld.data, reqs: rq.data || [], dels: dv.data, lines: ln.data || [], asks: ak.error ? [] : ak.data, pkgs: pk.error ? [] : pk.data, loaded: true };
  if (S.tab === 'family' && !famTyping()) render();
  if (S.sheetKind === 'landing') refreshLandingStars();
}
let famTimer = null;
function famReload() { clearTimeout(famTimer); famTimer = setTimeout(() => loadFamily(), 250); }
// don't redraw under someone's fingers while they type a request
const famTyping = () => ['lreq-in', 'dline-in'].includes(document.activeElement?.id) && !!document.activeElement.value;

const activeLanding = () => S.fam.landings.find(l => !l.ended_at && new Date(l.ends_at).getTime() > Date.now()) || null;
const activeDelivery = () => S.fam.dels.find(d => ['open', 'ordered', 'onway'].includes(d.status)) || null;
function allPlaces() {
  const known = new Set(S.fam.places.map(p => p.name));
  return [...S.fam.places, ...DEFAULT_PLACES.filter(([n]) => !known.has(n)).map(([name, kind]) => ({ name, kind, address: '', favorite: false }))];
}
const favPlaces = () => S.fam.places.filter(p => p.favorite).sort((a, b) => a.created_at < b.created_at ? -1 : 1);
const famErr = e => toast(isNetErr(e) ? 'אין חיבור, נסו שוב בעוד רגע' : 'לא הצלחתי לשמור');

async function land(name) {
  name = String(name || '').trim().slice(0, 40); if (!name) return;
  const p = allPlaces().find(x => x.name === name) || { name, kind: 'store', address: '' };
  const mine = activeLanding();
  if (mine && mine.user_id === S.user.id) await sb.from('landings').update({ ended_at: new Date().toISOString() }).eq('id', mine.id);
  const { data, error } = await sb.from('landings').insert({ household_id: S.household.id, user_id: S.user.id, place: p.name, address: p.address || '', ends_at: new Date(Date.now() + 12 * 60000).toISOString() }).select().single();
  if (error) return famErr(error);
  if (!S.fam.places.some(x => x.name === p.name)) sb.from('places').upsert({ household_id: S.household.id, name: p.name, kind: p.kind, favorite: false }, { onConflict: 'household_id,name', ignoreDuplicates: true }).then(() => famReload());
  S.fam.landings = [data, ...S.fam.landings.filter(l => l.id !== (mine && mine.id))];
  closeSheet(); S.tab = 'family'; render(); vibrate(40);
  toast(`נחתת ${atPlace(p.name)} · ${othersName()} קיבל/ה הודעה`);
}
async function savePlace(name, patch) {
  const p = allPlaces().find(x => x.name === name) || { name, kind: 'store', address: '', favorite: false };
  const row = { household_id: S.household.id, name, kind: p.kind || 'store', address: p.address || '', favorite: !!p.favorite, ...patch };
  const { error } = await sb.from('places').upsert(row, { onConflict: 'household_id,name' });
  if (error) { famErr(error); return false; }
  const i = S.fam.places.findIndex(x => x.name === name);
  if (i >= 0) S.fam.places[i] = { ...S.fam.places[i], ...row }; else S.fam.places.push({ ...row, created_at: new Date().toISOString() });
  famReload(); return true;
}
async function landingPatch(patch) {
  const L = activeLanding(); if (!L) return;
  const { error } = await sb.from('landings').update(patch).eq('id', L.id);
  if (error) return famErr(error);
  Object.assign(L, patch); render();
}
async function requestOnLanding(body, itemId = null, done = false) {
  const L = activeLanding(); if (!L || !body) return;
  const row = { landing_id: L.id, household_id: S.household.id, user_id: S.user.id, body: body.slice(0, 120), item_id: itemId, done };
  const { data, error } = await sb.from('landing_requests').insert(row).select().single();
  if (error) return famErr(error);
  S.fam.reqs.push(data); render(); vibrate(20);
  toast(done ? 'נשלח ל' + nameOf(L.user_id) : 'הבקשה נשלחה ל' + nameOf(L.user_id));
}
async function requestDone(id) {
  const r = S.fam.reqs.find(x => x.id === id); if (!r) return;
  const { error } = await sb.from('landing_requests').update({ done: true }).eq('id', id);
  if (error) return famErr(error);
  r.done = true;
  if (r.item_id && S.items.some(i => i.id === r.item_id)) deleteItem(r.item_id);  // bought on the way: off the supermarket list
  render();
}
async function openDeliveryNow(fd) {
  const service = DEL_SERVICES.includes(fd.service) ? fd.service : 'Wolt';
  const mins = Math.min(60, Math.max(3, parseInt(fd.mins, 10) || 10));
  const row = { household_id: S.household.id, opener_id: S.user.id, service: service === 'אחר' ? 'משלוח' : service,
    vendor: String(fd.vendor || '').trim().slice(0, 60), status: 'open', closes_at: new Date(Date.now() + mins * 60000).toISOString(), updated_by: S.user.id };
  const { data, error } = await sb.from('deliveries').insert(row).select().single();
  if (error) return famErr(error);
  S.fam.dels.unshift(data);
  const mine = String(fd.mine || '').trim();
  if (mine) await addDeliveryLine(data.id, mine, true);
  closeSheet(); S.tab = 'family'; render();
  toast('ההזמנה נפתחה · ' + othersName() + ' קיבל/ה הודעה');
}
async function addDeliveryLine(did, body, quiet = false) {
  body = String(body || '').trim().slice(0, 200); if (!body) return;
  const { data, error } = await sb.from('delivery_lines').insert({ delivery_id: did, household_id: S.household.id, user_id: S.user.id, body }).select().single();
  if (error) return famErr(error);
  S.fam.lines.push(data); if (!quiet) { render(); vibrate(20); }
}
async function deliveryPatch(id, patch) {
  const d = S.fam.dels.find(x => x.id === id); if (!d) return;
  patch = { ...patch, updated_by: S.user.id, updated_at: new Date().toISOString() };
  const { error } = await sb.from('deliveries').update(patch).eq('id', id);
  if (error) return famErr(error);
  Object.assign(d, patch); render();
  if (patch.status === 'arrived') { vibrate([60, 40, 120]); toast('🍕 בתאבון!'); }
}

function landingCard() {
  const favs = favPlaces();
  return `<section class="fam-card land">
    <div class="fam-h"><div><h2>נחיתה על הדרך</h2><p>עצרת בחנות? כולם יודעים ויכולים לבקש</p></div>
      <img class="fam-ill" src="icons/land.svg" alt=""></div>
    ${favs.length ? `<div class="fam-l">⭐ על הדרך שלי · לחיצה אחת ונחתת</div>
      <div class="fav-grid">${favs.map(p => `<button class="fav" data-act="land" data-name="${esc(p.name)}">${placeIcon(p.kind)}<span>${esc(p.name)}</span></button>`).join('')}</div>`
      : `<div class="fam-l">סמנו ⭐ את המקומות הקבועים שלכם, והם יופיעו כאן</div>`}
    <button class="btn orange fam-btn" data-act="land-open">${favs.length ? 'נחתתי במקום אחר…' : 'נחתתי…'}</button>
  </section>`;
}
function myLandingCard(L) {
  const reqs = S.fam.reqs.filter(r => r.landing_id === L.id && r.user_id !== S.user.id);
  return `<section class="fam-card land live">
    <div class="fam-h"><div><h2>נחתת ${esc(atPlace(L.place))}</h2><p>${L.address ? esc(L.address) + ' · ' : ''}${esc(othersName())} יודע/ת · עד ${hhmm(L.ends_at)}</p></div>
      <img class="fam-ill" src="icons/land.svg" alt=""></div>
    ${landingPkgBox(L)}
    ${landingAsksBox(L)}
    <div class="reqs">${reqs.length ? reqs.map(r => `<div class="req ${r.done ? 'done' : ''}">
        <span class="av sm" style="background:${colorOf(r.user_id)}">${esc(initial(r.user_id))}</span>
        <span class="req-t">${r.item_id ? iconFor(r.body) + ' ' : ''}${esc(r.body)}</span>
        ${r.done ? '<span class="req-ok">✓</span>' : `<button class="req-btn" data-act="lreq-done" data-id="${r.id}">קניתי ✓</button>`}
      </div>`).join('') : `<div class="req-empty">עוד אין בקשות. ${esc(othersName())} קיבל/ה הודעה, ובקשות יופיעו כאן.</div>`}</div>
    <div class="row2"><button class="btn ghost" data-act="land-more">עוד 5 דק׳</button><button class="btn orange" data-act="land-end">יצאתי מהחנות</button></div>
  </section>`;
}
function theirLandingCard(L) {
  const mine = S.fam.reqs.filter(r => r.landing_id === L.id && r.user_id === S.user.id);
  const asked = new Set(mine.map(r => r.item_id).filter(Boolean));
  const fromList = superItems().filter(i => !i.in_cart && !S.removing.has(i.id) && CONV_CATS.includes(i.category) && !asked.has(i.id)).slice(0, 8);
  const left = Math.max(1, Math.ceil((new Date(L.ends_at).getTime() - Date.now()) / 60000));
  const quick = [['לא צריך, תודה 👍', 1], ['משהו מתוק 🍫', 0], ['שתייה קרה 🥤', 0], ['קפה ☕', 0]];
  return `<section class="fam-card land live">
    <div class="fam-h"><div><h2>${esc(nameOf(L.user_id))} נחת/ה ${esc(atPlace(L.place))}</h2><p>${L.address ? esc(L.address) + ' · ' : ''}לפני ${minsSince(L.created_at) || 'פחות מ־1'} דק׳ · עוד כ־${left} דק׳ שם</p></div>
      <img class="fam-ill" src="icons/land.svg" alt=""></div>
    <div class="fam-l">בקשה מהירה</div>
    <div class="qchips">${quick.map(([t, d]) => `<button class="qchip" data-act="lreq" data-body="${esc(t)}" data-done="${d}">${esc(t)}</button>`).join('')}</div>
    ${fromList.length ? `<div class="fam-l">מהרשימה שלכם, שאולי יש גם שם</div>
      <div class="reqs">${fromList.map(i => `<div class="req"><span class="req-e" aria-hidden="true">${iconFor(i.name, i.category)}</span><span class="req-t">${esc(i.name)}${i.qty && i.qty !== '1' ? ' · ' + esc(i.qty) : ''}</span>
        <button class="req-btn" data-act="lreq-item" data-id="${i.id}">לבקש</button></div>`).join('')}</div>` : ''}
    ${mine.length ? `<div class="fam-l">ביקשת</div><div class="reqs">${mine.map(r => `<div class="req ${r.done ? 'done' : ''}"><span class="req-t">${esc(r.body)}</span><span class="req-ok">${r.done ? (r.item_id || !/לא צריך/.test(r.body) ? '✓ נקנה' : '✓') : 'נשלח'}</span></div>`).join('')}</div>` : ''}
    <form class="inline-form" data-form="lreq"><label for="lreq-in" class="sr">מה להביא</label>
      <input id="lreq-in" name="text" maxlength="120" autocomplete="off" placeholder="משהו אחר? למשל: קרח, סוללות" required>
      <button class="btn violet send" type="submit">שליחה</button></form>
  </section>`;
}
function deliveryPromo() {
  return `<section class="fam-card del">
    <div class="fam-h"><div><h2>בדרך אלינו</h2><p>מזמינים הביתה? פותחים הזמנה וכולם מצטרפים</p></div>
      <img class="fam-ill" src="icons/deliver.svg" alt=""></div>
    <button class="btn violet fam-btn" data-act="del-open">פתיחת הזמנה</button>
  </section>`;
}
function deliveryCard(D) {
  const mine = D.opener_id === S.user.id;
  const lines = S.fam.lines.filter(l => l.delivery_id === D.id);
  const left = Math.ceil((new Date(D.closes_at).getTime() - Date.now()) / 60000);
  const idx = STEPS.findIndex(([k]) => k === D.status);
  let acts = '';
  if (D.status === 'open' && mine) acts = `<button class="btn green" data-act="del-status" data-id="${D.id}" data-s="ordered">סגרתי והזמנתי ✓</button>
      <div class="row2"><button class="btn ghost" data-act="del-more" data-id="${D.id}">עוד 5 דק׳ ⏳</button><button class="btn ghost danger-t" data-act="del-status" data-id="${D.id}" data-s="cancelled">ביטול ההזמנה</button></div>`;
  else if (D.status === 'ordered') acts = `<div class="row2"><button class="btn ghost" data-act="del-status" data-id="${D.id}" data-s="onway">יצא לדרך 🛵</button><button class="btn green" data-act="del-status" data-id="${D.id}" data-s="arrived">הגיע 🍕</button></div>`;
  else if (D.status === 'onway') acts = `<button class="btn green" data-act="del-status" data-id="${D.id}" data-s="arrived">הגיע 🍕</button>`;
  const when = D.status !== 'open' ? '' : left > 0 ? `<span class="pill">⏳ מצטרפים עד ${hhmm(D.closes_at)} · עוד ${left} דק׳</span>` : `<span class="pill">⏳ זמן ההצטרפות עבר · ${mine ? 'אפשר לסגור ולהזמין' : 'עוד אפשר להוסיף עד שההזמנה נסגרת'}</span>`;
  return `<section class="fam-card del live">
    <div class="fam-h"><div><p class="who">${mine ? 'פתחת הזמנה' : esc(nameOf(D.opener_id)) + ' פתח/ה הזמנה'}</p><h2>${esc(D.service)}${D.vendor ? ' · ' + esc(D.vendor) : ''}</h2>${when}</div>
      <img class="fam-ill" src="icons/deliver.svg" alt=""></div>
    <ol class="steps">${STEPS.map(([k, t], i) => `<li class="${i <= idx ? 'on' : ''}"><span></span>${t}</li>`).join('')}</ol>
    <div class="reqs">${lines.length ? lines.map(l => `<div class="req"><span class="av sm" style="background:${colorOf(l.user_id)}">${esc(initial(l.user_id))}</span>
        <span class="req-t"><b>${esc(nameOf(l.user_id))}</b> ${esc(l.body)}</span>
        ${l.user_id === S.user.id && D.status === 'open' ? `<button class="req-x" data-act="dline-del" data-id="${l.id}" aria-label="הסרה">${I.x}</button>` : ''}</div>`).join('')
      : '<div class="req-empty">עוד אף אחד לא הוסיף. מה מזמינים?</div>'}</div>
    ${D.status === 'open' ? `<form class="inline-form" data-form="dline" data-id="${D.id}"><label for="dline-in" class="sr">מה להוסיף להזמנה</label>
      <input id="dline-in" name="text" maxlength="200" autocomplete="off" placeholder="מה את/ה רוצה? למשל: צ׳יפס גדול" required>
      <button class="btn violet send" type="submit">${lines.some(l => l.user_id === S.user.id) ? 'הוספה' : 'הצטרפות'}</button></form>` : ''}
    ${acts}
  </section>`;
}
function familyFeed() {
  const L = activeLanding(), D = activeDelivery();
  const ev = [
    ...S.fam.landings.filter(l => l !== L).map(l => ({ t: l.created_at, html: `🏍️ ${esc(nameOf(l.user_id))} נחת/ה ${esc(atPlace(l.place))}` + (() => { const n = S.fam.reqs.filter(r => r.landing_id === l.id && r.user_id !== l.user_id && !/לא צריך/.test(r.body)).length; return n ? ` · ${n} בקשות` : ''; })() })),
    ...S.fam.dels.filter(d => d !== D && d.status !== 'cancelled').map(d => ({ t: d.created_at, html: `🍕 משלוח מ${esc(d.service)}${d.vendor ? ' · ' + esc(d.vendor) : ''}` }))
  ].sort((a, b) => a.t < b.t ? 1 : -1).slice(0, 5);
  if (!ev.length) return '';
  return `<section class="card pad fam-feed"><h3>לאחרונה</h3>${ev.map(e => `<div>${e.html} · <span class="muted">${relDay(e.t)} ${hhmm(e.t)}</span></div>`).join('')}</section>`;
}
function renderFamily() {
  const L = activeLanding(), D = activeDelivery();
  const top = `<div class="top"><div><div class="sub">${esc(S.household.name)}</div><h1>חדר משפחה</h1></div>${chatButton()}</div>`;
  if (!S.fam.loaded) return top + '<div class="empty">טוען…</div>';
  return top + `<div class="fam">
    ${D ? deliveryCard(D) : ''}
    ${L ? (L.user_id === S.user.id ? myLandingCard(L) : theirLandingCard(L)) : ''}
    ${S.fam.pkgs.some(pkgLive) ? pkgSection() : ''}
    ${asksSection()}
    ${S.fam.pkgs.some(pkgLive) ? '' : pkgSection()}
    ${L && L.user_id === S.user.id ? '' : landingCard()}
    ${D ? '' : deliveryPromo()}
    ${familyFeed()}
  </div>`;
}
const famAttention = () => { const L = activeLanding(), D = activeDelivery(); return (L && L.user_id !== S.user?.id) || S.fam.asks.some(a => a.status === 'open' && askForMe(a)) || S.fam.pkgs.some(p => p.status === 'open' && p.user_id !== S.user?.id) || (D && D.status === 'open' && D.opener_id !== S.user?.id && !S.fam.lines.some(l => l.delivery_id === D.id && l.user_id === S.user?.id)); };

function landingSheetHtml() {
  const favs = favPlaces(), favNames = new Set(favs.map(p => p.name));
  const rest = allPlaces().filter(p => !favNames.has(p.name));
  return `${sheetHead('איפה נחתת?')}
    <form class="land-q" data-form="land-new"><label for="land-q" class="sr">חיפוש או מקום חדש</label>
      <input id="land-q" name="q" maxlength="40" autocomplete="off" placeholder="חיפוש, או שם של מקום חדש">
      <button class="btn orange send" type="submit">נחתתי</button></form>
    ${favs.length ? `<div class="fam-l o">⭐ על הדרך שלי</div><div class="pl-list">${favs.map(p => `<div class="pl-row" data-pn="${esc(p.name)}">
        <button class="pl-main" data-act="land" data-name="${esc(p.name)}"><span class="pl-i">${placeIcon(p.kind)}</span><span><b>${esc(p.name)}</b><small>${p.address ? esc(p.address) : 'הוספת כתובת ✎'}</small></span></button>
        <button class="pl-ed" data-act="place-edit" data-name="${esc(p.name)}" aria-label="כתובת של ${esc(p.name)}">✎</button>
        <button class="pl-star" data-act="fav" data-name="${esc(p.name)}" aria-label="הסרה מהמועדפים">${STAR(true)}</button></div>`).join('')}</div>` : ''}
    <div class="fam-l">עוד מקומות · ☆ מוסיף ל"על הדרך שלי"</div>
    <div class="pl-grid">${rest.map(p => `<div class="pl-cell" data-pn="${esc(p.name)}"><button class="pl-main" data-act="land" data-name="${esc(p.name)}">${esc(p.name)}</button>
      <button class="pl-star" data-act="fav" data-name="${esc(p.name)}" aria-label="הוספה למועדפים">${STAR(false)}</button></div>`).join('')}</div>`;
}
function openLanding() { openSheet(landingSheetHtml(), 'tall scroll', 'landing'); }
function refreshLandingStars() { if (S.sheetKind === 'landing' && !document.getElementById('land-q')?.value) setSheet(landingSheetHtml()); }
function filterPlaces(q) {
  q = q.trim();
  sheetRoot.querySelectorAll('[data-pn]').forEach(el => { el.hidden = !!q && !el.dataset.pn.includes(q) && !el.dataset.pn.toLowerCase().includes(q.toLowerCase()); });
}
function openPlaceEdit(name) {
  const p = allPlaces().find(x => x.name === name) || { name, address: '' };
  openSheet(`${sheetHead(esc(p.name))}
    <form data-form="place" data-name="${esc(p.name)}" style="display:flex;flex-direction:column;gap:12px">
      <div class="field"><label for="pl-a">כתובת או סניף (מופיע בהודעה)</label><input id="pl-a" name="address" maxlength="60" value="${esc(p.address || '')}" placeholder="למשל: בבלי 17"></div>
      <button class="btn violet" type="submit">שמירה</button></form>
    <button class="btn ghost" data-act="land-open">חזרה</button>`, '', 'place');
}
function openDeliveryForm() {
  openSheet(`${sheetHead('פתיחת הזמנה')}
    <form data-form="del-new" style="display:flex;flex-direction:column;gap:14px">
      <fieldset class="seg"><legend>מאיפה מזמינים</legend>${DEL_SERVICES.map((s, i) => `<label><input type="radio" name="service" value="${s}" ${i ? '' : 'checked'}><span>${s}</span></label>`).join('')}</fieldset>
      <div class="field"><label for="dv-v">מסעדה או חנות</label><input id="dv-v" name="vendor" maxlength="60" placeholder="למשל: הפיצרייה בשכונה" autocomplete="off"></div>
      <fieldset class="seg"><legend>מצטרפים במשך</legend>${[5, 10, 15, 20].map(m => `<label><input type="radio" name="mins" value="${m}" ${m === 10 ? 'checked' : ''}><span>${m} דק׳</span></label>`).join('')}</fieldset>
      <div class="field"><label for="dv-m">מה את/ה מזמין/ה (לא חובה)</label><input id="dv-m" name="mine" maxlength="200" autocomplete="off" placeholder="למשל: פיצה משפחתית חצי זיתים"></div>
      <button class="btn violet" type="submit">פתיחה ושליחה ל${esc(othersName())}</button>
    </form>`, 'tall scroll', 'delivery');
}

/* ---------------- family room: "מי יכול להביא לי?" ---------------- */
/* ---------------- "החבילה עוברת": a package waiting for pickup, someone in the house takes it ---------------- */
const PKG_KINDS = [['post', 'סניף דואר'], ['locker', 'לוקר'], ['store', 'חנות / נקודה']];
const PKG_KIND_LABEL = Object.fromEntries(PKG_KINDS);
const pkgLive = p => ['open', 'taken', 'arrived'].includes(p.status);
const pkgOwner = p => p.owner_name || nameOf(p.user_id);
const pkgThanked = new Set(LS.get('ha_pkg_thanked', []));
function pkgDueLabel(p) {
  if (!p.due) return '';
  const today = new Date(new Date().toDateString()), d = new Date(p.due + 'T00:00:00');
  const days = Math.round((d - today) / 864e5);
  if (days < 0) return 'עבר התאריך';
  if (days === 0) return 'עד היום';
  if (days === 1) return 'עד מחר';
  return 'עד ' + d.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'numeric' });
}
// fill the form from a pasted SMS (Israel Post, lockers, pickup points)
function parsePkgSms(t) {
  const out = {}; t = String(t || '');
  const trk = t.match(/\b([A-Z]{2}\d{9}[A-Z]{2})\b/i) || t.match(/(?:מעקב|משלוח|דבר דואר|חבילה|tracking)[^\d]{0,15}(\d{8,22})/i);
  if (trk) out.tracking = trk[1].toUpperCase();
  const code = t.match(/(?:קוד(?:\s*(?:ה?איסוף|לאיסוף|ה?פתיחה|ה?מסירה|אימות))?|code|pin)\D{0,12}(\d{3,8})/i);
  if (code && code[1] !== out.tracking) out.code = code[1];
  const due = t.match(/(?:עד|לא יאוחר מ|until|by)\D{0,12}(\d{1,2})[./](\d{1,2})(?:[./](\d{2,4}))?/i) || t.match(/\b(\d{1,2})[./](\d{1,2})[./](\d{2,4})\b/);
  if (due) {
    const now = new Date(), dd = +due[1], mm = +due[2];
    let yy = due[3] ? +due[3] : now.getFullYear(); if (yy < 100) yy += 2000;
    let d = new Date(yy, mm - 1, dd);
    if (!due[3] && d < new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30)) d = new Date(yy + 1, mm - 1, dd);
    if (dd >= 1 && dd <= 31 && mm >= 1 && mm <= 12) out.due = d.toLocaleDateString('sv-SE');
  }
  if (/לוקר|locker|תא\s*מספר/i.test(t)) out.kind = 'locker';
  else if (/דואר|סניף/.test(t)) out.kind = 'post';
  else if (/נקודת|נקודה|חנות|pickup/i.test(t)) out.kind = 'store';
  const pl = t.match(/(סניף\s+[^.,\n:;]{2,40})/) || t.match(/(?:בלוקר|לוקר)\s+(?:ב)?([^.,\n:;]{2,40})/) || t.match(/בנקודת(?:\s*ה?איסוף)?\s+([^.,\n:;]{2,40})/);
  if (pl) out.place = ((/דואר ישראל/.test(t) && /^סניף/.test(pl[1])) ? 'דואר ישראל · ' : (out.kind === 'locker' ? 'לוקר · ' : '')) + pl[1].trim().replace(/\s+(?:קוד|עד|ניתן|לאיסוף).*$/, '');
  return out;
}
function pkgSheetHtml() {
  const names = [...new Set(Object.values(S.members).map(m => m.display_name))];
  const myName = me()?.display_name || '';
  return `${sheetHead('חבילה חדשה')}
    <form data-form="pkg" class="pkg-form">
      <div class="field"><label for="pkg-sms">מדביקים את ה־SMS, והפרטים מתמלאים לבד</label>
        <textarea id="pkg-sms" rows="3" maxlength="600" placeholder="הדביקו כאן את ההודעה מהדואר או מהלוקר (לא חובה)"></textarea>
        <span class="pkg-found" id="pkg-found" hidden></span></div>
      <fieldset class="seg"><legend>איפה מחכה</legend>${PKG_KINDS.map(([k, t]) => `<label><input type="radio" name="kind" value="${k}" ${k === 'post' ? 'checked' : ''}><span>${t}</span></label>`).join('')}</fieldset>
      <div class="pkg-grid">
        <div class="field wide"><label for="pkg-place">מקום</label><input id="pkg-place" name="place" maxlength="80" required autocomplete="off" placeholder="למשל: דואר ישראל · סניף הרצל"></div>
        <div class="field"><label for="pkg-trk">מספר מעקב</label><input id="pkg-trk" name="tracking" maxlength="40" dir="ltr" autocomplete="off"></div>
        <div class="field"><label for="pkg-code">קוד איסוף</label><input id="pkg-code" name="code" maxlength="20" dir="ltr" inputmode="numeric" autocomplete="off"></div>
        <div class="field"><label for="pkg-due">לאסוף עד</label><input id="pkg-due" name="due" type="date"></div>
        <div class="field"><label for="pkg-owner">על שם</label><input id="pkg-owner" name="owner" maxlength="30" list="pkg-names" value="${esc(myName)}" autocomplete="off"><datalist id="pkg-names">${names.map(n => `<option value="${esc(n)}">`).join('')}</datalist></div>
      </div>
      <div class="pkg-id" id="pkg-id">מי שאוסף יקבל תזכורת: בסניף דואר צריך ת״ז של בעל החבילה או ייפוי כוח. מספר ת״ז לא נשמר באפליקציה.</div>
      <button class="btn violet" type="submit">שליחה לבית</button>
    </form>`;
}
function openPkgForm() { openSheet(pkgSheetHtml(), 'tall scroll', 'pkg'); setTimeout(() => document.getElementById('pkg-sms')?.focus(), 250); }
function applyPkgSms(text) {
  const f = parsePkgSms(text), set = (id, v) => { const el = document.getElementById(id); if (el && v) el.value = v; };
  set('pkg-trk', f.tracking); set('pkg-code', f.code); set('pkg-due', f.due); set('pkg-place', f.place);
  if (f.kind) { const r = document.querySelector(`form[data-form="pkg"] input[name="kind"][value="${f.kind}"]`); if (r) { r.checked = true; pkgKindChanged(); } }
  const n = ['tracking', 'code', 'due', 'place', 'kind'].filter(k => f[k]).length;
  const el = document.getElementById('pkg-found');
  if (el) { el.hidden = !text.trim(); el.textContent = n ? `✓ זוהו ${n} פרטים, אפשר לתקן` : 'לא זיהיתי פרטים, אפשר למלא ידנית'; el.classList.toggle('none', !n); }
}
function pkgKindChanged() {
  const k = document.querySelector('form[data-form="pkg"] input[name="kind"]:checked')?.value;
  const el = document.getElementById('pkg-id'); if (el) el.hidden = k !== 'post';
}
async function newPkg(fd) {
  const place = String(fd.place || '').trim().slice(0, 80); if (!place) return;
  const row = { household_id: S.household.id, user_id: S.user.id, status: 'open', updated_by: S.user.id,
    kind: PKG_KINDS.some(([k]) => k === fd.kind) ? fd.kind : 'post', place,
    tracking: String(fd.tracking || '').trim().slice(0, 40) || null, code: String(fd.code || '').trim().slice(0, 20) || null,
    due: /^\d{4}-\d{2}-\d{2}$/.test(fd.due || '') ? fd.due : null, owner_name: String(fd.owner || '').trim().slice(0, 30) };
  const { data, error } = await sb.from('packages').insert(row).select().single();
  if (error) return famErr(error);
  S.fam.pkgs.unshift(data); closeSheet(); S.tab = 'family'; render(); vibrate(30);
  toast('החבילה נשלחה ל' + othersName() + ' 📦');
}
async function pkgPatch(id, patch, msg) {
  const p = S.fam.pkgs.find(x => x.id === id); if (!p) return;
  patch = { ...patch, updated_by: S.user.id, updated_at: new Date().toISOString() };
  const { error } = await sb.from('packages').update(patch).eq('id', id);
  if (error) return famErr(error);
  Object.assign(p, patch);
  if (S.sheetKind === 'pkg-go') { if (pkgLive(p) && p.taker_id === S.user.id) setSheet(pkgGoHtml(p)); else closeSheet(); }
  render(); if (msg) toast(msg); vibrate(30);
}
async function pkgThanks(id) {
  const p = S.fam.pkgs.find(x => x.id === id); if (!p || !p.taker_id) return;
  pkgThanked.add(id); LS.set('ha_pkg_thanked', [...pkgThanked].slice(-60)); render();
  await sendMessage({ body: `❤ תודה שאספת לי את החבילה!` });
  toast('התודה נשלחה ל' + nameOf(p.taker_id) + ' ❤');
}
const mapsUrl = q => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
function pkgGoHtml(p) {
  const step = p.status === 'arrived' ? 2 : 1;
  const st = (n, t) => `<li class="${n < step + 1 ? 'ok' : n === step + 1 ? 'now' : ''}"><span>${n <= step ? '✓' : n}</span>${t}</li>`;
  return `${sheetHead('בדרך לחבילה')}
    <div class="pkg-go">
      <div class="pkg-go-h"><small>החבילה של ${esc(pkgOwner(p))} · ${PKG_KIND_LABEL[p.kind]}</small><b>${esc(p.place)}</b>${p.due ? `<small>${pkgDueLabel(p)}</small>` : ''}</div>
      <ol class="pkg-steps">${st(1, 'אני על זה')}${st(2, 'הגעתי למקום')}${st(3, 'החבילה אצלי')}</ol>
      ${p.code ? `<div class="pkg-code"><small>קוד איסוף</small><b dir="ltr">${esc(p.code)}</b></div>` : ''}
      ${p.tracking ? `<div class="pkg-trk"><small>מספר מעקב</small><b dir="ltr">${esc(p.tracking)}</b><button class="pkg-copy" data-act="pkg-copy" data-v="${esc(p.tracking)}" aria-label="העתקת מספר המעקב"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg></button></div>` : ''}
      ${p.kind === 'post' ? `<div class="pkg-id">לקחת ת״ז של ${esc(pkgOwner(p))} או ייפוי כוח חתום</div>` : ''}
      <a class="btn soft pkg-nav" href="${mapsUrl(p.place)}" target="_blank" rel="noopener">📍 ניווט</a>
      ${p.status === 'taken' ? `<button class="btn orange" data-act="pkg-arrived" data-id="${p.id}">הגעתי למקום</button>` : ''}
      <button class="btn green-b" data-act="pkg-done" data-id="${p.id}">📦 החבילה אצלי</button>
      <button class="link" data-act="pkg-drop" data-id="${p.id}">לא מסתדר לי, לשחרר לאחרים</button>
    </div>`;
}
function openPkgGo(id) { const p = S.fam.pkgs.find(x => x.id === id); if (p) openSheet(pkgGoHtml(p), 'tall scroll', 'pkg-go'); }
function pkgCard(p) {
  const mine = p.user_id === S.user.id, iTook = p.taker_id === S.user.id;
  const due = pkgDueLabel(p), hot = due === 'עד היום' || due === 'עד מחר' || due === 'עבר התאריך';
  let state = '', acts = '';
  if (p.status === 'open') {
    state = mine ? '<span class="ask-st wait">מחכה למתנדב</span>' : '';
    acts = `<button class="ask-btn violet" data-act="pkg-take" data-id="${p.id}">יאללה, אני על זה</button>
      ${mine ? `<div class="row2"><button class="ask-btn ghost" data-act="pkg-self" data-id="${p.id}">אספתי בעצמי</button><button class="ask-btn ghost" data-act="pkg-cancel" data-id="${p.id}">ביטול</button></div>` : ''}`;
  } else if (p.status === 'taken' || p.status === 'arrived') {
    const where = p.status === 'arrived' ? 'במקום' : 'בדרך';
    if (iTook) { state = `<span class="ask-st me">את/ה ${where}</span>`; acts = `<button class="ask-btn violet" data-act="pkg-go" data-id="${p.id}">פתיחת פרטי האיסוף</button>`; }
    else state = `<span class="ask-st">${esc(nameOf(p.taker_id))} ${where}</span>`;
  } else if (p.status === 'done') {
    state = `<span class="ask-st ok">✓ ${p.taker_id ? (iTook ? 'אצלך' : 'אצל ' + esc(nameOf(p.taker_id))) : 'נאספה'}</span>`;
    if (mine && p.taker_id && !iTook && !pkgThanked.has(p.id)) acts = `<button class="ask-btn pink" data-act="pkg-thanks" data-id="${p.id}">❤ תודה ל${esc(nameOf(p.taker_id))}</button>`;
  }
  return `<div class="pkg ${iTook && pkgLive(p) ? 'took' : ''} ${p.status === 'done' ? 'done' : ''}">
    <div class="ask-top"><span class="pkg-ico" aria-hidden="true">📦</span>
      <div class="ask-t"><b>החבילה של ${esc(pkgOwner(p))}</b><small>${esc(p.place)} · ${PKG_KIND_LABEL[p.kind]}</small></div>${state}</div>
    ${p.status !== 'done' ? `<div class="ask-chips">${due ? `<span class="${hot ? 'hot' : ''}">⏰ ${due}</span>` : ''}${p.code ? '<span>יש קוד איסוף</span>' : ''}${p.kind === 'post' ? '<span>ת״ז או ייפוי כוח</span>' : ''}</div>` : ''}
    ${acts}</div>`;
}
function pkgSection() {
  const recent = S.fam.pkgs.filter(p => p.status === 'done' && Date.now() - new Date(p.updated_at).getTime() < 24 * 3600e3);
  const list = [...S.fam.pkgs.filter(pkgLive), ...recent];
  return `<section class="fam-card pkg-card">
    <div class="fam-h"><div><h2>החבילה עוברת</h2><p>חבילה מחכה לאיסוף? מי שעובר ליד לוקח</p></div><img class="fam-ill" src="icons/pkg.svg" alt=""></div>
    ${list.length ? `<div class="asks">${list.map(pkgCard).join('')}</div>` : '<div class="req-empty ask-empty">אין חבילות שמחכות. קיבלתם הודעה על חבילה? שולחים לבית, ומי שעובר ליד אוסף.</div>'}
    <button class="btn ink fam-btn" data-act="pkg-new">+ קיבלתי הודעה על חבילה</button>
  </section>`;
}
// someone landed at the place where a family package is waiting
const pkgNorm = s => String(s || '').replace(/דואר ישראל|לוקר|סניף|·|[-–־"'׳״]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
function landingPkgBox(L) {
  const lp = pkgNorm(L.place);
  const fit = S.fam.pkgs.filter(p => p.status === 'open' && lp && (pkgNorm(p.place).includes(lp) || lp.includes(pkgNorm(p.place))));
  if (!fit.length) return '';
  return `<div class="ask-match pkg-match"><b>📦 יש כאן חבילה של הבית</b>
    ${fit.map(p => `<div class="am-row"><span class="am-t"><b>החבילה של ${esc(pkgOwner(p))}</b><small>${pkgDueLabel(p) || PKG_KIND_LABEL[p.kind]}</small></span>
      <button class="ask-btn violet" data-act="pkg-take" data-id="${p.id}">אני לוקח/ת</button></div>`).join('')}</div>`;
}

/* ---- one-time "what's new" after an update ---- */
const WHATS_NEW = { 'v1.10.0': { title: '✨ עודכנה הגרסה · יש חדש בחדר המשפחה', body: 'החבילה עוברת 📦 לחצו לראות · תהנו!' } };
let whatsNewTries = 0;
function maybeWhatsNew() {
  if (LS.get('ha_seen_ver', '') === APP_VERSION) return;
  if (!S.household || S.locked || S.cover || S.booting || document.hidden) { if (whatsNewTries++ < 60) setTimeout(maybeWhatsNew, 2000); return; }
  LS.set('ha_seen_ver', APP_VERSION);
  const w = WHATS_NEW[APP_VERSION];
  if (w && S.wasUser) showInfoBanner({ title: w.title, body: w.body, act: 'whats-new', persistent: true });
}

const ASK_PLACES = [['pharm', '💊 בית מרקחת'], ['home', '🔧 כלי בית'], ['post', '📮 דואר'], ['fuel', '⛽ תחנת דלק'], ['store', '🏪 מכולת'], ['any', 'איפה שיש']];
const ASK_DUE = [['today', 'היום'], ['tomorrow', 'מחר'], ['week', 'השבוע'], ['none', 'לא דחוף']];
const ASK_PLACE_LABEL = Object.fromEntries(ASK_PLACES);
// which kinds of stop can serve which kind of request
const ASK_MATCH = { pharm: ['pharm'], fuel: ['fuel'], store: ['super', 'kiosk', 'store', 'fuel', 'food', 'bakery'], home: ['store'], post: [], any: null };
const askMatchesPlace = (a, placeName) => {
  const kind = allPlaces().find(p => p.name === placeName)?.kind || 'store';
  const ok = ASK_MATCH[a.place_kind]; return ok === null || ok === undefined || ok.includes(kind);
};
const askForMe = a => a.user_id !== S.user.id && (!a.to_user || a.to_user === S.user.id);
const openAsks = () => S.fam.asks.filter(a => a.status === 'open' || a.status === 'taken');
const thanked = new Set(LS.get('ha_ask_thanked', []));
function dueLabel(a) {
  if (a.due === 'none') return 'לא דחוף';
  const created = new Date(a.created_at), today = new Date(new Date().toDateString());
  const end = new Date(created.toDateString()); end.setDate(end.getDate() + (a.due === 'today' ? 1 : a.due === 'tomorrow' ? 2 : 7));
  if (Date.now() >= end.getTime()) return 'באיחור';
  const daysLeft = Math.round((end - today) / 864e5);
  return daysLeft <= 1 ? 'עד היום' : daysLeft === 2 ? 'עד מחר' : 'השבוע';
}
// a request that's really a supermarket product belongs on the supermarket list
function isSuperProduct(text) {
  const m = catalogMatch(String(text || '').replace(/\s*[×x]\s*\d+$/, '').trim());
  return !!m && !['טיפוח ופארם', 'אחר'].includes(m.cat);
}

async function newAsk(fd) {
  const body = String(fd.body || '').trim().slice(0, 120); if (!body) return;
  const row = { household_id: S.household.id, user_id: S.user.id, body,
    place_kind: ASK_PLACES.some(([k]) => k === fd.place) ? fd.place : 'any',
    due: ASK_DUE.some(([k]) => k === fd.due) ? fd.due : 'week',
    to_user: fd.to && S.members[fd.to] && fd.to !== S.user.id ? fd.to : null, status: 'open', updated_by: S.user.id };
  const { data, error } = await sb.from('asks').insert(row).select().single();
  if (error) return famErr(error);
  S.fam.asks.unshift(data); closeSheet(); S.tab = 'family'; render(); vibrate(30);
  toast('הבקשה נשלחה ל' + (row.to_user ? nameOf(row.to_user) : othersName()));
}
async function askPatch(id, patch, msg) {
  const a = S.fam.asks.find(x => x.id === id); if (!a) return;
  patch = { ...patch, updated_by: S.user.id, updated_at: new Date().toISOString() };
  const { error } = await sb.from('asks').update(patch).eq('id', id);
  if (error) return famErr(error);
  Object.assign(a, patch); render(); if (msg) toast(msg);
}
async function askThanks(id) {
  const a = S.fam.asks.find(x => x.id === id); if (!a || !a.taker_id) return;
  thanked.add(id); LS.set('ha_ask_thanked', [...thanked].slice(-60)); render();
  await sendMessage({ body: `❤ תודה שהבאת לי ${a.body}!` });
  toast('התודה נשלחה ל' + nameOf(a.taker_id) + ' ❤');
}

function askChips(a) {
  const due = dueLabel(a);
  return `<div class="ask-chips">${a.place_kind && a.place_kind !== 'any' ? `<span>${ASK_PLACE_LABEL[a.place_kind]}</span>` : ''}
    <span class="${due === 'עד היום' || due === 'באיחור' ? 'hot' : ''}">⏰ ${due}</span></div>`;
}
function askCard(a) {
  const mine = a.user_id === S.user.id, iTook = a.taker_id === S.user.id;
  const to = a.to_user ? (a.to_user === S.user.id ? 'ביקש/ה ממך' : mine ? 'ביקשת מ' + nameOf(a.to_user) : 'ביקש/ה מ' + nameOf(a.to_user)) : 'לכולם';
  let state = '', acts = '';
  if (a.status === 'open') {
    if (mine) { state = '<span class="ask-st wait">מחכה למתנדב</span>'; acts = `<button class="ask-btn ghost" data-act="ask-cancel" data-id="${a.id}">ביטול הבקשה</button>`; }
    else acts = `<button class="ask-btn pink" data-act="ask-take" data-id="${a.id}">אני לוקח/ת 🙋</button>`;
  } else if (a.status === 'taken') {
    if (iTook) { state = '<span class="ask-st me">🙋 את/ה מביא/ה</span>'; acts = `<div class="row2"><button class="ask-btn ghost" data-act="ask-drop" data-id="${a.id}">ויתרתי</button><button class="ask-btn green" data-act="ask-done" data-id="${a.id}">הבאתי ✓</button></div>`; }
    else state = `<span class="ask-st">🙋 ${esc(nameOf(a.taker_id))} מביא/ה</span>`;
    if (mine) acts = `<button class="ask-btn ghost" data-act="ask-got" data-id="${a.id}">קיבלתי ✓</button>`;
  } else if (a.status === 'done') {
    state = `<span class="ask-st ok">✓ ${a.taker_id === S.user.id ? 'הבאת' : esc(nameOf(a.taker_id)) + ' הביא/ה'}</span>`;
    if (mine && a.taker_id && a.taker_id !== S.user.id && !thanked.has(a.id)) acts = `<button class="ask-btn pink" data-act="ask-thanks" data-id="${a.id}">❤ תודה ל${esc(nameOf(a.taker_id))}</button>`;
  }
  return `<div class="ask ${iTook && a.status === 'taken' ? 'took' : ''} ${a.status === 'done' ? 'done' : ''}">
    <div class="ask-top"><span class="av sm2" style="background:${colorOf(a.user_id)}">${esc(initial(a.user_id))}</span>
      <div class="ask-t"><b>${esc(a.body)}</b><small>${mine ? 'את/ה' : esc(nameOf(a.user_id))} · ${relDay(a.created_at)} · ${to}</small></div>${state}</div>
    ${a.status === 'done' ? '' : askChips(a)}${acts}</div>`;
}
function asksSection() {
  const recentDone = S.fam.asks.filter(a => a.status === 'done' && Date.now() - new Date(a.updated_at).getTime() < 24 * 3600e3 && (a.user_id === S.user.id || a.taker_id === S.user.id));
  const list = [...openAsks(), ...recentDone]
    .sort((x, y) => (askForMe(y) && y.status === 'open') - (askForMe(x) && x.status === 'open') || (x.created_at < y.created_at ? 1 : -1));
  return `<section class="fam-card ask-card">
    <div class="fam-h"><div><h2>מי יכול להביא לי?</h2><p>בקשות שמחכות למי שיעבור ליד</p></div><img class="fam-ill" src="icons/ask.svg" alt=""></div>
    ${list.length ? `<div class="asks">${list.map(askCard).join('')}</div>` : '<div class="req-empty ask-empty">אין בקשות פתוחות. צריך משהו? בקשו, ומי שעובר ליד יביא.</div>'}
    <button class="btn ink fam-btn" data-act="ask-new">+ בקשה חדשה</button>
  </section>`;
}
// asks that fit the shop someone just landed at
function landingAsksBox(L) {
  const fit = S.fam.asks.filter(a => a.status === 'open' && askForMe(a) && askMatchesPlace(a, L.place));
  if (!fit.length) return '';
  return `<div class="ask-match"><b>🙋 ${fit.length === 1 ? 'יש בקשה פתוחה שמתאימה לכאן' : `יש ${fit.length} בקשות פתוחות שמתאימות לכאן`}</b>
    ${fit.map(a => `<div class="am-row"><span class="av sm2" style="background:${colorOf(a.user_id)}">${esc(initial(a.user_id))}</span>
      <span class="am-t"><b>${esc(a.body)}</b><small>${dueLabel(a)}</small></span>
      <button class="ask-btn pink" data-act="ask-take" data-id="${a.id}">אני לוקח/ת 🙋</button></div>`).join('')}</div>`;
}
function askSheetHtml() {
  const others = Object.values(S.members).filter(m => m.user_id !== S.user.id);
  return `${sheetHead('מי יכול להביא לי?')}
    <form data-form="ask" class="ask-form">
      <div class="field"><label for="ask-body">מה צריך?</label><input id="ask-body" name="body" maxlength="120" autocomplete="off" required placeholder="למשל: אקמול, סוללות AA, מטען"></div>
      <div class="ask-hint" id="ask-hint" hidden><div><b id="ask-hint-t"></b> הוא מוצר מהסופר. להוסיף אותו לרשימת הסופר במקום?</div>
        <div class="row2"><button type="button" class="ask-btn orange" data-act="ask-to-list">לרשימת הסופר 🛒</button><button type="button" class="ask-btn ghost" data-act="ask-hint-no">לא, זו בקשה</button></div></div>
      <fieldset class="seg"><legend>מאיפה (לא חובה)</legend>${ASK_PLACES.map(([k, t]) => `<label><input type="radio" name="place" value="${k}" ${k === 'any' ? 'checked' : ''}><span>${t}</span></label>`).join('')}</fieldset>
      <fieldset class="seg"><legend>עד מתי</legend>${ASK_DUE.map(([k, t]) => `<label><input type="radio" name="due" value="${k}" ${k === 'week' ? 'checked' : ''}><span>${t}</span></label>`).join('')}</fieldset>
      ${others.length > 1 ? `<fieldset class="seg"><legend>ממי מבקשים</legend><label><input type="radio" name="to" value="" checked><span>כולם</span></label>${others.map(m => `<label><input type="radio" name="to" value="${m.user_id}"><span>${esc(m.display_name)}</span></label>`).join('')}</fieldset>` : ''}
      <button class="btn pink-b" type="submit">שליחת הבקשה</button>
    </form>`;
}
function openAskForm() { S.askHintOff = false; openSheet(askSheetHtml(), 'tall scroll', 'ask'); setTimeout(() => document.getElementById('ask-body')?.focus(), 250); }
function updateAskHint(v) {
  const h = document.getElementById('ask-hint'); if (!h) return;
  const show = !S.askHintOff && isSuperProduct(v);
  h.hidden = !show; if (show) document.getElementById('ask-hint-t').textContent = v.trim();
}

/* ---------------- owner's user management (server checks it's really the owner) ---------------- */
async function loadStatus() {
  const { data, error } = await sb.rpc('my_status');
  if (error || !data) return;
  S.isAdmin = !!data.admin; S.suspended = !!data.suspended;
}
function renderSuspended() {
  app.innerHTML = `<div class="auth suspended">
    <span class="sus-ico"><svg viewBox="0 0 24 24" width="48" height="48" aria-hidden="true" fill="none" stroke="#5E5C78" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 9v6M14 9v6"/></svg></span>
    <h1>החשבון הושהה</h1>
    <p>הגישה לאפליקציה מהמשתמש הזה הופסקה זמנית.<br>לפרטים אפשר לפנות לדותן, שמנהל את "בדרך לסופר".</p>
    ${S.suspendedEmail || S.user?.email ? `<p class="small muted" dir="ltr">${esc(S.suspendedEmail || S.user.email)}</p>` : ''}
    <button class="btn ghost" data-act="suspended-out">יציאה</button>
  </div>`;
}
async function adminCall(action, extra = {}) {
  try { return await notifyOnce(action, extra); } catch (e) { return { error: isNetErr(e) ? 'אין חיבור' : (e.message || 'שגיאה') }; }
}
async function loadAdmin() {
  S.adm = { ...(S.adm || {}), loading: true }; render();
  const r = await adminCall('admin_list');
  if (r.error) { S.adm = { ...(S.adm || {}), loading: false }; toast(r.error === 'forbidden' ? 'אין הרשאה' : 'לא הצלחתי לטעון'); render(); return; }
  S.adm = { users: r.users || [], mine: r.myHousehold, admin: r.admin, filter: S.adm?.filter || 'all', loading: false, backups: S.adm?.backups };
  render(); loadBackups();
}
/* ---- backups (owner only): weekly automatic + manual, download as a password-encrypted file ---- */
async function loadBackups() {
  const r = await adminCall('admin_backups');
  if (r.error) return;
  S.adm = { ...(S.adm || {}), backups: r.backups || [] };
  if (S.tab === 'admin') render();
}
const kb = n => n < 1024 ? n + ' B' : n < 1048576 ? Math.round(n / 1024) + ' KB' : (n / 1048576).toFixed(1) + ' MB';
function backupsHtml() {
  const bs = S.adm?.backups;
  const last = bs?.[0];
  const rows = (bs || []).map(b => `<div class="adm-row bk-row">
      <span class="bk-ico" aria-hidden="true">${b.kind === 'manual' ? '✋' : '🗓️'}</span>
      <span class="adm-t"><b>${new Date(b.created_at).toLocaleDateString('he-IL')} · ${hhmm(b.created_at)}</b><small>${b.kind === 'manual' ? 'ידני' : 'אוטומטי'} · <bdi dir="ltr">${kb(b.size_bytes)}</bdi> · ${b.counts?.items ?? 0} פריטים · ${b.counts?.households ?? 0} בתים</small></span>
      <button class="adm-btn soft" data-act="backup-dl" data-id="${b.id}">הורדה</button></div>`).join('');
  return `<section class="card adm-h"><div class="adm-hh"><b>💾 גיבויים</b><span>${last ? 'אחרון: ' + admWhen(last.created_at) : bs ? 'עוד אין' : 'טוען…'}</span></div>
    <div class="bk-lead">גיבוי אוטומטי כל שבוע (שישי בלילה). נשמרים 10 האחרונים. כדאי להוריד עותק פעם בחודש ולשמור אותו בדרייב.</div>
    ${rows}
    <div class="bk-act"><button class="btn soft" data-act="backup-now" ${S.bkBusy ? 'disabled' : ''}>${S.bkBusy ? 'מגבה…' : 'גיבוי עכשיו'}</button></div></section>`;
}
async function backupNow() {
  S.bkBusy = true; render();
  const r = await adminCall('admin_backup_now');
  S.bkBusy = false;
  if (r.error) { toast('הגיבוי נכשל: ' + r.error); render(); return; }
  toast('הגיבוי נשמר ✓'); loadBackups();
}
function openBackupDl(id) {
  const b = (S.adm?.backups || []).find(x => x.id === id); if (!b) return;
  openSheet(`${sheetHead('הורדת גיבוי')}
    <div class="lead">הקובץ יוצפן בסיסמה שתבחר. <b>בלי הסיסמה אי אפשר לפתוח אותו</b>, אז שמור אותה במנהל הסיסמאות.</div>
    <form data-form="backup-dl" data-id="${id}" style="display:flex;flex-direction:column;gap:12px">
      <div class="field"><label for="bk-pw">סיסמה לקובץ</label><input id="bk-pw" name="pw" type="password" minlength="10" autocomplete="new-password" required dir="ltr"></div>
      <div class="field"><label for="bk-pw2">שוב, לאימות</label><input id="bk-pw2" name="pw2" type="password" minlength="10" autocomplete="new-password" required dir="ltr"></div>
      <div class="err" id="bk-err"></div>
      <button class="btn violet" type="submit">הצפנה והורדה</button>
    </form>`, '', 'backup-dl');
}
async function backupDownload(id, pw, pw2) {
  const err = t => { const e = document.getElementById('bk-err'); if (e) e.textContent = t; };
  if (pw !== pw2) return err('הסיסמאות לא זהות');
  if (pw.length < 10) return err('לפחות 10 תווים');
  err('מוריד ומצפין…');
  const r = await adminCall('admin_backup_get', { id });
  if (r.error || !r.gzip_b64) return err('לא הצלחתי להוריד: ' + (r.error || ''));
  const plain = Uint8Array.from(atob(r.gzip_b64), c => c.charCodeAt(0));
  // file = "BDLS1" | salt(16) | iv(12) | AES-GCM(gzip JSON); key = PBKDF2-SHA256(password, salt, 310000)
  const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 310000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plain));
  const blob = new Blob([new TextEncoder().encode('BDLS1'), salt, iv, ct], { type: 'application/octet-stream' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'backup-baderech-' + new Date(r.created_at).toLocaleDateString('sv-SE') + '.bdls';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 30000);
  closeSheet(); toast('הקובץ ירד ✓ שמור אותו בדרייב');
}
const ADM_WEEK = 7 * 864e5;
const admActive = u => u.last_active && Date.now() - new Date(u.last_active).getTime() < ADM_WEEK;
function admWhen(t) {
  if (!t) return 'אף פעם';
  const ms = Date.now() - new Date(t).getTime();
  if (ms < 15 * 60e3) return 'עכשיו';
  const d = relDay(t); return d === 'היום' ? 'היום, ' + hhmm(t) : d;
}
function renderAdmin() {
  const A = S.adm || {};
  const head = `<div class="top"><div><div class="sub">🔒 רק אתה רואה את המסך הזה</div><h1>ניהול משתמשים</h1></div>
    <button class="adm-ref" data-act="admin-refresh" aria-label="רענון">↻</button></div>`;
  if (!A.users) return head + '<div class="empty">טוען…</div>';
  const us = A.users;
  const homes = new Set(us.filter(u => u.household_id).map(u => u.household_id)).size;
  const f = A.filter;
  const pass = u => f === 'all' || (f === 'active' && admActive(u) && !u.suspended_at) || (f === 'idle' && !admActive(u) && !u.suspended_at) || (f === 'sus' && u.suspended_at);
  const groups = new Map();
  for (const u of us) { if (!pass(u)) continue; const k = u.household_id || 'none'; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(u); }
  const order = [...groups.keys()].sort((a, b) => (b === A.mine) - (a === A.mine) || (a === 'none') - (b === 'none'));
  const row = (u, mine) => {
    const status = u.suspended_at ? '<span class="adm-st sus">מושהה</span>'
      : `<span class="adm-st ${admActive(u) ? 'on' : ''}">${admActive(u) ? '● ' : ''}${admWhen(u.last_active)}</span>`;
    const act = mine ? '' : u.suspended_at ? `<button class="adm-btn green" data-act="admin-restore" data-id="${u.id}">החזרה</button>`
      : `<button class="adm-more" data-act="admin-user" data-id="${u.id}" aria-label="פעולות ל${esc(u.email)}">⋯</button>`;
    return `<div class="adm-row ${u.suspended_at ? 'sus' : ''}">
      <span class="av sm2" style="background:${u.suspended_at ? '#B5B2C8' : (u.color || '#DCDAE8')}">${esc((u.display_name || u.email || '?').charAt(0))}</span>
      <span class="adm-t"><b>${esc(u.display_name || 'בלי שם')}${u.id === A.admin ? ' · מנהל' : ''}</b><small dir="ltr">${esc(u.email)}</small></span>${status}${act}</div>`;
  };
  return head + `<div class="adm">
    <div class="adm-kpis"><div><b>${homes}</b><span>בתים</span></div><div><b>${us.length}</b><span>משתמשים</span></div><div class="g"><b>${us.filter(u => admActive(u) && !u.suspended_at).length}</b><span>פעילים השבוע</span></div></div>
    <div class="chips adm-f">${[['all', 'הכול'], ['active', 'פעילים'], ['idle', 'רדומים'], ['sus', 'מושהים']].map(([k, t]) => `<button class="chip ${f === k ? 'pick' : ''}" data-act="admin-filter" data-f="${k}">${t}</button>`).join('')}</div>
    ${order.length ? order.map(k => {
      const list = groups.get(k), u0 = list[0], mine = k === A.mine;
      const title = k === 'none' ? 'בלי בית · נרשמו ולא המשיכו' : '🏠 ' + esc(u0.house || 'בית');
      return `<section class="card adm-h"><div class="adm-hh ${mine ? 'mine' : ''}"><b>${title}</b><span>${mine ? 'הבית שלך' : k === 'none' ? '' : 'נפתח ' + relDay(u0.house_created)}</span></div>
        ${list.map(u => row(u, mine || u.id === A.admin)).join('')}</section>`;
    }).join('') : '<div class="empty">אין משתמשים בסינון הזה</div>'}
    ${backupsHtml()}
  </div>`;
}
function openAdminUser(id) {
  const u = (S.adm?.users || []).find(x => x.id === id); if (!u) return;
  const d = t => t ? new Date(t).toLocaleDateString('he-IL') : '—';
  openSheet(`${sheetHead(esc(u.display_name || 'משתמש'))}
    <div class="muted" dir="ltr" style="text-align:right;margin-top:-8px">${esc(u.email)}</div>
    <div class="adm-facts"><div><span>בית</span><b>${esc(u.house || 'אין')}</b></div><div><span>נרשם</span><b>${d(u.created_at)}</b></div>
      <div><span>פעילות אחרונה</span><b>${admWhen(u.last_active)}</b></div><div><span>מייל</span><b class="${u.email_confirmed_at ? 'okc' : ''}">${u.email_confirmed_at ? 'אומת ✓' : 'לא אומת'}</b></div></div>
    <div class="adm-note"><b>⏸ השהיית המשתמש</b><span>המשתמש ינותק מיד ולא יוכל להיכנס.</span><span>הנתונים שלו לא נמחקים, ו"החזרה" מחזירה הכול.</span><span>שאר בני הבית שלו ממשיכים כרגיל.</span></div>
    <form data-form="admin-suspend" data-id="${u.id}" style="display:flex;flex-direction:column;gap:12px">
      <div class="field"><label for="adm-why">סיבה (רק בשבילך, לא נשלחת אליו)</label><input id="adm-why" name="reason" maxlength="200" placeholder="לא חובה" autocomplete="off"></div>
      <button class="btn danger-b" type="submit">השהיית ${esc(u.display_name || u.email)}</button>
    </form>
    <button class="btn ghost" data-act="backdrop-close">ביטול</button>`, 'tall scroll', 'admin-user');
}
async function adminSuspend(id, reason) {
  const r = await adminCall('admin_suspend', { uid: id, reason });
  if (r.error) return toast(r.error === 'forbidden' ? 'אין הרשאה' : r.error);
  closeSheet(); toast('המשתמש הושהה'); loadAdmin();
}
async function adminRestore(id) {
  const r = await adminCall('admin_restore', { uid: id });
  if (r.error) return toast(r.error);
  toast('המשתמש הוחזר ✓'); loadAdmin();
}

/* ---------------- security: forgot password, password change with email code, fingerprint (passkeys), lock ---------------- */
const passkeySupported = () => !!(window.PublicKeyCredential && navigator.credentials && sb.auth.signInWithPasskey);
const LOCK_AFTER_MS = 5 * 60e3;
let hiddenAt = 0;

function renderForgot() {
  app.innerHTML = `<form class="auth" data-form="forgot">
    <img class="logo-img" src="icon-512.png" alt="">
    <h1>שכחתי סיסמה</h1>
    <p>נשלח לך מייל עם קישור לבחירת סיסמה חדשה.</p>
    <div class="field"><label for="fg-em">אימייל</label><input id="fg-em" name="email" type="email" autocomplete="email" required dir="ltr" value="${esc(S.forgotEmail || '')}"></div>
    <div class="err ${S.forgotSent ? 'ok' : ''}">${esc(S.authErr)}</div>
    <button class="btn violet" type="submit" ${S.busy ? 'disabled' : ''}>${S.forgotSent ? 'שליחה חוזרת' : 'שליחת קישור'}</button>
    <button class="link" type="button" data-act="forgot-back">חזרה לכניסה</button>
  </form>`;
}
function renderRecovery() {
  app.innerHTML = `<form class="auth" data-form="recovery">
    <img class="logo-img" src="icon-512.png" alt="">
    <h1>סיסמה חדשה</h1>
    <p dir="auto">${esc(S.user?.email || '')}</p>
    <div class="field"><label for="rc-pw">סיסמה חדשה</label><input id="rc-pw" name="password" type="password" minlength="6" autocomplete="new-password" required dir="ltr"></div>
    <div class="field"><label for="rc-pw2">שוב, לאימות</label><input id="rc-pw2" name="password2" type="password" minlength="6" autocomplete="new-password" required dir="ltr"></div>
    <div class="err">${esc(S.authErr)}</div>
    <button class="btn violet" type="submit" ${S.busy ? 'disabled' : ''}>שמירת הסיסמה</button>
  </form>`;
}
function renderLocked() {
  app.innerHTML = `<div class="auth locked">
    <span class="lock-ico"><svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true" fill="none" stroke="#5B3DF5" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 11c0 3.5-1 6-2.5 8M8.5 7.5A4.5 4.5 0 0 1 16.5 10c0 4-1 7-2.5 9.5M6 10a6 6 0 0 1 1-3.3M18.8 15a20 20 0 0 0 .2-5 7 7 0 0 0-11-5.7M12 11c0-1.5-.5-2-1.5-2"/></svg></span>
    <h1>האפליקציה נעולה</h1>
    <p>פותחים עם טביעת אצבע או נעילת המסך של הטלפון.</p>
    <div class="err">${esc(S.authErr)}</div>
    <button class="btn violet" data-act="unlock">🔐 פתיחה</button>
    <button class="link" data-act="lock-password">כניסה עם סיסמה במקום</button>
  </div>`;
}

const canDirectPasskey = () => !!(PublicKeyCredential.parseRequestOptionsFromJSON && sb.auth._startPasskeyAuthentication && sb.auth._verifyPasskeyAuthentication);
async function passkeyCeremony() {
  if (!canDirectPasskey()) return sb.auth.signInWithPasskey();
  const { data: o, error: e1 } = await sb.auth._startPasskeyAuthentication({ options: {} });
  if (e1 || !o) return { error: e1 || new Error('start failed') };
  const opts = { ...o.options };
  const known = LS.get('ha_pk_cred', null);
  if (known) opts.allowCredentials = [{ type: 'public-key', id: known, transports: ['internal', 'hybrid'] }];
  let cred;
  try { cred = await navigator.credentials.get({ publicKey: PublicKeyCredential.parseRequestOptionsFromJSON(opts) }); }
  catch (err) {
    // cancelled, or the remembered passkey is gone from this device: next tap lets the system offer all passkeys
    if (known && err?.name === 'NotAllowedError') LS.set('ha_pk_cred', null);
    return { error: err };
  }
  if (!cred) return { error: new Error('cancelled') };
  const res = await sb.auth._verifyPasskeyAuthentication({ challengeId: o.challenge_id, credential: cred.toJSON() });
  if (!res.error) LS.set('ha_pk_cred', cred.id);
  return res;
}
async function passkeySignIn() {
  S.busy = true; S.authErr = ''; S.pkBusy = true; render();
  const { error } = await passkeyCeremony().finally(() => { S.pkBusy = false; });
  S.busy = false;
  if (error) {
    const m = error.message || error.code || '';
    S.authErr = /banned/i.test(m) ? '' : /not.?confirmed/i.test(m) ? 'צריך קודם לאשר את המייל' : /cancel|abort|NotAllowed|timed out/i.test(m) ? '' : 'לא הצלחתי להיכנס עם טביעת אצבע. אפשר להיכנס עם סיסמה.';
    if (/banned/i.test(m)) S.suspended = true;
    render(); return false;
  }
  return true;
}
async function loadPasskeys() {
  if (!sb.auth.passkey?.list) return;
  try { const r = await sb.auth.passkey.list(); S.passkeys = Array.isArray(r) ? r : (r?.data || []); } catch { S.passkeys = []; }
  if (S.sheetKind === 'settings') setSheet(settingsHtml());
}
async function registerHere() {
  if (!(PublicKeyCredential.parseCreationOptionsFromJSON && sb.auth._startPasskeyRegistration && sb.auth._verifyPasskeyRegistration)) return sb.auth.registerPasskey();
  const { data: o, error: e1 } = await sb.auth._startPasskeyRegistration();
  if (e1 || !o) return { error: e1 || new Error('start failed') };
  let cred;
  try { cred = await navigator.credentials.create({ publicKey: PublicKeyCredential.parseCreationOptionsFromJSON(o.options) }); } catch (err) { return { error: err }; }
  if (!cred) return { error: new Error('cancelled') };
  const res = await sb.auth._verifyPasskeyRegistration({ challengeId: o.challenge_id, credential: cred.toJSON() });
  if (!res.error) LS.set('ha_pk_cred', cred.id);
  return res;
}
async function addPasskey() {
  S.pkBusy = true;
  const { error } = await registerHere().finally(() => { S.pkBusy = false; });
  if (error) { if (!/cancel|abort|NotAllowed/i.test(error.message || '')) toast('לא הצלחתי להפעיל: ' + (error.message || '')); return; }
  toast('טביעת האצבע הופעלה במכשיר הזה 🔐'); LS.set('ha_passkey_here', true); loadPasskeys();
}
async function removePasskey(id) {
  try { const r = await sb.auth.passkey.delete({ passkeyId: id }); if (r?.error) throw r.error; } catch (e) { toast('לא הצלחתי להסיר'); return; }
  toast('הוסר'); loadPasskeys();
}
function securityHtml() {
  const pk = S.passkeys || [];
  const lockOn = !!LS.get('ha_lock', false);
  return `<div class="set-sec"><h3>אבטחה</h3>
    ${passkeySupported() ? `<div class="lead">🔐 כניסה עם טביעת אצבע או נעילת המסך, בלי להקליד סיסמה.</div>
      ${pk.length ? `<div class="pk-list">${pk.map(p => `<div class="pk-item"><span>📱 ${esc(p.friendly_name || 'מכשיר')}<small>${p.last_used_at ? 'שימוש אחרון ' + relDay(p.last_used_at) : 'נוסף ' + relDay(p.created_at)}</small></span>
        <button class="pk-del" data-act="passkey-del" data-id="${esc(p.id)}" aria-label="הסרה">${I.x}</button></div>`).join('')}</div>` : ''}
      <button class="btn soft" data-act="passkey-add">${pk.length ? '+ הוספת המכשיר הזה' : 'הפעלת טביעת אצבע במכשיר הזה'}</button>
      ${pk.length ? `<label class="tgl"><input type="checkbox" data-act="lock-toggle" ${lockOn ? 'checked' : ''}><span>לנעול את האפליקציה אחרי 5 דקות ברקע</span></label>` : ''}` : ''}
    <button class="btn ghost" data-act="pw-change">🔑 שינוי סיסמה</button>
  </div>`;
}
function openPwChange() {
  openSheet(`${sheetHead('שינוי סיסמה')}
    <div class="lead">לשמירה על החשבון, נשלח קוד אימות למייל <b dir="ltr">${esc(S.user.email)}</b>.</div>
    ${S.pwCodeSent ? '' : '<button class="btn violet" data-act="pw-send-code">שליחת קוד למייל</button>'}
    <form data-form="pw-change" style="display:flex;flex-direction:column;gap:12px" ${S.pwCodeSent ? '' : 'hidden'}>
      <div class="field"><label for="pw-code">הקוד מהמייל</label><input id="pw-code" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="10" required dir="ltr"></div>
      <div class="field"><label for="pw-new">סיסמה חדשה</label><input id="pw-new" name="password" type="password" minlength="6" autocomplete="new-password" required dir="ltr"></div>
      <button class="btn violet" type="submit">שמירת הסיסמה</button>
      <button class="link" type="button" data-act="pw-send-code">לא הגיע? שליחה חוזרת</button>
    </form>`, '', 'pw');
}
const lockEnabled = () => !!(S.user && LS.get('ha_lock', false) && passkeySupported());
let autoUnlockAt = 0;
function autoUnlock() {
  // ask for the fingerprint straight away, once per lock (a cancel leaves the button on screen).
  // Android only allows it once the app has focus, so wait for that if needed.
  if (!S.locked || document.visibilityState !== 'visible' || Date.now() - autoUnlockAt < 4000) return;
  if (!document.hasFocus()) { window.addEventListener('focus', () => setTimeout(autoUnlock, 150), { once: true }); return; }
  autoUnlockAt = Date.now();
  setTimeout(async () => { if (S.locked && await passkeySignIn()) { S.locked = false; S.cover = false; S.authErr = ''; render(); } }, 250);
}
// cover the moment the app loses focus (earlier than "hidden"), so the app-switcher snapshot shows the lock
window.addEventListener('blur', () => {
  if (!lockEnabled() || S.locked || S.cover || S.pkBusy) return;
  S.cover = true; render();
});
window.addEventListener('focus', () => {
  if (!lockEnabled() || S.locked || !S.cover || document.visibilityState !== 'visible') return;
  if (hiddenAt && Date.now() - hiddenAt >= LOCK_AFTER_MS) { S.locked = true; S.cover = false; closeSheet(); render(); autoUnlock(); }
  else { S.cover = false; render(); }
});
document.addEventListener('visibilitychange', () => {
  if (!lockEnabled()) return;
  if (document.visibilityState === 'hidden') {
    hiddenAt = Date.now();
    if (!S.locked) { S.cover = true; render(); }      // the phone's app-switcher snapshot now shows the lock, not the list
  } else {
    if (S.locked || (hiddenAt && Date.now() - hiddenAt >= LOCK_AFTER_MS)) { S.locked = true; S.cover = false; closeSheet(); render(); autoUnlock(); }
    else if (S.cover) { S.cover = false; render(); }
    hiddenAt = 0;
  }
});

/* ---------------- events ---------------- */
document.addEventListener('click', async e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const act = b.dataset.act;
  if (act === 'backdrop' && e.target !== b) return;
  switch (act) {
    case 'backdrop': case 'backdrop-close': closeSheet(); break;
    case 'verify-resend': {
      S.busy = true; render();
      const { error } = await sb.auth.resend({ type: 'signup', email: S.verifyEmail, options: { emailRedirectTo: APP_HOME } });
      S.busy = false; S.authErr = error ? (/rate|seconds/i.test(error.message || '') ? 'אפשר לשלוח שוב בעוד דקה' : hebAuthErr(error)) : 'נשלח שוב ✓'; render(); break;
    }
    case 'verify-login': { S.authMode = 'login'; S.authErr = ''; const em = S.verifyEmail; S.verifyEmail = null; LS.set('ha_verify', null); render(); setTimeout(() => { const i = document.getElementById('em'); if (i) i.value = em || ''; document.getElementById('pw')?.focus(); }, 0); break; }
    case 'verify-back': S.verifyEmail = null; LS.set('ha_verify', null); S.authMode = 'signup'; S.authErr = ''; render(); break;
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
    case 'trip-view': openTripView(b.dataset.id); break;
    case 'last-toggle': S.lastOpen = !b.parentElement.open; break;
    case 'maybe-add': if (addRow({ name: b.dataset.name, qty: '1', category: b.dataset.cat }) !== 'dup') { vibrate(10); toast(b.dataset.name + ' נוסף לרשימה'); } saveCache(); render(); break;
    case 're-add': case 're-add-all': {
      const tid = b.dataset.trip;
      const list = (S.tripView && S.tripView.trip.id === tid && S.sheetKind === 'trip') ? S.tripView.purchases : S.recent.purchases.filter(p => p.trip_id === tid);
      if (act === 're-add') reAdd(list, [list[+b.dataset.k]]);
      else { const onList = new Set(superItems().filter(i => !i.in_cart).map(i => i.name)); reAdd(list, list.filter(p => !onList.has(p.name))); }
      break;
    }
    case 'shop-menu': openSheet(`${sheetHead('בדרך לסופר')}
      <button class="opt" data-act="snooze"><span class="oe" aria-hidden="true">⏰</span><span><b>להזכיר לי שוב בעוד 10 דקות</b><small>"סיימת לקנות?" יחכה עוד קצת</small></span></button>
      <button class="opt" data-act="cancel-ask"><span class="oe" aria-hidden="true">✕</span><span><b>ביטול היציאה לסופר</b><small>הסימונים בעגלה יתאפסו, והרשימה נשארת</small></span></button>`, '', 'shopmenu'); break;
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
    case 'passkey-signin': await passkeySignIn(); break;
    case 'forgot-open': S.forgot = true; S.forgotSent = false; S.forgotEmail = document.getElementById('em')?.value || ''; S.authErr = ''; render(); break;
    case 'forgot-back': S.forgot = false; S.authErr = ''; S.authMode = 'login'; render(); break;
    case 'unlock': if (await passkeySignIn()) { S.locked = false; S.cover = false; S.authErr = ''; render(); } break;
    case 'lock-password': S.locked = false; LS.set('ha_lock', false); await sb.auth.signOut(); break;
    case 'passkey-add': addPasskey(); break;
    case 'passkey-del': removePasskey(b.dataset.id); break;
    case 'lock-toggle': LS.set('ha_lock', !!b.checked); toast(b.checked ? 'האפליקציה תינעל אחרי 5 דקות ברקע' : 'הנעילה כבויה'); break;
    case 'pw-change': S.pwCodeSent = false; openPwChange(); break;
    case 'pw-send-code': {
      const { error } = await sb.auth.reauthenticate();
      if (error) { toast(/seconds|rate/i.test(error.message || '') ? 'אפשר לשלוח שוב בעוד דקה' : 'לא הצלחתי לשלוח קוד'); break; }
      S.pwCodeSent = true; openPwChange(); toast('נשלח קוד למייל'); setTimeout(() => document.getElementById('pw-code')?.focus(), 200); break;
    }
    case 'admin-open': closeSheet(); S.tab = 'admin'; render(); window.scrollTo(0, 0); loadAdmin(); break;
    case 'admin-refresh': loadAdmin(); break;
    case 'admin-filter': S.adm.filter = b.dataset.f; render(); break;
    case 'admin-user': openAdminUser(b.dataset.id); break;
    case 'admin-restore': adminRestore(b.dataset.id); break;
    case 'backup-now': backupNow(); break;
    case 'backup-dl': openBackupDl(b.dataset.id); break;
    case 'suspended-out': S.suspended = false; S.suspendedEmail = null; await sb.auth.signOut(); render(); break;
    case 'go-family': document.getElementById('banner')?.remove(); S.tab = 'family'; render(); window.scrollTo(0, 0); break;
    case 'land-open': openLanding(); break;
    case 'land': land(b.dataset.name); break;
    case 'fav': { const p = allPlaces().find(x => x.name === b.dataset.name); if (p && await savePlace(p.name, { favorite: !p.favorite })) { if (S.sheetKind === 'landing') setSheet(landingSheetHtml()); render(); } break; }
    case 'place-edit': openPlaceEdit(b.dataset.name); break;
    case 'land-more': { const L = activeLanding(); if (L) landingPatch({ ends_at: new Date(Math.max(Date.now(), new Date(L.ends_at).getTime()) + 5 * 60000).toISOString() }); break; }
    case 'land-end': landingPatch({ ended_at: new Date().toISOString() }).then(() => toast('תודה! הנחיתה נסגרה')); break;
    case 'lreq': requestOnLanding(b.dataset.body, null, b.dataset.done === '1'); break;
    case 'lreq-item': { const it = S.items.find(i => i.id === b.dataset.id); if (it) requestOnLanding(it.name + (it.qty && it.qty !== '1' ? ' ×' + it.qty : ''), it.id); break; }
    case 'lreq-done': requestDone(b.dataset.id); break;
    case 'del-open': openDeliveryForm(); break;
    case 'ask-new': openAskForm(); break;
    case 'pkg-new': openPkgForm(); break;
    case 'pkg-take': { const p = S.fam.pkgs.find(x => x.id === b.dataset.id); if (p && p.status !== 'open') { toast(nameOf(p.taker_id) + ' כבר על זה'); break; }
      pkgPatch(b.dataset.id, { status: 'taken', taker_id: S.user.id }, 'מעולה! כולם יודעים שאת/ה על זה').then(() => openPkgGo(b.dataset.id)); break; }
    case 'pkg-go': openPkgGo(b.dataset.id); break;
    case 'pkg-arrived': pkgPatch(b.dataset.id, { status: 'arrived' }); break;
    case 'pkg-done': pkgPatch(b.dataset.id, { status: 'done' }, 'תודה! כולם קיבלו הודעה 📦'); break;
    case 'pkg-drop': pkgPatch(b.dataset.id, { status: 'open', taker_id: null, remind_taker: false }, 'החבילה חזרה לחכות למתנדב'); break;
    case 'pkg-self': pkgPatch(b.dataset.id, { status: 'done', taker_id: null }, 'סומן שאספת ✓'); break;
    case 'pkg-cancel': pkgPatch(b.dataset.id, { status: 'cancelled' }, 'בוטל'); break;
    case 'pkg-thanks': pkgThanks(b.dataset.id); break;
    case 'pkg-copy': { const v = b.dataset.v; navigator.clipboard?.writeText(v).then(() => toast('הועתק ✓'), () => toast(v)); break; }
    case 'whats-new': document.getElementById('banner')?.remove(); closeSheet(); S.tab = 'family'; render(); window.scrollTo(0, 0); loadFamily(); break;
    case 'ask-take': askPatch(b.dataset.id, { status: 'taken', taker_id: S.user.id }, 'מעולה! ' + (nameOf(S.fam.asks.find(a => a.id === b.dataset.id)?.user_id)) + ' קיבל/ה הודעה'); break;
    case 'ask-drop': askPatch(b.dataset.id, { status: 'open', taker_id: null }, 'הבקשה חזרה להיות פתוחה'); break;
    case 'ask-done': askPatch(b.dataset.id, { status: 'done' }, 'תודה! הבקשה נסגרה ✓'); break;
    case 'ask-got': askPatch(b.dataset.id, { status: 'done' }); break;
    case 'ask-cancel': askPatch(b.dataset.id, { status: 'cancelled' }, 'הבקשה בוטלה'); break;
    case 'ask-thanks': askThanks(b.dataset.id); break;
    case 'ask-to-list': { const v = document.getElementById('ask-body')?.value.trim(); if (v) { closeSheet(); addItem(v); toast('נוסף לרשימת הסופר 🛒'); } break; }
    case 'ask-hint-no': S.askHintOff = true; updateAskHint(''); document.getElementById('ask-body')?.focus(); break;
    case 'del-status': deliveryPatch(b.dataset.id, { status: b.dataset.s }); break;
    case 'del-more': { const d = S.fam.dels.find(x => x.id === b.dataset.id); if (d) deliveryPatch(d.id, { closes_at: new Date(Math.max(Date.now(), new Date(d.closes_at).getTime()) + 5 * 60000).toISOString() }); break; }
    case 'dline-del': { const { error } = await sb.from('delivery_lines').delete().eq('id', b.dataset.id); if (error) famErr(error); else { S.fam.lines = S.fam.lines.filter(l => l.id !== b.dataset.id); render(); } break; }
    case 'share-code': {
      const txt = `הצטרפי אליי לרשימת הקניות שלנו ב"בדרך לסופר" 🛒\nקוד הבית: ${S.household.invite_code}\n${location.origin + location.pathname}`;
      if (navigator.share) { try { await navigator.share({ text: txt }); } catch {} }
      else window.open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank');
      break;
    }
    case 'signout': closeSheet(); await sb.auth.signOut(); break;
  }
});

document.addEventListener('input', e => { if (e.target.id === 'pkg-sms') applyPkgSms(e.target.value); if (e.target.name === 'kind' && e.target.closest('form[data-form="pkg"]')) pkgKindChanged(); if (e.target.id === 'add-input') S.addText = e.target.value; if (e.target.id === 'land-q') filterPlaces(e.target.value); if (e.target.id === 'ask-body') updateAskHint(e.target.value); });

document.addEventListener('submit', async e => {
  const f = e.target.closest('form[data-form]'); if (!f) return;
  e.preventDefault();
  const fd = Object.fromEntries(new FormData(f));
  switch (f.dataset.form) {
    case 'land-new': { const q = String(fd.q || '').trim(); if (q) land(allPlaces().find(p => p.name === q)?.name || q); break; }
    case 'place': if (await savePlace(f.dataset.name, { address: String(fd.address || '').trim().slice(0, 60) })) { toast('נשמר'); openLanding(); } break;
    case 'lreq': { const t = String(fd.text || '').trim(); if (t) { f.reset(); requestOnLanding(t); } break; }
    case 'del-new': openDeliveryNow(fd); break;
    case 'ask': newAsk(fd); break;
    case 'pkg': newPkg(fd); break;
    case 'forgot': {
      const email = String(fd.email || '').trim(); if (!email) break;
      S.busy = true; S.forgotEmail = email; render();
      const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: APP_HOME });
      S.busy = false;
      if (error && /seconds|rate/i.test(error.message || '')) S.authErr = 'אפשר לשלוח שוב בעוד דקה';
      else if (error) S.authErr = hebAuthErr(error);
      else { S.forgotSent = true; S.authErr = 'אם הכתובת רשומה, נשלח אליה מייל עם קישור. כדאי להציץ גם בספאם.'; }
      render(); break;
    }
    case 'recovery': {
      if (fd.password !== fd.password2) { S.authErr = 'הסיסמאות לא זהות'; render(); break; }
      S.busy = true; render();
      const { error } = await sb.auth.updateUser({ password: fd.password });
      S.busy = false;
      if (error) { S.authErr = /different from the old/i.test(error.message || '') ? 'זו הסיסמה הקודמת. בחרו סיסמה אחרת.' : hebAuthErr(error); render(); break; }
      S.recovery = false; S.authErr = ''; render(); toast('הסיסמה עודכנה ✓'); break;
    }
    case 'pw-change': {
      const { error } = await sb.auth.updateUser({ password: fd.password, nonce: String(fd.code || '').trim() });
      if (error) { toast(/nonce|otp|expired|invalid/i.test(error.message || '') ? 'הקוד לא נכון או שפג תוקפו' : /different from the old/i.test(error.message || '') ? 'זו הסיסמה הקודמת' : 'לא הצלחתי לשנות: ' + (error.message || '')); break; }
      closeSheet(); S.pwCodeSent = false; toast('הסיסמה שונתה ✓'); break;
    }
    case 'admin-suspend': adminSuspend(f.dataset.id, String(fd.reason || '').trim()); break;
    case 'backup-dl': backupDownload(f.dataset.id, String(fd.pw || ''), String(fd.pw2 || '')); break;
    case 'dline': { const t = String(fd.text || '').trim(); if (t) { f.reset(); addDeliveryLine(f.dataset.id, t); } break; }
    case 'add': {
      const v = S.addText.trim(); if (!v) return;
      S.addText = ''; addItem(v);
      document.getElementById('add-input')?.focus();
      break;
    }
    case 'auth': {
      S.busy = true; S.authErr = ''; render();
      const email = fd.email.trim();
      const { data, error } = S.authMode === 'signup'
        ? await sb.auth.signUp({ email, password: fd.password, options: { emailRedirectTo: APP_HOME } })
        : await sb.auth.signInWithPassword({ email, password: fd.password });
      S.busy = false;
      if (error && /banned/i.test(error.message || '')) { S.suspended = true; S.suspendedEmail = email; }
      else if (error && /Email not confirmed/i.test(error.message || '')) { S.verifyEmail = email; S.authErr = 'עוד לא אישרת את הכתובת. הקישור נמצא במייל.'; LS.set('ha_verify', email); }
      else if (error) S.authErr = hebAuthErr(error);
      else if (S.authMode === 'signup' && !data.session) { S.verifyEmail = email; S.authErr = ''; LS.set('ha_verify', email); }
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
      if (error) toast('לא הצלחתי לשמור'); else { toast('הסכום נשמר'); loadStats(); loadRecent(); }
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
  else if (params.get('family')) { S.tab = 'family'; render(); loadFamily(); }
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
  try { await loadStatus(); } catch {}
  if (S.suspended) { render(); return; }
  try { await loadAll(); } catch (e) { if (!isNetErr(e)) toast('שגיאה בטעינה: ' + (e.message || '')); }
  render();
}

sb.auth.onAuthStateChange((evt, session) => {
  const prevUser = S.user?.id;
  if (evt === 'PASSWORD_RECOVERY') { S.recovery = true; S.authErr = ''; }
  if (evt === 'INITIAL_SESSION' && session && LS.get('ha_lock', false) && passkeySupported()) S.locked = true;
  S.session = session; S.user = session?.user || null;
  if (S.user) { S.verifyEmail = null; LS.set('ha_verify', null); }
  if (!S.user) { if (channel) { sb.removeChannel(channel); channel = null; } S.household = null; S.booting = false; render(); return; }
  if (prevUser !== S.user.id) {
    loadCache(); S.booting = false; render();
    if (S.locked) autoUnlock();
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
  else if (S.tab === 'family' && !sheetRoot.innerHTML && !famTyping() && S.fam.loaded) render();
}, 15000);

setInterval(() => {
  if (S.trip && document.visibilityState === 'visible') refreshLive();
  else if (document.visibilityState === 'visible' && !rtHealthy) refreshLive(true);
}, 20000);

setTimeout(() => { if (S.booting) { S.booting = false; render(); } }, 2500);

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
clearNotifications();
