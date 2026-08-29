/* O adaptador do blog, do mesmo naipe que content.js.
 *
 * A diferença é a origem: content.js lê de `window`, porque a V1 publica lá.
 * Aqui a origem é posts.gerado.js, escrito pelo build a partir de
 * conteudo/blog/*.md. Ver blog.mjs. */

import { POSTS } from "./posts.gerado.js";

export { POSTS };

/* As três famílias do blog, e o rótulo que cada uma mostra na tela.
 *
 * O filtro por tag só existe porque o blog é misturado de propósito: ofício,
 * bastidor e carreira não são o mesmo assunto e nem o mesmo leitor. Com uma
 * família só, filtro seria moldura vazia.
 *
 * Tag que aparecer num .md sem estar aqui NÃO quebra a página: vira rótulo
 * com a inicial maiúscula. Post não pode sumir do site por causa de uma
 * chave que faltou nesta tabela. */
const ROTULOS = {
  oficio:   "Ofício",
  bastidor: "Bastidor",
  carreira: "Carreira",
};

export function rotuloTag(tag) {
  return ROTULOS[tag] || (tag ? tag.charAt(0).toUpperCase() + tag.slice(1) : "");
}

/* As tags que EXISTEM, na ordem em que foram declaradas acima, cada uma com
   sua contagem. Ordem fixa e não por frequência: a barra de filtro não pode
   trocar de ordem sozinha quando um post novo entra — quem já sabe onde
   clicar erraria o alvo. */
export function tags(posts = POSTS) {
  const conta = {};
  for (const p of posts) conta[p.tag] = (conta[p.tag] || 0) + 1;
  const conhecidas = Object.keys(ROTULOS).filter((t) => conta[t]);
  const resto = Object.keys(conta).filter((t) => !(t in ROTULOS)).sort();
  return [...conhecidas, ...resto].map((t) => ({ tag: t, rotulo: rotuloTag(t), n: conta[t] }));
}

/* --- as duas portas, e quando cada uma abre ------------------------------
 *
 * Decidido com o Gabriel em 29/08: filtro e busca ficam no código desde o
 * primeiro dia, mas só APARECEM quando têm o que fazer. Barra de busca sobre
 * três posts é moldura, e moldura vazia é exatamente o que faz uma página
 * parecer template. Passados os números, ela nasce sozinha, sem segunda obra.
 *
 * Nenhuma das três referências de blog (viper, bungee, launchfolio) tem
 * busca; a launchfolio tem filtro por categoria com cinco famílias e uns
 * quinze posts. Os números abaixo são a leitura disso. */
export const MIN_FILTRO = 5;   // posts, e ao menos duas tags
export const MIN_BUSCA  = 8;

export const temFiltro = (posts = POSTS) => posts.length >= MIN_FILTRO && tags(posts).length >= 2;
export const temBusca  = (posts = POSTS) => posts.length >= MIN_BUSCA;

/* --- busca ---------------------------------------------------------------
   Sem acento e sem caixa dos dois lados: quem digita "oficio" tem que achar
   "Ofício", e quem digita no celular quase nunca põe acento. */
const normal = (s) =>
  String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function filtrar(posts, { tag = "", q = "" } = {}) {
  let saida = posts;
  if (tag) saida = saida.filter((p) => p.tag === tag);
  const termo = normal(q).trim();
  if (termo) {
    const partes = termo.split(/\s+/);
    saida = saida.filter((p) => {
      const alvo = normal(`${p.titulo} ${p.resumo} ${rotuloTag(p.tag)}`);
      return partes.every((t) => alvo.includes(t));
    });
  }
  return saida;
}

export const porSlug = (slug) => POSTS.find((p) => p.slug === slug) || null;

/* O destaque é o post marcado, e o mais recente quando ninguém foi marcado —
   a listagem nunca abre sem uma capa grande. */
export function destaque(posts = POSTS) {
  return posts.find((p) => p.destaque) || posts[0] || null;
}

export function vizinhos(slug) {
  const i = POSTS.findIndex((p) => p.slug === slug);
  if (i === -1) return { anterior: null, proximo: null };
  // POSTS vem do mais novo para o mais velho: o "próximo" na leitura é o
  // mais velho, que é o de índice maior.
  return { anterior: POSTS[i - 1] || null, proximo: POSTS[i + 1] || null };
}

export function relacionados(slug, n = 3) {
  const atual = porSlug(slug);
  if (!atual) return [];
  const mesmaTag = POSTS.filter((p) => p.slug !== slug && p.tag === atual.tag);
  const resto = POSTS.filter((p) => p.slug !== slug && p.tag !== atual.tag);
  return [...mesmaTag, ...resto].slice(0, n);
}

/* --- datas ---------------------------------------------------------------
   `new Date("2026-09-02")` é lido como UTC e, num fuso negativo como o
   nosso, imprime o dia anterior. Por isso a data é partida na mão: ela é uma
   etiqueta de calendário, não um instante. */
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export function dataLonga(iso) {
  const [a, m, d] = String(iso).split("-").map(Number);
  return `${d} de ${MESES[m - 1]} de ${a}`;
}

export function dataCurta(iso) {
  const [a, m, d] = String(iso).split("-");
  return `${d}.${m}.${a.slice(2)}`;
}

/* --- o corpo do post -----------------------------------------------------
   Fica fora do bundle e é buscado quando alguém abre o post. O cache é de
   sessão: voltar para a listagem e reabrir o mesmo post não busca de novo. */
const cache = new Map();

export async function corpo(slug) {
  if (cache.has(slug)) return cache.get(slug);
  const r = await fetch(`/blog/${slug}.json`, { headers: { accept: "application/json" } });
  if (!r.ok) throw new Error(`o texto deste post não carregou (${r.status})`);
  const dados = await r.json();
  cache.set(slug, dados.html);
  return dados.html;
}
