// ReadyHands — coordinator dashboard (Harapan Relief, fictional).
import * as L from './logic.js';
import {
  store, S, me, T, Lx, lab, esc, icon, pill, meter, levelTone, needsList, field, demoTag, notice, on, refresh, toast, confirmDialog,
  fmtWhen, fmtH, postWhen, plural,
} from './ui.js';
import { alertRow } from './views-poster.js';

const section = (id, title, count, body, ic) => `
  <section class="card" aria-labelledby="${id}">
    <h2 id="${id}">${icon(ic)} ${title}${count !== null ? ` <span class="count">${count}</span>` : ''}</h2>
    ${body}
  </section>`;
const empty = (text) => `<p class="hint">${text}</p>`;

function alertsPanel() {
  const alerts = L.openAlerts(S());
  return `
  <section class="card ${alerts.length ? 'is-alert' : ''}" aria-labelledby="co-alerts">
    <h2 id="co-alerts">${icon('triangle')} ${T('Safety alerts', 'Amaran keselamatan')} <span class="count">${alerts.length}</span></h2>
    ${alerts.length ? `<ul class="sub-list">${alerts.map(alertRow).join('')}</ul>` : empty(T('No open alerts. Everyone on site is within their expected time.', 'Tiada amaran terbuka. Semua di tapak masih dalam masa jangkaan.'))}
    <p class="hint">${T('This demo does not track location or send real alerts.', 'Demo ini tidak menjejak lokasi atau menghantar amaran sebenar.')}</p>
  </section>`;
}

function applications() {
  const apps = S().posterApps.filter((a) => a.status === 'pending');
  return section('co-apps', T('Poster applications', 'Permohonan pemohon bantuan'), apps.length, apps.length ? `<ul class="sub-list">${apps.map((a) => {
    const u = L.getUser(S(), a.user);
    return `<li class="request"><div><b>${icon('user')} ${esc(u.name)}</b> · ${esc(a.role)}<br>${icon('building')} ${esc(a.site)} (${esc(lab('siteType', a.siteType))}, ${esc(a.area)})<br><span class="meta">${T('Proof', 'Bukti')}: ${a.proofFile ? esc(a.proofFile) : T('none', 'tiada')} · ${fmtWhen(a.at)}</span></div>
      <div class="row"><button type="button" class="btn btn-primary" data-act="approve-app" data-id="${a.id}">${T('Approve', 'Lulus')}<span class="sr"> ${esc(u.name)}</span></button>
      <button type="button" class="btn btn-secondary" data-act="decline-app" data-id="${a.id}">${T('Decline', 'Tolak')}<span class="sr"> ${esc(u.name)}</span></button></div></li>`;
  }).join('')}</ul>` : empty(T('No applications waiting.', 'Tiada permohonan menunggu.')), 'user');
}

function postsToApprove() {
  const posts = S().posts.filter((p) => p.status === 'pending');
  return section('co-posts', T('Posts to approve', 'Tugasan untuk diluluskan'), posts.length, posts.length ? `<ul class="sub-list">${posts.map((p) => {
    const site = L.getSite(S(), p.site), poster = L.getUser(S(), p.poster);
    return `<li class="request"><div><b>${esc(Lx(p.title))}</b> · ${p.qty} ${T(plural(p.qty, 'person', 'people'), 'orang')}<br>
      ${icon('building')} <a href="#site/${site.id}">${esc(site.name)}</a>${site.overlooked ? ` ${pill('caution', T('Overlooked', 'Terabai'), 'star')}` : ''} · ${T('Poster', 'Pemohon')}: ${esc(poster.name)}<br>
      <span class="req">${needsList(p)}${p.badge ? ` · ${icon('shield')} ${T('verified', 'disahkan')} ${esc(lab('badge', p.badge))}` : ''}</span><br>
      <span class="meta">${T('Risk', 'Risiko')}: ${esc(lab('risk', p.risk))} · ${postWhen(p)}${p.source === 'report' ? ` · ${T('from damage report', 'daripada laporan kerosakan')}` : ''}</span></div>
      <div class="row"><button type="button" class="btn btn-primary" data-act="approve-post" data-id="${p.id}">${T('Approve', 'Lulus')}<span class="sr">: ${esc(Lx(p.title))}</span></button>
      <button type="button" class="btn btn-secondary" data-act="sendback-post" data-id="${p.id}">${T('Send back', 'Kembalikan')}<span class="sr">: ${esc(Lx(p.title))}</span></button></div></li>`;
  }).join('')}</ul>${posts.length > 1 ? `<button type="button" class="btn btn-secondary" data-act="approve-all-posts">${T(`Approve all ${posts.length} posts`, `Luluskan kesemua ${posts.length} tugasan`)}</button>` : ''}` : empty(T('No posts waiting.', 'Tiada tugasan menunggu.')), 'megaphone');
}

