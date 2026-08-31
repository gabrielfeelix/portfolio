/* Entrada de servidor — o primeiro quadro da HOME, escrito no build.
 *
 * Por que este arquivo existe: até 31/08 o servidor entregava
 * `<div id="v2-root"></div>` vazio, e nada aparecia até o React baixar,
 * parsear, executar e montar a home inteira. Em 4G lento com CPU 4x mais
 * lenta isso eram 3s de CPU pura depois de todos os bytes já terem chegado —
 * tela branca nos quatro primeiros quadros da tira do Lighthouse, Speed Index
 * (7,3s) pior que o LCP (4,5s). Ver docs/HANDOFF-PRERENDER.md, seção 3.
 *
 * ISTO NÃO É UM SEGUNDO SITE. A marcação sai dos MESMOS componentes que o
 * cliente monta — `Home.jsx`, `Shell.jsx` —, gerada por `renderToString`
 * dentro do `npm run build`. Quem edita a home continua editando só o .jsx.
 * Se algum dia alguém precisar corrigir o pré-render editando HTML à mão, a
 * implementação está errada: pare e repense.
 *
 * NÃO HIDRATAMOS. O cliente segue chamando `createRoot(...).render(...)`, que
 * limpa o container e monta do zero, exatamente como já fazia. O HTML daqui é
 * pintura inicial e nada mais. Hidratar exigiria que este quadro batesse ao
 * pixel com o primeiro quadro do cliente, e a home tem Framer Motion em 294
 * pontos, Lenis, cursor próprio e um relógio que imprime a hora — qualquer
 * divergência faz o React descartar a árvore inteira e a gente pagaria o
 * custo do SSR sem receber o benefício.
 *
 * SÓ A PRIMEIRA TELA, e isso foi medido e não suposto.
 *
 * A primeira versão escrevia a home inteira — 55 KB, 77 <img>, 48 <svg>. Em
 * 4G lento com CPU 4x o FCP caiu de 4,6s para 1,1s, mas o LCP subiu de 4,9s
 * para 6,3s, e a causa apareceu numa medida só: o app passou a montar em
 * 3,72s em vez de 2,16s. Parsear e fazer layout de um DOM que o React vai
 * jogar fora custa 1,56s de thread, e TUDO que depende de JS desliza junto —
 * inclusive o elemento de LCP, que é o `<p class="v2-hero-sub">`.
 *
 * Abaixo da dobra o pré-render não pinta nada que alguém veja: é custo puro.
 * Então o servidor escreve o nav e o hero, que é o que aparece na chegada, e
 * o React monta o resto como sempre montou.
 *
 * O que NÃO entra, e o motivo de cada um:
 *   - tudo abaixo do hero, pelo que está escrito acima;
 *   - `Cursor`, que só existe com ponteiro e desenha por motion value;
 *   - `Cortina`, que devolve null enquanto não há travessia (fase = null);
 *   - `useScrollSuave`, `useRota`, `useTravessia` e a fila de efeitos do App,
 *     que são todos comportamento e nenhum deles pinta.
 */

import React from "react";
import { renderToString } from "react-dom/server.browser";
import { LazyMotion, domAnimation } from "motion/react";
import { Nav } from "./Shell.jsx";
import { Hero } from "./Home.jsx";

/* `ir` navega, e no build não há para onde ir. Um no-op mantém a assinatura
   dos componentes intacta em vez de espalhar `ir && ir(...)` por eles. */
const nada = () => {};

function Pagina() {
  return (
    /* O MESMO provedor do cliente. Sem ele o `m.*` do Hero não renderiza no
       servidor, e o build quebra em vez de escrever HTML errado. */
    <LazyMotion features={domAnimation} strict>
      <div className="v2-shell">
        <Nav sobreEscuro={false} ir={nada} rota={{ tipo: "home", path: "/" }} trocarIdioma={nada} />
        <main>
          <Hero paraCasos={nada} />
        </main>
      </div>
    </LazyMotion>
  );
}

/* `React` sai junto porque `volume/data.js` é script clássico e abre com
   `const { useState, ... } = React` — ele precisa do MESMO React que
   renderiza aqui, senão os hooks de lá rodam contra outra instância. Quem
   liga os dois é o build, em `preRender()`. */
export function render() {
  return renderToString(<Pagina />);
}

export { React };
