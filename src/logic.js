// ReadyHands — pure dispatch, safety and burnout logic (no DOM).
// Every function takes the app state and returns a result or mutates state in place.
// Timestamps are "demo-local" milliseconds; days are computed with plain arithmetic.

export const H = 3600000;
export const MIN = 60000;
export const DAY = 24 * H;

// PRODUCT.md §5.2 — prototype placeholders, not approved medical or operational standards.
export const RULES = {
  dayCap: 8,
  weekCap: 40,
  restGapHours: 10,
  breakAfterHours: 4,
  maxStreakDays: 5,
  overdueGraceMin: 30,
  nearRatio: 0.75,
  overrideDayCap: 10,
  overrideWeekCap: 44,
  trainingValidDays: 365,
};

export const SKILLS = ['cleanup', 'driving', 'cooking', 'teaching', 'firstAid', 'counseling'];
export const PRO_SKILLS = ['medic', 'electrician', 'engineer'];
export const ASSETS = ['fourByFour', 'boat', 'lorry', 'generator', 'pump', 'chainsaw'];
export const BADGES = ['medic', 'electrician', 'engineer', 'childSafe'];
export const MODULE_IDS = ['basics', 'cleanup', 'hygiene', 'electricity', 'driving', 'boat', 'pfa', 'children'];
export const SEVERITY = ['none', 'light', 'moderate', 'severe'];
export const STAGES = ['evacuees', 'assessed', 'cleanup', 'inspection', 'supplies', 'reopened'];

const FILLING = ['accepted', 'onsite', 'overdue', 'done'];
const OPEN_SHIFT = ['requested', 'accepted', 'onsite', 'overdue'];

export const dayOf = (ts) => Math.floor(ts / DAY);
const ok = (extra = {}) => ({ ok: true, ...extra });
const fail = (code, extra = {}) => ({ ok: false, code, ...extra });
const nextId = (state, prefix) => `${prefix}${++state.seq}`;

export const getUser = (state, id) => state.users.find((u) => u.id === id);
export const getPost = (state, id) => state.posts.find((p) => p.id === id);
export const getSite = (state, id) => state.sites.find((s) => s.id === id);
export const getShift = (state, id) => state.shifts.find((s) => s.id === id);
export const isAdmin = (state, id) => !!getUser(state, id)?.roles.admin;

// ---------- Capacity ----------

export function filled(state, post) {
  const joined = state.shifts.filter((s) => s.post === post.id && FILLING.includes(s.status)).length;
  return (post.baseFilled || 0) + joined;
}
export const unmet = (state, post) => Math.max(0, post.qty - filled(state, post));
export const isFull = (state, post) => filled(state, post) >= post.qty;

/** Displayed status: a live post with no places left shows as "full". */
export function postStatus(state, post) {
  if (post.status === 'live' && isFull(state, post)) return 'full';
  return post.status;
}

// ---------- Training and badges ----------

export function trainingValid(user, moduleId, now) {
  const done = user.training?.[moduleId];
  return typeof done === 'number' && now < done + RULES.trainingValidDays * DAY;
}
export const trainingExpiry = (user, moduleId) =>
  typeof user.training?.[moduleId] === 'number' ? user.training[moduleId] + RULES.trainingValidDays * DAY : null;
export const badgeStatus = (user, badge) => user.badges?.[badge]?.status || 'none';

/** PRODUCT.md §5.4: which modules a post needs, from its skills, assets, badge and site type. */
export function suggestTraining(post, siteType) {
  const need = new Set(['basics']);
  const skills = [...(post.skills || []), ...(post.optSkills || [])];
  const assets = [...(post.assets || []), ...(post.optAssets || [])];
  if (skills.includes('cleanup')) { need.add('cleanup'); need.add('hygiene'); }
  if (skills.includes('cooking')) need.add('hygiene');
  if (skills.includes('electrician') || (post.assets || []).some((a) => a === 'generator' || a === 'pump')) need.add('electricity');
  if (skills.includes('driving') || assets.includes('fourByFour') || assets.includes('lorry')) need.add('driving');
  if ((post.assets || []).includes('boat')) need.add('boat');
  if (siteType === 'shelter' || siteType === 'home') need.add('pfa');
  if (post.badge === 'childSafe') need.add('children');
  return MODULE_IDS.filter((m) => need.has(m));
}

// ---------- Hours and rest ----------

/** [start, end] a shift occupies, or null when it carries no hours. */
function span(state, shift, post, { planned }) {
  if (shift.status === 'done') return [shift.checkIn, shift.checkOut];
  if (shift.status === 'onsite' || shift.status === 'overdue') {
    return [shift.checkIn, planned ? Math.max(shift.due, state.now) : state.now];
  }
  if (planned && shift.status === 'accepted' && post) {
    const start = Math.max(post.start, state.now);
    return [start, start + post.hours * H];
  }
  return null;
}

