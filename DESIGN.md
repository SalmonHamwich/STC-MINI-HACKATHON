# Pulih: Design

How the Pulih prototype looks, is structured and behaves. Source: `pulih-prototype.html` (single file, vanilla HTML/CSS/JS, no build step). See [PRODUCT.md](PRODUCT.md) for what the product does and why.

---

## 1. Design principles

1. **General first, specific second.** Navigation and visuals separate the core platform from modes. A mode reuses core components and only adds what it needs.
2. **Urgency at a glance.** State is shown by form (pills, stripes, meters), not only by numbers.
3. **Calm under stress.** Users may be exhausted or in danger. Plain words, large targets, one clear action per card.
4. **Fairness is visible.** Overlooked places are always marked and ranked higher; full tasks always point somewhere else.
5. **Safety is never hidden.** Trust tiers, risk and check-in status sit on the surface, not in menus.

---

## 2. Information architecture

```
Header: Pulih · tagline · [Peacetime | Disaster mode]
Tabs:
  CORE PLATFORM               SCHOOL MODE
  Find tasks                  School recovery
  Post needs
  Coordinator
Banner: current mode status
Main: view content
```

| Route (hash) | View | Primary user | Layout |
| --- | --- | --- | --- |
| `#tasks` | Find tasks | Volunteer | Feed (left) + profile and my tasks (right, 340px) |
| `#post` | Post needs | Site coordinator | Two even columns: need form · sites and live needs |
| `#dashboard` | Coordinator | Agency / NGO | KPI row → alerts → sites table · fairness simulation |
| `#school` | School recovery | Principal / education dept | School picker → walkthrough · tracker, needs board, rules |

Rules:
- Core tabs use the **primary** underline; the school tab uses the **accent** underline, so modes are visually distinct.
- New modes (homes, shelters, clinics) get their own tab group to the right of School mode.
- Hash routes only use plain names (`#school`), never `#/path` or query strings.

---

## 3. Visual language

### 3.1 Color tokens

Defined in `:root`; redefined for dark under `prefers-color-scheme: dark` and `[data-theme="dark"]`.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bg` | `#eef2f1` | `#0f1719` | Page background |
| `--surface` | `#ffffff` | `#172327` | Panels, cards, inputs |
| `--ink` | `#15252c` | `#e4ecec` | Main text |
| `--muted` | `#5a6b72` | `#9db0b4` | Secondary text, labels |
| `--line` | `#d6dfdd` | `#2a3a3e` | Borders, meter tracks |
| `--primary` | `#0d5a66` | `#5fb6c2` | Brand, main buttons, core tab, Verified tier |
| `--primary-soft` | `#dcecee` | `#1c3a40` | Verified pill, active tier, avatar |
| `--accent` | `#d9961a` | `#f0b445` | Overlooked/priority, school mode, key demo actions |
| `--accent-soft` | `#fbefd6` | `#3a2f17` | Redirect notes, child-safe pill, rules box |
| `--good` / `--good-soft` | `#2c8a57` / `#def1e5` | `#5cc98b` / `#17352a` | Open tier, peacetime, done stages, fair bars |
| `--warn` | `#b8730e` | `#e8a03a` | Moderate damage, child-safe text |
| `--crit` / `--crit-soft` | `#bf3b2a` / `#f8e1dd` | `#ef7a66` / `#3e1f1a` | Disaster mode, high risk, severe damage, alerts |

Color meaning (keep consistent):
- **Teal (primary)** = the platform and verified trust.
- **Marigold (accent)** = priority and fairness: "look here, this place is overlooked".
- **Green** = safe, open, done, peacetime.
- **Red** = danger, disaster, overdue, severe.

### 3.2 Typography

| Role | Font | Size / weight |
| --- | --- | --- |
| Display (brand, headings, KPI numbers) | Sora | Brand 22/700 · H2 18/600 · H3 15/600 · KPI 26/700 |
| Body | IBM Plex Sans | 15/400, line-height 1.5 |
| Small / meta | IBM Plex Sans | 13 (`.small`), 12 for pills and labels |
| Tab group labels | IBM Plex Sans | 11/600 uppercase, letter-spacing 0.08em |
| Report | System monospace | 13 |

- Headings use `text-wrap: balance`.
- Numbers that line up use `font-variant-numeric: tabular-nums` (`.num`).

### 3.3 Shape and spacing

- Radius: panels 12px, cards and inputs 8 to 10px, pills fully rounded.
- Gaps: 16px between panels, 12px inside panels, 6 to 8px between chips and meta items.
- Max content width 1180px; side gutter 16px at all widths.
- Borders 1px `--line`; emphasis via a 4px left stripe on priority task cards.

---

## 4. Components

