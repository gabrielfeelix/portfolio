#!/usr/bin/env node
/* Verificação da página /sobre da V2.

     npm run build
     cd dist && setsid python3 -m http.server 8793 --bind 127.0.0.1 &
     node tools/sobre-v2.mjs prints
     node tools/sobre-v2.mjs axe

   O python -m http.server não faz fallback de rota: /sobre dá 404 direto.
   Abre a raiz e navega por pushState mais popstate, que é o que o roteador
   escuta. (`npm run dev` faz o fallback e aceita a URL direta.) */

import { mkdirSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
async function achaChromium() {
  const base = join(homedir(), ".npm", "_npx");
  const cands = [];
  if (existsSync(base)) {
    for (const d of readdirSync(base)) {
      const c = join(base, d, "node_modules", "playwright");
      if (existsSync(c)) cands.push(c);
    }
  }
  if (existsSync("node_modules/playwright")) cands.unshift("node_modules/playwright");
  for (const c of cands) {
    try {
      const { chromium } = require(c);
      const b = await chromium.launch();
      await b.close();
      return chromium;
    } catch (_) { /* essa versão não abre, tenta a próxima */ }
  }
  throw new Error("nenhum playwright com chromium utilizável");
}
const chromium = await achaChromium();

const BASE = "http://127.0.0.1:8793";
const SAIDA = "/tmp/claude-1000/-home-gabfelix-dev-portfolio/sobre";
mkdirSync(SAIDA, { recursive: true });

async function abrir(browser, w, h) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const pg = await ctx.newPage();
  const erros = [];
  pg.on("pageerror", (e) => erros.push(String(e)));
  pg.on("console", (m) => { if (m.type() === "error") erros.push(m.text()); });
  await pg.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await pg.evaluate(() => {
    window.history.pushState(null, "", "/sobre");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  await pg.waitForTimeout(1200);
  return { ctx, pg, erros };
}

/* Rola a página inteira em passos e espera as entradas terminarem: com menos
   de 3s depois do fim o axe acusa contraste reprovado que não existe. */
async function rolarTudo(pg) {
  const alt = await pg.evaluate(() => document.documentElement.scrollHeight);
  const passo = await pg.evaluate(() => window.innerHeight * 0.8);
  for (let y = 0; y < alt; y += passo) {
    await pg.evaluate((v) => window.scrollTo(0, v), y);
    await pg.waitForTimeout(220);
  }
  await pg.waitForTimeout(3000);
  return alt;
}

const cmd = process.argv[2] || "prints";
const browser = await chromium.launch();

if (cmd === "prints") {
  for (const [w, h] of [[1440, 900], [1280, 800], [390, 844]]) {
    const { ctx, pg, erros } = await abrir(browser, w, h);
    const alt = await rolarTudo(pg);
    await pg.evaluate(() => window.scrollTo(0, 0));
    await pg.waitForTimeout(600);
    await pg.screenshot({ path: `${SAIDA}/sobre-${w}-hero.png` });
    // a página inteira, em tiras de uma tela
    const telas = Math.ceil(alt / h);
    for (let i = 1; i < Math.min(telas, 16); i++) {
      await pg.evaluate((v) => window.scrollTo(0, v), i * h);
      await pg.waitForTimeout(400);
      await pg.screenshot({ path: `${SAIDA}/sobre-${w}-${String(i).padStart(2, "0")}.png` });
    }
    const over = await pg.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(`${w}x${h}  altura ${alt}px (${(alt / h).toFixed(1)} telas)  overflow-x ${over}px  erros ${erros.length}`);
    if (erros.length) console.log("  ", erros.slice(0, 5).join("\n   "));
    await ctx.close();
  }
}

if (cmd === "axe") {
  const axe = require("axe-core");
  for (const [w, h] of [[1440, 900], [1280, 800], [390, 844]]) {
    const { ctx, pg, erros } = await abrir(browser, w, h);
    await rolarTudo(pg);
    await pg.evaluate(() => window.scrollTo(0, 0));
    await pg.waitForTimeout(1500);
    await pg.addScriptTag({ path: axe.source ? undefined : require.resolve("axe-core"), content: axe.source });
    const r = await pg.evaluate(async () =>
      await window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] }));
    console.log(`${w}x${h}  violacoes ${r.violations.length}  erros-js ${erros.length}`);
    for (const v of r.violations) {
      console.log(`  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length})`);
      console.log("     ", v.nodes[0].target.join(" "), "|", (v.nodes[0].failureSummary || "").split("\n")[1] || "");
    }
    await ctx.close();
  }
}

if (cmd === "hover") {
  const { ctx, pg } = await abrir(browser, 1440, 900);
  await rolarTudo(pg);
  const alvo = await pg.$("#formacao");
  await alvo.scrollIntoViewIfNeeded();
  await pg.evaluate(() => window.scrollBy(0, -60));
  await pg.waitForTimeout(1400);
  await pg.screenshot({ path: `${SAIDA}/hv-00-repouso.png` });

  const itens = await pg.$$(".v2-sb-cert");
  // entra no item 3 e anda ate o 1: o filmstrip mostra a placa perseguindo
  const seq = [3, 2, 1, 0];
  for (let k = 0; k < seq.length; k++) {
    const b = await itens[seq[k]].boundingBox();
    await pg.mouse.move(b.x + b.width * 0.35, b.y + b.height / 2, { steps: 14 });
    await pg.waitForTimeout(k === 0 ? 700 : 90);
    await pg.screenshot({ path: `${SAIDA}/hv-${String(k + 1).padStart(2, "0")}-item${seq[k]}.png` });
  }
  await pg.waitForTimeout(700);
  await pg.screenshot({ path: `${SAIDA}/hv-05-parado.png` });

  const grade = await pg.$(".v2-sb-ferr-grade");
  await grade.scrollIntoViewIfNeeded();
  await pg.evaluate(() => window.scrollBy(0, -180));
  await pg.waitForTimeout(900);
  const ferr = await pg.$$(".v2-sb-ferr-item");
  const bf = await ferr[0].boundingBox();
  await pg.mouse.move(bf.x + bf.width / 2, bf.y + 40, { steps: 10 });
  await pg.waitForTimeout(900);
  await pg.screenshot({ path: `${SAIDA}/hv-06-ferramenta.png`, clip: await grade.boundingBox() });
  console.log("hover ok");
  await ctx.close();
}

await browser.close();
