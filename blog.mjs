/* O conteúdo do blog: de markdown na pasta para dois artefatos.
 *
 * Por que markdown e não mais uma chave em volume/data.jsx, que é onde todo
 * o resto do conteúdo do site mora: post é PROSA LONGA. Um artigo de mil
 * palavras dentro de template string JS obriga a escapar crase, cifrão e
 * barra invertida, e um erro de escape não quebra o post — quebra o bundle
 * inteiro, e com ele o site. O resto do conteúdo é ficha e frase curta, e
 * por isso continua onde está. Nada foi movido.
 *
 * A saída são DOIS artefatos, de propósito:
 *
 *   site/posts.gerado.js   o índice (título, data, tag, resumo, capa...).
 *                          Entra no bundle: a listagem precisa dele inteiro
 *                          para filtrar e buscar sem ida ao servidor.
 *   dist/conteudo/blog/<slug>.json
 *                          o corpo de UM post, buscado quando alguém abre
 *                          aquele post.
 *
 * Junto, o corpo de todos os posts no bundle faria a home carregar artigo
 * que ninguém pediu, e cresceria para sempre. Separado, o app.js não sente
 * o blog crescer.
 *
 * O JSON é servido como arquivo estático: a Vercel checa o sistema de
 * arquivos ANTES dos rewrites do vercel.json, então o arquivo é devolvido e
 * /blog/x (que não existe em disco) cai no index.html como qualquer outra
 * rota da SPA.
 *
 * A pasta é /conteudo/blog/ e NÃO /blog/, apesar de /blog/ ser o nome óbvio.
 * Medido em 29/08: com os JSONs em dist/blog/, a rota /blog passou a devolver
 * 302 — o servidor via um diretório com aquele nome e redirecionava para
 * /blog/, antes de qualquer fallback de SPA. A listagem inteira sumia atrás de
 * um redirect. Dado e rota não dividem endereço. */

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { marked } from "marked";

export const DIR_POSTS = "conteudo/blog";
/* O inglês mora numa SUBPASTA da mesma pasta, com o MESMO nome de arquivo.
   O nome do arquivo é quem manda no endereço, então o par PT/EN compartilha o
   slug por construção: não existe um mapa de tradução para dessincronizar, e
   trocar de idioma no meio de um post continua no mesmo post.

   Post sem par em inglês não some do site — ele aparece na listagem inglesa
   com o texto português e a marca disso na tela. É melhor que esconder: o
   leitor descobre que o texto existe, em vez de achar que não existe. */
export const DIR_POSTS_EN = "conteudo/blog/en";
export const DIR_MIDIA = "/volume/assets/blog";
/* Endereço público dos corpos. Espelha o do repositório, e de propósito não
   é /blog: ver o comentário do topo. */
export const DIR_CORPO = "/conteudo/blog";

/* --- frontmatter ---------------------------------------------------------
   Um subconjunto de YAML, à mão, porque é tudo que o formato precisa:
   `chave: valor`, um por linha, sem aninhamento. Linha indentada continua a
   anterior, que é o que deixa `resumo` ocupar duas linhas sem virar lista.
   Um parser de YAML completo aqui seria dependência para não usar 95% dela. */
