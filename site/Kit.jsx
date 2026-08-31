/* O kit da V2.
 *
 * Por que ele existe: a home recusada foi montada seção por seção, cada uma
 * resolvendo o próprio problema, e o resultado leu como coleção de componentes
 * em vez de página. docs/ANALISE-REFS.md mede por que as referências não leem
 * assim. A gramática vem antes das seções, e mora aqui.
 *
 * Regra de uso: nenhuma dobra da home desenha cromo, título ou mídia por conta
 * própria. Se uma dobra precisa de algo que o kit não tem, o componente entra
 * aqui primeiro. É isso que faz a página parecer um sistema e não um sortido.
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { useRevelar, useCortina, useParallax, useCamadas, useContador, useRise, useSubir, useVoo, AVIAO_D, dur, easeRevela } from "./motion.js";
import { Label, Regua, Lamina } from "./Shell.jsx";

/* A lâmina mora em Shell.jsx, que é o módulo de baixo — Kit importa de Shell,
   então defini-la aqui e usá-la lá seria import circular. Reexportada porque
   as páginas todas importam do Kit. */
export { Lamina };
import { casos } from "./content.js";
import { CAPAS_CHEIAS } from "./copy.js";

/* ------------------------------------------------------------------ cromo */

/* M1 da análise: a camada que costura a página.
 *
 * Toda dobra abre com a mesma tripla, no mesmo lugar, na mono: índice, nome,
 * carimbo. viper serve `Featured Works` `(CQ® — 03)` `©2025`; bungee serve
 * `( _01 )` e `( _©25 )`; porto serve `01` `//Approach` `Since 2000`.
 *
 * Ela não informa quase nada, e é justamente por isso que funciona: o leitor
 * para de ler o conteúdo dela em duas seções e passa a usá-la como régua de
 * "mudei de seção", que era a reclamação do Gabriel. */
export function Cromo({ n, nome, carimbo, escuro = false }) {
  return (
    <p className="v2-cromo" data-escuro={escuro ? "1" : undefined}>
      {n ? <span className="v2-cromo-n">( _{n} )</span> : null}
      <span className="v2-cromo-nome">{nome}</span>
      {carimbo ? <span className="v2-cromo-carimbo">{carimbo}</span> : null}
    </p>
  );
}

/* Relógio vivo. viper, bungee e porto têm o mesmo: bungee marca `( 00:00:00
   NY )`, porto marca `LOCAL/ 13:39:59`. É o enfeite de personalidade mais
   barato que existe (M6) e o único elemento da página que prova, sem dizer,
   que tem alguém do outro lado. Maringá vem de volume/data.jsx. */
