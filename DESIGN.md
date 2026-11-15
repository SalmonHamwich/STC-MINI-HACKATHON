# SchoolBridge: Design and Interaction Specification

> **From flood to classroom, together.**

How SchoolBridge looks, is structured and behaves. It is a **disaster recovery and volunteer dispatch platform for schools**: schools report damage, coordinators verify it, volunteers and donors are dispatched fairly and safely, and every school is tracked until it reopens.

- [PRODUCT.md](PRODUCT.md): what the product does and why, the recovery cycle, features and demo script.
- [VISUAL-DESIGN.md](VISUAL-DESIGN.md): screen sketches, layout and base visual tokens. This file adds the disaster-recovery layer on top of it and wins where they differ.
- `pulih-prototype.html`: earlier working prototype. Its fairness, trust, safety and reopening logic is the reference behavior to rebuild in this design.

---

## 1. Design principles

1. **Disaster context, calm delivery.** It is always clear that a disaster is happening and which phase a school is in, but the tone is a reassuring person explaining the next step. No panic language, no countdowns, no images of victims or destruction aimed at children.
2. **Urgency at a glance.** Phase, severity and risk are shown by form (banner, pills, stage dots, meters) and always by text, never by color alone.
3. **Fairness is visible.** Overlooked schools are always marked and ranked higher. Full missions always point somewhere else.
4. **Safety is never hidden.** Trust levels, risk, professional-only work and check-in status sit on the card, not in menus.
5. **AI drafts, people decide.** Every AI output is labelled "Demo AI suggestion", editable, and waits for a coordinator.
6. **One clear action per step.** Large controls, plain words, predictable Home and Back.

---

## 2. Visual direction

Base palette, type and spacing come from VISUAL-DESIGN.md: warm ivory background, forest green actions, soft sage panels, 18 px body text, 52 px buttons. On top of it, SchoolBridge adds a **disaster status layer** so users always know the situation.

### 2.1 Base tokens (from VISUAL-DESIGN.md)

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#F8F9F4` | Page background |
| `--ink` | `#183E35` | Headings and main text |
| `--primary` | `#225B45` | Main next-step buttons, verified trust |
| `--muted` | `#53685E` | Supporting text |
| `--soft` | `#E9EFDF` | Progress panels, highlights |
| `--line` | `#DCE4D9` | Dividers, meter tracks |
| `--card` | `#FFFFFF` | Cards, inputs |
| `--attention` | `#FFF5D9` | Inspection and safety notices |

### 2.2 Disaster status tokens (new)

| Token | Value (text on soft) | Meaning | Where |
| --- | --- | --- | --- |
| `--alert` / `--alert-soft` | `#A8321F` / `#FBE4DF` | Active disaster, severe damage, overdue, "I need help" | Disaster banner, severe pill, safety alerts |
| `--recovery` / `--recovery-soft` | `#8A5A00` / `#FFF0CC` | Recovery in progress, overlooked/priority, professional required | Phase pill, overlooked pill, inspection notice |
| `--restored` / `--restored-soft` | `#2C7A4B` / `#E0F2E6` | Done, safe, reopened, Open trust level | Done stages, reopened badge |
| `--prepare` / `--prepare-soft` | `#1F5F8B` / `#E1EEF7` | Preparedness mode, flood water level / informational | Preparedness banner, info notes |

Color meaning stays fixed everywhere:
- **Red** = active danger: disaster on, severe, overdue, help requested.
- **Amber** = recovering and needs attention: overlooked school, inspection pending, professional required.
- **Green** = done and safe: stage complete, checked out, reopened.
- **Blue** = ready: Preparedness mode and information.

Each pair must meet WCAG 2.2 AA (4.5:1) for text on its soft background; verify before release. In High contrast mode, statuses become bordered labels on dark surfaces.

### 2.3 Imagery and icons

- Hero illustration: a school with a receding waterline, volunteers carrying desks out, sun breaking through. It shows **recovery**, not destruction.
- Icon set (always with a text label): water drop (flood), triangle (alert), shield (trust level), hard hat (professional required), check circle (done), map pin (location), clock (shift time), boat / lorry / pump (equipment).
- Never show real pupils, damaged homes or injured people. Example photos in the demo are illustrations or empty rooms.

### 2.4 Type, spacing, shape

As VISUAL-DESIGN.md: Manrope headings, DM Sans body (system fallback offline), 18 px body, 8 px spacing rhythm, 20 to 26 px panel padding, 10 to 17 px radius. Numbers that line up use tabular figures.

