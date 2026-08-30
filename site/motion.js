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

import {
  useReducedMotion, useScroll, useTransform, useSpring, useMotionValue,
  useInView, useMotionTemplate, animate,
} from "motion/react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Lenis from "lenis";

/* 1. spring
   Default de tudo que responde a hover, clique ou drag.

   Fase 6: damping caiu de 70 para 60. A referência usa os dois; 60 tem um
   retorno a mais, que é o que se sente no botão e some em 70. */
export const spring = { type: "spring", stiffness: 200, damping: 60, mass: 1 };

/* 2. ease
   Para o que é temporizado e não interativo. */
export const ease = [0.44, 0, 0.56, 1];

/* A VELOCIDADE DA REVELAÇÃO POR SCROLL. Era 1.2s com 120ms entre irmãos.

   Aquele valor foi calibrado contra tabfolio (1.1s) e viper (até 3s) numa
   época em que o scroll da página era nativo. Com o Lenis a `duration: 2.0`,
   os dois tempos SOMAM: a rolagem já chega devagar no lugar e a fonte ainda
   leva mais 1.2s para assentar. O Gabriel descreveu certo em 29/08 — "já tá
   lento o scroll, se somar os efeitos de fonte a página fica muito morosa".

   O valor novo é o do fuel, medido: 0.6s por elemento. O escalonamento cai de
   120 para 70ms porque com peça mais curta o intervalo antigo abria buraco
   entre um irmão e outro em vez de encadear.

   O deslocamento cai junto, de 24 para 12px, e isso é parte da mesma medição:
   na referência os elementos andam de 6 a 10px. Bloco grande andando muito lê
   como slide; o que se quer é a letra assentando. */
/* 29/08, segunda calibragem. 0.6s com 70ms de passo ainda somava com o Lenis
   e a home inteira lia cansativa depois da hero — foi a queixa do Gabriel. O
   problema nao era uma revelacao ser lenta, era CADA UMA ser um pouco lenta e
   a pagina ter muitas: o cansaco e cumulativo, nao pontual.

   Vale a mesma regra de antes: o que se quer e a letra assentando, nao slide. */
export const dur = 0.44;
export const passo = 0.05;

/* A curva da revelação é a mesma da entrada de página — ajustada contra os
   pontos medidos no fuel, erro .038 contra .237 do que havia antes. Fica
   separada de `ease` porque `ease` também serve o voo e a cortina, que são
   outro gesto. */
export const easeRevela = [0.4, 0, 0.2, 1];

/* 2c. tweenLaunch
   O tween da launchfolio: `ease: [0.4, 0, 0.2, 1]` em 0.6s, usado lá com
   atrasos longos (até 1.8s) para o pé de um hero entrar depois da headline.
   É o sotaque que faltava na V2, que entrava com tudo junto. */
export const tweenLaunch = { duration: 0.44, ease: [0.4, 0, 0.2, 1] };

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
export const longa = { type: "spring", bounce: 0, duration: 0.65 };

/* 3. rise
   Entrada padrão de bloco. `i` é a posição entre irmãos e gera o stagger. */
export function rise(i = 0) {
  return {
    initial: { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: dur, ease: easeRevela, delay: i * passo },
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
          /* -30% e nao -10%: a % e da altura da propria linha (entrelinha
             .88), e o descendente do Switzer cai .1684em abaixo dela, ou seja
             19.1% dessa altura. Com -10% o clip do filho ficava mais apertado
             que o `overflow` do pai e decepava o "g" de Designer — e como
             `clip-path` nao aparece em getBoundingClientRect, a medicao dizia
             que estava tudo certo. As duas escalas sao proporcionais ao
             font-size, entao 30% vale em qualquer viewport. */
          initial: { clipPath: "inset(0 0 100% 0)", y: "0.12em" },
          animate: { clipPath: "inset(0 0 -30% 0)", y: 0 },
          transition: { duration: 0.5, ease: easeRevela, delay: 0.1 + i * 0.06 },
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

/* 8. scroll com peso
   O scroll suave do site, e ele é o LENIS — biblioteca, não código nosso.

   Aqui morava um lerp próprio: 11% da distância restante por quadro, só na
   roda do mouse, com `preventDefault` no wheel. Funcionava e tinha dois furos
   que ninguém nota até notar. O primeiro é que teclado, âncora e
   `scrollIntoView` continuavam nativos — a roda era suave e o resto do site
   pulava seco, ou seja o peso era do mouse e não da página. O segundo é que
   ele era preso a quadro e não a tempo: numa tela de 120Hz a mesma conta roda
   duas vezes mais rápido e a página fica mais leve do que foi desenhada.

   O parâmetro veio medido do fuel.framer.website, que foi a referência que o
   Gabriel trouxe em 29/08 (ver ~/dev/refs/fuel-ANALISE.md):

     new Lenis({ duration: 2.0 })

   Dois segundos, contra o default de 1.0 da biblioteca. Era o valor daqui até
   29/08, e é de onde vinha a sensação de peso que ele pediu.

   Baixou para 1.35 no mesmo dia, junto com as revelações. O motivo está
   anotado no topo deste arquivo e vale repetir: os dois tempos SOMAM. A
   rolagem chega devagar no lugar E a revelação começa devagar, então cada
   dobra cobra duas esperas. Cortar só as revelações deixaria metade do
   problema de pé. Ainda é 35% acima do default da biblioteca, então o peso
   continua lá — só parou de ser espera. O easing é o
   default do Lenis, `t => min(1, 1.001 - 2^(-10t))` — que é o mesmo
   easeOutExpo das entradas de página, e isso não é coincidência nem economia:
   é o site inteiro falando uma curva só.

   Três cuidados que o Lenis exige e que quebram em silêncio se esquecidos:

   - `data-lenis-prevent` em quem tem scroll próprio, senão o Lenis sequestra
     a rolagem de dentro do painel. É varrido no mount e a cada mudança de rota.
   - `lenis.stop()` quando o `<html>` trava em `overflow: hidden`, senão a
     página rola por trás de qualquer coisa que cubra a tela.
   - reduced-motion desliga tudo. Scroll suave é movimento, e quem pediu para
     nada se mover não ganha exceção por ser bonito. */
export function useScrollSuave({ duracao = 1.35, ligado = true } = {}) {
  const quieto = useReducedMotion();

  useEffect(() => {
    if (!ligado || quieto) return;

    const lenis = new Lenis({ duration: duracao });
    let quadro = requestAnimationFrame(function passo(t) {
      lenis.raf(t);
      quadro = requestAnimationFrame(passo);
    });

    /* Quem tem scroll próprio fica com o navegador. Sem isto, rolar dentro de
       um painel com `overflow: auto` move a página inteira. */
    const isolarRolaveis = () => {
      document.querySelectorAll("*").forEach((el) => {
        const ov = getComputedStyle(el).overflowY;
        if (ov === "auto" || ov === "scroll") el.setAttribute("data-lenis-prevent", "true");
      });
    };
    isolarRolaveis();

    /* E trava quando alguém cobre a tela. `overflow: hidden` no <html> é o
       sinal que o site já usa para isso. */
    const conferirTrava = () => {
      const travado = document.documentElement.style.overflow === "hidden";
      if (travado) lenis.stop(); else lenis.start();
    };
    const obs = new MutationObserver(() => { conferirTrava(); isolarRolaveis(); });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });

    window.__lenis = lenis;
    return () => {
      cancelAnimationFrame(quadro);
      obs.disconnect();
      lenis.destroy();
      delete window.__lenis;
    };
  }, [duracao, ligado, quieto]);
}

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

