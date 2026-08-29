/* Textos que a V2 precisa e que a V1 NÃO publica em window.
 *
 * Contrato do projeto: nada de texto é reescrito e data.jsx é a fonte única.
 * Isso vale para tudo que passa por `window` (capítulos, projetos, processo,
 * empresas, contato). Só que a copy do hero e do manifesto mora dentro de
 * componentes congelados, que não exportam nada:
 *
 *   hero      → volume/Capa.jsx, componente Splash
 *   manifesto → volume/Posfacio.jsx, blocos pos-p
 *
 * Como volume/* é congelado, a alternativa seria editar lá para publicar as
 * strings, o que o handoff proíbe. Então elas são copiadas aqui LITERALMENTE,
 * sem uma palavra mudada, com a origem anotada. Se um dia data.jsx passar a
 * publicá-las, este arquivo morre e content.js assume.
 *
 * Regra ao editar: mudou lá, muda aqui. Não escreva texto novo neste arquivo.
 */

/* volume/Capa.jsx · Splash: <h1 className="splash-h"> */
export const HERO = {
  linha1: "Product Designer",
  linha2: "que leva",
  /* volume/Capa.jsx · <RotateWord items={...} /> */
  rotativas: [
    "a pesquisa à tela",
    "o dado à decisão",
    "a dúvida ao teste",
    "a ideia ao ar",
  ],
  /* volume/Capa.jsx · <p className="splash-sub"> */
  sub: ["Antes de desenhar, eu assisto ", "sessão de usuário", ". É de lá que saem as decisões."],
  papel: "UX / Product Designer",
};

/* volume/Posfacio.jsx · blocos <p className="pos-p"> da coluna "como eu trabalho".
   O parágrafo do meio entra cortado no ponto final de "informação": o resto
   dele fala de IA, e a regra de copy do Gabriel é não vender isso. Nenhuma
   palavra foi trocada, só houve corte. */
/* A declaração da home. É o MANIFESTO condensado numa frase só, na voz que
   ele já tinha: nada aqui foi inventado, só cortado. O MANIFESTO inteiro
   continua abaixo porque migra para /sobre numa fase futura.

   Corte de 28/08: a primeira frase era "Nunca consegui pensar design e
   código como duas coisas separadas". Ela saiu porque
   docs/DIAGNOSTICO-TEXTO-2026-08-27.md, no adendo da home, mede que a home
   argumenta "eu também codo" nove vezes e conclui que ela precisa argumentar
   julgamento de design. A menção ao build sobrevive uma vez só, na frase de
   assinatura da dobra 06. O que sobrou É um argumento de julgamento, e ainda
   encolhe a dobra de 1896px para o tamanho de uma frase. */
/* Corte de 29/08, segunda volta: era uma frase só, e o par esquerda/direita a
   partia no meio ("...porque opinião sobre" | "imagem estática é gosto..."),
   então a metade da direita começava sem sujeito. Cortar em duas sentenças
   curtas resolveu a leitura e criou outro problema, medido em print: duas
   linhas soltas num display de 88px deixam a dobra apertada e sem corpo.

   A forma agora é a do viper na seção de intro, que o Gabriel mandou como
   referência em 29/08: um bloco fechado por lado, cada um com cromo, uma
   linha em display e um parágrafo de leitura embaixo. O da esquerda é o
   protótipo, o da direita é o ajuste. Um não continua o outro: são as duas
   metades do mesmo trabalho, e cada uma pode ser lida sozinha.

   O texto continua saindo inteiro de volume/Posfacio.jsx, só recortado e
   redistribuído: nenhuma palavra é nova. O asterisco marca a palavra que sai
   no vermelho do avião (--v2-accent) e nunca chega ao DOM. */
export const DECLARACAO = [
  {
    olho: "O protótipo",
    frase: "Coloco uma tela clicável na mão das pessoas *cedo*.",
    nota:
      "Opinião sobre imagem estática costuma ser gosto, e opinião sobre uma " +
      "coisa que a pessoa tentou usar costuma ser informação.",
  },
  {
    olho: "O ajuste",
    frase: "A parte demorada do meu trabalho é o *ajuste*.",
    nota: "É ajuste, e mais ajuste, e é a parte que eu não abro mão.",
  },
];

export const MANIFESTO = {
  lead:
    "Nunca consegui pensar design e código como duas coisas separadas. " +
    "Quando o prazo aperta, eu mesmo implemento.",
  colunas: [
    "Gosto de colocar uma tela clicável na mão das pessoas cedo, porque opinião sobre imagem estática costuma ser gosto, e opinião sobre uma coisa que a pessoa tentou usar costuma ser informação.",
    "Depois disso é ajuste, e mais ajuste. A parte demorada do meu trabalho é essa, e é a parte que eu não abro mão.",
  ],
};

