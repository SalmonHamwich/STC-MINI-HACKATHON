import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as L from '../src/logic.js';
import { seed, MODULES, getModule, D0 } from '../src/data.js';

const { H, MIN, DAY } = L;
const ADMIN = 'u-admin', AINA = 'u-aina', FAIZ = 'u-faiz', PRINCIPAL = 'u-rahimah';
const u = (s, id) => L.getUser(s, id);
const rightAnswers = (id) => getModule(id).questions.map((q) => q.answer);

/** Principal files the sample damage report; returns the created posts by suggestion key. */
function fileReport(s) {
  const report = { disaster: 'Flood', rooms: { classrooms: { severity: 'severe' }, lab: { severity: 'severe' }, field: { severity: 'none' }, structure: { severity: 'none' } } };
  const drafts = L.suggestPosts(report).map((d) => ({ ...d, title: d.key, start: D0 + 8 * H }));
  const res = L.submitDamageReport(s, PRINCIPAL, 's-kbl', report, drafts);
  assert.ok(res.ok, JSON.stringify(res));
  return Object.fromEntries(res.posts.map((p) => [p.title, p]));
}
function registerAina(s) {
  L.saveProfile(s, AINA, { skills: ['cleanup', 'driving'], assets: ['fourByFour'] });
}
/** Runs the script up to live report posts and Aina's profile. */
function liveScenario() {
  const s = seed();
  const posts = fileReport(s);
  for (const p of Object.values(posts)) assert.ok(L.decidePost(s, ADMIN, p.id, true).ok);
  registerAina(s);
  return { s, posts };
}
function joinAndAccept(s, userId, post) {
  const r = L.requestJoin(s, userId, post.id);
  assert.ok(r.ok, JSON.stringify(r));
  assert.ok(L.decideRequest(s, post.poster, r.shift.id, true).ok);
  return r.shift;
}

test('poster approval is required before creating posts', () => {
  const s = seed();
  const data = { site: 's-kbl', title: 'Test', qty: 2, hours: 2, skills: ['cleanup'], start: D0 + 9 * H };
  assert.equal(L.createPost(s, AINA, data).code, 'notPoster');
  assert.ok(L.applyPoster(s, AINA, { site: 'Surau Al-Hidayah', siteType: 'shelter', role: 'Committee member' }).ok);
  assert.equal(u(s, AINA).roles.poster, 'pending');
  assert.equal(L.createPost(s, AINA, data).code, 'notPoster');
  assert.equal(L.decidePosterApp(s, AINA, s.posterApps.at(-1).id, true).code, 'notAdmin');
  assert.ok(L.decidePosterApp(s, ADMIN, s.posterApps.at(-1).id, true).ok);
  assert.equal(u(s, AINA).roles.poster, 'approved');
  assert.equal(u(s, AINA).roles.volunteer, true, 'keeps the volunteer side');
  const site = s.sites.find((x) => x.name === 'Surau Al-Hidayah');
  assert.ok(L.createPost(s, AINA, { ...data, site: site.id }).ok);
  assert.equal(L.createPost(s, AINA, data).code, 'notYourSite');
});

test('declining a poster application needs a reason and can be re-applied', () => {
  const s = seed();
  assert.equal(L.decidePosterApp(s, ADMIN, 'app-1', false, ' ').code, 'reasonRequired');
  assert.ok(L.decidePosterApp(s, ADMIN, 'app-1', false, 'Letter is unreadable').ok);
  assert.equal(u(s, 'u-daud').roles.poster, 'none');
  assert.ok(L.applyPoster(s, 'u-daud', { site: 'Klinik Desa Batu 14', role: 'Clinic assistant' }).ok);
});

test('posts stay off the board until the coordinator approves them', () => {
  const s = seed();
  const posts = fileReport(s);
  assert.deepEqual(Object.keys(posts).sort(), ['cleanup', 'delivery', 'wiring']);
  assert.ok(Object.values(posts).every((p) => p.status === 'pending' && p.source === 'report'));
  registerAina(s);
  assert.equal(L.eligibility(s, u(s, AINA), posts.delivery).state, 'closed');
  assert.equal(L.requestJoin(s, AINA, posts.delivery.id).code, 'closed');
  assert.equal(L.decidePost(s, PRINCIPAL, posts.delivery.id, true).code, 'notAdmin');
  assert.equal(L.decidePost(s, ADMIN, posts.cleanup.id, false, '').code, 'reasonRequired');
  assert.ok(L.decidePost(s, ADMIN, posts.delivery.id, true).ok);
  assert.equal(L.eligibility(s, u(s, AINA), posts.delivery).state, 'ok');
});

