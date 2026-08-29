/* Página de caso da V2.
 *
 * Fase 4: hero, ficha, abertura, resumo.
 * Fase 5: o capítulo inteiro, de `problema` a `aprendi`, mais o próximo caso.
 * Fase 6: as cinco críticas do Gabriel. Em ordem de impacto:
 *
 *   A. A grade de fundo saiu da página. Ela batia nas fontes, e a medida
 *      dava razão: seis linhas claras atravessando parágrafo. No lugar,
 *      cruz na ponta da régua e textura DENTRO do painel de mídia.
 *   B. O vazio à direita acabou. A coluna de leitura era 900px com
 *      parágrafo de 600 encostado à esquerda de um container de 1800.
 *      Agora a coluna É a medida (640px) e o conjunto label+texto é
 *      centrado; as dobras de dado ganham uma coluna de nota marginal à
 *      direita, que é onde `fonte`, `nota` e `leitura` passaram a morar.
 *   C. Todo número da página usa um componente só: número → régua → rótulo,
 *      sem caixa. O painel cinza passou a significar mídia e nada mais.
 *   D. Motion mais longo e mais calmo (ver motion.js).
 *   E. O pill ganhou preenchimento e troca de seta (ver Shell.jsx).
 *   F. As dezoito dobras viraram quatro movimentos. A régua entre dobras do
 *      mesmo movimento sumiu; sobrou o espaço. Isso não é índice: não
 *      navega, não numera seção e não fica preso na tela (D7).
 *
 * Nenhum texto é escrito aqui, tudo vem de data.jsx pelo content.js. O que
 * este arquivo decide é layout, ritmo e hierarquia. */

import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRise, useMaskLine, useCobertura, ease } from "./motion.js";
import { Label, Regua, Pill } from "./Shell.jsx";
/* A gramática de página interna mora no kit desde 29/08, quando /processo
   passou a existir: as mesmas peças montam as duas páginas. */
import { DobraCaso as Dobra, Figura, CapaCapitulo, GradeCasos } from "./Kit.jsx";
import { chapterById } from "./content.js";
import { CAPAS_CHEIAS, CAPAS_CASO } from "./copy.js";

/* ============================================================ utilidades */

/* Número inteiro no formato do país. Não é decoração: 166267 escrito cru
   custa uma leitura a mais que 166.267. */
const fmt = (n) => new Intl.NumberFormat("pt-BR").format(Math.round(n));

/* Decimal com vírgula, para as porcentagens do mapa de calor. */
const dec = (n) => String(n).replace(".", ",");

/* Contador. Sobe uma vez quando entra na tela e para. Em reduced-motion o
   número já nasce no valor final: contador é movimento, não conteúdo. */
function Contador({ v, className }) {
  const quieto = useReducedMotion();
  const ref = useRef(null);
  const [n, setN] = useState(quieto ? v : 0);

  useEffect(() => {
    if (quieto) { setN(v); return; }
    const el = ref.current;
    if (!el) return;
    let quadro = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      // Fase 6: 1100ms virou 1600. O contador é o movimento mais longo da
      // página e era o mais curto; agora ele acompanha o resto.
      const dur = 1600;
      const passo = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        // desacelera no fim, igual ao easing do sistema
        setN(v * (1 - Math.pow(1 - p, 3)));
        if (p < 1) quadro = requestAnimationFrame(passo);
      };
      quadro = requestAnimationFrame(passo);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(quadro); };
  }, [v, quieto]);

  return <span ref={ref} className={className}>{fmt(n)}</span>;
}

/* ---------------------------------------------------------------- dado */

/* O componente de dado da V2, e o único.
 *
 * Número → régua de 1px → rótulo, empilhado, sem caixa, sem fundo, sem
 * raio. É a gramática da referência, e a razão de existir é a crítica do
 * Gabriel: cada número da página tinha inventado o próprio tratamento (o
 * funil em barra preta, o gesto em barra cinza, a busca em painel cinza),
 * então nenhum deles lia como componente.
 *
 * Quando o dado tem proporção, quem a carrega é a própria régua: o traço em
 * tinta ocupa a fração do valor. Não existe mais barra dentro de trilho.
 *
 *   valor    número que sobe no contador
 *   texto    quando o valor já vem formatado (porcentagem com vírgula)
 *   prop     0..1, a fração que o traço da régua ocupa
 *   mini     meio degrau abaixo, para fileira de cinco
 *   amostra  desenho acima do número, quando o dado é uma forma
 *   children entra dentro da régua, para quem precisa de marcação própria */
function Dado({
  valor, texto, sufixo, prop, cor, rotulo, nota, mini = false, amostra, children,
}) {
  return (
    <div className={"v2-dado" + (mini ? " is-mini" : "")}>
      {amostra || null}
      <p className="v2-dado-v">
        {texto != null ? texto : <Contador v={valor} />}
        {sufixo ? <span className="v2-dado-sufixo">{sufixo}</span> : null}
      </p>
      <span className="v2-dado-regua" aria-hidden="true">
        {prop != null ? (
          <span
            className={"v2-dado-fill" + (cor ? " is-" + cor : "")}
            style={{ width: `${Math.max(prop * 100, 1.5)}%` }}
          />
        ) : null}
        {children}
      </span>
      {rotulo ? <p className="v2-dado-l">{rotulo}</p> : null}
      {nota ? <p className="v2-dado-n">{nota}</p> : null}
    </div>
  );
}

function Ato({ titulo, paras }) {
  const rise = useRise();
  return (
    <>
      {titulo ? <motion.h2 className="v2-caso-ato" {...rise(0)}>{titulo}</motion.h2> : null}
      {(paras || []).map((p, i) => (
        <motion.p className="v2-corpo v2-caso-p" key={i} {...rise(i + 1)}>{p}</motion.p>
      ))}
    </>
  );
}

function Fonte({ children }) {
  if (!children) return null;
  return <p className="v2-fonte">{children}</p>;
}

/* A nota longa de uma dobra de dado. Ela ocupava um terço da coluna de
   leitura e competia com o argumento; agora é nota marginal. */