function hoursOn(state, userId, day, { planned = false, excludeShift = null } = {}) {
  let ms = 0;
  for (const s of state.shifts) {
    if (s.volunteer !== userId || s.id === excludeShift) continue;
    const sp = span(state, s, getPost(state, s.post), { planned });
    if (sp && dayOf(sp[0]) === day) ms += sp[1] - sp[0];
  }
  return ms / H;
}

/** Hours actually recorded between check-in and check-out (plus time on site so far). */
export const workedHours = (state, userId, day) => hoursOn(state, userId, day);
/** Recorded hours plus accepted shifts still to come that day. */
export const committedHours = (state, userId, day, excludeShift) => hoursOn(state, userId, day, { planned: true, excludeShift });

export function weekHours(state, userId, day, opts = {}) {
  let total = 0;
  for (let d = day - 6; d <= day; d++) total += hoursOn(state, userId, d, opts);
  return total;
}

/** Consecutive days with recorded work immediately before `day`. */
export function streakBefore(state, userId, day) {
  let n = 0;
  while (n < 60 && workedHours(state, userId, day - 1 - n) > 0) n++;
  return n;
}

export function caps(state, user, day) {
  const o = user.override;
  if (o && o.day === day && o.reason) return { day: RULES.overrideDayCap, week: RULES.overrideWeekCap, override: o };
  return { day: RULES.dayCap, week: RULES.weekCap, override: null };
}

function lastCheckOut(state, userId) {
  return state.shifts.filter((s) => s.volunteer === userId && s.status === 'done').reduce((m, s) => Math.max(m, s.checkOut), 0);
}

/**
 * Would taking `hours` starting at `start` break a burnout rule?
 * Interpretation: the 10-hour rest applies between working days (overnight);
 * several shifts on one day are governed by the daily cap.
 */
export function restCheck(state, user, start, hours, excludeShift = null) {
  const begin = Math.max(start, state.now);
  const day = dayOf(begin);
  const cap = caps(state, user, day);
  const worked = workedHours(state, user.id, day);
  const committed = committedHours(state, user.id, day, excludeShift);
  const tomorrow6 = (day + 1) * DAY + 6 * H;

  const streak = streakBefore(state, user.id, day);
  if (streak >= RULES.maxStreakDays) return fail('streak', { streak, availableAt: (day + 1) * DAY });

  if (committed + hours > cap.day + 1e-9) {
    return fail('day', { worked, committed, cap: cap.day, availableAt: Math.max(tomorrow6, lastCheckOut(state, user.id) + RULES.restGapHours * H) });
  }
  const week = weekHours(state, user.id, day, { planned: true, excludeShift });
  if (week + hours > cap.week + 1e-9) return fail('week', { week, cap: cap.week, availableAt: tomorrow6 });

  const last = lastCheckOut(state, user.id);
  if (last && dayOf(last) < day && begin - last < RULES.restGapHours * H) {
    return fail('gap', { availableAt: last + RULES.restGapHours * H });
  }
  return ok({ worked, committed, cap: cap.day });
}

/** Rest summary for meters and the coordinator fatigue view. */
export function restStatus(state, user) {
  const day = dayOf(state.now);
  const cap = caps(state, user, day);
  const today = workedHours(state, user.id, day);
  const planned = committedHours(state, user.id, day) - today;
  const week = weekHours(state, user.id, day);
  const streak = streakBefore(state, user.id, day) + (today > 0 ? 1 : 0);
  const restDay = streakBefore(state, user.id, day) >= RULES.maxStreakDays;
  const level = (v, c) => (v >= c - 1e-9 ? 'at' : v >= c * RULES.nearRatio ? 'near' : 'ok');
  const dayLevel = level(today + planned, cap.day);
  const weekLevel = level(week, cap.week);
  const rank = { ok: 0, near: 1, at: 2 };
  let overall = rank[dayLevel] >= rank[weekLevel] ? dayLevel : weekLevel;
  if (restDay) overall = 'at';
  else if (streak >= RULES.maxStreakDays - 1 && overall === 'ok') overall = 'near';
  return { today, planned, week, streak, restDay, dayCap: cap.day, weekCap: cap.week, dayLevel, weekLevel, overall, override: cap.override };
}

// ---------- Matching (PRODUCT.md §5.1) ----------

export function matchInfo(user, post) {
  const assets = [...(post.assets || []), ...(post.optAssets || [])].filter((a) => user.assets.includes(a));
  const skills = [...(post.skills || []), ...(post.optSkills || [])].filter((s) => user.skills.includes(s));
  return { match: assets.length + skills.length > 0, assets, skills };
}

/** priority = (unmet / qty) × (overlooked ? 1.6 : 1) × (risk == high ? 1.2 : 1) × (match ? 1.5 : 1) */
export function priority(state, post, user) {
  if (!post.qty || post.qty <= 0) return 0;
  const site = getSite(state, post.site);
  const match = user ? matchInfo(user, post).match : false;
  return (unmet(state, post) / post.qty) * (site?.overlooked ? 1.6 : 1) * (post.risk === 'high' ? 1.2 : 1) * (match ? 1.5 : 1);
}

