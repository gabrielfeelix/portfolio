/* Home da V2. Fase 2: dobras 1 a 4 (hero, manifesto, vitrine, marcas).
   As dobras 5 a 9 entram na Fase 3, abaixo do marquee. */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { spring, useRise, useMaskLine, useParallax, useCobertura, useSticky } from "./motion.js";
import { Label, Regua, Pill } from "./Shell.jsx";
import {
  ALL_MARKS, projectById, CASE_ORDER, VOL, PROCESSO, COMPANIES,
  casos, pieceProjects, projTag, pieceLink,
} from "./content.js";
import { HERO, MANIFESTO } from "./copy.js";

/* ------------------------------------------------------------------ 1. hero */

/* A palavra rotativa da V1, refeita com mola no lugar do CSS por caractere.
   Ela ocupa a linha inteira: assim a troca nunca muda onde a headline quebra,
   que era o problema que a V1 resolvia medindo a caixa a cada troca. */
function Rotativa({ itens, intervalo = 2800 }) {
  const [i, setI] = useState(0);
  const quieto = useReducedMotion();

  useEffect(() => {
    if (quieto) return;
    const id = setInterval(() => setI((n) => (n + 1) % itens.length), intervalo);
    return () => clearInterval(id);
  }, [itens.length, intervalo, quieto]);

  return (
    <span className="v2-rot">
      {/* leitor de tela lê uma frase só, não o carrossel inteiro */}
      <span className="v2-sr">{itens[i]}</span>
      <span className="v2-rot-caixa" aria-hidden="true">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={i}
            className="v2-rot-item"
            initial={quieto ? { opacity: 0 } : { y: "106%", opacity: 0 }}
            animate={quieto ? { opacity: 1 } : { y: "0%", opacity: 1 }}
            exit={quieto ? { opacity: 0 } : { y: "-106%", opacity: 0 }}
            transition={quieto ? { duration: 0.2 } : spring}
          >
            {itens[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}

function Hero({ paraCasos }) {
  const linha = useMaskLine();
  // O hero fica preso enquanto o manifesto sobe por cima dele, e sai perdendo
  // escala em vez de rolar para fora. É a única passagem coberta da home.
  const capa = useCobertura();
  return (
    <section className="v2-hero v2-grao v2-halo" id="v2-hero" data-escuro="1" ref={capa.ref}>
      <motion.div className="v2-wrap v2-hero-in" style={capa.style}>
        <motion.div className="v2-hero-topo" {...linha(0)}>
          <p className="v2-hero-papel">{HERO.papel}</p>
          <p className="v2-hero-papel">{VOL()}</p>
        </motion.div>

        <div className="v2-hero-baixo">
        <h1 className="v2-hero-h">
          <span className="v2-hero-linha"><motion.span {...linha(1)}>{HERO.linha1}</motion.span></span>
          <span className="v2-hero-linha"><motion.span {...linha(2)}>{HERO.linha2}</motion.span></span>
          <span className="v2-hero-linha is-rot">
            <motion.span {...linha(3)}><Rotativa itens={HERO.rotativas} /></motion.span>
          </span>
        </h1>

        <div className="v2-hero-pe">
          <p className="v2-hero-sub">
            {HERO.sub[0]}
            <span className="v2-marca-texto">{HERO.sub[1]}</span>
            {HERO.sub[2]}
          </p>
          <Pill onClick={paraCasos} escuro>Ver os casos</Pill>
        </div>
        </div>

        <button className="v2-hero-seta" onClick={paraCasos} aria-label="Rolar para o conteúdo">
          <span className="v2-hero-seta-rot">Role</span>
          <span className="v2-hero-seta-tra" aria-hidden="true" />
        </button>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------- 2. manifesto */

function Manifesto() {
  const rise = useRise();
  return (
    <section className="v2-wrap" id="sobre">
      <Regua />
      <div className="v2-duas">
        <Label>Quem eu sou</Label>
        <div>
          <motion.p className="v2-manifesto" {...rise(0)}>{MANIFESTO.lead}</motion.p>
          <div className="v2-manifesto-cols">
            {MANIFESTO.colunas.map((p, i) => (
              <motion.p key={i} className="v2-corpo" {...rise(i + 1)}>{p}</motion.p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- 3. vitrine */

/* Três covers reais. O parallax é por item, então cada um tem o próprio hook. */
function VitrineItem({ proj, i, ir }) {
  const { ref, style } = useParallax(10);
  const rise = useRise();
  const abre = () => ir(`/v2/case/${proj.id}`);
  return (
    <motion.article className="v2-vit-item" {...rise(i)}>
      <a
        className="v2-vit-link"
        href={`/v2/case/${proj.id}`}
        onClick={(e) => { e.preventDefault(); abre(); }}
      >
        <span className="v2-vit-media" ref={ref}>
          <motion.span className="v2-vit-foto" style={style}>
            <img src={proj.cover} alt="" loading="lazy" decoding="async" />
          </motion.span>
        </span>
        <span className="v2-vit-pe">
          <span className="v2-vit-titulo">{proj.title}</span>
          <span className="v2-vit-dom">{proj.domain}</span>
        </span>
      </a>
    </motion.article>
  );
}

function Vitrine({ ir }) {
  // Os casos que têm cover de verdade no repo, na ordem que a V1 já definiu.
  const itens = CASE_ORDER().map(projectById).filter((p) => p && p.cover).slice(0, 3);
  if (!itens.length) return null;
  return (
    <section className="v2-wrap v2-vitrine" id="vitrine">
      <Regua />
      <div className="v2-duas">
        <Label>Trabalho recente</Label>
        <div className="v2-vit-grade">
          {itens.map((p, i) => <VitrineItem key={p.id} proj={p} i={i} ir={ir} />)}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- 4. marcas */

function Marca({ m }) {
  return (
    <span className="v2-marca">
      {m.logo
        ? <img className="v2-marca-logo" src={m.logo} alt={m.name} loading="lazy" decoding="async" />
        : <span className="v2-marca-nome">{m.name}</span>}
    </span>
  );
}

function Marquee() {
  const marcas = ALL_MARKS();
  const trilho = marcas.map((m) => <Marca key={m.id} m={m} />);
  return (
    <section className="v2-marquee-secao" aria-label="Marcas por onde o design passou">
      <div className="v2-wrap"><Regua /></div>
      <div className="v2-marquee">
        <div className="v2-marquee-trilho">
          <div className="v2-marquee-fita">{trilho}</div>
          {/* a segunda cópia existe só para o loop não ter costura */}
          <div className="v2-marquee-fita" aria-hidden="true">
            {marcas.map((m) => <Marca key={"b" + m.id} m={m} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- 5. processo */

/* Seis caixas iguais é grade de preenchimento, não hierarquia, e num fundo
   branco os cards sumiam. Vira lista: régua entre linhas, numeral grande no
   trilho da esquerda, nenhuma borda de caixa. */
function ProcessoLinha({ etapa, i }) {
  const rise = useRise();
  // "01" → o zero fica em muted e o dígito em ink, então o trilho de numerais
  // lê como escala e não como seis manchas do mesmo peso.
  const zero = etapa.n.slice(0, -1);
  const digito = etapa.n.slice(-1);
  return (
    <motion.li className="v2-proc-linha" {...rise(Math.min(i, 3))}>
      <p className="v2-proc-n">
        <span className="v2-proc-n-zero">{zero}</span>{digito}
      </p>
      <h3 className="v2-proc-t">{etapa.t}</h3>
      <p className="v2-corpo v2-proc-p">{etapa.p}</p>
    </motion.li>
  );
}

function Processo() {
  return (
    <section className="v2-wrap" id="processo">
      <Regua />
      <div className="v2-duas">
        <Label>Como eu trabalho</Label>
        <ol className="v2-proc">
          {PROCESSO().map((etapa, i) => (
            <ProcessoLinha key={etapa.n} etapa={etapa} i={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 6. casos */

/* A linha inteira é o link. O cover não fica na página parado: ele aparece à
   direita no hover, que é o que separa uma lista de um índice. */
function CasoLinha({ caso, i, ir }) {
  const rise = useRise();
  const cap = caso.chap;
  const cover = cap.cover || (caso.proj && caso.proj.cover);
  const href = `/v2/case/${caso.id}`;
  return (
    <motion.li className="v2-caso" {...rise(i)}>
      <a className="v2-caso-link" href={href} onClick={(e) => { e.preventDefault(); ir(href); }}>
        <span className="v2-caso-n">{cap.num}</span>
        <span className="v2-caso-t">{cap.title}</span>
        <span className="v2-caso-d">{cap.descriptor}</span>
        <span className="v2-caso-dom">{cap.domain}</span>
        {cover ? (
          <span className="v2-caso-cover" aria-hidden="true">
            <img src={cover} alt="" loading="lazy" decoding="async" />
          </span>
        ) : null}
      </a>
    </motion.li>
  );
}

function Casos({ ir }) {
  const lista = casos();
  return (
    <section className="v2-wrap" id="casos">
      <Regua />
      <div className="v2-duas">
        <Label>Casos</Label>
        <ul className="v2-casos">
          {lista.map((c, i) => <CasoLinha key={c.id} caso={c} i={i} ir={ir} />)}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 7. peças */

function Pecas() {
  const rise = useRise();
  const lista = pieceProjects();
  if (!lista.length) return null;
  return (
    <section className="v2-wrap" id="pecas">
      <Regua />
      <div className="v2-duas">
        <Label>Outras peças</Label>
        <div className="v2-pecas">
          {lista.map((p, i) => {
            const href = pieceLink(p);
            const capa = p.cover || (p.shots && p.shots[0]);
            const Tag = href ? "a" : "div";
            return (
              <motion.article key={p.id} className="v2-peca" {...rise(i % 3)}>
                <Tag
                  className="v2-peca-link"
                  href={href || undefined}
                  target={href ? "_blank" : undefined}
                  rel={href ? "noopener noreferrer" : undefined}
                >
                  {/* Quatro peças não têm imagem no repositório. Caixa vazia
                      lê como erro de carregamento, então elas viram chapa
                      tipográfica, que é uma escolha e não um buraco. */}
                  <span className={"v2-peca-media" + (capa ? "" : " is-vazia")}>
                    {capa
                      ? <img src={capa} alt="" loading="lazy" decoding="async" />
                      : <span className="v2-peca-chapa">{p.title}</span>}
                    <span className="v2-peca-tag">{projTag(p)}</span>
                  </span>
                  <span className="v2-peca-pe">
                    <span className="v2-peca-t">{p.title}</span>
                    <span className="v2-peca-d">{p.domain || p.desc}</span>
                  </span>
                </Tag>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ 8. onde estive */

function OndeEstive() {
  const rise = useRise();
  const { ref, progresso } = useSticky();
  const lista = COMPANIES();
  return (
    <section className="v2-wrap" id="onde">
      <Regua />
      <div className="v2-duas">
        <Label>Onde estive</Label>
        <div className="v2-linha-tempo" ref={ref}>
          {/* o trilho preenche conforme a dobra passa: orienta sem pedir atenção */}
          <span className="v2-lt-trilho" aria-hidden="true">
            <motion.span className="v2-lt-trilho-fill" style={{ scaleY: progresso }} />
          </span>
          {lista.map((c, i) => (
            <motion.article key={c.id} className="v2-lt-item" {...rise(Math.min(i, 3))}>
              <p className="v2-lt-ano">
                {c.anos}
                {c.atual ? <span className="v2-lt-agora">agora</span> : null}
              </p>
              <div className="v2-lt-corpo">
                <h3 className="v2-lt-nome">{c.name}</h3>
                <p className="v2-lt-papel">{c.role}<span className="v2-lt-sep"> · </span>{c.period}</p>
                <p className="v2-corpo">{c.blurb}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- home */

export default function Home({ ir }) {
  // #casos entra na Fase 3; até lá o pill do hero aterrissa na vitrine.
  const rolar = () => {
    const alvo = document.getElementById("casos") || document.getElementById("vitrine");
    if (alvo) alvo.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Hero paraCasos={rolar} />
      {/* Tudo que vem depois do hero é opaco e sobe por cima dele. Sem este
          fundo, o hero preso aparece por baixo das dobras claras. */}
      <div className="v2-corpo-claro" data-clara="1">
        <Manifesto />
        <Vitrine ir={ir} />
        <Marquee />
        <Processo />
        <Casos ir={ir} />
        <Pecas />
        <OndeEstive />
      </div>
    </>
  );
}
