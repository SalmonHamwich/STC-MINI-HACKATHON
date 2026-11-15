// ReadyHands — volunteer screens.
import * as L from './logic.js';
import { AREAS, LABELS, MODULES, getModule } from './data.js';
import {
  store, S, me, T, Lx, lab, esc, icon, assetIcon, pill, meter, levelTone, needsList, shiftStatusPill, reasonInfo, field, options, chip,
  demoTag, notice, on, refresh, go, toast, confirmDialog, speak, canSpeak, fmtTime, fmtDate, fmtWhen, fmtH, hoursText, postWhen, siteTags, plural,
} from './ui.js';

const boardPosts = () => S().posts.filter((p) => p.status === 'live' && p.mode === S().mode);
const myShifts = (statuses) => S().shifts.filter((s) => s.volunteer === me().id && (!statuses || statuses.includes(s.status)));

// ---------- Home ----------
const hero = () => `
<svg class="hero decor" viewBox="0 0 520 250" role="img" aria-label="${T('Illustration: volunteers with a 4x4 and a water pump helping at a school as floodwater recedes.', 'Ilustrasi: sukarelawan dengan 4x4 dan pam air membantu di sekolah ketika air banjir surut.')}">
  <rect width="520" height="250" rx="18" fill="#E9EFDF"/>
  <circle cx="440" cy="52" r="26" fill="#FFF5D9"/>
  <path d="M0 150 Q130 120 260 142 T520 132 V250 H0z" fill="#DCE4D9"/>
  <g>
    <rect x="70" y="80" width="170" height="92" rx="4" fill="#FFFFFF" stroke="#225B45" stroke-width="3"/>
    <path d="M60 82 L155 40 L250 82z" fill="#225B45"/>
    <rect x="140" y="126" width="30" height="46" fill="#225B45"/>
    <rect x="88" y="98" width="30" height="24" fill="#E1EEF7" stroke="#225B45" stroke-width="2"/>
    <rect x="192" y="98" width="30" height="24" fill="#E1EEF7" stroke="#225B45" stroke-width="2"/>
    <rect x="151" y="20" width="3" height="22" fill="#183E35"/><path d="M154 20h16l-4 5 4 5h-16z" fill="#8A5A00"/>
  </g>
  <g>
    <rect x="318" y="128" width="120" height="38" rx="8" fill="#225B45"/>
    <path d="M338 128 l12-24 h48 l14 24z" fill="#2C7A4B"/>
    <path d="M352 124 l7-15 h17 v15z M382 124 v-15 h13 l8 15z" fill="#E1EEF7"/>
    <circle cx="346" cy="168" r="14" fill="#183E35"/><circle cx="346" cy="168" r="6" fill="#DCE4D9"/>
    <circle cx="412" cy="168" r="14" fill="#183E35"/><circle cx="412" cy="168" r="6" fill="#DCE4D9"/>
    <rect x="424" y="112" width="26" height="16" rx="2" fill="#8A5A00"/>
  </g>
  <g fill="#183E35">
    <circle cx="272" cy="126" r="9"/><rect x="264" y="137" width="16" height="30" rx="6" fill="#1F5F8B"/>
    <circle cx="298" cy="132" r="8"/><rect x="291" y="142" width="14" height="26" rx="6" fill="#8A5A00"/>
    <path d="M280 146 l14 18" stroke="#183E35" stroke-width="3"/>
  </g>
  <g><rect x="462" y="150" width="34" height="22" rx="4" fill="#53685E"/><path d="M462 160 h-26 q-10 0 -10 12" stroke="#53685E" stroke-width="5" fill="none"/></g>
  <path d="M0 196 q26-10 52 0 t52 0 52 0 52 0 52 0 52 0 52 0 52 0 52 0 52 0 V250 H0z" fill="#1F5F8B" opacity=".28"/>
  <path d="M0 214 q26-10 52 0 t52 0 52 0 52 0 52 0 52 0 52 0 52 0 52 0 52 0 V250 H0z" fill="#1F5F8B" opacity=".4"/>
</svg>`;

function neededNow() {
  const open = boardPosts().filter((p) => !L.isFull(S(), p));
  const count = (test) => open.filter(test).length;
  const items = [
    ['truck', lab('asset', 'fourByFour'), count((p) => p.assets.includes('fourByFour'))],
    ['boat', lab('asset', 'boat'), count((p) => p.assets.includes('boat'))],
    ['plug', lab('asset', 'generator'), count((p) => p.assets.includes('generator'))],
    ['shield', lab('badge', 'electrician'), count((p) => p.badge === 'electrician')],
    ['shield', lab('badge', 'medic'), count((p) => p.badge === 'medic')],
  ];
  return `<section class="card stat decor" aria-labelledby="needed-h">
    <h2 id="needed-h">${T('Needed right now', 'Diperlukan sekarang')}</h2>
    <ul class="needed">${items.map(([ic, name, n]) => `<li>${icon(ic)}<strong>${n}</strong> ${n === 1 ? T('post needs', 'tugasan perlukan') : T('posts need', 'tugasan perlukan')} ${esc(name)}</li>`).join('')}</ul>
    <p class="hint">${T('Sample data. Counts come from live posts in this demo.', 'Data contoh. Kiraan daripada tugasan aktif dalam demo ini.')}</p>
  </section>`;
}

const demoGuide = () => `
<details class="card guide">
  <summary>${T('3-minute demo guide', 'Panduan demo 3 minit')}</summary>
  <p class="hint">${T('Switch person with “Viewing as” in the demo controls. Nothing here is a real sign-in.', 'Tukar orang melalui “Lihat sebagai” dalam kawalan demo. Ini bukan log masuk sebenar.')}</p>
  <ol>
    <li>${T('<b>Cikgu Rahimah</b> → My posts → Create a post → school damage report → send.', '<b>Cikgu Rahimah</b> → Tugasan saya → Cipta tugasan → laporan kerosakan sekolah → hantar.')}</li>
    <li>${T('<b>Puan Salmah</b> (coordinator) → approve the three posts.', '<b>Puan Salmah</b> (penyelaras) → luluskan tiga tugasan.')}</li>
    <li>${T('<b>Aina</b> → My profile → Cleanup, Driving, 4x4 → save. <b>Faiz</b> → Electrician → send badge for checking.', '<b>Aina</b> → Profil saya → Pembersihan, Memandu, 4x4 → simpan. <b>Faiz</b> → Juruelektrik → hantar lencana untuk semakan.')}</li>
    <li>${T('Aina’s board: the overlooked school’s 4x4 delivery is on top; the full urban cleanup redirects.', 'Papan Aina: penghantaran 4x4 sekolah terabai di atas; pembersihan bandar yang penuh mengalih ke tempat lain.')}</li>
    <li>${T('Aina: Mud cleanup → complete “Safe flood cleanup” → request both posts.', 'Aina: Bersihkan lumpur → lengkapkan “Pembersihan banjir yang selamat” → mohon kedua-dua tugasan.')}</li>
    <li>${T('Coordinator verifies Faiz’s badge (demo); Faiz requests the wiring check.', 'Penyelaras mengesahkan lencana Faiz (demo); Faiz memohon pemeriksaan pendawaian.')}</li>
    <li>${T('Cikgu Rahimah accepts the requests.', 'Cikgu Rahimah menerima permohonan.')}</li>
    <li>${T('Aina: My shifts → check in → Simulate overdue → see the coordinator alert → check out.', 'Aina: Syif saya → daftar masuk → Simulasi lewat → lihat amaran penyelaras → daftar keluar.')}</li>
    <li>${T('Aina tries a third post today: blocked by the 8-hour limit.', 'Aina cuba tugasan ketiga hari ini: dihalang oleh had 8 jam.')}</li>
    <li>${T('Aina: My impact → badges and certificate.', 'Aina: Impak saya → lencana dan sijil.')}</li>
    <li>${T('Cikgu Rahimah: site overview → confirm “Supplies in” on the reopening tracker.', 'Cikgu Rahimah: gambaran tapak → sahkan “Bekalan tiba” pada penjejak pembukaan semula.')}</li>
  </ol>
</details>`;

export function home() {
  const u = me();
  const needHref = u.roles.poster === 'approved' ? '#create' : '#become-poster';
  return `
  <div class="home">
    <div class="home-lead">
      <h1 tabindex="-1">${T('Help where your skills and equipment matter most.', 'Bantu di tempat kemahiran dan peralatan anda paling diperlukan.')}</h1>
      <p class="lead">${T('ReadyHands sends the right volunteer, with the right skills and equipment, safely to where help is needed.', 'ReadyHands menghantar sukarelawan yang tepat, dengan kemahiran dan peralatan yang tepat, dengan selamat ke tempat bantuan diperlukan.')}</p>
      <div class="choices">
        <a class="btn btn-primary btn-big" href="${u.profileSaved ? '#posts' : '#profile'}">${icon('hands')} ${T('I want to volunteer', 'Saya mahu menjadi sukarelawan')}</a>
        <a class="btn btn-secondary btn-big" href="${needHref}">${icon('megaphone')} ${T('I need help for a site', 'Saya perlukan bantuan untuk tapak')}</a>
      </div>
      <p><a href="#coordinator">${T('I’m a coordinator', 'Saya penyelaras')}</a></p>
    </div>
    ${hero()}
  </div>
  ${S().mode === 'prepare' ? notice('info', T('<b>Preparedness mode.</b> No active disaster. Get trained and stay ready.', '<b>Mod kesiapsiagaan.</b> Tiada bencana aktif. Dapatkan latihan dan kekal bersedia.')) : ''}
  ${neededNow()}
  ${demoGuide()}
  <p class="hint">${T('Prototype with sample data, coordinated in this demo by the fictional organisation Harapan Relief.', 'Prototaip dengan data contoh, diselaraskan dalam demo ini oleh organisasi rekaan Harapan Relief.')}</p>`;
}

// ---------- Profile ----------
function profileDraft() {
  const u = me();
  if (store.ui.profile?.uid !== u.id) {
    store.ui.profile = { uid: u.id, name: u.name, area: u.area, availability: u.availability, skills: [...u.skills], assets: [...u.assets], assetNotes: u.assetNotes || '', operate: u.assets.length > 0, errors: {} };
  }
  return store.ui.profile;
}

