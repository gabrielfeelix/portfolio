/* Home da V2, remontada sobre o kit.
 *
 * A tentativa anterior foi recusada. O diagnóstico está em docs/ANALISE-REFS.md:
 * não faltava seção, faltava gramática. Cada dobra resolvia o próprio problema
 * do próprio jeito e o resultado lia como coleção, não como página.
 *
 * O que mudou de verdade:
 *   - toda dobra abre com o mesmo cromo (índice, nome, carimbo) na mono;
 *   - toda dobra pesada usa o cabeçalho de cinco partes do viper;
 *   - a mídia sangra: fita no lugar da passagem, quebra entre dobras pesadas;
 *   - a ordem defende uma tese, e está anotada dobra a dobra abaixo.
 *
 * A ordem, e por que ela é essa:
 *   hero        quem é
 *   declaração  a tese, partida em duas metades ao rolar
 *   marcas      a prova social vem logo depois da tese, como no bungee
 *   trabalho    o que ele quer que vejam, com o cabeçalho de cinco partes
 *   quebra      respiro, sem uma palavra
 *   números     a escala do que veio antes
 *   processo    responde "como você chegou nesses resultados"
 *   onde estive a trajetória
 *   sobre       quem é a pessoa, com assinatura
 *   peças       extra, fora da hierarquia principal, de propósito
 */

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from "motion/react";
import {
  spring, ease, easeRevela, dur, passo, useTardio, useRise, useMaskLine, useCobertura,
  usePilha, usePilhaTrilho, usePalavra, useRevelar, useEscrita, useNaAltura,
  rolarPara,
} from "./motion.js";
import { Pill } from "./Shell.jsx";
import { ILUSTRACOES } from "./Ilustracoes.jsx";
import { Cromo, Relogio, Dobra, Titulo, Cabecalho, Quebra, Contador, DuasCores, Presa, CampoDeVoo, Lamina } from "./Kit.jsx";
import {
  ALL_MARKS, VOL, COMPANIES, CONTATO,
  casos, pieceProjects, pieceCover, pieceDestino,
} from "./content.js";
import { HERO, DECLARACAO, PROCESSO_CURTO, CAPAS_CHEIAS, CAPAS_CASO, LOGOS_COR } from "./copy.js";
import { FERRAMENTAS } from "./ferramentas.js";

/* A quebra entre casos e números, em largura total, e o único momento mudo da
   página: `04 quebra de imagem pura, sem texto` na etapa B de
   docs/ANALISE-REFS.md.

   Também é o terceiro tempo escuro da página, e o do meio. O hero é escuro, o
   rodapé é escuro, e tudo entre os dois é papel branco — então preto sangrando
   74vh aqui não é decoração, é a respiração da dobradiça: sai de "olha o
   trabalho" e entra em "olha a escala".

   O stock vermelho abstrato que morava aqui (capa-quebra.webp, o "temporário
   para provar a tese em print" da etapa C) saiu. No lugar entra o motivo do
   próprio site: o aviãozinho de papel vermelho que o `CampoDeVoo` já faz
   atravessar o corpo claro de todas as páginas por baixo do conteúdo. Ali ele é
   subliminar — pequeno, atrás, translúcido. Aqui ele vira objeto uma vez só, em
   largura total. É o pagamento do motivo, não a repetição dele.

   Detalhes que não são acidente, e que uma troca de arte não pode perder:
     - o bico aponta para a DIREITA, igual ao AVIAO_D de motion.js;
     - a luz vem de cima à direita e o avião voa PARA ela, um scroll antes de
       "O que já saiu da mesa";
     - a poeira é fria e suspensa. Faísca laranja lê como foguete, que é
       lançamento e agressão; o registro aqui é deriva e vento.

   Formato: 2400x1120, que é 2.14:1. Não é 2.4:1 por engano — 2.4 é a JANELA
   (.v2-quebra, 74vh), e .v2-quebra-in tem 112% de altura para o parallax
   deslizar. 2.40/1.12 = 2.14, então a folga vertical é exatamente o curso do
   `useParallax(12)`. Cortar em 2.4 faria a imagem faltar no fim do curso.

   O vermelho do original saía em (219,65,62); foi puxado para o --v2-accent
   (#E4231B) só nos pixels vermelhos, com o fundo azul-preto intocado. */
const QUEBRA = "/volume/assets/stock/capa-quebra-aviao.webp";

/* ------------------------------------------------------------------ 1. hero */

/* A palavra rotativa da V1, refeita com mola no lugar do CSS por caractere.
   Ela ocupa a linha inteira: assim a troca nunca muda onde a headline quebra,
   que era o problema que a V1 resolvia medindo a caixa a cada troca. */
/* Um link que é rota, não recarga.

   O `href` continua real — abrir em nova aba, copiar o endereço e o preview de
   link seguem funcionando —, e o preventDefault só vale para o clique comum.
   Com tecla modificadora ou botão do meio o navegador leva, que é o que a
   pessoa pediu ao segurar a tecla. É o mesmo contrato da nav, em Shell.jsx. */
