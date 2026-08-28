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
      /* a capa do capítulo é tobira de tela cheia igual à da home, então a
         navbar nasce escondida nas duas e só aparece depois da abertura */
      const emCapa = view === "home" || !!(typeof chapterFor === "function" && chapterFor(view));
      setOverHero(emCapa && y < window.innerHeight * 0.82);
      if (Math.abs(y - last) >= 6) { setHidden(y > last && y > 90); last = y; }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [view]);

  // floating centered pill on EVERY view (consistent). On home it stays hidden
  // while sitting over the red cover, then appears once past it. Hides on
  // scroll-down, returns on scroll-up.
  const headerCls = overHero ? "hd-hidden"
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
  const boxRef = useRef(null);
  const wordRef = useRef(null);
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

  /* A caixa nunca decide a própria largura: a palavra que entra é medida e
     a largura vai escrita no estilo, e o CSS transiciona entre uma e outra.
     Deixada em `auto`, a largura ESTALAVA a cada troca e, pior, mudava onde
     a linha quebra — o hero pulava de duas para três linhas conforme a
     palavra. A fonte é fluida (vw) e o carregamento da webfont troca a
     métrica depois da primeira pintura, então remede no resize e no
     `fonts.ready` — medida uma vez só, envelhece nos dois casos. */
  useLayoutEffect(() => {
    const box = boxRef.current, word = wordRef.current;
    if (!box || !word) return;
    const mede = () => {
      const cs = getComputedStyle(box);
      const pad = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
      box.style.inlineSize = (word.getBoundingClientRect().width + pad).toFixed(1) + "px";
    };
    mede();
    window.addEventListener("resize", mede);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(mede).catch(() => {});
    return () => window.removeEventListener("resize", mede);
  }, [i]);

  const chars = [...items[i]];
  const moving = from !== null && from !== i;
  return (
    <span className="rotw">
      <span className="sr-only">{items[i]}</span>
      <span className="rotw-box" aria-hidden="true" ref={boxRef}>
        {moving ? <span className="rotw-out" key={`o${from}-${i}`}>{items[from]}</span> : null}
        <span className={`rotw-word ${moving ? "anim" : ""}`} key={i} ref={wordRef}>
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
          <span className="sh-line sh-line-rot">{t("que leva", "who takes")} <RotateWord items={t(
            ["a ideia ao ar", "o protótipo ao produto", "da tela à entrega", "o design ao código"],
            ["the idea live", "the prototype to product", "the screen to shipping", "design into code"])} /></span>
        </h1>
        <p className="splash-sub">{t("Desenho, construo e publico.", "I design, build and ship.")} <span className="red">{t("Design e código", "Design and code")}</span> {t("na mesma mão.", "in the same hand.")}</p>
        <div className="splash-cta">
          <button className="btn btn-primary" onClick={onRead}>{t("Começar a ler", "Start reading")} <span className="arr">→</span></button>
          <a className="btn btn-ghost" href="#" onClick={(e) => { e.preventDefault(); onContact(); }}>{t("Bora conversar", "Let's talk")}</a>
        </div>
      </div>
      {/* O atalho "Sem tempo? O volume em 2 minutos" saiu daqui a pedido
          do Gabriel: era a QUARTA chamada da mesma tela (ler, conversar,
          2 minutos, rolar) e a única que pedia desculpa pelo próprio
          volume. A rota `#/rapido` continua viva e continua sendo
          gerada — só não tem mais porta na capa. */}
      <button className="splash-scroll quiet" onClick={onRead} aria-label={t("Rolar para ler", "Scroll to read")}>
        <span className="ss-mouse"><span className="ss-wheel"></span></span>
        <span className="ss-label">{t("Role para ler", "Scroll to read")}</span>
      </button>
    </section>
  );
}

/* ---------- A DENTADURA — a capa sendo engolida --------------------
   A versao anterior era um bloco de quadrados desenhados, parados, com
   borda: lia como grafico de barras. Isto aqui e' o efeito de verdade —
   colunas de PAPEL, sem borda, que sobem coladas no scroll e comem a capa
   vermelha de baixo pra cima.

   Cada coluna tem um fator proprio, entao elas nao sobem juntas: o perfil
   irregular nasce do movimento, nao de alturas fixas no CSS. Uma sobe bem
   mais que as vizinhas (1.5), outra fica pra tras (.64), e o recorte muda
   o tempo todo enquanto se rola.

   rAF + listener passivo: o scroll nunca faz layout, so' escreve transform. */