function badgeRow(u) {
  return L.BADGES.map((b) => {
    const st = L.badgeStatus(u, b), info = u.badges[b];
    const name = lab('badge', b);
    let body;
    if (st === 'verified') {
      body = `${pill('ok', T('Verified (demo)', 'Disahkan (demo)'), 'shield')}
        <p class="hint">${T('Checked by the Harapan Relief coordinator in this demo on', 'Disemak oleh penyelaras Harapan Relief dalam demo ini pada')} ${fmtDate(info.verifiedAt, true)}. ${T('No real credential check took place.', 'Tiada semakan kelayakan sebenar dilakukan.')}</p>`;
    } else if (st === 'pending') {
      body = `${pill('caution', T('Pending check', 'Menunggu semakan'), 'clock')}
        <p class="hint">${T('Usually 1 to 5 days. A coordinator must approve it.', 'Biasanya 1 hingga 5 hari. Penyelaras perlu meluluskannya.')}${info.file ? ` ${T('File', 'Fail')}: ${esc(info.file)}` : ''}</p>`;
    } else {
      body = `${pill('muted', T('Not claimed', 'Belum dituntut'), 'info')}
        <p class="hint">${esc(lab('badgeBody', b))}.</p>
        <label class="file-label" for="badge-file-${b}">${T('Certificate file (optional, name only is kept)', 'Fail sijil (pilihan, hanya nama disimpan)')}</label>
        <input type="file" id="badge-file-${b}" data-file="badge-${b}">
        <button type="button" class="btn btn-secondary" data-act="claim-badge" data-key="${b}">${T(`Send ${name} badge for checking`, `Hantar lencana ${name} untuk semakan`)} ${demoTag()}</button>`;
    }
    return `<li class="badge-card"><h3>${icon('shield')} ${esc(name)}</h3>${body}</li>`;
  }).join('');
}

export function profile() {
  const u = me(), d = profileDraft(), e = d.errors || {};
  const dirty = JSON.stringify([d.name, d.area, d.availability, [...d.skills].sort(), [...d.assets].sort()]) !== JSON.stringify([u.name, u.area, u.availability, [...u.skills].sort(), [...u.assets].sort()]);
  const pro = d.skills.filter((s) => L.PRO_SKILLS.includes(s));
  const rest = L.restStatus(S(), u);
  const app = [...S().posterApps].reverse().find((a) => a.user === u.id);
  return `
  <h1 tabindex="-1">${T('Your helping hand starts here.', 'Bantuan anda bermula di sini.')}</h1>
  <p class="lead">${T('Tell us what you can do and what you can bring. Posts are matched on both.', 'Beritahu kami apa yang anda boleh lakukan dan bawa. Tugasan dipadankan dengan kedua-duanya.')}</p>
  <form class="card" data-form="profile" novalidate>
    <div class="grid-3">
      ${field('pf-name', `${T('Your name', 'Nama anda')} <small>(${T('optional', 'pilihan')})</small>`, `<input id="pf-name" type="text" autocomplete="off" data-bind="profile.name" value="${esc(d.name)}">`)}
      ${field('pf-area', T('Your area', 'Kawasan anda'), `<select id="pf-area" data-bind="profile.area">${options(AREAS.map((a) => [a, a]), d.area)}</select>`)}
      ${field('pf-avail', T('Available', 'Masa lapang'), `<select id="pf-avail" data-bind="profile.availability">${options(Object.keys(LABELS.availability).map((k) => [k, lab('availability', k)]), d.availability)}</select>`)}
    </div>
    <fieldset>
      <legend>${T('What can you do?', 'Apa yang anda boleh lakukan?')}</legend>
      <div class="chips">${L.SKILLS.map((s) => chip('toggle-skill', s, lab('skill', s), d.skills.includes(s), 'wrench')).join('')}</div>
      <p class="sub-legend">${T('Professional (needs checking):', 'Profesional (perlu disemak):')}</p>
      <div class="chips">${L.PRO_SKILLS.map((s) => chip('toggle-skill', s, lab('skill', s), d.skills.includes(s), 'shield')).join('')}</div>
      ${pro.filter((s) => L.badgeStatus(u, s) !== 'verified').map((s) => notice('caution', T(`<b>${lab('skill', s)}: not yet checked.</b> Upload your certificate below to get a verified badge. Until then you can’t take ${lab('skill', s).toLowerCase()} posts.`, `<b>${lab('skill', s)}: belum disemak.</b> Muat naik sijil anda di bawah untuk mendapat lencana disahkan. Sehingga itu anda tidak boleh mengambil tugasan ${lab('skill', s).toLowerCase()}.`), 'shield')).join('')}
    </fieldset>
    <fieldset>
      <legend>${T('What can you bring?', 'Apa yang anda boleh bawa?')} <small>(${T('optional', 'pilihan')})</small></legend>
      <div class="chips">${L.ASSETS.map((a) => chip('toggle-asset', a, lab('asset', a), d.assets.includes(a), assetIcon(a))).join('')}</div>
      ${d.assets.length ? `
        ${field('pf-notes', `${T('Details', 'Butiran')} <small>(${T('optional', 'pilihan')})</small>`, `<input id="pf-notes" type="text" data-bind="profile.assetNotes" value="${esc(d.assetNotes)}">`, { hint: T('For example: boat seats 6; 4x4 can carry supplies.', 'Contohnya: bot muat 6 orang; 4x4 boleh membawa bekalan.') })}
        <label class="check${e.operate ? ' has-error' : ''}"><input type="checkbox" id="pf-operate" data-bind="profile.operate" ${d.operate ? 'checked' : ''} ${e.operate ? 'aria-invalid="true" aria-describedby="pf-operate-err"' : ''}> <span>${T('I will drive or operate my own equipment myself.', 'Saya sendiri akan memandu atau mengendalikan peralatan saya.')}</span></label>
        ${e.operate ? `<p class="error" id="pf-operate-err">${icon('triangle')} ${T('Please confirm you will operate your own equipment.', 'Sila sahkan anda sendiri akan mengendalikan peralatan anda.')}</p>` : ''}` : ''}
    </fieldset>
    ${dirty ? `<p class="hint" role="status">${T('You have changes that are not saved yet.', 'Anda mempunyai perubahan yang belum disimpan.')}</p>` : ''}
    <button type="submit" class="btn btn-primary btn-big">${T('Save profile and find posts', 'Simpan profil dan cari tugasan')} ${icon('arrow')}</button>
  </form>

  <section class="card" aria-labelledby="badges-h">
    <h2 id="badges-h">${T('Verification badges', 'Lencana pengesahan')}</h2>
    <p>${T('Professional posts and tasks with pupils need a verified badge. Ticking a skill never verifies it.', 'Tugasan profesional dan tugasan bersama murid memerlukan lencana disahkan. Menanda kemahiran tidak mengesahkannya.')}</p>
    ${notice('info', T('<b>Simulation.</b> This prototype does not contact any professional body. Do not upload real certificates.', '<b>Simulasi.</b> Prototaip ini tidak menghubungi mana-mana badan profesional. Jangan muat naik sijil sebenar.'))}
    <ul class="badge-grid">${badgeRow(u)}</ul>
  </section>

  <div class="grid-2">
    <section class="card" aria-labelledby="pf-train-h">
      <h2 id="pf-train-h">${icon('play')} ${T('Training', 'Latihan')}</h2>
      <p>${T(`${MODULES.filter((m) => L.trainingValid(u, m.id, S().now)).length} of ${MODULES.length} modules done.`, `${MODULES.filter((m) => L.trainingValid(u, m.id, S().now)).length} daripada ${MODULES.length} modul selesai.`)}</p>
      <a class="btn btn-secondary" href="#training">${T('Open 2-minute training', 'Buka latihan 2 minit')}</a>
    </section>
    <section class="card" aria-labelledby="pf-rest-h">
      <h2 id="pf-rest-h">${icon('moon')} ${T('Rest and recognition', 'Rehat dan penghargaan')}</h2>
      <p>${T(`${fmtH(rest.today)} of ${rest.dayCap} hours today · ${fmtH(rest.week)} of ${rest.weekCap} this week.`, `${fmtH(rest.today)} daripada ${rest.dayCap} jam hari ini · ${fmtH(rest.week)} daripada ${rest.weekCap} minggu ini.`)}</p>
      <a class="btn btn-secondary" href="#recognition">${T('My impact', 'Impak saya')}</a>
    </section>
  </div>

  <section class="card" aria-labelledby="pf-poster-h">
    <h2 id="pf-poster-h">${icon('megaphone')} ${T('Need help for a site?', 'Perlukan bantuan untuk tapak?')}</h2>
    ${u.roles.poster === 'approved' ? `<p>${pill('ok', T('Approved poster', 'Pemohon diluluskan'), 'check')} ${T('You can create posts and keep volunteering.', 'Anda boleh mencipta tugasan dan terus menjadi sukarelawan.')}</p><a class="btn btn-secondary" href="#my-posts">${T('My posts', 'Tugasan saya')}</a>`
      : u.roles.poster === 'pending' ? `<p>${pill('caution', T('Waiting for coordinator approval', 'Menunggu kelulusan penyelaras'), 'clock')} ${T('You can keep volunteering meanwhile.', 'Anda boleh terus menjadi sukarelawan buat sementara.')}</p>`
      : `${app?.status === 'declined' ? notice('alert', T(`Your last application was declined: “${esc(app.reason)}”. Fix this and apply again.`, `Permohonan terakhir anda ditolak: “${esc(app.reason)}”. Betulkan dan mohon semula.`), 'triangle') : ''}
         <p>${T('To post, a coordinator first checks who you are and which site you represent.', 'Untuk menyiarkan tugasan, penyelaras akan menyemak siapa anda dan tapak yang anda wakili.')}</p>
         <a class="btn btn-secondary" href="#become-poster">${T('Apply to become a poster', 'Mohon menjadi pemohon bantuan')}</a>`}
  </section>`;
}

