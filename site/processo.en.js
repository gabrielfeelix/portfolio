/* O espelho INGLÊS dos blocos de /processo.
 *
 * Mesma regra e mesma razão de site/copy.en.js: reescrito para soar nascido em
 * inglês, e não traduzido. A prosa fica aqui e não embutida no JSX porque
 * parágrafo dentro de componente empurra o código para longe e some com a
 * leitura das duas versões como TEXTO — que é o que elas são.
 *
 * O que continua no JSX, com `t()` no ponto de uso: rótulo de eixo de gráfico
 * e texto de SVG. São duas ou três palavras que existem por causa do desenho,
 * e tirá-las de perto do `<text>` esconderia a única coisa que importa nelas,
 * que é caber na largura reservada.
 *
 * Decisões que valem para o arquivo:
 *
 *   "a mesa"          the room. É a sala de reunião e as pessoas nela, nunca
 *                     "the table" — em inglês isso é o móvel
 *   "no ar"           live / ship
 *   "ajuste"          fixing, igual em copy.en.js
 *   Double Diamond    Discover, Define, Develop, Deliver. São os nomes
 *                     canônicos do método; traduzir de volta do português
 *                     inventaria termo onde já existe um
 *   166.267           166,267. O separador de milhar INVERTE, e errar isso
 *                     destrói a credibilidade de um número que é a prova da
 *                     página inteira
 *   2º trimestre      Q2 2026
 */

export const ABRE = {
  olho: "How I work",
  t: "People ask what my process is expecting a one-line answer.",
  p: [
    "Mine takes two.",
    "I have been handed a feature with the problem already solved. The P.O. showed up with the complaint in hand, the FAQ said where it hurt, and the question research would have killed was already dead. I went straight to the prototype and validated it on screen.",
    "And then there was PCYES, where I spent weeks before drawing the first box. A CSD matrix to separate what we knew from what we assumed. Benchmarking so I would not invent a word the market already has. A whole quarter of GA4, 166,267 sessions, event by event. Session recordings, watched end to end.",
    "In both cases I think I chose right. And choosing between the two is a good part of the job, even though it never shows up on the final screen.",
  ],
};

export const FATORES = {
  olho: "What decides how much",
  t: "Three things decide: deadline, team, and what already arrived proven",
  itens: [
    { k: "Deadline",
      p: "Whether it is due Monday or a month from now. It decides how much I have, not where I spend it." },
    { k: "Team",
      p: "Whether I share the work with someone or run it alone. Two designers change what fits into the same week." },
    { k: "What already arrived proven",
      p: "A complaint that keeps coming back, a ticket in the FAQ, usage data. When the problem arrives already proven, proving it again only costs time." },
  ],
};

export const RISCO = {
  olho: "Where I spend it",
  t: "I spend more time on research when getting it wrong is expensive.",
  p: [
    "A decision that is cheap to undo, I ship and then watch. Swapping the order of two blocks on a low-traffic page is answered better by a session recording than by a study.",
    "When the decision is expensive to undo, the kind that rewrites a catalogue or touches payment, I dig up more before closing it, and I ask for the time to do that.",
  ],
};

export const CURTO = {
  olho: "Short path",
  t: "When the questions have already been answered",
  paradas: [
    { n: "01", t: "Data", p: "What already exists in usage, complaints and tickets." },
    { n: "02", t: "Hypothesis", p: "One sentence you can prove wrong." },
    { n: "03", t: "Prototype", p: "Clickable, so the room can touch it instead of imagining it." },
    { n: "04", t: "Validation", p: "Somebody who will use it gets their hands on it before I close it." },
  ],
  p: "I skip steps here on purpose, not out of hurry. If the complaint already came in more than once and the data already shows where it hurts, proving it again tells me nothing I do not already know, and the time goes further on the prototype and the fixing.",
};

export const LONGO = {
  olho: "Long path",
  t: "When nobody knows what the problem is yet",
  p: "This is where I follow the Double Diamond, and it is what I did at PCYES and at Locarmais.",
  fases: [
    { k: "Discover", m: ["CSD matrix", "Benchmarking", "Shadowing the real routine", "Analytics and recordings"] },
    { k: "Define",   m: ["Framing the problem", "Hypothesis", "An objective, not a screen list"] },
    { k: "Develop",  m: ["Navigable prototype", "Show it early", "Criteria in the room"] },
    { k: "Deliver",  m: ["Usability testing", "Fix", "Ship"] },
  ],
  casos: [
    "At Locarmais I sat with the finance team and followed the daily reconciliation before drawing anything. The benchmarking there was about vocabulary: established reconciliation platforms, so I would not invent a new term where one already exists.",
    "At PCYES the qualitative and the quantitative came in separately on purpose. Clarity answered what people did, heatmaps and recordings. GA4 answered where they stopped.",
  ],
};

export const NUNCA = {
  olho: "What never gets cut",
  t: "Somebody who will use it gets their hands on the screen before I close it.",
  p: [
    "On the short path that can be one person, fifteen minutes, prototype in hand. On the long one it is usability testing with a script.",
    "The size changes with the project, but it never gets to zero.",
  ],
};

export const APOSTA = {
  olho: "The time I got the maths wrong",
  t: "I had just fixed the checkout. I was sure that was where the hole was.",
  p: [
    "I opened the whole quarter in GA4 and the data said something else. For every 62 people who opened a product page, one added to cart. And whoever reached the checkout bought at 25%, one in four.",
    "The screen I had just fixed was never the main bottleneck, neither before the fix nor after it.",
    "I lost the bet, and that correction is what redesigned the whole V2.",
  ],
  dado: [
    { l: "Saw a product" },
    { l: "Added to cart" },
    { l: "Bought" },
  ],
  fonte: "Google Analytics 4 · Q2 2026 · 166,267 sessions",
  fecho: "The process I chose was right. It was just pointed at the wrong place.",
};
