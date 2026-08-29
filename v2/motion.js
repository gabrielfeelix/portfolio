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

  const P = [[saidaX, saidaY]];
  const em = (fx, u) => P.push([w * fx, saidaY + sobra * u]);
  /* aqui a volta desce enquanto gira: no meio da página uma volta que sobe
     faria o avião andar contra a rolagem por uma tela inteira. Na dobra da
     tese ela sobe, e pode, porque ali o trecho é curto e é a manobra que dá
     graça na dobra. */
  const volta = (fx, u, raio) => {
    const bx = w * fx;
    const by = saidaY + sobra * u;
    P.push(
      [bx + raio, by - raio * 0.3],
      [bx, by - raio * 0.75],
      [bx - raio, by],
      [bx, by + raio * 0.75],
      [bx + raio, by + raio * 1.1],
    );
  };
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
  em(0.14, 0.66);
  volta(0.24, 0.715, 85);
  em(0.62, 0.78);
  em(0.9, 0.835);
  em(0.55, 0.89);
  em(0.2, 0.94);
  em(0.6, 0.96);
  em(1.1, 1.0);
  return `${tronco} ${suavizar(P, true)}`;
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
function tabelaPorAltura(d) {
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
  };
}

export function useVoo(refCaixa) {
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
      setCaixa({
        w: el.offsetWidth,
        h: el.offsetHeight,
        alcance: el.offsetHeight - window.innerHeight,
        tese,
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
  const caminho = useMemo(
    () => (caixa && caixa.w > 0 ? rotaDoVoo(caixa.w, caixa.h, caixa.tese, caixa.alcance) : null),
    [caixa],
  );
  const tabela = useMemo(() => tabelaPorAltura(caminho), [caminho]);
  const distancia = useTransform(
    suave,
    tabela ? tabela.entradas : [0, 1],
    tabela ? tabela.saidas : ["0%", "100%"],
  );
  return { caminho, distancia, quieto };
}

/* 16. trilha
   O trilho do porto: 01 —— 02 —— 03, com a linha se desenhando da esquerda
   para a direita conforme a dobra passa, e o nó acendendo quando a ponta da
   linha chega nele.

   `avanco` é o progresso já amortecido, para a linha não tremer junto com a
   roda do mouse. `acesos` é quantos nós já foram passados, e vira estado de
   React porque o número dentro do nó troca de cor, o que não é transform nem
   opacidade e portanto não dá para deixar num motion value.

   O estado só muda quando o inteiro muda, não a cada quadro: sem essa guarda
   a dobra re-renderiza 60 vezes por segundo durante a rolagem inteira. */
export function useTrilha(total) {
  const ref = useRef(null);
  const quieto = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.78", "end 0.82"],
  });
  const avanco = useSpring(scrollYProgress, {
    stiffness: 120, damping: 30, mass: 0.6,
  });
  const [acesos, setAcesos] = useState(quieto ? total : 1);
  useEffect(() => {
    if (quieto) { setAcesos(total); return undefined; }
    const degrau = total > 1 ? 1 / (total - 1) : 1;
    return avanco.on("change", (v) => {
      const n = Math.max(1, Math.min(total, Math.floor(v / degrau + 1e-6) + 1));
      setAcesos((atual) => (atual === n ? atual : n));
    });
  }, [avanco, total, quieto]);
  return { ref, avanco, acesos, quieto };
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
