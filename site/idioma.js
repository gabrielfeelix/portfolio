/* A TROCA DE IDIOMA, e o que ela deixa ver.
 *
 * Trocar de idioma é recarregar a página: a mutação do conteúdo em
 * volume/i18n.jsx acontece antes do primeiro render, então não existe trocar
 * sem reload — está escrito no cabeçalho de lá.
 *
 * O problema é que um reload não conta nada. A pessoa clica, a tela pisca, e a
 * página volta com outras palavras sem que nada tenha dito que foi ela quem
 * mudou. O Gabriel: "acho paia simplesmente recarregar e ter um delay".
 *
 * Então quem faz o efeito é O TEXTO DO SITE, e não uma tela por cima dele: a
 * página chega no idioma novo com as palavras embaralhadas e elas se resolvem
 * na frente de quem pediu, de cima para baixo. O assunto do efeito é o próprio
 * assunto do clique — as letras de um idioma virando as do outro. Uma tela de
 * carregamento com o mesmo desenho diria a mesma coisa escondendo justamente a
 * coisa que interessa, que é o texto trocando.
 *
 * DUAS REGRAS DE GEOMETRIA seguram tudo isto de pé, e as duas existem porque o
 * corpo do site NÃO é monoespaçado:
 *
 *   1. só letra e dígito são sorteados. Espaço, pontuação e quebra ficam onde
 *      estão, então cada palavra mantém o comprimento que vai ter no fim e o
 *      texto quebra nas mesmas linhas do começo ao fim do efeito.
 *   2. o sorteio respeita a CAIXA: maiúscula vira maiúscula, minúscula vira
 *      minúscula, dígito vira dígito. Sem isso a silhueta da linha muda de
 *      altura no meio do efeito (hastes que sobem e descem aparecendo e
 *      sumindo), e o parágrafo inteiro parece tremer.
 *
 * Sem as duas, o que se vê não é um decode: é um bloco de texto se
 * reescrevendo e reflowando, que lê como falha de carregamento.
 */

/* O bilhete que atravessa o reload. sessionStorage e não localStorage porque a
   informação vale para ESTA aba e para os próximos milissegundos — em
   localStorage, abrir o site amanhã numa aba nova nasceria embaralhado. */
const BILHETE = "vol-troca-idioma";

/* O bilhete é consumido NA CARGA DO MÓDULO, e não dentro do efeito, porque
   quem precisa dele primeiro é o render: `useEntrada`, em motion.js, decide no
   corpo do componente se esta página entra animada ou não, e isso acontece
   antes de qualquer efeito rodar.
 *
   Consumido na leitura de propósito: se a pessoa der F5 depois, a página vem
   normal. O efeito ANUNCIA a troca, e anunciar de novo uma troca já anunciada
   é ruído.
 *
   `quieto` entra na conta aqui e não em cada ponto de uso para que a resposta
   seja UMA só: se a preferência do sistema é não mover nada, esta carga não é
   uma chegada para efeito nenhum — nem para o decode, nem para desligar a
   entrada. Meio caminho seria o pior dos dois: sem entrada e sem decode, o
   texto apareceria seco. */
const CHEGADA = (() => {
  let tinha = false;
  try {
    tinha = !!sessionStorage.getItem(BILHETE);
    if (tinha) sessionStorage.removeItem(BILHETE);
  } catch (e) {}
  if (!tinha) return false;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  } catch (e) {}
  return true;
})();

/* Esta carga é a chegada de uma troca de idioma?
 *
   Quem pergunta é motion.js: numa chegada de idioma a página NÃO reproduz a
   entrada dela. E a razão é de sentido, não de performance — a pessoa não
   chegou agora, ela já estava aqui. O scroll dela nem se mexeu (o navegador
   preserva a posição no reload), então reencenar a abertura da página seria
   dizer que ela acabou de chegar num lugar de onde nunca saiu.
 *
   Tem também a razão prática, que apareceu num print: com a entrada ligada, o
   herói ainda estava se revelando enquanto o decode já tinha assentado, e o
   efeito inteiro acontecia atrás de uma cortina de opacidade. Um dos dois
   tinha que sair, e o que tem alguma coisa a dizer sobre idioma é o decode. */
export function ehChegadaDeIdioma() { return CHEGADA; }