/* 8b. rolar por código
   O ÚNICO caminho para mover o scroll por código no site.

   Com o Lenis no ar, `window.scrollTo` e `scrollIntoView` param de funcionar
   como parecem: eles movem a barra, mas não contam nada ao Lenis, que continua
   com o alvo antigo guardado e no quadro seguinte traz a página de volta. O
   sintoma é uma página nova que abre no meio, e foi exatamente o que aconteceu
   ao trocar de rota — o `scrollTo(0)` da travessia era desfeito pelo Lenis
   antes de qualquer um ver.

   Então todo scroll programático passa por aqui. Sem Lenis (reduced-motion,
   ou antes do mount) cai no nativo, que é o comportamento correto nesses
   casos. */
export function rolarPara(alvo, { imediato = false } = {}) {
  const lenis = typeof window !== "undefined" ? window.__lenis : null;
  if (lenis) {
    lenis.scrollTo(alvo, imediato ? { immediate: true, force: true } : { force: true });
    return;
  }
  if (typeof alvo === "number") {
    window.scrollTo({ top: alvo, behavior: imediato ? "instant" : "smooth" });
    return;
  }
  const el = typeof alvo === "string" ? document.querySelector(alvo) : alvo;
  if (el) el.scrollIntoView({ behavior: imediato ? "instant" : "smooth", block: "start" });
}

/* 9c. entrada de página
   A MONTAGEM da página nova, depois que o véu da travessia sai.

   SEGUNDA MEDIÇÃO, 29/08. A primeira mediu a página de ITEM do fuel e saiu
   errada em quase tudo; o Gabriel viu e disse que não estava igual. Estava
   certo. A hero da HOME dele — que é a que ele queria — funciona de outro
   jeito, e a diferença é o desenho inteiro:

     o que eu tinha        o que a referência faz
     ------------------    ----------------------------------------
     2 blocos grandes      ~10 elementos individuais
     ±70 e ±100px          6 a 10px
     título vindo de CIMA  TUDO vindo de BAIXO
     tudo junto            escalonado, um atrás do outro
     mola exponencial      cubic-bezier(.4, 0, .2, 1)

   É por isso que ficava pesado: bloco grande andando muito lê como slide.
   O que a referência faz é a letra "levemente aparecendo" — deslocamento
   pequeno, muitos elementos, e o tempo entre eles fazendo o trabalho.

   OS NÚMEROS, medidos elemento a elemento na hero da home:

   - Deslocamento: +10px nas linhas do título e nos itens de menu, +8px no
     item seguinte, +6px no próximo. ELE DIMINUI conforme desce a cascata:
     quem chega depois anda menos. Sem isso o fim da sequência fica pesado.
   - Escalonamento: ~0,2s entre linhas de título, ~0,1s entre itens de cromo.
     Medido nos instantes de 50%: 1040, 1250 (título) e 830, 920, 1030, 1110
     (menu).
   - Curva: ajustei cinco candidatas contra os pontos medidos.

       cubic-bezier(.4,  0,  .2,  1)   erro .038   ← esta
       cubic-bezier(.25,.1,  .25, 1)   erro .066
       cubic-bezier(.25,.46, .45,.94)  erro .074
       cubic-bezier(.65, 0,  .35, 1)   erro .076
       mola exponencial (o que eu usava) erro .237

   - Duração: ~0,6s por elemento.

   A FOTO é outra curva e outra duração. Ela é lenta de propósito: aos 400ms
   ainda fez só 22,7% do caminho, o que dá ~1,4s de percurso contra os 0,6s do
   texto. O texto chega e para; a foto continua respirando por baixo dele. Com
   as duas iguais, a foto vira parte do mesmo gesto e some. */
const ENTRADA_EASE = [0.4, 0, 0.2, 1];
const ENTRADA_TEXTO = { duration: 0.45, ease: ENTRADA_EASE };
const ENTRADA_FOTO = { duration: 1.0, ease: ENTRADA_EASE };

/* O deslocamento encolhe com a ordem: 10, 10, 8, 6, e para em 6. Medido na
   referência (Text 1 = 10px, Text 2 = 8px, Text 3 = 6px). */
function desloca(i) {
  return Math.max(6, 10 - Math.max(0, i - 1) * 2);
}

export function useEntrada() {
  const quieto = useReducedMotion();

  /* Em reduced-motion sobra um fade curto: a pessoa pediu para nada se MOVER,
     e sem nenhuma marca a troca de rota volta a ser o corte seco que a
     travessia existe para resolver. */
  const seco = (atraso = 0) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.2, delay: atraso },
  });

  /* `sobe(i)` — o gesto único da entrada: nasce embaixo e assenta.
     `passo` é o escalonamento: .2 entre linhas de título, .1 entre cromo. */
  const sobe = (i = 0, { passo = 0.1, base = 0 } = {}) => {
    const atraso = base + i * passo;
    if (quieto) return seco(atraso);
    return {
      initial: { opacity: 0, y: desloca(i) },
      animate: { opacity: 1, y: 0 },
      transition: { ...ENTRADA_TEXTO, delay: atraso },
    };
  };

  return {
    sobe,
    /* linhas de título: mesmo gesto, escalonamento mais largo */
    linha: (i = 0, base = 0) => sobe(i, { passo: 0.2, base }),
    /* o zoom, lento por baixo de tudo */
    foto: () => quieto ? seco() : ({
      initial: { opacity: 0, scale: 1.2 },
      animate: { opacity: 1, scale: 1 },
      transition: ENTRADA_FOTO,
    }),
  };
}

/* 9b. lâmina
   A LÂMINA DIAGONAL entre o hero e o corpo claro.

   Medida no fuel.framer.website em 29/08, a pedido do Gabriel — a análise
   completa está em ~/dev/refs/fuel-ANALISE.md. Lá o efeito é uma div branca
   VAZIA de 1440x834, sem um único filho, que sobe torta por cima de um hero
   preso. Dois valores, e os dois saturam no mesmo ponto:

     skewY        0  ->  -7deg
     translateY   0  ->  -220px

   O -7deg não é chute: o termo de cisalhamento da matriz satura em 0.122785,
   que é tan(7°) exato. E o intervalo de scroll é a própria altura da lâmina —
   começa quando o topo dela entra pela base da janela, termina quando a base
   dela alcança a base da janela. Isso é literalmente o offset abaixo.

   A ADAPTAÇÃO daqui: no fuel a lâmina é um vão em branco de 834px que empurra
   o conteúdo para baixo. Aqui ela é a ARESTA DE ATAQUE do corpo claro — mesma
   cor, encostada no topo dele, e por isso invisível em repouso. Quando sobe e
   torce, o que aparece contra o hero escuro é só a borda de cima; a de baixo
   continua encostada em papel da mesma cor. Efeito idêntico, zero mudança de
   layout.

   Por que a altura importa: o skew gira em torno do centro, então a borda de
   baixo sobe (largura / 2) * tan(7°) de um lado. A 2560px isso é 157px, e
   somado aos 220px de subida dá 377px. Abaixo disso a borda de baixo passaria
   do topo do corpo claro e o hero apareceria por um rasgo embaixo. O piso de
   420px em `--v2-lamina-h` é essa conta com folga. */
