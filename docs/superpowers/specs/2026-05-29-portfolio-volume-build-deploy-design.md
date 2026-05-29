# Portfólio "Volume" — Build, Tracking & Deploy

**Date:** 2026-05-29
**Author:** Gabriel Felix Barbosa (with Claude)
**Status:** Approved

## Goal

Make the existing "Volume" manga-themed portfolio production-ready: fast boot,
deployable on Vercel, with visitor tracking — **without changing any of the
current motion/experience or content code**.

## Context

The project is a single-page React app authored as a set of `.jsx` files loaded
in the browser via React UMD (CDN, dev build) + `@babel/standalone` compiling
JSX **in the browser**. This makes boot slow and ships a dev React build.

Key structural fact (constrains the migration):
- Each `<script type="text/babel">` is a **separate program**. Files share state
  only through `window` — `data.jsx` and every component file end with
  `Object.assign(window, {...})`, and top-level `function` declarations attach to
  `window` automatically (classic-script semantics).
- There is **no** `import`/`export` anywhere.
- Load order matters: `tweaks-panel → data → Capa → Capitulo → Processo →
  Posfacio → EmpresaPage → app`. `app.jsx` ends with
  `ReactDOM.createRoot(...).render(<App />)`.

## Decisions

- **Build:** Precompile, behavior-preserving. No ESM rewrite.
- **Tracking:** Vercel Analytics + Vercel Speed Insights + Microsoft Clarity.
- **Backend/DB:** None. Contacts stay as direct links (WhatsApp/email/LinkedIn/Instagram).

## Architecture

Static site. No server, no database.

### Build pipeline (`build.mjs`, esbuild)
1. Transpile each `volume/*.jsx` → `dist/volume/*.js` individually
   (`bundle: false`, JSX → `React.createElement` / `React.Fragment`).
   - **Critical:** emit as classic scripts (no import/export wrapper, no IIFE)
     so global `function` declarations and `window` sharing behave identically
     to the current Babel-standalone setup. Sources have no import/export, so
     output is plain JS.
2. Vendor React 18 + ReactDOM **production** UMD builds into
   `dist/vendor/` (copied from `node_modules`). No CDN at runtime.
3. Generate `dist/index.html` from the production HTML template: same `<head>`,
   same boot loader, same SVG ink filter — but the script tags become:
   `vendor/react.production.min.js` → `vendor/react-dom.production.min.js` →
   each precompiled `volume/*.js` (classic `<script>`, original order) →
   analytics snippets.
4. Copy static assets: `volume/*.css`, `volume/fonts/`, `volume/assets/`, and
   `uploads/` into `dist/` preserving the `volume/...` relative paths the code
   and CSS already reference.

### Tracking
- **Vercel Analytics:** `<script defer src="/_vercel/insights/script.js">`.
- **Vercel Speed Insights:** `<script defer src="/_vercel/speed-insights/script.js">`.
- **Microsoft Clarity:** standard snippet, project ID injected from
  `CLARITY_ID` env at build time. If the env var is absent, the snippet is
  omitted (no broken script). User creates the Clarity project and supplies the
  ID later (set as a Vercel env var).

### Deploy
- `vercel.json`: `buildCommand: "npm run build"`, `outputDirectory: "dist"`,
  framework "Other" (no preset).
- `package.json`: deps `esbuild`, `react`, `react-dom`; scripts:
  - `build` → `node build.mjs`
  - `dev` → `node build.mjs --serve` (esbuild watch + local static server)

### Cleanup
- Delete all `*:Zone.Identifier` files (Windows download cruft).
- `.gitignore`: `node_modules/`, `dist/`.
- `git init`, commit, push to `https://github.com/gabrielfeelix/portfolio`.

## Out of scope (do later, together)
- Real project content, case copy, and images (placeholders `[assim]` stay).
- Contact email value (currently `[email@exemplo.com]`).
- Clarity project creation / ID.

## Success criteria
- `npm install && npm run build` produces `dist/` that renders the portfolio
  **pixel- and motion-identical** to the current browser-Babel version.
- No CDN/Babel at runtime; React production build served locally.
- Analytics snippets present (Clarity gated on env).
- Pushed to GitHub, ready for Vercel import.
```

## Verification (manual)
- Serve `dist/` locally, confirm: boot loader resolves, coverflow, page-turn
  transitions, tweaks panel, screentone, hero word-morph all behave as before.
- View source: no `unpkg.com`, no `babel`, no `type="text/babel"`.
