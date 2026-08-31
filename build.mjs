import * as esbuild from "esbuild";
import { readFile, writeFile, mkdir, rm, cp, readdir, stat, unlink } from "node:fs/promises";
import http from "node:http";
import { existsSync, watch } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { lerPosts, escreverBlog, DIR_POSTS } from "./blog.mjs";

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
// para continuarem scripts clássicos de escopo global. Esta lista é só o que
// transpilar; a ordem que importa é a das tags, em buildHtml().
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

async function buildSitemap(posts = []) {
  const fonte = await readFile(path.join(ROOT, "volume", "data.jsx"), "utf8");
  const m = fonte.match(/const CASE_ORDER = \[([^\]]*)\]/);
  const casos = m ? Array.from(m[1].matchAll(/"([\w-]+)"/g)).map((x) => x[1]) : [];
  const hoje = new Date().toISOString().slice(0, 10);

  /* Cada rota leva o lastmod que ela tem de verdade: o post traz a data dele,
     o resto traz a data do build. Post com lastmod de hoje toda vez que o
     site sobe é o que ensina o buscador a ignorar o campo. */
  const rotas = [
    { loc: "/", pri: "1.0", mod: hoje },
    { loc: "/processo", pri: "0.8", mod: hoje },
    { loc: "/sobre", pri: "0.8", mod: hoje },
    ...casos.map((id) => ({ loc: `/case/${id}`, pri: "0.8", mod: hoje })),
    ...(posts.length ? [{ loc: "/blog", pri: "0.8", mod: posts[0].data }] : []),
    ...posts.map((p) => ({ loc: `/blog/${p.slug}`, pri: "0.7", mod: p.data })),
  ];

  /* CADA rota entra DUAS vezes, uma por idioma, e as duas se declaram
     traduções uma da outra por `xhtml:link`.
   *
     Sem os alternates o Google vê dois endereços com o mesmo desenho e o
     mesmo assunto e trata um deles como duplicata — que é exatamente o
     contrário do que se quer: a versão inglesa existe para ser encontrada por
     quem procura em inglês. Com eles, ele entende que são a mesma página em
     duas línguas e serve a certa para cada pessoa.
   *
     A regra de ouro do hreflang é que ele é RECÍPROCO: cada URL lista as duas,
     inclusive a si mesma. Uma versão que aponta para a outra sem receber a
     volta é ignorada em silêncio. Por isso o bloco de alternates é o mesmo nos
     dois <url>, e não uma referência cruzada.
   *
     `x-default` é o português: é a língua da casa e o endereço sem prefixo,
     que é o que já está indexado e circulando. */
  const en = (loc) => (loc === "/" ? "/en" : "/en" + loc);
  const alternates = (r) =>
    `<xhtml:link rel="alternate" hreflang="pt-BR" href="${SITE}${r.loc}"/>` +
    `<xhtml:link rel="alternate" hreflang="en" href="${SITE}${en(r.loc)}"/>` +
    `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${r.loc}"/>`;

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"` +
    ` xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    rotas.flatMap((r) => [
      `  <url><loc>${SITE}${r.loc}</loc><lastmod>${r.mod}</lastmod>` +
      `<priority>${r.pri}</priority>${alternates(r)}</url>`,
      `  <url><loc>${SITE}${en(r.loc)}</loc><lastmod>${r.mod}</lastmod>` +
      `<priority>${r.pri}</priority>${alternates(r)}</url>`,
    ]).join("\n") +
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
  const ordem = ["tokens.css", "kit.css", "shell.css", "home.css", "case.css", "processo.css", "sobre.css", "blog.css", "cursor.css"];
  const partes = [];
  for (const css of ordem) {
    const src = path.join(ROOT, "site", css);
    if (existsSync(src)) partes.push(`/* ---- ${css} ---- */\n` + (await readFile(src, "utf8")));
  }
  const out = await esbuild.transform(partes.join("\n"), { loader: "css", minify: true });
  await writeFile(path.join(DIST, "site.css"), out.code);
}

/* A cortina entra INLINE no <head>, e não como arquivo externo.

   São poucos KB, e a cortina de troca de página não pode chegar depois do
   primeiro clique: se ela viesse por <link>, o primeiro link clicado trocaria
   de rota sem lâmina nenhuma. Junto vai a calha da barra de rolagem, que
   precisa valer no primeiro quadro (ver carregando.css).

   Aqui morava também a tela de carregamento — desenho, estilo e motor, os três
   inline pelo mesmo motivo. Ela saiu em 29/08 a pedido do Gabriel: o site abre
   direto. */
async function inline() {
  const css = await readFile(path.join(ROOT, "site", "carregando.css"), "utf8");
  const cssMin = (await esbuild.transform(css, { loader: "css", minify: true })).code;
  return `<style>${cssMin}</style>`;
}

async function buildHtml() {
  const tpl = await readFile(path.join(ROOT, "site", "index.template.html"), "utf8");
  const estiloInline = await inline();
  /* A ordem é o contrato: React global, depois DATA e só então I18N, e por
     último o app, que lê window.CHAPTERS. `defer` preserva a ordem entre eles
     e não trava o parser.

     DATA ANTES DE I18N, e isto já foi ao contrário: i18n.jsx declara LANG e
     t(), então parecia óbvio que ele viesse primeiro. Só que o corpo dele
     MUTA `CHAPTERS` e `PROJECTS`, que quem declara é data.jsx. Rodando antes,
     ele estourava `CHAPTERS is not defined` na primeira linha do bloco EN e
     morria ali — em português ninguém via, porque o bloco inteiro está dentro
     de um `if (LANG === "en")` que nunca abria. Em inglês, NENHUM espelho era
     aplicado: o site carregava em PT com <html lang="en">, e nem `window.LANG`
     chegava a ser publicado, porque o Object.assign do fim do arquivo ficava
     depois da exceção.

     Invertido não quebra nada em data.jsx: os três `t()` e o único `LANG` de
     lá estão todos dentro de corpo de função, resolvidos na hora da chamada e
     não na hora do load. E os dois continuam sendo scripts clássicos, que
     dividem o mesmo escopo léxico global — é por isso que i18n.jsx alcança o
     `const CHAPTERS` do outro arquivo por referência nua. */
  const tags = [
    `<script defer src="/vendor/react.production.min.js"></script>`,
    `<script defer src="/vendor/react-dom.production.min.js"></script>`,
    `<script defer src="/volume/data.js"></script>`,
    `<script defer src="/volume/i18n.js"></script>`,
    `<script defer src="/app.js"></script>`,
  ].join("\n");
  const html = tpl
    .replace("<!--CORTINA-CSS-->", estiloInline)
    .replace("<!--SCRIPTS-->", tags)
    .replace("<!--ANALYTICS-->", analyticsSnippet());
  await writeFile(path.join(DIST, "index.html"), html);
}

/* O blog roda ANTES do bundle: `escreverBlog` grava site/posts.gerado.js, que
   site/blog.js importa e o esbuild embute. Invertida, a ordem produziria um
   app.js com o índice do build anterior — erro que só aparece no segundo
   build depois de publicar um post, que é o pior momento para descobrir. */
async function buildBlog(dev) {
  const posts = await lerPosts(ROOT, { dev });
  const indice = await escreverBlog(ROOT, DIST, posts);
  const rascunhos = posts.length - posts.filter((p) => p.publicado).length;
  console.log(`  blog: ${indice.length} post(s)` + (rascunhos ? `, ${rascunhos} em rascunho` : ""));
  return indice;
}

async function buildOnce(dev = false) {
  await clean();
  await transpileConteudo();
  await bundleAnalytics();
  await copyVendor();
  await copyAssets();
  const posts = await buildBlog(dev);
  await buildSitemap(posts);
  await esbuild.build(appOpcoes(dev));
  await buildCss();
  await buildHtml();
  console.log("✓ build → dist/");
}

if (process.argv.includes("--serve")) {
  await buildOnce(true);
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
    // carregando.css entra inline no index.html (ver `inline`), então editar
    // ele pede um HTML novo, não um site.css novo.
    let pendente = null;
    watch(dir, (_ev, arquivo) => {
      if (!arquivo) return;
      const dec = arquivo === "carregando.css";
      if (!dec && !arquivo.endsWith(".css")) return;
      clearTimeout(pendente);
      pendente = setTimeout(() => {
        const tarefa = dec
          ? buildHtml().then(() => console.log("[watch] index.html atualizado"))
          : buildCss().then(() => console.log("[watch] site.css atualizado"));
        tarefa.catch((e) => console.error(e));
      }, 60);
    });
  }
  /* Os .md também ficam fora do grafo do esbuild: quem os lê é o blog.mjs, no
     build. Sem este watch, escrever um post no dev não muda nada na tela — e
     como o erro é silencioso (a página velha continua lá), é engano caro.
     Regravar posts.gerado.js faz o esbuild reconstruir o app sozinho. */
  {
    const dir = path.join(ROOT, DIR_POSTS);
    if (existsSync(dir)) {
      let pendente = null;
      watch(dir, () => {
        clearTimeout(pendente);
        pendente = setTimeout(() => {
          buildBlog(true)
            .then((posts) => buildSitemap(posts))
            .then(() => console.log("[watch] blog atualizado"))
            .catch((e) => console.error("! blog:", e.message));
        }, 80);
      });
    }
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
