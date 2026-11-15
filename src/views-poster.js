// ReadyHands — poster screens: create a post, school damage report, my posts, site overview.
import * as L from './logic.js';
import { LABELS, SUGGESTION_TEXT, getModule } from './data.js';
import {
  store, S, me, T, Lx, lab, esc, icon, assetIcon, pill, needsList, postStatusPill, shiftStatusPill, reasonInfo, field, options, chip,
  demoTag, notice, on, refresh, go, toast, confirmDialog, fmtTime, fmtDate, fmtWhen, fmtH, hoursText, postWhen, siteTags, plural,
} from './ui.js';
import { placesLine } from './views-volunteer.js';

const mySites = () => S().sites.filter((s) => s.poster === me().id);
const dayStart = () => L.dayOf(S().now) * L.DAY;
const hourOptions = () => Array.from({ length: 13 }, (_, i) => i + 7).map((h) => [h, fmtTime(dayStart() + h * L.H)]);
const notPoster = () => `
  <h1 tabindex="-1">${T('Create a post', 'Cipta tugasan')}</h1>
  ${notice('caution', T('Only approved posters can create posts. A coordinator first checks who you are and which site you represent.', 'Hanya pemohon yang diluluskan boleh mencipta tugasan. Penyelaras akan menyemak siapa anda dan tapak yang anda wakili.'), 'shield')}
  <a class="btn btn-primary btn-big" href="#become-poster">${T('Apply to become a poster', 'Mohon menjadi pemohon bantuan')} ${icon('arrow')}</a>`;

// ---------- Create: choice ----------
export function create(param) {
  const u = me();
  if (u.roles.poster !== 'approved') return notPoster();
  if (!mySites().length) return `<h1 tabindex="-1">${T('Create a post', 'Cipta tugasan')}</h1>${notice('caution', T('No site is linked to your account yet. Ask the coordinator to link your site.', 'Tiada tapak dipautkan dengan akaun anda. Minta penyelaras memautkan tapak anda.'))}`;
  if (param === 'report') return reportWizard();
  if (param === 'form') return postForm(null);
  const school = mySites().some((s) => s.type === 'school');
  return `
  <h1 tabindex="-1">${T('Create a post', 'Cipta tugasan')}</h1>
  <p class="lead">${T('Ask for the people and equipment your site needs. A coordinator approves every post before it goes live.', 'Minta tenaga dan peralatan yang diperlukan tapak anda. Penyelaras meluluskan setiap tugasan sebelum ia aktif.')}</p>
  <div class="grid-2">
    ${school ? `<section class="card"><h2>${icon('building')} ${T('School damage report', 'Laporan kerosakan sekolah')}</h2>
      <p>${T('Five guided steps. Damage by room becomes suggested posts with skills and equipment filled in.', 'Lima langkah berpandu. Kerosakan mengikut bilik menjadi cadangan tugasan dengan kemahiran dan peralatan.')}</p>
      <a class="btn btn-primary btn-big" href="#create/report">${T('Start damage report', 'Mula laporan kerosakan')} ${icon('arrow')}</a></section>` : ''}
    <section class="card"><h2>${icon('megaphone')} ${T('General post', 'Tugasan umum')}</h2>
      <p>${T('One post for any site: home, relief centre, clinic or school.', 'Satu tugasan untuk mana-mana tapak: rumah, pusat pemindahan, klinik atau sekolah.')}</p>
      <a class="btn ${school ? 'btn-secondary' : 'btn-primary'} btn-big" href="#create/form">${T('Fill in the post form', 'Isi borang tugasan')} ${icon('arrow')}</a></section>
  </div>`;
}

// ---------- School damage report (5 steps) ----------
const ROOMS = ['classrooms', 'lab', 'structure', 'field'];
const DEFAULT_HOUR = { delivery: 8, cleanup: 12, wiring: 10, structure: 9, debris: 13, generator: 9, reading: 10 };

function reportState() {
  const u = me();
  if (store.ui.report?.uid !== u.id) {
    const school = mySites().find((s) => s.type === 'school');
    store.ui.report = { uid: u.id, step: 1, site: school?.id, disaster: T('Flood', 'Banjir'), rooms: Object.fromEntries(ROOMS.map((r) => [r, 'none'])), powerOut: false, pupilsPresent: false, suppliesNeeded: false, photos: [], drafts: [], errors: {} };
  }
  return store.ui.report;
}
const reportData = (d) => ({ disaster: d.disaster, rooms: Object.fromEntries(ROOMS.map((r) => [r, { severity: d.rooms[r] }])), powerOut: d.powerOut, pupilsPresent: d.pupilsPresent, suppliesNeeded: d.suppliesNeeded, photos: d.photos });

function buildDrafts(d) {
  const old = Object.fromEntries(d.drafts.map((x) => [x.key, x]));
  d.drafts = L.suggestPosts(reportData(d)).map((sug) => {
    const prev = old[sug.key];
    return { ...sug, title: prev?.title ?? Lx(SUGGESTION_TEXT[sug.key].title), desc: Lx(SUGGESTION_TEXT[sug.key].desc), qty: prev?.qty ?? sug.qty, hour: prev?.hour ?? DEFAULT_HOUR[sug.key], include: prev?.include ?? true };
  });
}

const fromText = (from) => ({ classrooms: lab('room', 'classrooms'), lab: lab('room', 'lab'), structure: lab('room', 'structure'), field: lab('room', 'field'), power: T('Power is out', 'Bekalan elektrik terputus'), pupils: T('Activities with pupils', 'Aktiviti bersama murid') }[from]);

function draftSummary(dr) {
  return `<p class="req">${icon('wrench')} <span><b>${T('Needs', 'Perlu')}:</b> ${needsList(dr)}</span></p>
    ${dr.badge ? `<p class="req">${icon('shield')} <span><b>${T('Badge', 'Lencana')}:</b> ${T('verified', 'disahkan')} ${esc(lab('badge', dr.badge))}</span></p>` : ''}
    <p class="req">${icon('play')} <span><b>${T('Training', 'Latihan')}:</b> ${dr.training.map((m) => esc(Lx(getModule(m).title))).join(' · ')}</span></p>
    <p class="req">${icon('triangle')} <span><b>${T('Risk', 'Risiko')}:</b> ${esc(lab('risk', dr.risk))} · ${hoursText(dr.hours)}</span></p>`;
}

