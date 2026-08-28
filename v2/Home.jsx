/* Home da V2. A ordem das dobras e o spec
   docs/superpowers/specs/2026-08-28-home-v2-redesign-design.md, decisoes H1 a H8:
   hero, declaracao, pilha de casos, marcas, processo, onde estive, fita, fecho. */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { spring, useTardio, useRise, useMaskLine, useParallax, useCobertura, useSticky, usePilha, usePilhaTrilho, usePalavra } from "./motion.js";
import { Label, Regua, Pill } from "./Shell.jsx";
import {
  ALL_MARKS, VOL, COMPANIES,
  casos, pieceProjects, pieceLink,
} from "./content.js";
import { HERO, DECLARACAO, PROCESSO_CURTO } from "./copy.js";

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
  const tardio = useTardio(1.4);
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

        <motion.div className="v2-hero-pe" {...tardio}>
          <p className="v2-hero-sub">
            {HERO.sub[0]}
            <span className="v2-marca-texto">{HERO.sub[1]}</span>
            {HERO.sub[2]}
          </p>
          <Pill onClick={paraCasos} escuro>Ver os casos</Pill>
        </motion.div>
        </div>

        <button className="v2-hero-seta" onClick={paraCasos} aria-label="Rolar para o conteúdo">
          <span className="v2-hero-seta-rot">Role</span>
          <span className="v2-hero-seta-tra" aria-hidden="true" />
        </button>
      </motion.div>
    </section>
  );
}

/* ----------------------------------------------------------- 2. declaracao */

function Declaracao() {
  const palavras = DECLARACAO.split(" ");
  const { ref, opacidades, quieto } = usePalavra(palavras.length);
  return (
    <section className="v2-declaracao-secao" id="sobre">
      <p className="v2-declaracao" ref={ref}>
        {/* o espaço fica FORA do span: espaço no fim de um inline-block é
            descartado na hora de renderizar, e a frase saía sem separação */}
        {palavras.map((w, i) => (
          <React.Fragment key={i}>
            <motion.span
              className="v2-declaracao-w"
              style={quieto ? undefined : { opacity: opacidades[i] }}
            >
              {w}
            </motion.span>
            {i < palavras.length - 1 ? " " : null}
          </React.Fragment>
        ))}
      </p>
    </section>
  );
}

/* A tríade de vitrine saiu na Fase 7. Ela mostrava três dos quatro casos
   que a lista de casos logo abaixo já mostra, com hover de cover, e a lista
   é o tratamento mais forte dos dois. Repetir os mesmos projetos em duas
   dobras era o que fazia a home parecer maior do que o trabalho.
   O `parallax`, que morava nela, foi para a grade de peças. */

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

/* Seis etapas numeradas eram um índice disfarçado de conteúdo. Três frases
   grandes dizem a mesma coisa em um terço da altura. Sem numeral e sem régua
   entre elas: a quebra de linha já separa. */
