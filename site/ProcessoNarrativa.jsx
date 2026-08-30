/* O corpo da página /processo: uma narrativa, não uma lista de etapas.
 *
 * Por que ela foi reescrita (29→30/08):
 *
 * A versão anterior afirmava "São seis passos, na mesma ordem, em todo projeto
 * deste portfólio". O Gabriel corrigiu: o processo dele muda com o problema.
 * Um P.O. às vezes entrega a feature com o problema já validado pela
 * reclamação e pelo FAQ, e aí o caminho é curto; no PCYES e no Oderço deu
 * tempo de fazer o completo. A página estava afirmando o contrário do que ele
 * faz, e nenhum arranjo de layout conserta uma premissa falsa. Três tentativas
 * de rediagramar (índice preso, bandas alternadas, capas) foram recusadas
 * antes de o problema ser identificado como sendo de texto.
 *
 * A moldura, que é o cuidado principal deste arquivo:
 *
 * "Todas as etapas são cortáveis" foi como o Gabriel descreveu. Escrito assim
 * numa página que existe para conseguir entrevista, lê como "pulo pesquisa
 * quando aperta", que é a acusação que derruba portfólio de UX. A literatura
 * da área sustenta a prática e não a frase: Erika Hall, em Just Enough
 * Research, manda priorizar as suposições que carregam mais risco e
 * desaconselha investigar suposição de risco baixo; a recomendação corrente é
 * enquadrar pesquisa como redução de risco, e apoiar-se em analytics e dado
 * secundário quando não há tempo de qualitativa. A mesma literatura é clara em
 * que pular pesquisa por completo dispara a chance de fracasso.
 *
 * Então: a substância é dele, a moldura é "o tamanho da pesquisa acompanha o
 * preço de errar", e a página declara explicitamente o que nunca cai.
 *
 * O ângulo (skill storytelling, §3 "inverter o vilão"): o vilão não é o prazo,
 * é a certeza. O Gabriel rodou o processo certo apontado para o alvo errado no
 * PCYES, descobriu pelo GA4 e redesenhou a V2 inteira por causa disso. Essa
 * confissão, com 166.267 sessões atrás dela, é o que a página tem de único, e
 * por isso é o fecho e não uma nota de rodapé.
 *
 * Todo número e todo achado aqui saem de volume/data.jsx (capítulo do PCYES) e
 * de volume-conteudo-dos-capitulos.md (Oderço). Nada foi inventado.
 */

import React from "react";
import { motion, useTransform } from "motion/react";
import { useRise, useTracado, useTrecho, useContador, AVIAO_D } from "./motion.js";

/* ------------------------------------------------------------------ copy */

/* Sem paralelismo negativo ("não é X, é Y"), que a skill anti-ai-writing marca
   como o tell número um, e com número no lugar de adjetivo sempre que existe
   número. */

const ABRE = {
  olho: "Como eu trabalho",
  t: "Me perguntam qual é o meu processo esperando resposta de uma linha.",
  p: [
    "A minha tem duas.",
    "Já me entregaram feature com o problema pronto. O P.O. chegou com a reclamação na mão, o FAQ dizia onde doía, e a dúvida que uma pesquisa mataria já estava morta. Fui direto para o protótipo e validei na tela.",
    "E teve PCYES, onde eu passei semanas antes de desenhar a primeira caixa. Matriz CSD para separar o que a gente sabia do que a gente achava. Benchmarking para não inventar palavra que o mercado já usa. Um trimestre inteiro de GA4, 166.267 sessões, evento a evento. Gravação de sessão assistida inteira, sem pular.",
    "As duas foram a escolha certa. Escolher qual é a parte do trabalho que não aparece na tela final.",
  ],
};

const FATORES = {
  olho: "O que decide o tamanho",
  t: "Três coisas, e nenhuma delas é vontade",
  itens: [
    { k: "Prazo", p: "Se é para segunda-feira ou para daqui um mês. Ele decide quanto eu tenho, não onde eu gasto." },
    { k: "Time", p: "Se eu divido a atividade com alguém ou toco sozinho. Dois designers mudam o que cabe na mesma semana." },
    { k: "O que já chegou validado", p: "Reclamação recorrente, chamado no FAQ, dado de uso. Quando o problema já vem provado, refazer a prova é teatro." },
  ],
  nota: "Quase todo lugar em que trabalhei era startup, e startup tem pressa. PCYES e Oderço foram onde deu tempo de fazer o completo.",
};

const RISCO = {
  olho: "Onde eu gasto",
  t: "O tamanho da pesquisa acompanha o preço de errar.",
  p: [
    "Decisão barata de desfazer eu coloco no ar e olho o que acontece. Trocar a ordem de dois blocos numa página de baixo tráfego se responde melhor com gravação de sessão do que com estudo.",
    "Decisão cara de desfazer, dessas que reescrevem catálogo ou mexem em pagamento, eu não chuto. Ali eu compro tempo antes, mesmo quando ninguém pediu.",
  ],
};

