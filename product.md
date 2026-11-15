# SchoolBridge — Product Requirements

**Tagline:** Back to learning, together.  
**Stage:** Interactive hackathon prototype  
**Last updated:** 15 November 2026

## Product summary

SchoolBridge connects disaster-affected schools with volunteers, equipment, supplies, and temporary learning arrangements. Schools explain their needs through a short guided report. Coordinators review suggested recovery tasks and volunteer requests. Volunteers find appropriate ways to contribute and record their arrival and safe departure.

The product prioritizes people who rarely use technology, older adults, and children. It uses plain language, generous touch targets, readable text, predictable navigation, and progressive disclosure.

## Problem

After a disaster, school staff may coordinate building assessments, cleanup, supplies, volunteers, and learning arrangements through separate channels. This makes it difficult to understand outstanding needs, assign appropriate help, and maintain education while recovery continues.

## Product goal

Help a school move from an unclear recovery need to a reviewed, coordinated next step, while making learning continuity visible.

The core journey is:

**School reports needs → suggested recovery tasks → coordinator review → volunteer and resource matching → approved participation → task progress and learning arrangements.**

This describes the intended product journey. Some connections are simulated or incomplete in the current prototype, as detailed below.

## Users and roles

| Role | Primary needs | Key actions |
| --- | --- | --- |
| School staff | Explain damage, request assistance, track recovery, keep pupils learning | Submit reports; view scores; draft learning plans |
| Volunteer | Find suitable work, share skills and equipment, understand requirements | Create a profile; browse missions; request participation; check in/out |
| Coordinator/Admin | Review needs, organize appropriate help, follow up on attendance | Review reports; approve demo requests; view recovery and safety information |
| Children and families | Understand learning arrangements through clear information | View relevant information with appropriate adult support |

Roles currently select different interface views. They do not enforce permissions or provide separate authenticated accounts.

## Product principles

1. **Make the next step obvious.** Use one clear primary action per guided step.
2. **Ask for less.** Prefer lists and checkboxes over typing; make photos optional.
3. **Prevent avoidable mistakes.** Preserve answers, validate quantities, and confirm important actions.
4. **Explain status honestly.** Distinguish draft, requested, reviewed, approved, pledged, and completed.
5. **Keep professional judgment with professionals.** AI suggestions and progress scores never certify safety.
6. **Support different abilities and confidence levels.** Make essential actions available without hover, fine motor precision, or technical knowledge.
7. **Use a reassuring tone.** Avoid frightening imagery, pressure, unexplained urgency, and unnecessary complexity.

## Feature requirements and current implementation

| Feature | Intended behavior | Current prototype |
| --- | --- | --- |
| Role selection | Clear entry points for School, Volunteer, and Coordinator/Admin | Implemented as navigable views |
| Guided school report | Select school, disaster type, needs, optional photos, then review | Four-step form with need-selection validation |
| Photo support | Safe, optional reporting evidence | Local file selection/count placeholder; no image upload or storage |
| AI recovery suggestions | Turn reports into draft tasks for human review | Deterministic suggestions from selected needs; no AI model integration |
| School Recovery Score | Explain recovery progress with a transparent denominator | Sample 64/100 from 16 of 25 tasks |
| Education Continuity Score | Show pupils with confirmed learning arrangements | Sample baseline 78/100 from 234 of 300 pupils; see scoring limitation below |
| Volunteer profile | Record skills, assets, area, and availability | Browser-local form with an optional name |
| Skill and asset matching | Suggest relevant missions while respecting eligibility requirements | Skill OR asset overlap; not a full eligibility check |
| Mission board | Show task, school, location, requirements, timing, and capacity | Three sample missions with filters and detail dialogs |
| Volunteer requests | Request participation before attendance | Local request followed by coordinator demo approval |
| Safety check-in/out | Record attendance and safe departure for an approved shift | Confirmation dialogs and local attendance state; no live monitoring |
| Resource matching | Match school supply needs with offers | Quantity-validated demo pledges for desks, learning packs, and laptops |
| Learning-continuity planner | Review suitable temporary arrangements | Checkbox options saved as a draft after confirmation |
| Coordinator dashboard | Review reports, requests, recovery, and safety follow-ups | Local review/approval controls plus illustrative dashboard records |
| Accessibility controls | Adapt text, contrast, complexity, language, and audio support | Larger text, high contrast, Simple Mode, browser read-aloud; language placeholder |

