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
  "ガチャ": "GACHA", "ドガッ": "DOGA", "ピカッ": "PIKA",
  "コチ": "KOCHI", "ガラッ": "GARA", "チャリン": "CHARIN",
  "スゥ": "SUU", "カシャ": "KASHA",
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
    sfx: "ドン",                        // don: impact (landed / published)
    links: { vercel: null, figma: null },   // Gabriel preenche: protótipo (Vercel) + Figma
    premise: "[premissa, a linha que abre o capítulo]",
    role: "[seu papel]",
    surface: "App · Android (Play Store)",
    year: "2026",
    fact: "Publicado na Play Store",   // real, confirmed
    tldr: {
      papel: "Concepção, design e construção (Android), solo",
      oque: "App de clube de leitura: organizar leituras e o que rola no clube",
      resultado: "Publicado na Play Store [confirmar números/uso]",
    },
    problema: {
      t: "Clube de leitura espalhado",
      p: ["Quem toca um clube de leitura vive entre grupo de mensagem, lista solta e memória: o que ler, até quando, quem leu. Falta um lugar só pra isso.",
          "A restrição que abracei: levar do conceito ao app publicado sozinho, do design ao código."],
    },
    decisoes: [
      { d: "Foco no ritual do clube, não em virar mais um app de livros", r: "porque o valor está em organizar a leitura coletiva: desenhei em torno desse ritual. [confirmar features principais]" },
      { d: "Android nativo, construção enxuta", r: "porque com IA no fluxo de construção dava pra ir do protótipo ao publicado mais rápido, sem tirar a mão do design." },
      { d: "Escopo enxuto pra publicar de verdade", r: "porque app publicado prova mais que protótipo bonito: cortei o que não era essencial pra chegar na Play Store." },
    ],
    solucao: {
      t: "Do conceito à Play Store",
      p: ["App de clube de leitura desenhado e construído do zero até a publicação na Play Store. [confirmar telas/funcionalidades principais]"],
      slots: 3,
    },
    resultado: {
      t: "No ar, de verdade",
      p: ["Publicado na Play Store: do conceito ao app real, sozinho. [confirmar números de download / aprendizado]"],
    },
  },
  {
    id: "remoctrl", num: "02", cap: "CAP. 02", domain: "DESKTOP · APP", cat: "desktop",
    project: "Remoctrl",
    descriptor: "Controle universal de smart TV",
    title: "Remoctrl",
    sfx: "カチッ",                      // kachi: click (remote control)
    links: { vercel: null, figma: null },
    premise: "Um controle pra todas as TVs, sem anúncio e sem pedir desculpa.",
    role: "Concepção, UX e construção do app (Tauri + React).",
    surface: "App · Desktop & Mobile (Tauri)", year: "2026",
    fact: "Um codebase (Tauri 2.0) rodando em desktop e mobile; descoberta automática de TV",
    tldr: {
      papel: "Produto, UX e build (Tauri 2.0, React/TS)",
      oque: "Controle universal de smart TV: Roku, Samsung e LG num app só",
      resultado: "Modal flutuante always-on-top com atalho global; multi-marca [confirmar etapa do roadmap]",
    },
    problema: {
      t: "Um controle por marca, e todos ruins",
      p: ["Quem tem TVs de marcas diferentes acaba com um app pra cada, e quase todos cheios de anúncio, paywall hostil e telemetria.",
          "A restrição: unificar Roku, Samsung (Tizen) e LG (webOS), que falam protocolos diferentes, numa interface honesta e instantânea."],
    },
    decisoes: [
      { d: "Tauri 2.0: um codebase pra desktop e mobile", r: "porque manter dois apps nativos é retrabalho. Rust + WebView entrega leve nas duas pontas." },
      { d: "Modal flutuante always-on-top com atalho global (Ctrl+Shift+N)", r: "porque controle remoto é uso de 2 segundos: tem que aparecer por cima de tudo e sumir, sem trocar de janela." },
      { d: "Descoberta automática de TV (SSDP/mDNS) + 'zero ads, zero paywall hostil'", r: "porque a dor é justamente a fricção dos apps oficiais: achei a TV sozinho e tirei tudo que atrapalha." },
    ],
    solucao: {
      t: "Um app, três marcas, dois segundos",
      p: ["Controle universal que descobre a TV na rede e fala Roku ECP, Samsung Tizen (WebSocket) e LG webOS. D-pad, power, volume e atalhos de app, num modal flutuante com hotkey global: sem anúncio, sem telemetria."],
      slots: 2,
    },
    resultado: {
      t: "Honesto por design",
      p: ["A aposta é simples: um controle que respeita o usuário (sem ads, sem coleta) ganha de qualquer app oficial cheio de fricção. [confirmar etapa do roadmap / publicação]"],
    },
  },
  {
    id: "traxium", num: "03", cap: "CAP. 03", domain: "SAAS", cat: "saas",
    project: "Traxium",
    descriptor: "Plataforma SaaS",
    title: "Traxium",
    sfx: "ゴゴゴ",                      // gogogo: looming scale (SaaS platform)
    links: { vercel: null, figma: null },
    premise: "Compliance agrologística de exportação não cabe numa planilha.",
    role: "Concepção, UX e protótipo navegável: do conceito à versão de benchmarking.",
    surface: "Web · SaaS (+ preview app do motorista)",
    year: "2026",
    fact: "18 telas navegáveis, do dashboard ao gateway TRACES NT, + preview do app do motorista",
    tldr: {
      papel: "Pesquisa, arquitetura de informação, UI e protótipo navegável (Next.js 16 + shadcn/ui)",
      oque: "SaaS de compliance pra transportadora de grãos: EUDR, IDTF, TRACES NT e o app do motorista num só lugar",
      resultado: "Protótipo de 18 telas pra benchmarking e validação; roadmap de evolução definido [confirmar etapa atual]",
    },
    problema: {
      t: "Risco regulatório controlado no braço",
      p: ["Transportar grão pra exportação hoje é nadar em regra: EUDR, certificação GMP+, sequenciamento T-3, validação de fazenda contra INPE/MapBiomas/CAR, gateway TRACES NT. Tudo isso costuma viver em planilha solta e cabeça de gente: risco de bloqueio e multa a cada viagem.",
          "A restrição real: o gestor no escritório e o motorista na estrada precisam enxergar o mesmo status, e o sinal de bloqueio nunca pode ser ambíguo."],
    },
    decisoes: [
      { d: "Princípio: clareza acima de estética, sinal regulatório nunca ambíguo", r: "porque é um motor de risco: status crítico (bloqueio, NC, certificação vencida) usa cor, ícone E rótulo ao mesmo tempo, nunca só cor." },
      { d: "Back-office denso + preview do app do motorista no mesmo protótipo", r: "porque o valor só aparece quando os dois lados falam a mesma língua. Modelei viagem bloqueada (motor de regras IDTF, T-3) pra provar o fluxo de ponta a ponta." },
      { d: "Protótipo client-side com mock-data editável", r: "porque dá pra gerar variações e validar com stakeholder em dias: o protótipo navegável vira a mesa de decisão antes de queimar backend." },
    ],
    solucao: {
      t: "O motor de risco, navegável",
      p: ["Dashboard operacional (KPIs, score de conformidade, NCs, risco EUDR), viagens com rastreio e bloqueio, checklists LCI/IDTF, frota e motoristas, polígonos de fazenda EUDR, lotes de exportação, gateway TRACES NT e auditoria: 18 rotas, mais um preview interativo do app do motorista em phone frame.",
          "Design system próprio (verde-azulado + azul, sidebar escura): denso, distintivo, legível num relance."],
      slots: 3,
    },
    resultado: {
      t: "Da planilha ao protótipo que decide",
      p: ["Stakeholder passa a discutir o produto tocando nele. O roadmap de evolução já está mapeado: backend multi-tenant com RLS, mapa Leaflet/EUDR, TRACES NT real e app React Native, com pesquisa de UX com motoristas de Rondonópolis. [confirmar etapa atual]"],
    },
  },
  {
    id: "pcyes", num: "04", cap: "CAP. 04", domain: "E-COMMERCE", cat: "web",
    project: "PCYES",
    descriptor: "Site · e-commerce",
    title: "PCYES",
    sfx: "バーン",                      // baan: boom (e-commerce)
    cover: "volume/assets/projetos/pcyes/cover.webp",
    links: { vercel: "https://ux-oderco.vercel.app/pcyes/pcyes-v2/v3", figma: null },
    premise: "Vender hardware pra quem entende de hardware exige mais que vitrine.",
    role: "UX/UI e construção do e-commerce (v3), com leitura de comportamento no fluxo.",
    surface: "Site · E-commerce",
    year: "2026",
    fact: "E-commerce de games & hardware do Grupo Oderço (versão 3)",
    tldr: {
      papel: "Design e build do e-commerce + leitura de comportamento (Clarity/Hotjar)",
      oque: "Loja de games, periféricos e setups da PCYES: identidade dark, foco em conversão",
      resultado: "Loja no ar; iterações guiadas por mapa de calor [confirmar métricas]",
    },
    problema: {
      t: "Público exigente, vitrine genérica",
      p: ["O gamer escaneia rápido e desconfia de loja sem alma. A versão anterior não puxava o público nem deixava claro o que a PCYES tem de melhor: setups, lançamentos, periférico bom.",
          "Restrição: segurar a identidade dark forte da marca sem sacrificar leitura nem velocidade de compra."],
    },
    decisoes: [
      { d: "Rebranding + home retrabalhada, mobile-first página por página", r: "porque a loja tinha que parecer parte do setup do gamer, não um genérico claro. Refiz a identidade e a home antes de mexer no resto." },
      { d: "'Monte seu PC' guiado + perfil com pontuação e sidebar de premiação", r: "porque montar PC é decisão complexa (quebrei em fluxo amigável) e o público gamer responde a gamificação: pontuação e prêmio na sidebar dão motivo pra voltar." },
      { d: "Checkout em steps com revisão de conteúdo, validado com mapa de calor", r: "porque carrinho abandonado é dinheiro no chão: passos claros, revisão antes de fechar, e Clarity/Hotjar pra ler onde o olho e o clique vão. Testei com funcionários e clientes e iterei." },
    ],
    solucao: {
      t: "Loja dark, gamificada e orientada a dado",
      p: ["E-commerce v3 (SPA React/Vite) com home retrabalhada de banners e vitrines de setup, fluxo 'Monte seu PC' guiado, perfil com pontuação e premiação na sidebar, e checkout em steps com revisão.",
          "Comportamento monitorado com Clarity/Hotjar e validado em teste com funcionários e clientes, pra afiar a decisão a cada ciclo."],
      slots: 3,
      shots: ["volume/assets/projetos/pcyes/cover.webp", "volume/assets/projetos/pcyes/s1.webp", "volume/assets/projetos/pcyes/s2.webp"],
    },
    resultado: {
      t: "Decisão por dado, não por achismo",
      p: ["O calor da página virou argumento de design: o que ninguém via, saiu; o que convertia, ganhou peso. Gamificação deu motivo pra voltar. [confirmar conversão / resultado de venda]"],
    },
  },
  {
    id: "portfolio", num: "05", cap: "CAP. 05", domain: "WEB · MANIFESTO", cat: "web",
    project: "Portfólio",
    descriptor: "Este volume que você está lendo",
    title: "Portfólio",
    sfx: "シャキーン",                  // shakiin: slash / sharp (this volume)
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
          "Construído de verdade: do protótipo navegável ao site publicado."],
      slots: 3,
    },
    resultado: {
      t: "Você está lendo o resultado",
      p: ["A leitura te trouxe até aqui. Se a navegação funcionou, o argumento se provou sozinho."],
    },
  },
  {
    id: "odex", num: "", cap: "PEÇA", domain: "SAAS · SOLAR", cat: "saas",
    project: "Odex", descriptor: "Plataforma do integrador solar (v3 do Hub)", title: "Odex",
    sfx: "ピカッ", cover: "volume/assets/projetos/odex/cover.webp",
    links: { vercel: "https://ux-oderco.vercel.app/odex/plataforma/v3", figma: null },
    premise: "Redesenhar a plataforma do integrador solar com cara de loja, não de sistema.",
    role: "Redesign completo (UX/UI), build do mockup navegável e condução da validação.",
    surface: "Web · SaaS (integrador solar)", year: "2026",
    fact: "Redesign da v3 da plataforma Odex (Hub Oderço): foco comercial e usabilidade pro integrador",
    tldr: {
      papel: "Redesign de ponta a ponta, build do mockup e condução do feedback por sprint",
      oque: "Plataforma onde o integrador solar monta kit, orça e compra, com cara de e-commerce",
      resultado: "Mockup completo validado sprint a sprint, pronto pra parear com backend [confirmar status]",
    },
    problema: {
      t: "Plataforma com cara de sistema, não de loja",
      p: ["O integrador solar precisa montar kit, orçar e comprar rápido, mas a versão anterior parecia um ERP: fluxo travado, sem cara comercial, difícil de comprar no impulso.",
          "E havia as regras que só o time interno sabe (frete em área rural, 'sem cliente' virando 'expirado', e-mail bloqueado por fraude, prêmio de venda direta): sem elas, tela bonita erra no detalhe que importa."],
    },
    decisoes: [
      { d: "Redesign com cara de e-commerce + carrinho fixo na topbar", r: "porque o integrador tem que poder comprar a qualquer momento. Tirei o peso de ERP e dei fluidez de loja, focando na facilidade de uso dele." },
      { d: "'Monte seu kit' amigável, guiado por steps", r: "porque montar kit solar é decisão técnica: quebrei em passos claros pra reduzir erro e abandono." },
      { d: "Walkthrough de validação com a stakeholder antes de codar regra", r: "porque não era descoberta, era validação: alinhei direção visual e as regras de negócio do time. Cada sprint fechou com demo gravada: o ciclo de feedback que a própria cliente sugeriu." },
    ],
    solucao: {
      t: "ERP virou loja guiada",
      p: ["Home comercial, navegação por categoria, carrinho sempre acessível na topbar e um 'Monte seu kit' em steps. Por trás: busca de cliente que pré-popula o orçamento, validade editável com share no WhatsApp, pedido com download de NF (PDF/XML/DANFE), PDP com calculadora, Prêmio Venda Direta e Relatórios.",
          "Mock editável no lugar de backend, pra validar cedo e gerar variações na frente do cliente: backend pareado por iteração, sem suposição escondida no código."],
      slots: 3,
      shots: ["volume/assets/projetos/odex/cover.webp", "volume/assets/projetos/odex/s1.webp", "volume/assets/projetos/odex/s2.webp"],
    },
    resultado: {
      t: "Comprar ficou impulso, não missão",
      p: ["A plataforma deixou de parecer sistema e passou a guiar o integrador da escolha à compra. Roadmap de 6–8 sprints, bloqueios destravados primeiro, dependências de backend explícitas no plano. [confirmar etapa de backend]"],
    },
  },
  {
    id: "ponto", num: "", cap: "PEÇA", domain: "SAAS · GESTÃO DE PONTO", cat: "saas",
    project: "Worklife", descriptor: "Gestão de ponto: SaaS do gestor + app do diarista", title: "Worklife",
    sfx: "コチ", cover: "volume/assets/projetos/ponto/cover.webp",
    links: { vercel: "https://ponto-snowy.vercel.app", figma: null },
    premise: "Cada minuto, contado com precisão: dos dois lados.",
    role: "Produto, UX e build do SaaS de gestão + app, com Supabase.",
    surface: "Web (SaaS) + App", year: "2026",
    fact: "Painel do gestor + app do diarista, mesma base (Supabase)",
    tldr: {
      papel: "Design e build do admin (SaaS) e do app, backend Supabase",
      oque: "Gestão de ponto de diaristas: o gestor coordena a operação, o diarista registra",
      resultado: "Fonte única de horas pros dois lados [confirmar uso]",
    },
    problema: {
      t: "Ponto de diarista no papel e no WhatsApp",
      p: ["Quem coordena diaristas controla horas no caderno e na conversa: o gestor não confia no registro, o diarista não tem comprovação, e ninguém tem uma fonte única.",
          "A restrição: o registro precisa ser confiável o bastante pra fechar pagamento, e simples o bastante pro diarista usar no celular."],
    },
    decisoes: [
      { d: "Dois produtos, uma base: painel do gestor + app do diarista", r: "porque as regras de horas são as mesmas dos dois lados: uma base Supabase única evita divergência e disputa." },
      { d: "'Cada minuto contado com precisão': registro confiável acima de tela bonita", r: "porque ponto é dinheiro: a interface existe pra dar confiança no número, não pra enfeitar." },
      { d: "Login e painel desenhados pra 'coordenar a operação'", r: "porque o gestor entra pra resolver, não pra explorar: abri direto no que importa." },
    ],
    solucao: {
      t: "Gestor coordena, diarista registra",
      p: ["Painel SaaS pro gestor coordenar a operação e fechar horas, e app pro diarista bater ponto: mesma base de dados (Supabase), registro preciso e comprovável dos dois lados."],
      slots: 2,
    },
    resultado: {
      t: "Hora vira dado, não discussão",
      p: ["O 'achismo' das horas vira registro único e confiável. [confirmar adoção / fechamento de pagamento]"],
    },
  },
  {
    id: "dropchina", num: "", cap: "PEÇA", domain: "E-COMMERCE · SHOPIFY", cat: "ecommerce",
    project: "DropChina", descriptor: "Loja própria de vendedor Mercado Livre Platinum", title: "DropChina",
    sfx: "ガラッ", links: { vercel: null, figma: null },
    premise: "Transformar reputação de marketplace em marca própria.",
    role: "Loja Shopify (tema Liquid) + automação de catálogo.",
    surface: "E-commerce · Shopify", year: "2026",
    fact: "Migração de vendedor Mercado Livre Platinum (50k+ vendas) pra canal próprio",
    tldr: {
      papel: "Setup e customização da loja Shopify + scripts de catálogo (Admin API)",
      oque: "Loja própria de suprimentos de informática, saindo da dependência do marketplace",
      resultado: "Canal direto com o cliente, com a confiança do Platinum [confirmar vendas]",
    },
    problema: {
      t: "Refém do marketplace",
      p: ["Vendedor Platinum com 50k+ vendas preso ao Mercado Livre: taxa alta, zero relação direta com o cliente, sem marca própria e em guerra de preço.",
          "E o anti-padrão clássico de quem migra: tema genérico, SKU cadastrado na mão e nenhuma identidade. O cliente não percebe que saiu do marketplace."],
    },
    decisoes: [
      { d: "Canal próprio COM marca, não mais um clone genérico", r: "porque a reputação tinha que virar marca: identidade consistente (azul DropChina, laranja queimado) e badge Mercado Livre Platinum pra transferir a confiança que já existia." },
      { d: "Coleções inteligentes por tag, não categoria na mão", r: "porque 7 coleções auto-populadas escalam o merchandising sem trabalho manual: o anti-padrão de categoria manual trava a operação." },
      { d: "Catálogo automatizado via Admin API (scripts CLI)", r: "porque cadastrar 28 SKUs com descrição estruturada (visão, specs, compatibilidade) na mão é erro e lentidão garantidos." },
    ],
    solucao: {
      t: "Marketplace vira marca",
      p: ["Loja Shopify (tema Tinker customizado) com 7 coleções inteligentes, 28 SKUs migrados e descritos de forma estruturada, header/footer em PT com selo Platinum e paleta de marca: catálogo montado por scripts, sem digitação manual."],
      slots: 3,
    },
    resultado: {
      t: "Da prateleira alugada à loja própria",
      p: ["O vendedor passa a ter relação direta com o cliente e marca reconhecível, sem largar a confiança do Platinum. [confirmar vendas no canal próprio]"],
    },
  },
  {
    id: "isabella", num: "", cap: "PEÇA", domain: "WEBSITE · ARQUITETURA", cat: "web",
    project: "Isabella Pires", descriptor: "Site da arquiteta Isabella Pires", title: "Isabella Pires",
    sfx: "スゥ", cover: "volume/assets/projetos/isabella/cover.webp",
    links: { vercel: "https://isabellapiresarquitetura.com.br/", figma: null },
    premise: "Bons projetos não começam com plantas, começam com escuta.",
    role: "Concepção, UX e build do site institucional.",
    surface: "Website · Institucional", year: "2026",
    fact: "Site da arquiteta Isabella Pires: 'Espaços que refletem quem você realmente é'",
    tldr: {
      papel: "Design e construção do site one-page",
      oque: "Site institucional de arquitetura: residencial, comercial e interiores",
      resultado: "Site no ar que vende o método (escuta), não só a foto [confirmar leads]",
    },
    problema: {
      t: "Site de arquiteta que só mostra foto bonita",
      p: ["Portfólio de arquitetura costuma ser galeria fria: foto linda, zero história. O diferencial dela (escutar antes de desenhar, criar espaço com alma) sumia.",
          "A restrição: traduzir esse diferencial em segundos e transformar visita em contato."],
    },
    decisoes: [
      { d: "Hero vende a proposta, não só a imagem", r: "porque o diferencial é a escuta: 'espaços que refletem quem você é' lidera antes da galeria." },
      { d: "Dois caminhos claros: ver projetos OU entrar em contato", r: "porque cliente de arquitetura decide por afinidade: facilitei os dois gestos sem ruído." },
      { d: "Tom caloroso e sofisticado, mobile-first", r: "porque a marca é acolhimento: o site tinha que soar como ela soa." },
    ],
    solucao: {
      t: "Quem ela é, antes do que ela faz",
      p: ["Site institucional com hero de proposta, serviços (residencial, comercial, interiores), portfólio de projetos, sobre e contato: caloroso, mobile-first, conduzindo o visitante até o contato."],
      slots: 2,
    },
    resultado: {
      t: "Mais que galeria",
      p: ["O site conta a história antes de mostrar a planta: afinidade primeiro, projeto depois. [confirmar leads / contatos]"],
    },
  },
  {
    id: "locarmais", num: "", cap: "PEÇA", domain: "WEBSITE · FIANÇA DIGITAL", cat: "web",
    project: "Locarmais", descriptor: "Site da fiadora digital Locarmais", title: "Locarmais",
    sfx: "パッ", links: { vercel: "https://site.locarmais.com/", figma: null },
    premise: "Um produto, três públicos, uma página: sem virar bagunça.",
    role: "Design e build do site institucional.",
    surface: "Website · Institucional", year: "2026",
    fact: "Site da Locarmais, 'Sua Fiadora Digital': fiança que dispensa fiador e caução",
    tldr: {
      papel: "Design e construção do site institucional",
      oque: "Site da fiança digital que substitui fiador/caução no aluguel",
      resultado: "Produto complexo virou pitch claro pros três públicos [confirmar conversão]",
    },
    problema: {
      t: "Convencer imobiliária, inquilino e proprietário de uma vez",
      p: ["Fiança digital precisa falar com três públicos que têm medos diferentes: a imobiliária quer rapidez e menos fraude, o inquilino quer aprovar sem fiador, o proprietário quer aluguel garantido.",
          "A restrição: dizer isso tudo numa página só, sem o site virar uma colcha de retalhos."],
    },
    decisoes: [
      { d: "Seções dedicadas por público", r: "porque cada um quer ouvir uma coisa: separei a mensagem pra imobiliária, inquilino e proprietário em vez de um discurso genérico." },
      { d: "Prova social no centro (depoimentos reais)", r: "porque fiança é confiança: quem já usou e aprovou rápido vende melhor que qualquer promessa." },
      { d: "Promessa clara no topo", r: "porque 'ganhe tempo, proteja seu cliente e aumente a rentabilidade' resume o valor antes do scroll cansar." },
    ],
    solucao: {
      t: "Três conversas, uma página",
      p: ["Site institucional que explica a fiança digital pra cada público, com prova social forte e CTAs claros: traduzindo um produto financeiro complexo num pitch simples."],
      slots: 2,
    },
    resultado: {
      t: "Complexo virou claro",
      p: ["A fiança digital deixou de exigir explicação e passou a se vender sozinha pros três lados. [confirmar conversão / leads]"],
    },
  },
  {
    id: "web2design", num: "", cap: "PEÇA", domain: "FERRAMENTA · DESIGN", cat: "web",
    project: "Web2Design", descriptor: "Extensão + plugin Figma: web vira camada editável", title: "Web2Design",
    sfx: "カシャ", links: { vercel: null, figma: null },
    premise: "Leia primeiro, escolha depois: a web vira camada no Figma.",
    role: "Concepção, UX e build (extensão Edge + plugin Figma).",
    surface: "Ferramenta · Extensão + Figma", year: "2026",
    fact: "Extensão (Edge) + plugin Figma que converte página web em camadas editáveis",
    tldr: {
      papel: "Design e build da extensão, do relay e do plugin",
      oque: "Captura página/elemento da web e manda como camadas editáveis pro Figma",
      resultado: "Web → Figma sem copiar na mão e sem nuvem de terceiro [confirmar uso]",
    },
    problema: {
      t: "Referência da web presa fora do Figma",
      p: ["Designer vive recriando referência da web na mão dentro do Figma: lento e impreciso. E as ferramentas que fazem isso vivem na nuvem de terceiro, custando privacidade.",
          "A restrição: trazer a página como camada de verdade (cor, tipografia, estrutura), mantendo controle e privacidade."],
    },
    decisoes: [
      { d: "'Leia primeiro, escolha depois': captura → valida → baixa/copia", r: "porque conversão automágica cega gera lixo: dou o controle de capturar página inteira ou só um elemento e conferir antes." },
      { d: "Self-hosted (relay próprio)", r: "porque privacidade importa: o 'Send to Figma' roda no seu relay, sem entregar dado pra nuvem de terceiro." },
      { d: "Múltiplos caminhos de import (relay, upload, clipboard, Transfer ID)", r: "porque fluxo de designer varia: dei mais de uma porta pra mesma entrega." },
    ],
    solucao: {
      t: "DOM vira camada, com geração de estilo",
      p: ["Extensão (Edge, MV3) + plugin Figma com captura de página inteira ou elemento, geração automática de cores e tipografia, histórico de capturas e relay self-hosted pro fluxo 'Send to Figma'."],
      slots: 2,
    },
    resultado: {
      t: "Da página ao Figma, sem retrabalho",
      p: ["Referência da web entra editável no Figma em segundos, com privacidade. [confirmar uso / adoção]"],
    },
  },
  {
    id: "4yu", num: "", cap: "PEÇA", domain: "WEBSITE · LP", cat: "web",
    project: "4YU", descriptor: "Landing page de vendas (4YU MKT)", title: "4YU",
    sfx: "パッ", links: { vercel: null, figma: null },
    premise: "Landing de vendas que vai direto ao ponto.",
    role: "Design e build da landing page.",
    surface: "Website · Landing page", year: "2026",
    fact: "Landing page de vendas da 4YU MKT",
    tldr: {
      papel: "Design e construção da LP",
      oque: "Landing page de vendas da 4YU [confirmar oferta]",
      resultado: "[confirmar conversão / status]",
    },
    problema: {
      t: "Vender em uma página",
      p: ["Landing de vendas vive ou morre na clareza da oferta e na velocidade. [confirmar a oferta e o público da 4YU]"],
    },
    decisoes: [
      { d: "Estrutura de conversão enxuta", r: "porque LP é foco: promessa, prova e CTA, sem desvio. [confirmar]" },
      { d: "[confirmar decisão]", r: "porque [confirmar]" },
    ],
    solucao: {
      t: "Promessa, prova, CTA",
      p: ["Landing page de vendas focada em conversão. [confirmar seções/oferta reais]"],
      slots: 2,
    },
    resultado: {
      t: "[confirmar resultado]",
      p: ["[confirmar conversão / aprendizado]"],
    },
  },
  {
    id: "kitamo-app", num: "", cap: "PEÇA", domain: "SAAS · FINANÇAS", cat: "mobile",
    project: "Kitamo", descriptor: "SaaS de finanças pessoais (mobile)", title: "Kitamo",
    sfx: "チャリン", cover: "volume/assets/projetos/kitamo/cover.webp",
    links: { vercel: "https://kitamo.com.br/", figma: null },
    premise: "O fim das planilhas: seu dinheiro, visível hoje.",
    role: "Produto, UX e build (Laravel 12 + Vue 3/Inertia).",
    surface: "SaaS · Mobile (online)", year: "2026",
    fact: "SaaS de finanças pessoais no ar (kitamo.com.br). MVP, mobile-first",
    tldr: {
      papel: "Design e build full-stack (Laravel + Vue/Inertia/Tailwind)",
      oque: "Finanças pessoais que projetam o mês que vem, não só o extrato do passado",
      resultado: "MVP no ar e online; vira app Android no próximo passo [confirmar uso]",
    },
    problema: {
      t: "“Vou conseguir pagar as contas do mês que vem?”",
      p: ["Controle financeiro vira planilha abandonada ou app de open-banking que ninguém confia. E nenhum deles responde a pergunta que importa: dá pra pagar o mês que vem?",
          "A restrição: dar visibilidade do futuro do caixa com registro manual confiável, sem depender de integração bancária automática."],
    },
    decisoes: [
      { d: "Registro manual confiável, sem open-banking automático", r: "porque o usuário desconfia de conectar o banco: controle manual, mas com projeção, dá clareza sem medo." },
      { d: "Projeção do mês que vem, não só o extrato do passado", r: "porque a dor real é antecipar: mostro compromisso de fatura e contas à frente pra responder 'vou conseguir pagar?'." },
      { d: "Mobile-first, totalmente online, sem cartão pra testar", r: "porque finanças é hábito diário no celular: tirei a fricção de entrada (‘leva 2 minutos, sem cartão de crédito’)." },
    ],
    solucao: {
      t: "Seu mês, visível antes de acontecer",
      p: ["SaaS mobile (Laravel 12 + Vue 3/Inertia) que dá visibilidade de dívida, entendimento de gastos, projeção de fatura e planejamento das contas do mês seguinte: registro manual confiável, totalmente online."],
      slots: 2,
      shots: ["volume/assets/projetos/kitamo/cover.webp", "volume/assets/projetos/kitamo/s1.webp"],
    },
    resultado: {
      t: "Fecha o mês com tranquilidade",
      p: ["Do 'será que dá?' ao 'sei que dá'. MVP no ar; o próximo passo é virar app Android. [confirmar uso / número de usuários]"],
    },
  },
  {
    id: "oderco-checkout", num: "", cap: "PEÇA", domain: "E-COMMERCE · B2B", cat: "ecommerce",
    project: "Checkout Oderço", descriptor: "Checkout B2B por nota fiscal (Grupo Oderço)", title: "Checkout Oderço",
    sfx: "ザッ", cover: "volume/assets/projetos/checkout/cover.webp",
    links: { vercel: "https://ux-oderco.vercel.app/oderco/checkout/v1/checkout?nf=PR", figma: null },
    premise: "Compra B2B de nota fiscal não pode ser um formulário de fé.",
    role: "UX e construção do fluxo de checkout (steps + revisão).",
    surface: "Web · E-commerce B2B", year: "2026",
    fact: "Checkout B2B do Grupo Oderço: compra por nota fiscal, por filial, com crédito RMA",
    tldr: {
      papel: "Design e build do checkout em steps, com revisão",
      oque: "Checkout B2B por nota fiscal: logística, pagamento e revisão por filial",
      resultado: "Fluxo testado com funcionários e clientes [confirmar adoção]",
    },
    problema: {
      t: "Pedido B2B alto, margem de erro zero",
      p: ["Comprar no atacado por nota fiscal envolve filial, frete (CIF/FOB/retirada), crédito (RMA/depósito) e pedidos de milhares de reais. Errar custa caro, e o fluxo precisava dar confiança antes de confirmar.",
          "A restrição: ser amigável sem esconder o que o comprador B2B precisa conferir."],
    },
    decisoes: [
      { d: "Quebrei em steps com revisão final (Carrinho → Pedido → Revisão)", r: "porque pedido B2B grande exige conferência: revisar o conteúdo antes de fechar derruba o erro e a insegurança." },
      { d: "Resumo da filial e progresso do pedido sempre à vista", r: "porque o comprador precisa ver itens, total e onde está no fluxo o tempo todo: nada de checkout às cegas." },
      { d: "Testei com funcionários e clientes reais", r: "porque quem compra por NF tem manhas (frete, crédito RMA) que só aparecem no uso. Iterei com eles antes de fechar." },
    ],
    solucao: {
      t: "Checkout B2B em steps, sem susto",
      p: ["Fluxo por filial e nota fiscal: logística (CIF/FOB/retirada) com opções de frete, uso de crédito (RMA/depósito), forma de pagamento e revisão final: com resumo da filial e progresso do pedido sempre visíveis."],
      slots: 2,
      shots: ["volume/assets/projetos/checkout/cover.webp", "volume/assets/projetos/checkout/s1.webp"],
    },
    resultado: {
      t: "Confiança pra fechar pedido grande",
      p: ["Steps e revisão deram ao comprador B2B o controle que faltava, testado com funcionários e clientes. [confirmar adoção / redução de erro]"],
    },
  },
  {
    id: "hub-oderco", num: "", cap: "PEÇA", domain: "SAAS · FERRAMENTA", cat: "saas",
    project: "Hub Oderço", descriptor: "Hub multi-marca de marketing", title: "Hub Oderço",
    sfx: "ガチャ", cover: "volume/assets/projetos/hub/cover.webp",
    links: { vercel: "https://powderblue-elephant-709864.hostingersite.com/", figma: null },
    premise: "Sete marcas, um padrão visual, zero retrabalho.",
    role: "Concepção, UX e construção da ferramenta interna.",
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
          "A restrição: padronizar sem engessar: sete identidades diferentes precisavam caber numa ferramenta só."],
    },
    decisoes: [
      { d: "Comecei resolvendo a dor de quem usa todo dia", r: "porque a ferramenta nasceu interna (PCYES): entrevistei quem sofria com o processo manual antes de desenhar." },
      { d: "Geração de descrição técnica via IA no fluxo", r: "porque o gargalo era escrever texto de produto repetido. A IA tira o trabalho chato e mantém o padrão." },
      { d: "Um hub, sete temas de marca", r: "porque centralizar o motor e trocar só a pele garante coerência visual sem travar nenhuma marca." },
    ],
    solucao: {
      t: "Um motor, sete marcas no ar",
      p: ["Plataforma que centraliza criação de material promocional, gera descrições via IA e dá ferramentas de e-mail marketing: virou de ferramenta interna da PCYES a hub do grupo inteiro."],
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
    role: "Produto, UX e construção: web de gestão + app do aluno.",
    surface: "App · Web + Mobile", year: "2026",
    fact: "Sistema do CT de Boxe. Equipe Argel Riboli: check-in + recorrência de pagamentos",
    tldr: {
      papel: "Design e build do monorepo (web de gestão + app mobile)",
      oque: "Controle de check-in dos alunos e recorrência de pagamentos do CT, com app pro aluno",
      resultado: "Sistema completo desenhado e construído [confirmar status de uso]",
    },
    problema: {
      t: "Presença e mensalidade no caderno",
      p: ["Check-in dos alunos e mensalidade eram tocados no manual, espalhados entre caderno e WhatsApp. Inadimplência sumia, presença não virava dado, e o professor perdia tempo de tatame com administração.",
          "A restrição: simples o bastante pro professor usar entre uma luva e outra, e leve pro aluno fazer check-in no celular."],
    },
    decisoes: [
      { d: "Entrevistei professor e alunos antes de desenhar", r: "porque quem ia usar tinha rotina específica: testei o protótipo com eles e iterei pra a primeira versão." },
      { d: "Monorepo: web de gestão + app do aluno, código compartilhado", r: "porque as regras de negócio são as mesmas dos dois lados: compartilhar evita divergência e retrabalho." },
      { d: "React Native (Expo) pro app", r: "porque o aluno vive no celular, e Expo me deixa construir e publicar do protótipo ao app real rápido." },
    ],
    solucao: {
      t: "Gestão no escritório, treino no bolso",
      p: ["Plataforma web pro professor administrar alunos, treinos e rotina, e um app mobile pro aluno acompanhar: mesma base de código, duas superfícies."],
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
    premise: "Vender método, não desconto: a saída da guerra de preços.",
    role: "UX/UI e construção da landing (React + Vite).",
    surface: "Website · Landing page", year: "2026",
    fact: "LP do Manual Solar Buy-Side: método pra vendedor de energia solar",
    tldr: {
      papel: "Design e build da landing (React/TS/Tailwind, Vite)",
      oque: "LP do método que ensina o vendedor de solar a usar o 'código do comprador' pra converter",
      resultado: "Landing no ar, mobile-first, focada em capturar quem quer fugir do preço [confirmar leads]",
    },
    problema: {
      t: "Vendedor preso na guerra de preço",
      p: ["O vendedor de energia solar compete no desconto e some na multidão. O Manual Solar Buy-Side ensina a ler o 'código do comprador' pra converter por valor, mas a LP precisava vender esse método em segundos, pra quem chega cético.",
          "A restrição: traduzir um conteúdo educacional denso numa promessa clara, sem virar mais um infoproduto genérico."],
    },
    decisoes: [
      { d: "Promessa antes de feature: 'fuja da guerra de preços'", r: "porque é a dor real do vendedor. A hero vende a transformação, não a lista de aulas." },
      { d: "Estrutura de conversão enxuta, mobile-first (Vite)", r: "porque o público decide no celular e LP lenta perde lead: hero, prova, preço, CTA, na ordem que testei." },
      { d: "Um CTA dominante por dobra", r: "porque atenção dividida não converte: cada seção empurra pra a mesma ação." },
    ],
    solucao: {
      t: "A transformação, em uma página",
      p: ["Landing responsiva que abre com a promessa (sair do preço), mostra o método do 'código do comprador', prova e oferta, com CTAs guiando até a conversão: rápida e mobile-first."],
      slots: 2,
    },
    resultado: {
      t: "Do 'mais um curso' ao 'quero esse método'",
      p: ["A leitura leva o vendedor cético do desconfio ao 'é isso que me falta' sem atrito. [confirmar leads / taxa de conversão]"],
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
  { id: "ux-balas",  title: "UX à prova de balas",  issuer: "Certificação",  href: null, logo: null },
  { id: "circuit",   title: "Design Circuit",       issuer: "Formação UX",   href: null, logo: "volume/assets/certs/circuit.png" },
  { id: "coderhouse",title: "Coderhouse · UX/UI",   issuer: "Certificação",  href: null, logo: "volume/assets/certs/coderhouse.png" },
  { id: "scrum",     title: "Certificação Scrum",   issuer: "Ágil",          href: null, logo: "volume/assets/certs/scrum.png" },
  { id: "design-g",  title: "Design Gráfico",       issuer: "Graduação",     href: null, logo: "volume/assets/certs/uninter.png" },
];

/* ---- logos de marca (buscados dos sites oficiais, chip fundo papel) ----
   Só marcas reais de cliente/grupo — projetos pessoais não têm logo. */
const BRAND_LOGOS = {
  pcyes:     "volume/assets/marcas/pcyes.png",
  odex:      "volume/assets/marcas/odex.png",
  tonante:   "volume/assets/marcas/tonante.png",
  locarmais: "volume/assets/marcas/locarmais.png",
  vinik:     "volume/assets/marcas/vinik.png",
  isabella:  "volume/assets/marcas/isabella.png",
};
function brandLogo(id) { return BRAND_LOGOS[id] || null; }

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
  /* ---- os 5 capítulos primeiro: a leitura abre nos favoritos -------- */
  { id: "rodape",      title: "Rodapé",        cat: "mobile",    domain: "App · iOS & Android", fav: true,  chapterId: "rodape",  links: { vercel: null, figma: null } },
  { id: "remoctrl",    title: "Remoctrl",      cat: "desktop",   domain: "App nativo · Desktop",fav: true,  chapterId: "remoctrl",links: { vercel: null, figma: null } },
  { id: "traxium",     title: "Traxium",       cat: "saas",      domain: "SaaS",                fav: true,  chapterId: "traxium", links: { vercel: null, figma: null } },
  { id: "pcyes",       title: "PCYES",         cat: "ecommerce", domain: "E-commerce",          fav: true,  chapterId: "pcyes",   cover: "volume/assets/projetos/pcyes/cover.webp",     links: { vercel: "https://ux-oderco.vercel.app/pcyes/pcyes-v2/v3", figma: null } },
  { id: "portfolio",   title: "Portfólio",     cat: "web",       domain: "Website · Manifesto", fav: true,  chapterId: "portfolio", links: { vercel: null, figma: null } },
  /* ---- as peças, na sequência da leitura ---------------------------- */
  { id: "odex",        title: "Odex",          cat: "saas",      domain: "SaaS · Solar",        fav: false, chapterId: "odex",    cover: "volume/assets/projetos/odex/cover.webp",      links: { vercel: "https://ux-oderco.vercel.app/odex/plataforma/v3", figma: null } },
  { id: "hub-oderco",  title: "Hub Oderço",    cat: "saas",      domain: "SaaS · Ferramenta",   fav: false, chapterId: "hub-oderco", cover: "volume/assets/projetos/hub/cover.webp", links: { vercel: "https://powderblue-elephant-709864.hostingersite.com/", figma: null } },
  { id: "oderco-checkout", title: "Checkout Oderço", cat: "ecommerce", domain: "E-commerce · B2B", fav: false, chapterId: "oderco-checkout", cover: "volume/assets/projetos/checkout/cover.webp", links: { vercel: "https://ux-oderco.vercel.app/oderco/checkout/v1/checkout?nf=PR", figma: null } },
  { id: "ponto-admin", title: "Worklife",      cat: "saas",      domain: "SaaS + App · Gestão de Ponto", fav: false, chapterId: "ponto", cover: "volume/assets/projetos/ponto/cover.webp", links: { vercel: "https://ponto-snowy.vercel.app", figma: null } },
  { id: "kitamo-app",  title: "Kitamo",        cat: "mobile",    domain: "SaaS · Finanças",     fav: false, chapterId: "kitamo-app", cover: "volume/assets/projetos/kitamo/cover.webp", links: { vercel: "https://kitamo.com.br/", figma: null } },
  { id: "isabella",    title: "Isabella Pires",cat: "web",       domain: "Website · Arquitetura",fav: false, chapterId: "isabella", cover: "volume/assets/projetos/isabella/cover.webp", links: { vercel: "https://isabellapiresarquitetura.com.br/", figma: null } },
  { id: "locarmais",   title: "Locarmais",     cat: "web",       domain: "Website · Fiança",    fav: false, chapterId: "locarmais", links: { vercel: "https://site.locarmais.com/", figma: null } },
  { id: "dropchina",   title: "DropChina",     cat: "ecommerce", domain: "E-commerce · Shopify", fav: false, chapterId: "dropchina", links: { vercel: null, figma: null } },
  { id: "web2design",  title: "Web2Design",    cat: "web",       domain: "Ferramenta · Design", fav: false, chapterId: "web2design", links: { vercel: null, figma: null } },
  { id: "argel",       title: "Argel Riboli",  cat: "mobile",    domain: "App · Boxe",          fav: false, chapterId: "argel",   links: { vercel: null, figma: null } },
  { id: "solar-site",  title: "Solar Buy-Side",cat: "web",       domain: "Website · LP",        fav: false, chapterId: "solar-site", links: { vercel: null, figma: null } },
  { id: "4yu",         title: "4YU MKT",       cat: "web",       domain: "Website · LP",        fav: false, chapterId: "4yu",     links: { vercel: null, figma: null } },
  { id: "signamais",   title: "Signamais",     cat: "saas",      domain: "SaaS · Assinaturas",  fav: false, chapterId: null,      cover: "volume/assets/projetos/signamais/cover.webp", links: { vercel: "https://notify-cleat-99358726.figma.site/", figma: null } },
  { id: "immo",        title: "IMMO",          cat: "saas",      domain: "SaaS",                fav: false, chapterId: null,      links: { vercel: null, figma: null } },
  /* ocultos do rail */
  { id: "tonante",     title: "Tonante",       cat: "ecommerce", domain: "E-commerce",          fav: false, chapterId: null,      hidden: true, links: { vercel: null, figma: null } },
  { id: "odex-ec",     title: "Odex",          cat: "ecommerce", domain: "E-commerce",          fav: false, chapterId: null,      hidden: true, links: { vercel: null, figma: null } },
  /* removidos do rail (duplicatas do mesmo produto): a superfície extra
     vira nota dentro do case. Worklife·App (ponto-diar), Kitamo·Site
     (kitamo-site), Solar Buy-Side SaaS (solar-saas). */
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
    project: p.title, title: p.title, sfx: synthSfx(p.id), cover: p.cover || null, links: p.links || { vercel: null, figma: null },
    premise: "[premissa: a linha que abre o capítulo]",
    role: "[seu papel]", surface: p.domain, year: "2026", fact: null,
    tldr: { papel: "[seu papel]", oque: "[o que é, em 1 linha]", resultado: "[resultado]" },
    problema: { t: "[o problema em 3 a 5 palavras]", p: ["[a situação: pra quem, qual a restrição real, o que travava]"] },
    decisoes: [{ d: "[escolhi ___]", r: "porque [___]" }, { d: "[escolhi ___]", r: "porque [___]" }, { d: "[escolhi ___]", r: "porque [___]" }],
    solucao: { t: "[a solução em 3 a 5 palavras]", p: ["[o que foi construído]"], slots: 2 },
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

Object.assign(window, { PH, CHAPTERS, PROJECTS, projTag, projDescriptor, projById, chapterFor, nextProjectId, PROCESSO, CONTATO, AUTOR, VOL, CATS, COMPANIES, CERTS, Seal, useReveal, Beat, Brush, MorphWord, InkBlob, MangaPlate, ProtoLinks, sfxRo, CompanyLogo, BRAND_LOGOS, brandLogo });
