/* =====================================================================
   VOLUME — Capitulo.jsx
   Page 2: the chapter template (one per project). Tobira-e + TL;DR ·
   Problema · Decisões (decisão→razão) · Solução · Resultado · Próximo.
   ===================================================================== */

/* ---- [1] TOBIRA-E (inverted chapter cover) ---- */
/* each chapter cover gets its own ink loader (deterministic per project) */
const CHAP_ORG = ["split", "twin", "bounce", "merge", "trail", "jelly", "drip", "yin"];
function chapOrg(id) {
  const h = [...String(id)].reduce((a, c) => a + c.charCodeAt(0), 0);
  return CHAP_ORG[h % CHAP_ORG.length];
}
function Tobira({ chap }) {
  return (
    <section className="cover">
      <div className="cover-tone"></div>
      <div className="shell">
        <div className="cover-copy">
          <div className="cover-k">{chap.cap} · {chap.domain}</div>
          {chap.descriptor ? <div className="cover-sub">{chap.descriptor}</div> : null}
          <Brush as="h1" className="cover-title">{chap.title}</Brush>
          <p className="cover-lead">{renderPH(chap.premise)}</p>
          <div className="cover-ficha">
            {chap.surface ? <span>{chap.surface}</span> : null}
            {chap.periodo ? <span>{chap.periodo}</span> : null}
          </div>
          <ProtoLinks links={chap.links} />
          <div className="cover-scroll"><span className="dn">↓</span> {t("Role para ler", "Scroll to read")}</div>
        </div>
        <div className="cover-art">
          {/* a capa de marca manda também aqui: a abertura do capítulo mostra
              a marca sobre a cor dela, e as telas reais vêm no miolo */}
          {chap.capa
            ? <BrandPlate capa={chap.capa} className="bp-cover" />
            : chap.coverTall || chap.cover
              ? <img className="cover-img" src={chap.coverTall || chap.cover} alt={t(`Tela de ${chap.title}`, `${chap.title} screen`)} loading="lazy" draggable="false" />
              : <><MangaPlate dark label={false} /><Organic variant={chapOrg(chap.id)} size={150} className="cover-org" onInk /></>}
        </div>
      </div>
    </section>
  );
}

/* ---- TL;DR strip (+ live link cell when the project is on the air) ---- */
function Tldr({ tldr, links }) {
  const live = links && links.vercel;
  const cell = (l, v) => (
    <div className="cell"><div className="l">{l}</div><div className="v">{renderPH(v)}</div></div>
  );
  // um bloco só. "Papel" estava duplicado com o hero e "O quê" repetia a
  // premissa: sobra o par que o recrutador procura — papel e resultado.
  return (
    <div className={`tldr ${live ? "has-live" : ""}`}>
      {cell(t("Papel", "Role"), tldr.papel)}
      {cell(t("Resultado", "Result"), tldr.resultado)}
      {live ? (
        <div className="cell cell-live">
          <div className="l">{t("Ao vivo", "Live")}</div>
          <div className="v"><a className="tldr-live" href={live} target="_blank" rel="noreferrer">{t("Ver no ar", "See it live")} <span className="ext" aria-hidden="true">↗</span></a></div>
        </div>
      ) : null}
    </div>
  );
}

/* render a string, wrapping any [bracketed] spans as marked placeholders */
function renderPH(str) {
  if (typeof str !== "string") return str;
  const parts = str.split(/(\[[^\]]*\])/g).filter(Boolean);
  return parts.map((p, i) =>
    /^\[[^\]]*\]$/.test(p) ? <PH key={i}>{p.slice(1, -1)}</PH> : <span key={i}>{p}</span>
  );
}

/* ---- [2] PROBLEMA ----
   The arc-opening panel: the problem title shouted in display type inside
   a thick manga frame, the seal kanji 問 (question) ghosted vertically
   behind. The title lives IN the panel; the text column carries the story. */
