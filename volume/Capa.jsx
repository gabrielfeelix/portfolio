/* =====================================================================
   VOLUME — Capa.jsx
   Page 1: the cover. Header · tobira-e splash · diferencial · sumário ·
   quem sou · colofão. Also exports the shared Nav + Colofão.
   ===================================================================== */

/* ---------- [A] HEADER (shared) ---------- */
function Nav({ view, go, onContact, ink, onInk }) {
  const [stamped, setStamped] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);   // hide on scroll-down (non-home bar)
  const [overHero, setOverHero] = useState(view === "home");   // sitting over the home cover
  useEffect(() => { const t = setTimeout(() => setStamped(true), 60); return () => clearTimeout(t); }, []);
  useEffect(() => {
    let last = window.scrollY;
    // view change: the hide-on-scroll state from the previous page must not
    // leak in (arriving on a chapter from a scrolled position kept the pill
    // hidden until the user scrolled up)
    setHidden(false);
    const onScroll = () => {
      const y = window.scrollY;
      setOverHero(view === "home" && y < window.innerHeight * 0.82);
      if (Math.abs(y - last) >= 6) { setHidden(y > last && y > 90); last = y; }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [view]);

  const isHome = view === "home";
  // floating centered pill on EVERY view (consistent). On home it stays hidden
  // while sitting over the red cover, then appears once past it. Hides on
  // scroll-down, returns on scroll-up.
  const headerCls = (isHome && overHero) ? "hd-hidden"
    : "hd-float" + ((hidden && !menuOpen) ? " hd-hidden" : "");
  const nav = (fn) => { setMenuOpen(false); fn(); };
  const Link = ({ to, children, active }) => (
    <a href="#" className={active ? "active" : ""}
       onClick={(e) => { e.preventDefault(); nav(() => go(to)); }}>{children}</a>
  );
  return (
    <header className={headerCls}>
      <nav className="v-nav">
        <a className="v-brand" href="#" onClick={(e) => { e.preventDefault(); nav(() => go("home")); }}>
          <span className={`seal-wrap ${stamped ? "stamp-in" : ""}`}><Seal size={34} alt="Selo de Gabriel" /></span>
          <span className="wm">Volume</span>
        </a>
        <button type="button" className={`v-burger ${menuOpen ? "x" : ""}`} aria-label="Menu"
                aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}>
          <span></span><span></span><span></span>
        </button>
        <div className={`v-navlinks ${menuOpen ? "open" : ""}`}>
          <Link to="sumario" active={view === "home"}>{t("Capítulos", "Chapters")}</Link>
          <Link to="sobre" active={view === "sobre"}>{t("Sobre", "About")}</Link>
          <Link to="processo" active={view === "processo"}>{t("Processo", "Process")}</Link>
          <a href={CONTATO.whatsapp.href} target="_blank" rel="noreferrer"
             className="btn btn-secondary nav-contact nav-contact-m"
             onClick={() => setMenuOpen(false)}>{t("Fale comigo", "Get in touch")}</a>
        </div>
        <button type="button" className="lang-toggle" onClick={toggleLang}
                aria-label={t("Read in English", "Ler em português")} title={t("English", "Português")}>
          {t("EN", "PT")}
        </button>
        <button type="button" className={`ink-toggle ${ink ? "on" : ""}`} onClick={onInk}
                aria-pressed={!!ink} aria-label={ink ? t("Voltar ao modo papel", "Back to paper mode") : t("Ler no modo tinta", "Read in ink mode")}
                title={ink ? t("Modo papel", "Paper mode") : t("Modo tinta", "Ink mode")}>
          <span lang="ja" translate="no" aria-hidden="true">墨</span>
        </button>
        <a href={CONTATO.whatsapp.href} target="_blank" rel="noreferrer"
           className="btn btn-secondary nav-contact nav-contact-d">{t("Fale comigo", "Get in touch")}</a>
      </nav>
      <div className="v-rule"></div>
      <div className="v-volline">
        <span>{VOL}</span>
        <span className="rtl">{t("※ Leitura da direita para a esquerda", "※ Read right to left")}</span>
      </div>
    </header>
  );
}