const CURTO = {
  olho: "Caminho curto",
  t: "Quando a dúvida já morreu",
  paradas: [
    { n: "01", t: "Dado", p: "O que já existe de uso, reclamação e chamado." },
    { n: "02", t: "Hipótese", p: "Uma frase que dá para provar errada." },
    { n: "03", t: "Protótipo", p: "Clicável, para a mesa tocar em vez de imaginar." },
    { n: "04", t: "Validação", p: "Alguém que vai usar mexe nele antes de eu fechar." },
  ],
  p: "Dias, não semanas. As etapas que faltam aqui não sumiram por pressa: elas matariam uma dúvida que já estava morta quando o problema chegou.",
};

/* As quatro fases do Double Diamond, com os métodos que o Gabriel usa em cada
   uma. Os seis passos de PROCESSO continuam vivos: eles moram aqui dentro, que
   é o caminho longo, em vez de serem apresentados como regra de todo projeto. */
const LONGO = {
  olho: "Caminho longo",
  t: "Quando ninguém sabe ainda qual é o problema",
  p: "É onde eu sigo Double Diamond, e é o que eu fiz no PCYES e no Oderço.",
  fases: [
    { k: "Descobrir", m: ["Matriz CSD", "Benchmarking", "Acompanhar a rotina real", "Analytics e gravação"] },
    { k: "Definir",   m: ["Recorte do problema", "Hipótese", "Objetivo, não lista de telas"] },
    { k: "Desenvolver", m: ["Protótipo navegável", "Apresenta cedo", "Critério na mesa"] },
    { k: "Entregar",  m: ["Teste de usabilidade", "Ajusta", "Vai para o ar"] },
  ],
  casos: [
    "No Oderço eu sentei junto do financeiro e acompanhei a conferência dia a dia antes de desenhar. O benchmarking ali foi de vocabulário: plataformas de conciliação já consolidadas, para não inventar termo novo onde já existe um.",
    "No PCYES o qualitativo e o quantitativo vieram separados de propósito. O Clarity respondeu o que as pessoas faziam, mapa de calor e gravação. O GA4 respondeu onde elas paravam.",
  ],
};

const NUNCA = {
  olho: "O que não cai",
  t: "Alguém que vai usar aquilo mexe na tela antes de eu fechar.",
  p: [
    "No caminho curto pode ser uma pessoa, quinze minutos, protótipo na mão. No longo é teste de usabilidade com roteiro.",
    "Muda o tamanho. Nunca é zero, e é a única linha que eu não negocio.",
  ],
};

/* O fecho, e o ângulo da página inteira. Sai verbatim do capítulo do PCYES:
   `funil.nota` e `funil.etapas` em volume/data.jsx. */
const APOSTA = {
  olho: "A vez que eu errei a conta",
  t: "Eu tinha acabado de consertar o checkout. Tinha certeza de que o buraco era ali.",
  p: [
    "Abri o trimestre inteiro no GA4 e o dado disse outra coisa. De cada 62 pessoas que abriam uma página de produto, uma punha no carrinho. E quem chegava ao checkout comprava a 25%, uma em cada quatro.",
    "A tela que eu tinha acabado de consertar nunca foi o gargalo principal, nem antes nem depois do conserto.",
    "Perdi a aposta, e foi essa correção que redesenhou a V2 inteira.",
  ],
  /* Número cru, e não string formatada: o contador precisa contar. A vírgula
     de milhar entra no render, por toLocaleString em pt-BR. */
  dado: [
    { l: "Viram um produto", v: 50399 },
    { l: "Puseram no carrinho", v: 808 },
    { l: "Compraram", v: 223 },
  ],
  fonte: "Google Analytics 4 · 2º trimestre de 2026 · 166.267 sessões",
  fecho: "O processo que eu escolhi estava certo. Só estava apontado para o lugar errado.",
};

/* ------------------------------------------------------------ desenhos */

/* Os dois desenhos abaixo são a mesma mecânica do avião vermelho que sobrevoa
   o site (`Voo` em Kit.jsx, `useVoo` em motion.js): `offset-path` com um `d`
   de SVG, e `offsetDistance` puxado pela rolagem. A diferença é que aqui o
   percurso não é decoração de fundo — é o desenho, e o avião é o dedo que o
   percorre. As primitivas são `useTracado` e `useTrecho`, no fim de motion.js.

   Por que o avião e não um ponto: ele já é o vocabulário do site, e um
   veículo com nariz diz a direção do percurso sem seta. */

/* O avião do site, dimensionado e centrado na própria origem para o
   `offset-path` pousar o centro dele sobre a linha, e não o canto. */
function Aviao({ rota, passo, opacidade, escala = 1.5 }) {
  return (
    <motion.g style={{ offsetPath: `path("${rota}")`, offsetDistance: passo, offsetRotate: "auto", opacity: opacidade }}>
      <path
        className="v2-pn-aviao"
        d={AVIAO_D}
        transform={`scale(${escala}) translate(-13 -12)`}
      />
    </motion.g>
  );
}