export function Relogio({ cidade = "MARINGÁ" }) {
  const [hora, setHora] = React.useState(() => new Date());
  React.useEffect(() => {
    const t = setInterval(() => setHora(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const dois = (n) => String(n).padStart(2, "0");
  return (
    <p className="v2-relogio">
      ( {dois(hora.getHours())}:{dois(hora.getMinutes())}:{dois(hora.getSeconds())}
      {"  "}
      {cidade} )
    </p>
  );
}

/* -------------------------------------------------------------------- voo */

/* O aviãozinho vermelho.

   Fica atrás de tudo e recortado na caixa da página: assim ele passa por
   baixo das dobras, nunca empurra a largura e some quando sai pela borda.

   Nasceu na home, dentro da dobra da tese, e desde 29/08 é de todas as
   páginas — cada uma com o seu percurso. O que muda por página é só a
   `variante`; o desenho de cada uma mora em motion.js, em PARTITURAS. */
export function Voo({ caminho, distancia, opacidade }) {
  return (
    <div className="v2-voo" aria-hidden="true">
      <motion.div
        className="v2-voo-obj"
        style={{
          offsetPath: `path("${caminho}")`,
          offsetDistance: distancia,
          offsetRotate: "auto",
          opacity: opacidade,
        }}
      >
        <svg viewBox="0 0 24 24" focusable="false">
          <path d={AVIAO_D} fill="var(--v2-accent)" />
        </svg>
      </motion.div>
    </div>
  );
}

export function CampoDeVoo({ variante, classe = "v2-voo-campo", children, ...resto }) {
  const caixa = React.useRef(null);
  const voo = useVoo(caixa, variante);
  return (
    <div className={classe} ref={caixa} {...resto}>
      {/* primeiro filho de propósito: junto com `z-index: -1` na camada, é o
          que garante que ele pinte por baixo de todo o conteúdo da página */}
      {voo.caminho && !voo.quieto ? <Voo {...voo} /> : null}
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------- estrutura */

/* A dobra. Já traz o cromo, a largura e o fundo: nenhuma seção da home escreve
   `<section>` na mão, senão a moldura escapa em uma delas e o sistema quebra. */
export function Dobra({ id, n, nome, carimbo, escuro = false, largo = false, children, ...resto }) {
  return (
    <section
      className="v2-dobra"
      id={id}
      data-escuro={escuro ? "1" : undefined}
      data-largo={largo ? "1" : undefined}
      {...resto}
    >
      <div className="v2-dobra-in">
        {n ? <Cromo n={n} nome={nome} carimbo={carimbo} escuro={escuro} /> : null}
        {children}
      </div>
    </section>
  );
}

/* Título de dobra. Um degrau só, 104px, com a marca opcional grudada como as
   referências fazem: `Feartured Portfolio®`, `Bungee®`, `greyola©`. A marca é
   grafismo, então sai do fluxo de leitura por aria-hidden. */
/* `como` existe por causa do axe: a listagem do blog é uma página cujo título
   principal É o título da dobra, e sem ele a página fica sem h1 nenhum
   (`page-has-heading-one`, medido em 29/08). Nas outras páginas o h1 é o hero,
   e por isso o padrão continua sendo h2. */
export function Titulo({ children, marca, className = "", i = 0, como = "h2" }) {
  const cortina = useCortina();
  const H = motion[como] || motion.h2;
  return (
    <span className={`v2-titulo-janela ${className}`} ref={cortina.ref}>
      <H className="v2-titulo" {...cortina.props(i)}>
        {children}
        {marca ? <span className="v2-titulo-marca" aria-hidden="true">{marca}</span> : null}
      </H>
    </span>
  );
}

/* Título de duas cores: linha 1 cinza, linha 2 preta.

   É o componente que a launchfolio usa em TODA seção e que a tabfolio repete
   três vezes na página de sobre ("What I'm into" / "right now"). Custa uma
   span e resolve sozinho o que um título de uma cor só não faz: separa o
   assunto da afirmação sem pedir um segundo tamanho, que a escala proíbe.

   Fica no kit, e não na dobra, porque título é gramática: se cada dobra
   inventar a sua, a página volta a ser sortido. */
export function DuasCores({ fraca, forte }) {
  return (
    <>
      <span className="v2-titulo-fraco">{fraca}</span>
      {forte}
    </>
  );
}

/* M7: o cabeçalho de cinco partes que o Gabriel dissecou no viper.
 *
 *   olho pequeno → título com marca → lead de duas linhas → CTA → nota + prova
 *
 * As cinco existem em toda dobra pesada da referência, e é por isso que dobras
 * de conteúdo diferente parecem a mesma página. Partes opcionais somem sem
 * deixar buraco: o `gap` do flex resolve. */
export function Cabecalho({ olho, titulo, marca, lead, cta, nota, prova, empilhado = false, i = 0 }) {
  const revelar = useRevelar();
  return (
    <header className={`v2-cabecalho${empilhado ? " is-empilhado" : ""}`}>
      <div className="v2-cabecalho-esq">
        {olho ? <p className="v2-olho">{olho}</p> : null}
        <Titulo marca={marca} i={i}>{titulo}</Titulo>
      </div>
      <div className="v2-cabecalho-dir">
        {lead ? (
          <motion.p className="v2-lead" {...revelar(i + 1)}>{lead}</motion.p>
        ) : null}
        {cta ? <div className="v2-cabecalho-cta">{cta}</div> : null}
        {nota ? <p className="v2-cabecalho-nota">{nota}</p> : null}
        {prova ? <div className="v2-cabecalho-prova">{prova}</div> : null}
      </div>
    </header>
  );
}

/* A coluna presa: cabeçalho parado à esquerda, conteúdo rolando à direita.
 *
 * É o componente da launchfolio que estava no inventário de docs/HANDOFF-V2.md
 * e nunca tinha sido usado. Ele resolve uma coisa que lista nenhuma resolve: a
 * esquerda pode MUDAR de informação conforme a direita passa, e é isso que dá
 * a sensação de estar percorrendo alguma coisa em vez de rolar uma lista.
 *
 * O `top` da coluna presa desconta a nav, que é fixa: sem isso o bloco gruda
 * embaixo da barra e o título fica cortado pela metade. */
export function Presa({ esquerda, children }) {
  return (
    <div className="v2-presa">
      <div className="v2-presa-esq">{esquerda}</div>
      <div className="v2-presa-dir">{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------- mídia */

/* A FitaMidia (as colunas em arco do bungee) saiu em 28/08. O porquê está
   em Home.jsx, na função Passagem. */

/* A quebra de imagem do viper: `[SECTION] [IMG] [SECTION]`, largura total, sem
   uma palavra em cima. É o que dá respiro entre duas dobras pesadas e o que a
   home recusada não tinha, porque toda dobra dela começava e terminava no
   branco. Anda em parallax porque parada ela vira banner. */
export function Quebra({ src, video = false, alt = "", intensidade = 12 }) {
  const par = useParallax(intensidade);
  return (
    <figure className="v2-quebra" ref={par.ref}>
      <motion.div className="v2-quebra-in" style={par.style}>
        {video ? (
          <video src={src} autoPlay muted loop playsInline preload="metadata" aria-label={alt} />
        ) : (
          <img src={src} alt={alt} loading="lazy" />
        )}
      </motion.div>
    </figure>
  );
}

/* O campo noturno: a quebra em cinco camadas, altura de viewport inteira.

   Por que cinco arquivos e não uma imagem só:

   1. PROFUNDIDADE. Parallax numa foto chapada é translação — a imagem inteira
      desliza e nada fica mais perto de nada. Com camadas em velocidades
      diferentes o olho lê distância de verdade, porque é assim que ele lê
      distância no mundo: o que está perto passa mais rápido.

   2. E, o que importa mais, o CELULAR. Imagem chapada só sabe ser cortada, e
      `cover` corta pelo eixo que sobra: numa seção de viewport inteira o
      telefone é retrato, então uma paisagem deitada perde a lua e metade do
      morro. Foi exatamente o bug que a capa anterior tinha. Em camadas cada
      peça tem posição própria, então a composição se REMONTA em vez de ser
      cortada: no retrato os morros crescem e sobem, a lua e o avião se
      recentram, e a cena continua sendo a mesma cena.

   A ordem de pintura é a ordem de profundidade, e o avião mora entre os dois
   morros de propósito: assim a crista da frente pode passar na frente dele.

   A lua não tem alpha. Ela entra por `mix-blend-mode: screen` sobre o próprio
   preto em que foi desenhada, que é como luz se soma de verdade — recortar
   halo em alpha sempre deixa uma borda, e o screen não deixa nenhuma. */
const CAMPO = "/volume/assets/campo";
/* px de curso por camada. Quem anda mais está mais perto.

   Subiu de [14,22,40,64,92] em 29/08: o efeito estava tímido demais para se
   perceber que eram planos separados. E o espaçamento entre os números importa
   tanto quanto o tamanho deles — de 14 a 92 as três camadas do meio ficavam
   quase juntas; agora cada degrau é grande o bastante para o olho separar.

   O curso do morro da frente (210px) é o que dita a folga que os arquivos
   precisam ter embaixo, e é por isso que tools/camadas-campo.py estica os
   morros ao dobro da altura. Se este número subir, aquele fator sobe junto. */
const CAMPO_V = [18, 44, 90, 150, 210];

/* A frase da passagem.

   docs/PENDENCIAS-V2.md sempre pediu que esta seção fosse "passagem para a
   dobra seguinte, e não banner mudo" — e sem uma palavra ela era banner mudo,
   por mais bonita que estivesse.

   Ela aponta para os dois lados de propósito, porque é isso que uma passagem
   faz: para cima estão os números, o que já foi entregue; para baixo está o
   método, como aquilo foi feito. "Ao ar" não é escolha de estilo, é o
   vocabulário que a página já usa em "Do objetivo ao ar" e em "o que sobrou
   no ar".

   A FORMA é a frase. Ela diz "acima" e "abaixo", então vem partida em duas
   metades separadas por uma régua: a de cima fica literalmente acima da linha
   e a de baixo, abaixo. A tipografia encena o que o texto afirma, em vez de só
   transportá-lo. A régua não é ornamento novo — é o mesmo filete que separa as
   linhas do índice do método e abre toda dobra do site.

   O degrau é --v2-t-secao, o mesmo dos títulos de dobra, e não um tamanho
   entre ele e o lead: tokens.css proíbe o sexto degrau ("se um componente
   pedir um sexto, o degrau escolhido está errado; não falta degrau"). Em
   20px a frase lia como legenda de foto, que era a queixa. Ela nunca divide
   tela com um título de dobra, então não há competição.

   O "ar" sai no --v2-accent. É a única palavra colorida, e o avião é o único
   objeto vermelho da cena: a palavra e a coisa acendem na mesma cor.

   O que ela NÃO é: aspiração. A voz do site é concreta em toda parte ("Números
   de produção, não de vaidade", "Três movimentos, e o do meio é o que a
   maioria pula"), e frase de capa é exatamente onde soar genérico custa mais
   caro num portfólio. */
const CAMPO_FRASE = ["Acima, o que foi ao *ar*.", "Abaixo, como foi parar lá."];

function acender(t) {
  return t.split("*").map((p, i) =>
    i % 2 ? <em key={i} className="v2-campo-acende">{p}</em> : p);
}

export function Campo({ nome = "Travessia", carimbo = "©26", frase = CAMPO_FRASE }) {
  const { ref, estilos, quieto } = useCamadas(CAMPO_V);
  const revelar = useRevelar();
  /* A regua nao entra em fade: ela se DESENHA, do lado alinhado para o solto.
     E o mesmo gesto das reguas do indice do metodo, e e por isso que ela le
     como parte do sistema e nao como um risco posto em cima da foto. O
     transform-origin mora no CSS porque vira com o alinhamento no retrato. */
  const regua = quieto
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 },
        viewport: { once: true, amount: 0.4 }, transition: { duration: 0.2 } }
    : { initial: { scaleX: 0 }, whileInView: { scaleX: 1 },
        viewport: { once: true, amount: 0.4 },
        transition: { duration: dur, ease: easeRevela, delay: 0.08 } };
  const camada = (i, classe, arquivo) => (
    <motion.div className={`v2-campo-camada ${classe}`} style={estilos[i]}>
      <img src={`${CAMPO}/${arquivo}.webp`} alt="" aria-hidden="true" loading="lazy" />
    </motion.div>
  );
  return (
    <section className="v2-campo" ref={ref} aria-label={nome}>
      {camada(0, "v2-campo-ceu", "ceu")}
      {camada(1, "v2-campo-lua", "lua")}
      {camada(2, "v2-campo-longe", "morro-longe")}
      {camada(3, "v2-campo-aviao", "aviao")}
      {camada(4, "v2-campo-perto", "morro-perto")}
      {frase ? (
        <div className="v2-campo-dito">
          {/* o asterisco marca a palavra do accent e nunca chega ao DOM, que é
              a mesma convenção da DECLARACAO em copy.js */}
          <motion.p className="v2-campo-frase" {...revelar(0)}>{acender(frase[0])}</motion.p>
          <motion.span className="v2-campo-regua" aria-hidden="true" {...regua} />
          <motion.p className="v2-campo-frase" {...revelar(1)}>{acender(frase[1])}</motion.p>
        </div>
      ) : null}
      <Cromo nome={nome} carimbo={carimbo} escuro />
    </section>
  );
}

/* ------------------------------------------------------------------- dados */

/* O contador da viper e do porto, que o Gabriel chamou de MUITO FODA.
 *
 * O tamanho é o ponto: 128px. Em 56px, que era o da V2, o número lê como dado
 * de tabela; em 128 ele lê como afirmação e a dobra respira sozinha. */
export function Contador({ ate, sufixo = "", rotulo, nota }) {
  const { ref, valor } = useContador(ate);
  return (
    <div className="v2-contador" ref={ref}>
      <p className="v2-contador-n">
        {valor}
        {sufixo ? <span className="v2-contador-suf">{sufixo}</span> : null}
      </p>
      <p className="v2-contador-rot">{rotulo}</p>
      {nota ? <p className="v2-contador-nota">{nota}</p> : null}
    </div>
  );
}

/* Régua fina de dobra. Substitui a caixa: onde a V2 punha um painel cinza para
   separar, entra uma linha de 1px e o cromo em cima dela. */
export function Linha() {
  return <hr className="v2-linha" aria-hidden="true" />;
}

/* ======================================================= gramática interna

   O que segue nasceu dentro de v2/Case.jsx e mora aqui desde 29/08, quando a
   página /processo passou a existir. São as peças que fazem uma página interna
   parecer a mesma página interna: a dobra de três colunas, a figura emoldurada,
   a capa de capítulo e a grade de casos do pé.

   Case.jsx importa daqui com `DobraCaso as Dobra`. Nada mudou de forma: as
   classes são as mesmas, então o print da página de caso é idêntico ao de
   9091ddd. */

/* Mídia emoldurada. Painel claro, padding, raio, textura dentro, e a legenda
   dentro da moldura. */
export function Figura({ fig, className = "" }) {
  const rise = useRise();
  if (!fig || !fig.src) return null;
  return (
    <motion.figure className={"v2-fig " + className} {...rise(0)}>
      <span className="v2-fig-moldura" style={fig.ar ? { aspectRatio: fig.ar.replace("/", " / ") } : undefined}>
        <img src={fig.src} alt={fig.alt || ""} loading="lazy" decoding="async" />
      </span>
      {fig.legenda ? <figcaption className="v2-fig-leg">{fig.legenda}</figcaption> : null}
    </motion.figure>
  );
}

/* A dobra padrão de página interna.
 *
 * Sem `larga`: label à esquerda, coluna de leitura de 640px à direita, e o
 * par inteiro centrado no container.
 *
 * Com `larga`: o mesmo label, a mesma coluna de 640 para o texto de topo,
 * mais a coluna de nota marginal à direita (`aside`) e a largura toda para
 * o dado e a mídia que vêm embaixo. */
export function DobraCaso({ label, larga = false, regua = false, topo, aside, children, id, classe = "" }) {
  return (
    <section className={"v2-dobra v2-wrap" + (larga ? " is-larga" : "") + (classe ? " " + classe : "")} id={id}>
      {regua ? <Regua discreta={regua === "discreta"} /> : null}
      <div className={"v2-caso-duas" + (larga ? " is-larga" : "")}>
        {label ? <Label>{label}</Label> : <div aria-hidden="true" />}
        <div className="v2-caso-coluna">
          {topo || aside ? (
            <div className="v2-caso-topo">
              <div className="v2-caso-medida">{topo}</div>
              <div className="v2-caso-margem">{aside}</div>
            </div>
          ) : null}
          {children}
        </div>
      </div>
    </section>
  );
}

/* A capa de capítulo: chapa escura sangrando de borda a borda, meia tela, e a
   única coisa na tela quando aparece. É o corte que diz "mudei de bloco" sem
   precisar de índice.
 *
 * Ela sangra por NÃO usar `.v2-wrap`, e não por margem negativa: o pai é
 * `.v2-corpo-claro`, que já é largura cheia. */
export function CapaCapitulo({ n, t, de = "04", rotulo = "Movimento" }) {
  const subir = useSubir();
  return (
    <section className="v2-capitulo" data-escuro="1" data-escuro-corpo="1" aria-label={`${rotulo} ${n}, ${t}`}>
      <motion.div className="v2-wrap v2-capitulo-in" {...subir(0)}>
        <p className="v2-capitulo-cromo">
          <span>{rotulo}</span>
          <span className="v2-capitulo-cont">{n} / {de}</span>
        </p>
        <h2 className="v2-capitulo-t">{t}</h2>
      </motion.div>
    </section>
  );
}

/* A grade de casos do pé de página interna.
 *
 * Quem termina de ler está pronto para ver outra coisa, e um nome sem imagem
 * não convida: são as capas da home, no quadro 16/11 da home, com o mesmo zoom
 * de hover. Quem mexer aqui mexe na home junto.
 *
 * `excluir` tira o caso que a pessoa acabou de ler; sem ele, entram os quatro. */
/* A grade de casos do fim das páginas.

   Três, e sorteados, desde 30/08. Antes ela imprimia todos os quatro, e isso
   fazia duas coisas ruins: virava um índice repetido da home no pé de toda
   página, e a ordem fixa dava ao primeiro da fila um destaque que ele não
   ganhou — quem chega ali já viu a home, e o que se quer é oferecer o
   PRÓXIMO, não recitar o catálogo.

   O sorteio acontece uma vez por montagem, em useState com inicializador: com
   useMemo sem dependência estável ou com sort direto no corpo, a lista
   reembaralharia a cada re-render e os cartões trocariam de lugar debaixo do
   cursor de quem está para clicar.

   `excluir` continua valendo e é o que impede a página de um caso oferecer ele
   mesmo. */
export function GradeCasos({ excluir, cromo = "Continue", titulo = "Os projetos", ir, quantos = 3 }) {
  const rise = useRise();
  const [lista] = useState(() => {
    const pool = casos().filter((c) => c.id !== excluir);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, quantos);
  });
  if (!lista.length) return null;

  return (
    <section className="v2-wrap v2-outros" aria-labelledby="grade-casos-t">
      <div className="v2-outros-topo">
        <p className="v2-outros-cromo">{cromo}</p>
        <h2 className="v2-outros-t" id="grade-casos-t">{titulo}</h2>
      </div>
      <ul className={"v2-outros-grade" + (lista.length === 4 ? " is-quatro" : "")}>
        {lista.map((c, i) => {
          const href = `/case/${c.id}`;
          const capa = CAPAS_CHEIAS[c.id];
          return (
            <motion.li key={c.id} {...rise(Math.min(i, 3))}>
              <a
                className="v2-outro"
                href={href}
                onClick={(e) => { e.preventDefault(); ir(href); }}
              >
                <span className="v2-outro-quadro">
                  {capa ? (
                    <img className="v2-outro-capa" src={capa} alt="" loading="lazy" decoding="async" />
                  ) : null}
                </span>
                <span className="v2-outro-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="v2-outro-t">{c.chap.title}</span>
                <span className="v2-outro-d">{c.chap.descriptor}</span>
              </a>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
