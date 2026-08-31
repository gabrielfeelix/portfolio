/* Gera volume/assets/og-2026.png, o card de prévia social, a partir de
   tools/og-card.html.

   Existe como ferramenta, e não como PNG solto, porque a arte usa os tokens
   da V2 e o AVIAO_D de site/motion.js: quando um dos dois mudar, o card se
   refaz em vez de ficar mentindo. A arte antiga (volume/assets/og-image.png,
   a capa vermelha do mangá) continua no repo porque o legado-v1 ainda a usa.

   Atenção ao trocar a arte: redes sociais cacheiam a prévia pela URL. Se o
   conteúdo mudar, o nome do arquivo precisa mudar junto, senão o WhatsApp e
   o LinkedIn seguem servindo a versão velha por dias.

   Uso: node tools/og-card.mjs
*/
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const aqui = dirname(fileURLToPath(import.meta.url));
const fonte = resolve(aqui, "og-card.html");
const saida = resolve(aqui, "..", "volume", "assets", "og-2026.png");

const navegador = await chromium.launch();
const pagina = await navegador.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await pagina.goto(`file://${fonte}`, { waitUntil: "networkidle" });
await pagina.evaluate(() => document.fonts.ready);
await pagina.waitForTimeout(600);

// A Switzer vem da fontshare por rede. Se ela não carregar, o card sai em
// system-ui e ninguém percebe até o link já estar compartilhado.
const familia = await pagina.evaluate(
  () => getComputedStyle(document.querySelector(".nome")).fontFamily.split(",")[0].replace(/"/g, "")
);
if (familia !== "Switzer") {
  await navegador.close();
  throw new Error(`A Switzer não carregou: o nome saiu em "${familia}". Card não gerado.`);
}

await pagina.screenshot({ path: saida });
await navegador.close();
console.log(`og-2026.png gerado em ${saida}`);