/* Um desenho, dois percursos, os mesmos dois pontos nas pontas.

   O argumento da página inteira em uma imagem: o curto é a reta pelo eixo, o
   longo é a excursão que abre e fecha duas vezes. A rolagem move os dois
   aviões ao mesmo tempo, e é aí que o desenho fala — na mesma rolagem o avião
   do curto já pousou em "No ar" e o do longo ainda está no primeiro diamante.
   Curto contra longo vira uma diferença que o olho vê acontecer, em vez de um
   comprimento de linha que ele teria que comparar parado. */

const EIXO = 170;

/* Flancos retos e vértices arredondados, e não a curva inteira: com curva
   Bézier de ponta a ponta o desenho lia como onda e a silhueta do duplo
   diamante sumia — o modelo tem que ser reconhecível de relance. O
   arredondamento existe só porque um avião fazendo esquina de vértice vivo
   denuncia o truque; o losango de ponta viva é o de baixo, `Diamante`. */
const LONGA_CIMA =
  "M64 170 L272 62 Q300 48 328 62 L472 156 Q500 170 528 156 L672 62 Q700 48 728 62 L936 170";
const LONGA_BAIXO =
  "M64 170 L272 278 Q300 292 328 278 L472 184 Q500 170 528 184 L672 278 Q700 292 728 278 L936 170";
const CURTA = "M64 170 L936 170";

function DoisCaminhos() {
  const rise = useRise();
  const cena = React.useRef(null);
  const { progresso, quieto } = useTracado(cena);
  /* As duas janelas, e o desenho inteiro depende delas: a curta fecha em 48%
     da rolagem da figura, a longa em 96%. Mesma rolagem, dois tempos de
     chegada — quando o avião do curto pousa, o do longo está na metade do
     primeiro diamante, e é isso que a figura tem para dizer.

     As duas são largas de propósito. A curta era a pior: cruzava a largura
     inteira em 244px de rolagem, quatro vezes a velocidade do dedo, e lia
     como papelzinho saindo voando. Hoje a cena `sticky` dá o espaço, e a
     curva em `motion.js` dá o sotaque. */
  const curto = useTrecho(progresso, 0.06, 0.68, { pousa: true });
  const longo = useTrecho(progresso, 0.03, 0.92, { pousa: true });

  /* As quatro paradas do caminho curto, entre os dois pontos comuns: o desenho
     diz "quatro" sem legenda. Cada uma acende quando o traço passa por ela. */
  const paradas = [238, 412, 588, 762];

  return (
    <div className="v2-pn-cena" ref={cena}>
     <div className="v2-pn-palco">
      <motion.figure className="v2-pn-desenho" {...rise(0)}>
      <svg viewBox="0 0 1000 360" role="img"
           aria-label="Os dois caminhos partem do mesmo problema e chegam à mesma entrega. O curto é uma reta com quatro paradas, de dias. O longo abre e fecha duas vezes, em duplo diamante, e leva semanas.">
        {/* a metade de baixo do duplo diamante, sem animação: ela não é
            percorrida, está ali para a silhueta do modelo continuar legível */}
        <path className="v2-pn-fantasma" d={LONGA_BAIXO} />

        <motion.path className="v2-pn-rota is-longa" d={LONGA_CIMA}
                     style={quieto ? undefined : { pathLength: longo.traco }} />

        {/* o curto vai por cima e em tinta cheia: é a figura, e o diamante é o
            fundo contra o qual ela se mede */}
        <motion.path className="v2-pn-rota is-curta" d={CURTA}
                     style={quieto ? undefined : { pathLength: curto.traco }} />
        {paradas.map((x) => (
          <ParadaAcesa key={x} x={x} traco={curto.traco} quieto={quieto}
                       em={(x - 64) / (936 - 64)} />
        ))}

        {/* os dois pontos comuns, desenhados por último para ficarem por cima */}
        <circle className="v2-pn-no" cx="64" cy={EIXO} r="9" />
        <circle className="v2-pn-no" cx="936" cy={EIXO} r="9" />

        {!quieto ? <Aviao rota={LONGA_CIMA} {...longo} escala={1.3} /> : null}
        {!quieto ? <Aviao rota={CURTA} {...curto} escala={1.3} /> : null}

        <text className="v2-pn-svg-k" x="500" y="26" textAnchor="middle">Caminho longo · semanas</text>
        <text className="v2-pn-svg-k is-forte" x="500" y="202" textAnchor="middle">Caminho curto · dias</text>
        <text className="v2-pn-svg-k" x="64" y="338">Problema</text>
        <text className="v2-pn-svg-k" x="936" y="338" textAnchor="end">No ar</text>
      </svg>
      <figcaption className="v2-fig-leg">
        Os dois começam no mesmo problema e terminam no mesmo lugar. O que muda é quanto eu abro antes de fechar.
      </figcaption>
      </motion.figure>
     </div>
    </div>
  );
}

