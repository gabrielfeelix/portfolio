/* As três marcas da dobra 04.

   Não são ilustrações. São o MESMO objeto em três estados, desenhado a traço,
   64x64, no canto de cada linha do índice: um ponto achado no meio de outros,
   o ponto ganhando uma moldura, a moldura publicada. A continuidade é o
   argumento, e é por isso que o ponto e o anel aparecem nas três.

   A versão anterior era ilustração de conceito, uma por passo, 320x200, e lia
   como enfeite inventado para justificar três frases. As referências, quando
   não têm material, não desenham nada: resolvem com régua, número e
   tipografia. Estas marcas são a menor coisa que ainda diz alguma coisa.

   Regras: só a paleta, traço e não preenchimento (menos no estado 03, que é
   justamente o preenchido), viewBox igual nas três, aria-hidden porque a
   frase ao lado já diz o mesmo, e reduced-motion entrega o quadro final. */
import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ease } from "./motion.js";

const VISTA = { once: true, amount: 0.6 };
const T = (delay = 0, duration = 0.6) => ({ duration, ease, delay });

/* o campo de pontos, comum ao estado 01: a "lista de telas" */
const CAMPO = [];
for (let l = 0; l < 3; l++) {
  for (let c = 0; c < 3; c++) CAMPO.push({ x: 14 + c * 18, y: 14 + l * 18, alvo: c === 1 && l === 1 });
}

function Quadro({ children }) {
  return (
    <svg className="v2-selo" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <motion.g initial="off" whileInView="on" viewport={VISTA}>{children}</motion.g>
    </svg>
  );
}

/* 01. o ponto achado no meio dos outros */
export function MarcaObjetivo() {
  const quieto = useReducedMotion();
  return (
    <Quadro>
      {CAMPO.map((p, i) => (
        <motion.rect
          key={i}
          x={p.x - 2} y={p.y - 2} width="4" height="4"
          fill={p.alvo ? "var(--v2-accent)" : "var(--v2-rule)"}
          variants={{
            off: quieto ? {} : { opacity: 0 },
            on: { opacity: 1, transition: T(quieto ? 0 : i * 0.04, 0.3) },
          }}
        />
      ))}
      <motion.circle
        cx="32" cy="32" r="9" fill="none" stroke="var(--v2-accent)" strokeWidth="1.5"
        variants={{
          off: quieto ? {} : { pathLength: 0, opacity: 0 },
          on: { pathLength: 1, opacity: 1, transition: T(quieto ? 0 : 0.45, 0.6) },
        }}
      />
    </Quadro>
  );
}

/* 02. o mesmo ponto, agora com moldura: virou tela */
export function MarcaPrototipo() {
  const quieto = useReducedMotion();
  return (
    <Quadro>
      <circle cx="32" cy="32" r="3" fill="var(--v2-accent)" />
      <motion.circle
        cx="32" cy="32" r="9" fill="none" stroke="var(--v2-rule)" strokeWidth="1.5"
        variants={{ off: quieto ? {} : { opacity: 0 }, on: { opacity: 1, transition: T(0, 0.3) } }}
      />
      <motion.rect
        x="10" y="10" width="44" height="44"
        fill="none" stroke="var(--v2-ink)" strokeWidth="1.5"
        variants={{
          off: quieto ? {} : { pathLength: 0 },
          on: { pathLength: 1, transition: T(quieto ? 0 : 0.3, 0.9) },
        }}
      />
    </Quadro>
  );
}

/* 03. a moldura preenchida e assentada numa régua: no ar */
export function MarcaNoAr() {
  const quieto = useReducedMotion();
  return (
    <Quadro>
      <motion.rect
        x="10" y="10" width="44" height="38" fill="var(--v2-ink)"
        variants={{
          off: quieto ? {} : { scaleY: 0 },
          on: { scaleY: 1, transition: T(0, quieto ? 0 : 0.65) },
        }}
        style={{ originY: "48px" }}
      />
      <circle cx="32" cy="29" r="3" fill="var(--v2-accent)" />
      <motion.rect
        x="10" y="53" width="44" height="1.5" fill="var(--v2-accent)"
        variants={{
          off: quieto ? {} : { scaleX: 0 },
          on: { scaleX: 1, transition: T(quieto ? 0 : 0.6, 0.55) },
        }}
        style={{ originX: "10px" }}
      />
    </Quadro>
  );
}

export const ILUSTRACOES = [MarcaObjetivo, MarcaPrototipo, MarcaNoAr];
