/* Verificação do pré-render da home.
 *
 * RODE ISTO antes de subir mudança grande no hero ou no build do HTML. É o
 * teste que garante que o HTML escrito no build e o React não divergiram —
 * sem ele, a divergência só aparece como piscada na tela de quem visita.
 *
 *   npm run dev            (noutro terminal)
 *   node tools/primeiro-quadro.mjs
 *
 * Não precisa rodar para trocar uma palavra. Precisa quando mexer em
 * site/entrada-ssr.jsx, no Hero, no Nav ou em preRender()/buildHtml().
 *
 * Duas perguntas:
 *   1. nada quebrou — as rotas sobem sem erro de JS e sem 4xx;
 *   2. o primeiro quadro bate — o que o servidor escreve é o mesmo que o
 *      React monta, em texto e em posição.
 *
 * O quadro do servidor é isolado BLOQUEANDO /app.js, e não desligando o
 * JavaScript: com o JS desligado o `evaluate` do Playwright morre junto e não
 * dá para medir nada. Bloqueando só o app, o vendor/data/i18n rodam como em
 * produção e a página fica parada exatamente no que o build escreveu.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE || "http://localhost:45553";
const ROTAS = ["/", "/en", "/case/pcyes", "/processo", "/sobre", "/blog", "/en/case/pcyes"];

const navegador = await chromium.launch();
let falhas = 0;
const erro = (m) => { falhas++; console.log("  ✗ " + m); };

/* ---- 1. nada quebrou ---- */
console.log("\n1. rotas");
for (const rota of ROTAS) {
  const ctx = await navegador.newContext();
  const pg = await ctx.newPage();
  const consoles = [];
  const ruins = [];
  /* Os dois scripts do Vercel Analytics só existem no ar: no dev eles dão 404
     e sempre deram. É ruído conhecido, não regressão. */
  const ruido = (u) => /_vercel\/(insights|speed-insights)/.test(u);
  pg.on("console", (m) => { if (m.type() === "error" && !/status of 404/.test(m.text())) consoles.push(m.text()); });
  pg.on("pageerror", (e) => consoles.push(String(e.message)));
  pg.on("response", (r) => { if (r.status() >= 400 && !ruido(r.url())) ruins.push(`${r.status()} ${r.url()}`); });
  await pg.goto(BASE + rota, { waitUntil: "networkidle" });
  const ok = consoles.length === 0 && ruins.length === 0;
  console.log(`  ${ok ? "✓" : "✗"} ${rota}`);
  if (!ok) { falhas++; consoles.forEach((c) => console.log("      js: " + c)); ruins.forEach((r) => console.log("      rede: " + r)); }
  await ctx.close();
}

/* ---- 2. o primeiro quadro ----
 *
 * A comparação é do HERO, e não da página inteira, porque é só ele que o
 * build escreve: abaixo da dobra o pré-render era custo de CPU sem nada
 * pintado, e foi medido (ver o cabeçalho de site/entrada-ssr.jsx). O que
 * precisa bater é exatamente o que o visitante vê na chegada.
 */