function Problema({ chap }) {
  return (
    <Beat>
      <div className="c7">
        <div className="panel art prob">
          <span className="prob-tone" aria-hidden="true"></span>
          <span className="prob-kanji" lang="ja" translate="no" aria-hidden="true">問題</span>
          <Brush as="h2" className="prob-t">{renderPH(chap.problema.t)}</Brush>
        </div>
      </div>
      <div className="c5 text-col">
        <div className="panel text">
          <div className="beat-k">{t("Problema", "Problem")}</div>
          {chap.problema.p.map((para, i) => <p className="beat-p" key={i}>{renderPH(para)}</p>)}
        </div>
      </div>
    </Beat>
  );
}

/* ---- ANTES E DEPOIS: a cortina arrastável ---------------------------
   O beat mais forte que um redesign tem: a mesma dobra nos dois estados,
   e quem lê move a divisa. Sem arrastar, a cortina revela sozinha uma vez
   ao entrar na viewport (a informação nunca fica só dentro do gesto).
   Teclado: setas movem 4% por vez; reduced-motion nasce em 50% sem animar. */
function AntesDepois({ dados }) {
  if (!dados || !dados.antes || !dados.depois) return null;
  const [ref, seen] = useReveal({ threshold: 0.45 });
  const [pos, setPos] = useState(REDUCED ? 50 : 100);   // 100 = só o "antes"
  const [arrastando, setArrastando] = useState(false);
  const tocado = useRef(false);
  const caixa = useRef(null);

  useEffect(() => {
    if (!seen || REDUCED || tocado.current) return;
    // ma de 380ms, depois a cortina corre uma vez até assentar em 50%
    const t = setTimeout(() => { if (!tocado.current) setPos(50); }, 380);
    return () => clearTimeout(t);
  }, [seen]);

  const mover = (clientX) => {
    const el = caixa.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    tocado.current = true;
    setPos(Math.max(0, Math.min(100, p)));
  };
  const onDown = (e) => { setArrastando(true); mover(e.clientX); e.currentTarget.setPointerCapture(e.pointerId); };
  const onMove = (e) => { if (arrastando) mover(e.clientX); };
  const onUp   = (e) => { setArrastando(false); try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (err) {} };
  const onKey  = (e) => {
    const passo = e.shiftKey ? 12 : 4;
    if (e.key === "ArrowLeft")  { e.preventDefault(); tocado.current = true; setPos((p) => Math.max(0, p - passo)); }
    if (e.key === "ArrowRight") { e.preventDefault(); tocado.current = true; setPos((p) => Math.min(100, p + passo)); }
    if (e.key === "Home") { e.preventDefault(); tocado.current = true; setPos(0); }
    if (e.key === "End")  { e.preventDefault(); tocado.current = true; setPos(100); }
  };

  const rotA = dados.rotuloAntes || t("Antes", "Before");
  const rotD = dados.rotuloDepois || t("Depois", "After");
  return (
    <div className="ad-wrap" ref={ref}>
      <div className="sec-head" style={{ margin: "0 0 var(--ma-3)" }}>
        <Brush as="h2" style={{ fontSize: "var(--t-d2)" }}>{t("Antes e depois", "Before and after")}</Brush>
        <span className="kicker">{t("arraste a divisa", "drag the divider")}</span>
      </div>
      <div className={`ad-box ${arrastando ? "arrastando" : ""} ${pos < 100 ? "aberto" : ""}`}
           ref={caixa} style={{ "--ad-pos": pos + "%" }}
           onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        <img className="ad-img ad-depois" src={dados.depois} alt={t(`${rotD}: a versão nova`, `${rotD}: the new version`)} loading="lazy" draggable="false" />
        <div className="ad-clip">
          <img className="ad-img ad-antes" src={dados.antes} alt={t(`${rotA}: a versão anterior`, `${rotA}: the previous version`)} loading="lazy" draggable="false" />
        </div>
        <span className="ad-tag ad-tag-a" style={{ opacity: pos > 12 ? 1 : 0 }}>{rotA}</span>
        <span className="ad-tag ad-tag-d" style={{ opacity: pos < 88 ? 1 : 0 }}>{rotD}</span>
        <div className="ad-linha" aria-hidden="true"><span className="ad-punho">↔</span></div>
        <input className="ad-range" type="range" min="0" max="100" value={Math.round(pos)}
               onChange={(e) => { tocado.current = true; setPos(+e.target.value); }} onKeyDown={onKey}
               aria-label={t(`Comparar ${rotA} e ${rotD}`, `Compare ${rotA} and ${rotD}`)} />
      </div>
      {dados.legenda ? <p className="ad-legenda">{renderPH(dados.legenda)}</p> : null}
    </div>
  );
}

