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
import { Cromo, Relogio, Dobra, Titulo, Cabecalho, Campo, Contador, DuasCores, Presa, CampoDeVoo, Lamina } from "./Kit.jsx";
import {
  ALL_MARKS, VOL, COMPANIES, CONTATO,
  casos, pieceProjects, pieceCover, pieceDestino, pieceStatus,
} from "./content.js";
import { HERO, DECLARACAO, METODO, CAPAS_CHEIAS, CAPAS_CASO, LOGOS_COR } from "./copy.js";
import { FERRAMENTAS } from "./ferramentas.js";

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
  const parada = !itens || itens.length < 2;
  useEffect(() => {
    if (quieto || parada) return;
    const t = setInterval(() => setI((v) => (v + 1) % itens.length), intervalo);
    return () => clearInterval(t);
  }, [itens.length, intervalo, quieto, parada]);
  /* Uma frase só não gira: sai do AnimatePresence e vira texto, sem o timer
     e sem a caixa de troca. É como a home ficou desde 30/08 — a peça
     continua aqui porque ela é da V1 e ainda serve se voltar a ter lista. */
  if (quieto || parada) return <span className="v2-rot">{itens[0]}</span>;
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
            <motion.span {...linha(3)}><Rotativa itens={[HERO.fixa]} /></motion.span>
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
            {/* O tempo de leitura no cartão, e não só dentro do caso: aqui é
                onde a escolha acontece. Quem tem quatro minutos vê que o 01
                pede 19 e entra pelo 03, que pede 3 — em vez de abrir o mais
                longo, desistir no meio e sair do site achando que leu. */}
            {cap.minutos ? <span className="v2-cartao-min">{`${cap.minutos} min`}</span> : null}
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
    <Dobra id="casos" n="02" nome="Trabalho" carimbo="©26" aria-label="Projetos">
      {/* As cinco partes do viper. É a dobra que o Gabriel dissecou. */}
      <Cabecalho
        olho="Projetos"
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
  const marcas = ALL_MARKS().length;
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
      {/* Cinco e nao quatro desde 29/08. Com quatro colunas a dobra abria um
          vazio grande a esquerda, embaixo do titulo, e o Gabriel leu como
          desalinhamento — nao era, mas parecia.

          O quinto dado nao foi inventado para preencher a linha: ALL_MARKS ja
          existe e ja esta na tela, e a fita de logos duas dobras acima. E o
          unico numero disponivel que fala de ESCALA, que e o assunto da dobra,
          e o unico grande o bastante para dividir a linha com o 22 sem parecer
          enchimento. A regra da dobra continua valendo: nada aqui e digitado a
          mao, tudo sai de volume/data.jsx.

          A ordem desce: 4, 22, 17, 3, 2. */}
      <div className="v2-numeros">
        <Contador ate={casosN} rotulo="Projetos abertos" nota="Abertos por inteiro" />
        <Contador ate={casosN + pecas} rotulo="Projetos publicados" nota="Abertos mais peças" />
        <Contador ate={marcas} rotulo="Marcas atendidas" nota="Todas na fita acima" />
        <Contador ate={empresas} rotulo="Times por dentro" nota="Estágio, UX e produto" />
        <Contador ate={anos} sufixo="+" rotulo="Anos em produto" nota={`Desde ${ANO_INICIO}`} />
      </div>
    </Dobra>
  );
}

/* --------------------------------------------------------------- 7. método */

/* A dobra do método.

   Era um índice de três frases sobre si mesmo, e virou a tese que a /processo
   defende. O porquê está anotado em METODO, em copy.js.

   A forma é a do par de blocos da dobra 01, que é a gramática que a home já
   usa para duas coisas complementares: cromo em cima, uma linha em display,
   um parágrafo de leitura embaixo. Um degrau ABAIXO na escala de tipo, de
   propósito — repetir o display de 88px faria a dobra 04 ler como uma
   segunda abertura, e ela não é: ela é a porta da página de método. */
function Metodo({ ir }) {
  const revelar = useRevelar();
  return (
    <Dobra id="processo" n="04" nome="Método" carimbo="©26">
      <Cabecalho
        olho="Como eu trabalho"
        titulo={<DuasCores fraca="Não é um processo." forte="São dois." />}
        lead={METODO.lead}
        /* Secundário, como antes: a home tem UM primário, e ele está na hero. */
        cta={<Pill href="/processo" onClick={rota(ir, "/processo")} secundario>Ver o método inteiro</Pill>}
      />
      <div className="v2-met-par">
        {METODO.caminhos.map((c, i) => (
          <motion.div className="v2-met-bloco" key={c.olho} {...revelar(i)}>
            <p className="v2-olho">{c.olho}</p>
            <p className="v2-met-frase">{c.frase}</p>
            <p className="v2-lead v2-met-nota">{c.nota}</p>
          </motion.div>
        ))}
      </div>
      {/* O fecho fica FORA do par: ele não pertence a nenhum dos dois caminhos,
          é a regra que vale para os dois. Por isso atravessa a dobra inteira,
          na régua, em vez de morar dentro de uma das colunas. */}
      <motion.p className="v2-met-fecho" {...revelar(2)}>{METODO.fecho}</motion.p>
    </Dobra>
  );
}


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
                transition={{ duration: quieto ? 0.2 : 0.45, ease }}
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
   diferença entre elas.

   A fita corre sozinha e é só mockup — parada, ela viraria uma segunda grade
   de casos e roubaria a dobra. O que ela não pode ser é muda: antes passava
   imagem sem nome, sem o que era e sem para onde ir.

   A saída é o foco no hover, e ele resolve os dois de uma vez. Em repouso a
   fita é ritmo puro, sem texto competindo com os casos. Sob o ponteiro, o
   laço para, as outras desfocam e SÓ a peça apontada acende: escurece por
   dentro para a tipografia clara aparecer, e entrega nome, resumo e ação.
   Um item por vez, que é o que o formato pede.

   Teclado tem o mesmo caminho: `:focus-within` acende igual ao hover, então
   quem chega pelo Tab não fica com o card mudo. A cópia de trás do laço é
   `aria-hidden` e sai da ordem de foco, senão cada peça apareceria duas vezes.

   Sobre manter: a foto sai de `pieceCover` e o destino de `pieceDestino`, os
   dois em volume/data.jsx. O card não monta nenhum dos dois sozinho de
   propósito — quando o painel de detalhe entrar, ele lê das mesmas funções e
   a foto é literalmente a mesma imagem.

   Onze das dezoito não têm arte em disco (medido em 29/08) e simplesmente não
   aparecem. Havia uma linha de texto listando os nomes delas, e ela saiu a
   pedido do Gabriel: nome solto sem capa não prova nada e ainda entregava a
   dobra pelo que falta. Fita é de mockup — assim que a arte entrar em `cover`,
   a peça sobe para a fita sozinha. */
