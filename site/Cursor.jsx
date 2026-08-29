import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

/* O VENTO. O cursor do site.

   Duas restrições do Gabriel, e juntas elas são o desenho inteiro.

   A primeira: nada de avião. "Já tem um descendo pela página toda e vai
   confundir" — dois aviões vermelhos na tela, um obedecendo à rolagem e outro
   ao mouse, e ninguém entende qual é qual.

   A segunda veio depois, olhando a primeira tentativa: ela era uma cruz de
   registro, um anel com quatro marcas que crescia e engrossava em cima dos
   links. No papel era a marca de prova de impressão que o site já usa; na tela
   virou mira de nave, e ele cortou na hora — "a gente NÃO pode ir pro espaço, a
   gente só tem o conceito de branco/vermelho/preto, avião de papel vermelho
   voando pelo vento, é só isso". Tinha razão: anel com marcas em cruz seguindo
   o ponteiro é retícula de jogo, não importa de onde a forma tenha vindo.

   Sobrou a única metáfora que o conceito autoriza e que ainda não estava em
   nenhum lugar da tela: o VENTO. Três pontos vermelhos, do maior ao menor, com
   molas cada vez mais frouxas. Parado, eles se encontram e viram um ponto só.
   Em movimento, eles se abrem numa esteira atrás do ponteiro — que é
   literalmente o que o vento faz atrás de uma coisa que voa, e é o mesmo rastro
   que o avião deixa na tela de carregamento.

   Não há estado "travado" com forma nova: sobre link e botão o ponto só CRESCE
   e a esteira some. Qualquer coisa que abrisse, girasse ou ganhasse marcas
   voltaria a ser mira.

   Por que accent nos três: o site tem fundo branco e fundo ink, e um cursor que
   precisasse saber em qual dos dois está pediria leitura de DOM por quadro. O
   vermelho mede 4.61:1 sobre o papel e 4.27:1 sobre o ink, e como grafismo
   (mínimo 3:1) passa nos dois. O terceiro fundo, o botão primário cheio de
   accent, é resolvido pelo halo branco em cursor.css.

   Quem NÃO vê nada disto, e continua com o cursor do sistema:
   - quem está no toque ou na caneta (`pointer: fine` no CSS e aqui);
   - quem pediu para nada se mover — trocar o ponteiro do sistema por um objeto
     com mola é exatamente o que essa preferência existe para desligar. */

const INTERATIVO = 'a, button, [role="button"], input, select, textarea, summary, [tabindex]:not([tabindex="-1"])';

/* Do mais preso ao mais solto. A diferença entre eles é o comprimento da
   esteira: molas iguais dariam três pontos empilhados e nenhum vento. */
const MOLA_A = { stiffness: 520, damping: 40, mass: 0.5 };
const MOLA_B = { stiffness: 240, damping: 32, mass: 0.6 };

export function Cursor() {
  const quieto = useReducedMotion();
  const [fino, setFino] = useState(false);
  /* `vivo` só liga no primeiro movimento. Sem isso o cursor nasce em 0,0 e a
     primeira mexida no mouse é um risco vermelho atravessando a tela desde o
     canto superior esquerdo. */
  const [vivo, setVivo] = useState(false);
  const [preso, setPreso] = useState(false);
  const [dentro, setDentro] = useState(true);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const ax = useSpring(x, MOLA_A);
  const ay = useSpring(y, MOLA_A);
  const bx = useSpring(x, MOLA_B);
  const by = useSpring(y, MOLA_B);

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
      if (!vivo) {
        ax.jump(e.clientX); ay.jump(e.clientY);
        bx.jump(e.clientX); by.jump(e.clientY);
        setVivo(true);
      }
      /* `closest` a cada movimento é barato — é uma subida de DOM curta — e é
         muito mais confiável que pendurar listener em cada link: o site monta e
         desmonta seções o tempo todo, e listener por elemento perderia tudo o
         que nasce depois. */
      const alvo = e.target && e.target.closest ? e.target.closest(INTERATIVO) : null;
      setPreso(!!alvo);
    };
    /* Sair da janela apaga o cursor. Sem isto ele fica pendurado na borda
       quando a pessoa vai para a barra de endereço, o que parece um bug. */
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
  }, [fino, quieto, vivo, x, y, ax, ay, bx, by]);

  /* O atributo no <html> é quem esconde o cursor do sistema, e ele só entra
     quando o nosso REALMENTE está no ar. Escondê-lo no CSS e depois descobrir
     no JS que não devia deixaria a página sem ponteiro nenhum. */
  useEffect(() => {
    const raiz = document.documentElement;
    const ligado = fino && !quieto && vivo;
    if (ligado) raiz.setAttribute("data-vento", "1");
    else raiz.removeAttribute("data-vento");
    return () => raiz.removeAttribute("data-vento");
  }, [fino, quieto, vivo]);

  if (!fino || quieto || !vivo) return null;

  return (
    <div className="v2-vento" data-preso={preso ? "1" : undefined} data-fora={dentro ? undefined : "1"} aria-hidden="true">
      {/* de trás para a frente: o mais solto pinta embaixo */}
      <motion.span className="v2-vento-p is-c" style={{ x: bx, y: by }} />
      <motion.span className="v2-vento-p is-b" style={{ x: ax, y: ay }} />
      <motion.span className="v2-vento-p is-a" style={{ x, y }} />
    </div>
  );
}