on('toggle-skill', ({ key }) => { const d = profileDraft(); d.skills = d.skills.includes(key) ? d.skills.filter((x) => x !== key) : [...d.skills, key]; refresh(); });
on('toggle-asset', ({ key }) => { const d = profileDraft(); d.assets = d.assets.includes(key) ? d.assets.filter((x) => x !== key) : [...d.assets, key]; if (!d.assets.length) d.operate = false; refresh(); });
on('submit-profile', () => {
  const d = profileDraft();
  d.errors = {};
  if (d.assets.length && !d.operate) { d.errors.operate = true; refresh(); document.getElementById('pf-operate')?.focus(); return; }
  L.saveProfile(S(), me().id, d);
  store.ui.profile = null;
  toast(T('Profile saved. Posts are now matched to your skills and equipment.', 'Profil disimpan. Tugasan kini dipadankan dengan kemahiran dan peralatan anda.'));
  go('#posts');
});
on('claim-badge', async ({ key }) => {
  const name = lab('badge', key);
  const file = document.querySelector(`[data-file="badge-${key}"]`)?.files?.[0]?.name || '';
  const res = await confirmDialog({
    title: T(`Send ${name} badge for checking?`, `Hantar lencana ${name} untuk semakan?`),
    body: `<p>${T('A coordinator must approve it before you can take posts that need it. In this demo the check is simulated and no document leaves your device.', 'Penyelaras perlu meluluskannya sebelum anda boleh mengambil tugasan yang memerlukannya. Dalam demo ini semakan disimulasikan dan tiada dokumen meninggalkan peranti anda.')}</p>`,
    confirm: T('Send for checking (demo)', 'Hantar untuk semakan (demo)'),
  });
  if (!res) return;
  L.claimBadge(S(), me().id, key, file);
  toast(T(`${name} badge is now pending a coordinator check.`, `Lencana ${name} kini menunggu semakan penyelaras.`));
  refresh();
});

// ---------- Training ----------
function moduleStatus(u, m) {
  if (L.trainingValid(u, m.id, S().now)) return { done: true, html: pill('ok', `${T('Done, valid to', 'Selesai, sah hingga')} ${fmtDate(L.trainingExpiry(u, m.id), true)}`, 'check') };
  if (u.training[m.id]) return { done: false, html: pill('alert', T('Expired after 12 months. Retake.', 'Tamat selepas 12 bulan. Ulang semula.'), 'triangle') };
  const need = boardPosts().filter((p) => p.training.includes(m.id) && !L.isFull(S(), p) && L.matchInfo(u, p).match);
  if (need.length) return { done: false, html: pill('caution', `${T('Required for', 'Diperlukan untuk')}: ${Lx(need[0].title)}`, 'play') };
  return { done: false, html: pill('muted', T('Not started', 'Belum bermula'), 'play') };
}

export function trainingList() {
  const u = me();
  return `
  <h1 tabindex="-1">${T('Before you go: 2-minute training', 'Sebelum bertolak: latihan 2 minit')}</h1>
  <p class="lead">${T('Each module has illustrated cards, one quick activity and 3 questions. Passing is valid for 12 months.', 'Setiap modul mempunyai kad bergambar, satu aktiviti ringkas dan 3 soalan. Kelulusan sah selama 12 bulan.')}</p>
  ${notice('info', T('<b>Low-bandwidth version.</b> This prototype has no video hosting, so every module uses illustrated cards with a transcript and Read aloud.', '<b>Versi jalur lebar rendah.</b> Prototaip ini tiada pengehosan video, jadi setiap modul menggunakan kad bergambar dengan transkrip dan Baca kuat.'))}
  <ul class="list">
    ${MODULES.map((m) => {
      const st = moduleStatus(u, m);
      return `<li class="card train-card">
        <div>
          <h2>${icon(m.icon)} ${esc(Lx(m.title))} <small>${m.minutes}:00</small></h2>
          <p>${st.html}</p>
          <p class="hint">${T('Required for', 'Diperlukan untuk')}: ${esc(Lx(m.requiredFor))}</p>
        </div>
        <a class="btn ${st.done ? 'btn-secondary' : 'btn-primary'}" href="#training/${m.id}">${st.done ? T('Review', 'Ulang kaji') : T('Start', 'Mula')}<span class="sr"> ${esc(Lx(m.title))}</span></a>
      </li>`;
    }).join('')}
  </ul>`;
}

function quizState(id) {
  if (store.ui.quiz?.id !== id || store.ui.quiz?.uid !== me().id) store.ui.quiz = { id, uid: me().id, picked: [], checked: false, answers: [], wrong: null, passed: false };
  return store.ui.quiz;
}

export function trainingModule(id, query) {
  const m = getModule(id);
  if (!m) return trainingList();
  const u = me(), qz = quizState(id);
  const back = query.get('back');
  const backPost = back && L.getPost(S(), back);
  const valid = L.trainingValid(u, id, S().now);
  const transcript = m.cards.map((c) => Lx(c)).join(' ');
  const actRight = m.activity.items.every((it, i) => qz.picked.includes(i) === it.correct);
  return `
  <p><a href="#training">← ${T('All training', 'Semua latihan')}</a></p>
  <h1 tabindex="-1">${esc(Lx(m.title))}</h1>
  <p class="lead">${icon('clock')} ${m.minutes} ${T('minutes', 'minit')} · ${T('Required for', 'Diperlukan untuk')}: ${esc(Lx(m.requiredFor))}</p>
  ${valid && !qz.passed ? notice('ok', T(`You completed this module. Valid to ${fmtDate(L.trainingExpiry(u, id), true)}. You can review it any time.`, `Anda telah melengkapkan modul ini. Sah hingga ${fmtDate(L.trainingExpiry(u, id), true)}. Anda boleh mengulang kaji bila-bila masa.`), 'check') : ''}

  <section class="card" aria-labelledby="tr-learn">
    <h2 id="tr-learn">1. ${T('Learn', 'Belajar')}</h2>
    <p class="hint">${T('Illustrated cards (low-bandwidth alternative to video).', 'Kad bergambar (alternatif jalur lebar rendah kepada video).')}</p>
    <ol class="lesson">
      ${m.cards.map((c, i) => `<li><span class="lesson-n" aria-hidden="true">${i + 1}</span><span class="lesson-ic" aria-hidden="true">${icon(m.icon)}</span><p>${esc(Lx(c))}</p></li>`).join('')}
    </ol>
    ${canSpeak() ? `<button type="button" class="btn btn-secondary" data-act="speak-text" data-text="${esc(transcript)}">${icon('sound')} ${T('Read this lesson aloud', 'Baca pelajaran ini dengan kuat')}</button>` : ''}
    <details><summary>${T('Transcript', 'Transkrip')}</summary><p>${esc(transcript)}</p></details>
  </section>

  <section class="card" aria-labelledby="tr-act">
    <h2 id="tr-act">2. ${T('Quick activity', 'Aktiviti ringkas')}</h2>
    <p id="tr-act-q">${esc(Lx(m.activity.prompt))}</p>
    <div class="chips" role="group" aria-labelledby="tr-act-q">
      ${m.activity.items.map((it, i) => chip('act-pick', i, Lx(it.text), qz.picked.includes(i))).join('')}
    </div>
    <button type="button" class="btn btn-secondary" data-act="act-check">${T('Check my answer', 'Semak jawapan saya')}</button>
    ${qz.checked ? notice(actRight ? 'ok' : 'caution', actRight ? T('That’s right.', 'Betul.') : T('Not quite. Look at the cards again and adjust your choices.', 'Belum tepat. Lihat kad sekali lagi dan ubah pilihan anda.'), actRight ? 'check' : 'info') : ''}
  </section>

  <form class="card" data-form="quiz" novalidate aria-labelledby="tr-quiz">
    <h2 id="tr-quiz">3. ${T('3 quick questions', '3 soalan ringkas')}</h2>
    <p class="hint">${T('All three must be right. You can try again; your answers stay.', 'Ketiga-tiga mesti betul. Anda boleh cuba lagi; jawapan anda kekal.')}</p>
    ${m.questions.map((q, qi) => {
      const bad = qz.wrong?.includes(qi);
      return `<fieldset class="question${bad ? ' has-error' : ''}">
        <legend>${qi + 1}. ${esc(Lx(q.text))}</legend>
        ${q.options.map((o, oi) => `<label class="radio"><input type="radio" name="q${qi}" value="${oi}" data-quiz="${qi}" ${qz.answers[qi] === oi ? 'checked' : ''}> <span>${esc(Lx(o))}</span></label>`).join('')}
        ${bad ? `<p class="error">${icon('triangle')} ${qz.answers[qi] === undefined ? T('Choose an answer.', 'Pilih satu jawapan.') : T('Not this one. Check the cards above and choose again.', 'Bukan yang ini. Semak kad di atas dan pilih semula.')}</p>` : ''}
      </fieldset>`;
    }).join('')}
    ${qz.passed
      ? `${notice('ok', T(`<b>Training complete.</b> “${esc(Lx(m.title))}” is valid to ${fmtDate(L.trainingExpiry(u, id), true)}.`, `<b>Latihan selesai.</b> “${esc(Lx(m.title))}” sah hingga ${fmtDate(L.trainingExpiry(u, id), true)}.`), 'check')}
         <a class="btn btn-primary btn-big" href="${backPost ? `#post/${backPost.id}` : '#posts'}">${backPost ? `${T('Back to', 'Kembali ke')} “${esc(Lx(backPost.title))}”` : T('Find posts', 'Cari tugasan')} ${icon('arrow')}</a>`
      : `<button type="submit" class="btn btn-primary btn-big">${T('Submit answers', 'Hantar jawapan')}</button>`}
  </form>`;
}