/* ---- [2.5] COMO INVESTIGUEI ----
   O que separa opinião de decisão. Só aparece nos capítulos que trazem o
   bloco; os achados entram numerados, porque foram eles que viraram corte. */
function Investigacao({ chap }) {
  const inv = chap.investigacao;
  if (!inv) return null;
  return (
    <Beat>
      <div className="c5 text-col">
        <div className="panel text">
          <div className="beat-k">{t("Como investiguei", "How I investigated")}</div>
          <Brush as="h2" className="beat-t">{renderPH(inv.t)}</Brush>
          {(inv.p || []).map((para, i) => <p className="beat-p" key={i}>{renderPH(para)}</p>)}
        </div>
      </div>
      <div className="c7">
        <div className="panel art inv">
          <span className="inv-kanji" lang="ja" translate="no" aria-hidden="true">調査</span>
          <div className="inv-k">{t("O que apareceu", "What showed up")}</div>
          <ol className="inv-list">
            {(inv.achados || []).map((a, i) => <li key={i}>{renderPH(a)}</li>)}
          </ol>
        </div>
      </div>
    </Beat>
  );
}

/* ---- [7] O QUE APRENDI — o fecho honesto do capítulo ---- */
function Aprendi({ chap }) {
  const ap = chap.aprendi;
  if (!ap || !ap.p || !ap.p.length) return null;
  return (
    <Beat>
      <div className="aprendi" style={{ gridColumn: "1 / -1" }}>
        <div className="beat-k">{t("O que aprendi", "What I learned")}</div>
        {ap.p.map((para, i) => <p className="apr-p" key={i}>{renderPH(para)}</p>)}
      </div>
    </Beat>
  );
}

/* ---- punctuating SFX ---- */
function SfxBeat({ word }) {
  return (
    <Beat>
      <div className="beat-sfx"><div className="word"><span lang="ja" translate="no">{word}</span><i className="sfx-ro">{sfxRo(word)}</i></div></div>
    </Beat>
  );
}

/* ---- [3] DECISÕES (decisão -> razão) ---- */
function Decisoes({ chap }) {
  return (
    <>
      <div className="sec-head" style={{ margin: "0 0 var(--ma-3)" }}>
        <Brush as="h2" style={{ fontSize: "var(--t-d2)" }}>{t("As decisões", "The decisions")}</Brush>
        <span className="kicker">{t("o porquê de cada corte", "the why behind each cut")}</span>
      </div>
      {/* cada decisão é um beat de largura cheia, alternando o lado do número.
          A grade de cards iguais lia como lista de features; assim lê como
          argumento numerado, que é o que o capítulo está fazendo. */}
      <ol className="dec-seq">
        {chap.decisoes.map((dec, i) => (
          <DecBeat key={i} n={i + 1} dec={dec} par={i % 2 === 1} />
        ))}
      </ol>
    </>
  );
}

/* um beat de decisão: número grande em editorial, a escolha em display e a
   razão em corpo de leitura. Entra em corte seco quando cruza a viewport. */