export function trocarIdioma() {
  if (typeof window.toggleLang !== "function") return;
  try { sessionStorage.setItem(BILHETE, "1"); } catch (e) {}
  window.toggleLang();
}

/* As caixas de glifos, uma por caixa de letra. Sem acento e sem símbolo: um
   caractere que a fonte não tenha vira retângulo vazio, e retângulo no meio da
   palavra lê como bug, não como efeito. */
const MAI = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const MIN = "abcdefghijklmnopqrstuvwxyz";
const NUM = "0123456789";

/* O embaralhador de semente, e ele não é preciosismo.
 *
 * A primeira versão sorteava com `(t/32) + c * 7`, e o print entregou na hora:
 * como o índice do glifo é a semente MÓDULO o tamanho do alfabeto, somar 1 em t
 * andava uma letra em TODAS as posições ao mesmo tempo. O que se via não era
 * ruído, era um odômetro — a palavra inteira desfilando o alfabeto em bloco,
 * "Qxelszg" virando "Pwdkryf" virando "Xelszgn".
 *
 * Este hash (xor-shift com uma multiplicação de Knuth no meio) quebra essa
 * correlação: sementes vizinhas caem em pontos sem relação do alfabeto, que é
 * o que faz cada posição parecer decidir sozinha. */
function embaralhaSemente(x) {
  x = (x ^ 61) ^ (x >>> 16);
  x = (x + (x << 3)) | 0;
  x = x ^ (x >>> 4);
  x = Math.imul(x, 0x27d4eb2d);
  return (x ^ (x >>> 15)) >>> 0;
}

function sorteia(ch, semente) {
  if (ch >= "a" && ch <= "z") return MIN[semente % 26];
  if (ch >= "A" && ch <= "Z") return MAI[semente % 26];
  if (ch >= "0" && ch <= "9") return NUM[semente % 10];
  return null;   // espaço, pontuação, acento: não se mexe
}

/* Os tempos, e eles foram achados por tentativa, entre dois erros conhecidos.

   ERRO 1, ~950ms com cascata larga: "ficou mt estranho". Com quase um segundo
   e um degrau grande entre elementos, dá tempo de LER o texto embaralhado — e
   texto embaralhado que se deixa ler não lê como transição, lê como página
   corrompida. A pessoa passa a duvidar do site em vez de perceber que ele
   trocou de idioma.

   ERRO 2, ~350ms: "ta tao rapido q n da pra ler nada". No outro extremo o
   efeito acontece antes de ser percebido, e o custo é o mesmo por outro
   caminho — se ninguém vê, ele não anuncia coisa nenhuma e o clique volta a
   parecer um reload seco.

   O ponto entre os dois é ~650ms, e a régua para achá-lo é: tem que dar para
   ver o MOVIMENTO e não dar para ler o RUÍDO. O degrau entre elementos é
   pequeno de propósito — o bastante para o efeito ter direção (de cima para
   baixo) sem virar uma onda atravessando a tela, que era metade do erro 1.

   E vale deixar escrito por que este efeito é pequeno de propósito: o assunto
   é a TRADUÇÃO. Isto aqui é só a marca de que ela aconteceu. */
const ESCADA = 10;    // atraso de um elemento para o seguinte, de cima para baixo
const ABERTURA = 110; // quanto cada elemento leva para começar a assentar
const VARRIDA = 380;  // da primeira letra à última, dentro de um elemento
const JITTER = 110;   // o empurrão pseudoaleatório por posição
const TETO = 4000;    // caracteres, no máximo: acima disso o custo por quadro aparece

/* Quem entra no efeito: o texto que está NA TELA no momento da chegada.
 *
 * Só o visível, e é a decisão que faz o efeito ser barato. O que está abaixo da
 * dobra ninguém vê acontecer — embaralhar a página inteira custaria alguns
 * milhares de nós por quadro para produzir exatamente nada.
 *
 * Fica de fora o que é `aria-hidden` e o que está em `.v2-sr`: o primeiro é
 * grafismo (o número do menu, os traços) e o segundo é texto que só existe para
 * leitor de tela. Embaralhar qualquer um dos dois é gastar quadro no que
 * ninguém lê. */
