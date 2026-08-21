import * as esbuild from "esbuild";
import { readFile, writeFile, mkdir, rm, cp } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, "dist");

// Load order MUST match the original HTML. These share state via window.
const SCRIPTS = [
  "tweaks-panel.jsx",
  "data.jsx",
  "i18n.jsx",
  "organic.jsx",
  "cursor.jsx",
  "RevealMask.jsx",
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
  for (const css of ["colors_and_type.css", "kit.css", "chapter.css", "app.css", "organic.css"]) {
    const src = path.join(ROOT, "volume", css);
    if (existsSync(src)) await cp(src, path.join(DIST, "volume", css));
  }
  if (existsSync(path.join(ROOT, "uploads"))) {
    await cp(path.join(ROOT, "uploads"), path.join(DIST, "uploads"), { recursive: true });
  }
}

async function bundleAnalytics() {
  // Bundle @vercel/analytics + @vercel/speed-insights into one classic script.
  await esbuild.build({
    entryPoints: [path.join(ROOT, "analytics", "entry.js")],
    outfile: path.join(DIST, "analytics.js"),
    bundle: true,
    minify: true,
    format: "iife",
    target: ["es2018"],
    logLevel: "info",
  });
}

function analyticsSnippet() {
  const vercel = `\n<script defer src="/analytics.js"></script>`;
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
    `<script src="/vendor/react.production.min.js"></script>`,
    `<script src="/vendor/react-dom.production.min.js"></script>`,
    ...SCRIPTS.map((f) => `<script src="/volume/${f.replace(/\.jsx$/, ".js")}"></script>`),
  ].join("\n");
  const html = tpl
    .replace("<!--VENDOR_AND_APP_SCRIPTS-->", tags)
    .replace("<!--ANALYTICS-->", analyticsSnippet());
  await writeFile(path.join(DIST, "index.html"), html);
}

async function buildOnce() {
  await clean();
  await transpileScripts();
  await bundleAnalytics();
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
    bundle: false, minifyWhitespace: false, minifySyntax: false, minifyIdentifiers: false,
    jsx: "transform", jsxFactory: "React.createElement", jsxFragment: "React.Fragment",
    loader: { ".jsx": "jsx" }, target: ["es2018"],
  });
  await ctx.watch();
  const { port } = await ctx.serve({ servedir: DIST, port: 5173 });
  console.log(`dev server: http://localhost:${port}`);
} else {
  await buildOnce();
}