function reportWizard() {
  const d = reportState(), e = d.errors;
  const site = L.getSite(S(), d.site);
  const steps = [T('School and disaster', 'Sekolah dan bencana'), T('Damage by room', 'Kerosakan mengikut bilik'), T('Needs', 'Keperluan'), T('Photos (optional)', 'Gambar (pilihan)'), T('Review', 'Semak')];
  let body = '';
  if (d.step === 1) {
    body = `
      ${field('rp-site', T('School', 'Sekolah'), `<select id="rp-site" data-bind="report.site">${options(mySites().filter((s) => s.type === 'school').map((s) => [s.id, s.name]), d.site)}</select>`)}
      ${field('rp-dis', T('What happened?', 'Apa yang berlaku?'), `<input id="rp-dis" type="text" data-bind="report.disaster" value="${esc(d.disaster)}" aria-required="true" ${e.disaster ? 'aria-invalid="true" aria-describedby="rp-dis-err"' : ''}>`, { hint: T('For example: Flood, 19 November.', 'Contohnya: Banjir, 19 November.'), error: e.disaster ? T('Say briefly what happened.', 'Nyatakan secara ringkas apa yang berlaku.') : '' })}
      ${notice('attention', T('Only assess from a safe place. Do not enter flooded or damaged rooms.', 'Nilai hanya dari tempat selamat. Jangan masuk ke bilik yang banjir atau rosak.'), 'triangle')}`;
  } else if (d.step === 2) {
    body = `
      <button type="button" class="btn btn-ghost" data-act="report-sample">${T('Use sample answers', 'Guna jawapan contoh')} ${demoTag()}</button>
      ${e.damage ? `<p class="error" id="rp-damage-err" role="alert">${icon('triangle')} ${T('Choose a damage level for at least one room, or tick one of the boxes below.', 'Pilih tahap kerosakan untuk sekurang-kurangnya satu bilik, atau tanda salah satu kotak di bawah.')}</p>` : ''}
      ${ROOMS.map((r) => `<fieldset class="severity"><legend>${esc(lab('room', r))}</legend><div class="seg">
        ${L.SEVERITY.map((sv) => `<label class="seg-opt sev-${sv}"><input type="radio" name="room-${r}" value="${sv}" data-bind="report.rooms.${r}" data-rerender ${d.rooms[r] === sv ? 'checked' : ''}><span>${esc(lab('severity', sv))}</span></label>`).join('')}
      </div></fieldset>`).join('')}
      <fieldset><legend>${T('Also tick what applies', 'Tanda juga yang berkenaan')}</legend>
        <label class="check"><input type="checkbox" data-bind="report.powerOut" data-rerender ${d.powerOut ? 'checked' : ''}> <span>${T('Power is out', 'Bekalan elektrik terputus')}</span></label>
        <label class="check"><input type="checkbox" data-bind="report.suppliesNeeded" data-rerender ${d.suppliesNeeded ? 'checked' : ''}> <span>${T('Cleaning supplies or desks must be brought in', 'Bekalan pembersihan atau meja perlu dibawa masuk')}</span></label>
        <label class="check"><input type="checkbox" data-bind="report.pupilsPresent" data-rerender ${d.pupilsPresent ? 'checked' : ''}> <span>${T('Pupils will be present for activities (reading corner)', 'Murid akan hadir untuk aktiviti (sudut bacaan)')}</span></label>
      </fieldset>`;
  } else if (d.step === 3) {
    body = `
      ${notice('info', T('<b>Demo AI suggestion.</b> These posts are suggested by simple rules from your damage answers, not by a real AI model. Edit or untick anything before sending.', '<b>Cadangan AI demo.</b> Tugasan ini dicadangkan oleh peraturan mudah berdasarkan jawapan anda, bukan model AI sebenar. Sunting atau nyahtanda sebelum menghantar.'))}
      ${e.drafts ? `<p class="error" role="alert">${icon('triangle')} ${T('Keep at least one post, each with a title and at least 1 person.', 'Kekalkan sekurang-kurangnya satu tugasan, setiap satu dengan tajuk dan sekurang-kurangnya 1 orang.')}</p>` : ''}
      <ul class="list">${d.drafts.map((dr, i) => `
        <li class="card draft ${dr.include ? '' : 'is-off'}">
          <div class="pills">${pill('info', T('Demo AI suggestion', 'Cadangan AI demo'), 'info')} ${pill('muted', `${T('From', 'Daripada')}: ${fromText(dr.from)}`, 'building')}</div>
          <label class="check"><input type="checkbox" data-bind="report.drafts.${i}.include" data-rerender ${dr.include ? 'checked' : ''}> <span>${T('Include this post', 'Sertakan tugasan ini')}</span></label>
          ${field(`dr-title-${i}`, T('Post title', 'Tajuk tugasan'), `<input id="dr-title-${i}" type="text" data-bind="report.drafts.${i}.title" value="${esc(dr.title)}">`)}
          <div class="grid-2">
            ${field(`dr-qty-${i}`, T('Number of people', 'Bilangan orang'), `<input id="dr-qty-${i}" type="number" min="1" max="200" inputmode="numeric" data-type="number" data-bind="report.drafts.${i}.qty" value="${esc(dr.qty)}">`)}
            ${field(`dr-hour-${i}`, T('Start time (today)', 'Masa mula (hari ini)'), `<select id="dr-hour-${i}" data-type="number" data-bind="report.drafts.${i}.hour">${options(hourOptions(), dr.hour)}</select>`)}
          </div>
          ${draftSummary(dr)}
        </li>`).join('') || `<li class="card">${T('No needs suggested. Go back and record some damage.', 'Tiada keperluan dicadangkan. Kembali dan rekod kerosakan.')}</li>`}</ul>`;
  } else if (d.step === 4) {
    body = `
      ${notice('attention', T('<b>Photos are optional and only from a safe place.</b> No photos of pupils or other people.', '<b>Gambar adalah pilihan dan hanya dari tempat selamat.</b> Tiada gambar murid atau orang lain.'), 'triangle')}
      ${field('rp-photos', `${T('Photos of damage', 'Gambar kerosakan')} <small>(${T('optional', 'pilihan')})</small>`, `<input id="rp-photos" type="file" accept="image/*" multiple data-names="report.photos">`, { hint: T('Demo: photos are not uploaded. Only file names are kept on this device.', 'Demo: gambar tidak dimuat naik. Hanya nama fail disimpan pada peranti ini.') })}
      ${d.photos.length ? `<p>${T('Selected', 'Dipilih')}: ${d.photos.map(esc).join(', ')}</p>` : ''}`;
  } else {
    const keep = d.drafts.filter((x) => x.include);
    body = `
      <h3>${esc(site.name)} · ${esc(d.disaster)}</h3>
      <dl class="facts">
        ${ROOMS.map((r) => `<dt>${esc(lab('room', r))}</dt><dd>${severityPill(d.rooms[r])}</dd>`).join('')}
        <dt>${T('Other', 'Lain-lain')}</dt><dd>${[d.powerOut && T('Power is out', 'Bekalan elektrik terputus'), d.suppliesNeeded && T('Supplies must be brought in', 'Bekalan perlu dibawa masuk'), d.pupilsPresent && T('Pupils present', 'Murid hadir')].filter(Boolean).join(' · ') || '–'}</dd>
        <dt>${T('Photos', 'Gambar')}</dt><dd>${d.photos.length ? d.photos.map(esc).join(', ') : T('None', 'Tiada')}</dd>
      </dl>
      <h3>${keep.length} ${T(plural(keep.length, 'post to send for approval', 'posts to send for approval'), 'tugasan untuk dihantar bagi kelulusan')}</h3>
      <ul class="list">${keep.map((dr) => `<li class="card"><b>${esc(dr.title)}</b> · ${dr.qty} ${T(plural(dr.qty, 'person', 'people'), 'orang')} · ${fmtTime(dayStart() + dr.hour * L.H)}${draftSummary(dr)}</li>`).join('')}</ul>
      ${d.pupilsPresent ? notice('attention', T('Tasks with pupils present need a verified Child-safe badge. No one alone with a pupil. No photos of pupils.', 'Tugasan bersama murid memerlukan lencana Selamat kanak-kanak yang disahkan. Tiada sesiapa bersendirian dengan murid. Tiada gambar murid.'), 'shield') : ''}`;
  }
  return `
  <p><a href="#create">← ${T('Create a post', 'Cipta tugasan')}</a></p>
  <h1 tabindex="-1">${T('School damage report', 'Laporan kerosakan sekolah')}</h1>
  <ol class="steps" aria-label="${T('Progress', 'Kemajuan')}">${steps.map((s, i) => `<li class="${i + 1 === d.step ? 'current' : i + 1 < d.step ? 'done' : ''}" ${i + 1 === d.step ? 'aria-current="step"' : ''}><span class="step-n">${i + 1 < d.step ? icon('check') : i + 1}</span><span class="step-t">${esc(s)}${i + 1 < d.step ? `<span class="sr"> (${T('done', 'selesai')})</span>` : ''}</span></li>`).join('')}</ol>
  <form class="card" data-form="report" novalidate>
    <h2 id="rp-step" tabindex="-1">${T('Step', 'Langkah')} ${d.step} ${T('of', 'daripada')} 5: ${esc(steps[d.step - 1])}</h2>
    ${body}
    <div class="row wizard-nav">
      ${d.step > 1 ? `<button type="button" class="btn btn-secondary" data-act="report-back">← ${T('Back', 'Kembali')}</button>` : ''}
      <button type="submit" class="btn btn-primary btn-big">${d.step < 5 ? `${T('Next', 'Seterusnya')} ${icon('arrow')}` : T('Send for approval', 'Hantar untuk kelulusan')}</button>
    </div>
  </form>`;
}

