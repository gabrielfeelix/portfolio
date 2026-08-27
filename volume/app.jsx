/* =====================================================================
   VOLUME — app.jsx
   View state + transitions (RTL page-turn for chapters, dry cut for
   institutional pages) + Tweaks wiring. Single-page volume.
   ===================================================================== */
const REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "displayFont": "Anton",
  "screentone": 16,
  "entryTransition": "virada",
  "rtlGesture": true,
  "cursos": false
}/*EDITMODE-END*/;

/* the RTL page-turn overlay with kinetic SFX (sheet wipe + kana; no blob) */
function PageTurn({ sfx }) {
  const jp = sfx || "ザッ";
  return (
    <div className="pageturn" aria-hidden="true">
      <div className="sheet"></div>
      <div className="pt-sfx"><span lang="ja" translate="no">{jp}</span><i className="pt-ro">{sfxRo(jp)}</i></div>
    </div>
  );
}

/* the page number in the margin: increments as you leaf through the view.
   Decorative (aria-hidden); blend-difference keeps it legible over paper,
   ink covers and the dark footer alike. */
function PageNum({ view }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const on = () => {
      const page = 1 + Math.floor(window.scrollY / (window.innerHeight * 0.85));
      el.textContent = "p. " + String(page).padStart(3, "0");
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, [view]);
  return <div className="page-num" aria-hidden="true"><span ref={ref}>p. 001</span></div>;
}

/* ---- marcador de página (栞): resume where the reader stopped -------
   While a chapter is being read, the position is saved (throttled). Back
   on the cover, a hanging ribbon offers "continuar de onde parou". */
function Bookmark({ marker, onGo, onDismiss }) {
  return (
    <div className="bookmark" role="complementary" aria-label={t("Marcador de leitura", "Reading bookmark")}>
      <button type="button" className="bm-go" onClick={onGo}>
        <span className="bm-k">{t("Marcador de página", "Bookmark")}</span>
        <span className="bm-t">{marker.title}</span>
        <span className="bm-c">{t("Continuar de onde parou", "Pick up where you left off")} <span className="arr">→</span></span>
      </button>
      <button type="button" className="bm-x" onClick={onDismiss} aria-label={t("Descartar marcador", "Dismiss bookmark")}>×</button>
    </div>
  );
}

/* ---- leitura rápida (#/rapido): os 5 capítulos em 2 minutos ----------
   The fast path the recruiter was promised: every numbered chapter's
   TL;DR stacked on one page, live links included, contact at the end. */
function Rapido({ onOpen, onContact, onNav }) {
  // a espinha de leitura, na ordem — não a ordem de escrita do CHAPTERS
  const caps = CASE_IDS.map((id) => chapterFor(id)).filter(Boolean);
  const nCaps = caps.length;
  return (
    <main className="rapido viewcut" key="rapido">
      <div className="shell">
        <div className="pos-k">{t("Leitura rápida", "Quick read")}</div>
        <Brush as="h1" className="rap-title">{t("O volume em 2 minutos", "The volume in 2 minutes")}</Brush>
        <p className="rap-lead">{t(`Os ${nCaps} capítulos, só o essencial: papel e resultado. O case completo está a um clique.`, `All ${nCaps} chapters, essentials only: role and result. The full case is one click away.`)}</p>

        <ol className="rap-list">
          {caps.map((c) => (
            <li className="rap-item" key={c.id}>
              <div className="rap-head">
                <span className="rap-cap">{c.cap} · {c.domain}</span>
                <h2 className="rap-t">{c.title}</h2>
              </div>
              <div className="rap-cells">
                <div className="rc"><div className="l">{t("Papel", "Role")}</div><div className="v">{renderPH(c.tldr.papel)}</div></div>
                <div className="rc"><div className="l">{t("O quê", "What")}</div><div className="v">{renderPH(c.tldr.oque)}</div></div>
                <div className="rc"><div className="l">{t("Resultado", "Result")}</div><div className="v">{renderPH(c.tldr.resultado)}</div></div>
              </div>
              <div className="rap-actions">
                <button type="button" className="btn btn-ghost" onClick={() => onOpen(c.id)}>{t("Ler o capítulo", "Read the chapter")} <span className="arr">→</span></button>
                {c.links && c.links.vercel
                  ? <a className="rap-live" href={c.links.vercel} target="_blank" rel="noreferrer">{t("Ver no ar", "See it live")} <span className="ext" aria-hidden="true">↗</span></a>
                  : null}
              </div>
            </li>
          ))}
        </ol>

        <div className="rap-cta">
          <p className="rap-lead">{t("Dois minutos e você já sabe como eu trabalho.", "Two minutes and you already know how I work.")}</p>
          <button className="btn btn-primary" onClick={onContact}>{t("Bora conversar", "Let's talk")} <span className="arr">→</span></button>
        </div>
      </div>
      <Colofao onContact={onContact} onNav={onNav} />
    </main>
  );
}

