# SchoolBridge: Design and Interaction Specification

> **The right volunteer, with the right skills and equipment, sent safely to where help is needed.**

How SchoolBridge looks, is structured and behaves. SchoolBridge is a **disaster volunteer dispatch platform** built on skill-based matching. The demo runs on an **example scenario: schools damaged by a flood**.

- [PRODUCT.md](PRODUCT.md): the idea, matching and burnout rules, features, demo script.
- [VISUAL-DESIGN.md](VISUAL-DESIGN.md): base layout sketches, colors, type and accessibility states. This file adds the dispatch screens and the disaster status layer on top of it, and wins where they differ.
- `pulih-prototype.html`: earlier working prototype. Its fair ranking, trust levels, check-in and school walkthrough are reference behavior to rebuild in this design.

---

## 1. Design principles

1. **Volunteer first.** The main journey is a volunteer going from "I want to help" to "I got home safely and got credit". Everything else supports it.
2. **Show why, and the fix.** When a volunteer can't join a mission, the card says why and offers the next step (take training, get verified, rest).
3. **Safety is never hidden.** Required training, badges, trust level, risk and check-in status sit on the card.
4. **Disaster context, calm delivery.** It is always clear a disaster is happening, but the tone is a reassuring person explaining the next step. No countdowns, no frightening imagery.
5. **Fairness is visible.** Overlooked sites are marked and ranked higher. Full missions point somewhere else.
6. **Status is never color alone.** Every pill and state has text and, where useful, an icon.

---

## 2. Visual direction

Base palette, type and spacing come from VISUAL-DESIGN.md (warm ivory, forest green, soft sage, 18 px body, 52 px buttons). SchoolBridge adds a **disaster status layer** and **dispatch badges**.

### 2.1 Base tokens (from VISUAL-DESIGN.md)

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#F8F9F4` | Page background |
| `--ink` | `#183E35` | Headings and main text |
| `--primary` | `#225B45` | Main buttons, verified states |
| `--muted` | `#53685E` | Supporting text |
| `--soft` | `#E9EFDF` | Panels, highlights |
| `--line` | `#DCE4D9` | Dividers, meter tracks |
| `--card` | `#FFFFFF` | Cards, inputs |
| `--attention` | `#FFF5D9` | Training required, inspection, safety notices |

### 2.2 Status tokens

| Token | Value (text / soft) | Meaning |
| --- | --- | --- |
| `--alert` | `#A8321F` / `#FBE4DF` | Disaster active, overdue, "I need help", over hour cap |
| `--caution` | `#8A5A00` / `#FFF0CC` | Overlooked/priority, training required, near hour cap, professional required |
| `--ok` | `#2C7A4B` / `#E0F2E6` | Checked out safely, training done, badge verified, rested |
| `--prepare` | `#1F5F8B` / `#E1EEF7` | Preparedness mode, information |

Each pair must reach WCAG 2.2 AA (4.5:1) for text on its soft background; verify before release.

### 2.3 Icons (always with text)

Wrench (skill), truck / boat / plug (asset: 4x4 or lorry, boat, generator or pump), shield with check (verified badge), play circle (training), clock (shift), moon (rest), triangle (alert), building (site), people (team), ribbon (certificate).

### 2.4 Imagery

Hero illustration: volunteers with a 4x4 and a water pump helping at a school as floodwater recedes. Show helpers and recovery, not destruction or victims. No photos of real children.

---

## 3. Information architecture

```
Accessibility bar: Larger text · High contrast · Read aloud · Bahasa / English
Header:  SchoolBridge · [Disaster mode | Preparedness mode] · [Simple Mode]
Nav:     Home · Missions · My profile · My hours · Coordinator · Teams
Status:  DISASTER BANNER (always visible while an alert is active)
```

```text
┌──────────────────────────────────────────────────────────────┐
│ ⚠ FLOOD ALERT · Selangor · Day 3                              │
│ 14 sites need help · 6 need equipment · 2 need electricians  │
└──────────────────────────────────────────────────────────────┘
```

| Route | Screen | Primary user |
| --- | --- | --- |
| `#home` | Welcome and role choice | Everyone |
| `#profile` | Skills and assets profile, badges, trust level | Volunteer |
| `#training` | Micro-training modules | Volunteer |
| `#missions` | Mission board | Volunteer |
| `#mission` | Mission detail and request | Volunteer |
| `#safety` | My shifts and safety check-in | Volunteer |
| `#hours` | Hours, rest status, certificates, recognition | Volunteer |
| `#post` | Post a need (school damage report in the example) | Site requester |
| `#site` | Site overview (school recovery tracker in the example) | Site requester, coordinator |
| `#coordinator` | Coordinator dashboard | Coordinator |
| `#team` | Corporate team page | Company |

