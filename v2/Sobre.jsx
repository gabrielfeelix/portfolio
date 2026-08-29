/* A página /sobre.
 *
 * É o Posfácio da V1 remontado na gramática da V2. Nenhuma frase foi escrita
 * para ela: todo o texto sai de v2/copy.js, que copia volume/Posfacio.jsx
 * literalmente e anota a origem bloco a bloco.
 *
 * A forma de página interna já estava decidida na página de caso, e ela se
 * repete aqui sem uma exceção: hero escuro preso, corpo claro subindo por
 * cima, capa de capítulo escura no corte, e a grade de casos no pé. Se a
 * /sobre inventasse a própria moldura, a V2 voltaria a ler como coleção de
 * páginas, que é exatamente o diagnóstico de docs/ANALISE-REFS.md.
 *
 * A ordem, e por que ela é essa:
 *
 *   hero        quem é, com o retrato e a frase de posição
 *   ficha       papel, base, empresa de hoje
 *   01 método   como ele trabalha. Abre pelo argumento de julgamento, que é o
 *               que docs/DIAGNOSTICO-TEXTO-2026-08-27.md pede que a pessoa
 *               defenda, e não pelo "eu também codo", que é o traço menos
 *               diferenciador e já aparece nove vezes na home
 *   citação     a frase mais forte do portfólio, com o caso de origem
 *   ── capítulo 01, "Como eu cheguei aqui" ──
 *   02 virada   Direito, pandemia, e-commerce, design
 *   03 empresas as três, em profundidade: o que era, o que virou, o que ficou
 *   04 formação certificados e ferramentas
 *   ── capítulo 02, "Fora da tela" ──
 *   05 fora     a pessoa longe do Figma, com o retrato ilustrado
 *   06 adiante  para onde ele vai, assinatura, contato
 *   casos       a grade que já fecha toda página interna
 */

import React from "react";
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform, useSpring, useMotionValue } from "motion/react";
import {
  useMaskLine, useCobertura, useRise, useRevelar, useTardio, useEscrita, useNaAltura,
} from "./motion.js";
import { Pill, Label } from "./Shell.jsx";
import {
  Relogio, Dobra, Cabecalho, DuasCores, Presa, Linha, CapaCapitulo, GradeCasos,
} from "./Kit.jsx";
import { COMPANIES, CERTS, CONTATO, AUTOR, VOL } from "./content.js";
import { FERRAMENTAS } from "./ferramentas.js";
import {
  HERO, LOGOS_COR,
  SOBRE_OI, SOBRE_PREMISSA, SOBRE_TRABALHO, SOBRE_CITACAO, SOBRE_VIRADA,
  SOBRE_FORA, SOBRE_ADIANTE, SOBRE_OBRIGADO,
} from "./copy.js";

/* O retrato. Preto e branco de propósito: a foto original é de fim de tarde,
   com verde de árvore e laranja de contraluz, e a regra de paleta do site é
   branco, preto, vermelho e cinza. Em cor ela seria o único lugar da V2 com
   uma quinta família. Recorte 4:5 em 1200x1500, a partir do quadrado de
   1290, centrado no rosto. */
const RETRATO = "/volume/assets/gabriel-foto.webp";

/* O recorte ilustrado, o mesmo da dobra 06 da home. Ele volta aqui e só
   aqui, na dobra pessoal, porque é onde ele significa alguma coisa: camisa
   vermelha sobre papel branco é a paleta inteira do site numa figura só. */
const ILUSTRADO = "/volume/assets/gabriel-recorte.webp";

/* ==================================================================== hero */