function frontmatter(bruto, arquivo) {
  const m = bruto.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error(`${arquivo}: falta o bloco --- de frontmatter no topo.`);

  const meta = {};
  let ultima = null;
  for (const linha of m[1].split(/\r?\n/)) {
    if (!linha.trim()) continue;
    if (/^\s/.test(linha) && ultima) { meta[ultima] += " " + linha.trim(); continue; }
    const par = linha.match(/^([\w-]+)\s*:\s*(.*)$/);
    if (!par) throw new Error(`${arquivo}: linha de frontmatter sem "chave: valor" → ${linha}`);
    ultima = par[1];
    meta[ultima] = par[2].trim().replace(/^["'](.*)["']$/, "$1");
  }
  return { meta, corpo: m[2] };
}

/* --- diretivas -----------------------------------------------------------
   Markdown não sabe dizer "esta imagem sangra de borda a borda" nem "isto é
   nota de margem", e essas duas formas são a gramática de mídia do site
   (M4 de docs/ANALISE-REFS.md). São três, e continuam sendo três:

     ::figura src=01.webp alt="..." largura=sangra|medida|larga
     legenda opcional
     ::

     ::margem      vai para a coluna de 300px, fora do fluxo de leitura
     ::destaque    a frase que vira pull-quote

   Rodam ANTES do marked e viram HTML cru, que o marked deixa passar. */
function atributos(linha) {
  const at = {};
  for (const m of linha.matchAll(/([\w-]+)=(?:"([^"]*)"|'([^']*)'|(\S+))/g)) {
    at[m[1]] = m[2] !== undefined ? m[2] : m[3] !== undefined ? m[3] : m[4];
  }
  return at;
}

const escapar = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* Caminho de mídia: nome solto é relativo à pasta do próprio post, para o
   autor nunca digitar o prefixo. Caminho absoluto e URL passam intactos. */
function midia(src, slug) {
  if (!src) return "";
  if (/^(https?:)?\/\//.test(src) || src.startsWith("/")) return src;
  return `${DIR_MIDIA}/${slug}/${src}`;
}

function expandirDiretivas(corpo, slug, arquivo) {
  const linhas = corpo.split(/\r?\n/);
  const fora = [];
  let i = 0;
  while (i < linhas.length) {
    const abre = linhas[i].match(/^::(figura|margem|destaque)\b(.*)$/);
    if (!abre) { fora.push(linhas[i++]); continue; }

    const tipo = abre[1];
    const at = atributos(abre[2] || "");
    const dentro = [];
    i++;
    while (i < linhas.length && linhas[i].trim() !== "::") dentro.push(linhas[i++]);
    if (i >= linhas.length) throw new Error(`${arquivo}: ::${tipo} aberta e nunca fechada com ::`);
    i++; // consome o :: de fecho

    const texto = dentro.join("\n").trim();
    const inline = texto ? marked.parseInline(texto) : "";
    let html;

    if (tipo === "figura") {
      if (!at.src) throw new Error(`${arquivo}: ::figura sem src=`);
      if (!at.alt) throw new Error(`${arquivo}: ::figura sem alt= (a imagem precisa ser lida por quem não a vê)`);
      const larg = ["sangra", "larga", "medida"].includes(at.largura) ? at.largura : "medida";
      html =
        `<figure class="v2-post-fig is-${larg}">` +
        `<img src="${escapar(midia(at.src, slug))}" alt="${escapar(at.alt)}" loading="lazy" decoding="async">` +
        (inline ? `<figcaption>${inline}</figcaption>` : "") +
        `</figure>`;
    } else if (tipo === "margem") {
      html = `<aside class="v2-post-margem">${marked.parse(texto)}</aside>`;
    } else {
      html = `<p class="v2-post-destaque">${inline}</p>`;
    }

    fora.push("", html, "");
  }
  return fora.join("\n");
}

/* --- um post -------------------------------------------------------------- */

const OBRIGATORIAS = ["titulo", "data", "tag", "resumo"];

/* `formato` diz que espaço o post ocupa na grade, e tem DOIS valores.
 *
 * A primeira tentativa deu três (quadrado / retrato / paisagem), cada post
 * escolhendo a proporção da própria capa, imitando o bungee — que serve
 * aspect-ratio 1, 0.699 e 1.152 na mesma página. Medido em 29/08 numa grade
 * de três colunas: não funciona. Linha de grade tem a altura do item mais
 * alto, então um retrato ao lado de dois quadrados abre dois buracos de
 * ~180px, e a página lê como tabela mal preenchida. O bungee escapa disso
 * porque a grade dele não é de três colunas alinhadas.
 *
 * A variação que sobra é a que a grade sabe fazer sem buraco: `largo` ocupa
 * a linha inteira, com a capa de um lado e o título do outro. É a quebra de
 * ritmo do viper, que enfia uma imagem sem texto entre duas seções.
 *
 * Os nomes antigos continuam valendo para nenhum .md quebrar. */
const FORMATOS = {
  normal: "normal", largo: "largo",
  quadrado: "normal", retrato: "normal", paisagem: "largo",
};

function umPost(arquivo, bruto, idioma) {
  const { meta, corpo } = frontmatter(bruto, arquivo);

  for (const k of OBRIGATORIAS) {
    if (!meta[k]) throw new Error(`${arquivo}: frontmatter sem "${k}".`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.data)) {
    throw new Error(`${arquivo}: data "${meta.data}" não está em AAAA-MM-DD.`);
  }

  // O nome do arquivo manda no endereço; o prefixo de data existe só para a
  // pasta ficar em ordem no editor e não entra na URL.
  const slug = path.basename(arquivo, ".md").replace(/^\d{4}-\d{2}-\d{2}-/, "");

  const formato = FORMATOS[meta.formato] || "normal";

  /* Tempo de leitura é CONTADO, não digitado. O site inteiro só serve número
     medido, e um "5 min" chutado no frontmatter seria a única exceção.
     200 palavras por minuto é a média para prosa em português. */
  const palavras = corpo.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length;
  /* 200 palavras por minuto é a média para prosa em PORTUGUÊS; em inglês a
     média é mais alta, e a razão é a língua, não o leitor — a palavra
     portuguesa é mais longa. Contar o inglês a 200 daria um tempo inflado num
     texto que o site inteiro promete ter MEDIDO. */
  const leitura = Math.max(1, Math.round(palavras / (idioma === "en" ? 230 : 200)));

  let html = marked.parse(expandirDiretivas(corpo, slug, arquivo));

  // Imagem escrita em markdown puro (![alt](01.webp)) ganha o mesmo prefixo
  // que a diretiva dá, e o lazy que ela não tem como pedir.
  html = html.replace(/<img([^>]*?)src="([^"]+)"([^>]*)>/g, (todo, a, src, b) => {
    if (/loading=/.test(todo)) return todo;
    return `<img${a}src="${escapar(midia(src, slug))}"${b} loading="lazy" decoding="async">`;
  });

  return {
    slug,
    titulo: meta.titulo,
    data: meta.data,
    tag: meta.tag.toLowerCase(),
    resumo: meta.resumo,
    capa: meta.capa ? midia(meta.capa, slug) : null,
    capaAlt: meta.capaAlt || meta.titulo,
    formato,
    leitura,
    palavras,
    destaque: meta.destaque === "true",
    publicado: meta.publicado !== "false",
    html,
  };
}