function alvos() {
  const raiz = document.querySelector(".v2-shell");
  if (!raiz) return [];
  const altura = window.innerHeight;
  const anda = document.createNodeIterator(raiz, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      if (!n.nodeValue || !/[A-Za-z0-9]/.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
      const pai = n.parentElement;
      if (!pai) return NodeFilter.FILTER_REJECT;
      const tag = pai.tagName;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") return NodeFilter.FILTER_REJECT;
      if (pai.closest('[aria-hidden="true"], .v2-sr')) return NodeFilter.FILTER_REJECT;
      const r = pai.getBoundingClientRect();
      if (!r.width || !r.height || r.bottom <= 0 || r.top >= altura) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const achados = [];
  let n;
  let chars = 0;
  while ((n = anda.nextNode())) {
    achados.push({ no: n, topo: n.parentElement.getBoundingClientRect().top, fim: n.nodeValue });
    chars += n.nodeValue.length;
    if (chars > TETO) break;
  }
  /* De cima para baixo, e não na ordem do documento: o que a pessoa está
     olhando resolve primeiro. Numa página em que a nav vem antes do herói no
     HTML mas depois dele no olho, a ordem do documento faria o efeito começar
     num canto. */
  achados.sort((a, b) => a.topo - b.topo);
  return achados;
}

/* Roda o decode se esta carga for a chegada de uma troca. Devolve `false`
   quando não era, para quem chama não precisar saber do bilhete.
 *
 * O bilhete é consumido na leitura: se a pessoa der F5 depois, a página vem
 * normal. O efeito é o que ANUNCIA a troca, e anunciar de novo uma troca que
 * já foi anunciada é ruído. */
export function decodeDeChegada() {
  if (!CHEGADA) return false;

  const lista = alvos();
  if (!lista.length) return false;

  /* Cada caractere ganha o instante em que assenta, calculado uma vez. É um
     número por caractere em vez de um objeto: são milhares deles, e o efeito
     inteiro cabe em dois arrays. */
  const plano = lista.map((alvo, i) => {
    const base = i * ESCADA;
    const n = alvo.fim.length;
    const quando = new Float32Array(n);
    for (let c = 0; c < n; c++) {
      /* A varrida é da esquerda para a direita, com um empurrão pseudoaleatório
         por posição: reto demais, a palavra resolve como uma cortina lateral e
         some a leitura de que são letras se decidindo uma a uma. */
      const desvio = ((c * 2654435761) % 97) / 97;
      quando[c] = base + ABERTURA + (c / Math.max(1, n - 1)) * VARRIDA + desvio * JITTER;
    }
    return { ...alvo, quando };
  });

  const total = plano.reduce((m, p) => Math.max(m, p.quando[p.quando.length - 1]), 0);
  const t0 = performance.now();

  /* O primeiro quadro é ANTES do rAF, e de propósito: o texto tem que nascer
     embaralhado no mesmo quadro em que a página pinta. Um quadro de atraso e a
     pessoa lê o texto final antes de ele embaralhar, que é o oposto do efeito. */
  const passo = (agora) => {
    const t = agora - t0;
    for (const p of plano) {
      const fim = p.fim;
      const quando = p.quando;
      let saida = "";
      let mexeu = false;
      for (let c = 0; c < fim.length; c++) {
        if (t >= quando[c]) { saida += fim[c]; continue; }
        /* O glifo é re-sorteado a cada ~50ms, e não a cada quadro. A 60Hz,
           trocar todo quadro vira cintilação branca e some a leitura de que são
           letras — e num efeito de meio segundo isso pesa mais que num longo:
           cada posição mostra três ou quatro glifos no total, então cada um
           precisa durar o bastante para ser lido como letra. A semente mistura
           o índice para as posições não piscarem em uníssono. */
        const g = sorteia(fim[c], embaralhaSemente((((t / 50) | 0) * 2654435761 + c * 40503) | 0));
        if (g === null) { saida += fim[c]; continue; }
        saida += g;
        mexeu = true;
      }
      /* Só escreve se mudou: escrever o mesmo texto num nó é invalidar layout
         de graça, e são centenas de nós por quadro. */
      if (mexeu || p.no.nodeValue !== fim) p.no.nodeValue = saida;
    }
    if (t < total) requestAnimationFrame(passo);
    else for (const p of plano) p.no.nodeValue = p.fim;   // garante o texto exato no fim
  };

  passo(performance.now());
  requestAnimationFrame(passo);
  return true;
}