/* ---------- [B] SPLASH / TOBIRA-E ---------- */
/* decorative hero backdrop — dashed ink curves + red dots + × register marks */
function HeroField() {
  return (
    <svg className="hero-field" viewBox="0 0 1200 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path className="hf-path" d="M-40 170 C 200 50, 410 320, 650 200 S 1050 110, 1260 250" />
      <path className="hf-red"  d="M-40 360 C 250 470, 450 170, 710 360 S 1110 490, 1290 300" />
      <path className="hf-path" d="M-40 470 C 300 360, 600 540, 900 420 S 1160 360, 1260 470" />
    </svg>
  );
}

/* rotating word — letters spring up with stagger (TextRotate-style, vanilla).
   WCAG 2.2.2: auto-cycling stops after 3 full loops, settling on the first
   (strongest) phrase; reduced-motion never cycles at all. */
function RotateWord({ items, interval = 2300, loops = 3 }) {
  const [i, setI] = useState(0);
  const ticks = useRef(0);
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      ticks.current += 1;
      if (ticks.current >= items.length * loops) { clearInterval(id); setI(0); return; }
      setI((x) => (x + 1) % items.length);
    }, interval);
    return () => clearInterval(id);
  }, [items, interval, reduced, loops]);
  const chars = [...items[i]];
  return (
    <span className="rotw">
      <span className="sr-only">{items[i]}</span>
      <span className="rotw-box" key={i} aria-hidden="true">
        {chars.map((c, idx) => (
          <span className="rotw-ch" key={idx} style={{ animationDelay: `${idx * 0.022}s` }}>{c === " " ? " " : c}</span>
        ))}
      </span>
    </span>
  );
}

function Splash({ onRead, onContact, onRapido, lit }) {
  return (
    <section className={`splash ${lit ? "lit" : ""}`}>
      <span className="hero-speedlines" aria-hidden="true"></span>
      <span className="hero-halftone" aria-hidden="true"></span>
      <HeroField />
      <span className="splash-kana" lang="ja" translate="no" aria-hidden="true">ガブリエル</span>
      <div className="shell splash-center">
        <div className="splash-id"><Seal size={20} alt="" /> {AUTOR} <i>·</i> UX / <b>Product Designer</b></div>
        <h1 className="splash-h">
          <span className="sh-line">Product <span className="sh-ghost">Designer</span></span>
          <span className="sh-line">{t("que leva", "who takes")} <RotateWord items={t(
            ["a ideia ao ar", "o protótipo ao produto", "da tela à entrega", "o design ao código"],
            ["the idea live", "the prototype to product", "the screen to shipping", "design into code"])} /></span>
        </h1>
        <p className="splash-sub">{t("Desenho, construo e publico.", "I design, build and ship.")} <span className="red">{t("Design e código", "Design and code")}</span> {t("na mesma mão.", "in the same hand.")}</p>
        <div className="splash-cta">
          <button className="btn btn-primary" onClick={onRead}>{t("Começar a ler", "Start reading")} <span className="arr">→</span></button>
          <a className="btn btn-ghost" href="#" onClick={(e) => { e.preventDefault(); onContact(); }}>{t("Fale comigo", "Get in touch")}</a>
        </div>
        {onRapido ? (
          <a className="splash-rapido" href="#/rapido" onClick={(e) => { e.preventDefault(); onRapido(); }}>
            {t("Sem tempo? O volume em 2 minutos", "In a hurry? The volume in 2 minutes")} <span className="arr" aria-hidden="true">→</span>
          </a>
        ) : null}
      </div>
      <button className="splash-scroll" onClick={onRead} aria-label={t("Rolar para ler", "Scroll to read")}>
        <span className="ss-mouse"><span className="ss-wheel"></span></span>
        <span className="ss-label">{t("Role para ler", "Scroll to read")}</span>
      </button>
    </section>
  );
}

