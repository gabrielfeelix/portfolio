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
export const DECLARACAO =
  "Coloco uma tela clicável na mão das pessoas cedo, porque opinião sobre " +
  "imagem estática é gosto, e opinião sobre uma coisa que a pessoa tentou " +
  "usar é informação.";

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

/* O protótipo de brinquedo que mora dentro do passo 02.

   A dobra 01 afirma que opinião sobre imagem estática é gosto e opinião sobre
   uma coisa que a pessoa tentou usar é informação. Aqui a dobra 04 executa
   essa frase em vez de repetir ela: para responder a pergunta, o visitante
   precisa clicar, e as tres respostas desembocam no mesmo lugar.

   Nao ha dado de cliente nenhum aqui, e nao pode haver: e um brinquedo, e o
   texto assume isso. */
export const PROTOTIPO = {
  pergunta: "O que te dá opinião melhor sobre uma tela?",
  opcoes: [
    { id: "estatica", rotulo: "Uma imagem estática" },
    { id: "clicavel", rotulo: "Uma tela que eu posso clicar" },
    { id: "prazo",    rotulo: "Depende do prazo" },
  ],
  acao: "Responder",
  respostas: {
    estatica: "Anotado. Mesmo assim, você clicou para me dizer isso.",
    clicavel: "Foi exatamente o que você acabou de fazer aqui.",
    prazo: "Justo. E ainda assim você clicou para responder.",
  },
  fecho: "Isso é o passo 02 inteiro, em oito segundos.",
  antes: "Você está olhando.",
  depois: "Agora você tentou.",
  reiniciar: "De novo",
};
