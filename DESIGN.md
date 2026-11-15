# ReadyHands: Design and Interaction Specification

> **The right volunteer, with the right skills and equipment, sent safely to where help is needed.**

How ReadyHands looks, is structured and behaves. ReadyHands is a **disaster volunteer dispatch platform** built on skill-based matching. The demo runs on an **example scenario: schools damaged by a flood**.

- [PRODUCT.md](PRODUCT.md): the idea, roles, matching and burnout rules, features, demo script.
- [VISUAL-DESIGN.md](VISUAL-DESIGN.md): base layout sketches, colors, type and accessibility states. This file adds the dispatch screens and status colors on top of it, and wins where they differ.
- `pulih-prototype.html`: earlier working prototype. Its fair ranking, check-in and school walkthrough are reference behavior to rebuild in this design.

---

## 1. Design principles

1. **Volunteer first.** The main journey is a volunteer going from "I want to help" to "I got home safely and got recognized". Everything else supports it.
2. **Show why, and the fix.** When a volunteer can't join a post, the card says why and offers the next step (take training, get a badge, rest).
3. **Safety is never hidden.** Required training, badges, risk and check-in status sit on the card.
4. **Disaster context, calm delivery.** The tone is a reassuring person explaining the next step. No countdowns, no frightening imagery.
5. **Fairness is visible.** Overlooked sites are marked and ranked higher. Full posts point somewhere else.
6. **Status is never color alone.** Every pill and state has text and, where useful, an icon.

---

## 2. Visual direction

Base palette, type and spacing come from VISUAL-DESIGN.md (warm ivory, forest green, soft sage, 18 px body, 52 px buttons). ReadyHands adds **status colors** and **dispatch badges**.

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
| `--alert` | `#A8321F` / `#FBE4DF` | Overdue, "I need help", over hour cap, severe damage |
| `--caution` | `#8A5A00` / `#FFF0CC` | Overlooked/priority, training required, near hour cap, waiting for approval |
| `--ok` | `#2C7A4B` / `#E0F2E6` | Checked out safely, training done, badge verified, approved |
| `--info` | `#1F5F8B` / `#E1EEF7` | Preparedness mode, information |

Each pair must reach WCAG 2.2 AA (4.5:1) for text on its soft background; verify before release.

### 2.3 Icons (always with text)

Wrench (skill), truck / boat / plug (asset: 4x4 or lorry, boat, generator or pump), shield with check (verified badge), play circle (training), clock (shift), moon (rest), triangle (alert), building (site), megaphone (post), ribbon (certificate).

### 2.4 Imagery

Hero illustration: volunteers with a 4x4 and a water pump helping at a school as floodwater recedes. Show helpers and recovery, not destruction or victims. No photos of real children.

---

## 3. Roles and information architecture

### 3.1 Roles

| Role | How you get it | What you see |
| --- | --- | --- |
| **Volunteer** | Everyone, on sign-up | Post board, profile, training, my shifts, my recognition |
| **Poster** | A volunteer applies; an admin / coordinator approves | Everything a volunteer sees, plus Create a post, My posts, join requests |
| **Admin / coordinator** | Set up by the organization | Coordinator dashboard: poster applications, posts to approve, badges, safety, fatigue |

One account can be both a volunteer and a poster. Roles are navigation in the prototype, not security.

### 3.2 Navigation

```
Accessibility bar: Larger text · High contrast · Read aloud · Bahasa / English
Header:  ReadyHands · [Simple Mode]
Nav:     Home · Posts · My profile · My shifts · My posts (posters) · Coordinator (admins)
```

| Route | Screen | Role |
| --- | --- | --- |
| `#home` | Welcome | Everyone |
| `#profile` | Skills and assets profile, badges | Volunteer |
| `#training` | Micro-training modules | Volunteer |
| `#posts` | Post board | Volunteer |
| `#post` | Post detail and request to join | Volunteer |
| `#shifts` | My shifts and safety check-in | Volunteer |
| `#recognition` | Rest status, certificates, badges | Volunteer |
| `#become-poster` | Apply to become a poster | Volunteer |
| `#create` | Create a post (school damage report in the example) | Poster |
| `#my-posts` | My posts and join requests | Poster |
| `#site` | Site overview (school recovery tracker in the example) | Poster, admin |
| `#coordinator` | Coordinator dashboard | Admin |

---

## 4. Screens

