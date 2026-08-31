/* Perfil de carregamento da home, com quebra de LCP e tarefas longas.
 *
 *   node tools/perfil-home.mjs [dirA] [dirB]
 *
 * Sem argumento mede só `dist/`. Com dois, mede os dois lados NO MESMO
 * runner, que é a única comparação que vale (ver docs/HANDOFF-DESEMPENHO.md).
 * Snapshot do "antes": `cp -a dist /tmp/antes` antes de mexer.
 *
 * O que o mede-home.mjs não dava e aqui dá:
 *   - a quebra do LCP em TTFB / atraso de carga / carga / atraso de render,
 *     que é o que o PageSpeed chama de "Detalhamento da LCP" e o que decide
 *     QUAL remédio aplicar;
 *   - as tarefas longas (>50ms) e a soma de TBT entre FCP e TTI aproximado;
 *   - o instante em que cada recurso que bloqueia render terminou.
 *
 * A garganta é a mesma do mede-home.mjs: 1,6 Mbps, 150ms RTT, CPU 4x.
 */
import http from "node:http";
import path from "node:path";
import zlib from "node:zlib";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium, devices } from "playwright";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const TIPOS = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".webm": "video/webm", ".mp4": "video/mp4", ".woff2": "font/woff2", ".txt": "text/plain", ".xml": "application/xml", ".ico": "image/x-icon", ".json": "application/json" };
const COMPRIME = new Set([".html", ".js", ".css", ".svg", ".txt", ".xml", ".json"]);

function sobe(dir) {
  const s = http.createServer(async (req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    else if (p === "/en" || p === "/en/") p = "/en.html";
    else if (!path.extname(p)) p = "/rota.html";
    const arq = path.join(dir, p);
    try { await stat(arq); } catch { res.writeHead(404); return res.end("404"); }
    const ext = path.extname(arq);
    let corpo = await readFile(arq);
    const cab = { "content-type": TIPOS[ext] || "application/octet-stream", "cache-control": "no-store" };
    if (COMPRIME.has(ext) && /gzip/.test(req.headers["accept-encoding"] || "")) { corpo = zlib.gzipSync(corpo, { level: 6 }); cab["content-encoding"] = "gzip"; }
    cab["content-length"] = corpo.length;
    res.writeHead(200, cab); res.end(corpo);
  });
  return new Promise((ok) => s.listen(0, () => ok({ s, porta: s.address().port })));
}

const navegador = await chromium.launch();

async function medir(dir, rota = "/", segundos = 14) {
  const { s, porta } = await sobe(dir);
  const base = `http://localhost:${porta}`;
  const ctx = await navegador.newContext({ ...devices["Pixel 5"] });
  const pg = await ctx.newPage();
  const cdp = await ctx.newCDPSession(pg);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8,
  });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

  const recursos = [];
  pg.on("response", async (r) => {
    try {
      const h = await r.allHeaders();
      recursos.push({ url: r.url().replace(base, ""), bytes: Number(h["content-length"] || 0), tipo: r.request().resourceType() });
    } catch {}
  });

  await pg.addInitScript(() => {
    window.__m = { fcp: null, lcp: null, tarefas: [], cands: [], cls: 0, saltos: [] };
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === "first-contentful-paint") window.__m.fcp = e.startTime; })
      .observe({ type: "paint", buffered: true });
    new PerformanceObserver((l) => {
      for (const c of l.getEntries()) {
        const el = c.element;
        window.__m.cands.push({
          t: Math.round(c.startTime), tam: Math.round(c.size),
          el: el ? el.tagName.toLowerCase() + (el.className ? "." + String(el.className).trim().split(/\s+/).join(".") : "") : (c.url || "?"),
          op: el ? getComputedStyle(el).opacity : "",
        });
      }
      const e = l.getEntries().pop();
      window.__m.lcp = e.startTime;
      window.__m.lcpUrl = e.url || "";
      window.__m.lcpLoad = e.loadTime || 0;      // fim do download do recurso
      window.__m.lcpRender = e.renderTime || 0;  // hora da pintura
      window.__m.lcpTam = Math.round(e.size);
      const el = e.element;
      window.__m.lcpEl = el ? el.tagName.toLowerCase() + (el.className ? "." + String(el.className).trim().split(/\s+/).join(".") : "") : "?";
      window.__m.lcpTxt = ((el && el.textContent) || "").trim().slice(0, 50);
      if (el) {
        const cs = getComputedStyle(el);
        window.__m.lcpEstilo = { opacity: cs.opacity, filter: cs.filter, transform: cs.transform, visibility: cs.visibility };
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });
    try {
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__m.tarefas.push({ i: Math.round(e.startTime), d: Math.round(e.duration) }); })
        .observe({ type: "longtask", buffered: true });
    } catch {}
    /* CLS vale 25% da nota e hoje está em 0: qualquer remédio de LCP que o
       tire de 0 é prejuízo, não conserto. Por isso ele é medido junto, e não
       depois. `hadRecentInput` fora, que é a regra da métrica. */
    try {
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) {
          if (e.hadRecentInput) continue;
          window.__m.cls += e.value;
          if (e.value > 0.0005) window.__m.saltos.push({ i: Math.round(e.startTime), v: +e.value.toFixed(4),
            alvo: (e.sources || []).map((f) => f.node && (f.node.tagName || "") + "." + String(f.node.className || "").slice(0, 24)).slice(0, 2).join(" ") });
        }
      }).observe({ type: "layout-shift", buffered: true });
    } catch {}
    const esp = setInterval(() => {
      const raiz = document.getElementById("v2-root");
      if (!raiz) return;
      clearInterval(esp);
      new MutationObserver((_x, o) => { o.disconnect(); window.__m.montou = performance.now(); })
        .observe(raiz, { childList: true });
    }, 0);
  });

  await pg.goto(base + rota, { waitUntil: "commit" });
  await pg.waitForTimeout(segundos * 1000);
  const m = await pg.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0] || {};
    const rec = performance.getEntriesByType("resource").map((r) => ({
      nome: r.name.replace(location.origin, ""), tipo: r.initiatorType,
      inicio: Math.round(r.startTime), fim: Math.round(r.responseEnd), dur: Math.round(r.duration),
      bytes: r.encodedBodySize,
    }));
    return { ...window.__m, ttfb: Math.round(nav.responseStart || 0), htmlFim: Math.round(nav.responseEnd || 0), rec };
  });
  await ctx.close();
  s.close();
  const total = recursos.reduce((a, r) => a + r.bytes, 0);
  return { ...m, total, nReq: recursos.length };
}