/** The hard rules. Returns every failing reason so the card can show the fix. */
export function hardRules(state, user, post, excludeShift = null) {
  const reasons = [];
  const skills = (post.skills || []).filter((s) => !user.skills.includes(s));
  const assets = (post.assets || []).filter((a) => !user.assets.includes(a));
  if (skills.length || assets.length) reasons.push({ code: 'need', skills, assets });
  if (post.badge && badgeStatus(user, post.badge) !== 'verified') {
    reasons.push({ code: 'badge', badge: post.badge, status: badgeStatus(user, post.badge) });
  }
  const modules = (post.training || []).filter((m) => !trainingValid(user, m, state.now));
  if (modules.length) reasons.push({ code: 'training', modules });
  const rest = restCheck(state, user, post.start, post.hours, excludeShift);
  if (!rest.ok) reasons.push({ ...rest, code: 'rest', rule: rest.code });
  return reasons;
}

/** state: 'ok' | 'blocked' | 'full' | 'joined' | 'closed' */
export function eligibility(state, user, post) {
  const mine = state.shifts.find((s) => s.post === post.id && s.volunteer === user.id && [...OPEN_SHIFT, 'done'].includes(s.status));
  const reasons = hardRules(state, user, post);
  const m = matchInfo(user, post);
  let st = 'ok';
  if (post.status !== 'live') st = 'closed';
  else if (mine) st = 'joined';
  else if (isFull(state, post)) st = 'full';
  else if (reasons.length) st = 'blocked';
  return { state: st, reasons, shift: mine || null, ...m, priority: priority(state, post, user) };
}

/** Joinable posts by priority, then blocked posts, then full posts at the bottom. */
export function rankPosts(state, user, posts) {
  const group = { joined: 0, ok: 0, blocked: 1, full: 2, closed: 3 };
  return posts
    .map((post, i) => ({ post, i, e: eligibility(state, user, post) }))
    .sort((a, b) => group[a.e.state] - group[b.e.state] || b.e.priority - a.e.priority || a.i - b.i)
    .map(({ post, e }) => ({ post, e }));
}

/** Where to send a volunteer who opens a full post: the best open post, preferring the same kind of work. */
export function redirectFor(state, user, fullPost) {
  const open = state.posts.filter((p) => p.id !== fullPost.id && p.status === 'live' && p.mode === fullPost.mode && !isFull(state, p));
  const ranked = rankPosts(state, user, open).filter((r) => r.e.state === 'ok' || r.e.state === 'blocked');
  const wants = new Set([...(fullPost.skills || []), ...(fullPost.assets || [])]);
  const similar = (p) => [...(p.skills || []), ...(p.assets || [])].some((x) => wants.has(x));
  const fixable = (r) => r.e.state === 'ok' || r.e.reasons.every((x) => x.code === 'training' || x.code === 'rest');
  return (
    ranked.filter((r) => similar(r.post) && fixable(r)).sort((a, b) => b.e.priority - a.e.priority)[0] ||
    ranked.find((r) => r.e.state === 'ok') ||
    null
  );
}

export function postCategory(post) {
  if (post.badge && post.badge !== 'childSafe') return 'pro';
  if ((post.skills || []).includes('driving') || (post.assets || []).some((a) => ['fourByFour', 'lorry', 'boat'].includes(a))) return 'driving';
  return 'hands';
}

// ---------- Profile, badges, training ----------

export function saveProfile(state, userId, patch) {
  const u = getUser(state, userId);
  if (!u) return fail('noUser');
  for (const k of ['name', 'area', 'availability', 'assetNotes']) if (k in patch) u[k] = patch[k];
  if (patch.skills) u.skills = patch.skills.filter((s) => SKILLS.includes(s) || PRO_SKILLS.includes(s));
  if (patch.assets) u.assets = patch.assets.filter((a) => ASSETS.includes(a));
  u.profileSaved = true;
  return ok();
}

/** Claiming never verifies: the badge becomes "pending" until a coordinator approves it. */
export function claimBadge(state, userId, badge, fileName = '') {
  const u = getUser(state, userId);
  if (!u || !BADGES.includes(badge)) return fail('invalid');
  if (badgeStatus(u, badge) !== 'none') return fail('exists');
  u.badges[badge] = { status: 'pending', file: fileName, claimedAt: state.now };
  return ok();
}

export function verifyBadge(state, actorId, userId, badge) {
  if (!isAdmin(state, actorId)) return fail('notAdmin');
  const u = getUser(state, userId);
  if (!u || badgeStatus(u, badge) !== 'pending') return fail('notPending');
  u.badges[badge] = { ...u.badges[badge], status: 'verified', verifiedAt: state.now, by: actorId, simulated: true };
  return ok();
}

/** Training is recorded only when all three answers are correct. */
export function completeTraining(state, userId, module, answers) {
  const u = getUser(state, userId);
  if (!u || !module) return fail('invalid');
  const wrong = module.questions.map((q, i) => (answers?.[i] === q.answer ? null : i)).filter((i) => i !== null);
  if (wrong.length) return fail('wrong', { wrong });
  u.training[module.id] = state.now;
  return ok({ validTo: state.now + RULES.trainingValidDays * DAY });
}