function Processo() {
  const rise = useRise();
  return (
    <section className="v2-wrap" id="processo">
      <Regua />
      <div className="v2-duas">
        <Label>Como eu trabalho</Label>
        <div className="v2-frases">
          {PROCESSO_CURTO.map((f, i) => (
            <motion.p key={i} className="v2-frase" {...rise(i)}>{f}</motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 3. casos */

/* Pilha grudada, no padrão medido no viper-template: cada painel gruda num
   `top` maior que o anterior, então o topo do painel coberto continua à mostra
   como uma lombada. O invólucro é quem rola; o painel é quem gruda.

   Dois tratamentos de fundo, porque o material é desigual: quem tem foto de
   capa recebe a foto em largura cheia com parallax; a Locar Mais, cujo print
   não fecha em enquadramento de capa, recebe a capa de marca (cor da marca e
   logo), que é a mesma solução que a V1 já usava. */
const PILHA_TOPO = 84;    /* a nav flutuante tem 72px, mais 12 de respiro */
const PILHA_PASSO = 22;   /* a lombada visível de cada painel coberto */

function Painel({ caso, i, total, progresso, ir }) {
  const { escala, veu } = usePilha(progresso, i, total);
  const { ref: refFoto, style: estiloFoto } = useParallax(8);
  const cap = caso.chap;
  const foto = cap.cover || (caso.proj && caso.proj.cover);
  const marca = !foto && cap.capa ? cap.capa : null;
  const href = `/v2/case/${caso.id}`;
  return (
    <motion.article
        className="v2-painel"
        data-escuro-corpo="1"
        style={{ top: PILHA_TOPO + i * PILHA_PASSO, zIndex: i + 1, scale: escala }}
      >
        <a
          className="v2-painel-link"
          href={href}
          onClick={(e) => { e.preventDefault(); ir(href); }}
          aria-label={`${cap.title}, ${cap.descriptor}`}
        >
          <span className="v2-painel-media" ref={refFoto}>
            {foto ? (
              <motion.img
                className="v2-painel-foto"
                style={estiloFoto}
                src={foto}
                alt=""
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            ) : null}
            {marca ? (
              <span className="v2-painel-marca" style={{ background: marca.bg }} aria-hidden="true">
                <img src={marca.logo} alt="" loading="lazy" decoding="async" />
              </span>
            ) : null}
            <motion.span className="v2-painel-veu" style={{ opacity: veu }} aria-hidden="true" />
          </span>

          <span className="v2-painel-texto">
            <span className="v2-painel-n">{cap.num}</span>
            <h2 className="v2-painel-t">{cap.title}</h2>
            <span className="v2-painel-d">{cap.descriptor}</span>
            <span className="v2-painel-dom">{cap.domain}</span>
          </span>
        </a>
    </motion.article>
  );
}

function Pilha({ ir }) {
  const lista = casos();
  const { ref, progresso } = usePilhaTrilho();
  return (
    <section className="v2-pilha" id="casos" aria-label="Casos" ref={ref}>
      {lista.map((c, i) => (
        <Painel
          key={c.id}
          caso={c}
          i={i}
          total={lista.length}
          progresso={progresso}
          ir={ir}
        />
      ))}
    </section>
  );
}

/* ------------------------------------------------------------------ 7. peças */

/* Peça extra num portfólio de UX não pode ter tratamento de caso. Saiu a grade
   de sete cards e saiu a lista atrás de botão: entra uma fita que corre
   sozinha, altura baixa, sem título e sem etiqueta.

   Uma fita e não duas: só sete peças têm foto, e três por fita não enchem
   1440px, então o loop mostraria o vão da costura. As outras sete não têm
   imagem nenhuma e viram uma linha de texto abaixo, que é o tratamento mais
   discreto que ainda deixa o nome delas na página. */
function Fita() {
  const lista = pieceProjects();
  const capa = (p) => p.cover || (p.shots && p.shots[0]);
  const comFoto = lista.filter(capa);
  const semFoto = lista.filter((p) => !capa(p));
  if (!comFoto.length) return null;

  const item = (p, dobra) => {
    const href = pieceLink(p);
    const Tag = href && !dobra ? "a" : "span";
    return (
      <Tag
        key={(dobra ? "b" : "") + p.id}
        className="v2-fita-item"
        href={!dobra && href ? href : undefined}
        target={!dobra && href ? "_blank" : undefined}
        rel={!dobra && href ? "noopener noreferrer" : undefined}
        aria-hidden={dobra ? "true" : undefined}
        tabIndex={dobra ? -1 : undefined}
      >
        <img src={capa(p)} alt={dobra ? "" : p.title} loading="lazy" decoding="async" />
      </Tag>
    );
  };

  return (
    <section className="v2-fita-secao" id="pecas" aria-label="Outras peças">
      <div className="v2-fita">
        <div className="v2-fita-trilho">
          <div className="v2-fita-grupo">{comFoto.map((p) => item(p, false))}</div>
          {/* a segunda cópia existe só para o loop não ter costura */}
          <div className="v2-fita-grupo">{comFoto.map((p) => item(p, true))}</div>
        </div>
      </div>

      {semFoto.length ? (
        <p className="v2-fita-resto">
          <span className="v2-fita-resto-r">Também passaram por aqui</span>
          {semFoto.map((p, i) => (
            <span key={p.id}>
              {i ? <span aria-hidden="true"> · </span> : " "}
              {p.title}
            </span>
          ))}
        </p>
      ) : null}
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
  const rolar = () => {
    const alvo = document.getElementById("casos");
    if (alvo) alvo.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Hero paraCasos={rolar} />
      {/* Tudo que vem depois do hero é opaco e sobe por cima dele. Sem este
          fundo, o hero preso aparece por baixo das dobras claras. */}
      <div className="v2-corpo-claro" data-clara="1">
        <Declaracao />
        <Marquee />
        <Processo />
        <Pilha ir={ir} />
        <Fita />
        <OndeEstive />
      </div>
    </>
  );
}