test('skills and equipment: must-haves block, optional items only match', () => {
  const { s, posts } = liveScenario();
  const faiz = u(s, FAIZ);
  const e = L.eligibility(s, faiz, posts.delivery);
  assert.equal(e.state, 'blocked');
  const need = e.reasons.find((r) => r.code === 'need');
  assert.deepEqual(need.skills, ['driving']);
  assert.deepEqual(need.assets, ['fourByFour']);
  // Water pump is optional on the cleanup post: not owning one must not block.
  assert.deepEqual(posts.cleanup.optAssets, ['pump']);
  assert.ok(!L.eligibility(s, u(s, AINA), posts.cleanup).reasons.some((r) => r.code === 'need'));
  const boat = L.getPost(s, 'p-dewan-boat');
  assert.deepEqual(L.eligibility(s, u(s, AINA), boat).reasons.find((r) => r.code === 'need').assets, ['boat']);
});

test('professional posts need a verified badge; claiming is not verifying', () => {
  const { s, posts } = liveScenario();
  L.saveProfile(s, FAIZ, { skills: ['electrician'] });
  let e = L.eligibility(s, u(s, FAIZ), posts.wiring);
  assert.equal(e.reasons.find((r) => r.code === 'badge').status, 'none');
  assert.ok(L.claimBadge(s, FAIZ, 'electrician', 'sample-cert.pdf').ok);
  assert.equal(L.badgeStatus(u(s, FAIZ), 'electrician'), 'pending');
  assert.equal(L.requestJoin(s, FAIZ, posts.wiring.id).code, 'blocked');
  assert.equal(L.verifyBadge(s, FAIZ, FAIZ, 'electrician').code, 'notAdmin', 'cannot verify yourself');
  assert.equal(L.verifyBadge(s, PRINCIPAL, FAIZ, 'electrician').code, 'notAdmin');
  assert.ok(L.verifyBadge(s, ADMIN, FAIZ, 'electrician').ok);
  assert.equal(u(s, FAIZ).badges.electrician.simulated, true);
  e = L.eligibility(s, u(s, FAIZ), posts.wiring);
  assert.equal(e.state, 'ok');
  assert.ok(L.requestJoin(s, FAIZ, posts.wiring.id).ok);
});

test('a professional skill on a post always demands its badge; child-safe demands its training', () => {
  const p = L.normalizePost({ skills: ['engineer'], assets: [], training: [] }, 'school');
  assert.equal(p.badge, 'engineer');
  const c = L.normalizePost({ skills: ['teaching'], assets: [], badge: 'childSafe', training: [] }, 'school');
  assert.ok(c.training.includes('children') && c.training.includes('basics'));
  const s = seed();
  const read = L.getPost(s, 'p-tsb-read');
  const e = L.eligibility(s, u(s, PRINCIPAL), read);
  assert.ok(e.reasons.some((r) => r.code === 'badge' && r.badge === 'childSafe'));
});

test('training is enforced, needs all three answers, and expires after 12 months', () => {
  const { s, posts } = liveScenario();
  const aina = u(s, AINA);
  let e = L.eligibility(s, aina, posts.cleanup);
  assert.equal(e.state, 'blocked');
  assert.deepEqual(e.reasons, [{ code: 'training', modules: ['cleanup'] }]);
  const mod = getModule('cleanup');
  const wrong = L.completeTraining(s, AINA, mod, [0, 1, 1]);
  assert.equal(wrong.code, 'wrong');
  assert.deepEqual(wrong.wrong, [0]);
  assert.equal(L.trainingValid(aina, 'cleanup', s.now), false, 'never marked done on a failed check');
  assert.equal(L.completeTraining(s, AINA, mod, []).code, 'wrong');
  assert.ok(L.completeTraining(s, AINA, mod, rightAnswers('cleanup')).ok);
  assert.equal(L.eligibility(s, aina, posts.cleanup).state, 'ok');
  // Boat safety in the sample data is 400 days old.
  assert.equal(L.trainingValid(aina, 'boat', s.now), false);
  assert.equal(L.trainingValid(aina, 'cleanup', s.now + 364 * DAY), true);
  assert.equal(L.trainingValid(aina, 'cleanup', s.now + 366 * DAY), false);
});