/* A parada acende quando o traço chega nela, e não junto com as outras: é o
   que dá ao caminho curto a sensação de estar sendo percorrido, e não revelado
   de uma vez. `em` é a fração da rota em que ela fica. */
function ParadaAcesa({ x, traco, em, quieto }) {
  const r = useTransform(traco, [em - 0.01, em + 0.04], [0, 7]);
  return <motion.circle className="v2-pn-parada" cx={x} cy={EIXO} r={quieto ? 7 : r} />;
}

/* ---------------------------------------------------------------------- */

/* O caminho longo em detalhe: o duplo diamante canônico do British Design
   Council, de ponta viva desta vez, com as quatro fases penduradas nele.

   O desenho abre a partir do nó da esquerda — as duas metades de cada diamante
   crescem juntas, então a divergência acontece na tela em vez de ser afirmada
   por uma legenda. As três verticais caem exatamente nos quartos da grade de
   fases logo abaixo, e é isso que faz o desenho e a lista serem um objeto só
   em vez de uma figura com um texto embaixo. */

const D_MEIO = 130;
const DD = {
  /* cada diamante em duas metades que partem do mesmo nó à esquerda */
  a: ["M0 130 L250 26 L500 130", "M0 130 L250 234 L500 130"],
  b: ["M500 130 L750 26 L1000 130", "M500 130 L750 234 L1000 130"],
  /* a rota do avião: as pontas arredondadas só o bastante para o nariz dele
     não dar cavalo de pau em cima do vértice */
  voo: "M0 130 L238 32 Q250 24 262 32 L488 126 Q500 131 512 126 L738 32 Q750 24 762 32 L1000 130",
};

function Diamante({ fases }) {
  const rise = useRise();
  const cena = React.useRef(null);
  const { progresso, quieto } = useTracado(cena);
  /* o segundo diamante começa depois de o primeiro fechar: é a ordem do
     modelo, e ver os dois abrirem ao mesmo tempo desmancharia o "duplo" */
  const um = useTrecho(progresso, 0.03, 0.48);
  const dois = useTrecho(progresso, 0.48, 0.92);
  const voo = useTrecho(progresso, 0.03, 0.92, { pousa: true });

  return (
    <div className="v2-pn-cena is-dd" ref={cena}>
     <div className="v2-pn-palco">
      <motion.div className="v2-pn-dd" {...rise(0)}>
      <svg viewBox="-8 0 1016 268" role="img"
           aria-label="Duplo diamante: o primeiro abre em Descobrir e fecha em Definir; o segundo abre em Desenvolver e fecha em Entregar.">
        {DD.a.map((d) => (
          <motion.path className="v2-pn-rota is-dd" key={d} d={d}
                       style={quieto ? undefined : { pathLength: um.traco }} />
        ))}
        {DD.b.map((d) => (
          <motion.path className="v2-pn-rota is-dd" key={d} d={d}
                       style={quieto ? undefined : { pathLength: dois.traco }} />
        ))}

        {/* As verticais marcam a virada de cada fase e caem exatamente nos
            quartos da grade de fases abaixo — é o que faz o desenho e a lista
            serem um objeto só. Cada uma entra com o diamante dela: aparecendo
            antes, elas entregavam o final do desenho na primeira olhada. */}
        <motion.g style={quieto ? undefined : { opacity: um.traco }}>
          <line className="v2-pn-eixo" x1="250" y1="26" x2="250" y2="234" />
          <line className="v2-pn-guia" x1="250" y1="234" x2="250" y2="268" />
          <circle className="v2-pn-no" cx="0" cy={D_MEIO} r="8" />
          <circle className="v2-pn-no" cx="500" cy={D_MEIO} r="8" />
          <line className="v2-pn-eixo is-forte" x1="500" y1="26" x2="500" y2="234" />
          <line className="v2-pn-guia" x1="500" y1="234" x2="500" y2="268" />
        </motion.g>
        <motion.g style={quieto ? undefined : { opacity: dois.traco }}>
          <line className="v2-pn-eixo" x1="750" y1="26" x2="750" y2="234" />
          <line className="v2-pn-guia" x1="750" y1="234" x2="750" y2="268" />
          <circle className="v2-pn-no" cx="1000" cy={D_MEIO} r="8" />
        </motion.g>

        {!quieto ? <Aviao rota={DD.voo} {...voo} escala={1.15} /> : null}
      </svg>
      <ol className="v2-pn-fases">
        {fases.map((f) => (
          <li key={f.k}>
            <p className="v2-pn-fase-k">{f.k}</p>
            <ul>{f.m.map((x) => <li key={x}>{x}</li>)}</ul>
          </li>
        ))}
      </ol>
      </motion.div>
     </div>
    </div>
  );
}


