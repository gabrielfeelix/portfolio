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

/* render a string, wrapping any [bracketed] spans as marked placeholders.
   Mora aqui, junto do PH que ele usa, e nao no Capitulo: quem chama sao
   Capa.jsx e RevealMask.jsx, que desenham a HOME. Enquanto ele morava no
   Capitulo.jsx, tirar aquele arquivo do carregamento inicial derrubava a
   home inteira com `renderPH is not defined`. */
function renderPH(str) {
  if (typeof str !== "string") return str;
  const parts = str.split(/(\[[^\]]*\])/g).filter(Boolean);
  return parts.map((p, i) =>
    /^\[[^\]]*\]$/.test(p) ? <PH key={i}>{p.slice(1, -1)}</PH> : <span key={i}>{p}</span>
  );
}

/* ---- THE VOLUME · 4 CHAPTERS -------------------------------------- */
/* ---- O VOLUME · 5 CAPÍTULOS ---------------------------------------
   Conteúdo redacional de volume-conteudo-dos-capitulos.md. Os projetos que
   não são capítulo vivem só no índice "Outras peças" e não têm case. ---- */
const CHAPTERS = [
  {
    id: "pcyes", num: "01", cap: "CAP. 01", domain: "E-COMMERCE", cat: "ecommerce",
    /* o capítulo principal do volume: o mais longo, o mais medido e o
       único com dado de comportamento. O sumário marca isso, senão o
       leitor precisa gastar 16 beats para descobrir sozinho. */
    principal: true,
    project: "PCYES V2", descriptor: "Redesign do e-commerce", title: "PCYES V2",
    sfx: "バーン",                      // baan: boom (e-commerce)
    capa: { logo: "volume/assets/marcas/branco/pcyes.png", bg: "#B00000", accent: "#FF0000" },   /* capa de marca */
    cover: "volume/assets/projetos/pcyes/cover.webp",
    coverTall: "volume/assets/projetos/pcyes/cover-tall.webp",   /* 4:5, a proporção do painel do hero */
    links: { vercel: "https://pcyes-v3-codigo-fonte.vercel.app/", figma: "https://www.figma.com/design/A0Zg3I15KcYI82zZocmyjD/PCYES-V2--DS-?node-id=0-1&t=dk2knegACkkGkGEI-1" },
    premise: "Uma vitrine que ficou bonita e ficou lenta de comprar.",
    role: "UX/UI Designer, responsável pelo projeto",
    surface: "E-commerce · Magento",
    periodo: "6 meses · publicação prevista para outubro/2026",
    year: "2026",
    fact: "Contrariei o briefing com gravação de sessão na mão, e a direção oposta foi a aprovada",
    /* Quanto o capítulo cobra, em minutos, e é medido, não estimado: 3.593
       palavras no caminho padrão a 200 palavras por minuto. É o que o
       `Atalho` declara ao leitor antes de ele escolher o caminho, e é a
       chave que faz o atalho existir: capítulo sem `minutos` não ganha
       atalho, porque um atalho de 3 minutos num capítulo de 3 minutos
       seria mentira. Se o capítulo crescer, meça de novo e atualize. */
    minutos: 18,
    tldr: {
      papel: "UX/UI Designer, responsável pelo projeto",
      oque: "Loja de hardware em Magento, redesenhada da home ao checkout.",
      resultado: "Contrariei o briefing com gravação de sessão na mão, e a direção oposta foi a aprovada",
    },
    /* ---- as figuras do capítulo -------------------------------------
       Cada prova é referenciada por chave no bloco que ela sustenta, e a
       numeração sai da ordem de leitura (figOrder, em Capitulo.jsx). Sem
       `src`, a moldura entra marcada como print pendente: é honesto e não
       abre buraco no layout. */
    figuras: {
      abertura: { src: "volume/assets/projetos/pcyes/v1-home.webp", ar: "45/19",
        alt: "Home da V1 abrindo em campanha de marca, com o primeiro produto abaixo da dobra",
        legenda: "A V1 na primeira dobra: a campanha ocupa a tela inteira e o primeiro produto só aparece depois de rolar." },
      checkout: { src: "volume/assets/projetos/pcyes/s4.webp",
        alt: "Checkout da V2 com Pix, cartão, boleto e carteiras visíveis antes de qualquer rolagem",
        legenda: "O checkout da V2 abre no método de pagamento. A pessoa sabe como pode pagar antes de decidir se continua." },
      vitrine: { src: "volume/assets/projetos/pcyes/s2.webp",
        alt: "Vitrine da V2 com filtros à esquerda e botão de comprar no card do produto",
        legenda: "Na vitrine, comprar deixou de exigir a página do produto: o botão vive no card, junto do preço e da avaliação." },
      preco: { src: "volume/assets/projetos/pcyes/s3.webp",
        alt: "Página de produto da V2 com a coluna de preço fixa à direita",
        legenda: "Na página do produto, o preço e a compra ficam fixos à direita. A decisão não depende de voltar ao topo." },
      home: { src: "volume/assets/projetos/pcyes/s1.webp",
        alt: "Home da V2 com carrossel de produtos e blocos de promoção",
        legenda: "A home passou a abrir em produto. Os blocos institucionais continuam, depois do primeiro carrossel de compra." },
      quickview: { src: "volume/assets/projetos/pcyes/quickview.webp",
        alt: "Visualização rápida aberta sobre a listagem, com galeria, ficha resumida e botão de comprar",
        legenda: "Visualização rápida na listagem: avaliar o produto, ampliar a foto e comprar sem trocar de página." },
      sku: { grau: "apoio",  /* o gerador de HTML e ferramenta interna, do mesmo ramo da esteira */ src: "volume/assets/projetos/pcyes/sku-editor.webp",
        alt: "Ferramenta interna com o formulário do produto à esquerda e o HTML gerado à direita",
        legenda: "A ferramenta interna: o formulário do SKU de um lado, o HTML pronto e formatado do outro, na hora." },
      skuFila: { grau: "apoio",  /* a esteira e ferramenta de bastidor, nao a loja que o cliente ve */ src: "volume/assets/projetos/pcyes/sku-fila.webp",
        alt: "Esteira de produção com a fila de SKUs e as cinco etapas de cada produto",
        legenda: "A esteira: cada SKU percorre CRM, SEO, gerador de HTML, Page Builder e publicação, e o time enxerga em que etapa cada produto está." },
      contraste: { src: "volume/assets/projetos/pcyes/contraste.webp",
        alt: "Home da V1 passando de uma seção escura para uma dobra branca no meio da rolagem",
        legenda: "A V1 alternava dobras escuras e uma dobra branca inteira no meio do caminho. De madrugada, esse salto de brilho é a parte que cansa a leitura." },
      libras: { grau: "apoio",  /* o VLibras e um widget no canto, nao uma dobra */ src: "volume/assets/projetos/pcyes/libras.webp", ar: "8/5",
        alt: "Tradutor VLibras aberto sobre a home da V2, com o avatar em Libras ao lado do banner",
        legenda: "O tradutor de Libras entra pelo ícone de acessibilidade do header e traduz a página em uso. A V1 não tinha: quem tem Libras como primeira língua lia um site em segunda língua." },
      prevenda: { /* unica prova do modulo, mora na coluna ao lado do texto; o print do contador saiu (era componente, nao tela, e a pagina inteira ja mostra a contagem) */ src: "volume/assets/projetos/pcyes/prevenda.webp",
        alt: "Página de produto em pré-venda com barra de reservas, prazo de entrega e preço de reserva",
        legenda: "A pré-venda mostra quantas reservas já foram feitas, quantas restam e quando o produto chega." },
      sidecart: { grau: "plena",  /* o carrinho lateral E o argumento do modulo */ src: "volume/assets/projetos/pcyes/sidecart.webp",
        alt: "Carrinho lateral aberto sobre a página do produto, com barra de brinde e pontos do pedido",
        legenda: "O carrinho lateral abre sobre a página. Adicionar um item deixou de tirar a pessoa de onde ela estava." },
      points: { src: "volume/assets/projetos/pcyes/points.webp",
        alt: "Área do PCYES Points com escada de raridade e saldo de pontos",
        legenda: "PCYES Points: saldo, escada de níveis e o quanto falta para o próximo, sem letra miúda escondida." },
      mspCaminhos: { src: "volume/assets/projetos/pcyes/msp-caminhos.webp",
        alt: "Tela inicial do Monte seu PC com os três caminhos disponíveis",
        legenda: "A entrada do módulo pergunta uma coisa só: você já sabe o que quer, quer ajuda ou quer pronto." },
      mspJogos: { src: "volume/assets/projetos/pcyes/msp-jogos.webp",
        alt: "Etapa do quiz com a grade de jogos para selecionar",
        legenda: "Quem não conhece peça escolhe pelo que joga. A recomendação sai de Valorant e Fortnite, não de soquete e TDP." },
      mspProntas: { src: "volume/assets/projetos/pcyes/msp-prontas.webp",
        alt: "Grade de builds prontas separadas por uso, com preço e desconto",
        legenda: "As builds prontas viram produto de vitrine: nome, uso, preço fechado e compra em um clique." },
      ckCarregado: { src: "volume/assets/projetos/pcyes/ck-carregado.webp", ar: "120/89",
        alt: "Checkout da V1 com os quatro meios de pagamento empilhados em lista vertical",
        legenda: "V1, tudo carregado: cada meio de pagamento ocupa uma linha inteira e o bloco desce por metade da tela." },
      ckLento: { src: "volume/assets/projetos/pcyes/ck-lento.webp", ar: "120/89",
        alt: "A mesma tela com apenas Boleto e Pix carregados, e um vão vazio no lugar dos outros meios",
        legenda: "A mesma tela quando os meios de pagamento não chegam: sobram dois, e o vão que fica é maior que o conteúdo. Quem paga com cartão não vê como pagar." },
      ckV12: { src: "volume/assets/projetos/pcyes/ck-v12.webp", ar: "1800/913",
        alt: "Checkout da V1.2 com os quatro meios de pagamento lado a lado em uma única linha",
        legenda: "V1.2: os quatro meios cabem em uma linha e o frete condensa em três opções. O mesmo checkout ficou 60% mais curto." },
      popup: { grau: "apoio",  /* o pop-up e um comportamento de entrada, nao uma dobra da loja */ ar: "16/9",
        alt: "Pop-up de captação da V2 aparecendo depois da pessoa rolar parte da página",
        legenda: "V2: o pop-up só aparece depois de 15% de rolagem. Quem acabou de chegar vê a loja primeiro; quem já demonstrou interesse é que recebe a oferta." },
      buscaMouse: { src: "volume/assets/projetos/pcyes/busca-mouse.webp", ar: "1600/796",
        alt: "Busca da V1 por mouse devolvendo mousepad nos primeiros resultados",
        legenda: "V1, busca por \u201cmouse\u201d: o primeiro resultado é mousepad. O motor rankeava por texto parecido, não pelo que a loja precisava vender." },
      buscaMause: { src: "volume/assets/projetos/pcyes/busca-mause.webp", ar: "1600/786",
        alt: "Busca da V1 por mause devolvendo tela sem nenhum resultado",
        legenda: "V1, busca por \u201cmause\u201d: nenhum resultado. Uma letra trocada e a loja inteira desaparece." },
      buscaV2: { src: "volume/assets/projetos/pcyes/busca-v2.webp", ar: "1600/613",
        alt: "Busca da V2 sugerindo produtos e termos mais buscados antes de digitar",
        legenda: "V2: a busca abre com os produtos e os termos mais procurados. Quem não lembra o nome escolhe sem digitar." },
      ckMobile: { src: "volume/assets/projetos/pcyes/ck-mobile.webp", ar: "25/61",
        alt: "Checkout mobile da V1 e da V1.2 lado a lado, com uma linha marcando onde a V1.2 termina",
        legenda: "As duas na mesma escala: a V1.2 termina onde a V1 ainda tem um quarto de tela pela frente." },
      ckV12Pix: { src: "volume/assets/projetos/pcyes/ck-v12-pix.webp", ar: "225/137",
        alt: "Checkout da V1.2 com Pix selecionado, abrindo o passo a passo de aprovação imediata",
        legenda: "Escolher Pix abre o que acontece depois de finalizar. A dúvida que fazia a pessoa sair do checkout virou resposta na própria tela." },
      mspBuilder: { src: "volume/assets/projetos/pcyes/msp-builder.webp",
        alt: "Montagem passo a passo com as oito etapas de componentes e o resumo da configuração",
        legenda: "Quem monta do zero anda em oito etapas com compatibilidade checada e o total sempre à vista." },
    },
    /* ---- a cena que abre o capítulo ---------------------------------
       O case começava no problema já formulado. Faltava o momento em que
       ele chega na mesa: o que a empresa vende, o que pediram e o que eu
       ainda não sabia. */
    abertura: {
      k: "A cena",
      t: "Um site que a empresa gostava e o cliente não usava",
      p: ["A PCYES vende hardware e periférico para quem monta o próprio PC. É um público que chega sabendo o modelo que quer, compara ficha técnica com a concorrência e decide em minutos. O site que existia não era feito para esse comportamento: abria em campanha de marca, com vídeo e animação ocupando a primeira dobra inteira, e o produto começava abaixo da linha da tela.",
          "O pedido que chegou até mim era estético. Deixar mais minimalista, mais limpo, mais parecido com marca grande. Topei olhar, mas não topei desenhar antes de entender por que uma loja bonita estava vendendo menos do que podia. A primeira semana foi assistindo gente tentar comprar."],
      fig: "abertura",
      tinta: "cluster",
    },
    problema: {
      t: "Bonita de ver, difícil de comprar",
      p: ["A primeira versão do site foi construída em cima da marca, com vídeo, animação e muita presença institucional. Ficou bonita e ficou lenta de comprar.",
          "As pessoas não chegavam ao checkout. Para comprar qualquer coisa era obrigatório abrir a página do produto. Vitrine, home e categoria não deixavam adicionar ao carrinho direto. Cada compra custava cliques que não precisavam existir.",
          "E quem chegava ao checkout não finalizava. A etapa final concentrava o abandono, e não estava claro por quê.",
          "Somando, o site cobrava três pedágios de quem só queria comprar um mouse: achar o produto no meio da campanha, abrir a página dele para conseguir colocar no carrinho e descobrir no escuro se dava para pagar do jeito que a pessoa queria. Cada um desses pedágios tem o seu jeito de sumir com o cliente."],
    },
    /* o tamanho do problema, em número. Print de dashboard vira foto de
       ferramenta; aqui o dado é desenhado e carrega a fonte junto. */
    painel: {
      k: "O tamanho do buraco",
      t: "Entrava gente. Comprar, quase ninguém",
      fonte: "GA4 e notas fiscais · 2º trimestre de 2026 · Microsoft Clarity, amostra de 3 dias",
      acesos: 2,
      milLegenda: "Cada ponto é uma pessoa que entrou na loja. Os dois acesos são as que compraram: 0,16% de conversão em um trimestre inteiro.",
      numeros: [
        { v: 166267, l: "sessões no trimestre" },
        { v: 273, l: "pedidos faturados" },
        { v: 0.16, d: 2, s: "%", l: "taxa de conversão" },
      ],
      barras: [
        { l: "Rolagem média da página", v: 25.5, d: 1, n: "Três quartos da página nunca eram vistos." },
        { l: "Sessões com erro de script", v: 23.5, d: 1, n: "Uma em cada quatro esbarrava em falha técnica." },
        { l: "Sessões identificadas como robô", v: 41, n: "O que sobrava de gente real era ainda menor." },
      ],
      nota: "Os números de comportamento vêm de uma amostra curta do Clarity, e é assim que eles entram aqui, como indício que orientou onde olhar, não como medida definitiva. O que sustenta a decisão é a soma deles com as gravações e com a conversão do trimestre.",
    },
    /* ---- O FUNIL E O GESTO ----------------------------------------
       O painel acima dá o tamanho do buraco; estes dois dizem onde ele
       estava. O funil vem da lista de páginas mais visitadas do Clarity,
       e o gesto vem do mapa de calor da mesma amostra. Nenhum dos dois
       entra como print de dashboard: o dado é redesenhado, porque foto de
       ferramenta é foto de ferramenta, não argumento. */
    funil: {
      k: "Onde as pessoas paravam",
      t: "De 63 que entram, uma chega ao checkout",
      fonte: "Microsoft Clarity · páginas mais visitadas · amostra de 3 dias",
      etapas: [
        { l: "Home", v: 1705, n: "A porta de entrada." },
        { l: "Busca e vitrine", v: 1541, n: "Quase todo mundo procura alguma coisa." },
        { l: "Carrinho", v: 267, n: "Aqui já sobrou uma em cada seis." },
        { l: "Finalizar compra", v: 27, n: "E aqui, uma em cada 63 que entraram." },
      ],
      marca: { nosso: 0.16, mercado: 1.1, piso: 0.8, teto: 1.5, l: "Taxa de conversão",
        n: "Eletrônicos convertem 1,1% em média no Brasil, com faixa saudável entre 0,8% e 1,5%. A loja estava a um sétimo do piso da própria categoria.",
        fonte: "Benchmark Prax 2025, mais de mil e-commerces brasileiros" },
      nota: "A amostra do Clarity é curta e serve para dizer onde olhar, não para medir. O que fecha a conta é a conversão do trimestre inteiro, que veio do GA4 e das notas fiscais.",
    },
    /* o mapa de calor respondeu o que o funil não responde: não onde as
       pessoas paravam, mas o que faziam enquanto estavam ali */
    gesto: {
      k: "O que as pessoas clicavam",
      t: "O clique mais comum do site era fechar o pop-up",
      fonte: "Microsoft Clarity · mapa de calor · 497 exibições, 798 cliques",
      itens: [
        { el: "Fechar o pop-up", sel: "I._close-icon", v: 124, p: 15.54, tipo: "ruido" },
        { el: "Campo de busca", sel: "#search", v: 76, p: 9.52, tipo: "busca" },
        { el: "Fechar o pop-up (área)", sel: "DIV._close", v: 58, p: 7.27, tipo: "ruido" },
        { el: "Próximo do carrossel", sel: "Next", v: 22, p: 2.76, tipo: "neutro" },
        { el: "Comprar", sel: "BUTTON.action.primary", v: 5, p: 0.63, tipo: "compra" },
      ],
      leitura: "Somados, os dois botões de fechar dão 182 cliques, 22,8% de tudo que se clicava na página. Comprar tinha 5. O site pedia atenção antes de oferecer qualquer coisa, e a pessoa gastava o primeiro gesto se livrando dele. Foi o que tirou o pop-up da chegada na V2, e o que mandou olhar para a busca. Se o segundo gesto mais comum é procurar e a compra não acontece, o problema está no que a busca devolve.",
    },
    investigacao: {
      t: "Gravação de sessão no lugar de opinião",
      p: ["Gravações no Microsoft Clarity, métricas de navegação e tempo de permanência, e conversa direta com usuários sobre onde travavam.",
          "Assisti as gravações inteiras, sem pular, anotando o ponto exato em que a pessoa parava de avançar. É um trabalho lento e é ele que sustenta o resto. Sem isso, a reunião seguinte seria a minha opinião contra a opinião da diretoria, e a minha perde.",
          "A diretoria queria uma direção minimalista, com foco em valor de marca. O comportamento no site apontava para o outro lado. Levei as gravações para a reunião e propus um terceiro caminho, com a marca presente em momentos escolhidos e o caminho de compra como eixo do site. O modelo final foi aprovado."],
      achados: [
        "As formas de pagamento não apareciam na primeira dobra do checkout. O usuário só descobria como podia pagar depois de rolar a página, e muita gente saía antes disso.",
        "Havia bugs no módulo de pagamento usado no Magento. A falha aparecia nas gravações antes de aparecer em qualquer relatório.",
        "O caminho até a compra era longo demais para o tipo de produto vendido.",
        "Fora das gravações, o catálogo tinha buracos próprios. Lançamento sem reserva, configurador que só servia quem já sabia a peça, carrinho que levava a pessoa para fora da página.",
      ],
    },
    /* ---- A BUSCA -------------------------------------------------------
       O achado que mudou o escopo do projeto. Não é bug de motor de busca,
       é decisão sobre quem tem direito de comprar: a V1 exigia que a
       pessoa soubesse escrever o nome do produto para ver o produto. */
    busca: {
      k: "O achado que ampliou o escopo",
      t: "A loja cobrava ortografia para deixar comprar",
      p: ["O mapa de calor dizia que buscar era o segundo gesto mais comum do site. Fui testar o que a busca respondia.",
          "Procurei por mouse. A vitrine devolveu mousepad na frente do mouse, e o mouse era justamente a linha em que a empresa mais investia naquele momento. O motor rankeava por proximidade de texto, não por relevância de catálogo.",
          "Depois procurei por mause. Nenhum resultado, e as sugestões que apareciam eram outros erros de grafia do próprio catálogo, \u201cMause\u201d, \u201cVulcam\u201d. O mesmo acontecia com mous, com teclao, com qualquer variação que escapasse da grafia exata.",
          "Isso não é detalhe de motor de busca. É a loja decidindo que quem não escreve certo não compra. Numa loja de hardware, onde metade dos nomes é estrangeira e cheia de número, isso exclui gente que tem dinheiro e intenção de gastar."],
      figs: ["buscaMouse", "buscaMause"],
    },
    /* a frase que virou a reunião, no tamanho de fala de painel */
    citacao: {
      q: "A diretoria pedia minimalismo. O comportamento no site pedia atalho. Em vez de escolher um dos dois, separei as camadas.",
      fonte: "A proposta que destravou o projeto",
      tinta: "orbit",
    },
    /* AS QUATRO ÂNCORAS ------------------------------------------------
       Argumento puro, sem figura. As decisões que mudam a tese do projeto
       ficam aqui; as que a executam viram passos em `modulos`, com as
       provas. Antes eram dez itens com figura acoplada, e por isso o
       clímax do capítulo acontecia no meio: a prova toda era gasta antes
       de `solucao`, `sistema` e `antesDepois`. */
    decisoes: [
      { d: "Busca que perdoa quem n\u00e3o escreve certo",
        r: "porque a V1 devolvia tela vazia para \u201cmause\u201d e mousepad para \u201cmouse\u201d. A V2 passou a tolerar erro de grafia, a ranquear o cat\u00e1logo pelo que a loja precisa vender e a abrir com os termos e produtos mais buscados, para quem n\u00e3o lembra o nome do que quer. Numa loja de hardware, exigir ortografia exata \u00e9 escolher um p\u00fablico e dispensar o resto." },
      { d: "Pop-up depois de 15% de rolagem, nunca na chegada",
        r: "porque o clique mais comum do site inteiro era fechar o pop-up: 182 cliques somando as duas \u00e1reas de fechar, contra 5 no bot\u00e3o de comprar. A capta\u00e7\u00e3o de e-mail estava cobrando o primeiro gesto de quem acabou de entrar. Na V2 ele s\u00f3 aparece depois de a pessoa rolar 15% da p\u00e1gina, ou seja, depois de ela demonstrar algum interesse. A mesma oferta, feita para quem j\u00e1 est\u00e1 olhando." },
      { d: "Formas de pagamento na primeira dobra do checkout",
        r: "porque a grava\u00e7\u00e3o mostrou gente saindo antes de descobrir como podia pagar. No caminho, achei bug no m\u00f3dulo de pagamento do Magento. O erro aparecia na sess\u00e3o gravada e n\u00e3o aparecia em relat\u00f3rio nenhum. Fui atr\u00e1s da origem num projeto p\u00fablico da extens\u00e3o e entreguei o ponto exato para o time de tecnologia corrigir." },
      { d: "Adicionar ao carrinho direto da home e da vitrine",
        r: "porque exigir a p\u00e1gina do produto cobrava cliques que n\u00e3o precisavam existir. Quem j\u00e1 sabe o que quer compra do card, e do carrinho vai direto ao checkout. Quem ainda est\u00e1 decidindo continua com a p\u00e1gina completa \u00e0 disposi\u00e7\u00e3o." },
    ],
    /* o beat que separa quem escolheu de quem entregou tudo que pediram */
    recusei: {
      k: "O que eu recusei",
      p: "Nem tudo que apareceu na pesquisa virou tela. Três coisas ficaram de fora de propósito.",
      itens: [
        { o: "Trocar uma home institucional por outra", r: "A direção minimalista que chegou pronta resolvia a estética e mantinha o produto fora da primeira dobra. Levei as gravações para a reunião e propus o contrário do que tinham pedido." },
        { o: "Apagar a marca do site", r: "Depois de virar a mesa, o caminho fácil seria transformar tudo em vitrine seca. A PCYES tem personalidade e ela vende. A marca continuou, com hora e lugar marcados." },
        { o: "Abrir chamado e esperar", r: "O bug do módulo de pagamento travava compra de verdade. Diagnosticar não era o meu papel, mas era o que destravava a etapa mais cara do funil." },
      ],
    },
    solucao: {
      t: "Marca presente, produto no eixo",
      p: ["Em vez de escolher entre valor de marca e convers\u00e3o, separei as camadas. A marca aparece em momentos espec\u00edficos e o caminho de compra passa a ser o eixo do site.",
          "As tr\u00eas telas abaixo s\u00e3o o mesmo caminho, andado do come\u00e7o ao fim. A vitrine compra sem abrir o produto, o checkout abre no meio de pagamento, e o mobile repete a regra numa tela em que n\u00e3o cabe repetir nada por engano.",
          "O sistema saiu junto, uma biblioteca no Figma com os componentes que aparecem em toda a compra, para o time de tecnologia implementar sem redecidir espa\u00e7amento, estado e cor a cada tela nova."],
      slots: 1,
      /* a s\u00edntese precisa de prova nova, n\u00e3o de resumo. Como `decisoes`
         devolveu as figuras, `checkout` e `vitrine` chegam aqui inteiras
         e o conjunto \u00e9 lido de uma vez: as duas pontas do caminho de
         compra mais a prova de que a regra vale na tela pequena.
         A moldura da biblioteca do design system saiu: o beat `sistema`
         j\u00e1 argumenta o sistema pelas funda\u00e7\u00f5es (cor, tipo, motion,
         espa\u00e7o), ent\u00e3o um print de biblioteca era redundante. */
      /* Sem `meia`. Medido em 2026-08-26: com dois lado a lado, o checkout
         e a vitrine saíam a 282px de largura em 1440 (20% da tela), as
         menores telas de conteúdo do capítulo, justamente no beat que
         entrega o resultado. Em largura cheia vão a ~549px. */
      /* a ordem das telas é a ordem do caminho: começo, fim, bolso.
         Mostrar o fim primeiro quebrava a cronologia que o título promete. */
      shots: [{ fig: "vitrine" },
              { fig: "checkout" },
              "volume/assets/projetos/pcyes/s5.webp"],
      legendas: ["Onde o caminho come\u00e7a. Na vitrine, comprar deixou de exigir a p\u00e1gina do produto.",
                 "Onde ele termina. O checkout abre no meio de pagamento, antes de a pessoa decidir se continua.",
                 "E onde ele cabe no bolso. A mesma regra na tela pequena, com o pre\u00e7o fixo na base."],
    },
    /* ---- O DESIGN SYSTEM -------------------------------------------
       Entra aqui, e não no começo, porque o argumento é de ordem: antes
       de desenhar quarenta telas, construí o vocabulário. Chega depois
       das decisões, então cada tela dos módulos vira prova de que o
       sistema funciona.
       Não é catálogo de swatch. O que se mostra é token semântico em
       uso: cor com função, que troca de valor quando o tema vira e
       mantém o papel. Os valores abaixo são os do arquivo real
       (src/styles/theme.css do protótipo), não amostra ilustrativa. */
    sistema: {
      k: "Antes das telas",
      t: "A V1 tinha cores. A V2 tem um sistema que sabe o que cada cor faz",
      p: ["Quarenta telas desenhadas na mão viram quarenta decisões repetidas sobre espaçamento, estado e cor. Antes de desenhar, construí o vocabulário: 239 tokens no arquivo de tema, 69 componentes montados em cima deles.",
          "O que muda não é a quantidade de cor, é o endereço dela. Na V1, cinza de texto secundário era um hexadecimal escrito na hora, diferente em cada tela. Na V2 ele tem nome e função. O ink-muted não é um cinza, é o papel \u201ctexto secundário\u201d. Quando o tema vira, ele vira sozinho."],
      /* o par que prova o argumento: o mesmo token, os dois temas.
         Escala aqui é papel, não valor: surface é fundo, ink é texto,
         edge é borda. */
      escada: {
        k: "O mesmo token, os dois temas",
        n: "Um valor por tema, um papel só. Nenhuma tela precisa saber em que tema está.",
        linhas: [
          { t: "surface-1", f: "Fundo de card", c: "#ffffff", e: "#1a1a1a" },
          { t: "surface-3", f: "Fundo elevado, divisória cheia", c: "#e5e5e5", e: "#323232" },
          { t: "ink-strong", f: "Título, preço", c: "#161616", e: "#ffffff" },
          { t: "ink-muted", f: "Texto secundário", c: "rgba(22,22,22,.65)", cl: "preto 65%", e: "rgba(255,255,255,.55)", el: "branco 55%" },
          { t: "edge", f: "Borda padrão", c: "rgba(0,0,0,.12)", cl: "preto 12%", e: "rgba(255,255,255,.12)", el: "branco 12%" },
        ],
      },
      /* a cor que carrega função. Cada uma responde a uma pergunta do
         cliente, e é por isso que não podem ser a mesma. */
      funcoes: [
        { n: "Comprar", c: "#22c55e", f: "Ação", p: "O verde do botão de compra. É gesto, não informação, e só aparece onde dá para agir." },
        { n: "Economia", c: "#15803d", ce: "#4ade80", f: "Informação", p: "O \u201c-15% OFF\u201d e a menção ao Pix. Mesma família do verde de comprar, papel diferente, e por isso valor diferente." },
        { n: "Pré-venda", c: "#f97316", f: "Espera", p: "Laranja é o produto que ainda não chegou. Reserva, contador e prazo usam essa cor e nenhuma outra usa." },
        { n: "Coin", c: "#facc15", f: "Saldo", p: "O dourado do programa de pontos. Saldo, nível e validade. Fora do PCYES Points, essa cor não aparece." },
      ],
      /* o token que sozinho explica a diferença entre cor e sistema:
         ele troca de valor entre os temas justamente para não trocar de
         papel. O número é do arquivo, com a razão de contraste medida. */
      caso: {
        k: "Por que o valor muda",
        t: "O verde de economia é dois verdes",
        p: ["O verde de comprar (#22c55e) sobre branco dá 2,28:1. Para texto, a WCAG pede 4,5:1, então o mesmo verde que funciona como botão reprova como texto pequeno.",
            "Então o token de economia guarda dois valores: #15803d no claro (5,02:1) e #4ade80 no escuro (11,08:1). Quem desenha a tela escreve economia e recebe o verde que passa no tema em que está. A acessibilidade deixou de depender de alguém lembrar."],
        pares: [{ tema: "Claro", c: "#15803d", bg: "#ffffff", r: "5,02:1" },
                { tema: "Escuro", c: "#4ade80", bg: "#0e0e0e", r: "11,08:1", escuro: true }],
      },
      /* ---- as outras fundações ------------------------------------
         Cor sozinha responde "que cores tem". O sistema aparece mesmo
         quando o mesmo raciocínio se repete em motion, tipografia e
         espaço. Cada bloco abaixo é um valor real do theme.css, não
         escala inventada pra ilustrar. */
      /* a curva é a assinatura de movimento da casa: sai rápido e chega
         devagar, que é como objeto pesado para. Desenhada, não descrita:
         dá para ver a desaceleração no fim. */
      motion: {
        k: "Motion",
        t: "Uma curva só, para tudo que se move",
        curva: [0.16, 1, 0.3, 1],
        rotulo: "cubic-bezier(0.16, 1, 0.3, 1)",
        dur: "300ms",
        p: "Sai rápido e chega devagar, que é como coisa com peso para. A alternativa é cada componente escolher a sua, e aí o site inteiro parece feito por pessoas diferentes. Uma curva, uma duração padrão, e o movimento vira sotaque em vez de ruído.",
        marcos: [{ l: "200ms", n: "estado de botão" }, { l: "300ms", n: "padrão" }, { l: "500ms", n: "entrada de painel" }],
      },
      /* a escala tipográfica, desenhada no tamanho que ela tem */
      tipografia: {
        k: "Tipografia",
        t: "Duas famílias, uma escala",
        p: "Figtree carrega título e Inter carrega texto e interface. A escala não é contínua de propósito. São cinco degraus com distância suficiente para a hierarquia ser óbvia sem ninguém precisar comparar dois textos lado a lado.",
        familias: [{ n: "Figtree", f: "Display, títulos" }, { n: "Inter", f: "Texto e interface" }],
        escala: [
          { n: "h1", px: 80, fam: "Figtree", peso: 400, pn: "regular" },
          { n: "h2", px: 48, fam: "Figtree", peso: 300, pn: "light" },
          { n: "h3", px: 40, fam: "Figtree", peso: 400, pn: "regular" },
          { n: "h4", px: 32, fam: "Figtree", peso: 400, pn: "regular" },
          { n: "corpo", px: 16, fam: "Inter", peso: 400, pn: "regular" },
        ],
        nota: "O h2 é o único em light. É o tamanho que mais aparece em abertura de seção, e no peso normal ele competia com o h1 em vez de organizar a página abaixo dele.",
      },
      /* espaço e raio: as duas escalas que ninguém nota quando estão
         certas e todo mundo sente quando cada tela escolhe a sua */
      espaco: {
        k: "Espaço e raio",
        t: "O ritmo entre as seções tem quatro valores, não quarenta",
        p: "Distância entre seções costuma ser o lugar onde o sistema vaza. Alguém escreve 72, outro escreve 80, e a página perde o compasso. Aqui são quatro degraus, e eles encolhem juntos no mobile, onde o vão de desktop vira tela vazia.",
        ritmo: [
          { l: "sm", d: 56, m: 40 },
          { l: "md", d: 88, m: 56 },
          { l: "lg", d: 128, m: 72 },
          { l: "xl", d: 168, m: 96 },
        ],
        ritmoNota: "Desktop e mobile. A mesma escala, comprimida.",
        raios: [
          { v: 4, u: "Campo, botão" },
          { v: 8, u: "Card padrão" },
          { v: 12, u: "Modal, busca" },
          { v: 18, u: "Card de brinde" },
          { v: 22, u: "Foto de produto" },
          { v: 26, u: "Vitrine de categoria" },
        ],
        raioNota: "Cada raio tem um uso escrito. É o que impede o sétimo raio de nascer na próxima tela.",
      },
      /* o exemplo que fecha o argumento: o componente mais repetido do
         site não guarda cor nenhuma. Ele deriva do tema. */
      derivado: {
        k: "O caso que fecha",
        t: "O card de produto não guarda cor nenhuma",
        p: ["O fundo da foto do produto é o componente mais repetido da loja, e aparece na home, na vitrine, na busca, no carrinho. Seria o candidato natural a ter um cinza escolhido na mão.",
            "Não tem. O fundo é a cor de texto do tema rebaixada a 10% e 3% de opacidade, em diagonal. No claro, isso é preto quase transparente; no escuro, é branco quase transparente. Mesma regra, dois resultados, nenhum valor guardado.",
            "É a diferença entre uma paleta e um sistema. Paleta é uma lista de cores. Sistema é uma regra que produz a cor certa em um contexto que ninguém previu."],
        formula: "rgba(var(--foreground-rgb), .10) → .03",
        temas: [{ tema: "Claro", ink: "22, 22, 22", bg: "#fafafa", escuro: false },
                { tema: "Escuro", ink: "255, 255, 255", bg: "#0a0a0a", escuro: true }],
      },
      nota: "O sistema é espelhado em código e sincronizado com o Figma por Tokens Studio, então biblioteca e produto não divergem com o tempo. Uma sombra de card que existia copiada em 43 lugares virou um token só.",
    },
    /* ---- os módulos que ganharam beat próprio ------------------------
       Três partes do produto que não cabiam na lista de decisões: a
       pré-venda, o configurador e o que a V2 passou a ter e a V1 não
       tinha. Cada uma entra com as telas dela ao lado do argumento. */
    /* ---- A PONTE: a V1.2 ---------------------------------------------
       O elo cronológico do capítulo. A investigação terminou apontando o
       buraco mais caro no fim do funil, e a V2 tinha data. A história só
       faz sentido se a correção de urgência vem ANTES do redesenho: é a
       primeira resposta, não um módulo perdido no meio dos outros. */
    ponte: { k: "Antes da V2 · a V1.2", t: "O checkout melhorou sem esperar o redesenho",
        buraco: "As gravações mostraram o módulo de pagamento falhando exatamente onde a compra acontece, e a V2 tinha data para entrar no ar.",
        p: ["Esperar o redesenho custava venda todo dia. Propus uma correção pequena na versão que já estava rodando, a V1.2, e ela conta em cinco estados o que mudou."],
        passos: [
          { k: "O estado bom", t: "Mesmo funcionando, era longo demais",
            p: "Com tudo carregado, cada meio de pagamento ocupa uma linha inteira. O bloco desce por metade da tela e empurra a decisão para longe de quem já escolheu o produto.",
            fig: "ckCarregado" },
          { k: "O estado real", t: "E quando não carregava, sumia",
            p: "O módulo de pagamento do Magento falhava. Sobravam dois meios e um vão maior que o próprio conteúdo, exatamente onde a compra acontece. Quem paga com cartão não via como pagar.",
            fig: "ckLento" },
          { k: "A correção", t: "Os quatro meios em uma linha só",
            p: "Os quatro passaram a caber lado a lado e o frete condensou em três opções com um \u201cver mais\u201d. O mesmo checkout ficou 60% mais curto: 3421 pixels de altura contra 1366.",
            fig: "ckV12" },
          { k: "A resposta", t: "Escolher passou a explicar",
            p: "Selecionar Pix abre o que acontece depois de finalizar, em três passos. A dúvida que fazia a pessoa sair do checkout virou resposta na própria tela.",
            fig: "ckV12Pix" },
          { k: "No celular", t: "A mesma decisão, na tela pequena",
            p: "No mobile a diferença fica literal. A V1.2 termina onde a V1 ainda tem um quarto de tela pela frente. Mesma compra, menos caminho.",
            fig: "ckMobile" },
        ] },
    modulos: [
      { k: "Pré-venda", t: "Reserva com vaga contada e prazo na cara",
        buraco: "A PCYES vive de lançamento, edição limitada, coleção com o Maringá FC. A V1 tratava lançamento igual a qualquer produto. Ou tinha estoque, ou sumia da vitrine.",
        p: ["Na V2, produto anunciado antes de chegar entra em pré-venda com reserva. A pessoa vê quantas reservas já saíram, quantas ainda existem e a data prevista de entrega, e o cartão só é cobrado no despacho.",
            "A escassez aqui não é truque de urgência inventada. O número de reservas é real e a data também, e é isso que faz a barra funcionar em vez de irritar."],
        figs: ["prevenda"] },
      { k: "Monte seu PC", t: "Três caminhos para a mesma máquina",
        buraco: "Montar PC separa dois públicos que não se misturam, e o configurador antigo servia bem quem já sabe a peça e abandonava quem só sabe o jogo que joga.",
        p: ["A entrada do módulo pergunta uma coisa só e abre um dos três caminhos. Escolha um aqui do lado para ver como cada um se comporta."],
        figs: ["mspCaminhos"],
        /* a seção faz o que a tela que ela descreve faz: quem lê escolhe o
           caminho em vez de atravessar três parágrafos em fila */
        caminhos: [
          { t: "Eu já sei o que quero", para: "Montar do zero", fig: "mspBuilder",
            p: "Oito etapas, uma peça por vez, com a lista filtrada pelo que é compatível com o que já foi escolhido. O total e a parcela ficam à vista o tempo inteiro, então ninguém descobre o preço no fim." },
          { t: "Me ajuda a escolher", para: "Três perguntas", fig: "mspJogos",
            p: "Em vez de perguntar orçamento, pergunta o que a pessoa joga, edita ou faz no dia a dia. A recomendação sai de Valorant e Premiere, não de soquete e TDP, e volta como uma build pronta que ainda dá para editar peça a peça." },
          { t: "Quero pronto", para: "Setups testados", fig: "mspProntas",
            p: "Nove máquinas montadas e testadas viram produto de vitrine, com nome, uso, preço fechado e compra em um clique, do mesmo jeito que se compra um mouse." },
        ] },
      /* este módulo lê como sequência, não como bloco de texto + mosaico de
         telas: o argumento só fecha se a pessoa vir um estado de cada vez.
         `passos` liga cada trecho de texto à figura que o sustenta, e o
         texto fica preso à esquerda enquanto a prova correspondente passa. */
      { k: "O que a V1 não tinha", t: "Carrinho lateral e programa de pontos",
        buraco: "Na V1, pôr no carrinho levava a pessoa para fora da página, e programa de fidelidade não existia.",
        p: ["Duas coisas entraram na V2. O carrinho lateral, que abre sobre a página em vez de levar a pessoa embora, com a barra de brinde mostrando o quanto falta para ganhar algo, e o PCYES Points, com saldo, níveis e validade abertos na tela.",
            "As duas resolvem o mesmo problema por vias diferentes, e as duas dão motivo para continuar comprando sem cobrar mais um clique de quem já decidiu."],
        figs: ["sidecart", "points"] },
      /* AS EXECU\u00c7\u00d5ES ----------------------------------------------------
         As seis decis\u00f5es que implementam a tese, com as figuras que antes
         moravam em `decisoes`. Em passos, e n\u00e3o em mosaico, porque a
         leitura \u00e9 uma sequ\u00eancia: cada corre\u00e7\u00e3o encurta um trecho
         diferente do mesmo caminho. `buscaV2` e `popup` ainda s\u00e3o
         molduras pendentes: caem em MangaPlate at\u00e9 o print subir. */
      { k: "O acabamento", t: "As oito corre\u00e7\u00f5es que encurtaram o caminho",
        buraco: "O caminho at\u00e9 a compra era longo porque cada dobra somava um atrito pequeno, e atrito somado \u00e9 caminho longo.",
        p: ["As quatro \u00e2ncoras dizem o que o projeto passou a defender. Estas oito s\u00e3o o que foi preciso mexer para que a defesa valesse em tela, uma dobra por vez."],
        passos: [
          { k: "A entrada", t: "A busca deixou de exigir ortografia",
            p: "A V2 abre com os termos e produtos mais procurados antes de a pessoa digitar, e o que ela digita errado ainda encontra. O campo passou a servir quem sabe o nome da pe\u00e7a e quem s\u00f3 sabe para que ela serve.",
            fig: "buscaV2" },
          /* PENDENTE (2026-08-26, decisão do Gabriel): o passo do pop-up
             está OCULTO porque o print ainda não existe e uma moldura
             vazia abrindo o módulo custava mais que a ausência. Quando o
             print chegar: salvar como busca-popup.webp (ou similar) em
             volume/assets/projetos/pcyes/, apontar o `src` na figura
             `popup` acima, descomentar este passo AQUI e no i18n.jsx, e
             voltar o título e o corpo deste módulo de "oito" para
             "nove" nos dois idiomas. A âncora de `decisoes` sobre o
             pop-up continua no ar: é argumento, não prova.
          { k: "A chegada", t: "A oferta passou a esperar o interesse",
            p: "O pop-up saiu da porta e foi para depois dos 15% de rolagem. Quem acabou de chegar v\u00ea a loja; quem j\u00e1 est\u00e1 olhando \u00e9 que recebe a proposta.",
            fig: "popup" },
          */
          { k: "A home", t: "O institucional desceu uma dobra",
            p: "Carross\u00e9is de produto no lugar dos blocos de marca, promo\u00e7\u00f5es em destaque e filtro de promo\u00e7\u00e3o logo na entrada das categorias. A marca n\u00e3o saiu: ela deixou de ocupar o lugar do produto.",
            fig: "home" },
          { k: "A vitrine", t: "Avaliar sem perder o lugar na lista",
            p: "A visualiza\u00e7\u00e3o r\u00e1pida abre o produto por cima da listagem, com zoom na foto. Quem est\u00e1 comparando tr\u00eas modelos n\u00e3o recome\u00e7a a rolagem a cada olhada.",
            fig: "quickview" },
          { k: "O produto", t: "O pre\u00e7o parou de sumir",
            p: "Coluna fixa \u00e0 direita no desktop, barra fixa na base no mobile. \u00c9 a informa\u00e7\u00e3o que a pessoa mais reconsulta, e era a que mais exigia voltar ao topo.",
            fig: "preco" },
          { k: "A ficha", t: "Descri\u00e7\u00e3o gerada a partir do SKU",
            p: "As fichas eram inconsistentes, cada uma escrita por uma pessoa diferente em um ano diferente. Uma ferramenta interna passou a gerar o HTML com hierarquia de t\u00edtulos e imagens formatadas. O que era manual e desigual virou padr\u00e3o.",
            fig: "sku" },
          { k: "A esteira", t: "E o time passou a ver onde cada produto est\u00e1",
            p: "Cada SKU percorre CRM, SEO, gerador de HTML, Page Builder e publica\u00e7\u00e3o. A fila deixou de ser combinado de bastidor e virou tela.",
            fig: "skuFila" },
          { k: "A leitura", t: "O salto de brilho saiu da navega\u00e7\u00e3o",
            p: "O site \u00e9 escuro e a V1 abria uma dobra branca inteira no meio do caminho. De madrugada, que \u00e9 quando boa parte desse p\u00fablico compra, esse salto \u00e9 a parte que cansa.",
            fig: "contraste" },
          { k: "O alcance", t: "VLibras, porque a loja tamb\u00e9m atende quem sinaliza",
            p: "Custou pouco tempo de implementa\u00e7\u00e3o e \u00e9 a diferen\u00e7a entre servir essa pessoa ou n\u00e3o servir. Quem tem Libras como primeira l\u00edngua lia um site em segunda l\u00edngua.",
            fig: "libras" },
        ] },
    ],
    /* a data de publicação, rabiscada na folha de outubro */
    calendario: {
      k: "Data marcada",
      mes: "Outubro", ano: "2026", dia: 26,
      dow: ["D", "S", "T", "Q", "Q", "S", "S"],
      semanas: [[0, 0, 0, 1, 2, 3, 4], [5, 6, 7, 8, 9, 10, 11], [12, 13, 14, 15, 16, 17, 18], [19, 20, 21, 22, 23, 24, 25], [26, 27, 28, 29, 30, 31, 0]],
      legenda: "26 de outubro de 2026: a data combinada com a diretoria para a V2 entrar no ar. Até lá, o protótipo é o produto que dá para testar.",
    },
    /* o par que sustenta o case: a V1 e a V2 no mesmo enquadramento */
    antesDepois: {
      antes: "volume/assets/projetos/pcyes/antes.webp",
      depois: "volume/assets/projetos/pcyes/depois.webp",
      rotuloAntes: "V1", rotuloDepois: "V2",
      legenda: "A mesma primeira dobra: a V1 abre em campanha de marca, a V2 abre no caminho de compra.",
      /* as outras dobras que valem comparar. Sem o print da V1, o par entra
         como moldura tracejada: fica claro o que falta subir e o beat não
         some da página. */
      pares: [
        { antes: "volume/assets/projetos/pcyes/v1-vitrine.webp",
          depois: "volume/assets/projetos/pcyes/s2.webp",
          rotuloAntes: "V1", rotuloDepois: "V2",
          legenda: "A mesma vitrine de periféricos: na V1 o card só leva para a página do produto, na V2 ele compra." },
        { antes: "volume/assets/projetos/pcyes/v1-carrinho.webp",
          depois: "volume/assets/projetos/pcyes/sidecart.webp",
          rotuloAntes: "V1", rotuloDepois: "V2",
          legenda: "O carrinho: na V1 é uma página que tira a pessoa da loja, na V2 abre por cima e deixa ela onde estava." },
      ],
    },
    resultado: {
      t: "Entra em produção em outubro",
      p: ["Comprar deixou de exigir a página do produto, o preço parou de sumir com a rolagem e a forma de pagamento aparece antes de a pessoa decidir se continua. A direção final foi aprovada e a data ficou marcada.",
          "Resultado de operação eu ainda não tenho, e prefiro não apresentar número que não existe."],
      listaK: "O que vai ser acompanhado depois da publicação",
      lista: ["Taxa de adição ao carrinho a partir da home e das vitrines",
              "Conclusão do checkout e abandono por etapa",
              "Tempo entre a entrada no site e a compra",
              "Ocorrência de erro no pagamento"],
    },
    aprendi: {
      p: ["Valor de marca e conversão foram tratados como escolhas opostas no começo do projeto. Não são. O problema não era a marca aparecer, era ela ocupar o lugar do produto na hierarquia da página.",
          "E a lição mais cara foi outra. Chegar em uma conversa difícil com gravação de sessão em vez de opinião muda completamente o rumo da discussão.",
          "Perseguir o bug do módulo de pagamento até a origem também comprou mais confiança com o time de tecnologia do que qualquer apresentação que eu tivesse feito."],
    },
  },
  {
    id: "locarmais-conciliacao", num: "02", cap: "CAP. 02", domain: "SAAS", cat: "saas",
    project: "Locar Mais", descriptor: "Módulo de conciliação financeira", title: "Locar Mais",
    sfx: "チャリン",                    // charin: moeda (financeiro)
    capa: { logo: "volume/assets/marcas/branco/locarmais.png", bg: "#3C1354", accent: "#F43180" },   /* capa de marca: o print não fecha em 4:5 */
    links: { vercel: null, figma: null },
    premise: "O valor que chegou é o valor certo? O financeiro não conseguia responder.",
    role: "UX Designer, responsável pelo módulo",
    surface: "Sistema de gestão · web",
    periodo: "Em produção",
    year: "2026",
    fact: "Substituiu uma ferramenta externa e eliminou as planilhas paralelas do time financeiro",
    tldr: {
      papel: "UX Designer, responsável pelo módulo",
      oque: "Módulo de conciliação financeira dentro de um sistema de gestão.",
      resultado: "Substituiu uma ferramenta externa e eliminou as planilhas paralelas do time financeiro",
    },
    problema: {
      t: "O valor que chegou é o valor certo?",
      p: ["A empresa recebia por múltiplos adquirentes ao mesmo tempo. Cada um com sua taxa, seu imposto, seu prazo de repasse e seu formato de extrato.",
          "Para responder, era preciso cruzar à mão o que o sistema registrou com o que cada adquirente informou no extrato. Multiplicado por centenas de lançamentos por dia, virava um processo lento, difícil de auditar e impossível de acompanhar em tempo real.",
          "Perguntas básicas ficavam sem resposta: quanto ainda falta receber, quanto foi retido em taxa, e quais lançamentos estão errados."],
    },
    investigacao: {
      t: "Junto de quem opera todo dia",
      p: ["Trabalhei junto da equipe financeira, que era quem operava o processo todo dia, e acompanhei a rotina real de conferência para entender onde estava o esforço e onde apareciam os erros.",
          "Também fiz benchmarking de plataformas de conciliação já consolidadas no mercado, para usar o vocabulário que profissionais da área já dominam e não inventar termo novo onde já existe um."],
      achados: [
        "O trabalho não era conciliar, era encontrar o que não bate. A maior parte dos lançamentos fecha sozinha; o tempo do time ia embora procurando a minoria divergente no meio da maioria correta.",
        "Quando o time forçava uma conciliação manual, o motivo se perdia. Ninguém depois sabia por que aquele lançamento tinha sido fechado com diferença.",
      ],
    },
    decisoes: [
      { d: "Cinco status, uma linguagem comum", r: "porque o time já usava essas ideias com nomes diferentes entre as pessoas. Conciliado, não conciliado, divergente, em disputa e ignorado: fixar o vocabulário na interface acabou com a ambiguidade nas conversas do dia a dia." },
      { d: "O topo responde antes de a pessoa perguntar", r: "porque previsto, valor líquido, diferença acumulada e percentual conciliado são o que se olha primeiro. A diferença acumulada aparece em destaque junto da contagem de divergentes, porque é ela que dispara a ação." },
      { d: "Três caminhos, do mais barato ao mais caro", r: "porque o esforço da pessoa tem que ficar reservado pra onde ele é realmente necessário: conciliação automática ao importar os extratos, em lote para o que sobra, e individual forçada para o que exige julgamento humano." },
      { d: "Forçar conciliação exige motivo", r: "porque a exceção era um buraco no processo e virou dado. Fechar com diferença pede justificativa em lista fechada (taxa ou tarifa, pagamento fracionado, diferença de data, arredondamento do adquirente, outros), e com o tempo a empresa passa a saber quais divergências mais se repetem e com qual adquirente. É a decisão de que mais me orgulho no módulo." },
      { d: "Origem dos dados lado a lado", r: "porque a conferência tem que acontecer na tela, sem abrir dois sistemas: no detalhe do lançamento, o registro da plataforma e o do gateway aparecem juntos, com contrato, taxa esperada, valor líquido previsto e data prevista de repasse." },
      { d: "Histórico com rastro completo", r: "porque em módulo financeiro poder responder 'quem mexeu nisso e por quê' não é conforto, é requisito: conciliação automática, importação de extrato e ajuste manual com autor e horário." },
      { d: "Importação com múltiplas origens", r: "porque o usuário sobe os extratos de vários adquirentes numa operação só e recebe o consolidado: quantos conciliaram sozinhos, quantos divergiram e quantos ficaram pendentes, com exportação em CSV de cada grupo." },
    ],
    solucao: {
      t: "Conciliar é achar o que não bate",
      p: ["O módulo abre no que exige atenção, não no que deu certo.",
          "No mesmo sistema desenhei os painéis de monitoramento usados pela operação e pela diretoria: carteira classificada por comportamento, aproveitamento de contratos aprovados contra pagos, metas por representante e churn do período. A mesma lógica se aplica: o painel abre no estado crítico, com filtro rápido, e a tabela detalhada fica logo abaixo para quem precisa investigar."],
      slots: 2,
      /* Telas reais do módulo. Cada uma declara a PRÓPRIA proporção: o
         painel nasce no formato do arquivo, então print em retrato cabe
         inteiro sem tarja e sem corte. `meia` põe dois lado a lado. */
      shots: [
        { src: "volume/assets/projetos/locarmais/s1-conciliacao.webp",        ar: "1610/1257" },
        { src: "volume/assets/projetos/locarmais/s2-origem-dos-dados.webp",   ar: "717/987",  meia: true },
        { src: "volume/assets/projetos/locarmais/s3-detalhe-conciliacao.webp", ar: "717/805",  meia: true },
        { src: "volume/assets/projetos/locarmais/s4-forcar-conciliacao.webp", ar: "925/1112" },
      ],
    },
    vocabulario: {
      t: "Cinco status, uma linguagem",
      kicker: "o léxico que acabou com a ambiguidade",
      termos: [
        { n: "Conciliado", d: "O que o sistema registrou bate com o que o adquirente informou. Fecha sozinho, não pede ninguém." },
        { n: "Não conciliado", d: "Ainda não encontrou par. Não é erro: é fila de trabalho." },
        { n: "Divergente", d: "Encontrou par, mas o valor não bate. É aqui que o tempo do time vai embora, e é aqui que a tela abre." },
        { n: "Em disputa", d: "A diferença virou contestação com o adquirente. Sai do fluxo normal sem sumir do controle." },
        { n: "Ignorado", d: "Alguém decidiu que aquele lançamento não entra na conciliação. Decisão registrada, não lançamento esquecido." },
      ],
      nota: "O time já usava essas cinco ideias, mas com nomes diferentes entre as pessoas. Fixar o vocabulário na interface acabou com a ambiguidade nas conversas do dia a dia.",
    },
    resultado: {
      t: "Em produção, e as planilhas sumiram",
      p: ["Não tenho medição formal de antes e depois, mas três mudanças de comportamento aconteceram e são verificáveis. O retorno do time foi de um processo mais rápido e mais claro de acompanhar."],
      listaK: "O que mudou no comportamento do time",
      lista: ["As planilhas paralelas sumiram. O time mantinha várias para controlar o processo, uma por frente, e depois da entrega deixou de usar.",
              "O financeiro parou de pedir relatório para o time de desenvolvimento: os dados passaram a estar acessíveis na própria plataforma.",
              "A conciliação saiu de uma ferramenta externa para dentro de casa, unindo o registro da operação e o extrato do adquirente no mesmo lugar."],
    },
    aprendi: {
      p: ["Em produto financeiro, a tela mais importante não é a que mostra o que deu certo. É a que mostra o que não bate, e por quê.",
          "Também aprendi o valor de desenhar para o erro previsto. Um sistema que só aceita o caminho perfeito empurra o usuário para fora dele, normalmente para uma planilha paralela que ninguém audita."],
    },
  },
  {
    id: "odex", num: "03", cap: "CAP. 03", domain: "DESKTOP E WEB", cat: "desktop",
    project: "ODEX", descriptor: "Redesign de interface", title: "ODEX",
    sfx: "キラッ", cover: "volume/assets/projetos/odex/cover.webp",   /* kira: brilho — redesign visual */
    capa: { logo: "volume/assets/marcas/branco/odex.png", bg: "#0D1D52", accent: "#005AFF" },   /* capa de marca: o print não fecha em 4:5 */
    coverTall: "volume/assets/projetos/odex/cover-tall.webp",   /* 4:5, a proporção do painel do hero */
    links: { vercel: "https://ux-oderco.vercel.app/odex/plataforma/v3", figma: "https://www.figma.com/design/0nApyM8W4IgRwr64pSOfWg/DS--ODEX-?node-id=0-1&t=vAP1IrCmMOrbbiEy-1" },
    premise: "A plataforma funcionava há anos. Era a interface que tinha envelhecido.",
    role: "UX/UI Designer",
    surface: "Plataforma · aplicativo · site",
    periodo: "Plataforma em andamento · site em produção · app em protótipo",
    year: "2026",
    fact: "Sistema legado atualizado sem alterar o percurso de quem já usava",
    tldr: {
      papel: "UX/UI Designer",
      oque: "Plataforma de gestão com anos de uso, aplicativo e site institucional.",
      resultado: "Sistema legado atualizado sem alterar o percurso de quem já usava",
    },
    problema: {
      t: "A interface envelheceu junto com o produto",
      p: ["A plataforma funcionava, e funcionava há anos. O problema não era o fluxo, era a interface: um layout antigo, que envelheceu junto com o produto e passou a comunicar menos do que o negócio já entrega hoje.",
          "Redesign de legado é exercício de contenção, não de criação. A superfície inteira mudou; a lógica do sistema, de propósito, não. Quem opera isso todo dia sabe onde tudo está de cor, e obrigar essa pessoa a reaprender o caminho seria cobrar caro por uma melhoria que ela não pediu."],
    },
    investigacao: {
      t: "Validado com quem opera o sistema",
      p: ["O sistema é operado por gestores e diretoria, então a avaliação aconteceu com eles, que são os usuários reais. Cada versão foi entregue como protótipo navegável, com comentários registrados em cima das telas, e ajustada antes da versão seguinte."],
      achados: [
        "Não era um problema de fluxo. Os caminhos funcionavam havia anos e ninguém pedia para mudá-los.",
        "Era a interface que tinha envelhecido junto com o produto e passado a comunicar menos do que o negócio já entrega hoje.",
        "Qualquer mudança de percurso custaria caro: quem usa o sistema todo dia sabe onde tudo está de cor.",
      ],
    },
    decisoes: [
      { d: "Toda a base de telas redesenhada, com protótipo navegável", r: "porque o time precisava avaliar a proposta em uso, não em imagem estática." },
      { d: "Linguagem visual nova, percurso intacto", r: "porque em sistema com anos de uso, mudar a aparência sem mudar o percurso é a diferença entre modernizar e atrapalhar." },
      { d: "App redesenhado nas telas principais", r: "porque a superfície mobile precisa falar a mesma língua. Hoje está em protótipo: a implementação ainda não entrou no roadmap." },
      { d: "Assumi a implementação do site", r: "porque a entrega estava presa a um evento com data fechada e o time de desenvolvimento não tinha janela. Fui direto ao Magento: alterei o código da home, criei e indexei as categorias, refiz cabeçalho e rodapé e ajustei os redirecionamentos." },
      { d: "Validação com gestores e diretoria", r: "porque são eles que operam o sistema. Cada versão saiu como protótipo navegável, com comentários registrados em cima das telas, e ajustada antes da versão seguinte." },
    ],
    solucao: {
      t: "A superfície inteira, sem reaprender nada",
      p: ["Plataforma redesenhada com protótipo navegável, telas principais do app em protótipo, e a página de armazenamento de energia criada para a nova linha de baterias, explicando o funcionamento do produto para um público que ainda não conhece a tecnologia."],
      slots: 3,
      shots: ["volume/assets/projetos/odex/s1.webp", "volume/assets/projetos/odex/s2.webp"],
    },
    antesDepois: {
      antes: "volume/assets/projetos/odex/antes.webp",
      depois: "volume/assets/projetos/odex/depois.webp",
      rotuloAntes: "V1", rotuloDepois: "V3",
      legenda: "Duas iterações do redesign na mesma dobra: a V1 abre em painel de metas, a V3 abre no catálogo. O percurso de quem já usava não mudou.",
    },
    resultado: {
      t: "No ar a tempo da feira",
      p: ["O site entrou em produção dentro da data do evento. A plataforma segue em andamento e o app está em protótipo."],
    },
    aprendi: {
      p: ["A tentação, num sistema assim, é reorganizar tudo de uma vez. O trabalho certo é atualizar a interface sem obrigar quem usa o produto todo dia a reaprender onde as coisas estão.",
          "E que saber mexer no código muda o que você consegue entregar. Nesse projeto foi a diferença entre chegar na feira com o site novo ou não chegar."],
    },
  },
  {
    id: "oderco-revenda", num: "04", cap: "CAP. 04", domain: "WEB", cat: "web",
    project: "Oderço", descriptor: "Página de cadastro de revenda", title: "Oderço",
    sfx: "ガチャ", cover: "volume/assets/projetos/oderco-revenda/cover.webp",
    capa: { logo: "volume/assets/marcas/branco/oderco.png", bg: "#00308F", accent: "#005AFF" },   /* capa de marca: o print não fecha em 4:5 */
    coverTall: "volume/assets/projetos/oderco-revenda/cover-tall.webp",   /* 4:5, a proporção do painel do hero */
    links: { vercel: "https://oderco-lp-revenda.vercel.app/", figma: null },
    premise: "Um formulário longo, de uma marca que o visitante nunca tinha ouvido falar.",
    role: "UX/UI Designer, do fluxo à automação",
    surface: "Landing page · formulário · RD Station",
    periodo: "Pronta, lançamento em etapas",
    year: "2026",
    fact: "Reduziu de três para dois os sistemas usados pelo comercial",
    tldr: {
      papel: "UX/UI Designer, do fluxo à automação",
      oque: "Landing page de cadastro de revenda, com formulário em etapas e automação.",
      resultado: "Reduziu de três para dois os sistemas usados pelo comercial",
    },
    problema: {
      t: "Por que eu deveria responder tudo isso?",
      p: ["O tráfego chegava de anúncio direto na página de cadastro. E a página só tinha o formulário.",
          "Isso funciona quando a pessoa já conhece a empresa. Fora da região, quase ninguém conhece. Então o visitante caía num formulário longo, de uma marca que ele nunca tinha ouvido falar, e a pergunta que ele fazia era razoável.",
          "Dois problemas somados: falta de contexto e formulário pesado demais para o nível de confiança que existia naquele momento."],
    },
    decisoes: [
      { d: "Contexto e formulário na mesma tela", r: "porque quem já está decidido preenche direto, e quem precisa entender antes rola a página e encontra o portfólio de produtos, as marcas distribuídas, o aplicativo de revenda e as empresas atendidas. A página inteira é argumento, sem nunca tirar o cadastro do campo de visão." },
      { d: "Direção visual de empresa de tecnologia", r: "porque é isso que o modelo de revenda exige que o lead acredite, e não a cara de uma distribuidora tradicional." },
      { d: "Etapas com corte proposital", r: "porque o corte foi definido pelo que a empresa precisa garantir primeiro. A etapa 1 pede e-mail e aceite dos termos: se a pessoa desistir dali em diante, o contato já existe e o comercial retoma. A etapa 2 concentra a qualificação, como área de interesse." },
      { d: "CNPJ que não trava o cadastro", r: "porque uma falha de integração não pode custar um lead. O campo aceita o novo padrão alfanumérico e busca os dados automaticamente; quando a consulta não encontra o registro, o usuário preenche e segue, e o comercial verifica depois." },
      { d: "Distribuição automática do lead", r: "porque configurei os campos personalizados e a automação no RD Station: o lead entra e é distribuído em esteira entre os vendedores responsáveis pelo primeiro contato, com régua de e-mail disparada conforme o segmento escolhido na etapa 2." },
    ],
    solucao: {
      t: "A página responde antes do formulário",
      p: ["Quem chega de anúncio sem nunca ter ouvido falar da empresa encontra, na mesma tela do formulário, o que ela distribui, para quem vende e o que o revendedor ganha com isso.",
          "Preencher deixou de ser um ato de fé e passou a ser uma decisão informada."],
      slots: 3,
      shots: ["volume/assets/projetos/oderco-revenda/s1.webp", "volume/assets/projetos/oderco-revenda/s2.webp", "volume/assets/projetos/oderco-revenda/s3.webp"],
    },
    resultado: {
      t: "Um sistema a menos no comercial",
      p: ["A operação usava três sistemas para o mesmo processo comercial. Hoje usa dois.",
          "Não era o resultado previsto. Para montar a automação, fui atrás da API do RD Station e documentei como ela funcionava. Isso mostrou ao time de desenvolvimento que a integração era mais simples do que parecia, e eles começaram a conectar o RD ao CRM interno. Um sistema saiu de cena, e o caminho agora é consolidar tudo dentro do CRM próprio, agora que o fluxo foi validado na prática com os vendedores.",
          "O lançamento é em etapas, de propósito. Primeiro ela recebe só o tráfego de anúncio, que é onde o problema aparecia com mais força, e só depois substitui a página de cadastro do site oficial. Até aqui foi testada com usuários internos e com um grupo pequeno de externos."],
      listaK: "O que será acompanhado nessa primeira fase",
      lista: ["Conclusão de cada etapa",
              "Abandono entre a etapa 1 e a etapa 2",
              "Qualidade dos leads que chegam ao comercial"],
    },
    aprendi: {
      p: ["Formulário curto não é um objetivo em si. O que importa é onde você corta. Cortar no ponto certo transforma um abandono em um contato recuperável.",
          "E a maior parte do trabalho não estava no formulário. Estava em responder, antes dele, a pergunta que o visitante fazia em silêncio: quem é essa empresa e por que eu deveria confiar nela."],
    },
  },
  {
    id: "portfolio", num: "05", cap: "CAP. 05", domain: "WEB · MANIFESTO", cat: "web",
    project: "Portfólio", descriptor: "Este volume que você está lendo", title: "Portfólio",
    sfx: "シャキーン",                  // shakiin: corte seco (este volume)
    cover: "volume/assets/projetos/portfolio/cover.webp",
    coverTall: "volume/assets/projetos/portfolio/cover-tall.webp",   /* 4:5, a proporção do painel do hero */
    links: { vercel: "https://gabrielfelix-ux.4yu.com.br/", figma: null },
    premise: "Um portfólio que se lê como um volume de mangá.",
    role: "Concepção, design e construção",
    surface: "Website · Manifesto",
    periodo: "No ar",
    year: "2026",
    fact: "Você está lendo o resultado",
    tldr: {
      papel: "Ideia, design e código, do conceito ao ar",
      oque: "Este volume: portfólio autoral desenhado e construído do zero.",
      resultado: "Este site. Mangá, tinta e brutalismo a serviço da leitura",
    },
    problema: {
      t: "Provar UX sem dizer que faço UX",
      p: ["Portfólio comum lista telas e cargos. Eu queria que a própria navegação fosse a prova: se eu te guio bem por aqui, já respondi se sei guiar um usuário.",
          "A restrição que escolhi: nada de template genérico. Tinha que ter a minha cara."],
    },
    decisoes: [
      { d: "Formato de volume de mangá", r: "porque guiar bem a leitura é a competência de UX que eu quero provar. A metáfora serve à leitura, nunca atrapalha." },
      { d: "P&B com vermelho só na interação", r: "porque em repouso é tinta no papel; a cor surge quando você age. A interface ganha vida no toque, como uma adaptação." },
      { d: "Brutalismo tipográfico (Anton, painéis, traço grosso)", r: "porque eu amo mangá e brutalismo desde cedo, e os dois pedem hierarquia óbvia e impacto, sem firula." },
    ],
    solucao: {
      t: "Capa, capítulos, processo e posfácio",
      p: ["Uma lista de capítulos, virada de página estilo mangá, motion de tinta e screentone. Caminho rápido pro recrutador, caminho profundo pra quem quer ler o case inteiro.",
          "Construído de verdade: do protótipo navegável ao site publicado."],
      /* Prints tirados do próprio site rodando, em 1600x1000 — o capítulo do
         portfólio mostra o portfólio de verdade, não uma maquete dele. */
      shots: ["volume/assets/projetos/portfolio/01-home-splash.webp",
              "volume/assets/projetos/portfolio/03-cap-capa.webp",
              "volume/assets/projetos/portfolio/02-home-capitulos.webp",
              "volume/assets/projetos/portfolio/04-cap-solucao.webp",
              "volume/assets/projetos/portfolio/05-cap-antesdepois.webp"],
    },
    resultado: {
      t: "Você está lendo o resultado",
      p: ["A leitura te trouxe até aqui. Se a navegação funcionou, o argumento se provou sozinho."],
    },
    aprendi: {
      p: ["Escolher uma metáfora forte é fácil; o difícil é não deixar ela cobrar pedágio. A cada decisão a pergunta foi a mesma: isso ajuda a ler ou só reforça que é um mangá? Quando a resposta era a segunda, saiu.",
          "E construir o próprio portfólio me devolveu o argumento que eu uso nos outros cases: protótipo na mão de alguém vale mais que opinião sobre imagem. Todo mundo que abriu isso aqui me disse alguma coisa que eu não tinha visto."],
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
  whatsapp:  { label: "WhatsApp", display: "44 99877-5978",
    href: "https://wa.me/5544998775978?text=" + encodeURIComponent("Olá, Gabriel! Vim pelo seu portfólio e estou interessado nos seus serviços de UX/UI Design.") },
  email:     { label: "E-mail", display: "gab.feelix@gmail.com", href: "mailto:gab.feelix@gmail.com" },
  linkedin:  { label: "LinkedIn", display: "/in/gabrielfeelix", href: "https://www.linkedin.com/in/gabrielfeelix/" },
  instagram: { label: "Instagram", display: "@gaabriel.feelix", href: "https://www.instagram.com/gaabriel.feelix/" },
  tiktok:    { label: "TikTok", display: "@mangudosanimes", href: "https://www.tiktok.com/@mangudosanimes" },
};
const AUTOR = "Gabriel Felix Barbosa";
const VOL = "VOL. 2026";

/* ---- trajetória de empresas + páginas dedicadas. Atual = Oderço ----
   `story` blocks: real onde sei (projetos), [assim] onde é pessoal. */
const COMPANIES = [
  {
    id: "ttt", name: "TT&T", role: "Onde comecei", period: "Início de carreira", atual: false,
    note: "Primeiros produtos de verdade", logo: null, logoInv: null,   /* sem arquivo: cai no wordmark */
    blurb: "Meu primeiro contato com produto de verdade. Onde a vontade de desenhar e construir virou ofício.",
    story: [
      { k: "O que eu fazia", p: "Pesquisa rápida, arquitetura da informação e prototipação de baixa e alta fidelidade. Peguei o ciclo inteiro, do levantamento da demanda até a documentação que o time de desenvolvimento usava pra construir." },
      { k: "O desafio", p: "Era meu primeiro contato com produto que ia pro ar de verdade. Entender que uma tela não termina no Figma, e que documentação mal escrita vira retrabalho de outra pessoa, foi o que ocupou o período." },
      { k: "O que aprendi", p: "A escrever pra quem vai implementar. Rótulo, estado vazio, o que acontece quando o campo falha: se isso não está no material, alguém decide por você, e normalmente decide no improviso." },
    ],
    skills: [
      { k: "Arquitetura da informação", p: "organização de conteúdo e navegação das primeiras telas" },
      { k: "Prototipação", p: "baixa e alta fidelidade no Figma, do rascunho ao navegável" },
      { k: "Pesquisa rápida", p: "levantamento de referência e contexto antes de desenhar" },
      { k: "Documentação e handoff", p: "especificação de estado e comportamento pro time de dev" },
    ],
    related: [],
  },
  {
    id: "locar", name: "Locarmais", capa: { logo: "volume/assets/marcas/branco/locarmais.png", bg: "#3C1354", accent: "#F43180" }, role: "Produto de verdade", period: "Produto", atual: false,
    note: "IMMO, Signamais e cia",
    logo: "volume/assets/logos/mono/locarmais.png", logoInv: "volume/assets/logos/mono-inv/locarmais.png",
    blurb: "Onde desenhei produto de verdade e aprendi o handoff de ponta a ponta.",
    story: [
      { k: "O contexto", p: "Produtos SaaS pro mercado imobiliário e de locação. Locarmais, IMMO, Locar Fácil e Signa Mais dividem time de desenvolvimento e parte da base de usuário, então decisão de interface raramente ficava presa em um sistema só." },
      { k: "O que construí", p: "O módulo financeiro do zero, que foi o projeto mais pesado do período: conciliação com cinco status, adquirentes com taxa, imposto e prazo de repasse diferentes entre si, conciliação automática, em lote e forçada com justificativa obrigatória, importação de extrato de várias origens e histórico com autoria e horário. Também a plataforma de assinatura eletrônica Signa Mais e os painéis de carteira de imobiliária." },
      { k: "O desafio", p: "Conciliação é regra de negócio densa e cada adquirente tem a sua. O caminho foi entrevistar e acompanhar o time financeiro que rodava o processo na planilha, e transformar aquilo em tela que se usa sem treinamento." },
      { k: "O resultado", p: "O módulo entrou em produção e substituiu uma plataforma de conciliação contratada. O time financeiro parou de manter planilha paralela e parou de abrir chamado pro time de dev pra tirar relatório." },
      { k: "O que aprendi", p: "Foi onde testei com usuário real do sistema, não com colega. Ver alguém travar numa tela que eu tinha como óbvia mudou meu jeito de escrever rótulo e de ordenar campo." },
    ],
    skills: [
      { k: "Mapeamento de processo", p: "entrevista e acompanhamento do time financeiro em operação" },
      { k: "Regra de negócio em tela", p: "conciliação multi-adquirente com cinco status e trilha de auditoria" },
      { k: "Teste com usuário real", p: "usuários do próprio sistema, não usuário proxy" },
      { k: "Dashboard e indicador", p: "carteira, aproveitamento de contrato, meta e churn" },
      { k: "Handoff", p: "documentação de fluxo e apoio ao refinamento e QA" },
    ],
    related: ["locarmais", "signamais", "immo"],
  },
  {
    id: "oderco", name: "Grupo Oderço", capa: { logo: "volume/assets/marcas/branco/oderco.png", bg: "#00308F", accent: "#005AFF" }, role: "Design de um time de marcas", period: "Atual", atual: true,
    note: "PCYES, Odex, Tonante, Vinik, Skul",
    logo: "volume/assets/logos/mono/oderco.png", logoInv: "volume/assets/logos/mono-inv/oderco.png",
    blurb: "Hoje. Toco o design de um time inteiro de marcas, do e-commerce ao SaaS.",
    story: [
      { k: "O contexto", p: "Distribuidora nacional de eletrônicos com cinco marcas próprias (PCYES, Vinik, Skul, Odex e Tonante), cada uma com público e canal diferente, mais as frentes de sistema interno. Sou o designer da casa, então a fila e a priorização também são minhas." },
      { k: "O que construí", p: "O redesign do e-commerce PCYES, incluindo a biblioteca de componentes e a paleta que sustentam o site inteiro. A interface da plataforma Odex e a página de armazenamento de energia da linha de baterias. A página de cadastro de revenda da Oderço, com formulário em duas etapas e consulta automática de CNPJ." },
      { k: "O desafio", p: "No PCYES a diretoria queria direção minimalista focada em valor de marca, e as métricas pediam caminho de compra mais curto. Levei gravação de sessão pra conversa e propus separar as duas camadas em vez de escolher entre elas: a marca aparece em momentos definidos e o produto ocupa o eixo da página. O modelo foi aprovado assim." },
      { k: "O que aprendi", p: "Na página de armazenamento o time de dev não tinha janela e a feira tinha data, então implementei direto no Magento: alterei a home, criei e indexei categoria, refiz header e footer e ajustei redirecionamento. Desenhar sabendo o que custa implementar mudou o que eu proponho." },
      { k: "Efeito colateral", p: "Ao documentar a API do RD Station pra automação da esteira de lead, o time de desenvolvimento viu que dava pra conectar o RD ao CRM interno. A operação usava três sistemas em paralelo e passou a usar dois." },
    ],
    skills: [
      { k: "Design System", p: "biblioteca de componentes e paleta do PCYES, aplicadas em todo o site" },
      { k: "E-commerce e checkout", p: "checkout reconstruído, carrinho na vitrine, coluna de preço fixa" },
      { k: "Gravação de sessão", p: "Microsoft Clarity pra achar onde a compra travava, e pra sustentar decisão" },
      { k: "Implementação", p: "Magento na mão quando o prazo não esperava o time de dev" },
      { k: "Automação de marketing", p: "RD Station: campo personalizado, esteira de lead e régua por segmento" },
      { k: "Acessibilidade", p: "VLibras, contraste e padronização de foto de produto" },
    ],
    related: ["pcyes", "odex", "tonante"],
  },
];

/* ---- certificados (Posfácio). Gabriel troca por links/imagens ------ */
const CERTS = [
  /* ux-balas: derivado do slide de abertura do curso — lockup recortado e
     repintado em tinta sobre papel, na mesma convenção dos outros quatro. */
  { id: "ux-balas",  title: "UX à prova de balas",  issuer: "Certificação",  href: null, logo: "volume/assets/certs/ux-balas.png" },
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

/* ---- a faixa completa: toda empresa e cliente por onde o design passou.
   `logo` só onde o arquivo existe de verdade no repo; o resto entra como
   wordmark tipográfico (honesto, monocromático, mesma altura óptica).
   Os logos apontam pra marcas/mono/: a mesma marca em tinta sobre fundo
   TRANSPARENTE. Os originais coloridos ficam em marcas/ e seguem servindo
   os cards de projeto (.eq-logo), que mostram a marca em cor.
   Pra promover um wordmark a logo: solte o PNG colorido em marcas/ e rode
   de novo a conversão mono (luminância -> alpha, normalizada, em tinta).
   Fundo opaco no arquivo vira retângulo visível dentro do chip. --------- */
const ALL_MARKS = [
  { id: "oderco",    name: "Grupo Oderço",  logo: "volume/assets/marcas/mono/oderco.png" },
  { id: "pcyes",     name: "PCYES",         logo: "volume/assets/marcas/mono/pcyes.png" },
  { id: "odex",      name: "Odex",          logo: "volume/assets/marcas/mono/odex.png" },
  { id: "tonante",   name: "Tonante",       logo: "volume/assets/marcas/mono/tonante.png" },
  { id: "vinik",     name: "Vinik",         logo: "volume/assets/marcas/mono/vinik.png" },
  { id: "skul",      name: "Skul",          logo: null },
  { id: "azux",      name: "Azux",          logo: null },
  { id: "quati",     name: "Quati",         logo: null },
  { id: "locarmais", name: "Locarmais",     logo: "volume/assets/marcas/mono/locarmais.png" },
  { id: "immo",      name: "IMMO",          logo: null },
  { id: "signamais", name: "Signamais",     logo: null },
  { id: "ttt",       name: "TT&T",          logo: null },
  { id: "isabella",  name: "Isabella Pires",logo: "volume/assets/marcas/mono/isabella.png" },
  { id: "kitamo",    name: "Kitamo",        logo: null },
  { id: "4yu",       name: "4YU MKT",       logo: null },
  { id: "argel",     name: "CT Argel Riboli", logo: null },
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
   itens do índice, que linkam direto pro trabalho publicado. */
/* the volume reads as 4 chapters + 1 extra; every other project is a
   "peça": it lives in the Outras peças index, never opens a case page. */
const CASE_ORDER = ["pcyes", "locarmais-conciliacao", "odex", "oderco-revenda"];
const EXTRA_ID = "portfolio";
const CASE_IDS = CASE_ORDER.concat([EXTRA_ID]);
function isCase(p) { return CASE_IDS.indexOf(typeof p === "string" ? p : p.id) >= 0; }

/* ---- O VOLUME INTEIRO ---------------------------------------------
   Capítulo abre case. Peça não: ela leva direto ao trabalho publicado.
   `destino` diz o que o visitante encontra do outro lado, e peça SEM link
   não entra no índice — nome sem destino frustra quem clica. */
const PROJECTS = [
  /* ---- os 5 capítulos, na ordem de leitura ------------------------- */
  { id: "pcyes", title: "PCYES V2", cat: "ecommerce", domain: "E-commerce · Magento", fav: true, chapterId: "pcyes",
    desc: "Redesign do e-commerce", cover: "volume/assets/projetos/pcyes/cover.webp",
    links: { vercel: "https://pcyes-v3-codigo-fonte.vercel.app/", figma: "https://www.figma.com/design/A0Zg3I15KcYI82zZocmyjD/PCYES-V2--DS-?node-id=0-1&t=dk2knegACkkGkGEI-1" } },
  { id: "locarmais-conciliacao", title: "Locar Mais", cat: "saas", domain: "SaaS · Gestão", fav: true, chapterId: "locarmais-conciliacao",
    desc: "Módulo de conciliação financeira", links: { vercel: null, figma: null } },
  { id: "odex", title: "ODEX", cat: "desktop", domain: "Desktop e Web", fav: true, chapterId: "odex",
    desc: "Redesign de interface", cover: "volume/assets/projetos/odex/cover.webp",
    links: { vercel: "https://ux-oderco.vercel.app/odex/plataforma/v3", figma: "https://www.figma.com/design/0nApyM8W4IgRwr64pSOfWg/DS--ODEX-?node-id=0-1&t=vAP1IrCmMOrbbiEy-1" } },
  { id: "oderco-revenda", title: "Oderço", cat: "web", domain: "Web · Landing page", fav: true, chapterId: "oderco-revenda",
    desc: "Página de cadastro de revenda", cover: "volume/assets/projetos/oderco-revenda/cover.webp", links: { vercel: "https://oderco-lp-revenda.vercel.app/", figma: null } },
  { id: "portfolio", title: "Portfólio", cat: "web", domain: "Website · Manifesto", fav: false, chapterId: "portfolio",
    desc: "Este volume que você está lendo", cover: "volume/assets/projetos/portfolio/cover.webp",
    links: { vercel: "https://gabrielfelix-ux.4yu.com.br/", figma: null } },

  /* ---- outras peças: entram no índice e linkam pro próprio trabalho -- */
  { id: "oderco-checkout", title: "Checkout Oderço", cat: "ecommerce", domain: "E-commerce · B2B", fav: false, chapterId: null,
    desc: "Checkout B2B por nota fiscal, em etapas com revisão", destino: "proto",
    cover: "volume/assets/projetos/checkout/cover.webp",
    links: { vercel: "https://ux-oderco.vercel.app/oderco/checkout/v1/checkout?nf=PR", figma: null } },
  { id: "hub-oderco", title: "Hub Oderço", cat: "saas", domain: "SaaS · Ferramenta", fav: false, chapterId: null,
    desc: "Hub que gera material e descrição de produto para 7 marcas", destino: "ar",
    cover: "volume/assets/projetos/hub/cover.webp",
    links: { vercel: "https://powderblue-elephant-709864.hostingersite.com/", figma: null } },
  { id: "ponto-admin", title: "Worklife", cat: "saas", domain: "SaaS + App · Ponto", fav: false, chapterId: null,
    desc: "Gestão de ponto: painel do gestor e app do diarista", destino: "proto",
    cover: "volume/assets/projetos/ponto/cover.webp",
    links: { vercel: "https://ponto-snowy.vercel.app", figma: null } },
  { id: "kitamo-app", title: "Kitamo", cat: "mobile", domain: "SaaS · Finanças", fav: false, chapterId: null,
    desc: "Visibilidade de dívida e projeção de contas do mês", destino: "ar",
    cover: "volume/assets/projetos/kitamo/cover.webp",
    links: { vercel: "https://kitamo.com.br/", figma: null } },
  { id: "isabella", title: "Isabella Pires", cat: "web", domain: "Website · Arquitetura", fav: false, chapterId: null,
    desc: "Site institucional de arquitetura, do portfólio ao contato", destino: "ar",
    cover: "volume/assets/projetos/isabella/cover.webp",
    links: { vercel: "https://isabellapiresarquitetura.com.br/", figma: null } },
  { id: "locarmais-site", title: "Locarmais", cat: "web", domain: "Website · Fiança digital", fav: false, chapterId: null,
    desc: "Site da fiadora digital, um pitch para três públicos", destino: "ar",
    cover: "volume/assets/projetos/locarmais/cover.webp",
    links: { vercel: "https://site.locarmais.com/", figma: null } },
  { id: "signamais", title: "Signamais", cat: "saas", domain: "SaaS · Assinaturas", fav: false, chapterId: null,
    desc: "Plataforma de assinaturas", destino: "proto",
    cover: "volume/assets/projetos/signamais/cover.webp",
    links: { vercel: "https://notify-cleat-99358726.figma.site/", figma: null } },

  /* ---- fora do índice até terem link publicado ----------------------
     Regra do briefing: nome sem destino frustra quem clica. Basta
     preencher `links.vercel` e o item volta a aparecer sozinho. */
  { id: "rodape", title: "Rodapé", cat: "mobile", domain: "App · Android", fav: false, chapterId: null,
    desc: "App de clube de leitura, publicado na Play Store", destino: "figma",
    links: { vercel: null, figma: "https://www.figma.com/design/1ruVWABUF6B5VibTVF430q/Untitled?node-id=0-1&t=OK5Z4v9Mv4likK9K-1" } },
  { id: "remoctrl", title: "Remoctrl", cat: "desktop", domain: "Web app · Controle de TV", fav: false, chapterId: null,
    desc: "Controle de Smart TV Roku pelo navegador, sem instalar nada", destino: "ar",
    links: { vercel: "https://remoctrl.vercel.app/", figma: null } },
  { id: "traxium", title: "Traxium", cat: "saas", domain: "SaaS", fav: false, chapterId: null,
    desc: "Compliance agrologístico de exportação: EUDR, IDTF e TRACES NT", destino: "proto",
    links: { vercel: "https://traxium-prototipo.vercel.app/Torre%20de%20Controle%20v2.dc.html", figma: null } },
  { id: "dropchina", title: "DropChina", cat: "ecommerce", domain: "E-commerce · Shopify", fav: false, chapterId: null,
    desc: "Loja Shopify com catálogo montado por script", destino: "ar",
    links: { vercel: "https://dropchinaoficial.com.br/", figma: null } },
  { id: "web2design", title: "Web2Design", cat: "web", domain: "Ferramenta · Design", fav: false, chapterId: null,
    desc: "Extensão + plugin Figma: a web vira camada editável", links: { vercel: null, figma: null } },
  { id: "argel", title: "CT Argel Riboli", cat: "mobile", domain: "App · Boxe", fav: false, chapterId: null,
    desc: "Gestão de CT de boxe: plataforma e app do aluno", links: { vercel: null, figma: null } },
  { id: "solar-site", title: "Solar Buy-Side", cat: "web", domain: "Website · LP", fav: false, chapterId: null,
    desc: "Landing de captação", links: { vercel: null, figma: null } },
  { id: "4yu", title: "4YU MKT", cat: "web", domain: "Website · LP", fav: false, chapterId: null,
    desc: "Landing de conversão para método de vendas", destino: "ar",
    links: { vercel: "https://4yumkt.com.br/", figma: null } },
  { id: "immo", title: "IMMO", cat: "saas", domain: "SaaS", fav: false, chapterId: null,
    desc: "Produto da Locarmais", links: { vercel: null, figma: null } },
];

/* peça só aparece no índice quando tem para onde levar */
function pieceLink(p) { return (p.links && (p.links.vercel || p.links.figma)) || null; }

/* tag shown on a project cover: chapters carry their CAP number */
function projTag(p) {
  const piece = LANG === "en" ? "PIECE" : "PEÇA";   // LANG: i18n.jsx, resolved at call time
  if (!p.chapterId || !isCase(p)) return piece;
  const c = CHAPTERS.find((x) => x.id === p.chapterId);
  return c ? c.cap : piece;
}
/* the reading spine: 4 chapters then the extra, in order */
function caseProjects() { return CASE_IDS.map((id) => PROJECTS.find((p) => p.id === id)).filter(Boolean); }
/* everything else — the Outras peças index */
/* A vitrine das outras peças tem ordem editorial: as seis primeiras são
   escolha do Gabriel; o resto segue a ordem em que está em PROJECTS. */
const PIECE_ORDER = ["signamais", "dropchina", "4yu", "kitamo-app", "remoctrl", "traxium"];
function pieceProjects() {
  const lista = PROJECTS.filter((p) => !p.hidden && !isCase(p) && pieceLink(p));
  const rank = (p) => { const i = PIECE_ORDER.indexOf(p.id); return i < 0 ? PIECE_ORDER.length : i; };
  return lista.slice().sort((a, b) => rank(a) - rank(b) || lista.indexOf(a) - lista.indexOf(b));
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
/* Only the 4 chapters + the extra open a case page. A peça has no case:
   chapterFor returns null, which is what routes a stale #/cap/<id> to 404
   and what keeps the índice from offering a page that doesn't exist. */
function chapterFor(id) {
  if (!isCase(id)) return null;
  const c = CHAPTERS.find((x) => x.id === id);
  if (c) return c;
  const p = PROJECTS.find((x) => x.id === id);
  return p ? synthChapter(p) : null;
}
/* next chapter walks the reading spine, not the whole project list */
function nextProjectId(id) {
  const i = CASE_IDS.indexOf(id);
  if (i < 0) return null;
  return CASE_IDS[(i + 1) % CASE_IDS.length];
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
    // sem IntersectionObserver (impressão, motores antigos): nunca esconda
    // conteúdo atrás de um reveal que não vai disparar
    if (!("IntersectionObserver" in window)) { setSeen(true); return; }
    // O threshold e uma FRACAO DO PROPRIO ELEMENTO, e um elemento mais
    // alto que a tela nunca alcanca a sua. O beat da `solucao` mede
    // 3.233px em 1440 (ratio maximo 0,28: passa raspando) e 4.049px em
    // 1920, onde o maximo cai para 0,22 e empata com o gatilho. Resultado
    // medido: o `.panel text` do climax ficava em opacity 0 PARA SEMPRE,
    // 710px de vao no lugar do texto, com build verde e console limpo.
    // E a terceira vez que a armadilha do `.beat .panel { opacity: 0 }`
    // morde neste projeto -- ver docs/HANDOFF.md.
    //
    // Nao adianta so conferir a posicao dentro do callback: o observer so
    // CHAMA o callback ao cruzar um threshold, e um elemento gigante nao
    // cruza mais nenhum depois de entrar. Quem tem que ceder e o gatilho.
    // O teto real e (altura da raiz / altura do elemento); 0,7 dele deixa
    // margem para a raiz encolher pelo rootMargin sem empatar de novo.
    const alvo = opts.threshold ?? 0.22;
    const alto = el.offsetHeight || 0;
    const raiz = window.innerHeight;
    const gatilho = alto > raiz ? Math.max(0.02, (raiz / alto) * 0.7) : alvo;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { threshold: gatilho, rootMargin: opts.rootMargin ?? "0px 0px -8% 0px" });
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
  // A máscara vai num span INTERNO, não no próprio título. Máscara CSS
  // recorta na border box, e o acento do Anton (Ó chega a 1.10em acima da
  // baseline) fica fora dela com line-height < 1 — era isso que comia o
  // acento de SUMÁRIO, AS DECISÕES, PORTFÓLIO. O span ganha folga própria
  // no topo e devolve a mesma medida em margem negativa, então o layout
  // não muda em lugar nenhum e nenhuma regra de margem precisa ser mexida.
  return (
    <Tag ref={ref} className={`brush-host ${className}`} {...rest}>
      <span className={`brush ${inked ? "inked" : ""}`}>{children}</span>
    </Tag>
  );
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
function MangaPlate({ dark = false, className = "", label = true }) {
  return (
    <span className={`plate ${dark ? "on-ink" : ""} ${className}`} aria-hidden="true">
      {label ? <span className="plate-tag">{t("print a subir", "screenshot pending")}</span> : null}
    </span>
  );
}

/* ---- BrandPlate: a marca sobre a cor dela, com retícula de mangá -----
   Usada onde o print não conta a história sozinho: capa dos capítulos na
   home, miniatura do "Próximo capítulo" e card de empresa. Um só desenho
   nos três lugares — a capa de marca é idioma, não exceção. */
function BrandPlate({ capa, className = "" }) {
  if (!capa) return null;
  return (
    <span className={`brandplate ${className}`} style={{ background: capa.bg }} aria-hidden="true">
      <span className="bp-tone" style={{ color: capa.accent || "#fff" }}></span>
      <img className="bp-logo" src={capa.logo} alt="" draggable="false" />
    </span>
  );
}

/* sem arquivo de logo (ou com o arquivo quebrado): o nome do certificado
   posto como tipografia, não uma chapa cinza que lê como imagem quebrada */
function CertPlate({ title }) {
  return (
    <span className="cert-plate" aria-hidden="true">
      <span className="cp-mark">{title}</span>
    </span>
  );
}
function CertThumb({ cert }) {
  const [err, setErr] = useState(false);
  if (!cert.logo || err) return <CertPlate title={cert.title} />;
  return <img className="cert-logo" src={cert.logo} alt={`Logo ${cert.title}`}
              loading="lazy" draggable="false" onError={() => setErr(true)} />;
}

/* Protótipo e design system, cada um só quando existe link publicado. O
   placeholder "[Figma]" continua fora: botão sem destino prometia o que não
   havia. Sem nenhum dos dois links, a chamada inteira não renderiza. */
function ProtoLinks({ links = {}, onInk }) {
  const vercel = links && links.vercel;
  const figma = links && links.figma;
  if (!vercel && !figma) return null;
  return (
    <div className="proto-links btn-row">
      {vercel ? (
        <a className="btn btn-primary proto-live" href={vercel} target="_blank" rel="noreferrer"
           onClick={() => { if (onInk) onInk(); }}>
          {t("Ver protótipo", "See prototype")} <span className="ext" aria-hidden="true">↗</span>
        </a>
      ) : null}
      {figma ? (
        <a className="btn btn-secondary proto-figma" href={figma} target="_blank" rel="noreferrer"
           onClick={() => { if (onInk) onInk(); }}>
          {t("Ver design system", "See design system")} <span className="ext" aria-hidden="true">↗</span>
        </a>
      ) : null}
    </div>
  );
}

/* A logo da empresa em duas versões: tinta sobre transparente pros fundos
   de papel, papel sobre transparente pros fundos de tinta (capa da empresa,
   card da empresa atual). O arquivo colorido com fundo chapado desenhava um
   retângulo recortado por cima da tinta. Sem arquivo, cai no wordmark. */
function CompanyLogo({ company, kind = "qsc", dark = false }) {
  const [err, setErr] = useState(false);
  const src = dark ? (company.logoInv || company.logo) : company.logo;
  if (src && !err) {
    return <img className={`co-logo-img ${dark ? "on-ink" : ""}`} src={src} alt={`Logo ${company.name}`}
                draggable="false" onError={() => setErr(true)} />;
  }
  return <span className={`${kind}-logo-mark`}>{company.name}</span>;
}

Object.assign(window, { PH, CHAPTERS, PROJECTS, CASE_ORDER, EXTRA_ID, CASE_IDS, isCase, caseProjects, pieceProjects, CertPlate, CertThumb, ALL_MARKS, pieceLink, projTag, projDescriptor, projById, chapterFor, nextProjectId, PROCESSO, CONTATO, AUTOR, VOL, CATS, COMPANIES, CERTS, Seal, useReveal, Beat, Brush, MorphWord, InkBlob, MangaPlate, ProtoLinks, sfxRo, CompanyLogo, BRAND_LOGOS, brandLogo, BrandPlate });
