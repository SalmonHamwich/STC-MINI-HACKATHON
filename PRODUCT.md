# Pulih: Product

> **Verified needs. Safe help. Fair recovery. Ready before the disaster.**

Pulih (Malay for "recover") is a community recovery platform. It turns a damaged place's needs into verified requests, then dispatches the right volunteers, assets and supplies to fix them safely and fairly, until that place is back on its feet.

We build the **general platform first**, then specialize it. The first specialization is **school recovery**: getting flooded schools back in shape for students.

*Pulih is a working name. Check it is not already taken before using it publicly.*

---

## 1. Problem

After every flood, help is fast but chaotic, and unfair. It flows to whoever is loudest online, and quiet places wait the longest.

**Volunteer chaos**
- Thousands of people coordinate through WhatsApp, Telegram and Facebook groups.
- Requests get buried, duplicated or go stale. Viral locations get too many volunteers while others get none.
- Nobody verifies who is helping or tracks whether volunteers get home safely.

**Slow, unequal school recovery**
- Mud, destroyed furniture, textbooks and equipment. Hidden hazards such as wiring, mold and contaminated water.
- Schools double as evacuation centers, which delays cleanup.
- Damage reports, approvals and inspections are slow and manual.
- Well-known urban schools get flooded with donations; rural schools get little, or the wrong items.
- Students lose learning time, and teachers are often victims themselves.

**How it was handled before:** NGO volunteer corps (safe but closed), reception centers (paper bottlenecks), government command (built for organizations), community groups (isolated), chat groups and spreadsheets (fast but unverified and messy). People improvise the same middle ground in every disaster, then it disappears.

---

## 2. Product principles

1. **General first, specific second.** Every feature is built on the core engine (sites, needs, responders, trust, safety, fairness). Modes such as schools add rules and screens, never a separate system.
2. **Verified needs, not noise.** Needs come from the site itself and are verified by its owner or an authority.
3. **Fast and safe.** Anyone can help within minutes on low-risk tasks; sensitive tasks require verification.
4. **Fair by default.** Help is routed by unmet need, not visibility.
5. **Plug in, don't replace.** We work with NGOs, agencies and existing chat habits.
6. **Works in the field.** Low bandwidth, multilingual, simple enough for non-technical users.

---

## 3. Users

| User | Job to be done | Primary view |
| --- | --- | --- |
| Volunteer | Find where I'm needed, help safely, get home safely | Find tasks |
| Site coordinator (principal, shelter lead, resident, clinic manager) | Get exactly what my place needs without chaos | Post needs, School recovery |
| Agency / NGO coordinator | See every site, spot gaps and safety issues, redirect help | Coordinator dashboard |
| Donor / company | Give what's actually needed and see the impact | Needs board (later: donor view) |
| Parent | Know when school reopens and that helpers were vetted | Notifications (later) |
| Education department | Track every school's status and bottlenecks | School recovery, dashboard |

---

## 4. Core platform (general)

### 4.1 Building blocks

| Block | Definition |
| --- | --- |
| **Site** | A verified place that needs help: school, home, relief center, clinic. Has a type, area, verifier and an `overlooked` flag. |
| **Need** | A request from a site: volunteers, an asset or supplies. Has quantity, filled count, required trust tier, risk level, time, and phase (disaster or peacetime). |
| **Responder** | A volunteer with a trust tier, trust score, completed tasks and registered assets. |
| **Trust tiers** | 0 Open (supervised group tasks) · 1 Verified ID (homes, assets, clinics) · 2 Child-safe (tasks with pupils present). |
| **Safety layer** | Check-in, check-out, expected return time, overdue alerts, "I need help". |
| **Matching and fairness** | Ranks needs by unmet share, weighted up for overlooked sites and high risk. Full needs redirect to open ones. |
| **Progress tracking** | Per need (filled / qty), per site (% filled), and per mode (e.g. school reopening stages). |

### 4.2 Fairness rule (prototype)

```
priority = (unmet / qty) × (overlooked ? 1.6 : 1) × (risk == high ? 1.2 : 1)
```

- The feed sorts open needs by priority; full needs go last with a "help there instead" suggestion.
- Surges (e.g. a viral post) fill open tier-0 volunteer needs by priority; the full site is capped and extras go on standby.

### 4.3 Modes

| Mode | Purpose |
| --- | --- |
| **Disaster mode** | Triggered by an alert. Shows disaster needs; vulnerable residents are checked first. |
| **Peacetime mode** | Small one-hour acts and preparedness tasks (clear drains, pack go-bags, back up records). Keeps volunteers active and verified, and solves the cold-start problem. |