/* Mesma passagem coberta da home e do caso: o hero fica preso e o corpo claro
   sobe por cima dele perdendo escala.
 *
 * A diferença é a composição. As quatro páginas de caso põem a arte como
 * fundo da dobra inteira, em 16/9, porque o assunto delas é uma tela. O
 * assunto desta é uma pessoa, e retrato não sobrevive a um corte 16/9: vira
 * faixa de testa. Então ele entra como coluna à direita, sangrando no topo e
 * na borda, no 4:5 nativo do arquivo. Sem upscale e sem recorte novo.
 *
 * O parallax sai da rolagem da PÁGINA, não do progresso da seção: a seção é
 * sticky, e com sticky o `useScroll` com `target` congela. Está anotado
 * desde o primeiro hero da V2. */
function SobreHero() {
  const linha = useMaskLine();
  const tardio = useTardio(1.2);
  const capa = useCobertura();
  const quieto = useReducedMotion();
  const c = CONTATO();
  const lista = COMPANIES();
  const atual = lista.find((e) => e.atual) || lista[lista.length - 1];

  const { scrollY } = useScroll();
  const desloca = useTransform(scrollY, [0, 900], [0, 70]);

  return (
    <section className="v2-hero v2-sb-hero v2-grao" data-escuro="1" ref={capa.ref}>
      <div className="v2-sb-retrato">
        <motion.img
          src={RETRATO}
          alt="Gabriel Felix Barbosa"
          decoding="async"
          style={quieto ? undefined : { y: desloca }}
        />
        {/* O véu. Duas camadas: uma horizontal, que apaga o retrato onde o
            texto passa por cima dele, e uma vertical, que devolve preto no pé
            para as tags e as pílulas não caírem em cima da camisa clara. */}
        <span className="v2-sb-retrato-veu" aria-hidden="true" />
      </div>

      <motion.div className="v2-wrap v2-hero-in" style={capa.style}>
        <motion.div className="v2-hero-topo" {...linha(0)}>
          <p className="v2-hero-papel">{HERO.papel}</p>
          <Relogio />
          <p className="v2-hero-papel">{VOL()}</p>
        </motion.div>

        <div className="v2-sb-hero-baixo">
          {/* A saudação minúscula em mono. Ela é do Posfácio da V1, onde era
              manuscrita; aqui vira cromo, porque a cursiva do site tem um
              lugar só e é a assinatura do pé. */}
          <p className="v2-sb-oi">
            <motion.span {...linha(1)}>{SOBRE_OI}</motion.span>
          </p>

          <h1 className="v2-hero-h v2-sb-hero-h">
            <span className="v2-hero-linha"><motion.span {...linha(2)}>Gabriel Felix</motion.span></span>
            <span className="v2-hero-linha"><motion.span {...linha(3)}>Barbosa</motion.span></span>
          </h1>

          <motion.p className="v2-sb-premissa" {...linha(4)}>{SOBRE_PREMISSA}</motion.p>

          <motion.div className="v2-caso-pills" {...tardio}>
            <Pill href={c.email.href} escuro>Falar comigo</Pill>
            {c.linkedin ? <Pill href={c.linkedin.href} externo escuro>LinkedIn</Pill> : null}
          </motion.div>

          <ul className="v2-caso-tags">
            <li>Maringá, PR</li>
            <li>{atual ? atual.name : null}</li>
            <li>Desde 2024</li>
          </ul>
        </div>
      </motion.div>
    </section>
  );
}

/* =================================================================== ficha */

/* A mesma régua de metadados que abre toda página de caso, com as células
   trocadas. É a legenda do hero, então não leva rótulo lateral. */
function Ficha() {
  const rise = useRise();
  const lista = COMPANIES();
  const atual = lista.find((e) => e.atual);
  const celulas = [
    ["Papel", "UX / Product Designer"],
    ["Base", "Maringá, Paraná"],
    ["Hoje", atual ? `${atual.name} · ${atual.role}` : null],
  ].filter(([, v]) => v);

  return (
    <section className="v2-wrap v2-caso-abre" aria-label="Ficha">
      <dl className="v2-ficha">
        {celulas.map(([rot, val], i) => (
          <motion.div className="v2-ficha-cel" key={rot} {...rise(i)}>
            <dt className="v2-ficha-l">{rot}</dt>
            <dd className="v2-ficha-v">{val}</dd>
          </motion.div>
        ))}
      </dl>
    </section>
  );
}

