/* =====================================================================
   VOLUME — Processo.jsx
   Page 3: o método. A scroll-driven showcase — you descend and each step
   cuts in (text + manga panel), pagination bars track progress, a beat of
   vermilion for energy. Honest and fast: preempts "qual seu processo?".
   ===================================================================== */
/* each step carries its own kanji (the method, written): giant vertical
   outline in the panel, romaji below — the SFX language applied to work */
const PROC_JA = [
  ["目標", "MOKUHYŌ"],   // objective
  ["参照", "SANSHŌ"],    // reference
  ["試作", "SHISAKU"],   // prototype
  ["提示", "TEIJI"],     // present
  ["調整", "CHŌSEI"],    // adjust
  ["構築", "KŌCHIKU"],   // build
];

function Processo({ onContact, onNav }) {
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
        <div className="splash-kicker">{t("O método", "The method")}</div>
        <Brush as="h1" className="proc-h1">{t("Do objetivo ao protótipo,", "From goal to prototype,")}<br />{t("em dias.", "in days.")}</Brush>
        <p className="splash-lead" style={{ maxWidth: "46ch", margin: "var(--ma-3) 0 var(--ma-4)" }}>
          {t("Honesto e veloz. Sem teatro de discovery. Valido com critério real e construo de verdade.", "Honest and fast. No discovery theater. I validate with real criteria and actually build.")}
        </p>
        <div className="proc-scrollhint"><span className="dn">↓</span> {t("Role para seguir o método", "Scroll to follow the method")}</div>
      </section>

      <div className="proc-scroll" ref={wrapRef} style={{ height: `${n * 58}vh` }}>
        <div className="proc-sticky">
          <div className="shell proc-grid">
            <div className="proc-left">
              <div className="proc-step-k">{t("Passo", "Step")} <b>{cur.n}</b> <i>/</i> {String(n).padStart(2, "0")}</div>
              <div className="proc-bars" role="group" aria-label={t("Passos do método", "Method steps")}>
                {steps.map((s, i) => (
                  <button type="button" key={s.n} className={`proc-bar ${i === active ? "on" : ""} ${i < active ? "done" : ""}`}
                          aria-label={t(`Passo ${s.n}: ${s.t}`, `Step ${s.n}: ${s.t}`)} aria-current={i === active ? "step" : undefined}
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
            </div>

            <div className="proc-right">
              <div className="proc-visual" key={active}>
                <span className="pv-frame">
                  <span className="pv-tone" aria-hidden="true"></span>
                  <span className="pv-step" aria-hidden="true">{cur.n}</span>
                  <span className="pv-kanji" lang="ja" translate="no" aria-hidden="true">{PROC_JA[active][0]}</span>
                  <span className="pv-ro" aria-hidden="true">{PROC_JA[active][1]}</span>
                  <span className="pv-sl"></span>
                </span>
                <span className="pv-cap">{cur.t}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="shell proc-recap">
        <div className="sec-head" style={{ margin: "var(--ma-5) 0 var(--ma-3)" }}>
          <Brush as="h2" style={{ fontSize: "var(--t-d2)" }}>{t("De relance", "At a glance")}</Brush>
          <span className="kicker">{t("o método inteiro numa página", "the whole method on one page")}</span>
        </div>
        <ol className="recap-grid">
          {steps.map((s) => (
            <li className="recap" key={s.n}>
              <span className="rec-n">{s.n}</span>
              <span className="rec-t">{s.t}</span>
              <span className="rec-p">{s.p}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="shell proc-close">
        <Brush as="h2" className="proc-msg">{t("Protótipo vira produto.", "Prototype becomes product.")} <span className="red">{t("Eu construo.", "I build it.")}</span></Brush>
        {/* uma chamada só, no fim. Antes ela vivia dentro do painel sticky,
            então reaparecia colada nos 6 passos. */}
        <div className="proc-cta-row">
          <button className="btn btn-primary" onClick={onContact}>{t("Comece um capítulo comigo", "Start a chapter with me")} <span className="arr">→</span></button>
        </div>
      </section>

      <Colofao onContact={onContact} onNav={onNav} />
    </main>
  );
}
Object.assign(window, { Processo });
