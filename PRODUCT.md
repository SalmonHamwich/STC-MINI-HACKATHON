# SchoolBridge: Product

> **The right volunteer, with the right skills and equipment, sent safely to where help is needed.**

SchoolBridge is a **disaster volunteer dispatch platform**. Its base idea is **skill-based volunteer matching**: volunteers register what they can do *and* what they can bring (a 4x4, a boat, a generator), and SchoolBridge dispatches them to verified needs after a natural disaster, keeps them safe while they work, and recognizes the hours they give.

**Example scenario: school recovery after a flood.** To show the platform end to end, the prototype follows schools damaged by a flood. A school is one kind of site that requests help; the dispatch engine is the same for homes, relief centers and clinics. See §6.

See [DESIGN.md](DESIGN.md) for screens and behavior, and [VISUAL-DESIGN.md](VISUAL-DESIGN.md) for layout sketches and base visual tokens.

---

## 1. Problem

After every natural disaster, thousands of people want to help, but help is chaotic, unsafe and wasted.

- **Wrong people, wrong place.** Volunteers coordinate in WhatsApp, Telegram and Facebook groups. A site that needs an electrician gets twenty people with buckets; a flooded village that needs a boat gets nobody.
- **Equipment is invisible.** The person with a 4x4, a boat or a generator is just another name in a chat group.
- **Unverified helpers.** Nobody checks who is a real medic, electrician or engineer, or who is safe around children.
- **Unsafe deployments.** Volunteers walk into floodwater and damaged buildings without basic training, and nobody notices if they don't come back.
- **Burnout.** The most willing volunteers work until they collapse, then quit.
- **No recognition.** Hours go unrecorded, so volunteers get nothing for their CV and companies can't prove their community impact.

---

## 2. The idea: volunteer dispatch

Base idea: **skill-based volunteer matching**. Features are grouped by priority, following the original idea:

| Priority | Feature | What it does |
| --- | --- | --- |
| **Core (MVP)** | **Skill and asset profiles** | Volunteers list skills (cleanup, driving, first aid, teaching, electrician, engineer, medic) and assets (4x4, boat, lorry, generator, water pump). Missions are matched on both. |
| **Core (MVP)** | **Safety check-in and check-out** | Volunteers check in on arrival and out when they leave. If they are overdue, the coordinator is alerted. An "I need help" button is always visible on site. |
| **Differentiator** | **Micro-training** | Two-minute video modules ("Safe flood cleanup", "Psychological first aid", "Working around electricity") that must be completed before a mission that requires them. |
| **Differentiator** | **Verification badges** | Medics, electricians and engineers whose credentials have been checked get a badge. Professional missions require the badge. |
| **Differentiator** | **Burnout tracking** | Caps shift hours per day and week, enforces rest between shifts, and prompts volunteers to rest. |
| **Growth** | **Corporate volunteering programs** | Companies send teams and receive verified-hours reports. A B2B revenue path. |
| **Growth** | **Reputation and recognition** | Verified hours, certificates and badges volunteers can add to their CV. |

### 2.1 The dispatch loop

```
Site posts a need ─▶ Coordinator verifies ─▶ Matched to volunteers (skills + assets + badges + training + rest)
      ▲                                                     │
      │                                                     ▼
Hours, certificate,  ◀── Check out safely ◀── Check in ◀── Volunteer requests, coordinator approves,
reputation                (overdue → alert)                  required training done
```

---

## 3. Product principles

1. **Match on what people can do and bring.** Skills and assets, not just headcount.
2. **Safety before speed.** Training, badges and check-in sit in front of every risky mission, never behind a menu.
3. **Verified, not self-declared, for professional work.** A self-reported electrician is shown as "not yet checked" and can't take electrical missions.
4. **Protect volunteers from themselves.** Rest is part of the plan, not an afterthought.
5. **Fair by default.** Overlooked sites rank higher than viral ones; full missions redirect to open ones.
6. **Recognize every hour.** Verified hours turn into certificates for volunteers and impact reports for companies.
7. **Works under stress.** Plain words, large controls, low bandwidth, Bahasa Melayu and English, usable by people new to technology.

---

## 4. Users

| User | Job to be done | Primary screens |
| --- | --- | --- |
| Volunteer | Find missions that fit my skills and equipment, get trained, help safely, get home safely, get credit | Profile, Training, Mission board, Safety check-in, My hours |
| Professional volunteer (medic, electrician, engineer) | Get verified once, then be sent where my skills matter | Profile, Verification |
| Site requester (in the example: school principal) | Ask for exactly the people and equipment we need | Post a need (school damage report in the example) |
| Coordinator (NGO, agency, district) | Verify needs, approve volunteers, watch safety and fatigue, redirect help | Coordinator dashboard |
| Company (HR / CSR lead) | Send teams, track their verified hours, get an impact report | Corporate team page |