// ---------- Poster applications and posts ----------

export function applyPoster(state, userId, data) {
  const u = getUser(state, userId);
  if (!u) return fail('noUser');
  if (u.roles.poster === 'approved') return fail('already');
  if (u.roles.poster === 'pending') return fail('pending');
  const errors = {};
  if (!data.site?.trim()) errors.site = true;
  if (!data.role?.trim()) errors.role = true;
  if (Object.keys(errors).length) return fail('invalid', { errors });
  const app = { id: nextId(state, 'app'), user: userId, site: data.site.trim(), siteType: data.siteType || 'school', area: data.area || u.area, role: data.role.trim(), proofFile: data.proofFile || '', status: 'pending', reason: '', at: state.now };
  state.posterApps.push(app);
  u.roles.poster = 'pending';
  return ok({ app });
}

export function decidePosterApp(state, actorId, appId, approve, reason = '') {
  if (!isAdmin(state, actorId)) return fail('notAdmin');
  const app = state.posterApps.find((a) => a.id === appId);
  if (!app || app.status !== 'pending') return fail('notPending');
  const u = getUser(state, app.user);
  if (approve) {
    app.status = 'approved';
    u.roles.poster = 'approved';
    let site = state.sites.find((s) => s.name.toLowerCase() === app.site.toLowerCase());
    if (!site) {
      site = { id: nextId(state, 'site'), name: app.site, type: app.siteType, area: app.area, overlooked: false, poster: u.id, attention: 1 };
      state.sites.push(site);
    } else if (!site.poster) site.poster = u.id;
    app.siteId = site.id;
  } else {
    if (!reason.trim()) return fail('reasonRequired');
    app.status = 'declined';
    app.reason = reason.trim();
    u.roles.poster = 'none';
  }
  return ok();
}

export function validatePost(data) {
  const errors = {};
  if (!data.site) errors.site = true;
  if (!String(data.title || '').trim()) errors.title = true;
  if (!Number.isInteger(data.qty) || data.qty < 1 || data.qty > 200) errors.qty = true;
  if (!(data.hours >= 1 && data.hours <= RULES.dayCap)) errors.hours = true;
  if (!((data.skills || []).length + (data.assets || []).length)) errors.needs = true;
  return errors;
}

/** Professional skills always demand the matching verified badge; Child-safe always demands its training. */
export function normalizePost(data, siteType) {
  const p = { ...data, skills: [...(data.skills || [])], assets: [...(data.assets || [])], training: [...(data.training || [])] };
  const pro = p.skills.find((s) => PRO_SKILLS.includes(s));
  if (pro) p.badge = pro;
  if (p.badge && PRO_SKILLS.includes(p.badge) && !p.skills.includes(p.badge)) p.skills.push(p.badge);
  const must = suggestTraining(p, siteType);
  p.training = MODULE_IDS.filter((m) => must.includes(m) || p.training.includes(m));
  return p;
}

export function createPost(state, userId, data) {
  const u = getUser(state, userId);
  if (!u || u.roles.poster !== 'approved') return fail('notPoster');
  const site = getSite(state, data.site);
  if (site && site.poster !== userId && !u.roles.admin) return fail('notYourSite');
  const errors = validatePost(data);
  if (Object.keys(errors).length) return fail('invalid', { errors });
  const post = {
    id: nextId(state, 'post'), site: data.site, poster: userId, title: typeof data.title === 'string' ? data.title.trim() : data.title, desc: data.desc || '',
    qty: data.qty, baseFilled: 0, optSkills: data.optSkills || [], optAssets: data.optAssets || [], badge: data.badge || null,
    risk: data.risk || 'low', start: data.start, hours: data.hours, mode: data.mode || 'disaster', source: data.source || 'form',
    kind: data.kind || null, status: 'pending', reason: '', createdAt: state.now,
    ...(({ skills, assets, training, badge }) => ({ skills, assets, training, badge }))(normalizePost(data, site?.type)),
  };
  state.posts.push(post);
  return ok({ post });
}

export function updatePost(state, actorId, postId, patch) {
  const post = getPost(state, postId);
  if (!post) return fail('noPost');
  if (post.poster !== actorId && !isAdmin(state, actorId)) return fail('notYours');
  if (post.status === 'closed') return fail('closed');
  const next = { ...post, ...patch };
  const errors = validatePost(next);
  if (next.qty < filled(state, post)) errors.qty = true;
  if (Object.keys(errors).length) return fail('invalid', { errors });
  Object.assign(post, normalizePost(next, getSite(state, post.site)?.type));
  // Changing what a live post asks for needs a fresh coordinator check.
  if (post.status === 'sentBack' || patch.resubmit) { post.status = 'pending'; post.reason = ''; }
  delete post.resubmit;
  return ok();
}

