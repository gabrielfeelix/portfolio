/* =====================================================================
   VOLUME, data.jsx
   The "volume": 4 chapters + the método (Processo). Real anchors where
   known (project names, domains, store fact); evocative copy is marked
   [assim] for Gabriel to fill, nothing is fabricated.
   ===================================================================== */
const { useState, useEffect, useRef, useCallback } = React;

/* manga onomatopoeia — SFX shown on chapter entry + beats (jp big, romaji small) */
const SFX_RO = {
  "ドン": "DON", "カチッ": "KACHI", "ゴゴゴ": "GOGOGO", "バーン": "BAAN",
  "シャキーン": "SHAKIIN", "ザッ": "ZAH", "スッ": "SU", "パッ": "PA", "キラッ": "KIRA", "バッ": "BA",
  "ガチャ": "GACHA", "ドガッ": "DOGA",
};
const SYNTH_SFX = ["ザッ", "スッ", "パッ", "キラッ", "バッ"];
function sfxRo(jp) { return SFX_RO[jp] || ""; }
function synthSfx(id) {
  const h = [...String(id)].reduce((a, c) => a + c.charCodeAt(0), 0);
  return SYNTH_SFX[h % SYNTH_SFX.length];
}

/* a clearly-marked placeholder token, renders dim + bracketed */
function PH({ children }) {
  return <span className="ph">[{children}]</span>;
}

