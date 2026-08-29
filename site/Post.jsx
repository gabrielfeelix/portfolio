/* A página de um post.
 *
 * Estrutura medida no viper (`blog/audemars-piguet.html`), que é a das três
 * referências a que abre melhor: data → título → resumo → tags → capa
 * sangrando → corpo. Bungee fecha com Anterior/Próximo, e isso também entra.
 *
 * Três decisões que não são de gosto:
 *
 * 1. A coluna de leitura mede 640px (`--v2-medida-caso`), não os 809 do
 *    viper. 809 é a medida do TEXTO GRANDE do site; 640 é a que a página de
 *    caso passou a usar na Fase 6, depois de 900px deixarem 500px de vazio à
 *    direita. Leitura longa é leitura longa, e o blog não estreia uma
 *    terceira medida.
 *
 * 2. Sem barra de progresso no topo. Ela foi removida da página de caso em
 *    88c355e por decisão do Gabriel, e não volta pela porta dos fundos só
 *    porque a página é nova. O tempo de leitura fica no cromo, uma vez.
 *
 * 3. O cabeçalho aparece na hora e só o corpo espera a rede: os dados da
 *    ficha vêm do índice, que já está no bundle. É o motivo de o corpo morar
 *    num JSON separado (ver blog.mjs). */

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Dobra, Titulo } from "./Kit.jsx";
import { Pill } from "./Shell.jsx";
import { useRise, useSubir } from "./motion.js";
import {
  porSlug, corpo, vizinhos, relacionados,
  dataLonga, dataCurta, rotuloTag,
} from "./blog.js";

const SITE = "https://gabrielfelix-ux.4yu.com.br";

/* Dado estruturado do post. O Google e os agregadores leem daqui, e é o que
   faz um texto aparecer como artigo com data e autor em vez de página solta.
   Sai do DOM quando a rota muda: dois BlogPosting ao mesmo tempo descrevem
   uma página que não existe. */
