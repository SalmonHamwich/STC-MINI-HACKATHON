// ReadyHands — shared UI helpers: store, language, formatting, components, dialog, toast.
import * as L from './logic.js';
import { seed, LABELS, getModule } from './data.js';

const KEY = 'readyhands-demo';

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && saved.version === seed().version) return saved;
  } catch { /* fall through to sample data */ }
  return seed();
}

export const store = { state: load(), ui: {} };
export const S = () => store.state;
export const me = () => L.getUser(S(), S().currentUser);

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S())); } catch { /* storage unavailable: demo still works in memory */ }
}
export function resetDemo() {
  const prefs = S().prefs;
  store.state = seed();
  store.state.prefs = prefs; // keep language and accessibility choices
  store.ui = {};
  save();
}

// ---------- Language ----------
export const lang = () => S().prefs.lang;
/** Inline bilingual text: T('English', 'Bahasa Melayu'). */
export const T = (en, bm) => (lang() === 'bm' ? bm : en);
/** Localised value: plain strings pass through, { en, bm } objects are picked by language. */
export const Lx = (v) => (v && typeof v === 'object' ? v[lang()] ?? v.en : v ?? '');
export const lab = (group, key) => Lx(LABELS[group]?.[key]) || key;
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const plural = (n, one, many) => (n === 1 ? one : many);

// ---------- Time (demo-local, read with UTC getters) ----------
const DAYS = { en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], bm: ['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'] };
const MONTHS = { en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], bm: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'] };
export function fmtTime(ts) {
  const d = new Date(ts), h = d.getUTCHours(), m = d.getUTCMinutes();
  const h12 = h % 12 || 12, mm = String(m).padStart(2, '0');
  return lang() === 'bm' ? `${h12}:${mm} ${h < 12 ? 'pg' : 'ptg'}` : `${h12}:${mm} ${h < 12 ? 'am' : 'pm'}`;
}
export function fmtDate(ts, year = false) {
  const d = new Date(ts);
  return `${d.getUTCDate()} ${MONTHS[lang()][d.getUTCMonth()]}${year ? ` ${d.getUTCFullYear()}` : ''}`;
}
export function fmtDay(ts) {
  const diff = L.dayOf(ts) - L.dayOf(S().now);
  if (diff === 0) return T('Today', 'Hari ini');
  if (diff === 1) return T('Tomorrow', 'Esok');
  if (diff === -1) return T('Yesterday', 'Semalam');
  return `${DAYS[lang()][new Date(ts).getUTCDay()]} ${fmtDate(ts)}`;
}
export const fmtWhen = (ts) => `${fmtDay(ts)} ${fmtTime(ts)}`;
export const fmtClock = (ts) => `${DAYS[lang()][new Date(ts).getUTCDay()]} ${fmtDate(ts)}, ${fmtTime(ts)}`;
export const fmtH = (h) => String(Math.round(h * 10) / 10);
export const hoursText = (h) => `${fmtH(h)} ${T(plural(Math.round(h * 10) / 10, 'hour', 'hours'), 'jam')}`;
export const postWhen = (post) => `${fmtWhen(post.start)}, ${hoursText(post.hours)}`;

// ---------- Icons (decorative; always paired with text) ----------
const PATHS = {
  wrench: 'M14.5 6.5a4 4 0 0 0-5.2 5.2L3 18l3 3 6.3-6.3a4 4 0 0 0 5.2-5.2l-2.6 2.6-2.4-.6-.6-2.4z',
  truck: 'M2 7h11v9H2zM13 10h4l3 3v3h-7zM6.5 19a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6zM16.5 19a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z',
  boat: 'M3 14h18l-2.5 5h-13zM12 4v10M12 5l6 7h-6M2 21c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0',
  plug: 'M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5',
  play: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM10 8.5v7l6-3.5z',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3.5 2',
  moon: 'M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z',
  triangle: 'M12 3l10 17H2zM12 10v4M12 17v.5',
  building: 'M4 21V8l8-5 8 5v13zM9 21v-6h6v6M8 11h2M14 11h2',
  megaphone: 'M3 10v4h3l8 5V5l-8 5zM17 9a4 4 0 0 1 0 6M7 14l1.5 6h2.5',
  ribbon: 'M12 3a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM8.5 13L7 21l5-3 5 3-1.5-8',
  check: 'M4 12.5l5 5L20 6.5',
  x: 'M6 6l12 12M18 6L6 18',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  user: 'M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 21c0-4.4 3.6-7 8-7s8 2.6 8 7',
  info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v6M12 7.5v.5',
  hands: 'M7 21v-5l-3-3V8.5a1.5 1.5 0 0 1 3 0V12l3 2v7M17 21v-5l3-3V8.5a1.5 1.5 0 0 0-3 0V12l-3 2v7M12 3v4M9.5 4.5l1 2M14.5 4.5l-1 2',
  sound: 'M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11',
  star: 'M12 3l2.7 5.8 6.3.8-4.6 4.3 1.2 6.2-5.6-3.1-5.6 3.1 1.2-6.2L3 9.6l6.3-.8z',
};
export const icon = (name, cls = '') =>
  `<svg class="ic ${cls}" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${PATHS[name] || PATHS.info}"/></svg>`;