| Component | Class | Description |
| --- | --- | --- |
| Panel | `.panel` | White surface, 1px border, 12px radius, vertical stack |
| Task card | `.task` | Title, site meta, action on the right, meta row with tier pill + progress meter. `.prio` adds an accent left stripe; `.isfull` dims it and adds a redirect note |
| Redirect note | `.redirect` | Accent-soft strip: "This one is full. X still needs N more… Help there instead" |
| Pill | `.pill` + `.open` `.verified` `.child` `.priority` `.full` `.risk-high` `.type` | Status labels. Tier pills always use the same three classes |
| Filter chip | `.chip[aria-pressed]` | Toggle filters; pressed = primary fill |
| Meter | `.meter > i` | 6px progress bar; `.good` turns it green at 100% |
| Button | `.btn` + `.ghost` `.warn` `.accent` `.sm` | Primary filled; ghost for secondary; warn for "I need help"; accent for demo/school key actions |
| Profile | `.profile` + `.tiers` | Avatar initials, trust score, three tier boxes (active = `.on`) |
| My task | `.mytask` + `.status.{accepted,onsite,done,overdue}` | Safety card with check-in/out and help actions |
| KPI tile | `.kpi` (`.alert` turns the number red) | Big number + label |
| Bar row | `.barrow` | Label · track · value. Used in fairness comparison (`.hot` red, `.fair` green) and needs lists |
| Room row | `.room` | Room name · photo upload (`label.photo` wrapping a file input) · severity select, colored `.sev-Severe` / `.sev-Moderate` |
| Steps | `.steps li` + `.done` | Numbered stage list; done = green dot with check |
| Rules box | `.rules` | Accent-soft box listing site safety rules |
| Toast | `.toast` | Bottom-center status message, `aria-live="polite"`, auto-hides after 3.6s |

### Trust tier display

| Tier | Label | Pill | Unlocks |
| --- | --- | --- | --- |
| 0 | Open | green | Supervised group tasks |
| 1 | Verified ID | teal | Homes, assets, clinics |
| 2 | Child-safe | marigold | Tasks with pupils present |

A task above the user's tier shows **"Unlock: <tier>"** instead of the accept button. Never hide locked tasks; showing them motivates verification.

---

## 5. Key interaction patterns

**Fair feed ranking.** Open needs sort by priority (see PRODUCT.md §4.2); full needs drop to the bottom with a redirect to the best open alternative of the same kind the user can do.

**Accept → check in → check out.**
```
Accepted ──Check in──▶ On site (expected back by HH:MM) ──Check out──▶ Done (+10 trust)
                              │
                              ├─Simulate overdue──▶ Overdue → alert on Coordinator
                              └─I need help──────▶ alert on Coordinator
```
Supplies are pledged, not checked in.

**Verification.** Verify ID is instant in the prototype (real: MyKad + liveness). Child-safe shows a pending state ("3 to 5 days") with a demo approve button.

**Mode switch.** The header toggle swaps the banner (red disaster / green peacetime), the feed content and the dashboard data. The viral simulation is disabled in peacetime with an explanation.

**School walkthrough.** Adding a photo auto-fills an AI severity suggestion (simulated), labelled as such and editable. "Generate needs list" maps Moderate/Severe rooms to needs and regenerates without losing progress already filled.

**Reopening tracker.** Stages 2, 3 and 5 complete automatically from data; 1 and 4 are manual toggles. "Reopen and notify parents" enables only when stages 1 to 5 are done.

**Demo shortcuts.** Every flow has a clearly labelled "(demo)" or "Simulate…" control so a pitch can run in 2 minutes.

---

## 6. Content and voice

- Write from the user's side: "I'll help", "Check out safely", "Help there instead".
- Controls say exactly what happens: "Reopen and notify parents", not "Submit".
- Mark simulation honestly: "(simulated)", "(demo)", and the footer note.
- Use local, recognizable names and places in examples (SK = Sekolah Kebangsaan, Kampung, Dewan, Klinik Desa). All example data is fictional.
- No emoji as markers; no jargon like "beneficiary" in the volunteer UI.

---

## 7. Accessibility

- Visible focus ring (`3px solid --accent`) on every control.
- Tabs use `aria-current="page"`; toggles and chips use `aria-pressed`.
- Every form control has a label; file inputs and selects have room-specific `aria-label`s.
- Toast is `role="status"` with `aria-live="polite"`.
- Color is never the only signal: pills carry text, stages carry checkmarks.
- Transitions only under `prefers-reduced-motion: no-preference`.
- Layout collapses to one column below 860px; KPI grid to two columns below 700px.

---

## 8. Data model (prototype)

```js
site  = { id, name, type: 'school'|'home'|'shelter'|'clinic', area, overlooked, verifiedBy, mine }
need  = { id, site, title, kind: 'people'|'asset'|'supply', qty, filled, tier: 0|1|2,
          risk: 'low'|'medium'|'high', when, phase: 'disaster'|'peace' }
me    = { name, tier, score, done, assets[], childPending }
myTask = { id, need, status: 'accepted'|'onsite'|'overdue'|'done', due }
school[siteId] = { sev{room}, photos{room}, aiTagged{room}, generated, evacuees, inspection, reopened }
```

State lives in memory and resets on reload. A real build would move this to a backend with per-role access control (volunteers see a home's exact address only while assigned).

---

## 9. Extending to a new mode

To add a mode (e.g. Homes):
1. Add the site type to `SITE_TYPES` and a filter chip.
2. Add a tab group to the right of School mode with its own accent.
3. Reuse panels, task cards, meters, steps and rules box; add only mode-specific rules (e.g. in-home tasks require Verified ID and two volunteers).
4. Feed the mode's needs into the same `needs` list so they rank in Find tasks with everything else.

---

## 10. Known gaps

- No real backend, auth, AI or notifications.
- No offline/SMS, no WhatsApp intake, single language (English).
- Asset needs exist, but volunteers' registered assets aren't matched automatically yet.
- Dashboard "volunteers on site" includes a fixed example baseline.
