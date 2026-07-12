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
          <Brush as="h1" className="cover-title">{chap.title}</Brush>
          <p className="cover-lead">{renderPH(chap.premise)}</p>
          <div className="cover-meta">
            <div className="m"><div className="l">{t("Papel", "Role")}</div><div className="v">{renderPH(chap.role)}</div></div>
            <div className="m"><div className="l">{t("Superfície", "Surface")}</div><div className="v">{chap.surface}</div></div>
            <div className="m"><div className="l">{t("Ano", "Year")}</div><div className="v">{chap.year}</div></div>
          </div>
          <ProtoLinks links={chap.links} />
          <div className="cover-scroll"><span className="dn">↓</span> {t("Role para ler", "Scroll to read")}</div>
        </div>
        <div className="cover-art">
          {chap.cover
            ? <img className="cover-img" src={chap.cover} alt={t(`Tela de ${chap.title}`, `${chap.title} screen`)} loading="lazy" draggable="false" />
            : <><MangaPlate dark /><Organic variant={chapOrg(chap.id)} size={150} className="cover-org" onInk /></>}
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
  return (
    <div className={`tldr ${live ? "has-live" : ""}`}>
      {cell(t("Papel", "Role"), tldr.papel)}
      {cell(t("O quê", "What"), tldr.oque)}
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
      <Beat>
        <div className="dec-grid" style={{ gridColumn: "1 / -1" }}>
          {chap.decisoes.map((dec, i) => (
            <div className="dec" key={i}>
              <div className="n">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="d">{renderPH(dec.d)}</h3>
              <p className="r">{renderPH(dec.r)}</p>
            </div>
          ))}
        </div>
      </Beat>
    </>
  );
}

/* ---- [4] SOLUÇÃO ---- */
function Solucao({ chap }) {
  const shots = chap.solucao.shots || [];
  const n = shots.length || chap.solucao.slots || 2;
  const spans = n >= 3 ? ["c8", "c4", "wide"] : ["c8", "c4"];
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
        <div className="c7">
          <div className="sol-grid">
            {Array.from({ length: n }).map((_, i) => {
              const span = spans[i] || "c4";
              const cls = span === "wide" ? "sol-panel" : `sol-panel ${span === "c8" ? "big" : "small"}`;
              const style = span === "wide" ? { gridColumn: "1 / -1", aspectRatio: "21 / 9" } : {};
              return (
                <div className={cls} key={i} style={style}>
                  {shots[i]
                    ? <img className="sol-img" src={shots[i]} alt={t(`${chap.title} · tela ${i + 1}`, `${chap.title} · screen ${i + 1}`)} loading="lazy" draggable="false" />
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
          {next.cover ? <img src={next.cover} alt="" loading="lazy" draggable="false" /> : <MangaPlate />}
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
        <SfxBeat word={chap.sfx} />
        <Decisoes chap={chap} />
        <div style={{ height: "var(--ma-6)" }}></div>
        <Solucao chap={chap} />
        <div style={{ height: "var(--ma-6)" }}></div>
        <Resultado chap={chap} />
        {chap.id === "portfolio" && <SistemaVolume />}
      </div>

      {next && <NextChapter next={next} onOpen={onOpen} onHome={onHome} />}
      <Colofao onNav={onNav} />
    </main>
  );
}

Object.assign(window, { Tobira, Tldr, renderPH, Problema, SfxBeat, Decisoes, Solucao, Resultado, SistemaVolume, NextChapter, Capitulo });