### 4.1 Welcome
- Headline: "Help where your skills and equipment matter most."
- Two choices: **I want to volunteer** · **I need help for a site** (leads to Apply to become a poster, or to Create a post if already approved). A small link: "I'm a coordinator".
- "Needed right now" strip: counts of live posts needing a 4x4, boat, generator, electrician, medic. Hidden in Simple Mode.

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

[ Save profile and find posts → ]
```

- Assets have optional details (boat: seats; 4x4: can carry supplies). Asset owners confirm they will drive/operate it themselves.
- Ticking a professional skill shows "Not yet checked. Upload your certificate to get a verified badge."

### 4.3 Verification badges (Differentiator)
- Badge row on the profile: **Medic**, **Electrician**, **Engineer**, **Child-safe** (background check, for tasks with children present).
- Each badge has three states: *Not claimed* · *Pending check* (caution, "Usually 1 to 5 days") · *Verified* (green shield, checked by, date).
- In the demo, an admin approves a pending badge; every simulated check is labelled "(demo)".

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
- Posts list required modules; the post card shows "Training needed: 1 module, 2 min" with a direct start button.

### 4.5 Post board (Core)
- Title: "Posts that fit you." Subtitle: "Ranked by unmet need and your skills and equipment."
- Shows only **live** posts (approved by an admin).
- Filters: All · Matches my skills · Matches my equipment · Hands-on · Driving and delivery · Professional · Near me.
- **Post card**:

```text
┌──────────────────────────────────────────────────────────────┐
│ ▌OVERLOOKED, PRIORITY            ✓ MATCHES YOUR 4x4           │
│ ▌Deliver cleaning supplies to the school                     │
│ ▌SK Kampung Batu Lima · Hulu Langat · Sat 8am, 3 hours       │
│ ▌Needs: Driving · 4x4                         Risk: Medium   │
│ ▌1 of 3 places left  ████████░░                              │
│ ▌Training: Safe flood cleanup ✓                               │
│ ▌                                         [ View post → ]     │
└──────────────────────────────────────────────────────────────┘
```

- Card states, with the fix shown as the action:
  - **Can join** → "View post"
  - **Training needed** → "Start 2-min training"
  - **Badge needed** → "Needs verified Electrician" (link to profile)
  - **Rest needed** → "You've worked 8 hours today. Available again tomorrow 6am."
  - **Full** → dimmed with redirect: "This one is full. SK Kampung Batu Lima still needs 21 more for mud cleanup. **Help here instead**."
- Blocked posts are never hidden.

### 4.6 Post detail and request to join
- Site, poster, what to do, meeting point, shift start and end, what to bring, required skills/assets/badge/training, risk explanation, site safety rules.
- Assets: "You'll bring: 4x4 (you drive it)."
- Action: **Request to join**. After: "Request sent to the poster." The shift shows on My shifts as *Requested*.

### 4.7 Safety check-in and check-out (Core)

```
Requested ─poster accepts─▶ Accepted ─Check in─▶ On site (back by 11:00) ─Check out─▶ Checked out
                                                   │
                                                   ├─ not checked out 30 min after due ─▶ OVERDUE → admin + poster alerted
                                                   └─ I need help ─────────────────────▶ HELP → admin + poster alerted
```

- **Check in, I am with the poster** / **Check out, I have left safely**, each with a confirmation dialog.
- Expected check-out time shown large. "Extend shift" asks for a reason and respects hour caps.
- **I need help** always visible on site, red, with confirmation naming who is told.
- Rest prompt after 4 hours on site: "Take a 15-minute break and drink water." (Dismiss / I'm on break)
- Demo: "Simulate overdue" control; label "This demo does not track location or send real alerts."

### 4.8 Rest and recognition (Differentiator + Growth)

```text
Your impact

Shifts done: 6      Sites helped: 4

This week   ██████████████░░░░░░  28 of 40 hours
Today       ██████████████████░░  7 of 8 hours   Rest soon

Badges earned
[ First shift ] [ 4x4 hero: 5 deliveries ] [ Trained: 3 modules ]

Certificates
Flood Recovery Volunteer, Selangor 2026 · 6 shifts   [ Download PDF ]
```

- Hours today and this week are counted from check-in to check-out and used only for rest limits.
- Rest status uses caution color near a cap and alert color at a cap; text always explains it.
- Recognition badges are for effort and safety (completed shifts, training, rest kept), never ranking or leaderboards.

### 4.9 Apply to become a poster

```text
Need help for a site?

