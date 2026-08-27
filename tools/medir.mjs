#!/usr/bin/env node
/* Instrumentação do volume. Escrita em 2026-08-26, na rodada do Grupo A,
   porque a medição estava sendo reescrita do zero a cada sessão.

   Regra que vale para tudo aqui: **meça no DOM da página servida**. Print
   neste projeto pega estado de transição e engana (`.beat .panel` nasce em
   opacity 0, a `CenaScroll` cresce ao longo do trilho e o `ModuloPassos`
   troca o texto no meio da rolagem).

     npm run build
     cd dist && python3 -m http.server 8793 --bind 127.0.0.1
     node tools/medir.mjs beats
     node tools/medir.mjs cpl
     node tools/medir.mjs reveal
     node tools/medir.mjs passos
     node tools/medir.mjs regressao          # viewports, rotas e axe
     node tools/medir.mjs diff 8794 8793     # antes contra depois

   Para o `diff`, guarde uma cópia do `dist/` ANTES de mexer e sirva numa
   segunda porta. Comparar contra memória não vale.

   O axe precisa de `npm i --no-save axe-core` (não é dependência do site).
   Filtre `_vercel/` do console: 404 local é esperado, não é regressão.  */

import { createRequire } from "node:module";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const require = createRequire(import.meta.url);
const [, , CMD = "beats", ...ARGS] = process.argv;
const ROTA = process.env.ROTA || "pcyes";
const CONGELA = `*,*::before,*::after{animation:none!important;transition:none!important}
.beat .panel,.panel{opacity:1!important;transform:none!important}`;

/* o hash do cache do npx muda por máquina, e algumas versões não têm o
   binário do chromium baixado: acha a que abre de verdade */
async function achaChromium() {
  const base = join(homedir(), ".npm", "_npx");
  const cands = [];
  if (existsSync(base)) {
    for (const d of readdirSync(base)) {
      const p = join(base, d, "node_modules", "playwright");
      if (existsSync(p)) cands.push(p);
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
const browser = await chromium.launch();

async function pagina(porta, { w = 1440, h = 900, congelar = true, rolar = true } = {}) {
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  p.__erros = [];
  p.on("pageerror", (e) => p.__erros.push(e.message));
  await p.goto(`http://127.0.0.1:${porta}/#/cap/${ROTA}`, { waitUntil: "networkidle" });
  await p.waitForTimeout(2300);
  // rolar antes de medir: o trilho da CenaScroll só existe depois que ela roda
  if (rolar) {
    await p.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 1200) {
        window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40));
      }
      window.scrollTo(0, 0);
    });
    await p.waitForTimeout(500);
  }
  if (congelar) { await p.addStyleTag({ content: CONGELA }); await p.waitForTimeout(400); }
  return p;
}
const erros = (p) => p.__erros.filter((e) => !/_vercel/.test(e));

/* ---- beats: o custo de cada batida do capítulo --------------------- */
async function beats(porta = 8793) {
  const p = await pagina(porta);
  const d = await p.evaluate(() => {
    const W = (s) => (s || "").trim().split(/\s+/).filter(Boolean).length;
    const secs = [...document.querySelectorAll(".sec-anc")];
    return {
      doc: document.documentElement.scrollHeight,
      beats: secs.map((e) => ({
        id: e.id.replace("sec-", ""),
        h: Math.round(e.getBoundingClientRect().height),
        pal: W(e.innerText),
        figs: e.querySelectorAll("img").length,
      })),
    };
  });
  console.log(`doc ${d.doc}px = ${(d.doc / 900).toFixed(1)} telas`);
  console.log("altura  telas  palavras figs  beat");
  for (const b of d.beats) {
    const barra = "█".repeat(Math.max(1, Math.round(b.h / 220)));
    console.log(`${String(b.h).padStart(6)} ${(b.h / 900).toFixed(1).padStart(6)} ${String(b.pal).padStart(9)} ${String(b.figs).padStart(4)}  ${b.id.padEnd(14)} ${barra}`);
  }
  console.log("pageerror:", erros(p).length);
  await p.close();
}

