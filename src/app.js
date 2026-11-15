// ReadyHands — app shell: routing, layout, accessibility controls, demo controls, event delegation.
import * as L from './logic.js';
import {
  store, S, me, T, esc, icon, on, handlers, setRender, refresh, go, toast, confirmDialog, resetDemo, save,
  speak, stopSpeaking, canSpeak, fmtClock, roleLabel, demoTag, plural,
} from './ui.js';
import * as V from './views-volunteer.js';
import * as P from './views-poster.js';
import * as A from './views-admin.js';

const routes = {
  home: V.home, profile: V.profile, posts: V.posts, post: V.postDetail, shifts: V.shifts, recognition: V.recognitionView,
  certificate: V.certificate, 'become-poster': V.becomePoster,
  training: (id, q) => (id ? V.trainingModule(id, q) : V.trainingList()),
  create: P.create, edit: P.editPost, 'my-posts': P.myPosts, site: P.siteView, coordinator: A.coordinator,
};
const NAV_GROUP = { post: 'posts', training: 'profile', recognition: 'shifts', certificate: 'shifts', 'become-poster': 'profile', create: 'my-posts', edit: 'my-posts', site: 'my-posts' };

function parseHash() {
  const [path, qs] = location.hash.replace(/^#/, '').split('?');
  const [name, param] = (path || 'home').split('/');
  return { name: routes[name] ? name : 'home', param, query: new URLSearchParams(qs || '') };
}

function nav(current) {
  const u = me(), st = S();
  const onsite = st.shifts.filter((s) => s.volunteer === u.id && (s.status === 'onsite' || s.status === 'overdue')).length;
  const requests = st.shifts.filter((s) => s.status === 'requested' && L.getPost(st, s.post).poster === u.id).length;
  const alerts = L.openAlerts(st).length;
  const badge = (n, text) => (n ? ` <span class="nav-badge">${n}<span class="sr"> ${text}</span></span>` : '');
  const items = [
    ['home', T('Home', 'Utama'), ''],
    ['posts', T('Posts', 'Tugasan'), ''],
    ['profile', T('My profile', 'Profil saya'), ''],
    ['shifts', T('My shifts', 'Syif saya'), badge(onsite, T('on site now', 'di tapak sekarang'))],
    ...(u.roles.poster === 'approved' ? [['my-posts', T('My posts', 'Tugasan saya'), badge(requests, T(plural(requests, 'join request', 'join requests'), 'permohonan menyertai'))]] : []),
    ...(u.roles.admin ? [['coordinator', T('Coordinator', 'Penyelaras'), badge(alerts, T(plural(alerts, 'open alert', 'open alerts'), 'amaran terbuka'))]] : []),
  ];
  const active = NAV_GROUP[current] || current;
  return `<nav class="nav" aria-label="${T('Main', 'Utama')}"><ul>${items.map(([r, t, b]) => `<li><a href="#${r}" ${active === r ? 'aria-current="page"' : ''}>${t}${b}</a></li>`).join('')}</ul></nav>`;
}

function shell(route, body) {
  const st = S(), p = st.prefs, u = me();
  const press = (v) => `aria-pressed="${v ? 'true' : 'false'}"`;
  return `
  <a class="skip" href="#main" data-act="skip">${T('Skip to main content', 'Langkau ke kandungan utama')}</a>
  <div class="a11y-bar" role="region" aria-label="${T('Accessibility', 'Kebolehcapaian')}">
    <div class="wrap">
      <button type="button" class="a11y-btn" data-act="toggle-pref" data-key="large" ${press(p.large)}>${T('Larger text', 'Teks lebih besar')}</button>
      <button type="button" class="a11y-btn" data-act="toggle-pref" data-key="contrast" ${press(p.contrast)}>${T('High contrast', 'Kontras tinggi')}</button>
      ${canSpeak() ? (store.ui.speaking
        ? `<button type="button" class="a11y-btn" data-act="stop-reading" aria-pressed="true">${icon('x')} ${T('Stop reading', 'Henti membaca')}</button>`
        : `<button type="button" class="a11y-btn" data-act="read-aloud">${icon('sound')} ${T('Read aloud', 'Baca kuat')}</button>`) : ''}
      <span class="lang" role="group" aria-label="${T('Language', 'Bahasa')}">
        <button type="button" class="a11y-btn" data-act="set-lang" data-key="bm" lang="ms" ${press(p.lang === 'bm')}>Bahasa Melayu</button>
        <button type="button" class="a11y-btn" data-act="set-lang" data-key="en" lang="en" ${press(p.lang === 'en')}>English</button>
      </span>
    </div>
  </div>
  <header class="header">
    <div class="wrap header-row">
      <a class="brand" href="#home"><span class="brand-mark" aria-hidden="true">${icon('hands')}</span><span><span class="brand-name">ReadyHands</span><span class="brand-sub">${T('Prototype · sample data', 'Prototaip · data contoh')}</span></span></a>
      <button type="button" class="btn btn-secondary simple-btn" data-act="toggle-pref" data-key="simple" ${press(p.simple)}>${T('Simple Mode', 'Mod Ringkas')}${p.simple ? `: ${T('on', 'hidup')}` : ''}</button>
    </div>
    <div class="wrap">${nav(route)}</div>
  </header>
  <section class="demo-bar no-print" aria-label="${T('Demo controls', 'Kawalan demo')}">
    <div class="wrap demo-row">
      <span class="demo-title">${demoTag()} ${T('Demo controls: simulated, not real sign-in', 'Kawalan demo: simulasi, bukan log masuk sebenar')}</span>
      <label for="persona">${T('Viewing as', 'Lihat sebagai')}</label>
      <select id="persona" data-change="switch-user">
        ${st.users.map((x) => `<option value="${x.id}" ${x.id === u.id ? 'selected' : ''}>${esc(x.name)} · ${esc(roleLabel(x))}</option>`).join('')}
      </select>
      <span class="clock">${icon('clock')} ${T('Demo clock', 'Jam demo')}: <b>${fmtClock(st.now)}</b></span>
      <button type="button" class="btn btn-ghost" data-act="clock-plus">+1 ${T('hour', 'jam')}</button>
      <button type="button" class="btn btn-ghost" data-act="reset-demo">${T('Reset demo', 'Set semula demo')}</button>
    </div>
  </section>
  <main id="main" class="wrap main route-${route}" tabindex="-1">${body}</main>
  <footer class="footer no-print">
    <div class="wrap">
      <p><b>${T('Prototype boundaries.', 'Had prototaip.')}</b> ${T('This is a hackathon demo, not a live disaster-response system. It has no real sign-in, emergency alerts, location tracking, credential checks, messaging or backend. Roles are navigation choices, not security.', 'Ini demo hackathon, bukan sistem respons bencana sebenar. Tiada log masuk sebenar, amaran kecemasan, penjejakan lokasi, semakan kelayakan, pemesejan atau pelayan. Peranan ialah pilihan navigasi, bukan keselamatan.')}</p>
      <p>${T('All people, sites and numbers are sample data. “Harapan Relief” is a fictional organisation; ReadyHands is not affiliated with any real disaster-response organisation. Do not enter real personal details, child records, health information or certificates. In an emergency call 999.', 'Semua orang, tapak dan nombor ialah data contoh. “Harapan Relief” ialah organisasi rekaan; ReadyHands tidak bergabung dengan mana-mana organisasi respons bencana sebenar. Jangan masukkan butiran peribadi sebenar, rekod kanak-kanak, maklumat kesihatan atau sijil. Dalam kecemasan hubungi 999.')}</p>
    </div>
  </footer>`;
}

// ---------- Rendering with focus kept in place ----------
const focusKey = (el) => {
  if (!el || el === document.body) return null;
  if (el.id) return `#${CSS.escape(el.id)}`;
  const d = el.dataset || {};
  if (d.act) return `[data-act="${d.act}"]${d.id ? `[data-id="${d.id}"]` : ''}${d.key ? `[data-key="${d.key}"]` : ''}`;
  if (d.bind) return `[data-bind="${d.bind}"]${el.type === 'radio' ? `[value="${el.value}"]` : ''}`;
  if (d.quiz) return `[data-quiz="${d.quiz}"][value="${el.value}"]`;
  return null;
};

let lastRoute = null;
function render() {
  const st = S(), root = document.documentElement, app = document.getElementById('app');
  root.lang = st.prefs.lang === 'bm' ? 'ms' : 'en';
  root.classList.toggle('large', st.prefs.large);
  root.classList.toggle('contrast', st.prefs.contrast);
  root.classList.toggle('simple', st.prefs.simple);
  if (!me()) st.currentUser = st.users[0].id;
  const { name, param, query } = parseHash();
  const routeKey = `${name}/${param || ''}`;
  const changed = routeKey !== lastRoute;
  const key = changed ? null : focusKey(document.activeElement);
  const scroll = window.scrollY;
  app.innerHTML = shell(name, routes[name](param, query));
  const h1 = app.querySelector('main h1');
  document.title = `${h1 ? h1.textContent.trim() : 'ReadyHands'} · ReadyHands`;
  if (changed) {
    lastRoute = routeKey;
    window.scrollTo(0, 0);
    if (render.started) (h1 || app.querySelector('main')).focus({ preventScroll: true });
  } else {
    window.scrollTo(0, scroll);
    if (key) app.querySelector(key)?.focus({ preventScroll: true });
  }
  render.started = true;
}
setRender(render);

// ---------- Global actions ----------
on('skip', () => document.getElementById('main').focus());
on('toggle-pref', ({ key }) => {
  const p = S().prefs;
  p[key] = !p[key];
  const names = { large: T('Larger text', 'Teks lebih besar'), contrast: T('High contrast', 'Kontras tinggi'), simple: T('Simple Mode', 'Mod Ringkas') };
  toast(`${names[key]}: ${p[key] ? T('on', 'hidup') : T('off', 'mati')}`);
  refresh();
});
on('set-lang', ({ key }) => {
  stopSpeaking();
  S().prefs.lang = key;
  refresh();
  toast(key === 'bm' ? 'Bahasa ditukar kepada Bahasa Melayu.' : 'Language changed to English.');
});
on('read-aloud', () => {
  const main = document.getElementById('main').cloneNode(true);
  main.querySelectorAll('.demo-box, svg, select, input, textarea').forEach((n) => n.remove());
  if (!speak(main.innerText || main.textContent)) toast(T('Read aloud is not supported in this browser.', 'Baca kuat tidak disokong dalam pelayar ini.'));
  render();
});
on('stop-reading', () => { stopSpeaking(); render(); });
on('switch-user', ({ id }) => {
  stopSpeaking();
  S().currentUser = id;
  store.ui = {};
  const u = me();
  toast(T(`Demo: now viewing as ${u.name} (${roleLabel(u)}).`, `Demo: kini melihat sebagai ${u.name} (${roleLabel(u)}).`));
  const { name } = parseHash();
  const needsPoster = ['my-posts', 'create', 'edit'].includes(name) && u.roles.poster !== 'approved';
  if (needsPoster || ['post', 'training', 'certificate', 'edit'].includes(name)) go(u.roles.admin ? '#coordinator' : '#posts');
  else if (name === 'coordinator' && !u.roles.admin) go('#posts');
  else { lastRoute = null; refresh(); }
});
on('clock-plus', () => {
  const raised = L.advanceClock(S(), L.H);
  toast(T(`Demo clock moved forward 1 hour to ${fmtClock(S().now)}.${raised.length ? ` ${raised.length} ${plural(raised.length, 'shift is', 'shifts are')} now overdue.` : ''}`, `Jam demo dialih 1 jam ke ${fmtClock(S().now)}.${raised.length ? ` ${raised.length} syif kini lewat.` : ''}`));
  refresh();
});
on('reset-demo', async () => {
  const res = await confirmDialog({
    title: T('Reset the demo?', 'Set semula demo?'),
    body: `<p>${T('All sample data returns to the start so the demo can be repeated. Language and accessibility choices are kept.', 'Semua data contoh kembali ke permulaan supaya demo boleh diulang. Pilihan bahasa dan kebolehcapaian dikekalkan.')}</p>`,
    confirm: T('Reset demo', 'Set semula demo'), tone: 'alert',
  });
  if (!res) return;
  stopSpeaking();
  resetDemo();
  lastRoute = null;
  toast(T('Demo reset. Sample data restored.', 'Demo diset semula. Data contoh dipulihkan.'));
  go('#home');
});

// ---------- Event delegation ----------
function setPath(root, path, value) {
  const keys = path.split('.');
  let obj = root;
  for (const k of keys.slice(0, -1)) { if (obj[k] == null) return; obj = obj[k]; }
  obj[keys.at(-1)] = value;
}
const valueOf = (el) => {
  if (el.type === 'checkbox') return el.checked;
  if (el.dataset.type === 'number') return el.value === '' ? null : Number(el.value);
  return el.value;
};

document.addEventListener('click', (ev) => {
  const el = ev.target.closest('[data-act]');
  if (!el || el.disabled) return;
  if (el.tagName === 'A') ev.preventDefault();
  const fn = handlers[el.dataset.act];
  if (fn) fn(el.dataset, el, ev);
});
document.addEventListener('submit', (ev) => {
  const form = ev.target.closest('form[data-form]');
  if (!form) return;
  ev.preventDefault();
  handlers[`submit-${form.dataset.form}`]?.(form);
});
const onField = (ev) => {
  const el = ev.target;
  if (!(el instanceof HTMLElement)) return;
  if (el.dataset.bind) {
    if (el.type === 'radio' && !el.checked) return;
    setPath(store.ui, el.dataset.bind, valueOf(el));
    if (ev.type === 'change' && 'rerender' in el.dataset) refresh();
  } else if (el.dataset.quiz !== undefined && el.checked) {
    store.ui.quiz.answers[Number(el.dataset.quiz)] = Number(el.value);
  } else if (el.dataset.names && ev.type === 'change') {
    setPath(store.ui, el.dataset.names, [...el.files].map((f) => f.name));
    refresh();
  } else if (el.dataset.change && ev.type === 'change') {
    handlers[el.dataset.change]?.({ id: el.value }, el, ev);
  }
};
document.addEventListener('input', onField);
document.addEventListener('change', onField);
window.addEventListener('hashchange', () => { stopSpeaking(); refresh(); });
window.addEventListener('beforeunload', () => { stopSpeaking(); save(); });

refresh();