To post, a coordinator first checks who you are
and which site you represent.

Site name        [ SK Kampung Batu Lima          ]
Site type        [ School                      ▼ ]
Area             [ Hulu Langat                 ▼ ]
Your role there  [ Principal                     ]
Proof (optional) [ Choose file ]  e.g. staff letter

[ Send for approval → ]
```

- After sending: "Waiting for coordinator approval. You can keep volunteering meanwhile."
- When approved: the account gains **Create a post** and **My posts**, and keeps its volunteer side.
- If declined: the reason is shown with what to fix.

### 4.10 Create a post (Poster)
- General form: site, what's needed, number of people, required skills, required assets, professional badge, training, risk, shift time and length.
- On submit: "Sent to the coordinator. It goes live once approved." Status: *Waiting for approval* → *Live* → *Full* / *Closed*.
- **Example scenario variant: school damage report.** Five steps: school and disaster → damage by room (None / Light / Moderate / Severe) → needs → optional photos ("only from a safe place") → review. Damage maps to posts with skills and assets filled in:

| Damage | Suggested post | Skills / assets | Badge / training |
| --- | --- | --- | --- |
| Classrooms Severe | Mud cleanup, 15 people | Cleanup | Safe flood cleanup |
| Computer lab Severe | Check wiring | Electrician | Verified Electrician |
| Block A structure | Structural check | Engineer | Verified Engineer |
| Field Moderate | Remove debris | Driving · Lorry | — |
| Power out | Run generator for 2 days | Generator | Working near electricity |
| Reading corner with pupils | Read with pupils | Teaching | Child-safe |

- Suggestions are labelled "Demo AI suggestion" and can be edited before sending for approval.

### 4.11 My posts (Poster)
- Each post: status pill, places filled meter, and **Join requests** with each volunteer's match summary ("4x4 ✓ · training ✓ · 6h today").
- Actions per request: **Accept** / **Decline** (with optional reason). Accepting moves the volunteer's shift to *Accepted*.
- On-site list during a shift: who has checked in, who is due out, alerts.

### 4.12 Site overview (example: school recovery tracker)
- Site name, area, pupils, tags (Overlooked, Evacuation center), posts with fill meters.
- Reopening tracker for schools: evacuees relocated → damage assessed → cleanup done → inspection passed (verified Engineer/Electrician) → supplies in → reopened. Shows how dispatch moves the school forward.
- Child-safe rules box on school sites.

### 4.13 Coordinator dashboard (Admin)
- KPI row: volunteers on site · posts filled % · overdue / help alerts (red when > 0) · volunteers near hour cap.
- **Safety alerts** at the top: overdue and help requests, each with Call, Mark resolved.
- **Poster applications**: applicant, site, role, proof file name → Approve / Decline (with reason).
- **Posts to approve**: post summary, site, poster → Approve (goes live) / Send back (with reason).
- **Badges to verify**: claimed badge, uploaded file name → Approve badge (demo).
- **Fatigue**: volunteers at or near caps, with "Ask to rest" and "Raise cap (reason)".
- **Gaps**: live posts with no matching volunteer, by missing skill or asset ("2 posts need a boat; 0 boat owners available").
- **Sites, least helped first** and the viral-post **fairness simulation** (with vs. without ReadyHands).

### 4.14 Preparedness mode
- Toggle on the coordinator dashboard. A blue info strip on the post board: "No active disaster. Get trained and stay ready."
- Board shows training first, then small posts (clear drains, check generators, move school library books upstairs, flood drill).

---

## 5. Components

| Component | Description |
| --- | --- |
| Skill chip / Asset chip | Toggle chip with icon and text; `aria-pressed` |
| Match pill | Green "Matches your 4x4" / "Matches your skills" |
| Requirement row | Needs: skills · assets; Risk; Training; Badge |
| Badge pill | Not claimed · Pending check · Verified (shield) |
| Approval pill | Waiting for approval · Approved · Sent back · Declined |
| Training card | Title, length, status (Not started · Done until date · Required for…), Start |
| Post card | Pills, title, site, time, requirements, places meter, one action that reflects its state |
| Redirect strip | "This one is full… Help here instead" |
| Join request row | Volunteer, match summary, Accept / Decline |
| Safety card | Shift, status, expected check-out, Check in / Check out / I need help |
| Rest meter | Hours today and this week vs. cap, with text |
| Recognition badge | Ribbon icon, name, how it was earned |
| Certificate card | Event, shifts, Download |
| KPI tile | Big number + label; alert variant |
| Confirmation dialog | Native `<dialog>`, focus trapped, Cancel + one primary action |
| Toast | `role="status"`, states exactly what changed |

---

## 6. Accessibility and inclusion

| Control | Behavior |
| --- | --- |
| Larger text | Increase text size; nothing hidden |
| High contrast | Dark surfaces, light text, statuses as bordered labels |
| Simple Mode | Hide illustration, stats and recognition extras; keep post and safety actions |
| Read aloud | Browser speech synthesis with Stop; also reads training transcripts |
| Language | Bahasa Melayu and English |
| Video | Captions on by default, transcript below, illustrated-card alternative for low bandwidth |
| Focus | 3 px visible outline |
| Errors | Specific text next to the field; never clear answers |
| Confirmations | Before requests, accept/decline, approvals, check-in/out, help and cap overrides |

- WCAG 2.2 AA contrast targets, keyboard operation, reflow at 200% zoom, 44 × 44 px minimum targets.
- No countdowns, no hover-only actions, animation only under `prefers-reduced-motion: no-preference`.

---

## 7. Content and voice

- Plain and specific: "Matches your 4x4", "Start 2-min training", "Request to join", "Check out, I have left safely", "Rest first".
- Explain blocks kindly: "You've done a lot today. Rest and come back tomorrow." Never "Denied".
- Approvals say what happens next: "Sent to the coordinator. It goes live once approved."
- Label every simulation: "(demo)", "Demo AI suggestion", "Sample data".
- Local, fictional names: Aina, Faiz, SK Kampung Batu Lima, Dewan Kampung, Klinik Desa.

---

## 8. Responsive layout

- **Wide (≥ 1024 px):** post board with profile summary and My shifts in a 340 px sidebar; coordinator in main column + alerts sidebar.
- **Medium (700 to 1023 px):** sidebar moves below; nav wraps.
- **Small (< 700 px):** single column; Check in / Check out / I need help as full-width sticky buttons on the safety screen; KPI tiles 2 × 2.

---

## 9. Data model (prototype)

```js
user      = { id, name, area, availability, roles: { volunteer: true, poster: 'none'|'pending'|'approved', admin },
              skills: [], assets: [], badges: { [badge]: 'pending'|'verified' }, training: { [module]: doneDate } }
