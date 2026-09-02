/* O card de post, e a capa que ele usa.
 *
 * Mora fora de Blog.jsx porque aparece em dois lugares: na grade da listagem
 * e no "Continue" do fim de cada post. Antes o fim do post tinha um cartão só
 * de texto, e a listagem outro com capa; a referência de 01/09
 * (taylordesigner, em ~/dev/refs) fecha o artigo com os mesmos dois cards da
 * listagem, e é isso que o leitor reconhece: a peça que ele clicou para
 * chegar aqui é a peça que o leva adiante.
 *
 * A forma do card é a da referência: capa retangular, uma linha de meta na
 * mono, o título. Sem caixa, sem sombra, sem véu. O hover é um zoom lento da
 * capa e nada mais — a mesma escala e o mesmo tempo da capa cheia dos casos
 * na home (`.v2-cartao-capa`, 1.035 em 900ms), para o site ter um jeito só de
 * responder ao ponteiro sobre uma imagem. */

import React from "react";
import { m as motion } from "motion/react";
import { useParallax, useRise } from "./motion.js";
import { dataCurta, rotuloTag } from "./blog.js";
import { url } from "./i18n.js";

/* --- capa ----------------------------------------------------------------
   Um componente só para os dois estados, porque a alternativa é cada lugar
   que mostra post decidir sozinho o que fazer quando não há imagem — e aí
   metade da página trata o vazio de um jeito e a outra metade de outro. */
export function Capa({ p, n, className = "", intensidade = 10 }) {
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

/* --- o card ---------------------------------------------------------------
   Capa, meta, título, resumo. O resumo morava dentro da janela da capa e
   entrava no hover por cima de um véu escuro; saiu de lá em 01/09 a pedido
   do Gabriel ("passo o mouse, dá um zoom na imagem, só isso"). Embaixo do
   título ele é lido em vez de adivinhado, e no toque já era assim.

   `rot` é o rótulo opcional acima da meta ("Mais novo", "Mais antigo") que o
   fim do post usa para dizer para que lado o card leva. */
export function CardPost({ p, i = 0, n = 1, ir, rot }) {
  const rise = useRise();
  return (
    <motion.a
      className="v2-post-card"
      href={url(`/blog/${p.slug}`)}
      onClick={(e) => { e.preventDefault(); ir(`/blog/${p.slug}`); }}
      /* O nome acessível do link é o título, e não a concatenação de meta,
         título e resumo que o leitor de tela montaria sozinho. */
      aria-label={p.titulo}
      {...rise(i % 2)}
    >
      <span className="v2-post-card-janela">
        <Capa p={p} n={n} intensidade={8} />
      </span>
      {rot ? <span className="v2-post-card-rot">{rot}</span> : null}
      <span className="v2-post-meta">
        {rotuloTag(p.tag)}<i>/</i>{dataCurta(p.data)}<i>/</i>{p.leitura} MIN
      </span>
      <span className="v2-post-card-titulo">{p.titulo}</span>
      <span className="v2-post-card-resumo">{p.resumo}</span>
    </motion.a>
  );
}