test('all eight modules exist with three questions and an activity', () => {
  assert.deepEqual(MODULES.map((m) => m.id), L.MODULE_IDS);
  for (const m of MODULES) {
    assert.equal(m.questions.length, 3, m.id);
    assert.ok(m.cards.length >= 3 && m.activity.items.some((i) => i.correct), m.id);
    for (const q of m.questions) assert.ok(q.answer >= 0 && q.answer < q.options.length && q.text.bm && q.text.en);
  }
});

test('priority follows the documented formula and survives qty = 0', () => {
  const { s, posts } = liveScenario();
  const aina = u(s, AINA);
  // delivery: 3 of 3 unmet, overlooked site, medium risk, matches 4x4 → 1 × 1.6 × 1 × 1.5
  assert.ok(Math.abs(L.priority(s, posts.delivery, aina) - 2.4) < 1e-9);
  // wiring: 1 of 1 unmet, overlooked, high risk, no match → 1 × 1.6 × 1.2 × 1
  assert.ok(Math.abs(L.priority(s, posts.wiring, aina) - 1.92) < 1e-9);
  // clinic disinfection: 4 of 6 unmet (2 sample + Kumar), not overlooked, medium, matches cleanup
  const clinic = L.getPost(s, 'p-klinik-clean');
  assert.equal(L.filled(s, clinic), 3);
  assert.ok(Math.abs(L.priority(s, clinic, aina) - (3 / 6) * 1.5) < 1e-9);
  assert.equal(L.priority(s, { ...clinic, qty: 0 }, aina), 0);
  assert.equal(L.priority(s, { ...clinic, qty: undefined }, aina), 0);
});

test('board: joinable posts by priority, blocked next, full last with a redirect', () => {
  const { s, posts } = liveScenario();
  const aina = u(s, AINA);
  const live = s.posts.filter((p) => p.status === 'live' && p.mode === 'disaster');
  const ranked = L.rankPosts(s, aina, live);
  assert.equal(ranked[0].post.id, posts.delivery.id, 'overlooked school 4x4 delivery on top');
  assert.deepEqual(ranked[0].e.assets, ['fourByFour']);
  const states = ranked.map((r) => r.e.state);
  assert.equal(states.at(-1), 'full');
  assert.equal(ranked.at(-1).post.id, 'p-tsb-clean');
  const order = { ok: 0, blocked: 1, full: 2 };
  assert.deepEqual([...states].sort((a, b) => order[a] - order[b]), states, 'groups stay in order');
  const joinable = ranked.filter((r) => r.e.state === 'ok').map((r) => r.e.priority);
  assert.deepEqual([...joinable].sort((a, b) => b - a), joinable);
  // Blocked posts are never hidden.
  assert.equal(ranked.length, live.length);
  const to = L.redirectFor(s, aina, L.getPost(s, 'p-tsb-clean'));
  assert.equal(to.post.id, posts.cleanup.id, 'full urban cleanup points at the overlooked school cleanup');
  assert.equal(L.requestJoin(s, AINA, 'p-tsb-clean').code, 'full');
});