/* ---- cpl: caracteres por linha REAIS -------------------------------
   Nem `ch` nem `largura / (font-size * 0,5)` servem. `1ch` é a largura do
   "0", ~25% mais larga que o caractere médio destas fontes, então `68ch`
   rende ~80 caracteres. Aqui a linha é medida com Range, cortando onde o
   topo muda, e a última linha de cada bloco é descartada por ser
   irregular por natureza. Faixa confortável: 45 a 75.               */
async function cpl(porta = 8793) {
  const p = await pagina(porta);
  const out = await p.evaluate(() => {
    function linhas(el) {
      const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const nos = []; let n;
      while ((n = w.nextNode())) if (n.textContent.trim()) nos.push(n);
      const r = document.createRange(); const res = []; let atual = 0, topo = null;
      for (const no of nos) {
        for (let i = 0; i < no.textContent.length; i++) {
          r.setStart(no, i); r.setEnd(no, i + 1);
          const rc = r.getClientRects()[0]; if (!rc) continue;
          const t = Math.round(rc.top);
          if (topo === null) topo = t;
          else if (Math.abs(t - topo) > 3) { res.push(atual); atual = 0; topo = t; }
          atual++;
        }
      }
      if (atual) res.push(atual);
      return res;
    }
    const BLOCO = "p,div,li,h1,h2,h3,h4,h5,ul,ol,table,figure,section,blockquote";
    const g = {};
    for (const el of document.querySelectorAll("p,li,h1,h2,h3,h4,figcaption,blockquote,div,dd,dt")) {
      const txt = (el.innerText || "").replace(/\s+/g, " ").trim();
      if (txt.length < 55) continue;
      if (el.querySelector(BLOCO)) continue;           // não é o dono da caixa de linha
      const s = getComputedStyle(el);
      if (s.display === "none" || s.visibility === "hidden") continue;
      const r = el.getBoundingClientRect(); if (r.height < 8) continue;
      const L = linhas(el); if (!L.length) continue;
      const c = (el.className || "").toString().trim().split(/\s+/)
        .filter((x) => x && x !== "in" && x !== "panel")[0] || el.tagName.toLowerCase();
      (g[c] = g[c] || { linhas: [], els: 0, fs: s.fontSize, mw: s.maxWidth, w: 0 });
      g[c].linhas.push(...(L.length > 1 ? L.slice(0, -1) : L));
      g[c].els++; g[c].w = Math.max(g[c].w, Math.round(r.width));
    }
    return Object.entries(g).map(([c, v]) => {
      const s = v.linhas.slice().sort((a, b) => a - b);
      return { c, els: v.els, n: s.length, min: s[0], med: s[Math.floor(s.length / 2)],
        p90: s[Math.floor(s.length * 0.9)], max: s[s.length - 1], fs: v.fs, w: v.w, mw: v.mw };
    }).sort((a, b) => b.n - a.n);
  });
  console.log("Faixa confortável: 45 a 75. Julgue pelo peso em `linhas`: rótulo de\naba, número e legenda de uma palavra marcam ABAIXO e não são leitura.\n");
  console.log("componente        els linhas  min med p90 max   fonte   larg   max-width   fora?");
  for (const x of out) {
    const fora = x.med < 45 ? "ABAIXO" : x.p90 > 75 ? "ACIMA" : "";
    console.log(`${x.c.padEnd(17)} ${String(x.els).padStart(3)} ${String(x.n).padStart(6)}  ${String(x.min).padStart(3)} ${String(x.med).padStart(3)} ${String(x.p90).padStart(3)} ${String(x.max).padStart(3)}   ${x.fs.padStart(6)} ${String(x.w).padStart(5)}px ${String(x.mw).padEnd(11)} ${fora}`);
  }
  await p.close();
}

/* ---- reveal: painel que nunca acende -------------------------------
   Aqui é o contrário do resto: os efeitos ficam LIGADOS e a página é
   percorrida de 90 em 90px, registrando a opacidade máxima que cada
   painel atinge enquanto está na faixa de leitura. Foi assim, e só assim,
   que a abertura do Design System apareceu apagada por semanas com build
   verde. O último painel marca baixo na varredura só porque a página
   acaba antes de ele acender: por isso lê de novo parado no fim.     */
