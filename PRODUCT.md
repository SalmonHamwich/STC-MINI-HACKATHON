# SchoolBridge: Product

> **From flood to classroom, together.**
> Verified needs. Safe help. Fair recovery. Ready before the next disaster.

SchoolBridge is a **disaster recovery and volunteer dispatch platform for schools**. When a flood, landslide or storm damages a school, SchoolBridge turns the damage into verified needs, dispatches the right volunteers, equipment and supplies safely and fairly, and tracks the school until pupils are back in class.

Schools are the starting point because they are the heart of a community after a disaster: they double as evacuation centers, children lose learning time every day they stay closed, and recovery is slow and unequal. The same engine (sites, needs, responders, trust, safety, fairness) can later serve homes, shelters and clinics.

See [DESIGN.md](DESIGN.md) for screens and behavior, and [VISUAL-DESIGN.md](VISUAL-DESIGN.md) for layout sketches and visual tokens.

---

## 1. Problem

After every flood, help is fast but chaotic, and unfair. It flows to whoever is loudest online, and quiet places wait the longest.

**Volunteer chaos**
- Thousands of people coordinate through WhatsApp, Telegram and Facebook groups.
- Requests get buried, duplicated or go stale. A viral school gets too many volunteers while others get none.
- Nobody verifies who is helping, checks whether they are safe around children, or tracks whether volunteers get home safely.

**Slow, unequal school recovery**
- Mud, destroyed furniture, textbooks and equipment, plus hidden hazards: wiring, structure, mold, contaminated water.
- Schools are used as evacuation centers, which delays cleanup.
- Damage reports, approvals and inspections are slow and manual.
- Well-known urban schools receive more donations than they can use; rural schools get little, or the wrong items.
- Pupils lose learning time, and teachers are often disaster victims themselves.

**How it was handled before:** NGO volunteer corps (safe but closed), reception centers (paper bottlenecks), government command (built for organizations, not individuals), community groups (isolated), chat groups and spreadsheets (fast but unverified and messy). People rebuild the same improvised system in every disaster, then it disappears.

---

## 2. The disaster recovery cycle

SchoolBridge follows a school through every phase of a disaster. Each phase has a clear owner and a visible finish line.

| Phase | What happens | Main user | Done when |
| --- | --- | --- | --- |
| **1. Alert** | A flood alert switches the platform to Disaster mode. Affected schools are listed; schools used as evacuation centers are marked. | Coordinator | Affected schools are known |
| **2. Assess** | The school reports damage room by room, with optional photos taken from a safe place. AI drafts severity and needs (labelled, editable). | School staff | Damage report submitted |
| **3. Verify** | A coordinator reviews the report, approves missions and flags work that needs a qualified professional. | Coordinator | Missions published |
| **4. Dispatch** | Volunteers, equipment and supplies are matched to missions, ranked by unmet need so overlooked schools come first. | Volunteer, donor | Missions filled |
| **5. Restore** | Volunteers check in and out of every shift; cleanup, inspections and deliveries are tracked. | Volunteer, coordinator | Cleanup and inspection complete |
| **6. Reopen** | The reopening tracker reaches its last stage; parents are notified. Learning continues elsewhere until then. | School, education department | School reopened |
| **7. Prepare** | Preparedness mode keeps volunteers active and verified between disasters. | Everyone | Ready for the next alert |

---

## 3. Product principles

1. **Recovery first, school-shaped.** Every feature serves getting a damaged school safely back to learning.
2. **Verified needs, not noise.** Needs come from the school and are verified by a coordinator or authority.
3. **Fair by default.** Help is routed by unmet need, not by visibility. Overlooked schools rank higher.
4. **Safe for helpers and children.** Trust levels, check-in and check-out, and child-safe rules are on the surface, never hidden.
5. **AI drafts, people decide.** AI may organize reports and suggest tasks. It never certifies a building as safe, verifies credentials or approves reopening.
6. **Works for everyone under stress.** Plain words, large controls, low bandwidth, multilingual, usable by older adults and people new to technology.
7. **Plug in, don't replace.** Work with NGOs, agencies (e.g. NADMA, APM), the education department and existing chat habits.

---

## 4. Users

| User | Job to be done | Primary screens |
| --- | --- | --- |
| School staff (principal, teacher) | Report damage and get exactly what my school needs | School overview, Damage report, Learning plan |
| Volunteer | Find where I'm needed, help safely, get home safely | Volunteer profile, Mission board, Safety check-in |
| Donor / company | Give what's actually needed and see it arrive | Give supplies |
| Recovery coordinator (NGO, agency, district) | See every affected school, approve missions, spot gaps and safety issues | Coordinator dashboard |
| Education department | Track each school's recovery and reopening | School overview, Coordinator dashboard |
| Parent / pupil | Know where learning continues and when school reopens | School overview (read-only), notifications (later) |