/* --------------------------------------------------- o esboço e a grade */

/* A mesma tela, duas vezes: à mão e depois no esquadro.
 *
 * O Gabriel pediu o rabiscoframe e o wireframe de volta. Os dois moravam numa
 * seção recusada em 30/08 e nunca chegaram a ser commitados — procurei em todo
 * o histórico, por seis grafias, e não existe blob deles em lugar nenhum.
 * Este par é redesenhado do zero.
 *
 * A tela é GENÉRICA, e isso é o requisito e não uma economia. A versão antiga
 * mostrava uma tela do Monte seu PC e foi recusada justamente por obrigar o
 * leitor a saber o que aquele produto era. Aqui não há marca, não há texto
 * legível e não há produto: barra, bloco de mídia, linhas e um botão, que é a
 * forma que qualquer tela tem antes de ter conteúdo.
 *
 * As duas metades saem da MESMA lista de peças. É o que garante que elas sejam
 * a mesma tela: se fossem dois desenhos separados, a passagem de uma para a
 * outra viraria "duas telas parecidas" em vez de "esta tela, depois". */
const TELA = [
  { x: 0,   y: 0,   w: 400, h: 34,  cheio: true },
  { x: 0,   y: 54,  w: 168, h: 128, midia: true },
  { x: 188, y: 60,  w: 212, h: 10 },
  { x: 188, y: 84,  w: 212, h: 10 },
  { x: 188, y: 108, w: 160, h: 10 },
  { x: 188, y: 132, w: 190, h: 10 },
  { x: 0,   y: 202, w: 118, h: 36, acao: true },
  { x: 140, y: 208, w: 260, h: 10 },
  { x: 140, y: 230, w: 210, h: 10 },
  { x: 0,   y: 264, w: 400, h: 36,  cheio: true },
];

/* O tremido é DETERMINÍSTICO, e não `Math.random`. Com aleatório o desvio
   mudaria a cada render do React e o rabisco ficaria tremendo enquanto a
   pessoa rola, que é o oposto de um desenho a mão parado no papel. */
function tremido(n) {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return (s - Math.floor(s)) * 2 - 1;
}

/* Um retângulo à mão livre: quatro traços independentes, cada um com o meio
   fugindo alguns pixels do reto e a ponta passando um pouco do canto. É o que
   a mão faz, e é o que o olho lê como rascunho sem precisar de filtro de
   textura nem de fonte manuscrita. */
function aMao(x, y, w, h, k = 1) {
  const t = (i) => tremido(x + y * 7 + w * 13 + h * 17 + i * 31) * 2.8 * k;
  const o = (i) => tremido(x * 3 + y + i * 53) * 3.2 * k;
  const L = (x1, y1, x2, y2, i) =>
    `M${(x1 - o(i)).toFixed(1)} ${(y1 - o(i + 1)).toFixed(1)}` +
    ` Q${((x1 + x2) / 2 + t(i)).toFixed(1)} ${((y1 + y2) / 2 + t(i + 2)).toFixed(1)}` +
    ` ${(x2 + o(i + 3)).toFixed(1)} ${(y2 + o(i + 4)).toFixed(1)}`;
  /* Peça baixa vira UM traço solto, e não um retângulo fino de quatro lados.

     Num rabiscoframe de verdade a linha de texto é um risco: ninguém contorna
     uma linha de texto. Desenhadas como retângulo de 10px de altura elas liam
     como tubos, e o quadro inteiro perdia a cara de papel. O contorno fica
     para as peças que têm área — barra, mídia, botão, rodapé. */
  if (h <= 14) {
    const my = y + h / 2;
    return [
      `M${(x - o(1)).toFixed(1)} ${(my + t(1)).toFixed(1)}` +
      ` C${(x + w * 0.3).toFixed(1)} ${(my + t(3) * 1.6).toFixed(1)}` +
      ` ${(x + w * 0.7).toFixed(1)} ${(my + t(7) * 1.6).toFixed(1)}` +
      ` ${(x + w + o(9)).toFixed(1)} ${(my + t(11)).toFixed(1)}`,
    ];
  }
  return [
    L(x, y, x + w, y, 1),
    L(x + w, y, x + w, y + h, 5),
    L(x + w, y + h, x, y + h, 9),
    L(x, y + h, x, y, 13),
  ];
}

