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

   Ele aparece em quatro lugares — cruzando a rolagem (Kit.jsx), dentro do
   botão (Shell.jsx), atravessando a cortina de página (Travessia.jsx) e
   orbitando a tela de carregamento — e nos três primeiros é literalmente esta
   constante. O quarto é HTML servido, inline no <head>, e não pode importar
   nada: lá o mesmo `d` está escrito à mão em site/decolagem.html, e é o único
   lugar em que ele se repete. Se este mudar, aquele muda junto. */
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
      const y = ultimo === -Infinity || pt.y > ultimo ? pt.y : ultimo + minimo;
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
    opacidades: cortina(alturas, lados),
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
function cortina(alturas, lados) {
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
  return op;
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
export function useEscrita({ duracao = 1.3, atraso = 0.15 } = {}) {
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
