# SchoolBridge website

An accessible school recovery and volunteer dispatch prototype built with HTML, CSS, and plain JavaScript.

## Run locally

Open `dist/index.html` in a modern browser, or serve the site from the repository root:

```sh
python3 -m http.server 4173 --directory dist
```

Then open http://localhost:4173. No dependency installation or build step is needed. The CSS requests optional Google Fonts; system fonts are used when they are unavailable.

## Files

- `dist/index.html`: page shell and shared navigation.
- `dist/style.css`: responsive styles and accessibility modes.
- `dist/app.js`: guided reports, profiles, matching, coordinator review, pledges, learning plans, and safety interactions.
- `product.md`: requirements, current scope, and known limitations.
- `DESIGN.md` and `VISUAL-DESIGN.md`: design documentation.
- `.vscode/settings.json`: formatting and word-wrap preferences; formatting uses the Prettier extension when installed.

## Prototype boundaries

This is a browser-local demo with no backend or application role authentication. AI suggestions are simulated. Photos are not uploaded, no volunteer dispatch or notifications are sent, and professional credentials are not verified. Do not enter sensitive or real child-related information.

Professional inspection is required for building and electrical damage. Scores and matching do not establish safety or authorize reopening. See `product.md` for the complete limitations, including the illustrative draft learning-plan score behavior.

## Hosting

Deploy the contents of `dist/` to a static website host. The existing private Sites deployment configuration is environment-specific and is not included in this GitHub branch.