test('volunteers cannot exceed site capacity', () => {
  const { s, posts } = liveScenario();
  const wiring = posts.wiring; // 1 place
  for (const id of [FAIZ, 'u-hafiz']) {
    L.saveProfile(s, id, { skills: ['electrician'] });
    L.claimBadge(s, id, 'electrician');
    L.verifyBadge(s, ADMIN, id, 'electrician');
    u(s, id).training.electricity = s.now;
  }
  const a = L.requestJoin(s, FAIZ, wiring.id), b = L.requestJoin(s, 'u-hafiz', wiring.id);
  assert.ok(a.ok && b.ok, 'requests do not hold places');
  assert.equal(L.requestJoin(s, FAIZ, wiring.id).code, 'joined', 'no double request');
  assert.ok(L.decideRequest(s, PRINCIPAL, a.shift.id, true).nowFull);
  assert.equal(L.decideRequest(s, PRINCIPAL, b.shift.id, true).code, 'full');
  assert.equal(L.filled(s, wiring), 1);
  assert.equal(L.postStatus(s, wiring), 'full');
  assert.equal(L.updatePost(s, PRINCIPAL, wiring.id, { qty: 0 }).code, 'invalid');
});

test('only the poster (or coordinator) decides join requests', () => {
  const { s, posts } = liveScenario();
  const r = L.requestJoin(s, AINA, posts.delivery.id);
  assert.equal(L.decideRequest(s, FAIZ, r.shift.id, true).code, 'notYours');
  assert.ok(L.decideRequest(s, PRINCIPAL, r.shift.id, false, 'Vehicle too small').ok);
  assert.equal(r.shift.status, 'declined');
  assert.equal(L.checkIn(s, AINA, r.shift.id).code, 'notAccepted');
});

test('lifecycle: requested → accepted → on site → checked out, hours from the record', () => {
  const { s, posts } = liveScenario();
  const r = L.requestJoin(s, AINA, posts.delivery.id);
  assert.equal(r.shift.status, 'requested');
  assert.equal(L.checkIn(s, AINA, r.shift.id).code, 'notAccepted');
  assert.ok(L.decideRequest(s, PRINCIPAL, r.shift.id, true).ok);
  assert.ok(L.checkIn(s, AINA, r.shift.id).ok);
  assert.equal(r.shift.status, 'onsite');
  assert.equal(r.shift.due, r.shift.checkIn + 3 * H);
  assert.equal(L.checkIn(s, AINA, r.shift.id).code, 'notAccepted', 'repeat check-in ignored');
  L.advanceClock(s, 2.5 * H);
  const out = L.checkOut(s, AINA, r.shift.id);
  assert.equal(out.hours, 2.5);
  assert.equal(r.shift.status, 'done');
  assert.equal(L.checkOut(s, AINA, r.shift.id).code, 'notOnSite');
  assert.equal(L.workedHours(s, AINA, L.dayOf(s.now)), 2.5);
});

test('overdue only after 30 minutes past due; alerts never duplicate', () => {
  const { s, posts } = liveScenario();
  const shift = joinAndAccept(s, AINA, posts.delivery);
  L.checkIn(s, AINA, shift.id);
  L.advanceClock(s, 3 * H + 30 * MIN);
  const mine = () => L.openAlerts(s).filter((a) => a.shift === shift.id);
  assert.equal(shift.status, 'onsite', 'exactly 30 minutes late is not overdue yet');
  assert.equal(mine().length, 0);
  L.advanceClock(s, MIN);
  assert.equal(shift.status, 'overdue');
  assert.equal(mine().length, 1);
  L.detectOverdue(s); L.simulateOverdue(s, shift.id); L.advanceClock(s, H);
  assert.equal(s.alerts.filter((a) => a.shift === shift.id && a.kind === 'overdue').length, 1);
  assert.ok(L.requestHelp(s, AINA, shift.id).ok);
  assert.equal(L.requestHelp(s, AINA, shift.id).code, 'duplicate');
  assert.equal(mine().length, 2);
  L.advanceClock(s, 2 * H); L.detectOverdue(s);
  assert.equal(s.alerts.filter((a) => a.shift === 'sh-s1').length, 1, 'one alert per overdue shift');
});