export function decidePost(state, actorId, postId, approve, reason = '') {
  if (!isAdmin(state, actorId)) return fail('notAdmin');
  const post = getPost(state, postId);
  if (!post || post.status !== 'pending') return fail('notPending');
  if (approve) { post.status = 'live'; post.approvedAt = state.now; }
  else {
    if (!reason.trim()) return fail('reasonRequired');
    post.status = 'sentBack';
    post.reason = reason.trim();
  }
  return ok();
}

/** Closing keeps history: open requests and accepted shifts become "cancelled by poster". */
export function closePost(state, actorId, postId) {
  const post = getPost(state, postId);
  if (!post) return fail('noPost');
  if (post.poster !== actorId && !isAdmin(state, actorId)) return fail('notYours');
  if (post.status === 'closed') return fail('closed');
  post.status = 'closed';
  post.closedAt = state.now;
  let cancelled = 0;
  for (const s of state.shifts) {
    if (s.post === postId && (s.status === 'requested' || s.status === 'accepted')) {
      s.status = 'cancelled'; s.cancelledBy = 'poster'; s.cancelledAt = state.now; cancelled++;
    }
  }
  return ok({ cancelled });
}

// ---------- Shift lifecycle ----------

export function requestJoin(state, userId, postId) {
  const user = getUser(state, userId), post = getPost(state, postId);
  if (!user || !post) return fail('invalid');
  const e = eligibility(state, user, post);
  if (e.state !== 'ok') return fail(e.state, { reasons: e.reasons });
  const shift = { id: nextId(state, 'shift'), post: postId, volunteer: userId, status: 'requested', requestedAt: state.now, checkIn: null, checkOut: null, due: null };
  state.shifts.push(shift);
  return ok({ shift });
}

export function withdrawRequest(state, userId, shiftId) {
  const s = getShift(state, shiftId);
  if (!s || s.volunteer !== userId || !['requested', 'accepted'].includes(s.status)) return fail('invalid');
  s.status = 'cancelled'; s.cancelledBy = 'volunteer'; s.cancelledAt = state.now;
  return ok();
}

export function decideRequest(state, actorId, shiftId, accept, reason = '') {
  const s = getShift(state, shiftId);
  if (!s || s.status !== 'requested') return fail('notRequested');
  const post = getPost(state, s.post);
  if (post.poster !== actorId && !isAdmin(state, actorId)) return fail('notYours');
  if (!accept) { s.status = 'declined'; s.reason = reason.trim(); return ok(); }
  if (post.status !== 'live') return fail('closed');
  if (isFull(state, post)) return fail('full');
  const reasons = hardRules(state, getUser(state, s.volunteer), post, s.id);
  if (reasons.length) return fail('blocked', { reasons });
  s.status = 'accepted'; s.acceptedAt = state.now;
  return ok({ nowFull: isFull(state, post) });
}

export function checkIn(state, userId, shiftId) {
  const s = getShift(state, shiftId);
  if (!s || s.volunteer !== userId) return fail('invalid');
  if (s.status !== 'accepted') return fail('notAccepted');
  if (state.shifts.some((x) => x.volunteer === userId && (x.status === 'onsite' || x.status === 'overdue'))) return fail('alreadyOnSite');
  const post = getPost(state, s.post);
  s.status = 'onsite'; s.checkIn = state.now; s.due = state.now + post.hours * H;
  return ok();
}

export function checkOut(state, userId, shiftId) {
  const s = getShift(state, shiftId);
  if (!s || s.volunteer !== userId) return fail('invalid');
  if (s.status !== 'onsite' && s.status !== 'overdue') return fail('notOnSite');
  s.status = 'done'; s.checkOut = state.now;
  // A safe check-out answers the overdue question for this shift only. Help requests stay open for a person to resolve.
  for (const a of state.alerts) {
    if (a.shift === s.id && a.kind === 'overdue' && !a.resolved) { a.resolved = true; a.resolvedAt = state.now; a.resolvedBy = 'checkout'; }
  }
  return ok({ hours: (s.checkOut - s.checkIn) / H });
}

export function extendShift(state, userId, shiftId, minutes, reason) {
  const s = getShift(state, shiftId);
  if (!s || s.volunteer !== userId || (s.status !== 'onsite' && s.status !== 'overdue')) return fail('notOnSite');
  if (!String(reason || '').trim()) return fail('reasonRequired');
  const user = getUser(state, userId);
  const newDue = Math.max(s.due, state.now) + minutes * MIN;
  const day = dayOf(s.checkIn);
  const other = committedHours(state, userId, day, s.id);
  const cap = caps(state, user, day).day;
  if (other + (newDue - s.checkIn) / H > cap + 1e-9) return fail('cap', { cap });
  s.due = newDue;
  s.extensions = [...(s.extensions || []), { minutes, reason: reason.trim(), at: state.now }];
  if (s.status === 'overdue') {
    s.status = 'onsite';
    for (const a of state.alerts) if (a.shift === s.id && a.kind === 'overdue' && !a.resolved) { a.resolved = true; a.resolvedAt = state.now; a.resolvedBy = 'extended'; }
  }
  return ok();
}

