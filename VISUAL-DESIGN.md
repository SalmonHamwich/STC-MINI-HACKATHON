# SchoolBridge — Visual Design

**Back to learning, together.**

This document describes the website’s visual layout in Markdown. Screen sketches show arrangement and hierarchy; they are not interactive controls. See `DESIGN.md` for detailed flows, behavior, accessibility requirements, and prototype boundaries.

## Design direction

A welcoming community service with warm ivory backgrounds, forest green actions, soft sage panels, and clear language. Use a friendly school illustration, generous spacing, large text, and labeled controls. Avoid disaster imagery that could frighten children or overwhelm users.

## Visual system

| Element | Design |
| --- | --- |
| Page background | Warm ivory, `#F8F9F4` |
| Main text | Deep green, `#183E35` |
| Primary buttons | Forest green, `#225B45`, with white text |
| Supporting text | Muted green, `#53685E` |
| Highlight panels | Soft sage, `#E9EFDF` |
| Cards | White, softly rounded, subtle border |
| Inspection notices | Pale amber with an explicit text label |
| Body type | 18 px minimum default; generous line spacing |
| Headings | Clear sans-serif, strong hierarchy |
| Buttons | At least 52 px high; toolbar targets at least 44 × 44 px |
| Corners | Approximately 10–17 px radius |
| Spacing | Approximately 20–26 px inside cards |

Color must always be paired with a label or another visible cue. Contrast and accessible interaction require verification before release.

## Shared navigation

Every screen provides recognizable navigation and access to accessibility controls.

```text
┌──────────────────────────────────────────────────────┐
│ Larger text · High contrast · Read aloud · English    │
├──────────────────────────────────────────────────────┤
│ SchoolBridge                         [Simple Mode]   │
│ Home          Find a mission          Give supplies   │
└──────────────────────────────────────────────────────┘
```

On small screens, controls wrap onto additional rows. Keep their touch areas separate. On task screens, show clearly labeled Home and Back controls above the heading.

## 1. Welcome and role selection

```text
COMMUNITIES HELPING COMMUNITIES

Every helping hand.
One step closer to school.

Help a school recover. Share your time or supplies.
Together, we can bring children back to learning.

[ Let’s get started ]

No experience with technology? We’ll guide you.

                  [Welcoming school illustration]

How would you like to help?
Choose a role. You can change it anytime.

┌──────────────────────────────────────────────────────┐
│ SCHOOL                                               │
│ I’m from a school                                    │
│ Tell us what your school needs.                      │
│ Get help for my school →                             │
└──────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────┐
│ VOLUNTEER                                            │
│ I want to volunteer                                  │
│ Share your time, skills, or equipment.                │
│ Find my way to help →                                │
└──────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────┐
│ COORDINATOR                                          │
│ I’m a coordinator                                    │
│ Bring people and resources together.                 │
│ Open recovery dashboard →                           │
└──────────────────────────────────────────────────────┘
```

Desktop: place the illustration beside the introduction and show the three role cards in one row. Mobile: stack everything in reading order. Keep the complete role card clickable, with visible text labels.

## 2. School overview

```text
[Home] [Back]

Let’s help your school recover.
Start with what you know. Add more details later.

SK Taman Seri Murni
Kuala Selangor · 300 pupils · Flood recovery

SCHOOL RECOVERY             EDUCATION CONTINUITY
64 / 100                    78 / 100
16 of 25 tasks complete     234 of 300 pupils covered

Planning indicators only. Scores do not certify safety
or approve reopening.

[ Report damage or needs ]

Keep learning going
[ Make a learning plan ]

Professional inspection is required for building
and electrical damage before use.
```

Display each score with its explanation and a labeled progress bar. Avoid a green “safe” badge or reopening prediction based on these scores.

## 3. Guided report

One decision group per step, with visible progress and a persistent Previous step action.

### Step 1 — School

```text
Step 1 of 4 · School

Which school needs help?

School
[ SK Taman Seri Murni                      ▼ ]

What happened?
[ Flood                                   ▼ ]

[ Back to school ]              [ Continue → ]
```

### Step 2 — Needs

```text
Step 2 of 4 · Needs

What does your school need?
Choose all that apply. It is okay to be unsure.

[✓] Classroom cleanup
[ ] Furniture and supplies
[ ] Electricity inspection
[✓] Building inspection
[ ] Temporary learning space
[ ] Not sure — please help

[ Previous step ]               [ Continue → ]
```

Each checkbox label sits inside a large selectable row. An empty selection produces a plain-language error without deleting previous answers.

### Step 3 — Photos

```text
Step 3 of 4 · Photos

Add photos if you have them
This step is optional.

[ Choose photos ]
0 photos selected

Only take photos from a safe place.
Do not enter damaged buildings to take photos.

[ Previous step ]   [ Continue — photos optional → ]
```

The prototype uses local photo selection placeholders. It does not upload image content.

### Step 4 — Review

```text
Step 4 of 4 · Review

Does this look right?

School: SK Taman Seri Murni
Disaster: Flood
Needs: Classroom cleanup; Building inspection
Photos: 0

A coordinator reviews suggested tasks.
AI cannot certify structural safety.

[ Previous step ]      [ Confirm demo report ✓ ]
```

## 4. Suggested recovery tasks

