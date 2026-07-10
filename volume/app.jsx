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
  "perfume": "Sem desculpa",
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

/* manga reading progress: a thin vermilion rule at the very top that fills
   as you read the page. Only on reading views (chapter/sobre/processo/
   empresa) — the home cover isn't "a page being read". */
function ReadProgress({ view }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const on = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, window.scrollY / total) : 0;
      el.style.transform = `scaleX(${p})`;
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, [view]);
  return <div className="read-progress" aria-hidden="true"><span ref={ref}></span></div>;
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
  if (view === "sobre" || view === "processo") return "#/" + view;
  if (view.indexOf("empresa:") === 0) return "#/empresa/" + view.slice(8);
  return "#/cap/" + view;
}
function hashToView(hash) {
  const h = (hash || "").replace(/^#\/?/, "");
  if (!h) return "home";
  if (h === "sobre" || h === "processo") return h;
  if (h.indexOf("empresa/") === 0) {
    const id = h.slice(8);
    return COMPANIES.some((c) => c.id === id) ? "empresa:" + id : "home";
  }
  if (h.indexOf("cap/") === 0) {
    const id = h.slice(4);
    return chapterFor(id) ? id : "home";
  }
  return "home";
}
function viewTitle(view) {
  const BASE = "Volume — Portfólio · " + AUTOR;
  if (view === "home") return BASE;
  if (view === "sobre") return "Posfácio · " + BASE;
  if (view === "processo") return "Processo · " + BASE;
  if (view.indexOf("empresa:") === 0) {
    const c = COMPANIES.find((x) => x.id === view.slice(8));
    return c ? c.name + " · " + BASE : BASE;
  }
  const chap = chapterFor(view);
  return chap ? chap.title + " · " + BASE : BASE;
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [view, setView] = useState(() => hashToView(window.location.hash));  // "home" | chapterId | "processo" | "sobre" | "empresa:<id>"
  const [turn, setTurn] = useState(null);          // {key, sfx}
  const [lit, setLit] = useState(false);
  const [filter, setFilter] = useState("todos");   // sumário category (lifted so quick-links can set it)

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
    const minBeat = new Promise((r) => setTimeout(r, 1000));
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
  const goContact = () => {
    if (view !== "home") { setView("home"); top(); setTimeout(() => scrollTo("fim", false), 90); }
    else scrollTo("fim", true);
  };

  const handleNav = (to) => {
    if (to === "home") goHome();
    else if (to === "sumario") goHome("sumario");
    else if (to === "sobre") goView("sobre");
    else if (to === "processo") goView("processo");
  };

  const chap = chapterFor(view);
  const next = chap ? chapterFor(nextProjectId(view)) : null;
  const empId = view.indexOf("empresa:") === 0 ? view.slice(8) : null;
  const empresa = empId ? COMPANIES.find((c) => c.id === empId) : null;

  let body;
  if (chap) {
    body = <Capitulo chap={chap} next={next} onOpen={openChapter} onHome={() => goHome("sumario")} onNav={handleNav} />;
  } else if (empresa) {
    body = <EmpresaPage company={empresa} companies={COMPANIES} onHome={() => goHome()}
                        onEmpresa={openEmpresa} onProject={openProject} onContact={goContact} onNav={handleNav} />;
  } else if (view === "processo") {
    body = <Processo onContact={goContact} onNav={handleNav} />;
  } else if (view === "sobre") {
    body = <Posfacio onContact={goContact} t={t} onEmpresa={openEmpresa} onProject={openProject} onNav={handleNav} />;
  } else {
    body = <Capa onOpen={openChapter} onContact={goContact} onSobre={() => goView("sobre")}
                 onEmpresa={openEmpresa} filter={filter} setFilter={setFilter}
                 onRead={() => scrollTo("sumario", true)} lit={lit} onNav={handleNav} />;
  }

  return (
    <>
      <CursorDot />
      <Nav view={view} go={handleNav} onContact={goContact} />
      {view !== "home" && <ReadProgress view={view} />}
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
        <TweakRadio label="Perfume (tom)" value={t.perfume}
                    options={["Sem desculpa", "Fraco confesso"]}
                    onChange={(v) => setTweak("perfume", v)} />
        <TweakToggle label="Nomear cursos" value={t.cursos}
                     onChange={(v) => setTweak("cursos", v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
