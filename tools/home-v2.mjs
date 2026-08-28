#!/usr/bin/env node
/* Verificação da home da V2. Complementa tools/medir.mjs, que mede a V1.

     BUILD_V2=1 npm run build
     cd dist && python3 -m http.server 8793 --bind 127.0.0.1
     node tools/home-v2.mjs medidas
     node tools/home-v2.mjs prints

   Print aqui é para o Gabriel comparar, não para o agente concluir sozinho:
   a pilha é scroll-linked e um print pega um quadro do meio da transição. */

import { mkdirSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { createRequire } from "node:module";

/* o hash do cache do npx muda por máquina: acha a versão que abre de verdade */
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
  throw new Error("nenhum playwright com chromium utilizável. `npx playwright install chromium`");
}
const chromium = await achaChromium();

const [, , CMD = "medidas", PORTA = "8793"] = process.argv;
const URL = `http://127.0.0.1:${PORTA}/v2/`;
const SAIDA = "/tmp/home-v2";
const VIEWPORTS = [
  { nome: "desktop", width: 1440, height: 900 },
  { nome: "laptop-baixo", width: 1280, height: 620 },
  { nome: "celular", width: 390, height: 844 },
];

async function abrir(b, vp) {
  const p = await b.newPage({ viewport: { width: vp.width, height: vp.height } });
  await p.goto(URL, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(600);
  return p;
}

async function medidas() {
  const b = await chromium.launch();
  const p = await abrir(b, VIEWPORTS[0]);
  const r = await p.evaluate(() => ({
    alturaPagina: Math.round(document.documentElement.scrollHeight),
    paineis: document.querySelectorAll(".v2-linha-casos").length,
    fonteH1: getComputedStyle(document.querySelector("h1")).fontFamily,
    secoes: [...document.querySelectorAll("main > * > section, main > section")].map(
      (s) => s.id || s.className.split(" ")[0]
    ),
  }));
  console.log(JSON.stringify(r, null, 2));
  await b.close();
}

async function prints() {
  mkdirSync(SAIDA, { recursive: true });
  const b = await chromium.launch();
  for (const vp of VIEWPORTS) {
    const p = await abrir(b, vp);
    const alt = await p.evaluate(() => document.documentElement.scrollHeight);
    const passos = 6;
    for (let i = 0; i < passos; i++) {
      const y = Math.round((alt - vp.height) * (i / (passos - 1)));
      await p.evaluate((v) => window.scrollTo(0, v), y);
      await p.waitForTimeout(700);
      await p.screenshot({ path: `${SAIDA}/${vp.nome}-${String(i).padStart(2, "0")}.png` });
    }
    await p.close();
  }
  await b.close();
  console.log("prints em " + SAIDA);
}

if (CMD === "prints") await prints();
else await medidas();
