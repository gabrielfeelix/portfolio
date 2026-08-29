import * as esbuild from "esbuild";
import { readFile, writeFile, mkdir, rm, cp, readdir, stat, unlink } from "node:fs/promises";
import http from "node:http";
import { existsSync, watch } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, "dist");

/* O build do site.
 *
 * Até 29/08 este arquivo montava DOIS sites: a V1 (volume/) na raiz e a V2
 * (v2/) sob /v2. Desde então a V2 é o site, mora em site/ e responde em `/`,
 * e a V1 saiu do ar — ficou no repositório, em legado-v1/, sem entrar em
 * build nenhum. Ver legado-v1/README.md.
 *
 * O que sobrou de volume/ NÃO é legado: é o conteúdo e a mídia.
 * `volume/data.jsx` e `volume/i18n.jsx` continuam sendo scripts CLÁSSICOS que
 * publicam tudo em `window` (CHAPTERS, PROJECTS, COMPANIES, ...), e o app lê
 * de lá por site/content.js. As imagens continuam em `/volume/assets/...`,
 * que é o endereço público que já está em preview de link e em print enviado
 * por aí — mexer nisso seria quebrar coisa que está fora do meu alcance.
 */

// Os dois arquivos de conteúdo, transpilados individualmente (bundle:false)
// para continuarem scripts clássicos de escopo global. A ORDEM importa no
// HTML: i18n define LANG e t(), data usa os dois.
const CONTEUDO = ["i18n.jsx", "data.jsx"];

/* A limpeza NÃO leva a mídia junto.
 *
 * Era `rm -rf dist` inteiro, e isso abria uma janela de alguns segundos em que
 * o site existia sem uma única imagem: quem estivesse com a página aberta
 * durante um build via a página inteira quebrada, e as de lazy-load quebravam
 * ao rolar mesmo depois. Foi exatamente o print que o Gabriel mandou em 29/08.
 *
 * Agora o que é gerado morre a cada build (HTML, bundles, CSS) e o que é
 * mídia é SINCRONIZADO: copia o que mudou, apaga o que saiu da origem. São
 * 157 arquivos que raramente mudam — recopiar todos a cada build era o custo
 * que pagava por esse buraco. */
async function clean() {
  const preservar = new Set(["volume"]);
  if (existsSync(DIST)) {
    for (const nome of await readdir(DIST)) {
      if (!preservar.has(nome)) await rm(path.join(DIST, nome), { recursive: true, force: true });
    }
    // de dentro de volume/ só a mídia fica; os .js de conteúdo são gerados.
    const vol = path.join(DIST, "volume");
    if (existsSync(vol)) {
      for (const nome of await readdir(vol)) {
        if (nome !== "assets" && nome !== "fonts") {
          await rm(path.join(vol, nome), { recursive: true, force: true });
        }
      }
    }
  }
  await mkdir(path.join(DIST, "volume"), { recursive: true });
  await mkdir(path.join(DIST, "vendor"), { recursive: true });
}

/* Espelha `origem` em `destino`: copia arquivo novo ou mudado (tamanho ou
   mtime), e apaga do destino o que não existe mais na origem. */
async function sincronizar(origem, destino) {
  await mkdir(destino, { recursive: true });
  const naOrigem = new Set();
  for (const e of await readdir(origem, { withFileTypes: true })) {
    const de = path.join(origem, e.name);
    const para = path.join(destino, e.name);
    naOrigem.add(e.name);
    if (e.isDirectory()) {
      await sincronizar(de, para);
      continue;
    }
    let precisa = true;
    if (existsSync(para)) {
      const [a, b] = [await stat(de), await stat(para)];
      precisa = a.size !== b.size || a.mtimeMs > b.mtimeMs;
    }
    if (precisa) await cp(de, para);
  }
  if (existsSync(destino)) {
    for (const e of await readdir(destino, { withFileTypes: true })) {
      if (naOrigem.has(e.name)) continue;
      const sobra = path.join(destino, e.name);
      if (e.isDirectory()) await rm(sobra, { recursive: true, force: true });
      else await unlink(sobra);
    }
  }
}