on('act-pick', ({ key }) => { const qz = store.ui.quiz, i = Number(key); qz.picked = qz.picked.includes(i) ? qz.picked.filter((x) => x !== i) : [...qz.picked, i]; qz.checked = false; refresh(); });
on('act-check', () => { store.ui.quiz.checked = true; refresh(); });
on('speak-text', ({ text }) => { speak(text); refresh(); });
on('submit-quiz', () => {
  const qz = store.ui.quiz, m = getModule(qz.id);
  const res = L.completeTraining(S(), me().id, m, qz.answers);
  if (res.ok) {
    qz.passed = true; qz.wrong = null;
    toast(T(`Training complete: ${Lx(m.title)}.`, `Latihan selesai: ${Lx(m.title)}.`));
  } else {
    qz.wrong = res.wrong;
    toast(T(`${res.wrong.length} ${plural(res.wrong.length, 'answer needs', 'answers need')} another look. Training is not marked done yet.`, `${res.wrong.length} jawapan perlu disemak semula. Latihan belum ditanda selesai.`));
  }
  refresh();
  if (!res.ok) document.querySelector('.question.has-error input')?.focus();
});

// ---------- Post board ----------
const FILTERS = [
  ['all', () => T('All', 'Semua')], ['skills', () => T('Matches my skills', 'Padan kemahiran saya')], ['equipment', () => T('Matches my equipment', 'Padan peralatan saya')],
  ['hands', () => T('Hands-on', 'Kerja tangan')], ['driving', () => T('Driving and delivery', 'Memandu dan penghantaran')], ['pro', () => T('Professional', 'Profesional')], ['near', () => T('Near me', 'Berhampiran saya')],
];
function passesFilter(f, post, e, u) {
  if (f === 'skills') return e.skills.length > 0;
  if (f === 'equipment') return e.assets.length > 0;
  if (f === 'near') return L.getSite(S(), post.site)?.area === u.area;
  if (f === 'hands' || f === 'driving' || f === 'pro') return L.postCategory(post) === f;
  return true;
}

function matchPill(e) {
  if (e.assets.length) return pill('ok', `${T('Matches your', 'Padan dengan')} ${lab('asset', e.assets[0])}${lang0() === 'bm' ? ' anda' : ''}`, 'check');
  if (e.skills.length) return pill('ok', T('Matches your skills', 'Padan dengan kemahiran anda'), 'check');
  return '';
}
const lang0 = () => S().prefs.lang;

function trainingRow(post, u) {
  if (!post.training.length) return '';
  const missing = post.training.filter((m) => !L.trainingValid(u, m, S().now));
  const items = post.training.map((m) => `${esc(Lx(getModule(m).title))} ${L.trainingValid(u, m, S().now) ? `<span class="ok-mark">${icon('check')}<span class="sr">${T('done', 'selesai')}</span></span>` : `<span class="todo-mark">(${T('to do', 'belum')})</span>`}`).join(' · ');
  const mins = missing.reduce((t, m) => t + getModule(m).minutes, 0);
  return `<p class="req">${icon('play')} <span><b>${missing.length ? T(`Training needed: ${missing.length} ${plural(missing.length, 'module', 'modules')}, ${mins} min`, `Latihan diperlukan: ${missing.length} modul, ${mins} min`) : T('Training', 'Latihan')}:</b> ${items}</span></p>`;
}

function badgeReq(post, u) {
  if (!post.badge) return '';
  const st = L.badgeStatus(u, post.badge);
  return `<p class="req">${icon('shield')} <span><b>${T('Badge', 'Lencana')}:</b> ${T('verified', 'disahkan')} ${esc(lab('badge', post.badge))} ${st === 'verified' ? `<span class="ok-mark">${icon('check')}<span class="sr">${T('you have it', 'anda memilikinya')}</span></span>` : `<span class="todo-mark">(${st === 'pending' ? T('yours is pending', 'lencana anda menunggu semakan') : T('you don’t have it yet', 'anda belum memilikinya')})</span>`}</span></p>`;
}

export function placesLine(post) {
  const left = L.unmet(S(), post), got = L.filled(S(), post);
  const label = left > 0 ? T(`${left} of ${post.qty} ${plural(post.qty, 'place', 'places')} left`, `${left} daripada ${post.qty} tempat masih ada`) : T(`All ${post.qty} places filled`, `Kesemua ${post.qty} tempat penuh`);
  return `<div class="places"><span>${label}</span>${meter(got, post.qty, label, left > 0 ? 'ok' : 'info')}</div>`;
}

function postCard(post, e, u) {
  const site = L.getSite(S(), post.site);
  const title = esc(Lx(post.title));
  let action = '', why = '';
  if (e.state === 'ok') {
    action = `<a class="btn btn-primary" href="#post/${post.id}">${T('View post', 'Lihat tugasan')} ${icon('arrow')}<span class="sr">: ${title}</span></a>`;
  } else if (e.state === 'joined') {
    why = `<p class="why">${shiftStatusPill(e.shift)}</p>`;
    action = `<a class="btn btn-secondary" href="#shifts">${T('View my shift', 'Lihat syif saya')}<span class="sr">: ${title}</span></a>`;
  } else if (e.state === 'blocked') {
    const info = reasonInfo(e.reasons[0], { postId: post.id });
    const more = e.reasons.length - 1;
    why = `<div class="why why-${info.tone}">${icon(info.icon)}<p>${esc(info.text)}${more > 0 ? ` <span class="hint">${T(`+${more} more to fix`, `+${more} lagi perlu diselesaikan`)}</span>` : ''}</p></div>`;
    action = `${e.reasons[0].code === 'rest' ? '' : `<a class="btn btn-primary" href="${info.href}">${esc(info.fix)}<span class="sr">: ${title}</span></a>`}
      <a class="btn btn-secondary" href="#post/${post.id}">${T('View post', 'Lihat tugasan')}<span class="sr">: ${title}</span></a>`;
  } else if (e.state === 'full') {
    const to = L.redirectFor(S(), u, post);
    if (to) {
      const tSite = L.getSite(S(), to.post.site), n = L.unmet(S(), to.post);
      why = `<div class="redirect">${icon('arrow')}<p>${T(`This post is full. <b>${esc(tSite.name)}</b> still needs ${n} more for “${esc(Lx(to.post.title))}”.`, `Tugasan ini penuh. <b>${esc(tSite.name)}</b> masih memerlukan ${n} lagi untuk “${esc(Lx(to.post.title))}”.`)}</p></div>`;
      action = `<a class="btn btn-primary" href="#post/${to.post.id}">${T('Help here instead', 'Bantu di sini pula')} ${icon('arrow')}<span class="sr">: ${esc(Lx(to.post.title))}</span></a>`;
    } else {
      why = `<div class="redirect">${icon('info')}<p>${T('This post is full. Thank you. Check back for new posts.', 'Tugasan ini penuh. Terima kasih. Semak semula untuk tugasan baharu.')}</p></div>`;
    }
  }
  return `
  <li class="card post-card state-${e.state}${site.overlooked ? ' is-overlooked' : ''}">
    <div class="pills">
      ${site.overlooked ? pill('caution', T('Overlooked, priority', 'Terabai, keutamaan'), 'star') : ''}
      ${e.state === 'full' ? pill('info', T('Full', 'Penuh'), 'check') : matchPill(e)}
      ${pill(post.risk === 'high' ? 'alert' : 'muted', `${T('Risk', 'Risiko')}: ${lab('risk', post.risk)}`, 'triangle')}
    </div>
    <h2><a href="#post/${post.id}">${title}</a></h2>
    <p class="meta">${icon('building')} ${esc(site.name)} · ${esc(site.area)} · ${icon('clock')} ${postWhen(post)}</p>
    <p class="req">${icon('wrench')} <span><b>${T('Needs', 'Perlu')}:</b> ${needsList(post)}</span></p>
    ${placesLine(post)}
    ${trainingRow(post, u)}
    ${badgeReq(post, u)}
    ${why}
    <div class="card-actions">${action}</div>
  </li>`;
}

function sidebar(u) {
  const rest = L.restStatus(S(), u);
  const active = myShifts(['requested', 'accepted', 'onsite', 'overdue']);
  return `
  <aside class="sidebar" aria-label="${T('Your summary', 'Ringkasan anda')}">
    <section class="card">
      <h2>${icon('user')} ${esc(u.name || T('Volunteer', 'Sukarelawan'))}</h2>
      <p class="meta">${esc(u.area)} · ${esc(lab('availability', u.availability))}</p>
      ${u.skills.length + u.assets.length ? `<p class="req">${needsList({ skills: u.skills, assets: u.assets }, { opt: false })}</p>` : `<p>${T('No skills or equipment yet.', 'Belum ada kemahiran atau peralatan.')}</p>`}
      <a href="#profile">${T('Edit profile', 'Sunting profil')}</a> · <a href="#training">${T('Training', 'Latihan')}</a>
    </section>
    <section class="card">
      <h2>${icon('moon')} ${T('Rest', 'Rehat')}</h2>
      ${restMeters(rest)}
      <a href="#recognition">${T('My impact', 'Impak saya')}</a>
    </section>
    <section class="card">
      <h2>${icon('clock')} ${T('My shifts', 'Syif saya')}</h2>
      ${active.length ? `<ul class="mini">${active.map((s) => `<li>${esc(Lx(L.getPost(S(), s.post).title))}<br>${shiftStatusPill(s)}</li>`).join('')}</ul>` : `<p>${T('No shifts yet.', 'Belum ada syif.')}</p>`}
      <a href="#shifts">${T('Open My shifts', 'Buka Syif saya')}</a>
    </section>
  </aside>`;
}

export function restMeters(rest) {
  const line = (label, v, cap, level, extra = '') => {
    const note = level === 'at' ? T('At the limit. Rest first.', 'Mencapai had. Rehat dahulu.') : level === 'near' ? T('Rest soon', 'Rehat tidak lama lagi') : '';
    const text = `${label}: ${fmtH(v)} ${T('of', 'daripada')} ${cap} ${T('hours', 'jam')}${extra}`;
    return `<div class="rest-line"><div class="rest-top"><span>${text}</span>${note ? pill(levelTone(level), note, level === 'at' ? 'triangle' : 'moon') : ''}</div>${meter(v, cap, `${text}. ${note}`, levelTone(level))}</div>`;
  };
  return `
    ${line(T('Today', 'Hari ini'), rest.today, rest.dayCap, rest.dayLevel, rest.planned > 0.05 ? ` (+${fmtH(rest.planned)} ${T('planned', 'dirancang')})` : '')}
    ${line(T('This week', 'Minggu ini'), rest.week, rest.weekCap, rest.weekLevel)}
    ${rest.restDay ? notice('alert', T(`You’ve helped ${L.RULES.maxStreakDays} days in a row. Today is a rest day.`, `Anda telah membantu ${L.RULES.maxStreakDays} hari berturut-turut. Hari ini hari rehat.`), 'moon') : ''}
    ${rest.override ? notice('caution', T(`A coordinator raised today’s limit to ${rest.dayCap} hours. Reason: “${esc(rest.override.reason)}”`, `Penyelaras menaikkan had hari ini kepada ${rest.dayCap} jam. Sebab: “${esc(rest.override.reason)}”`), 'info') : ''}`;
}