---

## 5. Core concepts

| Concept | Definition |
| --- | --- |
| **Disaster event** | A natural disaster alert (flood, landslide, storm) that switches the platform to Disaster mode. |
| **Site** | A verified place that needs help. Types: school, home, relief center, clinic. Has an `overlooked` flag. |
| **Need / Mission** | A verified request: number of people, required skills, required assets, required badge, required training, trust level, risk, shift time and length. |
| **Volunteer profile** | Skills, assets, area, availability, badges, completed training, trust level, hours worked, rest status. |
| **Trust level** | 0 Open (supervised group tasks) · 1 Verified ID (assets, homes, deliveries) · 2 Child-safe (tasks with children present). |
| **Verification badge** | Checked credential: Medic, Electrician, Engineer. Separate from trust level. |
| **Training module** | A two-minute video plus a short check. Valid for 12 months. |
| **Shift** | A dated block of time on a mission with expected check-out time. |
| **Safety status** | Requested → Approved → On site → Checked out; or Overdue / Help requested. |
| **Rest status** | Hours today and this week vs. caps; time since last shift. |
| **Verified hours** | Hours between check-in and check-out, confirmed by the coordinator. |
| **Team** | A group of volunteers under a company or organization. |

### 5.1 Matching rule (prototype)

A volunteer can **join** a mission only if all hard rules pass:
- Has every required skill **or** asset listed as "must have"
- Has the required badge (professional missions)
- Has completed the required training
- Has the required trust level
- Is within rest limits after this shift (see 5.2)

Missions that fail a rule stay visible with the reason and the fix: "Complete 'Safe flood cleanup' (2 min)", "Needs a verified Electrician badge", "You've worked 8 hours today. Rest first."

Among missions a volunteer can join, the board ranks by:

```
priority = (unmet / qty) × (overlooked ? 1.6 : 1) × (risk == high ? 1.2 : 1) × (match ? 1.5 : 1)
```

`match` is true when the volunteer brings an asset or skill the mission lists as needed. Full missions drop to the bottom with "Help here instead".

### 5.2 Burnout rules (prototype defaults)

| Rule | Default |
| --- | --- |
| Max hours per day | 8 |
| Max hours per 7 days | 40 |
| Min rest between shifts | 10 hours |
| Rest prompt | After 4 hours on site: "Take a 15-minute break and drink water" |
| Max consecutive days | 5, then one rest day |

Coordinators see volunteers near their limits. Caps can be raised only by a coordinator, with a reason.

---

## 6. Example scenario: school recovery after a flood

The prototype's demo data follows a flood in Selangor that damages several schools. Schools were chosen because they are often used as evacuation centers, children lose learning time every day they stay closed, and recovery needs a mix of skills (cleanup, electricians, engineers, drivers) and assets (lorries, pumps, generators).

**Sample sites**
- **SK Kampung Batu Lima**, Hulu Langat (rural, overlooked): needs 25 cleanup volunteers, a lorry, a water pump, an electrician.
- **SK Taman Seri Bayu**, Shah Alam (urban, viral): cleanup is already full.
- **Dewan Kampung Sungai Lui** (relief center): kitchen helpers, a boat with operator.
- **Klinik Desa Batu 14** (clinic): disinfection crew, a generator.

**What the school adds on top of the engine**
- A guided **damage report** (room by room) that turns into needs: Severe classroom → cleanup crew + desks; computer lab → verified Electrician; field → lorry.
- **Child-safe rules**: tasks with pupils present need Child-safe trust; no one alone with a pupil; no photos of pupils.
- A **reopening tracker** (evacuees relocated → damage assessed → cleanup done → inspection passed → supplies in → reopened) that shows the effect of dispatch.

The scenario is replaceable. Another demo could use a landslide hitting a village, using the same screens.

---

## 7. Features and status

Status: **Designed** = specified in DESIGN.md · **Prototype** = working in the earlier `pulih-prototype.html`, to rebuild in this design · **To build** = not in any prototype yet · **Later** = after the hackathon.

### 7.1 Core (MVP)

| Feature | Status |
| --- | --- |
| Volunteer profile with skills and assets (4x4, boat, lorry, generator, water pump) | Designed |
| Mission board matched on skills and assets, ranked fairly, with "why can't I join" reasons | Designed + Prototype (ranking) |
| Request to join, coordinator approval | Designed |
| Safety check-in and check-out with expected check-out time | Designed + Prototype |
| Overdue alert and "I need help" on the coordinator dashboard | Prototype |
| Site posts a need (in the example: school damage report → needs) | Prototype |
| Disaster mode banner | Prototype |