/* Perfil SIMÉTRICO com o dente do meio esticado: a coluna central sobe mais
   que o dobro das das pontas, e o desenho decresce parelho para os dois
   lados. O perfil antigo era irregular (1.28, .82, 1.5, .64, ...) e lia como
   serrilha aleatória; simétrico ele lê como uma mordida só, com centro. */
const BITE_FATORES = [0.58, 0.84, 1.20, 1.68, 1.20, 0.84, 0.58];

/* quanto de cada quadro a coluna caminha em direção ao alvo. Menor = mais
   preguiçoso. A do meio é a mais lenta de propósito: ela chega por último e
   é esse atraso que dá o elástico. */
const BITE_LERP  = [0.115, 0.100, 0.086, 0.068, 0.086, 0.100, 0.115];

function Bite() {
  const ref = useRef(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const cols = Array.prototype.slice.call(host.children);
    const reduz = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduz) return;

    /* A posição de cada coluna NÃO é escrita direto do scroll: o scroll define
       um ALVO e a coluna caminha até ele um pouco por quadro. É esse atraso
       que dá o peso, e como cada coluna tem a sua velocidade, elas chegam em
       tempos diferentes e a mordida se forma em vez de saltar pronta. */
    const alvo  = new Array(cols.length).fill(100);
    const atual = new Array(cols.length).fill(100);
    let raf = 0;

    const medeAlvo = () => {
      const vh = window.innerHeight || 1;
      /* A mordida comeca quase junto com a rolagem (12% da primeira tela) e
         se estende ate' quase o fim dela. Comecando so' na metade, o efeito
         aparecia tarde demais: o leitor ja' tinha passado por ele. */
      const p = Math.min(1, Math.max(0, (window.scrollY - vh * 0.12) / (vh * 0.76)));
      for (let i = 0; i < cols.length; i++) {
        const f = BITE_FATORES[i % BITE_FATORES.length];
        alvo[i] = Math.max(0, 100 - p * f * 100);
      }
    };

    const quadro = () => {
      raf = 0;
      let anda = false;
      for (let i = 0; i < cols.length; i++) {
        const k = BITE_LERP[i % BITE_LERP.length];
        const d = alvo[i] - atual[i];
        /* 0.02% é meio pixel em qualquer altura que a faixa tenha: abaixo
           disso a coluna já chegou e o laço pode parar, senão o rAF ficaria
           rodando para sempre atrás de um resto infinitesimal. */
        if (Math.abs(d) < 0.02) { atual[i] = alvo[i]; }
        else { atual[i] += d * k; anda = true; }
        cols[i].style.transform = "translateY(" + atual[i].toFixed(3) + "%)";
      }
      if (anda) raf = requestAnimationFrame(quadro);
    };

    const acorda = () => { if (!raf) raf = requestAnimationFrame(quadro); };
    const onScroll = () => { medeAlvo(); acorda(); };

    /* na primeira pintura a coluna assume o alvo sem caminhar: quem chega a
       meio da página não deve ver a mordida se montando do zero */
    medeAlvo();
    for (let i = 0; i < cols.length; i++) {
      atual[i] = alvo[i];
      cols[i].style.transform = "translateY(" + atual[i].toFixed(3) + "%)";
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="bite" ref={ref} aria-hidden="true">
      {[0, 1, 2, 3, 4, 5, 6].map((n) => <span className="bite-t" key={n}></span>)}
    </div>
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
    <section className="dif tem-fundo">
      <Fundo kanji="実績" lado="dir" />
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

/* ---------- 目次 · Outras peças ----------
   O índice virou livro: uma peça por página, com o índice inteiro a um
   clique. Nenhuma delas abre caso — todas levam ao trabalho publicado. */
/* catLabel mudou pra data.jsx: o livro das peças (BookSlider) carrega
   antes de Capa e precisa dele, e CATS ja' mora la. */

function OutrasPecas() {
  const all = pieceProjects();
  return (
        <section className="outras" id="outras">
      <div className="sec-head">
        <Brush as="h2" style={{ fontSize: "var(--t-d2)" }}>{t("Outros projetos", "Other projects")}</Brush>
        <span className="kicker">{String(all.length).padStart(2, "0")} {all.length === 1 ? t("projeto", "project") : t("projetos", "projects")}</span>
      </div>
      <p className="mo-desc" style={{ maxWidth: "52ch", marginBottom: "var(--ma-3)" }}>
        {t("Dois projetos por vez, um em cada página. A folha vira da esquerda para a direita, como se folheia mangá. Quem tem pressa abre o índice inteiro de uma vez.",
           "Two projects at a time, one per page. The leaf turns left to right, the way manga is flipped. In a hurry, open the whole index at once.")}
      </p>
      <BookSlider items={all} />
    </section>
  );
}

/* ---------- O FUNDO DO VOLUME --------------------------------------
   A home lia como bloco branco encostado em bloco branco: cada seção um
   retângulo, empilhado no anterior, sem nada costurando um no outro.

   Quatro fundos foram construídos e postos lado a lado num seletor para
   decidir no olho (kanji, retícula, speedlines, grão). Venceu o kanji, e
   os outros três saíram junto com o seletor.

   Cada seção carrega uma palavra japonesa gigante, cortada pela borda,
   alternando de lado para a página não virar padrão. A palavra é sempre
   a da seção, não enfeite: 実績 é histórico, 目次 é sumário, 自己 é o
   próprio, 現在 é o agora. O rodapé fica de fora porque já tem retícula.

   É `--wash-1` sobre papel, sem interação e sem foco: `aria-hidden` e
   `pointer-events: none`. Não encosta em contraste de texto. */
function Fundo({ kanji, lado = "dir" }) {
  return (
    <span className={"fundo fundo-" + lado} aria-hidden="true">
      <span className="fundo-k" lang="ja" translate="no">{kanji}</span>
    </span>
  );
}

function Sumario({ onOpen }) {
  const casos = caseProjects();
  const n = casos.length;
  const noAr = casos.filter((p) => p.links && (p.links.vercel || p.links.play)).length;
  const outras = pieceProjects().length;
  return (
    <div className="sum-zone tem-fundo">
      <Fundo kanji="目次" lado="esq" />

      {/* A cabeça era um par: título à esquerda, kicker à direita, na
          régua da página. Virou bloco centrado, que é o que segura o
          baralho embaixo: o leque abre no eixo do título em vez de brotar
          debaixo de um cabeçalho alinhado num canto.

          Os três números são CONTADOS, não escritos: capítulo, quantos
          estão no ar e quantas peças sobram no índice. Número escrito à
          mão aqui envelhece na primeira peça nova. */}
      <section className="shell sum-head" id="sumario">
        <span className="sh-kick">{t("Sumário", "Contents")}</span>
        <Brush as="h2" className="sh-title">
          {t("O volume em cinco capítulos", "The volume in five chapters")}
        </Brush>
        <p className="sh-sub">
          {t("Cada capítulo é um produto que foi ao ar: o problema, o que eu decidi e o que mudou depois. O primeiro é o mais longo de propósito.",
             "Each chapter is a product that shipped: the problem, what I decided, and what changed after. The first one is the longest on purpose.")}
        </p>
        <ul className="sh-meta">
          <li><b>{String(n).padStart(2, "0")}</b> {n === 1 ? t("capítulo", "chapter") : t("capítulos", "chapters")}</li>
          <li><b>{String(noAr).padStart(2, "0")}</b> {t("no ar", "live")}</li>
          <li><b>{String(outras).padStart(2, "0")}</b> {t("outras peças", "other pieces")}</li>
        </ul>
      </section>

      {/* os capítulos saem da .shell pra tomar a tela inteira. Fora do
          container é de propósito: sangria de verdade, sem o truque de
          margin negativa com 100vw (que abre scroll horizontal quando a
          barra de rolagem ocupa espaço, o caso do Windows). */}
      <RevealChapters onOpen={onOpen} />

      <section className="shell">
        <OutrasPecas />
      </section>
    </div>
  );
}

/* ---------- [E] QUEM SOU ---------- */
/* ---------- [E] QUEM SOU ----------
   Era uma seção só, em três colunas: bio à esquerda, retrato no meio e o
   card de empresa à direita, com setinha pra trocar de empresa. O retrato
   ficava pequeno, o texto ficava pequeno e a empresa atual, que é a
   informação mais forte da página, entrava como um card de canto.

   Agora são duas seções. A primeira é sobre a pessoa, em duas colunas
   largas, com o retrato grande e o texto em corpo de leitura. A segunda é
   sobre onde ele está hoje, com a marca em chapa cheia e a trajetória
   inteira logo abaixo, sem carrossel: as três empresas ficam visíveis de
   uma vez, que era o que o par de setas escondia. ---------------------- */
function QuemSou({ onSobre }) {
  const [ref, visto] = useReveal({ threshold: 0.22 });
  const noAr = PROJECTS.filter((p) => p.links && (p.links.vercel || p.links.play)).length;
  /* Os numeros saem de PROJECTS, contados na hora. Numero escrito na mao
     envelhece e mente sozinho quando um projeto entra; contado, ele se
     corrige. */
  const nums = [
    { n: "+2", l: t("Anos na área", "Years in the field") },
    { n: String(PROJECTS.length), l: t("Projetos", "Projects") },
    { n: String(noAr), l: t("No ar", "Live") },
  ];
  return (
    <section className={"quemsou tem-fundo" + (visto ? " on" : "")} ref={ref} style={{ marginTop: "var(--ma-6)" }}>
      <Fundo kanji="自己" lado="dir" />
      <div className="shell qs-grid">
        <div className="qs-left">
          <div className="qk">{t("Quem sou", "Who I am")}</div>
          <p className="qs-bio">
            {t("UX/Product Designer. Larguei o Direito quando descobri que dava pra desenhar e construir produto de verdade.",
               "UX/Product Designer. I left law behind when I found out I could design and build real product.")}
          </p>
          <p className="qs-bio qs-bio-2">
            {t("Leio mangá desde criança, e é de lá que vem o jeito de organizar este portfólio: capítulo, página, respiro. Levo cada projeto do protótipo ao ar, e quando o prazo aperta eu implemento.",
               "I've read manga since I was a kid, and that's where the shape of this portfolio comes from: chapters, pages, breathing room. I take every project from prototype to live, and when the deadline bites, I implement it myself.")}
          </p>
          <div className="qs-nums">
            {nums.map((x, i) => (
              <div key={i} style={{ transitionDelay: (140 + i * 110) + "ms" }}>
                <b className="qs-n">{x.n}</b>
                <span className="qs-nl">{x.l}</span>
              </div>
            ))}
          </div>
          {/* "Saiba mais" no lugar de "Ver posfacio": o rotulo antigo pedia
              que o visitante ja' soubesse o que e' um posfacio pra querer
              clicar. Mesmo destino, porta mais larga. */}
          <a className="btn btn-seta" href="#" onClick={(e) => { e.preventDefault(); onSobre(); }}>
            <span className="arr" aria-hidden="true">→</span> {t("Saiba mais sobre mim", "More about me")}
          </a>
        </div>

        {/* O arquivo era um PNG de 400x400 (foto de perfil de rede social)
            e a caixa chega a 516x645 CSS: em tela de densidade 2 o browser
            esticava ~3,2x, e com `cover` a partir de fonte quadrada só uns
            320x400px reais preenchiam tudo aquilo. Não há original maior.
            O que dá pra fazer sem inventar detalhe: ampliar por Lanczos na
            resolução exata que a caixa pede e aplicar a nitidez NESSA
            escala, em vez de entregar 400px moles e deixar o browser
            esticar. Medido: nitidez (desvio do laplaciano) 4,80 -> 5,67, e
            o arquivo caiu de 256KB para 101KB em WebP. */}
        <figure className="qs-foto">
          <img src="uploads/gabrielfelix-foto.webp" width="1290" height="1290"
               alt={t("Retrato de Gabriel Felix Barbosa", "Portrait of Gabriel Felix Barbosa")}
               loading="lazy" decoding="async" draggable="false" />
          <span className="qsf-tone" aria-hidden="true"></span>
          <figcaption className="qsf-cap">{AUTOR} · {t("Maringá, PR", "Maringá, Brazil")}</figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ---------- [E2] ONDE ESTOU HOJE ----------
   Um bloco só, simples de propósito: chapa da empresa à esquerda, texto
   à direita. Três formas de desenhar a trajetória embaixo foram
   construídas e rejeitadas (linha do tempo com nós, registro de régua,
   página de quadros de mangá) — todas viravam uma segunda peça
   disputando a seção. A trajetória agora é UMA linha de texto dentro do
   próprio bloco: "Antes daqui: TT&T · Locarmais", com links para as
   páginas das empresas. Informação de apoio com peso de apoio. */
function OndeEstou({ onEmpresa }) {
  const [ref, visto] = useReveal({ threshold: 0.2 });
  const atual = COMPANIES.find((c) => c.atual) || COMPANIES[COMPANIES.length - 1];
  const passadas = COMPANIES.filter((c) => c !== atual);
  return (
    <section className={"ondeestou tem-fundo" + (visto ? " on" : "")} ref={ref}>
      <Fundo kanji="現在" lado="esq" />
      <div className="shell">
        <div className="oe-grid">
          <button type="button" className="oe-chapa" onClick={() => onEmpresa(atual.id)}
                  aria-label={t(`Ver minha história na ${atual.name}`, `See my story at ${atual.name}`)}>
            {atual.capa ? <BrandPlate capa={atual.capa} className="bp-qsc" /> : <CompanyLogo company={atual} kind="qsc" />}
          </button>
          <div className="oe-copy">
            <div className="qk"><span className="qsc-now">{t("Onde estou hoje", "Where I am today")}</span></div>
            <Brush as="h2" className="oe-nome">{atual.name}</Brush>
            <div className="oe-papel">{atual.role} · {atual.period}</div>
            <p className="oe-blurb">{atual.blurb}</p>
            <a className="btn btn-seta" href="#" onClick={(e) => { e.preventDefault(); onEmpresa(atual.id); }}>
              <span className="arr" aria-hidden="true">→</span> {t("Ver minha história aqui", "Read my story here")}
            </a>
            <p className="oe-antes">
              <span className="oe-antes-k">{t("Antes daqui", "Before this")}</span>
              {passadas.map((c) => (
                <a key={c.id} href="#" className="oe-antes-l"
                   onClick={(e) => { e.preventDefault(); onEmpresa(c.id); }}>
                  {c.name} <i>{c.anos}</i>
                </a>
              ))}
            </p>
          </div>
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
              {/* o número saiu: o botão "Bora conversar" logo acima já abre o
                  WhatsApp, e repetir o telefone em texto era o mesmo destino
                  duas vezes na mesma linha */}
              <a className="s" href={CONTATO.linkedin.href} target="_blank" rel="noreferrer">LinkedIn</a>
              <a className="s" href={CONTATO.instagram.href} target="_blank" rel="noreferrer">Instagram</a>
              <a className="s" href={CONTATO.email.href}>{CONTATO.email.display}</a>
            </div>
          </div>
        </div>
        <div className="foot-bottom">
          {/* Só a praça. Quem procura filtra por localização antes de ler,
              então a cidade tem uso; "aberto a remoto" saiu a pedido do
              Gabriel, porque lê como sinal de disponibilidade num
              portfólio público que estampa o empregador atual. Não
              reintroduzir. */}
          <span>{AUTOR} · {VOL} · {t("Maringá, PR", "Maringá, Brazil")}</span>
          <Seal size={34} alt="Selo de Gabriel" />
        </div>
      </div>
    </footer>
  );
}

/* ---------- the assembled cover ---------- */
function Capa({ onOpen, onContact, onSobre, onEmpresa, onRead, lit, onNav, onRapido }) {
  return (
    <main className="home-main" key="home">
      <Splash onRead={onRead} onContact={onContact} onRapido={onRapido} lit={lit} />
      <div className="post-hero">
        <Bite />
        <Diferencial />
        <Sumario onOpen={onOpen} />
        <QuemSou onSobre={onSobre} />
        <OndeEstou onEmpresa={onEmpresa} />
        <Colofao onContact={onContact} onNav={onNav} />
      </div>
    </main>
  );
}

Object.assign(window, { Nav, Splash, Diferencial, Mark, MarkStrip, Sumario, Fundo, ChapterList, ChapterBlock, Bite, OutrasPecas, QuemSou, OndeEstou, Colofao, Capa });