export function posts() {
  const u = me();
  const f = store.ui.filter || 'all';
  const ranked = L.rankPosts(S(), u, boardPosts());
  const shown = ranked.filter(({ post, e }) => passesFilter(f, post, e, u));
  const prepare = S().mode === 'prepare';
  const todo = MODULES.filter((m) => !L.trainingValid(u, m.id, S().now));
  return `
  <h1 tabindex="-1">${T('Posts that fit you.', 'Tugasan yang sesuai dengan anda.')}</h1>
  <p class="lead">${T('Ranked by unmet need and your skills and equipment.', 'Disusun mengikut keperluan belum dipenuhi serta kemahiran dan peralatan anda.')}</p>
  ${prepare ? notice('info', T('<b>No active disaster.</b> Get trained and stay ready.', '<b>Tiada bencana aktif.</b> Dapatkan latihan dan kekal bersedia.')) : ''}
  ${!u.skills.length && !u.assets.length ? notice('caution', T('Add your skills and equipment so we can match posts to you. <a href="#profile">Complete my profile</a>', 'Tambah kemahiran dan peralatan supaya kami boleh memadankan tugasan. <a href="#profile">Lengkapkan profil saya</a>'), 'user') : ''}
  <div class="board">
    <div class="board-main">
      ${prepare ? `<section class="card" aria-labelledby="prep-h"><h2 id="prep-h">${icon('play')} ${T('Training first', 'Latihan dahulu')}</h2>
        ${todo.length ? `<ul class="mini">${todo.slice(0, 4).map((m) => `<li><a href="#training/${m.id}">${esc(Lx(m.title))}</a> · ${m.minutes} min</li>`).join('')}</ul><a class="btn btn-primary" href="#training/${todo[0].id}">${T('Start', 'Mula')} “${esc(Lx(todo[0].title))}”</a>` : `<p>${T('All modules done. Well prepared.', 'Semua modul selesai. Bersedia sepenuhnya.')}</p>`}</section>` : ''}
      <div class="filters" role="group" aria-label="${T('Filter posts', 'Tapis tugasan')}">
        ${FILTERS.map(([k, t]) => chip('filter', k, t(), f === k)).join('')}
      </div>
      <p class="hint" role="status">${T(`Showing ${shown.length} of ${ranked.length} posts. Posts you can’t join yet stay visible with the reason.`, `Memaparkan ${shown.length} daripada ${ranked.length} tugasan. Tugasan yang belum boleh disertai tetap dipaparkan bersama sebabnya.`)}</p>
      <ul class="list">${shown.map(({ post, e }) => postCard(post, e, u)).join('') || `<li class="card">${T('No posts match this filter.', 'Tiada tugasan yang sepadan dengan tapisan ini.')}</li>`}</ul>
    </div>
    ${sidebar(u)}
  </div>`;
}
on('filter', ({ key }) => { store.ui.filter = key; refresh(); });

// ---------- Post detail ----------
function safetyRules(post, site) {
  const rules = [
    T('Check in with the poster when you arrive and check out when you leave.', 'Daftar masuk dengan pemohon apabila tiba dan daftar keluar apabila pulang.'),
    T('Never work alone. Stop if you feel unsafe and tell the poster.', 'Jangan bekerja bersendirian. Berhenti jika berasa tidak selamat dan beritahu pemohon.'),
  ];
  if (post.risk !== 'low') rules.push(T('Wear the protective equipment named in the training.', 'Pakai peralatan pelindung yang dinyatakan dalam latihan.'));
  const child = site.type === 'school' ? `
    <div class="notice notice-attention">${icon('shield')}<div><b>${T('Child-safe rules at this school', 'Peraturan selamat kanak-kanak di sekolah ini')}</b>
      <ul><li>${T('Tasks with pupils present need a verified Child-safe badge.', 'Tugasan bersama murid memerlukan lencana Selamat kanak-kanak yang disahkan.')}</li>
      <li>${T('No one is ever alone with a pupil.', 'Tiada sesiapa boleh bersendirian dengan murid.')}</li>
      <li>${T('No photos or videos of pupils.', 'Tiada gambar atau video murid.')}</li></ul></div></div>` : '';
  return `<ul>${rules.map((r) => `<li>${r}</li>`).join('')}</ul>${child}`;
}

const riskText = (risk) => ({
  low: T('Low: light work in a safe area.', 'Rendah: kerja ringan di kawasan selamat.'),
  medium: T('Medium: mud, lifting or driving on affected roads. Training is required.', 'Sederhana: lumpur, mengangkat atau memandu di jalan terjejas. Latihan diperlukan.'),
  high: T('High: electricity, structures, water or medical care. Only trained and verified people may join.', 'Tinggi: elektrik, struktur, air atau rawatan perubatan. Hanya yang terlatih dan disahkan boleh menyertai.'),
}[risk]);

export function postDetail(id) {
  const post = L.getPost(S(), id);
  if (!post) return `<h1 tabindex="-1">${T('Post not found', 'Tugasan tidak ditemui')}</h1><a href="#posts">${T('Back to posts', 'Kembali ke tugasan')}</a>`;
  const u = me(), site = L.getSite(S(), post.site), poster = L.getUser(S(), post.poster);
  const e = L.eligibility(S(), u, post);
  const bring = post.assets.filter((a) => u.assets.includes(a));
  const rule = (okay, text, fix = '') => `<li class="${okay ? 'rule-ok' : 'rule-no'}">${icon(okay ? 'check' : 'x')}<span><span class="sr">${okay ? T('Met', 'Dipenuhi') : T('Not met', 'Belum dipenuhi')}: </span>${text}${fix}</span></li>`;
  const r = (code) => e.reasons.find((x) => x.code === code);
  const fixLink = (reason) => { const i = reasonInfo(reason, { postId: post.id }); return reason.code === 'rest' ? '' : ` <a href="${i.href}">${esc(i.fix)}</a>`; };
  let action;
  if (e.state === 'closed') action = notice('caution', T('This post is not live.', 'Tugasan ini tidak aktif.'));
  else if (e.state === 'joined') action = `${notice('ok', e.shift.status === 'requested' ? T('Request sent to the poster. You’ll see it under My shifts.', 'Permohonan dihantar kepada pemohon. Lihat di Syif saya.') : T('You are on this post.', 'Anda menyertai tugasan ini.'), 'check')}<a class="btn btn-primary btn-big" href="#shifts">${T('Go to My shifts', 'Pergi ke Syif saya')} ${icon('arrow')}</a>`;
  else if (e.state === 'full') {
    const to = L.redirectFor(S(), u, post);
    action = `${notice('info', T('This post is full. Thank you for wanting to help.', 'Tugasan ini penuh. Terima kasih kerana ingin membantu.'))}${to ? `<a class="btn btn-primary btn-big" href="#post/${to.post.id}">${T('Help here instead', 'Bantu di sini pula')}: ${esc(Lx(to.post.title))} ${icon('arrow')}</a>` : ''}`;
  } else if (e.state === 'blocked') {
    const info = reasonInfo(e.reasons[0], { postId: post.id });
    action = `${notice(info.tone === 'alert' ? 'alert' : 'caution', esc(info.text), info.icon)}${e.reasons[0].code === 'rest' ? `<a class="btn btn-secondary btn-big" href="#recognition">${esc(info.fix)}</a>` : `<a class="btn btn-primary btn-big" href="${info.href}">${esc(info.fix)} ${icon('arrow')}</a>`}`;
  } else action = `<button type="button" class="btn btn-primary btn-big" data-act="request-join" data-id="${post.id}">${T('Request to join', 'Mohon sertai')}</button><p class="hint">${T('The poster accepts or declines each request.', 'Pemohon menerima atau menolak setiap permohonan.')}</p>`;

  return `
  <p><a href="#posts">← ${T('All posts', 'Semua tugasan')}</a></p>
  <div class="pills">${site.overlooked ? pill('caution', T('Overlooked, priority', 'Terabai, keutamaan'), 'star') : ''}${e.match && e.state !== 'full' ? matchPill(e) : ''}</div>
  <h1 tabindex="-1">${esc(Lx(post.title))}</h1>
  <p class="meta">${icon('building')} <a href="#site/${site.id}">${esc(site.name)}</a> · ${esc(site.area)} · ${T('Posted by', 'Disiarkan oleh')} ${esc(poster.name)} · ${T('approved by the coordinator', 'diluluskan penyelaras')}</p>
  <div class="detail">
    <div>
      <section class="card">
        <h2>${T('What to do', 'Apa yang perlu dibuat')}</h2>
        <p>${esc(Lx(post.desc)) || T('Details from the poster on arrival.', 'Butiran daripada pemohon semasa tiba.')}</p>
        <dl class="facts">
          <dt>${icon('clock')} ${T('Shift', 'Syif')}</dt><dd>${fmtWhen(post.start)} – ${fmtTime(post.start + post.hours * L.H)} (${hoursText(post.hours)})</dd>
          <dt>${icon('building')} ${T('Meeting point', 'Tempat berkumpul')}</dt><dd>${T('Main gate of', 'Pintu utama')} ${esc(site.name)}. ${T('Find the poster and check in together.', 'Cari pemohon dan daftar masuk bersama.')}</dd>
          <dt>${icon('wrench')} ${T('Needs', 'Perlu')}</dt><dd>${needsList(post)}</dd>
          <dt>${icon('truck')} ${T('What to bring', 'Apa yang perlu dibawa')}</dt><dd>${bring.length ? `${T('You’ll bring', 'Anda akan membawa')}: ${bring.map((a) => `${esc(lab('asset', a))} (${T('you operate it', 'anda kendalikan sendiri')})`).join(', ')}. ` : ''}${T('Water, closed shoes, a change of clothes.', 'Air minuman, kasut bertutup, pakaian ganti.')}</dd>
          <dt>${icon('triangle')} ${T('Risk', 'Risiko')}</dt><dd>${riskText(post.risk)}</dd>
        </dl>
        ${placesLine(post)}
      </section>
      <section class="card">
        <h2>${icon('shield')} ${T('Site safety rules', 'Peraturan keselamatan tapak')}</h2>
        ${safetyRules(post, site)}
      </section>
    </div>
    <div>
      <section class="card" aria-labelledby="can-h">
        <h2 id="can-h">${T('Can I join?', 'Bolehkah saya sertai?')}</h2>
        <ul class="rules">
          ${post.skills.length + post.assets.length ? rule(!r('need'), `${T('Skills and equipment', 'Kemahiran dan peralatan')}: ${needsList(post, { opt: false })}`, r('need') ? fixLink(r('need')) : '') : ''}
          ${post.badge ? rule(!r('badge'), `${T('Verified badge', 'Lencana disahkan')}: ${esc(lab('badge', post.badge))}`, r('badge') ? fixLink(r('badge')) : '') : ''}
          ${post.training.map((m) => { const okay = L.trainingValid(u, m, S().now); return rule(okay, `${T('Training', 'Latihan')}: ${esc(Lx(getModule(m).title))}`, okay ? '' : ` <a href="#training/${m}?back=${post.id}">${T('Start 2-min training', 'Mula latihan 2 minit')}</a>`); }).join('')}
          ${rule(!r('rest'), r('rest') ? esc(reasonInfo(r('rest')).text) : T('Within your rest limits after this shift', 'Dalam had rehat anda selepas syif ini'))}
        </ul>
        ${action}
      </section>
    </div>
  </div>`;
}