test('resolving one alert never touches another; safe check-out closes only that overdue alert', () => {
  const { s, posts } = liveScenario();
  const shift = joinAndAccept(s, AINA, posts.delivery);
  L.checkIn(s, AINA, shift.id);
  L.simulateOverdue(s, shift.id);
  const siti = L.getShift(s, 'sh-s1');
  assert.equal(siti.status, 'onsite', 'simulating one shift does not flag another that is still within time');
  L.advanceClock(s, 2 * H);
  assert.equal(siti.status, 'overdue', 'the demo clock is shared, so a later shift goes overdue in its own time');
  L.requestHelp(s, 'u-siti', 'sh-s1');
  L.requestHelp(s, AINA, shift.id);
  assert.equal(L.openAlerts(s).length, 4);
  const sitiHelp = s.alerts.find((a) => a.shift === 'sh-s1' && a.kind === 'help');
  assert.equal(L.resolveAlert(s, FAIZ, sitiHelp.id).code, 'notAllowed');
  assert.ok(L.resolveAlert(s, 'u-noraini', sitiHelp.id).ok, 'the site poster may resolve');
  assert.equal(L.resolveAlert(s, ADMIN, sitiHelp.id).code, 'invalid');
  assert.equal(L.openAlerts(s).length, 3);
  L.checkOut(s, AINA, shift.id);
  const open = L.openAlerts(s);
  assert.deepEqual(open.map((a) => `${a.shift}:${a.kind}`).sort(), [`${shift.id}:help`, 'sh-s1:overdue'].sort());
  assert.ok(open.every((a) => L.getShift(s, a.shift)), 'every alert links to a shift');
});

test('extending a shift needs a reason and respects the daily cap', () => {
  const { s, posts } = liveScenario();
  const shift = joinAndAccept(s, AINA, posts.delivery);
  L.checkIn(s, AINA, shift.id);
  assert.equal(L.extendShift(s, AINA, shift.id, 60, '').code, 'reasonRequired');
  assert.ok(L.extendShift(s, AINA, shift.id, 60, 'Second load of desks').ok);
  assert.equal(shift.due, shift.checkIn + 4 * H);
  for (let i = 0; i < 4; i++) assert.ok(L.extendShift(s, AINA, shift.id, 60, 'More loads').ok);
  assert.equal(L.extendShift(s, AINA, shift.id, 60, 'One more').code, 'cap');
  assert.equal(shift.due, shift.checkIn + 8 * H);
});

test('burnout: the daily cap blocks a third shift; an override needs a coordinator and a reason', () => {
  const { s, posts } = liveScenario();
  const aina = u(s, AINA);
  L.completeTraining(s, AINA, getModule('cleanup'), rightAnswers('cleanup'));
  const first = joinAndAccept(s, AINA, posts.delivery); // 3 h
  L.checkIn(s, AINA, first.id);
  L.simulateOverdue(s, first.id);
  L.checkOut(s, AINA, first.id); // 3 h 31 min recorded
  joinAndAccept(s, AINA, posts.cleanup); // + 4 h planned
  const clinic = L.getPost(s, 'p-klinik-clean'); // 3 h
  const e = L.eligibility(s, aina, clinic);
  assert.equal(e.state, 'blocked');
  const rest = e.reasons.find((r) => r.code === 'rest');
  assert.equal(rest.rule, 'day');
  assert.equal(rest.cap, 8);
  assert.equal(L.requestJoin(s, AINA, clinic.id).code, 'blocked');

  assert.equal(L.setOverride(s, PRINCIPAL, AINA, 'please').code, 'notAdmin');
  assert.equal(L.setOverride(s, ADMIN, AINA, '   ').code, 'reasonRequired');
  assert.equal(L.eligibility(s, aina, clinic).state, 'blocked');
  assert.ok(L.setOverride(s, ADMIN, AINA, 'Only 4x4 driver left; short delivery').ok);
  assert.equal(L.caps(s, aina, L.dayOf(s.now)).day, 10);
  // 3.52 + 4 + 3 is still past the raised cap of 10; a 2-hour post now fits.
  assert.equal(L.eligibility(s, aina, clinic).state, 'blocked');
  const furniture = L.getPost(s, 'p-rumah-furniture');
  aina.training.pfa = s.now;
  assert.equal(L.eligibility(s, aina, furniture).state, 'ok');
  aina.override = null;
  assert.equal(L.eligibility(s, aina, furniture).state, 'blocked');
  // The override lasts one day only.
  L.setOverride(s, ADMIN, AINA, 'reason');
  assert.equal(L.caps(s, aina, L.dayOf(s.now) + 1).day, 8);
});

