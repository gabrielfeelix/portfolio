/* O i18n da V2.
 *
 * A V1 já tem o dela em `volume/i18n.jsx`, e as duas NÃO se misturam de
 * propósito. A divisão é a mesma que separa as duas gerações do site:
 *
 *   volume/i18n.jsx   traduz o que `volume/data.jsx` publica em window —
 *                     os quatro capítulos, os projetos, o processo longo.
 *                     É o arquivo dele e pode ser editado.
 *   site/i18n.js      traduz o que a V2 escreve por conta própria — o hero,
 *                     a declaração, o método, a /sobre, e todo rótulo de
 *                     interface que mora dentro de um .jsx.
 *
 * Inchar o i18n.jsx com copy da V2 quebraria o congelamento de `volume/*` e
 * misturaria as duas gerações num arquivo só. Está anotado no cabeçalho de
 * `site/copy.js` e no handoff de 30/08.
 *
 * `window.LANG` é publicado por volume/i18n.jsx, que roda ANTES do app (a
 * ordem das tags é o contrato, ver buildHtml em build.mjs). O fallback existe
 * para o app subir mesmo se aquele script faltar: sem idioma declarado, o site
 * é português.
 */

export const LANG = (typeof window !== "undefined" && window.LANG === "en") ? "en" : "pt";
export const EN = LANG === "en";

/* O rótulo de interface, escrito nos dois idiomas no ponto de uso.
 *
 * Para RÓTULO isto é melhor que um dicionário de chaves, e a razão é a
 * manutenção: `t("Ver no ar", "See it live")` mostra as duas versões lado a
 * lado para quem estiver editando a linha, e não existe chave para
 * dessincronizar. Um dicionário à parte ganha quando o texto é longo e some
 * quando ele tem três palavras.
 *
 * É também o que `volume/data.jsx` já faz nos rótulos dele, então a V2 não
 * inventa uma segunda convenção para o mesmo problema.
 *
 * Para PROSA a regra se inverte, e por isso ela mora em `site/copy.en.js`:
 * parágrafo inteiro embutido no meio de JSX empurra o código para longe e
 * some com a leitura das duas versões como texto. */
export function t(pt, en) { return EN && en !== undefined ? en : pt; }

/* Sobrepõe o espelho EN sobre a copy PT, campo a campo e em profundidade.
 *
 * ISTO EXISTE POR CAUSA DE UM BUG CONHECIDO, e ele está documentado dentro do
 * próprio volume/i18n.jsx: lá a tradução é aplicada com `Object.assign` raso,
 * então espelhar um ramo obriga a repetir TODOS os campos daquele ramo,
 * inclusive os números. Faltou `desktop`/`mobile` uma vez e o gráfico zerou em
 * inglês com o build passando verde — um dado que sumiu sem ninguém ver.
 *
 * Aqui a mescla é profunda, então o espelho EN só precisa carregar o que
 * MUDA. Número, caminho de imagem e chave de layout ficam onde estão, no PT,
 * e não há como esquecê-los: o que o espelho não diz, ele não apaga.
 *
 * ARRAY tem duas regras, e as duas foram descobertas escrevendo espelho:
 *
 *   mesmo tamanho    mescla item a item, em profundidade. É o caso comum —
 *                    o espelho tem uma versão de cada item e quer trocar só o
 *                    texto. Foi assim que `APOSTA.dado` sobreviveu: os três
 *                    rótulos são traduzidos e os três NÚMEROS (`v`) ficam,
 *                    sem o espelho precisar repetí-los. Repetir número em
 *                    arquivo de tradução é como o gráfico do PCYES zerou em
 *                    inglês uma vez, com o build passando verde.
 *   tamanho diferente  substitui inteiro. Aqui a posição É a informação, e um
 *                    espelho de dois itens sobre um PT de três está dizendo
 *                    que quer dois. A alternativa silenciosa seria um terceiro
 *                    item em português no meio do texto inglês.
 */
/* O espelho, com a guarda de idioma.
 *
 * ESTA FUNÇÃO EXISTE POR CAUSA DE UM BUG QUE FOI AO AR, e ele merece ficar
 * escrito: a primeira versão dos arquivos de copy chamava `mescla` direto,
 * assim —
 *
 *     const tr = (chave, pt) => mescla(pt, EN[chave]);
 *
 * — e `mescla` não sabe nada sobre idioma: ela sobrepõe o que receber. Então o
 * espelho INGLÊS era aplicado nos DOIS idiomas. O site em português abria com
 * o H1 em inglês enquanto a nav, os botões e o rodapé continuavam em português,
 * porque esses passam por `t()`, que tem a guarda.
 *
 * Foi o Gabriel quem viu, testando a volta: "to mudando pra portugues e n ta
 * mudando". E os medidores não pegaram porque contam PALAVRA PORTUGUESA numa
 * página inglesa — texto inglês sobrando numa página portuguesa era o caso
 * exato que nenhum deles procurava.
 *
 * Agora a guarda mora aqui, num lugar só, e quem chama não tem como esquecer.
 * `mescla` continua exportada e pura: ela é a regra de MERGE, e esta é a regra
 * de IDIOMA. Misturar as duas foi o erro. */
export function espelho(pt, en) { return EN ? mescla(pt, en) : pt; }

export function mescla(pt, en) {
  if (en === undefined || en === null) return pt;
  if (Array.isArray(pt) && Array.isArray(en)) {
    if (pt.length !== en.length) return en;
    return pt.map((item, i) => mescla(item, en[i]));
  }
  if (Array.isArray(pt) || Array.isArray(en)) return en;
  if (typeof pt !== "object" || typeof en !== "object") return en;
  const out = { ...pt };
  for (const k of Object.keys(en)) out[k] = mescla(pt[k], en[k]);
  return out;
}
