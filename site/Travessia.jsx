import React, { useCallback, useEffect, useRef, useState } from "react";

/* A TRAVESSIA: o corte entre uma página e outra.

   O site é uma SPA, então trocar de rota é trocar o conteúdo de <main> num
   quadro só. Sem nada no meio, a troca é seca: a página nova simplesmente
   aparece, e não há nenhum momento em que alguém entenda que ATRAVESSOU. Era
   isso que o Gabriel descrevia como "jogar a tela do nada".

   O desenho é o mesmo da decolagem, e de propósito: duas placas na diagonal
   subindo de baixo para cima, a vermelha na frente e a preta 90ms atrás, e o
   avião de papel atravessando enquanto a tela está coberta. Quem viu o site
   carregar já viu esse corte uma vez; ao trocar de página ele reconhece.

   A rota só troca com a tela COBERTA. É por isso que a troca passa a ser
   assíncrona e que este arquivo existe em vez de duas linhas de CSS: sem esse
   sincronismo o leitor vê a página nova nascer por trás de uma cortina que
   ainda está subindo, que é pior que não ter cortina.

   Os tempos, em ms a partir do clique:

       0   a vermelha começa a subir      (300ms)
      90   a preta começa a subir         (300ms)
     150   o avião entra pela esquerda    (640ms)
     390   TELA COBERTA — a rota troca e o scroll volta ao topo
     520   a preta sai para cima          (320ms)
     610   a vermelha sai atrás dela      (320ms)
     980   a cortina sai do DOM

   Um segundo é longo para um clique de menu, e é intencional: o corte é o
   único momento do site em que a pessoa não está lendo nada, e encurtar para
   400ms transformaria o corte num piscão — o efeito que ele existe para
   evitar. Quem pediu para nada se mover não vê nada disso (ver o final). */

const FECHA = 390;   // tela coberta
const ABRE = 520;    // a cortina começa a sair
const LIMPA = 980;   // e some do DOM

export function Cortina({ fase }) {
  if (!fase) return null;
  return (
    <div className="v2-cortina" data-fase={fase} aria-hidden="true">
      {/* a ordem importa: a preta é a segunda e por isso pinta por cima */}
      <span className="v2-cortina-placa is-accent" />
      <span className="v2-cortina-placa is-ink" />
      <span className="v2-cortina-aviao">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M23 12 L3 3 L9 12 L3 21 Z" fill="#fff" />
        </svg>
      </span>
    </div>
  );
}

/* `atravessar(troca)` roda `troca()` com a tela coberta e devolve o controle
   quando a cortina já saiu. Se um segundo clique chegar no meio de uma
   travessia, ele é ignorado: dois cortes empilhados viram tremeliques. */
export function useTravessia() {
  const [fase, setFase] = useState(null);
  const ocupado = useRef(false);
  const relogios = useRef([]);

  useEffect(() => () => relogios.current.forEach(clearTimeout), []);

  const atravessar = useCallback((troca) => {
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
    setFase("pronta");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setFase("fecha");
      marca(troca, FECHA);
      marca(() => setFase("abre"), ABRE);
      marca(() => { setFase(null); ocupado.current = false; }, LIMPA);
    }));
  }, []);

  return { fase, atravessar };
}