function raiseAlert(state, shiftId, kind) {
  if (state.alerts.some((a) => a.shift === shiftId && a.kind === kind && !a.resolved)) return null; // never duplicate
  const alert = { id: nextId(state, 'alert'), shift: shiftId, kind, resolved: false, at: state.now };
  state.alerts.push(alert);
  return alert;
}

export function requestHelp(state, userId, shiftId) {
  const s = getShift(state, shiftId);
  if (!s || s.volunteer !== userId || (s.status !== 'onsite' && s.status !== 'overdue')) return fail('notOnSite');
  const alert = raiseAlert(state, s.id, 'help');
  return alert ? ok({ alert }) : fail('duplicate');
}

/** Overdue = still checked in more than 30 minutes after the expected check-out time. */
export function detectOverdue(state) {
  const raised = [];
  for (const s of state.shifts) {
    if (s.status === 'onsite' && state.now > s.due + RULES.overdueGraceMin * MIN) {
      s.status = 'overdue';
      const a = raiseAlert(state, s.id, 'overdue');
      if (a) raised.push(a);
    }
  }
  return raised;
}

export function advanceClock(state, ms) {
  state.now += Math.max(0, ms);
  return detectOverdue(state);
}

export function simulateOverdue(state, shiftId) {
  const s = getShift(state, shiftId);
  if (!s || (s.status !== 'onsite' && s.status !== 'overdue')) return fail('notOnSite');
  state.now = Math.max(state.now, s.due + (RULES.overdueGraceMin + 1) * MIN);
  detectOverdue(state);
  return ok();
}

export function resolveAlert(state, actorId, alertId, note = '') {
  const a = state.alerts.find((x) => x.id === alertId);
  if (!a || a.resolved) return fail('invalid');
  const post = getPost(state, getShift(state, a.shift).post);
  if (!isAdmin(state, actorId) && post.poster !== actorId) return fail('notAllowed');
  a.resolved = true; a.resolvedAt = state.now; a.resolvedBy = actorId; a.note = note;
  return ok();
}

export const openAlerts = (state) => state.alerts.filter((a) => !a.resolved);
export const breakDue = (state, shift) =>
  (shift.status === 'onsite' || shift.status === 'overdue') && !shift.breakAck && state.now - shift.checkIn >= RULES.breakAfterHours * H;

// ---------- Coordinator ----------

/** Only a coordinator can raise the hour caps, only for one day, and only with a reason. */
export function setOverride(state, actorId, userId, reason) {
  if (!isAdmin(state, actorId)) return fail('notAdmin');
  if (!String(reason || '').trim()) return fail('reasonRequired');
  const u = getUser(state, userId);
  if (!u) return fail('noUser');
  u.override = { day: dayOf(state.now), reason: reason.trim(), by: actorId, at: state.now };
  return ok();
}

export function askToRest(state, actorId, userId) {
  if (!isAdmin(state, actorId)) return fail('notAdmin');
  getUser(state, userId).restAsked = dayOf(state.now);
  return ok();
}

export function fatigueList(state) {
  return state.users
    .filter((u) => state.shifts.some((s) => s.volunteer === u.id))
    .map((u) => ({ user: u, rest: restStatus(state, u) }))
    .filter((r) => r.rest.overall !== 'ok')
    .sort((a, b) => (b.rest.overall === 'at') - (a.rest.overall === 'at') || b.rest.week - a.rest.week);
}

export function kpis(state) {
  const live = state.posts.filter((p) => p.status === 'live' && p.mode === state.mode);
  const qty = live.reduce((n, p) => n + p.qty, 0);
  const got = live.reduce((n, p) => n + Math.min(p.qty, filled(state, p)), 0);
  return {
    onSite: state.shifts.filter((s) => s.status === 'onsite' || s.status === 'overdue').length,
    filledPct: qty ? Math.round((got / qty) * 100) : 0,
    alerts: openAlerts(state).length,
    nearCap: fatigueList(state).length,
  };
}

/** Live posts whose must-have skill, asset or badge no registered volunteer can supply. */
export function coverageGaps(state) {
  const gaps = new Map();
  for (const p of state.posts) {
    if (p.status !== 'live' || p.mode !== state.mode || isFull(state, p)) continue;
    const items = [
      ...(p.assets || []).map((a) => ({ type: 'asset', key: a })),
      ...(p.skills || []).filter((s) => !PRO_SKILLS.includes(s)).map((s) => ({ type: 'skill', key: s })),
      ...(p.badge ? [{ type: 'badge', key: p.badge }] : []),
    ];
    for (const it of items) {
      const id = `${it.type}:${it.key}`;
      if (!gaps.has(id)) {
        const have = state.users.filter((u) =>
          it.type === 'asset' ? u.assets.includes(it.key) : it.type === 'skill' ? u.skills.includes(it.key) : badgeStatus(u, it.key) === 'verified').length;
        gaps.set(id, { ...it, posts: 0, places: 0, have });
      }
      const g = gaps.get(id);
      g.posts++; g.places += unmet(state, p);
    }
  }
  return [...gaps.values()].filter((g) => g.have < g.places).sort((a, b) => a.have - b.have || b.places - a.places);
}