function rota(ir, href) {
  if (!ir) return undefined;
  return (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
    e.preventDefault();
    ir(href);
  };
}

function Rotativa({ itens, intervalo = 2800 }) {
  const [i, setI] = useState(0);
  const quieto = useReducedMotion();
  useEffect(() => {
    if (quieto) return;
    const t = setInterval(() => setI((v) => (v + 1) % itens.length), intervalo);
    return () => clearInterval(t);
  }, [itens.length, intervalo, quieto]);
  if (quieto) return <span className="v2-rot">{itens[0]}</span>;
  return (
    <span className="v2-rot">
      <span className="v2-rot-caixa">
        {/* Dois cuidados, e os dois vieram de bug visto em print.
            1. mode="wait", nao "popLayout": com popLayout as duas frases
               existem ao mesmo tempo, a que sai sobe e atravessa a linha
               branca de cima. Em repouso o H1 estava certo e so a troca
               quebrava, o que fazia a home piscar quebrada a cada 2,8s.
            2. a saida e curta e o curso e de 0.3em, nao 0.9em: com `wait` a
               linha fica vazia enquanto a saida roda, entao saida longa vira
               buraco na headline. 160ms le como troca, nao como falha. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={i}
            className="v2-rot-item"
            initial={{ y: "0.3em", opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: spring }}
            exit={{ y: "-0.3em", opacity: 0, transition: { duration: 0.16, ease } }}
          >
            {itens[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}

function Hero({ paraCasos }) {
  const linha = useMaskLine();
  const tardio = useTardio(1.4);
  // O hero fica preso enquanto o corpo sobe por cima dele, e sai perdendo
  // escala em vez de rolar para fora. É a única passagem coberta da home.
  const capa = useCobertura();
  const quieto = useReducedMotion();
  /* Parallax do fundo: sai da rolagem da PAGINA, e nao do progresso da secao.
     O hero e sticky, e com sticky a caixa para de andar em relacao a janela,
     entao useScroll com target congela. Mesma decisao do hero da pagina de
     caso, anotada em v2/Case.jsx. */
  const { scrollY } = useScroll();
  const desloca = useTransform(scrollY, [0, 900], [0, 90]);
  return (
    <section className="v2-hero v2-grao v2-halo" id="v2-hero" data-escuro="1" ref={capa.ref}>
      {/* A capa. Fica atras de tudo, e o `.v2-grao` do hero ja poe os filhos
          em z-index 1, entao o conteudo passa por cima sozinho.

          Em reduced-motion o video nem entra no DOM: sai a tag inteira e fica
          a arte parada. Video em loop e movimento, e quem pediu para nada se
          mover nao ganha excecao por ser bonito. */}
      <div className="v2-hero-capa" aria-hidden="true">
        {quieto ? (
          <img src="/volume/assets/hero/capa.webp" alt="" decoding="async" />
        ) : (
          <motion.video
            style={{ y: desloca }}
            poster="/volume/assets/hero/capa-poster.webp"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="/volume/assets/hero/capa.webm" type="video/webm" />
            <source src="/volume/assets/hero/capa.mp4" type="video/mp4" />
          </motion.video>
        )}
        <span className="v2-hero-veu" />
      </div>
      <motion.div className="v2-wrap v2-hero-in" style={capa.style}>
        <motion.div className="v2-hero-topo" {...linha(0)}>
          <p className="v2-hero-papel">{HERO.papel}</p>
          {/* O relógio é o enfeite mais barato das referências e o único
              elemento da página que prova que tem alguém do outro lado. */}
          <Relogio />
          <p className="v2-hero-papel">{VOL()}</p>
        </motion.div>

        <div className="v2-hero-baixo">
        <h1 className="v2-hero-h">
          <span className="v2-hero-linha"><motion.span {...linha(1)}>{HERO.linha1}</motion.span></span>
          <span className="v2-hero-linha"><motion.span {...linha(2)}>{HERO.linha2}</motion.span></span>
          <span className="v2-hero-linha is-rot">
            <motion.span {...linha(3)}><Rotativa itens={HERO.rotativas} /></motion.span>
          </span>
        </h1>

        <motion.div className="v2-hero-pe" {...tardio}>
          <p className="v2-hero-sub">
            {HERO.sub[0]}
            <span className="v2-marca-texto">{HERO.sub[1]}</span>
            {HERO.sub[2]}
          </p>
          {/* Dois botões, e a hierarquia é a razão de existirem dois: a home
              tinha só primário, e um botão sozinho não diz que é o principal —
              ele só é o único. O primário leva para o trabalho, que é o que a
              página inteira existe para mostrar; o secundário abre a conversa,
              que é o passo seguinte de quem já se convenceu. */}
          <div className="v2-hero-botoes">
            <Pill onClick={paraCasos} escuro>Ver os casos</Pill>
            <Pill href={CONTATO().whatsapp.href} escuro secundario externo>Falar comigo</Pill>
          </div>
        </motion.div>
        </div>

        <button className="v2-hero-seta" onClick={paraCasos} aria-label="Rolar para o conteúdo">
          <span className="v2-hero-seta-rot">Role</span>
          <span className="v2-hero-seta-tra" aria-hidden="true" />
        </button>
      </motion.div>
    </section>
  );
}

/* --------------------------------------------------------------- passagem */

/* ----------------------------------------------------------- 2. declaracao */

/* Ideia do Gabriel, e ela é boa: a frase não é um parágrafo seco no meio da
   página. A primeira metade abre alinhada à esquerda, a segunda assenta à
   direita conforme a dobra passa. A revelação palavra a palavra continua, mas
   agora tem duas âncoras em vez de um bloco só. */
function Declaracao() {
  /* Uma lista só de palavras, com as duas frases em display emendadas, para a
     revelação continuar contando de um bloco para o outro: cortar o contador
     no meio fazia o segundo bloco abrir do zero e o par piscava duas vezes. */
  const frases = DECLARACAO.map((b) => b.frase.split(" "));
  const bases = [0, frases[0].length];
  const total = frases[0].length + frases[1].length;
  const { ref, palavras: anim, quieto } = usePalavra(total);
  const revelar = useRevelar();
  const bloco = (b, n, classe) => (
    <div className={`v2-tese-bloco ${classe}`}>
      <p className="v2-olho">{b.olho}</p>
      <p className="v2-declaracao">
        {frases[n].map((w, k) => {
          const i = bases[n] + k;
          /* o asterisco de copy.js marca o acento e sai do texto aqui */
          const acento = w.includes("*");
          return (
            <React.Fragment key={i}>
              {/* o espaço fica FORA do span: espaço no fim de um inline-block é
                  descartado na hora de renderizar, e a frase saía sem separação */}
              <motion.span
                className="v2-declaracao-w"
                style={
                  quieto
                    ? undefined
                    : {
                        opacity: anim[i].opacidade,
                        filter: anim[i].filtro,
                        y: anim[i].y,
                      }
                }
              >
                {/* só o que está entre asteriscos vai ao vermelho: com a
                    palavra inteira o ponto final ia junto e virava um pingo
                    vermelho solto no fim da linha */}
                {acento
                  ? w.split(/(\*[^*]+\*)/).filter(Boolean).map((f, j) =>
                      f.startsWith("*")
                        ? <span key={j} className="v2-acento">{f.slice(1, -1)}</span>
                        : f)
                  : w}
              </motion.span>
              {k < frases[n].length - 1 ? " " : null}
            </React.Fragment>
          );
        })}
      </p>
      {/* o parágrafo não entra palavra a palavra: em 16 palavras de 24px a
          revelação vira ruído, e a dobra já tem a do display */}
      <motion.p className="v2-lead v2-tese-nota" {...revelar(n)}>{b.nota}</motion.p>
    </div>
  );
  return (
    <Dobra id="sobre" n="01" nome="A tese" carimbo="©26">
      <div className="v2-declaracao-par" ref={ref}>
        {bloco(DECLARACAO[0], 0, "is-esq")}
        {bloco(DECLARACAO[1], 1, "is-dir")}
      </div>
    </Dobra>
  );
}

/* ---------------------------------------------------------------- 3. marcas */

function Marca({ m }) {
  return (
    <span className="v2-marca">
      {m.logo
        ? <img className="v2-marca-logo" src={m.logo} alt={m.name} loading="lazy" decoding="async" />
        : <span className="v2-marca-nome">{m.name}</span>}
    </span>
  );
}

/* Sem cromo e sem título: no bungee a fileira de logos vem colada na frase de
   tese, como rodapé dela, não como seção nova. É o mesmo aqui. */
function Marquee() {
  const marcas = ALL_MARKS();
  const trilho = marcas.map((m) => <Marca key={m.id} m={m} />);
  return (
    <section className="v2-marquee-secao" aria-label="Marcas por onde o design passou">
      <div className="v2-marquee">
        <div className="v2-marquee-trilho">
          <div className="v2-marquee-fita">{trilho}</div>
          {/* a segunda cópia existe só para o loop não ter costura */}
          <div className="v2-marquee-fita" aria-hidden="true">
            {marcas.map((m) => <Marca key={"b" + m.id} m={m} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 4. casos */

/* Pilha grudada, no formato medido no viper: os casos andam em LINHAS de dois,
   e a linha inteira gruda num `top` 40px maior que a anterior. A linha seguinte
   sobe e cobre a de cima, sobrando a lombada de 40px.

   O que mudou: o card perdeu o raio (M3) e ganhou o cromo de índice em cima da
   mídia, como o bungee faz com `THINGS® _ 07.25`. */
const PILHA_TOPO = 96;    /* nav de 72px, mais respiro */
const PILHA_PASSO = 40;   /* a lombada de cada linha coberta, medida na ref */

/* O quadro, e não a foto chapada. Pedido do Gabriel em 28/08: "não quero essas
   fotos chapadas, prefiro que tenham um fundo com um componente dentro".
   É o tratamento que a V1 já tinha em `.rvm-art` (volume/app.css): chapa na cor
   da marca do cliente, degradê para a cor não ficar lisa, e a tela flutuando
   inteira por cima, com sombra. A retícula pontilhada da V1 fica de fora, por
   pedido dele: ela é idioma de mangá e aqui brigaria com a interface do print.

   `capa.bg` vem de volume/data.jsx, capítulo a capítulo, e é a cor da marca:
   PCYES #B00000, Locarmais #3C1354, ODEX #0D1D52, Oderço #00308F. É o único
   lugar da home onde cor de produto aparece, que é a mesma regra do volume. */
function Cartao({ caso, i, ir }) {
  const cap = caso.chap;
  /* terceiro degrau: locarmais-conciliacao nao tem `cover` nem no capitulo
     nem no projeto, so `shots`. Sem ele o card caia numa chapa de marca vazia,
     que ao lado do print do PCYES lia como card faltando imagem. O primeiro
     shot e tela real do proprio caso. */
  const proj = caso.proj;
  const foto = cap.cover || (proj && (proj.cover || (proj.shots && proj.shots[0])));
  const capa = cap.capa;
  /* capa cheia: arte pronta, sangrando no quadro inteiro. Ver CAPAS_CHEIAS em
     v2/copy.js. Quando existe, a chapa de cor, o degradê, a marca e a tela
     flutuante saem: tudo isso já está dentro do arquivo. */
  const cheia = CAPAS_CHEIAS[caso.id];
  const href = `/case/${caso.id}`;

  /* Pré-carrega a arte do HERO do caso, que é outro arquivo do que este
     cartão mostra: o cartão usa `capa-home` (16/11) e o hero usa `capa-caso`
     (16/9). Sem isso a pessoa clica e o hero fica sem arte enquanto baixa
     entre 98KB e 232KB.

     No ponteiro entrando, no toque e no foco: o hover cobre o mouse, o
     `pointerdown` cobre o dedo, que nunca passa por cima antes, e o foco
     cobre quem anda de teclado. Uma vez só por cartão: o navegador guarda a resposta no cache
     de imagem, e disparar de novo a cada hover não baixaria nada mas criaria
     um objeto Image por passagem do mouse. */
  const pedida = useRef(false);
  const puxaCapa = () => {
    if (pedida.current) return;
    pedida.current = true;
    const alvo = CAPAS_CASO[caso.id] || CAPAS_CHEIAS[caso.id];
    if (alvo) new Image().src = alvo;
  };

  return (
    <article className="v2-cartao">
      <a
        className="v2-cartao-link"
        href={href}
        onPointerEnter={puxaCapa}
        onPointerDown={puxaCapa}
        onFocus={puxaCapa}
        onClick={(e) => { e.preventDefault(); ir(href); }}
      >
        <span
          className="v2-cartao-media"
          data-cheia={cheia ? "1" : undefined}
          style={capa ? { "--chapa": capa.bg } : undefined}
        >
          {cheia ? (
            <img
              className="v2-cartao-capa"
              src={cheia}
              alt=""
              loading={i < 2 ? "eager" : "lazy"}
              decoding="async"
            />
          ) : null}
          {/* o degradê: sem ele a chapa é cor lisa e a tela não tem onde pousar */}
          {cheia ? null : <span className="v2-cartao-luz" aria-hidden="true" />}
          {!cheia && capa && capa.logo ? (
            <img className="v2-cartao-marca" src={capa.logo} alt="" loading="lazy" decoding="async" />
          ) : null}
          {!cheia && foto ? (
            <span className="v2-cartao-tela">
              <img
                className="v2-cartao-foto"
                src={foto}
                alt=""
                loading={i < 2 ? "eager" : "lazy"}
                decoding="async"
              />
            </span>
          ) : null}
        </span>

        <span className="v2-cartao-pe">
          <span className="v2-cartao-texto">
            <h3 className="v2-cartao-t">{cap.title}</h3>
            <span className="v2-cartao-d">{cap.descriptor}</span>
          </span>
          <span className="v2-cartao-dom">
            <span className="v2-cartao-idx">{`_0${i + 1}`}</span>
            {cap.domain}
          </span>
        </span>
      </a>
    </article>
  );
}

function LinhaCasos({ itens, i, total, progresso, ir }) {
  const { escala } = usePilha(progresso, i, total);
  return (
    <motion.div
      className="v2-linha-casos"
      style={{ top: PILHA_TOPO + i * PILHA_PASSO, zIndex: i + 1, scale: escala }}
    >
      {itens.map((c, k) => (
        <Cartao key={c.id} caso={c} i={i * 2 + k} ir={ir} />
      ))}
    </motion.div>
  );
}

/* A fileira de ferramentas ao lado do lead dos casos.
 *
 * Aqui estavam cinco logos de empresa, e elas já passam inteiras na marquee
 * uma dobra acima: repetir a mesma prova duas vezes na mesma rolagem não
 * prova nada de novo. Ao lado dos casos o que responde é COM O QUE eles
 * foram feitos.
 *
 * É a mesma grade da dobra 04 da /sobre, e de propósito a mesma fonte de
 * dados (v2/ferramentas.js) — só que sem nome embaixo e no tamanho de
 * cromo, porque aqui ela é legenda do lead, não conteúdo da dobra. O nome
 * volta no `title`, para quem aponta, e no `alt`, para quem ouve.
 *
 * Ela anda em laço, com a mesma mecânica da marquee de marcas: duas cópias
 * do trilho e -50% de translate, para a costura cair fora da tela. As treze
 * marcas não caberiam na coluna do lead paradas — antes elas quebravam em
 * duas fileiras, agora a fileira é uma só e o que não cabe entra rolando. A
 * cópia de trás é `aria-hidden`, e o hover para o laço para o ponteiro
 * conseguir alcançar um quadrado. */
function ProvaFerramentas() {
  const fita = (dup) =>
    FERRAMENTAS.map((f) => (
      <li className="v2-prova-ferr-item" key={(dup ? "b" : "a") + f.id} title={f.nome}>
        <span className="v2-prova-quadro" style={f.hex ? { "--marca": f.hex } : undefined}>
          <img src={f.arquivo} alt={dup ? "" : f.nome} loading="lazy" decoding="async" draggable="false" />
        </span>
      </li>
    ));
  return (
    <div className="v2-prova-ferr">
      <div className="v2-prova-ferr-trilho">
        <ul className="v2-prova-ferr-fita" aria-label="Ferramentas de trabalho">{fita(false)}</ul>
        {/* a segunda cópia existe só para o laço não ter costura */}
        <ul className="v2-prova-ferr-fita" aria-hidden="true">{fita(true)}</ul>
      </div>
    </div>
  );
}

function Trabalho({ ir }) {
  const lista = casos();
  const linhas = [];
  for (let k = 0; k < lista.length; k += 2) linhas.push(lista.slice(k, k + 2));
  const { ref, progresso } = usePilhaTrilho();
  return (
    <Dobra id="casos" n="02" nome="Trabalho" carimbo="©26" aria-label="Casos">
      {/* As cinco partes do viper. É a dobra que o Gabriel dissecou. */}
      <Cabecalho
        olho="Casos"
        titulo="Trabalho selecionado"
        marca="®"
        lead="Quatro projetos abertos por inteiro: o problema, o que a pesquisa mostrou, o que foi cortado e o que sobrou no ar."
        cta={<Pill href="#pecas">Ver tudo</Pill>}
        nota="Feito com"
        prova={<ProvaFerramentas />}
      />
      <div className="v2-pilha" ref={ref}>
        {linhas.map((itens, i) => (
          <LinhaCasos key={i} itens={itens} i={i} total={linhas.length} progresso={progresso} ir={ir} />
        ))}
      </div>
    </Dobra>
  );
}

/* ----------------------------------------------------------------- 6. números */

/* A dobra de dado que a V2 não tinha. O Gabriel chamou a do porto de MUITO
   FODA, e o mecanismo é o tamanho: 128px faz o número virar afirmação.

   Nada aqui é inventado. Os quatro valores saem de volume/data.jsx: COMPANIES,
   CASE_ORDER e PIECE_ORDER. O ano de início é 2024, que é o `anos` da primeira
   empresa da lista. */
const ANO_INICIO = 2024;

function Numeros() {
  const empresas = COMPANIES().length;
  const casosN = casos().length;
  const pecas = pieceProjects().length;
  const anos = Math.max(1, new Date().getFullYear() - ANO_INICIO);
  return (
    <Dobra id="numeros" n="03" nome="Em números" carimbo="©26">
      <Cabecalho
        olho="Escala"
        titulo="O que já saiu da mesa"
        lead="Números de produção, não de vaidade: cada um deles tem página no site."
      />
      <div className="v2-numeros">
        <Contador ate={casosN} rotulo="Casos abertos" nota="Problema, pesquisa e resultado" />
        <Contador ate={casosN + pecas} rotulo="Projetos publicados" nota="Casos mais peças" />
        <Contador ate={empresas} rotulo="Times por dentro" nota="Estágio, UX e produto" />
        <Contador ate={anos} sufixo="+" rotulo="Anos em produto" nota={`Desde ${ANO_INICIO}`} />
      </div>
    </Dobra>
  );
}

/* --------------------------------------------------------------- 7. processo */

/* A dobra do método, agora um índice.

   O que tinha antes eram três colunas em escada com uma ilustração de 320x200
   cada. Gabriel: "achei muito forçado", e ele tem razão. A dobra inventava
   arte para justificar três frases, e nenhuma das seis referências faz isso:
   quando não têm material, elas resolvem com régua, número e tipografia. Este
   é o índice do viper, três linhas em largura cheia separadas por filete.

   O nome do passo entra em negrito na frente da própria frase, que é o
   componente da launchfolio (primeira sentença forte, resto normal). Assim ele
   não pede um sexto degrau na escala, que a gramática proíbe.

   A régua de cada linha se desenha da esquerda para a direita quando a linha
   entra, e o número acende. É o mesmo gesto três vezes: vocabulário repetido,
   que é o que docs/ANALISE-REFS.md cobra. */
function Processo({ ir }) {
  const quieto = useReducedMotion();
  /* Estas duas curvas eram locais e escaparam do acerto de velocidade de
     bf26a57, que levou o resto do site de 1,2s para dur=0,6s. Ficaram em 0,9s,
     50% mais lentas que qualquer outra revelação da página — era a queixa de
     "pesado" desta dobra. Agora leem dur/passo/easeRevela de motion.js, então
     o próximo acerto global pega estas junto.

     O blur(6px) saiu por inteiro, e não encurtado: com y+opacity ele não
     acrescenta leitura, e é a única propriedade aqui que o compositor não
     resolve sozinho — cada quadro repinta a linha. O gesto continua sendo
     subir e acender. */
  const regua = quieto
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, transition: { duration: 0.2 } }
    : {
        initial: { scaleX: 0 },
        whileInView: { scaleX: 1 },
        transition: { duration: dur, ease: easeRevela },
      };
  const linha = (i) =>
    quieto
      ? {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true, amount: 0.4 },
          transition: { duration: 0.2 },
        }
      : {
          initial: { opacity: 0, y: 12 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.4 },
          transition: { duration: dur, ease: easeRevela, delay: 0.1 + i * passo },
        };

  return (
    <Dobra id="processo" n="04" nome="Método" carimbo="©26">
      <Cabecalho
        olho="Como eu trabalho"
        titulo={<DuasCores fraca="Do objetivo" forte="ao ar" />}
        lead="Três movimentos, e o do meio é o que a maioria pula."
        /* A dobra mostra três frases de um método que tem uma página inteira.
           Quem quis saber mais aqui tinha que voltar à nav para descobrir que a
           página existe. Secundário e não primário: a home tem UM primário, e
           ele está na hero. */
        cta={<Pill href="/processo" onClick={rota(ir, "/processo")} secundario>Ver o método inteiro</Pill>}
      />
      <ol className="v2-indice">
        {PROCESSO_CURTO.map((f, i) => {
          const Marca = ILUSTRACOES[i];
          return (
            <li className="v2-linha" key={f.titulo}>
              <motion.span
                className="v2-linha-regua"
                aria-hidden="true"
                viewport={{ once: true, amount: 0.4 }}
                {...regua}
              />
              <motion.span className="v2-linha-n" aria-hidden="true" {...linha(i)}>
                {`( 00${i + 1} )`}
              </motion.span>
              <motion.p className="v2-linha-p" {...linha(i)}>
                <b className="v2-linha-t">{f.titulo}.</b> {f.frase}
              </motion.p>
              <motion.span className="v2-linha-m" aria-hidden="true" {...linha(i)}>
                <Marca />
              </motion.span>
            </li>
          );
        })}
      </ol>
    </Dobra>
  );
}

/* A trajetória, no componente da coluna presa.

   A linha do tempo com trilho vertical saiu: ela era a mesma forma da dobra
   04 (linha, filete, texto) e não usava a única coisa visual que esta dobra
   tem de verdade, que é a marca das empresas.

   Agora a esquerda fica parada com a logo da empresa que está na altura da
   leitura, e a direita rola. A logo troca sozinha: é a informação mudando de
   lugar, não um enfeite entrando. Quem não tem arquivo de logo entra em
   wordmark, que é como a V1 já resolve o mesmo caso (ver CompanyLogo em
   volume/data.jsx).

   O estado ativo NÃO é feito com cinza claro. Cinza claro sobre branco
   reprova contraste, e a dobra inteira cairia no axe: o que muda é o preto
   contra o cinza de texto, mais o índice em vermelho, que é grafismo. */
function OndeEstive({ ir }) {
  const quieto = useReducedMotion();
  const rise = useRise();
  const lista = COMPANIES();
  const { ativo, marcar } = useNaAltura(lista.length);
  const atual = lista[ativo] || lista[0];
  /* a marca em cor, se existir; senão a mono da V1; senão o wordmark */
  const marca = LOGOS_COR[atual.id] || atual.logo;

  return (
    <Dobra id="onde" n="05" nome="Trajetória" carimbo="©26">
      <Presa
        esquerda={
          <>
            <Cabecalho
              empilhado
              olho="Onde estive"
              titulo={<DuasCores fraca="A linha" forte="do tempo" />}
              /* A trajetória lista empresa e período; quem quer a pessoa por
                 trás da lista continua na /sobre, e daqui até agora não havia
                 caminho. A dobra 06, que é a da ilustração, NÃO ganha CTA: ela
                 é a assinatura da home e fechar com um botão a transformaria em
                 mais uma seção de conversão. */
              cta={<Pill href="/sobre" onClick={rota(ir, "/sobre")} secundario>Quem eu sou</Pill>}
            />
            <div className="v2-tra-marca">
              {/* a chave remonta o bloco: é a troca que anima, e não a logo
                  que aparece do nada em cima da anterior */}
              <motion.div
                key={atual.id}
                className="v2-tra-marca-in"
                initial={quieto ? { opacity: 0 } : { opacity: 0, y: 10, filter: "blur(6px)" }}
                animate={quieto ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: quieto ? 0.2 : 0.7, ease }}
              >
                {marca ? (
                  <img className="v2-tra-logo" src={marca} alt={`Marca da ${atual.name}`} draggable="false" />
                ) : (
                  <span className="v2-tra-wordmark">{atual.name}</span>
                )}
                <p className="v2-tra-periodo">
                  {atual.period}
                  {atual.atual ? <span className="v2-tra-agora">agora</span> : null}
                </p>
              </motion.div>
            </div>
            <p className="v2-tra-conta" aria-hidden="true">
              <b>{String(ativo + 1).padStart(3, "0")}</b> / {String(lista.length).padStart(3, "0")}
            </p>
          </>
        }
      >
        {lista.map((c, i) => (
          <motion.article
            key={c.id}
            className="v2-tra-item"
            data-vivo={i === ativo ? "1" : undefined}
            ref={marcar(i)}
            {...rise(Math.min(i, 3))}
          >
            <p className="v2-tra-topo">
              <span className="v2-tra-n">{`( 00${i + 1} )`}</span>
              <span className="v2-tra-anos">{c.anos}</span>
            </p>
            <h3 className="v2-tra-nome">{c.name}</h3>
            <p className="v2-tra-papel">{c.role}<span className="v2-tra-sep"> · </span>{c.period}</p>
            <p className="v2-corpo v2-tra-texto">{c.blurb}</p>
            {c.note ? <p className="v2-tra-pe">{c.note}</p> : null}
          </motion.article>
        ))}
      </Presa>
    </Dobra>
  );
}

/* ------------------------------------------------------------------ 9. sobre */

/* O efeito do porto que o Gabriel elogiou mais que qualquer outro: a foto
   cresce conforme a dobra passa e cruza por cima do texto, revelando o nome.

   Mecanismo: a foto é a camada de baixo e escala de 0.55 até 1 ao longo do
   curso da dobra; o texto fica preso por cima com mix-blend-mode. Em
   reduced-motion a foto entra já no tamanho final e nada se move. */
function Sobre() {
  const alvo = useRef(null);
  const quieto = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: alvo, offset: ["start end", "end start"] });
  const escala = useTransform(scrollYProgress, [0, 0.55], [0.55, 1]);
  const sobe = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);
  return (
    <Dobra id="sobre-mim" n="06" nome="Quem assina" carimbo="©26" largo>
      <div className="v2-sobre" ref={alvo}>
        <motion.div
          className="v2-sobre-foto"
          style={quieto ? undefined : { scale: escala, y: sobe }}
        >
          <img src="/volume/assets/gabriel-recorte.webp" alt="Gabriel Felix Barbosa" loading="lazy" />
        </motion.div>
        <h2 className="v2-sobre-nome" aria-hidden="true">GABRIEL</h2>
      </div>
      <div className="v2-sobre-texto">
        <p className="v2-sobre-frase">
          Designer de produto em Maringá, que aprende o problema antes de abrir o Figma
          e implementa quando o prazo aperta.
        </p>
        <Assinatura>Gabriel Felix Barbosa</Assinatura>
      </div>
    </Dobra>
  );
}