const severityPill = (sv) => pill({ none: 'muted', light: 'ok', moderate: 'caution', severe: 'alert' }[sv], lab('severity', sv), sv === 'severe' ? 'triangle' : sv === 'none' ? 'check' : 'info');

on('report-sample', () => { const d = reportState(); Object.assign(d.rooms, { classrooms: 'severe', lab: 'severe', structure: 'none', field: 'none' }); d.errors = {}; refresh(); });
on('report-back', () => { const d = reportState(); d.step = Math.max(1, d.step - 1); d.errors = {}; refresh(); focusStep(); });
const focusStep = () => document.getElementById('rp-step')?.focus();
on('submit-report', async () => {
  const d = reportState();
  d.errors = {};
  if (d.step === 1 && !d.disaster.trim()) d.errors.disaster = true;
  if (d.step === 2) {
    if (!ROOMS.some((r) => d.rooms[r] !== 'none') && !d.powerOut && !d.pupilsPresent && !d.suppliesNeeded) d.errors.damage = true;
    else buildDrafts(d);
  }
  if (d.step === 3) {
    const keep = d.drafts.filter((x) => x.include);
    if (!keep.length || keep.some((x) => !String(x.title).trim() || !Number.isInteger(x.qty) || x.qty < 1)) d.errors.drafts = true;
  }
  if (Object.keys(d.errors).length) { refresh(); (document.querySelector('[aria-invalid="true"]') || document.querySelector('[role="alert"]'))?.focus?.(); return; }
  if (d.step < 5) { d.step++; refresh(); focusStep(); return; }
  const keep = d.drafts.filter((x) => x.include);
  const res = await confirmDialog({
    title: T('Send to the coordinator?', 'Hantar kepada penyelaras?'),
    body: `<p>${T(`${keep.length} ${plural(keep.length, 'post goes', 'posts go')} to the coordinator. They go live once approved.`, `${keep.length} tugasan dihantar kepada penyelaras. Ia aktif selepas diluluskan.`)}</p>`,
    confirm: T('Send for approval', 'Hantar untuk kelulusan'),
  });
  if (!res) return;
  const drafts = d.drafts.map((x) => ({ ...x, start: dayStart() + x.hour * L.H }));
  const out = L.submitDamageReport(S(), me().id, d.site, reportData(d), drafts);
  if (!out.ok) { toast(T('The report could not be sent. Check each post has a title and a number of people.', 'Laporan tidak dapat dihantar. Pastikan setiap tugasan ada tajuk dan bilangan orang.')); return; }
  store.ui.report = null;
  toast(T(`Sent to the coordinator. ${out.posts.length} ${plural(out.posts.length, 'post goes', 'posts go')} live once approved.`, `Dihantar kepada penyelaras. ${out.posts.length} tugasan akan aktif selepas diluluskan.`));
  go('#my-posts');
});

// ---------- General post form (create and edit) ----------
function formState(editId) {
  const u = me();
  if (store.ui.postForm?.uid !== u.id || store.ui.postForm?.id !== editId) {
    const p = editId ? L.getPost(S(), editId) : null;
    store.ui.postForm = p
      ? { uid: u.id, id: editId, site: p.site, title: Lx(p.title), desc: Lx(p.desc), qty: p.qty, skills: [...p.skills], assets: [...p.assets], badge: p.badge || '', training: [...p.training], risk: p.risk, hour: new Date(p.start).getUTCHours(), hours: p.hours, errors: {} }
      : { uid: u.id, id: null, site: mySites()[0]?.id, title: '', desc: '', qty: 5, skills: [], assets: [], badge: '', training: [], risk: 'low', hour: 9, hours: 3, errors: {} };
  }
  return store.ui.postForm;
}

