/* As três ilustrações da dobra 04, uma por passo.

   Por que não estão no Kit.jsx: o kit guarda o que se repete (cromo, dobra,
   título, cabeçalho). Estas três são arte de uma dobra só, não componente
   reutilizável, e enfiar one-off no kit é como o kit apodrece. Se uma delas
   virar padrão, ela muda de arquivo.

   Regras que valem para as três:
   - só a paleta: tinta, cinza, filete, accent e papel. Nada de degradê;
   - raio 0, como o resto do site;
   - viewBox 320x200 nas três, então a faixa de ilustração tem a mesma altura
     nas três colunas e a linha de baixo não fica serrilhada;
   - `aria-hidden`: a frase ao lado já diz a mesma coisa, e ilustração narrada
     duas vezes é ruído no leitor de tela;
   - reduced-motion entrega o quadro final, sem nenhum movimento.

   O disparo é `whileInView` com `once`, e não `animate` com useInView, porque
   aqui nada depende de clipPath nem de mask: os dois casos que o motion v13
   não interpola por whileInView estão anotados em motion.js e nenhum aparece
   nestas três. */
import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ease } from "./motion.js";

const VISTA = { once: true, amount: 0.5 };
const T = (delay = 0, duration = 0.7) => ({ duration, ease, delay });

/* 01. Objetivo
   O campo de quadradinhos é a lista de telas. A mira cruza nele e trava num
   ponto só: "começo pelo objetivo, não pela lista de telas". O quadrado
   escolhido é o único vermelho, e ele acende antes da mira chegar, porque o
   que já funciona estava lá antes de alguém procurar. */
export function IlustraObjetivo() {
  const quieto = useReducedMotion();
  const pontos = [];
  for (let l = 0; l < 4; l++) {
    for (let c = 0; c < 6; c++) pontos.push({ x: 40 + c * 48, y: 40 + l * 40, alvo: c === 3 && l === 1 });
  }
  const mx = 184;
  const my = 80;
  return (
    <svg className="v2-ilu" viewBox="0 0 320 200" aria-hidden="true" focusable="false">
      <motion.g initial="off" whileInView="on" viewport={VISTA}>
        {pontos.map((p, i) => (
          <motion.rect
            key={i}
            x={p.x - 4}
            y={p.y - 4}
            width="8"
            height="8"
            fill={p.alvo ? "var(--v2-accent)" : "var(--v2-rule)"}
            variants={{
              off: quieto ? {} : { opacity: 0, scale: 0.4 },
              on: { opacity: 1, scale: 1, transition: T(quieto ? 0 : i * 0.022, 0.4) },
            }}
            style={{ originX: `${p.x}px`, originY: `${p.y}px` }}
          />
        ))}
        {/* a mira: duas linhas que entram das bordas e se cruzam no alvo */}
        <motion.line
          x1={mx} y1="0" x2={mx} y2="200"
          stroke="var(--v2-accent)" strokeWidth="1"
          variants={{
            off: quieto ? {} : { pathLength: 0, opacity: 0 },
            on: { pathLength: 1, opacity: 1, transition: T(quieto ? 0 : 0.75, 0.55) },
          }}
        />
        <motion.line
          x1="0" y1={my} x2="320" y2={my}
          stroke="var(--v2-accent)" strokeWidth="1"
          variants={{
            off: quieto ? {} : { pathLength: 0, opacity: 0 },
            on: { pathLength: 1, opacity: 1, transition: T(quieto ? 0 : 0.9, 0.55) },
          }}
        />
        <motion.rect
          x={mx - 13} y={my - 13} width="26" height="26"
          fill="none" stroke="var(--v2-ink)" strokeWidth="1.5"
          variants={{
            off: quieto ? {} : { opacity: 0, scale: 1.8 },
            on: { opacity: 1, scale: 1, transition: T(quieto ? 0 : 1.35, 0.45) },
          }}
          style={{ originX: `${mx}px`, originY: `${my}px` }}
        />
      </motion.g>
    </svg>
  );
}

/* 02. Protótipo
   A moldura se desenha traço a traço, as barras caem dentro, e aí um toque
   bate na última e ela responde. É a passagem de imagem parada para coisa que
   reage, que é a frase do passo e a tese da dobra 01. */