export function useLamina() {
  const ref = useRef(null);
  const quieto = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const skew = useTransform(scrollYProgress, [0, 1], [0, -7]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -220]);
  return { ref, style: quieto ? undefined : { skewY: skew, y } };
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
  /* O curso vai da entrada do paragrafo ate ele quase sair, nao da entrada da
     secao. A diferenca importa: a declaracao tem ~1300px de altura, mais que
     uma janela. Com o curso antigo ("start 0.85" a "start 0.3") a revelacao
     inteira acontecia enquanto so as duas primeiras linhas estavam visiveis, e
     a metade de baixo ja chegava nitida na tela. Ninguem via o efeito na parte
     que mais rola. Agora a palavra acende quando ela mesma esta passando pelo
     meio da janela. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.45"],
  });
  const palavras = [];
  /* A janela de cada palavra e ~2,6x mais larga que o passo entre elas, entao
     tres ou quatro palavras estao sempre em transicao ao mesmo tempo. E isso
     que faz a leitura parecer uma faixa passando pela frase em vez de um
     interruptor por palavra. O ultimo termina em 0.87, com folga antes do fim
     do curso, para a frase nunca ficar meio nitida no repouso. */
  const passo = 0.78 / Math.max(total, 1);
  const janela = (1 / Math.max(total, 1)) * 2.6;
  for (let i = 0; i < total; i++) {
    const de = i * passo;
    const ate = de + janela;
    /* eslint-disable react-hooks/rules-of-hooks */
    const t = useTransform(scrollYProgress, [de, ate], [0, 1], { clamp: true });
    const opacidade = useTransform(t, [0, 1], [0.06, 1]);
    const desfoque = useTransform(t, [0, 1], [7, 0]);
    const y = useTransform(t, [0, 1], [12, 0]);
    const filtro = useMotionTemplate`blur(${desfoque}px)`;
    /* eslint-enable react-hooks/rules-of-hooks */
    palavras.push({ opacidade, filtro, y });
  }
  return { ref, palavras, quieto };
}

/* 15a-bis. o avião

   O contorno do avião de papel, em caixa 24x24, bico para a direita.

   Ele aparece em três lugares — cruzando a rolagem (Kit.jsx), dentro do botão
   (Shell.jsx) e atravessando a cortina de página (Travessia.jsx) — e nos três
   é literalmente esta constante. Havia um quarto, a tela de carregamento, que
   era HTML servido e repetia o `d` à mão; ela saiu em 29/08 e a duplicata
   saiu junto. */
export const AVIAO_D = "M23 12 L3 3 L9 12 L3 21 Z";

/* 15b. voo
   O aviãozinho vermelho, atravessando o corpo claro inteiro.

   Nasceu dentro da dobra da tese, onde a declaração partida deixa dois vazios
   em diagonal. Funcionou, e agora ele não para ali: entra pela direita no alto
   da página e desce costurando todas as dobras até sair embaixo, sempre atrás
   do conteúdo. Onde a dobra tem fundo próprio, como o rodapé escuro, ela cobre
   o avião, e isso é o comportamento certo: ele é fundo, não ilustração.

   Usa `offset-path` em vez de keyframes de x e y por dois motivos: a curva
   fica de verdade curva, e `offset-rotate: auto` inclina o avião na direção
   do voo sozinho, inclusive dentro da volta. O navegador resolve
   `offset-distance` como transform, então continua valendo a regra de só
   animar transform e opacidade.

   O caminho é montado em pixel a partir da caixa medida: em fração ele
   deformaria junto com a proporção da dobra, e a volta viraria uma elipse
   achatada nas telas largas. */
/* Catmull-Rom convertido para bézier cúbica: dá uma curva que passa por todos
   os pontos e ainda assim é lisa nas emendas. Escrever as curvas à mão para um
   percurso deste tamanho seria ilegível e impossível de ajustar. */