/* As tres frases do processo na home. Condensam as seis etapas de PROCESSO em
   volume/data.jsx sem inventar processo novo: seis linhas numeradas eram um
   indice disfarcado de conteudo. As seis continuam la, para /processo. */
/* Os titulos saem do proprio titulo da dobra, "Do objetivo ao ar": objetivo,
   protótipo, no ar. Nao e nome novo, e a frase da dobra desmontada em tres.
   As sentencas sao as mesmas de antes, palavra por palavra. */
export const PROCESSO_CURTO = [
  {
    titulo: "Objetivo",
    frase: "Começo pelo objetivo, não pela lista de telas, e caço o que já funciona antes de desenhar.",
  },
  {
    titulo: "Protótipo",
    frase: "Do objetivo ao protótipo clicável em dias, para a mesa tocar em vez de imaginar.",
  },
  {
    titulo: "No ar",
    frase: "Mostro cedo, corto o que não serve, e o protótipo vira produto no ar.",
  },
];


/* Capas cheias.

   Quando o caso tem arte de capa pronta, a chapa de cor, o degradê e a tela
   flutuante saem: a imagem ocupa o quadro inteiro, sangrando, na razão 16/11
   do cartão. O mapa mora aqui e não em volume/data.jsx de propósito: data.jsx
   é o arquivo que a V1 publica em produção, e a V2 não pode obrigá-lo a mudar
   para ganhar um campo que só ela lê.

   Medida: 1696 x 1166 é o dobro do maior tamanho em que o cartão renderiza
   (848 x 583, em janela de 1920). O arquivo atual mede 1513 x 1040, que é a
   mesma razão e cobre 1.78x. */
export const CAPAS_CHEIAS = {
  pcyes: "/volume/assets/projetos/pcyes/capa-home.webp",
  "locarmais-conciliacao": "/volume/assets/projetos/locarmais/capa-home.webp",
  odex: "/volume/assets/projetos/odex/capa-home.webp",
  "oderco-revenda": "/volume/assets/projetos/oderco-revenda/capa-home.webp",
};

/* A capa do hero da página de caso.

   O cartão da home e o hero do caso pedem arte diferente. O cartão é 16/11 e
   pequeno, então quer aparelho grande e cena curta; o hero é a tela inteira em
   16/9, e a mesma arte ampliada vira aparelho gigante com a cena espremida.

   Quem estiver aqui manda no hero. Quem não estiver cai em CAPAS_CHEIAS, que
   é como as quatro páginas funcionavam até agora.

   Formato: 16/9, zona segura entre 20% e 85% na horizontal e 8% e 80% na
   vertical, e o canto inferior esquerdo (45% x 40%) livre de aparelho, que é
   onde o título gigante entra. */
export const CAPAS_CASO = {
  pcyes: "/volume/assets/projetos/pcyes/capa-caso.webp",
  odex: "/volume/assets/projetos/odex/capa-caso.webp",
  "oderco-revenda": "/volume/assets/projetos/oderco-revenda/capa-caso.webp",
  "locarmais-conciliacao": "/volume/assets/projetos/locarmais/capa-caso.webp",
};

/* As marcas das empresas, em cor, para a dobra 05.

   volume/data.jsx aponta COMPANIES[].logo para a versão monocromática, que é
   o que a V1 usa. Aqui a marca é o único elemento visual da dobra, e em preto
   ela lê como ícone de lista; em cor ela lê como empresa. Os arquivos já
   existem em volume/assets/logos/, com fundo branco, que é o mesmo branco do
   papel da página.

   Fica na V2 pelo mesmo motivo de CAPAS_CHEIAS: data.jsx é o arquivo que a V1
   publica, e a V2 não pode obrigá-lo a mudar. Quem não estiver aqui cai no
   logo mono e, na falta dele, no wordmark. */
export const LOGOS_COR = {
  locar: "/volume/assets/logos/locarmais.png",
  oderco: "/volume/assets/logos/oderco.png",
};

/* ================================================================== /sobre

   A página /sobre é o Posfácio da V1 remontado na gramática da V2. Nenhuma
   frase foi escrita aqui: cada bloco abaixo é cópia literal de
   volume/Posfacio.jsx, com a origem anotada linha a linha, na mesma regra
   que vale para HERO e MANIFESTO no topo deste arquivo.

   Três cortes, e só três, todos por regra de copy já escrita:

   1. o parágrafo "Esse portfólio é um mangá de propósito" ficou de fora: a
      metáfora é da V1, e a V2 não é um mangá;
   2. o meio de "Gosto de colocar uma tela clicável" entra cortado no ponto
      final de "informação", igual ao MANIFESTO acima, porque o resto fala de
      IA e a regra do Gabriel é não vender isso;
   3. a lista de cursos some do parágrafo da virada, porque a dobra de
      formação logo abaixo imprime os cinco certificados de CERTS. */