function NotaMargem({ k, children }) {
  const rise = useRise();
  if (!children) return null;
  return (
    <motion.div className="v2-margem-nota" {...rise(0)}>
      {k ? <p className="v2-margem-k">{k}</p> : null}
      <p className="v2-margem-p">{children}</p>
    </motion.div>
  );
}

/* ================================================================== hero */

/* Mesma passagem coberta da home: o hero fica preso e o corpo claro sobe por
   cima dele perdendo escala. A diferença é a mídia, o coverTall em 4:5.

   O parallax NÃO entra neste hero. Com `position: sticky` a caixa da seção
   para de andar em relação à viewport, então useScroll congela e o efeito
   viraria um deslocamento morto. Quem move a mídia é a própria cobertura. */
function CasoHero({ cap }) {
  const linha = useMaskLine();
  const capa = useCobertura();
  const quieto = useReducedMotion();
  const links = cap.links || {};
  /* A arte dedicada do hero, quando existe; na falta dela, a mesma capa que
     abre o caso na home. Ver CAPAS_CASO e CAPAS_CHEIAS em v2/copy.js. */
  const fundo = CAPAS_CASO[cap.id] || CAPAS_CHEIAS[cap.id];

  /* Parallax da capa.

     Sai da rolagem da PÁGINA e não do progresso da seção. A seção é sticky, e
     com sticky a caixa dela para de andar em relação à janela: o `useScroll`
     com `target` congela e o efeito vira deslocamento morto. Está anotado
     desde a primeira versão deste hero, e é por isso que não havia parallax
     aqui.

     A arte anda 80px enquanto a primeira tela rola. A moldura da imagem é
     160px mais alta que a caixa e começa 80px acima, então o movimento nunca
     descobre a borda. */
  const { scrollY } = useScroll();
  const desloca = useTransform(scrollY, [0, 900], [0, 80]);

  return (
    <section className="v2-hero v2-caso-hero v2-grao v2-halo" data-escuro="1" ref={capa.ref}>
      {fundo ? (
        <div className="v2-caso-fundo" aria-hidden="true">
          {/* A troca de arte entre um caso e outro.
           *
             O que se vê ao trocar de caso é o hero sem arte enquanto a nova
             baixa: são de 98KB a 232KB por capa. Medido em 1440 com a rede
             estrangulada, o vão foi de 192ms sem pré-carga e 140ms com ela,
             e quem paga a diferença é o `Cartao` da home, que puxa ESTA arte
             no hover e no toque. Ver `puxaCapa` em Home.jsx.

             `fetchPriority` alto porque esta é a única imagem acima da dobra:
             ela não precisa disputar fila com print de figura que está a três
             telas daqui.

             `key` no src: o React reaproveitaria o mesmo <img> entre as rotas
             e trocaria só o atributo. No Chromium isso já basta, o frame
             antigo é descartado na troca do src (conferido por comparação de
             pixel, com e sem a key: mesma chapa escura aos 150ms). A key fica
             porque nem todo motor descarta, e porque o nó morrer junto com a
             rota é o que o código diz que acontece. Não é ela que encurta o
             vão; quem encurta é a pré-carga. */}
          <motion.img
            key={fundo}
            src={fundo}
            alt=""
            decoding="async"
            fetchPriority="high"
            style={quieto ? undefined : { y: desloca }}
          />
          {/* o veu: sem ele o titulo branco cai em cima de uma foto clara e
              o contraste vira sorte. Escuro embaixo e a esquerda, que e onde
              o texto mora, e quase transparente no alto a direita. */}
          <span className="v2-caso-fundo-veu" />
        </div>
      ) : null}
      <motion.div className="v2-wrap v2-hero-in" style={capa.style}>
        <motion.div className="v2-hero-topo" {...linha(0)}>
          <p className="v2-hero-papel">{cap.descriptor}</p>
          <p className="v2-hero-papel">{cap.year}</p>
        </motion.div>

        <div className="v2-caso-hero-grade">
          <div className="v2-caso-hero-texto">
            <h1 className="v2-hero-h v2-caso-hero-h">
              <span className="v2-hero-linha">
                <motion.span {...linha(1)}>{cap.title}</motion.span>
              </span>
            </h1>

            {cap.premise ? (
              <motion.p className="v2-caso-hero-premissa" {...linha(2)}>{cap.premise}</motion.p>
            ) : null}

            <div className="v2-caso-pills">
              {links.vercel ? <Pill href={links.vercel} externo escuro>Ver no ar</Pill> : null}
              {links.figma ? <Pill href={links.figma} externo escuro>Abrir no Figma</Pill> : null}
            </div>

            <ul className="v2-caso-tags">
              {[cap.role, cap.surface].filter(Boolean).map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>

          {/* o mockup 4:5 que ficava aqui saiu em 29/08: a arte de capa agora
              e o fundo da dobra inteira, e um segundo recorte da mesma coisa
              ao lado do titulo lia como miniatura do proprio fundo. */}
        </div>
      </motion.div>
    </section>
  );
}

/* ================================================================= ficha */

/* Régua de metadados. É a única dobra da página sem label lateral: ela É a
   legenda do hero, e um rótulo em cima repetiria isso. */
function Ficha({ cap }) {
  const rise = useRise();
  const celulas = [
    ["Papel", cap.role],
    ["Superfície", cap.surface],
    ["Período", cap.periodo],
  ].filter(([, v]) => v);

  return (
    <section className="v2-wrap v2-caso-abre" aria-label="Ficha do projeto">
      <dl className="v2-ficha">
        {celulas.map(([rot, val], i) => (
          <motion.div className="v2-ficha-cel" key={rot} {...rise(i)}>
            <dt className="v2-ficha-l">{rot}</dt>
            <dd className="v2-ficha-v">{val}</dd>
          </motion.div>
        ))}
      </dl>
    </section>
  );
}

/* ============================================================== abertura */

function Abertura({ cap }) {
  const a = cap.abertura;
  if (!a) return null;
  const fig = a.fig && cap.figuras ? cap.figuras[a.fig] : null;
  /* A figura sai da Dobra de propósito.
   *
   * Ela é a única do bloco, e pela regra de contagem uma figura sozinha
   * sangra de borda a borda. Sangrar por `margin-inline: 50% - 50vw` não
   * funcionaria daqui: dentro da Dobra ela mora na coluna de conteúdo, que a
   * grade já deslocou para a direita pela largura do label, então os 50%
   * dela não são o meio da página. Medido: 130px de overflow horizontal.
   * Fora do wrap, `.v2-corpo-claro` é largura cheia e a sangria é o padrão. */
  return (
    <>
      <Dobra label={a.k} larga topo={<Ato titulo={a.t} paras={a.p} />} />
      <Figura fig={fig} className="is-sangra" />
    </>
  );
}

/* ================================================================ resumo */

/* `tldr.papel` não entra: a ficha logo acima já responde isso, e a V1 tinha
   cortado a mesma duplicação pelo mesmo motivo (ver volume/Capitulo.jsx).

   Fase 6: o painel cinza saiu. Duas células com régua em cima é a mesma
   informação sem fingir que o resumo é mídia. */
function Resumo({ cap }) {
  const rise = useRise();
  const t = cap.tldr;
  if (!t) return null;
  const celulas = [["O quê", t.oque], ["Resultado", t.resultado]].filter(([, v]) => v);

  return (
    <Dobra label="Resumo" larga>
      <div className="v2-resumo">
        {celulas.map(([rot, val], i) => (
          <motion.div className="v2-resumo-cel" key={rot} {...rise(i)}>
            <p className="v2-resumo-l">{rot}</p>
            <p className="v2-resumo-v">{val}</p>
          </motion.div>
        ))}
      </div>
    </Dobra>
  );
}

/* =============================================================== problema */

function Problema({ cap }) {
  const p = cap.problema;
  if (!p) return null;
  // Sem label: o movimento logo acima já disse "O problema".
  return (
    <Dobra topo={<Ato titulo={p.t} paras={p.p} />} />
  );
}

/* ================================================================= funil */

/* O funil é dado, não texto. Antes era barra preta dentro de trilho cinza,
   uma linha por etapa; agora são cinco dados na mesma gramática do resto da
   página, e quem carrega o despencar é a régua de cada um, medida sobre o
   maior valor. A nota de cada etapa fica no próprio dado. */
function Funil({ cap }) {
  const rise = useRise();
  const f = cap.funil;
  if (!f) return null;
  const topo = Math.max(...f.etapas.map((e) => e.v));

  return (
    <Dobra
      label={f.k}
      larga
      topo={<Ato titulo={f.t} />}
      aside={<><Fonte>{f.fonte}</Fonte><NotaMargem k="O que eu li errado">{f.nota}</NotaMargem></>}
    >
      <ol className="v2-dados is-funil">
        {f.etapas.map((e, i) => (
          <motion.li key={e.l} {...rise(Math.min(i, 4))}>
            <Dado mini valor={e.v} prop={e.v / topo} rotulo={e.l} nota={e.n} />
          </motion.li>
        ))}
      </ol>

      {f.marca ? <Marca marca={f.marca} /> : null}
    </Dobra>
  );
}

/* A taxa de conversão é o número solitário da dobra, e por isso ele vai no
   tamanho cheio. A faixa saudável do mercado vira marcação dentro da régua
   do próprio dado: sem a faixa, 0,13% é só um número pequeno. */
function Marca({ marca }) {
  const rise = useRise();
  const teto = Math.max(marca.teto, marca.mercado, marca.nosso) * 1.15;
  const pct = (v) => `${(v / teto) * 100}%`;
  return (
    <motion.div className="v2-marca-solo" {...rise(0)}>
      <Dado
        texto={dec(marca.nosso)}
        sufixo="%"
        rotulo={marca.l}
        nota={marca.n}
      >
        <span className="v2-mr-faixa"
              style={{ left: pct(marca.piso), width: `calc(${pct(marca.teto)} - ${pct(marca.piso)})` }} />
        <span className="v2-mr-tick is-mercado" style={{ left: pct(marca.mercado) }} />
        <span className="v2-mr-tick is-nosso" style={{ left: pct(marca.nosso) }} />
      </Dado>
      <div className="v2-mr-legenda">
        <span className="v2-mr-tag is-nosso">{`A loja: ${dec(marca.nosso)}%`}</span>
        <span className="v2-mr-tag">{`Mercado: ${dec(marca.mercado)}%`}</span>
        <span className="v2-mr-tag is-faixa">{`Faixa saudável: ${dec(marca.piso)}% a ${dec(marca.teto)}%`}</span>
      </div>
      <Fonte>{marca.fonte}</Fonte>
    </motion.div>
  );
}

/* ================================================================= gesto */

function Gesto({ cap }) {
  const rise = useRise();
  const g = cap.gesto;
  if (!g) return null;
  const topo = Math.max(...g.itens.map((i) => i.p));
  const cor = { ruido: "accent", compra: null, busca: null, neutro: "muted" };

  return (
    <Dobra
      label={g.k}
      larga
      topo={<Ato titulo={g.t} />}
      aside={<><Fonte>{g.fonte}</Fonte><NotaMargem k="A leitura">{g.leitura}</NotaMargem></>}
    >
      <ul className="v2-dados is-funil">
        {g.itens.map((it, i) => (
          <motion.li key={it.sel} {...rise(Math.min(i, 4))}>
            <Dado
              mini
              texto={dec(it.p)}
              sufixo="%"
              prop={it.p / topo}
              cor={cor[it.tipo]}
              rotulo={it.el}
              nota={it.sel}
            />
          </motion.li>
        ))}
      </ul>
    </Dobra>
  );
}

/* ========================================================== investigação */

function Investigacao({ cap }) {
  const rise = useRise();
  const inv = cap.investigacao;
  if (!inv) return null;
  return (
    <Dobra larga topo={<Ato titulo={inv.t} paras={inv.p} />}>
      {inv.achados ? (
        <ol className="v2-achados">
          {inv.achados.map((a, i) => (
            <motion.li key={i} {...rise(Math.min(i, 3))}>
              <span className="v2-achados-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <span className="v2-achados-t">{a}</span>
            </motion.li>
          ))}
        </ol>
      ) : null}
    </Dobra>
  );
}

/* ================================================================= busca */

/* O número solitário de 128px da página. As duas telas são o mesmo argumento
   em dois estados, então elas precisam ser vistas juntas. */
function Busca({ cap }) {
  const rise = useRise();
  const b = cap.busca;
  if (!b) return null;
  const figs = (b.figs || []).map((k) => cap.figuras && cap.figuras[k]).filter(Boolean);

  return (
    <Dobra
      label={b.k}
      larga
      topo={<Ato titulo={b.t} paras={b.p} />}
      aside={b.dado ? <Fonte>{b.dado.fonte}</Fonte> : null}
    >
      {b.dado ? (
        <motion.div className="v2-dado-solo" {...rise(0)}>
          <Dado
            valor={b.dado.v}
            prop={1}
            rotulo={b.dado.l}
            nota={`${dec(b.dado.p)}% das sessões · ${b.dado.n}`}
          />
        </motion.div>
      ) : null}

      {figs.length ? (
        <div className="v2-figs-2">
          {figs.map((f, i) => <Figura fig={f} key={i} />)}
        </div>
      ) : null}
    </Dobra>
  );
}

/* =============================================================== citação */

/* Sozinha na dobra e em tipografia maior. É a única vez, fora do hero e do
   bloco final, em que o texto sai do corpo e vira imagem. */
function Citacao({ cap }) {
  const rise = useRise();
  const c = cap.citacao;
  if (!c) return null;
  return (
    <section className="v2-wrap v2-dobra">
      <motion.blockquote className="v2-citacao" {...rise(0)}>
        <p className="v2-citacao-q">{c.q}</p>
        {c.fonte ? <footer className="v2-citacao-f">{c.fonte}</footer> : null}
      </motion.blockquote>
    </section>
  );
}

/* ============================================================== decisões */

function Decisoes({ cap }) {
  const rise = useRise();
  const lista = cap.decisoes || [];
  if (!lista.length) return null;
  return (
    <Dobra larga>
      <ol className="v2-dec">
        {lista.map((d, i) => (
          <motion.li className="v2-dec-i" key={d.d} {...rise(Math.min(i, 3))}>
            <p className="v2-dec-n" aria-hidden="true">
              <span className="v2-dec-n-zero">0</span>{i + 1}
            </p>
            <div>
              <h3 className="v2-dec-t">{d.d}</h3>
              <p className="v2-corpo v2-dec-r">{d.r}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </Dobra>
  );
}

/* O que ficou de fora. Sem painel cinza: a régua e o risco no título já
   marcam a dobra, e cinza aqui competia com a mídia. */
function Recusei({ cap }) {
  const rise = useRise();
  const r = cap.recusei;
  if (!r) return null;
  return (
    <Dobra label={r.k} topo={<motion.p className="v2-recusei-lead" {...rise(0)}>{r.p}</motion.p>}>
      <ul className="v2-recusei-l">
        {(r.itens || []).map((it, i) => (
          <motion.li key={it.o} {...rise(Math.min(i, 3))}>
            <p className="v2-recusei-o">{it.o}</p>
            <p className="v2-corpo">{it.r}</p>
          </motion.li>
        ))}
      </ul>
    </Dobra>
  );
}

/* =============================================================== solução */

function Solucao({ cap }) {
  const s = cap.solucao;
  if (!s) return null;
  const shots = (s.shots || []).map((sh) => {
    if (typeof sh === "string") return { src: sh, alt: "" };
    return (cap.figuras && cap.figuras[sh.fig]) || null;
  }).filter(Boolean);

  return (
    <Dobra label="A solução" larga topo={<Ato titulo={s.t} paras={s.p} />}>
      <div className="v2-sol-grade">
        {shots.map((f, i) => (
          <Figura
            key={i}
            fig={{ ...f, legenda: (s.legendas && s.legendas[i]) || f.legenda }}
          />
        ))}
      </div>
    </Dobra>
  );
}

/* =========================================================== vocabulário */

/* O léxico do módulo.
 *
 * Cinco palavras que o time passou a usar do mesmo jeito na tela e na
 * conversa. Estavam escritas em `volume/data.jsx` desde sempre e nunca
 * chegaram à página: a V1 renderizava, a V2 não tinha o componente.
 *
 * Não é a lista de decisões com outra roupa. Decisão é escolha com razão,
 * e o "porque" carrega a linha; verbete é significado fixado, e quem carrega
 * é o termo. Por isso aqui o termo vem no display, sozinho na sua linha, e a
 * definição desce embaixo, em vez do par lado a lado que `v2-dec` usa.
 *
 * `dl` e não `ol`: são definições, e o par dt/dd é o que um leitor de tela
 * precisa para anunciar "termo, definição" em vez de "item 1 de 5". */
function Vocabulario({ cap }) {
  const rise = useRise();
  const v = cap.vocabulario;
  if (!v) return null;
  const termos = v.termos || [];
  if (!termos.length) return null;

  return (
    <Dobra
      label="O léxico"
      larga
      topo={<Ato titulo={v.t} />}
      aside={<NotaMargem k={v.kicker}>{v.nota}</NotaMargem>}
    >
      <dl className="v2-lex">
        {termos.map((t, i) => (
          <motion.div className="v2-lex-i" key={t.n} {...rise(Math.min(i, 3))}>
            <dt className="v2-lex-t">
              <span className="v2-lex-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              {t.n}
            </dt>
            <dd className="v2-lex-d v2-corpo">{t.d}</dd>
          </motion.div>
        ))}
      </dl>
    </Dobra>
  );
}

/* =============================================================== sistema */

/* O design system entra pelo argumento de ordem: o vocabulário antes das
   quarenta telas. Aqui ele é mostrado com os valores reais do theme.css do
   protótipo, não com amostra ilustrativa. */
function Sistema({ cap }) {
  const rise = useRise();
  const s = cap.sistema;
  if (!s) return null;

  return (
    <Dobra
      label={s.k}
      larga
      topo={<Ato titulo={s.t} paras={s.p} />}
      aside={<NotaMargem>{s.nota}</NotaMargem>}
    >
      {/* O sistema, em abas.
          Empilhado ele media 4.210px, quase cinco telas, e é o bloco menos
          obrigatório da leitura: quem quer ver a escada de cor não precisa
          rolar por motion e espaço antes. Mesma peça dos módulos. */}
      <Abas
        id="sis"
        rotulo="O sistema"
        itens={[
          s.escada && { chave: "escada", rotulo: s.escada.k, conteudo: (

        <motion.div className="v2-bloco" {...rise(0)}>
          <h3 className="v2-bloco-t">{s.escada.k}</h3>
          <p className="v2-corpo v2-caso-p">{s.escada.n}</p>
          <ul className="v2-escada">
            {s.escada.linhas.map((l) => (
              <li key={l.t}>
                <code className="v2-token">{l.t}</code>
                <span className="v2-escada-f">{l.f}</span>
                <span className="v2-escada-par">
                  <span className="v2-swatch" style={{ background: l.c }} aria-hidden="true" />
                  <span className="v2-escada-v">{l.cl || l.c}</span>
                </span>
                <span className="v2-escada-par is-escuro">
                  <span className="v2-swatch" style={{ background: l.e }} aria-hidden="true" />
                  <span className="v2-escada-v">{l.el || l.e}</span>
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
          ) },
          s.funcoes && { chave: "funcoes", rotulo: "Cor com função", conteudo: (

        <motion.div className="v2-bloco" {...rise(0)}>
          <h3 className="v2-bloco-t">Cor com função</h3>
          <ul className="v2-funcoes">
            {s.funcoes.map((f) => (
              <li key={f.n}>
                <span className="v2-func-chip" style={{ background: f.c }} aria-hidden="true" />
                <p className="v2-func-n">{f.n}</p>
                <p className="v2-func-f">{f.f}</p>
                <p className="v2-corpo">{f.p}</p>
              </li>
            ))}
          </ul>
        </motion.div>
          ) },
          s.caso && { chave: "caso", rotulo: s.caso.t, conteudo: (

        <motion.div className="v2-bloco" {...rise(0)}>
          <h3 className="v2-bloco-t">{s.caso.t}</h3>
          {(s.caso.p || []).map((p, i) => <p className="v2-corpo v2-caso-p" key={i}>{p}</p>)}
          <div className="v2-pares">
            {(s.caso.pares || []).map((par) => (
              <div className={"v2-par" + (par.escuro ? " is-escuro" : "")} key={par.tema}
                   style={{ background: par.bg, color: par.c }}>
                <p className="v2-par-tema">{par.tema}</p>
                <p className="v2-par-r">{par.r}</p>
              </div>
            ))}
          </div>
        </motion.div>
          ) },
          s.motion && { chave: "motion", rotulo: s.motion.t, conteudo: <SistemaMotion m={s.motion} /> },
          s.tipografia && { chave: "tipo", rotulo: s.tipografia.t, conteudo: <SistemaTipo t={s.tipografia} /> },
          s.espaco && { chave: "espaco", rotulo: s.espaco.t, conteudo: <SistemaEspaco e={s.espaco} /> },
          s.derivado && { chave: "derivado", rotulo: s.derivado.t, conteudo: (

        <motion.div className="v2-bloco" {...rise(0)}>
          <h3 className="v2-bloco-t">{s.derivado.t}</h3>
          {(s.derivado.p || []).map((p, i) => <p className="v2-corpo v2-caso-p" key={i}>{p}</p>)}
          <code className="v2-formula">{s.derivado.formula}</code>
          <div className="v2-pares">
            {(s.derivado.temas || []).map((t) => (
              <div className="v2-deriv" key={t.tema} style={{ background: t.bg }}>
                <span className="v2-deriv-am" aria-hidden="true" style={{
                  backgroundImage:
                    `linear-gradient(135deg, rgba(${t.ink}, .10), rgba(${t.ink}, .03))`,
                }} />
                <p className="v2-par-tema" style={{ color: t.escuro ? "#fff" : "#161616" }}>{t.tema}</p>
              </div>
            ))}
          </div>
        </motion.div>
          ) },
        ].filter(Boolean)}
      />
    </Dobra>
  );
}

/* A curva desenhada. Um path só, com os pontos de controle do próprio
   cubic-bezier: dá para ver a desaceleração, que é o argumento. */
function SistemaMotion({ m }) {
  const rise = useRise();
  const [x1, y1, x2, y2] = m.curva;
  const S = 120;
  const px = (x) => x * S;
  const py = (y) => S - y * S;
  const d = `M0 ${S} C ${px(x1)} ${py(y1)}, ${px(x2)} ${py(y2)}, ${S} 0`;
  return (
    <motion.div className="v2-bloco" {...rise(0)}>
      <h3 className="v2-bloco-t">{m.t}</h3>
      <div className="v2-motion">
        <svg viewBox={`-4 -4 ${S + 8} ${S + 8}`} className="v2-curva" role="img" aria-label={m.rotulo}>
          <path d={`M0 ${S} L ${S} ${S}`} className="v2-curva-eixo" />
          <path d={`M0 ${S} L 0 0`} className="v2-curva-eixo" />
          <path d={d} className="v2-curva-linha" />
        </svg>
        <div>
          <code className="v2-token">{m.rotulo}</code>
          <p className="v2-corpo v2-caso-p">{m.p}</p>
          <ul className="v2-marcos">
            {(m.marcos || []).map((k) => (
              <li key={k.l}><span className="v2-marcos-l">{k.l}</span><span>{k.n}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

/* A escala tipográfica desenhada no tamanho que ela tem. Escala descrita em
   tabela não prova nada; escala renderizada prova sozinha. */
function SistemaTipo({ t }) {
  const rise = useRise();
  return (
    <motion.div className="v2-bloco" {...rise(0)}>
      <h3 className="v2-bloco-t">{t.t}</h3>
      <p className="v2-corpo v2-caso-p">{t.p}</p>
      <ul className="v2-escala">
        {t.escala.map((d) => (
          <li key={d.n}>
            {/* o tamanho real, limitado para não estourar a coluna */}
            <span className="v2-escala-am" style={{ fontSize: `min(${d.px}px, 9vw)`, fontWeight: d.peso }}>
              {d.n}
            </span>
            <span className="v2-escala-m">{`${d.px}px · ${d.fam} ${d.pn}`}</span>
          </li>
        ))}
      </ul>
      {t.nota ? <p className="v2-corpo v2-caso-p v2-nota">{t.nota}</p> : null}
    </motion.div>
  );
}

/* Ritmo e raio. Os dois são número, então os dois usam o componente de dado:
   o ritmo com a régua proporcional ao valor, o raio com a própria forma
   desenhada acima do número. */
function SistemaEspaco({ e }) {
  const rise = useRise();
  const topo = Math.max(...e.ritmo.map((r) => r.d));
  const raioTopo = Math.max(...e.raios.map((r) => r.v));
  return (
    <motion.div className="v2-bloco" {...rise(0)}>
      <h3 className="v2-bloco-t">{e.t}</h3>
      <p className="v2-corpo v2-caso-p">{e.p}</p>

      <ul className="v2-dados is-apertada">
        {e.ritmo.map((r, i) => (
          <motion.li key={r.l} {...rise(Math.min(i, 3))}>
            <Dado
              mini
              texto={String(r.d)}
              sufixo="px"
              prop={r.d / topo}
              rotulo={r.l}
              nota={`${r.m}px no celular`}
            />
          </motion.li>
        ))}
      </ul>
      {e.ritmoNota ? <Fonte>{e.ritmoNota}</Fonte> : null}

      <ul className="v2-dados is-apertada">
        {e.raios.map((r, i) => (
          <motion.li key={r.v} {...rise(Math.min(i, 3))}>
            <Dado
              mini
              texto={String(r.v)}
              sufixo="px"
              prop={r.v / raioTopo}
              rotulo={r.u}
              amostra={<span className="v2-raio-am" aria-hidden="true" style={{ borderRadius: `${r.v}px` }} />}
            />
          </motion.li>
        ))}
      </ul>
      {e.raioNota ? <Fonte>{e.raioNota}</Fonte> : null}
    </motion.div>
  );
}

/* ================================================== mídia presa à esquerda */

/* O padrão do maxfolio: a mídia fica presa enquanto a coluna de texto passa
   por cima dela. É a segunda e última vez que `sticky` aparece na V2 (a
   primeira é a linha do tempo da home).

   Quem troca a figura é um IntersectionObserver com a faixa no meio da tela:
   o passo que cruza o meio manda na mídia. */
function PresoEsquerda({ passos, figuras }) {
  const rise = useRise();
  const [ativo, setAtivo] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    const els = refs.current.filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) setAtivo(Number(e.target.dataset.i));
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [passos.length]);

  return (
    <div className="v2-preso">
      <div className="v2-preso-media v2-textura" aria-hidden="true">
        <div className="v2-preso-palco">
          {passos.map((p, i) => {
            const f = figuras && figuras[p.fig];
            if (!f || !f.src) return null;
            return (
              <img
                key={p.fig}
                src={f.src}
                alt=""
                loading="lazy"
                decoding="async"
                className={"v2-preso-img" + (i === ativo ? " is-ativa" : "")}
              />
            );
          })}
        </div>
      </div>

      <ol className="v2-preso-texto">
        {passos.map((p, i) => (
          <motion.li
            key={p.t}
            data-i={i}
            ref={(el) => { refs.current[i] = el; }}
            className={"v2-preso-passo" + (i === ativo ? " is-ativo" : "")}
            {...rise(Math.min(i, 2))}
          >
            {p.k ? <p className="v2-preso-k">{p.k}</p> : null}
            {/* h3: o título de ato da dobra é h2, então h4 pulava um nível */}
            <h3 className="v2-preso-t">{p.t}</h3>
            <p className="v2-corpo">{p.p}</p>
            {/* No celular a coluna presa não existe: a figura anda junto do
                texto, que é a única leitura possível em uma coluna só. */}
            <Figura fig={figuras && figuras[p.fig]} className="is-mobile" />
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

/* ================================================================= ponte */

function Ponte({ cap }) {
  const p = cap.ponte;
  if (!p) return null;
  return (
    <Dobra
      label={p.k}
      larga
      topo={<><Ato titulo={p.t} paras={p.p} />{p.buraco ? <p className="v2-buraco">{p.buraco}</p> : null}</>}
    >
      {p.passos ? <PresoEsquerda passos={p.passos} figuras={cap.figuras} /> : null}
    </Dobra>
  );
}

/* =============================================================== módulos */

/* `emAba`: dentro de uma aba o `mod.k` já é o rótulo do botão, e o tabpanel
   aponta para ele por `aria-labelledby`. Repetir como h3 lê duas vezes. Ele
   sai do DOM em vez de sumir por CSS, e o título sobe de h4 para h3: com o
   h3 só escondido, o h4 ficava órfão e o axe acusava heading-order. */
function Modulo({ mod, figuras, emAba = false }) {
  const rise = useRise();
  const figs = (mod.figs || []).map((k) => figuras && figuras[k]).filter(Boolean);
  const Titulo = emAba ? "h3" : "h4";

  return (
    <div className="v2-mod">
      <Regua discreta />
      <div className="v2-mod-topo">
        <div className="v2-caso-medida">
          {emAba ? null : <h3 className="v2-mod-k">{mod.k}</h3>}
          <Titulo className="v2-caso-ato">{mod.t}</Titulo>
          {mod.buraco ? <p className="v2-buraco">{mod.buraco}</p> : null}
          {(mod.p || []).map((p, i) => <p className="v2-corpo v2-caso-p" key={i}>{p}</p>)}
        </div>
      </div>

      {figs.length ? (
        <div className={figs.length > 1 ? "v2-figs-2" : ""}>
          {figs.map((f, i) => <Figura fig={f} key={i} />)}
        </div>
      ) : null}

      {mod.caminhos ? (
        <ul className="v2-caminhos">
          {mod.caminhos.map((c, i) => (
            <motion.li key={c.t} {...rise(Math.min(i, 3))}>
              <Figura fig={figuras && figuras[c.fig]} />
              <p className="v2-cam-para">{c.para}</p>
              <h5 className="v2-cam-t">{c.t}</h5>
              <p className="v2-corpo">{c.p}</p>
            </motion.li>
          ))}
        </ul>
      ) : null}

      {/* Os passos do acabamento são oito, então não viram mídia presa: com
          oito estados o trilho ficaria mais alto que a página inteira. Eles
          alternam o lado da figura, que é o que mantém a leitura andando. */}
      {mod.passos ? (
        <ol className="v2-passos">
          {mod.passos.map((p, i) => (
            <motion.li className={"v2-passo" + (i % 2 ? " is-invertido" : "")} key={p.t} {...rise(Math.min(i, 3))}>
              <div className="v2-passo-texto">
                {p.k ? <p className="v2-preso-k">{p.k}</p> : null}
                <h5 className="v2-passo-t">{p.t}</h5>
                <p className="v2-corpo">{p.p}</p>
              </div>
              <Figura fig={figuras && figuras[p.fig]} />
            </motion.li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}

/* Abas.
 *
 * A peça que troca um empilhamento longo por um item de cada vez. Nasceu
 * para os módulos do PCYES, que empilhados mediam 8.233px, nove telas,
 * sozinhos 24% da página (medido em 29/08 no 1440), e serve qualquer bloco
 * com quatro ou mais itens do mesmo assunto. É a quarta forma da gramática
 * de mídia; as outras três (sangra, par, tríptico) são CSS.
 *
 * O conteúdo não sai da página: os painéis inativos ficam no DOM com
 * `hidden`, então Ctrl+F e leitor de tela continuam achando tudo.
 *
 * Teclado: setas andam entre as abas, Home e End vão às pontas. É o padrão
 * de tablist, e sem ele a peça é uma armadilha para quem não usa mouse.
 */
function Abas({ itens, rotulo, id }) {
  const [ativo, setAtivo] = React.useState(0);
  const refs = React.useRef([]);
  if (!itens || itens.length < 2) return itens && itens.length ? itens[0].conteudo : null;

  const foca = (i) => {
    const n = (i + itens.length) % itens.length;
    setAtivo(n);
    const el = refs.current[n];
    if (el) el.focus();
  };
  const tecla = (e) => {
    const mapa = { ArrowRight: ativo + 1, ArrowLeft: ativo - 1, Home: 0, End: itens.length - 1 };
    if (!(e.key in mapa)) return;
    e.preventDefault();
    foca(mapa[e.key]);
  };

  return (
    <>
      <div className="v2-abas-trilho" role="tablist" aria-label={rotulo} onKeyDown={tecla}>
        {itens.map((it, i) => (
          <button
            key={it.chave}
            type="button"
            role="tab"
            id={`${id}-aba-${i}`}
            aria-selected={i === ativo}
            aria-controls={`${id}-painel-${i}`}
            tabIndex={i === ativo ? 0 : -1}
            ref={(el) => { refs.current[i] = el; }}
            className="v2-aba"
            onClick={() => setAtivo(i)}
          >
            <span className="v2-aba-n">{String(i + 1).padStart(2, "0")}</span>
            {it.rotulo}
          </button>
        ))}
      </div>
      {itens.map((it, i) => (
        <div
          key={it.chave}
          role="tabpanel"
          id={`${id}-painel-${i}`}
          aria-labelledby={`${id}-aba-${i}`}
          hidden={i !== ativo}
          className="v2-abas-painel"
        >
          {it.conteudo}
        </div>
      ))}
    </>
  );
}

function Modulos({ cap }) {
  const lista = cap.modulos || [];
  if (!lista.length) return null;
  return (
    <Dobra label="Os módulos" larga>
      <Abas
        id="mod"
        rotulo="Os módulos"
        itens={lista.map((m) => ({
          chave: m.k,
          rotulo: m.k,
          conteudo: <Modulo mod={m} figuras={cap.figuras} emAba />,
        }))}
      />
    </Dobra>
  );
}

/* ============================================================ calendário */

/* A data combinada, desenhada como folha de mês. É o único ornamento da
   página, e existe porque "outubro de 2026" escrito em texto não fixa data.
   Sem preenchimento cinza: só a régua da borda, porque cinza agora é mídia. */
function Calendario({ cap }) {
  const rise = useRise();
  const c = cap.calendario;
  if (!c) return null;
  return (
    <Dobra label={c.k} larga aside={c.legenda ? <NotaMargem>{c.legenda}</NotaMargem> : null}>
      <motion.div className="v2-cal" {...rise(0)}>
        <p className="v2-cal-mes">{`${c.mes} ${c.ano}`}</p>
        <table className="v2-cal-tab">
          <thead>
            <tr>{c.dow.map((d, i) => <th key={i} scope="col">{d}</th>)}</tr>
          </thead>
          <tbody>
            {c.semanas.map((sem, i) => (
              <tr key={i}>
                {sem.map((d, j) => (
                  <td key={j} className={d === c.dia ? "is-marcado" : ""}>
                    {d ? (d === c.dia ? <span className="v2-cal-marca">{d}</span> : d) : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </Dobra>
  );
}

/* ========================================================== antes/depois */

/* O comparador da V1, reescrito como componente ESM. O suporte a teclado é
   requisito, não enfeite: setas movem 2%, Shift move 10%, Home e End vão
   para as pontas. O elemento é um slider de verdade para leitor de tela. */
function Comparador({ par, i = 0 }) {
  const rise = useRise();
  const [pos, setPos] = useState(50);
  const caixa = useRef(null);
  const arrastando = useRef(false);

  const daPagina = (clientX) => {
    const el = caixa.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  };

  const onKey = (e) => {
    const salto = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") { setPos((p) => Math.max(0, p - salto)); e.preventDefault(); }
    else if (e.key === "ArrowRight") { setPos((p) => Math.min(100, p + salto)); e.preventDefault(); }
    else if (e.key === "Home") { setPos(0); e.preventDefault(); }
    else if (e.key === "End") { setPos(100); e.preventDefault(); }
  };

  useEffect(() => {
    const mover = (e) => { if (arrastando.current) daPagina(e.clientX); };
    const soltar = () => { arrastando.current = false; };
    window.addEventListener("pointermove", mover);
    window.addEventListener("pointerup", soltar);
    return () => {
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerup", soltar);
    };
  }, []);

  return (
    <motion.figure className="v2-comp v2-textura" {...rise(i)}>
      <div
        className="v2-comp-caixa"
        ref={caixa}
        onPointerDown={(e) => { arrastando.current = true; daPagina(e.clientX); }}
      >
        <img className="v2-comp-depois" src={par.depois} alt="" loading="lazy" decoding="async" />
        <div className="v2-comp-antes" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <img src={par.antes} alt="" loading="lazy" decoding="async" />
        </div>

        <span className="v2-comp-rot is-esq" aria-hidden="true">{par.rotuloAntes}</span>
        <span className="v2-comp-rot is-dir" aria-hidden="true">{par.rotuloDepois}</span>

        <div
          className="v2-comp-alca"
          style={{ left: `${pos}%` }}
          role="slider"
          tabIndex={0}
          aria-label={`Comparar ${par.rotuloAntes} e ${par.rotuloDepois}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${Math.round(pos)}% de ${par.rotuloAntes}`}
          onKeyDown={onKey}
        >
          <span className="v2-comp-alca-p" aria-hidden="true" />
        </div>
      </div>
      {par.legenda ? <figcaption className="v2-fig-leg">{par.legenda}</figcaption> : null}
    </motion.figure>
  );
}

function AntesDepois({ cap }) {
  const ad = cap.antesDepois;
  if (!ad) return null;
  const pares = [ad, ...(ad.pares || [])];
  return (
    <Dobra label="Antes e depois" larga>
      {pares.map((p, i) => <Comparador par={p} i={Math.min(i, 2)} key={p.antes} />)}
    </Dobra>
  );
}

/* ============================================================= resultado */

function Resultado({ cap }) {
  const rise = useRise();
  const r = cap.resultado;
  if (!r) return null;
  return (
    <Dobra
      larga
      topo={
        <>
          <motion.h2 className="v2-result-t" {...rise(0)}>{r.t}</motion.h2>
          {(r.p || []).map((p, i) => (
            <motion.p className="v2-corpo v2-caso-p" key={i} {...rise(i + 1)}>{p}</motion.p>
          ))}
        </>
      }
    >
      {r.lista ? (
        <motion.div className="v2-result-lista" {...rise(1)}>
          {r.listaK ? <p className="v2-result-k">{r.listaK}</p> : null}
          <ul>
            {r.lista.map((l) => <li key={l}>{l}</li>)}
          </ul>
        </motion.div>
      ) : null}
    </Dobra>
  );
}

/* =============================================================== aprendi */

/* A exceção nomeada em D5: o único bloco escuro fora do hero. Fecha a
   leitura no mesmo tom em que ela abriu. */
function Aprendi({ cap }) {
  const rise = useRise();
  const a = cap.aprendi;
  if (!a) return null;
  return (
    <section className="v2-aprendi v2-grao" data-escuro-corpo="1">
      <div className="v2-wrap">
        <div className="v2-caso-duas">
          <Label>O que eu aprendi</Label>
          <div className="v2-caso-coluna">
            {(a.p || []).map((p, i) => (
              <motion.p className="v2-aprendi-p" key={i} {...rise(i)}>{p}</motion.p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function NaoAchou({ id, ir }) {
  return (
    <div className="v2-corpo-claro" data-clara="1">
      <section className="v2-wrap v2-caso-abre">
        <div className="v2-caso-duas">
          <Label>Caso</Label>
          <div className="v2-caso-coluna">
            <h1 className="v2-caso-ato">{`O capítulo "${id}" não existe.`}</h1>
            <div className="v2-caso-pills">
              <Pill onClick={() => ir("/")}>Voltar para a home</Pill>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Caso({ id, ir }) {
  const cap = chapterById(id);
  if (!cap) return <NaoAchou id={id} ir={ir} />;

  return (
    <>
      <CasoHero cap={cap} />
      {/* Igual à home: o corpo claro é opaco e sobe por cima do hero preso.
          `data-clara` é o que a nav observa para saber quando inverter. */}
      <div className="v2-corpo-claro" data-clara="1">
        {/* A abertura: quem é o projeto, antes de qualquer movimento. */}
        <Ficha cap={cap} />
        <Abertura cap={cap} />
        <Resumo cap={cap} />

        {/* Os quatro movimentos. A régua com cruz só existe na virada. */}
        <CapaCapitulo n="01" t="O problema" />
        <Problema cap={cap} />
        <Funil cap={cap} />
        <Gesto cap={cap} />

        <CapaCapitulo n="02" t="A investigação" />
        <Investigacao cap={cap} />
        <Busca cap={cap} />
        <Citacao cap={cap} />

        <CapaCapitulo n="03" t="A resposta" />
        <Decisoes cap={cap} />
        <Recusei cap={cap} />
        <Ponte cap={cap} />
        <Solucao cap={cap} />
        <Sistema cap={cap} />
        <Vocabulario cap={cap} />
        <Modulos cap={cap} />
        <Calendario cap={cap} />

        <CapaCapitulo n="04" t="O resultado" />
        <AntesDepois cap={cap} />
        <Resultado cap={cap} />
        <Aprendi cap={cap} />
        <GradeCasos excluir={cap.id} titulo="Os outros casos" ir={ir} />
      </div>
    </>
  );
}