function badgesToVerify() {
  const rows = S().users.flatMap((u) => L.BADGES.filter((b) => L.badgeStatus(u, b) === 'pending').map((b) => ({ u, b })));
  return section('co-badges', T('Badges to verify', 'Lencana untuk disahkan'), rows.length, `
    ${rows.length ? `<ul class="sub-list">${rows.map(({ u, b }) => `<li class="request"><div><b>${icon('shield')} ${esc(u.name)}</b> · ${esc(lab('badge', b))}<br><span class="meta">${T('File', 'Fail')}: ${u.badges[b].file ? esc(u.badges[b].file) : T('none uploaded', 'tiada dimuat naik')} · ${esc(lab('badgeBody', b))}</span></div>
      <div class="row"><button type="button" class="btn btn-primary" data-act="verify-badge" data-id="${u.id}" data-key="${b}">${T('Approve badge', 'Luluskan lencana')} ${demoTag()}<span class="sr">: ${esc(lab('badge', b))}, ${esc(u.name)}</span></button></div></li>`).join('')}</ul>` : empty(T('No badges waiting.', 'Tiada lencana menunggu.'))}
    <p class="hint">${T('Simulated check. No professional body or background-check service is contacted in this prototype.', 'Semakan simulasi. Tiada badan profesional atau perkhidmatan semakan latar belakang dihubungi dalam prototaip ini.')}</p>`, 'shield');
}