function suavizar(pts, continuar = false) {
  const r = Math.round;
  const d = continuar ? [] : [`M ${r(pts[0][0])} ${r(pts[0][1])}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const ax = p1[0] + (p2[0] - p0[0]) / 6;
    const ay = p1[1] + (p2[1] - p0[1]) / 6;
    const bx = p2[0] - (p3[0] - p1[0]) / 6;
    const by = p2[1] - (p3[1] - p1[1]) / 6;
    d.push(`C ${r(ax)} ${r(ay)}, ${r(bx)} ${r(by)}, ${r(p2[0])} ${r(p2[1])}`);
  }
  return d.join(" ");
}

/* O percurso.

   Ele tem duas partes, e a divisão não é estética, é história: a primeira foi
   desenhada para os dois vazios da dobra da tese e o Gabriel aprovou ela
   exatamente como está, então ela não vira weave genérico. A declaração é
   partida, a primeira metade encosta à esquerda em cima e a segunda à direita
   embaixo, e o voo mora nesses dois vazios: entra pela direita, dá a volta no
   de cima, atravessa na diagonal e sai no de baixo à esquerda. As curvas são
   as originais, em fração da caixa da tese, ancoradas onde ela realmente
   está.

   A segunda parte pega o avião na saída e costura o resto da página até o pé,
   em travessias largas de um lado ao outro com duas voltas no caminho.

   As frações são da caixa; os raios das voltas vão em pixel, porque o corpo
   tem uns dez mil pixels de altura contra 1440 de largura e volta em fração
   viraria elipse achatada. */
/* Quantas vezes a partitura toca ao longo da queda.

   Uma partitura tem um numero FIXO de travessias, e cada travessia mede uma
   largura de tela. Numa janela estreita e alta isso quebra: a mesma partitura
   que no desktop gasta 1440px de lado por tela de rolagem gasta 390px no
   celular, e o aviao vira uma linha reta descendo.

   Medido em 29/08, somando o deslocamento lateral entre 30 amostras de
   rolagem e dividindo pelo que a pagina rola:

     home  1440x900   0,92     home  390x844   0,24
     sobre 1440x900   —        sobre 390x844   0,16
     blog  1440x900   —        blog  390x844   0,64

   Ou seja no celular ele andava de lado quatro a seis vezes menos por pixel
   rolado, que e exatamente a queixa: "estava indo so pra baixo, sem brincar
   indo pra direita, pra esquerda, sumindo da tela, voltando".

   O que conserta nao e desenhar outra rota: e tocar a MESMA partitura mais
   vezes, cada repeticao dentro da sua fatia da queda. O carater da pagina
   continua o mesmo — as manobras sao as mesmas, na mesma ordem — e a
   inclinacao volta ao que era no desktop.

   O divisor 7 e a razao queda/largura do desktop de referencia (10.565px de
   queda em 1440 de largura da home, medido). Onde a razao ja e essa, k = 1 e
   nada muda: 1440, 1600, 1920 continuam com o percurso de sempre. O teto de 4
   existe porque acima disso a manobra deixa de ser voo e vira maquina de
   costura — em /sobre no celular a conta pede 6. */
function densidade(w, queda) {
  if (!(w > 0) || !(queda > 0)) return 1;
  return Math.max(1, Math.min(4, Math.round((queda / w) / 7)));
}

function troncoDaTese(cx, cy, cw, ch) {
  const x = (f) => Math.round(cx + cw * f);
  const y = (f) => Math.round(cy + ch * f);
  return [
    `M ${x(1.1)} ${y(0.04)}`,
    `C ${x(0.98)} ${y(0.08)}, ${x(0.88)} ${y(0.09)}, ${x(0.8)} ${y(0.15)}`,
    `C ${x(0.7)} ${y(0.23)}, ${x(0.65)} ${y(0.33)}, ${x(0.74)} ${y(0.35)}`,
    `C ${x(0.85)} ${y(0.37)}, ${x(0.91)} ${y(0.28)}, ${x(0.86)} ${y(0.21)}`,
    `C ${x(0.82)} ${y(0.15)}, ${x(0.75)} ${y(0.16)}, ${x(0.71)} ${y(0.22)}`,
    `C ${x(0.6)} ${y(0.36)}, ${x(0.48)} ${y(0.48)}, ${x(0.38)} ${y(0.58)}`,
    `C ${x(0.29)} ${y(0.67)}, ${x(0.2)} ${y(0.73)}, ${x(0.22)} ${y(0.81)}`,
    `C ${x(0.24)} ${y(0.89)}, ${x(0.16)} ${y(0.93)}, ${x(0.08)} ${y(0.95)}`,
    `C ${x(0.0)} ${y(0.98)}, ${x(-0.08)} ${y(1.02)}, ${x(-0.16)} ${y(1.08)}`,
  ].join(" ");
}

/* `alcance` é quanto a página ainda rola de fato: altura do corpo menos uma
   janela. O percurso precisa cair mais ou menos isso, e não a altura inteira
   do corpo, senão o avião ganha do leitor.

   Medido antes da correção: 10.565px de queda para 9.746px de rolagem, ou seja
   819px de vantagem, e o avião saía pelo pé da janela na segunda metade da
   página (1104px numa janela de 900). Agora o percurso termina em `alcance`
   mais 300, então sobra uma descida lenta de 300px ao longo da página inteira,
   que é o suficiente para ele não parecer pregado na mesma altura da tela. */
function rotaDoVoo(w, h, tese, alcance) {
  /* sem a tese medida (a página de caso, por exemplo) o voo começa do alto */
  const t = tese || { x: w * 0.05, y: 0, w: w * 0.9, h: h * 0.14 };
  const tronco = troncoDaTese(t.x, t.y, t.w, t.h);
  const saidaX = t.x + t.w * -0.16;
  const saidaY = t.y + t.h * 1.08;
  const fim = alcance > 0 ? t.y + t.h * 0.04 + alcance + 300 : h;
  const sobra = fim - saidaY;
  if (sobra < 400) return tronco;

  /* A costura do resto da página, agora como partitura, pelo mesmo motivo que
     as outras rotas viraram partitura: assim ela pode tocar mais de uma vez
     numa janela estreita (ver `densidade`).

     Mudou uma coisa no desenho, e só uma: a travessia solta em 0.66 virou a
     volta POR FORA. A home era a única rota sem ela — sai pela esquerda, dá a
     volta na tela por fora e volta pela direita —, e é a manobra que o Gabriel
     descreve como "sumindo da tela, voltando". As duas voltas que já existiam
     escorregaram 0.02 para baixo para abrir espaço, e o resto dos pontos é o
     mesmo de antes.

     A volta em 0.225 sobe enquanto gira, e pode: na dobra da tese o trecho é
     curto e é a manobra que dá graça na dobra. As do meio da página descem
     enquanto giram, senão o avião andaria contra a rolagem por uma tela
     inteira. */
  const costura = ({ em, volta, porFora }) => {
    em(0.16, 0.045);
    em(0.72, 0.105);
    em(0.9, 0.165);
    volta(0.78, 0.225, 90);
    em(0.34, 0.29);
    em(0.1, 0.35);
    em(0.26, 0.42);
    em(0.8, 0.48);
    em(0.9, 0.545);
    em(0.55, 0.6);
    porFora("esq", 0.655, 0.014);
    volta(0.24, 0.735, 85);
    em(0.62, 0.79);
    em(0.9, 0.84);
    em(0.55, 0.89);
    em(0.2, 0.94);
    em(0.6, 0.96);
    em(1.1, 1.0);
  };
  const k = densidade(w, sobra);
  const P = [[saidaX, saidaY]];
  for (let i = 0; i < k; i++) costura(manobras(P, w, saidaY, sobra, i / k, 1 / k));
  return `${tronco} ${suavizar(P, true)}`;
}

/* As outras páginas.

   O voo da home foi desenhado em cima de um vazio concreto (a declaração
   partida da dobra 01) e por isso ele é escrito à mão, curva por curva. As
   demais páginas não têm esse vazio: elas são coluna de texto e dobras em
   sequência. Então em vez de copiar o mesmo desenho cinco vezes, cada rota é
   uma partitura curta de pontos em fração da largura e da rolagem, e a mesma
   suavização por Catmull-Rom faz o resto.

   Duas manobras compõem todas elas:

   - `em(fx, u)`: passa pela largura `fx` quando a rolagem estiver em `u`. Com
     `fx` fora de [0, 1] o avião sai da caixa, e a camada de voo tem
     `overflow: clip` — ninguém vê.
   - `volta(fx, u, raio)`: o parafuso. Continua descendo enquanto gira, porque
     a tabela por altura exige Y crescente (ver o comentário dela).

   E a brincadeira que o Gabriel pediu: sair por um lado, dar a volta na tela
   POR FORA e voltar pelo outro. Isso é só uma sequência de pontos bem
   afastados dos dois lados com pouca queda entre eles — a travessia atravessa
   a tela, mas gasta quase nenhuma rolagem. Quem apaga o rastro dela é
   `tabelaPorAltura`, que esconde o avião entre duas saídas de lados opostos.
   Ver a regra da cortina lá embaixo. */
function manobras(P, w, topo, sobra, base, fatia) {
  const em = (fx, u) => P.push([w * fx, topo + sobra * (base + u * fatia)]);
  const volta = (fx, u, raio) => {
    const bx = w * fx;
    const by = topo + sobra * (base + u * fatia);
    P.push(
      [bx + raio, by - raio * 0.3],
      [bx, by - raio * 0.75],
      [bx - raio, by],
      [bx, by + raio * 0.75],
      [bx + raio, by + raio * 1.1],
    );
  };
  /* A volta por fora, em três tempos: afasta, atravessa, aproxima. Os pontos
     de fora vão a 1,5 largura de distância para que a curva suavizada não
     reentre na tela antes da hora — o Catmull-Rom mira no ponto seguinte, e
     com a saída colada na borda a inclinação já dobrava para dentro. */
  const porFora = (de, u, queda = 0.02) => {
    const s = de === "esq" ? -1 : 1;
    const fora = (f, k) => em(s > 0 ? f : 1 - f, u + queda * k);
    fora(1.16, 0);
    fora(1.5, 0.5);
    em(s > 0 ? -0.5 : 1.5, u + queda * 1.1);
    em(s > 0 ? -0.16 : 1.16, u + queda * 1.9);
  };
  return { em, volta, porFora };
}

/* `vezes` é o k de `densidade`. Cada repetição escreve dentro da sua fatia da
   queda, então o Y continua crescendo e a tabela por altura continua valendo.

   A emenda entre uma repetição e a seguinte não precisa de tratamento: toda
   partitura termina fora da caixa de um lado e recomeça fora do outro, sem
   queda entre as duas, que é exatamente a condição que a cortina reconhece —
   o avião some numa borda e reaparece na outra, sem rastro atravessando a
   tela. */
function tecer(w, topo, fim, partitura, vezes = 1) {
  const sobra = fim - topo;
  const k = Math.max(1, Math.round(vezes));
  const P = [];
  for (let i = 0; i < k; i++) partitura(manobras(P, w, topo, sobra, i / k, 1 / k));
  return suavizar(P);
}

/* Uma partitura por rota. Cada uma tem um caráter, e o caráter é a página:

   caso      — travessias largas, duas voltas e uma volta por fora no meio da
                investigação, porque a página é longa e precisa de fôlego;
   processo  — degraus: pares de pontos quase na mesma largura, que fazem o
                avião descer reto e virar em ângulo, no vocabulário da página;
   sobre     — o mais calmo dos cinco, curvas longas e uma volta só;
   blog      — costura a grade de cards, entra e sai pelos dois lados;
   post      — mora nas margens da coluna de leitura e nunca cruza o texto no
                meio: numa página feita para ler, avião no miolo é sujeira. */
const PARTITURAS = {
  caso: ({ em, volta, porFora }) => {
    em(-0.26, 0);
    em(0.24, 0.045);
    em(0.72, 0.095);
    volta(0.58, 0.16, 92);
    em(0.16, 0.23);
    porFora("esq", 0.265, 0.016);
    em(0.84, 0.35);
    em(0.4, 0.41);
    em(0.1, 0.47);
    volta(0.28, 0.535, 88);
    em(0.74, 0.605);
    em(0.92, 0.665);
    em(0.46, 0.725);
    em(0.12, 0.785);
    em(0.5, 0.845);
    em(0.9, 0.9);
    em(0.42, 0.955);
    em(-0.28, 1);
  },
  processo: ({ em, volta, porFora }) => {
    em(1.26, 0);
    em(0.7, 0.04);
    em(0.66, 0.1);
    em(0.28, 0.145);
    em(0.24, 0.205);
    em(0.72, 0.25);
    volta(0.6, 0.315, 86);
    em(0.16, 0.385);
    em(0.12, 0.445);
    em(0.6, 0.49);
    em(0.9, 0.545);
    porFora("dir", 0.575, 0.016);
    em(0.2, 0.68);
    em(0.24, 0.74);
    em(0.7, 0.785);
    volta(0.76, 0.85, 80);
    em(0.3, 0.92);
    em(0.62, 0.965);
    em(1.24, 1);
  },
  sobre: ({ em, volta, porFora }) => {
    em(-0.24, 0);
    em(0.34, 0.06);
    em(0.86, 0.13);
    em(0.94, 0.21);
    em(0.4, 0.28);
    em(0.1, 0.35);
    volta(0.22, 0.425, 96);
    em(0.68, 0.5);
    em(0.92, 0.565);
    porFora("dir", 0.6, 0.015);
    em(0.28, 0.7);
    em(0.66, 0.77);
    em(0.88, 0.84);
    em(0.36, 0.91);
    em(0.14, 0.96);
    em(-0.26, 1);
  },
  blog: ({ em, volta, porFora }) => {
    em(1.24, 0);
    em(0.64, 0.05);
    em(0.2, 0.11);
    volta(0.34, 0.185, 84);
    em(0.8, 0.26);
    em(0.94, 0.32);
    porFora("dir", 0.35, 0.014);
    em(0.32, 0.46);
    em(0.78, 0.53);
    em(0.9, 0.6);
    em(0.44, 0.665);
    em(0.12, 0.725);
    volta(0.26, 0.79, 80);
    em(0.72, 0.86);
    em(0.9, 0.915);
    em(0.44, 0.965);
    em(1.24, 1);
  },
  /* Margem esquerda 0.06–0.16, margem direita 0.84–0.94: a coluna de leitura
     do post fica entre as duas e o avião não passa por baixo dela. */
  post: ({ em, volta, porFora }) => {
    em(1.2, 0);
    em(0.9, 0.06);
    em(0.86, 0.14);
    em(0.93, 0.22);
    em(0.87, 0.3);
    porFora("dir", 0.335, 0.012);
    em(0.1, 0.44);
    em(0.14, 0.52);
    em(0.07, 0.6);
    volta(0.12, 0.68, 62);
    em(0.11, 0.76);
    em(0.16, 0.84);
    em(0.09, 0.91);
    em(0.4, 0.96);
    em(1.2, 1);
  },
};

/* O percurso de uma página que não é a home.

   Duas medidas, e as duas são sobre a ALTURA DE TELA em que o avião voa, não
   sobre o desenho: `topo` é onde ele entra na janela, e `deriva` é quanto ele
   escorrega para baixo dela ao longo da página inteira. Como o percurso cai
   `alcance + deriva` enquanto a página rola `alcance`, a altura dele na tela
   vai de `topo` a `topo + deriva` e nada mais.

   Elas nasceram de um bug que o Gabriel viu antes de mim: "só está
   funcionando quando eu scrollo pra trás". A primeira versão entrava a 40px
   do topo, e voar colado na borda de cima não perdoa atraso — entre o
   amortecimento da rolagem (useScrollSuave) e a mola do próprio voo, descer
   depressa atrasa o avião em algumas centenas de pixels, e a página inteira
   ele passava ACIMA da janela. Só reaparecia na volta, quando o atraso passa
   a jogar a favor. Medido em 1440x900: -655px na descida do /processo.

   A home nunca teve isso porque o percurso dela nasce ancorado na dobra da
   tese, que cai no meio da tela (medido: entre 320 e 615). É essa faixa que
   as outras páginas passam a usar — um terço da janela para cada lado, com
   teto em pixel para telas muito altas não empurrarem o voo para o rodapé. */
function rotaDaPagina(variante, w, h, alcance, janela) {
  const partitura = PARTITURAS[variante];
  if (!partitura || !(w > 0)) return null;
  const j = janela > 0 ? janela : 800;
  const topo = Math.round(Math.min(330, j * 0.34));
  const deriva = Math.round(Math.min(300, j * 0.3));
  const fim = alcance > 0 ? topo + alcance + deriva : Math.max(h, topo + 600);
  return tecer(w, topo, fim, partitura, densidade(w, fim - topo));
}


/* Reparametrização do percurso pelo eixo Y.

   `offset-distance` anda em comprimento de arco, e o percurso gasta muito arco
   indo de lado. Ligando a rolagem direto na distância, o avião ficava para
   trás do leitor: medido, ele saía da tela em quatro dos oito pontos de
   amostragem, até 292px acima da janela.

   A saída é uma tabela: amostra o path, guarda os pares (Y, comprimento) em
   que o Y cresce, e usa isso como as duas pontas de um useTransform. Assim a
   rolagem controla a ALTURA do avião, e o comprimento de arco vira
   consequência, que é o que faz ele acompanhar quem está lendo.

   Só funciona com Y crescente, e é por isso que as voltas descem. */
function tabelaPorAltura(d, w) {
  if (typeof document === "undefined" || !d) return null;
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("style", "position:absolute;width:0;height:0;overflow:hidden");
  const path = document.createElementNS(NS, "path");
  path.setAttribute("d", d);
  svg.appendChild(path);
  document.body.appendChild(svg);
  let total = 0;
  try { total = path.getTotalLength(); } catch (_) { total = 0; }
  const alturas = [];
  const distancias = [];
  const forcado = [];
  /* -1 saiu pela esquerda, +1 pela direita, 0 dentro da caixa. */
  const lados = [];
  if (total > 0) {
    /* Passo mínimo em vez de descartar as amostras que descem.

       Descartando, a volta da dobra 01 (que sobe) sumia da tabela inteira e o
       avião cruzava ela num quadro só: a manobra que o Gabriel aprovou virava
       um piscar. Forçando cada amostra a avançar pelo menos 45% do passo
       médio, o trecho que sobe ganha uma fatia real da rolagem e a volta volta
       a ser volta, sem quebrar o crescimento que a tabela exige. */
    const N = 420;
    const p0 = path.getPointAtLength(0);
    const pf = path.getPointAtLength(total);
    const minimo = Math.max(1, ((pf.y - p0.y) / N) * 0.45);
    const borda = 24;
    let ultimo = -Infinity;
    for (let i = 0; i <= N; i++) {
      const f = i / N;
      const pt = path.getPointAtLength(f * total);
      /* passo forcado SO quando o caminho anda para tras. Onde ele desce
         devagar, que e a maior parte de uma travessia larga, vale o Y de
         verdade: forcar tambem ali redistribuia a rolagem inteira e o aviao
         saia pelo pe da janela, medido em 1104px numa janela de 900. */
      const anda = ultimo === -Infinity || pt.y > ultimo;
      const y = anda ? pt.y : ultimo + minimo;
      /* Guarda QUAIS amostras andaram para tras e tiveram a altura forcada.
         E o sinal exato do teleporte, e nao ha como reconstrui-lo depois: a
         tabela final so tem alturas crescentes, entao a forcada some nela. */
      forcado.push(!anda);
      ultimo = y;
      alturas.push(y);
      distancias.push(f);
      lados.push(w > 0 && pt.x > w + borda ? 1 : pt.x < -borda ? -1 : 0);
    }
  }
  document.body.removeChild(svg);
  if (alturas.length < 2) return null;
  const y0 = alturas[0];
  const span = alturas[alturas.length - 1] - y0;
  if (span <= 0) return null;
  return {
    entradas: alturas.map((y) => (y - y0) / span),
    saidas: distancias.map((f) => `${(f * 100).toFixed(3)}%`),
    opacidades: cortina(alturas, lados, forcado),
  };
}

/* A cortina.

   Fora da caixa o avião já está recortado, então esconder ali não muda nada.
   O que precisa de cortina é o pedaço do meio: quando ele sai por um lado e
   volta pelo outro, a travessia passa por cima da tela inteira. Ela é rápida
   (quase não desce, então quase não gasta rolagem), mas rápida não é
   invisível — do jeito que estava, o avião piscava atravessando a página.

   A regra tem duas condições, e as duas juntas descrevem exatamente a manobra:
   os dois trechos fora da caixa estão em lados OPOSTOS, e entre eles o
   percurso desceu menos que meia janela. Uma travessia de verdade, das que
   cruzam a página de propósito, desce muito mais que isso e continua visível.

   O corte acontece com o avião já fora da caixa dos dois lados, então não há
   fade a fazer: ninguém vê ele apagar nem acender. */
function cortina(alturas, lados, forcado) {
  const op = lados.map((l) => (l === 0 ? 1 : 0));
  const janela = typeof window !== "undefined" ? window.innerHeight : 800;
  /* Duas medidas, e vale a menor. Meia janela sozinha bastaria numa pagina
     longa; numa curta ela e maior que a distancia entre duas manobras
     legitimas, e a cortina fechava em cima do voo inteiro. 6% do percurso
     cobre esse caso, porque a travessia por fora sempre custa menos de 2%. */
  const span = alturas[alturas.length - 1] - alturas[0];
  const limite = Math.max(40, Math.min(janela * 0.55, span * 0.06));
  let fimAnterior = -1;
  let ladoAnterior = 0;
  for (let i = 0; i < lados.length; i++) {
    if (lados[i] === 0) continue;
    const inicio = i;
    const lado = lados[i];
    while (i + 1 < lados.length && lados[i + 1] !== 0) i++;
    if (
      fimAnterior >= 0 &&
      ladoAnterior !== 0 &&
      ladoAnterior !== lado &&
      alturas[inicio] - alturas[fimAnterior] < limite
    ) {
      for (let k = fimAnterior; k <= inicio; k++) op[k] = 0;
    }
    fimAnterior = i;
    ladoAnterior = lados[i];
  }
  /* Segunda regra: o TELEPORTE.

     A primeira regra so cobre a manobra que sai da caixa pelos dois lados. Mas
     o percurso tem trechos que andam muito de lado sem nunca sair dela, e ali
     acontece a mesma coisa por outro caminho: `offset-distance` anda em
     comprimento de ARCO e a tabela anda em ALTURA, entao um trecho que quase
     nao desce gasta um arco enorme por um tanto minusculo de rolagem.

     Medido em 1440x900, varrendo de 250 em 250px: entre scrollY 6750 e 7750 o
     aviao consumia 6.8% do percurso por amostra contra 1.3% no resto, e
     atravessava 1400px na horizontal em 250px de rolagem. Nao le como voo, le
     como teleporte — foi a queixa do Gabriel em 29/08.

     Duas saidas foram medidas e descartadas antes desta. Subir o passo minimo
     da tabela: em 1.0 o salto cai para 5.8% mas o aviao passa a sair da janela
     em 7 das 29 amostras visiveis, que e exatamente o que o passo de 0.45
     existe para evitar. E cortar por velocidade acima da mediana: nao dispara
     nunca, porque o proprio passo minimo ja limita a razao a ~1/0.45 = 2.2x,
     e o salto agregado so passa disso porque a distribuicao e bimodal.

     O sinal certo e mais direto: as amostras que tiveram a altura FORCADA sao,
     por definicao, as que andaram para tras. Um punhado delas e o arredondar
     de uma curva e nao se ve; uma corrida longa e a manobra atravessando a
     tela. O corte e por tamanho da corrida, em fracao do total de amostras. */
  if (forcado && forcado.length > 8) {
    const CORRIDA = Math.max(3, Math.round(forcado.length * 0.015));
    let i = 0;
    while (i < forcado.length) {
      if (!forcado[i]) { i++; continue; }
      const ini = i;
      while (i + 1 < forcado.length && forcado[i + 1]) i++;
      if (i - ini + 1 >= CORRIDA) {
        for (let k = ini; k <= Math.min(i + 1, op.length - 1); k++) op[k] = 0;
      }
      i++;
    }
  }

  /* A rampa, e ela conserta um pisca que estava no ar.

     A nota no topo desta função diz que o corte acontece com o avião já fora
     da caixa dos dois lados, "então não há fade a fazer". Isso vale para a
     PRIMEIRA regra e só. A segunda — o teleporte — dispara pela corrida de
     amostras forçadas, que é uma propriedade do percurso, e não olha onde o
     avião está: ela apaga com ele no meio do quadro.

     Medido na home a 1440x900, varrendo de 120 em 120px: das quatro trocas de
     visibilidade do percurso, TRÊS acontecem com o avião dentro da tela —
     apaga em x:1103 y:31, acende em x:541 y:13, e acende em x:1248 y:241, que
     é a dobra "O ajuste" de onde veio a queixa.

     Entre duas amostras vizinhas há ~24px de rolagem numa home de 10.907px, e
     `useTransform` interpola só esse intervalo: em rolagem normal isso é um
     quadro. Por isso lia como sumiço, e não como saída.

     A rampa espalha a transição por K amostras de cada lado do trecho
     apagado, começando pelo lado VISÍVEL — o avião perde tinta antes de
     sumir e ganha depois de voltar. K = 2% das amostras dá ~190px de rolagem,
     que é distância suficiente para o olho ler desaparecimento em vez de
     corte. Onde a regra 1 já cortava fora do quadro a rampa não custa nada:
     ninguém vê apagar o que está recortado. */
  const K = Math.max(3, Math.round(op.length * 0.02));
  const rampa = op.slice();
  for (let i = 0; i < op.length; i++) {
    if (op[i] !== 1) continue;
    let d = K;
    for (let j = 1; j <= K; j++) {
      if (op[i - j] === 0 || op[i + j] === 0) { d = j; break; }
    }
    rampa[i] = d / K;
  }
  return rampa;
}

export function useVoo(refCaixa, variante = "home") {
  const quieto = useReducedMotion();
  const [caixa, setCaixa] = useState(null);
  useLayoutEffect(() => {
    const el = refCaixa.current;
    if (!el) return undefined;
    /* Mede tambem a caixa da declaracao, porque o primeiro trecho do voo e
       ancorado nela. E por querySelector e nao por mais um ref no Home: o voo
       e uma camada de fundo do corpo inteiro e nao deveria obrigar a dobra 01
       a saber que ele existe. Se a classe sumir, rotaDoVoo cai num trecho
       inicial generico e nada quebra. */
    const dentro = (n) => {
      let x = 0;
      let y = 0;
      let a = n;
      while (a && a !== el) { x += a.offsetLeft; y += a.offsetTop; a = a.offsetParent; }
      return [x, y];
    };
    const medir = () => {
      const dec = el.querySelector(".v2-declaracao-par");
      let tese = null;
      if (dec && dec.offsetWidth > 0) {
        const [dx, dy] = dentro(dec);
        tese = { x: dx, y: dy, w: dec.offsetWidth, h: dec.offsetHeight };
      }
      const nova = {
        w: el.offsetWidth,
        h: el.offsetHeight,
        alcance: el.offsetHeight - window.innerHeight,
        janela: window.innerHeight,
        tese,
      };
      /* Só troca de caixa se algum NÚMERO mudou.

         O ResizeObserver dispara várias vezes durante o carregamento (imagem
         que chega, fonte que troca, dobra que revela), e quase sempre com as
         mesmas medidas. Sem esta comparação cada disparo criava um objeto novo,
         o que refazia o percurso e, atrás dele, a amostragem de 420 pontos —
         166ms cada, por nada. Comparar por valor é o que faz o custo acontecer
         uma vez por medida de verdade. */
      setCaixa((velha) => {
        if (
          velha &&
          velha.w === nova.w && velha.h === nova.h &&
          velha.alcance === nova.alcance && velha.janela === nova.janela &&
          !velha.tese === !nova.tese &&
          (!nova.tese || (velha.tese.x === nova.tese.x && velha.tese.y === nova.tese.y &&
                          velha.tese.w === nova.tese.w && velha.tese.h === nova.tese.h))
        ) return velha;
        return nova;
      });
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [refCaixa]);
  /* "start start" a "end end": o progresso acompanha a rolagem por dentro do
     corpo, do topo dele até o fim. Com "start end" o voo já começava gasto,
     porque a caixa tem dez mil pixels e entra na tela muito antes de o leitor
     chegar nela. */
  const { scrollYProgress } = useScroll({
    target: refCaixa,
    offset: ["start start", "end end"],
  });
  /* mola frouxa: sem ela o avião trava e destrava junto com o passo da roda do
     mouse, e voo aos solavancos denuncia que é scroll, não voo */
  const suave = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.5 });
  const caminho = useMemo(() => {
    if (!caixa || !(caixa.w > 0)) return null;
    return variante === "home"
      ? rotaDoVoo(caixa.w, caixa.h, caixa.tese, caixa.alcance)
      : rotaDaPagina(variante, caixa.w, caixa.h, caixa.alcance, caixa.janela);
  }, [caixa, variante]);
  /* A tabela sai do render e vai para um efeito, um quadro depois.

     Ela amostra 420 pontos de um percurso de vinte mil pixels, e isso custa
     166ms medidos numa janela de 1440x900. Dentro do `useMemo` esse custo caía
     no MESMO quadro em que a página nova monta, e era ele — não o React — o
     maior quadro travado da troca de rota: 169ms medidos. Numa página com
     cortina isso aparece como a lâmina congelando no meio do gesto.

     Fora do render, a página nova pinta primeiro e a tabela chega no quadro
     seguinte. O preço é um quadro sem avião, e ele é invisível: o avião é
     fundo, mora atrás de todo o conteúdo, e no primeiro quadro de uma página
     nova ninguém rolou nada ainda — ele estaria no começo do percurso de
     qualquer forma. */
  const [tabela, setTabela] = useState(null);
  useEffect(() => {
    if (!caminho) { setTabela(null); return undefined; }
    let vivo = true;
    const id = requestAnimationFrame(() => {
      if (vivo) setTabela(tabelaPorAltura(caminho, caixa ? caixa.w : 0));
    });
    return () => { vivo = false; cancelAnimationFrame(id); };
  }, [caminho, caixa]);
  const distancia = useTransform(
    suave,
    tabela ? tabela.entradas : [0, 1],
    tabela ? tabela.saidas : ["0%", "100%"],
  );
  const opacidade = useTransform(
    suave,
    tabela ? tabela.entradas : [0, 1],
    tabela ? tabela.opacidades : [1, 1],
  );
  return { caminho, distancia, opacidade, quieto };
}

/* 15c. na altura
   Qual item da lista está na altura de quem lê.

   É o que faz a coluna presa mudar de informação: a lista rola à direita e o
   bloco da esquerda troca junto. A faixa de decisão é uma tira no meio da
   janela (`-45%` em cima e embaixo), e não a janela inteira, senão dois itens
   contam como visíveis ao mesmo tempo e a troca fica pulando entre eles.

   IntersectionObserver e não posição por rolagem: o observer não roda em cada
   quadro da rolagem, e a troca só custa quando ela realmente acontece. */
export function useNaAltura(total, faixa = "-45% 0px -45% 0px") {
  const [ativo, setAtivo] = useState(0);
  const nos = useRef([]);
  const marcar = (i) => (el) => { nos.current[i] = el; };
  useEffect(() => {
    const vivos = nos.current.filter(Boolean);
    if (!vivos.length || typeof IntersectionObserver === "undefined") return undefined;
    const obs = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = nos.current.indexOf(e.target);
          if (i >= 0) setAtivo(i);
        });
      },
      { rootMargin: faixa, threshold: 0 },
    );
    vivos.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, [total, faixa]);
  return { ativo, marcar };
}

/* 16. escrita
   A assinatura, revelada como se estivesse sendo escrita.

   Nao e desenho de traco de verdade (isso exige SVG com path e
   stroke-dasharray, e vira quando o Gabriel mandar o SVG dele). Aqui e uma
   mascara em degrade que anda da esquerda para a direita por cima do texto.
   Funciona porque a fonte e cursiva e ligada: a borda da mascara atravessa as
   ligaduras e o olho le uma caneta andando, nao uma cortina abrindo.

   Duas escolhas que fazem a diferenca entre "cortina" e "caneta":
   - a borda tem 5% de suavidade, entao a tinta aparece em vez de saltar;
   - o easing e quase linear no miolo, com uma saida curta.

   Foi encurtada de 2,1s para 1,3s e a borda de 9% para 5%: com a Ephesis o
   efeito longo somava com o floreio da letra e o conjunto lia como enfeite.
   Com a Bad Script, que e monolinear, o traco rapido e seco basta.

   Nao usa whileInView de proposito: e useInView + animate, porque no motion
   v13 valor dentro de mask-image nao interpola por whileInView (mesma
   armadilha do clipPath, anotada em useMaskLine). */
export function useEscrita({ duracao = 0.58, atraso = 0.08 } = {}) {
  const ref = useRef(null);
  const quieto = useReducedMotion();
  const naTela = useInView(ref, { once: true, amount: 0.55 });
  const p = useMotionValue(0);
  useEffect(() => {
    if (quieto || !naTela) return undefined;
    const ctrl = animate(p, 109, {
      duration: duracao,
      delay: atraso,
      ease: [0.3, 0.5, 0.4, 1],
    });
    return () => ctrl.stop();
  }, [naTela, quieto, p, duracao, atraso]);
  const mascara = useMotionTemplate`linear-gradient(90deg, #000 0%, #000 ${p}%, rgba(0,0,0,0) calc(${p}% + 5%))`;
  const estilo = quieto
    ? undefined
    : { maskImage: mascara, WebkitMaskImage: mascara };
  return { ref, estilo, quieto };
}

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
          initial: { opacity: 0, y: 10 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.3 },
          transition: { duration: 0.4, ease: easeRevela, delay: i * 0.05 },
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
          /* 118% e nao 108%: a janela do titulo ganhou .2em de padding por
             baixo para o descendente, e com 108% o topo das letras espiava
             pela borda antes da revelacao. Ver .v2-titulo-janela. */
          initial: { y: "118%" },
          animate: dentro ? { y: 0 } : { y: "118%" },
          transition: { duration: 0.5, ease: easeRevela, delay: i * 0.05 },
        };
  return { ref, props };
}