async function reveal(porta = 8793) {
  for (const abrirDobra of [false, true]) {
    const p = await pagina(porta, { congelar: false, rolar: false });
    if (abrirDobra) await p.evaluate(() => { const d = document.querySelector(".ds-dobra"); if (d) d.open = true; });
    await p.waitForTimeout(400);
    const r = await p.evaluate(async () => {
      const els = [...document.querySelectorAll(".panel, .respiro-marca, .atalho, .ds-dobra-t")];
      const max = new Map(els.map((e) => [e, 0]));
      const H = window.innerHeight;
      for (let y = 0; y < document.documentElement.scrollHeight; y += 90) {
        window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 26));
        for (const e of els) {
          const b = e.getBoundingClientRect();
          if (b.bottom > H * 0.05 && b.top < H * 0.95) {
            const o = parseFloat(getComputedStyle(e).opacity) || 0;
            if (o > max.get(e)) max.set(e, o);
          }
        }
      }
      window.scrollTo(0, document.documentElement.scrollHeight);
      await new Promise((r) => setTimeout(r, 900));
      for (const e of els) { const o = parseFloat(getComputedStyle(e).opacity) || 0; if (o > max.get(e)) max.set(e, o); }
      return { total: els.length, mortos: [...max.entries()].filter(([, o]) => o < 0.95)
        .map(([e, o]) => ({ cls: (e.className || "").toString().trim().slice(0, 44), op: +o.toFixed(2),
          sec: (e.closest(".sec-anc") || {}).id || "?" })) };
    });
    console.log(`dobra ${abrirDobra ? "aberta " : "fechada"} · painéis ${r.total} · mortos ${r.mortos.length}`, r.mortos.length ? JSON.stringify(r.mortos) : "");
    await p.close();
  }
}

/* ---- passos: a troca do ModuloPassos lê limpo? ---------------------
   A calha entre as provas é o que dá tempo do texto trocar. Se ela
   encolher demais, o passo ativo pisca ou volta atrás. Alvo: zero recuos
   e nenhum passo ativo por menos de 300px de rolagem.                */
async function passos(porta = 8793) {
  // sem pré-rolagem: com a página já percorrida o observer já disparou em
  // tudo, a primeira leitura pega o último passo como ativo e isso conta
  // como um recuo que não existe
  const p = await pagina(porta, { congelar: false, rolar: false });
  const r = await p.evaluate(async () => {
    const out = [];
    for (const m of document.querySelectorAll(".mod-passos")) {
      const topo = m.getBoundingClientRect().top + window.scrollY;
      const fim = topo + m.getBoundingClientRect().height;
      const serie = [];
      for (let y = topo - 700; y < fim + 200; y += 60) {
        window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 45));
        const li = [...m.querySelectorAll(".passo-regua li")];
        serie.push(li.findIndex((e) => e.classList.contains("aqui")));
      }
      let recuos = 0; const perm = {};
      for (let k = 1; k < serie.length; k++) if (serie[k] < serie[k - 1]) recuos++;
      serie.forEach((i) => { perm[i] = (perm[i] || 0) + 1; });
      const n = m.querySelectorAll(".passo-regua li").length;
      const curtos = [];
      for (let i = 0; i < n; i++) { const t = (perm[i] || 0) * 60; if (t < 300) curtos.push(`${i}:${t}px`); }
      out.push({ n, h: Math.round(m.getBoundingClientRect().height),
        gap: getComputedStyle(m.querySelector(".passos-figs")).rowGap, recuos, curtos });
    }
    return out;
  });
  r.forEach((m, i) => console.log(`modulo ${i + 1}: ${m.n} passos, ${m.h}px, calha ${m.gap}, recuos ${m.recuos}, passos curtos ${m.curtos.length ? m.curtos.join(",") : "nenhum"}`));
  await p.close();
}

