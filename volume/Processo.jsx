/* =====================================================================
   VOLUME — Processo.jsx
   Page 3: o método. A scroll-driven showcase — you descend and each step
   cuts in (text + manga panel), pagination bars track progress, a beat of
   vermilion for energy. Honest and fast: preempts "qual seu processo?".
   ===================================================================== */
/* one organic ink loader per method step — motion that reads as "working" */
const PROC_ORG = ["split", "bounce", "trail", "merge", "jelly", "drip"];

function Processo({ onContact }) {
  const steps = PROCESSO;                 // 6 steps, read top→bottom
  const n = steps.length;
  const wrapRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = wrapRef.current; if (!el) return;
    const onScroll = () => {
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) { setActive(0); return; }
      const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), total);
      const idx = Math.min(n - 1, Math.floor((scrolled / total) * n));
      setActive(idx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [n]);

  const goTo = (i) => {
    const el = wrapRef.current; if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: el.offsetTop + (total / n) * i + 6, behavior: "smooth" });
  };

  const cur = steps[active];

  return (
    <main className="processo viewcut" key="processo">
      <section className="shell proc-intro">
        <div className="splash-kicker">O método</div>
        <Brush as="h1" className="proc-h1">Do objetivo ao protótipo,<br />em dias.</Brush>
        <p className="splash-lead" style={{ maxWidth: "46ch", margin: "var(--ma-3) 0 var(--ma-4)" }}>
          Honesto e veloz. Sem teatro de discovery. Valido com critério real e construo de verdade.
        </p>
        <div className="proc-scrollhint"><span className="dn">↓</span> Role para seguir o método</div>
      </section>

      <div className="proc-scroll" ref={wrapRef} style={{ height: `${n * 82}vh` }}>
        <div className="proc-sticky">
          <div className="shell proc-grid">
            <div className="proc-left">
              <div className="proc-step-k">Passo <b>{cur.n}</b> <i>/</i> {String(n).padStart(2, "0")}</div>
              <div className="proc-bars" role="group" aria-label="Passos do método">
                {steps.map((s, i) => (
                  <button type="button" key={s.n} className={`proc-bar ${i === active ? "on" : ""} ${i < active ? "done" : ""}`}
                          aria-label={`Passo ${s.n}: ${s.t}`} aria-current={i === active ? "step" : undefined}
                          onClick={() => goTo(i)}></button>
                ))}
              </div>
              <div className="proc-textwrap">
                {steps.map((s, i) => (
                  <div className={`proc-text ${i === active ? "on" : ""}`} key={s.n} aria-hidden={i !== active}>
                    <h2 className="pt-t">{s.t}</h2>
                    <p className="pt-p">{s.p}</p>
                  </div>
                ))}
              </div>
              <div className="proc-cta-row">
                <button className="btn btn-primary" onClick={onContact}>Comece um capítulo comigo <span className="arr">→</span></button>
              </div>
            </div>

            <div className="proc-right">
              <div className="proc-visual" key={active}>
                <span className="pv-frame">
                  <MangaPlate />
                  <span className="pv-sl"></span>
                  <span className="pv-num" aria-hidden="true">{cur.n}</span>
                  <Organic variant={PROC_ORG[active % PROC_ORG.length]} size={92} className="proc-org" />
                </span>
                <span className="pv-cap">{cur.t}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="shell proc-close">
        <Brush as="h2" className="proc-msg">Protótipo vira produto. <span className="red">Eu construo.</span></Brush>
      </section>

      <Colofao onContact={onContact} />
    </main>
  );
}
Object.assign(window, { Processo });
