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
          <p className="cover-lead">{typeof chap.premise === "string" ? <PH>{chap.premise.replace(/^\[|\]$/g, "")}</PH> : chap.premise}</p>
          <div className="cover-meta">
            <div className="m"><div className="l">Papel</div><div className="v"><PH>{chap.role.replace(/^\[|\]$/g, "")}</PH></div></div>
            <div className="m"><div className="l">Superfície</div><div className="v">{chap.surface}</div></div>
            <div className="m"><div className="l">Ano</div><div className="v">{chap.year}</div></div>
          </div>
          <ProtoLinks links={chap.links} />
          <div className="cover-scroll"><span className="dn">↓</span> Role para ler</div>
        </div>
        <div className="cover-art">
          {chap.cover
            ? <img className="cover-img" src={chap.cover} alt={`Tela de ${chap.title}`} loading="lazy" draggable="false" />
            : <><MangaPlate dark /><Organic variant={chapOrg(chap.id)} size={150} className="cover-org" onInk /></>}
        </div>
      </div>
    </section>
  );
}

/* ---- TL;DR strip ---- */
function Tldr({ tldr }) {
  const cell = (l, v) => (
    <div className="cell"><div className="l">{l}</div><div className="v">{renderPH(v)}</div></div>
  );
  return (
    <div className="tldr">
      {cell("Papel", tldr.papel)}
      {cell("O quê", tldr.oque)}
      {cell("Resultado", tldr.resultado)}
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

/* ---- [2] PROBLEMA ---- */
function Problema({ chap }) {
  return (
    <Beat>
      <div className="c7">
        <div className="panel art">
          <MangaPlate />
        </div>
      </div>
      <div className="c5 text-col">
        <div className="panel text">
          <div className="beat-k">Problema</div>
          <Brush as="h2" className="beat-t">{renderPH(chap.problema.t)}</Brush>
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
        <Brush as="h2" style={{ fontSize: "var(--t-d2)" }}>As decisões</Brush>
        <span className="kicker">o porquê de cada corte</span>
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
        <Brush as="h2" style={{ fontSize: "var(--t-d2)" }}>A solução</Brush>
        <span className="kicker live" style={{ color: "var(--vermilion-ink)" }}>no ar</span>
      </div>
      <Beat>
        <div className="c5 text-col">
          <div className="panel text">
            <div className="beat-k">Solução</div>
            <Brush as="h2" className="beat-t">{renderPH(chap.solucao.t)}</Brush>
            {chap.solucao.p.map((para, i) => <p className="beat-p" key={i}>{renderPH(para)}</p>)}
            <div className="ai-note"><span className="b"></span> Protótipo → produto no ar</div>
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
                    ? <img className="sol-img" src={shots[i]} alt={`${chap.title} · tela ${i + 1}`} loading="lazy" draggable="false" />
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

/* ---- [5] RESULTADO ---- */
function Resultado({ chap }) {
  return (
    <Beat className="rev" hold={380 /* a ma before the reveal */}>
      <div className="c5 text-col">
        <div className="panel text">
          <div className="beat-k">Resultado</div>
          <Brush as="h2" className="beat-t">{renderPH(chap.resultado.t)}</Brush>
          {chap.resultado.p.map((para, i) => <p className="beat-p" key={i}>{renderPH(para)}</p>)}
        </div>
      </div>
      <div className="c7">
        <div className="panel art">
          <MangaPlate />
        </div>
      </div>
    </Beat>
  );
}

/* ---- [6] NEXT CHAPTER ---- */
function NextChapter({ next, onOpen, onHome }) {
  return (
    <div className="shell">
      <div className="next-chap" onClick={() => onOpen(next.id)} role="button" tabIndex={0}
           onKeyDown={(e) => { if (e.key === "Enter") onOpen(next.id); }}>
        <div>
          <div className="nc-k">Próximo capítulo · {next.cap} · {next.domain}</div>
          <div className="nc-t">{next.title}</div>
        </div>
        <div className="nc-arr">→</div>
      </div>
      <div style={{ padding: "var(--ma-4) 0 var(--ma-6)" }}>
        <a className="btn btn-ghost" href="#" onClick={(e) => { e.preventDefault(); onHome(); }}>
          <span className="arr" style={{ display: "inline-block", transform: "scaleX(-1)" }}>→</span> Voltar ao sumário
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
          <span className="arr">←</span> Voltar ao volume
        </a>
        <span className="cap">{chap.cap} · {VOL}</span>
      </div>

      <Tobira chap={chap} />

      <div className="chapter-body shell">
        <Tldr tldr={chap.tldr} />
        <div style={{ height: "var(--ma-6)" }}></div>
        <Problema chap={chap} />
        <SfxBeat word={chap.sfx} />
        <Decisoes chap={chap} />
        <div style={{ height: "var(--ma-6)" }}></div>
        <Solucao chap={chap} />
        <div style={{ height: "var(--ma-6)" }}></div>
        <Resultado chap={chap} />
      </div>

      {next && <NextChapter next={next} onOpen={onOpen} onHome={onHome} />}
      <Colofao onNav={onNav} />
    </main>
  );
}

Object.assign(window, { Tobira, Tldr, renderPH, Problema, SfxBeat, Decisoes, Solucao, Resultado, NextChapter, Capitulo });