---

## 3. Information architecture

```
Accessibility bar: Larger text · High contrast · Read aloud · Bahasa / English
Header:  SchoolBridge · [Simple Mode]
Nav:     Home · Find a mission · Give supplies · Coordinator
Status:  DISASTER BANNER (always visible while an alert is active)
Main:    screen content, with Home and Back on task screens
```

**Disaster banner** (red in Disaster mode, blue in Preparedness mode), one line, never dismissible during an alert:

```text
┌──────────────────────────────────────────────────────────────┐
│ ⚠ FLOOD ALERT · Selangor · Day 3 of recovery                 │
│ 12 schools affected · 4 used as evacuation centers  [Details]│
└──────────────────────────────────────────────────────────────┘
```

| Route | Screen | Primary user |
| --- | --- | --- |
| `#home` | Welcome and role choice | Everyone |
| `#school` | School overview and reopening tracker | School staff, education dept |
| `#report` | Guided damage report (5 steps) | School staff |
| `#suggested` | Suggested missions after a report | School staff |
| `#profile` | Volunteer profile and verification | Volunteer |
| `#missions` | Mission board | Volunteer |
| `#mission` | Mission detail and request | Volunteer |
| `#safety` | My missions and safety check-in | Volunteer |
| `#supplies` | Give supplies | Donor |
| `#learning` | Learning-continuity planner | School staff |
| `#coordinator` | Coordinator dashboard | Coordinator |

Hash routes use plain names only.

---

## 4. Screens

Layouts for screens 1 to 10 follow the sketches in VISUAL-DESIGN.md; the changes below make each one part of the disaster recovery cycle.

### 4.1 Welcome and role choice
- Disaster banner on top. Headline: "Schools are recovering from the flood. Here's how you can help."
- Three role cards: **I'm from a school** (report damage and track recovery), **I want to volunteer** (share time, skills or equipment), **I'm a coordinator** (verify reports and dispatch help).
- Below: "Recovery so far" strip (schools affected, missions filled, schools reopened). Hidden in Simple Mode.

### 4.2 School overview
- School name, location, pupils, and a **phase pill**: Alert · Assessing · Recovering · Inspection · Reopened.
- Tags when true: "Evacuation center", "Overlooked, priority" (amber), "Exam-year pupils".
- **Reopening tracker**: the six stages from PRODUCT.md §5.2 as numbered dots; done = green check. Stages 2, 3 and 5 complete from data; 1 and 4 are coordinator toggles. "Reopen and notify parents" enables only when stages 1 to 5 are done.
- Two planning scores with their denominators, plus the line "Planning indicators only. They do not certify safety or approve reopening."
- Main action: **Report damage or needs**. Second path: **Keep learning going**.

### 4.3 Guided damage report (5 steps)
1. **School and disaster:** school, disaster type (flood, landslide, storm), "Is the school being used as an evacuation center?"
2. **Damage by room:** one row per area (classrooms by block, library, science lab, computer lab, toilets, canteen, field) with severity None / Light / Moderate / Severe (text + color).
3. **Needs:** large checkbox rows: classroom cleanup, furniture and supplies, electricity inspection, building inspection, water and sanitation, temporary learning space, "Not sure, please help". Rooms marked Moderate or Severe pre-tick matching needs.
4. **Photos (optional):** "Only take photos from a safe place. Do not enter damaged buildings." Adding a photo shows a "Demo AI suggestion: Severe" that the user can change.
5. **Review:** everything above, then **Submit report for review**.

Back keeps all answers. An empty needs step explains what to do without clearing the form.

### 4.4 Suggested missions
- Header: "Report sent to the coordinator." Missions are listed as **Demo AI suggestion · Waiting for coordinator review**.
- Electrical and structural missions carry the amber **Qualified professional required** pill with a hard-hat icon.
- Each suggestion shows quantity, required trust level and risk.
- A **damage report for the education department** is generated and can be copied.

### 4.5 Volunteer profile and verification
- Name (optional), area, availability, skills, equipment (4x4, boat, lorry, generator, water pump).
- **Trust level panel** with three boxes: Open (supervised group tasks), Verified ID (equipment, deliveries, inspections), Child-safe (tasks with pupils). Current level highlighted; next step offered: "Verify my ID (MyKad), 2 minutes" or "Request child-safe clearance, 3 to 5 days". Verification is simulated in the demo and labelled.
- Professional skills show "Self-reported, not yet checked".
- Main action: **Save profile and find missions**.