```text
Your report is ready.
Thank you. Here are suggested next steps.

✓ Demo report saved for SK Taman Seri Murni

DEMO AI SUGGESTIONS · NOT YET DISPATCHED

Classroom cleanup
Pending coordinator review and safe access confirmation.

Building inspection
QUALIFIED PROFESSIONAL REQUIRED
Pending coordinator review.

[ Return to my school ] [ View coordinator review ]
```

Keep the success message reassuring while clearly distinguishing a saved report from an approved or dispatched mission.

## 5. Volunteer profile

```text
Your helping hand starts here.
Tell us what you can share.

Your name — optional
[ For example, Aina                         ]

Your area
[ Kuala Selangor                          ▼ ]

What can you help with?
[✓] Cleanup        [ ] Driving
[ ] Teaching       [ ] Electrician
[ ] Engineer       [ ] First aid

Equipment you can share — optional
[ ] 4x4            [ ] Boat
[ ] Generator      [✓] Water pump

When are you available?
[ Weekends                                ▼ ]

[ Save profile & find missions → ]
```

Explain that professional skills are self-reported until credentials are reviewed. Children must participate with a responsible adult and coordinator approval.

## 6. Mission board

```text
Find your way to help.

[ All missions ] [ Matches for me ] [ Deliveries ]
[ Hands-on help ] [ Professional help ]

┌──────────────────────────────────────────────────────┐
│ MATCHES YOUR PROFILE                                 │
│ Help classrooms feel like classrooms again           │
│ SK Taman Seri Murni · Kuala Selangor                  │
│ Tomorrow · 9:00 am–12:00 pm                           │
│ Needs: Cleanup · Water pump                          │
│ 4 of 8 places available                              │
│ [ View mission → ]                                   │
└──────────────────────────────────────────────────────┘

[ My mission & safety check-in ]
```

Mission details explain the task, requirements, meeting time, and approval process. A profile match is a suggestion, not permission to attend.

Main detail action: **Request to join demo mission**.

## 7. Safety check-in and check-out

```text
A safe arrival. A safe return.

Classroom recovery · SK Taman Seri Murni
APPROVED IN DEMO

Status: Not checked in
Expected check-out: 12:00 pm — sample shift

[ Check in — I am with the coordinator ]

This demo does not send alerts or monitor location.
```

After check-in, replace the action with **Check out — I have left safely**. Both changes require a confirmation dialog. Pending requests show the approval state instead of an active check-in button.

## 8. Give supplies

```text
Give supplies. Bring learning closer.

DESKS
SK Taman Seri Murni
8 of 20 pledged
[ Offer desks → ]

LEARNING PACKS
35 of 60 pledged
[ Offer learning packs → ]

LAPTOPS
4 of 12 pledged
[ Offer laptops → ]

Sample pledges only. No money is collected.
```

The offer dialog asks for quantity, displays the remaining need, and requires confirmation. Distinguish pledges from delivered supplies.

## 9. Learning-continuity planner

```text
Keep a place for every learner.

What could work for your school?

[ ] Nearby partner school
[ ] Community learning space
[✓] Printed take-home packs
[ ] Online lessons — internet needed

Confirm availability, accessible transport, supervision,
and family consent before arrangements begin.

[ Review learning plan → ]
```

Save reviewed choices as a draft. A draft does not increase confirmed Education Continuity Score coverage in the downloadable design.

## 10. Coordinator dashboard

```text
Good morning, coordinator.

12 schools supported     36 sample missions
18 volunteers on site     2 sample overdue check-outs

SCHOOL RECOVERY
SK Taman Seri Murni
Recovery: 64 / 100 · Education continuity: 78 / 100
[ View school → ]

REPORTS TO REVIEW
Classroom cleanup; Building inspection
[ Review suggested missions ]

VOLUNTEER REQUESTS
Classroom recovery request
[ Review & approve demo request ]

SAFETY FOLLOW-UP
2 sample check-outs overdue
[ View follow-up steps ]

PEOPLE + EQUIPMENT
Cleanup volunteers + water pump → Classroom recovery
[ Explore matching ]
```

Desktop: place the school and reports in the main column, with requests and safety follow-ups in the sidebar. Mobile: stack panels with important pending actions near the top. All figures are illustrative sample data.

## Accessibility states

| State | Visual treatment |
| --- | --- |
| Larger text | Increase readable text while allowing panels and controls to grow |
| High contrast | Dark surfaces, light text, bright primary action, clear status labels |
| Simple Mode | Remove decorative illustration, community statistics, and promotional extras |
| Read aloud | Browser speech synthesis with a visible Stop reading control |
| Language | English implemented; other languages clearly labeled as placeholders |
| Keyboard focus | Clearly visible outline around the current interactive control |
| Error | Specific nearby text explaining the next action; preserve entered answers |
| Success | A short confirmation stating exactly what was saved or changed |

## Screen copy rules

- Say “What does your school need?” instead of “Submit requirements.”
- Say “Previous step” and “Continue” consistently.
- Say “Saved for review” when something still needs approval.
- Keep safety instructions short and close to the relevant action.
- Avoid suggesting that an AI score or automated match confirms safety.
- Label every simulated action as a demo where a real-world action could be assumed.

## Delivery note

This Markdown file is the visual design reference. `DESIGN.md` is the companion product and interaction specification. Markdown sketches do not reproduce the exact spacing, colors, or interactivity of the HTML prototype.
