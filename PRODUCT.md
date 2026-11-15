# ReadyHands: Product

> **The right volunteer, with the right skills and equipment, sent safely to where help is needed.**

ReadyHands is a **disaster volunteer dispatch platform**. Its base idea is **skill-based volunteer matching**: volunteers register what they can do *and* what they can bring (a 4x4, a boat, a generator), and ReadyHands dispatches them to verified needs after a natural disaster, keeps them safe while they work, and recognizes the hours they give.

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
| **Growth** | **Reputation and recognition** | Certificates and badges volunteers can add to their CV. |
| **Future** | **Corporate volunteering programs** | Companies send teams of volunteers. A B2B revenue path. |

### 2.1 The dispatch loop

```
Poster creates a post ─▶ Admin approves the post ─▶ Matched to volunteers (skills + assets + badges + training + rest)
      ▲                                                         │
      │                                                         ▼
Certificate,      ◀── Check out safely ◀── Check in ◀── Volunteer requests to join,
recognition            (overdue → alert)                 poster accepts, required training done
```

---

## 3. Product principles

1. **Match on what people can do and bring.** Skills and assets, not just headcount.
2. **Safety before speed.** Training, badges and check-in sit in front of every risky mission, never behind a menu.
3. **Verified, not self-declared, for professional work.** A self-reported electrician is shown as "not yet checked" and can't take electrical missions.
4. **Protect volunteers from themselves.** Rest is part of the plan, not an afterthought.
5. **Fair by default.** Overlooked sites rank higher than viral ones; full missions redirect to open ones.
6. **Recognize every effort.** Completed shifts turn into certificates and badges for volunteers.
7. **Works under stress.** Plain words, large controls, low bandwidth, Bahasa Melayu and English, usable by people new to technology.

---

## 4. Users

Everyone starts as a volunteer. **A volunteer can become a poster, but only after an admin / coordinator approves them.**

| User | Job to be done | Primary screens |
| --- | --- | --- |
| **Admin / coordinator** (NGO, agency, district) | **Approve volunteers who apply to be posters**; **approve a post** before it goes live; watch safety alerts and fatigue; verify badges | Coordinator dashboard |
| **Volunteer** | Find posts that fit my skills and equipment, **request to join a post**, get trained, help safely, get home safely | Profile, Training, Post board, Safety check-in |
| **Poster** (an approved volunteer; in the example: school principal) | Create a post asking for the people and equipment a site needs; accept or decline volunteers who request to join | Create a post (school damage report in the example), My posts |

**Becoming a poster:** volunteer applies ("I need help for a site": name the site and their role there) → admin / coordinator approves → the account gets poster access and keeps its volunteer side.

**Volunteer ↔ poster:** the volunteer sends a request on an approved post; the poster accepts or declines it. Professional volunteers (medic, electrician, engineer) are volunteers with a verified badge.

*Future:* Company (HR / CSR lead) sending teams of volunteers.

---

## 5. Core concepts

| Concept | Definition |
| --- | --- |
| **Site** | A verified place that needs help. Types: school, home, relief center, clinic. Has an `overlooked` flag. |
| **Post (need / mission)** | A request for help created by a poster and approved by an admin: number of people, required skills, required assets, required badge, required training, risk, shift time and length. Status: Draft → Waiting for approval → Live → Full / Closed. |
| **Volunteer profile** | Skills, assets, area, availability, badges, completed training, hours worked, rest status. |
| **Verification badge** | Checked credential: Medic, Electrician, Engineer, and Child-safe (background check, for tasks with children present). |
| **Training module** | A two-minute video plus a short check. Valid for 12 months. |
| **Shift** | A dated block of time on a post with expected check-out time. |
| **Safety status** | Requested → Accepted by poster → On site → Checked out; or Overdue / Help requested. |
| **Rest status** | Hours today and this week vs. caps; time since last shift. |
| **Team** *(future)* | A group of volunteers under a company or organization. |

### 5.1 Matching rule (prototype)

A volunteer can **join** a mission only if all hard rules pass:
- Has every required skill **or** asset listed as "must have"
- Has the required badge (professional missions)
- Has completed the required training
- Is within rest limits after this shift (see 5.2)

Missions that fail a rule stay visible with the reason and the fix: "Complete 'Safe flood cleanup' (2 min)", "Needs a verified Electrician badge", "You've worked 8 hours today. Rest first."

Among missions a volunteer can join, the board ranks by:

```
priority = (unmet / qty) × (overlooked ? 1.6 : 1) × (risk == high ? 1.2 : 1) × (match ? 1.5 : 1)
```

`match` is true when the volunteer brings an asset or skill the mission lists as needed. Full missions drop to the bottom with "Help here instead".

### 5.2 Burnout rules (placeholder defaults)

These values are **placeholders** for the prototype. Final caps are to be agreed with the NGO partner.

