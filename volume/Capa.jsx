/* =====================================================================
   VOLUME — Capa.jsx
   Page 1: the cover. Header · tobira-e splash · diferencial · sumário ·
   quem sou · colofão. Also exports the shared Nav + Colofão.
   ===================================================================== */

/* ---------- [A] HEADER (shared) ---------- */
function Nav({ view, go, onContact }) {
  const [stamped, setStamped] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);   // hide on scroll-down, show on scroll-up
  useEffect(() => { const t = setTimeout(() => setStamped(true), 60); return () => clearTimeout(t); }, []);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return;        // ignore jitter
      setHidden(y > last && y > 90);             // down past a threshold = hide
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const nav = (fn) => { setMenuOpen(false); fn(); };
  const Link = ({ to, children, active }) => (
    <a href="#" className={active ? "active" : ""}
       onClick={(e) => { e.preventDefault(); nav(() => go(to)); }}>{children}</a>
  );
  return (
    <header>
      <nav className={`v-nav ${hidden && !menuOpen ? "nav-hidden" : ""}`}>
        <a className="v-brand" href="#" onClick={(e) => { e.preventDefault(); nav(() => go("home")); }}>
          <span className={`seal-wrap ${stamped ? "stamp-in" : ""}`}><Seal size={34} alt="Selo de Gabriel" /></span>
          <span className="wm">Volume</span>
        </a>
        <button type="button" className={`v-burger ${menuOpen ? "x" : ""}`} aria-label="Menu"
                aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}>
          <span></span><span></span><span></span>
        </button>
        <div className={`v-navlinks ${menuOpen ? "open" : ""}`}>
          <Link to="sumario" active={view === "home"}>Capítulos</Link>
          <Link to="sobre" active={view === "sobre"}>Sobre</Link>
          <Link to="processo" active={view === "processo"}>Processo</Link>
          <a href="#" className="btn btn-secondary nav-contact nav-contact-m"
             onClick={(e) => { e.preventDefault(); nav(onContact); }}>Fale comigo</a>
        </div>
        <a href="#" className="btn btn-secondary nav-contact nav-contact-d"
           onClick={(e) => { e.preventDefault(); nav(onContact); }}>Fale comigo</a>
      </nav>
      <div className="v-rule"></div>
      <div className="v-volline">
        <span>{VOL}</span>
        <span className="rtl">※ Leitura da direita para a esquerda</span>
      </div>
    </header>
  );
}

/* ---------- [B] SPLASH / TOBIRA-E ---------- */
function Splash({ onRead, onContact, lit }) {
  return (
    <section className={`splash ${lit ? "lit" : ""}`}>
      <span className="splash-kanji" aria-hidden="true">間</span>
      <span className="splash-tone" aria-hidden="true"></span>
      <Organic variant="magatama" size={86} className="splash-mark" />
      <div className="shell">
        <div className="splash-eyebrow"><span className="se-mark">※</span> Manifesto · {VOL}</div>
        <h1 className="splash-manifesto">
          <Brush as="span" className="ml">Eu desenho.</Brush>
          <Brush as="span" className="ml red" delay={150}>E construo.</Brush>
        </h1>
        <p className="splash-thesis">Do protótipo navegável ao produto no ar, com <span className="red">IA dentro do fluxo</span>. Um portfólio que se lê como um volume.</p>
        <div className="splash-surfaces" aria-label="Superfícies">
          <span>SaaS</span><i>·</i><span>Apps</span><i>·</i><span>Desktop</span><i>·</i><span>Web</span>
        </div>
        <div className="splash-cta">
          <button className="btn btn-primary" onClick={onRead}>Começar a ler <span className="arr">→</span></button>
          <a className="btn btn-ghost" href="#" onClick={(e) => { e.preventDefault(); onContact(); }}>Fale comigo</a>
        </div>
      </div>
      <div className="splash-colophon">
        <Seal size={30} alt="Selo de Gabriel" />
        <div className="sc-meta">
          <span className="sc-name">{AUTOR}</span>
          <span className="sc-role">UX / Product Designer · <b>Pleno</b></span>
        </div>
      </div>
    </section>
  );
}