on('request-join', async ({ id }) => {
  const post = L.getPost(S(), id), poster = L.getUser(S(), post.poster);
  const res = await confirmDialog({
    title: T('Request to join this post?', 'Mohon menyertai tugasan ini?'),
    body: `<p><b>${esc(Lx(post.title))}</b><br>${postWhen(post)}</p><p>${T(`${esc(poster.name)} will accept or decline your request.`, `${esc(poster.name)} akan menerima atau menolak permohonan anda.`)}</p>`,
    confirm: T('Send request', 'Hantar permohonan'),
  });
  if (!res) return;
  const out = L.requestJoin(S(), me().id, id);
  toast(out.ok ? T('Request sent to the poster.', 'Permohonan dihantar kepada pemohon.') : T('This request could not be sent. See the reason on the post.', 'Permohonan tidak dapat dihantar. Lihat sebabnya pada tugasan.'));
  refresh();
});

// ---------- My shifts and safety ----------
function safetyCard(s) {
  const post = L.getPost(S(), s.post), site = L.getSite(S(), post.site), poster = L.getUser(S(), post.poster);
  const help = S().alerts.find((a) => a.shift === s.id && a.kind === 'help' && !a.resolved);
  const overdue = s.status === 'overdue';
  return `
  <li class="card safety-card ${overdue ? 'is-alert' : ''}" id="safety-${s.id}">
    <div class="pills">${shiftStatusPill(s)}${help ? pill('alert', T('Help requested', 'Bantuan diminta'), 'triangle') : ''}</div>
    <h3>${esc(Lx(post.title))}</h3>
    <p class="meta">${icon('building')} ${esc(site.name)} · ${T('Poster', 'Pemohon')}: ${esc(poster.name)}</p>
    <p class="due"><span>${T('Expected check-out', 'Jangkaan daftar keluar')}</span><strong>${fmtTime(s.due)}</strong><span class="hint">${T('Checked in', 'Daftar masuk')} ${fmtTime(s.checkIn)} · ${T('on site', 'di tapak')} ${hoursText((S().now - s.checkIn) / L.H)}</span></p>
    ${overdue ? notice('alert', T('You are more than 30 minutes past your check-out time. The coordinator and poster see an overdue alert in this demo. Check out if you have left safely.', 'Anda melebihi 30 minit daripada masa daftar keluar. Penyelaras dan pemohon melihat amaran lewat dalam demo ini. Daftar keluar jika anda telah pulang dengan selamat.'), 'triangle') : ''}
    ${help ? notice('alert', T(`Help request recorded at ${fmtTime(help.at)}. In this demo it appears on the coordinator and poster screens only.`, `Permintaan bantuan direkod pada ${fmtTime(help.at)}. Dalam demo ini ia hanya muncul pada skrin penyelaras dan pemohon.`), 'triangle') : ''}
    ${L.breakDue(S(), s) ? `<div class="notice notice-attention" role="status">${icon('moon')}<div><b>${T('Take a 15-minute break and drink water.', 'Rehat 15 minit dan minum air.')}</b> ${T(`You’ve been on site ${L.RULES.breakAfterHours} hours.`, `Anda telah berada di tapak selama ${L.RULES.breakAfterHours} jam.`)}
        <div class="row"><button type="button" class="btn btn-secondary" data-act="break-ack" data-id="${s.id}" data-key="break">${T('I’m on break', 'Saya sedang berehat')}</button><button type="button" class="btn btn-ghost" data-act="break-ack" data-id="${s.id}" data-key="dismiss">${T('Dismiss', 'Tutup')}</button></div></div></div>` : ''}
    <div class="safety-actions">
      <button type="button" class="btn btn-primary btn-big" data-act="check-out" data-id="${s.id}">${icon('check')} ${T('Check out, I have left safely', 'Daftar keluar, saya telah pulang dengan selamat')}</button>
      <button type="button" class="btn btn-alert btn-big" data-act="need-help" data-id="${s.id}" ${help ? 'aria-disabled="true"' : ''}>${icon('triangle')} ${help ? T('Help already requested', 'Bantuan telah diminta') : T('I need help', 'Saya perlukan bantuan')}</button>
    </div>
    <button type="button" class="btn btn-secondary" data-act="extend" data-id="${s.id}">${icon('clock')} ${T('Extend shift by 1 hour', 'Lanjutkan syif 1 jam')}</button>
    ${s.extensions?.length ? `<p class="hint">${T('Extended', 'Dilanjutkan')}: ${s.extensions.map((x) => `+${x.minutes} min (“${esc(x.reason)}”)`).join(', ')}</p>` : ''}
    <div class="demo-box">
      <p><b>${T('Demo controls', 'Kawalan demo')}</b> · ${T('This demo does not track location or send real alerts.', 'Demo ini tidak menjejak lokasi atau menghantar amaran sebenar.')}</p>
      <div class="row">
        <button type="button" class="btn btn-ghost" data-act="sim-overdue" data-id="${s.id}">${T('Simulate overdue', 'Simulasi lewat')} ${demoTag()}</button>
        <button type="button" class="btn btn-ghost" data-act="skip-end" data-id="${s.id}">${T('Skip to end of shift', 'Langkau ke akhir syif')} ${demoTag()}</button>
      </div>
    </div>
  </li>`;
}

function shiftRow(s) {
  const post = L.getPost(S(), s.post), site = L.getSite(S(), post.site);
  let body = '', actions = '';
  if (s.status === 'accepted') {
    body = `<p>${T('The poster accepted you. Check in when you are with the poster on site.', 'Pemohon menerima anda. Daftar masuk apabila anda bersama pemohon di tapak.')}</p>`;
    actions = `<button type="button" class="btn btn-primary btn-big" data-act="check-in" data-id="${s.id}">${icon('building')} ${T('Check in, I am with the poster', 'Daftar masuk, saya bersama pemohon')}</button>
      <button type="button" class="btn btn-ghost" data-act="withdraw" data-id="${s.id}">${T('I can’t come', 'Saya tidak dapat hadir')}</button>`;
  } else if (s.status === 'requested') {
    body = `<p>${T('Waiting for the poster to accept or decline.', 'Menunggu pemohon menerima atau menolak.')}</p>`;
    actions = `<button type="button" class="btn btn-ghost" data-act="withdraw" data-id="${s.id}">${T('Withdraw request', 'Tarik balik permohonan')}</button>`;
  } else if (s.status === 'done') {
    body = `<p>${fmtWhen(s.checkIn)} – ${fmtTime(s.checkOut)} · <b>${hoursText((s.checkOut - s.checkIn) / L.H)}</b> ${T('recorded', 'direkodkan')}</p>`;
  } else if (s.status === 'declined') {
    body = `<p>${T('The poster declined this request.', 'Pemohon menolak permohonan ini.')}${s.reason ? ` ${T('Reason', 'Sebab')}: “${esc(s.reason)}”` : ''} <a href="#posts">${T('Find another post', 'Cari tugasan lain')}</a></p>`;
  } else if (s.status === 'cancelled') {
    body = `<p>${s.cancelledBy === 'poster' ? T('The poster closed this post. Thank you for offering. <a href="#posts">Find another post</a>', 'Pemohon menutup tugasan ini. Terima kasih atas tawaran anda. <a href="#posts">Cari tugasan lain</a>') : T('You withdrew from this post.', 'Anda menarik diri daripada tugasan ini.')}</p>`;
  }
  return `<li class="card shift-row"><div class="pills">${shiftStatusPill(s)}</div><h3>${esc(Lx(post.title))}</h3>
    <p class="meta">${icon('building')} ${esc(site.name)} · ${icon('clock')} ${postWhen(post)}</p>${body}<div class="card-actions">${actions}</div></li>`;
}