/* ---- THE VOLUME · 4 CHAPTERS -------------------------------------- */
const CHAPTERS = [
  {
    id: "rodape", num: "01", cap: "CAP. 01", domain: "MOBILE", cat: "mobile",
    project: "Rodapé",
    descriptor: "App de clube de leitura",
    title: "Rodapé",
    sfx: "ドン",                        // don — impact (landed / published)
    links: { vercel: null, figma: null },   // Gabriel preenche: protótipo (Vercel) + Figma
    premise: "[premissa, a linha que abre o capítulo]",
    role: "[seu papel]",
    surface: "App · iOS & Android",
    year: "2026",
    fact: "Publicado na Play Store",   // real, confirmed
    tldr: {
      papel: "[seu papel]",
      oque: "[o que é, em 1 linha]",
      resultado: "Publicado na Play Store · [+ resultado]",
    },
    problema: {
      t: "[o problema em 3–5 palavras]",
      p: ["[a situação: pra quem, qual a restrição real, o que travava]",
          "[a restrição vira competência, não desculpa]"],
    },
    decisoes: [
      { d: "[escolhi ___]", r: "porque [___]" },
      { d: "[escolhi ___]", r: "porque [___]" },
      { d: "[escolhi ___]", r: "porque [___]" },
    ],
    solucao: {
      t: "[a solução em 3–5 palavras]",
      p: ["[as telas / o produto no ar, o que foi construído, e como a IA entrou no fluxo do protótipo ao publicado]"],
      slots: 3,
    },
    resultado: {
      t: "[o que aconteceu / o que aprendi]",
      p: ["Publicado na Play Store. [reflexão honesta, número real quando houver, aprendizado quando não]"],
    },
  },
  {
    id: "remoctrl", num: "02", cap: "CAP. 02", domain: "DESKTOP", cat: "desktop",
    project: "Remoctrl",
    descriptor: "App nativo de controle remoto",
    title: "Remoctrl",
    sfx: "カチッ",                      // kachi — click (remote control)
    links: { vercel: null, figma: null },
    premise: "[premissa, a linha que abre o capítulo]",
    role: "[seu papel]",
    surface: "App nativo · Desktop",
    year: "2026",
    fact: null,
    tldr: {
      papel: "[seu papel]",
      oque: "[o que é, em 1 linha]",
      resultado: "[resultado]",
    },
    problema: {
      t: "[o problema em 3–5 palavras]",
      p: ["[a situação: pra quem, qual a restrição real, o que travava]"],
    },
    decisoes: [
      { d: "[escolhi ___]", r: "porque [___]" },
      { d: "[escolhi ___]", r: "porque [___]" },
      { d: "[escolhi ___]", r: "porque [___]" },
    ],
    solucao: {
      t: "[a solução em 3–5 palavras]",
      p: ["[o produto desktop, o que foi construído]"],
      slots: 2,
    },
    resultado: {
      t: "[o que aconteceu / o que aprendi]",
      p: ["[reflexão honesta]"],
    },
  },
  {
    id: "traxium", num: "03", cap: "CAP. 03", domain: "SAAS", cat: "saas",
    project: "Traxium",
    descriptor: "Plataforma SaaS",
    title: "Traxium",
    sfx: "ゴゴゴ",                      // gogogo — looming scale (SaaS platform)
    links: { vercel: null, figma: null },
    premise: "Compliance agrologística não devia depender de planilha e boa vontade.",
    role: "Concepção, UX e protótipo navegável — do conceito à versão validável.",
    surface: "Web · SaaS",
    year: "2026",
    fact: "Back-office da transportadora + preview do app do motorista, num protótipo navegável",
    tldr: {
      papel: "Pesquisa, design e protótipo navegável (Next.js + shadcn/ui)",
      oque: "SaaS de compliance agrologística: gestão pra transportadora + app do motorista",
      resultado: "Protótipo pronto pra benchmarking e validação com stakeholders [confirmar iteração]",
    },
    problema: {
      t: "Compliance que mora na planilha",
      p: ["Gestores de transportadora tocavam compliance e benchmarking no braço: planilha solta, risco de multa, retrabalho e nenhuma visão única do que estava em dia.",
          "A restrição real: o valor só aparece quando o escritório (gestor) e a estrada (motorista) falam a mesma língua, em tempo real."],
    },
    decisoes: [
      { d: "Comecei por reunião com stakeholders e entrevistas, não por telas", r: "porque em compliance o que trava não é a interface, é o processo. Desenhei depois de entender o fluxo real." },
      { d: "Back-office web + preview do app do motorista no mesmo protótipo", r: "porque o ganho só fica óbvio quando os dois lados conversam. Testei o fluxo de ponta a ponta antes de prometer." },
      { d: "shadcn/ui + Recharts, com IA dentro do fluxo", r: "porque dado de compliance precisa ser lido num relance, e o protótipo navegável sai em dias pra validar com critério real." },
    ],
    solucao: {
      t: "Protótipo navegável, ponta a ponta",
      p: ["Back-office completo pro gestor (Next.js 16, shadcn/ui, gráficos em Recharts) e preview do app do motorista, num protótipo clicável pra benchmarking — do conceito à versão que dá pra testar de verdade."],
      slots: 3,
    },
    resultado: {
      t: "Da planilha ao protótipo testável",
      p: ["Stakeholder discute o produto tocando nele, não imaginando. O protótipo virou a base pra iterar pra a próxima versão. [confirmar decisão de seguir / números]"],
    },
  },
  {
    id: "pcyes", num: "04", cap: "CAP. 04", domain: "E-COMMERCE", cat: "web",
    project: "PCYES",
    descriptor: "Site · e-commerce",
    title: "PCYES",
    sfx: "バーン",                      // baan — boom (e-commerce)
    links: { vercel: null, figma: null },
    premise: "Vender hardware pra quem entende de hardware exige mais que vitrine.",
    role: "UX/UI e construção do e-commerce (v3), com leitura de comportamento no fluxo.",
    surface: "Site · E-commerce",
    year: "2026",
    fact: "E-commerce de games & hardware do Grupo Oderço (versão 3)",
    tldr: {
      papel: "Design e build do e-commerce + leitura de comportamento (Clarity/Hotjar)",
      oque: "Loja de games, periféricos e setups da PCYES — identidade dark, foco em conversão",
      resultado: "Loja no ar; iterações guiadas por mapa de calor [confirmar métricas]",
    },
    problema: {
      t: "Público exigente, vitrine genérica",
      p: ["O gamer escaneia rápido e desconfia de loja sem alma. A versão anterior não puxava o público nem deixava claro o que a PCYES tem de melhor: setups, lançamentos, periférico bom.",
          "Restrição: segurar a identidade dark forte da marca sem sacrificar leitura nem velocidade de compra."],
    },
    decisoes: [
      { d: "Identidade dark como padrão, não exceção", r: "porque é a cara da PCYES e do público gamer — a loja tinha que parecer parte do setup, não um genérico claro." },
      { d: "Home de banners de jogos + vitrines de setup", r: "porque é o que esse público quer ver primeiro. Testei a hierarquia no protótipo antes de construir." },
      { d: "Mapa de calor + Clarity/Hotjar pra decidir", r: "porque em e-commerce eu não chuto layout: leio pra onde o olho e o clique vão, e itero pra a próxima versão." },
    ],
    solucao: {
      t: "Loja dark, rápida e orientada a dado",
      p: ["E-commerce v3 com home de banners (lançamentos), vitrines de setup e fluxo de compra enxuto. Comportamento monitorado com Clarity/Hotjar pra afiar a decisão a cada ciclo."],
      slots: 3,
    },
    resultado: {
      t: "Decisão por dado, não por achismo",
      p: ["O calor da página virou argumento de design: o que ninguém via, saiu; o que convertia, ganhou peso. [confirmar conversão / resultado de venda]"],
    },
  },
  {
    id: "portfolio", num: "05", cap: "CAP. 05", domain: "WEB · MANIFESTO", cat: "web",
    project: "Portfólio",
    descriptor: "Este volume que você está lendo",
    title: "Portfólio",
    sfx: "シャキーン",                  // shakiin — slash / sharp (this volume)
    links: { vercel: null, figma: null },
    premise: "Um portfólio que se lê como um volume de mangá.",
    role: "Concepção, design e construção",
    surface: "Website · Manifesto",
    year: "2026",
    fact: "Você está lendo o resultado",
    tldr: {
      papel: "Ideia, design e código, do conceito ao ar",
      oque: "Portfólio em forma de mangá: ler bem é o argumento",
      resultado: "Este site. Mangá, tinta e brutalismo a serviço da leitura",
    },
    problema: {
      t: "Provar UX sem dizer que faço UX",
      p: ["Portfólio comum lista telas e cargos. Eu queria que a própria navegação fosse a prova: se eu te guio bem por aqui, já respondi se sei guiar um usuário.",
          "A restrição que escolhi: nada de template genérico. Tinha que ter a minha cara."],
    },
    decisoes: [
      { d: "Formato de volume de mangá", r: "porque guiar bem a leitura É a competência de UX que eu quero provar. A metáfora serve à leitura, nunca atrapalha." },
      { d: "P&B com vermelho só na interação", r: "porque em repouso é tinta no papel; a cor surge quando você age. A interface ganha vida no toque, como uma adaptação." },
      { d: "Brutalismo tipográfico (Anton, painéis, traço grosso)", r: "porque eu amo mangá e brutalismo desde cedo, e os dois pedem hierarquia óbvia e impacto, sem firula." },
    ],
    solucao: {
      t: "Capa, capítulos, processo e posfácio",
      p: ["Um coverflow de projetos, virada de página estilo mangá, motion de tinta e screentone. Caminho rápido pro recrutador, caminho profundo pra quem quer ler o case inteiro.",
          "Construído de verdade, com IA dentro do fluxo: do protótipo navegável ao site publicado."],
      slots: 3,
    },
    resultado: {
      t: "Você está lendo o resultado",
      p: ["A leitura te trouxe até aqui. Se a navegação funcionou, o argumento se provou sozinho."],
    },
  },
  {
    id: "hub-oderco", num: "", cap: "PEÇA", domain: "SAAS · FERRAMENTA", cat: "saas",
    project: "Hub Oderço", descriptor: "Hub multi-marca de marketing", title: "Hub Oderço",
    sfx: "ガチャ", links: { vercel: null, figma: null },
    premise: "Sete marcas, um padrão visual, zero retrabalho.",
    role: "Concepção, UX e construção da ferramenta interna, com IA no fluxo.",
    surface: "Web · Ferramenta interna", year: "2026",
    fact: "Atende 7 marcas do grupo: PCYES, Azux, Odex, Tonante, Quati, Skul, Vinik",
    tldr: {
      papel: "Design e build do hub + geração de conteúdo via IA",
      oque: "Hub de produtos & serviços: gera material promocional e descrição técnica pra 7 marcas",
      resultado: "Padronização e agilidade pras marcas do grupo [confirmar ganho de tempo]",
    },
    problema: {
      t: "Cada marca, um jeito; nenhum padrão",
      p: ["Sete marcas criavam material promocional e descrição de produto na mão. Lento, inconsistente, e cada um reinventava o template do zero.",
          "A restrição: padronizar sem engessar — sete identidades diferentes precisavam caber numa ferramenta só."],
    },
    decisoes: [
      { d: "Comecei resolvendo a dor de quem usa todo dia", r: "porque a ferramenta nasceu interna (PCYES) — entrevistei quem sofria com o processo manual antes de desenhar." },
      { d: "Geração de descrição técnica via IA no fluxo", r: "porque o gargalo era escrever texto de produto repetido. A IA tira o trabalho chato e mantém o padrão." },
      { d: "Um hub, sete temas de marca", r: "porque centralizar o motor e trocar só a pele garante coerência visual sem travar nenhuma marca." },
    ],
    solucao: {
      t: "Um motor, sete marcas no ar",
      p: ["Plataforma que centraliza criação de material promocional, gera descrições via IA e dá ferramentas de e-mail marketing — virou de ferramenta interna da PCYES a hub do grupo inteiro."],
      slots: 3,
    },
    resultado: {
      t: "De ferramenta interna a plataforma do grupo",
      p: ["O que era um atalho da PCYES escalou pra sete marcas. Padronização virou default, não esforço. [confirmar números de uso / tempo economizado]"],
    },
  },
  {
    id: "argel", num: "", cap: "PEÇA", domain: "APP · BOXE", cat: "mobile",
    project: "CT Argel Riboli", descriptor: "App de gestão de CT de boxe", title: "CT Argel Riboli",
    sfx: "ドガッ", links: { vercel: null, figma: null },
    premise: "Gerir um centro de treino não devia tirar tempo do treino.",
    role: "Produto, UX e construção — web de gestão + app do aluno.",
    surface: "App · Web + Mobile", year: "2026",
    fact: "Sistema do Centro de Treinamento de Boxe — Equipe Argel Riboli",
    tldr: {
      papel: "Design e build do monorepo (web de gestão + app mobile)",
      oque: "Gestão de alunos, treinos e rotina do CT, com app pro aluno",
      resultado: "Sistema completo desenhado e construído [confirmar status de uso]",
    },
    problema: {
      t: "CT no caderno e no WhatsApp",
      p: ["Alunos, treinos e pagamentos do CT eram tocados no manual, espalhados entre caderno e conversa. Difícil de escalar, fácil de perder informação.",
          "A restrição: tinha que ser simples o bastante pro professor usar entre uma luva e outra, e leve pro aluno no celular."],
    },
    decisoes: [
      { d: "Entrevistei professor e alunos antes de desenhar", r: "porque quem ia usar tinha rotina específica — testei o protótipo com eles e iterei pra a primeira versão." },
      { d: "Monorepo: web de gestão + app do aluno, código compartilhado", r: "porque as regras de negócio são as mesmas dos dois lados — compartilhar evita divergência e retrabalho." },
      { d: "React Native (Expo) pro app", r: "porque o aluno vive no celular, e Expo me deixa construir e publicar do protótipo ao app real rápido." },
    ],
    solucao: {
      t: "Gestão no escritório, treino no bolso",
      p: ["Plataforma web pro professor administrar alunos, treinos e rotina, e um app mobile pro aluno acompanhar — mesma base de código, duas superfícies."],
      slots: 2,
    },
    resultado: {
      t: "Do caderno ao sistema",
      p: ["O CT ganhou uma fonte única de verdade no lugar de cadernos soltos. [confirmar adoção / publicação na loja]"],
    },
  },
  {
    id: "solar-site", num: "", cap: "PEÇA", domain: "WEBSITE · LP", cat: "web",
    project: "Solar Buy-Side", descriptor: "Landing page de captação", title: "Solar Buy-Side",
    sfx: "パッ", links: { vercel: null, figma: null },
    premise: "Uma landing que vende o método antes do produto.",
    role: "UX/UI e construção da landing (React + Vite).",
    surface: "Website · Landing page", year: "2026",
    fact: "Landing page de alto desempenho, mobile-first",
    tldr: {
      papel: "Design e build da landing (React/TS/Tailwind, Vite)",
      oque: "LP de captação da Solar Buy-Side, focada em conversão",
      resultado: "Landing no ar, mobile-first e rápida [confirmar conversão/leads]",
    },
    problema: {
      t: "Explicar o buy-side em segundos",
      p: ["O visitante chega sem entender a proposta e vai embora rápido. A LP precisava traduzir o valor do buy-side e capturar o lead antes do scroll cansar.",
          "A restrição: performance e clareza num público que decide no celular, em poucos segundos."],
    },
    decisoes: [
      { d: "Estrutura clássica de conversão, sem firula", r: "porque o que vende é clareza: hero com promessa, prova, preço e CTA — testei a ordem antes de fechar." },
      { d: "Mobile-first e Vite pra velocidade", r: "porque LP lenta perde lead. Construí pensando no celular primeiro e na nota de performance." },
      { d: "Um CTA dominante por dobra", r: "porque atenção dividida não converte — cada seção empurra pra a mesma ação." },
    ],
    solucao: {
      t: "Hero, prova, preço, CTA",
      p: ["Landing responsiva com hero de promessa clara, seção de features, tabela de preços e CTAs — construída pra carregar rápido e guiar o visitante até o contato."],
      slots: 2,
    },
    resultado: {
      t: "Clareza que converte",
      p: ["A leitura leva o visitante do 'não entendi' ao 'quero falar' sem atrito. [confirmar leads / taxa de conversão]"],
    },
  },
];
const PROCESSO = [
  { n: "01", t: "Objetivo", p: "Entender o que precisa acontecer, não a lista de telas." },
  { n: "02", t: "Referência", p: "Caçar o que já funciona. Roubar como artista, não como decalque." },
  { n: "03", t: "Protótipo navegável", p: "Do objetivo ao protótipo clicável em dias. Pra tocar, não pra imaginar." },
  { n: "04", t: "Apresenta", p: "Mostro cedo. Critério real na mesa, não opinião solta." },
  { n: "05", t: "Ajusta", p: "Corto o que não serve. A restrição afia a decisão." },
  { n: "06", t: "Entrega / Constrói", p: "Protótipo vira produto no ar. Desenho e construo." },
];