/* 12. contador
   Número que sobe de 0 até `ate` quando a dobra entra. O DOM da viper serve
   `0 +` parado, prova de que o valor final é escrito por JS; em
   reduced-motion o valor entra pronto, sem contagem. */
export function useContador(ate, duracao = 1.1) {
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

/* 21. camadas
   O parallax multicamada do campo noturno.

   `useParallax` não serve aqui, e não é detalhe de implementação: ele cria o
   próprio `ref` e a própria medição de scroll. Cinco camadas com cinco
   `useParallax` seriam cinco `useScroll` medindo cinco elementos diferentes —
   e como cada camada tem altura própria, `["start end", "end start"]` resolve
   um progresso ligeiramente diferente em cada uma. O resultado é deriva: as
   camadas saem de sincronia e a cena descola em vez de ter profundidade.

   Aqui há UMA medição, a da seção, e as camadas são só transformações
   diferentes do mesmo progresso. É o que faz elas continuarem sendo a mesma
   cena enquanto se movem em velocidades diferentes.

   As velocidades vêm em px e não em %, também de propósito: em % cada camada
   andaria em fração da PRÓPRIA altura, então o céu (alto) e o avião (baixo)
   percorreriam distâncias diferentes com o mesmo número, e a ordem de
   profundidade dependeria do tamanho do arquivo. Em px o número É a distância.

   Quem anda mais está mais perto. Essa é a regra inteira do efeito. */
export function useCamadas(velocidades) {
  const ref = useRef(null);
  const quieto = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const estilos = velocidades.map((v, i) => {
    /* eslint-disable react-hooks/rules-of-hooks -- `velocidades` é uma
       constante de módulo, então a contagem de hooks nunca muda entre
       renders, que é o que a regra existe para garantir. */
    const bruto = useTransform(scrollYProgress, [0, 1], [v, -v]);
    /* A mola endurece camada a camada, e isso NÃO é enfeite.

       Com a mesma mola em todas, as cinco aceleram e param no mesmo instante:
       a distância percorrida muda, mas o ritmo é idêntico, e o olho lê cinco
       cópias da mesma animação em escalas diferentes em vez de cinco planos.
       Massa distante responde devagar e massa próxima responde na hora — então
       o céu chega atrasado e o morro da frente acompanha o dedo. É o que
       separa profundidade de translação.

       Vai de 90 a 210 acompanhando `velocidades`: quem anda mais também
       responde mais rápido. */
    const y = useSpring(bruto, {
      stiffness: 90 + i * 30,
      damping: 30 - i * 2,
      mass: 0.75 - i * 0.09,
    });
    return quieto ? undefined : { y };
  });
  return { ref, estilos, quieto };
}

/* 20. rota
   O traço se desenhando na rolagem, com o avião do site correndo na ponta.

   É a mecânica do Voo (`offset-path` + `offsetDistance`) aplicada a um
   desenho em vez de à página inteira: lá o percurso é invisível e o avião é
   a figura; aqui o percurso É a figura, e o avião só marca onde o leitor
   está nele.

   Duas peças porque duas rotas de comprimentos diferentes precisam andar no
   mesmo scroll e chegar em tempos diferentes — que é o argumento inteiro do
   desenho de /processo. `useTracado` mede a figura uma vez; `useTrecho`
   recorta uma janela desse progresso por rota. Chamar `useTrecho` em nível
   de componente, nunca dentro de map: o número de rotas é fixo. */
/* A janela de rolagem é a CENA, e não a figura.

   As três versões anteriores tentaram achar uma janela boa medindo a posição
   da própria figura na tela, e todas bateram no mesmo teto: uma figura de
   460px numa tela de 900 só fica visível durante ~810px de rolagem. Nesse
   orçamento não cabem as três coisas ao mesmo tempo —

     lento  +  terminar antes de o leitor passar  +  nada já traçado na entrada

   — e trocar uma pela outra foi exatamente o que aconteceu: apertar a janela
   deixou o avião a 2x a velocidade do dedo; abrir a janela antes da figura
   entregou o desenho meio pronto (e, na tela do Gabriel, praticamente pronto)
   antes de ele chegar na seção.

   O orçamento é que estava errado, não a repartição dele. A figura agora mora
   numa cena alta com um palco `sticky`: ela sobe até o meio da tela, TRAVA
   ali, e o traço acontece inteiro com ela parada e centralizada. A rolagem
   disponível deixa de ser a altura da figura e passa a ser a altura da cena,
   que é um número que a gente escolhe — 230vh em `processo.css`, dos quais
   130vh são de traço.

   Com isso as três voltam a caber: começa em zero quando o leitor chega,
   termina antes de a cena soltar, e leva 1165px de rolagem para fazer isso. */
export function useTracado(ref, { offset = ["start start", "end end"] } = {}) {
  const quieto = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset });
  /* A mola tira o serrilhado do trackpad do traço, que num stroke fino
     aparece muito mais que num transform. Rígida e amortecida: ela alisa,
     não atrasa — com bounce o avião passa do fim e volta. */
  const suave = useSpring(scrollYProgress, { stiffness: 150, damping: 34, mass: 0.5 });
  return { progresso: suave, quieto };
}