function fatigue() {
  const rows = L.fatigueList(S());
  return section('co-fatigue', T('Fatigue: volunteers at or near their limits', 'Keletihan: sukarelawan pada atau hampir had'), rows.length, `
    ${rows.length ? `<ul class="sub-list">${rows.map(({ user: u, rest: r }) => {
      const dayText = `${T('Today', 'Hari ini')}: ${fmtH(r.today)}${r.planned > 0.05 ? ` + ${fmtH(r.planned)} ${T('planned', 'dirancang')}` : ''} ${T('of', 'daripada')} ${r.dayCap} ${T('h', 'j')}`;
      const weekText = `${T('This week', 'Minggu ini')}: ${fmtH(r.week)} ${T('of', 'daripada')} ${r.weekCap} ${T('h', 'j')}`;
      return `<li class="request"><div><b>${icon('user')} ${esc(u.name)}</b> ${pill(levelTone(r.overall), r.overall === 'at' ? T('At limit', 'Mencapai had') : T('Near limit', 'Hampir had'), r.overall === 'at' ? 'triangle' : 'moon')}
        ${r.restDay ? pill('alert', T(`${L.RULES.maxStreakDays} days in a row: rest day`, `${L.RULES.maxStreakDays} hari berturut-turut: hari rehat`), 'moon') : ''}
        <div class="rest-line"><span>${dayText}</span>${meter(r.today + r.planned, r.dayCap, dayText, levelTone(r.dayLevel))}</div>
        <div class="rest-line"><span>${weekText}</span>${meter(r.week, r.weekCap, weekText, levelTone(r.weekLevel))}</div>
        ${r.override ? `<p class="hint">${icon('info')} ${T('Cap raised today by', 'Had dinaikkan hari ini oleh')} ${esc(L.getUser(S(), r.override.by)?.name || '')}: “${esc(r.override.reason)}”</p>` : ''}
        ${u.restAsked === L.dayOf(S().now) ? `<p class="hint">${icon('moon')} ${T('Asked to rest today (demo).', 'Diminta berehat hari ini (demo).')}</p>` : ''}</div>
        <div class="row"><button type="button" class="btn btn-secondary" data-act="ask-rest" data-id="${u.id}">${T('Ask to rest', 'Minta berehat')} ${demoTag()}<span class="sr"> ${esc(u.name)}</span></button>
        <button type="button" class="btn btn-ghost" data-act="raise-cap" data-id="${u.id}" ${r.override ? 'aria-disabled="true"' : ''}>${r.override ? T('Cap already raised', 'Had telah dinaikkan') : T('Raise cap (reason)', 'Naikkan had (sebab)')}<span class="sr"> ${esc(u.name)}</span></button></div></li>`;
    }).join('')}</ul>` : empty(T('Nobody is near a limit.', 'Tiada sesiapa hampir had.'))}
    <p class="hint">${T(`Placeholder limits for this prototype: ${L.RULES.dayCap} h a day, ${L.RULES.weekCap} h in 7 days, ${L.RULES.restGapHours} h overnight rest, a rest day after ${L.RULES.maxStreakDays} days in a row. Not official medical or operational standards.`, `Had sementara untuk prototaip ini: ${L.RULES.dayCap} jam sehari, ${L.RULES.weekCap} jam dalam 7 hari, rehat malam ${L.RULES.restGapHours} jam, sehari rehat selepas ${L.RULES.maxStreakDays} hari berturut-turut. Bukan piawaian perubatan atau operasi rasmi.`)}</p>`, 'moon');
}

function gaps() {
  const rows = L.coverageGaps(S());
  const name = (g) => (g.type === 'asset' ? lab('asset', g.key) : g.type === 'skill' ? lab('skill', g.key) : `${T('verified', 'disahkan')} ${lab('badge', g.key)}`);
  return section('co-gaps', T('Gaps: needs with too few matching volunteers', 'Jurang: keperluan dengan terlalu sedikit sukarelawan sepadan'), rows.length, rows.length ? `<ul class="sub-list">${rows.map((g) => `
    <li>${pill(g.have === 0 ? 'alert' : 'caution', g.have === 0 ? T('No one available', 'Tiada yang tersedia') : T('Too few', 'Terlalu sedikit'), 'triangle')}
      ${T(`<b>${g.posts} ${plural(g.posts, 'post needs', 'posts need')} ${esc(name(g))}</b> (${g.places} ${plural(g.places, 'place', 'places')}); ${g.have} registered ${plural(g.have, 'volunteer has', 'volunteers have')} it.`,
          `<b>${g.posts} tugasan memerlukan ${esc(name(g))}</b> (${g.places} tempat); ${g.have} sukarelawan berdaftar memilikinya.`)}</li>`).join('')}</ul>` : empty(T('Every open need has enough matching volunteers.', 'Setiap keperluan terbuka mempunyai sukarelawan sepadan yang mencukupi.')), 'wrench');
}

