/* Gera as @font-face de RESERVA com métricas casadas às do Switzer.
 *
 *   node tools/reserva-fonte.mjs        # imprime o bloco para site/fontes.css
 *
 * Por que isto existe, medido em 31/08 com a garganta de 1,6 Mbps:
 *
 * Depois que o CSS da home passou a vir embutido, a primeira pintura caiu de
 * 912ms para ~400ms — cedo demais para o Switzer, que só chega aos ~700ms.
 * Com `font-display: swap` o texto pinta na fonte de sistema e TROCA. O
 * parágrafo do hero é o elemento de LCP, e ele CRESCIA na troca: 14.344px²
 * viravam 15.255px². Duas consequências, as duas caras:
 *
 *   1. o Chrome só registra candidato de LCP MAIOR — então a troca criava um
 *      segundo candidato, e esse repaint ficava preso atrás da montagem do
 *      React. LCP medido: 6,5s, contra 400ms da primeira pintura.
 *   2. o parágrafo crescendo empurrava o pé do hero: CLS saiu de 0 para
 *      0,0177, e CLS vale 25% da nota.
 *
 * A reserva com métricas casadas resolve os dois na raiz: a caixa que a fonte
 * de sistema desenha passa a ser a MESMA que o Switzer desenharia, então não
 * há candidato maior nem empurrão. É a receita de web.dev/articles/
 * font-best-practices, com os números tirados da fonte real em vez de
 * chutados.
 *
 * `local("Arial")` e não `system-ui`: Arial é o único nome que resolve para
 * uma fonte de métrica conhecida nas três plataformas que importam — Arial no
 * Windows e no macOS, Liberation Sans no Linux (metricamente compatível com
 * Arial, e é o que a máquina do PageSpeed usa), Roboto no Android por alias.
 * `system-ui` resolveria para coisas diferentes sem aviso.
 *
 * Rode de novo se trocar um arquivo de fonte, e cole a saída em fontes.css.
 */
import http from "node:http"; import path from "node:path";
import { readFile, stat, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(ROOT, "volume", "fonts", "v2");
const srv = http.createServer(async (rq, rs) => {
  /* Uma página de verdade, e não `about:blank`: origem opaca não busca fonte
     de localhost, e o erro que ela dá ("NetworkError") não diz isso. */
  if (rq.url === "/") { rs.writeHead(200, { "content-type": "text/html" }); return rs.end("<!doctype html><meta charset=utf-8><body>"); }
  const a = path.join(DIR, path.basename(decodeURIComponent(rq.url)));
  try { await stat(a); } catch { rs.writeHead(404); return rs.end(); }
  rs.writeHead(200, { "content-type": "font/woff2" });
  rs.end(await readFile(a));
});
const porta = await new Promise((ok) => srv.listen(0, () => ok(srv.address().port)));

// só as Switzer: a mono e a cursiva são cromo e assinatura, nunca corpo nem
// título, então não são elemento de LCP nem movem bloco de texto.
const arquivos = (await readdir(DIR)).filter((f) => /^switzer-\d+\.woff2$/.test(f)).sort();
const nav = await chromium.launch();
const pg = await (await nav.newContext()).newPage();
await pg.goto(`http://localhost:${porta}/`);

const dados = await pg.evaluate(async ({ porta, arquivos }) => {
  const cv = document.createElement("canvas").getContext("2d");
  /* A amostra é uma frase de verdade do site, e não "abcdef": o que se quer
     casar é o AVANÇO MÉDIO do texto que a página realmente escreve. */
  const AMOSTRA = "Antes de desenhar, eu assisto sessão de usuário. É onde o problema aparece inteiro.";
  const med = (fam, peso) => {
    cv.font = `${peso} 1000px ${fam}`;
    const mx = cv.measureText("Hxg");
    return { asc: mx.fontBoundingBoxAscent / 1000, desc: mx.fontBoundingBoxDescent / 1000, larg: cv.measureText(AMOSTRA).width / 1000 };
  };
  const out = [];
  for (const arq of arquivos) {
    const peso = +arq.match(/-(\d+)\./)[1];
    const f = new FontFace("Alvo" + peso, `url(http://localhost:${porta}/${arq})`, { weight: String(peso) });
    await f.load(); document.fonts.add(f);
    const alvo = med(`"Alvo${peso}"`, peso), res = med('"Arial"', peso);
    out.push({ peso, alvo, res });
  }
  return out;
}, { porta, arquivos });
await nav.close(); srv.close();

const pc = (v) => (v * 100).toFixed(2).replace(/\.?0+$/, "") + "%";
console.log(`/* ---- RESERVA MÉTRICA — GERADO, não edite à mão ----------------------
   node tools/reserva-fonte.mjs  regera este bloco. O porquê está lá. */`);
for (const { peso, alvo, res } of dados) {
  const sa = alvo.larg / res.larg;
  console.log(`@font-face {
  font-family: "Switzer reserva";
  font-style: normal;
  font-weight: ${peso};
  src: local("Arial"), local("Helvetica"), local("Liberation Sans");
  size-adjust: ${pc(sa)};
  ascent-override: ${pc(alvo.asc / sa)};
  descent-override: ${pc(alvo.desc / sa)};
  line-gap-override: 0%;
}`);
}