/* ---- regressao: o que precisa estar verde antes de dizer "pronto" -- */
async function regressao(porta = 8793) {
  console.log("== largura · scrollWidth vs clientWidth · pageerror");
  for (const w of [1920, 1700, 1440, 1280, 768, 390]) {
    const p = await pagina(porta, { w, congelar: false });
    const m = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth, doc: document.documentElement.scrollHeight }));
    console.log(`  ${String(w).padStart(4)}  ${m.sw} vs ${m.cw}  ${m.sw === m.cw ? "OK" : "FALHOU"}  doc ${m.doc}  pageerror ${erros(p).length}`);
    await p.close();
  }
  console.log("== pageerror nas oito rotas");
  for (const r of ["/", "/cap/pcyes", "/cap/odex", "/cap/oderco-revenda", "/cap/portfolio", "/cap/locarmais-conciliacao", "/rapido", "/processo"]) {
    const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const e = []; p.on("pageerror", (x) => e.push(x.message));
    await p.goto(`http://127.0.0.1:${porta}/#${r}`, { waitUntil: "networkidle" });
    await p.waitForTimeout(1600);
    console.log(`  ${r.padEnd(28)} ${e.filter((x) => !/_vercel/.test(x)).length}`);
    await p.close();
  }
  let AXE = null;
  for (const c of ["axe-core/axe.min.js", "./node_modules/axe-core/axe.min.js"]) {
    try { AXE = readFileSync(require.resolve(c), "utf8"); break; } catch (_) {}
  }
  if (!AXE) { console.log("== axe: pulado. `npm i --no-save axe-core` e rode de novo."); return; }
  console.log("== axe wcag2a+wcag2aa");
  for (const [nome, w, tinta, en] of [["1440 papel", 1440, 0, 0], ["1440 tinta", 1440, 1, 0], ["1440 EN", 1440, 0, 1], ["390", 390, 0, 0]]) {
    const p = await pagina(porta, { w, congelar: false, rolar: false });
    if (tinta) await p.evaluate(() => document.documentElement.classList.add("ink"));
    if (en) await p.evaluate(() => { const b = [...document.querySelectorAll("button,a")].find((e) => /^\s*(EN|English)\s*$/i.test(e.textContent || "")); if (b) b.click(); });
    await p.waitForTimeout(1200);
    await p.addScriptTag({ content: AXE });
    const v = await p.evaluate(async () => (await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] } }))
      .violations.map((x) => ({ id: x.id, n: x.nodes.length, alvo: x.nodes[0].target.join(" ") })));
    console.log(`  ${nome.padEnd(12)} violações: ${v.length}`, v.length ? JSON.stringify(v) : "");
    await p.close();
  }
}

/* ---- diff: antes contra depois, medidos do mesmo jeito ------------- */
async function diff(antes = 8794, depois = 8793) {
  const ler = async (porta) => {
    const p = await pagina(porta);
    const d = await p.evaluate(() => {
      const t = document.querySelector(".chapter-col")?.innerText || "";
      return { doc: document.documentElement.scrollHeight,
        pal: t.trim().split(/\s+/).filter(Boolean).length,
        travessoes: (t.match(/—/g) || []).length,
        beats: [...document.querySelectorAll(".sec-anc")].map((e) => ({ id: e.id.replace("sec-", ""), h: Math.round(e.getBoundingClientRect().height) })) };
    });
    await p.close(); return d;
  };
  const A = await ler(antes), B = await ler(depois);
  const l = (n, a, b, s = "") => console.log(n.padEnd(22) + String(a).padStart(9) + String(b).padStart(11) + String((b - a > 0 ? "+" : "") + (b - a)).padStart(10) + s);
  console.log("                        ANTES     DEPOIS      DELTA");
  l("altura", A.doc, B.doc, "px");
  l("telas", (A.doc / 900).toFixed(1), (B.doc / 900).toFixed(1));
  l("palavras", A.pal, B.pal);
  l("travessões", A.travessoes, B.travessoes, "  (tem que ser 0 nos dois)");
  console.log("\nbeat            antes   depois   delta");
  A.beats.forEach((x, i) => {
    const y = B.beats[i]; if (!y) return; const d = y.h - x.h;
    if (Math.abs(d) > 5) console.log(x.id.padEnd(15) + String(x.h).padStart(6) + String(y.h).padStart(9) + String((d > 0 ? "+" : "") + d).padStart(8));
  });
}

const cmds = { beats, cpl, reveal, passos, regressao, diff };
if (!cmds[CMD]) { console.log("comandos:", Object.keys(cmds).join(", ")); process.exit(1); }
await cmds[CMD](...ARGS.map((a) => (/^\d+$/.test(a) ? +a : a)));
await browser.close();
