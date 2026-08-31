/* A listagem do blog.
 *
 * A forma vem de três referências, medidas em ~/dev/refs e anotadas em
 * docs/ANALISE-REFS.md:
 *
 *   viper       cromo de seção + título espaçado + três cards
 *               (img → título → data → tag). Sem busca, sem filtro.
 *   bungee      grade com proporção de capa VARIANDO de propósito
 *               (aspect-ratio 1, 0.699 e 1.152 medidos no CSS dela). É daí
 *               que vem a composição; não de grade mágica.
 *   launchfolio pills de categoria e o card com resumo de duas linhas.
 *
 * O que NENHUMA das três tem é busca. Ela é desenhada aqui na gramática do
 * site — régua, mono, caixa alta — e não copiada de lugar nenhum.
 *
 * Duas decisões que valem repetir:
 *
 * 1. A proporção da capa vem do frontmatter do post (`formato`), não do
 *    índice na grade. A composição é editorial: quem escolhe qual capa é
 *    retrato é quem escreveu o post e viu a imagem, não um `i % 3` que
 *    acerta por acidente.
 *
 * 2. Post sem capa NÃO vira card mutilado. Ele cai na chapa escura com o
 *    número em display, que é a mesma resposta que a página /processo já dá
 *    para passo sem print honesto. É o caso comum hoje: o blog nasce sem
 *    banco de imagem. */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { m as motion } from "motion/react";
import { Dobra, Titulo, GradeCasos, CampoDeVoo } from "./Kit.jsx";
import { useParallax, useRise, useSubir } from "./motion.js";
import {
  POSTS, tags, filtrar, destaque, dataCurta, rotuloTag,
  temFiltro, temBusca,
} from "./blog.js";
import { t, url } from "./i18n.js";

/* --- estado na URL -------------------------------------------------------
 *
 * `/blog?tag=oficio&q=medir` é compartilhável e sobrevive ao recarregar, que
 * é a mesma regra que o roteamento do site já segue (path real, sem hash;
 * ver app.jsx). `replaceState` e não `pushState`: digitar sete letras na
 * busca não pode encher o histórico com sete voltas. */
function lerURL() {
  const p = new URLSearchParams(window.location.search);
  return { tag: p.get("tag") || "", q: p.get("q") || "" };
}

function escreverURL({ tag, q }) {
  const p = new URLSearchParams();
  if (tag) p.set("tag", tag);
  if (q) p.set("q", q);
  const busca = p.toString();
  try {
    /* `url("/blog")` e não "/blog" cru: esta linha reescreve o endereço a cada
       letra digitada na busca, então um caminho fixo aqui APAGAVA o prefixo de
       idioma — clicar em Blog dentro da versão inglesa pousava em /en/blog e
       um quadro depois voltava para /blog, em português. Foi o único lugar do
       site que desfazia uma navegação já feita, e por isso o mais difícil de
       ver: a URL certa chegava a existir. */
    window.history.replaceState(null, "", url("/blog") + (busca ? `?${busca}` : ""));
  } catch (e) { /* file:// e afins; a tela continua certa, só a URL não acompanha */ }
}

/* --- capa ----------------------------------------------------------------
   Um componente só para os dois estados, porque a alternativa é cada lugar
   que mostra post decidir sozinho o que fazer quando não há imagem — e aí
   metade da página trata o vazio de um jeito e a outra metade de outro. */
function Capa({ p, n, className = "", intensidade = 10 }) {
  /* O hook vem antes do `if`: React exige a mesma ordem de hooks em todo
     render, e post com capa e post sem capa passam pelo mesmo componente. */
  const par = useParallax(intensidade);

  if (p.capa) {
    return (
      /* Parallax na capa. A moldura corta e a foto anda dentro dela: é a
         mesma primitiva que a `Quebra` do kit já usa na home, com a mesma
         folga de 114% de altura para o deslocamento não abrir faixa vazia
         em cima nem embaixo. Em reduced-motion o hook devolve `undefined`
         e a foto fica parada. */
      <span className={`v2-post-capa ${className}`} ref={par.ref}>
        <motion.span className="v2-post-capa-in" style={par.style}>
          <img src={p.capa} alt={p.capaAlt || ""} loading="lazy" decoding="async" />
        </motion.span>
      </span>
    );
  }
  return (
    <span className={`v2-post-capa is-vazia ${className}`} aria-hidden="true">
      <span className="v2-post-capa-tag">{rotuloTag(p.tag)}</span>
      <span className="v2-post-capa-n">{String(n).padStart(2, "0")}</span>
    </span>
  );
}