## Primary journeys

### School: report a need

1. Choose **I’m from a school**.
2. Open **Report damage or needs**.
3. Select a school and disaster type.
4. Choose one or more needs, including **Not sure — please help** when appropriate.
5. Optionally select photos from a safe location.
6. Review the answers and confirm the demo report.
7. View suggested tasks and their review status.

**Success:** The report appears in local school/coordinator views, and professional inspection needs are explicitly identified.

### Volunteer: find and request a mission

1. Choose **I want to volunteer**.
2. Select skills, equipment, area, and availability.
3. Save the profile and open the mission board.
4. Filter missions and read requirements.
5. Request to join a demo mission.
6. Wait for coordinator approval before check-in becomes available.

**Success:** A local request is visible to the coordinator and the volunteer sees its status.

### Coordinator: review participation and attendance

1. Open the coordinator dashboard.
2. Review a school report or volunteer request.
3. In a live service, verify credentials, safe access, supervision, and meeting details.
4. Approve the demo volunteer request.
5. The volunteer confirms arrival with the coordinator, then confirms safe departure.

**Success:** The demo reflects approved, checked-in, and checked-out states. No real dispatch or messages occur.

### Supporter: offer supplies

1. Open **Give supplies**.
2. Choose an item and view its remaining need.
3. Enter a positive quantity within that need.
4. Confirm the demo pledge.

**Success:** The pledged count updates locally. A pledge is not represented as a completed delivery.

### School: draft a learning plan

1. Open **Make a learning plan**.
2. Select one or more arrangements.
3. Review the choices and save a draft.
4. In a live service, confirm availability, accessibility, transport, supervision, and family consent before activation.

**Success:** A draft is retained locally. Drafts must not count as confirmed pupil placements in the intended product.

## Accessibility and interaction requirements

- Use readable body text, generous line spacing, strong contrast, and visible keyboard focus.
- Pair icons with text; never convey meaning through color alone.
- Keep standard action buttons approximately 52 px high or larger; accessibility toolbar targets at least 44 × 44 px.
- Provide Home, Back, and Previous step controls where relevant.
- Keep required content visible without hover and allow navigation with a keyboard.
- Explain validation errors near the relevant action without clearing previous answers.
- Provide a review step or confirmation for reports, supply pledges, learning plans, and safety changes.
- Let controls wrap and panels stack on small screens.
- Make optional steps explicit and avoid timers or forced rapid decisions.
- Keep language selection clearly labeled as a placeholder until translations exist.
- Target WCAG 2.2 AA and validate with assistive technologies and representative users; compliance has not been audited.

## Safety and operational boundaries

- AI may organize information and suggest tasks. It must not certify a building, electrical system, route, or worksite as safe.
- Building and electrical damage require qualified professional inspection and appropriate local authorization before use.
- Self-reported professional skills are not verified credentials.
- Profile matches are discovery suggestions, not clearance to attend or perform specialist work.
- Children require responsible adult supervision and coordinator approval for any participation.
- A real service needs dated shifts, clear check-out deadlines, reliable follow-up channels, and documented escalation ownership.
- The prototype is not an emergency reporting or response service.

## Progress indicators

### School Recovery Score

The example score is `completed recovery tasks / total recorded recovery tasks × 100`. The sample is `16 / 25 × 100 = 64`.

A production implementation should define task completion evidence, reviewer, update date, and treatment of critical blockers. A high percentage must not hide an outstanding safety-critical inspection.

### Education Continuity Score

The example baseline is `pupils with confirmed learning arrangements / total pupils × 100`. The sample is `234 / 300 × 100 = 78`.

The current split-file prototype changes the displayed sample to 88/100 after a draft learning plan is saved. This is an illustrative shortcut, not verified coverage, and must be corrected before a pilot. The separately exported single-file design already keeps the score unchanged for a draft.

Neither score authorizes reopening or replaces professional assessment.

## Technical implementation

| Layer | Current choice |
| --- | --- |
| Frontend | HTML, CSS, plain JavaScript |
| Routing | Browser URL hashes |
| UI state | JavaScript objects |
| Persistence | Browser local storage under `schoolbridge` |
| Read-aloud | Browser speech synthesis when available |
| Backend | None |
| Database | None |
| Authentication | No application role authentication; hosted site has a separate private access gate |
| AI integration | None; rule-based sample suggestions |
| External dispatch/notifications | None |