function DecBeat({ n, dec, par }) {
  const [ref, seen] = useReveal({ threshold: 0.3 });
  return (
    <li ref={ref} className={`dec-beat ${par ? "par" : ""} ${seen ? "in" : ""}`}>
      <div className="db-n" aria-hidden="true">{String(n).padStart(2, "0")}</div>
      <div className="db-copy">
        <h3 className="db-d">{renderPH(dec.d)}</h3>
        <p className="db-r"><i className="db-k">{t("Por quê", "Why")}</i>{renderPH(dec.r)}</p>
      </div>
      <span className="db-tone" aria-hidden="true"></span>
    </li>
  );
}

/* ---- VOCABULÁRIO — o léxico do produto, ensinado enquanto se lê -------
   Quando a decisão central de um case é fixar uma linguagem comum, a prova
   não é um print: é o próprio vocabulário na tela. Cada termo acende em
   sequência conforme a lista entra na viewport, então quem lê aprende o
   léxico no ritmo da leitura. reduced-motion: já nasce tudo aceso. */
function Vocabulario({ dados }) {
  if (!dados || !dados.termos || !dados.termos.length) return null;
  const [ref, seen] = useReveal({ threshold: 0.3 });
  const [ate, setAte] = useState(REDUCED ? dados.termos.length : 0);
  useEffect(() => {
    if (!seen) return;
    if (REDUCED) { setAte(dados.termos.length); return; }
    let i = 0;
    const id = setInterval(() => {
      i += 1; setAte(i);
      if (i >= dados.termos.length) clearInterval(id);
    }, 180);   // o ataque seco da casa
    return () => clearInterval(id);
  }, [seen, dados.termos.length]);

  return (
    <div className="voc" ref={ref}>
      <div className="sec-head" style={{ margin: "0 0 var(--ma-3)" }}>
        <Brush as="h2" style={{ fontSize: "var(--t-d2)" }}>{renderPH(dados.t)}</Brush>
        {dados.kicker ? <span className="kicker">{renderPH(dados.kicker)}</span> : null}
      </div>
      <ol className="voc-list">
        {dados.termos.map((termo, i) => (
          <li className={`voc-row ${i < ate ? "on" : ""}`} key={i} style={{ transitionDelay: `${i * 24}ms` }}>
            <span className="voc-marca" aria-hidden="true"></span>
            <span className="voc-nome">{renderPH(termo.n)}</span>
            <span className="voc-sep" aria-hidden="true"></span>
            <span className="voc-def">{renderPH(termo.d)}</span>
          </li>
        ))}
      </ol>
      {dados.nota ? <p className="voc-nota">{renderPH(dados.nota)}</p> : null}
    </div>
  );
}

/* ---- [4] SOLUÇÃO ---- */
function Solucao({ chap }) {
  const shots = chap.solucao.shots || [];
  const n = shots.length;
  return (
    <>
      <div className="sec-head" style={{ margin: "0 0 var(--ma-3)" }}>
        <Brush as="h2" style={{ fontSize: "var(--t-d2)" }}>{t("A solução", "The solution")}</Brush>
        <span className="kicker live" style={{ color: "var(--vermilion-ink)" }}>{t("no ar", "live")}</span>
      </div>
      <Beat>
        <div className="c5 text-col">
          <div className="panel text">
            <div className="beat-k">{t("Solução", "Solution")}</div>
            <Brush as="h2" className="beat-t">{renderPH(chap.solucao.t)}</Brush>
            {chap.solucao.p.map((para, i) => <p className="beat-p" key={i}>{renderPH(para)}</p>)}
            <div className="ai-note"><span className="b"></span> {t("Protótipo → produto no ar", "Prototype → product, live")}</div>
            <ProtoLinks links={chap.links} />
          </div>
        </div>
        <div className={n ? "c7" : "c7 sol-vazio"}>
          <div className="sol-grid">
            {/* Todos os painéis têm a mesma medida e a mesma proporção (16:10,
                a dos arquivos), então qualquer quantidade de prints empilha
                sem corte. Antes havia um esquema de spans (c8/c4/wide) que
                espremia o 2º print em 167px e decepava o 3º num 21/9. */}
            {shots.map((sh, i) => {
              // um shot pode ser string (usa a proporção padrão 16:10) ou
              // { src, ar, meia }: `ar` faz o painel nascer na proporção EXATA
              // do arquivo, então print em retrato também cabe sem tarja nem
              // corte; `meia` põe dois lado a lado em vez de largura cheia.
              const src = typeof sh === "string" ? sh : (sh && sh.src);
              const ar = sh && sh.ar;
              const cls = "sol-panel" + (sh && sh.meia ? " meia" : "");
              return (
                <div className={cls} key={i} style={ar ? { aspectRatio: ar } : undefined}>
                  {src
                    ? <img className="sol-img" src={src} alt={t(`${chap.title} · tela ${i + 1}`, `${chap.title} · screen ${i + 1}`)} loading="lazy" draggable="false" />
                    : <MangaPlate />}
                </div>
              );
            })}
          </div>
        </div>
      </Beat>
    </>
  );
}