/* A curva do percurso: arranca, cruza, freia.

   Trapézio com rampas suaves, e não uma cúbica de ponta a ponta. Os dois
   aceleram e desaceleram; a diferença é o miolo. A cúbica está sempre mudando
   de velocidade, então ela tem um pico de 1,5x a média bem no meio do
   caminho — o avião parece dar uma arrancada na hora em que o olho está
   acompanhando ele. O trapézio cruza a maior parte da rota em velocidade
   constante, o que baixa o pico para 1,4x e, principalmente, faz o movimento
   ler como um veículo em viagem em vez de um elástico.

   `a` é a fração da rota gasta em cada rampa. Em 0,3 sobra 40% de cruzeiro.

   Aqui morava um `comCurva(t, paradas)` que repartia a rota em trechos e dava
   a curva inteira a cada um: o avião parava de vez em cada parada do caminho
   curto e na cintura do duplo diamante. Lia como anda-pausa-anda-pausa, e o
   Gabriel recusou. A pausa resolvia um problema de velocidade que a cena
   `sticky` já tinha resolvido antes, por outro caminho: com 1165px de rolagem
   disponíveis não é mais preciso truncar o movimento para ele caber. */
const RAMPA = 0.3;

function curva(t) {
  const a = RAMPA;
  const vmax = 1 / (1 - a);
  /* integral do smoothstep 3u²-2u³, que é u³ - u⁴/2: rampa sem quina nem na
     velocidade nem na aceleração */
  const sobe = (u) => u * u * u - (u ** 4) / 2;
  if (t < a) return vmax * a * sobe(t / a);
  if (t > 1 - a) return 1 - vmax * a * sobe((1 - t) / a);
  return vmax * (a / 2 + (t - a));
}

