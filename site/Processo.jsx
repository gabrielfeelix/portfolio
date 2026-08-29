/* Página /processo da V2.
 *
 * Por que ela existe: a dobra 04 da home diz o método em três frases, e três
 * frases não aguentam a pergunta que todo processo seletivo faz. A home é o
 * trailer; esta página é o método inteiro, e as duas dizem a mesma coisa na
 * mesma ordem: os três movimentos da home (Objetivo, Protótipo, No ar) são as
 * três capas de capítulo daqui, e os seis passos de `PROCESSO` moram dentro
 * deles. Se um dia a home mudar de três para outro número, esta página muda
 * junto ou as duas param de bater.
 *
 * Gramática: a mesma da página de caso, importada do kit. Hero escuro preso,
 * corpo claro subindo por cima, capa de capítulo em chapa que sangra, dobra de
 * três colunas (label · leitura de 640 · margem de 300), figura emoldurada e a
 * grade de casos no pé. Nada aqui inventa forma nova.
 *
 * A mídia segue a gramática por contagem que a página de caso estabeleceu:
 * zero figuras viram dobra tipográfica (o número do passo em display ocupa o
 * lugar da imagem), uma sangra, duas ficam lado a lado. Quatro dos seis passos
 * não têm prova visual honesta, e é por isso que o número é o grafismo desta
 * página: método não tem screenshot.
 *
 * Texto: as seis etapas saem verbatim de `PROCESSO` em volume/data.jsx, o
 * título e a premissa do hero saem verbatim de volume/Processo.jsx (a mesma
 * página na V1), as frases de movimento saem de `PROCESSO_CURTO` em copy.js.
 * O ÚNICO texto novo desta página são os dois parágrafos de `ABERTURA` abaixo,
 * marcados como novos para revisão.
 */

import React from "react";
import { motion } from "motion/react";
import { useRise, useMaskLine, useCobertura } from "./motion.js";
import { Label, Pill } from "./Shell.jsx";
import { DobraCaso as Dobra, Figura, CapaCapitulo, GradeCasos, CampoDeVoo, Lamina } from "./Kit.jsx";
import { PROCESSO, casos, CONTATO } from "./content.js";
import { PROCESSO_CURTO } from "./copy.js";

/* ------------------------------------------------------------------ copy */

/* volume/Processo.jsx · `.proc-h1` e `.splash-lead`, palavra por palavra. */
const HERO = {
  olho: "O método",
  linha1: "Do objetivo ao protótipo,",
  linha2: "em dias.",
  premissa: "Valido com quem vai usar antes de fechar a tela. O que não passa no teste eu corto.",
};

/* TEXTO NOVO, e o único da página. Escrito em 29/08 porque a V1 abre a página
   direto no primeiro passo e a V2 precisa de uma dobra que diga por que a
   ordem importa antes de listar seis coisas. Se o Gabriel quiser reescrever,
   é aqui e só aqui. */
const ABERTURA = [
  "São seis passos, na mesma ordem, em todo projeto deste portfólio. Cada um existe para matar uma dúvida que o passo anterior deixou de pé.",
  "O tempo de cada passo muda por projeto. A regra que não muda é a do passo 03: ninguém fecha tela antes de alguém ter tentado usar.",
];

/* volume/Processo.jsx · `.proc-msg`.
   A frase inteira lá é "Protótipo vira produto. Eu vou junto até o ar." A
   primeira sentença saiu: o passo 06 já diz "Protótipo vira produto no ar" uma
   tela acima, e as duas juntas repetiam seis palavras em meia rolagem. O que
   sobrou é a metade que o passo 06 NÃO diz. */
const FECHO = ["Eu vou junto", "até o ar."];

/* Que passo mora em que movimento. Os movimentos são os três de
   PROCESSO_CURTO, que são os três da dobra 04 da home; os índices apontam
   para PROCESSO em volume/data.jsx.

   Dois passos cada, e a divisão sai das próprias frases: "do objetivo ao
   protótipo" separa 02 de 03, e "mostro cedo, corto o que não serve" começa
   em 05. Três movimentos de dois é também o que dá ritmo par à página: um
   movimento de um passo só vira capa escura seguida de uma frase, e a capa
   passa a anunciar o que vem logo abaixo dela. */
const MOVIMENTOS = [
  { passos: [0, 1] },   // Objetivo:  objetivo, referência
  { passos: [2, 3] },   // Protótipo: protótipo navegável, apresenta
  { passos: [4, 5] },   // No ar:     ajusta, entrega / constrói
];