### 4.4 Core features

| Feature | Status |
| --- | --- |
| Needs feed ranked by fairness, filter by site type | Prototype |
| Tiered trust and verification flow | Prototype (simulated) |
| Accept task / pledge supplies | Prototype |
| Check-in, check-out, overdue alert, help request | Prototype |
| Post a need (any site type) | Prototype |
| Register and verify a site | Prototype (simulated) |
| Coordinator dashboard: sites least helped first, KPIs, safety alerts | Prototype |
| Viral surge simulation (with vs. without Pulih) | Prototype |
| Peacetime / disaster mode switch | Prototype |
| Asset matching (boats, lorries, pumps) | Partial (asset needs exist; no asset inventory matching yet) |
| WhatsApp / Telegram bot intake | Later |
| Offline and SMS fallback | Later |
| Multilingual UI (Malay, English, Chinese, Tamil) | Later |
| Donor view and impact receipts | Later |
| Vulnerable-person registry with consent | Later |

---

## 5. School mode (first specialization)

School recovery is a mode on the core engine: a school is a **site** with extra rules for children, the education department and reopening.

| Feature | Status |
| --- | --- |
| Photo damage walkthrough by room, with AI severity suggestion | Prototype (AI simulated) |
| Generate needs list from damage (cleanup, electricians, desks, books, equipment) | Prototype |
| Damage report for the education department, with copy | Prototype |
| Reopening tracker (6 stages) | Prototype |
| Reopen and notify parents | Prototype (simulated) |
| School needs board, flowing into the general volunteer feed | Prototype |
| Child-safe rules (clearance for tasks with pupils, two-person rule, no photos of pupils) | Prototype (rules shown; enforced via tier) |
| Student recovery kits ("adopt a student", anonymous) | Later |
| Learning continuity (temporary classes, digital notes, exam-year priority) | Later |
| Wellbeing check-ins for students and teachers | Later |
| Evacuation-center handover and partial reopening | Later |

**Reopening stages:** evacuees relocated → damage assessed → cleanup complete → safety inspection passed → furniture and supplies in (≥ 80%) → school reopened.

---

## 6. MVP demo script (2 minutes)

1. **Find tasks** in disaster mode: the overlooked rural school sits at the top; the viral urban school is full and redirects.
2. Try to take a locked task → verify ID → accept → check in → simulate overdue → show the alert on the **Coordinator** dashboard.
3. **Coordinator:** run the viral-post simulation and compare with vs. without Pulih.
4. **School recovery:** fill the walkthrough → generate needs → show them in the feed → simulate tasks finished → mark evacuees and inspection → reopen and notify parents.
5. Switch to **Peacetime** to show how the network stays active between disasters.

---

## 7. Success metrics

- Days from flood to school reopening, vs. past floods
- Share of help reaching overlooked sites
- Needs fulfilled vs. posted; unused donations
- Volunteer safety incidents (target: zero)
- Volunteers still active after 30 days and between disasters

---

## 8. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Predators accessing children | Child-safe tier with background checks, two-person rule, no unsupervised contact |
| Fake volunteers / looting | ID verification, verified badge, on-site check-in |
| Fake sites or needs | Site verification (school code, village head, agency) |
| Data harvesting of addresses | Addresses visible only to assigned volunteer during the task; access logged |
| Volunteer injury / liability | Risk-graded tasks, high-risk limited to verified or professional responders, NGO and insurer partnerships |
| Authority conflict | Integrate with agency command, don't bypass it |
| Cold start | Peacetime mode and year-round school community events |
| Stale tasks | Site confirms completion; tasks expire |

---

## 9. Business model

Volunteers and victims never pay.
- Corporate sponsorship of schools and employee volunteering programs (verified hours and impact reports)
- Government / education department dashboard contracts
- Grants and NGO partnerships
- Later: insurer partnerships using anonymized readiness and damage data

---

## 10. Roadmap

1. **Phase 1, core + schools:** pilot with one district.
2. **Phase 2, homes and families:** "adopt a street", peacetime help for elderly residents.
3. **Phase 3, shelters and clinics.**
4. **Phase 4, all community sites:** small businesses, places of worship, community halls.

---

## 11. Open questions

- Final name and availability
- Pilot district and case-study flood
- Verification strictness for the lowest tier
- Demo channel: WhatsApp bot, web app, or both
- Competitor details still to verify (Crisis Cleanup, Team Rubicon, GoodSAM, local Malaysian tools)
