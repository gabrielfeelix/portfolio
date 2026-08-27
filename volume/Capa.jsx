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
             onClick={() => setMenuOpen(false)}>{t("Bora conversar", "Let's talk")}</a>
        </div>
        <button type="button" className="btn btn-secondary btn-sm lang-toggle" onClick={toggleLang}
                aria-label={t("Read in English", "Ler em português")} title={t("English", "Português")}>
          {t("EN", "PT")}
        </button>
        <button type="button" className={`btn btn-secondary btn-sm ink-toggle ${ink ? "on" : ""}`} onClick={onInk}
                aria-pressed={!!ink} aria-label={ink ? t("Voltar ao modo papel", "Back to paper mode") : t("Ler no modo tinta", "Read in ink mode")}
                title={ink ? t("Modo papel", "Paper mode") : t("Modo tinta", "Ink mode")}>
          <span lang="ja" translate="no" aria-hidden="true">墨</span>
        </button>
        <a href={CONTATO.whatsapp.href} target="_blank" rel="noreferrer"
           className="btn btn-secondary nav-contact nav-contact-d">{t("Bora conversar", "Let's talk")}</a>
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
  // `from` is the outgoing phrase. It stays painted (absolutely, so it never
  // widens the box) while the incoming one springs up: the red box is never
  // empty mid-swap. `from === null` is the first paint — no animation at
  // all, so the very first frame already carries text.
  const [{ i, from }, setPos] = useState({ i: 0, from: null });
  const ticks = useRef(0);
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      ticks.current += 1;
      if (ticks.current >= items.length * loops) { clearInterval(id); setPos((s) => ({ i: 0, from: s.i })); return; }
      setPos((s) => ({ i: (s.i + 1) % items.length, from: s.i }));
    }, interval);
    return () => clearInterval(id);
  }, [items, interval, reduced, loops]);
  const chars = [...items[i]];
  const moving = from !== null && from !== i;
  return (
    <span className="rotw">
      <span className="sr-only">{items[i]}</span>
      <span className="rotw-box" aria-hidden="true">
        {moving ? <span className="rotw-out" key={`o${from}-${i}`}>{items[from]}</span> : null}
        <span className={`rotw-word ${moving ? "anim" : ""}`} key={i}>
          {chars.map((c, idx) => (
            <span className="rotw-ch" key={idx} style={{ animationDelay: `${idx * 0.022}s` }}>{c === " " ? " " : c}</span>
          ))}
        </span>
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
          <a className="btn btn-ghost" href="#" onClick={(e) => { e.preventDefault(); onContact(); }}>{t("Bora conversar", "Let's talk")}</a>
        </div>
        {onRapido ? (
          <a className="splash-rapido" href="#/rapido" onClick={(e) => { e.preventDefault(); onRapido(); }}>
            {t("Sem tempo? O volume em 2 minutos", "In a hurry? The volume in 2 minutes")} <span className="arr" aria-hidden="true">→</span>
          </a>
        ) : null}
      </div>
      {/* terceira chamada do hero: fica, mas com peso de dica — o botão
          primário e o atalho de 2 minutos carregam a navegação */}
      <button className="splash-scroll quiet" onClick={onRead} aria-label={t("Rolar para ler", "Scroll to read")}>
        <span className="ss-mouse"><span className="ss-wheel"></span></span>
        <span className="ss-label">{t("Role para ler", "Scroll to read")}</span>
      </button>
    </section>
  );
}

/* ---------- [C] DIFERENCIAL — a frase + a faixa de marcas ----------
   A lista "Minhas frentes" saiu daqui: navegação por categoria pertence
   a Outras peças, junto do que ela filtra. O lado direito agora carrega
   a prova social — toda empresa e cliente por onde o design passou. */

/* uma marca: logo real quando o arquivo existe, wordmark quando não.
   Sempre monocromática — cor no volume é intenção, não decoração. */
