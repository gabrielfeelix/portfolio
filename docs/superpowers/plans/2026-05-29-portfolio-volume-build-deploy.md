# Portfólio "Volume" — Build, Tracking & Deploy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing browser-Babel "Volume" portfolio production-ready — precompiled, fast, tracked, and deployable on Vercel — without changing any motion/experience/content code.

**Architecture:** Static site, no backend/DB. `esbuild` transpiles each `volume/*.jsx` into a classic (non-module) `.js` at build time, preserving the current `window`-sharing + global-function model exactly. React 18 production UMD is vendored locally. A generated `dist/index.html` loads vendor React → precompiled scripts (original order) → analytics snippets. Vercel serves `dist/`.

**Tech Stack:** esbuild, React 18 (production UMD), Vercel Analytics + Speed Insights, Microsoft Clarity, Vercel static hosting.

---

## File Structure

- Create: `package.json` — deps + `build`/`dev` scripts.
- Create: `build.mjs` — esbuild transpile + asset copy + `index.html` generation.
- Create: `index.template.html` — production HTML template (copy of current HTML, placeholder markers for injected scripts).
- Create: `vercel.json` — build command + output dir.
- Create: `.gitignore` — `node_modules/`, `dist/`.
- Create: `.env.example` — documents `CLARITY_ID`.
- Modify: none of `volume/*.jsx` or `volume/*.css` (behavior frozen).
- Delete: all `*:Zone.Identifier` files.

---

## Task 1: Project metadata & cleanup

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Delete: `*:Zone.Identifier`

- [ ] **Step 1: Delete Windows download cruft**

Run:
```bash
cd "/home/gabrielbarbosa/dev/gabriel/portfolio"
find . -name "*:Zone.Identifier" -type f -delete
find . -name "*:Zone.Identifier" | wc -l
```
Expected: `0`

- [ ] **Step 2: Create `.gitignore`**

```
node_modules/
dist/
.env
.DS_Store
*.log
```

- [ ] **Step 3: Create `package.json`**

```json
{
  "name": "portfolio-volume",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "description": "Portfólio de Gabriel Felix Barbosa — em forma de volume de mangá.",
  "scripts": {
    "build": "node build.mjs",
    "dev": "node build.mjs --serve"
  },
  "devDependencies": {
    "esbuild": "^0.24.0"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

- [ ] **Step 4: Install dependencies**

Run: `npm install`
Expected: `node_modules/` created, `react`, `react-dom`, `esbuild` present. Verify:
```bash
ls node_modules/react/umd/react.production.min.js node_modules/react-dom/umd/react-dom.production.min.js
```
Expected: both paths exist (these are the vendored prod builds).

- [ ] **Step 5: Commit**

```bash
git init
git add package.json package-lock.json .gitignore
git commit -m "chore: project metadata, deps, gitignore; remove Windows cruft"
```

---

## Task 2: Production HTML template

**Files:**
- Create: `index.template.html`

The current `Volume - Portfólio.html` loads CDN React dev + Babel and 8 `text/babel` scripts. The template is identical in `<head>`/boot/SVG, but the bottom script block is replaced with injection markers.

- [ ] **Step 1: Create `index.template.html`**

Copy the entire current `Volume - Portfólio.html` content verbatim, then replace the trailing script block (everything from the first `<script src="https://unpkg.com...react...">` through `<script type="text/babel" src="volume/app.jsx"></script>`) with these two marker lines, keeping everything else (the boot `<div>`, the boot `<script>` IIFE, `<div id="root">`, the ink-goo SVG) unchanged:

```html
<!--VENDOR_AND_APP_SCRIPTS-->
<!--ANALYTICS-->
</body>
</html>
```

- [ ] **Step 2: Verify template has no CDN/Babel left**

Run: `grep -E "unpkg|babel|text/babel" index.template.html`
Expected: no output (exit 1).

- [ ] **Step 3: Verify markers present**

Run: `grep -c "VENDOR_AND_APP_SCRIPTS\|ANALYTICS" index.template.html`
Expected: `2`

- [ ] **Step 4: Commit**

```bash
git add index.template.html
git commit -m "feat: production HTML template with injection markers"
```

---

## Task 3: Build script — transpile + vendor + assets

**Files:**
- Create: `build.mjs`

This is the core. It (a) transpiles each jsx as a classic script, (b) copies vendor React, (c) copies assets, (d) generates `index.html` injecting the script tags + analytics, (e) optional `--serve` watch mode.

- [ ] **Step 1: Write `build.mjs`**

```js
import * as esbuild from "esbuild";
import { readFile, writeFile, mkdir, rm, cp } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const DIST = path.join(ROOT, "dist");