async function transpileConteudo() {
  await esbuild.build({
    entryPoints: CONTEUDO.map((f) => path.join(ROOT, "volume", f)),
    outdir: path.join(DIST, "volume"),
    bundle: false,
    // NOT minifyIdentifiers: os nomes de topo (CHAPTERS, PROJECTS, t, ...) são
    // o contrato com o app, publicados via window. Renomear quebra tudo.
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
  // Imagens e fontes continuam servidas de /volume/, que é o endereço que o
  // conteúdo escreve e que já circula em preview de link.
  for (const dir of ["assets", "fonts"]) {
    const src = path.join(ROOT, "volume", dir);
    if (existsSync(src)) await sincronizar(src, path.join(DIST, "volume", dir));
  }
  // llms.txt e robots.txt vão para a raiz do site. Sem isso o rewrite do
  // vercel.json devolve o index.html para /llms.txt, e o validador lê HTML
  // onde esperava markdown.
  for (const f of ["llms.txt", "robots.txt"]) {
    const src = path.join(ROOT, f);
    if (existsSync(src)) await cp(src, path.join(DIST, f));
  }
  if (existsSync(path.join(ROOT, "uploads"))) {
    await sincronizar(path.join(ROOT, "uploads"), path.join(DIST, "uploads"));
  }
}

/* O sitemap.
 *
 * robots.txt aponta para ele desde sempre e o arquivo nunca existiu — dava
 * 404. Agora ele é gerado com as rotas que existem de verdade, lidas do mesmo
 * CASE_ORDER que o app usa, para não virar lista escrita à mão que envelhece
 * sozinha. */
const SITE = "https://gabrielfelix-ux.4yu.com.br";

async function buildSitemap() {
  const fonte = await readFile(path.join(ROOT, "volume", "data.jsx"), "utf8");
  const m = fonte.match(/const CASE_ORDER = \[([^\]]*)\]/);
  const casos = m ? Array.from(m[1].matchAll(/"([\w-]+)"/g)).map((x) => x[1]) : [];
  const rotas = ["/", "/processo", "/sobre", ...casos.map((id) => `/case/${id}`)];
  const hoje = new Date().toISOString().slice(0, 10);
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    rotas.map((r) =>
      `  <url><loc>${SITE}${r}</loc><lastmod>${hoje}</lastmod>` +
      `<priority>${r === "/" ? "1.0" : "0.8"}</priority></url>`).join("\n") +
    `\n</urlset>\n`;
  await writeFile(path.join(DIST, "sitemap.xml"), xml);
  if (!casos.length) console.warn("! sitemap sem casos: CASE_ORDER não foi lido de volume/data.jsx");
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

/* ------------------------------ o site ------------------------------ */

// O app usa o MESMO React que já é vendorizado como UMD. Sem isto o bundle
// traria uma segunda cópia do React (~45 KB gz) e, pior, `data.js` rodaria
// contra window.React enquanto os componentes rodariam contra outra
// instância. Aqui `react` e `react-dom` resolvem para os globais.
// A lista de exports NÃO é escrita à mão: uma lista curta quebra assim que uma
// dependência importa algo fora dela (motion importa Component e
// useInsertionEffect, por exemplo). Aqui os nomes vêm do próprio pacote
// instalado, então o shim acompanha a versão do React sem manutenção.
const exigir = createRequire(import.meta.url);
const nomesExportados = (mod) =>
  Object.keys(exigir(mod)).filter((k) => /^[A-Za-z_$][\w$]*$/.test(k) && k !== "default");

const reactGlobais = {
  name: "react-globais",
  setup(b) {
    b.onResolve({ filter: /^(react|react-dom|react-dom\/client)$/ }, (a) => ({
      path: a.path,
      namespace: "react-global",
    }));
    b.onLoad({ filter: /.*/, namespace: "react-global" }, (a) => {
      const ehReact = a.path === "react";
      const glob = ehReact ? "React" : "ReactDOM";
      const nomes = nomesExportados(ehReact ? "react" : "react-dom/client");
      const linhas = nomes.map((n) => `export const ${n} = G.${n};`).join("\n");
      return {
        contents:
          `const G = window.${glob};\n` +
          `if (!G) throw new Error('window.${glob} ausente. O vendor UMD carregou depois do app?');\n` +
          `export default G;\n` +
          linhas + "\n",
      };
    });
  },
};

const appOpcoes = (dev) => ({
  entryPoints: [path.join(ROOT, "site", "app.jsx")],
  outfile: path.join(DIST, "app.js"),
  bundle: true,
  format: "iife",
  plugins: [reactGlobais],
  jsx: "transform",
  jsxFactory: "React.createElement",
  jsxFragment: "React.Fragment",
  loader: { ".jsx": "jsx" },
  target: ["es2018"],
  minify: !dev,
  sourcemap: dev,
  logLevel: "info",
});

async function buildCss() {
  // Um arquivo só, na ordem em que os tokens precisam existir antes do resto.
  const ordem = ["tokens.css", "kit.css", "shell.css", "home.css", "case.css", "processo.css", "sobre.css"];
  const partes = [];
  for (const css of ordem) {
    const src = path.join(ROOT, "site", css);
    if (existsSync(src)) partes.push(`/* ---- ${css} ---- */\n` + (await readFile(src, "utf8")));
  }
  const out = await esbuild.transform(partes.join("\n"), { loader: "css", minify: true });
  await writeFile(path.join(DIST, "site.css"), out.code);
}

async function buildHtml() {
  const tpl = await readFile(path.join(ROOT, "site", "index.template.html"), "utf8");
  // A ordem é o contrato: React global, depois i18n e data (que publicam em
  // window), só então o app, que lê window.CHAPTERS. `defer` preserva a ordem
  // entre eles e não trava o parser.
  const tags = [
    `<script defer src="/vendor/react.production.min.js"></script>`,
    `<script defer src="/vendor/react-dom.production.min.js"></script>`,
    `<script defer src="/volume/i18n.js"></script>`,
    `<script defer src="/volume/data.js"></script>`,
    `<script defer src="/app.js"></script>`,
  ].join("\n");
  const html = tpl
    .replace("<!--SCRIPTS-->", tags)
    .replace("<!--ANALYTICS-->", analyticsSnippet());
  await writeFile(path.join(DIST, "index.html"), html);
}

async function buildOnce() {
  await clean();
  await transpileConteudo();
  await bundleAnalytics();
  await copyVendor();
  await copyAssets();
  await buildSitemap();
  await esbuild.build(appOpcoes(false));
  await buildCss();
  await buildHtml();
  console.log("✓ build → dist/");
}

if (process.argv.includes("--serve")) {
  await buildOnce();
  // O conteúdo continua transpilado um a um, fora do bundle.
  const ctxConteudo = await esbuild.context({
    entryPoints: CONTEUDO.map((f) => path.join(ROOT, "volume", f)),
    outdir: path.join(DIST, "volume"),
    bundle: false, minifyWhitespace: false, minifySyntax: false, minifyIdentifiers: false,
    jsx: "transform", jsxFactory: "React.createElement", jsxFragment: "React.Fragment",
    loader: { ".jsx": "jsx" }, target: ["es2018"],
  });
  await ctxConteudo.watch();
  const ctxApp = await esbuild.context(appOpcoes(true));
  await ctxApp.watch();
  // O esbuild só vigia o grafo do bundle, e o CSS é concatenado à mão.
  // Sem este watch, editar tokens/shell/home.css não muda nada no dev e é um
  // engano caro de depurar: o JS recarrega, o CSS fica velho.
  {
    const dir = path.join(ROOT, "site");
    let pendente = null;
    watch(dir, (_ev, arquivo) => {
      if (!arquivo || !arquivo.endsWith(".css")) return;
      clearTimeout(pendente);
      pendente = setTimeout(() => {
        buildCss().then(() => console.log("[watch] site.css atualizado")).catch((e) => console.error(e));
      }, 60);
    });
  }
  // esbuild serve numa porta interna; o proxy na frente devolve index.html
  // para path que não é arquivo, que é o mesmo fallback do vercel.json. Sem
  // isso /case/pcyes dá 404 no dev e só funciona em produção.
  const { host: iHost, port: iPort } = await ctxConteudo.serve({ servedir: DIST, port: 0 });
  const wanted = Number(process.env.PORT) || 5173;
  const proxy = http.createServer((req, res) => {
    const enc = (p) => http.request(
      { hostname: iHost, port: iPort, path: p, method: req.method, headers: req.headers },
      (up) => {
        if (up.statusCode === 404 && !path.extname(req.url.split("?")[0])) {
          // rota do SPA: serve o index e deixa o app decidir a view.
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