### 4.6 Mission board
- Title: "Where help is needed most". Subtitle: "Sorted by unmet need, not by popularity."
- Filters: All · Matches for me · Hands-on · Equipment · Deliveries · Professional.
- **Mission card**: title, school, area, time, requirements, places left with a meter, trust level pill, risk pill when high, "Overlooked, priority" pill and amber left stripe when the school is overlooked.
- Card action: **View mission**; locked missions show **Unlock: Verified ID** instead (never hidden); full missions are dimmed with a redirect strip: "This one is full. SK Kampung Batu Lima still needs 21 more for mud cleanup. **Help here instead**."

### 4.7 Mission detail
- What, where, meeting point, shift time, what to bring, safety rules for the site (child-safe rules on school sites), required trust level.
- Action: **Request to join**. Status after: "Waiting for coordinator approval".

### 4.8 Safety check-in
State flow:

```
Requested ─approve─▶ Approved ─Check in─▶ On site (back by 12:00) ─Check out─▶ Done
                                              │
                                              ├─ no check-out by due time ─▶ Overdue → coordinator alert
                                              └─ I need help ──────────────▶ Help alert → coordinator
```

- Big buttons: **Check in, I am with the coordinator** / **Check out, I have left safely**, each with a confirmation dialog.
- **I need help** is always visible while on site, in red, with a confirmation that names who will be told.
- Demo label: "This demo does not track location or send real alerts."

### 4.9 Give supplies
- Supply cards per school, ranked by unmet need like missions: item, school, pledged / needed meter, **Offer**.
- Offer dialog: quantity (1 to remaining), drop-off point, confirmation.
- Each pledge shows its stage: Offered → Accepted → Delivered → Received. Only "Received" counts toward reopening stage 5.
- "No money is collected."

### 4.10 Learning-continuity planner
- Options: nearby partner school, community hall or evacuation center classroom, printed take-home packs, online lessons (internet needed). Exam-year pupils are flagged first.
- Review dialog, save as **Draft**. Drafts never raise the Education Continuity Score; only confirmed arrangements do.

### 4.11 Coordinator dashboard
- KPI row: schools affected, missions filled %, volunteers on site, safety alerts (red when above 0).
- **Safety alerts** panel at the top when any exist: overdue check-outs and help requests, each with **Mark resolved**.
- **Schools, least helped first**: table with phase pill, overlooked tag, filled meter. Schools with no missions yet show "Not assessed" and sort to the top only if affected.
- **Reports to review**: approve → missions publish to the mission board; mark professional-only work.
- **Volunteer requests**: approve or decline; approval unlocks the volunteer's check-in.
- **Fairness simulation**: "A post about SK Taman Seri Bayu goes viral: 40 volunteers". Side-by-side bars: without SchoolBridge (all 40 to one full school) vs. with SchoolBridge (capped and spread to open needs). Runs once per demo; Reset restores it.

### 4.12 Preparedness mode
- Header switch: **Disaster mode / Preparedness mode**. Banner turns blue: "No active alert. Small one-hour tasks keep schools ready."
- Mission board shows preparedness tasks: clear school drains, move library books upstairs, back up school records, check the emergency kit, run a flood drill.
- Fairness simulation is disabled with an explanation.

---

## 5. Components

| Component | Description |
| --- | --- |
| Disaster banner | Full-width status strip, red (disaster) or blue (preparedness), icon + text |
| Phase pill | Alert · Assessing · Recovering · Inspection · Reopened |
| Severity pill | None · Light · Moderate · Severe; text always shown |
| Trust pill | Open (green) · Verified ID (forest) · Child-safe (amber) |
| Professional pill | Amber with hard-hat icon: "Qualified professional required" |
| Overlooked pill | Amber: "Overlooked, priority"; adds a 4 px left stripe to cards |
| AI label | Muted outline: "Demo AI suggestion, check and change if wrong" |
| Mission card | Title, school, meta row, meter, pills, one action, optional redirect strip |
| Redirect strip | Amber-soft: "This one is full. X still needs N… Help here instead" |
| Meter | 8 px progress bar with a text value beside it; green at 100% |
| Stage list | Numbered dots; done = green check; manual stages show Mark done / Undo |
| Safety card | Mission, status label, check-in / check-out / I need help |
| KPI tile | Big number + label; alert variant in red |
| Confirmation dialog | Native `<dialog>`, focus trapped, Cancel and one primary action |
| Toast | Bottom-center, `role="status"`, states exactly what changed |