/* ============================================================== 01. método */

function Metodo() {
  const rise = useRise();
  return (
    <Dobra id="metodo" n="01" nome="Método" carimbo="©26">
      <Cabecalho
        olho="Como eu trabalho"
        titulo={<DuasCores fraca="Uma tela clicável" forte="na mão das pessoas, cedo" />}
        lead={SOBRE_TRABALHO.lead}
        /* O resto do argumento entra na quinta parte do cabeçalho, embaixo do
           lead, e não numa coluna nova embaixo do título. Com ele embaixo
           sobravam 1160px de branco à direita de dois parágrafos de 16px, que
           é o mesmo defeito que a Fase 6 corrigiu na página de caso. */
        prova={
          <div className="v2-sb-continua">
            {SOBRE_TRABALHO.paras.map((p, i) => (
              <motion.p className="v2-corpo v2-sb-p" key={i} {...rise(i)}>{p}</motion.p>
            ))}
          </div>
        }
      />
    </Dobra>
  );
}

/* A citação.
 *
 * Ela existe porque docs/DIAGNOSTICO-TEXTO-2026-08-27.md mede que esta é a
 * frase mais forte do portfólio inteiro e que, até aqui, ela só aparecia
 * enterrada no capítulo do PCYES. A origem entra junto: frase sem caso é
 * slogan, e o site inteiro é construído contra isso. */
function Citacao() {
  const revelar = useRevelar();
  return (
    <section className="v2-wrap v2-sb-cita-secao" aria-label="Citação">
      <motion.blockquote className="v2-sb-cita" {...revelar(0)}>
        <p className="v2-sb-cita-q">{SOBRE_CITACAO.q}</p>
        <footer className="v2-sb-cita-f">{SOBRE_CITACAO.f}</footer>
      </motion.blockquote>
    </section>
  );
}

/* ============================================================== 02. virada */

function Virada() {
  const rise = useRise();
  return (
    <Dobra id="virada" n="02" nome="A virada" carimbo="©26">
      <Cabecalho
        olho="Como eu cheguei aqui"
        titulo={<DuasCores fraca="Eu ia ser" forte="advogado" />}
        lead={SOBRE_VIRADA[0]}
        prova={
          <div className="v2-sb-continua">
            {SOBRE_VIRADA.slice(1).map((p, i) => (
              <motion.p className="v2-corpo v2-sb-p" key={i} {...rise(i)}>{p}</motion.p>
            ))}
          </div>
        }
      />
    </Dobra>
  );
}

/* =========================================================== 03. trajetória */

/* As três empresas, em profundidade.
 *
 * A home já tem a linha do tempo, com uma frase por empresa. Esta dobra é a
 * versão longa da mesma coisa, e por isso ela usa a mesma peça, a coluna
 * presa: a identidade fica parada à esquerda enquanto a história rola à
 * direita. Repetir o componente é o que faz as duas páginas parecerem uma
 * só; o que muda é o conteúdo da coluna que rola.
 *
 * Três colunas presas em sequência, e não uma com troca de conteúdo, porque
 * cada empresa tem história fechada: com uma coluna só, o leitor perderia
 * onde começa uma e termina a outra, que é a informação mais importante de
 * uma trajetória. */