export const assetIcon = (a) => ({ fourByFour: 'truck', lorry: 'truck', boat: 'boat', generator: 'plug', pump: 'plug', chainsaw: 'wrench' }[a] || 'wrench');

// ---------- Components ----------
/** Status pill: tone + icon + text, so meaning never depends on colour alone. */
export const pill = (tone, text, ic) => `<span class="pill pill-${tone}">${ic ? icon(ic) : ''}<span>${esc(text)}</span></span>`;

export function meter(value, max, label, tone = 'ok') {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return `<div class="meter meter-${tone}" role="img" aria-label="${esc(label)}"><div class="meter-fill" style="width:${pct}%"></div></div>`;
}
export const levelTone = (level) => ({ ok: 'ok', near: 'caution', at: 'alert' }[level]);

export function needsList(post, { must = true, opt = true } = {}) {
  const parts = [];
  if (must) {
    for (const s of post.skills || []) parts.push(`<span class="need">${icon('wrench')}${esc(lab('skill', s))}</span>`);
    for (const a of post.assets || []) parts.push(`<span class="need">${icon(assetIcon(a))}${esc(lab('asset', a))}</span>`);
  }
  if (opt) {
    for (const s of post.optSkills || []) parts.push(`<span class="need need-opt">${icon('wrench')}${esc(lab('skill', s))} <small>(${T('helpful', 'jika ada')})</small></span>`);
    for (const a of post.optAssets || []) parts.push(`<span class="need need-opt">${icon(assetIcon(a))}${esc(lab('asset', a))} <small>(${T('helpful', 'jika ada')})</small></span>`);
  }
  return parts.join(' ');
}

export function postStatusPill(post) {
  const st = L.postStatus(S(), post);
  return {
    pending: pill('caution', T('Waiting for approval', 'Menunggu kelulusan'), 'clock'),
    live: pill('ok', T('Live', 'Aktif'), 'check'),
    full: pill('info', T('Full', 'Penuh'), 'check'),
    sentBack: pill('alert', T('Sent back', 'Dikembalikan'), 'triangle'),
    closed: pill('muted', T('Closed', 'Ditutup'), 'x'),
  }[st];
}

export function shiftStatusPill(shift) {
  return {
    requested: pill('caution', T('Requested', 'Dimohon'), 'clock'),
    accepted: pill('ok', T('Accepted by poster', 'Diterima pemohon'), 'check'),
    declined: pill('muted', T('Declined', 'Ditolak'), 'x'),
    onsite: pill('info', T('On site', 'Di tapak'), 'building'),
    overdue: pill('alert', T('Overdue', 'Lewat daftar keluar'), 'triangle'),
    done: pill('ok', T('Checked out safely', 'Daftar keluar dengan selamat'), 'check'),
    cancelled: pill('muted', shift.cancelledBy === 'poster' ? T('Cancelled by poster', 'Dibatalkan oleh pemohon') : T('Withdrawn', 'Ditarik balik'), 'x'),
  }[shift.status];
}

