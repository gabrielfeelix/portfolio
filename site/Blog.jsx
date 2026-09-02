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
 *    banco de imagem.
 *
 * Em 01/09 a página mudou de forma, por pedido do Gabriel e com uma quarta
 * referência (taylordesigner, ~/dev/refs/taylordesigner.framer.website):
 *
 *   - a capa grande de destaque SAIU. Ela abria a página com um post
 *     ocupando a janela inteira, e o Gabriel não quis "uma capa muito grande
 *     para um post". A listagem agora abre direto na grade.
 *   - a grade é de DOIS em dois, simétrica, como a fileira de casos da home.
 *     O `largo` e a proporção variando por card saíram junto: todo card tem
 *     a mesma capa retangular, e a página lê como uma coisa só.
 *   - o hover é só o zoom da capa. O véu escuro com o resumo por cima saiu, e
 *     o resumo mora embaixo do título, onde é lido.
 *
 * O card e a capa moram em PostCard.jsx, porque o fim de cada post usa os
 * mesmos dois. */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Dobra, Titulo, GradeCasos, CampoDeVoo } from "./Kit.jsx";
import { CardPost } from "./PostCard.jsx";
import { POSTS, tags, filtrar, temFiltro, temBusca } from "./blog.js";
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

export default function Blog({ ir }) {
  const inicial = useMemo(lerURL, []);
  const [tag, setTag] = useState(inicial.tag);
  const [q, setQ] = useState(inicial.q);

  useEffect(() => { escreverURL({ tag, q }); }, [tag, q]);

  const lista = useMemo(() => tags(POSTS), []);
  const grade = useMemo(() => filtrar(POSTS, { tag, q }), [tag, q]);

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

        {/* A grade mora na MESMA dobra do título. Antes havia uma dobra 02
            só para ela, porque entre as duas ficava a capa de destaque; sem a
            capa, uma segunda dobra seria um cromo e 104px de vão para dizer
            "todos os textos" logo abaixo de "Notas". */}
        {POSTS.length ? (
          <>
            <Barra
              lista={lista}
              tag={tag}
              setTag={setTag}
              q={q}
              setQ={setQ}
              mostrando={grade.length}
              total={POSTS.length}
            />

            {grade.length ? (
              <div className="v2-blog-grade">
                {grade.map((p, i) => (
                  <CardPost key={p.slug} p={p} i={i} n={POSTS.indexOf(p) + 1} ir={ir} />
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
          </>
        ) : null}
      </Dobra>

      {/* O blog devolve para o trabalho: é o argumento da ordem. Quem chegou
          por um texto sai sabendo que existem quatro casos abertos. */}
      <GradeCasos cromo={t("Do outro lado", "The other side")} titulo={t("Isso tudo saiu de algum lugar", "All of this came from somewhere")} ir={ir} />
    </CampoDeVoo>
  );
}