/* ---------- [C] DIFERENCIAL — categories that filter + reveal ------- */
function Diferencial({ onPick, active }) {
  const tags = [["saas", "SaaS"], ["mobile", "Mobile"], ["desktop", "Desktop"], ["web", "Web"], ["ecommerce", "E-commerce"]];
  const byCat = (k) => PROJECTS.filter((p) => p.cat === k && !p.hidden);
  return (
    <section className="dif">
      <div className="shell">
        <div className="dif-left">
          <p className="dif-statement">
            {t("Desenho a experiência", "I design the experience")} <b>{t("e construo de verdade", "and actually build it")}</b>: {t("do protótipo navegável ao produto no ar.", "from navigable prototype to product, live.")} <span className="red">{t("Entrego o produto", "I ship the product")}</span>, {t("não só o Figma.", "not just the Figma.")}
          </p>
          <BrandStrip />
        </div>
        <div className="dif-right">
          <div className="dif-eyebrow">{t("Minhas frentes", "My fronts")}</div>
          <div className="dif-tags" role="group" aria-label={t("Filtrar o sumário por categoria", "Filter the contents by category")}>
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
          <p className="dif-hint"><span className="arr" aria-hidden="true">↓</span> {t("Toque uma categoria para filtrar o sumário", "Tap a category to filter the contents")}</p>
        </div>
      </div>
    </section>
  );
}

/* a quiet strip of real client/brand marks under the statement — instant
   credibility on the first paper fold. Marks are the brand PNGs already in
   assets/marcas; each fails soft (hidden) if the file is missing. */
