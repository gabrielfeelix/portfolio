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

/* the RTL page-turn overlay with kinetic SFX */
function PageTurn({ sfx }) {
  const jp = sfx || "ザッ";
  return (
    <div className="pageturn" aria-hidden="true">
      <div className="sheet"></div>
      <div className="pt-blob"></div>
      <div className="pt-sfx"><span lang="ja" translate="no">{jp}</span><i className="pt-ro">{sfxRo(jp)}</i></div>
    </div>
  );
}

function applyTweaks(t) {
  const root = document.documentElement;
  root.style.setProperty("--font-display",
    t.displayFont === "Oswald" ? "'Oswald','Anton',Impact,sans-serif" : "'Anton','Oswald',Impact,sans-serif");
  root.style.setProperty("--tone-op", String((t.screentone ?? 16) / 100));
  document.body.classList.toggle("rtl-off", t.rtlGesture === false);
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [view, setView] = useState("home");      // "home" | chapterId | "processo" | "sobre" | "empresa:<id>"
  const [turn, setTurn] = useState(null);          // {key, sfx}
  const [lit, setLit] = useState(false);
  const [filter, setFilter] = useState("todos");   // sumário category (lifted so quick-links can set it)

  useEffect(() => { const id = setTimeout(() => setLit(true), 120); return () => clearTimeout(id); }, []);
  useEffect(() => { applyTweaks(t); }, [t]);

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