/* volume/Posfacio.jsx · <p className="pos-hand"> */
export const SOBRE_OI = "oi, eu sou o Gabriel.";

/* v2/Home.jsx · a frase da dobra 06, que é onde a home apresenta a pessoa.
   Repetida aqui de propósito: é a mesma posição na página, e a /sobre é a
   versão longa da mesma dobra. */
export const SOBRE_PREMISSA =
  "Designer de produto em Maringá, que aprende o problema antes de abrir " +
  "o Figma e implementa quando o prazo aperta.";

/* volume/Posfacio.jsx · seção "Como eu trabalho". O primeiro parágrafo virou
   lead do cabeçalho por ser o argumento de julgamento, que é o que
   docs/DIAGNOSTICO-TEXTO-2026-08-27.md pede que a página defenda. */
export const SOBRE_TRABALHO = {
  lead:
    "Gosto de colocar uma tela clicável na mão das pessoas cedo, porque " +
    "opinião sobre imagem estática costuma ser gosto, e opinião sobre uma " +
    "coisa que a pessoa tentou usar costuma ser informação.",
  paras: [
    "Depois disso é ajuste, e mais ajuste. A parte demorada do meu trabalho é essa, e é a parte que eu não abro mão.",
    "Nunca consegui pensar design e código como duas coisas separadas. Quando o prazo aperta, eu mesmo implemento.",
  ],
};

/* volume/data.jsx · CHAPTERS, pcyes: campo `fact`. É a frase mais forte do
   portfólio inteiro e, até aqui, só existia enterrada no capítulo 1. Entra
   com a origem visível, porque frase sem caso é slogan. */
export const SOBRE_CITACAO = {
  q: "Contrariei o briefing com gravação de sessão na mão, e a direção oposta foi a aprovada.",
  f: "PCYES V2 · Grupo Oderço · 2026",
};

/* volume/Posfacio.jsx · seção "Como eu cheguei aqui" (bloco .pt-text). */
export const SOBRE_VIRADA = [
  "Eu estava no fim do curso de Direito na UEM quando a pandemia parou tudo. Para ocupar a cabeça, montei um e-commerce só para aprender a mexer.",
  "Foi ali que a coisa virou. Não me peguei gostando só das telas: gostei da engenharia de fazer um sistema existir, de tirar algo do nada e botar de pé.",
  "Larguei o Direito, me formei em Design Gráfico, fui atrás de curso de UX e tirei a certificação Scrum para andar no ritmo de time ágil. Comecei na TT&T, desenhei produto na Locarmais, e hoje toco o design de um time inteiro de marcas no Grupo Oderço.",
];

/* volume/Posfacio.jsx · seção "Fora da tela". O terceiro parágrafo cita dois
   dos aplicativos que já estão em PROJECTS: "Deixei Aqui" e "Quanto Cobro".
   O link do TikTok sai de CONTATO, não daqui. */
export const SOBRE_FORA = [
  "Corro, treino boxe há dois anos e jogo vôlei toda semana num time amador aqui em Maringá.",
  { pre: "Leio mangá e manhwa numa quantidade difícil de justificar, e mantenho um canal sobre anime. Se quiser conferir o que eu ando assistindo, ", link: "tá aqui", pos: "." },
  "Também construo aplicativo por hobby. Costumo fazer só os que resolvem algum problema meu: tem um que lembra onde eu estacionei o carro, e outro que ajuda freelancer a calcular quanto cobrar por hora.",
];

/* volume/Posfacio.jsx · seção "Para onde eu vou". É a única frase da página
   endereçada a quem contrata, e por isso fecha. */
export const SOBRE_ADIANTE =
  "Quero trabalhar em produto maior, com gente que sabe mais que eu, e estar " +
  "mais perto de onde as decisões são tomadas.";

/* volume/Posfacio.jsx · <p className="pos-hand"> do fim. */
export const SOBRE_OBRIGADO = "obrigado por ler até aqui.";

/* As ferramentas.

   Só entra ferramenta que já aparece escrita em volume/data.jsx, nos `skills`
   das empresas ou no corpo dos capítulos: nenhuma foi acrescentada de
   memória. Uma linha em mono, e não uma grade de ícones, porque grade de
   ícone de ferramenta é o componente mais copiado de portfólio que existe e
   não diz nada que a lista não diga. */
export const SOBRE_FERRAMENTAS = [
  "Figma", "FigJam", "Magento", "RD Station", "Microsoft Clarity", "GA4", "Trello",
];
