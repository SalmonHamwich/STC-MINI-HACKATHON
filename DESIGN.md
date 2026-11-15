# SchoolBridge — Design & Prototype Specification

> Back to learning, together.

A friendly, accessible disaster school recovery and volunteer dispatch platform. It helps schools explain what they need, volunteers offer appropriate help, and coordinators review people, equipment, supplies, and learning arrangements in one place.

## Files

- **VISUAL-DESIGN.md** — visual design reference with screen sketches, layout, colors, typography, and accessibility states.
- The previously created **schoolbridge-design.html** remains available as an optional interactive companion; the two Markdown files are the requested handoff.
- **DESIGN.md** — this design and product specification.
- Published prototype: https://schoolbridge-recovery-jf26.lokeshengyi.chatgpt.site (private; ChatGPT sign-in required).

The downloadable design includes small accessibility refinements and keeps scores unchanged when a learning-plan draft is saved. These refinements are local to this deliverable; the previously published version is separate.

## Purpose and audience

Primary users are school staff, volunteers, and recovery coordinators, including people who rarely use technology. Older adults need readable text, predictable navigation, and generous controls. Children may view school progress and learning arrangements; participation in recovery work requires a responsible adult and coordinator approval.

The interface should feel like a reassuring person explaining the next step. Avoid alarm-heavy imagery, complex terminology, leaderboards, pressure to volunteer, and unexplained scores.

## Visual direction

Use warm ivory surfaces, forest green actions, soft sage highlights, rounded panels, generous spacing, and a welcoming school illustration. Use amber sparingly for professional inspection and attention states. Every status also has a text label.

| Token | Value | Use |
| --- | --- | --- |
| Page background | `#F8F9F4` | Calm, warm canvas |
| Main text | `#183E35` | Headings and essential content |
| Primary action | `#225B45` | Main next-step buttons |
| Secondary text | `#53685E` | Supporting explanations |
| Soft surface | `#E9EFDF` | Progress and illustrated accents |
| Divider | `#DCE4D9` | Decorative section separation |
| Card | `#FFFFFF` | Focused tasks and role choices |
| Attention surface | `#FFF5D9` | Inspection and safety explanations |

Borders alone must not identify required controls or selected states. Pair visual styling with labels, checkmarks, native control states, and focus outlines.

### Type, spacing, and controls

- Hosted typography: Manrope headings and DM Sans body. Downloadable design: system sans-serif fallback.
- Default body text: 18 px with a generous line height.
- Desktop headline: up to 64 px; mobile headline: approximately 43 px.
- Standard action buttons: at least 52 px high. Accessibility toolbar controls: at least 44 px high and wide.
- Use an 8 px spacing rhythm, roughly 20–26 px panel padding, and 10–17 px corner radii.
- Prefer a single primary action per step. Secondary choices stay visibly available.
- Use icon plus text labels. Icons supplement words rather than replacing them.

## Screen design

### 1. Welcome and role selection

The header contains the SchoolBridge identity, Home, Find a mission, Give supplies, and Simple Mode. An accessibility toolbar sits above it.

The welcome section explains the purpose in one sentence and offers “Let’s get started.” Three large role cards follow:

1. **I’m from a school** — report needs and view recovery.
2. **I want to volunteer** — share skills, equipment, and availability.
3. **I’m a coordinator** — review reports, volunteers, and safety follow-ups.

Sample community activity appears below the role choices and is hidden in Simple Mode.

### 2. School overview

Show the selected school, location, pupil count, two clearly explained progress indicators, and a prominent “Report damage or needs” action. A learning-continuity panel provides a second path.

Sample school: **SK Taman Seri Murni**, Kuala Selangor, 300 pupils, flood recovery.

| Indicator | Sample value | Meaning |
| --- | --- | --- |
| School Recovery Score | 64 / 100 | 16 of 25 recovery tasks complete |
| Education Continuity Score | 78 / 100 | 234 of 300 pupils have a recorded learning arrangement |

These indicators support planning. They are not structural assessments, safety certifications, or permission to reopen. Draft plans must not increase confirmed learning coverage. Production scores need documented denominators, evidence, dates, and responsible reviewers.

### 3. Guided damage and needs report

Use four short steps with a visible progress indicator:

1. **School:** choose the school and disaster type from labeled lists.
2. **Needs:** select large checkbox rows; allow several needs and an “Not sure — please help” option.
3. **Photos:** optional local file selection with a clear safety reminder.
4. **Review:** show school, disaster, needs, and photo count before explicit confirmation.

Needs include classroom cleanup, furniture and supplies, electricity inspection, building inspection, and temporary learning space.

If no need is chosen, explain what to do next without clearing the form. Back buttons preserve school and needs selections. Photo selection is a placeholder: the prototype records filenames/counts, not uploaded image content. Returning to that step does not restore the browser’s file input.

### 4. Suggested recovery missions

After confirmation, show suggested tasks derived from the chosen needs. Label them **Demo AI suggestions — not yet dispatched**. Building and electrical work must carry **Qualified professional required**.

Production workflow:

School report → draft task suggestions → coordinator review → professional checks where needed → approved mission → appropriate volunteer assignment.

AI may organize reports and propose task drafts. It must never certify structural safety, declare a building safe, verify credentials on its own, or authorize reopening.

### 5. Volunteer profile

Use short labeled fields and checkbox choices:

- Optional name, area, and availability.
- Skills: cleanup, driving, teaching, electrician, engineer, and first aid.
- Assets: 4x4, boat, generator, and water pump.

No equipment is required to volunteer. Professional skills are self-reported in the prototype and must not look verified.

The main action is **Save profile & find missions**.