function postForm(editId) {
  const d = formState(editId), e = d.errors;
  const post = editId ? L.getPost(S(), editId) : null;
  const site = L.getSite(S(), d.site);
  const norm = L.normalizePost({ skills: d.skills, assets: d.assets, badge: d.badge || null, training: [] }, site?.type);
  const sites = post ? [site] : mySites();
  return `
  <p><a href="${post ? '#my-posts' : '#create'}">← ${post ? T('My posts', 'Tugasan saya') : T('Create a post', 'Cipta tugasan')}</a></p>
  <h1 tabindex="-1">${post ? T('Update post', 'Kemas kini tugasan') : T('Create a post', 'Cipta tugasan')}</h1>
  ${post?.status === 'sentBack' ? notice('alert', T(`<b>Sent back by the coordinator:</b> “${esc(post.reason)}”. Fix it and send again.`, `<b>Dikembalikan oleh penyelaras:</b> “${esc(post.reason)}”. Betulkan dan hantar semula.`), 'triangle') : ''}
  ${post?.status === 'live' ? notice('info', T('This post is live. Changing skills, equipment, badge or risk sends it back to the coordinator for approval.', 'Tugasan ini aktif. Mengubah kemahiran, peralatan, lencana atau risiko akan menghantarnya semula kepada penyelaras untuk kelulusan.')) : ''}
  <form class="card" data-form="post" novalidate>
    ${field('po-site', T('Site', 'Tapak'), `<select id="po-site" data-bind="postForm.site" data-rerender ${post ? 'disabled' : ''}>${options(sites.map((s) => [s.id, `${s.name} (${lab('siteType', s.type)})`]), d.site)}</select>`)}
    ${field('po-title', T('What’s needed (title)', 'Apa yang diperlukan (tajuk)'), `<input id="po-title" type="text" data-bind="postForm.title" value="${esc(d.title)}" aria-required="true" ${e.title ? 'aria-invalid="true" aria-describedby="po-title-err"' : ''}>`, { hint: T('For example: Carry out ruined furniture.', 'Contohnya: Keluarkan perabot rosak.'), error: e.title ? T('Enter a short title for the post.', 'Masukkan tajuk ringkas untuk tugasan.') : '' })}
    ${field('po-desc', `${T('What volunteers will do', 'Apa yang sukarelawan akan lakukan')} <small>(${T('optional', 'pilihan')})</small>`, `<textarea id="po-desc" rows="3" data-bind="postForm.desc">${esc(d.desc)}</textarea>`)}
    <div class="grid-3">
      ${field('po-qty', T('Number of people', 'Bilangan orang'), `<input id="po-qty" type="number" min="1" max="200" inputmode="numeric" data-type="number" data-bind="postForm.qty" value="${esc(d.qty)}" aria-required="true" ${e.qty ? 'aria-invalid="true" aria-describedby="po-qty-err"' : ''}>`, { error: e.qty ? (post ? T(`Enter a whole number from ${Math.max(1, L.filled(S(), post))} to 200. ${L.filled(S(), post)} places are already taken.`, `Masukkan nombor bulat dari ${Math.max(1, L.filled(S(), post))} hingga 200. ${L.filled(S(), post)} tempat telah diisi.`) : T('Enter a whole number from 1 to 200.', 'Masukkan nombor bulat dari 1 hingga 200.')) : '' })}
      ${field('po-hour', T('Start time (today)', 'Masa mula (hari ini)'), `<select id="po-hour" data-type="number" data-bind="postForm.hour">${options(hourOptions(), d.hour)}</select>`)}
      ${field('po-hours', T('Shift length (hours)', 'Tempoh syif (jam)'), `<select id="po-hours" data-type="number" data-bind="postForm.hours">${options([1, 2, 3, 4, 5, 6, 7, 8].map((h) => [h, h]), d.hours)}</select>`, { hint: T(`At most ${L.RULES.dayCap} hours, the daily limit.`, `Maksimum ${L.RULES.dayCap} jam, iaitu had harian.`) })}
    </div>
    <fieldset ${e.needs ? 'aria-describedby="po-needs-err"' : ''}>
      <legend>${T('Skills every volunteer must have', 'Kemahiran yang mesti ada pada setiap sukarelawan')}</legend>
      <div class="chips">${[...L.SKILLS, ...L.PRO_SKILLS].map((s) => chip('po-skill', s, lab('skill', s), d.skills.includes(s), L.PRO_SKILLS.includes(s) ? 'shield' : 'wrench')).join('')}</div>
    </fieldset>
    <fieldset>
      <legend>${T('Equipment every volunteer must bring', 'Peralatan yang mesti dibawa setiap sukarelawan')}</legend>
      <div class="chips">${L.ASSETS.map((a) => chip('po-asset', a, lab('asset', a), d.assets.includes(a), assetIcon(a))).join('')}</div>
      ${e.needs ? `<p class="error" id="po-needs-err">${icon('triangle')} ${T('Choose at least one skill or one piece of equipment.', 'Pilih sekurang-kurangnya satu kemahiran atau satu peralatan.')}</p>` : ''}
    </fieldset>
    <div class="grid-2">
      ${field('po-badge', T('Professional badge', 'Lencana profesional'), `<select id="po-badge" data-bind="postForm.badge" data-rerender>${options([['', T('None', 'Tiada')], ...L.BADGES.map((b) => [b, `${T('Verified', 'Disahkan')}: ${lab('badge', b)}`])], norm.badge || '')}</select>`, { hint: norm.badge && norm.badge !== d.badge ? T('Set automatically: professional work always needs the verified badge.', 'Ditetapkan secara automatik: kerja profesional sentiasa memerlukan lencana disahkan.') : T('Choose Child-safe for any task with pupils present.', 'Pilih Selamat kanak-kanak untuk sebarang tugasan bersama murid.') })}
      ${field('po-risk', T('Risk', 'Risiko'), `<select id="po-risk" data-bind="postForm.risk">${options(Object.keys(LABELS.risk).map((k) => [k, lab('risk', k)]), d.risk)}</select>`)}
    </div>
    <fieldset>
      <legend>${T('Required training', 'Latihan diwajibkan')}</legend>
      <p class="hint">${T('Modules marked “required by safety rules” are added automatically from the skills, equipment and site type.', 'Modul bertanda “diwajibkan oleh peraturan keselamatan” ditambah secara automatik berdasarkan kemahiran, peralatan dan jenis tapak.')}</p>
      <div class="chips">${L.MODULE_IDS.map((m) => norm.training.includes(m)
        ? `<span class="chip chip-locked">${icon('check')}<span>${esc(Lx(getModule(m).title))} <small>(${T('required by safety rules', 'diwajibkan oleh peraturan keselamatan')})</small></span></span>`
        : chip('po-train', m, Lx(getModule(m).title), d.training.includes(m), 'play')).join('')}</div>
    </fieldset>
    <button type="submit" class="btn btn-primary btn-big">${post ? (post.status === 'sentBack' ? T('Send again for approval', 'Hantar semula untuk kelulusan') : T('Save changes', 'Simpan perubahan')) : T('Send for approval', 'Hantar untuk kelulusan')} ${icon('arrow')}</button>
  </form>`;
}
export const editPost = (id) => {
  const p = L.getPost(S(), id);
  if (!p || (p.poster !== me().id && !me().roles.admin) || p.status === 'closed') return myPosts();
  return postForm(id);
};