/* ---------- [C] DIFERENCIAL — categories that filter + reveal ------- */
function Diferencial({ onPick, active }) {
  const tags = [["saas", "SaaS"], ["mobile", "Mobile"], ["desktop", "Desktop"], ["web", "Web"], ["ecommerce", "E-commerce"]];
  const byCat = (k) => PROJECTS.filter((p) => p.cat === k);
  return (
    <section className="dif">
      <div className="shell">
        <p className="dif-statement">
          Desenho a experiência <b>e construo de verdade</b>: do protótipo navegável ao
          produto no ar, com <span className="red">IA dentro do fluxo</span>. Range que pega
          recrutador e cliente de freela no mesmo gesto.
        </p>
        <div className="dif-right">
          <div className="dif-eyebrow">Minhas frentes</div>
          <div className="dif-tags" role="group" aria-label="Filtrar o sumário por categoria">
            {tags.map(([key, label]) => {
              const list = byCat(key);
              const a = list[0], b = list[1] || list[0];
              return (
                <button type="button" className={`dif-tag ${active === key ? "on" : ""}`} key={key}
                        onClick={() => onPick(key)}>
                  <span className="dt-label">{label}</span>
                  <span className="dt-count" aria-hidden="true">{String(list.length).padStart(2, "0")}</span>
                  <span className="dt-dot" aria-hidden="true"></span>
                  <span className="dif-reveal" aria-hidden="true">
                    <span className="pic back">
                      <span className="pic-tone"></span>
                      <span className="pic-name">{b.title}</span>
                    </span>
                    <span className="pic front">
                      <span className="pic-tone"></span>
                      <span className="pic-name">{a.title}</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="dif-hint"><span className="arr" aria-hidden="true">↓</span> Toque uma categoria para filtrar o sumário</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- [D] SUMÁRIO — the volume rail (coverflow) ---------- */

/* one tankōbon cover, placed in 3D by its signed offset from the focus.
   B&W at rest; the focused cover comes alive (red), hovered sides warm up. */
function RailCover({ proj, off, dist, hidden, focused, hovered, unit, onClick, onHover }) {
  const spacing = unit * (unit < 200 ? 0.86 : 1.02);
  const depth = unit * 0.6;
  const angle = unit < 200 ? 28 : 21;
  const scale = focused ? 1 : (hovered ? 0.91 : 0.84);
  const style = {
    width: unit, height: Math.round(unit * 1.36),
    transform: `translate(-50%, -50%) translateX(${off * spacing}px) translateZ(${-dist * depth}px) rotateY(${off * -angle}deg) scale(${scale})`,
    opacity: hidden ? 0 : (focused ? 1 : Math.max(0.18, 1 - dist * 0.4)),
    filter: focused ? "none" : `grayscale(${hovered ? 0.15 : 1}) blur(${hovered ? 0 : Math.min(5, dist * 3.5)}px)`,
    zIndex: focused ? 100 : (hovered ? 90 : 80 - dist),
    pointerEvents: hidden ? "none" : "auto",
  };
  return (
    <button type="button" className={`rail-cover ${focused ? "focus" : "side"} ${hovered && !focused ? "hot" : ""}`}
            style={style} onClick={onClick}
            onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}
            tabIndex={focused ? 0 : -1} aria-hidden={focused ? undefined : true}
            aria-label={focused ? `Abrir ${proj.title}` : `Focar ${proj.title}`}>
      <span className="rc-head">
        <span className="rc-vol">{projTag(proj)}</span>
        <span className="rc-cat">{proj.domain}</span>
      </span>
      <span className="rc-art"><MangaPlate />{(focused || hovered) ? <span className="rc-sl"></span> : null}{proj.fav ? <span className="rc-fav">Favorito</span> : null}</span>
      <span className="rc-spine" aria-hidden="true"></span>
      <span className="rc-obi">
        <span className="rc-title">{proj.title}</span>
      </span>
    </button>
  );
}

function FocusRail({ items, onOpen }) {
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(null);
  const [unit, setUnit] = useState(240);
  const wrapRef = useRef(null);
  const count = items.length;
  const firstId = items[0] && items[0].id;

  useEffect(() => { setActive(0); }, [count, firstId]);   // reset on filter change

  useEffect(() => {
    const measure = () => {
      const el = wrapRef.current; if (!el) return;
      const w = el.clientWidth;
      setUnit(Math.round(Math.max(150, Math.min(280, w * (w < 640 ? 0.56 : 0.3)))));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const select = (p) => {
    onOpen(p.id);
  };
  const go = (d) => setActive((p) => (p + d + count) % count);
  const onKey = (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(items[active]); }
  };
  const drag = useRef(null);
  const onDown = (e) => { drag.current = e.clientX; };
  const onUp = (e) => {
    if (drag.current == null) return;
    const dx = e.clientX - drag.current; drag.current = null;
    if (Math.abs(dx) > 44 && count > 1) go(dx < 0 ? 1 : -1);
  };

  const maxSide = count >= 4 ? 2 : 1;
  const activeItem = items[active] || items[0];
  const isChapter = !!(activeItem && activeItem.chapterId);

  return (
    <div className="rail" ref={wrapRef} tabIndex={0} onKeyDown={onKey}
         onPointerDown={onDown} onPointerUp={onUp} role="group" aria-label="Navegador de projetos">
      <div className="rail-stage" style={{ height: Math.round(unit * 1.36) + 40 }}>
        {items.map((proj, idx) => {
          let off = idx - active;
          if (off > count / 2) off -= count;
          if (off < -count / 2) off += count;
          const dist = Math.abs(off);
          if (dist > maxSide + 1) return null;   // mount visible + 1 buffer each side for slide-in
          return (
            <RailCover key={proj.id} proj={proj} off={off} dist={dist}
                       hidden={dist > maxSide} focused={off === 0} hovered={hover === idx} unit={unit}
                       onHover={(v) => setHover(v ? idx : (h) => (h === idx ? null : h))}
                       onClick={() => (off === 0 ? select(proj) : setActive(idx))} />
          );
        })}
      </div>

      <div className="rail-foot">
        <div className="rail-info" key={activeItem.id}>
          <div className="ri-cat">{activeItem.fav ? <span className="ri-fav">◆ Favorito</span> : null}{projTag(activeItem)} · {activeItem.domain}</div>
          <div className="ri-title">{activeItem.title}</div>
          {projDescriptor(activeItem)
            ? <div className="ri-desc">{projDescriptor(activeItem)}</div>
            : <div className="ri-desc dim">Protótipo navegável + Figma · links a preencher</div>}
        </div>
        <div className="rail-ctrls">
          <div className="rail-nav">
            <button type="button" className="rail-arr" onClick={() => go(-1)} disabled={count < 2} aria-label="Anterior">←</button>
            <span className="rail-idx">{String(active + 1).padStart(2, "0")} <i>/</i> {String(count).padStart(2, "0")}</span>
            <button type="button" className="rail-arr" onClick={() => go(1)} disabled={count < 2} aria-label="Próximo">→</button>
          </div>
          <button type="button" className="btn btn-primary rail-open" onClick={() => select(activeItem)}>
            {isChapter ? "Ler capítulo" : "Ver projeto"} <span className="arr">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterBar({ filter, setFilter }) {
  return (
    <div className="vol-filter" role="tablist" aria-label="Categorias">
      {CATS.map((c) => (
        <button type="button" key={c.key} role="tab" aria-selected={filter === c.key}
                className={`vf-tab ${filter === c.key ? "on" : ""}`}
                onClick={() => setFilter(c.key)}>{c.label}</button>
      ))}
    </div>
  );
}

function Sumario({ onOpen, filter, setFilter }) {
  const items = filter === "todos" ? PROJECTS : PROJECTS.filter((p) => p.cat === filter);
  return (
    <section className="shell" style={{ paddingTop: "var(--ma-6)" }}>
      <div className="sec-head" id="sumario">
        <Brush as="h2">Sumário</Brush>
        <span className="kicker">{String(items.length).padStart(2, "0")} {items.length === 1 ? "projeto" : "projetos"} · ※ arraste ou use ← →</span>
      </div>
      <FilterBar filter={filter} setFilter={setFilter} />
      <FocusRail key={filter} items={items} onOpen={onOpen} />
    </section>
  );
}

/* ---------- [E] QUEM SOU ---------- */
function QuemSou({ onSobre, onEmpresa }) {
  const [ci, setCi] = useState(COMPANIES.findIndex((c) => c.atual) >= 0 ? COMPANIES.findIndex((c) => c.atual) : 0);
  const c = COMPANIES[ci];
  const move = (d) => setCi((p) => (p + d + COMPANIES.length) % COMPANIES.length);
  return (
    <section className="quemsou" style={{ marginTop: "var(--ma-6)" }}>
      <div className="shell qs-grid">
        <div className="qs-left">
          <div className="qk">Quem sou</div>
          <p className="qs-bio">UX/Product Designer pleno. Larguei o Direito quando descobri que dava pra desenhar e construir produto de verdade. Leio mangá desde criança, e levo cada projeto do protótipo ao ar com IA no fluxo.</p>
          <a className="btn btn-ghost gl" href="#" onClick={(e) => { e.preventDefault(); onSobre(); }}>Ver posfácio <span className="arr">→</span></a>
        </div>

        <div className="qs-company">
          <div className="qsc-head">
            <span className="qsc-k">{c.atual ? <span className="qsc-now">Empresa atual</span> : <span>Já passei por</span>}</span>
            <div className="qsc-nav">
              <button type="button" className="qsc-arr" aria-label="Empresa anterior" onClick={() => move(-1)}>←</button>
              <span className="qsc-idx">{String(ci + 1).padStart(2, "0")} <i>/</i> {String(COMPANIES.length).padStart(2, "0")}</span>
              <button type="button" className="qsc-arr" aria-label="Próxima empresa" onClick={() => move(1)}>→</button>
            </div>
          </div>
          <button type="button" className="qsc-card" onClick={() => onEmpresa(c.id)} aria-label={`Ver minha história na ${c.name}`}>
            <span className="qsc-logo"><span className="qsc-logo-mark">{c.name}</span><span className="qsc-logo-cap">[ logo ]</span></span>
            <span className="qsc-body">
              <span className="qsc-name">{c.name}</span>
              <span className="qsc-role">{c.role}</span>
              <span className="qsc-go">Ver minha história <span className="arr" aria-hidden="true">→</span></span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------- [F] COLOFÃO / CONTATO (shared footer) ---------- */
function Colofao({ onContact }) {
  return (
    <footer className="v-foot" id="fim">
      <div className="shell">
        <div className="foot-top">
          <h2 className="foot-cta">Vamos abrir<br /><a href={CONTATO.whatsapp.href} target="_blank" rel="noreferrer">o próximo capítulo</a>.</h2>
          <div className="foot-meta">
            <div className="row"><span className="kicker" style={{ color: "var(--wash-2)" }}>Disponível para freela &amp; full-time</span></div>
            <div className="row" style={{ marginTop: 4 }}>
              <a className="btn btn-primary" href={CONTATO.whatsapp.href} target="_blank" rel="noreferrer"
                 style={{ padding: "11px 20px", fontSize: 14 }}>Fale comigo <span className="arr">→</span></a>
            </div>
            <div className="row" style={{ marginTop: 10, gap: 18, flexWrap: "wrap" }}>
              <a className="s" href={CONTATO.whatsapp.href} target="_blank" rel="noreferrer">WhatsApp · {CONTATO.whatsapp.display}</a>
              <a className="s" href={CONTATO.linkedin.href} target="_blank" rel="noreferrer">LinkedIn</a>
              <a className="s" href={CONTATO.instagram.href} target="_blank" rel="noreferrer">Instagram</a>
              <a className="s" href={CONTATO.email.href}>E-mail</a>
            </div>
          </div>
        </div>
        <div className="foot-bottom">
          <span>{AUTOR} · {VOL}</span>
          <Seal size={34} alt="Selo de Gabriel" />
        </div>
      </div>
    </footer>
  );
}

/* ---------- the assembled cover ---------- */
function Capa({ onOpen, onContact, onSobre, onEmpresa, onRead, lit, filter, setFilter }) {
  const pick = (cat) => { setFilter(cat); onRead(); };
  return (
    <main className="viewcut" key="home">
      <Splash onRead={onRead} onContact={onContact} lit={lit} />
      <Diferencial onPick={pick} active={filter === "todos" ? null : filter} />
      <Sumario onOpen={onOpen} filter={filter} setFilter={setFilter} />
      <QuemSou onSobre={onSobre} onEmpresa={onEmpresa} />
      <Colofao onContact={onContact} />
    </main>
  );
}

Object.assign(window, { Nav, Splash, Diferencial, Sumario, FocusRail, RailCover, FilterBar, QuemSou, Colofao, Capa });