// Load order MUST match the original HTML. These share state via window.
const SCRIPTS = [
  "tweaks-panel.jsx",
  "data.jsx",
  "Capa.jsx",
  "Capitulo.jsx",
  "Processo.jsx",
  "Posfacio.jsx",
  "EmpresaPage.jsx",
  "app.jsx",
];

async function clean() {
  await rm(DIST, { recursive: true, force: true });
  await mkdir(path.join(DIST, "volume"), { recursive: true });
  await mkdir(path.join(DIST, "vendor"), { recursive: true });
}

async function transpileScripts() {
  // Each file transpiled INDIVIDUALLY (bundle:false) → classic script output.
  // No import/export in sources, so output is plain global-scope JS, matching
  // the original separate-<script type=text/babel> model exactly.
  await esbuild.build({
    entryPoints: SCRIPTS.map((f) => path.join(ROOT, "volume", f)),
    outdir: path.join(DIST, "volume"),
    outExtension: { ".js": ".js" },
    bundle: false,
    // NOT minifyIdentifiers: top-level names (Capa, CHAPTERS, ...) are shared
    // across files via window/global scope; renaming them breaks the app.
    minifyWhitespace: true,
    minifySyntax: true,
    minifyIdentifiers: false,
    jsx: "transform",
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    loader: { ".jsx": "jsx" },
    target: ["es2018"],
    logLevel: "info",
  });
}

async function copyVendor() {
  const pairs = [
    ["node_modules/react/umd/react.production.min.js", "vendor/react.production.min.js"],
    ["node_modules/react-dom/umd/react-dom.production.min.js", "vendor/react-dom.production.min.js"],
  ];
  for (const [from, to] of pairs) {
    await cp(path.join(ROOT, from), path.join(DIST, to));
  }
}

async function copyAssets() {
  // CSS + fonts + assets live under volume/ and are referenced as volume/...
  for (const dir of ["assets", "fonts"]) {
    const src = path.join(ROOT, "volume", dir);
    if (existsSync(src)) await cp(src, path.join(DIST, "volume", dir), { recursive: true });
  }
  for (const css of ["colors_and_type.css", "kit.css", "chapter.css", "app.css"]) {
    const src = path.join(ROOT, "volume", css);
    if (existsSync(src)) await cp(src, path.join(DIST, "volume", css));
  }
  if (existsSync(path.join(ROOT, "uploads"))) {
    await cp(path.join(ROOT, "uploads"), path.join(DIST, "uploads"), { recursive: true });
  }
}

function analyticsSnippet() {
  const vercel = `
<script defer src="/_vercel/insights/script.js"></script>
<script defer src="/_vercel/speed-insights/script.js"></script>`;
  const id = process.env.CLARITY_ID;
  const clarity = id
    ? `
<script type="text/javascript">
  (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${id}");
</script>`
    : "<!-- Clarity disabled: set CLARITY_ID env to enable -->";
  return vercel + "\n" + clarity;
}

async function generateHtml() {
  const tpl = await readFile(path.join(ROOT, "index.template.html"), "utf8");
  const tags = [
    `<script src="vendor/react.production.min.js"></script>`,
    `<script src="vendor/react-dom.production.min.js"></script>`,
    ...SCRIPTS.map((f) => `<script src="volume/${f.replace(/\.jsx$/, ".js")}"></script>`),
  ].join("\n");
  const html = tpl
    .replace("<!--VENDOR_AND_APP_SCRIPTS-->", tags)
    .replace("<!--ANALYTICS-->", analyticsSnippet());
  await writeFile(path.join(DIST, "index.html"), html);
}

async function buildOnce() {
  await clean();
  await transpileScripts();
  await copyVendor();
  await copyAssets();
  await generateHtml();
  console.log("✓ build → dist/");
}