const toggleIn = (list, key) => (list.includes(key) ? list.filter((x) => x !== key) : [...list, key]);
on('po-skill', ({ key }) => { const d = store.ui.postForm; d.skills = toggleIn(d.skills, key); refresh(); });
on('po-asset', ({ key }) => { const d = store.ui.postForm; d.assets = toggleIn(d.assets, key); refresh(); });
on('po-train', ({ key }) => { const d = store.ui.postForm; d.training = toggleIn(d.training, key); refresh(); });
on('submit-post', () => {
  const d = store.ui.postForm;
  const data = { site: d.site, title: String(d.title).trim(), desc: d.desc, qty: d.qty, skills: d.skills, assets: d.assets, badge: d.badge || null, training: d.training, risk: d.risk, start: dayStart() + d.hour * L.H, hours: d.hours };
  let res;
  if (d.id) {
    const p = L.getPost(S(), d.id);
    const reqChanged = JSON.stringify([[...p.skills].sort(), [...p.assets].sort(), p.badge || null, p.risk]) !== JSON.stringify([[...L.normalizePost(data).skills].sort(), [...data.assets].sort(), L.normalizePost(data).badge || null, data.risk]);
    res = L.updatePost(S(), me().id, d.id, { ...data, title: data.title === Lx(p.title) ? p.title : data.title, desc: data.desc === Lx(p.desc) ? p.desc : data.desc, resubmit: p.status === 'live' && reqChanged });
  } else res = L.createPost(S(), me().id, data);
  if (!res.ok) {
    d.errors = res.errors || {};
    refresh();
    document.querySelector('[aria-invalid="true"]')?.focus() ?? document.querySelector('.error')?.scrollIntoView({ block: 'center' });
    return;
  }
  const status = L.getPost(S(), d.id || res.post.id).status;
  store.ui.postForm = null;
  toast(status === 'pending' ? T('Sent to the coordinator. It goes live once approved.', 'Dihantar kepada penyelaras. Ia aktif selepas diluluskan.') : T('Post updated.', 'Tugasan dikemas kini.'));
  go('#my-posts');
});

// ---------- My posts ----------
function requestRow(s, post) {
  const v = L.getUser(S(), s.volunteer);
  const reasons = L.hardRules(S(), v, post, s.id);
  const full = L.isFull(S(), post);
  const rest = L.restStatus(S(), v);
  const yes = (t) => `${esc(t)} <span class="ok-mark">${icon('check')}</span>`;
  const summary = [
    ...post.assets.filter((a) => v.assets.includes(a)).map((a) => yes(lab('asset', a))),
    ...post.skills.filter((x) => v.skills.includes(x)).map((x) => yes(lab('skill', x))),
    post.badge && L.badgeStatus(v, post.badge) === 'verified' ? yes(`${lab('badge', post.badge)} ${T('badge', 'lencana')}`) : '',
    !reasons.some((r) => r.code === 'training') ? yes(T('training', 'latihan')) : '',
    `${fmtH(rest.today)}${T('h today', 'j hari ini')}`,
  ].filter(Boolean).join(' · ');
  const why = {
    need: T('a required skill or piece of equipment is missing from their profile.', 'kemahiran atau peralatan yang diwajibkan tiada dalam profil mereka.'),
    badge: T('their badge is not verified.', 'lencana mereka belum disahkan.'),
    training: T('required training is not complete.', 'latihan yang diwajibkan belum lengkap.'),
    rest: T('this shift would take them past their rest limits.', 'syif ini akan melebihi had rehat mereka.'),
  };
  const block = full ? T('this post is full. Raise the number of people or decline.', 'tugasan ini penuh. Tambah bilangan orang atau tolak.') : reasons.length ? why[reasons[0].code] : '';
  return `<li class="request">
    <div><b>${icon('user')} ${esc(v.name)}</b> <span class="meta">${esc(v.area)}</span><br><span class="summary">${summary}</span>
      ${block ? `<p class="error">${icon('triangle')} ${T('Can’t accept yet', 'Belum boleh diterima')}: ${esc(block)}</p>` : ''}</div>
    <div class="row">
      <button type="button" class="btn btn-primary" data-act="accept" data-id="${s.id}" ${block ? 'aria-disabled="true"' : ''}>${T('Accept', 'Terima')}<span class="sr"> ${esc(v.name)}</span></button>
      <button type="button" class="btn btn-secondary" data-act="decline" data-id="${s.id}">${T('Decline', 'Tolak')}<span class="sr"> ${esc(v.name)}</span></button>
    </div></li>`;
}