/* ---- [5] RESULTADO ----
   The payoff beat. The art panel is an inked IMPACT PANEL: the chapter's
   real anchor fact set huge on ink, with the SFX kana ghosted behind —
   the number/fact gets a stage instead of an empty plate. */
function Resultado({ chap }) {
  return (
    <Beat className="rev" hold={380 /* a ma before the reveal */}>
      <div className="c5 text-col">
        <div className="panel text">
          <div className="beat-k">{t("Resultado", "Result")}</div>
          <Brush as="h2" className="beat-t">{renderPH(chap.resultado.t)}</Brush>
          {chap.resultado.p.map((para, i) => <p className="beat-p" key={i}>{renderPH(para)}</p>)}
          {chap.resultado.lista && chap.resultado.lista.length ? (
            <div className="res-lista">
              <div className="rl-k">{chap.resultado.listaK || t("O que vai ser acompanhado", "What will be tracked")}</div>
              <ul>{chap.resultado.lista.map((it, i) => <li key={i}>{renderPH(it)}</li>)}</ul>
            </div>
          ) : null}
        </div>
      </div>
      <div className="c7">
        <div className="panel art impact">
          {chap.fact ? (
            <div className="impact-inner">
              <span className="impact-kana" lang="ja" translate="no" aria-hidden="true">{chap.sfx}</span>
              <div className="impact-k">{t("Preto no branco", "In black and white")}</div>
              <div className="impact-t">{chap.fact}</div>
              {chap.links && chap.links.vercel
                ? <a className="impact-live" href={chap.links.vercel} target="_blank" rel="noreferrer">{t("No ar", "Live")} <span className="ext" aria-hidden="true">↗</span></a>
                : null}
            </div>
          ) : <MangaPlate />}
        </div>
      </div>
    </Beat>
  );
}

/* ---- [5.5] O SISTEMA POR TRÁS DO VOLUME (só no CAP. 05) ----
   The strongest seniority signal in this repo is the design system itself:
   tokens, a colour thesis, a spacing scale named after ma (間), a motion
   language and audited a11y. This spread surfaces it as specification. */
