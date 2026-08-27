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
  // W/H pelo ambiente: um beat MAIS ALTO QUE ~4x a tela nunca alcanca os
  // 22% de threshold do IntersectionObserver, e o painel dele nunca
  // acende. Em 1440x900 o beat da `solucao` mede 3.233px e passa raspando
  // (ratio 0,28). Em 1920, onde ele mede 4.048, a margem some. Varrer so
  // em 1440x900 dava verde num bug que existia na tela do Gabriel.
  const W = +(process.env.W || 1440), H = +(process.env.H || 900);
  console.log(`viewport ${W}x${H}`);
  for (const abrirDobra of [false, true]) {
    const p = await pagina(porta, { w: W, h: H, congelar: false, rolar: false });
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
  const LARG = +(process.env.W || 1440);
  const ler = async (porta) => {
    const p = await pagina(porta, { w: LARG });
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
  console.log(`viewport ${LARG}px`);
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


/* ---- figuras: a escala e a ordem visual de cada prova ---------------
   Duas perguntas que print não responde: **quanto** cada imagem ocupa da
   dobra (altura renderizada / altura da viewport) e **em que ordem** ela
   chega em relação ao título da seção. Imagem que aparece acima do
   próprio título lê como abertura sem legenda, e é o que estava sendo
   reclamado a olho. Tudo sai de getBoundingClientRect na página rolada. */
async function figuras(porta = 8793) {
  const p = await pagina(porta);
  // o grau mora em `chap.figuras`, o unico ramo que o i18n mescla chave a
  // chave: TINTA=1 e EN=1 conferem que ele sobrevive ao tema e ao idioma,
  // que e onde este projeto ja perdeu campo inteiro com build verde.
  if (process.env.TINTA) { await p.evaluate(() => document.documentElement.classList.add("ink")); await p.waitForTimeout(400); }
  if (process.env.EN) {
    await p.evaluate(() => { const b = [...document.querySelectorAll("button,a")].find((e) => /^\s*(EN|English)\s*$/i.test(e.textContent || "")); if (b) b.click(); });
    await p.waitForTimeout(1500);
    await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 1200) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } window.scrollTo(0, 0); });
    await p.waitForTimeout(600);
  }
  const d = await p.evaluate(() => {
    const secs = [...document.querySelectorAll(".sec-anc")];
    const dentro = (img) => secs.find((s) => s.contains(img));
    const topoDoc = (el) => { const r = el.getBoundingClientRect(); return Math.round(r.top + window.scrollY); };
    const imgs = [...document.querySelectorAll(".chapter-main img")].filter((i) => i.offsetParent !== null || i.getBoundingClientRect().height > 0);
    return {
      vh: window.innerHeight, vw: window.innerWidth,
      doc: document.documentElement.scrollHeight,
      figs: imgs.map((i) => {
        const r = i.getBoundingClientRect();
        const s = dentro(i);
        const tit = s ? s.querySelector("h2,h3,.sec-t,.sec-k") : null;
        const frame = i.closest(".fig-frame, .sol-panel, .ad-quadro, .ad-fig");
        const fr = frame ? frame.getBoundingClientRect() : r;
        return {
          src: (i.getAttribute("src") || "").split("/").pop(),
          sec: s ? s.id.replace("sec-", "") : "(fora)",
          w: Math.round(fr.width), h: Math.round(fr.height),
          ar: +(fr.width / Math.max(1, fr.height)).toFixed(2),
          dobra: +(fr.height / window.innerHeight).toFixed(2),
          topo: topoDoc(frame || i),
          titulo: tit ? topoDoc(tit) : null,
          nat: i.naturalWidth ? `${i.naturalWidth}x${i.naturalHeight}` : "?",
          classe: (frame ? frame.className : i.className).split(/\s+/).filter((c) => c && c !== "fig-frame" && c !== "fig-img").join(".") || "-",
          plano: frame ? getComputedStyle(frame).boxShadow : "-",
          grau: (i.closest(".fig-plena") && "plena") || (i.closest(".fig-apoio") && "apoio") || (frame && frame.classList.contains("sol-panel") && "climax") || "padrao",
        };
      }),
    };
  });
  console.log(`viewport ${d.vw}x${d.vh} · doc ${d.doc}px · ${d.figs.length} imagens`);
  console.log(" larg  alt   ar  dobra  antesTit  seção          arquivo");
  let acima = 0, grandes = 0;
  const porSec = {};
  for (const f of d.figs) {
    const antes = f.titulo != null && f.topo < f.titulo;
    if (antes) acima++;
    if (f.dobra > 0.72) grandes++;
    porSec[f.sec] = (porSec[f.sec] || 0) + 1;
    const barra = "▇".repeat(Math.max(1, Math.round(f.dobra * 12)));
    console.log(`${String(f.w).padStart(5)}${String(f.h).padStart(5)}${String(f.ar).padStart(6)}${String(f.dobra).padStart(6)}  ${(antes ? "ACIMA" : "  .  ").padStart(8)}  ${f.sec.padEnd(14)} ${f.src.slice(0, 26).padEnd(27)} ${barra}`);
  }
  const alturas = d.figs.map((f) => f.h).sort((a, b) => a - b);
  const med = alturas[Math.floor(alturas.length / 2)];
  const dist = {};
  for (const f of d.figs) { const k = Math.round(f.h / 100) * 100; dist[k] = (dist[k] || 0) + 1; }
  console.log(`\nmediana de altura ${med}px · min ${alturas[0]} · max ${alturas[alturas.length - 1]}`);
  console.log("distribuição de altura (px arredondado à centena):");
  for (const k of Object.keys(dist).sort((a, b) => a - b)) console.log(`  ${String(k).padStart(5)}px  ${"■".repeat(dist[k])} ${dist[k]}`);
  console.log("\nplano de tinta (box-shadow computado) por grau:");
  const porGrau = {};
  for (const f of d.figs) {
    if (f.plano === "-") continue;
    const k = `${f.grau}  ${f.plano === "none" ? "SEM PLANO" : f.plano}`;
    porGrau[k] = (porGrau[k] || 0) + 1;
  }
  for (const k of Object.keys(porGrau).sort()) console.log(`  ${String(porGrau[k]).padStart(3)}x  ${k}`);

  console.log("\ncorte: proporção do arquivo contra a proporção da moldura");
  console.log(" natural      arNat  arMoldura  corte%  arquivo");
  for (const f of d.figs) {
    if (f.nat === "?") continue;
    const [nw, nh] = f.nat.split("x").map(Number);
    const an = nw / nh;
    // object-fit: cover → sobra o eixo maior. quanto do arquivo fica fora
    const perda = an > f.ar ? 1 - f.ar / an : 1 - an / f.ar;
    console.log(`${f.nat.padStart(9)}${String(an.toFixed(2)).padStart(11)}${String(f.ar).padStart(11)}${String(Math.round(perda * 100)).padStart(7)}  ${f.src}`);
  }
  console.log(`\nimagens acima do próprio título: ${acima}`);
  console.log(`imagens ocupando mais de 72% da dobra: ${grandes} de ${d.figs.length}`);
  console.log("figuras por seção:", JSON.stringify(porSec));
  console.log("pageerror:", erros(p).length);
  await p.close();
}


