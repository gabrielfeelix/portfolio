/* As primitivas de movimento da V2.
 *
 * Todo movimento se monta com elas. Se um componente precisa de um valor de
 * mola ou de um easing novo, ele vira primitiva aqui antes de ser usado: o
 * ponto é a tela inteira se mover com o mesmo sotaque.
 *
 * Regras que valem para todas:
 *   - só transform e opacity animam;
 *   - prefers-reduced-motion desliga tudo, sobra opacidade;
 *   - reveal dispara uma vez, não volta ao rolar de volta.
 */

import { useReducedMotion, useScroll, useTransform, useSpring, useMotionValue, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

/* 1. spring
   Default de tudo que responde a hover, clique ou drag.

   Fase 6: damping caiu de 70 para 60. A referência usa os dois; 60 tem um
   retorno a mais, que é o que se sente no botão e some em 70. */
export const spring = { type: "spring", stiffness: 200, damping: 60, mass: 1 };

/* 2. ease
   Para o que é temporizado e não interativo. */
export const ease = [0.44, 0, 0.56, 1];

/* Fase 6. 0.7s com stagger de 60ms era curto e nervoso. Medido nas
   referências: tabfolio entra em 1.1s com stagger de 0.1; a viper usa
   spring damping 60 e tween `{bounce: 0, duration: 3}` com delays até 2.8s.
   A V2 fica no meio: 1.2s de entrada, 120ms entre irmãos. */
export const dur = 1.2;
export const passo = 0.12;

/* 2c. tweenLaunch
   O tween da launchfolio: `ease: [0.4, 0, 0.2, 1]` em 0.6s, usado lá com
   atrasos longos (até 1.8s) para o pé de um hero entrar depois da headline.
   É o sotaque que faltava na V2, que entrava com tudo junto. */
export const tweenLaunch = { duration: 0.6, ease: [0.4, 0, 0.2, 1] };

/* Entrada tardia obediente ao sistema: em reduced-motion sobra a opacidade,
   e mesmo ela entra sem o atraso longo. */
export function useTardio(delay = 1.4) {
  const quieto = useReducedMotion();
  return quieto
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } }
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { ...tweenLaunch, delay } };
}

/* 2b. longa
   A entrada de dobra grande: sem retorno, sem quique, e devagar o
   suficiente para o olho acompanhar em vez de notar. É a tradução do
   `{type: "spring", bounce: 0, duration: 3}` da referência, encurtado
   porque a V2 tem mais dobras por página do que ela. */
export const longa = { type: "spring", bounce: 0, duration: 1.8 };

/* 3. rise
   Entrada padrão de bloco. `i` é a posição entre irmãos e gera o stagger. */
export function rise(i = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: dur, ease, delay: i * passo },
  };
}

/* 3b. subir
   `rise` com a mola longa no lugar do tween: mesma distância, outro
   sotaque. Para a entrada de uma dobra inteira, não de um item de lista. */
export function subir(i = 0) {
  return {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { ...longa, delay: i * passo },
  };
}

/* Versão obediente ao sistema: em reduced-motion sobra só a opacidade. */
export function useSubir() {
  const quieto = useReducedMotion();
  return (i = 0) =>
    quieto
      ? {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 0.2 },
        }
      : subir(i);
}

/* Versão obediente ao sistema: em reduced-motion sobra só a opacidade. */
export function useRise() {
  const quieto = useReducedMotion();
  return (i = 0) =>
    quieto
      ? {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true, amount: 0.25 },
          transition: { duration: 0.2 },
        }
      : rise(i);
}

/* 4. maskLine
   Headline revelada linha a linha por clip-path. Só em headline de hero:
   usada em texto corrido vira ruído. */
export function useMaskLine() {
  const quieto = useReducedMotion();
  return (i = 0) =>
    quieto
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.2, delay: i * 0.04 },
        }
      : {
          initial: { clipPath: "inset(0 0 100% 0)", y: "0.12em" },
          animate: { clipPath: "inset(0 0 -10% 0)", y: 0 },
          transition: { duration: 1.25, ease, delay: 0.2 + i * 0.12 },
        };
}

/* 5. parallax
   A mídia desloca contra o scroll. `intensidade` em porcentagem da própria
   altura, entre 8 e 12. Mais que isso descola do texto e denuncia o truque. */
export function useParallax(intensidade = 10) {
  const ref = useRef(null);
  const quieto = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bruto = useTransform(
    scrollYProgress,
    [0, 1],
    [`${intensidade / 2}%`, `${-intensidade / 2}%`]
  );
  // A mola tira o serrilhado do scroll sem atrasar a leitura.
  const y = useSpring(bruto, { stiffness: 120, damping: 30, mass: 0.6 });
  return { ref, style: quieto ? undefined : { y } };
}

/* 6. sticky
   Progresso de uma dobra que trava enquanto o conteúdo ao lado troca.
   Devolve o ref do trilho e o progresso 0..1 para quem quiser derivar. */
