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
  useSticky, usePilha, usePilhaTrilho, usePalavra, useRevelar, useEscrita,
  useTrilha,
} from "./motion.js";
import { Pill } from "./Shell.jsx";
import { Cromo, Relogio, Dobra, Titulo, Cabecalho, Quebra, Contador } from "./Kit.jsx";
import {
  ALL_MARKS, VOL, COMPANIES,
  casos, pieceProjects, pieceLink,
} from "./content.js";
import { HERO, DECLARACAO, PROCESSO_CURTO, PROTOTIPO } from "./copy.js";

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
  return (
    <section className="v2-hero v2-grao v2-halo" id="v2-hero" data-escuro="1" ref={capa.ref}>
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
  const palavras = DECLARACAO.split(" ");
  const corte = Math.ceil(palavras.length / 2);
  const { ref, palavras: anim, quieto } = usePalavra(palavras.length);
  const trecho = (de, ate, classe) => (
    <p className={`v2-declaracao ${classe}`}>
      {palavras.slice(de, ate).map((w, k) => {
        const i = de + k;
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
              {w}
            </motion.span>
            {i < ate - 1 ? " " : null}
          </React.Fragment>
        );
      })}
    </p>
  );
  return (
    <Dobra id="sobre" n="01" nome="A tese" carimbo="©26">
      <div className="v2-declaracao-par" ref={ref}>
        {trecho(0, corte, "is-esq")}
        {trecho(corte, palavras.length, "is-dir")}
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
          style={capa ? { "--chapa": capa.bg } : undefined}
        >
          {/* o degradê: sem ele a chapa é cor lisa e a tela não tem onde pousar */}
          <span className="v2-cartao-luz" aria-hidden="true" />
          {capa && capa.logo ? (
            <img className="v2-cartao-marca" src={capa.logo} alt="" loading="lazy" decoding="async" />
          ) : null}
          {foto ? (
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

/* A trilha do porto: a linha se desenha da esquerda para a direita e o nó
   acende quando a ponta chega nele. Os nós são quadrados, não círculos: a
   regra do raio 0 vale, e o marcador quadrado é o mesmo sinal que o cromo já
   usa antes do nome da dobra.

   A linha é scaleX com origem à esquerda, então continua sendo só transform,
   que é a regra de motion.js. */
function Trilha({ total, avanco, acesos, quieto }) {
  return (
    <div className="v2-trilha" aria-hidden="true">
      <span className="v2-trilha-tr" />
      <motion.span
        className="v2-trilha-ln"
        style={quieto ? { scaleX: 1 } : { scaleX: avanco }}
      />
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`v2-trilha-no${i < acesos ? " is-aceso" : ""}`}>
          {`0${i + 1}`}
        </span>
      ))}
    </div>
  );
}

/* O grupo de três quadradinhos que o viper e o porto repetem em toda fase.
   Custa nada e responde sozinho "estou no segundo de três". */
function Pontos({ i, total }) {
  return (
    <span className="v2-pontos" aria-hidden="true">
      {Array.from({ length: total }, (_, k) => (
        <span key={k} className={`v2-ponto${k <= i ? " is-cheio" : ""}`} />
      ))}
    </span>
  );
}

/* O protótipo de brinquedo do passo 02.

   A dobra 01 afirma que opinião sobre uma coisa que a pessoa tentou usar é
   informação. Esta dobra executa a frase: para responder, é preciso clicar.
   O rodapé só troca de "Você está olhando" para "Agora você tentou" depois do
   primeiro toque, e é o toque que muda o texto, não o scroll.

   Acessibilidade: é fieldset com radio de verdade e um submit de verdade, não
   div com onClick. Funciona no teclado e o leitor de tela anuncia o grupo, a
   pergunta e a resposta (aria-live no resultado). */