function EsbocoEGrade() {
  const rise = useRise();
  const cena = React.useRef(null);
  /* Sem cena `sticky`, ao contrário dos dois desenhos de Double Diamond. Eles
     precisam de rolagem presa porque o percurso é longo e tem que ser
     assistido; este par é um antes-e-depois, e prender duas telas de rolagem
     para mostrar dois quadros parados seria rolagem morta. Ele desenha durante
     a própria entrada. */
  const { progresso, quieto } = useTracado(cena, { offset: ["start 88%", "center 42%"] });
  const mao = useTrecho(progresso, 0, 0.52);
  const regua = useTrecho(progresso, 0.5, 0.95);

  return (
    <motion.figure className="v2-pn-telas" ref={cena} {...rise(0)}>
      <svg viewBox="0 0 1000 368" role="img"
           aria-label="A mesma tela desenhada duas vezes: primeiro à mão, com traço torto, e depois no esquadro, com as mesmas peças alinhadas numa grade.">
        {/* à mão */}
        <g transform="translate(20 20)">
          {TELA.map((p, i) =>
            aMao(p.x, p.y, p.w, p.h).map((d, j) => (
              <motion.path className="v2-pn-mao" key={`${i}-${j}`} d={d}
                           style={quieto ? undefined : { pathLength: mao.traco }} />
            ))
          )}
          {/* a cruz do bloco de mídia, que é como se rabisca "aqui vai imagem" */}
          {(() => {
            const m = TELA.find((p) => p.midia);
            return [
              `M${m.x + 4} ${m.y + 4} L${m.x + m.w - 4} ${m.y + m.h - 4}`,
              `M${m.x + m.w - 4} ${m.y + 4} L${m.x + 4} ${m.y + m.h - 4}`,
            ].map((d) => (
              <motion.path className="v2-pn-mao" key={d} d={d}
                           style={quieto ? undefined : { pathLength: mao.traco }} />
            ));
          })()}
        </g>

        {/* a passagem: uma seta curta, na mono do site */}
        <motion.g style={quieto ? undefined : { opacity: regua.traco }}>
          <path className="v2-pn-seta" d="M468 170 L532 170 M518 160 L532 170 L518 180" />
        </motion.g>

        {/* no esquadro */}
        <motion.g transform="translate(580 20)" style={quieto ? undefined : { opacity: regua.traco }}>
          {TELA.map((p, i) => (
            <rect
              className={"v2-pn-grade" + (p.acao ? " is-acao" : "") + (p.cheio ? " is-cheio" : "")}
              key={i} x={p.x} y={p.y} width={p.w} height={p.h}
            />
          ))}
          {(() => {
            const m = TELA.find((p) => p.midia);
            return (
              <path className="v2-pn-grade-cruz"
                    d={`M${m.x} ${m.y} L${m.x + m.w} ${m.y + m.h} M${m.x + m.w} ${m.y} L${m.x} ${m.y + m.h}`} />
            );
          })()}
        </motion.g>

        <text className="v2-pn-svg-k" x="20" y="356">Rabiscoframe</text>
        <text className="v2-pn-svg-k" x="580" y="356">Wireframe</text>
      </svg>
      <figcaption className="v2-fig-leg">
        As mesmas peças, duas vezes. A primeira serve para decidir o que entra na tela; a segunda, para decidir onde.
      </figcaption>
    </motion.figure>
  );
}

/* ---------------------------------------------------------- o eixo do risco */

/* A cunha: fina onde errar é barato, grossa onde errar é caro.

   Ela desenha o título do bloco em vez de ilustrá-lo — "o tamanho da pesquisa
   acompanha o preço de errar" é uma afirmação sobre uma quantidade que cresce,
   e uma quantidade que cresce se desenha como uma quantidade que cresce. Sem
   ícone, sem metáfora. */
function EixoDoRisco() {
  const rise = useRise();
  const cena = React.useRef(null);
  const { progresso, quieto } = useTracado(cena, { offset: ["start 88%", "center 50%"] });
  const abre = useTrecho(progresso, 0, 0.9);

  return (
    <motion.figure className="v2-pn-risco" ref={cena} {...rise(0)}>
      <svg viewBox="0 0 1000 150" role="img"
           aria-label="Uma cunha que começa fina à esquerda, onde a decisão é barata de desfazer, e termina grossa à direita, onde é cara. A espessura é o tamanho da pesquisa.">
        <motion.g style={quieto ? undefined : { opacity: abre.traco, scaleX: abre.traco }}
                  transform-origin="40 75">
          <path className="v2-pn-cunha" d="M40 73 L960 24 L960 126 L40 77 Z" />
        </motion.g>
        <line className="v2-pn-eixo" x1="40" y1="75" x2="960" y2="75" />
        <text className="v2-pn-svg-k" x="40" y="140">Barato de desfazer</text>
        <text className="v2-pn-svg-k is-forte" x="960" y="140" textAnchor="end">Caro de desfazer</text>
      </svg>
      <figcaption className="v2-fig-leg">
        A espessura é quanto eu abro antes de decidir. Ela acompanha o preço de errar, e não o calendário.
      </figcaption>
    </motion.figure>
  );
}

/* ------------------------------------------------------------- pedaços */

/* O número do funil, subindo. `useContador` já existe em motion.js e é o
   mesmo da home: easeOutQuart, dispara ao entrar na tela, e em
   reduced-motion nasce no valor final. Sem ele os três números do funil eram
   a única coisa da página que aparecia pronta, e é justamente o trio em que
   a queda de 50.399 para 223 é o argumento. */