/* Recorta [inicio, fim] do progresso e devolve o que o desenho consome:
   `traco` para `pathLength`, `passo` para `offsetDistance` e `opacidade` para
   o avião. Os dois primeiros saem do MESMO valor já curvado, senão o avião
   descola da ponta da linha que ele deveria estar puxando.

   `pousa` apaga o avião na chegada. Sem isso ele fica empilhado em cima do nó
   final e os dois viram um borrão vermelho e preto — e o desenho quer dizer
   "chegou", que é o nó cheio, não "está parado ali". */
export function useTrecho(progresso, inicio = 0, fim = 1, { pousa = false } = {}) {
  const cru = useTransform(progresso, [inicio, fim], [0, 1]);
  const t = useTransform(cru, curva);
  const passo = useTransform(t, (v) => `${v * 100}%`);
  /* O avião não existe antes de a rota começar: sem isto ele fica pousado no
     ponto de partida durante a rolagem inteira que antecede a figura. */
  const entra = [inicio, inicio + Math.max(0.01, (fim - inicio) * 0.06)];
  const opacidade = useTransform(
    progresso,
    pousa ? [...entra, fim - (fim - inicio) * 0.08, fim] : entra,
    pousa ? [0, 1, 1, 0] : [0, 1],
  );
  return { traco: t, passo, opacidade };
}