test('burnout: weekly cap, 10-hour overnight rest and a rest day after 5 days', () => {
  const s = seed();
  const mei = u(s, 'u-meiling');
  const clinic = L.getPost(s, 'p-klinik-clean');
  assert.equal(L.restCheck(s, mei, clinic.start, clinic.hours).code, 'streak');
  assert.equal(L.restStatus(s, mei).restDay, true);
  assert.equal(L.restStatus(s, mei).week, 37.5);

  // Weekly cap: four days of 7.5 h plus a rest day, then a 3-hour shift would reach 40.5 h.
  s.shifts = s.shifts.filter((x) => x.id !== 'sh-ml4');
  const check = L.restCheck(s, mei, clinic.start, 3);
  assert.equal(check.ok, true, '30 + 3 fits');
  s.shifts.push({ id: 'x1', post: 'p-past-sandbag', volunteer: 'u-meiling', status: 'done', checkIn: D0 + 0.25 * H, checkOut: D0 + 7.5 * H, due: D0 + 7.5 * H });
  s.now = D0 + 8 * H;
  assert.equal(L.restCheck(s, mei, clinic.start, 3).code, 'day');
  s.shifts.at(-1).checkOut = D0 + 7.25 * H; // 7 h today → week 37 h
  assert.equal(L.restCheck(s, mei, clinic.start, 1).ok, true);
  mei.override = { day: L.dayOf(s.now), reason: 'r' };
  assert.equal(L.restCheck(s, mei, clinic.start, 3).ok, true, 'day cap raised to 10');
  mei.override = null;
  s.shifts.pop();
  s.shifts.push({ id: 'x2', post: 'p-past-sandbag', volunteer: 'u-meiling', status: 'done', checkIn: D0 - 6 * DAY + 8 * H, checkOut: D0 - 6 * DAY + 16 * H, due: 0 });
  assert.equal(L.restCheck(s, mei, clinic.start, 3).code, 'week', '38 + 3 > 40');

  // Overnight rest: checked out at 23:00 yesterday, a 7 am shift is too soon, a 9 am shift is fine.
  const t = seed();
  const kumar = u(t, 'u-kumar');
  t.shifts = [{ id: 'y', post: 'p-past-sandbag', volunteer: 'u-kumar', status: 'done', checkIn: D0 - 4 * H, checkOut: D0 - 1 * H, due: 0 }];
  t.now = D0 + 6 * H;
  const gap = L.restCheck(t, kumar, D0 + 7 * H, 2);
  assert.equal(gap.code, 'gap');
  assert.equal(gap.availableAt, D0 + 9 * H);
  assert.equal(L.restCheck(t, kumar, D0 + 9 * H, 2).ok, true);
});

test('coordinator views: fatigue, KPIs, gaps and least-helped sites', () => {
  const s = seed();
  const tired = L.fatigueList(s).map((r) => r.user.id);
  assert.ok(tired.includes('u-meiling') && tired.includes('u-kumar'));
  assert.ok(!tired.includes('u-siti'));
  const k = L.kpis(s);
  assert.equal(k.onSite, 1);
  assert.equal(k.alerts, 0);
  assert.equal(k.nearCap, tired.length);
  const gaps = L.coverageGaps(s);
  const boat = gaps.find((g) => g.key === 'boat');
  assert.deepEqual([boat.posts, boat.have], [1, 0]);
  assert.ok(gaps.some((g) => g.type === 'badge' && g.key === 'medic' && g.have === 0), 'pending medic does not count');
  const cov = L.siteCoverage(s);
  assert.ok(cov[0].ratio <= cov.at(-1).ratio);
  assert.equal(cov.at(-1).site.id, 's-tsb');
});

test('fairness demonstration: attention floods the viral site, ReadyHands fills by need', () => {
  const { s } = liveScenario();
  const sim = L.fairnessSim(s, 40);
  const row = (id) => sim.rows.find((r) => r.site.id === id);
  assert.equal(sim.rows.reduce((t, r) => t + r.without, 0), 40);
  assert.ok(row('s-tsb').without > row('s-kbl').without);
  assert.ok(row('s-kbl').withRH > row('s-kbl').without);
  assert.ok(sim.rows.every((r) => r.withRH <= r.need), 'never sends more than a site needs');
  assert.ok(sim.wastedWithout > sim.wastedWith);
  assert.equal(sim.wastedWith, 0);
  assert.equal(sim.held + sim.rows.reduce((n, r) => n + r.withRH, 0), 40);
});