const SIS_WASHES = [
  ["--ink", "#0A0A0A", t("tinta", "ink")],
  ["--wash-4", "#38362F", t("sombra", "shade")],
  ["--wash-3", "#635E52", t("meio", "mid")],
  ["--wash-2", "#B4AFA3", t("diluída", "diluted")],
  ["--wash-1", "#DEDAD0", t("véu", "veil")],
  ["--paper", "#F6F3EC", t("papel", "paper")],
];
const SIS_MA = [["ma-1", 8], ["ma-2", 16], ["ma-3", 24], ["ma-4", 40], ["ma-5", 64], ["ma-6", 104]];
function SistemaVolume() {
  return (
    <>
      <div className="sec-head" style={{ margin: "var(--ma-6) 0 var(--ma-3)" }}>
        <Brush as="h2" style={{ fontSize: "var(--t-d2)" }}>{t("O sistema por trás do volume", "The system behind the volume")}</Brush>
        <span className="kicker">{t("extra · a especificação", "extra · the specification")}</span>
      </div>
      <Beat>
        <div className="sis-grid" style={{ gridColumn: "1 / -1" }}>
          <div className="sis">
            <div className="sis-k">{t("Cor é intenção", "Color is intent")}</div>
            <div className="sis-swatches">
              {SIS_WASHES.map(([tk, hex, nm]) => (
                <div className="sw" key={tk}><span className="sw-chip" style={{ background: hex }}></span><span className="sw-n">{nm}</span></div>
              ))}
              <div className="sw"><span className="sw-chip sw-red"></span><span className="sw-n">{t("selo", "seal")}</span></div>
            </div>
            <p className="sis-p">{t("O mundo é tinta sobre papel. O vermelho-selo só aparece na interação, no estado vivo e na assinatura. Nunca é decoração.", "The world is ink on paper. The seal red only appears on interaction, the live state and the signature. Never as decoration.")}</p>
          </div>
          <div className="sis">
            <div className="sis-k">{t("Tipo com papel definido", "Type with defined roles")}</div>
            <div className="sis-type">
              <span className="st-display">Anton</span>
              <span className="st-cond">{t("OSWALD · rótulos e navegação", "OSWALD · labels and navigation")}</span>
              <span className="st-body">{t("Hanken Grotesk, a voz da leitura.", "Hanken Grotesk, the reading voice.")}</span>
              <span className="st-kana" lang="ja" translate="no">ドン · 墨</span>
            </div>
            <p className="sis-p">{t("Display grita, condensada organiza, humanista lê. O kana é SFX de verdade, com romaji pra quem não lê japonês.", "Display shouts, condensed organizes, humanist reads. The kana is real SFX, with romaji for whoever doesn't read Japanese.")}</p>
          </div>
          <div className="sis">
            <div className="sis-k">{t("Espaço é ma ", "Space is ma ")}<span lang="ja" translate="no">間</span></div>
            <div className="sis-ma">
              {SIS_MA.map(([n, w]) => (
                <div className="ma-row" key={n}><span className="ma-bar" style={{ width: w }}></span><span className="ma-n">{n}</span></div>
              ))}
            </div>
            <p className="sis-p">{t("O branco é a calha entre painéis: uma pausa, não área a preencher. A escala inteira vive em tokens.", "White space is the gutter between panels: a pause, not an area to fill. The whole scale lives in tokens.")}</p>
          </div>
          <div className="sis">
            <div className="sis-k">{t("Movimento é corte", "Motion is a cut")}</div>
            <div className="sis-motion" aria-hidden="true"><span className="sm-box"></span></div>
            <p className="sis-p">{t("Anime corta, não flutua: 180ms de ataque seco e um ma de 380ms antes do reveal. Reduced-motion desliga tudo, sem perder conteúdo.", "Anime cuts, it doesn't float: a 180ms dry attack and a 380ms ma before the reveal. Reduced-motion turns it all off, losing no content.")}</p>
          </div>
          <div className="sis">
            <div className="sis-k">{t("Acessível de verdade", "Actually accessible")}</div>
            <div className="sis-big">0<span className="sb-s">{t("violações axe", "axe violations")}</span></div>
            <p className="sis-p">{t("Auditado view a view em 3 viewports: foco visível, skip-link, ordem de Tab traçada, contraste AA e o texto rotativo parando sozinho (WCAG 2.2.2).", "Audited view by view in 3 viewports: visible focus, skip link, traced Tab order, AA contrast and the rotating text stopping on its own (WCAG 2.2.2).")}</p>
          </div>
          <div className="sis">
            <div className="sis-k">{t("Dois modos, uma capa", "Two modes, one cover")}</div>
            <div className="sis-modes" aria-hidden="true">
              <span className="md md-paper">A</span>
              <span className="md md-ink">A</span>
            </div>
            <p className="sis-p">{t("O modo tinta ", "Ink mode ")}<span lang="ja" translate="no">墨</span>{t(" troca os polos do mundo e inverte a escala de washes. A capa vermelha não muda: capa é capa.", " swaps the world's poles and inverts the wash scale. The red cover doesn't change: a cover is a cover.")}</p>
          </div>
        </div>
      </Beat>
    </>
  );
}