export function shifts() {
  const u = me();
  const onsite = myShifts(['onsite', 'overdue']), accepted = myShifts(['accepted']), requested = myShifts(['requested']);
  const past = myShifts(['done', 'declined', 'cancelled']).reverse();
  const section = (title, list, render = shiftRow) => (list.length ? `<section aria-label="${esc(title)}"><h2>${esc(title)}</h2><ul class="list">${list.map(render).join('')}</ul></section>` : '');
  return `
  <h1 tabindex="-1">${T('My shifts', 'Syif saya')}</h1>
  <p class="lead">${T('Requested → Accepted → On site → Checked out. Check in and out every time so someone always knows you are safe.', 'Dimohon → Diterima → Di tapak → Daftar keluar. Daftar masuk dan keluar setiap kali supaya ada yang tahu anda selamat.')}</p>
  ${u.restAsked === L.dayOf(S().now) ? notice('caution', T('<b>The coordinator suggests you rest today.</b> You’ve given a lot. (Demo: no real message was sent.)', '<b>Penyelaras mencadangkan anda berehat hari ini.</b> Anda telah banyak menyumbang. (Demo: tiada mesej sebenar dihantar.)'), 'moon') : ''}
  ${section(T('On site now', 'Di tapak sekarang'), onsite, safetyCard)}
  ${section(T('Accepted: ready to check in', 'Diterima: sedia daftar masuk'), accepted)}
  ${section(T('Requested', 'Dimohon'), requested)}
  ${!onsite.length && !accepted.length && !requested.length ? `<div class="card empty"><p>${T('No upcoming shifts. Find a post that fits your skills and equipment.', 'Tiada syif akan datang. Cari tugasan yang sesuai dengan kemahiran dan peralatan anda.')}</p><a class="btn btn-primary btn-big" href="#posts">${T('Find posts', 'Cari tugasan')} ${icon('arrow')}</a></div>` : ''}
  <section class="card" aria-labelledby="sh-rest"><h2 id="sh-rest">${icon('moon')} ${T('Rest status', 'Status rehat')}</h2>${restMeters(L.restStatus(S(), u))}<a href="#recognition">${T('My impact and certificates', 'Impak dan sijil saya')}</a></section>
  ${section(T('Past', 'Lepas'), past)}`;
}

const shiftCtx = (id) => { const s = L.getShift(S(), id), post = L.getPost(S(), s.post); return { s, post, poster: L.getUser(S(), post.poster), site: L.getSite(S(), post.site) }; };

on('check-in', async ({ id }) => {
  const { post, poster, site } = shiftCtx(id);
  const due = S().now + post.hours * L.H;
  const res = await confirmDialog({
    title: T('Check in now?', 'Daftar masuk sekarang?'),
    body: `<p>${T(`Confirm you are at <b>${esc(site.name)}</b> with ${esc(poster.name)}.`, `Sahkan anda berada di <b>${esc(site.name)}</b> bersama ${esc(poster.name)}.`)}</p><p>${T('Expected check-out', 'Jangkaan daftar keluar')}: <b>${fmtTime(due)}</b></p><p class="hint">${T('This demo does not track location or send real alerts.', 'Demo ini tidak menjejak lokasi atau menghantar amaran sebenar.')}</p>`,
    confirm: T('Check in', 'Daftar masuk'),
  });
  if (!res) return;
  const out = L.checkIn(S(), me().id, id);
  toast(out.ok ? T(`Checked in. Back by ${fmtTime(due)}.`, `Daftar masuk berjaya. Pulang sebelum ${fmtTime(due)}.`) : T('Check out of your current shift first.', 'Daftar keluar daripada syif semasa dahulu.'));
  refresh();
});
on('check-out', async ({ id }) => {
  const { post } = shiftCtx(id);
  const res = await confirmDialog({
    title: T('Check out?', 'Daftar keluar?'),
    body: `<p>${T('Confirm you have left the site safely.', 'Sahkan anda telah meninggalkan tapak dengan selamat.')}</p><p><b>${esc(Lx(post.title))}</b></p>`,
    confirm: T('Check out, I have left safely', 'Daftar keluar, saya selamat'),
  });
  if (!res) return;
  const out = L.checkOut(S(), me().id, id);
  if (out.ok) toast(T(`Checked out safely. ${fmtH(out.hours)} hours recorded. Thank you.`, `Daftar keluar dengan selamat. ${fmtH(out.hours)} jam direkodkan. Terima kasih.`));
  refresh();
});
on('need-help', async ({ id }) => {
  const { poster } = shiftCtx(id);
  if (S().alerts.some((a) => a.shift === id && a.kind === 'help' && !a.resolved)) { toast(T('Help was already requested for this shift.', 'Bantuan telah diminta untuk syif ini.')); return; }
  const res = await confirmDialog({
    title: T('Ask for help?', 'Minta bantuan?'),
    body: `<p>${T(`This tells the Harapan Relief coordinator and ${esc(poster.name)} (poster) that you need help.`, `Ini memberitahu penyelaras Harapan Relief dan ${esc(poster.name)} (pemohon) bahawa anda memerlukan bantuan.`)}</p>${notice('caution', T('<b>Demo only.</b> No real alert, call or message is sent. In a real emergency call 999.', '<b>Demo sahaja.</b> Tiada amaran, panggilan atau mesej sebenar dihantar. Dalam kecemasan sebenar hubungi 999.'), 'triangle')}`,
    confirm: T('Yes, I need help', 'Ya, saya perlukan bantuan'), tone: 'alert',
  });
  if (!res) return;
  L.requestHelp(S(), me().id, id);
  toast(T('Help request recorded. The coordinator and poster screens now show it (demo).', 'Permintaan bantuan direkod. Skrin penyelaras dan pemohon kini memaparkannya (demo).'));
  refresh();
});
on('extend', async ({ id }) => {
  const res = await confirmDialog({
    title: T('Extend this shift by 1 hour?', 'Lanjutkan syif ini 1 jam?'),
    body: `<p>${T('Your daily hour limit still applies.', 'Had jam harian anda masih terpakai.')}</p>`,
    reason: 'required', reasonLabel: T('Why do you need more time?', 'Mengapa anda perlukan lebih masa?'),
    confirm: T('Extend shift', 'Lanjutkan syif'),
  });
  if (!res) return;
  const out = L.extendShift(S(), me().id, id, 60, res.reason);
  toast(out.ok ? T(`Shift extended. New check-out time ${fmtTime(L.getShift(S(), id).due)}.`, `Syif dilanjutkan. Masa daftar keluar baharu ${fmtTime(L.getShift(S(), id).due)}.`)
    : T(`Not extended: this would take you past ${out.cap} hours today. Please check out and rest.`, `Tidak dilanjutkan: ini akan melebihi ${out.cap} jam hari ini. Sila daftar keluar dan berehat.`));
  refresh();
});
on('withdraw', async ({ id }) => {
  const res = await confirmDialog({ title: T('Withdraw from this post?', 'Tarik diri daripada tugasan ini?'), body: `<p>${T('Your place goes back to other volunteers.', 'Tempat anda dikembalikan kepada sukarelawan lain.')}</p>`, confirm: T('Withdraw', 'Tarik diri') });
  if (!res) return;
  L.withdrawRequest(S(), me().id, id);
  toast(T('You withdrew from the post.', 'Anda menarik diri daripada tugasan.'));
  refresh();
});
on('break-ack', ({ id, key }) => { L.getShift(S(), id).breakAck = key; toast(key === 'break' ? T('Enjoy your break. Drink water.', 'Selamat berehat. Minum air.') : T('Rest reminder dismissed.', 'Peringatan rehat ditutup.')); refresh(); });
on('sim-overdue', ({ id }) => {
  L.simulateOverdue(S(), id);
  toast(T('Demo: the clock moved past your check-out time. An overdue alert now shows on the coordinator dashboard. No real alert was sent.', 'Demo: jam dialih melepasi masa daftar keluar. Amaran lewat kini dipaparkan pada papan pemuka penyelaras. Tiada amaran sebenar dihantar.'));
  refresh();
});
on('skip-end', ({ id }) => {
  const s = L.getShift(S(), id);
  L.advanceClock(S(), Math.max(0, s.due - S().now));
  toast(T('Demo: the clock moved to the end of your shift.', 'Demo: jam dialih ke akhir syif anda.'));
  refresh();
});

// ---------- Rest and recognition ----------
const BADGE_TEXT = {
  first: () => [T('First shift', 'Syif pertama'), T('Completed and checked out of one shift.', 'Melengkapkan dan daftar keluar satu syif.')],
  fourByFour: () => [T('4x4 hero: 5 deliveries', 'Wira 4x4: 5 penghantaran'), T('Five completed posts with your 4x4.', 'Lima tugasan selesai dengan 4x4 anda.')],
  trained: () => [T('Trained: 3 modules', 'Terlatih: 3 modul'), T('Three valid training modules.', 'Tiga modul latihan yang sah.')],
  restKept: () => [T('Rest kept', 'Rehat dijaga'), T('Stayed within the daily hour limit.', 'Kekal dalam had jam harian.')],
  safeOut: () => [T('Safe check-outs', 'Daftar keluar selamat'), T('Checked out of every shift.', 'Daftar keluar daripada setiap syif.')],
};