const CONTATO = {
  whatsapp:  { label: "WhatsApp", display: "44 99877-5978", href: "https://wa.me/5544998775978" },
  email:     { label: "E-mail", display: "gab.feelix@gmail.com", href: "mailto:gab.feelix@gmail.com" },
  linkedin:  { label: "LinkedIn", display: "/in/gabrielfeelix", href: "https://www.linkedin.com/in/gabrielfeelix/" },
  instagram: { label: "Instagram", display: "@gaabriel.feelix", href: "https://www.instagram.com/gaabriel.feelix/" },
};
const AUTOR = "Gabriel Felix Barbosa";
const VOL = "VOL. 2026";

/* ---- trajetória de empresas + páginas dedicadas. Atual = Oderço ----
   `story` blocks: real onde sei (projetos), [assim] onde é pessoal. */
const COMPANIES = [
  {
    id: "ttt", name: "TT&T", role: "Onde comecei", period: "Início de carreira", atual: false,
    note: "Primeiros produtos de verdade", logo: "volume/assets/logos/ttt.png",
    blurb: "Meu primeiro contato com produto de verdade. Onde a vontade de desenhar e construir virou ofício.",
    story: [
      { k: "O que fiz", p: "Caí de cabeça nas primeiras telas que foram pro ar. [conte o que você tocou na TT&T]" },
      { k: "A experiência", p: "[como era o time, o ritmo e o que te marcou por lá]" },
      { k: "O que construí", p: "[os produtos ou features que saíram da sua mão]" },
    ],
    related: [],
  },
  {
    id: "locar", name: "Locarmais", role: "Produto de verdade", period: "Produto", atual: false,
    note: "IMMO, Signamais e cia", logo: "volume/assets/logos/locarmais.png",
    blurb: "Onde desenhei produto de verdade e aprendi o handoff de ponta a ponta.",
    story: [
      { k: "O que construí", p: "Website Locarmais, Signamais e IMMO. Da interface ao que sustenta ela por trás." },
      { k: "O handoff", p: "[como era o handoff com o time de dev, o que você padronizou pra fluir]" },
      { k: "O que aprendi", p: "[o maior aprendizado que você levou da Locarmais]" },
    ],
    related: ["locarmais", "signamais", "immo"],
  },
  {
    id: "oderco", name: "Grupo Oderço", role: "Design de um time de marcas", period: "Atual", atual: true,
    note: "PCYES, Odex, Tonante, Vinik, Skul", logo: "volume/assets/logos/oderco.png",
    blurb: "Hoje. Toco o design de um time inteiro de marcas, do e-commerce ao SaaS.",
    story: [
      { k: "O desafio", p: "Manter coerência e ritmo desenhando para várias marcas ao mesmo tempo. [detalhe o desafio do seu jeito]" },
      { k: "As vantagens", p: "[o que desenhar pra várias marcas te dá: range, velocidade, repertório]" },
      { k: "O que gosto", p: "[o que mais te empolga no dia a dia por aqui]" },
    ],
    related: ["pcyes", "odex", "tonante"],
  },
];

