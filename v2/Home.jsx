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
  spring, ease, useTardio, useRise, useMaskLine, useCobertura,
  usePilha, usePilhaTrilho, usePalavra, useRevelar, useEscrita, useNaAltura,
  useVoo,
} from "./motion.js";
import { Pill } from "./Shell.jsx";
import { ILUSTRACOES } from "./Ilustracoes.jsx";
import { Cromo, Relogio, Dobra, Titulo, Cabecalho, Quebra, Contador, DuasCores, Presa } from "./Kit.jsx";
import {
  ALL_MARKS, VOL, COMPANIES,
  casos, pieceProjects, pieceLink,
} from "./content.js";
import { HERO, DECLARACAO, PROCESSO_CURTO, CAPAS_CHEIAS, LOGOS_COR } from "./copy.js";

/* A quebra entre casos e números, em largura total. 1600x613 aguenta 100vw.

   Pedido do Gabriel em 28/08: capa de banco, moderna, cor chamativa, no lugar
   do print de sistema que estava aqui (a busca da V2 do PCYES, em
   volume/assets/projetos/pcyes/busca-v2.webp, se for para voltar).

   StockSnap, CC0, uso comercial liberado e sem atribuição, via a API da
   Openverse (Unsplash e Pexels continuam atrás de bot-wall). O original só
   serve 960px de largura, então isto é upscale para 1600: passa porque a
   imagem é abstrata e desfocada, e não tem detalhe para perder. Se ela ficar,
   vale procurar a mesma coisa em resolução nativa. */
const QUEBRA = "/volume/assets/stock/capa-quebra.webp";

/* ------------------------------------------------------------------ 1. hero */

/* A palavra rotativa da V1, refeita com mola no lugar do CSS por caractere.
   Ela ocupa a linha inteira: assim a troca nunca muda onde a headline quebra,
   que era o problema que a V1 resolvia medindo a caixa a cada troca. */
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
          <Pill onClick={paraCasos} escuro>Ver os casos</Pill>
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

/* A fita de mídia do bungee SAIU. Recusada pelo Gabriel em 28/08, palavras
   dele: "não curti essas ideias dos vídeos em círculo, acho que não combinou".
   Ele tem razão, e o motivo está na própria ANÁLISE: a fita do bungee carrega
   render 3D e moda, onde a coluna em arco É a arte. Com tela de sistema
   dentro, o arco corta justo a interface e sobra forma sem conteúdo.

   No lugar entra a passagem do viper, medida em ~/dev/refs/viper-template: o
   escuro termina em corte seco e o branco abre com uma régua fina e a cruz de
   registro no meio dela. Nada se move, e mesmo assim responde "mudei de
   seção", que era o pedido. A cruz é a mesma `.v2-cruz` do Shell. */