/* 404: a blank page in the volume. The manga SFX for silence. */
function NotFound({ onHome }) {
  return (
    <main className="nf viewcut" key="nf">
      <div className="shell nf-shell">
        <div className="nf-sfx" aria-hidden="true"><span lang="ja" translate="no">シーン</span><i className="sfx-ro">SHIIN</i></div>
        <div className="nf-k">{t("Erro 404 · página em branco", "Error 404 · blank page")}</div>
        <Brush as="h1" className="nf-t">{t("Esse capítulo não existe.", "This chapter doesn't exist.")}</Brush>
        <p className="nf-p">{t("Ou ainda não foi desenhado. O volume continua no sumário.", "Or it hasn't been drawn yet. The volume continues at the contents.")}</p>
        <button className="btn btn-primary" onClick={onHome}>{t("Voltar ao volume", "Back to the volume")} <span className="arr">→</span></button>
      </div>
    </main>
  );
}

function applyTweaks(t) {
  const root = document.documentElement;
  root.style.setProperty("--font-display",
    t.displayFont === "Oswald" ? "'Oswald','Anton',Impact,sans-serif" : "'Anton','Oswald',Impact,sans-serif");
  root.style.setProperty("--tone-op", String((t.screentone ?? 16) / 100));
  document.body.classList.toggle("rtl-off", t.rtlGesture === false);
}

/* ---- hash routing: every view has a shareable URL --------------------
   #/            home        #/sobre       posfácio
   #/processo    processo    #/empresa/id  company page
   #/cap/id      chapter (deep case or peça)
   Back/forward work (popstate), refresh restores the view, links can be
   shared. Unknown hashes fall back to home. */