function sitesPanel() {
  const rows = L.siteCoverage(S());
  return section('co-sites', T('Sites, least helped first', 'Tapak, paling kurang dibantu dahulu'), null, `
    <ul class="sub-list">${rows.map((r) => {
      const label = T(`${r.got} of ${r.qty} places filled`, `${r.got} daripada ${r.qty} tempat diisi`);
      return `<li class="request"><div><a href="#site/${r.site.id}"><b>${esc(r.site.name)}</b></a> ${r.site.overlooked ? pill('caution', T('Overlooked, priority', 'Terabai, keutamaan'), 'star') : ''} ${r.ratio < 0.5 ? pill('alert', T('Understaffed', 'Kurang tenaga'), 'triangle') : ''}
        <div class="rest-line"><span>${label} · ${r.posts} ${T(plural(r.posts, 'post', 'posts'), 'tugasan')}</span>${meter(r.got, r.qty, label, r.ratio < 0.5 ? 'alert' : r.ratio < 1 ? 'caution' : 'ok')}</div></div>
        <div class="row"><button type="button" class="btn btn-ghost" data-act="toggle-overlooked" data-id="${r.site.id}" aria-pressed="${r.site.overlooked ? 'true' : 'false'}">${r.site.overlooked ? T('Marked overlooked', 'Ditanda terabai') : T('Mark as overlooked', 'Tanda sebagai terabai')}<span class="sr">: ${esc(r.site.name)}</span></button></div></li>`;
    }).join('')}</ul>
    <p class="hint">${T('Overlooked sites rank 1.6× higher on every volunteer’s board.', 'Tapak terabai disusun 1.6× lebih tinggi pada papan setiap sukarelawan.')}</p>`, 'building');
}

function fairness() {
  const n = store.ui.simN || 40;
  const sim = L.fairnessSim(S(), n);
  const max = Math.max(1, ...sim.rows.map((r) => Math.max(r.without, r.withRH, r.need)));
  const bar = (v, tone, label) => `<div class="sim-bar"><span class="sim-label">${label}</span><div class="sim-track"><div class="sim-fill sim-${tone}" style="width:${(v / max) * 100}%"></div></div><span class="sim-n">${v}</span></div>`;
  return section('co-fair', T('Fairness simulation: a viral post', 'Simulasi keadilan: siaran tular'), null, `
    ${notice('info', T(`<b>Simulation with sample numbers.</b> ${n} new volunteers arrive. “Without” follows social-media attention; “with ReadyHands” follows the priority formula and stops at each site’s need.`, `<b>Simulasi dengan nombor contoh.</b> ${n} sukarelawan baharu tiba. “Tanpa” mengikut perhatian media sosial; “dengan ReadyHands” mengikut formula keutamaan dan berhenti pada keperluan setiap tapak.`))}
    <div class="row" role="group" aria-label="${T('Number of volunteers', 'Bilangan sukarelawan')}">${[20, 40, 80].map((x) => `<button type="button" class="chip" data-act="sim-n" data-key="${x}" aria-pressed="${n === x}">${x} ${T('volunteers', 'sukarelawan')}</button>`).join('')}</div>
    <ul class="sub-list sim">${sim.rows.map((r) => `<li><b>${esc(r.site.name)}</b> ${r.site.overlooked ? pill('caution', T('Overlooked', 'Terabai'), 'star') : ''} <span class="meta">${T('still needs', 'masih perlukan')} ${r.need}</span>
      ${bar(r.without, r.without > r.need ? 'alert' : 'muted', T('Without', 'Tanpa'))}${bar(r.withRH, 'ok', T('With ReadyHands', 'Dengan ReadyHands'))}</li>`).join('')}</ul>
    <p><b>${T(`Without: ${sim.wastedWithout} volunteers arrive where they are not needed. With ReadyHands: ${sim.wastedWith}.`, `Tanpa: ${sim.wastedWithout} sukarelawan tiba di tempat yang tidak memerlukan. Dengan ReadyHands: ${sim.wastedWith}.`)}</b>${sim.held ? ` ${T(`${sim.held} are not sent anywhere yet and stay available for the next post.`, `${sim.held} belum dihantar ke mana-mana dan kekal tersedia untuk tugasan seterusnya.`)}` : ''}</p>`, 'star');
}

