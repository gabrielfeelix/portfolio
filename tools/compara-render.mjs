/* Duas pastas dist/, o mesmo site, a mesma rota: mudou algum pixel de layout?
 *
 *   node tools/compara-render.mjs <dist-referencia> [dist-candidato]
 *
 * Existe porque a otimização de desempenho mais barata deste site — cortar a
 * folha em duas e embutir a metade da home — é também a que quebra em
 * silêncio: uma regra que vazava de `case.css` para a home some, e o que
 * aparece não é erro de build, é 64px de margem que sumiram numa largura só.
 * `npm run verifica:home` compara o PRIMEIRO QUADRO; isto compara a página
 * inteira, montada, rolada até o fim, nas duas larguras e em todas as rotas.
 *
 * O que se compara é a CAIXA e o ESTILO COMPUTADO de cada elemento, e não a
 * foto: o hero tem vídeo e a entrada é animada, então duas fotos do mesmo
 * build já saem diferentes. Geometria não mente.
 */
import http from "node:http";
import path from "node:path";
import { readFile, stat } from "node:fs/promises";
import { chromium, devices } from "playwright";

const TIPOS = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".webm": "video/webm", ".mp4": "video/mp4", ".woff2": "font/woff2", ".txt": "text/plain", ".xml": "application/xml", ".ico": "image/x-icon" };

function sobe(dir) {
  const s = http.createServer(async (req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    else if (p === "/en" || p === "/en/") p = "/en.html";
    else if (!path.extname(p)) p = "/rota.html";
    const a = path.join(dir, p);
    try { await stat(a); } catch { res.writeHead(404); return res.end("404"); }
    res.writeHead(200, { "content-type": TIPOS[path.extname(a)] || "application/octet-stream", "cache-control": "no-store" });
    res.end(await readFile(a));
  });
  return new Promise((ok) => s.listen(0, () => ok({ s, porta: s.address().port })));
}

/* `ROTAS=/case/pcyes LARGURAS=desktop node tools/compara-render.mjs ...` para
   reconferir uma combinação só — o passe inteiro leva perto de dez minutos, e
   quase toda divergência pede uma segunda olhada antes de virar diagnóstico. */
const ROTAS = (process.env.ROTAS || "/,/en,/case/pcyes,/case/odex,/case/locarmais-conciliacao,/case/oderco-revenda,/processo,/sobre,/blog").split(",");
const TODAS_LARGURAS = [["celular", devices["Pixel 5"]], ["tablet", { viewport: { width: 900, height: 900 } }], ["desktop", { viewport: { width: 1440, height: 900 } }]];
const LARGURAS = process.env.LARGURAS
  ? TODAS_LARGURAS.filter(([n]) => process.env.LARGURAS.split(",").includes(n))
  : TODAS_LARGURAS;

async function retrato(nav, porta, rota, perfil) {
  const ctx = await nav.newContext({ ...perfil, reducedMotion: "reduce" });
  const pg = await ctx.newPage();
  await pg.goto(`http://localhost:${porta}${rota}`, { waitUntil: "networkidle" }).catch(() => {});
  await pg.waitForTimeout(2500);
  // rola até o fim para acordar tudo que revela por IntersectionObserver
  await pg.evaluate(async () => {
    const passo = innerHeight * 0.8;
    for (let y = 0; y < document.documentElement.scrollHeight; y += passo) {
      scrollTo(0, y); await new Promise((r) => setTimeout(r, 60));
    }
    scrollTo(0, 0); await new Promise((r) => setTimeout(r, 400));
  });
  await pg.waitForTimeout(1200);
  const d = await pg.evaluate(() => {
    const linhas = [];
    /* SCRIPT fora: o inventário de tags é assunto do build, não do desenho, e
       a home portuguesa deixou de carregar o espelho inglês de propósito.
       Contá-los desalinharia todos os índices e afogaria a diferença real. */
    document.querySelectorAll("body *:not(script)").forEach((e, i) => {
      const r = e.getBoundingClientRect(), c = getComputedStyle(e);
      linhas.push([i, e.tagName, e.className && String(e.className).slice(0, 40),
        Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height),
        c.color, c.backgroundColor, c.fontSize, c.fontWeight,
        /* A pilha declarada muda quando entra uma reserva; o que interessa é
           a CAIXA que a fonte desenha, e essa já está nas medidas acima. */
        c.fontFamily.replace(/"Switzer reserva", ?/, "").slice(0, 16),
        c.margin, c.padding, c.display, c.position, c.zIndex, c.borderRadius, c.textAlign].join("|"));
    });
    return { linhas, altura: document.documentElement.scrollHeight, erros: window.__erros || [] };
  });
  await ctx.close();
  return d;
}

const [dirA, dirB = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "dist")] = process.argv.slice(2);
if (!dirA) { console.error("uso: node tools/compara-render.mjs <dist-referencia> [dist-candidato]"); process.exit(2); }

const a = await sobe(dirA), b = await sobe(dirB);
const nav = await chromium.launch();
let quebrou = 0, total = 0;
for (const rota of ROTAS) {
  for (const [nomeL, perfil] of LARGURAS) {
    total++;
    const [ra, rb] = [await retrato(nav, a.porta, rota, perfil), await retrato(nav, b.porta, rota, perfil)];
    /* `.v2-outro-t` é o título do cartão de "outros capítulos", e a lista é
       EMBARALHADA a cada carga (Math.random em Kit.jsx). Duas cargas do MESMO
       build já divergem ali, então comparar essa largura seria ruído puro. É
       a única exclusão, e é por não-determinismo do conteúdo — não por
       tolerância a diferença de layout. */
    const ruido = (l) => /\|v2-outro-t\|/.test(l);
    const dif = ra.linhas.filter((l, i) => l !== rb.linhas[i] && !(ruido(l) && ruido(rb.linhas[i] || "")));
    const nEl = ra.linhas.length !== rb.linhas.length ? ` ELEMENTOS ${ra.linhas.length}≠${rb.linhas.length}` : "";
    const ok = !dif.length && ra.altura === rb.altura && !nEl;
    if (!ok) {
      quebrou++;
      console.log(`✗ ${rota} @${nomeL}  altura ${ra.altura} → ${rb.altura}  ${dif.length}/${ra.linhas.length} elementos diferentes${nEl}`);
      dif.slice(0, 4).forEach((l) => console.log(`    ref: ${l}\n    novo: ${rb.linhas[ra.linhas.indexOf(l)]}`));
    } else {
      console.log(`✓ ${rota} @${nomeL}  ${ra.linhas.length} elementos, ${ra.altura}px`);
    }
  }
}
await nav.close(); a.s.close(); b.s.close();
console.log(quebrou ? `\n${quebrou}/${total} combinações divergem.` : `\n${total}/${total} combinações idênticas.`);
process.exit(quebrou ? 1 : 0);