/* ---- certificados (Posfácio). Gabriel troca por links/imagens ------ */
const CERTS = [
  { id: "ux-balas",  title: "UX à prova de balas",  issuer: "Certificação",  href: null },
  { id: "circuit",   title: "Design Circuit",       issuer: "Formação UX",   href: null },
  { id: "coderhouse",title: "Coderhouse · UX/UI",   issuer: "Certificação",  href: null },
  { id: "scrum",     title: "Certificação Scrum",   issuer: "Ágil",          href: null },
  { id: "design-g",  title: "Design Gráfico",       issuer: "Graduação",     href: null },
];

/* category filter, narrows the Sumário rail */
const CATS = [
  { key: "todos",     label: "Todos" },
  { key: "saas",      label: "SaaS" },
  { key: "mobile",    label: "Mobile" },
  { key: "desktop",   label: "Desktop" },
  { key: "web",       label: "Web" },
  { key: "ecommerce", label: "E-commerce" },
];

/* ---- THE FULL VOLUME · every project, grouped by category ----------
   The 4 with a `chapterId` open a full chapter (deep case). The rest are
   covers in the rail, protótipo/Figma links to fill (placeholders). */
const PROJECTS = [
  // SAAS  (favorito: Traxium)
  { id: "traxium",     title: "Traxium",       cat: "saas",      domain: "SaaS",                fav: true,  chapterId: "traxium", links: { vercel: null, figma: null } },
  { id: "odex",        title: "Odex",          cat: "saas",      domain: "SaaS",                fav: false, chapterId: null,      links: { vercel: null, figma: null } },
  { id: "solar-saas",  title: "Solar Buy-Side",cat: "saas",      domain: "SaaS · Plataforma",   fav: false, chapterId: null,      links: { vercel: null, figma: null } },
  { id: "signamais",   title: "Signamais",     cat: "saas",      domain: "SaaS",                fav: false, chapterId: null,      links: { vercel: null, figma: null } },
  { id: "immo",        title: "IMMO",          cat: "saas",      domain: "SaaS",                fav: false, chapterId: null,      links: { vercel: null, figma: null } },
  { id: "ponto-admin", title: "Gestão de Ponto",cat: "saas",     domain: "SaaS · Admin",        fav: false, chapterId: null,      links: { vercel: null, figma: null } },
  { id: "hub-oderco",  title: "Hub Oderço",    cat: "saas",      domain: "SaaS · Ferramenta",   fav: false, chapterId: "hub-oderco", links: { vercel: null, figma: null } },
  // MOBILE  (favorito: Rodapé)
  { id: "rodape",      title: "Rodapé",        cat: "mobile",    domain: "App · iOS & Android", fav: true,  chapterId: "rodape",  links: { vercel: null, figma: null } },
  { id: "kitamo-app",  title: "Kitamo",        cat: "mobile",    domain: "App · Mobile",        fav: false, chapterId: null,      links: { vercel: null, figma: null } },
  { id: "argel",       title: "Argel Riboli",  cat: "mobile",    domain: "App · Boxe",          fav: false, chapterId: "argel",   links: { vercel: null, figma: null } },
  { id: "ponto-diar",  title: "Gestão de Ponto",cat: "mobile",   domain: "App · Diaristas",     fav: false, chapterId: null,      links: { vercel: null, figma: null } },
  // DESKTOP  (favorito: Remoctrl)
  { id: "remoctrl",    title: "Remoctrl",      cat: "desktop",   domain: "App nativo · Desktop",fav: true,  chapterId: "remoctrl",links: { vercel: null, figma: null } },
  // WEB  (favorito: Portfólio)
  { id: "portfolio",   title: "Portfólio",     cat: "web",       domain: "Website · Manifesto", fav: true,  chapterId: "portfolio", links: { vercel: null, figma: null } },
  { id: "locarmais",   title: "Locarmais",     cat: "web",       domain: "Website",             fav: false, chapterId: null,      links: { vercel: null, figma: null } },
  { id: "isabella",    title: "Isabella Pires",cat: "web",       domain: "Website · Arquitetura",fav: false, chapterId: null,     links: { vercel: null, figma: null } },
  { id: "solar-site",  title: "Solar Buy-Side",cat: "web",       domain: "Website · LP",        fav: false, chapterId: "solar-site", links: { vercel: null, figma: null } },
  { id: "kitamo-site", title: "Kitamo",        cat: "web",       domain: "Website",             fav: false, chapterId: null,      links: { vercel: null, figma: null } },
  { id: "4yu",         title: "4YU MKT",       cat: "web",       domain: "Website",             fav: false, chapterId: null,      links: { vercel: null, figma: null } },
  // E-COMMERCE  (favorito: PCYES)
  { id: "pcyes",       title: "PCYES",         cat: "ecommerce", domain: "E-commerce",          fav: true,  chapterId: "pcyes",   links: { vercel: null, figma: null } },
  { id: "tonante",     title: "Tonante",       cat: "ecommerce", domain: "E-commerce",          fav: false, chapterId: null,      links: { vercel: null, figma: null } },
  { id: "odex-ec",     title: "Odex",          cat: "ecommerce", domain: "E-commerce",          fav: false, chapterId: null,      links: { vercel: null, figma: null } },
  { id: "dropchina",   title: "DropChina",     cat: "ecommerce", domain: "E-commerce",          fav: false, chapterId: null,      links: { vercel: null, figma: null } },
];