export function coordinator() {
  const u = me();
  if (!u.roles.admin) {
    const admin = S().users.find((x) => x.roles.admin);
    return `<h1 tabindex="-1">${T('Coordinator dashboard', 'Papan pemuka penyelaras')}</h1>
      ${notice('info', T('This screen is for coordinators. In this prototype, roles are a navigation choice, not real sign-in or security.', 'Skrin ini untuk penyelaras. Dalam prototaip ini, peranan ialah pilihan navigasi, bukan log masuk atau keselamatan sebenar.'))}
      <button type="button" class="btn btn-primary btn-big" data-act="switch-user" data-id="${admin.id}">${T(`View as ${admin.name}, coordinator`, `Lihat sebagai ${admin.name}, penyelaras`)} ${demoTag()}</button>`;
  }
  const k = L.kpis(S());
  const prepare = S().mode === 'prepare';
  return `
  <h1 tabindex="-1">${T('Coordinator dashboard', 'Papan pemuka penyelaras')}</h1>
  <p class="lead">Harapan Relief · ${T('fictional organisation, sample data', 'organisasi rekaan, data contoh')}</p>
  <div class="kpis">
    <div class="kpi"><strong>${k.onSite}</strong><span>${T('Volunteers on site', 'Sukarelawan di tapak')}</span></div>
    <div class="kpi"><strong>${k.filledPct}%</strong><span>${T('Places filled', 'Tempat diisi')}</span></div>
    <div class="kpi ${k.alerts ? 'kpi-alert' : ''}"><strong>${k.alerts}</strong><span>${icon('triangle')} ${T('Overdue / help alerts', 'Amaran lewat / bantuan')}</span></div>
    <div class="kpi ${k.nearCap ? 'kpi-caution' : ''}"><strong>${k.nearCap}</strong><span>${icon('moon')} ${T('Near hour cap', 'Hampir had jam')}</span></div>
  </div>
  <div class="coord">
    <div class="coord-side">
      ${alertsPanel()}
      <section class="card" aria-labelledby="co-mode">
        <h2 id="co-mode">${icon('info')} ${T('Preparedness mode', 'Mod kesiapsiagaan')}</h2>
        <p>${prepare ? T('On: the post board shows training first, then small readiness posts.', 'Hidup: papan tugasan memaparkan latihan dahulu, kemudian tugasan kesiapsiagaan kecil.') : T('Off: the post board shows disaster posts.', 'Mati: papan tugasan memaparkan tugasan bencana.')}</p>
        <button type="button" class="btn btn-secondary" data-act="toggle-mode" aria-pressed="${prepare}">${prepare ? T('Switch to disaster response', 'Tukar ke respons bencana') : T('Switch to preparedness mode', 'Tukar ke mod kesiapsiagaan')}</button>
      </section>
    </div>
    <div class="coord-main">
      ${applications()}
      ${postsToApprove()}
      ${badgesToVerify()}
      ${fatigue()}
      ${gaps()}
      ${sitesPanel()}
      ${fairness()}
    </div>
  </div>`;
}

const actor = () => me().id;