function Mark({ mark }) {
  const [err, setErr] = useState(false);
  const showLogo = mark.logo && !err;
  return (
    <span className={`mk ${showLogo ? "has-logo" : "is-word"}`} title={mark.name}>
      {showLogo
        ? <img className="mk-logo" src={mark.logo} alt={mark.name} loading="lazy" draggable="false" onError={() => setErr(true)} />
        : <span className="mk-word">{mark.name}</span>}
    </span>
  );
}

/* The strip runs as a slow, continuous marquee: 16 marks never fit two
   tidy rows at every width. The track is duplicated so the loop is
   seamless; reduced-motion drops the animation and wraps into a grid,
   losing nothing. Hover pauses it so a name can actually be read. */
function MarkStrip() {
  const marks = ALL_MARKS;
  return (
    <div className="mkstrip">
      <div className="mk-k">{t("Meu design passou por", "My design has run through")}</div>
      <div className="mk-viewport">
        <div className="mk-track">
          {marks.map((m) => <Mark key={m.id} mark={m} />)}
          <span className="mk-dup">{marks.map((m) => <Mark key={m.id + "-b"} mark={m} />)}</span>
        </div>
      </div>
    </div>
  );
}

function Diferencial() {
  return (
    <section className="dif">
      <div className="shell">
        <div className="dif-left">
          <p className="dif-statement">
            {t("Desenho a experiência", "I design the experience")} <b>{t("e construo de verdade", "and actually build it")}</b>: {t("do protótipo navegável ao produto no ar.", "from navigable prototype to product, live.")} <span className="red">{t("Entrego o produto", "I ship the product")}</span>, {t("não só o Figma.", "not just the Figma.")}
          </p>
        </div>
        <div className="dif-right">
          <MarkStrip />
        </div>
      </div>
    </section>
  );
}

/* ---------- [D] SUMÁRIO — 4 capítulos + o extra, em lista ----------
   O coverflow saiu: capa em perspectiva com blur nas laterais escondia
   três quartos do que devia vender. Agora cada capítulo ocupa um bloco
   largo, com capa grande, contexto e resultado legíveis de primeira. */

function ChapterBlock({ proj, chap, onOpen }) {
  const contexto = (chap && chap.descriptor) || proj.domain;
  const resultado = chap && chap.tldr ? chap.tldr.resultado : "";
  return (
    <li className="chapline">
      <button type="button" className="cl-btn" onClick={() => onOpen(proj.id)}
              aria-label={t(`Ler ${proj.title}`, `Read ${proj.title}`)}>
        <span className="cl-art">
          {proj.cover
            ? <img className="cl-img" src={proj.cover} alt="" loading="lazy" draggable="false" />
            : <MangaPlate />}
          <span className="cl-cap">{projTag(proj)}</span>
        </span>
        <span className="cl-copy">
          <span className="cl-dom">{proj.domain}</span>
          <span className="cl-t">{proj.title}</span>
          <span className="cl-ctx">{renderPH(contexto)}</span>
          <span className="cl-res"><i>{t("Resultado", "Result")}</i> {renderPH(resultado)}</span>
          <span className="cl-go">{t("Ler o capítulo", "Read the chapter")} <span className="arr" aria-hidden="true">→</span></span>
        </span>
      </button>
    </li>
  );
}

function ChapterList({ onOpen }) {
  const items = caseProjects();
  return (
    <ol className="chaplist">
      {items.map((p) => (
        <ChapterBlock key={p.id} proj={p} chap={chapterFor(p.id)} onOpen={onOpen} />
      ))}
    </ol>
  );
}

/* the category nav that used to sit in "Minhas frentes". It filters the
   Outras peças index only — the chapters are the spine and never move. */