/* ---- [6] NEXT CHAPTER ----
   A small tankōbon thumb keeps the "turn the page" feeling: B&W at rest,
   colours on hover (colour = interaction). */
function NextChapter({ next, onOpen, onHome }) {
  return (
    <div className="shell">
      <div className="next-chap" onClick={() => onOpen(next.id)} role="button" tabIndex={0}
           onKeyDown={(e) => { if (e.key === "Enter") onOpen(next.id); }}>
        <span className="nc-thumb" aria-hidden="true">
          {/* mesma capa de marca da home: a miniatura mostra a marca, não um
              recorte de print espremido em 3:4 que não se lê */}
          {next.capa
            ? <BrandPlate capa={next.capa} className="bp-thumb" />
            : next.cover
              ? <img src={next.cover} alt="" loading="lazy" draggable="false" />
              : <MangaPlate />}
        </span>
        <div className="nc-copy">
          <div className="nc-k">{t("Próximo capítulo", "Next chapter")} · {next.cap} · {next.domain}</div>
          <div className="nc-t">{next.title}</div>
        </div>
        <div className="nc-arr">→</div>
      </div>
      <div style={{ padding: "var(--ma-4) 0 var(--ma-6)" }}>
        <a className="btn btn-ghost" href="#" onClick={(e) => { e.preventDefault(); onHome(); }}>
          <span className="arr" style={{ display: "inline-block", transform: "scaleX(-1)" }}>→</span> {t("Voltar ao sumário", "Back to contents")}
        </a>
      </div>
    </div>
  );
}

/* ---- the assembled chapter ---- */
function Capitulo({ chap, next, onOpen, onHome, onNav }) {
  useEffect(() => { window.scrollTo(0, 0); }, [chap.id]);
  return (
    <main key={chap.id} className="chapter-main">
      <div className="chapter-back">
        <a className="back" href="#" onClick={(e) => { e.preventDefault(); onHome(); }}>
          <span className="arr">←</span> {t("Voltar ao volume", "Back to the volume")}
        </a>
        <span className="cap">{chap.cap} · {VOL}</span>
      </div>

      <Tobira chap={chap} />

      <div className="chapter-body shell">
        <Tldr tldr={chap.tldr} links={chap.links} />
        <div style={{ height: "var(--ma-6)" }}></div>
        <Problema chap={chap} />
        <Investigacao chap={chap} />
        <SfxBeat word={chap.sfx} />
        <Decisoes chap={chap} />
        <div style={{ height: "var(--ma-6)" }}></div>
        <Solucao chap={chap} />
        <div style={{ height: "var(--ma-6)" }}></div>
        {chap.vocabulario ? <><div style={{ height: "var(--ma-6)" }}></div><Vocabulario dados={chap.vocabulario} /></> : null}
        {chap.antesDepois ? <><div style={{ height: "var(--ma-6)" }}></div><AntesDepois dados={chap.antesDepois} /></> : null}
        <div style={{ height: "var(--ma-6)" }}></div>
        <Resultado chap={chap} />
        <Aprendi chap={chap} />
        {chap.id === "portfolio" && <SistemaVolume />}
      </div>

      {next && <NextChapter next={next} onOpen={onOpen} onHome={onHome} />}
      <Colofao onNav={onNav} />
    </main>
  );
}

Object.assign(window, { Tobira, Tldr, renderPH, Problema, Investigacao, Aprendi, AntesDepois, DecBeat, Vocabulario, SfxBeat, Decisoes, Solucao, Resultado, SistemaVolume, NextChapter, Capitulo });