export function useSticky() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  return { ref, progresso: scrollYProgress };
}

/* 7. scrollSuave
   Adicionada depois das seis originais, a pedido: a referência não rola no
   scroll cru do navegador, ela amortece. Nada aqui inventa vocabulário novo,
   é a mesma ideia de mola aplicada à página inteira.

   O truque é NÃO transladar o conteúdo: quem move é o scroll de verdade, via
   scrollTo. Se a página fosse transladada num container, `position: sticky`,
   IntersectionObserver e âncora parariam de funcionar, e a V2 usa os três.

   Só roda com ponteiro fino e wheel. Toque não é interceptado: o scroll
   nativo do celular já tem inércia e mexer nele piora. */
export function useScrollSuave({ atrito = 0.11, ligado = true } = {}) {
  const quieto = useReducedMotion();

  useEffect(() => {
    if (!ligado || quieto) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let alvo = window.scrollY;
    let rodando = false;
    let quadro = 0;
    // Ultima posicao ESCRITA por nos. Serve para separar o nosso scroll do
    // scroll de fora (ancora, teclado, scrollIntoView): sem isto a animacao
    // em curso desfaz um scrollTo de terceiros e o botao do hero nao leva a
    // lugar nenhum.
    let escrito = -1;

    const limite = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const passo = () => {
      const atual = window.scrollY;
      const delta = alvo - atual;
      if (Math.abs(delta) < 0.4) {
        escrito = alvo;
        window.scrollTo(0, alvo);
        rodando = false;
        return;
      }
      escrito = atual + delta * atrito;
      window.scrollTo(0, escrito);
      quadro = requestAnimationFrame(passo);
    };

    const onWheel = (e) => {
      // pinch-zoom e scroll dentro de um elemento com scroll próprio ficam
      // com o navegador.
      if (e.ctrlKey) return;
      let d = e.deltaY;
      if (e.deltaMode === 1) d *= 16;        // linhas
      else if (e.deltaMode === 2) d *= window.innerHeight;
      e.preventDefault();
      alvo = Math.min(limite(), Math.max(0, alvo + d));
      if (!rodando) { rodando = true; quadro = requestAnimationFrame(passo); }
    };

    // Teclado, âncora e scrollIntoView continuam nativos. Se a posição mudou
    // por causa de alguém que não nós, a animação em curso é abandonada e o
    // alvo passa a ser onde a página está.
    const onScroll = () => {
      const y = window.scrollY;
      if (rodando && Math.abs(y - escrito) < 2) return;   // fomos nós
      cancelAnimationFrame(quadro);
      rodando = false;
      alvo = y;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
    };
  }, [atrito, ligado, quieto]);
}

/* 8. cobertura
   A passagem entre uma dobra que fica presa e a dobra seguinte, que sobe por
   cima. Devolve o estilo do conteúdo que está sendo coberto: ele perde escala
   e opacidade enquanto sai de cena, em vez de simplesmente rolar para fora.
   Usada uma vez, entre o hero e o manifesto. */
export function useCobertura() {
  const ref = useRef(null);
  const quieto = useReducedMotion();

  /* BUG, achado em print em 28/08: isto media `target: ref` com offset
     ["start start", "end start"], e o `ref` mora no herói, que é
     `position: sticky`. O retângulo de um elemento preso CONGELA enquanto ele
     está preso, então o progresso ficava em 0 a página inteira: opacidade 1 e
     transform `none` em qualquer rolagem, medido. O corpo branco subia e
     guilhotinava a headline no meio da palavra, em opacidade cheia.

     É a mesma armadilha já anotada em `usePilhaTrilho`, três hooks abaixo, e a
     saída é a mesma: quem se move é a janela, então meça a janela. */
  const { scrollY } = useScroll();
  const [alt, setAlt] = useState(0);
  useEffect(() => {
    const medir = () => {
      const el = ref.current;
      if (el) setAlt(el.offsetHeight || window.innerHeight);
    };
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, []);
  const curso = alt || 1;
  const opacity = useTransform(scrollY, [0, curso * 0.75], [1, 0]);
  const scale = useTransform(scrollY, [0, curso], [1, 0.94]);
  const y = useTransform(scrollY, [0, curso], ["0%", "8%"]);
  return { ref, style: quieto ? undefined : { opacity, scale, y } };
}

/* 9. pilha
   A pilha grudada dos casos. Duas funcoes, porque a medida e uma so para a
   secao inteira: o painel e `position: sticky` e o retangulo dele congela,
   entao medir nele daria progresso zero a pagina inteira.

   `usePilhaTrilho` mede a SECAO, que rola normalmente. Cada painel recebe
   esse progresso e le a fatia dele: enquanto a fatia i corre, o painel i esta
   sendo coberto pelo i+1, e e nesse intervalo que ele encolhe e escurece.

   A ultima linha nao tem quem a cubra, entao fica parada. A escala vai so ate
   0.97: o card e claro e opaco, entao quem separa as camadas e a lombada de
   40px, nao o encolhimento. */
export function usePilhaTrilho() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  return { ref, progresso: scrollYProgress };
}