/** Turns a failed hard rule into plain words plus the fix. */
export function reasonInfo(r, { postId = '' } = {}) {
  if (r.code === 'need') {
    const items = [...r.skills.map((s) => lab('skill', s)), ...r.assets.map((a) => lab('asset', a))].join(' · ');
    return { tone: 'muted', icon: 'wrench', text: T(`This post needs ${items}, which is not on your profile.`, `Tugasan ini memerlukan ${items}, yang tiada dalam profil anda.`), fix: T('Update my profile', 'Kemas kini profil'), href: '#profile' };
  }
  if (r.code === 'badge') {
    const b = lab('badge', r.badge);
    return r.status === 'pending'
      ? { tone: 'caution', icon: 'shield', text: T(`Needs a verified ${b} badge. Yours is waiting for a coordinator check.`, `Memerlukan lencana ${b} yang disahkan. Lencana anda sedang menunggu semakan penyelaras.`), fix: T('See badge status', 'Lihat status lencana'), href: '#profile' }
      : { tone: 'caution', icon: 'shield', text: T(`Needs a verified ${b} badge.`, `Memerlukan lencana ${b} yang disahkan.`), fix: T(`Get the ${b} badge`, `Dapatkan lencana ${b}`), href: '#profile' };
  }
  if (r.code === 'training') {
    const first = getModule(r.modules[0]);
    const names = r.modules.map((m) => `“${Lx(getModule(m).title)}”`).join(', ');
    const mins = r.modules.reduce((t, m) => t + getModule(m).minutes, 0);
    return { tone: 'caution', icon: 'play', text: T(`Complete ${names} (${mins} min).`, `Lengkapkan ${names} (${mins} min).`), fix: T('Start 2-min training', 'Mula latihan 2 minit'), href: `#training/${first.id}${postId ? `?back=${postId}` : ''}` };
  }
  // rest
  const again = r.availableAt ? ` ${T('Available again', 'Boleh menyertai semula')} ${fmtWhen(r.availableAt)}.` : '';
  let text;
  if (r.rule === 'day') {
    text = r.worked >= r.cap - 1e-9
      ? T(`You've worked ${fmtH(r.worked)} hours today. Rest first.`, `Anda telah bekerja ${fmtH(r.worked)} jam hari ini. Rehat dahulu.`)
      : T(`You've worked ${fmtH(r.worked)} hours today${r.committed - r.worked > 0.05 ? ` and have ${fmtH(r.committed - r.worked)} more planned` : ''}. This shift would take you past ${r.cap}. Rest first.`,
          `Anda telah bekerja ${fmtH(r.worked)} jam hari ini${r.committed - r.worked > 0.05 ? ` dan ${fmtH(r.committed - r.worked)} jam lagi dirancang` : ''}. Syif ini akan melebihi ${r.cap} jam. Rehat dahulu.`);
  } else if (r.rule === 'week') {
    text = T(`You've given ${fmtH(r.week)} hours this week. The limit is ${r.cap}. Rest first.`, `Anda telah menyumbang ${fmtH(r.week)} jam minggu ini. Hadnya ${r.cap} jam. Rehat dahulu.`);
  } else if (r.rule === 'gap') {
    text = T(`Rest at least ${L.RULES.restGapHours} hours before your next day of helping.`, `Rehat sekurang-kurangnya ${L.RULES.restGapHours} jam sebelum hari membantu seterusnya.`);
  } else {
    text = T(`You've helped ${r.streak} days in a row. Take a rest day.`, `Anda telah membantu ${r.streak} hari berturut-turut. Ambil sehari rehat.`);
  }
  return { tone: 'alert', icon: 'moon', text: text + again, fix: T('See my rest status', 'Lihat status rehat'), href: '#recognition' };
}

export const field = (id, label, control, { hint = '', error = '' } = {}) => `
  <div class="field${error ? ' has-error' : ''}">
    <label for="${id}">${label}</label>
    ${hint ? `<p class="hint" id="${id}-hint">${hint}</p>` : ''}
    ${control}
    ${error ? `<p class="error" id="${id}-err">${icon('triangle')} ${error}</p>` : ''}
  </div>`;
export const options = (list, selected) => list.map(([v, t]) => `<option value="${esc(v)}"${String(v) === String(selected) ? ' selected' : ''}>${esc(t)}</option>`).join('');
export const chip = (act, key, text, on, ic, extra = '') =>
  `<button type="button" class="chip" data-act="${act}" data-key="${key}" ${extra} aria-pressed="${on ? 'true' : 'false'}">${on ? icon('check') : ic ? icon(ic) : ''}<span>${esc(text)}</span></button>`;
export const demoTag = () => `<span class="demo-tag">${T('demo', 'demo')}</span>`;
export const notice = (tone, html, ic = 'info') => `<div class="notice notice-${tone}">${icon(ic)}<div>${html}</div></div>`;