---

## 6. Accessibility and inclusion

Carried over from the original SchoolBridge spec:

| Control | Behavior |
| --- | --- |
| Larger text | Increase text size; panels and controls grow, nothing is hidden |
| High contrast | Dark surfaces, light text, statuses as bordered labels |
| Simple Mode | Hide illustration, statistics and extras; keep banner and main action |
| Read aloud | Browser speech synthesis with a visible Stop control |
| Language | Bahasa Melayu and English; Chinese and Tamil later |
| Keyboard focus | 3 px visible outline on every control |
| Errors | Specific text next to the field; never clear answers |
| Confirmations | Before reports, pledges, plans and safety changes |

- Targets: WCAG 2.2 AA contrast, keyboard operation, logical reading order, reflow at 200% zoom.
- Minimum touch targets 44 × 44 px; main buttons 52 px high.
- Animation only under `prefers-reduced-motion: no-preference`. No countdowns or time limits.
- Works on a low-end phone on a weak connection: one HTML file, system font fallback, no required images.

---

## 7. Content and voice

- Plain, calm and specific: "What does your school need?", "Help here instead", "Check out, I have left safely".
- Name the disaster plainly ("Flood alert, Selangor") but don't dramatize it.
- Say "Sent for review" when something still needs approval; never imply AI or a score confirmed safety.
- Mark every simulated action: "(demo)", "Demo AI suggestion", "simulated".
- Use local, recognizable names (SK = Sekolah Kebangsaan, SJK(C), Kampung, Dewan). All example data is fictional.

---

## 8. Responsive layout

- **Wide (≥ 1024 px):** welcome in two columns with three role cards in a row; coordinator in a main column plus sidebar (alerts, requests).
- **Medium (700 to 1023 px):** nav wraps; dashboard panels stack.
- **Small (< 700 px):** single column, full-width actions, banner wraps to two lines, KPI tiles in a 2 × 2 grid.
- The order of tasks never changes between sizes. No hover-only actions.

---

## 9. Data model (prototype)

```js
event    = { id, type: 'flood'|'landslide'|'storm', area, day, mode: 'disaster'|'prepare' }
school   = { id, name, area, pupils, overlooked, evacuationCenter, examYear, verifiedBy,
             phase, stages: { evacuees, inspection, reopened } }
report   = { id, school, disaster, rooms: { [room]: { severity, photos, aiTagged } },
             needs: [], status: 'draft'|'submitted'|'approved' }
mission  = { id, school, title, kind: 'people'|'equipment'|'supply', qty, filled,
             trust: 0|1|2, risk: 'low'|'medium'|'high', professional, when, phase: 'disaster'|'prepare',
             source: 'seed'|'report' }
volunteer= { name, area, availability, skills: [], equipment: [], trust, childPending, score }
myMission= { id, mission, status: 'requested'|'approved'|'onsite'|'overdue'|'done', due }
pledge   = { id, mission, qty, status: 'offered'|'accepted'|'delivered'|'received' }
alert    = { id, myMission, kind: 'overdue'|'help', resolved }
plan     = { school, options: [], status: 'draft'|'confirmed' }
```

- State lives in memory and may persist to `localStorage`; a **Reset demo** control restores sample data.
- If a report update removes a mission someone has joined, the joined mission stays in "My missions" as "Cancelled by school" instead of disappearing.
- Alerts are linked to a specific `myMission`, so resolving one never clears another, and repeated taps never duplicate an alert.

---

## 10. Prototype boundaries

- No backend, real sign-in, real AI, credential checks, photo storage, messaging, location tracking or live dispatch. Roles are navigation choices, not security.
- All schools, missions and numbers are sample data. Do not enter real child records, contact details, health information or sensitive photos.
- Production needs role-based access (exact addresses visible only to assigned volunteers), audited changes, dated and timezone-aware shifts, reliable escalation for overdue and help alerts, secure uploads and agreed responsibilities with inspection, safeguarding and education partners.

---

## 11. Before a live pilot

- Usability sessions with school staff, older adults, people new to technology and supervised pupils.
- Audit keyboard, screen reader, zoom, mobile, contrast and error recovery.
- Validate score calculations against confirmed records, with evidence and dates.
- Agree who signs off safety inspections and reopening with JKR, the district education office and NGO partners.