function Prototipo() {
  const [escolha, setEscolha] = useState(null);
  const [enviado, setEnviado] = useState(false);
  const [toques, setToques] = useState(0);
  const quieto = useReducedMotion();
  const tocar = () => setToques((n) => n + 1);
  /* Não usa o `spring` global de propósito. Ele tem damping 60, feito para
     hover e drag, e leva ~1,5s para assentar: com AnimatePresence em
     mode="wait" a troca de estado passava de 3 segundos. Num painel que existe
     para provar que protótipo responde na hora, 3 segundos derruba o próprio
     argumento. Saída em 140ms, entrada em 240ms. */
  const entra = quieto ? { duration: 0 } : { duration: 0.24, ease };
  const sai = quieto ? { duration: 0 } : { duration: 0.14, ease };

  return (
    <div className="v2-proto">
      <div className="v2-proto-topo">
        <span className="v2-proto-etq">protótipo</span>
        <span className="v2-proto-cont">
          {`toques ${String(toques).padStart(2, "0")}`}
        </span>
      </div>

      <div className="v2-proto-corpo">
        <AnimatePresence mode="wait" initial={false}>
          {enviado ? (
            <motion.div
              key="fim"
              className="v2-proto-fim"
              initial={quieto ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={quieto ? undefined : { opacity: 0, y: -8, transition: sai }}
              transition={entra}
            >
              <span className="v2-proto-marca" aria-hidden="true" />
              <p className="v2-proto-resp" role="status">
                {PROTOTIPO.respostas[escolha]}
              </p>
              <p className="v2-proto-fecho">{PROTOTIPO.fecho}</p>
              <button
                type="button"
                className="v2-proto-voltar"
                onClick={() => { tocar(); setEnviado(false); setEscolha(null); }}
              >
                {PROTOTIPO.reiniciar}
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={quieto ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={quieto ? undefined : { opacity: 0, y: -8, transition: sai }}
              transition={entra}
              onSubmit={(e) => { e.preventDefault(); tocar(); setEnviado(true); }}
            >
              <fieldset className="v2-proto-set">
                <legend className="v2-proto-pgt">{PROTOTIPO.pergunta}</legend>
                {PROTOTIPO.opcoes.map((o) => (
                  <label
                    key={o.id}
                    className={`v2-proto-op${escolha === o.id ? " is-on" : ""}`}
                  >
                    <input
                      type="radio"
                      name="v2-proto"
                      value={o.id}
                      checked={escolha === o.id}
                      onChange={() => { tocar(); setEscolha(o.id); }}
                    />
                    <span className="v2-proto-cx" aria-hidden="true" />
                    <span>{o.rotulo}</span>
                  </label>
                ))}
              </fieldset>
              <button type="submit" className="v2-proto-ok" disabled={!escolha}>
                {PROTOTIPO.acao}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <p className="v2-proto-pe">
        {toques ? PROTOTIPO.depois : PROTOTIPO.antes}
      </p>
    </div>
  );
}

function Processo() {
  const total = PROCESSO_CURTO.length;
  const { ref, avanco, acesos, quieto } = useTrilha(total);
  const revelar = useRevelar();
  return (
    <Dobra id="processo" n="04" nome="Método" carimbo="©26">
      <Cabecalho
        olho="Como eu trabalho"
        titulo="Do objetivo ao ar"
        lead="Três movimentos, e o do meio é o que a maioria pula."
      />
      <div className="v2-metodo" ref={ref}>
        <Trilha total={total} avanco={avanco} acesos={acesos} quieto={quieto} />
        <ol className="v2-fases">
          {PROCESSO_CURTO.map((f, i) => (
            <motion.li key={f.titulo} className="v2-fase" {...revelar(i)}>
              <Pontos i={i} total={total} />
              <h3 className="v2-fase-t">
                <span className="v2-fase-n" aria-hidden="true">{`0${i + 1}`}</span>
                {f.titulo}
              </h3>
              <p className="v2-fase-p">{f.frase}</p>
              {/* o passo do meio é o que a maioria pula, então é o único que
                  ganha peso: ele não conta que o protótipo existe, ele entrega
                  um para a pessoa mexer */}
              {i === 1 ? <Prototipo /> : null}
            </motion.li>
          ))}
        </ol>
      </div>
    </Dobra>
  );
}

function OndeEstive() {
  const rise = useRise();
  const { ref, progresso } = useSticky();
  const lista = COMPANIES();
  return (
    <Dobra id="onde" n="05" nome="Trajetória" carimbo="©26">
      <Cabecalho olho="Onde estive" titulo="A linha do tempo" />
      <div className="v2-linha-tempo" ref={ref}>
        {/* o trilho preenche conforme a dobra passa: orienta sem pedir atenção */}
        <span className="v2-lt-trilho" aria-hidden="true">
          <motion.span className="v2-lt-trilho-fill" style={{ scaleY: progresso }} />
        </span>
        {lista.map((c, i) => (
          <motion.article key={c.id} className="v2-lt-item" {...rise(Math.min(i, 3))}>
            <p className="v2-lt-ano">
              {c.anos}
              {c.atual ? <span className="v2-lt-agora">agora</span> : null}
            </p>
            <div className="v2-lt-corpo">
              <h3 className="v2-lt-nome">{c.name}</h3>
              <p className="v2-lt-papel">{c.role}<span className="v2-lt-sep"> · </span>{c.period}</p>
              <p className="v2-corpo">{c.blurb}</p>
            </div>
          </motion.article>
        ))}
      </div>
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
  const rolar = () => {
    const alvo = document.getElementById("casos");
    if (alvo) alvo.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Hero paraCasos={rolar} />
      {/* Tudo que vem depois do hero é opaco e sobe por cima dele. Sem este
          fundo, o hero preso aparece por baixo das dobras claras. */}
      <div className="v2-corpo-claro" data-clara="1">
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