function Pecas() {
  const lista = pieceProjects();
  const comFoto = lista.filter(pieceCover);
  if (!comFoto.length) return null;

  const item = (p, dobra) => {
    const destino = pieceDestino(p);
    const status = pieceStatus(p);
    return (
      <div
        className="v2-fita-item"
        key={(dobra ? "b" : "") + p.id}
        aria-hidden={dobra ? "true" : undefined}
      >
        <img src={pieceCover(p)} alt={dobra ? "" : p.title} loading="lazy" decoding="async" draggable="false" />
        {/* O selo fica FORA do foco: ele e a unica coisa do card que precisa
            ser lida sem passar o ponteiro. Numa fita de dez peças, saber quais
            estao no ar e a informacao que separa "portfolio" de "vitrine", e
            ela nao pode depender de hover. */}
        {status ? (
          <span className="v2-fita-selo" data-ar={status.ar ? "1" : undefined}>
            <span className="v2-fita-selo-ponto" aria-hidden="true" />
            {status.rotulo}
          </span>
        ) : null}
        <div className="v2-fita-foco">
          <h3 className="v2-fita-tit">{p.title}</h3>
          {p.desc ? <p className="v2-fita-desc">{p.desc}</p> : null}
          {/* A ação era um filete em mono, e era a única peça do site que
              inventava um botão só para si: a mesma vaga no card de caso já é
              servida pela pílula. Trocada pela `Pill secundario escuro`, que é
              literalmente o botão de contorno branco da hero — um botão a
              menos para manter, e o card passa a ler como o resto do kit. */}
          {destino ? (
            <Pill
              secundario
              escuro
              href={destino.href}
              externo
              /* a cópia do laço não pode receber Tab: sem isto cada peça
                 apareceria duas vezes na lista de links */
              tabIndex={dobra ? -1 : undefined}
              /* "Ver no ar" sozinho se repetiria em toda a fita */
              aria-label={`${destino.rotulo}: ${p.title}, abre em nova aba`}
            >
              {destino.rotulo}
            </Pill>
          ) : null}
          {/* "Em breve" nao tem botao: quem diz isso agora e o selo no topo do
              card, e ele fica visivel o tempo todo. Repetir a mesma palavra
              numa pilula ao passar o ponteiro era dizer duas vezes a mesma
              coisa no mesmo cartao. */}
        </div>
      </div>
    );
  };

  return (
    <section className="v2-fita-secao" id="pecas" aria-label="Outros projetos">
      {/* A dobra abria com o nome dela na mono do cromo, e so: "Fora da
          estante" tinha o tamanho de uma legenda de 11px sustentando uma
          secao inteira. Toda outra dobra da home abre com cromo + titulo de
          display; esta era a unica que nao abria, e por isso lia como rodape
          da anterior em vez de secao nova. O cromo continua sendo a regua
          (indice, nome curto, carimbo) e o titulo passa a ser titulo. */}
      <div className="v2-wrap v2-fita-cabeca">
        <Cromo n="07" nome="Peças" carimbo="©26" />
        <Titulo>Outros projetos</Titulo>
      </div>
      <div className="v2-fita">
        <div className="v2-fita-trilho">
          <div className="v2-fita-grupo">{comFoto.map((p) => item(p, false))}</div>
          {/* a segunda cópia existe só para o laço não ter costura */}
          <div className="v2-fita-grupo">{comFoto.map((p) => item(p, true))}</div>
        </div>
      </div>
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
        <Numeros />
        {/* A quebra vinha ANTES dos numeros, e isso partia uma frase no meio:
            "Trabalho selecionado" e "O que ja saiu da mesa" sao a mesma coisa
            dita em duas partes — o trabalho, e a escala dele. Imagem cheia
            entre as duas separava sujeito de predicado.

            Aqui ela separa dois movimentos de verdade: o que eu fiz e em que
            escala, respiro, como eu trabalho e onde estive. E resolve o ritmo,
            que era a queixa do Gabriel: a dobra de casos ja e quatro cartoes
            com capa, entao emendar imagem cheia logo depois era imagem sobre
            imagem. Agora alterna — imagem, tipografia, imagem, tipografia.

            Nenhum cromo precisou ser renumerado: a quebra nao tem indice, de
            proposito. Ela nao e uma dobra, e a passagem entre duas. */}
        <Campo />
        <Metodo ir={ir} />
        <OndeEstive ir={ir} />
        <Sobre />
        <Pecas />
      </CampoDeVoo>
    </>
  );
}