/* A assinatura da dobra 06, escrita à mão.

   Ephesis, do Google Fonts. Escolhida por comparação de prancha contra outras
   nove cursivas: é a que tem mão de verdade sem virar convite de casamento,
   continua legível no sobrenome, e é monolinear, então não briga com a régua
   reta do resto do site. É placeholder assumido: vira SVG com traço desenhado
   quando o Gabriel mandar a assinatura dele, e aí useEscrita troca a máscara
   por stroke-dasharray.

   O <p> continua sendo o texto acessível: a máscara é só pintura, o leitor de
   tela lê o nome inteiro desde o primeiro quadro. */
function Assinatura({ children }) {
  const { ref, estilo } = useEscrita();
  return (
    <p className="v2-sobre-ass" ref={ref}>
      <motion.span className="v2-sobre-ass-tinta" style={estilo}>
        {children}
      </motion.span>
    </p>
  );
}

/* ----------------------------------------------------------------- 10. peças */

/* Peça extra num portfólio de UX não pode ter tratamento de caso: os casos
   provam PROFUNDIDADE, e estas provam ALCANCE. Se as duas competirem, some a
   diferença entre elas — por isso o card daqui é menor, mais quieto e sem
   nenhum motion próprio.

   Era uma fita que corria sozinha, e ela não explicava nada: dezoito projetos
   passavam como imagem sem nome, sem o que era, sem para onde ir. Virou grade
   porque o trabalho desta dobra é ser VARRIDA — ninguém lê dezoito descrições,
   mas todo mundo passa o olho em dezoito capas.

   Sobre manter: a foto sai de `pieceCover` e o destino de `pieceDestino`, os
   dois em volume/data.jsx. É de propósito que o card não saiba montar nenhum
   dos dois sozinho — quando o painel de detalhe entrar, ele lê das mesmas duas
   funções e a foto é literalmente a mesma. Trocar `cover` no projeto troca nos
   dois lugares.

   Onze das dezoito não têm arte nenhuma em disco (medido em 29/08). Elas não
   somem nem viram lista de texto: ficam como card de tipografia, com o mesmo
   tamanho das outras, para a grade não abrir buraco. Assim que o mockup
   entrar em `cover`, o card vira foto sem mexer em código. */
