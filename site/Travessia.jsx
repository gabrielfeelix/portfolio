import React, { useCallback, useEffect, useRef, useState } from "react";

/* A TRAVESSIA: o corte entre uma página e outra.

   O site é uma SPA, então trocar de rota é trocar o conteúdo de <main> num
   quadro só. Sem nada no meio, a troca é seca: a página nova simplesmente
   aparece, e não há nenhum momento em que alguém entenda que ATRAVESSOU. Era
   isso que o Gabriel descrevia como "jogar a tela do nada".

   O desenho é UMA lâmina vermelha na diagonal, subindo de baixo para cima e
   sem nunca voltar: ela cobre a tela, para um instante, e continua subindo até
   sair. Um gesto só, numa direção só.

   A primeira versão tinha três peças — uma placa vermelha, uma preta 90ms
   atrás, e o avião de papel atravessando por cima. O Gabriel reprovou por
   descrição, e a descrição é o diagnóstico: "uma lâmina vermelha em diagonal,
   aí aparece o mouse indo e aí aparece outra lâmina". Três coisas em menos de
   um segundo não lêem como um gesto, lêem como uma fila; e o avião branco
   passando reto foi lido como PONTEIRO, não como avião — o que é justo, porque
   é o que um triângulo claro atravessando a tela parece.

   Ficou a lâmina. O que acontece na parada é o nome de onde se está indo, em
   Geist Mono, que é a voz de cromo do site inteiro: a pausa deixa de ser espera
   e passa a informar. Nenhuma peça nova de vocabulário — nem mascote, nem
   segunda cor, nem outro movimento.

   A rota só troca com a tela COBERTA. É por isso que a troca passa a ser
   assíncrona e que este arquivo existe em vez de duas linhas de CSS: sem esse
   sincronismo o leitor vê a página nova nascer por trás de uma cortina que
   ainda está subindo, que é pior que não ter cortina.

   Os quatro tempos, e o segundo deles NÃO tem duração fixa:

     fecha   a lâmina sobe até cobrir                      340ms
     (troca) a rota muda, o scroll volta ao topo, e o React monta a página
             nova — o que trava a linha principal por quanto tempo essa página
             precisar
     parada  a lâmina fica, e o nome do destino entra e sai  200ms, contados
             DEPOIS de a página nova ter pintado
     abre    a lâmina continua subindo até sair             380ms

   A primeira versão marcava os quatro no relógio, todos a partir do clique, e
   é por isso que o Gabriel via um corte seco no fim. Medido quadro a quadro:
   entre cobrir e voltar a andar a página congela 490ms montando o destino, os
   três relógios seguintes vencem TODOS dentro desse congelamento, e quando a
   linha principal volta o `abre` e a limpeza acontecem quase juntos — a lâmina
   saía do DOM em translateY(-132px) de -1487, ou seja com 9% da saída feita.
   O resto era corte.

   Agora eles são encadeados: a parada só começa a contar quando a página nova
   pintou (dois requestAnimationFrame depois da troca), e a limpeza só é
   marcada quando a saída começa. Travar mais atrasa o conjunto e nunca corta
   nenhum tempo pela metade.

   O efeito colateral é o certo: numa página pesada a lâmina fica parada mais
   tempo, e é exatamente para cobrir isso que uma cortina de troca de página
   existe.

   Quem pediu para nada se mover não vê nada disso (ver o final). */

const FECHA = 340;    // a subida até cobrir
const PARADA = 200;   // o mínimo de parada, contado depois da pintura
const SAI = 380;      // a saída

export function Cortina({ fase, rotulo }) {
  if (!fase) return null;
  return (
    <div className="v2-cortina" data-fase={fase} aria-hidden="true">
      <span className="v2-cortina-placa" />
      {rotulo ? <p className="v2-cortina-rot">( {rotulo} )</p> : null}
    </div>
  );
}

/* `atravessar(troca)` roda `troca()` com a tela coberta e devolve o controle
   quando a cortina já saiu. Se um segundo clique chegar no meio de uma
   travessia, ele é ignorado: dois cortes empilhados viram tremeliques. */
export function useTravessia() {
  const [fase, setFase] = useState(null);
  const [rotulo, setRotulo] = useState(null);
  const ocupado = useRef(false);
  const relogios = useRef([]);

  useEffect(() => () => relogios.current.forEach(clearTimeout), []);

  const atravessar = useCallback((troca, nome) => {
    if (typeof troca !== "function") return;

    /* Sem cortina para quem pediu para nada se mover, e sem cortina se o
       navegador não souber responder: a troca acontece na hora, como sempre
       aconteceu. A leitura é feita no clique e não no mount porque a pessoa
       pode ligar a preferência com o site aberto. */
    let quieto = false;
    try {
      quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {}
    if (quieto) { troca(); return; }

    if (ocupado.current) return;
    ocupado.current = true;

    /* Dois estados para uma animação só, e o primeiro não é enfeite: a cortina
       não existe no DOM antes do clique, então nascer já com `fecha` seria
       nascer no estado FINAL — o navegador não tem de onde transicionar e a
       placa aparece coberta, sem subir. Medido: `matrix(1,-.087,0,1,0,0)` no
       primeiro quadro, ou seja translateY zero.

       `pronta` monta a cortina no lugar de onde ela sobe, e só no quadro
       seguinte vira `fecha`. Dois requestAnimationFrame e não um porque o
       React ainda precisa pintar entre os dois. */
    const marca = (fn, ms) => relogios.current.push(setTimeout(fn, ms));
    /* Dois quadros de folga, e a razão é a mesma nas três vezes em que este
       par aparece aqui: pedir ao React que pinte um estado antes de mudar para
       o próximo. */
    const doisQuadros = (fn) => requestAnimationFrame(() => requestAnimationFrame(fn));

    setRotulo(nome || null);
    setFase("pronta");
    doisQuadros(() => {
      setFase("fecha");
      marca(() => {
        troca();
        /* Daqui em diante o relógio é encadeado, e não absoluto: a parada só
           começa quando a página nova apareceu. */
        doisQuadros(() => {
          setFase("parada");
          /* e mais dois: a parada tem que estar NA TELA para os 220ms serem
             220ms de parada vista. Medido sem isto: a parada pintada durou
             80ms, porque o relógio começava junto com o setState e o React
             gastava o resto pintando. */
          doisQuadros(() => marca(() => {
            setFase("abre");
            marca(() => {
              setFase(null);
              setRotulo(null);
              ocupado.current = false;
            }, SAI + 60);
          }, PARADA));
        });
      }, FECHA);
    });
  }, []);

  return { fase, rotulo, atravessar };
}
