import * as esbuild from "esbuild";
import { readFile, writeFile, mkdir, rm, cp, readdir, stat, unlink } from "node:fs/promises";
import http from "node:http";
import { existsSync, watch } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import vm from "node:vm";
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
const CONTEUDO = ["i18n.jsx", "i18n.en.jsx", "data.jsx"];

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

/* consent.js fica fora do bundle do app e vai INLINE no HTML: ele precisa ser
   síncrono e rodar antes do gtag, e nada que dependa do React pode chegar
   antes dele. Passa pelo esbuild só para minificar.

   Era um <script src> síncrono até 31/08, e o custo disso não estava à vista:
   script síncrono TRAVA O PARSER, e script `defer` só executa quando o parser
   chega ao fim do documento. Como o consent.js mora no fim do body, depois das
   cinco tags de <!--SCRIPTS-->, a rede dele entrava na frente da execução de
   TODAS elas. Medido em 31/08 na garganta de 1,6 Mbps: ele terminava aos
   951ms, e o app só começava depois. São 2 KB comprimidos — inline não custa
   ida à rede nenhuma e a ordem de execução é exatamente a mesma. */
async function buildConsent() {
  const saida = await esbuild.build({
    entryPoints: [path.join(ROOT, "site", "consent.js")],
    write: false,
    bundle: false,
    minify: true,
    format: "iife",
    target: ["es2018"],
  });
  return saida.outputFiles[0].text;
}

/* O measurement ID fica escrito aqui, e não numa env, de propósito: ele é
   público (vai no HTML de toda página) e é fixo. Numa env, esquecer de
   definir na Vercel derrubaria a medição em silêncio, e a falta só apareceria
   semanas depois num relatório vazio. O Clarity fica em env porque o ID dele
   ainda pode mudar de projeto. */
const GA4_ID = "G-5VPYQ2C9RT"; // "Portfólio Gabriel Felix", properties/552169302