/* --- o destaque ----------------------------------------------------------
   A largura toda, sangrando de borda a borda. É a peça que nenhuma das três
   referências de blog tem, e é o que faz a página abrir com peso em vez de
   abrir com uma grade. Com um post só no ar, ela É a página. */
function Destaque({ p, ir }) {
  const subir = useSubir();
  if (!p) return null;
  return (
    <motion.a
      className="v2-post-destaque-capa"
      href={url(`/blog/${p.slug}`)}
      onClick={(e) => { e.preventDefault(); ir(`/blog/${p.slug}`); }}
      {...subir(0)}
    >
      <Capa p={p} n={1} className="is-larga" intensidade={16} />
      <span className="v2-post-destaque-texto">
        <span className="v2-post-meta">
          {dataCurta(p.data)}<i>·</i>{rotuloTag(p.tag)}<i>·</i>{p.leitura} MIN
        </span>
        <span className="v2-post-destaque-titulo">{p.titulo}</span>
        <span className="v2-post-destaque-resumo">{p.resumo}</span>
      </span>
    </motion.a>
  );
}

/* --- a barra -------------------------------------------------------------
 *
 * Grudada abaixo da nav enquanto a grade rola: além de servir para filtrar,
 * ela responde sozinha "ainda estou no blog", que é a função que o cromo de
 * seção cumpre no resto do site.
 *
 * Sem pill e sem caixa de input. Raio médio em chip e campo é a assinatura
 * número um de template (M3), e a régua de 1px é a forma que a página de
 * caso já usa. A tag ativa fica em tinta cheia com a régua embaixo; as
 * outras ficam em `muted`. */
