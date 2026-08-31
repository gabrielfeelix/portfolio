import { espelho } from "./i18n.js";
import * as EN from "./copy.en.js";

/* `tr` aplica o espelho inglês sobre a copy portuguesa deste arquivo.
 *
 * Fica AQUI e não em cada componente porque a fonte da verdade é uma só: quem
 * importa `HERO` recebe o hero do idioma da vez, sem precisar saber que
 * existem dois. Nenhum `.jsx` do site muda por causa do inglês.
 *
 * A mescla é profunda de propósito — o espelho em site/copy.en.js só carrega
 * o que muda, e o que ele não diz (caminho de imagem, chave de layout) fica.
 * A conta está no comentário de `mescla`, em site/i18n.js.
 *
 * O que não passa por `tr` também é decisão: CAPAS_*, LOGOS_COR e
 * SOBRE_FERRAMENTAS são caminho de arquivo e nome próprio, e MANIFESTO e
 * PROCESSO_CURTO estão mortos desde 30/08 — traduzir código morto é criar
 * texto para alguém manter à toa. */
const tr = (chave, pt) => espelho(pt, EN[chave]);

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
export const HERO = tr("HERO", {
  linha1: "Product Designer",
  linha2: "que leva",
  /* volume/Capa.jsx · <RotateWord items={...} />
     As quatro que a V1 rodava. Ficam como registro do que já esteve no ar;
     a home usa `fixa` desde 30/08. */
  rotativas: [
    "a pesquisa à tela",
    "o dado à decisão",
    "a dúvida ao teste",
    "a ideia ao ar",
  ],
  /* A home parou de sortear a promessa.
   *
   * Motivo, da auditoria de triagem de 30/08: numa leitura e num print
   * tirados com segundos de diferença, o H1 dizia duas coisas diferentes.
   * A frase mais importante do site era um alvo móvel, então quem tira
   * print para mandar no time captura uma promessa sorteada entre quatro.
   *
   * "o dado à decisão" é a que fica porque é a única das quatro que o resto
   * do site prova com número: o funil do /processo e o trimestre de GA4 do
   * PCYES. As outras três são verdadeiras e não têm prova na mão. */
  fixa: "o dado à decisão",
  /* volume/Capa.jsx · <p className="splash-sub"> */
  sub: ["Antes de desenhar, eu assisto ", "sessão de usuário", ". É de lá que saem as decisões."],
  papel: "UX / Product Designer",
});

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
export const DECLARACAO = tr("DECLARACAO", [
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
    nota: "É ajuste, e mais ajuste, e é onde eu prefiro gastar o tempo.",
  },
]);

export const MANIFESTO = {
  lead:
    "Nunca consegui pensar design e código como duas coisas separadas. " +
    "Quando o prazo aperta, eu mesmo implemento.",
  colunas: [
    "Gosto de colocar uma tela clicável na mão das pessoas cedo, porque opinião sobre imagem estática costuma ser gosto, e opinião sobre uma coisa que a pessoa tentou usar costuma ser informação.",
    "Depois disso é ajuste, e mais ajuste. É a parte demorada do meu trabalho, e é onde eu não corto tempo.",
  ],
};

/* As tres frases do processo na home. Condensam as seis etapas de PROCESSO em
   volume/data.jsx sem inventar processo novo: seis linhas numeradas eram um
   indice disfarcado de conteudo. As seis continuam la, para /processo. */
/* Os titulos saem do proprio titulo da dobra, "Do objetivo ao ar": objetivo,
   protótipo, no ar. Nao e nome novo, e a frase da dobra desmontada em tres.
   As sentencas sao as mesmas de antes, palavra por palavra. */
