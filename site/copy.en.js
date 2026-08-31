/* O espelho INGLÊS de site/copy.js.
 *
 * Regra que vale para o arquivo inteiro, e ela é a razão de ele existir
 * separado: isto NÃO é tradução, é o mesmo texto reescrito como se tivesse
 * nascido em inglês. Pedido do Gabriel, com todas as letras: "muita coisa
 * contextualmente é diferente lá, palavras, gírias e tal".
 *
 * A copy portuguesa é a maior força do portfólio — título que já entrega a
 * descoberta, voz falada, zero jargão de designer. Tradução literal mata
 * exatamente isso, então o padrão a bater é o que `volume/i18n.jsx` já fez
 * bem: "contrariei o briefing" virou "I argued against the brief", e não
 * "I contradicted the briefing".
 *
 * Decisões de vocabulário tomadas aqui, para quem vier depois não desfazer
 * sem saber:
 *
 *   "a parte demorada"    the SLOW part, nunca "the delayed part"
 *   "ajuste"              fixing. Não é "iteration" — isso é jargão de
 *                         designer, e a voz do site não tem nenhum. Não é
 *                         "polish", que sugere acabamento e não trabalho.
 *   "no ar" / "vai ao ar" shipped / goes live, nunca "in the air"
 *   "aproveito o que já    I use what is already there — o "caçar" do PT é
 *   existe"               ação, não caça; "hunt" soa predatório em inglês
 *   Maringá               ganha ", Brazil" na primeira aparição. Cidade que o
 *                         leitor não conhece sem país é ruído, e a aposição
 *                         curta é o que o handoff pede
 *   nomes próprios        Figma, Scrum, UEM, TT&T, Locarmais, Grupo Oderço,
 *                         Double Diamond: ficam. Traduzir nome de empresa ou
 *                         de método é inventar coisa que não existe
 *
 * Só entra aqui o que MUDA. A mescla de `site/i18n.js` é profunda, então
 * caminho de imagem, número e chave de layout não precisam ser repetidos — e,
 * mais importante, não podem ser esquecidos. É a diferença para o
 * `Object.assign` raso do volume/i18n.jsx, onde esquecer um número apagava o
 * número. A conta inteira está no comentário de `mescla`.
 *
 * Regra ao editar, herdada de copy.js: mudou lá, muda aqui.
 */

/* O H1, e é a frase mais importante da página inteira.
 *
 * "leva o dado à decisão" é sobre TRANSPORTE: o dado não morre num painel, ele
 * chega no momento em que alguém decide. "takes data to the decision" carrega
 * o movimento e não sobrevive como manchete — "who takes" sozinho numa linha
 * de display não é frase.
 *
 * "turns data into decisions" é o que um falante nativo diria, e o acento cai
 * onde precisa: a linha em vermelho é o destino, não o verbo. O risco é soar
 * LinkedIn, e ele é real; o que segura é o resto da página, que prova a frase
 * com o funil da /processo e o trimestre de GA4 do PCYES em vez de repetí-la.
 *
 * As rotativas seguem a mesma forma para o caso de voltarem: a home usa `fixa`
 * desde 30/08 e elas ficam como registro do que já esteve no ar. */
export const HERO = {
  linha2: "who turns",
  rotativas: [
    "research into screens",
    "data into decisions",
    "doubt into tests",
    "ideas into live product",
  ],
  fixa: "data into decisions",
  /* Três partes porque a do meio vai destacada. "sessão de usuário" é
     "session recordings" e não "user sessions": o que ele assiste é a
     gravação, e é esse o termo que volume/i18n.jsx já usa no caso do PCYES. */
  sub: ["Before I design anything, I watch ", "session recordings", ". That is where the decisions come from."],
};

/* O asterisco marca a palavra que sai em vermelho, e ele tem que caber num
   token só (Home.jsx separa a frase por espaço). Mesma convenção do PT. */
export const DECLARACAO = [
  {
    olho: "The prototype",
    frase: "I put a clickable screen in people's hands *early*.",
    nota:
      "An opinion about a static image is usually taste. An opinion about " +
      "something the person actually tried to use is usually information.",
  },
  {
    olho: "The fixing",
    frase: "The slow part of my job is the *fixing*.",
    nota: "Fixing, and more fixing, and it is where I would rather spend the time.",
  },
];

export const METODO = {
  lead: "Research and testing go into every project. How much of each depends on the risk of the decision and the time I have.",
  caminhos: [
    {
      olho: "Short path",
      frase: "When the questions have already been answered",
      nota: "Sometimes the problem shows up with the answer attached: a complaint that keeps coming back, a support ticket, usage data already pointing at where it hurts. Then I use what is already there and go straight to the prototype, and the time left over I spend testing and fixing.",
    },
    {
      olho: "Long path",
      frase: "When nobody knows what the problem is yet",
      nota: "This is where I follow the Double Diamond. I spend longer on discovery before drawing a single screen, because when a decision is expensive to undo I would rather spend the time up front than fix it afterwards.",
    },
  ],
  /* "mexe nela" é a mão na tela, não o olho: "gets their hands on it". */
  fecho: "Either way, somebody who will actually use the screen gets their hands on it before I call it done.",
};

/* ------------------------------------------------------------------ /sobre */

export const SOBRE_OI = "hi, I'm Gabriel.";

export const SOBRE_PREMISSA =
  "Product designer in Maringá, Brazil, who learns the problem before " +
  "opening Figma and builds it when the deadline gets tight.";

export const SOBRE_TRABALHO = {
  lead:
    "I like to put a clickable screen in people's hands early, because an " +
    "opinion about a static image is usually taste, and an opinion about " +
    "something the person actually tried to use is usually information.",
  paras: [
    "After that it is fixing, and more fixing. It is the slow part of my job, and it is the part where I do not cut time.",
    "I have never managed to think of design and code as two separate things. When the deadline gets tight, I build it myself.",
  ],
};

/* Esta frase já existe traduzida em volume/i18n.jsx, no campo `fact` do PCYES.
   É a MESMA frase e tem que sair igual nos dois lugares: aqui ela aparece com
   a fonte visível, e frase sem caso é slogan. Mudou uma, muda a outra. */
export const SOBRE_CITACAO = {
  q: "I argued against the brief with session recordings in hand, and the opposite direction is the one that got approved.",
};

export const SOBRE_VIRADA = [
  "I was finishing a law degree at UEM when the pandemic stopped everything. To keep my head busy, I built an online store just to learn how the thing worked.",
  "That is where it turned. It was not the screens I ended up liking: it was the engineering of making a system exist, of taking something from nothing and standing it up.",
  "I dropped law, took a degree in graphic design, went after UX courses and got the Scrum certification so I could keep up with an agile team. I started at TT&T, designed product at Locarmais, and today I run design for a whole group of brands at Grupo Oderço.",
];

export const SOBRE_FORA = [
  "I run, I have been boxing for two years and I play volleyball every week on an amateur team here in Maringá.",
  { pre: "I read manga and manhwa in quantities that are hard to justify, and I keep a channel about anime. If you want to see what I have been watching, ", link: "it's here", pos: "." },
  "I also build apps as a hobby. I tend to only make the ones that solve a problem of my own: there is one that remembers where I parked the car, and another that works out what a freelancer should charge per hour.",
];

export const SOBRE_ADIANTE =
  "I want to work on a bigger product, with people who know more than I do, " +
  "and to be closer to where the decisions get made.";

export const SOBRE_OBRIGADO = "thanks for reading this far.";