function viewToHash(view) {
  if (view === "home") return "#/";
  if (view === "404") return "#/404";
  if (view === "sobre" || view === "processo" || view === "rapido") return "#/" + view;
  if (view.indexOf("empresa:") === 0) return "#/empresa/" + view.slice(8);
  return "#/cap/" + view;
}
function hashToView(hash) {
  const h = (hash || "").replace(/^#\/?/, "");
  if (!h) return "home";
  if (h === "sobre" || h === "processo" || h === "rapido") return h;
  if (h.indexOf("empresa/") === 0) {
    const id = h.slice(8);
    return COMPANIES.some((c) => c.id === id) ? "empresa:" + id : "404";
  }
  if (h.indexOf("cap/") === 0) {
    const id = h.slice(4);
    return chapterFor(id) ? id : "404";
  }
  return "404";
}
/* initial view: the SPA is hash-routed, but Vercel's SPA-fallback serves
   index.html for ANY path (e.g. /teste). A direct hit on a non-root path
   is a URL that doesn't exist → normalize the bar to /#/404 and open the
   blank-page chapter. Root path defers to the hash. */
function initialView() {
  const p = window.location.pathname;
  if (p && p !== "/" && p !== "/index.html") {
    try { window.history.replaceState(null, "", "/#/404"); } catch (e) {}
    return "404";
  }
  return hashToView(window.location.hash);
}
function viewTitle(view) {
  const BASE = t("Volume · Portfólio de ", "Volume · Portfolio of ") + AUTOR;
  if (view === "home") return BASE;
  if (view === "sobre") return t("Posfácio · ", "Afterword · ") + BASE;
  if (view === "processo") return t("Processo · ", "Process · ") + BASE;
  if (view === "rapido") return t("Leitura rápida · ", "Quick read · ") + BASE;
  if (view === "404") return t("Página em branco · ", "Blank page · ") + BASE;
  if (view.indexOf("empresa:") === 0) {
    const c = COMPANIES.find((x) => x.id === view.slice(8));
    return c ? c.name + " · " + BASE : BASE;
  }
  const chap = chapterFor(view);
  return chap ? chap.title + " · " + BASE : BASE;
}

/* ---------------------------------------------------------------------
   ROTAS SOB DEMANDA
   Capitulo.js e EmpresaPage.js saem do HTML inicial (ver build.mjs): sao
   86 KB que a home nao usa. Aqui eles chegam quando a rota pede.
   Continuam scripts CLASSICOS que publicam nomes no escopo global, igual
   a todos os outros -- nao ha import/export nesta base. O que muda e so
   QUANDO a tag entra no documento.
   O cache por src garante uma requisicao so, mesmo com varias navegacoes
   ao mesmo tempo, porque guarda a PROMESSA e nao o resultado.
   --------------------------------------------------------------------- */
const ROTA_SCRIPTS = {
  capitulo: ["/volume/Capitulo.js"],
  empresa: ["/volume/EmpresaPage.js"],
};
const _scriptCache = {};   // src -> promessa em voo
const _scriptOk = {};      // src -> true quando ja executou
function carregarScript(src) {
  if (_scriptOk[src]) return Promise.resolve(src);
  if (_scriptCache[src]) return _scriptCache[src];
  _scriptCache[src] = new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.src = src;
    el.onload = () => { _scriptOk[src] = true; resolve(src); };
    el.onerror = () => { delete _scriptCache[src]; reject(new Error("falhou: " + src)); };
    document.head.appendChild(el);
  });
  return _scriptCache[src];
}
// `false` quando ainda falta baixar algo; o App segura a tela ate resolver.
// Le o registro de executados, nao a promessa: durante o render a promessa
// pode existir sem ter rodado ainda, e ai a tela liberava cedo demais.
function rotaPronta(nome) {
  const srcs = ROTA_SCRIPTS[nome] || [];
  return srcs.every((s) => _scriptOk[s] === true);
}
function garantirRota(nome) {
  const srcs = ROTA_SCRIPTS[nome] || [];
  return Promise.all(srcs.map(carregarScript));
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [view, setView] = useState(initialView);  // "home" | chapterId | "processo" | "sobre" | "empresa:<id>" | "404"
  const [turn, setTurn] = useState(null);          // {key, sfx}
  const [lit, setLit] = useState(false);
  const [filter, setFilter] = useState("todos");   // sumário category (lifted so quick-links can set it)
  const [ink, setInk] = useState(() => {             // modo tinta: o volume lido de noite
    try { return localStorage.getItem("vol-ink") === "1"; } catch (e) { return false; }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("ink", ink);
    try { localStorage.setItem("vol-ink", ink ? "1" : "0"); } catch (e) {}
  }, [ink]);

  // modo tinta com virada de tinta: o tema novo se espalha num círculo a
  // partir do botão 墨 (View Transitions API; fallback = troca seca).
  const onInkToggle = (e) => {
    const next = !ink;
    const apply = () => {
      document.documentElement.classList.toggle("ink", next);
      setInk(next);
    };
    if (REDUCED || !document.startViewTransition || !ReactDOM.flushSync) { apply(); return; }
    let x = window.innerWidth - 60, y = 40;
    if (e && e.currentTarget && e.currentTarget.getBoundingClientRect) {
      const r = e.currentTarget.getBoundingClientRect();
      x = r.left + r.width / 2; y = r.top + r.height / 2;
    }
    const vt = document.startViewTransition(() => { ReactDOM.flushSync(apply); });
    vt.ready.then(() => {
      const rad = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`] },
        { duration: 560, easing: "cubic-bezier(.16,1,.3,1)", pseudoElement: "::view-transition-new(root)" }
      );
    }).catch(() => {});
  };

  // marcador de página: salva a posição de leitura do capítulo atual
  // (throttle 600ms, só depois de rolar de verdade)
  useEffect(() => {
    const chapNow = chapterFor(view);
    if (!chapNow) return;
    let t = null;
    const save = () => {
      const y = window.scrollY;
      if (y < 500) return;
      try { localStorage.setItem("vol-marker", JSON.stringify({ id: view, y, title: chapNow.title, ts: Date.now() })); } catch (e) {}
    };
    const on = () => { if (t) return; t = setTimeout(() => { t = null; save(); }, 600); };
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); if (t) clearTimeout(t); };
  }, [view]);

  // de volta à capa: oferece o marcador (se houver um válido)
  const [marker, setMarker] = useState(null);
  useEffect(() => {
    if (view !== "home") { setMarker(null); return; }
    try {
      const m = JSON.parse(localStorage.getItem("vol-marker") || "null");
      setMarker(m && m.id && m.y > 500 && chapterFor(m.id) ? m : null);
    } catch (e) { setMarker(null); }
  }, [view]);
  const dismissMarker = () => {
    try { localStorage.removeItem("vol-marker"); } catch (e) {}
    setMarker(null);
  };
  const resumeMarker = () => {
    if (!marker) return;
    const y = marker.y;
    openChapter(marker.id);
    setTimeout(() => window.scrollTo(0, y), REDUCED ? 80 : 700);
  };

  const primeiraRota = useRef(true);
  useEffect(() => { const id = setTimeout(() => setLit(true), 120); return () => clearTimeout(id); }, []);
  useEffect(() => { applyTweaks(t); }, [t]);

  // keep the URL + tab title in sync with the view; browser back/forward
  // (popstate) restores the view without pushing a duplicate entry.
  useEffect(() => {
    const h = viewToHash(view);
    if (window.location.hash !== h) {
      // same view under a different hash (initial load, normalization) →
      // replace; a real navigation → push a history entry.
      const fn = hashToView(window.location.hash) === view ? "replaceState" : "pushState";
      window.history[fn](null, "", h);
    }
    document.title = viewTitle(view);
    // analytics: o script da Vercel não conta troca de hash (mesmo pathname),
    // então a rota é reportada aqui. O pageview de entrada já saiu sozinho.
    if (primeiraRota.current) primeiraRota.current = false;
    else if (window.vpage) window.vpage(h.slice(1) || "/");
  }, [view]);
  useEffect(() => {
    const onPop = () => {
      const h = window.location.hash;
      if (h && h.indexOf("#/") !== 0) return;   // in-page anchor (e.g. skip-link #conteudo), not a route
      setView(hashToView(h)); window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // SPA focus management: on view change (not initial mount), move keyboard/SR
  // focus to the content region so Tab resumes from a known point and the new
  // page is announced. Without this, activating a link drops focus to <body>
  // and Tab skips the skip-link + header. preventScroll: top() already handles it.
  const firstView = useRef(true);
  useEffect(() => {
    if (firstView.current) { firstView.current = false; return; }
    const el = document.getElementById("conteudo");
    if (el) el.focus({ preventScroll: true });
  }, [view]);

  // dismiss the boot loader once fonts are ready (kills the font-swap flash)
  // and a minimum beat has passed, then dry-cut into the volume.
  useEffect(() => {
    const boot = document.getElementById("boot");
    if (!boot) return;
    const fonts = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    const minBeat = new Promise((r) => setTimeout(r, 600));
    let killed = false;
    Promise.all([fonts, minBeat]).then(() => {
      if (killed) return;
      if (window.__bootDots) clearInterval(window.__bootDots);
      boot.classList.add("boot-done");
      setTimeout(() => boot && boot.remove(), 640);
    });
    return () => { killed = true; };
  }, []);

  const top = () => window.scrollTo(0, 0);
  const animateScroll = (toY, dur = 480) => {
    const startY = window.scrollY, dist = toY - startY, t0 = performance.now();
    const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      window.scrollTo(0, startY + dist * ease(p));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const scrollTo = (anchorId, smooth, pad = 116) => {
    const el = document.getElementById(anchorId);
    if (!el) return;
    const y = Math.max(0, el.getBoundingClientRect().top + window.scrollY - pad);
    if (smooth && !REDUCED) animateScroll(y);
    else window.scrollTo(0, y);
  };

  const openChapter = (id) => {
    const chap = chapterFor(id);
    if (!chap) return;          // peça não abre case: a navegação simplesmente não acontece
    const mode = REDUCED ? "off" : t.entryTransition;
    if (mode === "off") { setView(id); top(); return; }
    if (mode === "corte") { setView(id); top(); return; }
    // "virada" — the manga page-turn
    setTurn({ key: Date.now(), sfx: chap ? chap.sfx : "ザッ" });
    setTimeout(() => { setView(id); top(); }, 252);
    setTimeout(() => setTurn(null), 660);
  };

  const goHome = (anchor) => {
    setView("home"); top();
    if (anchor) setTimeout(() => scrollTo(anchor, false), 70);
  };
  const goView = (v) => { setView(v); top(); };
  const openEmpresa = (id) => { setView("empresa:" + id); top(); };
  const openProject = (p) => { if (p) openChapter(p.id); };
  const [stamp, setStamp] = useState(0);           // hanko press no CTA de contato
  // todo "Bora conversar" / "Vamos trocar uma ideia" abre o WhatsApp com a
  // mensagem pronta. Antes rolava até o rodapé, que só adiava o contato.
  const goContact = () => {
    if (!REDUCED) { setStamp(Date.now()); setTimeout(() => setStamp(0), 900); }
    window.open(CONTATO.whatsapp.href, "_blank", "noopener,noreferrer");
  };

  const handleNav = (to) => {
    if (to === "home") goHome();
    else if (to === "sumario") goHome("sumario");
    else if (to === "sobre") goView("sobre");
    else if (to === "processo") goView("processo");
  };

  const chap = (view === "404") ? null : chapterFor(view);
  const next = chap ? chapterFor(nextProjectId(view)) : null;
  const empId = view.indexOf("empresa:") === 0 ? view.slice(8) : null;
  const empresa = empId ? COMPANIES.find((c) => c.id === empId) : null;

  // as rotas pesadas chegam sob demanda: enquanto o script nao esta no
  // documento, `pronto` e false e a tela segura. O tick force um re-render
  // quando o download termina.
  const rotaNome = chap ? "capitulo" : (empresa ? "empresa" : null);
  const [, setTick] = useState(0);
  const pronto = !rotaNome || rotaPronta(rotaNome);
  useEffect(() => {
    if (!rotaNome || pronto) return;
    let vivo = true;
    garantirRota(rotaNome).then(() => { if (vivo) setTick((n) => n + 1); });
    return () => { vivo = false; };
  }, [rotaNome, pronto]);

  // pre-busca ociosa: assim que a home assenta, o capitulo desce em
  // segundo plano, entao o primeiro clique no sumario ja acha em cache.
  useEffect(() => {
    if (rotaNome) return;
    // espera a primeira dobra assentar de verdade antes de buscar: puxar
    // cedo demais rouba banda e main thread justamente na janela que o
    // Lighthouse mede, e o ganho (clique instantaneo no sumario) nao
    // depende de ser nos primeiros segundos.
    const ocioso = window.requestIdleCallback || ((fn) => setTimeout(fn, 1200));
    let id;
    const atraso = setTimeout(() => {
      id = ocioso(() => garantirRota("capitulo").catch(() => {}));
    }, 5000);
    return () => {
      clearTimeout(atraso);
      if (window.cancelIdleCallback && typeof id === "number") window.cancelIdleCallback(id);
    };
  }, [rotaNome]);

  let body;
  if (rotaNome && !pronto) {
    // mesma moldura da pagina, sem conteudo: evita salto de layout quando
    // o script chega (o CLS estava em 0 e precisa continuar).
    body = <div className="shell" style={{ minHeight: "70vh" }} aria-busy="true" />;
  } else if (chap) {
    body = <Capitulo chap={chap} next={next} onOpen={openChapter} onHome={() => goHome("sumario")} onNav={handleNav} />;
  } else if (empresa) {
    body = <EmpresaPage company={empresa} companies={COMPANIES} onHome={() => goHome()}
                        onEmpresa={openEmpresa} onProject={openProject} onContact={goContact} onNav={handleNav} />;
  } else if (view === "processo") {
    body = <Processo onContact={goContact} onNav={handleNav} />;
  } else if (view === "rapido") {
    body = <Rapido onOpen={openChapter} onContact={goContact} onNav={handleNav} />;
  } else if (view === "404") {
    body = <NotFound onHome={() => goHome()} />;
  } else if (view === "sobre") {
    body = <Posfacio onContact={goContact} t={t} onEmpresa={openEmpresa} onProject={openProject} onNav={handleNav} />;
  } else {
    body = <Capa onOpen={openChapter} onContact={goContact} onSobre={() => goView("sobre")}
                 onEmpresa={openEmpresa} filter={filter} setFilter={setFilter}
                 onRead={() => scrollTo("sumario", true)} lit={lit} onNav={handleNav}
                 onRapido={() => goView("rapido")} />;
  }

  return (
    <>
      <CursorDot />
      <Nav view={view} go={handleNav} onContact={goContact} ink={ink} onInk={onInkToggle} />
      {view === "home" && marker ? <Bookmark marker={marker} onGo={resumeMarker} onDismiss={dismissMarker} /> : null}
      {stamp ? <div className="seal-stamp" key={stamp} aria-hidden="true"><img src="volume/assets/seal.svg" alt="" width="130" height="130" /></div> : null}
      {view !== "home" && <PageNum view={view} />}
      {turn && <PageTurn key={turn.key} sfx={turn.sfx} />}
      <div id="conteudo" tabIndex={-1}>{body}</div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Tipografia" />
        <TweakRadio label="Fonte de display" value={t.displayFont}
                    options={["Anton", "Oswald"]}
                    onChange={(v) => setTweak("displayFont", v)} />
        <TweakSection label="Textura" />
        <TweakSlider label="Screentone" value={t.screentone} min={0} max={40} step={1} unit="%"
                     onChange={(v) => setTweak("screentone", v)} />
        <TweakSection label="Sumário" />
        <TweakToggle label="Gesto RTL (setas ←)" value={t.rtlGesture}
                     onChange={(v) => setTweak("rtlGesture", v)} />
        <TweakSection label="Movimento" />
        <TweakRadio label="Entrada do capítulo" value={t.entryTransition}
                    options={["virada", "corte", "off"]}
                    onChange={(v) => setTweak("entryTransition", v)} />
        <TweakSection label="Posfácio" />
        <TweakToggle label="Nomear cursos" value={t.cursos}
                     onChange={(v) => setTweak("cursos", v)} />
      </TweaksPanel>
    </>
  );
}

/* the volume never dies blank: a render error shows a themed blank-page
   state with a reload action instead of unmounting the whole root */
class VolumeBoundary extends React.Component {
  constructor(props) { super(props); this.state = { err: false }; }
  static getDerivedStateFromError() { return { err: true }; }
  render() {
    if (!this.state.err) return this.props.children;
    return (
      <main className="nf">
        <div className="shell nf-shell">
          <div className="nf-sfx" aria-hidden="true"><span lang="ja" translate="no">ドサッ</span><i className="sfx-ro">DOSA</i></div>
          <div className="nf-k">{t("Erro · o volume caiu no chão", "Error · the volume hit the floor")}</div>
          <h1 className="nf-t">{t("Algo rasgou esta página.", "Something tore this page.")}</h1>
          <p className="nf-p">{t("Recarregue pra voltar ao volume.", "Reload to get back to the volume.")}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>{t("Recarregar", "Reload")} <span className="arr">→</span></button>
        </div>
      </main>
    );
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(<VolumeBoundary><App /></VolumeBoundary>);
