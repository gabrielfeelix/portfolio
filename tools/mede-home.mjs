/* Mede a home pré-renderizada contra a mesma home sem pré-render.
 *
 *   npm run build && node tools/mede-home.mjs
 *
 * Sobe um servidor próprio sobre dist/, com gzip, e mede os dois lados na
 * mesma rede simulada. `?vazio=1` serve a casca vazia — o "antes" — e `/`
 * serve o HTML com o hero escrito. Medir localhost contra produção não
 * serviria: o servidor de dev não comprime e o JS cru esconde o efeito.
 *
 * O Lighthouse padrão usa throttling SIMULADO: a página carrega na velocidade
 * real da máquina e as métricas saem de um modelo (Lantern) rodado depois. É o
 * mesmo modelo do PageSpeed, então serve para prever a nota — mas não diz o
 * que o navegador realmente fez.
 *
 * Aqui a garganta é de verdade, pelo CDP: 1,6 Mbps, 150ms de RTT, CPU 4x mais
 * lenta. FCP e LCP saem de PerformanceObserver, e os bytes são contados
 * request a request.
 */
import http from "node:http";
import path from "node:path";
import zlib from "node:zlib";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium, devices } from "playwright";

// o script mora em tools/, e o dist/ é do repositório, um nível acima.
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const TIPOS = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".webm": "video/webm", ".mp4": "video/mp4", ".woff2": "font/woff2", ".txt": "text/plain", ".xml": "application/xml", ".ico": "image/x-icon", ".json": "application/json" };
const COMPRIME = new Set([".html", ".js", ".css", ".svg", ".txt", ".xml", ".json"]);

const servidor = http.createServer(async (req, res) => {
  const [bruto, busca = ""] = req.url.split("?");
  let p = decodeURIComponent(bruto);
  /* O "antes" tem de ser a home em `/`, e não outro endereço: o roteador do
     app lê `location.pathname`, então servir a casca em /antes renderiza o
     fallback de 404 e mede uma página que não existe. A diferença viaja na
     QUERY, que o roteador ignora. */
  if (p === "/") p = /(^|&)vazio=1(&|$)/.test(busca) ? "/rota.html" : "/index.html";
  else if (!path.extname(p)) p = "/rota.html";
  const arq = path.join(DIST, p);
  try { await stat(arq); } catch { res.writeHead(404); return res.end("404"); }
  const ext = path.extname(arq);
  let corpo = await readFile(arq);
  const cab = { "content-type": TIPOS[ext] || "application/octet-stream", "cache-control": "no-store" };
  if (COMPRIME.has(ext) && /gzip/.test(req.headers["accept-encoding"] || "")) { corpo = zlib.gzipSync(corpo); cab["content-encoding"] = "gzip"; }
  cab["content-length"] = corpo.length;
  res.writeHead(200, cab); res.end(corpo);
});
const porta = await new Promise((ok) => servidor.listen(0, () => ok(servidor.address().port)));
const base = `http://localhost:${porta}`;

const navegador = await chromium.launch();

async function medir(rota, segundos = 12) {
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
      const t = (await r.allHeaders())["content-length"];
      recursos.push({ url: r.url().replace(base, ""), bytes: Number(t || 0), tipo: r.request().resourceType() });
    } catch {}
  });

  await pg.addInitScript(() => {
    window.__m = { fcp: null, lcp: null, lcpEl: null };
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === "first-contentful-paint") window.__m.fcp = e.startTime; })
      .observe({ type: "paint", buffered: true });
    new PerformanceObserver((l) => {
      const e = l.getEntries().pop();
      window.__m.lcp = e.startTime;
      window.__m.lcpEl = e.element ? (e.element.tagName + "." + (e.element.className || "").toString()) : (e.url || "?");
      window.__m.lcpTam = Math.round(e.size);
      window.__m.lcpTxt = (e.element && e.element.textContent || "").slice(0, 40);
    }).observe({ type: "largest-contentful-paint", buffered: true });
    /* quando o React terminou de montar: primeira mutação em #v2-root
       depois do carregamento do app */
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
  const m = await pg.evaluate(() => window.__m);
  await ctx.close();

  const total = recursos.reduce((s, r) => s + r.bytes, 0);
  const imagens = recursos.filter((r) => r.tipo === "image");
  return { ...m, total, nReq: recursos.length, nImg: imagens.length, bytesImg: imagens.reduce((s, r) => s + r.bytes, 0), recursos };
}

const ms = (v) => (v == null ? "—" : v >= 1000 ? (v / 1000).toFixed(2) + "s" : Math.round(v) + "ms");
const kb = (b) => (b / 1024).toFixed(0) + " KB";

const antes = await medir("/?vazio=1");
const depois = await medir("/");

console.log("\n(garganta real: 1,6 Mbps · 150ms RTT · CPU 4x · Pixel 5 · janela de 12s)\n");
console.log("| métrica          | antes      | depois     |");
console.log("|------------------|------------|------------|");
console.log(`| FCP              | ${ms(antes.fcp).padEnd(10)} | ${ms(depois.fcp).padEnd(10)} |`);
console.log(`| LCP              | ${ms(antes.lcp).padEnd(10)} | ${ms(depois.lcp).padEnd(10)} |`);
console.log(`| app monta        | ${ms(antes.montou).padEnd(10)} | ${ms(depois.montou).padEnd(10)} |`);
console.log(`\nLCP antes : ${antes.lcpEl}  ${antes.lcpTam}px²  "${antes.lcpTxt}"`);
console.log(`LCP depois: ${depois.lcpEl}  ${depois.lcpTam}px²  "${depois.lcpTxt}"`);
console.log(`| bytes totais     | ${kb(antes.total).padEnd(10)} | ${kb(depois.total).padEnd(10)} |`);
console.log(`| requisições      | ${String(antes.nReq).padEnd(10)} | ${String(depois.nReq).padEnd(10)} |`);
console.log(`| imagens (nº)     | ${String(antes.nImg).padEnd(10)} | ${String(depois.nImg).padEnd(10)} |`);
console.log(`| imagens (bytes)  | ${kb(antes.bytesImg).padEnd(10)} | ${kb(depois.bytesImg).padEnd(10)} |`);

for (const [nome, r] of [["antes", antes], ["depois", depois]]) {
  console.log(`\n${nome} — 8 maiores:`);
  r.recursos.sort((a, b) => b.bytes - a.bytes).slice(0, 8)
    .forEach((x) => console.log(`   ${kb(x.bytes).padStart(9)}  ${x.tipo.padEnd(10)} ${x.url.slice(0, 62)}`));
}

await navegador.close();
servidor.close();