/* --- a pasta inteira ------------------------------------------------------ */

export async function lerPosts(raiz, { dev = false } = {}) {
  const dir = path.join(raiz, DIR_POSTS);
  if (!existsSync(dir)) return [];

  const nomes = (await readdir(dir)).filter((n) => n.endsWith(".md"));
  const posts = [];
  for (const nome of nomes) {
    const bruto = await readFile(path.join(dir, nome), "utf8");
    const post = umPost(nome, bruto, "pt");

    /* O par em inglês, quando existe. Ele é lido pelo MESMO `umPost`, então
       o frontmatter dele é validado com o mesmo rigor: um post em inglês sem
       `titulo` quebra o build igual ao português, e não passa despercebido
       até alguém abrir a página traduzida. */
    const enPath = path.join(raiz, DIR_POSTS_EN, nome);
    if (existsSync(enPath)) {
      const en = umPost(nome, await readFile(enPath, "utf8"), "en");
      if (en.slug !== post.slug) {
        throw new Error(`blog: o par em inglês de ${nome} deu outro endereço (${en.slug} != ${post.slug}).`);
      }
      /* Só o que MUDA vai para o índice. `data`, `tag`, `capa` e `formato`
         são do post, não do idioma: repetí-los aqui seria criar dois lugares
         para a mesma verdade divergir — e um post que mudasse de data só em
         inglês sairia fora de ordem numa listagem e não na outra. */
      post.en = { titulo: en.titulo, resumo: en.resumo, capaAlt: en.capaAlt,
                  leitura: en.leitura, palavras: en.palavras };
      post.htmlEn = en.html;
    }
    posts.push(post);
  }

  // Rascunho aparece no dev para poder ser lido antes de ir ao ar, e some do
  // build de produção — inclusive do sitemap.
  const vivos = posts.filter((p) => p.publicado || dev);

  const dupes = vivos.map((p) => p.slug).filter((s, i, a) => a.indexOf(s) !== i);
  if (dupes.length) throw new Error(`blog: dois posts com o mesmo endereço → ${dupes.join(", ")}`);

  return vivos.sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : 0));
}

/* --- escrita -------------------------------------------------------------- */

export async function escreverBlog(raiz, dist, posts) {
  // 1. o índice, que entra no bundle. Sem `html`: é ele que fica de fora.
  const indice = posts.map(({ html, htmlEn, publicado, ...resto }) => resto);
  const js =
    "/* GERADO por blog.mjs a cada build. Não edite: edite conteudo/blog/*.md. */\n" +
    "export const POSTS = " + JSON.stringify(indice, null, 2) + ";\n";
  await writeFile(path.join(raiz, "site", "posts.gerado.js"), js);

  // 2. um JSON por post, com o corpo.
  const saida = path.join(dist, "conteudo", "blog");
  await mkdir(saida, { recursive: true });
  /* O corpo em inglês é um arquivo À PARTE, e não um segundo campo no mesmo
     JSON: quem abre o post em português não deveria baixar o texto inglês
     junto. São dois artigos inteiros, e o custo dobraria por nada. */
  const saidaEn = path.join(saida, "en");
  await mkdir(saidaEn, { recursive: true });
  for (const p of posts) {
    await writeFile(path.join(saida, `${p.slug}.json`), JSON.stringify({ slug: p.slug, html: p.html }));
    if (p.htmlEn) {
      await writeFile(path.join(saidaEn, `${p.slug}.json`), JSON.stringify({ slug: p.slug, html: p.htmlEn }));
    }
  }

  return indice;
}