| Rule | Placeholder |
| --- | --- |
| Max hours per day | 8 |
| Max hours per 7 days | 40 |
| Min rest between shifts | 10 hours |
| Rest prompt | After 4 hours on site: "Take a 15-minute break and drink water" |
| Max consecutive days | 5, then one rest day |

Coordinators see volunteers near their limits. Caps can be raised only by a coordinator, with a reason.

### 5.3 Verification badges

Badges are verified by the relevant **professional body**. In the prototype the check is simulated and labelled "(demo)".

| Badge | Verified by (Malaysia, to confirm) | What is checked |
| --- | --- | --- |
| Medic | Malaysian Medical Council (doctors), Malaysia Nursing Board (nurses), Malaysian Medical Assistants Board | Current registration |
| Electrician | Energy Commission (Suruhanjaya Tenaga) | Electrical competency certificate |
| Engineer | Board of Engineers Malaysia (BEM) | Professional engineer registration |
| Child-safe | Police background check (PDRM), via the NGO partner | No relevant record |

### 5.4 Flood training modules (example)

Short, simple modules for the flood scenario. Each is about 2 minutes plus 3 quick questions, and is valid for 12 months.

| Module | Covers | Required for |
| --- | --- | --- |
| **Flood safety basics** | Don't walk or drive through moving water; check in and out; when to leave | Every first post (all volunteers) |
| **Safe flood cleanup** | Gloves, boots, masks; sharp debris; lifting safely | Cleanup posts |
| **Hygiene and disease** | Leptospirosis, clean water, washing hands and wounds | Cleanup, sanitation and kitchen posts |
| **Electricity after a flood** | Never touch wet switches; wait for the electrician; generator fumes | Posts in damaged buildings, generator and water pump posts |
| **Driving in flood areas** | Water depth, road closures, carrying supplies safely | Driving, 4x4 and lorry posts |
| **Boat safety** | Life jackets, load limits, currents | Boat posts |
| **Psychological first aid** | Listen, stay calm, don't promise, refer on | Relief center and home visit posts |
| **Working safely around children** | Never alone with a child, no photos, report concerns | Child-safe posts |

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
- **Child-safe rules**: tasks with pupils present need a Child-safe badge; no one alone with a pupil; no photos of pupils.
- A **reopening tracker** (evacuees relocated → damage assessed → cleanup done → inspection passed → supplies in → reopened) that shows the effect of dispatch.

The scenario is replaceable. Another demo could use a landslide hitting a village, using the same screens.

---

## 7. Features and status

Status: **Designed** = specified in DESIGN.md · **Prototype** = working in the earlier `pulih-prototype.html`, to rebuild in this design · **To build** = not in any prototype yet · **Later** = after the hackathon.

### 7.1 Core (MVP)

| Feature | Status |
| --- | --- |
| Volunteer profile with skills and assets (4x4, boat, lorry, generator, water pump) | Designed |
| Volunteer applies to become a poster; admin approves | Designed |
| Poster creates a post (in the example: school damage report → needs) | Prototype |
| Admin approves a post before it goes live | Designed |
| Post board matched on skills and assets, ranked fairly, with "why can't I join" reasons | Designed + Prototype (ranking) |
| Volunteer requests to join a post; poster accepts or declines | Designed |
| Safety check-in and check-out with expected check-out time | Designed + Prototype |
| Overdue alert and "I need help" on the coordinator dashboard | Prototype |

### 7.2 Differentiators

| Feature | Status |
| --- | --- |
| Micro-training: two-minute modules required before matching missions | To build |
| Verification badges for medics, electricians, engineers and Child-safe | To build (simulated check) |
| Burnout tracking: hour caps, rest between shifts, rest prompts | To build |
| Coordinator fatigue view: volunteers near their limit | To build |

### 7.3 Growth

| Feature | Status |
| --- | --- |
| Certificates and recognition badges (downloadable) | To build |
| Preparedness mode: small tasks between disasters to keep volunteers trained and active | Prototype |

### 7.4 Later

- Teams and corporate volunteering programs (company team page, impact reports)
- WhatsApp / Telegram intake and "Share mission to WhatsApp"
- Offline and SMS fallback
- Real ID (MyKad), credential and background checks
- Real video hosting and training completion tracking
- Chinese and Tamil

---

## 8. MVP demo script (3 minutes)