function Empresa({ e, i, total }) {
  const rise = useRise();
  const marca = LOGOS_COR[e.id] || e.logo;

  return (
    <article className="v2-sb-emp" aria-labelledby={`emp-${e.id}`}>
      <Presa
        esquerda={
          <div className="v2-sb-emp-id">
            <p className="v2-sb-emp-cromo">
              <span className="v2-sb-emp-n">{`( 00${i + 1} )`}</span>
              <span>{e.anos}</span>
              {e.atual ? <span className="v2-sb-emp-agora">agora</span> : null}
            </p>
            {/* Quem tem arquivo de marca mostra a marca; quem não tem mostra
                só o nome, e o nome cresce um degrau para ocupar o lugar dela.
                Antes os dois entravam juntos e a TT&T aparecia duas vezes,
                uma embaixo da outra. */}
            {marca ? (
              <img className="v2-sb-emp-logo" src={marca} alt={`Marca da ${e.name}`} draggable="false" />
            ) : null}
            <h3 className="v2-sb-emp-nome" data-so={marca ? undefined : "1"} id={`emp-${e.id}`}>{e.name}</h3>
            <p className="v2-sb-emp-papel">{e.role}</p>
            <p className="v2-sb-emp-periodo">{e.period}</p>
          </div>
        }
      >
        <motion.p className="v2-sb-emp-abre" {...rise(0)}>{e.abre}</motion.p>

        {e.fala ? (
          <motion.p className="v2-sb-emp-fala" {...rise(1)}>{e.fala}</motion.p>
        ) : null}

        {e.fecha ? (
          <motion.p className="v2-sb-emp-fecha" {...rise(2)}>{e.fecha}</motion.p>
        ) : null}

        {e.skills && e.skills.length ? (
          <motion.div className="v2-sb-emp-skills" {...rise(3)}>
            <p className="v2-sb-emp-skills-r">O que passou pela minha mão</p>
            <dl className="v2-sb-skills">
              {e.skills.map((s) => (
                <div className="v2-sb-skill" key={s.k}>
                  <dt>{s.k}</dt>
                  <dd>{s.p}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        ) : null}
      </Presa>
      {i < total - 1 ? <div className="v2-sb-emp-fim"><Linha /></div> : null}
    </article>
  );
}

function Trajetoria() {
  const lista = COMPANIES();
  return (
    <Dobra id="empresas" n="03" nome="Trajetória" carimbo="©26">
      <Cabecalho
        olho="Onde estive"
        titulo={<DuasCores fraca="Três empresas," forte="e o que ficou de cada uma" />}
        lead="A versão curta está na home. Esta é a longa: o que era o lugar, o que eu fiz lá, e o que eu saí sabendo."
      />
      {lista.map((e, i) => (
        <Empresa key={e.id} e={e} i={i} total={lista.length} />
      ))}
    </Dobra>
  );
}

/* ============================================================ 04. formação */

/* A vitrine que segue o cursor.
 *
 * Não veio de nenhuma das seis referências: procurei `mousemove` mais
 * `translate3d` em todas elas e o que existe lá é sempre card com miniatura
 * parada que dá zoom no hover. O parente mais próximo é do próprio site: o
 * `.nc-thumb` do "Próximo capítulo" da V1, que está em preto e branco em
 * repouso e vira cor no hover. A regra dele é a regra daqui.
 *
 * Mecanismo: a lista escuta `pointermove` e guarda a posição em dois
 * `motionValue`; a placa é `position: fixed` e lê os dois por uma mola. A
 * mola é o efeito inteiro: sem ela a placa gruda no cursor e vira ponteiro,
 * com ela ela persegue, e é a perseguição que dá a sensação de peso.
 *
 * A rotação sai da diferença entre onde o cursor está e onde a placa chegou:
 * quando ela está atrasada, ela inclina para o lado do atraso, que é o que
 * um objeto arrastado faz. Trava em 8 graus para não virar pirueta.
 *
 * Ela é enfeite e sai do fluxo de leitura: `aria-hidden`, e nada aqui é
 * clicável, então quem navega por teclado não perde nada. Some inteira em
 * `prefers-reduced-motion` e em ponteiro grosso (celular), onde hover não
 * existe. */
function VitrineCerts({ lista }) {
  const quieto = useReducedMotion();
  const [ativo, setAtivo] = React.useState(-1);
  const alvoX = useMotionValue(0);
  const alvoY = useMotionValue(0);
  /* Duas molas com constantes diferentes de propósito: a placa chega ao
     destino em X e Y com tempos ligeiramente distintos, e é isso que faz o
     movimento ler como orgânico em vez de linear. */
  const x = useSpring(alvoX, { stiffness: 240, damping: 28, mass: .7 });
  const y = useSpring(alvoY, { stiffness: 200, damping: 26, mass: .7 });
  const gira = useTransform([alvoX, x], ([a, b]) => Math.max(-8, Math.min(8, (a - b) * 0.16)));
  const giraSuave = useSpring(gira, { stiffness: 160, damping: 22 });

  /* Ponteiro fino é a única condição: `hover: hover` sozinho dá verdadeiro em
     alguns híbridos com tela sensível, e aí a placa nasce no canto e fica. */
  const [podeHover, setPodeHover] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const ler = () => setPodeHover(mq.matches);
    ler();
    mq.addEventListener("change", ler);
    return () => mq.removeEventListener("change", ler);
  }, []);

  const ligado = podeHover && !quieto;

  const mover = (e) => {
    if (!ligado) return;
    alvoX.set(e.clientX);
    alvoY.set(e.clientY);
  };

  const rise = useRise();
  const cert = ativo >= 0 ? lista[ativo] : null;

  return (
    <>
      <ol
        className="v2-sb-certs"
        onPointerMove={mover}
        onPointerLeave={() => setAtivo(-1)}
      >
        {lista.map((c, i) => (
          <motion.li
            className="v2-sb-cert"
            key={c.id}
            data-vivo={ativo === i ? "1" : undefined}
            data-apagado={ativo >= 0 && ativo !== i ? "1" : undefined}
            onPointerEnter={(e) => { mover(e); setAtivo(i); }}
            {...rise(Math.min(i, 3))}
          >
            <span className="v2-sb-cert-n">{String(i + 1).padStart(2, "0")}</span>
            <span className="v2-sb-cert-t">{c.title}</span>
            <span className="v2-sb-cert-e">{c.issuer}</span>
          </motion.li>
        ))}
      </ol>

      {ligado ? (
        <AnimatePresence>
          {cert && cert.logo ? (
            <motion.div
              className="v2-sb-vitrine"
              aria-hidden="true"
              style={{ x, y, rotate: giraSuave }}
              initial={{ opacity: 0, scale: .86 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: .92, transition: { duration: .18 } }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <img src={cert.logo} alt="" />
            </motion.div>
          ) : null}
        </AnimatePresence>
      ) : null}
    </>
  );
}

/* Um quadrado por ferramenta.
 *
 * A regra é o quadrado, não o que está dentro: quem tem marca vetorial entra
 * com a marca, quem não tem entra com o monograma na mono. Quatro das sete
 * foram removidas do simple-icons por pedido de marca registrada, e inventar
 * um desenho para elas seria pior que assumir a letra. Ver v2/ferramentas.js.
 *
 * Em repouso tudo é tinta sobre cinza, que é a paleta. A cor oficial só
 * aparece no hover, e é a mesma troca do `.nc-thumb` da V1: preto e branco
 * parado, cor quando a pessoa chega perto. */
function Ferramentas() {
  const rise = useRise();
  return (
    <motion.div className="v2-sb-ferr" {...rise(1)}>
      <p className="v2-sb-ferr-r">Ferramentas</p>
      <ul className="v2-sb-ferr-grade">
        {FERRAMENTAS.map((f) => (
          <li className="v2-sb-ferr-item" key={f.id}>
            <span className="v2-sb-quadro" style={f.hex ? { "--marca": f.hex } : undefined}>
              {f.d ? (
                <svg viewBox="0 0 24 24" role="img" aria-label={f.nome} focusable="false">
                  <path d={f.d} fill="currentColor" />
                </svg>
              ) : (
                <span className="v2-sb-mono" aria-label={f.nome}>{f.mono}</span>
              )}
            </span>
            <span className="v2-sb-ferr-nome">{f.nome}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* Certificado é lista, não card. Cinco caixas com miniatura viram grade de
   selo e leem como badge de curso online; a mesma informação em régua
   tipográfica lê como currículo, que é o que ela é. A miniatura não sumiu:
   ela virou a placa que segue o cursor. */
function Formacao() {
  const lista = CERTS();
  return (
    <Dobra id="formacao" n="04" nome="Formação" carimbo="©26">
      <Cabecalho
        olho="Formação"
        titulo={<DuasCores fraca="O que eu estudei" forte="e com o que eu trabalho" />}
      />
      <div className="v2-sb-form">
        <VitrineCerts lista={lista} />
        <Ferramentas />
      </div>
    </Dobra>
  );
}

/* ============================================================ 05. fora da tela */

function ForaDaTela() {
  const rise = useRise();
  const c = CONTATO();
  return (
    <Dobra id="fora" n="05" nome="Fora da tela" carimbo="©26">
      <div className="v2-sb-fora">
        <div className="v2-sb-fora-texto">
          <Cabecalho
            empilhado
            olho="Fora da tela"
            titulo={<DuasCores fraca="O que eu faço" forte="quando fecho o Figma" />}
          />
          {SOBRE_FORA.map((p, i) =>
            typeof p === "string" ? (
              <motion.p className="v2-corpo v2-sb-p" key={i} {...rise(i)}>{p}</motion.p>
            ) : (
              <motion.p className="v2-corpo v2-sb-p" key={i} {...rise(i)}>
                {p.pre}
                <a className="v2-sb-link" href={c.tiktok.href} target="_blank" rel="noopener noreferrer">
                  {p.link}
                </a>
                {p.pos}
              </motion.p>
            )
          )}
        </div>
        <div className="v2-sb-fora-fig" aria-hidden="true">
          <img src={ILUSTRADO} alt="" loading="lazy" draggable="false" />
        </div>
      </div>
    </Dobra>
  );
}

/* ============================================================= 06. adiante */

/* A assinatura, a mesma da dobra 06 da home: Bad Script, monolinear, e a
   única cursiva do site. É placeholder assumido e vira SVG quando o Gabriel
   mandar a assinatura dele. O <p> continua sendo o texto acessível: a
   máscara é pintura. */
function Assinatura({ children }) {
  const { ref, estilo } = useEscrita();
  return (
    <p className="v2-sobre-ass" ref={ref}>
      <motion.span className="v2-sobre-ass-tinta" style={estilo}>{children}</motion.span>
    </p>
  );
}

function Adiante() {
  const revelar = useRevelar();
  const c = CONTATO();
  return (
    <Dobra id="adiante" n="06" nome="Adiante" carimbo="©26">
      <p className="v2-olho">Para onde eu vou</p>
      <motion.p className="v2-sb-adiante" {...revelar(0)}>{SOBRE_ADIANTE}</motion.p>
      <motion.div className="v2-sb-fecho" {...revelar(1)}>
        <div>
          <p className="v2-sb-obrigado">{SOBRE_OBRIGADO}</p>
          <Assinatura>{AUTOR()}</Assinatura>
        </div>
        <Pill href={c.email.href}>Falar comigo</Pill>
      </motion.div>
    </Dobra>
  );
}

/* ================================================================== página */

export default function Sobre({ ir }) {
  return (
    <>
      <SobreHero />
      {/* O corpo claro é opaco e sobe por cima do hero preso. `data-clara` é o
          que a nav observa para saber quando voltar ao preto. */}
      <div className="v2-corpo-claro" data-clara="1">
        <Ficha />
        <Metodo />
        <Citacao />

        <CapaCapitulo n="01" t="Como eu cheguei aqui" de="02" rotulo="Capítulo" />
        <Virada />
        <Trajetoria />
        <Formacao />

        <CapaCapitulo n="02" t="Fora da tela" de="02" rotulo="Capítulo" />
        <ForaDaTela />
        <Adiante />

        <GradeCasos cromo="O trabalho" titulo="Os casos" ir={ir} />
      </div>
    </>
  );
}