function myPostCard(post) {
  const site = L.getSite(S(), post.site);
  const shifts = S().shifts.filter((s) => s.post === post.id);
  const by = (st) => shifts.filter((s) => st.includes(s.status));
  const requests = by(['requested']), onsite = by(['onsite', 'overdue']), accepted = by(['accepted']), done = by(['done']), cancelled = by(['cancelled']);
  const alerts = L.openAlerts(S()).filter((a) => shifts.some((s) => s.id === a.shift));
  const closed = post.status === 'closed';
  return `
  <li class="card my-post">
    <div class="pills">${postStatusPill(post)}${post.source === 'report' ? pill('muted', T('From damage report', 'Daripada laporan kerosakan'), 'building') : ''}${alerts.length ? pill('alert', `${alerts.length} ${T(plural(alerts.length, 'safety alert', 'safety alerts'), 'amaran keselamatan')}`, 'triangle') : ''}</div>
    <h2>${esc(Lx(post.title))}</h2>
    <p class="meta">${icon('building')} <a href="#site/${site.id}">${esc(site.name)}</a> · ${icon('clock')} ${postWhen(post)}</p>
    <p class="req">${icon('wrench')} <span><b>${T('Needs', 'Perlu')}:</b> ${needsList(post)}${post.badge ? ` · ${T('verified', 'disahkan')} ${esc(lab('badge', post.badge))}` : ''}</span></p>
    ${placesLine(post)}
    ${post.status === 'pending' ? notice('caution', T('Sent to the coordinator. It goes live once approved.', 'Dihantar kepada penyelaras. Ia aktif selepas diluluskan.'), 'clock') : ''}
    ${post.status === 'sentBack' ? notice('alert', T(`<b>Sent back:</b> “${esc(post.reason)}”`, `<b>Dikembalikan:</b> “${esc(post.reason)}”`), 'triangle') : ''}

    ${alerts.length ? `<h3>${icon('triangle')} ${T('Safety alerts', 'Amaran keselamatan')}</h3><ul class="sub-list">${alerts.map((a) => alertRow(a)).join('')}</ul>` : ''}
    ${requests.length ? `<h3>${T('Join requests', 'Permohonan menyertai')} (${requests.length})</h3><ul class="sub-list">${requests.map((s) => requestRow(s, post)).join('')}</ul>` : post.status === 'live' ? `<p class="hint">${T('No join requests waiting.', 'Tiada permohonan menunggu.')}</p>` : ''}
    ${onsite.length ? `<h3>${T('On site now', 'Di tapak sekarang')}</h3><ul class="sub-list">${onsite.map((s) => `<li>${icon('user')} <b>${esc(L.getUser(S(), s.volunteer).name)}</b> ${shiftStatusPill(s)} · ${T('checked in', 'daftar masuk')} ${fmtTime(s.checkIn)} · ${T('due out', 'dijangka keluar')} <b>${fmtTime(s.due)}</b></li>`).join('')}</ul>` : ''}
    ${accepted.length ? `<h3>${T('Accepted, not checked in yet', 'Diterima, belum daftar masuk')}</h3><ul class="sub-list">${accepted.map((s) => `<li>${icon('user')} ${esc(L.getUser(S(), s.volunteer).name)}</li>`).join('')}</ul>` : ''}
    ${done.length ? `<h3>${T('Completed shifts', 'Syif selesai')}</h3><ul class="sub-list">${done.map((s) => `<li>${icon('check')} ${esc(L.getUser(S(), s.volunteer).name)} · ${hoursText((s.checkOut - s.checkIn) / L.H)} · ${T('checked out', 'daftar keluar')} ${fmtWhen(s.checkOut)}</li>`).join('')}</ul>` : ''}
    ${cancelled.length ? `<h3>${T('Cancelled', 'Dibatalkan')}</h3><ul class="sub-list">${cancelled.map((s) => `<li>${esc(L.getUser(S(), s.volunteer).name)} ${shiftStatusPill(s)}</li>`).join('')}</ul>` : ''}
    ${closed ? '' : `<div class="card-actions">
      <a class="btn btn-secondary" href="#edit/${post.id}">${post.status === 'sentBack' ? T('Fix and send again', 'Betulkan dan hantar semula') : T('Update post', 'Kemas kini tugasan')}<span class="sr">: ${esc(Lx(post.title))}</span></a>
      <button type="button" class="btn btn-ghost" data-act="close-post" data-id="${post.id}">${T('Close post', 'Tutup tugasan')}<span class="sr">: ${esc(Lx(post.title))}</span></button>
    </div>`}
  </li>`;
}

/** Shared by the poster and coordinator alert lists. */
export function alertRow(a) {
  const s = L.getShift(S(), a.shift), post = L.getPost(S(), s.post), v = L.getUser(S(), s.volunteer), site = L.getSite(S(), post.site);
  const kind = a.kind === 'help' ? T('I need help', 'Saya perlukan bantuan') : T('Overdue', 'Lewat daftar keluar');
  return `<li class="alert-row">
    <div>${pill('alert', kind, 'triangle')} <b>${esc(v.name)}</b> · ${esc(Lx(post.title))} · ${esc(site.name)}<br>
      <span class="meta">${a.kind === 'help' ? T('Asked for help at', 'Meminta bantuan pada') : T('Was due out at', 'Sepatutnya keluar pada')} ${fmtTime(a.kind === 'help' ? a.at : s.due)} · ${T('alert raised', 'amaran dibuat')} ${fmtWhen(a.at)} · ${T('now', 'kini')}: ${shiftStatusPill(s)}</span></div>
    <div class="row">
      <button type="button" class="btn btn-secondary" data-act="call-demo" data-id="${a.id}">${T('Call', 'Hubungi')} ${demoTag()}<span class="sr"> ${esc(v.name)}</span></button>
      <button type="button" class="btn btn-primary" data-act="resolve-alert" data-id="${a.id}">${T('Mark resolved', 'Tanda selesai')}<span class="sr">: ${esc(kind)}, ${esc(v.name)}</span></button>
    </div></li>`;
}

export function myPosts() {
  const u = me();
  if (u.roles.poster !== 'approved') return notPoster();
  const mine = S().posts.filter((p) => p.poster === u.id && p.mode === S().mode);
  const open = mine.filter((p) => p.status !== 'closed'), closed = mine.filter((p) => p.status === 'closed');
  return `
  <h1 tabindex="-1">${T('My posts', 'Tugasan saya')}</h1>
  <p class="lead">${T('Accept or decline volunteers, see who is on site, and update or close posts.', 'Terima atau tolak sukarelawan, lihat siapa di tapak, dan kemas kini atau tutup tugasan.')}</p>
  <div class="row">
    <a class="btn btn-primary btn-big" href="#create">${icon('megaphone')} ${T('Create a post', 'Cipta tugasan')}</a>
    ${mySites().map((s) => `<a class="btn btn-secondary btn-big" href="#site/${s.id}">${icon('building')} ${esc(s.name)}</a>`).join('')}
  </div>
  <ul class="list">${open.map(myPostCard).join('') || `<li class="card empty">${T('No open posts yet. Create one to ask for help.', 'Belum ada tugasan terbuka. Cipta satu untuk meminta bantuan.')}</li>`}</ul>
  ${closed.length ? `<details class="card"><summary>${T('Closed posts', 'Tugasan ditutup')} (${closed.length})</summary><ul class="list">${closed.map(myPostCard).join('')}</ul></details>` : ''}`;
}

