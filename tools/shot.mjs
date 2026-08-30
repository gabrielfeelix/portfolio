import { chromium } from "playwright";
const URL = "http://localhost:45553/";
const alvo = process.argv[2] || "#onde";
const nome  = process.argv[3] || "shot";
const b = await chromium.launch();
for (const [rot, vp] of [["desk",{width:1440,height:900}],["mob",{width:390,height:844}]]) {
  const p = await b.newPage({ viewport: vp, deviceScaleFactor: 1 });
  await p.goto(URL, { waitUntil: "networkidle" });
  // As revelacoes sao whileInView e disparam por IntersectionObserver: matar
  // as animacoes de CSS nao ajuda, porque o estado inicial e inline via JS.
  // Entao a pagina e percorrida de verdade, para tudo disparar e assentar.
  await p.evaluate(async () => {
    const alt = document.body.scrollHeight;
    for (let y = 0; y < alt; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  await p.waitForTimeout(900);
  const el = await p.$(alvo);
  if (!el) { console.log(`${rot}: ${alvo} nao encontrado`); await p.close(); continue; }
  await el.scrollIntoViewIfNeeded();
  await p.waitForTimeout(900);
  await el.screenshot({ path: `/tmp/claude-1000/-home-gabfelix-dev-portfolio/${nome}-${rot}.png` });
  const cx = await p.evaluate(() => {
    const q = (s) => { const e=document.querySelector(s); if(!e) return null;
      const c=getComputedStyle(e); return `${c.fontFamily.split(",")[0]} ${c.fontSize} tt:${c.textTransform} ls:${c.letterSpacing}`; };
    return { papel:q(".v2-tra-papel"), pe:q(".v2-tra-pe"), topo:q(".v2-tra-topo") };
  });
  console.log(rot, JSON.stringify(cx));
  await p.close();
}
await b.close();