/** Sites ordered least helped first. */
export function siteCoverage(state) {
  return state.sites
    .map((site) => {
      const posts = state.posts.filter((p) => p.site === site.id && p.status === 'live' && p.mode === state.mode);
      const qty = posts.reduce((n, p) => n + p.qty, 0);
      const got = posts.reduce((n, p) => n + Math.min(p.qty, filled(state, p)), 0);
      return { site, posts: posts.length, qty, got, ratio: qty ? got / qty : 1 };
    })
    .filter((r) => r.posts > 0)
    .sort((a, b) => a.ratio - b.ratio || b.site.overlooked - a.site.overlooked);
}

/**
 * Fairness demonstration with sample numbers: where do `n` new volunteers end up?
 * "Without" follows social-media attention; "with" follows the priority formula and stops at capacity.
 */
export function fairnessSim(state, n = 40) {
  const rows = siteCoverage(state).map((r) => ({ site: r.site, need: r.qty - r.got, without: 0, withRH: 0 }));
  if (!rows.length) return { rows: [], n, wastedWithout: 0, wastedWith: 0, held: n };
  const buzz = rows.reduce((t, r) => t + (r.site.attention || 1), 0);
  let given = 0;
  rows.forEach((r, i) => {
    r.without = i === rows.length - 1 ? n - given : Math.round((n * (r.site.attention || 1)) / buzz);
    given += r.without;
  });
  const posts = state.posts.filter((p) => p.status === 'live' && p.mode === state.mode).map((p) => ({ p, left: unmet(state, p) }));
  for (let i = 0; i < n; i++) {
    const best = posts.filter((x) => x.left > 0)
      .map((x) => ({ x, pr: (x.left / x.p.qty) * (getSite(state, x.p.site)?.overlooked ? 1.6 : 1) * (x.p.risk === 'high' ? 1.2 : 1) }))
      .sort((a, b) => b.pr - a.pr)[0];
    if (!best) break;
    best.x.left--;
    rows.find((r) => r.site.id === best.x.p.site).withRH++;
  }
  const wasted = (key) => rows.reduce((t, r) => t + Math.max(0, r[key] - r.need), 0);
  // With ReadyHands nobody is sent past a site's need; anyone left over is held for the next post.
  return { rows, n, wastedWithout: wasted('without'), wastedWith: wasted('withRH'), held: n - rows.reduce((t, r) => t + r.withRH, 0) };
}

// ---------- School damage report and recovery ----------

const SEV_QTY = { light: 4, moderate: 8, severe: 15 };

/** DESIGN.md §4.10 damage → suggested posts. The poster edits these before sending. */
export function suggestPosts(report) {
  const r = report.rooms || {};
  const sev = (room) => r[room]?.severity || 'none';
  const atLeast = (room, level) => SEVERITY.indexOf(sev(room)) >= SEVERITY.indexOf(level);
  const out = [];
  if (atLeast('classrooms', 'light')) {
    out.push({ key: 'cleanup', kind: 'cleanup', from: 'classrooms', qty: SEV_QTY[sev('classrooms')], skills: ['cleanup'], assets: [], optAssets: ['pump'], badge: null, risk: 'medium', hours: 4 });
  }
  if (atLeast('classrooms', 'severe') || report.suppliesNeeded) {
    out.push({ key: 'delivery', kind: 'delivery', from: 'classrooms', qty: 3, skills: ['driving'], assets: ['fourByFour'], badge: null, risk: 'medium', hours: 3 });
  }
  if (atLeast('lab', 'moderate')) {
    out.push({ key: 'wiring', kind: 'inspection', from: 'lab', qty: 1, skills: ['electrician'], assets: [], badge: 'electrician', risk: 'high', hours: 2 });
  }
  if (atLeast('structure', 'moderate')) {
    out.push({ key: 'structure', kind: 'inspection', from: 'structure', qty: 1, skills: ['engineer'], assets: [], badge: 'engineer', risk: 'high', hours: 2 });
  }
  if (atLeast('field', 'moderate')) {
    out.push({ key: 'debris', kind: 'cleanup', from: 'field', qty: 2, skills: ['driving'], assets: ['lorry'], badge: null, risk: 'medium', hours: 4 });
  }
  if (report.powerOut) {
    out.push({ key: 'generator', kind: 'other', from: 'power', qty: 1, skills: [], assets: ['generator'], badge: null, risk: 'medium', hours: 6 });
  }
  if (report.pupilsPresent) {
    out.push({ key: 'reading', kind: 'other', from: 'pupils', qty: 2, skills: ['teaching'], assets: [], badge: 'childSafe', risk: 'low', hours: 2 });
  }
  return out.map((s) => ({ ...s, training: suggestTraining(s, 'school'), include: true }));
}