const ms = (v) => (v == null ? "—" : v >= 1000 ? (v / 1000).toFixed(2) + "s" : Math.round(v) + "ms");
const kb = (b) => (b / 1024).toFixed(0) + " KB";

function relata(nome, m) {
  console.log(`\n═══ ${nome} ═══`);
  console.log(`FCP ${ms(m.fcp)}   LCP ${ms(m.lcp)}   app monta ${ms(m.montou)}   ${kb(m.total)} em ${m.nReq} req`);
  console.log(`LCP: <${m.lcpEl}> ${m.lcpTam}px² ${m.lcpUrl ? m.lcpUrl : `"${m.lcpTxt}"`}`);
  if (m.lcpEstilo) console.log(`     estilo final: opacity=${m.lcpEstilo.opacity} filter=${m.lcpEstilo.filter} visibility=${m.lcpEstilo.visibility}`);
  /* A quebra oficial (web.dev/articles/optimize-lcp): TTFB, atraso de carga,
     tempo de carga, atraso de render. Para LCP de TEXTO não existe recurso,
     então as duas fatias do meio são zero e TUDO que não é TTFB é atraso de
     render — o que já é a resposta: o remédio é a thread principal e o CSS,
     nunca a imagem. */
  const carga = m.lcpLoad || 0;
  if (m.lcpUrl && carga) {
    const r = (m.rec || []).find((x) => m.lcpUrl.endsWith(x.nome));
    const inicio = r ? r.inicio : m.ttfb;
    console.log(`     quebra: TTFB ${ms(m.ttfb)} · atraso de carga ${ms(inicio - m.ttfb)} · carga ${ms(carga - inicio)} · atraso de render ${ms(m.lcp - carga)}`);
  } else {
    console.log(`     quebra: TTFB ${ms(m.ttfb)} · atraso de render ${ms(m.lcp - m.ttfb)}  (LCP de texto: sem recurso)`);
  }
  console.log("     candidatos de LCP, na ordem:");
  (m.cands || []).forEach((c) => console.log(`       @${String(ms(c.t)).padStart(7)}  ${String(c.tam).padStart(6)}px²  opacity=${c.op}  ${c.el.slice(0, 60)}`));
  console.log(`CLS ${(m.cls || 0).toFixed(4)}` + (m.saltos && m.saltos.length ? "  saltos: " + m.saltos.map((s) => `@${ms(s.i)} ${s.v} (${s.alvo})`).join(" · ") : ""));
  const tb = (m.tarefas || []).reduce((a, t) => a + Math.max(0, t.d - 50), 0);
  console.log(`TBT aprox (soma de tarefa longa − 50ms): ${ms(tb)} em ${m.tarefas.length} tarefas`);
  (m.tarefas || []).slice(0, 6).forEach((t) => console.log(`     @${ms(t.i)} dura ${ms(t.d)}`));
  console.log("recursos que atrasam o primeiro quadro:");
  (m.rec || []).filter((r) => /\.(css|js|woff2)$/.test(r.nome) || r.tipo === "link")
    .sort((a, b) => a.fim - b.fim).slice(0, 12)
    .forEach((r) => console.log(`   ${String(r.nome).slice(0, 46).padEnd(46)} ${String(ms(r.inicio)).padStart(7)} → ${String(ms(r.fim)).padStart(7)}  ${kb(r.bytes).padStart(8)}`));
  console.log("8 maiores:");
  (m.rec || []).slice().sort((a, b) => b.bytes - a.bytes).slice(0, 8)
    .forEach((r) => console.log(`   ${kb(r.bytes).padStart(9)}  ${String(r.nome).slice(0, 58)}`));
}

const args = process.argv.slice(2);
const rota = process.env.ROTA || "/";
if (args.length === 0) args.push(path.join(ROOT, "dist"));
console.log(`(garganta: 1,6 Mbps · 150ms RTT · CPU 4x · Pixel 5 · rota ${rota})`);
for (const dir of args) relata(path.basename(dir) + " — " + dir, await medir(dir, rota));

await navegador.close();