on('accept', async ({ id }, el) => {
  if (el.getAttribute('aria-disabled') === 'true') { toast(T('This volunteer can’t be accepted yet. The reason is shown on the request.', 'Sukarelawan ini belum boleh diterima. Sebabnya dipaparkan pada permohonan.')); return; }
  const s = L.getShift(S(), id), v = L.getUser(S(), s.volunteer), post = L.getPost(S(), s.post);
  const res = await confirmDialog({ title: T(`Accept ${v.name}?`, `Terima ${v.name}?`), body: `<p>${esc(Lx(post.title))}<br>${postWhen(post)}</p>`, confirm: T('Accept volunteer', 'Terima sukarelawan') });
  if (!res) return;
  const out = L.decideRequest(S(), me().id, id, true);
  toast(out.ok ? T(`${v.name} accepted. Their shift is now “Accepted”.${out.nowFull ? ' This post is now full.' : ''}`, `${v.name} diterima. Syif mereka kini “Diterima”.${out.nowFull ? ' Tugasan ini kini penuh.' : ''}`)
    : out.code === 'full' ? T('Not accepted: the post is already full.', 'Tidak diterima: tugasan sudah penuh.') : T('Not accepted: the volunteer no longer meets the rules for this post.', 'Tidak diterima: sukarelawan tidak lagi memenuhi syarat tugasan ini.'));
  refresh();
});
on('decline', async ({ id }) => {
  const s = L.getShift(S(), id), v = L.getUser(S(), s.volunteer);
  const res = await confirmDialog({ title: T(`Decline ${v.name}?`, `Tolak ${v.name}?`), body: `<p>${T('They will see that the request was declined and can pick another post.', 'Mereka akan melihat permohonan ditolak dan boleh memilih tugasan lain.')}</p>`, reason: 'optional', reasonLabel: T('Reason for the volunteer', 'Sebab untuk sukarelawan'), confirm: T('Decline request', 'Tolak permohonan') });
  if (!res) return;
  L.decideRequest(S(), me().id, id, false, res.reason);
  toast(T(`${v.name}’s request was declined.`, `Permohonan ${v.name} ditolak.`));
  refresh();
});
on('close-post', async ({ id }) => {
  const post = L.getPost(S(), id);
  const open = S().shifts.filter((s) => s.post === id && ['requested', 'accepted'].includes(s.status)).length;
  const res = await confirmDialog({
    title: T('Close this post?', 'Tutup tugasan ini?'),
    body: `<p><b>${esc(Lx(post.title))}</b></p><p>${T(`It leaves the post board. ${open} waiting or accepted ${plural(open, 'volunteer', 'volunteers')} will see “Cancelled by poster”. Completed shifts and hours are kept.`, `Ia dikeluarkan dari papan tugasan. ${open} sukarelawan yang menunggu atau diterima akan melihat “Dibatalkan oleh pemohon”. Syif dan jam yang selesai dikekalkan.`)}</p>`,
    confirm: T('Close post', 'Tutup tugasan'), tone: 'alert',
  });
  if (!res) return;
  const out = L.closePost(S(), me().id, id);
  toast(T(`Post closed. ${out.cancelled} ${plural(out.cancelled, 'shift', 'shifts')} marked “Cancelled by poster”.`, `Tugasan ditutup. ${out.cancelled} syif ditanda “Dibatalkan oleh pemohon”.`));
  refresh();
});
on('call-demo', () => toast(T('Demo only: no real call is made. In production this would open the volunteer’s emergency contact.', 'Demo sahaja: tiada panggilan sebenar dibuat. Dalam produksi ia akan membuka kenalan kecemasan sukarelawan.')));
on('resolve-alert', async ({ id }) => {
  const a = S().alerts.find((x) => x.id === id), s = L.getShift(S(), a.shift), v = L.getUser(S(), s.volunteer);
  const res = await confirmDialog({
    title: T('Mark this alert resolved?', 'Tanda amaran ini selesai?'),
    body: `<p>${T(`Confirm that you have checked on <b>${esc(v.name)}</b> and they are safe. Only this alert is closed.`, `Sahkan anda telah menyemak <b>${esc(v.name)}</b> dan mereka selamat. Hanya amaran ini ditutup.`)}</p>`,
    reason: 'optional', reasonLabel: T('Note', 'Catatan'), confirm: T('Mark resolved', 'Tanda selesai'),
  });
  if (!res) return;
  const out = L.resolveAlert(S(), me().id, id, res.reason);
  toast(out.ok ? T(`Alert for ${v.name} resolved.`, `Amaran untuk ${v.name} diselesaikan.`) : T('You can’t resolve this alert.', 'Anda tidak boleh menyelesaikan amaran ini.'));
  refresh();
});