Children may view school progress and learning arrangements. Taking part in recovery work requires a responsible adult and coordinator approval.

---

## 5. Core concepts

| Concept | Definition |
| --- | --- |
| **Disaster event** | An alert (e.g. "Flood, Selangor") that switches the platform to Disaster mode and groups affected schools. |
| **School** | A verified site (school code). Has location, pupil count, an `overlooked` flag, and whether it is in use as an evacuation center. |
| **Damage report** | Room-by-room severity (None, Light, Moderate, Severe), optional photos and a needs list. Drafts AI suggestions; reviewed by a coordinator. |
| **Mission** | An approved need: volunteers, equipment (boat, lorry, 4x4, pump, generator) or supplies. Has quantity, filled count, required trust level, risk level, time and requirements. |
| **Volunteer** | Skills, equipment, area, availability, trust level and safety history. Professional skills are self-reported until reviewed. |
| **Trust levels** | 0 Open (supervised group tasks) · 1 Verified ID (equipment, inspections, deliveries) · 2 Child-safe (tasks with pupils present). |
| **Safety layer** | Request → approval → check-in → check-out, expected return time, overdue follow-up and an "I need help" button. |
| **Fair ranking** | Orders open missions by unmet share, weighted up for overlooked schools and urgent risk. Full missions point to an open one. |
| **Recovery tracker** | Six reopening stages per school, plus two planning scores (Recovery, Education Continuity). |

### 5.1 Fair ranking rule (prototype)

```
priority = (unmet / qty) × (overlooked ? 1.6 : 1) × (risk == high ? 1.2 : 1)
```

- The mission board sorts open missions by priority; full missions drop to the bottom with a "Help here instead" suggestion.
- When a post goes viral, extra volunteers for a full school are capped and redirected to open, overlooked missions; the rest go on standby.

### 5.2 Reopening stages

1. Evacuees relocated (if the school was an evacuation center)
2. Damage assessed (report reviewed)
3. Cleanup complete (all cleanup missions filled and checked out)
4. Safety inspection passed (electrical, structure, water) by a qualified professional
5. Furniture and supplies in (at least 80% delivered, not just pledged)
6. School reopened, parents notified

**Recovery Score** = share of recovery tasks complete. **Education Continuity Score** = share of pupils with a *confirmed* learning arrangement. Both are planning indicators: they never certify safety or permit reopening, and drafts never raise them.

### 5.3 Modes

| Mode | Purpose |
| --- | --- |
| **Disaster mode** | Triggered by an alert. Red status banner, affected schools and disaster missions first, vulnerable schools (evacuation centers, rural, exam-year) checked first. |
| **Preparedness mode** | Between disasters. Small one-hour tasks: clear school drains, move library books upstairs, back up school records, run a flood drill. Keeps volunteers verified and active, and solves the cold-start problem. |

---

## 6. Features

Status: **Designed** = specified in DESIGN.md and VISUAL-DESIGN.md · **Prototype** = working in the earlier `pulih-prototype.html`, to be rebuilt in the SchoolBridge design · **Later** = after the hackathon.

### 6.1 Assess and verify

| Feature | Status |
| --- | --- |
| Welcome screen with active disaster banner and role choice (school, volunteer, coordinator) | Designed |
| Guided damage report: school and disaster type → room-by-room damage → needs → photos → review | Designed + Prototype |
| AI severity and needs suggestions, labelled "Demo AI suggestion", editable | Designed + Prototype (simulated) |
| "Qualified professional required" on electrical and structural work | Designed |
| Damage report for the education department (copy / export) | Prototype |
| Coordinator review that publishes approved missions to the mission board | Designed (to connect) |

### 6.2 Dispatch

| Feature | Status |
| --- | --- |
| Volunteer profile: skills, equipment, area, availability | Designed |
| Trust levels and verification (MyKad ID, child-safe background check) | Prototype (simulated) |
| Mission board ranked by fairness, with filters and "Matches for me" | Designed + Prototype |
| Locked missions show "Unlock: <trust level>" instead of hiding | Prototype |
| Full missions redirect: "Help here instead" | Prototype |
| Request to join, coordinator approval | Designed |
| Equipment matching (boat, lorry, 4x4, pump, generator) | Designed (partial) |
| Viral surge simulation: with vs. without SchoolBridge | Prototype |

### 6.3 Restore and stay safe