/* ---- ordem: o título chega antes da prova? -------------------------
   A reclamação "a imagem aparece antes do título" é medível: para cada
   beat, o topo do `.beat-t` contra o topo da primeira `.fig-frame` dentro
   dele. Delta negativo = a prova entra acima do próprio título, e quem
   rola encontra uma tela sem saber do que ela é prova. */
async function ordem(porta = 8793) {
  const p = await pagina(porta);
  const d = await p.evaluate(() => {
    const topo = (el) => Math.round(el.getBoundingClientRect().top + window.scrollY);
    return [...document.querySelectorAll(".beat, .mod-passos, .cam-palco")].map((b) => {
      // o ancora honesto e o TOPO DO BLOCO DE TEXTO, nao o h2: o kicker
      // vermelho ("PRE-VENDA") e a primeira coisa que o leitor encontra, e
      // um h2 27px abaixo dele nao e "prova antes do titulo", e a abertura
      // normal de um beat de duas colunas. Medir pelo h2 acusava 5 falsos.
      const t = b.querySelector(".beat-k, .beat-t, .mod-t, .sec-t");
      const f = b.querySelector(".fig-frame, .plate");
      if (!t && !f) return null;
      return {
        k: (b.querySelector(".beat-k")?.innerText || "").replace(/\s+/g, " ").trim().slice(0, 30),
        t: (b.querySelector(".beat-t, .mod-t, .sec-t")?.innerText || "(sem título)").replace(/\s+/g, " ").trim().slice(0, 34),
        yt: t ? topo(t) : null, yf: f ? topo(f) : null,
        h: Math.round(b.getBoundingClientRect().height),
      };
    }).filter(Boolean);
  });
  console.log("  yTexto    yFigura   delta   altura  título   (yTexto = topo do bloco de texto, o kicker)");
  let ruins = 0;
  for (const b of d) {
    if (b.yt == null || b.yf == null) { console.log(`${String(b.yt ?? "-").padStart(9)}${String(b.yf ?? "-").padStart(10)}${"-".padStart(8)}${String(b.h).padStart(9)}  ${b.t}`); continue; }
    const delta = b.yf - b.yt;
    if (delta < 0) ruins++;
    console.log(`${String(b.yt).padStart(9)}${String(b.yf).padStart(10)}${String(delta).padStart(8)}${String(b.h).padStart(9)}  ${b.t}${delta < 0 ? "   << PROVA ANTES DO TÍTULO" : ""}`);
  }
  console.log(`\nbeats com a prova acima do título: ${ruins} de ${d.length}`);
  await p.close();
}


