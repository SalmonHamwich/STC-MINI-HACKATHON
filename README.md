# ReadyHands — prototype

> The right volunteer, with the right skills and equipment, sent safely to where help is needed.

A mobile-first hackathon prototype of a Malaysian disaster volunteer dispatch platform. The demo follows flood-damaged schools in Selangor, coordinated by the fictional organisation **Harapan Relief**.

**This is a prototype, not a live disaster-response system.** All people, sites and numbers are sample data. See [Limitations](#limitations-and-simulations).

Specs: [PRODUCT.md](PRODUCT.md) (requirements and rules) · [DESIGN.md](DESIGN.md) (screens and tokens) · [VISUAL-DESIGN.md](VISUAL-DESIGN.md) (base visual tokens).

This replaces the earlier `pulih-prototype.html`, which remains in the git history.

## Quick start for judges

You need [Node.js](https://nodejs.org) 20 or newer and git. There is nothing to install and no build step.

```bash
git clone https://github.com/SalmonHamwich/STC-MINI-HACKATHON.git
```

```bash
cd STC-MINI-HACKATHON
```

```bash
npm start
```

Then open http://localhost:5173 in Chrome, Edge, Firefox or Safari. Keep the terminal open while you use the app; press Ctrl+C to stop it.

No git? Use **Code → Download ZIP** on GitHub, unzip, open a terminal in that folder and run `npm start`.

### If it does not load

| What you see | Fix |
| --- | --- |
| A blank page after double-clicking `index.html` | Browsers block the app's scripts when opened as a file. Run `npm start` and use the http://localhost:5173 address instead. |
| `Port 5173 is already in use` | Start on another port. PowerShell: `$env:PORT=3000; npm start`. macOS, Linux or Git Bash: `PORT=3000 npm start`. Then open http://localhost:3000. |
| `npm` or `node` is not recognised | Install Node.js 20 or newer, then open a new terminal. `node server.js` works in place of `npm start`. |
| Old or odd data on screen | Press **Reset demo** in the blue demo bar. Data is kept in the browser only. |

### Tests

```bash
npm test
```

```bash
npm run check
```

`npm test` runs 27 logic tests with Node's built-in test runner. `npm run check` syntax-checks every module.

## Three-minute demo

Switch person with **Viewing as** in the blue demo bar. The same steps are on the Home screen under "3-minute demo guide".

| # | Person | Do this | What it shows |
| --- | --- | --- | --- |
| 1 | Cikgu Rahimah | My posts → Create a post → School damage report → "Use sample answers" → Next ×3 → Send | Damage becomes three posts (cleanup, 4x4 delivery, electrician) |
| 2 | Puan Salmah | Coordinator → Approve all 3 posts | Posts only go live after approval |
| 3 | Aina | My profile → Cleanup, Driving, 4x4 → tick "I will operate" → Save | Skills and assets profile |
| 3 | Faiz | My profile → Electrician → Save → Send Electrician badge for checking | "Not yet checked", badge pending |
| 4 | Aina | Posts | Overlooked school's 4x4 delivery on top, "Matches your 4x4"; full urban cleanup at the bottom with "Help here instead" |
| 5 | Aina | Mud cleanup → Start 2-min training → pass → Request to join; also request the delivery | Training gate |
| 6 | Puan Salmah | Coordinator → Approve badge (demo) for Faiz; then Faiz requests "Check computer lab wiring" | Badge gate |
| 7 | Cikgu Rahimah | My posts → Accept each request | Poster accepts |
| 8 | Aina | My shifts → Check in → Simulate overdue; Puan Salmah sees the alert; Aina checks out | Safety lifecycle |
| 9 | Aina | Posts → Disinfection crew | Blocked by the 8-hour daily limit |
| 10 | Aina | My shifts → My impact → Open certificate | Recognition from recorded hours |
| 11 | Cikgu Rahimah | My posts → SK Kampung Batu Lima → Confirm "Supplies in" | Reopening tracker moves on evidence |

**Reset demo** (demo bar) restores the sample data so the script can be repeated.

## Structure

| File | Purpose |
| --- | --- |
| `index.html`, `styles.css` | Page shell and design tokens (DESIGN.md §2), responsive at 700 / 1024 px |
| `src/logic.js` | Pure rules: eligibility, priority formula, burnout, shift lifecycle, alerts, approvals, damage-to-post suggestions, recovery tracker, recognition |
| `src/data.js` | Fictional seed data, labels (EN/BM), eight training modules |
| `src/ui.js` | Store (localStorage), language, formatting, components, dialog, toast, read aloud |
| `src/views-volunteer.js` | Home, profile, badges, training, post board, post detail, my shifts, recognition, certificate, apply to be a poster |
| `src/views-poster.js` | Create a post, school damage report (5 steps), my posts, site overview and reopening tracker |
| `src/views-admin.js` | Coordinator dashboard |
| `src/app.js` | Routing, layout, accessibility and demo controls, event delegation |
| `tests/logic.test.js` | 27 tests of the rules above |
| `server.js` | Static file server for local use |

## Rules implemented

- **Hard eligibility (PRODUCT §5.1):** every must-have skill and asset, the verified badge, valid training, and rest limits. Optional items only count as a match. Blocked posts stay visible with the reason and the fix.
- **Ranking:** `priority = (unmet / qty) × (overlooked ? 1.6 : 1) × (risk == high ? 1.2 : 1) × (match ? 1.5 : 1)`; `qty ≤ 0` gives 0. Joinable posts first, then blocked, full posts last with a redirect.
- **Burnout (PRODUCT §5.2, placeholders):** 8 h/day, 40 h/7 days, 10 h rest, break prompt after 4 h, rest day after 5 days. Hours come from check-in and check-out. A coordinator can raise the caps for one day (10 h / 44 h) with a recorded reason.
- **Safety:** Requested → Accepted → On site → Checked out. Overdue is more than 30 minutes past the expected check-out. One alert per shift and kind; resolving one never touches another.

Two interpretations worth knowing:

1. The 10-hour rest applies between working days (overnight). Several shifts on one day are limited by the daily cap, which is what the demo script's "third shift today" needs.
2. Accepted shifts later the same day count toward the daily cap, so nobody is accepted into more than they can safely do.

## Limitations and simulations

- No backend, real sign-in, security, messaging, emergency alerts or location tracking. Roles are a navigation choice ("Viewing as").
- Badge verification is a coordinator button labelled "(demo)". No professional body or background check is contacted.
- Time is a demo clock (starts Saturday 21 November 2026, 7:30 am) moved by "+1 hour", "Simulate overdue" and "Skip to end of shift".
- "Demo AI suggestion" is a fixed rule table, not an AI model.
- Training uses illustrated cards with a transcript; there is no video.
- File inputs keep the file name only. Nothing is uploaded.
- "Call", "Ask to rest" and "I need help" change what the demo screens show and nothing else.
- The certificate is a printable page marked SAMPLE (use the browser's "Save as PDF").
- Posts typed by a poster appear in the language they were typed in; built-in sample content is in English and Bahasa Melayu.
- State lives in this browser's localStorage.
- The burnout values are prototype placeholders, not approved medical or operational standards.