// ---------- Site overview and school reopening tracker ----------
function tracker(site) {
  const u = me(), stages = L.recoveryStages(S(), site.id), rec = S().recovery[site.id] || {};
  const isPoster = site.poster === u.id, admin = !!u.roles.admin;
  const doneCount = stages.filter((s) => s.done).length;
  const who = (id) => (rec[`${id}By`] ? `${T('Confirmed by', 'Disahkan oleh')} ${esc(L.getUser(S(), rec[`${id}By`])?.name || '')} · ${fmtWhen(rec[`${id}At`])}` : T('Recorded', 'Direkodkan'));
  const evidenceText = {
    cleanup: (n) => T(`${n} completed cleanup ${plural(n, 'shift', 'shifts')}`, `${n} syif pembersihan selesai`),
    supplies: (n) => T(`${n} completed delivery ${plural(n, 'shift', 'shifts')}`, `${n} syif penghantaran selesai`),
    inspection: (n) => T(`${n} completed ${plural(n, 'check', 'checks')} by a verified Engineer or Electrician`, `${n} pemeriksaan selesai oleh Jurutera atau Juruelektrik disahkan`),
  };
  const row = (st) => {
    const canAct = !st.done && st.by !== 'report' && ((st.by === 'admin' && admin) || (st.by === 'poster' && (isPoster || admin)));
    let status, action = '';
    if (st.done) status = `${pill('ok', T('Done', 'Selesai'), 'check')} <span class="hint">${st.id === 'assessed' ? `${T('Damage report filed', 'Laporan kerosakan difailkan')} ${rec.assessedAt ? fmtWhen(rec.assessedAt) : ''}` : who(st.id)}</span>`;
    else if (st.id === 'assessed') status = `${pill('muted', T('Not yet', 'Belum'), 'clock')} <span class="hint">${T('Done when the poster files a damage report.', 'Selesai apabila pemohon memfailkan laporan kerosakan.')}</span>`;
    else if (st.id === 'inspection') {
      status = st.ready
        ? `${pill('caution', T('Waiting for the coordinator to record the result', 'Menunggu penyelaras merekod keputusan'), 'clock')} <span class="hint">${evidenceText.inspection(st.evidence)}. ${T('A finished shift does not pass an inspection by itself.', 'Syif yang selesai tidak meluluskan pemeriksaan dengan sendirinya.')}</span>`
        : `${pill('muted', T('Not yet', 'Belum'), 'clock')} <span class="hint">${T('Needs a completed check by a verified Engineer or Electrician, then the coordinator records the result.', 'Memerlukan pemeriksaan selesai oleh Jurutera atau Juruelektrik disahkan, kemudian penyelaras merekod keputusannya.')}</span>`;
      if (canAct && st.ready) action = `<button type="button" class="btn btn-primary" data-act="confirm-stage" data-id="${site.id}" data-key="inspection">${T('Record inspection passed', 'Rekod pemeriksaan lulus')} ${demoTag()}</button>`;
    } else if (st.evidence !== null) {
      status = st.ready
        ? `${pill('caution', T('Ready to confirm', 'Sedia untuk disahkan'), 'info')} <span class="hint">${evidenceText[st.id](st.evidence)}.</span>`
        : `${pill('muted', T('Not yet', 'Belum'), 'clock')} <span class="hint">${evidenceText[st.id](0)}.</span>`;
      if (canAct && st.ready) action = `<button type="button" class="btn btn-primary" data-act="confirm-stage" data-id="${site.id}" data-key="${st.id}">${T('Confirm', 'Sahkan')}: ${esc(lab('stage', st.id))}</button>`;
    } else if (st.id === 'reopened') {
      status = `${pill('muted', T('Not yet', 'Belum'), 'clock')} <span class="hint">${st.ready ? T('All earlier stages are done.', 'Semua peringkat terdahulu selesai.') : T('Possible once every earlier stage is done.', 'Boleh dilakukan selepas semua peringkat terdahulu selesai.')}</span>`;
      if (canAct && st.ready) action = `<button type="button" class="btn btn-primary" data-act="confirm-stage" data-id="${site.id}" data-key="reopened">${T('Mark school reopened', 'Tanda sekolah dibuka semula')}</button>`;
    } else {
      status = `${pill('muted', T('Not yet', 'Belum'), 'clock')}`;
      if (canAct) action = `<button type="button" class="btn btn-secondary" data-act="confirm-stage" data-id="${site.id}" data-key="${st.id}">${T('Confirm', 'Sahkan')}: ${esc(lab('stage', st.id))}</button>`;
    }
    return `<li class="${st.done ? 'done' : ''}"><span class="track-dot" aria-hidden="true">${st.done ? icon('check') : ''}</span><div><b>${esc(lab('stage', st.id))}</b><br>${status}${action ? `<div class="row">${action}</div>` : ''}</div></li>`;
  };
  return `<section class="card" aria-labelledby="track-h">
    <h2 id="track-h">${icon('building')} ${T('Reopening tracker', 'Penjejak pembukaan semula')}</h2>
    <p>${T(`${doneCount} of ${stages.length} stages done.`, `${doneCount} daripada ${stages.length} peringkat selesai.`)} ${T('Completed shifts are the evidence; a person confirms each stage.', 'Syif yang selesai menjadi bukti; seseorang mengesahkan setiap peringkat.')}</p>
    <ol class="track">${stages.map(row).join('')}</ol>
  </section>`;
}

export function siteView(id) {
  const site = L.getSite(S(), id);
  if (!site) return `<h1 tabindex="-1">${T('Site not found', 'Tapak tidak ditemui')}</h1>`;
  const posts = S().posts.filter((p) => p.site === id && p.mode === S().mode && p.status !== 'sentBack');
  const rec = S().recovery[id];
  const poster = L.getUser(S(), site.poster);
  return `
  <h1 tabindex="-1">${esc(site.name)}</h1>
  <p class="meta">${icon('building')} ${esc(site.area)}${site.pupils ? ` · ${site.pupils} ${T('pupils', 'murid')}` : ''}${poster ? ` · ${T('Poster', 'Pemohon')}: ${esc(poster.name)}` : ''} · <small>${T('sample data', 'data contoh')}</small></p>
  <div class="pills">${siteTags(site)}</div>
  <div class="detail">
    <div>
      ${site.type === 'school' ? tracker(site) : ''}
      ${rec?.rooms ? `<section class="card"><h2>${T('Damage assessment', 'Penilaian kerosakan')}</h2><dl class="facts">${Object.entries(rec.rooms).map(([r, v]) => `<dt>${esc(lab('room', r))}</dt><dd>${severityPill(v.severity)}</dd>`).join('')}</dl>${rec.photos?.length ? `<p class="hint">${T('Photos (names only, demo)', 'Gambar (nama sahaja, demo)')}: ${rec.photos.map(esc).join(', ')}</p>` : ''}</section>` : ''}
    </div>
    <div>
      <section class="card" aria-labelledby="site-posts">
        <h2 id="site-posts">${icon('megaphone')} ${T('Posts at this site', 'Tugasan di tapak ini')}</h2>
        ${posts.length ? `<ul class="sub-list">${posts.map((p) => `<li>${postStatusPill(p)} ${p.status === 'live' ? `<a href="#post/${p.id}">${esc(Lx(p.title))}</a>` : esc(Lx(p.title))}${placesLine(p)}</li>`).join('')}</ul>` : `<p>${T('No posts yet.', 'Belum ada tugasan.')}</p>`}
      </section>
      ${site.type === 'school' ? `<div class="notice notice-attention">${icon('shield')}<div><b>${T('Child-safe rules', 'Peraturan selamat kanak-kanak')}</b><ul>
        <li>${T('Tasks with pupils present need a verified Child-safe badge.', 'Tugasan bersama murid memerlukan lencana Selamat kanak-kanak yang disahkan.')}</li>
        <li>${T('No one is ever alone with a pupil.', 'Tiada sesiapa boleh bersendirian dengan murid.')}</li>
        <li>${T('No photos of pupils.', 'Tiada gambar murid.')}</li></ul></div></div>` : ''}
    </div>
  </div>`;
}

on('confirm-stage', async ({ id, key }) => {
  const name = lab('stage', key);
  const extra = key === 'inspection'
    ? notice('caution', T('<b>Demo.</b> Record this only when the inspector reports a pass. In production this needs the inspector’s signed result.', '<b>Demo.</b> Rekod hanya apabila pemeriksa melaporkan lulus. Dalam produksi ini memerlukan keputusan bertandatangan pemeriksa.'), 'shield') : '';
  const res = await confirmDialog({ title: T(`Confirm “${name}”?`, `Sahkan “${name}”?`), body: `<p>${T('This moves the reopening tracker forward for everyone who views this site.', 'Ini memajukan penjejak pembukaan semula untuk semua yang melihat tapak ini.')}</p>${extra}`, confirm: T('Confirm stage', 'Sahkan peringkat') });
  if (!res) return;
  const out = L.confirmStage(S(), me().id, id, key);
  toast(out.ok ? T(`Reopening tracker: “${name}” is now done.`, `Penjejak pembukaan semula: “${name}” kini selesai.`) : T('This stage can’t be confirmed yet.', 'Peringkat ini belum boleh disahkan.'));
  refresh();
});