export function usePilha(progresso, i, total) {
  const quieto = useReducedMotion();
  const fatia = 1 / Math.max(total - 1, 1);
  const inicio = i * fatia;
  const fim = inicio + fatia;
  const escala = useTransform(progresso, [inicio, fim], [1, 0.97], { clamp: true });
  const veu = useTransform(progresso, [inicio, fim], [0, 0.38], { clamp: true });
  const um = useMotionValue(1);
  const zero = useMotionValue(0);
  const ultimo = i === total - 1;
  return quieto || ultimo ? { escala: um, veu: zero } : { escala, veu };
}

/* 10. palavra
   Revelação por palavra da declaração. A frase inteira é legível desde o
   início: texto invisível que só aparece no scroll quebra leitor de tela e
   busca. O que o scroll faz é acender.

   O piso é 0.45 e não 0.16 porque o axe reprovou o 0.16 em contraste. Sobre
   papel branco, #0B0B0C a 45% dá canal ~145, que passa os 3:1 exigidos de
   texto grande. Abaixo disso a palavra apagada vira decoração ilegível.

   Devolve um array de MotionValue, não uma função: `useTransform` é hook, e
   chamar hook dentro do `map` do JSX amarraria a ordem à renderização. */
export function usePalavra(total) {
  const ref = useRef(null);
  const quieto = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.3"],
  });
  const opacidades = [];
  for (let i = 0; i < total; i++) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    opacidades.push(useTransform(scrollYProgress, [i / total, (i + 1) / total], [0.45, 1]));
  }
  return { ref, opacidades, quieto };
}

/* 11. revelar
   A entrada padrao de tudo que nao e titulo: opacidade mais um passo curto.
   E a mesma familia do `rise`, com o curso menor, para poder repetir a pagina
   inteira sem cansar. Ver M5 de docs/ANALISE-REFS.md: nas referencias o motion
   e vocabulario repetido, nao enfeite pontual.

   Por que nao clipPath aqui: `whileInView` com clipPath nao interpola no motion
   (fica preso no `initial` e o elemento nunca aparece); com `animate` funciona,
   e e por isso que o useMaskLine do hero pode usar. Medido em 2026-08-28. */
export function useRevelar() {
  const quieto = useReducedMotion();
  return (i = 0) =>
    quieto
      ? {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 0.2 },
        }
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.3 },
          transition: { duration: 1, ease, delay: i * 0.08 },
        };
}

/* 11b. cortina
   O mascaramento de verdade, so para titulo de dobra: o texto sobe de dentro de
   uma janela com `overflow: hidden`.

   Por que ela devolve um ref em vez de props de `whileInView`: o
   IntersectionObserver recorta o retangulo do alvo pelo `overflow` dos
   ancestrais. Com o texto empurrado 108% para fora da janela, o retangulo
   visivel dele e zero, o observer nunca acusa entrada e a animacao nunca
   dispara. Quem e observado tem que ser a janela, que nao se move. Medido em
   2026-08-28, depois de duas dobras da home saírem em branco por causa disso. */
export function useCortina() {
  const quieto = useReducedMotion();
  const ref = useRef(null);
  const dentro = useInView(ref, { once: true, amount: 0.25 });
  const props = (i = 0) =>
    quieto
      ? {
          initial: { opacity: 0 },
          animate: { opacity: dentro ? 1 : 0 },
          transition: { duration: 0.2 },
        }
      : {
          initial: { y: "108%" },
          animate: dentro ? { y: 0 } : { y: "108%" },
          transition: { duration: 1.15, ease, delay: i * 0.09 },
        };
  return { ref, props };
}

/* 12. contador
   Número que sobe de 0 até `ate` quando a dobra entra. O DOM da viper serve
   `0 +` parado, prova de que o valor final é escrito por JS; em
   reduced-motion o valor entra pronto, sem contagem. */
export function useContador(ate, duracao = 1.6) {
  const ref = useRef(null);
  const quieto = useReducedMotion();
  const [valor, setValor] = useState(quieto ? ate : 0);
  useEffect(() => {
    if (quieto) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        const t0 = performance.now();
        const passo = (t) => {
          const p = Math.min(1, (t - t0) / (duracao * 1000));
          /* easeOutQuart: chega perto do fim rápido e assenta devagar, que é
             como o contador da referência se comporta. */
          setValor(Math.round(ate * (1 - Math.pow(1 - p, 4))));
          if (p < 1) raf = requestAnimationFrame(passo);
        };
        raf = requestAnimationFrame(passo);
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => { obs.disconnect(); cancelAnimationFrame(raf); };
  }, [ate, duracao, quieto]);
  return { ref, valor };
}