// ---------- Actions, rendering, navigation ----------
export const handlers = {};
export const on = (name, fn) => { handlers[name] = fn; };
let renderFn = () => {};
export const setRender = (fn) => { renderFn = fn; };
/** Re-check overdue shifts, persist and redraw after any state change. */
export function refresh() {
  L.detectOverdue(S());
  save();
  renderFn();
}
export const go = (hash) => { if (location.hash === hash) refresh(); else location.hash = hash; };

export function toast(message) {
  const el = document.getElementById('toast');
  el.textContent = '';
  el.hidden = false;
  setTimeout(() => { el.textContent = message; }, 20); // re-announce even when the text repeats
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { el.hidden = true; }, 6000);
}

/**
 * Accessible confirmation using a native <dialog> (focus is trapped by the browser).
 * reason: 'none' | 'optional' | 'required'. Resolves to { reason } or null when cancelled.
 */
export function confirmDialog({ title, body = '', confirm, cancel, reason = 'none', reasonLabel = '', tone = 'primary' }) {
  const dlg = document.getElementById('dialog');
  dlg.innerHTML = `
    <form method="dialog" novalidate>
      <h2 id="dlg-title">${esc(title)}</h2>
      <div class="dlg-body">${body}</div>
      ${reason !== 'none' ? `
        <div class="field">
          <label for="dlg-reason">${esc(reasonLabel || T('Reason', 'Sebab'))} ${reason === 'optional' ? `<small>(${T('optional', 'pilihan')})</small>` : ''}</label>
          <textarea id="dlg-reason" rows="3" ${reason === 'required' ? 'aria-required="true"' : ''}></textarea>
          <p class="error" id="dlg-err" hidden>${icon('triangle')} ${T('Please write a short reason.', 'Sila tulis sebab ringkas.')}</p>
        </div>` : ''}
      <div class="dlg-actions">
        <button type="button" class="btn btn-secondary" value="cancel" id="dlg-cancel">${esc(cancel || T('Cancel', 'Batal'))}</button>
        <button type="submit" class="btn ${tone === 'alert' ? 'btn-alert' : 'btn-primary'}" value="ok" id="dlg-ok">${esc(confirm)}</button>
      </div>
    </form>`;
  dlg.setAttribute('aria-labelledby', 'dlg-title');
  return new Promise((resolve) => {
    const area = dlg.querySelector('#dlg-reason');
    const finish = (value) => { dlg.close(); resolve(value); };
    dlg.querySelector('#dlg-cancel').onclick = () => finish(null);
    dlg.oncancel = (e) => { e.preventDefault(); finish(null); };
    dlg.querySelector('form').onsubmit = (e) => {
      e.preventDefault();
      const text = area ? area.value.trim() : '';
      if (reason === 'required' && !text) {
        dlg.querySelector('#dlg-err').hidden = false;
        area.setAttribute('aria-invalid', 'true');
        area.setAttribute('aria-describedby', 'dlg-err');
        area.focus();
        return;
      }
      finish({ reason: text });
    };
    dlg.showModal();
    (area || dlg.querySelector('#dlg-ok')).focus();
  });
}

// ---------- Read aloud (browser speech synthesis, where supported) ----------
export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
export function speak(text) {
  if (!canSpeak()) return false;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/\s+/g, ' ').trim());
  u.lang = lang() === 'bm' ? 'ms-MY' : 'en-GB';
  u.rate = 0.95;
  u.onend = u.onerror = () => { store.ui.speaking = false; renderFn(); };
  store.ui.speaking = true;
  window.speechSynthesis.speak(u);
  return true;
}
export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel();
  store.ui.speaking = false;
}

export const roleLabel = (u) =>
  u.roles.admin ? T('Coordinator, Harapan Relief', 'Penyelaras, Harapan Relief')
  : u.roles.poster === 'approved' ? T('Volunteer + Poster', 'Sukarelawan + Pemohon')
  : T('Volunteer', 'Sukarelawan');

export const siteTags = (site) => [
  pill('muted', lab('siteType', site.type), 'building'),
  site.overlooked ? pill('caution', T('Overlooked, priority', 'Terabai, keutamaan'), 'star') : '',
  site.evacCentre ? pill('info', T('Evacuation centre', 'Pusat pemindahan'), 'info') : '',
].join(' ');