/* tag shown on a project cover: chapters carry their CAP number */
function projTag(p) {
  if (!p.chapterId) return "PEÇA";
  const c = CHAPTERS.find((x) => x.id === p.chapterId);
  return c ? c.cap : "PEÇA";
}
function projDescriptor(p) {
  if (!p.chapterId) return "";
  const c = CHAPTERS.find((x) => x.id === p.chapterId);
  return c ? c.descriptor : "";
}
function projById(id) { return PROJECTS.find((p) => p.id === id); }

/* ---- chapterFor: every project gets a chapter page. Known ones use
   their authored CHAPTERS entry; the rest are synthesized with clearly
   marked placeholders (nothing fabricated). ----------------------- */
function synthChapter(p) {
  return {
    id: p.id, num: "", cap: projTag(p), domain: p.domain, cat: p.cat,
    project: p.title, title: p.title, sfx: synthSfx(p.id), links: p.links || { vercel: null, figma: null },
    premise: "[premissa: a linha que abre o capítulo]",
    role: "[seu papel]", surface: p.domain, year: "2026", fact: null,
    tldr: { papel: "[seu papel]", oque: "[o que é, em 1 linha]", resultado: "[resultado]" },
    problema: { t: "[o problema em 3 a 5 palavras]", p: ["[a situação: pra quem, qual a restrição real, o que travava]"] },
    decisoes: [{ d: "[escolhi ___]", r: "porque [___]" }, { d: "[escolhi ___]", r: "porque [___]" }, { d: "[escolhi ___]", r: "porque [___]" }],
    solucao: { t: "[a solução em 3 a 5 palavras]", p: ["[o que foi construído, e como a IA entrou no fluxo]"], slots: 2 },
    resultado: { t: "[o que aconteceu / o que aprendi]", p: ["[reflexão honesta, número real quando houver]"] },
  };
}
function chapterFor(id) {
  const c = CHAPTERS.find((x) => x.id === id);
  if (c) return c;
  const p = PROJECTS.find((x) => x.id === id);
  return p ? synthChapter(p) : null;
}
function nextProjectId(id) {
  const i = PROJECTS.findIndex((p) => p.id === id);
  if (i < 0) return null;
  return PROJECTS[(i + 1) % PROJECTS.length].id;
}