on('approve-app', async ({ id }) => {
  const a = S().posterApps.find((x) => x.id === id), u = L.getUser(S(), a.user);
  const res = await confirmDialog({ title: T(`Approve ${u.name} as a poster?`, `Luluskan ${u.name} sebagai pemohon?`), body: `<p>${T(`They will be able to create posts for <b>${esc(a.site)}</b>. Every post still needs your approval.`, `Mereka boleh mencipta tugasan untuk <b>${esc(a.site)}</b>. Setiap tugasan masih memerlukan kelulusan anda.`)}</p>`, confirm: T('Approve poster', 'Luluskan pemohon') });
  if (!res) return;
  L.decidePosterApp(S(), actor(), id, true);
  toast(T(`${u.name} is now an approved poster for ${a.site}.`, `${u.name} kini pemohon yang diluluskan untuk ${a.site}.`));
  refresh();
});
on('decline-app', async ({ id }) => {
  const a = S().posterApps.find((x) => x.id === id), u = L.getUser(S(), a.user);
  const res = await confirmDialog({ title: T(`Decline ${u.name}’s application?`, `Tolak permohonan ${u.name}?`), body: `<p>${T('They will see your reason and what to fix.', 'Mereka akan melihat sebab anda dan apa yang perlu dibetulkan.')}</p>`, reason: 'required', reasonLabel: T('Reason and what to fix', 'Sebab dan apa yang perlu dibetulkan'), confirm: T('Decline application', 'Tolak permohonan') });
  if (!res) return;
  L.decidePosterApp(S(), actor(), id, false, res.reason);
  toast(T(`${u.name}’s application was declined with your reason.`, `Permohonan ${u.name} ditolak bersama sebab anda.`));
  refresh();
});
on('approve-post', async ({ id }) => {
  const p = L.getPost(S(), id);
  const res = await confirmDialog({ title: T('Approve this post?', 'Luluskan tugasan ini?'), body: `<p><b>${esc(Lx(p.title))}</b><br>${esc(L.getSite(S(), p.site).name)}</p><p>${T('It goes live on the post board straight away.', 'Ia terus aktif di papan tugasan.')}</p>`, confirm: T('Approve, go live', 'Lulus, aktifkan') });
  if (!res) return;
  L.decidePost(S(), actor(), id, true);
  toast(T(`“${Lx(p.title)}” is now live on the post board.`, `“${Lx(p.title)}” kini aktif di papan tugasan.`));
  refresh();
});
on('approve-all-posts', async () => {
  const posts = S().posts.filter((p) => p.status === 'pending');
  const res = await confirmDialog({ title: T(`Approve all ${posts.length} posts?`, `Luluskan kesemua ${posts.length} tugasan?`), body: `<ul>${posts.map((p) => `<li>${esc(Lx(p.title))} · ${esc(L.getSite(S(), p.site).name)}</li>`).join('')}</ul>`, confirm: T('Approve all, go live', 'Lulus semua, aktifkan') });
  if (!res) return;
  posts.forEach((p) => L.decidePost(S(), actor(), p.id, true));
  toast(T(`${posts.length} posts are now live on the post board.`, `${posts.length} tugasan kini aktif di papan tugasan.`));
  refresh();
});
on('sendback-post', async ({ id }) => {
  const p = L.getPost(S(), id);
  const res = await confirmDialog({ title: T('Send this post back?', 'Kembalikan tugasan ini?'), body: `<p><b>${esc(Lx(p.title))}</b></p><p>${T('The poster sees your reason and can fix and resend it.', 'Pemohon melihat sebab anda dan boleh membetulkan serta menghantar semula.')}</p>`, reason: 'required', reasonLabel: T('What needs fixing?', 'Apa yang perlu dibetulkan?'), confirm: T('Send back', 'Kembalikan') });
  if (!res) return;
  L.decidePost(S(), actor(), id, false, res.reason);
  toast(T(`“${Lx(p.title)}” was sent back to the poster.`, `“${Lx(p.title)}” dikembalikan kepada pemohon.`));
  refresh();
});
on('verify-badge', async ({ id, key }) => {
  const u = L.getUser(S(), id), name = lab('badge', key);
  const res = await confirmDialog({
    title: T(`Approve ${u.name}’s ${name} badge?`, `Luluskan lencana ${name} ${u.name}?`),
    body: notice('caution', T('<b>Simulation (demo).</b> No real credential or background check happens here. In production this is confirmed with the relevant professional body.', '<b>Simulasi (demo).</b> Tiada semakan kelayakan atau latar belakang sebenar di sini. Dalam produksi ia disahkan dengan badan profesional berkaitan.'), 'shield'),
    confirm: T('Approve badge (demo)', 'Luluskan lencana (demo)'),
  });
  if (!res) return;
  L.verifyBadge(S(), actor(), id, key);
  toast(T(`${u.name}’s ${name} badge is now verified (demo).`, `Lencana ${name} ${u.name} kini disahkan (demo).`));
  refresh();
});
on('ask-rest', ({ id }) => {
  L.askToRest(S(), actor(), id);
  toast(T(`${L.getUser(S(), id).name} will see a rest suggestion on My shifts. Demo: no real message is sent.`, `${L.getUser(S(), id).name} akan melihat cadangan rehat di Syif saya. Demo: tiada mesej sebenar dihantar.`));
  refresh();
});
on('raise-cap', async ({ id }, el) => {
  if (el.getAttribute('aria-disabled') === 'true') return;
  const u = L.getUser(S(), id);
  const res = await confirmDialog({
    title: T(`Raise ${u.name}’s hour cap for today?`, `Naikkan had jam ${u.name} untuk hari ini?`),
    body: `<p>${T(`Today only: ${L.RULES.dayCap} → ${L.RULES.overrideDayCap} hours a day, ${L.RULES.weekCap} → ${L.RULES.overrideWeekCap} this week. Overnight rest and the rest day after ${L.RULES.maxStreakDays} days still apply. The reason is recorded with your name.`, `Hari ini sahaja: ${L.RULES.dayCap} → ${L.RULES.overrideDayCap} jam sehari, ${L.RULES.weekCap} → ${L.RULES.overrideWeekCap} minggu ini. Rehat malam dan hari rehat selepas ${L.RULES.maxStreakDays} hari masih terpakai. Sebab direkod bersama nama anda.`)}</p>`,
    reason: 'required', reasonLabel: T('Reason for raising the cap', 'Sebab menaikkan had'), confirm: T('Raise cap', 'Naikkan had'), tone: 'alert',
  });
  if (!res) return;
  const out = L.setOverride(S(), actor(), id, res.reason);
  toast(out.ok ? T(`${u.name}’s cap is raised to ${L.RULES.overrideDayCap} hours for today. Reason recorded.`, `Had ${u.name} dinaikkan kepada ${L.RULES.overrideDayCap} jam untuk hari ini. Sebab direkodkan.`) : T('Cap not raised: a reason is required.', 'Had tidak dinaikkan: sebab diperlukan.'));
  refresh();
});
on('toggle-overlooked', ({ id }) => {
  const site = L.getSite(S(), id);
  site.overlooked = !site.overlooked;
  toast(site.overlooked ? T(`${site.name} is marked overlooked and now ranks higher.`, `${site.name} ditanda terabai dan kini disusun lebih tinggi.`) : T(`${site.name} is no longer marked overlooked.`, `${site.name} tidak lagi ditanda terabai.`));
  refresh();
});
on('toggle-mode', async () => {
  const toPrepare = S().mode !== 'prepare';
  const res = await confirmDialog({ title: toPrepare ? T('Switch to preparedness mode?', 'Tukar ke mod kesiapsiagaan?') : T('Switch to disaster response?', 'Tukar ke respons bencana?'), body: `<p>${toPrepare ? T('Volunteers see training first and small readiness posts.', 'Sukarelawan melihat latihan dahulu dan tugasan kesiapsiagaan kecil.') : T('Volunteers see live disaster posts.', 'Sukarelawan melihat tugasan bencana yang aktif.')}</p>`, confirm: T('Switch mode', 'Tukar mod') });
  if (!res) return;
  S().mode = toPrepare ? 'prepare' : 'disaster';
  toast(toPrepare ? T('Preparedness mode is on.', 'Mod kesiapsiagaan dihidupkan.') : T('Disaster response mode is on.', 'Mod respons bencana dihidupkan.'));
  refresh();
});
on('sim-n', ({ key }) => { store.ui.simN = Number(key); refresh(); });