const limpar = (s) => s.replace(/\(\s*\d\d:\d\d:\d\d/g, "( --:--:--").replace(/\s+/g, " ").trim();

async function quadro(rota, { semApp }) {
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
  const pg = await ctx.newPage();
  if (semApp) await pg.route("**/app.js", (r) => r.abort());

  /* O quadro que interessa do CLIENTE é o PRIMEIRO, não o assentado.
   *
   * O servidor escreve o estado `initial` do Framer Motion; comparar com a
   * tela depois de 2,6s acusaria como defeito exatamente a animação de
   * entrada — `useTardio` começa 16px abaixo, e é para começar. O que
   * decide se pisca é o quadro em que o React acaba de montar.
   *
   * Um MutationObserver instalado ANTES do app.js lê os rects dentro do
   * próprio callback da primeira inserção, que é síncrono e antes de pintar. */
  if (!semApp) {
    await pg.addInitScript(() => {
      const ler = () => {
        const cx = (sel) => {
          const el = document.querySelector(sel);
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)];
        };
        window.__primeiro = {
          texto: ((document.querySelector(".v2-nav") || {}).textContent || "") + " | " + ((document.querySelector(".v2-hero") || {}).textContent || ""),
          caixas: { nav: cx(".v2-nav"), h1: cx(".v2-hero-h"), capa: cx(".v2-hero-capa img, .v2-hero-capa video"), sub: cx(".v2-hero-sub"), botoes: cx(".v2-hero-botoes") },
        };
      };
      const espera = setInterval(() => {
        const raiz = document.getElementById("v2-root");
        if (!raiz) return;
        clearInterval(espera);
        new MutationObserver((_m, o) => { o.disconnect(); ler(); }).observe(raiz, { childList: true });
      }, 0);
    });
  }

  await pg.goto(BASE + rota, { waitUntil: semApp ? "domcontentloaded" : "networkidle" });
  /* As fontes precisam ter assentado nos DOIS lados antes de medir: com a
     Switzer ainda por chegar, a métrica do fallback muda a largura do botão em
     alguns pixels e o teste acusa a troca de fonte como se fosse o
     pré-render. */
  await pg.evaluate(() => document.fonts && document.fonts.ready);
  const dado = await pg.evaluate((semApp) => {
    if (!semApp && window.__primeiro) return window.__primeiro;
    const cx = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)];
    };
    return {
      texto: ((document.querySelector(".v2-nav") || {}).textContent || "") + " | " + ((document.querySelector(".v2-hero") || {}).textContent || ""),
      caixas: {
        nav: cx(".v2-nav"),
        h1: cx(".v2-hero-h"),
        capa: cx(".v2-hero-capa img, .v2-hero-capa video"),
        sub: cx(".v2-hero-sub"),
        botoes: cx(".v2-hero-botoes"),
      },
    };
  }, semApp);
  await ctx.close();
  return dado;
}

for (const rota of ["/", "/en"]) {
  console.log(`\n2. primeiro quadro — ${rota}`);
  const servidor = await quadro(rota, { semApp: true });
  const cliente = await quadro(rota, { semApp: false });

  if (limpar(servidor.texto).length < 200) erro("o quadro do servidor está vazio — o pré-render não chegou");

  /* O que está ABAIXO do hero não pode estar no HTML do servidor: se voltar,
     volta junto o 1,5s de thread que fez o LCP piorar na primeira versão. */
  const fundo = await (async () => {
    const ctx = await navegador.newContext();
    const pg = await ctx.newPage();
    await pg.route("**/app.js", (r) => r.abort());
    await pg.goto(BASE + rota, { waitUntil: "domcontentloaded" });
    const n = await pg.evaluate(() => ({
      dobras: document.querySelectorAll("#v2-root .v2-corpo-claro, #v2-root .v2-rodape").length,
      imgs: document.querySelectorAll("#v2-root img[src]").length,
    }));
    await ctx.close();
    return n;
  })();
  if (fundo.dobras) erro(`o servidor escreveu ${fundo.dobras} bloco(s) abaixo da dobra — só o hero deve entrar`);
  else console.log("  ✓ nada abaixo da dobra no HTML do servidor");
  if (fundo.imgs > 1) erro(`${fundo.imgs} imagens com src no HTML do servidor — só a capa do hero deve ter`);
  else console.log(`  ✓ ${fundo.imgs} imagem com src (a capa do hero)`);

  const a = limpar(servidor.texto), b = limpar(cliente.texto);
  if (a === b) console.log(`  ✓ texto idêntico (${a.length} caracteres)`);
  else {
    erro(`texto diverge: servidor ${a.length}, cliente ${b.length}`);
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      if (a[i] !== b[i]) { console.log(`      diverge em ${i}:\n      srv …${a.slice(i - 60, i + 90)}\n      cli …${b.slice(i - 60, i + 90)}`); break; }
    }
  }

  for (const [nome, cs] of Object.entries(servidor.caixas)) {
    const cc = cliente.caixas[nome];
    if (!cs || !cc) { erro(`${nome}: ausente (servidor=${!!cs} cliente=${!!cc})`); continue; }
    const dif = cs.map((v, i) => Math.abs(v - cc[i]));
    const maior = Math.max(...dif);
    // 2px de folga: subpixel de fonte e o arredondamento do próprio rect.
    if (maior <= 2) console.log(`  ✓ ${nome} na mesma posição  [${cs}]`);
    else erro(`${nome} desloca ${maior}px — srv [${cs}] cli [${cc}]`);
  }
}

await navegador.close();
console.log(falhas ? `\n${falhas} falha(s)\n` : "\ntudo passou\n");
process.exit(falhas ? 1 : 0);