### 7.2 Differentiators

| Feature | Status |
| --- | --- |
| Micro-training: two-minute modules required before matching missions | To build |
| Verification badges for medics, electricians, engineers | To build (simulated check) |
| Trust levels including Child-safe | Prototype |
| Burnout tracking: hour caps, rest between shifts, rest prompts | To build |
| Coordinator fatigue view: volunteers near their limit | To build |

### 7.3 Growth

| Feature | Status |
| --- | --- |
| Corporate team page: members, verified hours, impact report | To build |
| Verified hours log per volunteer | To build |
| Certificates and recognition badges (downloadable) | To build |
| Preparedness mode: small tasks between disasters to keep volunteers trained and active | Prototype |

### 7.4 Later

- WhatsApp / Telegram intake and "Share mission to WhatsApp"
- Offline and SMS fallback
- Real ID (MyKad), credential and background checks
- Real video hosting and training completion tracking
- Chinese and Tamil

---

## 8. MVP demo script (3 minutes)

1. **Disaster mode.** "Flood alert, Selangor." Schools and a relief center post needs.
2. **Profile.** Aina registers: skills Cleanup and Driving, asset **4x4**. Faiz registers as an **Electrician**, which shows "not yet checked".
3. **Matching.** Aina's board puts the overlooked rural school's "Deliver supplies by 4x4" at the top, marked "Matches your 4x4". The viral urban school's cleanup is full and redirects.
4. **Training.** Aina taps "Mud cleanup" and is asked to complete "Safe flood cleanup" (2 min). She completes it and requests to join.
5. **Badges.** Faiz can't take "Check computer lab wiring" until the coordinator verifies his Electrician badge (demo). Then it unlocks.
6. **Coordinator.** Approves both requests.
7. **Safety.** Aina checks in. Simulate overdue: the alert appears on the dashboard. She checks out safely.
8. **Burnout.** Try to join a third shift today: "You've worked 8 hours today. Rest first."
9. **Recognition.** Aina's hours and certificate. Switch to the company view: "Acme Bhd team: 6 volunteers, 42 verified hours", download the impact report.
10. **Result.** The school's reopening tracker moves forward because the right people and equipment arrived.

---

## 9. Success metrics

- Time from need posted to volunteer on site
- Share of missions filled by volunteers with the right skill or asset
- Share of help reaching overlooked sites
- Volunteer safety incidents and unresolved overdue alerts (target: zero)
- Volunteers exceeding hour caps (target: zero without coordinator override)
- Training completion before deployment
- Volunteers still active 30 days later; corporate teams returning

---

## 10. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Unqualified people doing electrical or structural work | Badge required; self-reported skills shown as unchecked |
| Volunteer injury | Required micro-training, risk-graded missions, check-in, overdue alerts |
| Volunteer burnout | Hour caps, rest between shifts, coordinator fatigue view |
| Predators accessing children (school scenario) | Child-safe trust level, two-person rule, no photos of pupils |
| Fake volunteers / looting | ID verification, on-site check-in with the coordinator |
| Fake sites or needs | Site verification and coordinator review |
| Inflated hours for certificates or corporate reports | Hours only from check-in/out, confirmed by the coordinator |
| Cold start | Preparedness mode and corporate programs keep volunteers active between disasters |

---

## 11. Business model

Volunteers and people affected by disasters never pay.
- **Corporate volunteering programs (main B2B path):** companies pay for team management, verified-hours reports and impact reports for ESG / CSR disclosure.
- Agency and district dashboard contracts.
- Training partners (e.g. Red Crescent) sponsoring or certifying modules.
- Grants and NGO partnerships.

---

## 12. Roadmap

1. **Hackathon:** dispatch engine with core and differentiator features, shown through the school flood scenario.
2. **Pilot:** one flood-prone district with one NGO, one company team and real training content.
3. **Credentials:** real ID and professional verification partners.
4. **Scale:** more site types and scenarios, WhatsApp intake, offline and SMS support.

---

## 13. Open questions

- Product name: "SchoolBridge" fits the example scenario but not a general dispatch platform. Keep it, or rename?
- Who verifies badges (professional bodies, NGO partner, manual review)?
- Which training modules are required for which missions?
- Default burnout caps: agree with an NGO partner.
- Pilot district and partner company.
- Competitors to check (Crisis Cleanup, Team Rubicon, GoodSAM, local Malaysian tools).