export function IlustraPrototipo() {
  const quieto = useReducedMotion();
  const barras = [
    { y: 62, w: 160 },
    { y: 88, w: 120 },
    { y: 114, w: 96 },
  ];
  return (
    <svg className="v2-ilu" viewBox="0 0 320 200" aria-hidden="true" focusable="false">
      <motion.g initial="off" whileInView="on" viewport={VISTA}>
        <motion.rect
          x="60" y="30" width="200" height="130"
          fill="none" stroke="var(--v2-ink)" strokeWidth="1.5"
          variants={{
            off: quieto ? {} : { pathLength: 0 },
            on: { pathLength: 1, transition: T(0, quieto ? 0 : 1) },
          }}
        />
        {barras.map((b, i) => (
          <motion.rect
            key={i}
            x="80" y={b.y} width={b.w} height="10"
            fill={i === 2 ? "var(--v2-accent)" : "var(--v2-rule)"}
            variants={{
              off: quieto ? {} : { opacity: 0, x: -14 },
              on: { opacity: 1, x: 0, transition: T(quieto ? 0 : 0.9 + i * 0.13, 0.5) },
            }}
          />
        ))}
        {/* o toque: anel que abre e some em cima da barra que reage */}
        <motion.circle
          cx="176" cy="119" r="22"
          fill="none" stroke="var(--v2-accent)" strokeWidth="1.5"
          variants={{
            off: quieto ? {} : { opacity: 0, scale: 0.2 },
            on: quieto
              ? { opacity: 0 }
              : { opacity: [0, 1, 0], scale: [0.2, 1, 1.5], transition: { duration: 1, ease, delay: 1.5 } },
          }}
          style={{ originX: "176px", originY: "119px" }}
        />
        <motion.rect
          x="80" y="114" width="96" height="10" fill="var(--v2-ink)"
          variants={{
            off: quieto ? {} : { scaleX: 0 },
            on: { scaleX: 1, transition: T(quieto ? 0 : 1.75, 0.4) },
          }}
          style={{ originX: "80px" }}
        />
      </motion.g>
    </svg>
  );
}

/* 03. No ar
   Cinco barras, duas riscadas e descartadas, e a régua de cima fecha em
   largura cheia: "mostro cedo, corto o que não serve, e o protótipo vira
   produto no ar". O corte acontece antes da régua fechar de propósito, porque
   a ordem da frase é essa. */
export function IlustraNoAr() {
  const quieto = useReducedMotion();
  const barras = [
    { y: 56, corta: false },
    { y: 82, corta: true },
    { y: 108, corta: false },
    { y: 134, corta: true },
    { y: 160, corta: false },
  ];
  return (
    <svg className="v2-ilu" viewBox="0 0 320 200" aria-hidden="true" focusable="false">
      <motion.g initial="off" whileInView="on" viewport={VISTA}>
        {barras.map((b, i) => (
          <motion.g
            key={i}
            variants={{
              off: quieto ? {} : { opacity: 0, x: -12 },
              on: b.corta && !quieto
                ? { opacity: [0, 1, 1, 0], x: [-12, 0, 0, 42], transition: { duration: 2.1, times: [0, 0.24, 0.62, 1], ease, delay: i * 0.09 } }
                : { opacity: b.corta ? 0 : 1, x: 0, transition: T(quieto ? 0 : i * 0.09, 0.5) },
            }}
          >
            <rect x="60" y={b.y} width="200" height="12" fill="var(--v2-rule)" />
            {b.corta ? (
              <motion.line
                x1="60" y1={b.y + 6} x2="260" y2={b.y + 6}
                stroke="var(--v2-accent)" strokeWidth="1.5"
                variants={{
                  off: quieto ? {} : { pathLength: 0 },
                  on: { pathLength: 1, transition: T(quieto ? 0 : 0.85, 0.4) },
                }}
              />
            ) : null}
          </motion.g>
        ))}
        {/* a régua de cima: fecha em largura cheia depois do corte */}
        <rect x="60" y="30" width="200" height="2" fill="var(--v2-rule)" />
        <motion.rect
          x="60" y="30" width="200" height="2" fill="var(--v2-accent)"
          variants={{
            off: quieto ? {} : { scaleX: 0 },
            on: { scaleX: 1, transition: T(quieto ? 0 : 1.7, 0.9) },
          }}
          style={{ originX: "60px" }}
        />
      </motion.g>
    </svg>
  );
}

export const ILUSTRACOES = [IlustraObjetivo, IlustraPrototipo, IlustraNoAr];