/* ---- the brand seal (hanko stamp) --------------------------------- */
function Seal({ size = 32, alt = "" }) {
  return <img src="volume/assets/seal.svg" width={size} height={size} alt={alt} draggable="false" />;
}

/* ---- IntersectionObserver reveal: ma pause -> dry cut ------------- */
function useReveal(opts = {}) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { threshold: opts.threshold ?? 0.22, rootMargin: opts.rootMargin ?? "0px 0px -8% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen];
}

/* a revealing beat wrapper, adds .in after a small ma hold */
function Beat({ children, className = "", hold = 90 }) {
  const [ref, seen] = useReveal();
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (seen) { const t = setTimeout(() => setArmed(true), hold); return () => clearTimeout(t); }
  }, [seen, hold]);
  return <div ref={ref} className={`beat ${className} ${armed ? "in" : ""}`}>{children}</div>;
}

/* ---- Brush: a title that inks itself on when scrolled into view -----
   A soft-edged mask wipes left→right like a brush laying ink on paper.
   Crisp at rest (mask fully open). Safety timer + reduced-motion guard
   guarantee the text never stays hidden. */
function Brush({ as = "span", className = "", children, delay = 0, ...rest }) {
  const Tag = as;
  const [ref, seen] = useReveal({ threshold: 0.35 });
  const [inked, setInked] = useState(false);
  useEffect(() => {
    // safety: never leave a title masked-out, even if IO misfires
    const safety = setTimeout(() => setInked(true), 1600);
    return () => clearTimeout(safety);
  }, []);
  useEffect(() => {
    if (seen) { const t = setTimeout(() => setInked(true), delay); return () => clearTimeout(t); }
  }, [seen, delay]);
  return <Tag ref={ref} className={`brush ${inked ? "inked" : ""} ${className}`} {...rest}>{children}</Tag>;
}