/* A prova visual, por passo, e só onde ela é honesta.
 *
 * Sai de `figuras` do capítulo do PCYES em volume/data.jsx, com src, alt e
 * legenda copiados sem uma palavra mudada. Os quatro passos que não aparecem
 * aqui não têm print que prove o que dizem, e ganham a dobra tipográfica. */
const PROVAS = {
  /* passo 03, protótipo navegável: duas figuras → par lado a lado */
  2: [
    { src: "/volume/assets/projetos/pcyes/msp-caminhos.webp",
      alt: "Tela inicial do Monte seu PC com os três caminhos disponíveis",
      legenda: "A entrada do módulo pergunta uma coisa só: você já sabe o que quer, quer ajuda ou quer pronto." },
    { src: "/volume/assets/projetos/pcyes/msp-jogos.webp",
      alt: "Etapa do quiz com a grade de jogos para selecionar",
      legenda: "Quem não conhece peça escolhe pelo que joga. A recomendação sai de Valorant e Fortnite, não de soquete e TDP." },
  ],
  /* passo 05, ajusta: uma figura → sangra de borda a borda */
  4: [
    { src: "/volume/assets/projetos/pcyes/ck-v12.webp", ar: "1800/913",
      alt: "Checkout da V1.2 com os quatro meios de pagamento lado a lado em uma única linha",
      legenda: "V1.2: os quatro meios cabem em uma linha e o frete condensa em três opções. O mesmo checkout ficou 60% mais curto." },
  ],
};

/* ------------------------------------------------------------------ hero */

/* O mesmo hero preso e coberto da home e da página de caso, sem capa: método
   não tem arte de capa, e stock aqui seria exatamente a "moldura bonita em
   volta de foto chata" que docs/ANALISE-REFS.md descreve.
 *
 * Quem preenche a tela é o registro dos seis passos no pé: ele é índice e é
 * grafismo ao mesmo tempo, na mono, que é a segunda voz do site. A pessoa sabe
 * o método inteiro antes de rolar uma linha, que é o que quem contrata quer. */
function ProcessoHero() {
  const linha = useMaskLine();
  const capa = useCobertura();
  const passos = PROCESSO();

  return (
    <section className="v2-hero v2-proc-hero v2-grao v2-halo" data-escuro="1" ref={capa.ref}>
      <motion.div className="v2-wrap v2-hero-in" style={capa.style}>
        <motion.div className="v2-hero-topo" {...linha(0)}>
          <p className="v2-hero-papel">{HERO.olho}</p>
          <p className="v2-hero-papel">©26</p>
        </motion.div>

        <div className="v2-proc-hero-baixo">
          <h1 className="v2-hero-h v2-proc-hero-h">
            <span className="v2-hero-linha"><motion.span {...linha(1)}>{HERO.linha1}</motion.span></span>
            <span className="v2-hero-linha"><motion.span {...linha(2)}>{HERO.linha2}</motion.span></span>
          </h1>

          <motion.p className="v2-proc-premissa" {...linha(3)}>{HERO.premissa}</motion.p>

          {/* O registro. Não é navegação: é o sumário do método, e por isso
              não tem link. Quem quer o detalhe rola, que é o gesto que a
              página inteira pede. */}
          <motion.ol className="v2-proc-registro" {...linha(4)}>
            {passos.map((s) => (
              <li className="v2-proc-reg-cel" key={s.n}>
                <span className="v2-proc-reg-n">{`( 00${Number(s.n)} )`}</span>
                <span className="v2-proc-reg-t">{s.t}</span>
              </li>
            ))}
          </motion.ol>
        </div>
      </motion.div>
    </section>
  );
}

/* ----------------------------------------------------------------- ficha */

/* A mesma régua de metadados que legenda o hero da página de caso. Aqui ela
   responde o tamanho do compromisso antes de a pessoa decidir se lê: seis
   passos, três movimentos, quatro casos. */