---

## 4. Screens

### 4.1 Welcome and role choice
- Disaster banner on top. Headline: "Help where your skills and equipment matter most."
- Role cards: **I want to volunteer** · **I need help for a site** · **I'm a coordinator** · **I'm bringing a company team**.
- "Needed right now" strip: counts of missions needing a 4x4, boat, generator, electrician, medic. Hidden in Simple Mode.

### 4.2 Volunteer profile: skills and assets (Core)

```text
Your helping hand starts here.

Your name (optional)   [ Aina                     ]
Your area              [ Hulu Langat            ▼ ]
Available              [ Weekends               ▼ ]

What can you do?
[✓] Cleanup     [✓] Driving      [ ] Cooking
[ ] Teaching    [ ] First aid    [ ] Counseling
Professional (needs checking):
[ ] Medic       [ ] Electrician  [ ] Engineer

What can you bring?  (optional)
[✓] 4x4         [ ] Boat         [ ] Lorry
[ ] Generator   [ ] Water pump   [ ] Chainsaw

[ Save profile and find missions → ]
```

- Assets have optional details (boat: seats; 4x4: can carry supplies). Asset owners confirm they will drive/operate it themselves.
- Ticking a professional skill shows "Not yet checked. Upload your certificate to get a verified badge."

### 4.3 Verification badges (Differentiator)
- Badge row on the profile: **Medic**, **Electrician**, **Engineer**, each in one of three states: *Not claimed* · *Pending check* (amber, "Usually 1 to 2 days") · *Verified* (green shield, issuer and date).
- Trust level panel beside it: Open · Verified ID (MyKad) · Child-safe (background check, 3 to 5 days).
- In the demo, a coordinator can approve a pending badge; every simulated check is labelled "(demo)".

### 4.4 Micro-training (Differentiator)

```text
Before you go: 2-minute training

▶ Safe flood cleanup            2:00   ✓ Done (valid to Nov 2027)
▶ Psychological first aid       2:10   Required for: Relief center support
▶ Working near electricity      1:50   Required for: Lab cleanup
▶ Working safely around pupils  1:40   Required for: School tasks with pupils present

[ Start "Psychological first aid" ]
```

- Each module: short video (captions on, transcript below, Read aloud supported), then 3 quick questions. Pass = done for 12 months.
- Low-bandwidth option: illustrated cards instead of video.
- Missions list required modules; the mission card shows "Training needed: 1 module, 2 min" with a direct start button.

### 4.5 Mission board (Core)
- Title: "Missions that fit you." Subtitle: "Ranked by unmet need and your skills and equipment."
- Filters: All · Matches my skills · Matches my equipment · Hands-on · Driving and delivery · Professional · Near me.
- **Mission card**:

```text
┌──────────────────────────────────────────────────────────────┐
│ ▌OVERLOOKED, PRIORITY            ✓ MATCHES YOUR 4x4           │
│ ▌Deliver cleaning supplies to the school                     │
│ ▌SK Kampung Batu Lima · Hulu Langat · Sat 8am, 3 hours       │
│ ▌Needs: Driving · 4x4      Trust: Verified ID    Risk: Medium │
│ ▌1 of 3 places left  ████████░░                              │
│ ▌Training: Safe flood cleanup ✓                               │
│ ▌                                      [ View mission → ]     │
└──────────────────────────────────────────────────────────────┘
```

- Card states, with the fix shown as the action:
  - **Can join** → "View mission"
  - **Training needed** → "Start 2-min training"
  - **Badge needed** → "Needs verified Electrician" (link to profile)
  - **Trust level needed** → "Unlock: Verified ID"
  - **Rest needed** → "You've worked 8 hours today. Available again tomorrow 6am."
  - **Full** → dimmed with redirect: "This one is full. SK Kampung Batu Lima still needs 21 more for mud cleanup. **Help here instead**."
- Locked missions are never hidden.

### 4.6 Mission detail
- Site, what to do, meeting point, shift start and end, what to bring, required skills/assets/badge/training, risk explanation, site safety rules.
- Assets: "You'll bring: 4x4 (you drive it)."
- Action: **Request to join**. After: "Waiting for coordinator approval." The shift shows on My shifts.

### 4.7 Safety check-in and check-out (Core)