/* ---- MorphWord: a complement word that cycles with a gooey ink morph -
   The hero's surface word (SaaS, Apps, Desktop, Web) re-inks itself every
   few seconds with a brush-wipe, keeping Anton crisp (no font morph).
   reduced-motion: holds a single word, no cycling. */
function MorphWord({ words, interval = 2600 }) {
  const [i, setI] = useState(0);
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => { setI((x) => (x + 1) % words.length); }, interval);
    return () => clearInterval(id);
  }, [words, interval, reduced]);
  return (
    <span className="goo-wrap" aria-hidden="true">
      <span className="goo-word" key={i}>{words[i]}</span>
    </span>
  );
}

/* ---- InkBlob: the morphing ink drip (organic-loader homage) --------
   A living blob of ink, black, sharp-cornered world, soft organic body.
   Decorative only; pointer-events off. Used sparingly (≤ 1 per section). */
function InkBlob({ size = 120, className = "", style = {} }) {
  return <span className={`ink-blob ${className}`} aria-hidden="true"
               style={{ width: size, height: size, ...style }}></span>;
}

/* ---- MangaPlate: a static inked manga panel (no upload UI) ----------
   Replaces the fillable image-slot so the layout reads as the real,
   finished thing, screentone + a diagonal sumi shade. `dark` inverts
   the tone for use on inked (chapter-cover) panels. */
