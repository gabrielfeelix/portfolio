import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

/* A MIRA. O cursor do site.

   Pedido do Gabriel em 29/08, com uma restrição dele que é a decisão de design
   inteira: "acho que o aviãozinho não, porque já tem um descendo pela página
   toda e vai confundir". Ele tem razão — dois aviões vermelhos na tela, um
   obedecendo à rolagem e outro ao mouse, e ninguém entende qual é qual.

   Então o cursor é a OUTRA marca que o site já usa: a cruz de registro. Ela
   está na régua entre dobras (`.v2-cruz`), no `( _01 )` de todo cromo, no
   carimbo de ano. É a gramática de prova de impressão que o site inteiro fala,
   e transformá-la em cursor é dizer a mesma coisa com o ponteiro: você está
   mirando alguma coisa nesta página.

   Duas peças, e a diferença entre elas é o que dá vida:

   - o PONTO segue o mouse exato, sem mola. Ele é a verdade da posição: sem
     ele, qualquer atraso vira imprecisão e clicar fica ruim.
   - a MIRA segue com mola frouxa e chega depois. Ela é o peso, e é a peça que
     faz o cursor parecer um objeto em vez de um desenho colado no ponteiro.

   Sobre link e botão a mira cresce e enche de accent, e o ponto some por
   dentro dela: o alvo foi travado.

   Por que accent nas duas: o site tem fundo branco e fundo ink, e um cursor
   que precisa saber em qual dos dois está precisaria de detecção por dobra —
   que é a mesma engenharia que a nav faz por uma faixa de 72px e que aqui
   custaria uma leitura de DOM por quadro. O vermelho mede 4.61:1 sobre o papel
   e 4.27:1 sobre o ink, e como grafismo (mínimo 3:1) passa nos dois. Um só
   desenho, nenhuma detecção.

   Quem NÃO vê nada disto, e continua com o cursor do sistema:
   - quem está no toque ou na caneta (`pointer: fine` no CSS e aqui);
   - quem pediu para nada se mover — trocar o ponteiro do sistema por um objeto
     com mola é exatamente o que essa preferência existe para desligar. */

const INTERATIVO = 'a, button, [role="button"], input, select, textarea, summary, [tabindex]:not([tabindex="-1"])';

export function Cursor() {
  const quieto = useReducedMotion();
  const [fino, setFino] = useState(false);
  /* `vivo` só liga no primeiro movimento. Sem isso a mira nasce em 0,0 e a
     primeira mexida no mouse é um risco vermelho atravessando a tela desde o
     canto superior esquerdo. */
  const [vivo, setVivo] = useState(false);
  const [preso, setPreso] = useState(false);
  const [dentro, setDentro] = useState(true);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  /* frouxa de propósito: rígida demais e a mira cola no ponto, e as duas peças
     viram uma. Estes números são os mesmos do voo, pela mesma razão. */
  const mx = useSpring(x, { stiffness: 420, damping: 34, mass: 0.6 });
  const my = useSpring(y, { stiffness: 420, damping: 34, mass: 0.6 });

  useEffect(() => {
    let mq;
    try {
      mq = window.matchMedia("(pointer: fine)");
      setFino(mq.matches);
    } catch (e) { return undefined; }
    const troca = () => setFino(mq.matches);
    if (mq.addEventListener) mq.addEventListener("change", troca);
    return () => { if (mq && mq.removeEventListener) mq.removeEventListener("change", troca); };
  }, []);

  useEffect(() => {
    if (!fino || quieto) return undefined;

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!vivo) { mx.jump(e.clientX); my.jump(e.clientY); setVivo(true); }
      /* `closest` a cada movimento é barato — é uma subida de DOM curta — e é
         muito mais confiável que pendurar listener em cada link: o site monta e
         desmonta seções o tempo todo, e listener por elemento perderia tudo o
         que nasce depois. */
      const alvo = e.target && e.target.closest ? e.target.closest(INTERATIVO) : null;
      setPreso(!!alvo);
    };
    /* Sair da janela apaga a mira. Sem isto ela fica pendurada na borda quando
       a pessoa vai para a barra de endereço, o que parece um bug. */
    const sai = () => setDentro(false);
    const entra = () => setDentro(true);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", sai);
    document.addEventListener("pointerenter", entra);
    window.addEventListener("blur", sai);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", sai);
      document.removeEventListener("pointerenter", entra);
      window.removeEventListener("blur", sai);
    };
  }, [fino, quieto, vivo, x, y, mx, my]);

  /* O atributo no <html> é quem esconde o cursor do sistema, e ele só entra
     quando a mira REALMENTE está no ar. Escondê-lo no CSS e depois descobrir
     no JS que não devia deixaria a página sem ponteiro nenhum. */
  useEffect(() => {
    const raiz = document.documentElement;
    const ligado = fino && !quieto && vivo;
    if (ligado) raiz.setAttribute("data-mira", "1");
    else raiz.removeAttribute("data-mira");
    return () => raiz.removeAttribute("data-mira");
  }, [fino, quieto, vivo]);

  if (!fino || quieto || !vivo) return null;

  return (
    <div className="v2-mira" data-preso={preso ? "1" : undefined} data-fora={dentro ? undefined : "1"} aria-hidden="true">
      <motion.span className="v2-mira-anel" style={{ x: mx, y: my }}>
        <svg viewBox="0 0 44 44" focusable="false">
          <circle className="v2-mira-disco" cx="22" cy="22" r="12" />
          <g className="v2-mira-cruz">
            <line x1="22" y1="1"  x2="22" y2="7" />
            <line x1="22" y1="37" x2="22" y2="43" />
            <line x1="1"  y1="22" x2="7"  y2="22" />
            <line x1="37" y1="22" x2="43" y2="22" />
          </g>
        </svg>
      </motion.span>
      <motion.span className="v2-mira-ponto" style={{ x, y }} />
    </div>
  );
}