function Passagem() {
  return (
    <div className="v2-passagem" aria-hidden="true">
      <span className="v2-passagem-linha" />
      <span className="v2-cruz" />
      <span className="v2-passagem-linha" />
    </div>
  );
}


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
   PCYES #B00000, Locar Mais #3C1354, ODEX #0D1D52, Oderço #00308F. É o único
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
  const href = `/v2/case/${caso.id}`;
  return (
    <article className="v2-cartao">
      <a
        className="v2-cartao-link"
        href={href}
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

function Trabalho({ ir }) {
  const lista = casos();
  const linhas = [];
  for (let k = 0; k < lista.length; k += 2) linhas.push(lista.slice(k, k + 2));
  const { ref, progresso } = usePilhaTrilho();
  const marcas = ALL_MARKS().slice(0, 5);
  return (
    <Dobra id="casos" n="02" nome="Trabalho" carimbo="©26" aria-label="Casos">
      {/* As cinco partes do viper. É a dobra que o Gabriel dissecou. */}
      <Cabecalho
        olho="Casos"
        titulo="Trabalho selecionado"
        marca="®"
        lead="Quatro projetos abertos por inteiro: o problema, o que a pesquisa mostrou, o que foi cortado e o que sobrou no ar."
        cta={<Pill href="#pecas">Ver tudo</Pill>}
        nota="Também passei por"
        prova={
          <span className="v2-prova-logos" aria-hidden="true">
            {marcas.map((m) => <Marca key={m.id} m={m} />)}
          </span>
        }
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

/* O avião. Fica atrás de tudo e recortado na caixa do corpo: assim ele passa
   por baixo das dobras e nunca empurra a largura da página. */
function Voo({ caminho, distancia }) {
  return (
    <div className="v2-voo" aria-hidden="true">
      <motion.div
        className="v2-voo-obj"
        style={{
          offsetPath: `path("${caminho}")`,
          offsetDistance: distancia,
          offsetRotate: "auto",
        }}
      >
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M23 12 L3 3 L9 12 L3 21 Z" fill="var(--v2-accent)" />
        </svg>
      </motion.div>
    </div>
  );
}

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
function Processo() {
  const quieto = useReducedMotion();
  const regua = quieto
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, transition: { duration: 0.2 } }
    : {
        initial: { scaleX: 0 },
        whileInView: { scaleX: 1 },
        transition: { duration: 0.9, ease },
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
          initial: { opacity: 0, y: 16, filter: "blur(6px)" },
          whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
          viewport: { once: true, amount: 0.4 },
          transition: { duration: 0.9, ease, delay: 0.1 + i * 0.05 },
        };

  return (
    <Dobra id="processo" n="04" nome="Método" carimbo="©26">
      <Cabecalho
        olho="Como eu trabalho"
        titulo={<DuasCores fraca="Do objetivo" forte="ao ar" />}
        lead="Três movimentos, e o do meio é o que a maioria pula."
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
function OndeEstive() {
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

/* Peça extra num portfólio de UX não pode ter tratamento de caso. Uma fita que
   corre sozinha, altura baixa. As sem imagem viram uma linha de texto. */
function Fita() {
  const lista = pieceProjects();
  const capa = (p) => p.cover || (p.shots && p.shots[0]);
  const comFoto = lista.filter(capa);
  const semFoto = lista.filter((p) => !capa(p));
  if (!comFoto.length) return null;

  const item = (p, dobra) => {
    const href = pieceLink(p);
    const Tag = href && !dobra ? "a" : "span";
    return (
      <Tag
        key={(dobra ? "b" : "") + p.id}
        className="v2-fita-item"
        href={!dobra && href ? href : undefined}
        target={!dobra && href ? "_blank" : undefined}
        rel={!dobra && href ? "noopener noreferrer" : undefined}
        aria-hidden={dobra ? "true" : undefined}
        tabIndex={dobra ? -1 : undefined}
        /* o nome acessível já vinha do alt da imagem, mas o link abre em aba
           nova e isso não era anunciado em lugar nenhum */
        aria-label={dobra || !href ? undefined : `${p.title}, abre em nova aba`}
      >
        <img src={capa(p)} alt={dobra ? "" : p.title} loading="lazy" decoding="async" />
      </Tag>
    );
  };

  return (
    <section className="v2-fita-secao" id="pecas" aria-label="Outras peças">
      <div className="v2-wrap"><Cromo n="07" nome="Fora da estante" carimbo="©26" /></div>
      <div className="v2-fita">
        <div className="v2-fita-trilho">
          <div className="v2-fita-grupo">{comFoto.map((p) => item(p, false))}</div>
          {/* a segunda cópia existe só para o loop não ter costura */}
          <div className="v2-fita-grupo">{comFoto.map((p) => item(p, true))}</div>
        </div>
      </div>

      {semFoto.length ? (
        <p className="v2-fita-resto">
          <span className="v2-fita-resto-r">Também passaram por aqui</span>
          {semFoto.map((p, i) => (
            <span key={p.id}>
              {i ? <span aria-hidden="true"> · </span> : " "}
              {p.title}
            </span>
          ))}
        </p>
      ) : null}
    </section>
  );
}

/* -------------------------------------------------------------------- home */

export default function Home({ ir }) {
  const corpo = useRef(null);
  const voo = useVoo(corpo);
  const rolar = () => {
    const alvo = document.getElementById("casos");
    if (alvo) alvo.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Hero paraCasos={rolar} />
      {/* Tudo que vem depois do hero é opaco e sobe por cima dele. Sem este
          fundo, o hero preso aparece por baixo das dobras claras. */}
      <div className="v2-corpo-claro" data-clara="1" ref={corpo}>
        {/* primeiro filho de propósito: entre posicionados de mesmo nível quem
            vem antes no DOM pinta antes, então o avião fica atrás das dobras
            sem precisar empilhar z-index em todas elas */}
        {voo.caminho && !voo.quieto ? <Voo {...voo} /> : null}
        <Passagem />
        <Declaracao />
        <Marquee />
        <Trabalho ir={ir} />
        {/* Era fumaca de banco: 666px de video que nao dizia nada sobre o
            trabalho, no meio de um portfolio de UX. Agora e tela real em
            largura total, sem moldura de device, que e o tratamento que
            docs/ANALISE-REFS.md prescreve para print de sistema. */}
        <Quebra src={QUEBRA} alt="" aria-hidden="true" />
        <Numeros />
        <Processo />
        <OndeEstive />
        <Sobre />
        <Fita />
      </div>
    </>
  );
}