test('closing a post keeps cancelled shift history', () => {
  const { s, posts } = liveScenario();
  const req = L.requestJoin(s, AINA, posts.delivery.id).shift;
  L.saveProfile(s, 'u-kumar', { skills: ['cleanup', 'driving'], assets: ['fourByFour', 'lorry'] });
  assert.ok(L.withdrawRequest(s, 'u-kumar', 'sh-k2').ok);
  const acc = joinAndAccept(s, 'u-kumar', posts.delivery);
  const before = s.shifts.length;
  assert.equal(L.closePost(s, FAIZ, posts.delivery.id).code, 'notYours');
  const res = L.closePost(s, PRINCIPAL, posts.delivery.id);
  assert.equal(res.cancelled, 2);
  assert.equal(L.getShift(s, 'sh-k2').cancelledBy, 'volunteer');
  assert.equal(s.shifts.length, before, 'nothing disappears');
  assert.deepEqual([req.status, req.cancelledBy, acc.status, acc.cancelledBy], ['cancelled', 'poster', 'cancelled', 'poster']);
  assert.equal(L.checkIn(s, 'u-kumar', acc.id).code, 'notAccepted');
  assert.equal(L.eligibility(s, u(s, FAIZ), posts.delivery).state, 'closed');
  const kept = L.getShift(s, 'sh-ml0');
  assert.equal(kept.status, 'done', 'unrelated history untouched');
});

test('certificates and badges come only from recorded, completed shifts', () => {
  const { s, posts } = liveScenario();
  const aina = u(s, AINA);
  assert.equal(L.recognition(s, aina).certificate, null);
  const shift = joinAndAccept(s, AINA, posts.delivery);
  assert.equal(L.recognition(s, aina).certificate, null, 'accepted is not completed');
  L.checkIn(s, AINA, shift.id);
  assert.equal(L.recognition(s, aina).certificate, null, 'on site is not completed');
  L.advanceClock(s, 3 * H);
  L.checkOut(s, AINA, shift.id);
  const rec = L.recognition(s, aina);
  assert.deepEqual([rec.certificate.shifts, rec.certificate.hours, rec.certificate.sites], [1, 3, 1]);
  assert.equal(rec.badges.find((b) => b.id === 'first').earned, true);
  assert.equal(rec.badges.find((b) => b.id === 'fourByFour').progress, 1);
  assert.equal(L.recognition(s, u(s, 'u-meiling')).certificate.hours, 37.5);
});

test('damage report maps to the documented suggestions and stays editable', () => {
  const all = L.suggestPosts({
    rooms: { classrooms: { severity: 'severe' }, lab: { severity: 'severe' }, structure: { severity: 'moderate' }, field: { severity: 'moderate' } },
    powerOut: true, pupilsPresent: true,
  });
  const by = Object.fromEntries(all.map((d) => [d.key, d]));
  assert.deepEqual([by.cleanup.qty, by.cleanup.skills, by.cleanup.training.includes('cleanup')], [15, ['cleanup'], true]);
  assert.equal(by.wiring.badge, 'electrician');
  assert.equal(by.structure.badge, 'engineer');
  assert.deepEqual([by.debris.skills, by.debris.assets], [['driving'], ['lorry']]);
  assert.deepEqual(by.generator.assets, ['generator']);
  assert.ok(by.generator.training.includes('electricity'));
  assert.equal(by.reading.badge, 'childSafe');
  assert.ok(by.reading.training.includes('children'));
  assert.deepEqual(by.delivery.assets, ['fourByFour']);
  assert.equal(L.suggestPosts({ rooms: {} }).length, 0);

  const s = seed();
  const report = { rooms: { classrooms: { severity: 'severe' } } };
  const drafts = L.suggestPosts(report).map((d) => ({ ...d, title: d.key, start: D0 + 9 * H }));
  drafts[0].qty = 25; drafts[1].include = false; // poster edits before sending
  assert.equal(L.submitDamageReport(s, AINA, 's-kbl', report, drafts).code, 'notPoster');
  assert.equal(L.submitDamageReport(s, 'u-zul', 's-kbl', report, drafts).code, 'notYourSite');
  const res = L.submitDamageReport(s, PRINCIPAL, 's-kbl', report, drafts);
  assert.equal(res.posts.length, 1);
  assert.equal(res.posts[0].qty, 25);
  assert.equal(s.recovery['s-kbl'].evacuees, true, 'earlier progress is kept');
});

