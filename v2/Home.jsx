/* Home da V2. Fase 2: dobras 1 a 4 (hero, manifesto, vitrine, marcas).
   As dobras 5 a 9 entram na Fase 3, abaixo do marquee. */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { spring, useTardio, useRise, useMaskLine, useParallax, useCobertura, useSticky } from "./motion.js";
import { Label, Regua, Pill } from "./Shell.jsx";
import {
  ALL_MARKS, VOL, PROCESSO, COMPANIES,
  casos, pieceProjects, pieceLink,
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
      {/* h2: a home só tem o h1 do hero antes daqui, e h3 pulava um nível */}
      <h2 className="v2-proc-t">{etapa.t}</h2>
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

/* Fase 7. Eram catorze peças na grade, sete delas sem imagem nenhuma,
   viradas em chapa tipográfica escura. Chapa é uma saída honesta para uma
   peça sem foto, mas sete delas em grade de três colunas fazem a dobra
   competir com os casos, e era para ela ficar mais discreta.
   Agora a grade só recebe o que tem foto de verdade. O resto vira lista de
   texto, fechada, atrás de um botão. */
function PecaComFoto({ p, i }) {
  const rise = useRise();
  const { ref, style } = useParallax(8);
  const href = pieceLink(p);
  const capa = p.cover || (p.shots && p.shots[0]);
  const Tag = href ? "a" : "div";
  return (
    <motion.article className="v2-peca" {...rise(i % 3)}>
      <Tag
        className="v2-peca-link"
        href={href || undefined}
        target={href ? "_blank" : undefined}
        rel={href ? "noopener noreferrer" : undefined}
      >
        <span className="v2-peca-media" ref={ref}>
          <motion.span className="v2-peca-foto" style={style}>
            <img src={capa} alt="" loading="lazy" decoding="async" />
          </motion.span>
          {/* O painel de vidro do maxfolio: borda de 1px e blur de 9px
              sobre a mídia. Ele diz o que a etiqueta "PEÇA" não dizia: a
              etiqueta era igual nos sete cards, então não informava nada.
              Aqui o painel só aparece no hover, e só onde há link. */}
          {href ? (
            <span className="v2-peca-abrir" aria-hidden="true">
              Abrir
              <svg viewBox="0 0 16 16" width="11" height="11" fill="none">
                <path d="M4 12 12 4M6 4h6v6" stroke="currentColor" strokeWidth="1.6"
                      strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          ) : null}
        </span>
        <span className="v2-peca-pe">
          <span className="v2-peca-t">{p.title}</span>
          <span className="v2-peca-d">{p.domain || p.desc}</span>
        </span>
      </Tag>
    </motion.article>
  );
}

function Pecas() {
  const rise = useRise();
  const [aberta, setAberta] = useState(false);
  const lista = pieceProjects();
  if (!lista.length) return null;

  const temFoto = (p) => Boolean(p.cover || (p.shots && p.shots[0]));
  const comFoto = lista.filter(temFoto);
  const semFoto = lista.filter((p) => !temFoto(p));

  return (
    <section className="v2-wrap" id="pecas">
      <Regua />
      <div className="v2-duas">
        <Label>Outras peças</Label>
        <div>
          <div className="v2-pecas">
            {comFoto.map((p, i) => <PecaComFoto p={p} i={i} key={p.id} />)}
          </div>

          {semFoto.length ? (
            <div className="v2-pecas-resto">
              <button
                type="button"
                className="v2-pecas-botao"
                aria-expanded={aberta}
                aria-controls="v2-pecas-lista"
                onClick={() => setAberta((v) => !v)}
              >
                <span className="v2-pecas-botao-n">{String(semFoto.length).padStart(2, "0")}</span>
                <span>{aberta ? "Esconder as outras" : "Ver todas as peças"}</span>
                <span className={"v2-pecas-seta" + (aberta ? " is-aberta" : "")} aria-hidden="true" />
              </button>

              {aberta ? (
                <ul className="v2-pecas-lista" id="v2-pecas-lista">
                  {semFoto.map((p, i) => {
                    const href = pieceLink(p);
                    const Tag = href ? "a" : "span";
                    return (
                      <motion.li key={p.id} {...rise(Math.min(i, 4))}>
                        <Tag
                          className="v2-pecas-linha"
                          href={href || undefined}
                          target={href ? "_blank" : undefined}
                          rel={href ? "noopener noreferrer" : undefined}
                        >
                          <span className="v2-pecas-linha-t">{p.title}</span>
                          <span className="v2-pecas-linha-d">{p.domain || p.desc}</span>
                        </Tag>
                      </motion.li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          ) : null}
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
        <Manifesto />
        <Marquee />
        <Processo />
        <Casos ir={ir} />
        <Pecas />
        <OndeEstive />
      </div>
    </>
  );
}