### 6. Mission board and matching

Show readable mission rows with title, school, location, time, availability, requirements, and “View mission.” Filters include all missions, profile matches, hands-on help, deliveries, and professional help.

Sample missions:

- Approved-area classroom cleanup at SK Taman Seri Murni.
- Learning-pack delivery to SJK(C) Sungai Buloh.
- Electrical inspection by a qualified professional.

The demo matching rule checks whether a selected skill **or** asset overlaps a mission requirement. It is a discovery aid, not an eligibility decision. It does not evaluate distance, availability conflicts, credential validity, supervision, or operational risk.

Mission detail explains requirements and offers **Request to join demo mission**. A request remains pending until the coordinator approves it in the demo.

### 7. Safety check-in and check-out

Show the mission, approval status, current attendance status, and expected check-out time.

Pending approval → approved → confirm arrival with coordinator → checked in → confirm safe departure → checked out.

Require a confirmation dialog for attendance changes. In production, tie expected check-out times to dated shifts, handle repeat shifts explicitly, maintain an audit trail, and provide reliable escalation channels.

The prototype neither monitors location nor sends alerts. The coordinator dashboard’s overdue examples are fixed sample records and are not a real monitoring system.

### 8. Resource and donation matching

Show a school’s supply requests with item name, quantity needed, quantity pledged, and an **Offer supplies** action. Examples: desks, learning packs, and laptops.

The pledge dialog requires a positive quantity no greater than the remaining need. Confirm the quantity before saving. When the sample need is fulfilled, explain that no more are required.

No money is collected. Production matching must separately track offered, accepted, delivered, and received supplies; a pledge is not a delivery.

### 9. Learning-continuity planner

Offer checkbox choices for a nearby partner school, community learning space, printed take-home packs, and online lessons. Review selected arrangements in a confirmation dialog and save them as a draft.

Availability, accessible transport, supervision, family consent, and internet access must be checked before arrangements are confirmed. The prototype offers example categories, not verified placements.

### 10. Coordinator dashboard

Show school recovery, report review, volunteer requests, safety follow-ups, and suggested people/equipment matches. Keep specialist information inside the relevant detail view.

In the demo, report review marks a record reviewed; it does not publish new missions to the sample mission board. Approving a volunteer request enables the corresponding demo check-in. No credentials are actually checked and no messages are sent.

## Accessibility and inclusive behavior

| Control or pattern | Intended behavior |
| --- | --- |
| Larger text | Increase text size without hiding essential actions |
| High contrast | Dark surfaces with clear text and high-emphasis actions |
| Simple Mode | Hide secondary decoration, statistics, and promotional content |
| Read aloud | Use browser speech synthesis where available; offer stop control |
| Language selector | Clearly labeled placeholder; English is the implemented language |
| Home and Back | Predictable escape from each task |
| Native form controls | Keyboard and assistive-technology support |
| Focus indication | Visible outline on keyboard focus |
| Status and error text | Announce confirmations and explain how to recover |
| Confirmation dialogs | Review before reports, pledges, plans, and safety changes |

Design targets include WCAG 2.2 AA text contrast, visible focus, meaningful reading order, keyboard operation, and reflow at enlarged text sizes. These are acceptance targets, not a claim of audited compliance. Test with screen readers, zoom, high contrast, narrow viewports, and users from the intended age groups before release.

Use plain English: “What does your school need?” instead of “Submit a resource requisition.” Avoid countdowns and time limits. Never depend on hover, color, icons, or animation alone to convey essential meaning.

## Responsive layout

- **Wide screens:** two-column welcome section, three role cards, and a main panel with a supporting sidebar.
- **Medium screens:** navigation wraps; dashboard panels stack when necessary.
- **Small screens:** single-column cards, full-width mission actions, wrapped controls, and simplified spacing.
- Preserve the same task sequence across screen sizes. Do not move essential actions into hover menus.

## Prototype data and boundaries

The design is a browser-local demonstration. Reports, profiles, preferences, pledges, plans, and attendance changes may persist in browser local storage when available. Storage behavior for downloaded HTML files varies by browser; if unavailable, the downloadable design keeps the current session usable without persistence.

There is no backend, authentication by role, real AI model, credential verification, photo storage, messaging, emergency response, or live dispatch. Roles are navigation choices rather than security boundaries. All school and mission records are sample data.

Do not enter real child records, health information, contact details, sensitive photographs, or emergency reports into this prototype. A production service would need appropriate permissions, minimal data collection, secure storage, retention rules, and an operational response process.

## Suggested demonstration

1. Open the design and choose **I’m from a school**.
2. Report classroom cleanup and building inspection needs.
3. Skip optional photos and review before confirmation.
4. Inspect the suggested tasks and professional inspection label.
5. Open the volunteer role, choose cleanup and a water pump, and view matching missions.
6. Request a mission, then use the coordinator role to approve the demo request.
7. Return to the safety view and try check-in and check-out.
8. Offer a supply pledge and save a learning-plan draft.
9. Try Larger text, High contrast, and Simple Mode.

## Before a live pilot

- Conduct usability sessions with older adults, low-confidence technology users, school staff, and supervised children.
- Audit keyboard, screen-reader, zoom, mobile, contrast, and error recovery behavior.
- Replace sample mission timing with dated, timezone-aware schedules.
- Implement role-based access and reviewed professional verification.
- Add reviewed task publication, operational approvals, and reliable attendance escalation.
- Validate score calculations against confirmed records; expose evidence and update dates.
- Implement secure uploads, translated interfaces, low-bandwidth behavior, and auditable changes.
- Agree on local inspection, safeguarding, reopening, and coordinator responsibilities with qualified partners.