test('reopening tracker: shifts are evidence, people confirm, inspection is never automatic', () => {
  const { s, posts } = liveScenario();
  const stage = (id) => L.recoveryStages(s, 's-kbl').find((x) => x.id === id);
  assert.equal(stage('evacuees').done, true);
  assert.equal(stage('assessed').done, true);
  assert.equal(L.confirmStage(s, PRINCIPAL, 's-kbl', 'supplies').code, 'noEvidence');

  const d = joinAndAccept(s, AINA, posts.delivery);
  L.checkIn(s, AINA, d.id); L.advanceClock(s, 3 * H); L.checkOut(s, AINA, d.id);
  assert.deepEqual([stage('supplies').done, stage('supplies').evidence, stage('supplies').ready], [false, 1, true]);
  assert.equal(L.confirmStage(s, FAIZ, 's-kbl', 'supplies').code, 'notYours');
  assert.ok(L.confirmStage(s, PRINCIPAL, 's-kbl', 'supplies').ok);
  assert.equal(stage('supplies').done, true);

  L.saveProfile(s, FAIZ, { skills: ['electrician'] });
  L.claimBadge(s, FAIZ, 'electrician'); L.verifyBadge(s, ADMIN, FAIZ, 'electrician');
  assert.equal(L.confirmStage(s, ADMIN, 's-kbl', 'inspection').code, 'noEvidence');
  const w = joinAndAccept(s, FAIZ, posts.wiring);
  L.checkIn(s, FAIZ, w.id); L.advanceClock(s, 2 * H); L.checkOut(s, FAIZ, w.id);
  assert.equal(stage('inspection').done, false, 'a finished shift does not pass an inspection');
  assert.equal(L.confirmStage(s, PRINCIPAL, 's-kbl', 'inspection').code, 'notAdmin');
  assert.ok(L.confirmStage(s, ADMIN, 's-kbl', 'inspection').ok);
  assert.equal(L.confirmStage(s, PRINCIPAL, 's-kbl', 'reopened').code, 'noEvidence', 'cleanup still outstanding');
});

test('rest prompt after 4 hours on site', () => {
  const s = seed();
  const siti = L.getShift(s, 'sh-s1');
  assert.equal(L.breakDue(s, siti), false);
  L.advanceClock(s, 3.5 * H);
  assert.equal(L.breakDue(s, siti), true);
  siti.breakAck = 'break';
  assert.equal(L.breakDue(s, siti), false);
});

test('reset is repeatable: a fresh seed is unaffected by an earlier run', () => {
  const { s } = liveScenario();
  s.users[0].name = 'changed';
  const fresh = seed();
  assert.equal(fresh.users[0].name, 'Aina');
  assert.equal(fresh.posts.some((p) => p.source === 'report'), false);
  assert.deepEqual(seed(), fresh);
});

test('design tokens reach WCAG AA contrast', () => {
  const pairs = [
    ['#183E35', '#F8F9F4'], ['#53685E', '#F8F9F4'], ['#53685E', '#FFFFFF'], ['#53685E', '#E9EFDF'], ['#FFFFFF', '#225B45'],
    ['#183E35', '#FFF5D9'], ['#A8321F', '#FBE4DF'], ['#8A5A00', '#FFF0CC'], ['#2C7A4B', '#E0F2E6'], ['#1F5F8B', '#E1EEF7'],
    ['#FFFFFF', '#A8321F'],
  ];
  for (const [fg, bg] of pairs) assert.ok(L.contrast(fg, bg) >= 4.5, `${fg} on ${bg}: ${L.contrast(fg, bg).toFixed(2)}`);
});