if (process.argv.includes("--serve")) {
  await buildOnce();
  const ctx = await esbuild.context({
    entryPoints: SCRIPTS.map((f) => path.join(ROOT, "volume", f)),
    outdir: path.join(DIST, "volume"),
    bundle: false, minify: false,
    jsx: "transform", jsxFactory: "React.createElement", jsxFragment: "React.Fragment",
    loader: { ".jsx": "jsx" }, target: ["es2018"],
  });
  await ctx.watch();
  const { host, port } = await ctx.serve({ servedir: DIST, port: 5173 });
  console.log(`dev server: http://localhost:${port}`);
} else {
  await buildOnce();
}
```

- [ ] **Step 2: Run the build**

Run: `npm run build`
Expected: `✓ build → dist/` and esbuild logs 8 files written.

- [ ] **Step 3: Verify output is classic (no module syntax leaked)**

Run:
```bash
grep -lE "^export |^import " dist/volume/*.js
```
Expected: no output (exit 1) — confirms global-scope classic scripts.

- [ ] **Step 4: Verify generated index.html wiring**

Run:
```bash
grep -E "vendor/react|volume/app.js|_vercel/insights" dist/index.html
grep -E "unpkg|text/babel" dist/index.html
```
Expected: first grep shows the three lines; second grep no output.

- [ ] **Step 5: Verify assets copied**

Run:
```bash
ls dist/volume/colors_and_type.css dist/volume/assets/seal.svg dist/volume/fonts/Anton-Regular.ttf dist/vendor/react.production.min.js
```
Expected: all exist.

- [ ] **Step 6: Commit**

```bash
git add build.mjs
git commit -m "feat: esbuild build — transpile jsx, vendor React, copy assets, gen html"
```

---

## Task 4: Manual runtime verification

**Files:** none (verification only).

- [ ] **Step 1: Serve the production build**

Run: `npx serve dist -l 4000` (or `python3 -m http.server 4000 -d dist`)
Then open `http://localhost:4000`.

- [ ] **Step 2: Confirm behavior identical to original**

Checklist (must match the current `Volume - Portfólio.html`):
- Boot loader (`#boot`) appears then resolves (no stuck loader).
- Capa/coverflow renders, hero word-morph cycles.
- Opening a chapter triggers the RTL page-turn + SFX overlay.
- Screentone texture visible; Tweaks panel opens and toggles work.
- No console errors; Network tab shows NO `unpkg.com` / `babel` requests.

- [ ] **Step 3: Confirm no CDN/Babel in served source**

Run: `curl -s http://localhost:4000 | grep -E "unpkg|babel"`
Expected: no output.

> If any behavior differs, STOP — do not proceed. The build must be
> behavior-identical. Debug `build.mjs` (likely jsx settings or load order),
> not the `volume/*.jsx` sources.

---

## Task 5: Vercel config + env docs

**Files:**
- Create: `vercel.json`
- Create: `.env.example`

- [ ] **Step 1: Create `vercel.json`**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": null
}
```

- [ ] **Step 2: Create `.env.example`**

```
# Microsoft Clarity project ID (heatmaps + session recording).
# Create a project at https://clarity.microsoft.com, paste the ID here and as a
# Vercel Environment Variable named CLARITY_ID. Build omits Clarity if unset.
CLARITY_ID=
```

- [ ] **Step 3: Verify build still works with env unset and set**

Run:
```bash
npm run build && grep -c "clarity.ms" dist/index.html
CLARITY_ID=test123 npm run build && grep -c "test123" dist/index.html
```
Expected: first `0` (Clarity omitted), second `1` (snippet injected).

- [ ] **Step 4: Commit**

```bash
git add vercel.json .env.example
git commit -m "feat: vercel build config + Clarity env documentation"
```

---

## Task 6: Documentation & push

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create `README.md`**

```markdown
# Portfólio — Gabriel Felix Barbosa

Portfólio em forma de volume de mangá. SPA React, estático, sem backend.

## Desenvolvimento
\`\`\`bash
npm install
npm run dev      # http://localhost:5173 (watch + serve)
npm run build    # gera dist/
\`\`\`

## Deploy (Vercel)
Importe o repositório na Vercel. O `vercel.json` já define
`buildCommand` e `outputDirectory: dist`. Ative **Web Analytics** e
**Speed Insights** no dashboard do projeto.

### Microsoft Clarity (heatmap / gravação de sessão)
1. Crie um projeto em https://clarity.microsoft.com
2. Adicione a env var `CLARITY_ID` na Vercel (Settings → Environment Variables)
3. Redeploy. Sem a env, o site funciona normal e o Clarity fica desativado.

## Estrutura
- `volume/*.jsx` — componentes React (escopo global compartilhado via window)
- `build.mjs` — transpila, vendoriza React, copia assets, gera `dist/index.html`
- `uploads/` — imagens
- `docs/superpowers/` — spec + plano

## Conteúdo
Textos dos projetos usam placeholders `[assim]` — a preencher.
```

- [ ] **Step 2: Commit docs (spec + plan + readme)**

```bash
git add README.md docs/
git commit -m "docs: readme, design spec, implementation plan"
```

- [ ] **Step 3: Set remote and push**

```bash
git branch -M main
git remote add origin https://github.com/gabrielfeelix/portfolio.git
git push -u origin main
```
Expected: branch `main` pushed. (If the remote has commits, report back before
force-pushing — do NOT overwrite without confirmation.)

- [ ] **Step 4: Report deploy-readiness**

Confirm to the user: repo pushed, ready to import on Vercel; remind them to
enable Analytics/Speed Insights and add `CLARITY_ID` later.

---

## Notes for the executor
- **Never edit `volume/*.jsx` or `volume/*.css`.** Behavior is frozen. Any
  rendering difference is a `build.mjs` bug.
- Load order in `SCRIPTS` is load-bearing — it mirrors the original HTML.
- The git repo is initialized in Task 1 Step 5; earlier commits assume it exists.