function Barra({ lista, tag, setTag, q, setQ, mostrando, total }) {
  const comFiltro = temFiltro(POSTS);
  const comBusca = temBusca(POSTS);
  if (!comFiltro && !comBusca) return null;

  return (
    <div className="v2-blog-barra">
      {comFiltro ? (
        <div className="v2-blog-filtro" role="group" aria-label={t("Filtrar por assunto", "Filter by subject")}>
          <button
            type="button"
            className={"v2-blog-tag" + (tag === "" ? " is-ativa" : "")}
            aria-pressed={tag === ""}
            onClick={() => setTag("")}
          >
            {t("Todos", "All")} <i>({total})</i>
          </button>
          {lista.map((t) => (
            <button
              key={t.tag}
              type="button"
              className={"v2-blog-tag" + (tag === t.tag ? " is-ativa" : "")}
              aria-pressed={tag === t.tag}
              onClick={() => setTag(tag === t.tag ? "" : t.tag)}
            >
              {t.rotulo} <i>({t.n})</i>
            </button>
          ))}
        </div>
      ) : <span />}

      {comBusca ? (
        <div className="v2-blog-busca">
          <label className="v2-blog-busca-rot" htmlFor="v2-blog-q">{t("Buscar", "Search")}</label>
          <input
            id="v2-blog-q"
            type="search"
            className="v2-blog-busca-campo"
            value={q}
            placeholder={t("título, assunto…", "title, subject…")}
            onChange={(e) => setQ(e.target.value)}
          />
          {/* Com busca ou filtro ativos o cromo deixa de ser enfeite e passa a
              dizer quantos sobraram. É a única informação que a pessoa quer
              nesse momento. */}
          {q || tag ? (
            <span className="v2-blog-conta">({mostrando} de {total})</span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/* --- o card ---------------------------------------------------------------
   Sem caixa, sem sombra, raio 0: imagem, meta na mono, título. No hover a
   capa escurece e o resumo entra por cima — a mesma primitiva que a dobra de
   peças da home pede. Um vocabulário de motion, dois lugares (M5). */
function Card({ p, i, n, ir }) {
  const rise = useRise();
  return (
    <motion.a
      className="v2-post-card"
      data-formato={p.formato}
      href={url(`/blog/${p.slug}`)}
      onClick={(e) => { e.preventDefault(); ir(`/blog/${p.slug}`); }}
      /* O resumo mora dentro da janela da capa, então ele vem antes do título
         no DOM e o nome acessível do link saía pelo resumo: "Recusei a minha
         própria home e não sabia dizer por quê. Baixei seis…" em vez do
         título. Na tela a ordem está certa — o resumo só aparece no hover, por
         cima da capa —, o que estava errado era o que o link anuncia. */
      aria-label={p.titulo}
      {...rise(i % 3)}
    >
      <span className="v2-post-card-janela">
        <Capa p={p} n={n} intensidade={8} />
        <span className="v2-post-card-veu" aria-hidden="true" />
        <span className="v2-post-card-resumo">{p.resumo}</span>
      </span>
      <span className="v2-post-meta">
        {dataCurta(p.data)}<i>·</i>{rotuloTag(p.tag)}<i>·</i>{p.leitura} MIN
      </span>
      <span className="v2-post-card-titulo">{p.titulo}</span>
    </motion.a>
  );
}

export default function Blog({ ir }) {
  const inicial = useMemo(lerURL, []);
  const [tag, setTag] = useState(inicial.tag);
  const [q, setQ] = useState(inicial.q);

  useEffect(() => { escreverURL({ tag, q }); }, [tag, q]);

  const lista = useMemo(() => tags(POSTS), []);
  const emDestaque = useMemo(() => destaque(POSTS), []);

  /* O destaque sai da grade só quando a pessoa está vendo tudo. Com filtro ou
     busca ligados ele volta para a lista: escondê-lo faria a contagem mentir
     e o post desaparecer de uma busca pelo próprio título. */
  const cru = useMemo(() => filtrar(POSTS, { tag, q }), [tag, q]);
  const filtrando = Boolean(tag || q);
  const grade = filtrando ? cru : cru.filter((p) => p !== emDestaque);

  const limpar = useCallback(() => { setTag(""); setQ(""); }, []);

  return (
    <CampoDeVoo variante="blog">
      <Dobra id="blog" n="01" nome="Blog" carimbo={`©${new Date().getFullYear()}`} data-clara="1">
        <header className="v2-blog-cabeca">
          <Titulo marca="®" como="h1">{t("Notas", "Notes")}</Titulo>
          <div className="v2-blog-cabeca-dir">
            <p className="v2-lead">
              {t("Ofício, bastidor e carreira. O que eu aprendi medindo, o que deu errado antes de dar certo, e o que ninguém conta em processo seletivo.",
                 "Craft, backstage and career. What I learned by measuring, what went wrong before it went right, and what nobody tells you in a hiring process.")}
            </p>
            <p className="v2-blog-conta-topo">
              {POSTS.length} {POSTS.length === 1 ? t("texto", "text") : t("textos", "texts")}
              {lista.length ? ` · ${lista.length} ${lista.length === 1 ? t("assunto", "subject") : t("assuntos", "subjects")}` : ""}
            </p>
          </div>
        </header>

        {POSTS.length === 0 ? (
          <p className="v2-blog-vazio">
            {t("O primeiro texto está sendo escrito. Volte em alguns dias.",
               "The first text is being written. Come back in a few days.")}
          </p>
        ) : null}
      </Dobra>

      {!filtrando && emDestaque ? <Destaque p={emDestaque} ir={ir} /> : null}

      {POSTS.length ? (
        <Dobra n="02" nome={t("Todos os textos", "Every text")} carimbo={t(`${POSTS.length} NO AR`, `${POSTS.length} LIVE`)}>
          <Barra
            lista={lista}
            tag={tag}
            setTag={setTag}
            q={q}
            setQ={setQ}
            mostrando={cru.length}
            total={POSTS.length}
          />

          {grade.length ? (
            <div className="v2-blog-grade">
              {grade.map((p, i) => (
                <Card key={p.slug} p={p} i={i} n={POSTS.indexOf(p) + 1} ir={ir} />
              ))}
            </div>
          ) : (
            <div className="v2-blog-nada">
              <p>{t("Nada com esse recorte.", "Nothing under that filter.")}</p>
              <button type="button" className="v2-blog-limpar" onClick={limpar}>
                {t(`Ver os ${POSTS.length} textos`, `See all ${POSTS.length} texts`)}
              </button>
            </div>
          )}
        </Dobra>
      ) : null}

      {/* O blog devolve para o trabalho: é o argumento da ordem. Quem chegou
          por um texto sai sabendo que existem quatro casos abertos. */}
      <GradeCasos cromo={t("Do outro lado", "The other side")} titulo={t("Isso tudo saiu de algum lugar", "All of this came from somewhere")} ir={ir} />
    </CampoDeVoo>
  );
}