/* A dobra 04 da home, refeita em 30/08.

   Ela mostrava três frases numeradas — "Começo pelo objetivo, não pela lista de
   telas", "Do objetivo ao protótipo clicável em dias", "Mostro cedo, corto o
   que não serve". O Gabriel leu como constrangedor e tinha dois motivos, e o
   segundo é o grave:

   1. era o único lugar do site onde ele descreve a própria virtude em vez de
      mostrar. Todo o resto ancora afirmação em coisa que aconteceu; ali eram
      três frases que qualquer designer digita sobre si mesmo em dez segundos;

   2. contradizia a página que ela linka. A /processo abre em "me perguntam
      qual é o meu processo esperando resposta de uma linha", e a tese dela é
      que não existe UM processo — existem dois caminhos, e quem decide é o
      preço de errar. A dobra era exatamente a resposta de uma linha que a
      página recusa um clique depois.

   A dobra envelheceu quando a /processo passou a existir, e ninguém voltou
   para aposentá-la. Agora ela mostra a tese em vez de resumir o método.

   ATENÇÃO, e isto é uma exceção à regra do arquivo: o texto aqui NÃO é cópia
   de site/ProcessoNarrativa.jsx. A primeira versão era, e o Gabriel reprovou
   por voz, não por conteúdo — a /processo escreve em aforismo, com frase
   invertida e punchline no fim de cada bloco ("o tamanho da pesquisa
   acompanha o preço de errar", "muda o tamanho, nunca é zero, e é a única
   linha que eu não negocio"). Ele leu como lacração, e a palavra dele foi
   cringe.

   Então esta dobra é a mesma informação dita em português falado: sujeito,
   verbo, predicado, sem inversão e sem frase que quer ser citada. O conteúdo
   é o mesmo da /processo — dois caminhos, o que decide entre eles, e o teste
   que acontece nos dois.

   Duas consequências para quem mexer aqui:
   1. mudou a /processo, NÃO copie a frase de lá para cá sem reescrever;
   2. a /processo continua no tom antigo. Se for uniformizar a voz do site,
      ela é a próxima. Ver a pendência no handoff de 30/08.

   O que não muda: a home informa COMO ele trabalha, e citar projeto por nome
   é referência de serviço prestado, que é assunto do case uma dobra abaixo.
   Por isso nenhum caso aparece nesta dobra. */
export const METODO = tr("METODO", {
  lead: "Pesquisa e teste entram em todo projeto. O tamanho de cada um muda conforme o risco da decisão e o tempo que eu tenho.",
  caminhos: [
    {
      olho: "Caminho curto",
      frase: "Quando as dúvidas já foram sanadas",
      nota: "Às vezes o problema chega com a resposta junto: reclamação que se repete, chamado no suporte, dado de uso que já aponta onde dói. Aí eu aproveito o que já existe e vou direto para o protótipo, e o tempo que sobra eu gasto testando e ajustando.",
    },
    {
      olho: "Caminho longo",
      frase: "Quando ninguém sabe ainda qual é o problema",
      nota: "É onde eu sigo o Double Diamond. Levo mais tempo na descoberta antes de desenhar qualquer tela, porque quando a decisão é cara de desfazer eu prefiro gastar o tempo antes do que corrigir depois.",
    },
  ],
  fecho: "Nos dois casos, alguém que vai usar a tela mexe nela antes de eu fechar.",
});

/* MORTO desde 30/08: era o conteúdo da dobra 04, substituído por METODO acima.
   Fica registrado por enquanto porque as seis etapas de PROCESSO em
   volume/data.jsx continuam vivas na /processo, dentro do caminho longo. */
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
export const SOBRE_OI = tr("SOBRE_OI", "oi, eu sou o Gabriel.");

/* v2/Home.jsx · a frase da dobra 06, que é onde a home apresenta a pessoa.
   Repetida aqui de propósito: é a mesma posição na página, e a /sobre é a
   versão longa da mesma dobra. */
export const SOBRE_PREMISSA = tr("SOBRE_PREMISSA",
  "Designer de produto em Maringá, que aprende o problema antes de abrir " +
  "o Figma e implementa quando o prazo aperta.");

/* volume/Posfacio.jsx · seção "Como eu trabalho". O primeiro parágrafo virou
   lead do cabeçalho por ser o argumento de julgamento, que é o que
   docs/DIAGNOSTICO-TEXTO-2026-08-27.md pede que a página defenda. */
