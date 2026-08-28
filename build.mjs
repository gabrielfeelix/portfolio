import * as esbuild from "esbuild";
import { readFile, writeFile, mkdir, rm, cp } from "node:fs/promises";
import http from "node:http";
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
  "BookSlider.jsx",
  "Capa.jsx",
  "Capitulo.jsx",
  "Processo.jsx",
  "Posfacio.jsx",
  "EmpresaPage.jsx",
  "app.jsx",
];

// Estes sao transpilados igual aos outros, mas NAO entram no HTML inicial:
// o app carrega sob demanda quando a rota precisa (ver `garantirRota` em
// app.jsx). Sao 86 KB que a home nunca usa -- o Lighthouse media 74 KB de
// Capitulo.js sem uso na primeira tela.
// A ordem aqui e a ordem de insercao: RevealMask antes de Capitulo, porque
// Capitulo usa RevealMask no escopo global.
const SCRIPTS_SOB_DEMANDA = ["Capitulo.jsx", "EmpresaPage.jsx"];

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
  // CSS: os cinco arquivos viram UM, minificado. Eram cinco requisicoes
  // que bloqueavam a renderizacao e iam sem minificar (241 KB); o Lighthouse
  // cobrava isso em "solicitacoes que bloquearam a renderizacao".
  // A ORDEM importa: colors_and_type define os tokens que os outros usam,
  // e app.css/organic.css sobrescrevem chapter.css em varios pontos.
  // As urls de fonte sao relativas a volume/, e o arquivo final tambem
  // mora em volume/, entao `fonts/...` continua resolvendo.
  const cssOrder = ["colors_and_type.css", "kit.css", "chapter.css", "app.css", "organic.css"];
  const cssParts = [];
  for (const css of cssOrder) {
    const src = path.join(ROOT, "volume", css);
    if (existsSync(src)) cssParts.push(`/* ---- ${css} ---- */\n` + (await readFile(src, "utf8")));
  }
  const cssOut = await esbuild.transform(cssParts.join("\n"), {
    loader: "css", minify: true,
  });
  await writeFile(path.join(DIST, "volume", "volume.css"), cssOut.code);
  // llms.txt e robots.txt vao para a raiz do site. Sem isso o rewrite do
  // vercel.json devolve o index.html para /llms.txt, e o validador le HTML
  // onde esperava markdown.
  for (const f of ["llms.txt", "robots.txt"]) {
    const src = path.join(ROOT, f);
    if (existsSync(src)) await cp(src, path.join(DIST, f));
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
  // `defer` em TODOS: eram 14 scripts sincronos que travavam o parser antes
  // do primeiro paint. defer preserva a ordem de execucao entre eles, que e
  // exatamente o contrato desta base (os arquivos compartilham estado via
  // window e nao ha import/export), e so roda depois do HTML pronto.
  const tags = [
    `<script defer src="/vendor/react.production.min.js"></script>`,
    `<script defer src="/vendor/react-dom.production.min.js"></script>`,
    ...SCRIPTS.filter((f) => !SCRIPTS_SOB_DEMANDA.includes(f))
      .map((f) => `<script defer src="/volume/${f.replace(/\.jsx$/, ".js")}"></script>`),
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
  // esbuild serve numa porta interna; o proxy na frente devolve index.html
  // para path que nao e arquivo, que e o mesmo fallback do vercel.json. Sem
  // isso /cap/pcyes da 404 no dev e so funciona em producao.
  const { host: iHost, port: iPort } = await ctx.serve({ servedir: DIST, port: 0 });
  const wanted = Number(process.env.PORT) || 5173;
  const proxy = http.createServer((req, res) => {
    const enc = (p) => http.request(
      { hostname: iHost, port: iPort, path: p, method: req.method, headers: req.headers },
      (up) => {
        if (up.statusCode === 404 && !path.extname(req.url.split("?")[0])) {
          // rota do SPA: serve o index e deixa o app.jsx decidir a view
          return enc("/index.html").end();
        }
        res.writeHead(up.statusCode, up.headers);
        up.pipe(res, { end: true });
      });
    req.pipe(enc(req.url), { end: true });
  });
  const port = await new Promise((ok, no) => {
    proxy.once("error", (err) => {
      if (!/EADDRINUSE/.test(err.code || "")) return no(err);
      console.log(`porta ${wanted} ocupada, escolhendo outra…`);
      proxy.listen(0, () => ok(proxy.address().port));
    });
    proxy.listen(wanted, () => ok(proxy.address().port));
  });
  console.log(`dev server: http://localhost:${port}`);
} else {
  await buildOnce();
}