function analyticsSnippet(codigoConsent) {
  const vercel = `\n<script defer src="/analytics.js"></script>`;

  /* Propriedade GA4 só do portfólio, separada da "Propriedade - 4YU": é a
     regra do playbook do 4yu, uma propriedade por produto. Com o portfólio
     despejando junto com os apps, "usuários ativos" viraria um número que não
     responde nada — e dado misturado não se separa depois.

     `send_page_view: false` não é preferência. O site é uma SPA, e o
     page_view automático do GA4 dispara no history change, antes de o React
     atualizar `document.title`: cada página entraria no relatório com o
     título da anterior. O disparo automático foi desligado também do lado do
     fluxo de dados (Enhanced Measurement → page changes), e quem manda o
     evento é o efeito de rota de site/app.jsx, depois do título pronto.

     Este bloco sai antes dos `defer` de <!--SCRIPTS--> na execução, mesmo
     estando depois deles no HTML: script inline roda durante o parse e defer
     só roda no fim. Por isso `window.gtag` já existe quando o app monta. */
  /* O gtag.js é BAIXADO DEPOIS do load, e nenhum evento se perde nisso.
     `window.gtag` é a função inline daqui, que só empilha em `dataLayer`; o
     arquivo do Google chega depois e processa a fila inteira de uma vez. O
     page_view que o efeito de rota manda durante o carregamento fica lá
     esperando.

     O motivo é peso: o gtag.js são 153 KB, o maior recurso de terceiro da
     página, e no 4G lento do teste de celular ele disputava banda com a
     fonte e o CSS da primeira tela. Medição não pode custar a métrica que
     ela existe para observar. */
  const ga4 = `
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag("js", new Date());
  gtag("config", "${GA4_ID}", { send_page_view: false });
  (function () {
    var carregar = function () {
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=${GA4_ID}";
      document.head.appendChild(s);
    };
    var ocioso = function () {
      (window.requestIdleCallback || function (f) { setTimeout(f, 400); })(carregar, { timeout: 4000 });
    };
    if (document.readyState === "complete") ocioso();
    else window.addEventListener("load", ocioso, { once: true });
  })();
</script>`;

  /* O Clarity deixou de ser injetado aqui e passou a ser carregado por
     consent.js, e só depois de haver consentimento. O motivo é o que ele faz:
     grava a sessão — mouse, clique, rolagem —, o que é bem mais sensível que
     contar página, e ele não obedece ao Consent Mode do Google. Aqui sobra só
     o ID, que o consent.js lê na hora de decidir. */
  const id = process.env.CLARITY_ID;
  const clarity = id
    ? `<script>window.__CLARITY_ID=${JSON.stringify(id)};</script>`
    : "<!-- Clarity disabled: set CLARITY_ID env to enable -->";

  /* ORDEM, e ela é o ponto do bloco inteiro:
       1. o ID do Clarity, que é só um dado;
       2. consent.js SEM async/defer, que manda gtag('consent','default');
       3. o gtag.
     Invertendo 2 e 3, o GA4 dispara uma vez antes de saber o consentimento, e
     o banner vira enfeite. Por isso consent.js é o único script síncrono do
     site: ele tem de rodar entre uma coisa e outra, não "em algum momento". */
  const consent = `<script>${codigoConsent}</script>`;

  return vercel + "\n" + clarity + "\n" + consent + "\n" + ga4;
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

/* A folha, cortada em DUAS METADES DO MESMO ARRANJO.
 *
 * `fontes.css` vem PRIMEIRO: as @font-face precisam existir antes de qualquer
 * regra que use as famílias, e o navegador começa a resolver as fontes assim
 * que lê o topo da folha.
 *
 * O corte é num ÚNICO ponto da ordem, e isso não é detalhe de arrumação: a
 * cascata do CSS é posicional, então qualquer split que embaralhe a sequência
 * troca quem ganha um empate de especificidade. Prefixo e sufixo concatenados
 * de volta dão byte a byte a folha antiga — é o que `site.css` continua sendo.
 *
 * O prefixo é o que a HOME precisa; o sufixo é o CSS das outras rotas. A home
 * embute o prefixo no <head> e busca o sufixo sem bloquear; as demais rotas
 * seguem com a folha inteira, como sempre. Ver buildHtml().
 */
const CSS_HOME = ["fontes.css", "tokens.css", "kit.css", "shell.css", "home.css"];
const CSS_RESTO = ["case.css", "processo.css", "sobre.css", "blog.css", "cursor.css"];

async function buildCss() {
  const junta = async (lista) => {
    const partes = [];
    for (const css of lista) {
      const src = path.join(ROOT, "site", css);
      if (existsSync(src)) partes.push(`/* ---- ${css} ---- */\n` + (await readFile(src, "utf8")));
    }
    return (await esbuild.transform(partes.join("\n"), { loader: "css", minify: true })).code;
  };
  const home = await junta(CSS_HOME);
  const resto = await junta(CSS_RESTO);
  await writeFile(path.join(DIST, "site.css"), home + resto);
  await writeFile(path.join(DIST, "site-resto.css"), resto);
  const kb = (s) => (s.length / 1024).toFixed(0);
  console.log(`  css: ${kb(home)} KB da home embutidos, ${kb(resto)} KB do resto adiados`);
  return home;
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

/* ------------------------- o primeiro quadro ------------------------- */

/* O HTML da home, escrito no build a partir dos MESMOS componentes React.
 *
 * O problema que isto resolve: até 31/08 o servidor entregava
 * `<div id="v2-root"></div>` vazio, e nada pintava até o React baixar,
 * parsear, executar e montar a home inteira. Em 4G lento com CPU 4x mais
 * lenta, todos os bytes chegavam em 2.084ms e o FCP acontecia em 5.096ms —
 * três segundos de CPU pura com a tela em branco. Ver docs/HANDOFF-PRERENDER.md.
 *
 * NÃO É UM SEGUNDO SITE, e essa é a objeção que o documento existe para
 * responder: a marcação sai de `site/entrada-ssr.jsx`, que importa o mesmo
 * `Home.jsx` e o mesmo `Shell.jsx` que o cliente monta. Ninguém escreve, lê
 * ou concilia HTML. Se um dia for preciso corrigir o pré-render editando HTML
 * à mão, a implementação está errada — pare e repense.
 *
 * NÃO HIDRATAMOS: o cliente segue com `createRoot(...).render(...)`, que
 * limpa o container e monta do zero. O que o servidor escreve é o estado
 * `initial` do Framer Motion, ou seja EXATAMENTE o primeiro quadro que o
 * cliente desenharia — é por construção que não existe piscada. O que o
 * visitante ganha é a capa, o véu, o nav e o rodapé pintando na chegada dos
 * bytes em vez de depois do JS; a revelação do título continua acontecendo
 * quando o app monta, como sempre aconteceu.
 */

/* Por que `node:vm` e não um `import`.
 *
 * Três coisas precisam ser verdade ao mesmo tempo, e só um contexto novo por
 * idioma entrega as três:
 *
 *   1. `volume/data.js` e `volume/i18n.js` são scripts CLÁSSICOS. Eles abrem
 *      com `const { useState, ... } = React` nu e fecham com
 *      `Object.assign(window, ...)`, e i18n.js alcança o `const CHAPTERS` de
 *      data.js por referência léxica. Isso é semântica de <script> no
 *      navegador, e um contexto de vm é o único lugar em Node onde ela vale.
 *   2. `site/i18n.js` lê `window.LANG` na CARGA DO MÓDULO, não dentro de
 *      função. Com `import` o módulo ficaria no cache do Node e o segundo
 *      idioma renderizaria no primeiro. Contexto novo, registro novo.
 *   3. O React que renderiza tem de ser o MESMO que `data.js` usa nos hooks.
 *      Por isso o bundle exporta o React dele e a linha abaixo o publica em
 *      `window` antes de data.js rodar.
 *
 * A ordem das três execuções é a mesma das tags em buildHtml() e pelos mesmos
 * motivos: React, depois data, depois i18n. Ver o comentário de lá.
 */
function contextoDom(caminho, lang) {
  const nada = () => {};
  const elemento = () => ({
    style: { setProperty: nada, removeProperty: nada },
    classList: { add: nada, remove: nada, contains: () => false, toggle: nada },
    setAttribute: nada, getAttribute: () => null, removeAttribute: nada,
    appendChild: nada, removeChild: nada,
    addEventListener: nada, removeEventListener: nada,
    querySelector: () => null, querySelectorAll: () => [],
    getBoundingClientRect: () => ({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 }),
    firstChild: null, textContent: "", lang: "",
  });
  const documento = {
    documentElement: elemento(), head: elemento(), body: elemento(),
    createElement: () => elemento(),
    querySelector: () => null, querySelectorAll: () => [],
    getElementById: () => null,
    addEventListener: nada, removeEventListener: nada,
    visibilityState: "visible",
  };
  const sandbox = {
    console,
    setTimeout, clearTimeout, setInterval, clearInterval, queueMicrotask,
    requestAnimationFrame: (fn) => setTimeout(fn, 0), cancelAnimationFrame: clearTimeout,
    requestIdleCallback: (fn) => setTimeout(fn, 0), cancelIdleCallback: clearTimeout,
    performance, TextEncoder, TextDecoder, URL, URLSearchParams,
    process: { env: { NODE_ENV: "production" } },
    document: documento,
    navigator: { userAgent: "node", language: lang === "en" ? "en" : "pt-BR" },
    location: { pathname: caminho, search: "", hash: "", href: "https://gabrielfelix-ux.4yu.com.br" + caminho, assign: nada },
    matchMedia: () => ({ matches: false, addEventListener: nada, removeEventListener: nada, addListener: nada, removeListener: nada }),
    localStorage: { getItem: () => null, setItem: nada, removeItem: nada },
    innerWidth: 1440, innerHeight: 900, devicePixelRatio: 1, scrollX: 0, scrollY: 0,
    addEventListener: nada, removeEventListener: nada,
    getComputedStyle: () => ({ getPropertyValue: () => "" }),
    /* Semeado à mão porque `site/i18n.js` lê isto na carga do módulo, que
       acontece antes de volume/i18n.js rodar. Aquele arquivo recalcula LANG a
       partir de `location.pathname` e republica — os dois batem porque o
       caminho aqui é o do idioma que estamos gerando. */
    LANG: lang,
  };
  const ctx = vm.createContext(sandbox);
  vm.runInContext("globalThis.window = globalThis; globalThis.self = globalThis;", ctx);
  return ctx;
}

async function preRender() {
  /* Bundle próprio, e de propósito SEM o plugin `reactGlobais`: aqui não
     existe vendor UMD para apontar, então este bundle traz o React de
     node_modules e é ele quem vira `window.React` no contexto. */
  const saida = await esbuild.build({
    entryPoints: [path.join(ROOT, "site", "entrada-ssr.jsx")],
    bundle: true,
    write: false,
    format: "iife",
    globalName: "__SSR",
    platform: "browser",
    jsx: "transform",
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    loader: { ".jsx": "jsx" },
    target: ["es2020"],
    define: { "process.env.NODE_ENV": '"production"' },
    logLevel: "warning",
  });
  const bundle = saida.outputFiles[0].text;

  const data = await readFile(path.join(DIST, "volume", "data.js"), "utf8");
  const i18n = await readFile(path.join(DIST, "volume", "i18n.js"), "utf8");
  const i18nEn = await readFile(path.join(DIST, "volume", "i18n.en.js"), "utf8");

  const umIdioma = (lang) => {
    const ctx = contextoDom(lang === "en" ? "/en" : "/", lang);
    vm.runInContext(bundle, ctx, { filename: "site/entrada-ssr.js" });
    vm.runInContext("window.React = __SSR.React;", ctx);
    vm.runInContext(data, ctx, { filename: "volume/data.js" });
    vm.runInContext(i18n, ctx, { filename: "volume/i18n.js" });
    /* Só o contexto inglês roda o espelho, exatamente como só o HTML inglês
       traz a tag. O `vm` reproduz a MESMA sequência do navegador, que é o que
       mantém pré-render e cliente escrevendo a mesma coisa. */
    if (lang === "en") vm.runInContext(i18nEn, ctx, { filename: "volume/i18n.en.js" });
    return vm.runInContext("__SSR.render()", ctx);
  };

  /* O `src` das imagens de lazy sai do HTML do servidor, e isto NÃO é
     detalhe: é a diferença entre o pré-render ajudar e atrapalhar.
   *
     Medido em 4G lento com CPU 4x, a home pré-renderizada com os src no
     lugar: FCP 4,58s → 1,10s, mas LCP 4,77s → 6,99s. O motivo está nos
     bytes — 1.871 KB → 2.837 KB, com as imagens saindo de 24 para 44. O
     parser descobre a página INTEIRA de uma vez, e o limiar de `loading=lazy`
     do Chrome é generoso o bastante para ele buscar quase tudo. Um mega de
     imagem de dobra que ninguém está olhando disputa a banda com o JS que
     revela o título, e o título é o LCP.
   *
     Tirar o src é seguro exatamente porque NÃO hidratamos: o React limpa o
     container e remonta a árvore com os src no lugar, no mesmo instante em
     que os punha antes deste commit. Nenhuma imagem carrega mais tarde do que
     carregava. `<img>` sem `src` nenhum não desenha ícone de quebrado — e o
     `alt` fica, então o que um leitor de tela ou um rastreador sem JS
     encontra continua sendo o mesmo texto.
   *
     A capa do hero é a exceção e é ela que faz o FCP: não tem `loading=lazy`,
     então não entra nesta regra. */
  const semLazy = (html) =>
    html.replace(/<img\b[^>]*>/g, (tag) =>
      /loading="lazy"/.test(tag) ? tag.replace(/\ssrc="[^"]*"/, "") : tag);

  const marcacao = { pt: semLazy(umIdioma("pt")), en: semLazy(umIdioma("en")) };
  const kb = (s) => (s.length / 1024).toFixed(0);
  console.log(`  home pré-renderizada: ${kb(marcacao.pt)} KB pt, ${kb(marcacao.en)} KB en`);
  return marcacao;
}

async function buildHtml(marcacao = null, cssHome = null, codigoConsent = "") {
  const tpl = await readFile(path.join(ROOT, "site", "index.template.html"), "utf8");
  const estiloInline = await inline();

  /* A FOLHA SAI DO CAMINHO CRÍTICO DA HOME.
   *
   * Medido em 31/08, garganta de 1,6 Mbps / 150ms de RTT / CPU 4x:
   * `/site.css` são 18 KB comprimidos que começavam a baixar em 200ms e só
   * terminavam em 813ms — 613ms para o que a banca sozinha entregaria em 90.
   * A diferença é DISPUTA: os cinco <script defer> (react-dom, data, i18n,
   * app) somam quase 200 KB e saem no mesmo instante, e o CSS, que é o único
   * que bloqueia a pintura, esperava a vez. O elemento de LCP da home é o
   * `<p class="v2-hero-sub">` — texto, sem recurso próprio —, então FCP e LCP
   * eram os dois a mesma coisa: a hora em que o CSS chegava.
   *
   * Embutido, o CSS da home viaja DENTRO do documento, que é a primeira
   * requisição, a de maior prioridade e a que não disputa com ninguém. São
   * 9 KB comprimidos a mais no HTML e uma ida e volta a menos.
   *
   * Não é "critical CSS" no sentido de extrair a primeira tela: é a folha
   * INTEIRA da home, cortada por rota e não por dobra. Por isso não existe
   * FOUC possível — nenhuma regra que a home usa chega depois.
   *
   * O resto (case, processo, sobre, blog, cursor) desce sem bloquear pelo
   * truque de `media="print"`: o navegador baixa em prioridade baixa e o
   * `onload` promove para `all`. Ele só é necessário quando alguém navega
   * para outra rota DENTRO da SPA, o que exige o app já carregado — ou seja,
   * sempre depois. O <noscript> cobre quem não roda JS.
   *
   * As outras rotas seguem com a folha inteira por <link>: elas precisam do
   * CSS de caso na primeira pintura, e um <link> cacheável serve melhor um
   * arquivo que já está no navegador de quem navegou pela home. */
  const cssResto =
    `<link rel="stylesheet" href="/site-resto.css" media="print" onload="this.media='all';this.onload=null">` +
    `<noscript><link rel="stylesheet" href="/site-resto.css"></noscript>`;
  const cssDaHome = cssHome ? `<style>${cssHome}</style>` + cssResto : `<link rel="stylesheet" href="/site.css">`;
  const cssInteiro = `<link rel="stylesheet" href="/site.css">`;
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
  /* O ESPELHO INGLÊS SÓ ENTRA ONDE É INGLÊS.
   *
   * `i18n.en.js` são 29 KB comprimidos de texto que só `/en` usa. Enquanto
   * viajava dentro do i18n.js, toda visita em português baixava e parseava o
   * bloco inteiro para descartar — banda no caminho crítico e tarefa longa na
   * thread principal, que valem 30% da nota.
   *
   * `rota.html` continua com os dois porque ele é a casca de TODO endereço
   * que não é a home, nos dois idiomas: `/en/case/pcyes` cai nele. Quem ganha
   * o corte é a home portuguesa, que é a página que recebe o link
   * compartilhado e a que o PageSpeed mede. */
  const tags = (comEspelhoEn) => [
    `<script defer src="/vendor/react.production.min.js"></script>`,
    `<script defer src="/vendor/react-dom.production.min.js"></script>`,
    `<script defer src="/volume/data.js"></script>`,
    `<script defer src="/volume/i18n.js"></script>`,
    ...(comEspelhoEn ? [`<script defer src="/volume/i18n.en.js"></script>`] : []),
    `<script defer src="/app.js"></script>`,
  ].join("\n");
  const base = tpl
    .replace("<!--CORTINA-CSS-->", estiloInline)
    .replace("<!--ANALYTICS-->", analyticsSnippet(codigoConsent));

  const comRaiz = (corpo, css, comEspelhoEn) =>
    base
      .replace("<!--CSS-->", css)
      .replace("<!--SCRIPTS-->", tags(comEspelhoEn))
      .replace('<div id="v2-root"></div>', `<div id="v2-root">${corpo}</div>`);

  /* TRÊS arquivos, e o terceiro é o que impede uma regressão feia.
   *
   * O rewrite do vercel.json manda todo caminho que não é arquivo para um
   * HTML só. Com a home pré-renderizada dentro dele, abrir /case/pcyes
   * direto passaria a pintar a HOME por três segundos e só então trocar pelo
   * caso — trocar tela branca por tela errada, que é pior.
   *
   * Então: index.html e en.html carregam a home escrita, e são servidos
   * exatamente nos dois endereços que SÃO a home. `rota.html` é a casca
   * vazia de sempre, e é para onde vai todo o resto — mesmo comportamento
   * que o site tinha antes deste commit, sem regressão nenhuma. O escopo é a
   * home porque é ela que recebe o link compartilhado e é ela que o
   * PageSpeed mede; as outras rotas são navegação interna, com o JS quente.
   *
   * Os três nomes estão amarrados aos rewrites do vercel.json e ao proxy do
   * `--serve`, aqui embaixo. Renomear um pede mexer nos três lugares. */
  await writeFile(path.join(DIST, "index.html"), comRaiz(marcacao ? marcacao.pt : "", cssDaHome, false));
  await writeFile(path.join(DIST, "rota.html"), comRaiz("", cssInteiro, true));

  /* A versão inglesa não é só o corpo traduzido: o `lang` do <html> e o
     endereço canônico também mudam, e os dois valem ANTES de qualquer JS
     rodar. Quem lê com leitor de tela e quem indexa a página sem executar
     script só enxerga o que está aqui.

     A description continua a portuguesa neste arquivo, e isso é dívida
     conhecida e não descuido: o texto dela mora dentro do efeito de rota em
     site/app.jsx, e copiá-lo para cá criaria a segunda fonte de verdade que
     este build inteiro existe para evitar. O app corrige na montagem, como
     já corrigia antes. Anotado no handoff. */
  const en = comRaiz(marcacao ? marcacao.en : "", cssDaHome, true)
    .replace('<html lang="pt-BR">', '<html lang="en">')
    .replace('<link rel="canonical" href="https://gabrielfelix-ux.4yu.com.br/">',
             '<link rel="canonical" href="https://gabrielfelix-ux.4yu.com.br/en">')
    .replace('<meta property="og:url" content="https://gabrielfelix-ux.4yu.com.br/">',
             '<meta property="og:url" content="https://gabrielfelix-ux.4yu.com.br/en">')
    .replace('<meta property="og:locale" content="pt_BR">',
             '<meta property="og:locale" content="en_US">');
  await writeFile(path.join(DIST, "en.html"), en);
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
  const codigoConsent = await buildConsent();
  await copyVendor();
  await copyAssets();
  const posts = await buildBlog(dev);
  await buildSitemap(posts);
  await esbuild.build(appOpcoes(dev));
  const cssHome = await buildCss();
  /* O pré-render roda DEPOIS de transpileConteudo (ele lê dist/volume/*.js) e
     depois de buildBlog (site/posts.gerado.js entra no grafo do bundle). E
     antes de buildHtml, que é quem injeta a marcação E o CSS da home. */
  await buildHtml(await preRender(), cssHome, codigoConsent);
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
      if (!arquivo.endsWith(".css")) return;
      clearTimeout(pendente);
      /* TODO CSS reescreve o HTML, e não só o site.css. Desde que a home
         embute a folha dela no <head>, mexer em home.css sem regerar o HTML
         deixa o dev mostrando o CSS do build anterior — o mesmo engano caro
         que este watch existe para evitar, só que ao contrário. */
      pendente = setTimeout(() => {
        buildCss()
          .then(async (css) => buildHtml(await preRender(), css, await buildConsent()))
          .then(() => console.log("[watch] css + html atualizados"))
          .catch((e) => console.error(e));
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
  /* esbuild serve numa porta interna; o proxy na frente resolve o path que não
     é arquivo, e ele espelha os rewrites do vercel.json — se os dois
     divergirem, o dev mente sobre produção. Sem esse fallback /case/pcyes dá
     404 no dev e só funciona no ar.

     São três destinos e não um, pelo mesmo motivo que buildHtml escreve três
     arquivos: `/en` é a home inglesa pré-renderizada, e todo o resto é a
     casca vazia. Mandar /case/pcyes para o index.html pré-renderizado
     pintaria a home antes do caso. */
  const { host: iHost, port: iPort } = await ctxConteudo.serve({ servedir: DIST, port: 0 });
  const wanted = Number(process.env.PORT) || 5173;
  const proxy = http.createServer((req, res) => {
    const enc = (p) => http.request(
      { hostname: iHost, port: iPort, path: p, method: req.method, headers: req.headers },
      (up) => {
        const caminho = req.url.split("?")[0];
        if (up.statusCode === 404 && !path.extname(caminho)) {
          const semBarra = caminho.replace(/\/+$/, "") || "/";
          if (semBarra === "/en") return enc("/en.html").end();
          // rota do SPA: serve a casca e deixa o app decidir a view.
          return enc("/rota.html").end();
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