/** Saves the assessment and creates one pending post per suggestion the poster kept. */
export function submitDamageReport(state, userId, siteId, report, drafts) {
  const u = getUser(state, userId);
  if (!u || u.roles.poster !== 'approved') return fail('notPoster');
  const site = getSite(state, siteId);
  if (!site || (site.poster !== userId && !u.roles.admin)) return fail('notYourSite');
  const keep = drafts.filter((d) => d.include);
  if (!keep.length) return fail('noPosts');
  const created = [];
  for (const d of keep) {
    const res = createPost(state, userId, { ...d, site: siteId, source: 'report' });
    if (!res.ok) return fail('invalid', { draft: d.key, errors: res.errors });
    created.push(res.post);
  }
  const prev = state.recovery[siteId] || {};
  state.recovery[siteId] = {
    evacuees: false, cleanup: false, inspection: false, supplies: false, reopened: false, ...prev,
    disaster: report.disaster || '', rooms: report.rooms, powerOut: !!report.powerOut, pupilsPresent: !!report.pupilsPresent,
    photos: report.photos || [], assessedAt: state.now,
  };
  return ok({ posts: created });
}

const doneShifts = (state, siteId, test) =>
  state.shifts.filter((s) => s.status === 'done' && (() => { const p = getPost(state, s.post); return p && p.site === siteId && test(p); })());

/**
 * Reopening tracker. Completed shifts are evidence; a person still has to confirm each stage,
 * and an inspection is never passed just because a volunteer finished a shift.
 */
export function recoveryStages(state, siteId) {
  const rec = state.recovery[siteId] || {};
  const cleanup = doneShifts(state, siteId, (p) => p.kind === 'cleanup' || (p.skills || []).includes('cleanup')).length;
  const delivery = doneShifts(state, siteId, (p) => p.kind === 'delivery').length;
  const inspect = doneShifts(state, siteId, (p) => p.badge === 'engineer' || p.badge === 'electrician').length;
  const stages = [
    { id: 'evacuees', done: !!rec.evacuees, evidence: null, ready: true, by: 'poster' },
    { id: 'assessed', done: !!rec.rooms, evidence: null, ready: false, by: 'report' },
    { id: 'cleanup', done: !!rec.cleanup, evidence: cleanup, ready: cleanup > 0, by: 'poster' },
    { id: 'inspection', done: !!rec.inspection, evidence: inspect, ready: inspect > 0, by: 'admin' },
    { id: 'supplies', done: !!rec.supplies, evidence: delivery, ready: delivery > 0, by: 'poster' },
  ];
  stages.push({ id: 'reopened', done: !!rec.reopened, evidence: null, ready: stages.every((s) => s.done), by: 'poster' });
  return stages;
}

export function confirmStage(state, actorId, siteId, stageId) {
  const site = getSite(state, siteId);
  const stage = recoveryStages(state, siteId).find((s) => s.id === stageId);
  if (!site || !stage || stage.by === 'report') return fail('invalid');
  if (stage.done) return fail('alreadyDone');
  const admin = isAdmin(state, actorId);
  if (stage.by === 'admin' && !admin) return fail('notAdmin');
  if (stage.by === 'poster' && site.poster !== actorId && !admin) return fail('notYours');
  if (!stage.ready) return fail('noEvidence');
  state.recovery[siteId] = { ...(state.recovery[siteId] || {}), [stageId]: true, [`${stageId}By`]: actorId, [`${stageId}At`]: state.now };
  return ok();
}

// ---------- Recognition (recorded, completed shifts only) ----------

export function recognition(state, user) {
  const done = state.shifts.filter((s) => s.volunteer === user.id && s.status === 'done');
  const posts = done.map((s) => getPost(state, s.post));
  const hours = done.reduce((t, s) => t + (s.checkOut - s.checkIn) / H, 0);
  const sites = new Set(posts.map((p) => p.site)).size;
  const deliveries = posts.filter((p) => (p.assets || []).includes('fourByFour')).length;
  const trained = MODULE_IDS.filter((m) => trainingValid(user, m, state.now)).length;
  const days = [...new Set(done.map((s) => dayOf(s.checkIn)))];
  const restKept = done.length > 0 && !user.override && days.every((d) => workedHours(state, user.id, d) <= RULES.dayCap + 1e-9);
  return {
    shifts: done.length, hours, sites, deliveries, trained,
    badges: [
      { id: 'first', earned: done.length >= 1 },
      { id: 'fourByFour', earned: deliveries >= 5, progress: Math.min(deliveries, 5), goal: 5 },
      { id: 'trained', earned: trained >= 3, progress: Math.min(trained, 3), goal: 3 },
      { id: 'restKept', earned: restKept },
      { id: 'safeOut', earned: done.length >= 1 && !state.shifts.some((s) => s.volunteer === user.id && s.status === 'overdue') },
    ],
    certificate: done.length ? { shifts: done.length, hours, sites, issuedAt: Math.max(...done.map((s) => s.checkOut)) } : null,
  };
}

// ---------- WCAG contrast (used by tests to verify the design tokens) ----------

export function contrast(hexA, hexB) {
  const lum = (hex) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [a, b] = [lum(hexA), lum(hexB)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}