export const SOBRE_TRABALHO = tr("SOBRE_TRABALHO", {
  lead:
    "Gosto de colocar uma tela clicável na mão das pessoas cedo, porque " +
    "opinião sobre imagem estática costuma ser gosto, e opinião sobre uma " +
    "coisa que a pessoa tentou usar costuma ser informação.",
  paras: [
    "Depois disso é ajuste, e mais ajuste. É a parte demorada do meu trabalho, e é onde eu não corto tempo.",
    "Nunca consegui pensar design e código como duas coisas separadas. Quando o prazo aperta, eu mesmo implemento.",
  ],
});

/* volume/data.jsx · CHAPTERS, pcyes: campo `fact`. É a frase mais forte do
   portfólio inteiro e, até aqui, só existia enterrada no capítulo 1. Entra
   com a origem visível, porque frase sem caso é slogan. */
export const SOBRE_CITACAO = tr("SOBRE_CITACAO", {
  q: "Contrariei o briefing com gravação de sessão na mão, e a direção oposta foi a aprovada.",
  f: "PCYES V2 · Grupo Oderço · 2026",
});

/* volume/Posfacio.jsx · seção "Como eu cheguei aqui" (bloco .pt-text). */
export const SOBRE_VIRADA = tr("SOBRE_VIRADA", [
  "Eu estava no fim do curso de Direito na UEM quando a pandemia parou tudo. Para ocupar a cabeça, montei um e-commerce só para aprender a mexer.",
  "Foi ali que a coisa virou. Não me peguei gostando só das telas: gostei da engenharia de fazer um sistema existir, de tirar algo do nada e botar de pé.",
  "Larguei o Direito, me formei em Design Gráfico, fui atrás de curso de UX e tirei a certificação Scrum para andar no ritmo de time ágil. Comecei na TT&T, desenhei produto na Locarmais, e hoje toco o design de um time inteiro de marcas no Grupo Oderço.",
]);

/* volume/Posfacio.jsx · seção "Fora da tela". O terceiro parágrafo cita dois
   dos aplicativos que já estão em PROJECTS: "Deixei Aqui" e "Quanto Cobro".
   O link do TikTok sai de CONTATO, não daqui. */
export const SOBRE_FORA = tr("SOBRE_FORA", [
  "Corro, treino boxe há dois anos e jogo vôlei toda semana num time amador aqui em Maringá.",
  { pre: "Leio mangá e manhwa numa quantidade difícil de justificar, e mantenho um canal sobre anime. Se quiser conferir o que eu ando assistindo, ", link: "tá aqui", pos: "." },
  "Também construo aplicativo por hobby. Costumo fazer só os que resolvem algum problema meu: tem um que lembra onde eu estacionei o carro, e outro que ajuda freelancer a calcular quanto cobrar por hora.",
]);

/* volume/Posfacio.jsx · seção "Para onde eu vou". É a única frase da página
   endereçada a quem contrata, e por isso fecha. */
export const SOBRE_ADIANTE = tr("SOBRE_ADIANTE",
  "Quero trabalhar em produto maior, com gente que sabe mais que eu, e estar " +
  "mais perto de onde as decisões são tomadas.");

/* volume/Posfacio.jsx · <p className="pos-hand"> do fim. */
export const SOBRE_OBRIGADO = tr("SOBRE_OBRIGADO", "obrigado por ler até aqui.");

/* As ferramentas.

   Só entra ferramenta que já aparece escrita em volume/data.jsx, nos `skills`
   das empresas ou no corpo dos capítulos: nenhuma foi acrescentada de
   memória. Uma linha em mono, e não uma grade de ícones, porque grade de
   ícone de ferramenta é o componente mais copiado de portfólio que existe e
   não diz nada que a lista não diga. */
export const SOBRE_FERRAMENTAS = [
  "Figma", "FigJam", "Magento", "RD Station", "Microsoft Clarity", "GA4", "Trello",
];
