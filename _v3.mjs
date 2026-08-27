import { chromium } from "playwright";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const DIST = "/home/gabfelix/dev/portfolio/dist";
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".ttf": "font/ttf" };
const srv = http.createServer((q, s) => {
  let p = decodeURIComponent(q.url.split("?")[0]);
  if (p.includes("_vercel")) { s.writeHead(404); s.end(); return; }
  let f = path.join(DIST, p);
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(DIST, "index.html");
  s.writeHead(200, { "content-type": MIME[path.extname(f)] || "application/octet-stream" });
  fs.createReadStream(f).pipe(s);
});
await new Promise((r) => srv.listen(4321, r));

const OUT = "/tmp/claude-1000/-home-gabfelix-dev-portfolio/1644c557-1863-4b63-8c35-71be262c9304/scratchpad/";
const b = await chromium.launch();
const falhas = [];
const CAPS = ["pcyes", "locarmais-conciliacao", "odex", "oderco-revenda", "portfolio"];

for (const lang of ["pt", "en"]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 950 } });
  await ctx.addInitScript((l) => { try { localStorage.setItem("vol-lang", l); } catch (e) {} }, lang);
  const pg = await ctx.newPage();
  const errs = [];
  pg.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));

  for (const cap of CAPS) {
    await pg.goto("http://localhost:4321/#/cap/" + cap, { waitUntil: "networkidle" });
    await pg.waitForTimeout(1400);
    const i = await pg.evaluate(() => {
      const img = document.querySelector(".cover-art .cover-img");
      const box = document.querySelector(".cover-art");
      let corte = null;
      if (img && box) {
        const propImg = img.naturalWidth / img.naturalHeight;
        const propBox = box.clientWidth / box.clientHeight;
        // object-fit:cover corta o excedente do lado mais largo
        corte = Math.round(Math.abs(1 - propImg / propBox) * 100);
      }
      return {
        temImg: !!img,
        cortePct: corte,
        figmaBtn: document.querySelectorAll(".proto-figma").length,
        figmaTxt: /Abrir no Figma|Open in Figma/.test(document.body.innerText),
        protoPh: document.querySelectorAll(".proto-live.is-ph").length,
        protoOk: document.querySelectorAll("a.proto-live").length,
      };
    });
    const tag = `${lang} ${cap}`;
    if (i.figmaBtn || i.figmaTxt) falhas.push(`${tag}: botão do Figma ainda aparece`);
    if (i.protoPh) falhas.push(`${tag}: placeholder de protótipo ainda aparece`);
    if (i.temImg && i.cortePct > 6) falhas.push(`${tag}: capa cortando ${i.cortePct}%`);
    if (lang === "pt") console.log(`  ${cap.padEnd(22)} capa=${i.temImg ? "sim" : "—"} corte=${i.cortePct ?? "—"}% figma=${i.figmaBtn} proto=${i.protoOk}`);
  }
  if (errs.length) falhas.push(`${lang}: JS -> ${errs[0]}`);
  await ctx.close();
}

const pg = await b.newPage({ viewport: { width: 1440, height: 950 } });
await pg.goto("http://localhost:4321/#/cap/pcyes", { waitUntil: "networkidle" });
await pg.waitForTimeout(1800);
await pg.screenshot({ path: OUT + "HERO-pcyes.png" });

console.log(falhas.length ? "FALHAS:\n  " + falhas.join("\n  ") : "\n✓ capas sem corte, Figma removido, protótipo sem placeholder — PT e EN");
await b.close();
srv.close();