function Ficha() {
  const rise = useRise();
  const celulas = [
    ["Passos", String(PROCESSO().length).padStart(2, "0")],
    ["Movimentos", String(MOVIMENTOS.length).padStart(2, "0")],
    ["Nos casos", String(casos().length).padStart(2, "0")],
  ];

  return (
    <section className="v2-wrap v2-caso-abre" aria-label="Ficha do método">
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

/* --------------------------------------------------------------- passos */

/* Um passo.
 *
 * Label · título · frase na coluna de leitura, e o número em display na coluna
 * de margem. O número é o grafismo: com quatro dos seis passos sem prova
 * visual, ele é o que dá peso à dobra, e é a forma que a página de caso já
 * usa quando um bloco tem zero figuras. */
function Passo({ s, provas }) {
  const rise = useRise();
  const n = provas ? provas.length : 0;

  return (
    <Dobra
      larga
      classe="v2-proc-passo"
      id={`passo-${s.n}`}
      label={`Passo ${s.n}`}
      topo={
        <>
          <motion.h2 className="v2-caso-ato" {...rise(0)}>{s.t}</motion.h2>
          <motion.p className="v2-proc-frase" {...rise(1)}>{s.p}</motion.p>
        </>
      }
      aside={
        /* O número vai em `content: attr(data-n)` e não como texto do DOM.
           Ele é grafismo: o passo já está escrito no label ("Passo 03"), e em
           13% de tinta o axe reprovava contraste em cima de uma coisa que
           ninguém lê. Conteúdo gerado não é nó de texto, então a regra de
           contraste não se aplica, e continua sem poder ser selecionado ou
           lido em voz alta, que é exatamente o que se quer dele. */
        <motion.p className="v2-proc-n" aria-hidden="true" data-n={s.n} {...rise(0)} />
      }
    >
      {n === 2 ? (
        <div className="v2-figs-2">
          {provas.map((f) => <Figura fig={f} key={f.src} />)}
        </div>
      ) : null}
    </Dobra>
  );
}

/* --------------------------------------------------------------- fecho */

/* A mesma chapa escura que fecha a página de caso no "O que eu aprendi": duas
   páginas internas terminando na mesma superfície, e depois dela a grade clara
   de casos, para o pé não empilhar dois escuros com o rodapé. */
function Fecho() {
  const rise = useRise();
  return (
    <section className="v2-aprendi v2-grao v2-proc-fecho" data-escuro-corpo="1">
      <div className="v2-wrap">
        <div className="v2-caso-duas">
          <Label>No fim</Label>
          <div className="v2-caso-coluna">
            <motion.p className="v2-proc-fecho-p" {...rise(0)}>
              {FECHO[0]} <span className="v2-proc-fecho-forte">{FECHO[1]}</span>
            </motion.p>
            <motion.div className="v2-caso-pills" {...rise(1)}>
              <Pill href={CONTATO().whatsapp.href} escuro externo>Falar comigo</Pill>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- página */

export default function Processo({ ir }) {
  const passos = PROCESSO();

  return (
    <>
      <ProcessoHero />
      <CampoDeVoo variante="processo" classe="v2-corpo-claro v2-corpo-lamina" data-clara="1">
        <Lamina />
        <Ficha />

        <Dobra
          larga
          label="Por que existe"
          topo={<Abertura />}
          aside={<Relance passos={passos} />}
        />

        {MOVIMENTOS.map((m, i) => (
          <React.Fragment key={i}>
            <CapaCapitulo
              n={String(i + 1).padStart(2, "0")}
              de={String(MOVIMENTOS.length).padStart(2, "0")}
              t={PROCESSO_CURTO[i].titulo}
            />
            {m.passos.map((idx) => {
              const s = passos[idx];
              if (!s) return null;
              const provas = PROVAS[idx];
              return (
                <React.Fragment key={s.n}>
                  <Passo s={s} provas={provas} />
                  {/* A figura solitária sangra, e sangrar exige sair do wrap:
                      ela é filha direta do corpo claro, como a `Abertura` da
                      página de caso faz. */}
                  {provas && provas.length === 1 ? (
                    <Figura fig={provas[0]} className="is-sangra" />
                  ) : null}
                </React.Fragment>
              );
            })}
          </React.Fragment>
        ))}

        <Fecho />
        <GradeCasos cromo="Continue" titulo="Os casos" ir={ir} />
      </CampoDeVoo>
    </>
  );
}

function Abertura() {
  const rise = useRise();
  return (
    <>
      {ABERTURA.map((p, i) => (
        <motion.p className="v2-corpo v2-caso-p" key={i} {...rise(i)}>{p}</motion.p>
      ))}
    </>
  );
}

/* O "de relance" da V1, que lá morava no pé da página. Subiu para a margem da
   primeira dobra: quem quer os seis nomes numa olhada tem eles antes de rolar,
   e quem quer o detalhe continua rolando. */
function Relance({ passos }) {
  const rise = useRise();
  return (
    <motion.div className="v2-margem-nota" {...rise(0)}>
      <p className="v2-margem-k">De relance</p>
      <ol className="v2-proc-relance">
        {passos.map((s) => (
          <li key={s.n}><span>{s.n}</span>{s.t}</li>
        ))}
      </ol>
    </motion.div>
  );
}