/* ---- dados: os paineis desenhados leem como prancha ou como card? ---
   Tres perguntas medidas no DOM, e nenhuma delas print responde: os
   paineis estao pousados (plano de tinta) ou flutuando secos; o vazio
   dos trilhos e chapado (gramatica de progress bar) ou trama de
   meio-tom; e quanto do capitulo eles ocupam em fila. */
async function dados(porta = 8793) {
  const p = await pagina(porta);
  if (process.env.TINTA) { await p.evaluate(() => document.documentElement.classList.add("ink")); await p.waitForTimeout(400); }
  const d = await p.evaluate(() => {
    const paineis = [...document.querySelectorAll(".painel")].map((e) => ({
      cls: e.className.replace("painel", "").trim() || "numeros",
      h: Math.round(e.getBoundingClientRect().height),
      plano: getComputedStyle(e).boxShadow,
    }));
    const trilhos = [...document.querySelectorAll(".pb-trilho, .fn-trilho, .ge-trilho, .fn-faixa")].map((e) => {
      const c = getComputedStyle(e);
      return { cls: e.className, img: c.backgroundImage === "none" ? "CHAPADO" : "trama", cor: c.backgroundColor, tam: c.backgroundSize };
    });
    return { paineis, trilhos };
  });
  console.log("painel                altura  plano de tinta");
  for (const x of d.paineis) console.log(`  ${x.cls.padEnd(20)}${String(x.h).padStart(6)}  ${x.plano}`);
  const chapados = d.trilhos.filter((t) => t.img === "CHAPADO");
  console.log(`\ntrilhos: ${d.trilhos.length} · com trama de meio-tom: ${d.trilhos.length - chapados.length} · chapados: ${chapados.length}`);
  if (d.trilhos[0]) console.log(`  amostra: ${d.trilhos[0].img} ${d.trilhos[0].cor} ${d.trilhos[0].tam}`);
  if (chapados.length) console.log("  ainda chapados:", chapados.map((t) => t.cls).join(", "));
  console.log("pageerror:", erros(p).length);
  await p.close();
}

const cmds = { beats, cpl, reveal, passos, regressao, diff, figuras, ordem, dados };
if (!cmds[CMD]) { console.log("comandos:", Object.keys(cmds).join(", ")); process.exit(1); }
await cmds[CMD](...ARGS.map((a) => (/^\d+$/.test(a) ? +a : a)));
await browser.close();