function Dado({ l, v }) {
  const { ref, valor } = useContador(v, 1.3);
  return (
    <div ref={ref}>
      <dt>{l}</dt>
      <dd>{valor.toLocaleString("pt-BR")}</dd>
    </div>
  );
}

/* O bloco, agora com duas formas de abrir e três larguras.

   A forma de hoje (`col`) é olho sobre título sobre texto, tudo numa coluna, e
   ela era a ÚNICA: os sete blocos abriam idênticos, no mesmo lugar, com o
   mesmo espaçamento. `duas` é o `Cabecalho` do resto do site — título à
   esquerda, o primeiro parágrafo à direita virando lead — e existe para que a
   abertura não seja a mesma sete vezes seguidas.

   A largura sai por `data-larg` e não por classe porque ela é escolha de
   pauta, não de conteúdo: o mesmo bloco muda de largura entre uma versão de
   ritmo e outra. */
function Bloco({ olho, t, lead, children, id, classe = "", forma = "col", larg = "wrap", lado = "esq" }) {
  const rise = useRise();
  const cabeca = (
    <>
      <motion.p className="v2-pn-olho" {...rise(0)}>{olho}</motion.p>
      {t ? <motion.h2 className="v2-pn-t" {...rise(1)}>{t}</motion.h2> : null}
    </>
  );

  return (
    <section
      className={"v2-pn-bloco v2-wrap" + (classe ? " " + classe : "")}
      id={id}
      data-forma={forma}
      data-larg={larg}
      data-lado={lado}
    >
      {forma === "duas" ? (
        <div className="v2-pn-cabeca">
          <div className="v2-pn-cabeca-esq">{cabeca}</div>
          <div className="v2-pn-cabeca-dir">
            {lead ? <motion.p className="v2-pn-lead" {...rise(2)}>{lead}</motion.p> : null}
          </div>
        </div>
      ) : (
        <>
          {cabeca}
          {lead ? <motion.p className="v2-pn-p" {...rise(2)}>{lead}</motion.p> : null}
        </>
      )}
      {children}
    </section>
  );
}

/* A faixa de ato: a quebra de superfície da versão A.

   Ela é DELIBERADAMENTE menor que a `CapaCapitulo` que saiu desta página em
   30/08. Aquela era meia tela com título em display, e foi recusada quando
   alternava com dois passos de texto cada. Esta é uma faixa fina, sangrando de
   borda a borda, só com mono: número do ato, nome do ato, e nada mais. Ela não
   apresenta um capítulo — ela marca que a página virou de assunto, que é o
   problema real (13.600px sem uma troca de superfície). */
function FaixaAto({ n, nome, de }) {
  const rise = useRise();
  return (
    <motion.div className="v2-pn-ato" data-escuro-corpo="1" aria-hidden="true" {...rise(0)}>
      <div className="v2-wrap v2-pn-ato-in">
        <span className="v2-pn-ato-n">{n} / {de}</span>
        <span className="v2-pn-ato-nome">{nome}</span>
      </div>
    </motion.div>
  );
}

function Paras({ itens, i0 = 2, classe = "v2-pn-p" }) {
  const rise = useRise();
  return itens.map((p, i) => (
    <motion.p className={classe} key={i} {...rise(i0 + i)}>{p}</motion.p>
  ));
}

/* ------------------------------------------------------------ o ritmo */

/* A pauta de ritmo da página: uma linha por bloco, na ordem em que eles saem.

   Ela nasceu como três versões comparáveis (`?ritmo=a|b|c`) em 30/08 — atos
   com faixa escura, alternância em zigue-zague, e esta. O Gabriel escolheu
   esta; as outras duas e o seletor de URL saíram junto com a escolha.

   O princípio é uma RAMPA, não um zigue-zague: a página abre recuada e
   discreta e vai crescendo em largura e presença até o funil, que é o clímax.
   A aposta é que o problema nunca foi "tudo igual" e sim "nada acelera" — uma
   página que argumenta tem que ficar mais alta conforme se aproxima da
   confissão.

   Os campos:
     forma  "col"  olho sobre título, coluna única
            "duas" título à esquerda, primeiro parágrafo à direita como lead
     larg   "estreita" recuado pela coluna de rótulo (220px), título em 12ch
            "wrap"     a largura cheia da página
            "larga"    título em 26ch, sem `balance`, correndo a coluna

   A ordem das formas foi escolhida MEDINDO a largura do título bloco a bloco,
   e não no olho: uma rampa com um degrau para baixo no meio não é rampa. Sai
   587 · 612 · 713 · 853 · 918 · 1326 · 1326 numa janela de 1440.

   Os dois últimos voltam para coluna única de propósito. Duas colunas é a
   forma QUIETA — título e apoio dividem a linha — e a rampa tem que terminar
   na mais alta: título largo, sozinho, sem nada ao lado. */