1. **Post.** A flood hits Selangor. The principal of SK Kampung Batu Lima, already approved as a poster, fills in the damage report; it becomes posts for cleanup, a 4x4 delivery and an electrician.
2. **Approve.** The admin approves the posts; they go live on the post board.
3. **Profile.** Aina registers: skills Cleanup and Driving, asset **4x4**. Faiz registers as an **Electrician**, which shows "not yet checked".
4. **Matching.** Aina's board puts the overlooked rural school's "Deliver supplies by 4x4" at the top, marked "Matches your 4x4". The viral urban school's cleanup is full and redirects.
5. **Training.** Aina taps "Mud cleanup" and is asked to complete "Safe flood cleanup" (2 min). She completes it and requests to join.
6. **Badges.** Faiz can't take "Check computer lab wiring" until the admin verifies his Electrician badge (demo). Then he requests to join.
7. **Accept.** The poster accepts both requests.
8. **Safety.** Aina checks in. Simulate overdue: the alert appears on the dashboard. She checks out safely.
9. **Burnout.** Try to join a third shift today: "You've worked 8 hours today. Rest first."
10. **Recognition.** Aina's certificate and badges.
11. **Result.** The school's reopening tracker moves forward because the right people and equipment arrived.

---

## 9. Success metrics

- Time from need posted to volunteer on site
- Share of missions filled by volunteers with the right skill or asset
- Share of help reaching overlooked sites
- Volunteer safety incidents and unresolved overdue alerts (target: zero)
- Volunteers exceeding hour caps (target: zero without coordinator override)
- Training completion before deployment
- Time from post created to post approved
- Volunteers still active 30 days later

---

## 10. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Unqualified people doing electrical or structural work | Badge required; self-reported skills shown as unchecked |
| Volunteer injury | Required micro-training, risk-graded missions, check-in, overdue alerts |
| Volunteer burnout | Hour caps, rest between shifts, coordinator fatigue view |
| Predators accessing children (school scenario) | Child-safe badge, two-person rule, no photos of pupils |
| Fake volunteers / looting | Poster accepts each volunteer; on-site check-in with the poster |
| Fake sites or posts | Only admin-approved volunteers can post; admin approves every post before it goes live |
| Inflated hours for certificates | Hours only from check-in to check-out |
| Cold start | Preparedness mode keeps volunteers trained and active between disasters |

---

## 11. Business model

Volunteers and people affected by disasters never pay.
- Agency and district dashboard contracts.
- Training partners (e.g. Red Crescent) sponsoring or certifying modules.
- Grants and NGO partnerships.
- *Future:* corporate volunteering programs, where companies pay to send teams and receive impact reports for ESG / CSR disclosure.

---

## 12. Roadmap

1. **Hackathon:** dispatch engine with core and differentiator features, shown through the school flood scenario.
2. **Pilot:** Selangor (example), with the placeholder NGO partner and real training content.
3. **Credentials:** real ID and professional verification partners.
4. **Teams:** corporate volunteering programs.
5. **Scale:** more site types and scenarios, WhatsApp intake, offline and SMS support.

---

## 13. Competitor: GoodSAM

[GoodSAM](https://www.goodsamapp.org) is the closest well-known competitor.

| | GoodSAM | ReadyHands |
| --- | --- | --- |
| Main use | Emergency alerts: sends nearby trained responders to a suspected cardiac arrest before the ambulance arrives | Disaster recovery: sends volunteers with the right skills and equipment to sites after a natural disaster |
| Who it's run with | Ambulance services (NHS in the UK, Australia, New Zealand) | NGOs, district offices and schools |
| Who responds | Mostly medically trained people (CPR / Basic Life Support checked) | Anyone; professional work needs a verified badge |
| Timing | Seconds to minutes, one patient | Days to weeks, many sites and shifts |
| Matching | Distance to the incident | Skills **and** assets (4x4, boat, generator), training, badges, rest, fairness to overlooked sites |
| Volunteer safety | Not the main focus | Check-in / check-out, overdue alerts, "I need help", burnout caps |
| Training | Requires existing CPR training | Built-in two-minute modules before deployment |
| Recognition | Not the main focus | Certificates and badges |

GoodSAM also has a volunteer deployment module (used by NHS and the British Red Cross to send volunteers to people who need help), so it could expand toward our space.

**Our angle:** GoodSAM is great for one emergency, right now, nearby. ReadyHands is for the weeks after a disaster, when many sites need many kinds of help, and volunteers need to be matched, trained, kept safe and not burned out.

---

## 14. Decisions

| Question | Decision |
| --- | --- |
| Name | **ReadyHands.** No volunteer or disaster app and no Malaysian NGO found under this name. Before public use, note that **Ready Hands International®** (readyhands.org) is a US nutrition non-profit with a registered mark, and readyhands.com is used by a US home care company. `readyhands.my` and `readyhands.app` did not respond (availability still to check with a registrar). |
| Who verifies badges | **Professional bodies** (see §5.3). |
| Training modules | Flood example set in §5.4. |
| Burnout caps | **Placeholders** in §5.2, to agree with the NGO partner. |
| Pilot | **Selangor** (example). |
| NGO partner | **Placeholder: "Harapan Relief" (fictional)** in the demo. Real target: a Red Cross / Red Crescent society (in Malaysia, the Malaysian Red Crescent). Don't show a real organization's name or logo without their agreement. |
| Competitor focus | **GoodSAM** (see §13). |