export function recognitionView() {
  const u = me(), rec = L.recognition(S(), u), rest = L.restStatus(S(), u);
  return `
  <h1 tabindex="-1">${T('Your impact', 'Impak anda')}</h1>
  <div class="kpis stat decor">
    <div class="kpi"><strong>${rec.shifts}</strong><span>${T('Shifts done', 'Syif selesai')}</span></div>
    <div class="kpi"><strong>${rec.sites}</strong><span>${T('Sites helped', 'Tapak dibantu')}</span></div>
    <div class="kpi"><strong>${fmtH(rec.hours)}</strong><span>${T('Hours recorded', 'Jam direkodkan')}</span></div>
    <div class="kpi"><strong>${rec.trained}</strong><span>${T('Modules valid', 'Modul sah')}</span></div>
  </div>
  <section class="card" aria-labelledby="rc-rest">
    <h2 id="rc-rest">${icon('moon')} ${T('Rest status', 'Status rehat')}</h2>
    ${restMeters(rest)}
    <p class="hint">${T(`Hours are counted from check-in to check-out and used only for rest limits. Limits (${L.RULES.dayCap} h a day, ${L.RULES.weekCap} h a week, ${L.RULES.restGapHours} h overnight rest, a rest day after ${L.RULES.maxStreakDays} days) are prototype placeholders to be agreed with the NGO partner, not official medical or operational standards.`, `Jam dikira dari daftar masuk hingga daftar keluar dan digunakan hanya untuk had rehat. Had (${L.RULES.dayCap} jam sehari, ${L.RULES.weekCap} jam seminggu, rehat malam ${L.RULES.restGapHours} jam, sehari rehat selepas ${L.RULES.maxStreakDays} hari) ialah nilai sementara prototaip yang akan dipersetujui dengan rakan NGO, bukan piawaian perubatan atau operasi rasmi.`)}</p>
  </section>
  <section class="card decor" aria-labelledby="rc-badges">
    <h2 id="rc-badges">${icon('ribbon')} ${T('Badges earned', 'Lencana diperoleh')}</h2>
    <p class="hint">${T('For effort and safety. No rankings, no leaderboards.', 'Untuk usaha dan keselamatan. Tiada kedudukan, tiada papan pendahulu.')}</p>
    <ul class="rec-badges">
      ${rec.badges.map((b) => { const [name, how] = BADGE_TEXT[b.id](); return `<li class="${b.earned ? 'earned' : 'locked'}">${icon(b.earned ? 'ribbon' : 'clock')}<div><b>${esc(name)}</b><br><span class="hint">${esc(how)} ${b.earned ? `· ${T('Earned', 'Diperoleh')}` : b.goal ? `· ${b.progress} ${T('of', 'daripada')} ${b.goal}` : `· ${T('Not yet', 'Belum')}`}</span></div></li>`; }).join('')}
    </ul>
  </section>
  <section class="card" aria-labelledby="rc-cert">
    <h2 id="rc-cert">${icon('ribbon')} ${T('Certificates', 'Sijil')}</h2>
    ${rec.certificate
      ? `<div class="cert-row"><p><b>${T('Flood Recovery Volunteer, Selangor 2026', 'Sukarelawan Pemulihan Banjir, Selangor 2026')}</b><br>${rec.certificate.shifts} ${T(plural(rec.certificate.shifts, 'shift', 'shifts'), 'syif')} · ${hoursText(rec.certificate.hours)} · ${T('from recorded check-ins and check-outs', 'daripada rekod daftar masuk dan keluar')}</p>
         <a class="btn btn-primary" href="#certificate">${T('Open certificate', 'Buka sijil')}</a></div>`
      : `<p>${T('Your certificate appears after your first completed shift (checked in and checked out).', 'Sijil anda muncul selepas syif pertama yang lengkap (daftar masuk dan daftar keluar).')}</p>`}
  </section>`;
}

export function certificate() {
  const u = me(), rec = L.recognition(S(), u);
  if (!rec.certificate) return recognitionView();
  const done = S().shifts.filter((s) => s.volunteer === u.id && s.status === 'done');
  return `
  <p class="no-print"><a href="#recognition">← ${T('My impact', 'Impak saya')}</a></p>
  <article class="certificate" aria-labelledby="cert-h">
    <p class="cert-org">${icon('hands')} ReadyHands · Harapan Relief</p>
    <h1 id="cert-h" tabindex="-1">${T('Certificate of Volunteer Service', 'Sijil Khidmat Sukarelawan')}</h1>
    <p>${T('This records that', 'Dengan ini direkodkan bahawa')}</p>
    <p class="cert-name">${esc(u.name || T('Volunteer', 'Sukarelawan'))}</p>
    <p>${T('served as a', 'telah berkhidmat sebagai')} <b>${T('Flood Recovery Volunteer, Selangor 2026', 'Sukarelawan Pemulihan Banjir, Selangor 2026')}</b></p>
    <p class="cert-figures">${rec.certificate.shifts} ${T(plural(rec.certificate.shifts, 'shift', 'shifts'), 'syif')} · ${hoursText(rec.certificate.hours)} · ${rec.certificate.sites} ${T(plural(rec.certificate.sites, 'site', 'sites'), 'tapak')}</p>
    <table class="cert-table"><caption>${T('Recorded shifts', 'Syif direkodkan')}</caption>
      <thead><tr><th scope="col">${T('Date', 'Tarikh')}</th><th scope="col">${T('Post', 'Tugasan')}</th><th scope="col">${T('Site', 'Tapak')}</th><th scope="col">${T('Hours', 'Jam')}</th></tr></thead>
      <tbody>${done.map((s) => { const p = L.getPost(S(), s.post); return `<tr><td>${fmtDate(s.checkIn, true)}</td><td>${esc(Lx(p.title))}</td><td>${esc(L.getSite(S(), p.site).name)}</td><td>${fmtH((s.checkOut - s.checkIn) / L.H)}</td></tr>`; }).join('')}</tbody>
    </table>
    <p class="hint">${T('Issued', 'Dikeluarkan')} ${fmtDate(rec.certificate.issuedAt, true)}. ${T('Hours come only from recorded check-in and check-out times.', 'Jam diambil hanya daripada rekod masa daftar masuk dan keluar.')}</p>
    <p class="cert-sample">${T('SAMPLE · Prototype certificate with fictional data. Harapan Relief is a fictional organisation. Not an official document.', 'CONTOH · Sijil prototaip dengan data rekaan. Harapan Relief ialah organisasi rekaan. Bukan dokumen rasmi.')}</p>
  </article>
  <button type="button" class="btn btn-primary btn-big no-print" data-act="print">${T('Print or save as PDF', 'Cetak atau simpan sebagai PDF')}</button>`;
}
on('print', () => window.print());

// ---------- Apply to become a poster ----------
export function becomePoster() {
  const u = me();
  const d = (store.ui.apply ??= { site: '', siteType: 'school', area: u.area, role: '', errors: {} });
  const app = [...S().posterApps].reverse().find((a) => a.user === u.id);
  if (u.roles.poster === 'approved') {
    return `<h1 tabindex="-1">${T('You are an approved poster', 'Anda pemohon yang diluluskan')}</h1>
      ${notice('ok', T('You can create posts and you keep your volunteer side.', 'Anda boleh mencipta tugasan dan kekal sebagai sukarelawan.'), 'check')}
      <div class="row"><a class="btn btn-primary btn-big" href="#create">${T('Create a post', 'Cipta tugasan')} ${icon('arrow')}</a><a class="btn btn-secondary btn-big" href="#my-posts">${T('My posts', 'Tugasan saya')}</a></div>`;
  }
  if (u.roles.poster === 'pending') {
    return `<h1 tabindex="-1">${T('Waiting for coordinator approval', 'Menunggu kelulusan penyelaras')}</h1>
      ${notice('caution', T(`Your application for <b>${esc(app?.site)}</b> (${esc(app?.role)}) is with the coordinator. You can keep volunteering meanwhile.`, `Permohonan anda untuk <b>${esc(app?.site)}</b> (${esc(app?.role)}) sedang disemak penyelaras. Anda boleh terus menjadi sukarelawan buat sementara.`), 'clock')}
      <a class="btn btn-primary btn-big" href="#posts">${T('Find posts', 'Cari tugasan')} ${icon('arrow')}</a>`;
  }
  const e = d.errors;
  return `
  <h1 tabindex="-1">${T('Need help for a site?', 'Perlukan bantuan untuk tapak?')}</h1>
  <p class="lead">${T('To post, a coordinator first checks who you are and which site you represent.', 'Untuk menyiarkan tugasan, penyelaras akan menyemak siapa anda dan tapak yang anda wakili.')}</p>
  ${app?.status === 'declined' ? notice('alert', T(`<b>Your last application was declined.</b> Reason: “${esc(app.reason)}”. Please fix this and send it again.`, `<b>Permohonan terakhir anda ditolak.</b> Sebab: “${esc(app.reason)}”. Sila betulkan dan hantar semula.`), 'triangle') : ''}
  <form class="card" data-form="apply" novalidate>
    ${field('ap-site', T('Site name', 'Nama tapak'), `<input id="ap-site" type="text" data-bind="apply.site" value="${esc(d.site)}" aria-required="true" ${e.site ? 'aria-invalid="true" aria-describedby="ap-site-err"' : ''}>`, { error: e.site ? T('Enter the name of the site, for example a school or clinic.', 'Masukkan nama tapak, contohnya sekolah atau klinik.') : '' })}
    <div class="grid-2">
      ${field('ap-type', T('Site type', 'Jenis tapak'), `<select id="ap-type" data-bind="apply.siteType">${options(Object.keys(LABELS.siteType).map((k) => [k, lab('siteType', k)]), d.siteType)}</select>`)}
      ${field('ap-area', T('Area', 'Kawasan'), `<select id="ap-area" data-bind="apply.area">${options(AREAS.map((a) => [a, a]), d.area)}</select>`)}
    </div>
    ${field('ap-role', T('Your role there', 'Peranan anda di sana'), `<input id="ap-role" type="text" data-bind="apply.role" value="${esc(d.role)}" aria-required="true" ${e.role ? 'aria-invalid="true" aria-describedby="ap-role-err"' : ''}>`, { hint: T('For example: Principal, committee member.', 'Contohnya: Guru besar, ahli jawatankuasa.'), error: e.role ? T('Enter your role at the site.', 'Masukkan peranan anda di tapak.') : '' })}
    ${field('ap-proof', `${T('Proof', 'Bukti')} <small>(${T('optional', 'pilihan')})</small>`, `<input id="ap-proof" type="file" data-file="apply-proof">`, { hint: T('For example a staff letter. Demo: only the file name is kept. Do not upload real documents.', 'Contohnya surat kakitangan. Demo: hanya nama fail disimpan. Jangan muat naik dokumen sebenar.') })}
    <button type="submit" class="btn btn-primary btn-big">${T('Send for approval', 'Hantar untuk kelulusan')} ${icon('arrow')}</button>
  </form>`;
}
on('submit-apply', () => {
  const d = store.ui.apply;
  const proofFile = document.querySelector('[data-file="apply-proof"]')?.files?.[0]?.name || '';
  const res = L.applyPoster(S(), me().id, { ...d, proofFile });
  if (!res.ok) {
    d.errors = res.errors || {};
    refresh();
    document.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }
  store.ui.apply = null;
  toast(T('Sent. Waiting for coordinator approval. You can keep volunteering meanwhile.', 'Dihantar. Menunggu kelulusan penyelaras. Anda boleh terus menjadi sukarelawan buat sementara.'));
  refresh();
});