const RITMO = [
  { forma: "duas", larg: "estreita" },
  { larg: "estreita", lado: "dir" },
  { forma: "duas", lado: "dir" },
  { forma: "duas", larg: "larga" },
  {},
  { larg: "larga" },
  { larg: "larga" },
];

/* ------------------------------------------------------------- página */

export function Narrativa() {
  const rise = useRise();
  const b = (i) => RITMO[i] || {};

  /* Quando o bloco abre em duas colunas, o primeiro parágrafo sobe para a
     coluna da direita e vira o lead. É o mesmo texto, noutro lugar — nenhuma
     bloco reescreve nada. Devolve [lead, resto]. */
  const parte = (i, itens) =>
    b(i).forma === "duas" ? [itens[0], itens.slice(1)] : [null, itens];

  /* FATORES e CURTO abrem por lista e não têm primeiro parágrafo para
     promover: nesses dois o lead é o texto que hoje fecha o bloco. */
  const rodape = (i, texto) => (b(i).forma === "duas" ? [texto, null] : [null, texto]);

  const [abreLead, abrePs] = parte(0, ABRE.p);
  const [fatLead, fatNota] = rodape(1, FATORES.nota);
  const [riscoLead, riscoPs] = parte(2, RISCO.p);
  const [curtoLead, curtoP] = rodape(3, CURTO.p);
  const [longoLead, longoP] = rodape(4, LONGO.p);
  const [nuncaLead, nuncaPs] = parte(5, NUNCA.p);
  const [apostaLead, apostaPs] = parte(6, APOSTA.p);

  /* A faixa de ato de cada bloco, quando a pauta pede uma. */
  const ato = (i) => {
    const a = b(i).ato;
    return a ? <FaixaAto n={a[0]} de={a[1]} nome={a[2]} /> : null;
  };

  return (
    <div className="v2-pn">
      {ato(0)}
      <Bloco olho={ABRE.olho} t={ABRE.t} id="como-eu-trabalho" lead={abreLead} {...b(0)}>
        <Paras itens={abrePs} />
        <DoisCaminhos />
      </Bloco>

      {ato(1)}
      <Bloco olho={FATORES.olho} t={FATORES.t} lead={fatLead} {...b(1)}>
        <ol className="v2-pn-fatores">
          {FATORES.itens.map((f, i) => (
            <motion.li key={f.k} {...rise(i + 2)}>
              <p className="v2-pn-fator-k">{f.k}</p>
              <p className="v2-pn-fator-p">{f.p}</p>
            </motion.li>
          ))}
        </ol>
        {fatNota ? <motion.p className="v2-pn-nota" {...rise(5)}>{fatNota}</motion.p> : null}
      </Bloco>

      {ato(2)}
      <Bloco olho={RISCO.olho} t={RISCO.t} classe="is-destaque" lead={riscoLead} {...b(2)}>
        <Paras itens={riscoPs} />
        <EixoDoRisco />
      </Bloco>

      {ato(3)}
      <Bloco olho={CURTO.olho} t={CURTO.t} id="caminho-curto" lead={curtoLead} {...b(3)}>
        <ol className="v2-pn-trilho">
          {CURTO.paradas.map((p, i) => (
            <motion.li key={p.n} {...rise(i + 2)}>
              <span className="v2-pn-trilho-n">{p.n}</span>
              <span className="v2-pn-trilho-t">{p.t}</span>
              <span className="v2-pn-trilho-p">{p.p}</span>
            </motion.li>
          ))}
        </ol>
        {curtoP ? <motion.p className="v2-pn-p" {...rise(6)}>{curtoP}</motion.p> : null}
        <EsbocoEGrade />
      </Bloco>

      {ato(4)}
      <Bloco olho={LONGO.olho} t={LONGO.t} id="caminho-longo" lead={longoLead} {...b(4)}>
        {longoP ? <motion.p className="v2-pn-p" {...rise(2)}>{longoP}</motion.p> : null}
        <Diamante fases={LONGO.fases} />
        <Paras itens={LONGO.casos} i0={4} classe="v2-pn-p is-menor" />
      </Bloco>

      {ato(5)}
      <Bloco olho={NUNCA.olho} t={NUNCA.t} classe="is-destaque" lead={nuncaLead} {...b(5)}>
        <Paras itens={nuncaPs} />
      </Bloco>

      {ato(6)}
      <Bloco olho={APOSTA.olho} t={APOSTA.t} id="a-aposta" classe="is-aposta" lead={apostaLead} {...b(6)}>
        <Paras itens={apostaPs} />
        <motion.dl className="v2-pn-dado" {...rise(5)}>
          {APOSTA.dado.map((d) => <Dado key={d.l} {...d} />)}
        </motion.dl>
        <motion.p className="v2-pn-fonte" {...rise(6)}>{APOSTA.fonte}</motion.p>
        <motion.p className="v2-pn-fecho" {...rise(7)}>{APOSTA.fecho}</motion.p>
      </Bloco>
    </div>
  );
}