| Feature | Status |
| --- | --- |
| Check-in and check-out with confirmation and expected return time | Designed + Prototype |
| "I need help" button and overdue follow-up on the coordinator dashboard | Prototype |
| Child-safe rules: clearance for tasks with pupils, no one alone with a pupil, no photos of pupils, supervised groups | Prototype |
| Give supplies: pledge capped at remaining need | Designed |
| Supply lifecycle: offered → accepted → delivered → received | Designed (to build) |

### 6.4 Reopen and continue learning

| Feature | Status |
| --- | --- |
| School overview with Recovery and Education Continuity scores | Designed |
| Reopening tracker (6 stages) | Prototype |
| Reopen and notify parents | Prototype (simulated) |
| Learning-continuity planner (partner school, community space, take-home packs, online lessons) | Designed |
| Coordinator dashboard: schools least helped first, reports, requests, safety alerts | Designed + Prototype |

### 6.5 Prepare and include

| Feature | Status |
| --- | --- |
| Disaster / Preparedness mode switch | Prototype |
| Larger text, High contrast, Simple Mode, Read aloud | Designed |
| Malay and English (then Chinese, Tamil) | Designed (English only) |
| Share a mission to WhatsApp | Later |
| WhatsApp / Telegram bot intake, offline and SMS fallback | Later |
| Parent view and notifications | Later |
| Anonymous "adopt a pupil" recovery kits | Later |
| Wellbeing check-ins for pupils and teachers | Later |

---

## 7. MVP demo script (3 minutes)

1. **Alert.** Open SchoolBridge in Disaster mode: "Flood alert, Selangor. 12 schools affected."
2. **Assess.** As SK Kampung Batu Lima (rural, overlooked): fill the damage walkthrough, review AI suggestions, mark the electrical inspection as professional-only, submit.
3. **Verify.** As coordinator: approve the report; missions appear on the mission board.
4. **Dispatch.** As a volunteer: the overlooked rural school sits at the top; the viral urban school is full and redirects. Try a locked task → verify ID → request to join → coordinator approves.
5. **Fairness.** Coordinator runs the viral-post simulation: with vs. without SchoolBridge.
6. **Restore.** Check in, simulate overdue, see the alert on the dashboard, check out safely. Pledge desks.
7. **Reopen.** Fill remaining missions, mark inspection passed, reopen and notify parents. Show the learning plan that kept pupils learning meanwhile.
8. **Prepare.** Switch to Preparedness mode to show how the network stays ready.

---

## 8. Success metrics

- Days from flood to school reopening, compared with past floods
- Share of help reaching overlooked schools
- School days lost per pupil; share of pupils with a confirmed learning arrangement
- Missions fulfilled vs. posted; unused or wrong donations
- Volunteer safety incidents (target: zero)
- Volunteers still active 30 days after the disaster and in Preparedness mode

---

## 9. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Predators accessing children | Child-safe level with background checks, two-person rule, no photos of pupils, no unsupervised contact |
| Unsafe buildings | Professional inspection required for electrical and structural work; AI never certifies safety; scores never permit reopening |
| Fake volunteers / looting | ID verification, verified badge, on-site check-in with coordinator |
| Fake schools or needs | School code verification, coordinator review of every report |
| Volunteer injury / liability | Risk-graded missions, high-risk limited to verified or professional responders, NGO and insurer partnerships |
| Data about children | No child records in the prototype; minimal collection, role-based access and retention rules in production |
| Authority conflict | Integrate with agency and education department command, don't bypass it |
| Cold start | Preparedness mode and year-round school community events (gotong-royong) |
| Stale missions | School confirms completion; missions expire |

---

## 10. Business model

Volunteers, schools and disaster victims never pay.
- Corporate sponsorship of schools and employee volunteering programs (verified hours and impact reports)
- Education department and district dashboard contracts
- Grants and NGO partnerships
- Later: insurer partnerships using anonymized readiness and damage data

---

## 11. Roadmap

1. **Hackathon:** SchoolBridge prototype covering the full recovery cycle for schools.
2. **Pilot:** one flood-prone district with its education office and one NGO partner.
3. **Expand sites:** homes of pupils and teachers, then shelters and clinics, on the same engine.
4. **Scale:** state-level dashboards, WhatsApp intake, offline and SMS support.

---

## 12. Open questions

- Pilot district and case-study flood
- Verification strictness for the Open level
- Demo channel: web app, WhatsApp bot, or both
- Who confirms the safety inspection stage (JKR, licensed engineer, district office)
- Competitors to check (Crisis Cleanup, Team Rubicon, GoodSAM, local Malaysian tools)