```
Requested ─approve─▶ Approved ─Check in─▶ On site (back by 11:00) ─Check out─▶ Checked out
                                             │
                                             ├─ not checked out 30 min after due ─▶ OVERDUE → coordinator alert
                                             └─ I need help ─────────────────────▶ HELP → coordinator alert
```

- **Check in, I am with the site coordinator** / **Check out, I have left safely**, each with a confirmation dialog.
- Expected check-out time shown large. An "Extend shift" option asks for a reason and respects hour caps.
- **I need help** always visible on site, red, with confirmation naming who is told.
- Rest prompt after 4 hours on site: "Take a 15-minute break and drink water." (Dismiss / I'm on break)
- Demo: "Simulate overdue" control; label "This demo does not track location or send real alerts."

### 4.8 Hours, rest and recognition (Differentiator + Growth)

```text
Your impact

Verified hours: 23      Missions: 6      Sites helped: 4

This week   ██████████████░░░░░░  28 of 40 hours
Today       ██████████████████░░  7 of 8 hours   Rest soon

Badges earned
[ First mission ] [ 4x4 hero: 5 deliveries ] [ Trained: 3 modules ]

Certificates
Flood Recovery Volunteer, Selangor 2026 · 23 hours   [ Download PDF ]
```

- Rest status uses caution color near a cap and alert color at a cap; text always explains it.
- Hours are counted only from check-in to check-out and marked "Confirmed by coordinator" once approved.
- Recognition badges are for effort and safety (completed shifts, training, rest kept), never ranking or leaderboards.

### 4.9 Corporate team page (Growth)
- Company name, team members (invite by link), upcoming team missions, team verified hours, sites helped.
- **Impact report** (PDF/CSV): hours by person, missions, sites, training completed, zero-incident confirmation. Labelled "Sample data" in the demo.
- A company can book a team onto a mission that needs several people; each member still has their own profile, training and check-in.

### 4.10 Post a need (site requester)
- General form: site, what's needed, number of people, required skills, required assets, professional badge, training, trust level, risk, shift time and length.
- **Example scenario variant: school damage report.** Five steps: school and disaster → damage by room (None / Light / Moderate / Severe) → needs → optional photos ("only from a safe place") → review. Damage maps to missions with skills and assets filled in, e.g.:

| Damage | Suggested mission | Skills / assets | Badge / training |
| --- | --- | --- | --- |
| Classrooms Severe | Mud cleanup, 15 people | Cleanup | Safe flood cleanup |
| Computer lab Severe | Check wiring | Electrician | Verified Electrician |
| Block A structure | Structural check | Engineer | Verified Engineer |
| Field Moderate | Remove debris | Driving · Lorry | — |
| Power out | Run generator for 2 days | Generator | Working near electricity |
| Classrooms Severe | Desks and chairs | Supplies | — |

- Suggestions are labelled "Demo AI suggestion, waiting for coordinator review" and can be edited.

### 4.11 Site overview (example: school recovery tracker)
- Site name, area, pupils, tags (Overlooked, Evacuation center), missions with fill meters.
- Reopening tracker for schools: evacuees relocated → damage assessed → cleanup done → inspection passed (verified Engineer/Electrician) → supplies in → reopened. Shows how dispatch moves the school forward.
- Child-safe rules box on school sites.

### 4.12 Coordinator dashboard (Core)
- KPI row: volunteers on site · missions filled % · overdue / help alerts (red when > 0) · volunteers near hour cap.
- **Safety alerts** at the top: overdue and help requests, each with Call, Mark resolved.
- **Requests to approve**: volunteer, mission, match summary ("4x4 ✓ · training ✓ · 6h today"), Approve / Decline.
- **Badges to verify**: claimed credential, uploaded file name, Approve badge (demo).
- **Fatigue**: volunteers at or near caps, with "Ask to rest" and "Raise cap (reason)".
- **Gaps**: missions with no matching volunteer, by missing skill or asset ("2 missions need a boat; 0 boat owners available").
- **Sites, least helped first** and the viral-post **fairness simulation** (with vs. without SchoolBridge).

### 4.13 Preparedness mode
- Banner turns blue: "No active alert. Get trained and stay ready."
- Board shows training first, then small tasks (clear drains, check generators, move school library books upstairs, flood drill). Corporate teams can book preparedness days.

---

## 5. Components

| Component | Description |
| --- | --- |
| Disaster banner | Full-width strip, red (disaster) or blue (preparedness), icon + text |
| Skill chip / Asset chip | Toggle chip with icon and text; `aria-pressed` |
| Match pill | Green "Matches your 4x4" / "Matches your skills" |
| Requirement row | Needs: skills · assets; Trust; Risk; Training; Badge |
| Badge pill | Not claimed · Pending check · Verified (shield) |
| Training card | Title, length, status (Not started · Done until date · Required for…), Start |
| Mission card | Pills, title, site, time, requirements, places meter, one action that reflects its state |
| Redirect strip | "This one is full… Help here instead" |
| Safety card | Shift, status, expected check-out, Check in / Check out / I need help |
| Rest meter | Hours today and this week vs. cap, with text |
| Recognition badge | Ribbon icon, name, how it was earned |
| Certificate card | Event, hours, Download |
| KPI tile | Big number + label; alert variant |
| Confirmation dialog | Native `<dialog>`, focus trapped, Cancel + one primary action |
| Toast | `role="status"`, states exactly what changed |

---

## 6. Accessibility and inclusion

| Control | Behavior |
| --- | --- |
| Larger text | Increase text size; nothing hidden |
| High contrast | Dark surfaces, light text, statuses as bordered labels |
| Simple Mode | Hide illustration, stats and recognition extras; keep banner, mission and safety actions |
| Read aloud | Browser speech synthesis with Stop; also reads training transcripts |
| Language | Bahasa Melayu and English |
| Video | Captions on by default, transcript below, illustrated-card alternative for low bandwidth |
| Focus | 3 px visible outline |
| Errors | Specific text next to the field; never clear answers |
| Confirmations | Before requests, check-in/out, help, pledges and cap overrides |

- WCAG 2.2 AA contrast targets, keyboard operation, reflow at 200% zoom, 44 × 44 px minimum targets.
- No countdowns, no hover-only actions, animation only under `prefers-reduced-motion: no-preference`.

---

## 7. Content and voice

- Plain and specific: "Matches your 4x4", "Start 2-min training", "Check out, I have left safely", "Rest first".
- Explain blocks kindly: "You've done a lot today. Rest and come back tomorrow." Never "Denied".
- Name the disaster plainly; don't dramatize it.
- Label every simulation: "(demo)", "Demo AI suggestion", "Sample data".
- Local, fictional names: Aina, Faiz, SK Kampung Batu Lima, Dewan Kampung, Klinik Desa, Acme Bhd.

---

## 8. Responsive layout

- **Wide (≥ 1024 px):** mission board with profile summary and My shifts in a 340 px sidebar; coordinator in main column + alerts sidebar.
- **Medium (700 to 1023 px):** sidebar moves below; nav wraps.
- **Small (< 700 px):** single column; Check in / Check out / I need help as full-width sticky buttons on the safety screen; KPI tiles 2 × 2.

---

## 9. Data model (prototype)

```js
event     = { type: 'flood'|'landslide'|'storm', area, day, mode: 'disaster'|'prepare' }
site      = { id, name, type: 'school'|'home'|'shelter'|'clinic', area, overlooked, verifiedBy }
mission   = { id, site, title, qty, filled, skills: [], assets: [], badge: null|'medic'|'electrician'|'engineer',
              training: [], trust: 0|1|2, risk: 'low'|'medium'|'high', start, hours, phase: 'disaster'|'prepare',
              source: 'seed'|'report' }
volunteer = { id, name, area, availability, skills: [], assets: [], trust, childPending,
              badges: { [badge]: 'pending'|'verified' }, training: { [module]: doneDate }, team }
shift     = { id, mission, volunteer, status: 'requested'|'approved'|'onsite'|'overdue'|'done'|'cancelled',
              checkIn, checkOut, due, confirmed }
alert     = { id, shift, kind: 'overdue'|'help', resolved }
module    = { id, title, minutes, questions: [] }
team      = { id, company, members: [] }
// School scenario only
schoolRecovery[siteId] = { rooms: { [room]: { severity, photos, aiTagged } }, evacuees, inspection, reopened }
```

- Hours per day and week are derived from `shift.checkIn`/`checkOut`; caps from PRODUCT.md §5.2.
- If a site removes a mission, joined shifts become "Cancelled by site" instead of disappearing.
- Alerts link to one shift, so resolving one never clears another, and repeated taps never duplicate.
- A **Reset demo** control restores sample data; state may persist in `localStorage`.

---

## 10. Prototype boundaries

- No backend, real sign-in, real ID or credential checks, real video hosting, location tracking, messaging or live dispatch. Roles are navigation choices, not security.
- All people, sites, companies and numbers are sample data. Do not enter real child records, contact details, health information or certificates.
- Production needs role-based access, audited hour records, reliable escalation for overdue and help alerts, credential partners, and agreed safeguarding and inspection responsibilities.