function MangaPlate({ dark = false, className = "" }) {
  return <span className={`plate ${dark ? "on-ink" : ""} ${className}`} aria-hidden="true"></span>;
}

/* ---- ProtoLinks: the live prototype + Figma pair -------------------
   The chapter's single primary action is "Ver protótipo" (Vercel, red).
   Figma is the secondary. Renders a clearly-marked placeholder until
   Gabriel drops the real URLs into data. */
function ProtoLinks({ links = {}, onInk }) {
  const { vercel, figma } = links;
  const handle = (e) => { if (onInk) onInk(); };
  return (
    <div className="proto-links">
      {vercel
        ? <a className="btn btn-primary proto-live" href={vercel} target="_blank" rel="noreferrer" onClick={handle}>
            Ver protótipo <span className="ext" aria-hidden="true">↗</span></a>
        : <span className="btn btn-primary proto-live is-ph" role="link" aria-disabled="true">
            Ver protótipo <span className="ph-tag">[Vercel]</span></span>}
      {figma
        ? <a className="btn proto-figma" href={figma} target="_blank" rel="noreferrer">
            Abrir no Figma <span className="ext" aria-hidden="true">↗</span></a>
        : <span className="btn proto-figma is-ph" role="link" aria-disabled="true">
            Abrir no Figma <span className="ph-tag">[Figma]</span></span>}
    </div>
  );
}

/* a company logo: real image when present, the marked placeholder otherwise */
function CompanyLogo({ company, kind = "qsc" }) {
  const [err, setErr] = useState(false);
  if (company.logo && !err) {
    return <img className="co-logo-img" src={company.logo} alt={`Logo ${company.name}`}
                draggable="false" onError={() => setErr(true)} />;
  }
  return (<><span className={`${kind}-logo-mark`}>{company.name}</span>
           <span className={`${kind}-logo-cap`}>[ logo ]</span></>);
}

Object.assign(window, { PH, CHAPTERS, PROJECTS, projTag, projDescriptor, projById, chapterFor, nextProjectId, PROCESSO, CONTATO, AUTOR, VOL, CATS, COMPANIES, CERTS, Seal, useReveal, Beat, Brush, MorphWord, InkBlob, MangaPlate, ProtoLinks, sfxRo, CompanyLogo });