function CatNav({ filter, setFilter, items }) {
  const byCat = (k) => (k === "todos" ? items : items.filter((p) => p.cat === k));
  return (
    <div className="catnav" role="group" aria-label={t("Filtrar as outras peças por categoria", "Filter the other pieces by category")}>
      {CATS.map((c) => {
        const list = byCat(c.key);
        const a = list[0], b = list[1] || list[0];
        const on = filter === c.key;
        return (
          <button type="button" key={c.key} className={`cat-tag ${on ? "on" : ""}`} aria-pressed={on}
                  disabled={!list.length}
                  onClick={() => setFilter(on && c.key !== "todos" ? "todos" : c.key)}>
            <span className="ct-label">{c.label}</span>
            <span className="ct-count" aria-hidden="true">{String(list.length).padStart(2, "0")}</span>
            <span className="ct-dot" aria-hidden="true"></span>
            {a ? (
              <span className="cat-reveal" aria-hidden="true">
                <span className="pic back"><span className="pic-tone"></span><span className="pic-name">{b.title}</span></span>
                <span className="pic front"><span className="pic-tone"></span><span className="pic-name">{a.title}</span></span>
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- 目次 · Outras peças ----------
   The manga index page: dotted leaders and page numbers. These don't open
   a case — they link out to the thing itself when it's on the air. */
function catLabel(key) {
  const c = CATS.find((x) => x.key === key);
  return c ? c.label : key;
}

function OutrasPecas({ filter, setFilter }) {
  const all = pieceProjects();
  const items = filter === "todos" ? all : all.filter((p) => p.cat === filter);
  // A pagina e a identidade da peca no volume, entao ela sai da posicao na
  // lista COMPLETA. Numerar pelo indice da lista filtrada reiniciava em 008
  // a cada categoria e dava a mesma pagina para pecas diferentes.
  const pagina = new Map(all.map((p, i) => [p.id, String(8 + i * 14).padStart(3, "0")]));
  return (
    <section className="outras" id="outras">
      <div className="sec-head">
        <Brush as="h2" style={{ fontSize: "var(--t-d2)" }}>{t("Outras peças", "Other pieces")}</Brush>
        <span className="kicker">{String(items.length).padStart(2, "0")} {items.length === 1 ? t("peça", "piece") : t("peças", "pieces")}</span>
      </div>
      <CatNav filter={filter} setFilter={setFilter} items={all} />
      <nav className="mokuji" aria-label={t("Índice de outras peças", "Index of other pieces")}>
        <div className="mo-head">
          <span className="mo-kanji" lang="ja" translate="no" aria-hidden="true">目次</span>
          <span className="kicker">{t("Cada item leva direto ao trabalho publicado", "Each item goes straight to the published work")}</span>
        </div>
        <ol className="mo-list">
          {items.map((p) => {
            const live = pieceLink(p);
            const dest = p.destino || "ar";
            return (
              <li className="mo-item" key={p.id}>
                <a className="mo-row" href={live} target="_blank" rel="noreferrer">
                  <span className="mo-top">
                    <span className="mo-cap">{catLabel(p.cat)}</span>
                    <span className="mo-title">{p.title}</span>
                    <span className="mo-dots" aria-hidden="true"></span>
                    <span className={`mo-destino is-${dest}`}>
                      {dest === "proto" ? t("Protótipo", "Prototype") : dest === "figma" ? "Figma" : t("No ar", "Live")}
                      <span className="ext" aria-hidden="true">↗</span>
                    </span>
                    <span className="mo-page">p. {pagina.get(p.id)}</span>
                  </span>
                  {p.desc ? <span className="mo-desc">{p.desc}</span> : null}
                </a>
              </li>
            );
          })}
        </ol>
        {items.length === 0
          ? <p className="mo-empty">{t("Nada nessa categoria ainda.", "Nothing in this category yet.")}</p>
          : null}
      </nav>
    </section>
  );
}

function Sumario({ onOpen, filter, setFilter }) {
  const n = caseProjects().length;
  return (
    <>
      {/* a cabeça continua na medida do texto (.shell, 1240px) */}
      <section className="shell sumario-sec" style={{ paddingTop: "var(--ma-6)" }}>
        <div className="sec-head" id="sumario">
          <Brush as="h2">{t("Sumário", "Contents")}</Brush>
          <span className="kicker">{String(n).padStart(2, "0")} {n === 1 ? t("capítulo", "chapter") : t("capítulos", "chapters")}</span>
        </div>
      </section>

      {/* os capítulos saem da .shell pra tomar a tela inteira. Fora do
          container é de propósito: sangria de verdade, sem o truque de
          margin negativa com 100vw (que abre scroll horizontal quando a
          barra de rolagem ocupa espaço, o caso do Windows). */}
      <RevealChapters onOpen={onOpen} />

      <section className="shell">
        <OutrasPecas filter={filter} setFilter={setFilter} />
      </section>
    </>
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
            <span className="qsc-logo">
              {c.capa ? <BrandPlate capa={c.capa} className="bp-qsc" /> : <CompanyLogo company={c} kind="qsc" />}
            </span>
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
            <a href="#" onClick={(e) => navTo(e, "sumario")}>{t("Capítulos", "Chapters")}</a>
            <a href="#" onClick={(e) => navTo(e, "processo")}>{t("Processo", "Process")}</a>
            <a href="#" onClick={(e) => navTo(e, "sobre")}>{t("Sobre", "About")}</a>
          </nav>
        )}
        <div className="foot-top">
          <h2 className="foot-cta">{t("Vamos abrir", "Let's open")}<br /><a href={CONTATO.whatsapp.href} target="_blank" rel="noreferrer">{t("o próximo capítulo", "the next chapter")}</a>.</h2>
          <div className="foot-meta">
            <div className="row">
              <a className="btn btn-primary" href={CONTATO.whatsapp.href} target="_blank" rel="noreferrer"
                 style={{ padding: "11px 20px", fontSize: 14 }}>{t("Bora conversar", "Let's talk")} <span className="arr">→</span></a>
            </div>
            <div className="row" style={{ marginTop: 10, gap: 18, flexWrap: "wrap" }}>
              <a className="s" href={CONTATO.whatsapp.href} target="_blank" rel="noreferrer">WhatsApp · {CONTATO.whatsapp.display}</a>
              <a className="s" href={CONTATO.linkedin.href} target="_blank" rel="noreferrer">LinkedIn</a>
              <a className="s" href={CONTATO.instagram.href} target="_blank" rel="noreferrer">Instagram</a>
              <a className="s" href={CONTATO.email.href}>{CONTATO.email.display}</a>
            </div>
          </div>
        </div>
        <div className="foot-bottom">
          {/* Metadado de praça, não anúncio de disponibilidade: quem procura
              filtra por localização antes de ler, e "aberto a remoto" diz
              onde o trabalho pode acontecer sem dizer nada sobre o emprego
              atual. Anunciar disponibilidade num portfólio público que
              estampa o empregador atual seria risco sem ganho. */}
          <span>{AUTOR} · {VOL} · {t("Maringá, PR · Aberto a remoto", "Maringá, Brazil · Open to remote")}</span>
          <Seal size={34} alt="Selo de Gabriel" />
        </div>
      </div>
    </footer>
  );
}

/* ---------- the assembled cover ---------- */
function Capa({ onOpen, onContact, onSobre, onEmpresa, onRead, lit, filter, setFilter, onNav, onRapido }) {
  return (
    <main className="home-main" key="home">
      <Splash onRead={onRead} onContact={onContact} onRapido={onRapido} lit={lit} />
      <div className="post-hero">
        <Diferencial />
        <Sumario onOpen={onOpen} filter={filter} setFilter={setFilter} />
        <QuemSou onSobre={onSobre} onEmpresa={onEmpresa} />
        <Colofao onContact={onContact} onNav={onNav} />
      </div>
    </main>
  );
}

Object.assign(window, { Nav, Splash, Diferencial, Mark, MarkStrip, Sumario, ChapterList, ChapterBlock, CatNav, OutrasPecas, QuemSou, Colofao, Capa });