### Project files

- `dist/index.html` — page shell, navigation, accessibility toolbar, main content container, and dialog.
- `dist/style.css` — visual styles, responsive layout, and accessibility modes.
- `dist/app.js` — views, guided report, matching, local persistence, pledges, plans, and attendance interactions.
- `.openai/hosting.json` — static hosting configuration.
- `.vscode/settings.json` — project formatting and word-wrap preferences.
- `product.md` — this product definition.

## Known prototype limitations

- Reports reviewed by a coordinator do not create new entries on the sample mission board.
- Matching ignores distance, scheduling conflicts, credential validity, and operational risk.
- The prototype retains one selected mission request and a simplified attendance state rather than separate per-shift records.
- Dashboard activity counts and overdue check-outs include fixed sample data.
- Photo selection tracks filenames/counts rather than stored images.
- Reopening the photo step does not restore the browser file input.
- Draft learning-plan coverage is overstated in the split-file prototype, as described above.
- Language options are placeholders; only English content is implemented.
- Local storage is not a shared multi-user data service and may be unavailable or cleared by browser settings.
- Accessibility and mobile behavior need a dedicated audit and usability testing.

## Data requirements for a future service

| Entity | Minimum purpose |
| --- | --- |
| School | Identity, location, pupil count, responsible coordinator |
| Damage report | Disaster, needs, evidence, author, review status |
| Recovery task | Requirements, priority, safe access conditions, review and completion evidence |
| Volunteer | Consent, skills, equipment, availability, eligibility and verification status |
| Mission assignment | Approved participant, dated shift, meeting details, responsible site lead |
| Attendance event | Assignment, arrival/departure timestamp, recorder, follow-up status |
| Supply need and pledge | Requested quantity, offered quantity, acceptance and delivery status |
| Learning arrangement | Capacity, accessibility, consent, confirmed pupil coverage, review status |

Collect only necessary information. Before a live pilot, define access controls, secure uploads, retention, consent, audit records, and appropriate handling of child-related information.

## MVP acceptance criteria

- A school can complete a report without typing a long description or providing photos.
- Empty needs selection produces a useful error and preserves prior answers.
- Submitted needs generate clearly labeled draft suggestions with professional inspection warnings where applicable.
- A volunteer can save skills/assets, view matching examples, and request a mission.
- A pending request cannot check in until demo approval is recorded.
- Check-in and check-out require confirmation and show the updated state.
- Supply quantities cannot be zero, negative, or greater than the remaining need.
- A learning plan can be reviewed and saved as a draft.
- Draft plans do not change confirmed coverage in the production-ready implementation.
- Primary journeys work with keyboard navigation, enlarged text, and narrow screens.
- Every simulated real-world action is clearly identified and does not send messages or dispatch people.

These are acceptance requirements, not a statement that every item has been formally tested or passed.

## Success measures for a pilot

Measure performance with representative users and confirmed operational records. Establish baselines before setting numerical targets.

- Report completion rate and time to complete without assistance.
- Percentage of users who identify the correct next action on their first attempt.
- Time from report submission to coordinator review.
- Share of approved missions with appropriate skills, equipment, and professional verification.
- Percentage of shifts with recorded arrival and departure; time to resolve overdue follow-ups.
- Time from supply request to confirmed receipt.
- Share of pupils with confirmed, accessible learning arrangements.
- User-reported clarity and confidence, including older adults and low-confidence technology users.

## Priorities after the prototype

1. Correct draft-plan scoring and implement dated, per-assignment attendance records.
2. Connect reviewed reports to approved mission publication.
3. Add backend persistence and role-based access.
4. Implement professional verification and operational approval workflows with qualified partners.
5. Add secure evidence uploads, supply delivery tracking, and learning-arrangement confirmation.
6. Implement reliable notifications and overdue follow-up procedures.
7. Validate accessibility, translations, mobile reflow, and low-bandwidth use with intended users.

## Out of scope for the current prototype

Payments, corporate volunteering reports, automatic credential certification, live geolocation, real emergency dispatch, production messaging, burnout monitoring, micro-training delivery, reputation systems, and automatic reopening decisions.