function BrandMark({ id, name }) {
  const [err, setErr] = useState(false);
  const src = brandLogo(id);
  if (!src || err) return null;
  return (
    <span className="bs-chip">
      <img className="bs-logo" src={src} alt="" loading="lazy" draggable="false" onError={() => setErr(true)} />
      <span className="bs-name">{name}</span>
    </span>
  );
}
function BrandStrip() {
  const marks = [
    ["pcyes", "PCYES"], ["odex", "Odex"], ["vinik", "Vinik"],
    ["isabella", "Isabella Pires"], ["locarmais", "Locarmais"], ["tonante", "Tonante"],
  ];
  return (
    <div className="brand-strip">
      <div className="bs-k">{t("Meu design passou por", "My design has run through")}</div>
      <div className="bs-row">
        {marks.map(([id, name]) => <BrandMark key={id} id={id} name={name} />)}
      </div>
    </div>
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
    opacity: hidden ? 0 : (focused || hovered ? 1 : Math.max(0.18, 1 - dist * 0.4)),
    filter: focused ? "none" : `grayscale(${hovered ? 0 : 1}) blur(${hovered ? 0 : Math.min(5, dist * 3.5)}px)`,
    zIndex: focused ? 100 : (hovered ? 90 : 80 - dist),
    pointerEvents: hidden ? "none" : "auto",
  };
  return (
    <button type="button" className={`rail-cover ${focused ? "focus" : "side"} ${hovered && !focused ? "hot" : ""}`}
            style={style} onClick={onClick}
            onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}
            tabIndex={focused ? 0 : -1} aria-hidden={focused ? undefined : true}
            aria-label={focused ? t(`Abrir ${proj.title}`, `Open ${proj.title}`) : t(`Focar ${proj.title}`, `Focus ${proj.title}`)}>
      <span className="rc-head">
        <span className="rc-vol">{projTag(proj)}</span>
        <span className="rc-cat">{proj.domain}</span>
      </span>
      <span className="rc-art">{proj.cover ? <img className="rc-cover" src={proj.cover} alt="" loading="lazy" draggable="false" /> : <MangaPlate />}{(focused || hovered) ? <span className="rc-sl"></span> : null}{proj.fav ? <span className="rc-fav">{t("Favorito", "Favorite")}</span> : null}</span>
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
         onPointerDown={onDown} onPointerUp={onUp} role="group" aria-label={t("Navegador de projetos", "Project navigator")}>
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
        <div className="rail-info" key={activeItem.id} aria-live="polite">
          <div className="ri-cat">{activeItem.fav ? <span className="ri-fav">◆ {t("Favorito", "Favorite")}</span> : null}{projTag(activeItem)} · {activeItem.domain}</div>
          <div className="ri-title">{activeItem.title}</div>
          {projDescriptor(activeItem)
            ? <div className="ri-desc">{projDescriptor(activeItem)}</div>
            : <div className="ri-desc dim">{t("Protótipo navegável + Figma · links a preencher", "Navigable prototype + Figma · links to fill")}</div>}
        </div>
        <div className="rail-ctrls">
          <div className="rail-nav">
            <button type="button" className="rail-arr" onClick={() => go(-1)} disabled={count < 2} aria-label={t("Anterior", "Previous")}>←</button>
            <span className="rail-idx">{String(active + 1).padStart(2, "0")} <i>/</i> {String(count).padStart(2, "0")}</span>
            <button type="button" className="rail-arr" onClick={() => go(1)} disabled={count < 2} aria-label={t("Próximo", "Next")}>→</button>
          </div>
          <button type="button" className="btn btn-primary rail-open" onClick={() => select(activeItem)}>
            {isChapter ? t("Ler capítulo", "Read chapter") : t("Ver projeto", "See project")} <span className="arr">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* viewport hook — switch coverflow (desktop) ↔ vertical list (mobile) */
function useIsMobile(bp = 760) {
  const q = `(max-width: ${bp}px)`;
  const [m, setM] = useState(window.matchMedia && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [q]);
  return m;
}

/* mobile: a plain vertical list of project cards — scrolls with the page,
   real list semantics, keyboard/screen-reader friendly (no coverflow) */
function ProjectList({ items, onOpen }) {
  return (
    <ul className="proj-list">
      {items.map((p) => {
        const isChapter = !!p.chapterId;
        return (
          <li key={p.id}>
            <button type="button" className="proj-card" onClick={() => onOpen(p.id)}>
              <span className="pc-art">
                {p.cover ? <img src={p.cover} alt="" loading="lazy" draggable="false" /> : <MangaPlate />}
                {p.fav ? <span className="pc-fav">Favorito</span> : null}
              </span>
              <span className="pc-meta">
                <span className="pc-tag">{projTag(p)} · {p.domain}</span>
                <span className="pc-title">{p.title}</span>
                <span className="pc-go">{isChapter ? t("Ler capítulo", "Read chapter") : t("Ver projeto", "See project")} <span className="arr" aria-hidden="true">→</span></span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function FilterBar({ filter, setFilter }) {
  return (
    <div className="vol-filter" role="group" aria-label={t("Categorias", "Categories")}>
      {CATS.map((c) => (
        <button type="button" key={c.key} aria-pressed={filter === c.key}
                className={`vf-tab ${filter === c.key ? "on" : ""}`}
                onClick={() => setFilter(c.key)}>{c.label}</button>
      ))}
    </div>
  );
}

function Sumario({ onOpen, filter, setFilter }) {
  const mobile = useIsMobile();
  const shown = PROJECTS.filter((p) => !p.hidden);
  const items = filter === "todos" ? shown : shown.filter((p) => p.cat === filter);
  return (
    <section className="shell" style={{ paddingTop: "var(--ma-6)" }}>
      <div className="sec-head" id="sumario">
        <Brush as="h2">{t("Sumário", "Contents")}</Brush>
        <span className="kicker">{String(items.length).padStart(2, "0")} {items.length === 1 ? t("projeto", "project") : t("projetos", "projects")}{mobile ? "" : t(" · ※ arraste ou use ← →", " · ※ drag or use ← →")}</span>
      </div>
      <FilterBar filter={filter} setFilter={setFilter} />
      {mobile
        ? <ProjectList items={items} onOpen={onOpen} />
        : <FocusRail key={filter} items={items} onOpen={onOpen} />}
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
          <div className="qk">{t("Quem sou", "Who I am")}</div>
          <p className="qs-bio">{t("UX/Product Designer. Larguei o Direito quando descobri que dava pra desenhar e construir produto de verdade. Leio mangá desde criança, e levo cada projeto do protótipo ao ar.", "UX/Product Designer. I left law behind when I found out I could design and build real product. I've read manga since I was a kid, and I take every project from prototype to live.")}</p>
          <a className="btn btn-ghost gl" href="#" onClick={(e) => { e.preventDefault(); onSobre(); }}>{t("Ver posfácio", "Read the afterword")} <span className="arr">→</span></a>
        </div>

        <div className="qs-company">
          <div className="qsc-head">
            <span className="qsc-k">{c.atual ? <span className="qsc-now">{t("Empresa atual", "Current company")}</span> : <span>{t("Já passei por", "I've worked at")}</span>}</span>
            <div className="qsc-nav">
              <button type="button" className="qsc-arr" aria-label={t("Empresa anterior", "Previous company")} onClick={() => move(-1)}>←</button>
              <span className="qsc-idx">{String(ci + 1).padStart(2, "0")} <i>/</i> {String(COMPANIES.length).padStart(2, "0")}</span>
              <button type="button" className="qsc-arr" aria-label={t("Próxima empresa", "Next company")} onClick={() => move(1)}>→</button>
            </div>
          </div>
          <button type="button" className="qsc-card" onClick={() => onEmpresa(c.id)} aria-label={t(`Ver minha história na ${c.name}`, `See my story at ${c.name}`)}>
            <span className="qsc-logo"><CompanyLogo company={c} kind="qsc" /></span>
            <span className="qsc-body">
              <span className="qsc-name">{c.name}</span>
              <span className="qsc-role">{c.role}</span>
              <span className="qsc-go">{t("Ver minha história", "See my story")} <span className="arr" aria-hidden="true">→</span></span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------- [F] COLOFÃO / CONTATO (shared footer) ---------- */
function Colofao({ onContact, onNav }) {
  const navTo = (e, to) => { e.preventDefault(); if (onNav) onNav(to); };
  return (
    <footer className="v-foot" id="fim">
      <div className="shell">
        {onNav && (
          <nav className="foot-nav" aria-label={t("Navegação do rodapé", "Footer navigation")}>
            <a href="#" onClick={(e) => navTo(e, "home")}>{t("Início", "Home")}</a>
            <a href="#" onClick={(e) => navTo(e, "sumario")}>{t("Projetos", "Projects")}</a>
            <a href="#" onClick={(e) => navTo(e, "processo")}>{t("Processo", "Process")}</a>
            <a href="#" onClick={(e) => navTo(e, "sobre")}>{t("Sobre", "About")}</a>
          </nav>
        )}
        <div className="foot-top">
          <h2 className="foot-cta">{t("Vamos abrir", "Let's open")}<br /><a href={CONTATO.whatsapp.href} target="_blank" rel="noreferrer">{t("o próximo capítulo", "the next chapter")}</a>.</h2>
          <div className="foot-meta">
            <div className="row"><span className="kicker" style={{ color: "var(--wash-2)" }}>{t("Disponível para freela & full-time", "Available for freelance & full-time")}</span></div>
            <div className="row" style={{ marginTop: 4 }}>
              <a className="btn btn-primary" href={CONTATO.whatsapp.href} target="_blank" rel="noreferrer"
                 style={{ padding: "11px 20px", fontSize: 14 }}>{t("Fale comigo", "Get in touch")} <span className="arr">→</span></a>
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
function Capa({ onOpen, onContact, onSobre, onEmpresa, onRead, lit, filter, setFilter, onNav, onRapido }) {
  const pick = (cat) => { setFilter(cat); onRead(); };
  return (
    <main className="home-main" key="home">
      <Splash onRead={onRead} onContact={onContact} onRapido={onRapido} lit={lit} />
      <div className="post-hero">
        <Diferencial onPick={pick} active={filter === "todos" ? null : filter} />
        <Sumario onOpen={onOpen} filter={filter} setFilter={setFilter} />
        <QuemSou onSobre={onSobre} onEmpresa={onEmpresa} />
        <Colofao onContact={onContact} onNav={onNav} />
      </div>
    </main>
  );
}

Object.assign(window, { Nav, Splash, Diferencial, Sumario, FocusRail, RailCover, FilterBar, QuemSou, Colofao, Capa });