posterApp = { id, user, site, role, proofFile, status: 'pending'|'approved'|'declined', reason }
site      = { id, name, type: 'school'|'home'|'shelter'|'clinic', area, overlooked, poster }
post      = { id, site, poster, title, qty, filled, skills: [], assets: [],
              badge: null|'medic'|'electrician'|'engineer'|'childSafe', training: [], risk: 'low'|'medium'|'high',
              start, hours, mode: 'disaster'|'prepare', source: 'form'|'report',
              status: 'pending'|'live'|'sentBack'|'full'|'closed' }
shift     = { id, post, volunteer, status: 'requested'|'accepted'|'declined'|'onsite'|'overdue'|'done'|'cancelled',
              checkIn, checkOut, due }
alert     = { id, shift, kind: 'overdue'|'help', resolved }
module    = { id, title, minutes, questions: [] }
// School scenario only
schoolRecovery[siteId] = { rooms: { [room]: { severity, photos, aiTagged } }, evacuees, inspection, reopened }
```

- Hours per day and week come from `shift.checkIn` / `checkOut`; caps from PRODUCT.md §5.2.
- If a poster closes a post, joined shifts become "Cancelled by poster" instead of disappearing.
- Alerts link to one shift, so resolving one never clears another, and repeated taps never duplicate.
- A **Reset demo** control restores sample data; state may persist in `localStorage`.

---

## 10. Prototype boundaries

- No backend, real sign-in, real ID or credential checks, real video hosting, location tracking, messaging or live dispatch. Roles are navigation choices, not security.
- All people, sites and numbers are sample data. Do not enter real child records, contact details, health information or certificates.
- Production needs role-based access, audited approvals, reliable escalation for overdue and help alerts, credential partners, and agreed safeguarding and inspection responsibilities.

---

## 11. Future

- **Teams and corporate volunteering:** a company team page (members, upcoming team posts, sites helped) and impact reports for ESG / CSR. Each member keeps their own profile, training and check-in.