function useDadosEstruturados(p) {
  useEffect(() => {
    if (!p) return;
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = "v2-ld-post";
    el.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: p.titulo,
      description: p.resumo,
      datePublished: p.data,
      dateModified: p.data,
      inLanguage: "pt-BR",
      wordCount: p.palavras,
      keywords: rotuloTag(p.tag),
      mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/blog/${p.slug}` },
      author: { "@type": "Person", name: "Gabriel Felix Barbosa", url: `${SITE}/sobre` },
      publisher: { "@type": "Person", name: "Gabriel Felix Barbosa", url: SITE },
      ...(p.capa ? { image: SITE + p.capa } : {}),
    });
    document.head.appendChild(el);
    return () => { if (el.parentNode) el.parentNode.removeChild(el); };
  }, [p]);
}

function Cartao({ p, ir, rot }) {
  return (
    <a
      className="v2-post-vizinho"
      href={`/blog/${p.slug}`}
      onClick={(e) => { e.preventDefault(); ir(`/blog/${p.slug}`); }}
    >
      <span className="v2-post-vizinho-rot">{rot}</span>
      <span className="v2-post-vizinho-titulo">{p.titulo}</span>
      <span className="v2-post-meta">
        {dataCurta(p.data)}<i>·</i>{rotuloTag(p.tag)}
      </span>
    </a>
  );
}

export default function Post({ slug, ir }) {
  const p = porSlug(slug);
  const [html, setHtml] = useState(null);
  const [erro, setErro] = useState(null);
  const rise = useRise();
  const subir = useSubir();

  useDadosEstruturados(p);

  /* `vivo` corta o setState de uma busca que ainda estava no ar quando a
     pessoa já trocou de post: sem ele, o texto do post anterior chega depois
     e sobrescreve o novo. */
  useEffect(() => {
    if (!p) return;
    let vivo = true;
    setHtml(null);
    setErro(null);
    corpo(p.slug)
      .then((h) => { if (vivo) setHtml(h); })
      .catch((e) => { if (vivo) setErro(e.message); });
    return () => { vivo = false; };
  }, [p]);

  if (!p) {
    return (
      <Dobra n="00" nome="Blog" carimbo="404" data-clara="1">
        <Titulo>Esse texto não existe</Titulo>
        <p className="v2-lead">
          O endereço <code>/blog/{slug}</code> não corresponde a nenhum post.
        </p>
        <div className="v2-post-404-cta">
          <Pill href="/blog" onClick={(e) => { e.preventDefault(); ir("/blog"); }}>
            Ver todos os textos
          </Pill>
        </div>
      </Dobra>
    );
  }

  const { anterior, proximo } = vizinhos(p.slug);
  const perto = relacionados(p.slug, 3);

  return (
    <>
      {/* A ficha em cima, no modelo do viper: o leitor sabe a data, o assunto
          e quanto tempo vai gastar ANTES de decidir se lê. */}
      <Dobra n="01" nome="Blog" carimbo={rotuloTag(p.tag).toUpperCase()} data-clara="1">
        <article className="v2-post">
          <header className="v2-post-cabeca">
            <p className="v2-post-meta is-grande">
              {dataLonga(p.data)}<i>·</i>{rotuloTag(p.tag)}<i>·</i>{p.leitura} MIN DE LEITURA
            </p>
            <h1 className="v2-post-titulo">{p.titulo}</h1>
            <motion.p className="v2-post-resumo" {...rise(1)}>{p.resumo}</motion.p>
          </header>

          {p.capa ? (
            <motion.figure className="v2-post-abertura" {...subir(0)}>
              <img src={p.capa} alt={p.capaAlt || ""} decoding="async" />
            </motion.figure>
          ) : null}

          {/* O corpo é HTML gerado pelo build a partir do .md do próprio
              repositório — não é entrada de usuário, não vem de rede de
              terceiro, e é por isso que `dangerouslySetInnerHTML` é seguro
              aqui. Se um dia o texto passar a vir de fora, isto muda. */}
          {html !== null ? (
            <div className="v2-post-corpo" dangerouslySetInnerHTML={{ __html: html }} />
          ) : erro ? (
            <div className="v2-post-corpo">
              <p className="v2-erro">{erro}</p>
              <p>
                <a href={`/blog/${p.slug}`} onClick={(e) => { e.preventDefault(); window.location.reload(); }}>
                  Tentar de novo
                </a>
              </p>
            </div>
          ) : (
            <div className="v2-post-corpo is-carregando" aria-live="polite">
              <p className="v2-post-carregando">Carregando o texto…</p>
            </div>
          )}

          <footer className="v2-post-assinatura">
            <p className="v2-post-meta">Escrito por</p>
            <p className="v2-post-autor">Gabriel Felix Barbosa</p>
            <p className="v2-post-autor-nota">
              UX / Product Designer. Desenho e construo: do protótipo navegável ao
              produto publicado.
            </p>
            <Pill href="/sobre" onClick={(e) => { e.preventDefault(); ir("/sobre"); }}>
              Quem é
            </Pill>
          </footer>
        </article>
      </Dobra>

      {anterior || proximo ? (
        <Dobra n="02" nome="Continue" carimbo="NO BLOG">
          <div className="v2-post-vizinhos">
            {anterior ? <Cartao p={anterior} ir={ir} rot="Mais novo" /> : <span />}
            {proximo ? <Cartao p={proximo} ir={ir} rot="Mais antigo" /> : <span />}
          </div>
        </Dobra>
      ) : null}

      {perto.length ? (
        <Dobra n="03" nome="Perto disso" carimbo={rotuloTag(p.tag).toUpperCase()}>
          <div className="v2-post-perto">
            {perto.map((o, i) => (
              <a
                key={o.slug}
                className="v2-post-perto-item"
                href={`/blog/${o.slug}`}
                onClick={(e) => { e.preventDefault(); ir(`/blog/${o.slug}`); }}
              >
                <span className="v2-post-perto-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="v2-post-perto-titulo">{o.titulo}</span>
                <span className="v2-post-meta">
                  {rotuloTag(o.tag)}<i>·</i>{o.leitura} MIN
                </span>
              </a>
            ))}
          </div>
        </Dobra>
      ) : null}
    </>
  );
}