function Pecas() {
  const lista = pieceProjects();
  if (!lista.length) return null;

  /* Com foto primeiro. A ordem editorial do PIECE_ORDER continua valendo
     DENTRO de cada grupo — o que ela não previa é que a maioria ainda não tem
     arte, e abrir a dobra com quatro cards de tipografia entrega a seção pelo
     que falta nela. Conforme as fotos entrarem, isto volta sozinho para a
     ordem dele. Para desligar, apague o sort. */
  const ordenada = lista.slice().sort((a, b) => !!pieceCover(b) - !!pieceCover(a));

  return (
    <section className="v2-pecas-secao" id="pecas" aria-label="Outras peças">
      <div className="v2-wrap"><Cromo n="07" nome="Fora da estante" carimbo="©26" /></div>
      <ul className="v2-pecas-grade">
        {ordenada.map((p) => {
          const foto = pieceCover(p);
          const destino = pieceDestino(p);
          return (
            <li className="v2-peca" key={p.id}>
              <div className="v2-peca-midia">
                {foto ? (
                  <img src={foto} alt={p.title} loading="lazy" decoding="async" draggable="false" />
                ) : (
                  /* aria-hidden: o domínio já é lido no pé do card, e repetir
                     aqui só faz o leitor de tela ouvir duas vezes */
                  <span className="v2-peca-semfoto" aria-hidden="true">{p.domain || p.title}</span>
                )}
              </div>
              <div className="v2-peca-corpo">
                <h3 className="v2-peca-tit">{p.title}</h3>
                {p.desc ? <p className="v2-peca-desc">{p.desc}</p> : null}
                <p className="v2-peca-pe">
                  <span className="v2-peca-dom">{p.domain}</span>
                  {destino ? (
                    <a
                      className="v2-peca-link"
                      href={destino.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      /* o nome do projeto entra no rótulo acessível porque
                         "Ver no ar" sozinho se repete dezoito vezes na lista
                         de links do leitor de tela */
                      aria-label={`${destino.rotulo}: ${p.title}, abre em nova aba`}
                    >
                      {destino.rotulo}
                    </a>
                  ) : null}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* -------------------------------------------------------------------- home */

export default function Home({ ir }) {
  const rolar = () => {
    const alvo = document.getElementById("casos");
    if (alvo) rolarPara(alvo);
  };

  return (
    <>
      <Hero paraCasos={rolar} />
      {/* Tudo que vem depois do hero é opaco e sobe por cima dele. Sem este
          fundo, o hero preso aparece por baixo das dobras claras. */}
      <CampoDeVoo variante="home" classe="v2-corpo-claro v2-corpo-lamina" data-clara="1">
        <Lamina />
        <Declaracao />
        <Marquee />
        <Trabalho ir={ir} />
        {/* Muda de proposito, e escura de proposito. O porque da arte, do
            formato 2.14:1 e da cor esta na definicao de QUEBRA, no topo. */}
        <Quebra src={QUEBRA} alt="" aria-hidden="true" />
        <Numeros />
        <Processo ir={ir} />
        <OndeEstive ir={ir} />
        <Sobre />
        <Pecas />
      </CampoDeVoo>
    </>
  );
}
