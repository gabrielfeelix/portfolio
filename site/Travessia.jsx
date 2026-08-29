import React, { useCallback, useEffect, useRef, useState } from "react";

/* A TRAVESSIA: o corte entre uma página e outra.

   O site é uma SPA, então trocar de rota é trocar o conteúdo de <main> num
   quadro só. Sem nada no meio, a troca é seca: a página nova simplesmente
   aparece, e não há nenhum momento em que alguém entenda que ATRAVESSOU.

   O desenho é UM VÉU ESCURO, e o gesto inteiro está no tempo, não na forma.
   Medido no fuel.framer.website a 25fps, que foi a referência que o Gabriel
   trouxe em 29/08 (a análise inteira está em ~/dev/refs/fuel-ANALISE.md):

     4.76s   brilho 47.30   página velha, parada
     4.80s   brilho  1.11   ← corte seco para preto, UM quadro
     4.88s   brilho  2.47   ← segura
     5.16s   brilho 68.90
     5.40s   brilho 102.83
     5.76s   brilho 126.52  ← final

   Três tempos, e o primeiro é o que faz a coisa toda funcionar:

     cobre    o véu aparece INTEIRO, sem animação nenhuma      1 quadro
     (troca)  a rota muda, o scroll volta ao topo, o React monta a página nova
     parada   o véu fica, contado DEPOIS de a página nova pintar   120ms
     abre     o véu some                                          850ms

   NÃO existe animação de saída, e isso é a decisão, não um atalho. É por não
   ter saída que a navegação lê como rápida: o clique tem resposta no mesmo
   quadro. Todo o tempo percebido está na revelação, que é longa e desacelera —
   e uma revelação longa depois de uma resposta instantânea lê como fluidez,
   enquanto os dois lados animados leem como espera.

   ISTO SUBSTITUIU A LÂMINA VERMELHA, em 29/08, a pedido do Gabriel: "tira a
   lâmina vermelha de travessia, quero igual eu pedi". Saiu junto o rótulo do
   destino que aparecia na parada — com 120ms de parada não há o que ler, e
   texto que ninguém alcança é ruído, não informação.

   A rota só troca com a tela COBERTA. É por isso que a troca é assíncrona e
   que este arquivo existe em vez de duas linhas de CSS: sem esse sincronismo o
   leitor vê a página nova nascer por trás de um véu que ainda está entrando.

   Os tempos são encadeados, e não marcados todos a partir do clique. A parada
   só começa a contar quando a página nova pintou (dois requestAnimationFrame
   depois da troca). Numa página pesada o véu fica parado mais tempo, que é
   exatamente para isso que uma cortina de troca de página existe.

   Quem pediu para nada se mover não vê nada disso (ver o final). */

const PARADA = 120;   // o mínimo de parada, contado depois da pintura
const SAI = 850;      // a revelação

export function Cortina({ fase }) {
  if (!fase) return null;
  return <div className="v2-cortina" data-fase={fase} aria-hidden="true" />;
}

/* `atravessar(troca)` roda `troca()` com a tela coberta e devolve o controle
   quando o véu já saiu. Se um segundo clique chegar no meio de uma travessia,
   ele é ignorado: dois cortes empilhados viram tremeliques. */
export function useTravessia() {
  const [fase, setFase] = useState(null);
  const ocupado = useRef(false);
  const relogios = useRef([]);

  useEffect(() => () => relogios.current.forEach(clearTimeout), []);

  const atravessar = useCallback((troca) => {
    if (typeof troca !== "function") return;

    /* Sem véu para quem pediu para nada se mover: a troca acontece na hora,
       como sempre aconteceu. A leitura é feita no clique e não no mount porque
       a pessoa pode ligar a preferência com o site aberto. */
    let quieto = false;
    try {
      quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {}
    if (quieto) { troca(); return; }

    if (ocupado.current) return;
    ocupado.current = true;

    const marca = (fn, ms) => relogios.current.push(setTimeout(fn, ms));
    /* Dois quadros de folga, e a razão é a mesma nas duas vezes em que este
       par aparece aqui: pedir ao React que pinte um estado antes de mudar para
       o próximo. */
    const doisQuadros = (fn) => requestAnimationFrame(() => requestAnimationFrame(fn));

    /* `cobre` já é o estado final do véu — opacidade 1, sem transição. Aqui
       não existe o problema que a lâmina tinha (nascer no estado final e não
       ter de onde subir), porque não há entrada para animar: o corte seco É o
       desenho. Um quadro para o véu pintar, e a rota troca por baixo dele. */
    setFase("cobre");
    doisQuadros(() => {
      troca();
      /* Daqui em diante o relógio é encadeado: a parada só começa quando a
         página nova apareceu. */
      doisQuadros(() => {
        setFase("parada");
        marca(() => {
          setFase("abre");
          marca(() => {
            setFase(null);
            ocupado.current = false;
          }, SAI + 60);
        }, PARADA);
      });
    });
  }, []);

  return { fase, atravessar };
}
